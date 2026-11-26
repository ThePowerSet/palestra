(function () {
  'use strict';
  const P = Palestra;

  const CICLO = '142857', ORDINATE = '124578';
  // k/7 per k da 1 a 6: le sei cifre che si ripetono, partendo dalla cifra giusta
  const giro = k => { const i = CICLO.indexOf(ORDINATE[k - 1]); return CICLO.slice(i) + CICLO.slice(0, i); };
  const zero = k => `0.${giro(k)}`;                     // 0.428571
  const ord = k => P.t(`${k}ª`, `${k}${['th', 'st', 'nd', 'rd'][k] || 'th'}`);
  const LISTA = '1 2 4 5 7 8';

  function settimi() {
    const k = P.int(1, 6), d = ORDINATE[k - 1];
    return {
      testo: P.t(`<span class="num">${k}/7</span> in decimale`, `<span class="num">${k}/7</span> as a decimal`),
      nota: P.t('bastano 4 decimali', '4 decimal places are enough'),
      risposta: P.numero(k / 7, { decimali: 4 }),
      suggerimenti: [
        P.t(`Il ciclo di 1/7 è 142857. Metti le sue cifre in ordine, ${LISTA}: k/7 parte dalla k-esima cifra di questa lista.`,
          `The cycle of 1/7 is 142857. Sort its digits, ${LISTA}: k/7 starts from the k-th digit of this list.`),
        P.t(`${k}/7 parte dalla ${ord(k)} cifra, cioè da ${d}: da lì leggi il ciclo in ordine.`,
          `${k}/7 starts from the ${ord(k)} digit, that is ${d}: from there read the cycle in order.`),
      ],
      soluzione: [
        P.t(`lista ordinata ${LISTA}: la ${ord(k)} cifra è ${d}`, `sorted list ${LISTA}: the ${ord(k)} digit is ${d}`),
        P.t(`dal ${d} il ciclo prosegue: ${giro(k)}`, `from ${d} the cycle goes on: ${giro(k)}`),
        `${k}/7 = ${zero(k)}…`,
      ],
    };
  }

  function improprie() {
    let n; do { n = P.int(8, 69); } while (n % 7 === 0);
    const q = Math.floor(n / 7), r = n % 7;
    return {
      testo: P.t(`<span class="num">${n}/7</span> in decimale`, `<span class="num">${n}/7</span> as a decimal`),
      nota: P.t('bastano 4 decimali', '4 decimal places are enough'),
      risposta: P.numero(n / 7, { decimali: 4 }),
      suggerimenti: [
        P.t(`Togli prima la parte intera: ${n} = 7 × ${q} + ${r}.`, `Take out the whole part first: ${n} = 7 × ${q} + ${r}.`),
        P.t(`Resta ${r}/7, che parte dalla ${ord(r)} cifra di ${LISTA}, cioè da ${ORDINATE[r - 1]}.`,
          `${r}/7 is left, which starts from the ${ord(r)} digit of ${LISTA}, that is ${ORDINATE[r - 1]}.`),
      ],
      soluzione: [
        P.t(`${n} = 7 × ${q} + ${r}, quindi ${n}/7 = ${q} + ${r}/7`, `${n} = 7 × ${q} + ${r}, so ${n}/7 = ${q} + ${r}/7`),
        `${r}/7 = ${zero(r)}…`,
        `${n}/7 = ${q}.${giro(r)}…`,
      ],
    };
  }

  function quota() {
    const contro = P.chance(0.6);
    const [a, b] = P.pick([[6, 1], [5, 2], [4, 3]]);
    const num = contro ? b : a;
    const testo = contro
      ? P.t(`Un bookmaker quota un evento <b>${a} a ${b} contro</b>: se punti ${b} e vinci, incassi ${a} più la puntata. Che probabilità implicita dà all'evento?`,
        `A bookmaker quotes an event at <b>${a} to ${b} against</b>: stake ${b} and if you win you collect ${a} plus your stake. What probability does that imply?`)
      : P.t(`Un evento è quotato <b>${a} a ${b} a favore</b>: punti ${a} per vincerne ${b}. Che probabilità implicita ha?`,
        `An event is quoted at <b>${a} to ${b} on</b>: you stake ${a} to win ${b}. What probability does that imply?`);
    return {
      testo,
      nota: P.t('in percentuale, bastano due decimali', 'as a percentage, two decimals are enough'),
      risposta: P.numero(num / 7, { percento: true, decimali: 4, mostra: P.pct(num / 7, 2) }),
      suggerimenti: [
        contro
          ? P.t(`«a a b contro» vuol dire che l'evento succede b volte ogni a + b: qui ${b} su 7.`, `"a to b against" means the event happens b times out of a + b: here ${b} out of 7.`)
          : P.t(`«a a b a favore» vuol dire che l'evento succede a volte ogni a + b: qui ${a} su 7.`, `"a to b on" means the event happens a times out of a + b: here ${a} out of 7.`),
        P.t(`${num}/7 parte dalla ${ord(num)} cifra di ${LISTA}, cioè da ${ORDINATE[num - 1]}.`,
          `${num}/7 starts from the ${ord(num)} digit of ${LISTA}, that is ${ORDINATE[num - 1]}.`),
      ],
      soluzione: [P.t(`probabilità = ${num}/7`, `probability = ${num}/7`), `${num}/7 = ${zero(num)}… = ${P.pct(num / 7, 2)}`],
    };
  }

  function digitale() {
    const k = P.int(1, 6), X = P.pick([100, 100, 1000, 10, 70, 350, 140]);
    const v = X * k / 7, multiplo = X % 7 === 0;
    return {
      testo: P.t(`Un'opzione digitale paga <span class="num">${X} €</span> se l'evento si verifica, e la probabilità è ${k}/7. Qual è il prezzo equo, a tassi zero?`,
        `A digital option pays <span class="num">${X} €</span> if the event happens, and the probability is ${k}/7. What is the fair price, with zero rates?`),
      nota: multiplo ? '' : P.t('bastano due decimali', 'two decimals are enough'),
      risposta: P.numero(v, { decimali: 2, unita: '€' }),
      suggerimenti: [
        P.t('Prezzo equo = quanto paga × probabilità che paghi.', 'Fair price = what it pays × the probability that it pays.'),
        multiplo
          ? P.t(`${X} è un multiplo di 7: ${X}/7 = ${X / 7}, poi per ${k}.`, `${X} is a multiple of 7: ${X}/7 = ${X / 7}, then times ${k}.`)
          : P.t(`${k}/7 = ${zero(k)}…; moltiplicare per ${X} vuol dire spostare la virgola.`, `${k}/7 = ${zero(k)}…; multiplying by ${X} just moves the decimal point.`),
      ],
      soluzione: [`${X} × ${k}/7`, multiplo ? `${X}/7 = ${X / 7}, × ${k} = ${P.fmt(v)}` : `${k}/7 = ${zero(k)}…, × ${X} = ${P.fmt(v, 4)}`],
    };
  }

  function quattordicesimi() {
    let k; do { k = P.int(1, 13); } while (k === 7);
    const testo = P.t(`<span class="num">${k}/14</span> in decimale`, `<span class="num">${k}/14</span> as a decimal`);
    const nota = P.t('bastano 4 decimali', '4 decimal places are enough');
    if (k % 2 === 0) {
      const h = k / 2;
      return {
        testo, nota,
        risposta: P.numero(k / 14, { decimali: 4 }),
        suggerimenti: [
          P.t(`${k}/14 si semplifica: è ${h}/7.`, `${k}/14 simplifies: it is ${h}/7.`),
          P.t(`${h}/7 parte da ${ORDINATE[h - 1]}.`, `${h}/7 starts from ${ORDINATE[h - 1]}.`),
        ],
        soluzione: [`${k}/14 = ${h}/7`, `${h}/7 = ${zero(h)}…`],
      };
    }
    const intero = k > 7 ? 1 : 0, r = k % 7, s7 = `${intero}.${giro(r)}`;
    return {
      testo, nota,
      risposta: P.numero(k / 14, { decimali: 4 }),
      suggerimenti: [
        P.t(`Diviso 14 è la metà di diviso 7: calcola ${k}/7 e dimezza.`, `Dividing by 14 is half of dividing by 7: work out ${k}/7 and halve it.`),
        `${k}/7 = ${s7}…`,
      ],
      soluzione: [`${k}/7 = ${s7}…`, P.t(`metà: ${P.fmt(k / 14, 7)}`, `half: ${P.fmt(k / 14, 7)}`)],
    };
  }

  function settantesimi() {
    let k; do { k = P.int(1, 69); } while (k % 7 === 0);
    const q = Math.floor(k / 7), r = k % 7;
    return {
      testo: P.t(`<span class="num">${k}/70</span> in decimale`, `<span class="num">${k}/70</span> as a decimal`),
      nota: P.t('bastano 5 decimali', '5 decimal places are enough'),
      risposta: P.numero(k / 70, { decimali: 5 }),
      suggerimenti: [
        P.t(`Diviso 70 è diviso 7 e poi diviso 10: calcola ${k}/7 e sposta la virgola di un posto.`, `Dividing by 70 is dividing by 7 and then by 10: work out ${k}/7 and move the decimal point one place.`),
        `${k}/7 = ${q}.${giro(r)}…`,
      ],
      soluzione: [`${k}/7 = ${q}.${giro(r)}…`, `${k}/70 = ${P.fmt(k / 70, 7)}`],
    };
  }

  function inverso() {
    const k = P.int(1, 6);
    return {
      testo: P.t(`<span class="num">${zero(k)}${giro(k).slice(0, 3)}…</span> è un certo k/7. Quanto vale k?`, `<span class="num">${zero(k)}${giro(k).slice(0, 3)}…</span> is some k/7. What is k?`),
      risposta: P.numero(k),
      suggerimenti: [
        P.t(`Guarda la prima cifra e cercala nella lista ordinata ${LISTA}.`, `Look at the first digit and find it in the sorted list ${LISTA}.`),
        P.t(`La prima cifra è ${ORDINATE[k - 1]}.`, `The first digit is ${ORDINATE[k - 1]}.`),
      ],
      soluzione: [
        P.t(`${ORDINATE[k - 1]} è la ${ord(k)} cifra di ${LISTA}`, `${ORDINATE[k - 1]} is the ${ord(k)} digit of ${LISTA}`),
        P.t(`quindi è ${k}/7`, `so it is ${k}/7`),
      ],
    };
  }

  P.trucco({
    id: 'frazioni-settimi',
    materia: 'calcolo',
    capitolo: 'fractions',
    numero: 2,
    titolo: { it: 'I settimi', en: 'Sevenths' },
    sottotitolo: {
      it: 'Sei cifre che girano in tondo: ogni k/7 in un secondo, e le quote «6 a 1» in percentuale.',
      en: 'Six digits going round in a circle: any k/7 in a second, and odds like "6 to 1" as percentages.',
    },
    aggancio: {
      it: 'Al colloquio ti dicono: «Un evento è quotato 5 a 2 contro. Che probabilità implica?». È 2/7, e la risposta che aspettano è 28.57%, detta subito.',
      en: 'In the interview: "An event is quoted 5 to 2 against. What probability does that imply?" It is 2/7, and the answer they expect is 28.57%, said straight away.',
    },
    lezione: {
      it: `
<h3>Una stranezza</h3>
<p>Prendi 142857 e moltiplicalo:</p>
<div class="esempio">× 2 = 285714<br>× 3 = 428571<br>× 4 = 571428<br>× 5 = 714285<br>× 6 = 857142</div>
<p>Sono sempre le stesse sei cifre, che girano in tondo. E poi 142857 × 7 = 999999. Non è una coincidenza: 142857 è il ciclo di 1/7 = 0.142857142857… e tutto quello che serve sapere sui settimi sta in questa stranezza.</p>

<h3>Perché si ripete</h3>
<p>Fai 1 ÷ 7 in colonna e guarda i resti:</p>
<div class="esempio">10 ÷ 7 = 1, resto 3<br>30 ÷ 7 = 4, resto 2<br>20 ÷ 7 = 2, resto 6<br>60 ÷ 7 = 8, resto 4<br>40 ÷ 7 = 5, resto 5<br>50 ÷ 7 = 7, resto 1, e si ricomincia</div>
<p>Dividendo per 7 il resto può essere solo 1, 2, 3, 4, 5 o 6: sei possibilità. Appena un resto torna, la divisione rifà gli stessi passi all'infinito. È un circuito a sei tappe.</p>

<h3>Perché le cifre ruotano</h3>
<p>Calcolare 3/7 vuol dire fare la stessa divisione partendo da 3 invece che da 1. Il primo passo è 30 ÷ 7, e quel passo è già nella lista sopra: è la seconda riga. Da lì la divisione segue le stesse righe: 4, 2, 8, 5, 7, 1. Quindi 3/7 = 0.428571. Ogni k/7 entra nello stesso circuito, solo a una tappa diversa.</p>

<h3>Da dove entri</h3>
<p>Metti le cifre del ciclo in ordine crescente: <b>1 2 4 5 7 8</b>. La prima cifra di k/7 è la k-esima di questa lista. Ha senso: più grande è k, più grande è k/7, e più grande è la cifra da cui parte.</p>
<div class="esempio">5/7: la 5ª cifra della lista è 7. Dal 7 il ciclo prosegue 1, 4, 2, 8, 5: 0.714285</div>

<h3>Come ricordare il ciclo</h3>
<p>Ti bastano tre cifre, <b>142</b>. Le altre tre sono il complemento a 9: 1 + 8, 4 + 5 e 2 + 7 fanno 9, quindi 142 diventa 142 857. Anche questo ha un perché: 1/7 + 6/7 = 1 = 0.999999…, quindi le due metà del ciclo sommano a 9 cifra per cifra.</p>

<h3>Le varianti che ti chiedono</h3>
<ul>
<li>Numeratore più grande di 7: togli prima la parte intera. 50/7 = 7 resto 1, quindi 7.142857.</li>
<li>Diviso 14 è la metà di diviso 7: 3/14 = 0.428571 / 2 = 0.2142857.</li>
<li>Diviso 70 è diviso 7 con la virgola spostata di un posto: 3/70 = 0.0428571.</li>
</ul>

<h3>Al desk</h3>
<p>Una quota «a a b contro» vuol dire che l'evento succede b volte ogni a + b. «6 a 1 contro» è 1/7 = 14.29%. «5 a 2 contro» è 2/7 = 28.57%. «4 a 3 a favore» è 4/7 = 57.14%. Nei giochi di market making a voce queste conversioni vanno fatte in un secondo, e il prezzo equo di un contratto che paga 100 con probabilità 3/7 è 42.86.</p>
`,
      en: `
<h3>A curiosity</h3>
<p>Take 142857 and multiply it:</p>
<div class="esempio">× 2 = 285714<br>× 3 = 428571<br>× 4 = 571428<br>× 5 = 714285<br>× 6 = 857142</div>
<p>Always the same six digits, going round in a circle. And then 142857 × 7 = 999999. It is no coincidence: 142857 is the cycle of 1/7 = 0.142857142857…, and everything you need to know about sevenths is hidden in this curiosity.</p>

<h3>Why it repeats</h3>
<p>Do 1 ÷ 7 by long division and watch the remainders:</p>
<div class="esempio">10 ÷ 7 = 1, remainder 3<br>30 ÷ 7 = 4, remainder 2<br>20 ÷ 7 = 2, remainder 6<br>60 ÷ 7 = 8, remainder 4<br>40 ÷ 7 = 5, remainder 5<br>50 ÷ 7 = 7, remainder 1, and it starts again</div>
<p>When you divide by 7 the remainder can only be 1, 2, 3, 4, 5 or 6: six possibilities. As soon as a remainder comes back, the division repeats the same steps for ever. It is a circuit with six stops.</p>

<h3>Why the digits rotate</h3>
<p>Working out 3/7 means doing the same division starting from 3 instead of 1. The first step is 30 ÷ 7, and that step is already in the list above: it is the second line. From there the division follows the same lines: 4, 2, 8, 5, 7, 1. So 3/7 = 0.428571. Every k/7 joins the same circuit, just at a different stop.</p>

<h3>Where you join</h3>
<p>Sort the digits of the cycle: <b>1 2 4 5 7 8</b>. The first digit of k/7 is the k-th digit of this list. It makes sense: the bigger k, the bigger k/7, and the bigger the digit it starts from.</p>
<div class="esempio">5/7: the 5th digit of the list is 7. From 7 the cycle goes on 1, 4, 2, 8, 5: 0.714285</div>

<h3>How to remember the cycle</h3>
<p>Three digits are enough, <b>142</b>. The other three are the complement to 9: 1 + 8, 4 + 5 and 2 + 7 all make 9, so 142 becomes 142 857. This has a reason too: 1/7 + 6/7 = 1 = 0.999999…, so the two halves of the cycle add up to 9 digit by digit.</p>

<h3>The variations they ask</h3>
<ul>
<li>Numerator larger than 7: take out the whole part first. 50/7 = 7 remainder 1, so 7.142857.</li>
<li>Dividing by 14 is half of dividing by 7: 3/14 = 0.428571 / 2 = 0.2142857.</li>
<li>Dividing by 70 is dividing by 7 with the decimal point moved one place: 3/70 = 0.0428571.</li>
</ul>

<h3>On the desk</h3>
<p>Odds of "a to b against" mean the event happens b times out of a + b. "6 to 1 against" is 1/7 = 14.29%. "5 to 2 against" is 2/7 = 28.57%. "4 to 3 on" is 4/7 = 57.14%. In verbal market-making games these conversions have to take a second, and the fair price of a contract paying 100 with probability 3/7 is 42.86.</p>
`,
    },
    scheda: {
      it: 'Ciclo 142857: ricorda 142, il resto è il complemento a 9. k/7 parte dalla k-esima cifra di 1 2 4 5 7 8 e segue il ciclo. Sopra 7 togli la parte intera; diviso 14 è la metà; diviso 70 sposta la virgola. Quota a a b contro = b/(a + b).',
      en: 'Cycle 142857: remember 142, the rest is the complement to 9. k/7 starts from the k-th digit of 1 2 4 5 7 8 and follows the cycle. Above 7 take out the whole part; dividing by 14 is half; dividing by 70 moves the point. Odds of a to b against = b/(a + b).',
    },
    test: true,
    nomiLivelli: { it: ['Calcolo', 'Quote e digitali', 'Quattordicesimi e al contrario'], en: ['Calculation', 'Odds and digitals', 'Fourteenths and backwards'] },
    livelli: [
      () => P.pesato([[0.55, settimi], [0.45, improprie]])(),
      () => P.pesato([[0.6, quota], [0.4, digitale]])(),
      () => P.pesato([[0.4, quattordicesimi], [0.3, settantesimi], [0.3, inverso]])(),
    ],
  });
})();
