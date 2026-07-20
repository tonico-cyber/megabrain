# Skills-fonte do /copymf

Fontes das 5 skills que o processo `/copymf` orquestra: as 4 skills de copywriting do
**Nicolas Toigo** (obtidas como `.skill`) + a skill **padrão da casa** (`meufluxo-copy-standard`),
sintetizada a partir do swipe interno. Arquivadas aqui para reprodutibilidade.

## Arquivos

| `.skill` (instalável) | Nome interno | `extracted/` (legível) | Papel no /copymf |
|---|---|---|---|
| `VSL-Copywriter.skill` | `vsl-copywriter-br` | `extracted/vsl-copywriter-br.md` | Produção — VSL (RMBC + Bencivenga) |
| `ADS-Copywriter.skill` | `ad-strategist` | `extracted/ad-strategist.md` | Produção — Anúncios (C.A.S.H.) |
| — (nativa da casa) | `meufluxo-copy-standard` | `extracted/meufluxo-copy-standard.md` | **Padrão da casa** — DNA das vencedoras + régua eliminatória (priming + Gate 1) |
| `CopyChief-Reviewer.skill` | `ad-copy-reviewer` | `extracted/ad-copy-reviewer.md` | Gate 1 — lente de apoio (Luke Iha) |
| `Copywriter-GoogleADS.skill` | `google-ads-reviewer` | `extracted/google-ads-reviewer.md` | Gate 2 — compliance Google/YT |

- Os `.skill` são ZIPs contendo `<nome-interno>/SKILL.md`.
- A pasta `extracted/` tem os mesmos `SKILL.md` em markdown puro, para leitura sem descompactar.
- `meufluxo-copy-standard` não tem `.skill`: a fonte É o `extracted/meufluxo-copy-standard.md`
  (sintetizada em 2026-07 a partir de `../swipe-file/` + dissecações em `../swipe-file/analise/`).

## Reinstalar as skills (se ~/.claude/skills/ for perdido)

```bash
cd ~/.claude/skills
unzip -o "<repo>/copymf/skills-source/VSL-Copywriter.skill"
unzip -o "<repo>/copymf/skills-source/ADS-Copywriter.skill"
unzip -o "<repo>/copymf/skills-source/CopyChief-Reviewer.skill"
unzip -o "<repo>/copymf/skills-source/Copywriter-GoogleADS.skill"
mkdir -p meufluxo-copy-standard
cp "<repo>/copymf/skills-source/extracted/meufluxo-copy-standard.md" meufluxo-copy-standard/SKILL.md
```

Cada ZIP cria a pasta com o nome interno correto. Verifique com:
```bash
for d in vsl-copywriter-br ad-strategist meufluxo-copy-standard ad-copy-reviewer google-ads-reviewer; do
  grep -m1 '^name:' ~/.claude/skills/$d/SKILL.md
done
```

> Os `extracted/*.md` são para leitura — exceto o da `meufluxo-copy-standard`, que é a própria fonte.
