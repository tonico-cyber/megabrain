# COORDENADAS — a tabela canônica de códigos

> 🤖 **Versão para sistema:** `coordenadas.json` — mesmo conteúdo, estruturado para consumo por
> software. É de lá que a ferramenta interna deve ler, não deste markdown.

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

> Os códigos estão gravados dentro de cada `brands/<slug>.md`, na seção Segmentos. Aqui é a visão agregada.

### D3F — dieta-das-3-fases

*A zonulina elevada abre o intestino (permeável) e gera inflamação subclínica que dispara cortisol e insulina e trava o emagrecimento — o Protocolo S.E.R. (Silenciar, Expurgar, Recolonizar) com o Suco Enzimático Natural recoloniza a microbiota (Akkermansia) e reativa a produção NATURAL de GLP-1, o que as canetas imitam de forma sintética.*

| Código | Segmento-mãe | Subsegmentos |
|---|---|---|
| **S01** | Peso e gordura | balança travada mesmo comendo certo e se exercitando · emagrece pouco e volta tudo (às vezes mais) · corpo "travado", metabolismo que não responde · gordura localizada que não sai · efeito sanfona de anos de dieta |
| **S02** | Intestino, inchaço e digestão (núcleo do mecanismo) | barriga incha mesmo comendo pouco · intestino preso ou solto / desregulado · gases, distensão, sensação de fermentação · retenção de líquido |
| **S03** | Energia e sono | acordar cansada, sem energia · cansaço que não passa · insônia / sono ruim |
| **S04** | Menopausa / hormonal | ganho de peso na peri/menopausa · fogacho / calorão · oscilação de humor / irritabilidade |
| **S05** | Metabólico (glicemia, pressão, colesterol) | glicose alta / pré-diabetes / diabetes · colesterol no limite · pressão alta · gordura no fígado |
| **S06** | Inflamação e dor crônica | dores pelo corpo / fibromialgia · inflamação subclínica / inchaço geral · rigidez e indisposição |
| **S07** | Autoimune e tireoide | hipotireoidismo / Hashimoto que não melhora · tomou remédio de tireoide/insulina e não emagreceu · suspeita de causa autoimune ligada ao intestino |
| **S08** | Pele, cabelo e unhas | queda de cabelo · pele sem viço / envelhecimento · unhas fracas — sinais de má absorção |
| **S09** | Fertilidade | dificuldade de engravidar ligada a inflamação e peso · SOP (ovário policístico) travando a gravidez · ciclos irregulares associados ao intestino/inflamação |
| **S10** | Libido e vida sexual | libido baixa / falta de desejo · disposição e autoestima afetando a intimidade |
| **S11** | Caneta e remédios | usa ou pensou em Ozempic/Mounjaro; medo de efeitos e custo · medo de depender da caneta pra sempre · quer o "GLP-1 natural" no lugar do sintético |
| **S12** | Saúde da jovem | TPM forte · acne / pele · inchaço e intestino desregulado desde cedo |
| **S13** | Fracassos anteriores e descrença | já tentou low carb, jejum, sopa, shake, chá, contagem de caloria — nada durou · academia sem resultado na balança · "já tentei de tudo, nada funciona comigo" |

### J20 — jejum-2-0

*Vilão: pâncreas hiperativo sufocado por células zumbi (senescentes) → mantém insulina sempre alta e o glucagon zerado, então a gordura nunca é queimada (fígado gordo → resistência à insulina) → Método P.I.G. (Pâncreas–Insulina–Glucagon) aplica o Jejum Regenerativo em 5 protocolos sequenciais (Despertar → Flexível → Reset → Rei → Alternado) para dar descanso ao pâncreas, limpar as células zumbi via autofagia (Nobel 2016) e acordar o glucagon, o hormônio que queima gordura.*

| Código | Segmento-mãe | Subsegmentos |
|---|---|---|
| **S01** | Peso e gordura | balança travada há meses mesmo "comendo certinho" · barriga / gordura abdominal que não sai · come pouco e frequente e engorda mesmo assim · efeito sanfona / recuperar tudo depois da dieta · gordura localizada (quadril, braço, papada) |
| **S02** | Inchaço e digestão | barriga estufada não importa o que corte · retenção de líquido / inchaço à tarde · má digestão, gases, sensação de peso |
| **S03** | Energia e sono | cansaço que 8h de sono não resolve · "moleza" da tarde que café nenhum tira · acordar cansado, sem disposição pro dia · sono ruim / dormir mal |
| **S04** | Glicemia e diabetes | glicose subindo no exame / pré-diabetes · diabetes tipo 2 / hemoglobina glicada alta · resistência à insulina · uso de metformina querendo reduzir (com médico) |
| **S05** | Fígado | "sombra no ultrassom" / esteatose hepática · enzimas do fígado (ALT/AST) alteradas · medo de cirrose e de fila de transplante |
| **S06** | Cardiovascular | colesterol e triglicerídeos altos · pressão alta / uso de losartana · medo de infarto / AVC |
| **S07** | Dependência de remédio e caneta | "mesa de remédios" (~R$4.200/mês) que só maquia sintoma · gastou fortuna na caneta (R$1.500–3.600/mês) e reganhou ao parar · perdeu massa muscular / "rosto de caveira" com a caneta · medo dos efeitos da caneta (náusea, vômito, pancreatite, gastroparesia) · querer sair da dependência de remédio pra sempre |
| **S08** | Fertilidade | dificuldade de engravidar ligada a peso e resistência à insulina · SOP (ovário policístico) travando a gravidez · médico condicionou a gestação a emagrecer · ciclos irregulares associados ao metabólico · homem: qualidade seminal ligada a peso/gordura |
| **S09** | Libido e vida sexual | libido baixa / falta de desejo · disposição sexual que caiu com o peso e a idade · autoestima corporal afetando a intimidade · homem: desempenho ligado à saúde metabólica |
| **S10** | Menopausa / hormonal feminino | ganho de peso na menopausa · fogacho, insônia, oscilação de humor · "meu metabolismo quebrou depois dos 40" |
| **S11** | Fracassos anteriores e método | já tentou jejum sozinha e travou em 2–3 semanas · low carb/keto que funcionou e depois emperrou · academia 4–5x/semana sem mexer a balança |
| **S12** | Barreiras de rotina | não consegue dieta por causa da vida social (jantar de negócio, almoço de família) · não tem tempo pra dieta complicada · "não tenho disciplina, sempre desisto" |

### M40+ — programa-mulher-40

*A proteína inflamatória TNF-alfa, fabricada pela própria célula de gordura após os 40, desliga os carregadores de açúcar GLUT-4 do músculo e trava o motor que queima açúcar — o Método B.A.M. (Bloquear com Alimentação Alternada → Ativar o GLUT-4 pela 2ª via, a contração muscular que a inflamação não alcança → Multiplicar semana a semana com Treino Progressivo) religa esse motor.*

| Código | Segmento-mãe | Subsegmentos |
|---|---|---|
| **S01** | Peso e composição corporal | balança travada há meses · come igual sempre e engorda cada ano mais · gordura localizada: culote, coxa, braço "flácido", papada · corpo murcho/flácido depois de emagrecer (perdeu firmeza, não gordura) · efeito sanfona |
| **S02** | Menopausa / hormonal | ganho de peso na peri/menopausa · fogacho / calorão · insônia / sono ruim · irritabilidade e oscilação de humor |
| **S03** | Metabólico e exames | glicose subindo / pré-diabetes / resistência à insulina · colesterol e triglicerídeos altos · gordura no fígado (esteatose) · pressão alta / remédio contínuo · exames "normais" mas sente que tem algo errado |
| **S04** | Energia e disposição | cansaço que noite de sono nenhuma resolve · sem energia pra rotina, trabalho, netos |
| **S05** | Fome, compulsão e relação com a comida | compulsão à noite · vontade de doce "mais forte que eu" · fome descontrolada depois de anos de dieta (leptina) |
| **S06** | Caneta e frustração fitness | perdeu músculo com a caneta e reganhou ao parar · gastou ~R$1.800/mês na caneta e "voltou tudo" · treinou e dietou muito e não saiu do lugar |
| **S07** | Libido e vida sexual | libido baixa / "sumiu o desejo" · autoestima corporal afetando a intimidade |
| **S08** | Autoestima e imagem | roupa que fechava ano passado não fecha (vergonha no provador) · foge de foto / não se reconhece no espelho |
| **S09** | Dores e articulações | dor nas articulações / inflamação · rigidez e indisposição pra se mover |
| **S10** | Barreiras (objeção virada gancho) | não tem tempo pra academia/dieta elaborada · não tem disciplina / odeia treinar / já desistiu mil vezes · vida social atrapalha (festa, almoço de família) · vegetariana/vegana achando que "não é pra ela" · ouve que "depois dos 40 é assim mesmo / é da menopausa / é genética" |

### UI — ultra-inteligencia

*A Atrofia Sináptica por Desuso (Poda Neural — o cérebro entra em "Modo de Segurança" e corta sinapses pra poupar energia) apaga a memória e instala a névoa mental; o PIH (Protocolo de Integração Hemisférica) reverte isso com 15 min/dia de estímulos cruzados na ordem exata que forçam os dois hemisférios a conversarem via Corpo Caloso, disparando Mielinização Acelerada e criando Reserva Cognitiva que "solda" a informação no córtex.*

| Código | Segmento-mãe | Subsegmentos |
|---|---|---|
| **S01** | Memória do cotidiano | esquecer onde deixou chaves, óculos, celular, onde estacionou · esquecer o nome de quem acabou de conhecer · esquecer datas, compromissos, aniversários, contas a pagar · entrar num cômodo e não lembrar o que ia fazer · perder a palavra "na ponta da língua" no meio da frase · perder o fio da conversa no meio dela |
| **S02** | Foco e atenção | não sustentar atenção por mais de 10 minutos · reler a mesma linha/página várias vezes pra entender · interromper tudo a cada notificação do celular · começar muitas tarefas e não terminar nenhuma · mente acelerada/dispersa que não "assenta" |
| **S03** | Aprendizado acelerado (estudo e provas) | estudar horas e o conteúdo "evaporar" no dia seguinte · reprovar / não passar em concurso, residência, vestibular, OAB · decorar por repetição e nada fixar · leitura lenta que não rende o edital · travar pra aprender idioma novo ou curso técnico |
| **S04** | Névoa mental e desempenho adulto | sensação de mente lenta, "nebulosa", travada · sentir-se "burro"/incapaz apesar de esforçado · "branco" humilhante em reunião, apresentação, entrevista · exaustão mental no fim do expediente · queda de raciocínio e produtividade no trabalho |
| **S05** | Prevenção e medo do declínio | medo de Alzheimer / demência · histórico de Alzheimer na família (medo genético) · ver pai/mãe perdendo a memória e temer o mesmo caminho · medo de virar fardo / perder a autonomia · primeiros "sinais" de esquecimento assustando |
| **S06** | Ensino e didática (professores/educadores) | prender a atenção de uma sala dispersa · fazer o conteúdo "grudar" na memória do aluno · ensinar o aluno a estudar e memorizar melhor · reter a própria matéria pra ensinar com segurança · dar conta de mais conteúdo em menos tempo de aula |
| **S07** | Filhos: aprendizado e educação (pais) | ajudar o filho a render mais nos estudos · ensinar o filho a ter foco e memória · preparar o filho pro vestibular / provas da escola · dar ao filho a vantagem de aprendizado que o pai não teve · filho rotulado de TDAH / que não foca na escola · receio de medicar o filho (Ritalina) e buscar alternativa |
| **S08** | Jovem e dopamina digital | vício em tela e scroll infinito · não aguentar um vídeo/aula de 10 minutos · procrastinação crônica · precisar de legenda pra acompanhar um filme |
| **S09** | Performance e longevidade cognitiva (preventivo/biohacker) | querer blindar a mente e criar reserva cognitiva · buscar "upgrade" de clareza e performance mental · autodidata querendo aprender mais rápido · dependência de cafeína/pílulas de foco que não resolvem |

## 4. ÂNGULOS — o frame narrativo

> **Lista canônica reconciliada** (também em `angulos/biblioteca.md`, com lógica e exemplo de cada um). A01–A20 vêm de `angulos/biblioteca.md`; A21–A29 foram
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
