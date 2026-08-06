# COMEÇANDO — guia para o copywriter

> Você vai rodar a fábrica de ads do MeuFluxo no seu próprio Claude, no seu computador.
> Leva 10 minutos para instalar. Depois disso é um comando.

---

## 1. Instalar (uma vez só)

**Você precisa de:** [Claude Code](https://claude.com/claude-code) instalado e o `git`.

```bash
# 1. Baixa o repositório
git clone https://github.com/tonico-cyber/megabrain.git

# 2. Entra na pasta
cd megabrain

# 3. Abre o Claude Code AQUI DENTRO
claude
```

**O passo 3 é o que importa.** O Claude Code carrega automaticamente os comandos e as skills que
estão dentro da pasta — então rodar de dentro do `megabrain` já te dá tudo: a régua da casa, o
swipe, os Brand Contexts, os formatos, os ângulos.

Se você abrir o Claude em outra pasta, nada disso aparece.

---

## 2. Usar

Dentro do Claude Code, digite:

```
/fabrica
```

Ele vai perguntar:
1. **Qual funil** (Mulher 40+, Dieta das 3 Fases, Jejum 2.0, Ultra Inteligência)
2. **Quantas peças** (o padrão é 20)
3. **Quem grava esta semana** (o especialista? ator? só voice over? animação?)

Aí ele monta a **Ordem de Produção** — a tabela com as coordenadas de cada uma das 20 peças — e
**mostra para você aprovar antes de escrever**. Você ajusta o que quiser. Depois ele escreve as
20, passa pelos gates de qualidade e entrega em blocos prontos para copiar.

### Outros comandos que já existem

| Comando | Quando usar |
|---|---|
| `/fabrica` | **produzir um lote de N anúncios** — é o principal |
| `/copymf` | peça única, VSL, ou revisar uma copy pronta |
| `/pesquisamf` | pesquisar tema/ângulo antes de produzir (Gate 0) |

---

## 3. Antes da primeira vez, leia isto

**Três documentos, nesta ordem.** Uma hora de leitura que economiza semanas:

1. **`copymf/fabrica/PADRAO-DE-ESCRITA.md`** — como a copy da casa soa. É o que mais reprova.
2. **`copymf/fabrica/COORDENADAS.md`** — o vocabulário: segmentos, ângulos, formatos, porta-voz.
3. **`copymf/fabrica/SISTEMA.md`** — a metodologia inteira.

E deixe **`copymf/fabrica/MESA-SEGUNDA.md`** impresso do lado do computador.

---

## 4. As 5 coisas que você precisa ter na cabeça

**1. Não se cria copy do zero.** Toda peça modela um anúncio que já funcionou — uma "gêmea" do
swipe. São 102 peças validadas em `copymf/swipe-file/`, das quais 69 servem de modelo (as outras
33 venceram por mídia, não por copy — o sistema não deixa você usar essas).

**2. Cada anúncio é um anúncio inteiro.** Hook novo **e** corpo novo. **Nunca** o mesmo anúncio
com abertura trocada. Se o pedido é 20, são 20 anúncios diferentes.

**3. Duas peças que sobem juntas precisam estar longe uma da outra.** O algoritmo da Meta entrega
anúncios parecidos para as mesmas pessoas — se as nossas peças forem próximas, elas brigam entre
si no leilão. Por isso existe o Índice de Dispersão, e por isso **escrever um corpo diferente não
é suficiente**: a diferença tem que estar nas coordenadas (dor, nível de consciência, formato,
porta-voz).

**4. Todo número tem fonte.** Sai do Brand Context ou de fonte primária que alguém abriu.
**Nunca** de um swipe de concorrente — número de concorrente pode ser inventado, e ao copiar a
gente importa o problema dele.

**5. Quem julga não é quem escreveu.** Peça sua sempre passa pelo olho de outra pessoa antes de ir
para gravação.

---

## 5. O vocabulário (decore só isto)

| Termo | O que é |
|---|---|
| **Gêmea** | o anúncio vencedor que você está modelando |
| **Corpo** | o argumento: vilão + causa → efeito + analogia + método + prova + CTA |
| **Segmento** | a dor de que a peça fala (S01, S02… — muda por funil) |
| **NC** | nível de consciência: **P** (sente o sintoma) ou **S** (já está tentando algo do mercado) |
| **Ângulo** | o frame narrativo (A01 a A29) |
| **Formato** | o recipiente: green screen, cozinha, videochamada, animação… (A1 a H8) |
| **Porta-voz** | quem fala: **EXP** especialista · **END** alguém endossando ele · **VO** voice over · **ANI** animação |
| **ID** | Índice de Dispersão — o quanto duas peças se afastam. Precisa ser ≥ 4 |

> **Problema traz volume. Solução traz venda.** Um lote saudável tem os dois.

---

## 6. Dúvidas comuns

**"O Claude inventou um número/case que eu não conheço."**
Não aceite. Pergunte de onde veio. Se não estiver no Brand Context, corta. Esse é o Gate 2 e é o
que mais protege a casa.

**"A peça ficou boa mas soou robótica."**
Provavelmente é staccato em diálogo — frase curta, ponto, frase curta. Peça para emendar a fala.
Está explicado no `PADRAO-DE-ESCRITA.md`, item 1. É o defeito mais comum.

**"Duas peças ficaram parecidas."**
Peça para recalcular o Índice de Dispersão. Se der menos de 4, troque o formato de uma delas —
é o ajuste mais barato e já resolve.

**"Posso usar em vez do Claude Code?"**
O Claude Code é o caminho que funciona sem configurar nada, porque ele lê a pasta do projeto
sozinho. Em outras interfaces você teria que anexar os arquivos à mão a cada conversa —
funciona, mas dá trabalho e é fácil esquecer um.

**"Fiz mudanças, como mando pro time?"**
Fale com o Nicolas antes. Os arquivos de metodologia são compartilhados — mudança neles afeta
todo mundo.

---

## 7. Para se manter atualizado

De tempos em tempos, dentro da pasta:

```bash
git pull
```

Isso traz as atualizações de metodologia, novos vencedores no swipe e ajustes nas coordenadas.
