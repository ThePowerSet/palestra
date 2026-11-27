(function () {
  'use strict';
  const P = Palestra;
  const f2 = x => P.fmt(x, 2);

  // two call prices around a strike K, h apart on each side, whose spread implies probability p
  function coppia(K, h, p) {
    const alta = P.int(Math.round(K * 0.01 * 20), Math.round(K * 0.06 * 20)) / 20;
    return { bassa: Math.round((alta + 2 * h * p) * 100) / 100, alta };
  }

  function digitale() {
    const K = P.pick([50, 100, 100, 200]), h = K >= 100 ? 1 : 0.5, p = P.pick([0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.8]);
    const { bassa, alta } = coppia(K, h, p), paga = P.pick([1, 1, 10, 100]);
    const v = p * paga;
    return {
      testo: P.t(`La call strike ${P.fmt(K - h)} costa ${f2(bassa)}, la call strike ${P.fmt(K + h)} costa ${f2(alta)}. Quanto vale un'opzione digitale che paga ${paga} se il titolo finisce sopra ${K}?`,
        `The ${P.fmt(K - h)}-strike call costs ${f2(bassa)}, the ${P.fmt(K + h)}-strike call costs ${f2(alta)}. What is a digital option paying ${paga} if the stock ends above ${K} worth?`),
      nota: P.t('tassi a zero', 'zero rates'),
      risposta: P.numero(v, { rel: 0.01, mostra: P.fmt(v, 3) }),
      suggerimenti: [
        P.t(`Il call spread ${P.fmt(K - h)}/${P.fmt(K + h)} paga ${P.fmt(2 * h)} sopra ${P.fmt(K + h)} e 0 sotto ${P.fmt(K - h)}: diviso per ${P.fmt(2 * h)} è quasi una digitale che paga 1.`,
          `The ${P.fmt(K - h)}/${P.fmt(K + h)} call spread pays ${P.fmt(2 * h)} above ${P.fmt(K + h)} and 0 below ${P.fmt(K - h)}: divided by ${P.fmt(2 * h)} it is almost a digital paying 1.`),
        `(${f2(bassa)} − ${f2(alta)}) / ${P.fmt(2 * h)} = ${P.fmt(p)}.`,
      ],
      soluzione: [P.t(`call spread: ${f2(bassa)} − ${f2(alta)} = ${f2(bassa - alta)}`, `call spread: ${f2(bassa)} − ${f2(alta)} = ${f2(bassa - alta)}`),
        P.t(`digitale da 1: ${f2(bassa - alta)} / ${P.fmt(2 * h)} = ${P.fmt(p)}`, `digital paying 1: ${f2(bassa - alta)} / ${P.fmt(2 * h)} = ${P.fmt(p)}`),
        ...(paga > 1 ? [`${P.fmt(p)} × ${paga} = ${P.fmt(v)}`] : [])],
      fonte: P.fonte('crack', 'Question 2.10'),
    };
  }

  // A price that moves like a normal in euros (not in percent): P(S_T ≥ K) = N((S − K)/(σ√T)), rates at zero
  const NORMALE = { '0.5': 0.6915, '1': 0.8413, '1.5': 0.9332, '2': 0.9772 };
  function oro() {
    const S = P.pick([300, 400, 500, 1800, 2000]), sd = P.pick([[40, 1, 40], [60, 0.25, 30], [80, 0.25, 40], [60, 1, 60], [40, 0.25, 20]]);
    const [sigma, T, dev] = sd, z = P.pick([0.5, 1, 1.5, 2]) * (P.chance(0.5) ? 1 : -1), K = S + z * dev;
    const N = NORMALE[String(Math.abs(z))], prob = z > 0 ? 1 - N : N, paga = P.pick([100000, 1000000]), v = prob * paga;
    const nomeT = T === 1 ? P.t('un anno', 'one year') : P.t('tre mesi', 'three months');
    return {
      testo: P.t(`Il prezzo dell'oro si muove come una normale in dollari, non in percentuale: oggi è ${S} $, con volatilità ${sigma} $ l'anno. Tassi a zero. Quanto vale oggi una digitale che paga ${P.fmt(paga)} $ fra ${nomeT} se l'oro è a ${P.fmt(K)} $ o sopra?`,
        `The gold price moves like a normal in dollars, not in percent: today it is $${S}, with a volatility of $${sigma} a year. Zero rates. What is a digital paying $${P.fmt(paga)} in ${nomeT} if gold is at or above $${P.fmt(K)} worth today?`),
      nota: P.t(`in dollari; N(0.5) = 0.6915, N(1) = 0.8413, N(1.5) = 0.9332, N(2) = 0.9772`, `in dollars; N(0.5) = 0.6915, N(1) = 0.8413, N(1.5) = 0.9332, N(2) = 0.9772`),
      risposta: P.numero(v, { rel: 0.01, mostra: P.fmt(Math.round(v)) }),
      suggerimenti: [
        P.t(`A scadenza il prezzo è normale con media ${S} e deviazione standard ${sigma} × √T dollari: ${dev}.`, `At expiry the price is normal with mean ${S} and standard deviation ${sigma} × √T dollars: ${dev}.`),
        P.t(`Lo strike è a ${P.fmt(z)} deviazioni standard dalla media: la probabilità di finire sopra è ${z > 0 ? '1 − N' : 'N'}(${P.fmt(Math.abs(z))}).`, `The strike is ${P.fmt(z)} standard deviations from the mean: the chance of ending above it is ${z > 0 ? '1 − N' : 'N'}(${P.fmt(Math.abs(z))}).`),
      ],
      soluzione: [
        `(${P.fmt(K)} − ${S}) / ${dev} = ${P.fmt(z)}`,
        P.t(`probabilità: ${P.fmt(prob, 4)}`, `probability: ${P.fmt(prob, 4)}`),
        `${P.fmt(prob, 4)} × ${P.fmt(paga)} = ${P.fmt(Math.round(v))} $`,
      ],
      fonte: P.fonte('crack', 'Question 2.39'),
    };
  }

  function probabilita() {
    if (P.chance(0.5)) {
      const K = P.pick([50, 100, 200]), w = K / 10, p = P.pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7]), costo = p * w;
      return {
        testo: P.t(`Il call spread ${K - w / 2}/${K + w / 2} costa ${f2(costo)}. Che probabilità dà il mercato, più o meno, a un titolo sopra ${K} a scadenza?`,
          `The ${K - w / 2}/${K + w / 2} call spread costs ${f2(costo)}. Roughly what probability does the market give to the stock ending above ${K}?`),
        nota: P.t('tassi a zero; in percentuale', 'zero rates; as a percentage'),
        risposta: P.numero(p, { percento: true, rel: 0.02, mostra: P.pct(p, 0) }),
        suggerimenti: [
          P.t(`Il call spread paga al massimo ${P.fmt(w)}: il prezzo diviso per ${P.fmt(w)} è circa la probabilità di finire sopra il centro.`, `The call spread pays at most ${P.fmt(w)}: its price divided by ${P.fmt(w)} is roughly the probability of ending above the middle.`),
          `${f2(costo)} / ${P.fmt(w)}.`,
        ],
        soluzione: [`${f2(costo)} / ${P.fmt(w)} = ${P.pct(p, 0)}`],
      };
    }
    const opzioni = [P.t('Un po\' meno di 0.5', 'A little under 0.5'), P.t('Esattamente 0.5', 'Exactly 0.5'), P.t('Un po\' più di 0.5', 'A little over 0.5'), P.t('Circa 0.25', 'About 0.25')];
    const ordine = P.mescola([0, 1, 2, 3]);
    return {
      testo: P.t('Tassi a zero, Black-Scholes. Una digitale che paga 1 se il titolo finisce sopra il prezzo di oggi vale…', 'Zero rates, Black-Scholes. A digital paying 1 if the stock ends above today\'s price is worth…'),
      risposta: P.scelta(ordine.map(i => opzioni[i]), ordine.indexOf(0)),
      suggerimenti: [
        P.t('Il prezzo atteso a scadenza è quello di oggi, ma la distribuzione lognormale è asimmetrica: la mediana sta sotto la media.', 'The expected price at expiry is today\'s, but the lognormal distribution is skewed: the median sits below the mean.'),
        P.t('Se la mediana è sotto S, finire sopra S ha probabilità sotto il 50%: N(−σ√T/2).', 'If the median is below S, ending above S has probability under 50%: N(−σ√T/2).'),
      ],
      soluzione: [P.t('N(d₂) con d₂ = −σ√T/2 < 0: un po\' meno di 0.5', 'N(d₂) with d₂ = −σ√T/2 < 0: a little under 0.5'),
        P.t('il delta della call ATM, N(d₁), è invece un po\' più di 0.5', 'the ATM call delta, N(d₁), is instead a little over 0.5')],
    };
  }

  function intervallo() {
    const K1 = P.pick([90, 95]), K2 = P.pick([105, 110]), h = 1;
    const p1 = P.pick([0.6, 0.65, 0.7, 0.75, 0.8]), p2 = P.pick([0.15, 0.2, 0.25, 0.3, 0.35]);
    // prices that hang together: between the two pairs the calls fall by about the average probability × the gap
    const b = coppia(K2, h, p2), r05 = x => Math.round(x * 20) / 20, v = p1 - p2;
    const altaA = r05(b.bassa + (K2 - K1 - 2 * h) * (p1 + p2) / 2);
    const a = { alta: altaA, bassa: Math.round((altaA + 2 * h * p1) * 100) / 100 };
    return {
      testo: P.t(`Call strike ${K1 - h}: ${f2(a.bassa)}, ${K1 + h}: ${f2(a.alta)}, ${K2 - h}: ${f2(b.bassa)}, ${K2 + h}: ${f2(b.alta)}. Che probabilità dà il mercato a un titolo fra ${K1} e ${K2} a scadenza?`,
        `Calls struck at ${K1 - h}: ${f2(a.bassa)}, ${K1 + h}: ${f2(a.alta)}, ${K2 - h}: ${f2(b.bassa)}, ${K2 + h}: ${f2(b.alta)}. What probability does the market give to the stock ending between ${K1} and ${K2}?`),
      nota: P.t('tassi a zero; in percentuale', 'zero rates; as a percentage'),
      risposta: P.numero(v, { percento: true, rel: 0.02, mostra: P.pct(v, 0) }),
      suggerimenti: [
        P.t(`P(fra ${K1} e ${K2}) = P(sopra ${K1}) − P(sopra ${K2}), e ognuna è un call spread stretto diviso per la sua larghezza.`, `P(between ${K1} and ${K2}) = P(above ${K1}) − P(above ${K2}), and each is a tight call spread divided by its width.`),
        P.t(`sopra ${K1}: (${f2(a.bassa)} − ${f2(a.alta)}) / 2 = ${P.fmt(p1)}.`, `above ${K1}: (${f2(a.bassa)} − ${f2(a.alta)}) / 2 = ${P.fmt(p1)}.`),
      ],
      soluzione: [
        P.t(`sopra ${K1}: ${P.fmt(p1)}`, `above ${K1}: ${P.fmt(p1)}`),
        P.t(`sopra ${K2}: (${f2(b.bassa)} − ${f2(b.alta)}) / 2 = ${P.fmt(p2)}`, `above ${K2}: (${f2(b.bassa)} − ${f2(b.alta)}) / 2 = ${P.fmt(p2)}`),
        `${P.fmt(p1)} − ${P.fmt(p2)} = ${P.pct(v, 0)}`,
      ],
    };
  }

  P.trucco({
    id: 'opz-digitale',
    materia: 'opzioni',
    capitolo: 'parita',
    numero: 3,
    titolo: { it: 'Digitale = call spread stretto', en: 'Digital = tight call spread' },
    sottotitolo: {
      it: 'Dai prezzi di due call vicine si legge la probabilità che il mercato dà a un titolo sopra uno strike.',
      en: 'From the prices of two nearby calls you read the probability the market gives to a stock ending above a strike.',
    },
    aggancio: {
      it: '«La call 99 costa 3.10, la 101 costa 2.20. Quanto paghi una scommessa che vale 1 se il titolo chiude sopra 100?» 0.45: la differenza divisa per 2.',
      en: '"The 99 call costs 3.10, the 101 costs 2.20. What do you pay for a bet worth 1 if the stock closes above 100?" 0.45: the difference divided by 2.',
    },
    lezione: {
      it: `
<h3>La costruzione</h3>
<p>Una digitale paga una cifra fissa se il titolo finisce sopra lo strike, niente altrimenti. Non la trovi quotata, ma la costruisci con due call: compri la call a K − h e vendi quella a K + h. Sotto K − h il call spread vale 0, sopra K + h vale 2h, in mezzo sale in linea retta.</p>
<div class="esempio">digitale(K) ≈ (C(K − h) − C(K + h)) / 2h<br>call 99 a 3.10, call 101 a 2.20: 0.90 / 2 = 0.45</div>
<p>Più lo spread è stretto, più la rampa diventa un gradino: al limite la digitale è la pendenza dei prezzi delle call rispetto allo strike, cambiata di segno.</p>

<h3>Prezzo e probabilità</h3>
<p>Con tassi a zero, il prezzo di una digitale che paga 1 è la probabilità (neutrale al rischio) di finire sopra K. Quindi un call spread largo w che costa c dice, più o meno, che il mercato dà probabilità c / w di finire sopra il centro.</p>
<p>E la probabilità di finire in un intervallo è una differenza: P(fra K₁ e K₂) = P(sopra K₁) − P(sopra K₂), cioè due call spread.</p>

<h3>At-the-money non è 0.5</h3>
<p>In Black-Scholes la digitale at-the-money vale N(d₂) = N(−σ√T/2), un po' meno di 0.5: la lognormale ha la mediana sotto la media. Il delta della call, N(d₁), è invece un po' più di 0.5. Confonderli è una domanda classica.</p>

<div class="trappola">Con lo skew tipico delle azioni, vol più alta sugli strike bassi, le call a strike bassi sono più care di quanto direbbe una vol piatta, quindi la digitale vale più di N(d₂) calcolato con la vol at-the-money. Per questo si prezza con lo spread, non con la formula.</div>
`,
      en: `
<h3>The construction</h3>
<p>A digital pays a fixed amount if the stock ends above the strike, nothing otherwise. You rarely find it quoted, but you build it from two calls: buy the call at K − h and sell the one at K + h. Below K − h the call spread is worth 0, above K + h it is worth 2h, in between it rises in a straight line.</p>
<div class="esempio">digital(K) ≈ (C(K − h) − C(K + h)) / 2h<br>99 call at 3.10, 101 call at 2.20: 0.90 / 2 = 0.45</div>
<p>The tighter the spread, the more the ramp becomes a step: in the limit the digital is the slope of call prices against strike, with the sign flipped.</p>

<h3>Price and probability</h3>
<p>With zero rates, the price of a digital paying 1 is the (risk-neutral) probability of ending above K. So a call spread w wide that costs c says, roughly, that the market gives probability c / w to ending above its middle.</p>
<p>And the probability of ending in a range is a difference: P(between K₁ and K₂) = P(above K₁) − P(above K₂), that is two call spreads.</p>

<h3>At the money is not 0.5</h3>
<p>In Black-Scholes the at-the-money digital is worth N(d₂) = N(−σ√T/2), a little under 0.5: the lognormal has its median below its mean. The call's delta, N(d₁), is instead a little over 0.5. Mixing them up is a classic question.</p>

<div class="trappola">With the usual equity skew, higher vol at low strikes, low-strike calls are dearer than a flat vol would say, so the digital is worth more than N(d₂) at the at-the-money vol. That is why it is priced with the spread, not with the formula.</div>
`,
    },
    scheda: {
      it: 'Digitale(K) ≈ (C(K − h) − C(K + h)) / 2h = probabilità di finire sopra K (tassi a zero). Call spread largo w a prezzo c: probabilità ≈ c / w. Intervallo: differenza di due digitali. ATM: N(d₂) < 0.5 < N(d₁) = delta.',
      en: 'Digital(K) ≈ (C(K − h) − C(K + h)) / 2h = probability of ending above K (zero rates). Call spread w wide at price c: probability ≈ c / w. Range: difference of two digitals. ATM: N(d₂) < 0.5 < N(d₁) = delta.',
    },
    fonti: [
      P.fonte('crack', 'Question 2.10', { nota: { it: 'prezzo e replica di una digitale', en: 'price and replication of a digital' } }),
      P.fonte('crack', 'Question 2.39'),
      P.fonte('zhou', '§6.3, "Binary options"', { nota: { it: 'e^(−rT) N(d2) e la copertura', en: 'e^(−rT) N(d2) and the hedge' } }),
    ],
    test: false,
    nomiLivelli: { it: ['Digitale', 'Probabilità', 'Intervallo'], en: ['Digital', 'Probability', 'Range'] },
    livelli: [digitale, () => (P.chance(0.65) ? probabilita() : oro()), intervallo],
  });
})();
