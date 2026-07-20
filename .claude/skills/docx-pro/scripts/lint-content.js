#!/usr/bin/env node
/**
 * lint-content.js — detector e conversor dos 7 defeitos clássicos de LLM-DOCX.
 *
 * Modos:
 *   node lint-content.js --parse <input.md|->        Lê stdin/arquivo e devolve AST JSON.
 *   node lint-content.js --check-text <input.txt>    Audita texto bruto: lista defeitos.
 *   node lint-content.js --check-docx <out.docx>     Re-extrai texto do .docx e procura defeitos residuais.
 *
 * AST resultante (Phase 1 do pipeline):
 *   { blocks: [ { type, ... }, ... ] }
 *
 * Tipos de bloco:
 *   { type: "heading",  level: 1|2|3|4, runs: [Run] }
 *   { type: "paragraph", runs: [Run] }
 *   { type: "list",     style: "bullet"|"number", items: [ { runs: [Run], level: 0 } ] }
 *   { type: "code",     text: string }
 *   { type: "hr" }
 *   { type: "table",    header: [string], rows: [[string]] }
 *
 * Run = { text, bold?, italics?, code? }
 *
 * Saídas de --check-* têm exit code 0 (limpo) ou 1 (defeitos encontrados).
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ──────────────────────────────────────────────────────────────────────────────
// Smart quotes: substituição tipográfica conservadora.
// Apóstrofo curvo: ' → ’    Aspas: " → “ ”  (abertura/fechamento por contexto)
// ──────────────────────────────────────────────────────────────────────────────
function applySmartQuotes(s) {
  // Apóstrofo entre letras (it's, don't): ' → ’
  s = s.replace(/(\p{L})'(\p{L})/gu, "$1’$2");
  // Apóstrofo final (kids' books): letra + ' + (espaço|fim|pontuação)
  s = s.replace(/(\p{L})'(?=\s|$|[.,;:!?)])/gu, "$1’");
  // Aspas duplas: par a par, da esquerda pra direita
  let out = "";
  let openDouble = true;
  for (const ch of s) {
    if (ch === '"') {
      out += openDouble ? "“" : "”";
      openDouble = !openDouble;
    } else {
      out += ch;
    }
  }
  // Apóstrofo no início de palavra (' tis) → abertura
  out = out.replace(/(^|\s)'(?=\p{L})/gu, "$1‘");
  // Resíduo: apóstrofos retos restantes viram apóstrofo tipográfico
  out = out.replace(/'/g, "’");
  return out;
}

// ──────────────────────────────────────────────────────────────────────────────
// Parse de inline markdown → runs.
// Suporta **bold**, *italic* (não confunde com bullet), `code`.
// ──────────────────────────────────────────────────────────────────────────────
function parseInline(text) {
  const runs = [];
  let i = 0;
  let buf = "";
  let bold = false;
  let italics = false;

  const flush = () => {
    if (buf.length > 0) {
      runs.push({ text: applySmartQuotes(buf), bold, italics });
      buf = "";
    }
  };

  while (i < text.length) {
    // `code`
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        flush();
        runs.push({ text: text.slice(i + 1, end), code: true });
        i = end + 1;
        continue;
      }
    }
    // **bold**
    if (text[i] === "*" && text[i + 1] === "*") {
      flush();
      bold = !bold;
      i += 2;
      continue;
    }
    // *italic* — exige letra/digito vizinho, evita confundir com lista
    if (text[i] === "*" && /[^\s*]/.test(text[i + 1] || "")) {
      flush();
      italics = !italics;
      i += 1;
      continue;
    }
    buf += text[i];
    i += 1;
  }
  flush();
  if (runs.length === 0) runs.push({ text: "" });
  return runs;
}

// ──────────────────────────────────────────────────────────────────────────────
// Parser principal: linha-a-linha. Markdown subset realista.
// ──────────────────────────────────────────────────────────────────────────────
function parseMarkdown(src) {
  // Normaliza CRLF, tabs, triplos espaços, e remove zero-width
  src = src.replace(/\r\n?/g, "\n").replace(/\t/g, "    ").replace(/​/g, "");
  // Comprime 3+ blank lines para 2
  src = src.replace(/\n{3,}/g, "\n\n");

  const lines = src.split("\n");
  const blocks = [];
  let i = 0;

  const bulletRe = /^(\s*)([-*+•◦▪])\s+(.*)$/;
  const numRe = /^(\s*)(\d+)[\.\)]\s+(.*)$/;
  const headingRe = /^(#{1,4})\s+(.*?)\s*#*\s*$/;
  const hrRe = /^\s*([-*_])\1{2,}\s*$/;
  const codeFenceRe = /^```/;
  const tableRowRe = /^\s*\|(.+)\|\s*$/;
  const tableSepRe = /^\s*\|?\s*:?-{3,}:?(\s*\|\s*:?-{3,}:?)+\s*\|?\s*$/;

  while (i < lines.length) {
    const line = lines[i];

    // blank
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    // fenced code
    if (codeFenceRe.test(line)) {
      const buf = [];
      i++;
      while (i < lines.length && !codeFenceRe.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // pula fence fechando
      blocks.push({ type: "code", text: buf.join("\n") });
      continue;
    }

    // hr (3+ traços ou asteriscos isolados)
    if (hrRe.test(line)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // heading
    const h = headingRe.exec(line);
    if (h) {
      blocks.push({
        type: "heading",
        level: h[1].length,
        runs: parseInline(h[2]),
      });
      i++;
      continue;
    }

    // table (header | sep | rows)
    if (tableRowRe.test(line) && i + 1 < lines.length && tableSepRe.test(lines[i + 1])) {
      const splitRow = (r) =>
        r.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => applySmartQuotes(c.trim()));
      const header = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && tableRowRe.test(lines[i])) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push({ type: "table", header, rows });
      continue;
    }

    // listas (bullet ou numerada)
    if (bulletRe.test(line) || numRe.test(line)) {
      const isBullet = bulletRe.test(line);
      const style = isBullet ? "bullet" : "number";
      const items = [];
      while (
        i < lines.length &&
        (isBullet ? bulletRe.test(lines[i]) : numRe.test(lines[i]))
      ) {
        const m = (isBullet ? bulletRe : numRe).exec(lines[i]);
        const indent = m[1].length;
        const level = Math.min(2, Math.floor(indent / 2));
        items.push({ runs: parseInline(m[3]), level });
        i++;
      }
      blocks.push({ type: "list", style, items });
      continue;
    }

    // parágrafo: junta linhas até linha em branco ou início de outro bloco
    const buf = [line];
    i++;
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !headingRe.test(lines[i]) &&
      !bulletRe.test(lines[i]) &&
      !numRe.test(lines[i]) &&
      !hrRe.test(lines[i]) &&
      !codeFenceRe.test(lines[i]) &&
      !(tableRowRe.test(lines[i]) && i + 1 < lines.length && tableSepRe.test(lines[i + 1]))
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", runs: parseInline(buf.join(" ")) });
  }

  return { blocks };
}

// ──────────────────────────────────────────────────────────────────────────────
// Auditor: lista defeitos em texto bruto (pré-conversão) ou em DOCX (pós-geração).
// ──────────────────────────────────────────────────────────────────────────────
const DEFECT_RULES = [
  { id: "MD_BOLD",      re: /\*\*[^*\n]+\*\*/,       desc: "Markdown bold (**texto**) não convertido" },
  { id: "MD_HEADING",   re: /^#{1,6}\s/m,            desc: "Markdown heading (# / ##) literal" },
  { id: "MD_HR",        re: /^[-*_]{3,}\s*$/m,       desc: "Markdown horizontal rule (---) literal" },
  { id: "MD_FENCE",     re: /```/,                   desc: "Markdown code fence (```) literal" },
  { id: "BULLET_UTF",   re: /^[\s>]*[•◦▪]\s/m,       desc: "Bullet Unicode digitado como texto (•, ◦, ▪)" },
  { id: "QUOTE_STRAIGHT_DBL", re: /"[^"\n]{3,}"/,    desc: "Aspas duplas retas — usar “ ” tipográficas" },
  { id: "QUOTE_STRAIGHT_APO", re: /\b\w+'\w+\b/,     desc: "Apóstrofo reto — usar ’ tipográfico" },
  { id: "TRIPLE_SPACE", re: /   +/,                  desc: "3+ espaços consecutivos" },
  { id: "TRIPLE_NL",    re: /\n{3,}/,                desc: "3+ quebras de linha consecutivas" },
  { id: "LITERAL_NL",   re: /\\n[a-zA-Z]/,           desc: "Sequência \\n literal escapada" },
];

function auditText(text) {
  const found = [];
  for (const rule of DEFECT_RULES) {
    const m = rule.re.exec(text);
    if (m) {
      const idx = m.index;
      const before = text.slice(Math.max(0, idx - 20), idx);
      const after = text.slice(idx, Math.min(text.length, idx + 40));
      found.push({ id: rule.id, desc: rule.desc, sample: (before + "▶" + after).replace(/\n/g, "⏎") });
    }
  }
  return found;
}

function extractDocxText(docxPath) {
  // Lê word/document.xml direto do ZIP via unzip -p, depois faz strip de tags.
  const xml = execSync(`unzip -p "${docxPath}" word/document.xml`, { encoding: "utf8" });
  // Junta <w:t> ... </w:t> e ignora parágrafos sem conteúdo textual
  // (espaçadores estruturais de cover/TOC criam parágrafos vazios legítimos —
  // contá-los como newlines geraria falso positivo TRIPLE_NL).
  const paragraphs = xml.split(/<w:p[\s>]/)
    .map((p) => {
      const texts = [];
      const re = /<w:t[^>]*>([^<]*)<\/w:t>/g;
      let m;
      while ((m = re.exec(p)) !== null) texts.push(m[1]);
      return texts.join("");
    })
    .filter((t) => t.length > 0);
  return paragraphs.join("\n").replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

// ──────────────────────────────────────────────────────────────────────────────
// CLI
// ──────────────────────────────────────────────────────────────────────────────
function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd === "--parse") {
    const target = args[1];
    const src = target && target !== "-" ? fs.readFileSync(target, "utf8") : fs.readFileSync(0, "utf8");
    const ast = parseMarkdown(src);
    process.stdout.write(JSON.stringify(ast, null, 2));
    process.exit(0);
  }

  if (cmd === "--check-text") {
    const src = fs.readFileSync(args[1], "utf8");
    const defects = auditText(src);
    if (defects.length === 0) {
      console.log("✓ texto limpo (0 defeitos)");
      process.exit(0);
    }
    console.error(`✗ ${defects.length} defeito(s) no texto-fonte:`);
    for (const d of defects) console.error(`  [${d.id}] ${d.desc}\n    └─ amostra: ${d.sample}`);
    process.exit(1);
  }

  if (cmd === "--check-docx") {
    const docxPath = args[1];
    if (!fs.existsSync(docxPath)) {
      console.error(`✗ arquivo não encontrado: ${docxPath}`);
      process.exit(2);
    }
    const text = extractDocxText(docxPath);
    const defects = auditText(text);
    if (defects.length === 0) {
      console.log(`✓ ${path.basename(docxPath)} — 0 defeitos residuais no texto`);
      process.exit(0);
    }
    console.error(`✗ ${defects.length} defeito(s) residuais em ${path.basename(docxPath)}:`);
    for (const d of defects) console.error(`  [${d.id}] ${d.desc}\n    └─ amostra: ${d.sample}`);
    process.exit(1);
  }

  console.error("uso:");
  console.error("  lint-content.js --parse <input.md|->        → AST JSON");
  console.error("  lint-content.js --check-text <input.txt>    → audita texto");
  console.error("  lint-content.js --check-docx <out.docx>     → audita .docx pronto");
  process.exit(2);
}

if (require.main === module) main();

module.exports = { parseMarkdown, parseInline, applySmartQuotes, auditText, extractDocxText };
