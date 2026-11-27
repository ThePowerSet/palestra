(function () {
  'use strict';
  const P = Palestra;
  const F = {
    orologio: P.fonte('zhou', '§2.5, "Clock pieces"'),
    orologioCrack: P.fonte('crack', 'Question 1.5', { nota: { it: 'lo stesso orologio rotto', en: 'the same broken clock' } }),
    mancante: P.fonte('zhou', '§2.5, "Missing integers"'),
    mancanteW: P.fonte('winkler', '"Finding the Missing Number"', { nota: { it: 'un numero mancante, a memoria', en: 'one missing number, from memory' } }),
    sacchetti: P.fonte('zhou', '§2.5, "Counterfeit coins I"'),
    sacchettiCrack: P.fonte('crack', 'Question 1.62', { nota: { it: 'le tasse del re, una pesata', en: 'the king\'s tax, one weighing' } }),
    strette: P.fonte('crack', 'Question 1.35'),
  };
  const gauss = n => n * (n + 1) / 2;

  function orologio() {
    const [n, k] = P.pick([[12, 2], [12, 3], [12, 6], [15, 3], [15, 4], [16, 4], [16, 8], [20, 5], [24, 3], [24, 4], [24, 5]]);
    const s = gauss(n), v = s / k;
    return {
      testo: P.t(`Un quadrante ha i numeri da 1 a ${n} in cerchio. Cade e si rompe in ${k} pezzi, ognuno con numeri consecutivi, e i numeri di ogni pezzo hanno la stessa somma. Quanto fa la somma di un pezzo?`,
        `A dial has the numbers 1 to ${n} in a circle. It falls and breaks into ${k} pieces, each holding consecutive numbers, and the numbers on every piece add up to the same total. What is the total of one piece?`),
      risposta: P.numero(v),
      suggerimenti: [
        P.t('Prima la somma di tutti i numeri, poi dividi per i pezzi.', 'First the sum of all the numbers, then divide by the pieces.'),
        P.t(`Da 1 a ${n}: accoppia il primo con l'ultimo, il secondo con il penultimo; ogni coppia fa ${n + 1}, e in tutto fa ${n} × ${n + 1} / 2.`, `From 1 to ${n}: pair the first with the last, the second with the one before last; each pair makes ${n + 1}, and the whole sum is ${n} × ${n + 1} / 2.`),
      ],
      soluzione: [`1 + … + ${n} = ${n} × ${n + 1} / 2 = ${s}`, `${s} / ${k} = ${v}`],
      fonte: F.orologio,
    };
  }

  function mancante() {
    const n = P.pick([50, 60, 80, 100, 120, 150, 200]), x = P.int(1, n), S = gauss(n) - x;
    return {
      testo: P.t(`Ti leggono, in ordine sparso, tutti i numeri da 1 a ${n} tranne uno. Mentre ascolti tieni solo la somma: alla fine fa ${P.fmt(S)}. Quale numero manca?`,
        `Someone reads out, in no particular order, all the numbers from 1 to ${n} but one. While listening you keep only the running sum: at the end it is ${P.fmt(S)}. Which number is missing?`),
      risposta: P.numero(x),
      suggerimenti: [
        P.t(`Quanto farebbe la somma se ci fossero tutti?`, `What would the sum be if they were all there?`),
        P.t(`Da 1 a ${n}: ${n} × ${n + 1} / 2 = ${P.fmt(gauss(n))}.`, `From 1 to ${n}: ${n} × ${n + 1} / 2 = ${P.fmt(gauss(n))}.`),
      ],
      soluzione: [`${n} × ${n + 1} / 2 = ${P.fmt(gauss(n))}`, `${P.fmt(gauss(n))} − ${P.fmt(S)} = ${x}`],
      fonte: F.mancante,
    };
  }

  // One weighing: take i coins from bag i, the missing grams say which bag is fake
  function sacchetti() {
    const k = P.int(8, 12), w = P.pick([5, 10, 20]), d = P.pick([1, 1, 2]), j = P.int(1, k);
    const tot = gauss(k), W = w * tot - d * j;
    return {
      testo: P.t(`Hai ${k} sacchetti di monete. In tutti le monete pesano ${w} grammi, tranne in uno, dove ognuna pesa ${w - d} grammi. Prendi 1 moneta dal sacchetto 1, 2 dal sacchetto 2, e così via fino a ${k} dal sacchetto ${k}, e le pesi tutte insieme: la bilancia segna ${P.fmt(W)} grammi. Qual è il sacchetto falso?`,
        `You have ${k} bags of coins. In all of them each coin weighs ${w} grams, except one bag where each weighs ${w - d} grams. You take 1 coin from bag 1, 2 from bag 2, and so on up to ${k} from bag ${k}, and weigh them all together: the scale reads ${P.fmt(W)} grams. Which bag is fake?`),
      risposta: P.numero(j),
      suggerimenti: [
        P.t('Quanto peserebbero le monete se fossero tutte buone?', 'What would the coins weigh if they were all good?'),
        P.t(`Le monete sono 1 + … + ${k} = ${tot}; buone peserebbero ${w} × ${tot} = ${P.fmt(w * tot)}. Ogni moneta falsa toglie ${d} gramm${d === 1 ? 'o' : 'i'}.`, `There are 1 + … + ${k} = ${tot} coins; all good they would weigh ${w} × ${tot} = ${P.fmt(w * tot)}. Each fake coin takes off ${d} gram${d === 1 ? '' : 's'}.`),
      ],
      soluzione: [
        P.t(`peso atteso: ${w} × ${tot} = ${P.fmt(w * tot)}; mancano ${P.fmt(w * tot)} − ${P.fmt(W)} = ${d * j} grammi`, `expected weight: ${w} × ${tot} = ${P.fmt(w * tot)}; missing: ${P.fmt(w * tot)} − ${P.fmt(W)} = ${d * j} grams`),
        P.t(`${d * j} / ${d} = ${j} monete false: è il sacchetto ${j}`, `${d * j} / ${d} = ${j} fake coins: it is bag ${j}`),
      ],
      fonte: F.sacchetti,
    };
  }

  function strette() {
    const n = P.int(8, 40), H = n * (n - 1) / 2;
    return {
      testo: P.t(`A una festa ognuno stringe la mano a tutti gli altri, una volta sola. In tutto ci sono ${P.fmt(H)} strette di mano. Quante persone ci sono?`,
        `At a party everyone shakes hands with everyone else, once. There are ${P.fmt(H)} handshakes in all. How many people are there?`),
      risposta: P.numero(n),
      suggerimenti: [
        P.t('Con n persone, ognuna stringe n − 1 mani, e ogni stretta coinvolge due persone.', 'With n people, each shakes n − 1 hands, and every handshake involves two people.'),
        P.t(`Strette = n × (n − 1) / 2, quindi n × (n − 1) = ${2 * H}: cerca due interi consecutivi con quel prodotto, vicino a √${2 * H}.`, `Handshakes = n × (n − 1) / 2, so n × (n − 1) = ${2 * H}: look for two consecutive whole numbers with that product, near √${2 * H}.`),
      ],
      soluzione: [`n × (n − 1) = 2 × ${P.fmt(H)} = ${2 * H}`, `${n} × ${n - 1} = ${2 * H} → n = ${n}`],
      fonte: F.strette,
    };
  }

  // Two missing numbers: the sum and the sum of squares give x + y and x² + y²
  function dueMancanti() {
    const n = P.pick([20, 20, 25, 30]);
    let x, y;
    do { x = P.int(1, n); y = P.int(1, n); } while (x >= y);
    const S = gauss(n) - x - y, Q = n * (n + 1) * (2 * n + 1) / 6 - x * x - y * y;
    const s = x + y, q = x * x + y * y, dd = 2 * q - s * s;
    return {
      testo: P.t(`Dei numeri da 1 a ${n} ne mancano due. Quelli presenti sommano a ${P.fmt(S)}, e i loro quadrati sommano a ${P.fmt(Q)}. Qual è il più grande dei due numeri mancanti?`,
        `Two of the numbers from 1 to ${n} are missing. The ones present add up to ${P.fmt(S)}, and their squares add up to ${P.fmt(Q)}. What is the larger of the two missing numbers?`),
      nota: P.t(`1 + … + ${n} = ${gauss(n)}; 1² + … + ${n}² = ${P.fmt(n * (n + 1) * (2 * n + 1) / 6)}`, `1 + … + ${n} = ${gauss(n)}; 1² + … + ${n}² = ${P.fmt(n * (n + 1) * (2 * n + 1) / 6)}`),
      risposta: P.numero(y),
      suggerimenti: [
        P.t('Dalle due somme complete ricavi x + y e x² + y² dei numeri mancanti.', 'From the two full sums you get x + y and x² + y² of the missing numbers.'),
        P.t(`x + y = ${s} e x² + y² = ${q}. Poi (y − x)² = 2(x² + y²) − (x + y)².`, `x + y = ${s} and x² + y² = ${q}. Then (y − x)² = 2(x² + y²) − (x + y)².`),
      ],
      soluzione: [
        `x + y = ${gauss(n)} − ${P.fmt(S)} = ${s}; x² + y² = ${P.fmt(n * (n + 1) * (2 * n + 1) / 6)} − ${P.fmt(Q)} = ${q}`,
        `(y − x)² = 2 × ${q} − ${s}² = ${dd} → y − x = ${y - x}`,
        `y = (${s} + ${y - x}) / 2 = ${y}`,
      ],
      fonte: F.mancante,
    };
  }

  P.trucco({
    id: 'bt-somme',
    materia: 'rompicapi',
    capitolo: 'contare',
    numero: 4,
    titolo: { it: 'Somme alla Gauss', en: 'Sums the Gauss way' },
    sottotitolo: {
      it: 'La somma da 1 a n, quella dei quadrati e un buon uso dei pesi diversi: il numero mancante, il sacchetto falso, l\'orologio rotto.',
      en: 'The sum from 1 to n, the sum of squares and a good use of different weights: the missing number, the fake bag, the broken clock.',
    },
    aggancio: {
      it: '«Dieci sacchetti di monete, uno è tutto falso e ogni moneta pesa un grammo in meno. Hai una bilancia e una sola pesata.» La risposta sta in 1 + 2 + … + 10.',
      en: '"Ten bags of coins, one is all fake and each fake coin weighs a gram less. You have a scale and a single weighing." The answer lies in 1 + 2 + … + 10.',
    },
    lezione: {
      it: `
<h3>1 + 2 + … + n</h3>
<p>Accoppia il primo con l'ultimo, il secondo con il penultimo: ogni coppia fa n + 1, e le coppie sono n/2. Quindi 1 + … + n = n(n + 1)/2. Per i quadrati: 1² + … + n² = n(n + 1)(2n + 1)/6.</p>
<div class="esempio">1 + … + 12 = 12 × 13 / 2 = 78: un orologio rotto in tre pezzi di somma uguale ha pezzi da 26.<br>1 + … + 100 = 5,050.</div>

<h3>Che cosa manca</h3>
<p>Se conosci il totale e misuri quello che c'è, la differenza è quello che manca. Un numero mancante: totale meno somma letta. Due numeri mancanti: la somma dà x + y, i quadrati danno x² + y², e da (y − x)² = 2(x² + y²) − (x + y)² li trovi tutti e due.</p>

<h3>Pesi diversi per distinguere</h3>
<p>Con una sola pesata si distinguono i sacchetti se ognuno contribuisce con un numero diverso di monete: 1 dal primo, 2 dal secondo, … Il peso che manca, diviso per quello che manca a ogni moneta falsa, è il numero del sacchetto.</p>

<div class="trappola">Nel sacchetto falso controlla quanti grammi toglie ogni moneta: se sono 2, la differenza va divisa per 2. E se le false possono essere più pesanti o più leggere, il segno della differenza dice anche quale delle due.</div>
`,
      en: `
<h3>1 + 2 + … + n</h3>
<p>Pair the first with the last, the second with the one before last: each pair makes n + 1, and there are n/2 pairs. So 1 + … + n = n(n + 1)/2. For squares: 1² + … + n² = n(n + 1)(2n + 1)/6.</p>
<div class="esempio">1 + … + 12 = 12 × 13 / 2 = 78: a clock broken into three pieces with equal sums has pieces of 26.<br>1 + … + 100 = 5,050.</div>

<h3>What is missing</h3>
<p>If you know the total and measure what is there, the difference is what is missing. One missing number: total minus the sum you heard. Two missing numbers: the sum gives x + y, the squares give x² + y², and from (y − x)² = 2(x² + y²) − (x + y)² you find both.</p>

<h3>Different weights to tell bags apart</h3>
<p>With a single weighing you can tell the bags apart if each contributes a different number of coins: 1 from the first, 2 from the second, … The missing weight, divided by what each fake coin lacks, is the number of the bag.</p>

<div class="trappola">In the fake bag check how many grams each coin is short: if it is 2, the difference must be divided by 2. And if fakes could be heavier or lighter, the sign of the difference also tells you which.</div>
`,
    },
    scheda: {
      it: '1 + … + n = n(n + 1)/2; 1² + … + n² = n(n + 1)(2n + 1)/6. Mancante = totale − somma. Due mancanti: x + y e x² + y², poi (y − x)² = 2(x² + y²) − (x + y)². Sacchetto falso: i monete dal sacchetto i, grammi mancanti / grammi per moneta.',
      en: '1 + … + n = n(n + 1)/2; 1² + … + n² = n(n + 1)(2n + 1)/6. Missing = total − sum. Two missing: x + y and x² + y², then (y − x)² = 2(x² + y²) − (x + y)². Fake bag: i coins from bag i, missing grams / grams per coin.',
    },
    fonti: [F.orologio, F.orologioCrack, F.mancante, F.mancanteW, F.sacchetti, F.sacchettiCrack, F.strette],
    test: false,
    nomiLivelli: { it: ['Orologio e numero mancante', 'Sacchetto falso e strette di mano', 'Due numeri mancanti'], en: ['Clock and missing number', 'Fake bag and handshakes', 'Two missing numbers'] },
    livelli: [
      () => (P.chance(0.5) ? orologio() : mancante()),
      () => (P.chance(0.6) ? sacchetti() : strette()),
      dueMancanti,
    ],
  });
})();
