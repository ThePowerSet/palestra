(function () {
  'use strict';
  const P = Palestra;

  const FATTORI = {
    12: [3, 4], 14: [2, 7], 15: [3, 5], 16: [2, 8], 18: [2, 9], 20: [2, 10], 21: [3, 7], 24: [3, 8],
    25: [5, 5], 35: [5, 7], 36: [4, 9], 45: [5, 9], 48: [6, 8], 56: [7, 8], 63: [7, 9], 72: [8, 9], 75: [3, 25],
  };

  function passi(N, D) {
    const [f1, f2] = FATTORI[D];
    if (D === 25) {
      return {
        come: P.t('Diviso 25 è per 4 e diviso 100.', 'Dividing by 25 is times 4 and divided by 100.'),
        primo: `${P.fmt(N)} × 4 = ${P.fmt(N * 4)}.`,
        sol: [`${P.fmt(N)} × 4 = ${P.fmt(N * 4)}`, `÷ 100 = ${P.fmt(N / 25)}`],
      };
    }
    return {
      come: P.t(`${D} = ${f1} × ${f2}: dividi prima per ${f1} e poi per ${f2}.`, `${D} = ${f1} × ${f2}: divide by ${f1} first, then by ${f2}.`),
      primo: `${P.fmt(N)} ÷ ${f1} = ${P.fmt(N / f1)}.`,
      sol: [`${P.fmt(N)} ÷ ${f1} = ${P.fmt(N / f1)}`, `${P.fmt(N / f1)} ÷ ${f2} = ${P.fmt(N / D)}`],
    };
  }

  function divisione() {
    const D = P.pick([12, 14, 15, 16, 18, 24, 25, 35, 36, 45, 48, 56, 72, 75]), q = P.int(12, 99), N = D * q;
    const p = passi(N, D);
    return {
      testo: `<span class="num">${P.fmt(N)} ÷ ${D}</span>`,
      risposta: P.numero(q),
      suggerimenti: [p.come, p.primo],
      soluzione: p.sol,
    };
  }

  function pnlGiornaliero() {
    const D = P.pick([15, 20, 21, 24, 25, 35, 36, 45, 63]), q = P.int(12, 90), N = D * q * 1000;
    const p = passi(N / 1000, D);
    return {
      testo: P.t(`Il book ha fatto <span class="num">${P.fmt(N)} €</span> di P&L in ${D} giorni di borsa. Quanto al giorno, in media?`,
        `The book made <span class="num">${P.fmt(N)} €</span> of P&L in ${D} trading days. How much a day, on average?`),
      risposta: P.numero(q * 1000, { unita: '€' }),
      suggerimenti: [
        P.t(`Togli prima i tre zeri: ${P.fmt(N / 1000)} ÷ ${D}, poi rimettili. ${p.come}`, `Take off the three zeros first: ${P.fmt(N / 1000)} ÷ ${D}, then put them back. ${p.come}`),
        p.primo,
      ],
      soluzione: [P.t(`${P.fmt(N)} ÷ ${D} = (${P.fmt(N / 1000)} ÷ ${D}) mila`, `${P.fmt(N)} ÷ ${D} = (${P.fmt(N / 1000)} ÷ ${D}) thousand`)]
        .concat(p.sol, [P.t(`${q} mila = ${P.fmt(q * 1000)} €`, `${q} thousand = ${P.fmt(q * 1000)} €`)]),
    };
  }

  function ordini() {
    const D = P.pick([12, 15, 24, 25, 35, 45, 48, 75]), q = P.int(14, 99), N = D * q;
    const p = passi(N, D);
    return {
      testo: P.t(`Devi eseguire <span class="num">${P.fmt(N)}</span> azioni in ordini da ${D}. Quanti ordini servono?`,
        `You have to execute <span class="num">${P.fmt(N)}</span> shares in orders of ${D}. How many orders do you need?`),
      risposta: P.numero(q, { unita: P.t('ordini', 'orders') }),
      suggerimenti: [p.come, p.primo],
      soluzione: p.sol,
    };
  }

  function prezzoMedio() {
    const D = P.pick([12, 16, 24, 36, 48]), p = P.int(20, 95) + P.pick([0.25, 0.5, 0.75]), T = D * p;
    const g = P.mcd(T, D);
    return {
      testo: P.t(`Paghi <span class="num">${P.fmt(T)} €</span> per ${D} contratti. Qual è il prezzo medio per contratto?`,
        `You pay <span class="num">${P.fmt(T)} €</span> for ${D} contracts. What is the average price per contract?`),
      risposta: P.numero(p, { unita: '€' }),
      suggerimenti: [
        P.t(`Semplifica ${P.fmt(T)}/${D} prima di dividere: cerca il fattore comune più grande.`, `Simplify ${P.fmt(T)}/${D} before dividing: look for the largest common factor.`),
        P.t(`Dividi sopra e sotto per ${g}: ${P.fmt(T / g)}/${D / g}.`, `Divide top and bottom by ${g}: ${P.fmt(T / g)}/${D / g}.`),
      ],
      soluzione: [
        P.t(`${P.fmt(T)}/${D} = ${P.fmt(T / g)}/${D / g} (diviso ${g})`, `${P.fmt(T)}/${D} = ${P.fmt(T / g)}/${D / g} (divided by ${g})`),
        `${P.fmt(T / g)} ÷ ${D / g} = ${P.fmt(p)}`,
      ],
    };
  }

  P.trucco({
    id: 'div-semplifica',
    materia: 'calcolo',
    capitolo: 'div',
    numero: 7,
    titolo: { it: 'Semplifica prima di dividere', en: 'Simplify before dividing' },
    sottotitolo: {
      it: 'Una divisione è una frazione: togli i fattori comuni e il divisore scomodo sparisce.',
      en: 'A division is a fraction: take out the common factors and the awkward divisor disappears.',
    },
    aggancio: {
      it: 'Il book ha fatto 1,260,000 € in 35 giorni. Quanto al giorno? Non si divide per 35: si divide per 5, poi per 7. 36,000.',
      en: 'The book made 1,260,000 € in 35 days. How much a day? You don\'t divide by 35: divide by 5, then by 7. 36,000.',
    },
    lezione: {
      it: `
<h3>Una divisione è una frazione</h3>
<p>3600 ÷ 45 è la frazione 3600/45, e una frazione si può semplificare. Dividi sopra e sotto per 5: 720/9. Ora è una tabellina: 80.</p>
<p>Il divisore scomodo non va attaccato di petto. Si smonta.</p>

<h3>Due mosse</h3>
<p><b>Spezza il divisore</b> in fattori che conosci e dividi un pezzo alla volta.</p>
<div class="esempio">÷ 35 = ÷ 5 e poi ÷ 7<br>÷ 45 = ÷ 5 e poi ÷ 9<br>÷ 72 = ÷ 8 e poi ÷ 9<br>÷ 25 = × 4 e poi ÷ 100</div>
<p><b>Togli i fattori comuni</b> quando il risultato non è intero: riduci finché sotto resta un numero piccolo.</p>
<div class="esempio">2250 / 36: diviso 9 sopra e sotto → 250 / 4 = 62.5</div>

<h3>Come trovi i fattori</h3>
<ul>
<li>2: l'ultima cifra è pari. 4: le ultime due cifre si dividono per 4. 8: le ultime tre.</li>
<li>3 e 9: la somma delle cifre si divide per 3 o per 9 (2250 → 9).</li>
<li>5: finisce per 0 o 5. Gli zeri in comune si tolgono subito.</li>
</ul>

<h3>Al desk</h3>
<p>Medie giornaliere di P&L, prezzi medi di esecuzione, ordini da spezzare in lotti: sono divisioni per numeri come 21, 35 o 63 (giorni di borsa in un mese, in sette settimane, in un trimestre). Togli gli zeri, spezza il divisore, e il conto sta in testa.</p>
<div class="esempio">1,260,000 ÷ 35: senza zeri 1260 ÷ 35; ÷ 5 = 252; ÷ 7 = 36 → 36,000 €</div>
`,
      en: `
<h3>A division is a fraction</h3>
<p>3600 ÷ 45 is the fraction 3600/45, and a fraction can be simplified. Divide top and bottom by 5: 720/9. Now it is a times table: 80.</p>
<p>An awkward divisor shouldn't be attacked head-on. Take it apart.</p>

<h3>Two moves</h3>
<p><b>Split the divisor</b> into factors you know and divide one piece at a time.</p>
<div class="esempio">÷ 35 = ÷ 5 then ÷ 7<br>÷ 45 = ÷ 5 then ÷ 9<br>÷ 72 = ÷ 8 then ÷ 9<br>÷ 25 = × 4 then ÷ 100</div>
<p><b>Remove common factors</b> when the result is not a whole number: reduce until a small number is left underneath.</p>
<div class="esempio">2250 / 36: divide top and bottom by 9 → 250 / 4 = 62.5</div>

<h3>How to find the factors</h3>
<ul>
<li>2: the last digit is even. 4: the last two digits divide by 4. 8: the last three.</li>
<li>3 and 9: the digit sum divides by 3 or by 9 (2250 → 9).</li>
<li>5: it ends in 0 or 5. Common zeros come off straight away.</li>
</ul>

<h3>On the desk</h3>
<p>Average daily P&L, average execution prices, orders to split into lots: these are divisions by numbers like 21, 35 or 63 (trading days in a month, in seven weeks, in a quarter). Take off the zeros, split the divisor, and the calculation fits in your head.</p>
<div class="esempio">1,260,000 ÷ 35: without zeros 1260 ÷ 35; ÷ 5 = 252; ÷ 7 = 36 → 36,000 €</div>
`,
    },
    scheda: {
      it: 'Divisione = frazione. Spezza il divisore (÷ 35 = ÷ 5 ÷ 7; ÷ 25 = × 4 ÷ 100) o togli i fattori comuni finché sotto resta un numero piccolo. Gli zeri in comune si tolgono subito.',
      en: 'Division = fraction. Split the divisor (÷ 35 = ÷ 5 ÷ 7; ÷ 25 = × 4 ÷ 100) or remove common factors until a small number is left underneath. Common zeros come off straight away.',
    },
    test: true,
    nomiLivelli: { it: ['Calcolo', 'Al desk', 'Risultati decimali'], en: ['Calculation', 'On the desk', 'Decimal results'] },
    livelli: [
      divisione,
      () => P.pesato([[0.6, pnlGiornaliero], [0.4, ordini]])(),
      prezzoMedio,
    ],
  });
})();
