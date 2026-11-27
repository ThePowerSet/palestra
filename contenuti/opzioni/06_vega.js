(function () {
  'use strict';
  const P = Palestra;
  const f2 = x => P.fmt(x, 2);
  const SCADENZE = [
    { nome: { it: '1 anno', en: '1 year' }, T: 1, r: 1 },
    { nome: { it: '3 mesi', en: '3 months' }, T: 0.25, r: 0.5 },
    { nome: { it: '4 anni', en: '4 years' }, T: 4, r: 2 },
    { nome: { it: '9 mesi', en: '9 months' }, T: 0.75, r: 0.87 },
  ];

  function vega() {
    const S = P.pick([25, 50, 100, 100, 200, 250, 500]), T = P.pick(SCADENZE.slice(0, 3)), v = 0.004 * S * T.r;
    return {
      testo: P.t(`Call at-the-money a ${P.tr(T.nome)} su un titolo a ${S}. Quanto vale il vega, per un punto di vol?`,
        `At-the-money call expiring in ${P.tr(T.nome)} on a stock at ${S}. What is its vega, per vol point?`),
      nota: P.t('quanto cambia il prezzo se la vol sale da 20% a 21%; tassi a zero', 'how much the price changes if vol goes from 20% to 21%; zero rates'),
      risposta: P.numero(v, { rel: 0.03, mostra: P.fmt(v, 3) }),
      suggerimenti: [
        P.t('Per un\'opzione at-the-money il prezzo è circa 0.4 × S × σ × √T, lineare in σ: un punto di vol (0.01) vale 0.004 × S × √T.', 'At the money the price is about 0.4 × S × σ × √T, linear in σ: one vol point (0.01) is worth 0.004 × S × √T.'),
        `0.004 × ${S} = ${P.fmt(0.004 * S)}; √T = ${P.fmt(T.r)}.`,
      ],
      soluzione: [`0.004 × ${S} × ${P.fmt(T.r)} = ${P.fmt(v, 3)}`],
    };
  }

  function pnl() {
    if (P.chance(0.5)) {
      // the ATM price is linear in vol: new price = old × new vol / old vol
      const s1 = P.pick([16, 20, 20, 24, 25, 30, 40]), s2 = s1 + P.pick([-8, -5, -4, -2, 2, 4, 5, 8]), C = P.pick([2, 3, 4, 5, 6, 8, 10]);
      const v = C * s2 / s1;
      return {
        testo: P.t(`Una call at-the-money costa ${P.fmt(C)} con vol ${s1}%. La vol implicita va a ${s2}%, il titolo non si muove. Quanto vale adesso?`,
          `An at-the-money call costs ${P.fmt(C)} with vol ${s1}%. Implied vol moves to ${s2}%, the stock does not move. What is it worth now?`),
        risposta: P.numero(v, { rel: 0.02, mostra: f2(v) }),
        suggerimenti: [
          P.t('Per un\'opzione at-the-money il prezzo è circa proporzionale alla vol (0.4 × S × σ × √T).', 'At the money the price is roughly proportional to vol (0.4 × S × σ × √T).'),
          `${P.fmt(C)} × ${s2} / ${s1}.`,
        ],
        soluzione: [`${P.fmt(C)} × ${s2}/${s1} = ${f2(v)}`],
      };
    }
    const n = P.pick([10, 20, 25, 50, 100]), S = P.pick([50, 100, 200]), T = P.pick(SCADENZE.slice(0, 3)), d = P.pick([-3, -2, -1, 1, 2, 3, 5]);
    const lungo = P.chance(0.6), vg = 0.004 * S * T.r, v = (lungo ? 1 : -1) * n * 100 * vg * d;
    return {
      testo: P.t(`Sei ${lungo ? 'lungo' : 'corto'} di ${n} call at-the-money a ${P.tr(T.nome)} su un titolo a ${S}, ognuna su 100 azioni. La vol implicita ${d > 0 ? 'sale' : 'scende'} di ${Math.abs(d)} punt${Math.abs(d) === 1 ? 'o' : 'i'}. P&L?`,
        `You are ${lungo ? 'long' : 'short'} ${n} at-the-money calls expiring in ${P.tr(T.nome)} on a stock at ${S}, each on 100 shares. Implied vol ${d > 0 ? 'rises' : 'falls'} by ${Math.abs(d)} point${Math.abs(d) === 1 ? '' : 's'}. P&L?`),
      nota: P.t('con il segno; tassi a zero', 'with its sign; zero rates'),
      risposta: P.numero(v, { rel: 0.03 }),
      suggerimenti: [
        P.t('P&L = vega per punto × punti × numero di azioni, con il segno della posizione. Vega per punto ≈ 0.004 × S × √T.',
          'P&L = vega per point × points × number of shares, with the sign of the position. Vega per point ≈ 0.004 × S × √T.'),
        P.t(`vega = ${P.fmt(vg, 3)}; azioni: ${n} × 100 = ${n * 100}.`, `vega = ${P.fmt(vg, 3)}; shares: ${n} × 100 = ${n * 100}.`),
      ],
      soluzione: [`0.004 × ${S} × ${P.fmt(T.r)} = ${P.fmt(vg, 3)}`, `${lungo ? '' : '−'}${P.fmt(vg, 3)} × ${n * 100} × (${P.conSegno(d)}) = ${P.fmt(v)}`],
    };
  }

  function vegaNeutrale() {
    const [a, b] = P.pick([[0, 1], [0, 2], [1, 2], [1, 0], [2, 0], [2, 1]]), A = SCADENZE[a], B = SCADENZE[b], n = P.pick([20, 40, 60, 80, 100]);
    const k = A.r / B.r, v = n * k;
    return {
      testo: P.t(`Sei lungo di ${n} straddle at-the-money a ${P.tr(A.nome)}. Quanti straddle at-the-money a ${P.tr(B.nome)}, stesso titolo, devi vendere per non avere vega?`,
        `You are long ${n} at-the-money straddles expiring in ${P.tr(A.nome)}. How many at-the-money straddles expiring in ${P.tr(B.nome)}, same stock, do you sell to have no vega?`),
      risposta: P.numero(v, { rel: 0.02 }),
      suggerimenti: [
        P.t('Il vega at-the-money cresce con √T: il rapporto fra i vega è √(T₁ / T₂).', 'At-the-money vega grows with √T: the ratio of the vegas is √(T₁ / T₂).'),
        `√T: ${P.fmt(A.r)} ${P.t('contro', 'against')} ${P.fmt(B.r)}.`,
      ],
      soluzione: [P.t(`rapporto dei vega: ${P.fmt(A.r)} / ${P.fmt(B.r)} = ${P.fmt(k)}`, `ratio of vegas: ${P.fmt(A.r)} / ${P.fmt(B.r)} = ${P.fmt(k)}`), `${n} × ${P.fmt(k)} = ${P.fmt(v)}`,
        P.t('stesso vega, ma theta e gamma diversi: la scadenza corta ha più gamma', 'same vega, but different theta and gamma: the short expiry has more gamma')],
    };
  }

  P.trucco({
    id: 'opz-vega',
    materia: 'opzioni',
    capitolo: 'greche',
    numero: 6,
    titolo: { it: 'Vega ≈ 0.004 · S · √T', en: 'Vega ≈ 0.004 · S · √T' },
    sottotitolo: {
      it: 'Quanto guadagni o perdi se la vol implicita si muove di un punto, e come si mettono insieme scadenze diverse.',
      en: 'How much you make or lose if implied vol moves by a point, and how different expiries net out.',
    },
    aggancio: {
      it: '«Sei lungo di 50 call a un anno su un titolo a 100. La vol sale di 2 punti: quanto hai fatto?» 0.4 a punto, per 5,000 azioni, per 2: 4,000.',
      en: '"You are long 50 one-year calls on a stock at 100. Vol rises 2 points: what did you make?" 0.4 a point, times 5,000 shares, times 2: 4,000.',
    },
    lezione: {
      it: `
<h3>Il vega at-the-money</h3>
<p>Il vega è di quanto cambia il prezzo dell'opzione se la vol implicita sale di un punto (da 20% a 21%). At-the-money il prezzo è circa 0.4 × S × σ × √T, lineare in σ: un punto, cioè 0.01, vale</p>
<div class="esempio">vega ATM ≈ 0.004 × S × √T per punto di vol<br>S = 100, un anno: 0.4 · tre mesi: 0.2 · quattro anni: 0.8</div>
<p>Call e put con lo stesso strike hanno lo stesso vega (dalla parità: la differenza è un forward, che non dipende dalla vol). Uno straddle ha il doppio del vega di una call.</p>

<h3>Il P&L</h3>
<p>P&L = vega × punti di vol × numero di azioni, con il segno della posizione. E siccome at-the-money il prezzo è proporzionale alla vol, c'è una scorciatoia: se la vol passa da 20 a 25, la call ATM vale un quarto in più.</p>

<h3>Scadenze diverse</h3>
<p>Il vega cresce con √T: un'opzione a un anno ha il doppio del vega di una a tre mesi. Per non avere vega, vendi il doppio delle opzioni a tre mesi. Il libro resta però esposto in un altro modo: le opzioni corte hanno più gamma e più theta, e le vol a scadenze diverse non si muovono insieme.</p>

<div class="trappola">Il vega si dà per punto di vol, non per 1.00 di vol: 0.4 × S × √T è per il 100%. Dividere per 100 è dove si sbaglia.</div>
`,
      en: `
<h3>At-the-money vega</h3>
<p>Vega is how much the option's price changes if implied vol rises by one point (from 20% to 21%). At the money the price is about 0.4 × S × σ × √T, linear in σ: one point, that is 0.01, is worth</p>
<div class="esempio">ATM vega ≈ 0.004 × S × √T per vol point<br>S = 100, one year: 0.4 · three months: 0.2 · four years: 0.8</div>
<p>A call and a put with the same strike have the same vega (from parity: the difference is a forward, which does not depend on vol). A straddle has twice the vega of a call.</p>

<h3>The P&L</h3>
<p>P&L = vega × vol points × number of shares, with the sign of the position. And since the ATM price is proportional to vol, there is a shortcut: if vol goes from 20 to 25, the ATM call is worth a quarter more.</p>

<h3>Different expiries</h3>
<p>Vega grows with √T: a one-year option has twice the vega of a three-month one. To have no vega, you sell twice as many three-month options. The book is still exposed in another way: short-dated options have more gamma and more theta, and vols at different expiries do not move together.</p>

<div class="trappola">Vega is quoted per vol point, not per 1.00 of vol: 0.4 × S × √T is for 100%. Dividing by 100 is where people slip.</div>
`,
    },
    scheda: {
      it: 'Vega ATM ≈ 0.004 × S × √T per punto. Call e put stesso strike: stesso vega; straddle: il doppio. P&L = vega × punti × azioni. Prezzo ATM proporzionale alla vol. Vega ∝ √T: per neutralizzare, rapporto √(T₁/T₂).',
      en: 'ATM vega ≈ 0.004 × S × √T per point. Call and put, same strike: same vega; straddle: double. P&L = vega × points × shares. ATM price proportional to vol. Vega ∝ √T: to neutralise, ratio √(T₁/T₂).',
    },
    test: false,
    nomiLivelli: { it: ['Vega', 'P&L', 'Vega neutrale'], en: ['Vega', 'P&L', 'Vega neutral'] },
    livelli: [vega, pnl, vegaNeutrale],
  });
})();
