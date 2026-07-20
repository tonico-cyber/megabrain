# /pesquisamf — Pesquisa de Conteúdo Comprovado (design)

**Data:** 2026-07-16 · **Status:** implementado
**Pedido:** montar um processo de pesquisa ANTES de escrever copy — buscar posts orgânicos
virais (curtidas, comentários, compartilhamentos) e sinais de tráfego pago (quantidade de
anúncios sobre um tema) em Meta Ads, Instagram, Facebook, YouTube e Reddit, guiado pelos
segmentos, dores e personas da marca. Infra: conta Apify do André (plano FREE, US$ 5/mês).

## 1. Decisões de design

| Decisão | Escolha | Alternativas descartadas |
|---|---|---|
| Forma | Comando irmão `/pesquisamf` que produz um **dossiê por marca** consumido pelo `/copymf` | (a) Trilha nova dentro do `/copymf` — mistura o orçamento e a cadência da pesquisa (mensal/por tema) com o fluxo de produção (diário); (b) pipeline automatizado com webhooks/schedules da Apify — prematuro: as queries e a leitura dos achados exigem julgamento do copywriter, e o plano FREE não comporta coleta contínua |
| Execução | Runs interativas via `bin/apify_run.py` (polling), com travas de custo | Webhooks (o André ofereceu os endpoints): úteis só para runs longas/agendadas; nossas runs são de 1-3 min e o processo é conduzido no chat — polling é mais simples e sem infra extra. Fica documentado como evolução futura |
| Escopo de plataformas | Meta Ad Library (pago), Google Ads Transparency (pago/YT), Instagram, Facebook, YouTube, Reddit (orgânico) | TikTok — não pedido; adicionável depois pelo mesmo padrão |
| Scoring | Régua de comprovação aplicada pelo Claude no fim da coleta (com cálculo em python inline sobre os raw JSONs) | Script de scoring fixo — os shapes de dados variam por actor e a classificação de TEMA é semântica; código rígido quebraria a cada mudança de actor |
| Peso do swipe interno (feedback André, 2026-07-17) | Baseline interno lido ANTES do plano de busca (Passo 2A) + multiplicador de alinhamento no score final (×1,2 casa · ×1,0 neutro · ×0,8 contradiz) + filas P1-P4 (P1 = comprovado COM eco interno) | 5º componente de peso fixo dentro do score — misturaria sinal de mercado com validação da casa e mascararia os dois; o multiplicador mantém o score de mercado legível e ainda assim reordena a fila |

## 2. Princípios centrais

**Tema, não post.** A unidade de análise é o **TEMA** (par problema-mecanismo, ex.: "cortisol
e barriga na menopausa"), não o post isolado. Orgânico prova **atenção**; anúncio rodando há
semanas prova **conversão** (ninguém paga tráfego perdedor por 60 dias). O processo cruza os dois.

**O swipe interno pesa mais que o mercado.** A hierarquia de evidência é: vencedor interno
(converteu com o NOSSO público, NOSSA oferta, NOSSO funil) > sinal pago externo > viral
orgânico. A pesquisa externa confirma, expande e acha variações do que a casa já validou —
nunca o substitui. Operacionalização: baseline interno lido antes de tudo (Passo 2A),
multiplicador de alinhamento no score e filas P1-P4 no dossiê.

## 3. Pipeline (6 passos)

```
Passo 0   Marca da sessão (mesmo padrão do /copymf; Brand Context é a fonte)
Passo 1   Menu (rodada completa · varredura paga · Fase B · espionagem · dossiês)
Passo 2A  BASELINE INTERNO — temas/ângulos já validados pela casa (swipe interno, ativos
          do Brand Context, vencedores em tráfego do output/) — lido ANTES de gastar crédito
Passo 2B  Plano de busca — matriz de queries priorizando (a) temas do baseline interno,
          (b) dores sem peça interna; copywriter aprova antes de gastar crédito
Passo 3   Coleta PAGA — Meta Ad Library por keyword (BR, ativos); Google Ads Transparency
          em 2 etapas (descobrir anunciantes no orgânico → auditar cada um)
Passo 4   Coleta ORGÂNICA — YT, FB, Reddit, IG. Sempre em 2 fases: posts primeiro,
          comentários SÓ dos vencedores (senão o custo explode)
Passo 5   Régua de comprovação — score por item (outlier ratio) → score por tema (0-100)
          → multiplicador de alinhamento interno → filas P1-P4
Passo 6   Dossiê + Briefs de Tema (com campo "Eco interno" obrigatório) — entregável em
          copymf/pesquisa/<slug>/; vira o "Gate 0" da produção no /copymf
```

## 4. Actors escolhidos (preços do tier FREE, jul/2026)

### Sinal pago
| Papel | Actor | Custo | Nota |
|---|---|---|---|
| Meta Ad Library por keyword (PRINCIPAL) | `curious_coder/facebook-ads-library-scraper` | US$ 0,75/1000 ads | Já testado na conta. Input = URL da Ad Library com filtros embutidos (`q=`, `country=BR`, `active_status=active`, `search_type=keyword_unordered`). Campos-chave: `start_date` (unix s), `is_active`, `collation_count`, `page_name`, `snapshot.body.text` |
| Alternativa ergonômica | `automation-lab/facebook-ads-library` | ~US$ 0,58/1000 + 0,005/run | Campos nativos `searchQueries`/`country` (sem montar URL); até 20 keywords/run |
| Extras (sorting por impressões, janelas de data, `onlyTotal`) | `apify/facebook-ads-scraper` | US$ 5,80/1000 (8x mais caro) | Usar pontualmente |
| Google/YouTube Ads Transparency | `solidcode/ads-transparency-scraper` | US$ 1,50/1000 | **Não busca por tema** — só por anunciante/domínio. Fluxo em 2 etapas. Campos: `firstShown`, `lastShown`, `approxDaysShown`, `creativeId` (escala). Sempre `maxResults=50` (0 = ilimitado!) |

### Sinal orgânico
| Papel | Actor | Custo | Nota |
|---|---|---|---|
| IG — descoberta por termo | `apify/instagram-search-scraper` | US$ 2,70/1000 | `searchType=popular` = reels já ranqueados pelo IG; traz `latestComments` grátis (~15/post). **Smoke test: bloqueado pelo IG (2 falhas)** — tratar IG como coadjuvante na descoberta |
| IG — hashtags + comentários | `apify/instagram-scraper` | US$ 2,70/1000 | `directUrls` explore/tags + `onlyPostsNewerThan`; `resultsType=comments` nos vencedores; `resultsType=details` p/ followers (~US$ 0,003/perfil) |
| IG — espionar perfis concorrentes | `krazee_kaushik/instagram-profile-posts-and-comments-scraper` | US$ 1,00/1000 posts + 0,50/1000 comments | Já testado; o mais barato; `commentsSortOrder=popular`. Não busca por tema |
| FB — busca por keyword | `scraper_one/facebook-posts-search` | ~US$ 2,05/1000 | `searchType=top` = ranking do próprio FB; rate limit do dev: 2-4 keywords/dia |
| FB — profundidade por página | `apify/facebook-posts-scraper` | US$ 5/1000 no FREE | Já testado; para calcular a média da página e achar outliers 3-5x |
| FB — descobrir páginas do nicho | `apify/facebook-search-scraper` | US$ 12/1000 + 0,03/run | Rodar 1x por nicho e guardar a lista; bônus: campo `adStatus` (página roda ads?) |
| YouTube — busca por termo | `streamers/youtube-scraper` | US$ 4,00/1000 | Único com `viewCount` + `likes` + `commentsCount` + `numberOfSubscribers`; `sortingOrder=views`, `dateFilter=year` |
| Reddit — keyword + top de subs | `harshmaur/reddit-scraper` | US$ 2/1000 + 0,02/run | Metade do preço do trudax, ~3% falha (vs ~30%); campo `searchTerm` rastreia a query; comentários faturados como resultado |
| Reddit — varredura ultra frugal | `automation-lab/reddit-scraper` | ~US$ 1,15/1000 + 0,003/run | Top de subs EN validados (`r/SUB/top/?t=month`) |

## 5. Régua de comprovação

### 5.1 Score do ITEM (normalizado por plataforma)
`R = engajamento do item ÷ baseline da própria fonte` (mediana dos últimos ~20 posts da
conta, ou o esperado relativo a seguidores/inscritos/membros). Escala log (intervalos
semiabertos): R ≥ 10 → 100 · ≥5 e <10 → 80 · ≥3 e <5 → 60 · ≥2 e <3 → 40 · <2 → 0-20.

Réguas por plataforma (resumo; absolutos são PISOS para o nicho saúde BR):
- **Instagram:** comprovado ≥ 3x mediana do perfil (viral ≥ 5-10x); Reels: views ≥ 5x seguidores (viral ≥ 10x); ER ≥ 3% num post = outlier (mediana da plataforma ~0,36%). Comentários/curtidas ≥ 5% = post para minerar linguagem. Pisos: Reel 100K+ views, 5K+ likes, 200+ comments.
- **Facebook:** (reações+comentários+shares) ≥ 1% dos seguidores da página = comprovado (~6x a mediana de 0,15%); ≥ 2-3% = viral. **Share é o sinal rei** (público 40+): 100+ shares ou shares/reações ≥ 10%.
- **YouTube:** long-form com views ≥ 100% dos inscritos = comprovado; ≥ 2-3x = viral. Shorts: exigir 5-10x. Likes/views ≥ 4-5% bom; comentários/views ≥ 0,5% = minerar. Normalizar por views/mês.
- **Reddit:** upvotes ≥ 1% dos membros do sub = viral; comentários/upvotes ≥ 30% = mina de objeções; `upvote_ratio` ≥ 0,90 = dor consensual. Pesa menos como prova de escala BR e MUITO como linguagem crua.

### 5.2 Score do TEMA (0-100)
| Componente | Peso | Cálculo |
|---|---|---|
| Viralidade orgânica | 40 | média dos top-3 itens do tema |
| Amplitude | 20 | nº de fontes distintas com item comprovado (1=5 · 2=10 · 3-4=15 · 5+=20) |
| Validação paga | 30 | longevidade máx (30d=20 · 60d=30 · 90d+=40) + anunciantes distintos 30d+ (1=10 · 2=20 · 3-4=30 · 5+=40) + collation máx (3-5=10 · 6+=20); a soma já é 0-100, ×0,3 |
| Recência | 10 | % dos itens comprovados com ≤ 90 dias |

Proteções: cap de 2 itens por conta; **fonte = conta/página/canal/anunciante distinto**;
tema só pontua com ≥ 3 itens de ≥ 2 fontes (senão "dados insuficientes", sem score).
Leitura bruta: ≥ 70 = comprovado no mercado · 50-69 = promissor · < 50 = descartar por ora.
Recalcular a cada ciclo (recência e sinal pago mudam rápido).

### 5.2b Alinhamento interno (aplicado por último — o swipe interno pesa mais)
Multiplicador sobre o score do tema, comparando com o baseline do Passo 2A:
**×1,2** (cap 100) se o tema CASA com vencedor interno (mesmo mecanismo/ângulo/dor) ·
**×1,0** sem eco · **×0,8** se CONTRADIZ aprendizado interno documentado (anotar o conflito).
Filas finais: **P1** = ≥ 70 pós-ajuste COM eco interno → produção imediata ·
**P2** = ≥ 70 sem eco → teste controlado (1-2 peças, nunca lote) ·
**P3** = 50-69 com eco → mais 1 rodada de coleta · **P4** = resto.

### 5.3 Sinais pagos (o detector de mentiras)
1. **Longevidade:** ativo há ≥ 30 dias = provável winner; ≥ 60 = quase certo (~11% dos ads sobrevivem); ≥ 90 = control do anunciante — dele saem o ângulo e o hook mais valiosos.
2. **Collation ≥ 6 variações** = anunciante escalando; 10+ = confiança máxima.
3. **≥ 3 anunciantes independentes** no mesmo tema há 30+ dias = tema validado pelo MERCADO.
4. **Recorrência** (criativo pausado e relançado) = control comprovado.

Armadilha: no BR a Ad Library não mostra spend/impressões de ads comerciais (`reach_estimate`
vem null) — nunca usar como sinal; ads inativos somem do arquivo (análise é sempre de ativos).

## 6. Dossiê e Briefs de Tema (entregável)

`copymf/pesquisa/<slug>/AAAA-MM-DD-dossie-<n>.md`, abrindo com o **baseline interno**
(temas já validados pela casa, com peça-fonte), depois ranking de temas (com coluna **eco
interno** e fila P1-P4, ordenado por fila) + 1 **Brief de Tema** por tema P1/P2: score,
componentes e **Eco interno obrigatório** (qual peça do swipe/output valida o tema, ou
"sem eco — aposta"); 2-3 ângulos formulados e mapeados para a biblioteca
(`copymf/angulos/biblioteca.md`, 1-20) e por awareness; 5-10 hooks transcritos com fonte
(hooks de ads 60d+ valem mais que orgânicos — sobreviveram ao leilão); 10-20 frases LITERAIS
do avatar em 4 baldes (dores · desejos · objeções · vocabulário); top-5 objeções ranqueadas
por frequência; formato dominante (reel falado, corte de podcast, UGC, static de print…);
tipo de prova dominante (~67% dos ads longevos usam prova social); links de referência.
Temas com dor orgânica alta e POUCA oferta paga entram numa seção "lacunas" (oceano azul).

**Integração:** o `/copymf` passa a checar no Passo Priming se existe dossiê recente da marca
e usa os Briefs na ideação (fontes DIVERSAS da Trilha [2]). Hooks/copy de terceiros seguem a
regra da casa: modelar estrutura, NUNCA copiar frases. Frases de COMENTÁRIOS são linguagem do
avatar: usar cruas, sem atribuição de autor.

## 7. Orçamento e frugalidade (plano FREE, US$ 5/mês)

- Rodada completa padrão ≤ **US$ 0,50** (≈ paga 0,10 + orgânica 0,30 + comentários 0,10).
- Travas do runner: `--budget-ceiling 4.50` (mensal) e `--max-cost` por run; custo real
  impresso após cada run.
- Comentários em 2 fases sempre (Fase B roda ANTES de fechar o dossiê; ~30/post nos top
  3-5); limites de coleta 10-30 por run; dedupe por `ad_archive_id`.
- Retenção do plano FREE = 7 dias → todo raw é salvo localmente em `<slug>/raw/`.
- Cadência sugerida: 1 rodada/tema/semana (também alivia anti-bot da Meta).

## 8. Segurança

Token só em `copymf/pesquisa/.env` (chmod 600) — nunca em docs/comandos/chats. O token foi
colado no chat na criação deste processo: **rotacionar em
console.apify.com/settings/integrations** e atualizar o `.env`.

## 9. Fora de escopo (por ora)

Webhooks/agendamento (Apify Schedules), TikTok, dashboard de acompanhamento, scoring
automatizado em script, upgrade de plano (US$ 5 cobrem ~8-10 rodadas/mês; reavaliar se a
cadência subir).

## 9b. v2 "Pesquisa Forte" (2026-07-18 — feedback: "a pesquisa ainda está fraca")

Diagnóstico (4 lentes: RMBC, C.A.S.H./Copy Blocks, régua da casa, espionagem de funil —
consenso): **a v1 era radar de temas, não pesquisa de produção** — achava o ouro e entregava
lascas. Os raws já pagos continham a copy integral, o link do funil e o vídeo de cada
vencedor, e o dossiê destilava tudo em 1 linha. Fase B opcional gerou dossiê real com ZERO
frases do avatar; o control de 770 dias ficou sem teardown; nenhum vencedor transcrito;
nenhuma prova científica; fotos, nunca o filme (sem análise temporal).

Mudanças da v2 (comando reescrito):
- **Coleta paga em 3 camadas:** keyword (50/query) → **varredura por página** dos quentes
  (`view_all_page_id`, portfólio inteiro ~US$ 0,04-0,15 — validado: 30 ads da Lays) →
  **vigília semanal** (trilha [6]: ping de `total` ~US$ 0,001 + diff por `ad_archive_id`:
  novos=testes · sobreviventes=winners · mortos=perdedores).
- **Censo do leilão** (Passo 5): cada ad classificado em ângulo × awareness × mecanismo ×
  estilo × prova → tabela de frequência + casas vazias (oceano azul com coordenada);
  mecanismo em 3+ anunciantes = queimado.
- **Passo 6 — Profundidade** (obrigatório p/ P1, só top 3-5 por tema): **6A** roteiros
  (steadyfetch US$ 0,02/ad — validado, hook3s+transcript; YT legendas grátis na Fase A;
  yt-dlp local grátis; `/watch` para o hook VISUAL) → Swipe Cards com beat-map; control
  90d+ = transcrição integral + candidato a swipe externo (gêmea). **6B** funil do vencedor
  (cascata WebFetch grátis → WCC → Playwright local IP BR; quiz, cloak, preço, garantia,
  bônus). **6C** voz do avatar em volume (40-60 frases/tema; YT comments US$ 0,90/1000 —
  validado; FB comments; reviews Amazon BR/Google Play = linguagem de quem PAGOU; 6 baldes
  com contagem + reservatórios Unaware). **6D** banco de provas científicas (claims dos ads
  → fonte primária via WebSearch; sem fonte = não usar). **6E** sofisticação medida +
  calibração de promessa.
- **Dossiê de PRODUÇÃO** (Passo 7): Brief com os 6 insumos da régua da casa (vilão candidato,
  analogia, método+dose, sintoma-espelho com contagem, números com fonte, concessão) +
  avatar RMBC (diálogo interno, tentativas falhas com a razão DELA, medos, explicação folk)
  + matéria-prima Unaware + **checklist de completude com carimbo**: "APTO PARA PRODUÇÃO"
  vs "RADAR — não alimenta VSL" (o /copymf recusa RADAR para VSL/lote).
- **Trilha [7]** matriz de ofertas concorrentes (páginas de venda dos diretos, custo ~zero).
- **Tetos revisados:** rodada completa ≤ US$ 2,50 (profundidade no vencedor vale mais que
  largura); varredura/vigília ≤ US$ 0,50. FREE comporta 1-2 rodadas fortes/mês + vigília;
  upgrade só se a cadência subir.

Smoke v2 (2026-07-18, ~US$ 0,15): varredura da página Lays = 30 ads (28 variações do
desafio, 14-75d = máquina de escala); steadyfetch transcreveu 2 winners em pt perfeito
("Essa barriga não sai com caminhada nem academia após os 50... barriga hormonal" — o
mecanismo batizado DELES, censo em ação); 60 top comments do viral da Tatiana (relatos
com números, concessões espontâneas); yt-dlp trouxe o roteiro de 2.852 palavras de graça.

## 10. Smoke test (2026-07-16, marca programa-mulher-40, ~US$ 0,10)

Pipeline validado de ponta a ponta com a query "menopausa emagrecer":

| Plataforma | Resultado | Achado |
|---|---|---|
| Meta Ad Library | 10 ads ✓ | Anunciante escalando "desafio pilates em casa 50+" com 7 variações ativas há 39-69 dias; ad "Menopausa Cancelada" (vinagre de maçã) ativo há **770 dias** = control |
| Instagram | busca FAILED 2x (bloqueio IG); hashtag ✓ mas só recentes | IG rebaixado a coadjuvante na descoberta (espionagem de perfis + comentários) |
| Facebook | 6 posts ✓ | Top: 134 shares · 515 reações; texto em `postText` |
| YouTube | 11 vídeos ✓ | "Como Emagreci 18kg na MENOPAUSA": 126K views num canal de 11K (ratio 11x); "Mulheres 50+ Estão EMAGRECENDO Assim": ratio 5,5x |
| Reddit | 10 posts ✓ | pt-BR global funciona (r/MenopausaFeliz); EN global retorna lixo → restringir a subs de nicho |

Correções aplicadas: default de memória do runner 1024→512 (actors exigem memória
proporcional ao input); ordem da coleta orgânica YT→FB→Reddit→IG; regra EN/subreddits.
