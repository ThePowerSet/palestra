(function () {
  'use strict';
  const P = Palestra;

  const SCADENZE = [
    { nome: { it: '1 anno', en: '1 year' }, r: 1, approssimata: false, peso: 3 },
    { nome: { it: '3 mesi', en: '3 months' }, r: 0.5, approssimata: false, peso: 3 },
    { nome: { it: '4 anni', en: '4 years' }, r: 2, approssimata: false, peso: 1 },
    { nome: { it: '1 mese', en: '1 month' }, r: Math.sqrt(1 / 12), approssimata: true, peso: 1 },
    { nome: { it: '6 mesi', en: '6 months' }, r: Math.sqrt(0.5), approssimata: true, peso: 1 },
  ];
  const scadenza = () => P.pesato(SCADENZE.map(s => [s.peso, s]));
  const due = x => x.toFixed(2);
  const radice = T => (T.approssimata ? due(T.r) : P.fmt(T.r));           // il numero, per i conti
  const radiceTesto = T => (T.approssimata ? '≈ ' : '') + radice(T);     // con ≈ quando è arrotondata
  const tolleranza = T => (T.approssimata ? 0.06 : 0.03);
  const Q = () => P.fmt(0.4), O = () => P.fmt(0.8);

  function call() {
    const S = P.pick([50, 100, 100, 200, 400, 80, 25]), s = P.pick([10, 15, 20, 25, 30, 40, 50]), T = scadenza(), nome = P.tr(T.nome);
    const v = 0.4 * S * s / 100 * T.r;
    return {
      testo: P.t(`Prezzami al volo una call at-the-money a ${nome} su un titolo a ${S}, vol ${s}%.`, `Price me, on the spot, an at-the-money call expiring in ${nome} on a stock at ${S}, vol ${s}%.`),
      nota: P.t('tassi e dividendi a zero', 'zero rates and dividends'),
      risposta: P.numero(v, { rel: tolleranza(T), mostra: P.fmt(v, 2) }),
      suggerimenti: [
        P.t(`Call ATM ≈ ${Q()} × S × σ × √T, con σ in decimale e T in anni.`, `ATM call ≈ ${Q()} × S × σ × √T, with σ as a decimal and T in years.`),
        `√T = ${radiceTesto(T)}; ${Q()} × ${S} = ${P.fmt(0.4 * S)}; σ = ${P.fmt(s / 100)}.`,
      ],
      soluzione: [`${Q()} × ${S} × ${P.fmt(s / 100)} × ${radice(T)} = ${P.fmt(v, 2)}`],
    };
  }

  function straddle() {
    const S = P.pick([50, 100, 100, 200, 400]), s = P.pick([10, 15, 20, 25, 30, 40]), T = scadenza(), nome = P.tr(T.nome);
    const v = 0.8 * S * s / 100 * T.r;
    const pareggio = P.chance(0.5);
    return {
      testo: pareggio
        ? P.t(`Compri uno straddle at-the-money a ${nome} su un titolo a ${S}, vol ${s}%. Di quanto deve muoversi il titolo, in un senso o nell'altro, perché a scadenza tu vada in pari?`,
          `You buy an at-the-money straddle expiring in ${nome} on a stock at ${S}, vol ${s}%. How far does the stock have to move, either way, for you to break even at expiry?`)
        : P.t(`Quanto costa uno straddle at-the-money a ${nome} su un titolo a ${S}, vol ${s}%?`, `How much does an at-the-money straddle expiring in ${nome} cost on a stock at ${S}, vol ${s}%?`),
      nota: P.t('tassi e dividendi a zero', 'zero rates and dividends'),
      risposta: P.numero(v, { rel: tolleranza(T), mostra: P.fmt(v, 2) }),
      suggerimenti: [
        pareggio
          ? P.t(`A scadenza lo straddle vale |S − K|: vai in pari quando il movimento è uguale al prezzo che hai pagato. E straddle ATM ≈ ${O()} × S × σ × √T.`,
            `At expiry the straddle is worth |S − K|: you break even when the move equals the price you paid. And an ATM straddle ≈ ${O()} × S × σ × √T.`)
          : P.t(`Straddle = call + put, e at-the-money valgono quasi uguale: ${O()} × S × σ × √T.`, `Straddle = call + put, and at the money they are worth almost the same: ${O()} × S × σ × √T.`),
        `√T = ${radiceTesto(T)}; ${O()} × ${S} = ${P.fmt(0.8 * S)}.`,
      ],
      soluzione: [`${O()} × ${S} × ${P.fmt(s / 100)} × ${radice(T)} = ${P.fmt(v, 2)}`]
        .concat(pareggio ? [P.t('il titolo deve muoversi di quanto hai pagato', 'the stock has to move by what you paid')] : []),
    };
  }

  function volImplicita() {
    const T = P.pick(SCADENZE.slice(0, 3)), S = P.pick([50, 100, 100, 200]), s = P.pick([10, 15, 20, 25, 30, 40]), nome = P.tr(T.nome);
    const C = 0.4 * S * s / 100 * T.r, den = 0.4 * S * T.r;
    return {
      testo: P.t(`La call at-the-money a ${nome} su un titolo a ${S} costa ${P.fmt(C, 2)}. Che vol implicita stai pagando?`,
        `The at-the-money call expiring in ${nome} on a stock at ${S} costs ${P.fmt(C, 2)}. What implied vol are you paying?`),
      nota: P.t('in percentuale', 'as a percentage'),
      risposta: P.numero(s / 100, { percento: true, tol: 0.006, mostra: s + '%' }),
      suggerimenti: [
        P.t(`Rovescia la formula: σ ≈ C / (${Q()} × S × √T).`, `Turn the formula round: σ ≈ C / (${Q()} × S × √T).`),
        `${Q()} × ${S} × ${radice(T)} = ${P.fmt(den)}.`,
      ],
      soluzione: [`${Q()} × ${S} × ${radice(T)} = ${P.fmt(den)}`, `${P.fmt(C, 2)} / ${P.fmt(den)} = ${P.fmt(s / 100)} = ${s}%`],
    };
  }

  function vega() {
    const T = P.pick(SCADENZE.slice(0, 3)), S = P.pick([50, 100, 100, 200, 400]), s1 = P.pick([15, 20, 25, 30]), d = P.pick([1, 2, 3, 5]) * P.segno(), nome = P.tr(T.nome);
    const ve = 0.4 * S * T.r / 100, v = ve * d;
    return {
      testo: P.t(`Hai una call at-the-money a ${nome} su un titolo a ${S}, vol ${s1}%. Di quanto cambia il suo prezzo se la vol va ${P.al(s1 + d)}%?`,
        `You hold an at-the-money call expiring in ${nome} on a stock at ${S}, vol ${s1}%. How much does its price change if vol goes to ${s1 + d}%?`),
      nota: P.t('con il segno', 'with the sign'),
      risposta: P.numero(v, { rel: 0.04, mostra: P.conSegno(v, x => P.fmt(x, 2)) }),
      suggerimenti: [
        P.t(`Vicino all'ATM il prezzo è proporzionale alla vol: conta solo la differenza, ${P.conSegno(d)} punti.`, `Near the money the price is proportional to vol: only the difference counts, ${P.conSegno(d)} points.`),
        P.t(`Un punto di vol vale ${Q()} × ${S} × ${radice(T)} / 100 = ${P.fmt(ve, 3)}.`, `One vol point is worth ${Q()} × ${S} × ${radice(T)} / 100 = ${P.fmt(ve, 3)}.`),
      ],
      soluzione: [
        P.t(`vega per punto: ${Q()} × ${S} × ${radice(T)} / 100 = ${P.fmt(ve, 3)}`, `vega per point: ${Q()} × ${S} × ${radice(T)} / 100 = ${P.fmt(ve, 3)}`),
        P.t(`${P.conSegno(d)} punti × ${P.fmt(ve, 3)} = ${P.conSegno(v, x => P.fmt(x, 2))}`, `${P.conSegno(d)} points × ${P.fmt(ve, 3)} = ${P.conSegno(v, x => P.fmt(x, 2))}`),
      ],
    };
  }

  const COPPIE = [
    [{ it: '1 mese', en: '1 month' }, { it: '4 mesi', en: '4 months' }, 2],
    [{ it: '1 mese', en: '1 month' }, { it: '9 mesi', en: '9 months' }, 3],
    [{ it: '3 mesi', en: '3 months' }, { it: '1 anno', en: '1 year' }, 2],
    [{ it: '1 settimana', en: '1 week' }, { it: '4 settimane', en: '4 weeks' }, 2],
    [{ it: '1 mese', en: '1 month' }, { it: '1 settimana (circa un quarto di mese)', en: '1 week (about a quarter of a month)' }, 0.5],
  ];

  // Zero vol: the stock grows at the riskless rate for sure, so the ATM call is worth S − K e^(−rT) = S (1 − e^(−rT))
  function volZero() {
    const S = P.pick([50, 100, 100, 200]), r = P.pick([2, 3, 4, 5, 6]), T = P.pick([0.5, 1, 1, 2]);
    const v = S * (1 - Math.exp(-r / 100 * T));
    const nomeT = T === 1 ? P.t('un anno', 'one year') : T === 2 ? P.t('due anni', 'two years') : P.t('sei mesi', 'six months');
    return {
      testo: P.t(`Black-Scholes, niente dividendi. Titolo a ${S}, tasso ${r}% annuo composto in continuo, call europea at-the-money a ${nomeT}. Se la volatilità è zero, quanto vale la call?`,
        `Black-Scholes, no dividends. Stock at ${S}, rate ${r}% a year compounded continuously, at-the-money European call expiring in ${nomeT}. If volatility is zero, what is the call worth?`),
      nota: P.t('due decimali', 'two decimals'),
      risposta: P.numero(v, { tol: 0.03, mostra: P.fmt(Math.round(v * 100) / 100) }),
      suggerimenti: [
        P.t('Senza volatilità il titolo cresce al tasso senza rischio, con certezza: a scadenza vale S × e^(rT), sopra lo strike.', 'With no volatility the stock grows at the riskless rate, for sure: at expiry it is worth S × e^(rT), above the strike.'),
        P.t(`La call paga S e^(rT) − K con certezza; scontata vale S − K e^(−rT) = ${S} × (1 − e^(−${P.fmt(r / 100 * T)})).`, `The call pays S e^(rT) − K for sure; discounted it is worth S − K e^(−rT) = ${S} × (1 − e^(−${P.fmt(r / 100 * T)})).`),
      ],
      soluzione: [
        `e^(−${P.fmt(r / 100 * T)}) ≈ ${P.fmt(Math.exp(-r / 100 * T), 4)}`,
        `${S} × (1 − ${P.fmt(Math.exp(-r / 100 * T), 4)}) = ${P.fmt(Math.round(v * 100) / 100)}`,
        P.t('chi l\'ha venduta si copre comprando un\'azione e prendendo a prestito K e^(−rT)', 'whoever sold it hedges by buying one share and borrowing K e^(−rT)'),
      ],
      fonte: P.fonte('crack', 'Question 2.1'),
    };
  }

  function tempo() {
    const [a, b, k] = P.pick(COPPIE), t1 = P.tr(a), t2 = P.tr(b), C = P.pick([1.5, 2, 2.5, 3, 4, 6]), v = C * k;
    return {
      testo: P.t(`Una call at-the-money a ${t1} costa ${P.fmt(C)}. Quanto costa, alla stessa vol, quella a ${t2}?`,
        `An at-the-money call expiring in ${t1} costs ${P.fmt(C)}. At the same vol, how much does the one expiring in ${t2} cost?`),
      risposta: P.numero(v, { rel: 0.02 }),
      suggerimenti: [
        P.t('Il prezzo ATM cresce con la radice del tempo: il rapporto fra i prezzi è √(T₂ / T₁).', 'The ATM price grows with the square root of time: the ratio of the prices is √(T₂ / T₁).'),
        `√(T₂ / T₁) = ${P.fmt(k)}.`,
      ],
      soluzione: [
        P.t(`rapporto dei tempi: ${P.fmt(k * k)}, radice ${P.fmt(k)}`, `ratio of the times: ${P.fmt(k * k)}, square root ${P.fmt(k)}`),
        `${P.fmt(C)} × ${P.fmt(k)} = ${P.fmt(v)}`,
      ],
      fonte: P.fonte('crack', 'Question 2.21'),
    };
  }

  P.trucco({
    id: 'desk-atm',
    materia: 'desk',
    capitolo: 'desk',
    numero: 2,
    titolo: { it: 'Call ATM ≈ 0.4 · σ · S · √T', en: 'ATM call ≈ 0.4 · σ · S · √T' },
    sottotitolo: {
      it: 'Il prezzo di un\'opzione at-the-money senza Black-Scholes, e da lì vol implicita, straddle e vega.',
      en: 'The price of an at-the-money option without Black-Scholes, and from there implied vol, straddles and vega.',
    },
    aggancio: {
      it: '«Prezzami una call at-the-money a tre mesi su un titolo a 100, vol 20.» Senza formule: 0.4 × 100 × 0.2 × 0.5 = 4. Black-Scholes dice 3.99.',
      en: '"Price me an at-the-money call, three months, stock at 100, vol 20." No formulas: 0.4 × 100 × 0.2 × 0.5 = 4. Black-Scholes says 3.99.',
    },
    lezione: {
      it: `
<h3>La domanda</h3>
<p>Al colloquio per un desk di opzioni te la fanno quasi sempre: prezza una call at-the-money. Non vogliono Black-Scholes a mente, vogliono vedere che sai da dove viene il prezzo.</p>
<div class="esempio">call ATM ≈ 0.4 × S × σ × √T<br>S = 100, σ = 20%, T = 3 mesi: 0.4 × 100 × 0.2 × 0.5 = 4</div>

<h3>Da dove viene 0.4</h3>
<p>S × σ × √T è la deviazione standard del prezzo a scadenza, in euro: con S = 100, σ = 20% e tre mesi, circa 10 euro. Una call at-the-money paga solo la parte positiva del movimento. La media della parte positiva di una normale con deviazione standard s è s/√(2π), e 1/√(2π) = 0.399. Ecco lo 0.4.</p>

<h3>Le radici del tempo da sapere</h3>
<table class="tab"><tr><td>1 anno</td><td>1</td><td>6 mesi</td><td>0.71</td></tr><tr><td>3 mesi</td><td>0.5</td><td>1 mese</td><td>0.29</td></tr><tr><td>1 settimana</td><td>0.14</td><td>4 anni</td><td>2</td></tr></table>

<h3>Quello che ne segue</h3>
<ul>
<li><b>Straddle</b> (call + put ATM) ≈ 0.8 × S × σ × √T: è il movimento medio in valore assoluto. Ed è anche di quanto deve muoversi il titolo perché lo straddle vada in pari a scadenza.</li>
<li><b>Vol implicita</b> dal prezzo: σ ≈ C / (0.4 × S × √T). Una call ATM a un anno su 100 che costa 8 implica circa il 20%.</li>
<li><b>Vega</b>: vicino all'ATM il prezzo è proporzionale alla vol, quindi un punto di vol vale 0.4 × S × √T / 100. Su 100 a un anno, 0.4 per punto.</li>
<li><b>Tempo</b>: il prezzo cresce con √T. La call a 4 mesi costa il doppio di quella a 1 mese, non il quadruplo.</li>
</ul>

<div class="trappola">Vale per l'ATM forward, con scadenze non troppo lunghe. Con tassi e dividendi il forward si allontana dallo spot, e lontano dal denaro la formula non vale: serve come controllo veloce, non come prezzo.</div>
`,
      en: `
<h3>The question</h3>
<p>In an interview for an options desk they almost always ask it: price an at-the-money call. They don't want Black-Scholes in your head; they want to see that you know where the price comes from.</p>
<div class="esempio">ATM call ≈ 0.4 × S × σ × √T<br>S = 100, σ = 20%, T = 3 months: 0.4 × 100 × 0.2 × 0.5 = 4</div>

<h3>Where 0.4 comes from</h3>
<p>S × σ × √T is the standard deviation of the price at expiry, in currency: with S = 100, σ = 20% and three months, about 10. An at-the-money call only pays the positive part of the move. The mean of the positive part of a normal with standard deviation s is s/√(2π), and 1/√(2π) = 0.399. There is the 0.4.</p>

<h3>Square roots of time to know</h3>
<table class="tab"><tr><td>1 year</td><td>1</td><td>6 months</td><td>0.71</td></tr><tr><td>3 months</td><td>0.5</td><td>1 month</td><td>0.29</td></tr><tr><td>1 week</td><td>0.14</td><td>4 years</td><td>2</td></tr></table>

<h3>What follows from it</h3>
<ul>
<li><b>Straddle</b> (ATM call + put) ≈ 0.8 × S × σ × √T: the average move in absolute value. It is also how far the stock has to move for the straddle to break even at expiry.</li>
<li><b>Implied vol</b> from the price: σ ≈ C / (0.4 × S × √T). A one-year ATM call on 100 that costs 8 implies about 20%.</li>
<li><b>Vega</b>: near the money the price is proportional to vol, so one vol point is worth 0.4 × S × √T / 100. On 100 at one year, 0.4 per point.</li>
<li><b>Time</b>: the price grows with √T. The 4-month call costs twice the 1-month call, not four times.</li>
</ul>

<div class="trappola">It holds for the ATM forward, with maturities that are not too long. With rates and dividends the forward drifts away from spot, and away from the money the formula does not hold: use it as a quick check, not as a price.</div>
`,
    },
    scheda: {
      it: 'Call ATM ≈ 0.4 × S × σ × √T (0.4 ≈ 1/√(2π)). Straddle ≈ 0.8 × S × σ × √T, ed è anche il movimento di pareggio. σ ≈ C / (0.4 S √T). Vega per punto ≈ 0.4 S √T / 100. Prezzo ∝ √T.',
      en: 'ATM call ≈ 0.4 × S × σ × √T (0.4 ≈ 1/√(2π)). Straddle ≈ 0.8 × S × σ × √T, which is also the breakeven move. σ ≈ C / (0.4 S √T). Vega per point ≈ 0.4 S √T / 100. Price ∝ √T.',
    },
    fonti: [
      P.fonte('zhou', '§6.3, "Straddle"', { nota: { it: 'la stessa approssimazione, c ≈ p ≈ 0.4σS√T', en: 'the same approximation, c ≈ p ≈ 0.4σS√T' } }),
      P.fonte('crack', 'Question 2.1'),
      P.fonte('crack', 'Question 2.21'),
      P.fonte('crack', 'Question 2.18', { nota: { it: 'la stessa radice del tempo, da uno a quattro anni', en: 'the same square root of time, from one to four years' } }),
    ],
    test: false,
    nomiLivelli: { it: ['Call', 'Straddle e vol implicita', 'Vega e tempo'], en: ['Call', 'Straddle and implied vol', 'Vega and time'] },
    livelli: [
      () => (P.chance(0.75) ? P.conFonte(call, P.fonte('zhou', '§6.3, "Straddle"', { nota: { it: 'la stessa approssimazione, c ≈ p ≈ 0.4σS√T', en: 'the same approximation, c ≈ p ≈ 0.4σS√T' } }))() : volZero()),
      () => P.pesato([[0.5, straddle], [0.5, volImplicita]])(),
      () => P.pesato([[0.5, vega], [0.5, tempo]])(),
    ],
  });
})();
