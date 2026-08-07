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
| **NC-D** | **Descoberta** | sente sintomas soltos e **não sabe que são o mesmo problema** | **maior pool**, tráfego mais barato |
| **NC-P** | Problema | sabe que tem o problema, não conhece a causa | volume |
| **NC-S** | Solução-existente | já está tentando algo do mercado (chá, caneta, low carb, fórmula manipulada, academia) | **venda** — intenção maior |

> **Descoberta abre o funil. Problema traz volume. Solução traz venda.** Um lote saudável tem os três.

**Como se escreve uma peça de Descoberta:** ela liga sintomas que a mulher **nota mas nunca
conectou** — a marca do elástico na pele, o anel que não gira mais, o botão da calça às cinco da
tarde, o cabelo caindo, o sono que não descansa — e revela que **é tudo a mesma coisa**. Ela não
sabia que tinha o problema; sai da peça sabendo.

**Ângulos por nível:**

| NC | Ângulos que servem |
|---|---|
| **D** | A18 autodiagnóstico · A08 sinal de alerta · A23 mistério científico · A22 paradoxo · A07 curiosidade · A10 demonstração · A19 novidade · A26 herói inesperado |
| **P** | A01 A02 A04 A06 A10 A14 A22 A23 A25 A28 |
| **S** | A03 A11 A13 A16 A17 A20 A21 A24 A26 A27 A29 |
| *universais* | A05 A09 A12 A15 |

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
| **S11** | Corpo pós-gestação | engordou na gravidez e nunca voltou ao que era · barriga que ficou depois do parto e não sai · 'meu corpo nunca mais foi o mesmo depois que virei mãe' · não tem tempo para si desde que os filhos nasceram |
| **S12** | Inchaço e retenção de líquido | marca do elástico na pele meia hora depois · anel que aperta o dedo / não gira mais · abrir o botão da calça às cinco da tarde · inchaço nas pernas e tornozelos no fim do dia · rosto inchado ao acordar · acorda leve e vai inchando ao longo do dia |
