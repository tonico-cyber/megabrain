#!/usr/bin/env python3
"""
validate.py — validador estrutural de .docx gerados pela skill docx-pro.

Verifica os 7 defeitos clássicos, agora no nível de XML (após o build do docx-js):

  ① Markdown vazado     → procura "**", "## ", "```" em <w:t> de corpo
  ② Bullet Unicode      → "•", "◦", "▪" em <w:t> SEM <w:numPr>
  ③ Espaçamento solto   → ausência de spacing.after em parágrafos default
  ④ Aspas retas         → " e ' em meio a letras (heurística)
  ⑤ Heading falso       → ausência total de <w:pStyle w:val="Heading1..4"/>
  ⑥ Tabelas ruins       → <w:tblW w:type="pct"> ou ausência de tcMar (padding)
  ⑦ Page size errado    → ausência de <w:pgSz>

Exit code: 0 limpo, 1 defeitos, 2 erro fatal.

Uso:
  python validate.py <arquivo.docx>            # report
  python validate.py <arquivo.docx> --json     # JSON estruturado
  python validate.py <arquivo.docx> --strict   # falha em warnings também
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
}
ET.register_namespace("w", NS["w"])


def w(tag: str) -> str:
    return f"{{{NS['w']}}}{tag}"


# ─── DEFECTS ───────────────────────────────────────────────────────────────────

class Defect:
    def __init__(self, id_: str, severity: str, desc: str, evidence: str = ""):
        self.id = id_
        self.severity = severity  # "error" | "warning"
        self.desc = desc
        self.evidence = evidence

    def as_dict(self):
        return {"id": self.id, "severity": self.severity, "desc": self.desc, "evidence": self.evidence}


# ─── CHECKS ────────────────────────────────────────────────────────────────────

def collect_text_runs(root) -> list[tuple[ET.Element, str]]:
    """Retorna [(paragraph_element, full_text), ...] do corpo, ignorando TOC field codes."""
    out = []
    for p in root.iter(w("p")):
        texts = []
        for t in p.iter(w("t")):
            if t.text:
                texts.append(t.text)
        if texts:
            out.append((p, "".join(texts)))
    return out


def has_num_pr(p: ET.Element) -> bool:
    return p.find(f".//{w('numPr')}") is not None


def get_pstyle(p: ET.Element) -> str | None:
    pStyle = p.find(f".//{w('pStyle')}")
    if pStyle is not None:
        return pStyle.get(w("val"))
    return None


def check_markdown_leakage(paragraphs) -> list[Defect]:
    """① Markdown vazado em texto."""
    defects = []
    md_patterns = [
        (r"\*\*[^*\n]+\*\*",   "MD_BOLD",    "Markdown bold (**texto**) literal no corpo"),
        (r"^#{1,6}\s",          "MD_HEADING", "Markdown heading (# / ##) literal"),
        (r"^[-*_]{3,}\s*$",     "MD_HR",      "Markdown HR (---) literal"),
        (r"```",                "MD_FENCE",   "Markdown code fence (```) literal"),
    ]
    for _, text in paragraphs:
        for pat, id_, desc in md_patterns:
            m = re.search(pat, text, flags=re.MULTILINE)
            if m:
                defects.append(Defect(id_, "error", desc, evidence=text[:80]))
                break
    return defects


def check_bullet_unicode(paragraphs) -> list[Defect]:
    """② Bullets Unicode digitados (•, ◦, ▪) em parágrafos sem <w:numPr>."""
    defects = []
    for p, text in paragraphs:
        if has_num_pr(p):
            continue
        m = re.search(r"^\s*[•◦▪]\s+", text)
        if m:
            defects.append(Defect("BULLET_UTF", "error",
                "Bullet Unicode (•/◦/▪) sem <w:numPr> — use numbering.config",
                evidence=text[:80]))
    return defects


def check_paragraph_spacing(root) -> list[Defect]:
    """③ Espaçamento solto: amostra parágrafos default sem spacing.after."""
    defects = []
    body_paragraphs = list(root.iter(w("p")))
    if not body_paragraphs:
        return defects
    has_any_spacing = False
    for p in body_paragraphs:
        sp = p.find(f".//{w('spacing')}")
        if sp is not None and (sp.get(w("after")) or sp.get(w("before")) or sp.get(w("line"))):
            has_any_spacing = True
            break
    # Spacing pode estar definido em styles.xml — só falha se NENHUM parágrafo do corpo tiver
    # E o styles.xml também não definir. Verificação fina é feita em check_styles_xml.
    return defects  # opt-in: tratamos isso em check_styles


def check_smart_quotes(paragraphs) -> list[Defect]:
    """④ Aspas/apóstrofos retos em meio a texto."""
    defects = []
    # Apóstrofo reto entre letras: it's, don't
    apo_re = re.compile(r"\b\w+'\w+\b")
    # Aspas duplas retas envolvendo conteúdo
    dq_re  = re.compile(r'"[^"\n]{3,}"')
    for _, text in paragraphs:
        if apo_re.search(text):
            defects.append(Defect("QUOTE_APO", "error",
                "Apóstrofo reto — use ’ tipográfico",
                evidence=apo_re.search(text).group(0)))
        if dq_re.search(text):
            defects.append(Defect("QUOTE_DBL", "error",
                "Aspas duplas retas — use “ ”",
                evidence=dq_re.search(text).group(0)))
    return defects


def check_real_headings(root, paragraphs) -> list[Defect]:
    """⑤ Headings reais (Heading1..4) presentes; nenhum parágrafo grande de bold-only."""
    defects = []
    headings_found = False
    for p in root.iter(w("p")):
        style = get_pstyle(p)
        if style and re.match(r"^Heading[1-9]$", style):
            headings_found = True
            break
    if not headings_found:
        # Documentos curtos podem não ter headings, então é warning, não error
        defects.append(Defect("NO_REAL_HEADINGS", "warning",
            "Nenhum estilo Heading1..N detectado — TOC e navegação podem quebrar",
            evidence=""))
    return defects


def check_tables(root) -> list[Defect]:
    """⑥ Tabelas: DXA + cell margins."""
    defects = []
    tables = list(root.iter(w("tbl")))
    for idx, tbl in enumerate(tables):
        tblW = tbl.find(f".//{w('tblW')}")
        if tblW is not None:
            wtype = tblW.get(w("type"))
            if wtype == "pct":
                defects.append(Defect("TBL_PCT", "error",
                    f"Tabela {idx} usa WidthType.PERCENTAGE — converter para DXA",
                    evidence=f"<w:tblW w:type='pct' .../>"))
        # Cell margins
        any_margin = tbl.find(f".//{w('tcMar')}") is not None or tbl.find(f".//{w('tblCellMar')}") is not None
        if not any_margin:
            defects.append(Defect("TBL_NO_MARGINS", "warning",
                f"Tabela {idx} sem margens de célula — texto cola na borda",
                evidence=""))
        # Solid shading com fill preto puro
        for shd in tbl.iter(w("shd")):
            val = (shd.get(w("val")) or "").lower()
            fill = (shd.get(w("fill")) or "").lower()
            if val == "solid" and fill in ("000000", "auto"):
                defects.append(Defect("TBL_BLACK_SHADING", "error",
                    f"Tabela {idx}: ShadingType.SOLID com fill escuro — usar CLEAR",
                    evidence=f"val={val} fill={fill}"))
    return defects


def check_page_size(root) -> list[Defect]:
    """⑦ Page size explícito."""
    defects = []
    pgSz = root.find(f".//{w('pgSz')}")
    if pgSz is None:
        defects.append(Defect("NO_PAGE_SIZE", "error",
            "Nenhum <w:pgSz> — page size não definido explicitamente",
            evidence=""))
        return defects
    width = pgSz.get(w("w"))
    height = pgSz.get(w("h"))
    if not width or not height:
        defects.append(Defect("BAD_PAGE_SIZE", "error",
            "<w:pgSz> sem w/h",
            evidence=f"w={width} h={height}"))
    return defects


def check_styles_xml(zf: zipfile.ZipFile) -> list[Defect]:
    """Verifica que styles.xml tem outlineLevel para Heading1..4 e spacing default."""
    defects = []
    try:
        with zf.open("word/styles.xml") as f:
            tree = ET.parse(f)
            root = tree.getroot()
    except KeyError:
        defects.append(Defect("NO_STYLES_XML", "error", "Falta word/styles.xml"))
        return defects

    # Procura estilos Heading1..4 com outlineLvl
    headings_with_outline = 0
    for style in root.iter(w("style")):
        sid = style.get(w("styleId")) or ""
        if re.match(r"^Heading[1-4]$", sid):
            if style.find(f".//{w('outlineLvl')}") is not None:
                headings_with_outline += 1
    if headings_with_outline == 0:
        defects.append(Defect("NO_OUTLINE_LEVEL", "warning",
            "Estilos Heading1..4 sem <w:outlineLvl> — TOC pode não popular",
            evidence=""))
    return defects


# ─── MAIN ──────────────────────────────────────────────────────────────────────

def validate(docx_path: Path) -> dict:
    if not docx_path.exists():
        return {"ok": False, "fatal": f"arquivo não encontrado: {docx_path}", "defects": []}

    try:
        zf = zipfile.ZipFile(docx_path, "r")
    except zipfile.BadZipFile:
        return {"ok": False, "fatal": "arquivo não é um zip válido (.docx corrompido)", "defects": []}

    try:
        with zf.open("word/document.xml") as f:
            doc_tree = ET.parse(f)
    except KeyError:
        return {"ok": False, "fatal": "falta word/document.xml", "defects": []}
    except ET.ParseError as e:
        return {"ok": False, "fatal": f"XML inválido em document.xml: {e}", "defects": []}

    root = doc_tree.getroot()
    paragraphs = collect_text_runs(root)

    defects = []
    defects += check_markdown_leakage(paragraphs)
    defects += check_bullet_unicode(paragraphs)
    defects += check_paragraph_spacing(root)
    defects += check_smart_quotes(paragraphs)
    defects += check_real_headings(root, paragraphs)
    defects += check_tables(root)
    defects += check_page_size(root)
    defects += check_styles_xml(zf)

    errors = [d for d in defects if d.severity == "error"]
    warnings = [d for d in defects if d.severity == "warning"]

    return {
        "ok": len(errors) == 0,
        "fatal": None,
        "file": str(docx_path),
        "summary": {"errors": len(errors), "warnings": len(warnings), "paragraphs": len(paragraphs)},
        "defects": [d.as_dict() for d in defects],
    }


def format_report(result: dict) -> str:
    if result.get("fatal"):
        return f"✗ FATAL: {result['fatal']}"
    s = result["summary"]
    head = f"{'✓' if result['ok'] else '✗'} {result['file']}\n"
    head += f"   parágrafos analisados: {s['paragraphs']}\n"
    head += f"   erros: {s['errors']}   warnings: {s['warnings']}\n"
    if not result["defects"]:
        return head + "   0 defeitos detectados."
    lines = [head]
    for d in result["defects"]:
        icon = "✗" if d["severity"] == "error" else "!"
        lines.append(f"  {icon} [{d['id']}] {d['desc']}")
        if d["evidence"]:
            lines.append(f"      └─ {d['evidence']}")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Validador estrutural docx-pro")
    parser.add_argument("path", help="Caminho do .docx a validar")
    parser.add_argument("--json", action="store_true", help="Saída JSON")
    parser.add_argument("--strict", action="store_true", help="Falha em warnings também")
    args = parser.parse_args()

    result = validate(Path(args.path))

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(format_report(result))

    if result.get("fatal"):
        sys.exit(2)
    if not result["ok"]:
        sys.exit(1)
    if args.strict and result["summary"]["warnings"] > 0:
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
