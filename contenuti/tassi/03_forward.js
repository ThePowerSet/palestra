(function () {
  'use strict';
  const P = Palestra;
  const F = {
    dueAnni: P.fonte('crack', 'Question 3.8'),
    continui: P.fonte('crack', 'Question 3.3'),
    sopra: P.fonte('crack', 'Question 3.16'),
    zero: P.fonte('crack', 'Question 3.9'),
  };
  const pct2 = x => P.pct(Math.round(x * 10000) / 10000, 2);

  // Annual compounding: (1 + r2)² = (1 + r1)(1 + f); in your head f ≈ 2 r2 − r1
  function dueAnni() {
    const r1 = P.int(30, 120) / 2000, r2 = r1 + P.int(-5, 30) / 2000;
    const f = (1 + r2) ** 2 / (1 + r1) - 1;
    return {
      testo: P.t(`Il tasso a un anno è ${P.pct(r1, 2)}, quello a due anni ${P.pct(r2, 2)}, entrambi con capitalizzazione annua. Che tasso a un anno, fra un anno, implica la curva?`,
        `The one-year rate is ${P.pct(r1, 2)} and the two-year rate ${P.pct(r2, 2)}, both compounded annually. What one-year rate, one year from now, does the curve imply?`),
      nota: P.t('in percentuale, due decimali', 'as a percentage, two decimals'),
      risposta: P.numero(f, { percento: true, tol: 0.0003, mostra: pct2(f) }),
      suggerimenti: [
        P.t('Investire due anni deve rendere come investire un anno e poi reinvestire al forward: (1 + r₂)² = (1 + r₁)(1 + f).', 'Investing for two years must earn the same as investing for one and rolling at the forward: (1 + r₂)² = (1 + r₁)(1 + f).'),
        P.t(`A mente: f ≈ 2 × ${P.pct(r2, 2)} − ${P.pct(r1, 2)} = ${P.pct(2 * r2 - r1, 2)}; l'esatto è appena diverso.`, `In your head: f ≈ 2 × ${P.pct(r2, 2)} − ${P.pct(r1, 2)} = ${P.pct(2 * r2 - r1, 2)}; the exact value is slightly different.`),
      ],
      soluzione: [`(1 + ${P.fmt(r2, 4)})² / (1 + ${P.fmt(r1, 4)}) − 1 = ${P.fmt(f, 5)}`, `≈ ${pct2(f)}`],
      fonte: F.dueAnni,
    };
  }

  // Continuous compounding: rates times times add up, so f = (r2 T2 − r1 T1)/(T2 − T1) exactly
  function continui() {
    const [T1, T2] = P.pick([[1, 2], [1, 3], [2, 3], [2, 5], [3, 5], [5, 10], [2, 10]]);
    const r1 = P.int(15, 60) / 1000, r2 = r1 + P.int(-2, 15) / 1000;
    const f = (r2 * T2 - r1 * T1) / (T2 - T1);
    return {
      testo: P.t(`Tassi composti in continuo: ${P.pct(r1, 1)} a ${T1} ann${T1 === 1 ? 'o' : 'i'}, ${P.pct(r2, 1)} a ${T2} anni. Che tasso forward implica la curva fra l'anno ${T1} e l'anno ${T2}?`,
        `Continuously compounded rates: ${P.pct(r1, 1)} for ${T1} year${T1 === 1 ? '' : 's'}, ${P.pct(r2, 1)} for ${T2} years. What forward rate does the curve imply between year ${T1} and year ${T2}?`),
      nota: P.t('in percentuale, due decimali', 'as a percentage, two decimals'),
      risposta: P.numero(f, { percento: true, tol: 0.0002, mostra: pct2(f) }),
      suggerimenti: [
        P.t('Con la composizione continua i rendimenti si sommano: r₂T₂ = r₁T₁ + f (T₂ − T₁).', 'With continuous compounding returns add up: r₂T₂ = r₁T₁ + f (T₂ − T₁).'),
        `(${P.fmt(r2 * 100)} × ${T2} − ${P.fmt(r1 * 100)} × ${T1}) / ${T2 - T1}.`,
      ],
      soluzione: [`(${P.fmt(r2 * 100 * T2)} − ${P.fmt(r1 * 100 * T1)}) / ${T2 - T1} = ${pct2(f)}`],
      fonte: F.continui,
    };
  }

  // With annual compounding the exact forward is never below the quick 2 r10 − r5: (1 + b)² ≥ (1 + a)(1 + 2b − a)
  function sopraSotto() {
    const a = P.int(5, 12), b = a + P.pick([-2, 2, 3, 4, 5]);
    const approx = 2 * b - a, esatto = ((1 + b / 100) ** 10 / (1 + a / 100) ** 5) ** (1 / 5) - 1;
    return {
      testo: P.t(`Tasso a 5 anni ${a}%, a 10 anni ${b}%, capitalizzazione annua. A mente il forward fra l'anno 5 e l'anno 10 viene ${approx}% (2 × ${b} − ${a}). Il forward esatto è…`,
        `Five-year rate ${a}%, ten-year rate ${b}%, annual compounding. In your head the forward from year 5 to year 10 comes out at ${approx}% (2 × ${b} − ${a}). The exact forward is…`),
      risposta: P.scelta([P.t(`più alto di ${approx}%`, `higher than ${approx}%`), P.t(`più basso di ${approx}%`, `lower than ${approx}%`), P.t(`esattamente ${approx}%`, `exactly ${approx}%`)], 0),
      suggerimenti: [
        P.t('L\'approssimazione tratta i rendimenti come se si sommassero; con la capitalizzazione annua invece si moltiplicano.', 'The shortcut treats returns as if they added up; with annual compounding they multiply instead.'),
        P.t('Confronta (1 + b)² con (1 + a)(1 + 2b − a): la differenza è (b − a)², mai negativa.', 'Compare (1 + b)² with (1 + a)(1 + 2b − a): the difference is (b − a)², never negative.'),
      ],
      soluzione: [
        P.t(`esatto: (1.${String(b).padStart(2, '0')}^10 / 1.${String(a).padStart(2, '0')}^5)^(1/5) − 1 ≈ ${pct2(esatto)}`, `exact: (1.${String(b).padStart(2, '0')}^10 / 1.${String(a).padStart(2, '0')}^5)^(1/5) − 1 ≈ ${pct2(esatto)}`),
        P.t('sempre sopra, che la curva salga o scenda: (1 + b)² − (1 + a)(1 + 2b − a) = (b − a)²', 'always above, whether the curve rises or falls: (1 + b)² − (1 + a)(1 + 2b − a) = (b − a)²'),
      ],
      fonte: F.sopra,
    };
  }

  // A forward on a zero-coupon bond: buy the long zero today, finance it to the delivery date
  function forwardZero() {
    const lungo = P.pick([55, 60, 65, 70, 75, 80]), breve = P.pick([97, 98, 98.5, 99]);
    const f = lungo / (breve / 100);
    return {
      testo: P.t(`Uno zero coupon a 10 anni quota ${lungo}, uno zero coupon a 6 mesi quota ${P.fmt(breve)} (per 100 di nominale). Che prezzo forward ha oggi lo zero a 10 anni per consegna fra 6 mesi?`,
        `A 10-year zero-coupon bond trades at ${lungo}, a 6-month zero at ${P.fmt(breve)} (per 100 face). What is today's forward price of the 10-year zero for delivery in 6 months?`),
      nota: P.t('due decimali', 'two decimals'),
      risposta: P.numero(f, { tol: 0.011, mostra: P.fmt(Math.round(f * 100) / 100) }),
      suggerimenti: [
        P.t('Compra lo zero oggi e finanzialo fino alla consegna: il forward è quello che ti costa allora.', 'Buy the zero today and finance it until delivery: the forward is what it costs you then.'),
        P.t(`Finanziare ${lungo} per 6 mesi costa ${lungo} / ${P.fmt(breve / 100)}.`, `Financing ${lungo} for 6 months costs ${lungo} / ${P.fmt(breve / 100)}.`),
      ],
      soluzione: [`${lungo} / ${P.fmt(breve / 100)} = ${P.fmt(Math.round(f * 100) / 100)}`, P.t('sopra il prezzo di oggi: un bond senza cedola tratta a premio forward', 'above today\'s price: a bond with no coupon trades at a forward premium')],
      fonte: F.zero,
    };
  }

  P.trucco({
    id: 'tassi-forward',
    materia: 'tassi',
    capitolo: 'curva',
    numero: 3,
    titolo: { it: 'Tassi forward dalla curva', en: 'Forward rates from the curve' },
    sottotitolo: {
      it: 'Investire per due anni deve rendere come investire per uno e reinvestire: da qui il forward, la scorciatoia 2r₂ − r₁ e il suo errore.',
      en: 'Investing for two years must earn what investing for one and rolling over earns: hence the forward, the 2r₂ − r₁ shortcut and its error.',
    },
    aggancio: {
      it: '«Il 5 anni è al 10%, il 10 anni al 15%. Che forward vedi fra 5 e 10 anni?» Chi dice 20% ha fatto bene il conto a mente; poi viene la domanda vera: è un po\' sopra o un po\' sotto?',
      en: '"The five-year is at 10%, the ten-year at 15%. What forward do you see from 5 to 10 years?" Saying 20% is good mental maths; then comes the real question: a bit above or a bit below?',
    },
    lezione: {
      it: `
<h3>Nessun arbitraggio fra scadenze</h3>
<p>Mettere i soldi per due anni deve rendere quanto metterli per un anno e poi reinvestirli al tasso che la curva fissa oggi per il secondo anno, il forward. Con capitalizzazione annua: (1 + r₂)² = (1 + r₁)(1 + f).</p>
<div class="esempio">r₁ = 7.15%, r₂ = 7.60% → f = 1.076² / 1.0715 − 1 = 8.05%.<br>A mente: 2 × 7.60 − 7.15 = 8.05.</div>

<h3>La scorciatoia è esatta in continuo</h3>
<p>Con i tassi composti in continuo i rendimenti si sommano: r₂T₂ = r₁T₁ + f(T₂ − T₁), quindi f = (r₂T₂ − r₁T₁)/(T₂ − T₁) esatto. Con la capitalizzazione annua la stessa formula è un'approssimazione, e sbaglia sempre dallo stesso lato: il forward vero è un po' più alto, perché (1 + b)² − (1 + a)(1 + 2b − a) = (b − a)².</p>

<h3>Il forward di un bond</h3>
<p>Un forward su uno zero coupon si replica comprando lo zero oggi e finanziandolo fino alla consegna: F = prezzo dello zero lungo / prezzo dello zero alla consegna. Senza cedole da incassare, il forward sta sopra il prezzo di oggi.</p>

<div class="trappola">Le percentuali vanno messe nella formula come decimali (1.076, non 1 + 7.6), e i tempi devono essere nella stessa unità del tasso.</div>
`,
      en: `
<h3>No arbitrage across maturities</h3>
<p>Putting money away for two years must earn what putting it away for one year and rolling it at the rate the curve fixes today for the second year, the forward, earns. With annual compounding: (1 + r₂)² = (1 + r₁)(1 + f).</p>
<div class="esempio">r₁ = 7.15%, r₂ = 7.60% → f = 1.076² / 1.0715 − 1 = 8.05%.<br>In your head: 2 × 7.60 − 7.15 = 8.05.</div>

<h3>The shortcut is exact in continuous time</h3>
<p>With continuously compounded rates returns add up: r₂T₂ = r₁T₁ + f(T₂ − T₁), so f = (r₂T₂ − r₁T₁)/(T₂ − T₁) exactly. With annual compounding the same formula is an approximation, and it always errs on the same side: the true forward is a little higher, because (1 + b)² − (1 + a)(1 + 2b − a) = (b − a)².</p>

<h3>The forward of a bond</h3>
<p>A forward on a zero-coupon bond is replicated by buying the zero today and financing it until delivery: F = price of the long zero / price of the zero maturing at delivery. With no coupons to collect, the forward sits above today's price.</p>

<div class="trappola">Percentages go into the formula as decimals (1.076, not 1 + 7.6), and times must be in the same unit as the rate.</div>
`,
    },
    scheda: {
      it: '(1 + r₂)² = (1 + r₁)(1 + f); a mente f ≈ 2r₂ − r₁, esatto in continuo: f = (r₂T₂ − r₁T₁)/(T₂ − T₁). Con capitalizzazione annua il forward vero è sempre un po\' sopra la scorciatoia. Forward di uno zero: prezzo lungo / prezzo breve.',
      en: '(1 + r₂)² = (1 + r₁)(1 + f); in your head f ≈ 2r₂ − r₁, exact in continuous time: f = (r₂T₂ − r₁T₁)/(T₂ − T₁). With annual compounding the true forward is always a little above the shortcut. Forward of a zero: long price / short price.',
    },
    fonti: [F.dueAnni, F.continui, F.sopra, F.zero],
    test: false,
    nomiLivelli: { it: ['Due anni', 'In continuo', 'Sopra o sotto, e i bond'], en: ['Two years', 'Continuous', 'Above or below, and bonds'] },
    livelli: [dueAnni, continui, () => (P.chance(0.5) ? sopraSotto() : forwardZero())],
  });
})();
