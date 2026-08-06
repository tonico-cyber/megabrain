# INSTALAÇÃO — passo a passo

> Para copywriter. Você não precisa saber programar. Se travar em algum passo, chame o Nicolas
> com o print da tela.

---

## ⚡ JÁ TEM O CLAUDE CODE INSTALADO? São 3 comandos.

Abra o Terminal (Mac: `⌘ + espaço`, digite `terminal`) e cole um de cada vez:

```bash
cd ~/Documents
```
```bash
git clone https://github.com/tonico-cyber/megabrain.git
```
```bash
cd megabrain
```

Agora abra o Claude **de dentro da pasta**:

```bash
claude
```

E rode:

```
/fabrica
```

**Confira se funcionou:** digite `/` e o `/fabrica` tem que aparecer na lista. Se não aparecer,
você abriu o Claude na pasta errada — rode `cd ~/Documents/megabrain` e abra de novo.

> **Por que a pasta importa:** é ela que carrega a régua da casa, o swipe com os 102 anúncios
> vencedores, os Brand Contexts e os comandos. Fora dela o Claude vira um Claude comum e escreve
> copy genérica — **sem avisar que está fazendo isso**.

Pule para **PARTE 4** se quiser ver o fluxo do dia a dia. O resto abaixo é só para quem ainda
não tem o Claude Code.

---

# PARTE 1 — Abrir o Terminal *(quem já tem o Claude Code pode pular para a PARTE 4)*

Tudo aqui é digitado no **Terminal** (Mac) ou **PowerShell** (Windows).

**No Mac:** aperte `⌘ + espaço`, digite `terminal`, dê Enter.
**No Windows:** aperte a tecla Windows, digite `powershell`, dê Enter.

Vai abrir uma janela preta ou branca com texto. É ali que você digita os comandos abaixo —
**um por vez**, apertando Enter depois de cada um.

> Quando o comando terminar e aparecer o cursor piscando de novo, pode digitar o próximo.

---

# PARTE 2 — Instalar o que precisa (só na primeira vez)

## Passo 1 — Verificar se você já tem o Node

Cole e dê Enter:

```bash
node --version
```

- **Apareceu algo tipo `v20.x` ou `v22.x` ou maior** → ✅ pule para o Passo 2
- **Apareceu "command not found"** → instale o Node:
  - Vá em **https://nodejs.org** → baixe a versão **LTS** → instale como qualquer programa
  - **Feche o Terminal e abra de novo**, e teste `node --version` outra vez

## Passo 2 — Verificar o Git

```bash
git --version
```

- **Apareceu `git version 2.x`** → ✅ pule para o Passo 3
- **Mac, apareceu uma janela pedindo pra instalar** → clique em Instalar e espere
- **Windows, deu erro** → baixe em **https://git-scm.com/download/win** e instale (pode dar
  "Next" em tudo)

## Passo 3 — Instalar o Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Vai demorar 1-2 minutos e imprimir bastante coisa. Quando terminar, confira:

```bash
claude --version
```

Tem que aparecer um número de versão. Se aparecer "command not found", **feche o Terminal, abra
de novo** e teste outra vez.

> **Se der erro de permissão** (`EACCES`), rode isto e depois repita a instalação:
> ```bash
> mkdir -p ~/.npm-global && npm config set prefix ~/.npm-global && echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc && source ~/.zshrc
> ```

---

# PARTE 3 — Baixar o Megabrain

## Passo 4 — Clonar o repositório

Cole os três comandos, **um de cada vez**:

```bash
cd ~/Documents
```

```bash
git clone https://github.com/tonico-cyber/megabrain.git
```

```bash
cd megabrain
```

Confira se deu certo:

```bash
ls
```

Você deve ver: `README.md`, `copymf`, `docs`. Se viu, está no lugar certo.

> A pasta ficou em **Documentos → megabrain**. Você pode abrir no Finder/Explorer normalmente
> para ler os arquivos.

---

# PARTE 4 — Rodar

## Passo 5 — Abrir o Claude Code dentro da pasta

**Este é o passo mais importante de todos.**

```bash
claude
```

⚠️ **Tem que ser de dentro da pasta `megabrain`.** É isso que faz o Claude carregar a régua da
casa, o swipe, os Brand Contexts e os comandos. Se você abrir o Claude em qualquer outra pasta,
nada disso existe e ele vai escrever copy genérica.

**Na primeira vez** ele vai pedir para você entrar na sua conta Claude — segue o que aparecer na
tela (abre o navegador, você loga, volta).

## Pronto. Agora digite:

```
/fabrica
```

Ele vai perguntar qual funil, quantas peças e quem grava na semana. Depois monta a lista de
coordenadas de cada anúncio, mostra para você aprovar, e só então escreve.

---

# NO DIA A DIA

Toda vez que for trabalhar:

```bash
cd ~/Documents/megabrain
git pull
claude
```

O `git pull` traz as atualizações do time (metodologia nova, vencedores novos no swipe).
São 3 linhas — vale criar um atalho mental.

## Os comandos disponíveis

| Comando | Quando usar |
|---|---|
| `/fabrica` | **produzir um lote de N anúncios** — é o principal |
| `/copymf` | peça única, VSL, ou revisar uma copy pronta |
| `/pesquisamf` | pesquisar tema/ângulo antes de produzir |

---

# ANTES DE PRODUZIR PELA PRIMEIRA VEZ

Leia, nesta ordem (1 hora, economiza semanas):

1. `copymf/fabrica/ONBOARDING.md` — como usar, vocabulário, dúvidas comuns
2. `copymf/fabrica/PADRAO-DE-ESCRITA.md` — como a copy da casa soa (é o que mais reprova)
3. `copymf/fabrica/COORDENADAS.md` — segmentos, ângulos, formatos, porta-voz

E imprima o `copymf/fabrica/MESA-SEGUNDA.md`.

---

# SE DER PROBLEMA

| O que aconteceu | O que fazer |
|---|---|
| `command not found: claude` | Feche o Terminal e abra de novo. Se persistir, refaça o Passo 3. |
| `command not found: npm` | Você pulou o Passo 1 — instale o Node. |
| `/fabrica` não aparece na lista | Você não está dentro da pasta. Rode `cd ~/Documents/megabrain` e abra o `claude` de novo. |
| O Claude escreve copy genérica, sem citar o mecanismo | Mesma coisa: pasta errada. Confira com `pwd` — tem que terminar em `/megabrain`. |
| `Permission denied` no npm | Rode o comando do quadro cinza do Passo 3 e repita. |
| Pede senha ao clonar | O repositório é público, não deveria pedir. Confira se copiou o endereço certo. |

**Comando para conferir se está tudo certo** (rode de dentro da pasta):

```bash
pwd && ls copymf/fabrica/
```

Deve mostrar um caminho terminando em `/megabrain` e listar `SISTEMA.md`, `COORDENADAS.md`,
`swipe.json`, entre outros.
