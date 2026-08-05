# COORDENADAS — a tabela canônica de códigos

> **Fonte única de verdade da nomenclatura.** Todo anúncio da casa é identificado por estas
> coordenadas, e a mesma string vai em 4 lugares: arquivo de roteiro · arquivo de vídeo · nome do
> anúncio no Meta · UTM.
>
> Se você inventar um código que não está aqui, o ledger não fecha e o sistema fica cego.

## A string

```
<FUNIL><NN> · S<seg> · NC<P|S> · A<ang> · F<fmt> · <PORTA-VOZ> · g<gêmea>
```

Exemplo real: `M40+21 · S01 · NC-P · A10 · F-H1 · EXP · gD3FSER058`

---

## 1. FUNIL — prefixo do código

| Prefixo | Funil |
|---|---|
| `M40+` | Programa Mulher 40+ (Suéllen Lopes) |
| `D3F` | Dieta das 3 Fases (Eduardo Claas) |
| `J20` | Jejum 2.0 (Lucas Mallmann) |
| `UI` | Ultra Inteligência (Marcelo Roxo) |
| `FDV` | Frequências da Vida (Zayka Capita) |

Numeração contínua por funil, nunca reinicia. M40+ está em **40** — a próxima peça é `M40+41`.

---

## 2. NC — Nível de consciência

| Código | Nome | O que a pessoa está sentindo | Serve para |
|---|---|---|---|
| **NC-P** | Problema | sente o sintoma, não conhece a causa | volume, topo de funil |
| **NC-S** | Solução-existente | já está tentando algo do mercado (chá, caneta, low carb, caminhada) | **venda** — intenção maior |

> Regra de leitura: **Problema traz volume, Solução traz venda.** Um lote saudável tem os dois.

---

## 3. SEGMENTOS — a dor de que a peça fala

### Programa Mulher 40+ (`M40+`)

| Código | Segmento-mãe | Subsegmentos para hook |
|---|---|---|
| **S01** | Peso e composição corporal | balança travada há meses · come igual e engorda · gordura localizada (culote, braço, papada) · corpo murcho depois de emagrecer · efeito sanfona |
| **S02** | Menopausa / hormonal | ganho de peso na peri/menopausa · fogacho · insônia · irritabilidade |
| **S03** | Metabólico e exames | glicose subindo / pré-diabetes · colesterol e triglicérides · gordura no fígado · pressão alta · **exames normais mas sente algo errado** |
| **S04** | Energia e disposição | cansaço que sono nenhum resolve · sem energia para rotina, trabalho, netos |
| **S05** | Fome, compulsão e comida | compulsão à noite · vontade de doce · fome descontrolada pós-dieta (leptina) |
| **S06** | Caneta e frustração fitness | perdeu músculo com a caneta e reganhou · gastou ~R$1.800/mês e voltou tudo · treinou e dietou sem sair do lugar |
| **S07** | Libido e vida sexual | libido baixa · autoestima afetando a intimidade |
| **S08** | Autoestima e imagem | roupa que não fecha (provador) · foge de foto · não se reconhece no espelho |
| **S09** | Dores e articulações | dor articular / inflamação · rigidez e indisposição |
| **S10** | Barreiras (objeção virada gancho) | sem tempo · sem disciplina / odeia treinar · vida social · vegetariana · "é da idade / é da menopausa" |

> Para os outros funis, criar a mesma tabela no respectivo `brands/<slug>.md` antes de produzir.
> **Sem segmentos numerados, o funil não entra na fábrica.**

---

## 4. ÂNGULOS — o frame narrativo

> **Lista canônica reconciliada.** A01–A20 vêm de `angulos/biblioteca.md`; A21–A29 foram
> acrescentados a partir da lista de trabalho do Nicolas (jul/2026). **Não existe outra lista.**
> Ângulo ≠ hook: o mesmo ângulo gera 5-10 hooks trocando avatar, cenário e formato.

| # | Ângulo | Lógica em uma linha |
|---|---|---|
| **A01** | Novo Mecanismo | ele falhou porque atacava a causa errada; existe uma causa-raiz que ninguém contou |
| **A02** | Inimigo Comum / Vilão Externo | tira a culpa do avatar e põe em algo externo (indústria, alimento, conselho) |
| **A03** | Contrarian | ataca de frente algo que o avatar acredita ser correto |
| **A04** | Erro / "você está fazendo errado" | o avatar está quase certo, só comete 1-3 erros específicos |
| **A05** | História Pessoal / Fundo do Poço | fundo do poço → descoberta → virada, em 1ª pessoa |
| **A06** | Identificação / Call-out | nomeia o avatar e a situação exata dele nos 3 primeiros segundos |
| **A07** | Curiosidade Específica | o "truque estranho", o detalhe que não fecha |
| **A08** | Medo / Sinal de Alerta | alerta sobre um perigo que pode piorar rápido |
| **A09** | Prova Social / Fenômeno em Massa | "todo mundo está fazendo / X mil pessoas" |
| **A10** | Demonstração / Antes-e-Depois | prova visual, comparação lado a lado |
| **A11** | Us vs. Them / Conspiração suave | alguém lucra com a sua falha |
| **A12** | Autoridade Revela | especialista conta o que a categoria dele não conta |
| **A13** | Objeção Invertida | "mesmo que você já tenha tentado tudo…" |
| **A14** | Custo da Inação | a matemática da dor: o que acontece se continuar assim |
| **A15** | Estado Final / Dream Outcome | um dia na vida de quem já resolveu |
| **A16** | Desafio / Experimento | "testei por 30 dias" · "faça isso e veja" |
| **A17** | Descoberta Casual / Fofoca | recomendação de amiga, conversa flagrada |
| **A18** | Pergunta / Autodiagnóstico | teste de 5 segundos que a pessoa faz agora |
| **A19** | Novidade / News-jacking | tendência nova, o que está acontecendo agora |
| **A20** | Comparação / "X vs. Y" | dois métodos frente a frente |
| **A21** | Promessa | afirmação ousada do resultado desejado |
| **A22** | Paradoxo | ideia contraintuitiva ("quanto mais você corta, mais engorda") |
| **A23** | Mistério Científico | descoberta científica de que ninguém está falando |
| **A24** | Carta Secreta | documento/mensagem que não deveria ter vazado |
| **A25** | Transformação Relâmpago | mudança absurda em tempo curto, desafiando expectativa |
| **A26** | Herói Inesperado | a solução veio de um lugar improvável |
| **A27** | Tradição Esquecida | técnica antiga deixada de lado pela modernidade |
| **A28** | A Verdade Crua | algo duro e desconfortável que poucos têm coragem de dizer |
| **A29** | Estudo de Caso Estranho | alguém resolveu de um jeito inesperado |

**Mapa rápido por nível de consciência:**
- **Inconsciente:** A06 · A08 · A18 · A23 · A26
- **NC-P (problema):** A01 · A02 · A04 · A10 · A14 · A22 · A28
- **NC-S (solução-existente):** A03 · A13 · A20 · A16 · A29
- **Cético:** A01 · A11 · A13 · A16 · A24

---

## 5. FORMATOS — o recipiente

Códigos completos em `formatos/catalogo.md` (43 formatos em 7 blocos por porta-voz).
Referência rápida dos blocos:

| Bloco | Porta-voz do bloco | Códigos |
|---|---|---|
| **A** | Especialista do programa | A1 talking head · A2 green screen · A3 whiteboard · A4 corte de podcast · A5 micro-aula · A6 resposta a comentário · A7 sabatina · A8 bastidor · A9 story pessoal |
| **B** | Autoridade endossante | B1 cético convertido · B2 reação green screen · B3 profissional como paciente · B4 sabatina invertida · B5 painel · B6 confissão de categoria · B7 bastidor de hospital |
| **C** | Cliente / UGC | C1 depoimento · C2 descoberta · C3 tour de área de membros · C4 vlog/diário · C5 duet/reação · C6 vox pop · C7 selfie confissão |
| **D** | Fundador do método | D1 carta em vídeo · D2 "por que criamos" · D3 aviso/apology · D4 founder story |
| **E** | Ator contratado | E1 talking head roteirizado · E2 sketch · E3 jornalístico · E4 testemunho dramatizado |
| **F** | Voiceover sem rosto | F1 documentário · F2 stick figure · F3 motion graphics · F4 screen recording · F5 slideshow · F6 whiteboard animado · F7 compilação de notícias · F8 silent ad · F9 avatar de IA |
| **G** | Híbridos | G1 microlead→VSL · G2 hook com rosto + corpo VO · G3 VO + depoimentos costurados |

### Formatos novos validados em produção (jul/2026) — bloco H

Criados durante a produção do M40+ e ainda **não** incorporados ao `catalogo.md` original:

| Código | Formato | Descrição | Custo | Escala | NC |
|---|---|---|---|---|---|
| **H1** | Tela dividida | rosto falando + prova visual (antes/depois) lado a lado | 🟢 | alta | P |
| **H2** | Videochamada entre amigas | UI real de WhatsApp/FaceTime, PIP, contador quebrado, legenda automática com errinho, imagem travando | 🟢 | alta | P/S |
| **H3** | Animação Pixar (jornada do herói) | 7 cenas: 3 dores sociais → colapso → amiga-mensageira → virada espelhada 1:1 → boca a boca + escassez | 🟡 | média | P |
| **H4** | Marionete narrada | bonecos com fios visíveis, narrador em 3ª pessoa (novelinha), legenda word-by-word gigante | 🟡 | média | P |
| **H5** | Entrevista de rua / vox pop | repórter com microfone aborda a avatar na calçada; edição nativa, legenda clean | 🟡 | média | P/S |
| **H6** | Receita / cozinha | especialista preparando algo (chá, café da manhã) enquanto explica | 🟢 | alta | S |
| **H7** | Caixinha de perguntas | pergunta de seguidora na tela, especialista responde | 🟢 | muito alta | S |
| **H8** | Walk and talk | especialista caminhando, celular na mão | 🟢 | alta | P/S |

> **H2 (videochamada) e H4 (marionete) são os mais promissores** por funcionarem mudos — a
> legenda queimada carrega a peça inteira, e a maioria do feed roda sem som.

---

## 6. PORTA-VOZ — quem fala

| Código | Quem | Gargalo | Escala |
|---|---|---|---|
| **EXP** | o próprio especialista do funil | agenda dele (~1 sessão/semana) | limitada |
| **END** | alguém **endossando o especialista e o método** (médico chancelando a Suéllen e o B.A.M., ator, aluna) | casting + cachê | média |
| **VO** | voice over — ninguém aparece | nenhum | **alta** |
| **ANI** | animação (Pixar, marionete, motion, avatar de IA) | tempo de produção | alta |

**Mix default num lote de 20:** 8 EXP · 3 END · 6 VO · 3 ANI.

---

## 7. GÊMEA — o que está sendo modelado

Prefixo `g` + o ID da peça no swipe. Ex.: `gD3FSER069`, `gJ20PIG015`, `gWarriorBabe-Ad1`.

**Sem gêmea a peça não entra na fila** — exceto na cota de wild card, que usa `gWILD`.

---

## Checklist antes de fechar uma linha da Ordem de Produção

- [ ] O código do funil e o número sequencial estão certos?
- [ ] O segmento existe na tabela do funil?
- [ ] O NC está declarado (P ou S)?
- [ ] O ângulo está entre A01 e A29?
- [ ] O formato existe no catálogo (A1–G3) ou no bloco H?
- [ ] O porta-voz é EXP, END, VO ou ANI?
- [ ] A gêmea está nomeada?
- [ ] O **ID de dispersão** contra as peças já no ar é ≥ 4?
