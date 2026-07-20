# Swipe File MeuFluxo — biblioteca de copies vencedoras

Esta é a **fonte de verdade do padrão de qualidade** de copy do MeuFluxo. Todas as peças aqui foram **validadas em tráfego pago**. O `/copymf` usa esta biblioteca de duas formas:

1. **Priming (produção):** antes de gerar, o orquestrador lê 3–5 swipes do nicho da marca e gera *no nível deles*.
2. **Régua (revisão):** o Gate 1 compara a copy nova com as vencedoras daqui — **nada é entregue abaixo desse nível** (ver skill `meufluxo-copy-standard`).

## Inventário

| Arquivo | Funil / Fonte | Nicho | Peças |
|---|---|---|---|
| `internos/dieta-das-3-fases.md` | D3F · Eduardo Claas | Emagrecimento / intestino (zonulina, SER, RAM) | 18 |
| `internos/ultra-inteligencia.md` | UI · Dr. Marcelo Roxo | Memória / Integração Hemisférica | 20 |
| `internos/jejum-2-0.md` | J20 · Dr. Lucas Mallmann ⭐ escritas pelo Nicolas Toigo | Jejum metabólico / P.I.G. | 7 |
| `internos/frequencias-da-vida.md` | FDV · Zayka Capita | Frequências sonoras / detox ⚠️ compliance | 7 |
| `externos/renan-botelho.md` | Dr. Renan Botelho | Jejum / desafio R$9–67 | 8 |
| `externos/vshred.md` | Vshred / B Shreds (EN) | Fat loss / body type quiz | 11 |
| `externos/warrior-babe.md` | Warrior Babe (EN) | Fitness mulheres 45+ / $27 | 4 |
| `externos/drew-canole-organifi.md` | Drew Canole / Organifi (EN) | Parasitas / detox | 3 |
| `externos/bodyfast.md` | Bodyfast App (EN) | Jejum / app quiz | 9 |
| `externos/emma-liver.md` | EMMA / Dr. Gina Sam (EN) | Fígado / colesterol — advertorial longo | 8* |
| `externos/gina-sam-constipation.md` | Dr. Gina Sam (EN) | Constipação 50+ — advertorial longo | 6* |

\* Reposts/hook-swaps 1:1 registrados por referência (sem repetir o corpo idêntico) — a iteração está documentada em cada arquivo.

## Análise (DNA das vencedoras)

`analise/` contém 9 dissecações do swipe (uma por lente: hooks-leads, mecanismo-vilao,
estrutura-beats, emocional-historia, prova-especificidade, linguagem-ritmo, cta-oferta,
compliance-preempcao, topo-vs-resto), com ~84 padrões nomeados e citações verbatim por ID.
A síntese operacional delas é a skill **`meufluxo-copy-standard`** (régua de 12 critérios,
beat-maps, voz da casa) — fonte em `../skills-source/extracted/meufluxo-copy-standard.md`.
A lente `topo-vs-resto.md` traz o ranking interno (quais peças calibram a régua e quais não).

## Fidelidade

- `source/Melhores ads.pdf` — swipe oficial original (arquivado).
- `source/extracao-bruta.txt` — texto extraído mecanicamente (pypdf), referência de verificação.
- Transcrições preservam o texto original **palavra por palavra** (incluindo erros de transcrição automática nos vídeos `UI...`, marcados como "transcrição automática bruta"). Únicas normalizações: junção de quebras de linha do PDF em parágrafos e correções ortográficas triviais (acentos).

## Como usar para priming

1. Identifique o nicho da marca ativa (ex.: emagrecimento → D3F + J20 + Renan/Vshred/Bodyfast; memória → UI; advertorial longo → EMMA/Gina Sam).
2. Selecione 3–5 peças: **ao menos 2 internas** (voz da casa; J20 = voz do Nicolas) + externas do mesmo formato-alvo.
3. Injete com comentários estratégicos (o que imitar: tipo de hook, vilão/mecanismo, beat-map, CTA) — nunca copie literalmente: modele estrutura e nível, troque conteúdo.

## Como adicionar um novo vencedor

1. Copy validada em tráfego (gasto relevante + ROI) → adicionar no arquivo do funil (ou criar arquivo novo por funil), com ID, link, crédito do copywriter e transcrição fiel.
2. Atualizar o inventário acima.
3. Vencedores novos passam a valer como calibração da régua automaticamente.

## Avisos

- ⚠️ **Compliance:** várias peças (especialmente FDV, EMMA, Gina Sam) usam claims que **não passam** no Google/YouTube Ads e arriscam bloqueio no Meta. Elas são referência de *persuasão e estrutura* — os claims são tratados pelos gates do `/copymf` (CopyChief + GoogleADS). Persuasão de nível vencedor ≠ copiar claims proibidos.
- Os marcadores `>>` indicam troca de locutor nas transcrições de vídeo.
