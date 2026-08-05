# actors/ — templates de input por plataforma

Cada JSON é um input-modelo: **copie para a pasta da marca, troque as queries** e rode com
`bin/apify_run.py`. Preços = tier FREE (jul/2026). Custo/50 ≈ custo de um run de 50 itens.

| Template | Actor | Custo/50 | Papel |
|---|---|---|---|
| `meta-ads-library.json` | `curious_coder/facebook-ads-library-scraper` | ~US$ 0,04 | **PAGO principal** — ads ativos BR por keyword (query vai NA URL, url-encoded) |
| `meta-ads-library-alt.json` | `automation-lab/facebook-ads-library` | ~US$ 0,03 | Alternativa com campos nativos (até 20 keywords/run) |
| `google-ads-transparency.json` | `solidcode/ads-transparency-scraper` | ~US$ 0,08 | PAGO Google/YT — **só busca por ANUNCIANTE/domínio**, nunca por tema |
| `instagram-busca.json` | `apify/instagram-search-scraper` | ~US$ 0,14 | Descoberta por termo (`popular` = já ranqueado pelo IG) |
| `instagram-hashtag.json` | `apify/instagram-scraper` | ~US$ 0,14 | Posts de hashtag com filtro de data |
| `instagram-comentarios.json` | `apify/instagram-scraper` | ~US$ 0,08/30 | FASE 2: comentários SÓ dos posts vencedores |
| `instagram-perfil-concorrente.json` | `krazee_kaushik/instagram-profile-posts-and-comments-scraper` | ~US$ 0,05 só posts; **~US$ 0,24 com 15 comments/post** | Espionar perfis (mais barato). `includeComments` default false — ligar só na Fase B |
| `facebook-busca.json` | `scraper_one/facebook-posts-search` | ~US$ 0,10 | Busca por keyword em todo o FB (`top`) — máx 2-4 keywords/DIA |
| `facebook-paginas-posts.json` | `apify/facebook-posts-scraper` | ~US$ 0,25 | Profundidade: média da página → outliers 3-5x |
| `facebook-descobrir-paginas.json` | `apify/facebook-search-scraper` | ~US$ 0,33/25 | 1x por nicho; campo `adStatus` = página roda ads |
| `youtube-busca.json` | `streamers/youtube-scraper` | ~US$ 0,20 | Busca por termo com subscribers do canal (outperformer ratio) |
| `reddit-busca-br.json` | `harshmaur/reddit-scraper` | ~US$ 0,08 | Keyword pt-BR GLOBAL (sem restringir sub), top do ano |
| `reddit-busca-en.json` | `harshmaur/reddit-scraper` | ~US$ 0,08 | Keyword EN SEMPRE com `withinCommunity` (sub de nicho) — global retorna lixo |
| `reddit-comentarios.json` | `harshmaur/reddit-scraper` | ~US$ 0,02/thread | FASE 2: `startUrls` = URLs dos threads vencedores + `crawlCommentsPerPost` |
| `reddit-top-subs.json` | `automation-lab/reddit-scraper` | ~US$ 0,06 | Top mensal de subs EN validados (antecipam o BR em 6-18 meses) |

## v2 — Profundidade (o minério)

| Template | Actor | Custo típico | Papel |
|---|---|---|---|
| `meta-ads-pagina.json` | `curious_coder/facebook-ads-library-scraper` | ~US$ 0,04-0,15/anunciante | **Varredura por página**: TODOS os ads ativos de um anunciante (URL com `view_all_page_id=<page_id>`); base da vigília [6] |
| `meta-ads-transcript.json` | `steadyfetch/facebook-ads-transcript-scraper` | US$ 0,02/ad (+0,005/min >3min) | **Roteiro do ad**: `hook3s` + `transcript` + `ctaText`; usar `video_sd_url` FRESCO (expira!); não cobra URL expirada/sem áudio |
| `video-transcript-fallback.json` | `viralanalyzer/video-transcriber` | US$ 0,025/min | Fallback universal (fbcdn/YT/TikTok/IG via whisper); COBRA vídeo sem fala |
| `instagram-transcript.json` | `apple_yang/instagram-transcripts-scraper` | ~US$ 0,0055/reel | Reels (máx 5 URLs/run, <3 min) |
| `youtube-comentarios.json` | `streamers/youtube-comments-scraper` | US$ 0,90/1000 | Voz do avatar em volume (campo `startUrls`, `sortCommentsBy: TOP_COMMENTS`) |
| `facebook-comentarios.json` | `apify/facebook-comments-scraper` | US$ 1,40/1000 | Comments de reels/posts públicos (onde o 40+ escreve parágrafo) |
| `amazon-reviews.json` | `axesso_data/amazon-reviews-scraper` | US$ 0,90/1000 | Reviews de quem PAGOU (`domainCode: com.br`; ~100/produto máx) |
| `funil-wcc.json` | `apify/website-content-crawler` | ~US$ 0,01-0,05/página | LP/advertorial em markdown+html (SEMPRE `maxCrawlPages: 1`) |
| `funil-screenshot.json` | `leadsbrary/screenshot-html-file-from-url` | ~US$ 0,005/página | PNG full-page + HTML do funil (arquivo visual) |
| — (grátis) | `uvx yt-dlp` + `bin/vtt2txt.py` | US$ 0,00 | Roteiro de qualquer vídeo YT via legendas auto pt |
| — (grátis) | lib pip `google-play-scraper` | US$ 0,00 | Reviews de apps de dieta/jejum pt-BR |
| — (grátis) | skill `/watch` | tokens | ASSISTIR vídeo (hook visual, formato, prova em cena) |

**Status de validação (2026-07-18):** RODADOS E OK — `meta-ads-library`, `meta-ads-pagina`
(30 ads da página Lays), `meta-ads-transcript` (2 roteiros pt perfeitos), `youtube-busca`,
`youtube-comentarios` (60 comments; campo é `startUrls`, NÃO videoUrls),
`instagram-hashtag`, `facebook-busca`, `reddit-busca-br/en` (schema via API), yt-dlp grátis
(roteiro de 2.852 palavras do viral da Tatiana). **Nunca rodados** — `meta-ads-library-alt`,
`google-ads-transparency`, `instagram-comentarios`, `instagram-perfil-concorrente`,
`instagram-transcript`, `facebook-paginas-posts`, `facebook-descobrir-paginas`,
`facebook-comentarios`, `amazon-reviews`, `funil-wcc`, `funil-screenshot`,
`video-transcript-fallback`, `reddit-comentarios`, `reddit-top-subs` — validar cada um com
run de US$ 0,02-0,05 antes de rodada grande. `google-ads-transparency.json` fixa
`platform: youtube`; use `platform: ""` para TODOS os formatos Google.

## Cuidados de custo (aprendidos na pesquisa, não pular)

- `curious_coder`: pode entregar até +30 itens acima do limite (cobra por item entregue).
  **Piso de 10:** `count` < 10 aborta o run com `"Maximum charged results" option must be
  atleast 10` (o dataset traz 1 item só com o campo `error`). Validado em 2026-07-21.
- `solidcode`: `maxResults=0` = ILIMITADO — sempre 50.
- Comentários são faturados como resultado (IG, Reddit, krazee) → **2 fases sempre**.
- `harshmaur`/`trudax`: `maxPostsCount` é POR termo de busca, não total.
- `apify/facebook-posts-scraper`: `onlyPostsNewerThan` é add-on cobrado por post.
- `streamers`: datas podem vir relativas ("2 weeks ago") — normalizar antes de pontuar.
- `krazee_kaushik`: defaults de comments (100/post) custam US$ 2,60/run — sempre 15-20.

## Aprendizados do smoke test (2026-07-16, 5 plataformas, ~US$ 0,10)

- **Memória:** vários actors exigem memória proporcional ao input (curious_coder: 1 URL por
  512MB; harshmaur recusa 1GB para input pequeno). O runner usa **512MB por default** — só
  suba (`--memory 1024`) com 2+ URLs no curious_coder.
- **`apify/instagram-search-scraper` está sendo bloqueado pelo IG** (2 runs FAILED seguidas,
  custo zero; input CONFERIDO contra o schema oficial — `searchType: popular` é válido, o
  bloqueio é real). Rota por hashtag funciona, mas retorna posts RECENTES (2-6 likes), não
  top — IG serve para espionar perfis (via `page_name` da Ad Library → handle) e minerar
  comentários, não para descoberta viral.
- **Reddit EN sem restrição de sub retorna lixo** (top do ano de r/cats casando com a busca).
  EN → sempre restringir aos subs de nicho; pt-BR → global funciona (achou r/MenopausaFeliz).
- **Meta Ads entrega o sinal na primeira run:** anunciante com 7 variações do mesmo desafio
  ativas há 39-69 dias + um ad rodando há 770 dias (control) já apareceram com 10 itens.
- **YouTube:** 1º item pode vir null (descartar); ratio views/inscritos funciona direto.
- **Facebook:** texto do post vem em `postText`; shares presentes (top: 134 shares).

## Subreddits validados (existem e ativos)

EN: r/Menopause · r/Perimenopause · r/loseit · r/intermittentfasting · r/fasting · r/CICO ·
r/xxfitness · r/WeightLossAdvice · r/Nootropics · r/Biohackers · r/AskWomenOver40
PT-BR: r/brasil · r/desabafos (subs de nicho pt-BR são mortos — buscar por keyword global
sem restringir subreddit; testar variações sem acento).
