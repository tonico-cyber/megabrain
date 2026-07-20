# copymf/pesquisa — Workspace do /pesquisamf

Pesquisa de conteúdo comprovado ANTES de escrever copy. O `/pesquisamf` coleta sinais
pagos (Meta Ad Library, Google Ads Transparency) e orgânicos (Instagram, Facebook,
YouTube, Reddit) via Apify, aplica a régua de comprovação e entrega um **dossiê por
marca** que alimenta a ideação do `/copymf`.

## Estrutura

```
pesquisa/
├── README.md            # este arquivo
├── .env                 # APIFY_TOKEN=... (chmod 600 — NUNCA versionar/compartilhar)
├── bin/
│   └── apify_run.py     # runner genérico com trava de custo
├── actors/              # inputs-modelo por plataforma (JSON, editar as queries)
└── <slug>/              # por marca (mesmo slug de brands/)
    ├── AAAA-MM-DD-plano-busca.md    # matriz de queries aprovada
    ├── inputs/                       # templates copiados de actors/ e editados p/ a rodada
    ├── raw/                          # JSONs brutos de cada run (retenção Apify = 7 dias!)
    └── AAAA-MM-DD-dossie-<n>.md     # entregável: temas comprovados + evidências
```

## Runner — uso

```bash
python3 bin/apify_run.py curious_coder/facebook-ads-library-scraper input.json \
  --out <slug>/raw/2026-07-16-meta-ads-menopausa.json --max-cost 0.10
```

Travas embutidas (plano FREE = US$ 5/mês):

| Trava | Default | O que faz |
|---|---|---|
| `--budget-ceiling` | 4.50 | Aborta ANTES de rodar se o uso mensal da conta já passou disso |
| `--max-cost` | 0.30 | Aborta o run se o custo reportado passar disso (MELHOR ESFORÇO: o custo é creditado em lotes, pode estourar alguns centavos) |
| `--timeout` | 600s | Aborta run pendurado |

O custo real de cada run sai no stderr (`custo US$ X`). Tetos da casa (v2 "Pesquisa
Forte"): **varredura rápida ≤ US$ 0,50 · rodada completa com profundidade ≤ US$ 2,50 ·
vigília semanal ≤ US$ 0,50** — acima disso, aprovação explícita antes. Sempre salvar raw E
criativos localmente na mesma sessão (retenção FREE = 7 dias; URLs de vídeo do fbcdn
expiram em horas-dias).

## Assistir vídeos — /watch (padrão da casa)

Vídeo vencedor se ASSISTE antes de entrar no dossiê — hook, formato de gravação e tipo
de prova não existem em thumbnail/título. A skill `/watch` (plugin `watch@claude-video`,
código auditado antes da instalação) baixa o vídeo com yt-dlp, extrai frames com ffmpeg
e transcreve via legendas nativas (Whisper opcional).

- **Quando:** Passo 6A do `/pesquisamf` (roteiros dos vencedores, a "Fase C") — só os
  top 3-5 vídeos por tema P1/P2 + todo control, DEPOIS do score. Assistir é resultado
  faturado (em tokens), mesma disciplina do resto da profundidade (Passo 6).
- **Como:** `/watch <url> [pergunta]`. Padrão `--detail transcript` (hook + estrutura,
  quase grátis); `efficient`/`balanced` só quando precisar ver a tela (formato, prova,
  texto on-screen). Ads da Ad Library: preferir o criativo já baixado em
  `<slug>/swipes/<ad_archive_id>.mp4` (URLs do fbcdn expiram em horas-dias); a
  `video_hd_url` do raw só serve na mesma sessão do run.
- **Config:** `~/.config/watch/.env` (chmod 600, mesma regra do token Apify). Sem chave,
  vídeos sem legenda voltam frames-only; `GROQ_API_KEY` habilita Whisper (Groq tem tier
  free — console.groq.com/keys).

## Segurança

- O token vive só em `.env` (chmod 600). Não colar em chats, docs ou comandos.
- Token exposto? Rotacionar em https://console.apify.com/settings/integrations.
