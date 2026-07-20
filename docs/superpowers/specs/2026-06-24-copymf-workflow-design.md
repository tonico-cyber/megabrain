# Spec — `/copymf`: Processo Nicolas Toigo de Copy (MeuFluxo)

Data: 2026-06-24
Autor: André Xavier (MeuFluxo) + Claude
Status: Aprovado para implementação (pendente review do spec)

---

## 1. Objetivo

Transformar as 4 skills de copywriting do Nicolas Toigo em **um único processo orquestrado `/copymf`**, menu-driven, que os copywriters do MeuFluxo usam para produzir e validar copy (VSL e anúncios) numa sequência fluida — conectando produção e revisão sem re-colagem de contexto e com entrega sempre em **pt-BR**.

### Problema que resolve
Hoje as 4 skills existem soltas (arquivos `.skill` na pasta `Downloads/IA`), cada uma com seu próprio setup e disparo manual. Não há sequência conectando "produzir → revisar qualidade → revisar compliance → entregar". O copywriter precisa lembrar de rodar cada skill na ordem certa e recolar contexto a cada passo. O `/copymf` encapsula isso num processo guiado.

### Não-objetivos (YAGNI)
- Não reescrever as 4 skills do Nicolas. Elas são instaladas como estão e invocadas.
- Não duplicar nem substituir `/winning-ads`, `/copyops`, `/copy-coder` ou as skills `vsl-*`/`clones`. `/copymf` é autocontido.
- Não automatizar publicação em Meta/Google Ads. O escopo termina na copy aprovada salva em disco.
- Não construir UI, banco de dados ou integração externa. Tudo é arquivo markdown.
- Sem persistência compartilhada com `/winning-ads` — `/copymf` tem persistência própria (decisão travada).

---

## 2. Skills-fonte (já obtidas)

Arquivos `.skill` (são ZIPs contendo `<nome>/SKILL.md`) em `~/Downloads/IA/`:

| Arquivo `.skill` | Nome interno da skill | Papel no processo |
|---|---|---|
| `VSL-Copywriter.skill` | `vsl-copywriter-br` | Produção — trilha VSL (RMBC Stefan Georgi + 5 Mandamentos Bencivenga, 8 blocos) |
| `ADS-Copywriter.skill` | `ad-strategist` | Produção — trilha Anúncio (C.A.S.H., 6 estágios) |
| `CopyChief-Reviewer.skill` | `ad-copy-reviewer` | Gate 1 — revisão de qualidade (framework Luke Iha, vicious meter) |
| `Copywriter-GoogleADS.skill` | `google-ads-reviewer` | Gate 2 — compliance Google/YouTube Ads |

---

## 3. Decisões de arquitetura (travadas com o usuário)

| Decisão | Escolha |
|---|---|
| Forma de entrega | Comando único `/copymf`, menu-driven (padrão copyops) |
| Persona | Nicolas Toigo — chief copywriter MeuFluxo, classifica o pedido e roteia |
| Instalação | Extrair as 4 skills para `~/.claude/skills/` + criar orquestrador em `~/.claude/commands/copymf.md` |
| Persistência | Própria do `/copymf`, dentro do projeto: `Megabrain MeuFluxo/copymf/` |
| Gates de revisão | "Revisar e perguntar" — mostra problemas + reescrita sugerida, pede confirmação antes de aplicar; nunca reescreve à revelia |
| Ordem dos gates | CopyChief (qualidade) **antes** de GoogleADS (compliance) |
| Idioma | Todo output sempre em pt-BR (skills-fonte são em inglês; metodologia aplicada, entrega em português) |

---

## 4. Estrutura de arquivos em disco

### 4.1 Skills instaladas
```
~/.claude/skills/
  vsl-copywriter-br/SKILL.md
  ad-strategist/SKILL.md
  ad-copy-reviewer/SKILL.md
  google-ads-reviewer/SKILL.md
```

### 4.2 Orquestrador
```
~/.claude/commands/copymf.md
```

### 4.3 Persistência (dentro do projeto)
```
Megabrain MeuFluxo/copymf/
  .active-brand                       # slug da marca ativa (1 linha)
  brands/
    INDEX.md                          # tabela de todas as marcas
    <slug>.md                         # contexto unificado de marca (1 por marca)
  output/
    .gitkeep
    <slug>/
      AAAA-MM-DD-<tipo>-<id>.md       # entrega final (copy aprovada)
```

`<tipo>` ∈ {`vsl`, `ad`}.

**Regra do `<id>` (determinística):** ao salvar, escanear `output/<slug>/` por arquivos com o prefixo `AAAA-MM-DD-<tipo>-` (data de hoje); `<id>` = (maior sufixo numérico encontrado) + 1, começando em `1`. Ex.: segunda VSL do dia para a marca = `2026-06-24-vsl-2.md`.

**N anúncios → 1 arquivo (decisão).** Uma entrega da trilha Anúncio, mesmo gerando N variações, é salva em **um único arquivo** `AAAA-MM-DD-ad-<id>.md` contendo as N variações (cada uma com seu cabeçalho `### Anúncio N`). Isso alinha com a forma como o `ad-strategist` produz lotes e mantém a entrega como uma peça coesa. O `<id>` incrementa por entrega, não por variação.

### 4.4 Conteúdo de `brands/<slug>.md` (Brand Context)
Campos capturados uma vez por marca e reinjetados nas skills de produção:
- Nome da marca / produto
- Avatar (idade, gênero, dor principal, tentativas falhas, linguagem que usa)
- Oferta (o que é, formato de entrega)
- Mecanismo único (UMP)
- Preço e justificativa de preço
- Prova social disponível (depoimentos, antes/depois, dados)
- Âncora de comparação (o que o avatar já conhece/gasta)
- Objeções principais
- Nível de sofisticação/awareness do mercado

Esse documento mapeia diretamente para:
- `ad-strategist` → Stage 1 (Knowledge Base: Copy Blocks, Build a Buyer, Offer Brief, Segments). O campo **sofisticação/awareness** também alimenta a fase de ideação/ângulo (Stage 2/3), não só a Knowledge Base.
- `vsl-copywriter-br` → fase R (Research) e B (Brief) do RMBC

### 4.5 Mecanismo de invocação das skills
O `copymf.md` é um **comando**; ele aciona cada skill instalada via a **Skill tool**, pelo nome interno, passando o Brand Context (e o intake) no prompt de invocação. Mapeamento trilha → skill:

| Etapa | Skill acionada (nome interno) |
|---|---|
| Produção VSL | `vsl-copywriter-br` |
| Produção Anúncio | `ad-strategist` |
| Gate 1 (qualidade) | `ad-copy-reviewer` |
| Gate 2 (compliance Google/YT) | `google-ads-reviewer` |

O orquestrador injeta no prompt da skill: (a) o conteúdo de `brands/<slug>.md`, (b) o intake da trilha (Quantidade/Canal/Tipo para Anúncio; Canal para VSL), e (c) a instrução de saída em pt-BR. As skills de produção são instruídas a tratar o Brand Context como sua fase de Research/Foundations já preenchida, perguntando apenas o que faltar.

**Nota de verificação (implementação):** confirmar, ao extrair o `SKILL.md` de `ad-copy-reviewer`, que ela aceita roteiro longo de VSL (a descrição da skill cita "video scripts/roteiros" — verificado no SKILL.md). Caso uma versão futura da skill restrinja a ads curtos, o Gate 1 da trilha VSL precisaria de fallback.

---

## 5. Fluxo do processo

### 5.1 Entrada
```
/copymf
  └─ resolve marca ativa
       - se não há .active-brand → oferece criar/selecionar
       - lê brands/<slug>.md e injeta como contexto
  └─ MENU:
       [1] Produzir VSL          → trilha VSL
       [2] Produzir Anúncio      → trilha Anúncio
       [3] Revisar copy pronta   → pula produção, entra nos gates
       [4] Gerenciar marcas      → criar / trocar / editar / duplicar
  └─ (ou pedido em linguagem livre → Nicolas classifica intenção e roteia)
```

### 5.2 Trilha Anúncio (com intake)
```
[2] Produzir Anúncio
  → INTAKE:
      • Quantidade  : nº de anúncios a gerar (ex: 1, 5, 10)
      • Canal       : Meta · Google/YouTube   (define tom E aciona/dispensa Gate 2)
      • Tipo        : Novo · Otimização de vencedor
  → PRODUÇÃO (ad-strategist):
      • Novo        → Stages 1-3 (Foundations a partir do Brand Context →
                      Ideação → Roteiros), gerando N anúncios com diversidade
                      (swipes/templates/organic/ângulos)
      • Otimização  → pede o anúncio vencedor (colar) → Stage 5
                      (Segment Swap / Mechanism Swap / C.A.S.H. Swap) → N variações
  → GATE 1 — CopyChief (ad-copy-reviewer): SEMPRE
      revisa → mostra ≤3 problemas + reescrita pronta → "aplico?" (confirma)
  → GATE 2 — GoogleADS (google-ads-reviewer): SÓ se Canal = Google/YouTube
      revisa compliance → mostra flags + reescrita → "aplico?" (confirma)
  → ENTREGA: salva N anúncios aprovados em copymf/output/<slug>/
```

### 5.3 Trilha VSL (intake enxuto)
```
[1] Produzir VSL
  → INTAKE:
      • Canal : Meta · Google/YouTube  (aciona/dispensa Gate 2)
      (VSL é peça única, não há "quantidade"; o tipo é sempre produção da peça)
  → PRODUÇÃO (vsl-copywriter-br):
      roda RMBC a partir do Brand Context, bloco-a-bloco com validação própria
      da skill (8 blocos com checkpoints)
  → GATE 1 — CopyChief: SEMPRE (a skill ad-copy-reviewer cobre roteiros)
  → GATE 2 — GoogleADS: SÓ se Canal = Google/YouTube
  → ENTREGA: salva a VSL aprovada em copymf/output/<slug>/
```

### 5.4 Atalho de revisão
```
[3] Revisar copy pronta
  → copywriter cola a copy (veio de fora do processo)
  → pergunta Canal (para decidir Gate 2)
  → GATE 1 CopyChief → GATE 2 GoogleADS (condicional) → entrega versão revisada
```

### 5.5 Comportamento dos gates ("revisar e perguntar")
- O revisor roda e apresenta: problemas (máx 3, formato Luke Iha) + a reescrita pronta para uso.
- O orquestrador **pergunta** se aplica a reescrita antes de substituir.
- O copywriter pode pedir outro ciclo de revisão; sem auto-loop forçado.
- **Se o copywriter rejeitar a reescrita** ("não aplico"), o orquestrador mantém a versão original e segue para o próximo gate / entrega com ela inalterada — a decisão é registrada, o fluxo não trava.
- Na trilha Anúncio com N peças, os gates operam sobre o conjunto (revisão item a item ou em lote, conforme o copywriter preferir).

---

## 6. Princípios de design (isolamento e clareza)

- **4 skills = 4 unidades independentes.** Cada uma tem propósito único e pode ser usada sozinha (instaladas em `~/.claude/skills/`). O orquestrador só as sequencia.
- **Brand Context é a interface** entre persistência e produção: um único markdown por marca, lido e injetado; trocar a marca não muda o orquestrador.
- **Orquestrador fino:** `copymf.md` contém o menu, o intake, a lógica de roteamento e a sequência de gates — **não** duplica a metodologia das skills (elas são a fonte de verdade).
- **Gates desacoplados:** CopyChief e GoogleADS são chamados pela mesma mecânica "revisar e perguntar"; adicionar/remover um gate não afeta a produção.

---

## 7. Tratamento de erros e bordas

- **Sem marca ativa / `.active-brand` ausente** → menu de marca antes de qualquer produção.
- **Brand Context incompleto** → a skill de produção pergunta só o que falta (não recoleta tudo).
- **Canal não informado** → default seguro: pergunta antes de decidir o Gate 2 (não assume).
- **Otimização sem anúncio vencedor colado** → bloqueia e pede o anúncio antes do Stage 5.
- **Skill não instalada** → o orquestrador detecta e instrui reinstalar (ou faz fallback explícito).
- **Pasta `copymf/output/<slug>/` inexistente** → criada na primeira entrega.
- **Colisão de slug** ao criar/duplicar marca → slug deriva do nome (kebab-case); se já existir em `brands/`, o orquestrador sufixa `-2`, `-3`… e confirma com o copywriter antes de gravar. `INDEX.md` é a fonte de unicidade.
- **Gate com reescrita rejeitada** → ver Seção 5.5 (segue com o original, não trava).

---

## 8. Critérios de sucesso

1. `/copymf` resolve/cria marca e persiste contexto em `copymf/brands/<slug>.md`.
2. Trilha Anúncio respeita Quantidade, Canal e Tipo (Novo→Stages 1-3, Otimização→Stage 5).
3. Trilha VSL roda `vsl-copywriter-br` bloco-a-bloco a partir do Brand Context.
4. Gate 1 (CopyChief) sempre roda; Gate 2 (GoogleADS) só com Canal Google/YT; ordem CopyChief→GoogleADS.
5. Gates "revisam e perguntam" — nunca aplicam reescrita sem confirmação.
6. Entrega final salva em `copymf/output/<slug>/` com nome `AAAA-MM-DD-<tipo>-<id>.md` (regra do `<id>` da Seção 4.3); trilha Anúncio gera 1 arquivo com N variações.
7. Todo output em pt-BR.
8. As 4 skills ficam instaladas em `~/.claude/skills/` e utilizáveis isoladamente.
9. A trilha Anúncio "Novo" puxa de fontes diversas de ideação (não gera N variações do mesmo ângulo) — orientação repassada à skill `ad-strategist` via prompt; diversidade é responsabilidade da skill, não verificada por contagem rígida.

---

## 9. Adendo (2026-06-26) — Swipe interno + Régua de qualidade

Evolução aprovada pelo usuário após a entrega do swipe oficial ("Melhores ads.pdf"):

| Decisão | Escolha |
|---|---|
| Swipe interno | `copymf/swipe-file/` — biblioteca compartilhada MeuFluxo-inteiro (internos D3F/UI/J20/FDV + spies externos), transcrição fiel do PDF original (arquivado em `source/`) |
| Priming | Produção (VSL e Anúncio) SEMPRE lê 3–5 swipes do nicho antes de gerar |
| Nova skill | `meufluxo-copy-standard` — DNA das copies vencedoras + régua mínima; usada na produção (primer) e no Gate 1 (rubrica) |
| Gate 1 (qualidade) | **Muda de "revisar e perguntar" para "reprova até bater a régua"**: loop automático de reescrita (máx. 3 ciclos; se não bater, apresenta melhor versão + gaps e pergunta). Qualidade abaixo do swipe nunca é entregue |
| Gate 2 (compliance) | Permanece "revisar e perguntar" (decisão original mantida) |
| Feedback permanente | O swipe é régua viva: novos vencedores adicionados a `swipe-file/` recalibram o padrão |

## 10. Itens fora de escopo / decisões adiadas

- Handoff automático para `/winning-ads` ou `/copyops` (pode ser adicionado depois; por ora `/copymf` é autocontido).
- Exportação para Google Drive/HTML (existe `copyops-export`; não é objetivo do `/copymf` v1).
- Versionamento git do projeto (o diretório não é repo git hoje; opcional `git init` futuro).
