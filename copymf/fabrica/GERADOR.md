# GERADOR DE ORDEM DE PRODUÇÃO

> Especificação para implementação no sistema interno.
>
> **Entrada:** funil + quantidade. **Saída:** N conjuntos de coordenadas, com dispersão garantida
> e uma gêmea sugerida para cada peça.
>
> É isto que transforma "o time tem o material" em "o time aperta um botão".

---

## 1. Contrato

### Entrada

```json
{
  "funil": "M40+",
  "quantidade": 20,
  "porta_voz_disponivel": ["EXP", "END", "VO", "ANI"],
  "semana_seca": false
}
```

| Campo | Obrigatório | Default | Nota |
|---|---|---|---|
| `funil` | sim | — | prefixo de `coordenadas.json` |
| `quantidade` | sim | 20 | em semana seca, o sistema **corta pela metade** |
| `porta_voz_disponivel` | não | todos | se o especialista não grava, tirar `EXP` — o gerador redistribui |
| `semana_seca` | não | false | 3 semanas sem vencedor → true |

### Saída

```json
{
  "funil": "M40+",
  "gerado_em": "2026-08-05",
  "baseline_usado": "ledger" | "sem_dados",
  "pecas": [
    {
      "codigo": "M40+41",
      "faixa": "modelagem",
      "segmento": "S06",
      "segmento_nome": "Caneta e frustração fitness",
      "subsegmento_sugerido": "perdeu músculo com a caneta e reganhou ao parar",
      "nc": "S",
      "angulo": "A29",
      "angulo_nome": "Estudo de Caso Estranho",
      "formato": "H2",
      "formato_nome": "Videochamada entre amigas",
      "porta_voz": "END",
      "gemea": "J20PIG 023",
      "gemea_por_que": "mesmo beat-map (depoimento 1ª pessoa) e mesmo NC",
      "id_minimo_no_lote": 6
    }
  ],
  "avisos": []
}
```

---

## 2. Algoritmo

### Passo 1 — Carregar

```
coord   = load("fabrica/coordenadas.json")
swipe   = load("fabrica/swipe.json")
ledger  = load("fabrica/ledger/<funil>.csv")   // pode estar vazio

segmentos = coord.funis[funil].segmentos
```

### Passo 2 — Definir a distribuição

```
if semana_seca: N = floor(N / 2)

n_modelagem = round(N * 0.8)
n_wild      = N - n_modelagem
```

**Segmentos a cobrir:** `n_segmentos = clamp(round(N / 3.5), 3, 7)`
Para N=20 → **6 segmentos**, com 3-4 peças cada.

**Escolha dos segmentos:**
- **com ledger:** ordena por CPA médio do segmento (melhor primeiro); pega os `n_segmentos`
  melhores, e força **1 slot** para um segmento nunca testado (exploração)
- **sem ledger:** rodízio round-robin sobre todos os segmentos do funil, começando pelos que
  têm mais subsegmentos (mais material = mais chance de hook)

**Cota de nível de consciência:** 60% P · 40% S
**Cota de porta-voz** (proporção; renormaliza se algum estiver indisponível):

| Porta-voz | Proporção | Em N=20 |
|---|---|---|
| EXP | 40% | 8 |
| END | 15% | 3 |
| VO | 30% | 6 |
| ANI | 15% | 3 |

### Passo 3 — Preencher os slots

Para cada slot de modelagem:

```
1. segmento  ← próximo do rodízio dos segmentos escolhidos
2. nc        ← puxa da cota de NC ainda disponível
3. angulo    ← sorteia dos ângulos compatíveis com nc (tabela abaixo),
                excluindo os já usados NESTE segmento
4. porta_voz ← puxa da cota de porta-voz ainda disponível
5. formato   ← sorteia dos formatos compatíveis com porta_voz (tabela abaixo),
                excluindo os já usados NESTE segmento
6. gemea     ← busca em swipe.json (Passo 4)
```

**Compatibilidade ângulo × NC** (de `angulos/biblioteca.md`):

| NC | Ângulos preferenciais |
|---|---|
| **P** | A01 A02 A04 A06 A08 A10 A14 A18 A22 A23 A25 A28 |
| **S** | A03 A11 A13 A16 A17 A20 A21 A24 A26 A27 A29 |

*(A05, A07, A09, A12, A15, A19 servem aos dois.)*

**Compatibilidade formato × porta-voz:**

| Porta-voz | Blocos permitidos |
|---|---|
| **EXP** | A · D · H1 H6 H7 H8 |
| **END** | B · C · E · H2 H5 |
| **VO** | F · G · H4 |
| **ANI** | H3 H4 · F2 F6 F9 |

### Passo 4 — Escolher a gêmea

```
candidatas = swipe.pecas filtradas por:
  calibra_regua == true                        // nunca modelar as fracas
  funil in peca.modelar_para                   // adequada ao nosso funil
  não usada nas últimas 3 Ordens de Produção   // evita repetir gêmea

score(peca) =
    3 se peca.angulo == slot.angulo
  + 2 se peca.formato_bloco == bloco(slot.formato)
  + 2 se peca.nc == slot.nc
  + 1 se peca.fonte == "interna"               // o que já validou com o nosso público pesa mais
  + 1 se peca.tema for próximo do segmento

gemea = argmax(score); empate → sorteia
```

> Se nenhuma candidata pontuar ≥ 3, o slot vira **wild card** e é marcado com aviso —
> é sinal de que não temos gêmea boa para aquela coordenada.

### Passo 5 — Validar a dispersão (o passo que não pode faltar)

```
para cada par (i, j) de peças do lote:
    id = 0
    id += 4 se mecanismo_i != mecanismo_j        // normalmente igual dentro do funil
    id += 3 se segmento_i != segmento_j
    id += 3 se nc_i != nc_j
    id += 2 se angulo_i != angulo_j
    id += 2 se bloco(formato_i) != bloco(formato_j)
    id += 2 se porta_voz_i != porta_voz_j
    id += 1 se analogia_i != analogia_j

    se id < 4 → REPARO
```

**Reparo (nesta ordem, sempre na peça mais nova):**

```
1. troca o FORMATO por outro bloco compatível com o porta-voz  → +2
2. troca o PORTA-VOZ (se a cota permitir)                      → +2
3. troca o ÂNGULO por outro compatível com o NC                → +2
4. inverte o NC                                                → +3
5. troca o SEGMENTO                                            → +3
6. se ainda assim não passar → descarta o slot e avisa
```

Repete até todos os pares terem ID ≥ 4 ou até 50 iterações (então emite aviso).

> **Por que o reparo começa pelo formato:** é a coordenada mais barata de trocar em produção
> (mesma sessão de gravação, mesmo roteiro) e vale 2 pontos. Trocar segmento é caro — muda a
> peça inteira.

### Passo 6 — Wild cards

Os `n_wild` slots restantes recebem:
```
{ faixa: "wild", segmento: livre, gemea: "gWILD", angulo/formato/porta_voz: sugestão do sistema }
```
Não passam pelo filtro de gêmea, **mas passam pela validação de dispersão**.

### Passo 7 — Numerar e emitir

```
proximo = max(numero das peças do funil no ledger) + 1
```

---

## 3. Regras que o sistema deve travar

| # | Regra | Consequência se violar |
|---|---|---|
| 1 | Nenhuma peça sem gêmea, exceto wild card declarado | peça não entra na fila |
| 2 | ID ≥ 4 entre todos os pares que sobem juntos | canibalização no leilão |
| 3 | Nunca sugerir gêmea com `calibra_regua == false` | copy mediana |
| 4 | Máximo 4 peças por segmento no mesmo lote | amontoa no índice |
| 5 | Máximo 2 peças com o mesmo ângulo no mesmo segmento | idem |
| 6 | Cota de porta-voz respeitada | gargalo de gravação estoura |
| 7 | Quem julga a régua ≠ quem escreveu | bus factor e nota inflada |

---

## 4. O que o gerador NÃO faz

- **Não escreve copy.** Ele entrega coordenadas; a copy é escrita com a régua
  (`meufluxo-copy-standard`) e o `PADRAO-DE-ESCRITA.md`.
- **Não decide verba.** Isso é do gestor de tráfego.
- **Não substitui a Mesa de segunda.** Ele prepara a proposta; a Mesa aprova, ajusta e assume.
  Quando houver ledger, a Mesa é quem sabe o que o número não conta.

---

## 5. Modo degradado

| Situação | O que o gerador faz |
|---|---|
| Ledger vazio | `baseline_usado: "sem_dados"` · rodízio de segmentos · avisa que a distribuição é cega |
| Especialista não grava | redistribui a cota de EXP entre VO e ANI |
| Sem gêmea boa para a coordenada | vira wild card com aviso |
| 3 semanas sem vencedor | `semana_seca: true` → metade das peças; o sistema deve **dobrar a verba por peça** |

---

## 6. Ordem de implementação sugerida

1. **Ler `coordenadas.json` e popular os selects** — já dá valor sozinho, é meio dia de trabalho
2. **Passo 5, a validação de dispersão** — pode rodar como *checagem* de uma Ordem preenchida à
   mão. É o maior retorno isolado: impede a canibalização mesmo sem o resto do gerador
3. **Passos 2-3, a distribuição automática**
4. **Passo 4, a sugestão de gêmea** (depende do `swipe.json`)
5. **Ledger e o loop de aprendizado** — depende de ter dado real
