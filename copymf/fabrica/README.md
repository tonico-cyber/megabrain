# FÁBRICA MEUFLUXO

Sistema de produção de anúncios em massa. **20 anúncios diferentes por semana, por funil**,
modelando o que já vende.

## Por onde começar

| Se você é… | Leia nesta ordem |
|---|---|
| **Copywriter novo no time** | `PADRAO-DE-ESCRITA.md` → `COORDENADAS.md` → `SISTEMA.md` |
| **Gestor de tráfego** | `MESA-SEGUNDA.md` → Partes 2, 5 e 8 do `SISTEMA.md` |
| **Quem vai rodar a Mesa de segunda** | `MESA-SEGUNDA.md` (imprime) |
| **Quem está montando um funil novo** | `SISTEMA.md` Parte 6 (multi-marca) + `COORDENADAS.md` |

## Os arquivos

| Arquivo | O que é |
|---|---|
| **`SISTEMA.md`** | a metodologia completa — leis, coordenadas, dispersão, semana, gates, multi-marca |
| **`MESA-SEGUNDA.md`** | cartão de 1 página do ritual semanal. Imprime e cola na parede. |
| **`COORDENADAS.md`** | a tabela canônica de códigos: 4 funis, 44 segmentos, 29 ângulos, 51 formatos, 4 porta-vozes |
| **`coordenadas.json`** | 🤖 **a tabela de códigos, estruturada para o sistema consumir** |
| **`swipe.json`** | 🤖 **as 102 peças do swipe classificadas nas coordenadas** — é daqui que sai a gêmea de cada peça nova |
| **`GERADOR.md`** | 🤖 spec do gerador de Ordem de Produção: entra funil + quantidade, sai N coordenadas com dispersão garantida |
| **`PADRAO-DE-ESCRITA.md`** | como a copy tem que soar. Complementa a régua de 12 critérios. |
| **`ledger/`** | uma planilha por funil. É o cérebro do sistema. |
| **`corpos/`** | os vencedores resgatados, com coordenadas e placar |
| **`portavozes/`** | ficha por pessoa: registro, o que pode e não pode afirmar, termos assinados |

## As 5 leis

1. **Não se cria copy do zero.** Toda peça modela uma gêmea nomeada.
2. **Cada ad é um ad inteiro** — hook novo E corpo novo. Nunca o mesmo ad com abertura trocada.
3. **Duas peças que sobem juntas precisam estar longe uma da outra** (ID ≥ 4).
4. **Quem julga não é quem escreveu.**
5. **Todo número tem fonte documentada.**

## Ativos que a fábrica consome

| Ativo | Onde | O quê |
|---|---|---|
| Swipe | `../swipe-file/` | 102 peças validadas (52 internas + 50 externas) + 9 lentes analíticas |
| Formatos | `../formatos/catalogo.md` | 43 formatos por porta-voz (+ bloco H em `COORDENADAS.md`) |
| Ângulos | `../angulos/biblioteca.md` | 20 ângulos detalhados (lista canônica A01–A29 em `COORDENADAS.md`) |
| Brand Context | `../brands/<slug>.md` | avatar, mecanismo, personas, segmentos, provas |
| Pesquisa | `../pesquisa/<slug>/` | dossiês do `/pesquisamf` (Gate 0) |
| Régua | `../../.claude/skills/meufluxo-copy-standard/` | 12 critérios, beat-maps, voz da casa |

## Estado atual (05/ago/2026)

✅ Metodologia documentada · **44 segmentos numerados nos 4 funis** · 29 ângulos com código na
biblioteca · bloco H de formatos no catálogo · `coordenadas.json` para o sistema · padrão de
escrita escrito · **swipe indexado (102 peças)** · gerador especificado
⬜ Vencedores da casa ainda **não** resgatados para o `corpos/` nem para o swipe interno
⬜ Ledger sem nenhuma linha de performance preenchida
⬜ Fichas de porta-voz não escritas (inclui o CREF × CRN da Suéllen)
⬜ `/copymf` ainda não integrado à fábrica
⬜ Gerador especificado (`GERADOR.md`) mas ainda não implementado no sistema

> **A fábrica só liga quando o ledger tiver a primeira coluna de performance com dado real.**
> A tarefa de maior retorno hoje é a Parte 9 (Semana Zero), Dias 1-2: resgatar os vencedores
> que já existem em todos os funis.
