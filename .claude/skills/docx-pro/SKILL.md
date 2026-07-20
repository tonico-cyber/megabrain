---
name: docx-pro
description: Use SEMPRE que o usuário pedir um documento .docx, Word, relatório, proposta, briefing, memo, manual, e-book, playbook, contrato ou qualquer entregável formal em formato Word. Use também quando o usuário citar "docx", "word", "relatório executivo", "proposta comercial", "briefing de criativo" — mesmo sem explicitar "gere um arquivo". Gera .docx de qualidade tipográfica profissional via docx-js, bloqueando estruturalmente os 7 defeitos clássicos de geração por LLM (markdown vazado, bullets Unicode, espaçamento solto, aspas retas, headings falsos, tabelas quebradas, page size errado). Valida automaticamente antes de entregar.
---

# docx-pro — Gerador de .docx Profissional

> **Promessa de blackbox:** o usuário descreve o conteúdo → você devolve `.docx` aberto direto no Google Docs e Word sem retrabalho.

A skill substitui geração ingênua por um pipeline de 5 fases com gates automáticos. Stack: `docx-js` (Node), validador estrutural em Python. Nunca use `python-docx` (renderiza mal listas e tabelas no Google Docs) nem `pandoc` para gerar.

## Fluxo de invocação (resumido)

1. Ler este `SKILL.md` antes de qualquer outra coisa.
2. Rodar **Fase 1** (lint do input do usuário) → AST limpa em JSON.
3. Confirmar template e page size se o usuário não especificou.
4. **Fases 2–4**: escolher template, definir página, gerar via docx-js.
5. **Fase 5 (gate)**: rodar `validate.py` + `lint-content.js --check-docx`. Não entregar sem exit code 0.
6. Reportar **confidence score** ao usuário.

---

## 1. REGRAS INVIOLÁVEIS (PROIBIÇÕES)

Estas 8 proibições são bloqueadas por construção em `scripts/generate.js`. Nunca contorne — se o caso parece exigir contorno, leia de novo o porquê.

### ❌ 1.1 Proibido inserir `\n` em strings de texto
Cada quebra de linha é um `Paragraph` separado. `\n` dentro de um `TextRun` vira espaço ou caracter literal — não quebra parágrafo visualmente.

```js
// ❌ ERRADO
new TextRun({ text: "Linha 1\nLinha 2" })

// ✅ CORRETO
new Paragraph({ children: [new TextRun({ text: "Linha 1" })] }),
new Paragraph({ children: [new TextRun({ text: "Linha 2" })] }),
```

### ❌ 1.2 Proibido bullets Unicode (`•`, `•`, `-`, `*`) como texto
Bullets digitados não são listas — não viram TOC, não indentam, não renumeram. Use `numbering.config` com `LevelFormat.BULLET`.

```js
// ❌ ERRADO
new Paragraph({ children: [new TextRun({ text: "• Item 1" })] })

// ✅ CORRETO — definido uma vez em buildNumberingConfig()
new Paragraph({
  numbering: { reference: "docx-pro-bullet", level: 0 },
  children: [new TextRun({ text: "Item 1" })],
})
```

### ❌ 1.3 Proibido sintaxe Markdown no conteúdo final (`**bold**`, `# H1`, `---`, ` ``` `)
Markdown precisa ser **parseado e convertido** antes da geração docx-js. `lint-content.js --parse` faz isso, devolvendo AST.

```js
// ❌ ERRADO
new TextRun({ text: "**importante**" })

// ✅ CORRETO
new TextRun({ text: "importante", bold: true })
```

### ❌ 1.4 Proibido aspas retas — sempre smart quotes
Documento profissional usa tipografia. `applySmartQuotes()` é chamado em **todo** `buildRun()` em `generate.js`.

```
" → “ ”   (par a par, abertura/fechamento)
' → ’    (apóstrofo)
```

### ❌ 1.5 Proibido `WidthType.PERCENTAGE` em tabelas
Google Docs renderiza tabelas em porcentagem com larguras imprevisíveis e bordas falhas. Use `WidthType.DXA` com `columnWidths` somando exatamente à largura útil da página.

```js
// ❌ ERRADO
new TableCell({ width: { size: 33, type: WidthType.PERCENTAGE } })

// ✅ CORRETO — dual width (tabela + célula em DXA)
new Table({
  width: { size: 9000, type: WidthType.DXA },
  columnWidths: [3000, 3000, 3000],
  rows: [...],
})
// + cada TableCell com width: { size: 3000, type: WidthType.DXA }
```

### ❌ 1.6 Proibido `ShadingType.SOLID` — sempre `CLEAR`
`SOLID` com `fill: "auto"` ou hex escuro renderiza fundo preto sólido em alguns leitores. `CLEAR` com `fill: "<hex>"` e `color: "auto"` dá fundo limpo.

```js
// ❌ ERRADO
shading: { type: ShadingType.SOLID, fill: "auto", color: "FFFFFF" }

// ✅ CORRETO
shading: { type: ShadingType.CLEAR, fill: "E8EEF7", color: "auto" }
```

### ❌ 1.7 Proibido simular heading com `bold: true, size: 32`
Bold grande não é heading — não vira TOC, não exporta para outline, não é navegável no painel de documento. Use `HeadingLevel.HEADING_N` real, definido em `styles.heading1..4` com `outlineLevel` no estilo (essencial para o TOC popular).

```js
// ❌ ERRADO
new Paragraph({ children: [new TextRun({ text: "Capítulo 1", bold: true, size: 32 })] })

// ✅ CORRETO
new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text: "Capítulo 1" })],
})
```

### ❌ 1.8 Proibido entregar sem rodar a validação
O gate da Fase 5 é não-negociável. Se `validate.py` retornar exit code ≠ 0, conserte e revalide antes de entregar. **Reportar score ao usuário** mesmo quando passa.

---

## 2. PIPELINE DE GERAÇÃO (5 FASES, COM GATES)

### Fase 1 — Sanitização do conteúdo-fonte

Antes de tocar em docx-js, normalize o input. O usuário quase sempre manda texto com markdown, aspas retas, bullets Unicode, espaçamento solto. Rodar:

```bash
node scripts/lint-content.js --parse <input.md> > /tmp/ast.json
```

O parser detecta e converte:

| Input | Convertido em |
|------|--------------|
| `**texto**` | `Run({ bold: true })` |
| `*texto*` | `Run({ italics: true })` |
| `# `, `## `, `### `, `#### ` | `HeadingLevel.HEADING_1..4` |
| `- item`, `* item`, `1. item` | `numbering.reference` (bullet/number) |
| `---`, `***` | bloco `hr` → paragraph border-bottom |
| ` ```bloco``` ` | bloco `code` (Consolas + shading cinza) |
| `"texto"`, `it's` | `“texto”`, `it’s` |
| `\n\n\n+` | normaliza para `\n\n` |
| 3+ espaços | colapsa |

**Output:** AST JSON estruturada (não markdown). Se o input for já estruturado (lista de seções fornecida pelo usuário), monte a AST diretamente — sem parser intermediário.

**Auditoria do input** (opcional, antes do parse):
```bash
node scripts/lint-content.js --check-text <input.md>
```
Lista os defeitos do texto-fonte. Útil para mostrar ao usuário o que será corrigido.

### Fase 2 — Decisão de template

| Tipo solicitado | Template |
|---|---|
| relatório / report / análise | `templates/report.js` |
| proposta / orçamento | `templates/proposal.js` |
| briefing / brief / creative | `templates/briefing.js` |
| manual / e-book / playbook / guia | `templates/ebook.js` |
| **não especificado** | perguntar ou default = `report.js` |

Cada template carrega paleta, fonte e flags (cover, TOC) próprios. Para personalização, passe overrides em `meta`.

### Fase 3 — Propriedades de página

| Item | Default | Override |
|------|---------|----------|
| Page size | `A4` (11906 × 16838 DXA) | `LETTER` para US, `LEGAL` se solicitado |
| Margens | 1440 DXA (1 polegada) em todos os lados | passe `pageSize` custom |
| Fonte default | `Aptos` (`Calibri` em proposal, `Inter` em briefing) | qualquer fonte instalada |
| Tamanho base | 22 half-points (11pt) | — |

Se o usuário não disse, **pergunte** (US Letter vs A4) só quando o contexto for ambíguo. Brasil = A4 sempre. Cliente americano = Letter.

### Fase 4 — Geração via docx-js

Use a CLI do `generate.js`:

```bash
cat /tmp/ast.json | node scripts/generate.js \
  --out /tmp/output.docx \
  --template report \
  --title "Relatório Q4 2026" \
  --subtitle "Performance de campanhas Meta" \
  --author "André Xavier" \
  --date "2026-05-13" \
  --page-size A4
```

Ou programaticamente:

```js
const tpl = require("./templates/report.js");
const { writeDocx } = require("./scripts/generate.js");
const doc = tpl({ ast, meta: { title, subtitle, author, date }, pageSize: "A4" });
await writeDocx(doc, "out.docx");
```

### Fase 5 — Validação automática (GATE NÃO-NEGOCIÁVEL)

```bash
python3 scripts/validate.py /tmp/output.docx
node scripts/lint-content.js --check-docx /tmp/output.docx
```

Se qualquer um falhar (exit ≠ 0):
1. **Não entregue.**
2. Leia o defeito reportado.
3. Conserte na fase deficiente (volte para Fase 1 se for input sujo, Fase 4 se for código de geração).
4. Repita até passar.

---

## 3. CONFIDENCE GATE (0.0–1.0, threshold 0.80)

Antes de declarar pronto, calcule:

| Critério | Peso | Verificação |
|---|---|---|
| `validate.py` passou (exit 0) | 0.30 | gate principal |
| `lint-content.js --check-docx` passou | 0.30 | nenhum defeito residual no texto |
| Estilos Heading1..4 reais (não bold simulado) | 0.15 | `validate.py` checa via `styles.xml` |
| Tabelas com DXA + dual width | 0.10 | `validate.py` rejeita PERCENTAGE |
| Smart quotes aplicadas em todos os runs | 0.10 | `validate.py` rejeita aspas retas |
| Listas via `numbering.config` | 0.05 | `validate.py` rejeita bullets-as-text |

**Threshold 0.80.** Se score < 0.80 → identifique fragilidade, refaça a fase deficiente, revalide. **Reporte score ao usuário no formato:** `Confidence: 0.95 (validate ✓, lint ✓, styles ✓, tables ✓, quotes ✓, lists ✓)`.

---

## 4. CHECKLIST DE QA VISUAL (opcional, recomendado em entregas críticas)

Após geração, sugira ao usuário:

- [ ] Abrir no **Google Docs** — tabelas têm bordas e padding corretos?
- [ ] Painel de navegação (Ctrl+F → H no Docs / Visualizar → Estrutura no Word) mostra hierarquia de headings?
- [ ] Nenhum `**`, `##`, `---`, `•` aparece como texto literal?
- [ ] Aspas e apóstrofos tipográficos em todo o documento?
- [ ] Espaçamento entre parágrafos consistente?
- [ ] Sumário (TOC) atualiza ao clicar com botão direito → "Atualizar campos"?

---

## 5. TEMPLATES — ESPECIFICAÇÕES

Todos os templates herdam de `buildDocument()` em `scripts/generate.js` e configuram:

- Cover page (título grande, subtítulo itálico, divisor colorido, autor, data)
- TOC automático com `headingStyleRange: "1-3"` (capturado pelo Word/Docs)
- Header com subtítulo à direita; footer com título + paginação `X / Y` centralizada
- Estilos Heading1..4 com `outlineLevel` calibrado para TOC funcionar
- Paleta única hex por template

| Template | Accent | Fonte | TOC? | Caso de uso |
|---|---|---|---|---|
| `report.js` | `#1F3A5F` (azul-petróleo) | Aptos | ✓ | Relatórios executivos, análises de campanha |
| `proposal.js` | `#1F5F3A` (verde corporativo) | Calibri | ✓ | Propostas comerciais, orçamentos |
| `briefing.js` | `#C8541A` (laranja queimado) | Inter | ✗ | Briefings de criativo, 1–3 páginas |
| `ebook.js` | `#4A2B5C` (roxo editorial) | Aptos | ✓ | Manuais, playbooks, e-books |

Para criar variantes (cliente-específicas), copie o template e ajuste `palette` + `fontFamily` — nunca toque em `generate.js`, que é o motor compartilhado.

---

## 6. EXEMPLO MÍNIMO COMPLETO

Snippet rodável standalone (~80 linhas) que gera doc com cover + 2 headings + lista + tabela + footer paginado. Use como cola quando precisar de algo fora dos templates:

```js
#!/usr/bin/env node
// generate-minimal.js — gera um .docx de referência rápido.
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Header, Footer, PageNumber, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, LevelFormat, PageBreak,
} = require("docx");

const accent = "1F3A5F";
const font = "Aptos";
const pageSize = { width: 11906, height: 16838 }; // A4
const margin = { top: 1440, right: 1440, bottom: 1440, left: 1440 };
const contentW = pageSize.width - margin.left - margin.right;

const numbering = {
  config: [{
    reference: "bul",
    levels: [{
      level: 0, format: LevelFormat.BULLET, text: "•",
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } },
    }],
  }],
};

const styles = {
  default: {
    document: { run: { font, size: 22 }, paragraph: { spacing: { after: 120, line: 312 } } },
    heading1: { run: { font, size: 40, bold: true, color: accent },
                paragraph: { spacing: { before: 480, after: 240 }, outlineLevel: 0 } },
    heading2: { run: { font, size: 32, bold: true, color: accent },
                paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 1 } },
  },
};

const cover = [
  new Paragraph({ spacing: { before: 2400 }, children: [
    new TextRun({ text: "Título do Documento", bold: true, size: 64, color: accent, font }),
  ]}),
  new Paragraph({ children: [new PageBreak()] }),
];

const cols = 3;
const colW = Math.floor(contentW / cols);
const border = { style: BorderStyle.SINGLE, size: 4, color: "B0B0B0" };
const cellMar = { top: 80, bottom: 80, left: 120, right: 120 };
const table = new Table({
  width: { size: contentW, type: WidthType.DXA },
  columnWidths: [colW, colW, colW],
  borders: { top: border, bottom: border, left: border, right: border,
             insideHorizontal: border, insideVertical: border },
  rows: [
    new TableRow({ tableHeader: true, children: ["Métrica", "Valor", "Δ"].map(h =>
      new TableCell({
        width: { size: colW, type: WidthType.DXA }, margins: cellMar,
        shading: { type: ShadingType.CLEAR, fill: "E8EEF7", color: "auto" },
        children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: accent, font })] })],
      }))
    }),
    new TableRow({ children: ["CTR", "2,4%", "+0,3 p.p."].map(c =>
      new TableCell({ width: { size: colW, type: WidthType.DXA }, margins: cellMar,
        children: [new Paragraph({ children: [new TextRun({ text: c, font })] })] }))
    }),
  ],
});

const doc = new Document({
  styles, numbering,
  features: { updateFields: true },
  sections: [{
    properties: { page: { size: pageSize, margin } },
    headers: { default: new Header({ children: [new Paragraph({ children: [
      new TextRun({ text: "Subtítulo", size: 18, color: "777777", italics: true, font })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER, children: [
        new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "777777" }),
        new TextRun({ text: " / ", size: 18, color: "777777" }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: "777777" }),
      ]})] }) },
    children: [
      ...cover,
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Resumo" })] }),
      new Paragraph({ children: [new TextRun({ text: "Texto introdutório com aspas “tipográficas” e apóstrofo ’s." })] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Itens" })] }),
      new Paragraph({ numbering: { reference: "bul", level: 0 },
        children: [new TextRun({ text: "Primeiro item da lista" })] }),
      new Paragraph({ numbering: { reference: "bul", level: 0 },
        children: [new TextRun({ text: "Segundo item da lista" })] }),
      table,
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("minimal.docx", buf);
  console.log("✓ minimal.docx");
});
```

Salve como `generate-minimal.js`, rode `node generate-minimal.js` e abra `minimal.docx`. Use como template mental quando precisar improvisar fora do pipeline padrão.

---

## Anexos

- **`scripts/lint-content.js`** — parser markdown → AST + auditor pré/pós (CLI: `--parse`, `--check-text`, `--check-docx`).
- **`scripts/generate.js`** — núcleo docx-js (builders + writer + CLI).
- **`scripts/validate.py`** — validador estrutural OOXML (CLI: `python3 validate.py <file.docx>`).
- **`templates/*.js`** — 4 templates configurados.
- **`examples/golden-output.docx`** — referência visual.

## Dependência

```bash
npm install -g docx          # docx-js (Node)
python3 --version            # 3.8+
```

Em caso de `Cannot find module 'docx'`, rode `npm install -g docx` antes de gerar.
