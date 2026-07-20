# Megabrain MeuFluxo

Repositório do processo de copywriting **`/copymf`** do MeuFluxo — o processo Nicolas Toigo,
que orquestra as skills de copy numa sequência (produção → revisão) e persiste o trabalho aqui.
Todo output é em **pt-BR**.

## O processo

| Comando | O que faz | Fonte da metodologia | Workspace | Design docs |
|---|---|---|---|---|
| `/pesquisamf` | **Gate 0 — pesquisa forte (v2)** ANTES da copy: baseline interno (swipe pesa mais) → paga em 3 camadas (keyword → varredura por página → vigília semanal) + orgânica (YT com roteiro/FB/Reddit/IG) → régua (score 0-100 × alinhamento interno → P1-P4) + censo do leilão → **profundidade nos vencedores** (roteiros transcritos/assistidos, funil seguido até o preço, voz do avatar em volume, banco de provas, calibração de promessa) → dossiê de PRODUÇÃO com carimbo APTO/RADAR | Metodologia de spy tools + RMBC/C.A.S.H./régua da casa (ver spec §9b) | [`copymf/pesquisa/`](copymf/pesquisa/) | [spec](docs/superpowers/specs/2026-07-16-pesquisamf-design.md) |
| `/copymf` | Produção (VSL/Anúncio) com priming do swipe (+ dossiê do Gate 0, se houver) → Gate 1 régua de qualidade (reprova até bater) → Gate 2 compliance Google/YT → entrega | [`copymf/skills-source/`](copymf/skills-source/) | [`copymf/`](copymf/) | [spec](docs/superpowers/specs/2026-06-24-copymf-workflow-design.md) · [plano](docs/superpowers/plans/2026-06-24-copymf.md) |

## Estrutura

```
Megabrain MeuFluxo/
├── README.md              # este mapa
├── .claude/               # comandos (/copymf, /pesquisamf) e skills — carregam ao abrir o projeto
├── docs/
│   └── superpowers/
│       ├── specs/         # specs de design
│       └── plans/         # planos de implementação
└── copymf/                # WORKSPACE do /copymf
    ├── skills-source/     #   FONTE — skills do Nicolas + padrão da casa (+ extracted/)
    ├── swipe-file/        #   SWIPE INTERNO — copies vencedoras (priming + régua)
    │   ├── internos/      #     funis MeuFluxo: D3F, UI, J20 (do Nicolas), FDV
    │   ├── externos/      #     spies validados: Vshred, Gina Sam/EMMA, Renan etc.
    │   ├── analise/       #     DNA — 9 dissecações por lente (base da régua)
    │   └── source/        #     PDF original + extração mecânica (fidelidade)
    ├── brands/            #   contexto por marca (+ _TEMPLATE, INDEX)
    ├── pesquisa/          #   WORKSPACE do /pesquisamf (Gate 0)
    │   ├── bin/           #     apify_run.py — runner com travas de custo (plano FREE US$5/mês)
    │   ├── actors/        #     inputs-modelo por plataforma + README de custos/pegadinhas
    │   ├── .env           #     APIFY_TOKEN (chmod 600 — nunca versionar)
    │   └── <slug>/        #     por marca: plano-busca, raw/ (JSONs), dossiês
    ├── output/            #   entregas por marca
    └── .active-brand      #   marca ativa (runtime)
```

## As skills do /copymf

| Skill (nome interno) | Papel |
|---|---|
| `vsl-copywriter-br` | Produção — VSL (RMBC + Bencivenga) |
| `ad-strategist` | Produção — Anúncios (C.A.S.H.) |
| `meufluxo-copy-standard` | **Padrão da casa** — DNA das vencedoras + régua mínima de qualidade |
| `ad-copy-reviewer` | Gate 1 — qualidade (Luke Iha, calibrado pela régua) |
| `google-ads-reviewer` | Gate 2 — compliance Google/YT |

Versionadas em [`.claude/skills/`](.claude/skills/) — carregam automaticamente para quem
clonar o repo e abrir o Claude Code na pasta. Os comandos vivem em
[`.claude/commands/`](.claude/commands/); fontes originais em `copymf/skills-source/`.

## Padrão de qualidade (inegociável)

O swipe em [`copymf/swipe-file/`](copymf/swipe-file/) é a **régua mínima**: nenhuma copy sai
do `/copymf` abaixo do nível das vencedoras arquivadas ali. A skill `meufluxo-copy-standard`
codifica o DNA dessas copies e a régua eliminatória; o Gate 1 **reprova e reescreve
automaticamente** até a copy bater a régua.

## Convenções

- **Caminhos são fixos.** O comando referencia `copymf/` por nome. Renomear/mover quebra o processo.
- **Multi-marca.** `brands/<slug>.md` por marca, `INDEX.md` garante unicidade, `.active-brand` marca a corrente.
- **Swipe vivo.** Novos vencedores validados em tráfego entram em `swipe-file/` (ver README de lá) e passam a calibrar a régua.
- **Versionado em git** (repo privado no GitHub). Segredos ficam fora: `.env` está no
  `.gitignore` — cada máquina cria o seu (modelo em `copymf/pesquisa/.env.example`).

## Como começar

Numa conversa do Claude Code dentro deste diretório, rode `/copymf`. Ele resolve (ou cria) a marca
ativa antes de produzir.

## Rodando em outra máquina (setup do zero)

1. Clone o repositório e abra o Claude Code **na pasta do projeto**.
2. Os comandos (`/copymf`, `/pesquisamf`) e as skills carregam sozinhos de `.claude/` — nada a instalar.
3. Só para o `/pesquisamf`:
   - Crie `copymf/pesquisa/.env` com o seu próprio `APIFY_TOKEN` (modelo em
     [`copymf/pesquisa/.env.example`](copymf/pesquisa/.env.example)).
   - Instale o plugin de vídeo para o passo 6A (assistir vencedores): `/plugin install watch@claude-video`.
