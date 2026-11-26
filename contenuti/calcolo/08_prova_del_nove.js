(function () {
  'use strict';
  const P = Palestra;

  const r9 = n => ((n % 9) + 9) % 9;
  const RESTO = () => P.t('resto', 'remainder');
  // "1692: 1+6+9+2 = 18 → 1+8 = 9 → resto 0"
  function riduci(n) {
    let s = String(Math.abs(n));
    const passi = [];
    while (s.length > 1) {
      const somma = s.split('').reduce((a, c) => a + +c, 0);
      passi.push(`${s.split('').join('+')} = ${somma}`);
      s = String(somma);
    }
    return `${n}: ${passi.length ? passi.join(' → ') + ' → ' : ''}${RESTO()} ${r9(n)}`;
  }
  const opzioniOrdinate = (vero, sbagliati) => {
    const tutte = [vero].concat(sbagliati).sort((a, b) => a - b);
    return { testi: tutte.map(x => P.fmt(x)), giusta: tutte.indexOf(vero), valori: tutte };
  };
  // tre spostamenti che lasciano uguale l'ultima cifra ma cambiano il resto modulo 9
  const SPOSTAMENTI = [10, -10, 20, -20, 30, -30];
  const distrattori9 = v => P.mescola(SPOSTAMENTI).filter(o => v + o > 0).slice(0, 3).map(o => v + o);
  const elenco = (valori, v) => valori.map(x => `${P.fmt(x)} → ${RESTO()} ${r9(x)}${x === v ? ' ✓' : ''}`);

  function ultimaCifra() {
    let a, b; do { a = P.int(13, 99); b = P.int(13, 99); } while (a % 10 === 0 || b % 10 === 0);
    const v = a * b, u = v % 10, pu = (a % 10) * (b % 10);
    const residui = P.mescola([2, 4, 6, 8]).slice(0, 3);
    const sbagliati = residui.map(r => v + (P.chance(0.5) ? r : r - 10));
    const o = opzioniOrdinate(v, sbagliati);
    return {
      testo: P.t(`Quale fa <span class="num">${a} × ${b}</span>?`, `Which is <span class="num">${a} × ${b}</span>?`),
      risposta: P.scelta(o.testi, o.giusta),
      suggerimenti: [P.t(`Non serve il conto intero: guarda solo le ultime cifre. ${a % 10} × ${b % 10} = ${pu}, quindi il risultato finisce per ${u}.`,
        `No need for the full calculation: look only at the last digits. ${a % 10} × ${b % 10} = ${pu}, so the result ends in ${u}.`)],
      soluzione: [
        P.t(`${a % 10} × ${b % 10} = ${pu} → ultima cifra ${u}`, `${a % 10} × ${b % 10} = ${pu} → last digit ${u}`),
        P.t(`solo ${P.fmt(v)} finisce per ${u}`, `only ${P.fmt(v)} ends in ${u}`),
      ],
    };
  }

  function nove() {
    let a, b; do { a = P.int(13, 99); b = P.chance(0.5) ? P.int(13, 99) : P.int(102, 499); } while (a % 10 === 0 || b % 10 === 0);
    const v = a * b, o = opzioniOrdinate(v, distrattori9(v));
    const ra = r9(a), rb = r9(b);
    return {
      testo: P.t(`Quale fa <span class="num">${a} × ${b}</span>?`, `Which is <span class="num">${a} × ${b}</span>?`),
      risposta: P.scelta(o.testi, o.giusta),
      suggerimenti: [
        P.t(`Finiscono tutte per ${v % 10}: l'ultima cifra non basta. Passa alla prova del 9: ogni numero ha lo stesso resto della somma delle sue cifre.`,
          `They all end in ${v % 10}: the last digit is not enough. Move to casting out nines: every number has the same remainder as the sum of its digits.`),
        P.t(`${a} ha resto ${ra}, ${b} ha resto ${rb}; ${ra} × ${rb} = ${ra * rb}, che ha resto ${r9(v)}.`,
          `${a} has remainder ${ra}, ${b} has remainder ${rb}; ${ra} × ${rb} = ${ra * rb}, which has remainder ${r9(v)}.`),
      ],
      soluzione: [riduci(a), riduci(b), P.t(`resti: ${ra} × ${rb} = ${ra * rb} → resto ${r9(v)}`, `remainders: ${ra} × ${rb} = ${ra * rb} → remainder ${r9(v)}`)]
        .concat(elenco(o.valori, v)),
    };
  }

  function catena() {
    const a = P.int(5000, 9999), b = P.int(1000, 3999), c = P.int(100, 999), d = P.int(100, 999);
    const v = a - b + c - d;
    const o = opzioniOrdinate(v, distrattori9(v));
    const ra = r9(a), rb = r9(b), rc = r9(c), rd = r9(d), somma = ra - rb + rc - rd;
    return {
      testo: P.t(`Quale fa <span class="num">${a} − ${b} + ${c} − ${d}</span>?`, `Which is <span class="num">${a} − ${b} + ${c} − ${d}</span>?`),
      risposta: P.scelta(o.testi, o.giusta),
      suggerimenti: [
        P.t('Finiscono tutte per la stessa cifra. La prova del 9 vale anche per somme e sottrazioni: i resti si sommano e si sottraggono come i numeri.',
          'They all end in the same digit. Casting out nines works for sums and differences too: remainders add and subtract like the numbers.'),
        P.t(`Resti: ${ra} − ${rb} + ${rc} − ${rd} = ${somma}, che ha resto ${r9(v)}.`, `Remainders: ${ra} − ${rb} + ${rc} − ${rd} = ${somma}, which has remainder ${r9(v)}.`),
      ],
      soluzione: [riduci(a), riduci(b), riduci(c), riduci(d), `${ra} − ${rb} + ${rc} − ${rd} = ${somma} → ${RESTO()} ${r9(v)}`]
        .concat(elenco(o.valori, v)),
    };
  }

  P.trucco({
    id: 'controlli-nove',
    materia: 'calcolo',
    capitolo: 'add_sub',
    numero: 8,
    titolo: { it: 'Ultima cifra e prova del 9', en: 'Last digit and casting out nines' },
    sottotitolo: {
      it: 'Nei test a scelta multipla non si calcola: si scartano le risposte sbagliate.',
      en: 'In multiple-choice tests you don\'t calculate: you rule out the wrong answers.',
    },
    aggancio: {
      it: 'Test a scelta multipla, sei secondi a domanda: «47 × 36?» con 1682, 1692, 1702, 1592. Non serve il conto. La somma delle cifre ti dice che è 1692.',
      en: 'Multiple-choice test, six seconds a question: "47 × 36?" with 1682, 1692, 1702, 1592. No need to calculate. The digit sums tell you it is 1692.',
    },
    lezione: {
      it: `
<h3>Non calcolare: scarta</h3>
<p>In un test a scelta multipla non devi sapere il risultato, devi sapere quali risposte sono impossibili. Due controlli bastano quasi sempre, e costano un secondo l'uno.</p>

<h3>1. L'ultima cifra</h3>
<p>L'ultima cifra di una somma o di un prodotto dipende solo dalle ultime cifre degli operandi. 47 × 36: 7 × 6 = 42, quindi il risultato finisce per 2. Ogni opzione che finisce per un'altra cifra è fuori.</p>

<h3>2. La prova del 9</h3>
<p>Quando le opzioni finiscono tutte con la stessa cifra (e i test sono fatti apposta così), passa al resto nella divisione per 9.</p>
<p>Perché funziona: 10 = 9 + 1, quindi 10, 100, 1000 lasciano tutti resto 1 se li dividi per 9. Un numero come 1692 è 1·1000 + 6·100 + 9·10 + 2, e il suo resto è quello di 1 + 6 + 9 + 2. <b>Ogni numero ha lo stesso resto della somma delle sue cifre.</b></p>
<p>E i resti seguono le operazioni: il resto di un prodotto è il prodotto dei resti, il resto di una somma è la somma dei resti.</p>
<div class="esempio">47 → 4 + 7 = 11 → 2<br>36 → 3 + 6 = 9 → resto 0<br>prodotto: 2 × 0 = 0<br>1682 → 17 → 8 ✗ · 1692 → 18 → 0 ✓ · 1702 → 10 → 1 ✗ · 1592 → 17 → 8 ✗</div>
<p>Scorciatoia: mentre sommi le cifre, salta i 9 e le coppie che fanno 9. In 4725, 4 + 5 e 7 + 2 fanno 9: resto 0.</p>

<div class="trappola">La prova del 9 non vede le cifre scambiate: 1692 e 1962 hanno lo stesso resto. Se restano due opzioni così, guarda l'ordine di grandezza o le prime cifre.</div>

<h3>Dove serve</h3>
<p>Nei test di calcolo a scelta multipla, e come controllo veloce di un conto fatto a mente prima di dirlo ad alta voce.</p>
`,
      en: `
<h3>Don't calculate: rule out</h3>
<p>In a multiple-choice test you don't need to know the result, you need to know which answers are impossible. Two checks are almost always enough, and each costs a second.</p>

<h3>1. The last digit</h3>
<p>The last digit of a sum or a product depends only on the last digits of the numbers. 47 × 36: 7 × 6 = 42, so the result ends in 2. Every option ending in another digit is out.</p>

<h3>2. Casting out nines</h3>
<p>When the options all end in the same digit (and tests are built that way on purpose), move to the remainder when dividing by 9.</p>
<p>Why it works: 10 = 9 + 1, so 10, 100 and 1000 all leave remainder 1 when divided by 9. A number like 1692 is 1·1000 + 6·100 + 9·10 + 2, and its remainder is that of 1 + 6 + 9 + 2. <b>Every number has the same remainder as the sum of its digits.</b></p>
<p>And remainders follow the operations: the remainder of a product is the product of the remainders, the remainder of a sum is the sum of the remainders.</p>
<div class="esempio">47 → 4 + 7 = 11 → 2<br>36 → 3 + 6 = 9 → remainder 0<br>product: 2 × 0 = 0<br>1682 → 17 → 8 ✗ · 1692 → 18 → 0 ✓ · 1702 → 10 → 1 ✗ · 1592 → 17 → 8 ✗</div>
<p>Shortcut: while adding the digits, skip the 9s and any pairs that make 9. In 4725, 4 + 5 and 7 + 2 make 9: remainder 0.</p>

<div class="trappola">Casting out nines can't see swapped digits: 1692 and 1962 have the same remainder. If two options like that are left, look at the size or the first digits.</div>

<h3>Where it helps</h3>
<p>In multiple-choice arithmetic tests, and as a quick check on a mental calculation before you say it out loud.</p>
`,
    },
    scheda: {
      it: 'Scelta multipla: prima l\'ultima cifra (dipende solo dalle ultime cifre). Se coincide, prova del 9: ogni numero ha il resto della somma delle sue cifre, e i resti seguono somme e prodotti. Non vede le cifre scambiate.',
      en: 'Multiple choice: first the last digit (it depends only on the last digits). If it matches, cast out nines: every number has the remainder of its digit sum, and remainders follow sums and products. It can\'t see swapped digits.',
    },
    test: true,
    nomiLivelli: { it: ['Ultima cifra', 'Prova del 9', 'Somme a catena'], en: ['Last digit', 'Casting out nines', 'Chained sums'] },
    livelli: [ultimaCifra, nove, catena],
  });
})();
