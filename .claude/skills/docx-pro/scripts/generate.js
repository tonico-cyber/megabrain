#!/usr/bin/env node
/**
 * generate.js — núcleo de geração docx-js, anti-defeitos por construção.
 *
 * USO PROGRAMÁTICO (via templates):
 *   const { buildDocument, AST_TO_DOC } = require("./generate");
 *   const doc = buildDocument({ ast, meta, pageSize, palette, fontFamily });
 *   await writeDocx(doc, "out.docx");
 *
 * USO CLI (one-shot, sem template, AST do stdin):
 *   cat ast.json | node generate.js --out out.docx --template report \
 *       --title "Relatório" --subtitle "..." --author "..." --date "2026-05-13"
 *
 * Estruturalmente bloqueados:
 *   ① Markdown vazado     → parseMarkdown da Phase 1 já consome ** / ## / --- e devolve AST.
 *   ② Bullet Unicode      → usamos numbering.config com LevelFormat.BULLET.
 *   ③ Espaçamento solto   → spacing.before/after em estilos, nunca \n.
 *   ④ Aspas retas         → applySmartQuotes obrigatório em todo run de texto.
 *   ⑤ Heading falso       → HeadingLevel + outlineLevel em estilos.
 *   ⑥ Tabelas ruins       → WidthType.DXA, dual width (col+cell), padding, ShadingType.CLEAR.
 *   ⑦ Page size errado    → pageSize obrigatório no chamador.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageNumber,
  Header,
  Footer,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  LevelFormat,
  TableOfContents,
  StyleLevel,
  PageBreak,
  convertInchesToTwip,
} = require("docx");

const { applySmartQuotes } = require("./lint-content");

// ─── PAGE SIZES ───────────────────────────────────────────────────────────────
const PAGE_SIZES = {
  A4:     { width: 11906, height: 16838 }, // 210 × 297 mm  (Brasil/EU default)
  LETTER: { width: 12240, height: 15840 }, // 8.5 × 11 in   (US default)
  LEGAL:  { width: 12240, height: 20160 },
};

// ─── BULLET / NUMBERING CONFIG (Defeito #2 — bloqueio estrutural) ────────────
function buildNumberingConfig() {
  return {
    config: [
      {
        reference: "docx-pro-bullet",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: "◦",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } },
          },
          {
            level: 2,
            format: LevelFormat.BULLET,
            text: "▪",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 2160, hanging: 360 } } },
          },
        ],
      },
      {
        reference: "docx-pro-number",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
          {
            level: 1,
            format: LevelFormat.LOWER_LETTER,
            text: "%2.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } },
          },
        ],
      },
    ],
  };
}

// ─── STYLES (Defeito #5 — bloqueio estrutural) ───────────────────────────────
function buildStyles({ fontFamily, palette }) {
  const accent = palette?.accent || "1F3A5F";
  const muted  = palette?.muted  || "555555";
  return {
    default: {
      document: {
        run: { font: fontFamily, size: 22 }, // 11pt — half-points
        paragraph: { spacing: { after: 120, line: 312 } },
      },
      heading1: {
        run: { font: fontFamily, size: 40, bold: true, color: accent }, // 20pt
        paragraph: { spacing: { before: 480, after: 240 }, outlineLevel: 0 },
      },
      heading2: {
        run: { font: fontFamily, size: 32, bold: true, color: accent }, // 16pt
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 1 },
      },
      heading3: {
        run: { font: fontFamily, size: 26, bold: true, color: accent }, // 13pt
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 },
      },
      heading4: {
        run: { font: fontFamily, size: 22, bold: true, color: muted },  // 11pt
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 3 },
      },
    },
    paragraphStyles: [
      {
        id: "Subtitle",
        name: "Subtitle",
        basedOn: "Normal",
        run: { italics: true, color: muted, size: 26, font: fontFamily },
        paragraph: { spacing: { after: 240 } },
      },
      {
        id: "Caption",
        name: "Caption",
        basedOn: "Normal",
        run: { italics: true, color: muted, size: 18, font: fontFamily },
      },
      {
        id: "Code",
        name: "Code",
        basedOn: "Normal",
        run: { font: "Consolas", size: 20 },
        paragraph: { spacing: { before: 120, after: 120 }, indent: { left: 240 } },
      },
    ],
  };
}

// ─── RUN BUILDER (Defeito #4 — smart quotes obrigatório) ─────────────────────
function buildRun(run, fontFamily) {
  const opts = { text: applySmartQuotes(String(run.text ?? "")) };
  if (run.bold)    opts.bold = true;
  if (run.italics) opts.italics = true;
  if (run.code) {
    opts.font = "Consolas";
    opts.size = 20;
  } else if (fontFamily) {
    opts.font = fontFamily;
  }
  return new TextRun(opts);
}

// ─── BLOCK BUILDER ────────────────────────────────────────────────────────────
function blockToParagraphs(block, ctx) {
  const { fontFamily, palette } = ctx;
  const accent = palette?.accent || "1F3A5F";

  if (block.type === "heading") {
    const map = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4];
    return [
      new Paragraph({
        heading: map[Math.min(3, Math.max(0, block.level - 1))],
        children: block.runs.map((r) => buildRun(r, fontFamily)),
      }),
    ];
  }

  if (block.type === "paragraph") {
    return [
      new Paragraph({
        children: block.runs.map((r) => buildRun(r, fontFamily)),
      }),
    ];
  }

  if (block.type === "list") {
    const ref = block.style === "number" ? "docx-pro-number" : "docx-pro-bullet";
    return block.items.map(
      (item) =>
        new Paragraph({
          numbering: { reference: ref, level: item.level || 0 },
          children: item.runs.map((r) => buildRun(r, fontFamily)),
        })
    );
  }

  if (block.type === "code") {
    // Cada linha vira um parágrafo com style "Code".
    // Smart quotes aplicadas mesmo em código — DOCX não roda código, e usuários
    // costumam usar code-block como "monospace prose" (caminhos, nomes de painéis).
    const lines = block.text.split("\n");
    return lines.map(
      (line) =>
        new Paragraph({
          style: "Code",
          shading: { type: ShadingType.CLEAR, fill: "F4F4F4", color: "auto" },
          children: [new TextRun({ text: applySmartQuotes(line), font: "Consolas", size: 20 })],
        })
    );
  }

  if (block.type === "hr") {
    return [
      new Paragraph({
        border: { bottom: { color: accent, space: 1, style: BorderStyle.SINGLE, size: 6 } },
        spacing: { before: 120, after: 240 },
        children: [],
      }),
    ];
  }

  if (block.type === "table") {
    return [buildTable(block, ctx), new Paragraph({ spacing: { after: 120 }, children: [] })];
  }

  return [];
}

// ─── TABLE BUILDER (Defeito #6 — DXA + dual width + padding + CLEAR) ─────────
function buildTable(block, ctx) {
  const { fontFamily, palette, pageContentDxa } = ctx;
  const accent = palette?.accent || "1F3A5F";
  const headerFill = palette?.headerFill || "E8EEF7";

  const cols = block.header.length;
  // largura disponível = page width − margens (já passado como pageContentDxa)
  const totalW = pageContentDxa || 9000;
  const colW = Math.floor(totalW / cols);
  const columnWidths = Array(cols).fill(colW);

  const border = { style: BorderStyle.SINGLE, size: 4, color: "B0B0B0" };
  const borders = { top: border, bottom: border, left: border, right: border };
  const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

  const headerRow = new TableRow({
    tableHeader: true,
    children: block.header.map(
      (h) =>
        new TableCell({
          width: { size: colW, type: WidthType.DXA },
          margins: cellMargins,
          shading: { type: ShadingType.CLEAR, fill: headerFill, color: "auto" },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: applySmartQuotes(h), bold: true, font: fontFamily, color: accent }),
              ],
            }),
          ],
        })
    ),
  });

  const bodyRows = block.rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              width: { size: colW, type: WidthType.DXA },
              margins: cellMargins,
              shading: { type: ShadingType.CLEAR, fill: "FFFFFF", color: "auto" },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: applySmartQuotes(cell), font: fontFamily })],
                }),
              ],
            })
        ),
      })
  );

  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    columnWidths,
    borders: {
      top: border, bottom: border, left: border, right: border,
      insideHorizontal: border, insideVertical: border,
    },
    rows: [headerRow, ...bodyRows],
  });
}

// ─── COVER PAGE ───────────────────────────────────────────────────────────────
function buildCover({ title, subtitle, author, date, palette, fontFamily }) {
  const accent = palette?.accent || "1F3A5F";
  const muted  = palette?.muted  || "555555";
  return [
    new Paragraph({ spacing: { before: 2400 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [new TextRun({ text: applySmartQuotes(title), bold: true, size: 64, color: accent, font: fontFamily })],
    }),
    subtitle
      ? new Paragraph({
          spacing: { before: 240 },
          children: [new TextRun({ text: applySmartQuotes(subtitle), italics: true, size: 30, color: muted, font: fontFamily })],
        })
      : null,
    new Paragraph({
      spacing: { before: 720 },
      border: { top: { color: accent, space: 1, style: BorderStyle.SINGLE, size: 6 } },
      children: [],
    }),
    author
      ? new Paragraph({
          spacing: { before: 240 },
          children: [new TextRun({ text: applySmartQuotes(author), size: 22, font: fontFamily })],
        })
      : null,
    date
      ? new Paragraph({
          spacing: { before: 80 },
          children: [new TextRun({ text: applySmartQuotes(date), color: muted, size: 22, font: fontFamily })],
        })
      : null,
    new Paragraph({ children: [new PageBreak()] }),
  ].filter(Boolean);
}

// ─── TOC ──────────────────────────────────────────────────────────────────────
function buildTOC() {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: "Sumário" })],
    }),
    new TableOfContents("Sumário", {
      hyperlink: true,
      headingStyleRange: "1-3",
      stylesWithLevels: [
        new StyleLevel("Heading1", 1),
        new StyleLevel("Heading2", 2),
        new StyleLevel("Heading3", 3),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── HEADER / FOOTER ─────────────────────────────────────────────────────────
function buildFooter({ title, palette, fontFamily }) {
  const muted = palette?.muted || "777777";
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: applySmartQuotes(title || ""), size: 18, color: muted, font: fontFamily }),
          new TextRun({ text: "   ·   ", size: 18, color: muted }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: muted }),
          new TextRun({ text: " / ", size: 18, color: muted }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: muted }),
        ],
      }),
    ],
  });
}

function buildHeader({ subtitle, palette, fontFamily }) {
  const muted = palette?.muted || "777777";
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: applySmartQuotes(subtitle || ""), size: 18, color: muted, italics: true, font: fontFamily })],
      }),
    ],
  });
}

// ─── DOCUMENT ASSEMBLY ────────────────────────────────────────────────────────
function buildDocument({ ast, meta, pageSize, palette, fontFamily, includeCover = true, includeTOC = true }) {
  const size = PAGE_SIZES[pageSize] || PAGE_SIZES.A4;
  const margin = { top: 1440, right: 1440, bottom: 1440, left: 1440 };
  const pageContentDxa = size.width - margin.left - margin.right;
  const font = fontFamily || "Aptos";

  const ctx = { fontFamily: font, palette, pageContentDxa };

  const children = [];
  if (includeCover) children.push(...buildCover({ ...meta, palette, fontFamily: font }));
  if (includeTOC)   children.push(...buildTOC());

  for (const block of ast.blocks) {
    children.push(...blockToParagraphs(block, ctx));
  }

  return new Document({
    creator: meta.author || "docx-pro",
    title: meta.title || "Documento",
    description: meta.subtitle || "",
    styles: buildStyles({ fontFamily: font, palette }),
    numbering: buildNumberingConfig(),
    features: { updateFields: true }, // força recálculo de TOC ao abrir
    sections: [
      {
        properties: { page: { size, margin } },
        headers: { default: buildHeader({ subtitle: meta.subtitle, palette, fontFamily: font }) },
        footers: { default: buildFooter({ title: meta.title, palette, fontFamily: font }) },
        children,
      },
    ],
  });
}

async function writeDocx(doc, outPath) {
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(outPath, buf);
  return outPath;
}

// ─── CLI ENTRYPOINT ───────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const argMap = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) argMap[args[i].slice(2)] = args[i + 1];
  }
  const astJson = fs.readFileSync(0, "utf8");
  const ast = JSON.parse(astJson);
  const templateName = argMap.template || "report";
  const tpl = require(path.join(__dirname, "..", "templates", `${templateName}.js`));
  const doc = tpl({
    ast,
    meta: {
      title:    argMap.title    || "Documento",
      subtitle: argMap.subtitle || "",
      author:   argMap.author   || "",
      date:     argMap.date     || new Date().toISOString().slice(0, 10),
    },
    pageSize: argMap["page-size"] || "A4",
  });
  const out = argMap.out || "output.docx";
  await writeDocx(doc, out);
  console.log(`✓ gerado: ${out}`);
}

module.exports = {
  buildDocument,
  buildCover,
  buildTOC,
  buildFooter,
  buildHeader,
  buildNumberingConfig,
  buildStyles,
  blockToParagraphs,
  buildTable,
  buildRun,
  writeDocx,
  PAGE_SIZES,
};

if (require.main === module) {
  main().catch((e) => {
    console.error("✗ erro:", e.message);
    process.exit(1);
  });
}
