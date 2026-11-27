(function () {
  'use strict';
  const P = Palestra;
  const f2 = x => P.fmt(x, 2);

  // expiries with a square root that is easy to use; approssimata = the root is rounded
  const SCADENZE = [
    { nome: { it: '1 anno', en: '1 year' }, r: 1, a: false, peso: 2 },
    { nome: { it: '3 mesi', en: '3 months' }, r: 0.5, a: false, peso: 3 },
    { nome: { it: '4 anni', en: '4 years' }, r: 2, a: false, peso: 1 },
    { nome: { it: '1 mese', en: '1 month' }, r: 0.29, a: true, peso: 2 },
    { nome: { it: '1 settimana', en: '1 week' }, r: 0.14, a: true, peso: 2 },
  ];
  const scadenza = () => P.pesato(SCADENZE.map(s => [s.peso, s]));
  const radice = T => (T.a ? '≈ ' : '') + P.fmt(T.r);

  function prezzo() {
    if (P.chance(0.3)) {
      // one day: 0.8 × σ × S / 16 = σ × S / 20
      const S = P.pick([50, 80, 100, 120, 200, 250, 400]), s = P.pick([16, 20, 24, 30, 32, 40, 48, 60, 80]), v = s / 100 * S / 20;
      return {
        testo: P.t(`Quanto vale uno straddle at-the-money che scade domani, su un titolo a ${S} con vol implicita ${s}%?`,
          `What is an at-the-money straddle expiring tomorrow worth, on a stock at ${S} with implied vol ${s}%?`),
        nota: P.t('tassi a zero', 'zero rates'),
        risposta: P.numero(v, { rel: 0.04, mostra: f2(v) }),
        suggerimenti: [
          P.t('Straddle ≈ 0.8 × σ × S × √T, e per un giorno √T = 1/16: 0.8/16 = 1/20.', 'Straddle ≈ 0.8 × σ × S × √T, and for one day √T = 1/16: 0.8/16 = 1/20.'),
          `${P.fmt(s / 100)} × ${S} / 20.`,
        ],
        soluzione: [`0.8 × ${P.fmt(s / 100)} × ${S} / 16 = ${P.fmt(s / 100)} × ${S} / 20 = ${f2(v)}`],
      };
    }
    const S = P.pick([50, 100, 100, 200, 400]), s = P.pick([10, 15, 20, 25, 30, 40, 50]), T = scadenza(), v = 0.8 * s / 100 * S * T.r;
    return {
      testo: P.t(`Prezzami uno straddle at-the-money a ${P.tr(T.nome)} su un titolo a ${S}, vol ${s}%.`,
        `Price me an at-the-money straddle expiring in ${P.tr(T.nome)} on a stock at ${S}, vol ${s}%.`),
      nota: P.t('tassi a zero', 'zero rates'),
      risposta: P.numero(v, { rel: T.a ? 0.06 : 0.03, mostra: f2(v) }),
      suggerimenti: [
        P.t('Straddle = call + put, ognuna ≈ 0.4 × σ × S × √T: in tutto 0.8 × σ × S × √T.', 'Straddle = call + put, each ≈ 0.4 × σ × S × √T: 0.8 × σ × S × √T in all.'),
        `√T ${radice(T)}; 0.8 × ${S} = ${P.fmt(0.8 * S)}.`,
      ],
      soluzione: [`0.8 × ${S} × ${P.fmt(s / 100)} × ${P.fmt(T.r)} = ${f2(v)}`],
    };
  }

  function mossa() {
    const S = P.pick([20, 40, 50, 80, 100, 150, 200]), pct = P.pick([2, 3, 4, 5, 6, 8, 10, 12]), st = S * pct / 100;
    if (P.chance(0.5)) {
      return {
        testo: P.t(`Lo straddle at-the-money che scade dopo i risultati costa ${f2(st)} su un titolo a ${S}. Che movimento sta prezzando il mercato, in percentuale?`,
          `The at-the-money straddle expiring after earnings costs ${f2(st)} on a stock at ${S}. What move is the market pricing, as a percentage?`),
        nota: P.t('il movimento atteso in valore assoluto', 'the expected move in absolute value'),
        risposta: P.numero(pct / 100, { percento: true, rel: 0.02, mostra: P.pct(pct / 100) }),
        suggerimenti: [
          P.t('Lo straddle paga |S_T − K|: il suo prezzo è il movimento assoluto che il mercato si aspetta.', 'The straddle pays |S_T − K|: its price is the absolute move the market expects.'),
          `${f2(st)} / ${S}.`,
        ],
        soluzione: [`${f2(st)} / ${S} = ${P.pct(pct / 100)}`],
      };
    }
    const su = P.chance(0.5), v = su ? S + st : S - st;
    return {
      testo: P.t(`Compri lo straddle at-the-money strike ${S} a ${f2(st)}. ${su ? 'Sopra' : 'Sotto'} che prezzo, a scadenza, guadagni sul lato ${su ? 'alto' : 'basso'}?`,
        `You buy the at-the-money ${S}-strike straddle at ${f2(st)}. ${su ? 'Above' : 'Below'} what price, at expiry, do you make money on the ${su ? 'upside' : 'downside'}?`),
      risposta: P.numero(v, { tol: 0.006, mostra: f2(v) }),
      suggerimenti: [
        P.t('A scadenza lo straddle vale |S − K|; guadagni quando supera quello che hai pagato.', 'At expiry the straddle is worth |S − K|; you make money once that exceeds what you paid.'),
        `K ${su ? '+' : '−'} ${f2(st)}.`,
      ],
      soluzione: [P.t(`break-even: ${S} ${su ? '+' : '−'} ${f2(st)} = ${f2(v)}`, `break-even: ${S} ${su ? '+' : '−'} ${f2(st)} = ${f2(v)}`)],
    };
  }

  function volImplicita() {
    const S = P.pick([50, 100, 100, 200]), s = P.pick([10, 15, 20, 25, 30, 40, 50, 60]), T = scadenza(), st = Math.round(0.8 * s / 100 * S * T.r * 20) / 20;
    const v = st / (0.8 * S * T.r);
    return {
      testo: P.t(`Lo straddle at-the-money a ${P.tr(T.nome)} su un titolo a ${S} costa ${f2(st)}. Che vol implicita c'è dentro?`,
        `The at-the-money straddle expiring in ${P.tr(T.nome)} on a stock at ${S} costs ${f2(st)}. What implied vol is in it?`),
      nota: P.t('in percentuale; tassi a zero', 'as a percentage; zero rates'),
      risposta: P.numero(v, { percento: true, rel: T.a ? 0.07 : 0.03, mostra: P.pct(v, 1) }),
      suggerimenti: [
        P.t('Rovescia la regola: σ ≈ straddle / (0.8 × S × √T).', 'Turn the rule around: σ ≈ straddle / (0.8 × S × √T).'),
        `0.8 × ${S} × ${P.fmt(T.r)} = ${P.fmt(0.8 * S * T.r)}.`,
      ],
      soluzione: [`0.8 × ${S} × ${P.fmt(T.r)} = ${P.fmt(0.8 * S * T.r)}`, `${f2(st)} / ${P.fmt(0.8 * S * T.r)} = ${P.pct(v, 1)}`],
    };
  }

  P.trucco({
    id: 'opz-straddle',
    materia: 'opzioni',
    capitolo: 'parita',
    numero: 2,
    titolo: { it: 'Straddle ≈ 0.8 · σ · S · √T', en: 'Straddle ≈ 0.8 · σ · S · √T' },
    sottotitolo: {
      it: 'Il prezzo dello straddle è il movimento che il mercato si aspetta: da lì vol implicita, break-even e la mossa sui risultati.',
      en: 'The straddle price is the move the market expects: from there implied vol, break-evens and the earnings move.',
    },
    aggancio: {
      it: '«Lo straddle sui risultati costa 6 su un titolo a 100. Cosa ti dice?» Che il mercato si aspetta un movimento di circa il 6%, in una direzione o nell\'altra.',
      en: '"The earnings straddle costs 6 on a stock at 100. What does it tell you?" That the market expects a move of about 6%, one way or the other.',
    },
    lezione: {
      it: `
<h3>Da dove viene 0.8</h3>
<p>Uno straddle è una call più una put con lo stesso strike. A scadenza paga |S_T − K|: il movimento del titolo, in valore assoluto, senza guardare la direzione. Con lo strike at-the-money il suo prezzo è quindi il movimento assoluto che il mercato si aspetta.</p>
<p>Per una normale con deviazione standard s, il valore atteso del valore assoluto è s × √(2/π) ≈ 0.8 s. E la deviazione standard del prezzo a scadenza è σ × S × √T. Da qui:</p>
<div class="esempio">straddle ATM ≈ 0.8 × σ × S × √T   (ogni gamba ≈ 0.4 × σ × S × √T)<br>S = 100, σ = 20%, 3 mesi: 0.8 × 100 × 0.2 × 0.5 = 8</div>

<h3>Un giorno solo</h3>
<p>Per un giorno √T = 1/16, e 0.8/16 = 1/20: lo straddle che scade domani vale σ × S / 20. Titolo a 100 con vol 40%: 2.</p>

<h3>Al contrario: la vol dentro il prezzo</h3>
<p>σ ≈ straddle / (0.8 × S × √T). Straddle a 3 mesi a 6 su un titolo a 100: 6 / (0.8 × 100 × 0.5) = 15%. È il modo più rapido per leggere la vol implicita da un prezzo.</p>

<h3>Break-even e risultati</h3>
<p>Chi compra lo straddle a scadenza guadagna sopra K + prezzo e sotto K − prezzo. Prima dei risultati, prezzo / S è la mossa che il mercato sta prezzando: se pensi che il titolo si muoverà di più, compri lo straddle.</p>

<div class="trappola">0.8 × σ × S × √T vale at-the-money e con σ√T piccolo. Con vol alte e scadenze lunghe la regola sovrastima, come per la call nel trucco sullo 0.4.</div>
`,
      en: `
<h3>Where 0.8 comes from</h3>
<p>A straddle is a call plus a put with the same strike. At expiry it pays |S_T − K|: the stock's move, in absolute value, whatever the direction. With the strike at the money its price is therefore the absolute move the market expects.</p>
<p>For a normal with standard deviation s, the expected absolute value is s × √(2/π) ≈ 0.8 s. And the standard deviation of the price at expiry is σ × S × √T. Hence:</p>
<div class="esempio">ATM straddle ≈ 0.8 × σ × S × √T   (each leg ≈ 0.4 × σ × S × √T)<br>S = 100, σ = 20%, 3 months: 0.8 × 100 × 0.2 × 0.5 = 8</div>

<h3>A single day</h3>
<p>For one day √T = 1/16, and 0.8/16 = 1/20: the straddle expiring tomorrow is worth σ × S / 20. Stock at 100 with vol 40%: 2.</p>

<h3>The other way: the vol inside the price</h3>
<p>σ ≈ straddle / (0.8 × S × √T). A 3-month straddle at 6 on a stock at 100: 6 / (0.8 × 100 × 0.5) = 15%. It is the quickest way to read implied vol from a price.</p>

<h3>Break-evens and earnings</h3>
<p>Whoever buys the straddle makes money at expiry above K + price and below K − price. Before earnings, price / S is the move the market is pricing: if you think the stock will move more, you buy the straddle.</p>

<div class="trappola">0.8 × σ × S × √T holds at the money and for small σ√T. With high vols and long expiries the rule overprices, as for the call in the 0.4 trick.</div>
`,
    },
    scheda: {
      it: 'Straddle ATM ≈ 0.8 × σ × S × √T = movimento assoluto atteso. Un giorno: σ × S / 20. Vol implicita ≈ straddle / (0.8 × S × √T). Break-even a scadenza: K ± prezzo. Prezzo / S = la mossa prezzata.',
      en: 'ATM straddle ≈ 0.8 × σ × S × √T = expected absolute move. One day: σ × S / 20. Implied vol ≈ straddle / (0.8 × S × √T). Break-evens at expiry: K ± price. Price / S = the priced move.',
    },
    test: false,
    nomiLivelli: { it: ['Prezzo', 'La mossa', 'Vol implicita'], en: ['Price', 'The move', 'Implied vol'] },
    livelli: [prezzo, mossa, volImplicita],
  });
})();
