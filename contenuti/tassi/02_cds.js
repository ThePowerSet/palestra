(function () {
  'use strict';
  const P = Palestra;
  const RECUPERI = [0.4, 0.4, 0.4, 0.25, 0.2, 0.6];
  const pb = x => P.fmt(Math.round(x * 10000 * 10) / 10);

  function spread() {
    const l = P.pick([1, 1.5, 2, 2.5, 3, 4, 5, 8, 10]) / 100, R = P.pick(RECUPERI), s = l * (1 - R);
    return {
      testo: P.t(`Un emittente ha un'intensità di default ${P.del(P.fmt(l * 100))}% l'anno e un recupero atteso ${P.del(P.fmt(R * 100))}%. Spread equo del CDS, in punti base?`,
        `An issuer has a default intensity of ${P.fmt(l * 100)}% a year and an expected recovery of ${P.fmt(R * 100)}%. Fair CDS spread, in basis points?`),
      risposta: P.numero(s * 10000, { rel: 0.01, unita: P.t('pb', 'bp'), mostra: pb(s) }),
      suggerimenti: [
        P.t('Il triangolo del credito: spread ≈ probabilità di default l\'anno × perdita in caso di default, cioè λ × (1 − R).', 'The credit triangle: spread ≈ yearly default probability × loss given default, that is λ × (1 − R).'),
        P.t(`1 − R = ${P.fmt(1 - R)}; ${P.fmt(l * 100)}% = ${P.fmt(l * 10000)} pb.`, `1 − R = ${P.fmt(1 - R)}; ${P.fmt(l * 100)}% = ${P.fmt(l * 10000)} bp.`),
      ],
      soluzione: [`${P.fmt(l * 10000)} × ${P.fmt(1 - R)} = ${pb(s)} ${P.t('pb', 'bp')}`],
    };
  }

  function probabilita() {
    const R = P.pick(RECUPERI), l = P.pick([1, 2, 3, 4, 5, 6, 8, 10]) / 100, s = l * (1 - R);
    if (P.chance(0.5)) {
      return {
        testo: P.t(`Il CDS a 5 anni di un emittente tratta a ${pb(s)} pb. Con un recupero ${P.del(P.fmt(R * 100))}%, che probabilità di default l'anno implica?`,
          `An issuer's 5-year CDS trades at ${pb(s)} bp. With a recovery of ${P.fmt(R * 100)}%, what yearly default probability does it imply?`),
        nota: P.t('in percentuale', 'as a percentage'),
        risposta: P.numero(l, { percento: true, rel: 0.02, mostra: P.pct(l) }),
        suggerimenti: [
          P.t('Rovescia il triangolo: λ ≈ spread / (1 − R).', 'Turn the triangle around: λ ≈ spread / (1 − R).'),
          `${pb(s)} / ${P.fmt(1 - R)}.`,
        ],
        soluzione: [`${pb(s)} / ${P.fmt(1 - R)} = ${P.fmt(Math.round(l * 10000))} ${P.t('pb', 'bp')} = ${P.pct(l)}`],
      };
    }
    // survival over T years: e^(−λT); default probability ≈ λT for small λT
    const T = P.pick([1, 2, 3, 5, 10]), x = l * T, v = 1 - Math.exp(-x);
    return {
      testo: P.t(`Intensità di default costante ${P.del(P.fmt(l * 100))}% l'anno. Probabilità di default entro ${T} ann${T === 1 ? 'o' : 'i'}?`,
        `Constant default intensity of ${P.fmt(l * 100)}% a year. Probability of default within ${T} year${T === 1 ? '' : 's'}?`),
      nota: P.t('in percentuale; basta una stima', 'as a percentage; an estimate is enough'),
      risposta: P.numero(v, { percento: true, rel: 0.03, mostra: P.pct(Math.round(v * 1000) / 1000) }),
      suggerimenti: [
        P.t('Sopravvivenza = e^(−λT); default = 1 − e^(−λT). Per λT piccolo è circa λT, un po\' meno.', 'Survival = e^(−λT); default = 1 − e^(−λT). For small λT it is about λT, a little less.'),
        P.t(`λT = ${P.fmt(x)}; e^(−x) ≈ 1 − x + x²/2.`, `λT = ${P.fmt(x)}; e^(−x) ≈ 1 − x + x²/2.`),
      ],
      soluzione: [`λT = ${P.fmt(x)}`, `1 − e^(−${P.fmt(x)}) = ${P.pct(Math.round(v * 1000) / 1000)}`, P.t(`il conto semplice λT dà ${P.pct(x)}: sovrastima`, `the plain λT gives ${P.pct(x)}: too high`)],
    };
  }

  // Standard coupons are paid quarterly on act/360: notional × coupon × days / 360
  function cedola() {
    const N = P.pick([5, 10, 20, 25, 50]) * 1e6, c = P.pick([100, 500]), gg = P.pick([88, 90, 91, 92, 94]), v = N * c / 10000 * gg / 360;
    return {
      testo: P.t(`Un CDS standard su ${P.fmt(N / 1e6)} milioni di euro paga la cedola fissa di ${c} pb ogni trimestre. Il periodo di maturazione ha ${gg} giorni. Quanto paga chi compra protezione a questa data?`,
        `A standard CDS on EUR ${P.fmt(N / 1e6)} million pays the fixed ${c} bp coupon every quarter. The accrual period has ${gg} days. How much does the protection buyer pay on this date?`),
      nota: P.t('in euro, al centesimo', 'in euros, to the cent'),
      risposta: P.numero(v, { tol: 0.011, mostra: P.fmt(Math.round(v * 100) / 100) }),
      suggerimenti: [
        P.t('Le cedole dei CDS standard maturano sui giorni effettivi, con un anno di 360 giorni (act/360).', 'Standard CDS coupons accrue on actual days, over a 360-day year (act/360).'),
        `${P.fmt(N)} × ${P.fmt(c / 10000)} × ${gg}/360.`,
      ],
      soluzione: [`${P.fmt(N)} × ${P.fmt(c / 10000)} × ${gg} / 360 = ${P.fmt(Math.round(v * 100) / 100)}`],
      fonte: P.fonte('isda', 'section "Standardizing coupon dates"'),
    };
  }

  // Trading mid-period: the buyer will pay a full first coupon, so the seller hands back what accrued before the trade
  function regolamento() {
    const N = P.pick([10, 20, 25, 36, 50]) * 1e6, c = P.pick([100, 500]), punti = P.pick([1, 1.5, 2, 2.5, 3.5, 4]), gg = P.int(10, 85);
    const up = N * punti / 100, rateo = N * c / 10000 * gg / 360, netto = up - rateo;
    return {
      testo: P.t(`Compri protezione su ${P.fmt(N / 1e6)} milioni con cedola standard ${c} pb, quotata ${P.fmt(punti)} punti di upfront. Il periodo di cedola in corso è iniziato ${gg} giorni fa. Quanto paghi in tutto al regolamento, al netto del rateo che ti viene restituito?`,
        `You buy protection on ${P.fmt(N / 1e6)} million with a ${c} bp standard coupon, quoted at ${P.fmt(punti)} points upfront. The current coupon period started ${gg} days ago. What do you pay in all at settlement, net of the accrued coupon handed back to you?`),
      nota: P.t('al centesimo', 'to the cent'),
      risposta: P.numero(netto, { tol: 0.011, mostra: P.fmt(Math.round(netto * 100) / 100) }),
      suggerimenti: [
        P.t('L\'upfront è punti × nominale. Alla prossima data pagherai una cedola intera, anche per i giorni prima dell\'acquisto: il venditore te li restituisce subito.', 'The upfront is points × notional. On the next date you will pay a full coupon, including the days before you bought: the seller hands them back now.'),
        P.t(`Rateo restituito: ${P.fmt(N)} × ${P.fmt(c / 10000)} × ${gg}/360 = ${P.fmt(Math.round(rateo * 100) / 100)}.`, `Accrued handed back: ${P.fmt(N)} × ${P.fmt(c / 10000)} × ${gg}/360 = ${P.fmt(Math.round(rateo * 100) / 100)}.`),
      ],
      soluzione: [P.t(`upfront: ${P.fmt(up)}`, `upfront: ${P.fmt(up)}`), `${P.fmt(up)} − ${P.fmt(Math.round(rateo * 100) / 100)} = ${P.fmt(Math.round(netto * 100) / 100)}`],
      fonte: P.fonte('isda', 'section "Converter assumptions"'),
    };
  }

  function upfront() {
    const c = P.pick([100, 100, 500]), s = c === 100 ? P.pick([25, 50, 150, 200, 300, 400, 600]) : P.pick([300, 400, 700, 900, 1000]);
    const D = P.pick([4, 4.5, 3.5]), u = (s - c) * D / 10000, compra = P.chance(0.6);
    return {
      testo: P.t(`Il CDS a 5 anni tratta a uno spread di ${s} pb, ma la cedola standard è ${c} pb. La duration rischiosa (RPV01) è circa ${P.fmt(D)}. Quanto ${u >= 0 ? 'paga' : 'incassa'} subito chi compra protezione, in percentuale del nominale?`,
        `The 5-year CDS trades at a spread of ${s} bp, but the standard coupon is ${c} bp. The risky duration (RPV01) is about ${P.fmt(D)}. How much does the protection buyer ${u >= 0 ? 'pay' : 'receive'} upfront, as a percentage of notional?`),
      nota: P.t('in percentuale', 'as a percentage'),
      risposta: P.numero(Math.abs(u), { percento: true, rel: 0.01, mostra: P.pct(Math.abs(u)) }),
      suggerimenti: [
        P.t('Upfront ≈ (spread − cedola) × RPV01: compensa la differenza fra la cedola che paghi e lo spread giusto, per tutta la vita del contratto.',
          'Upfront ≈ (spread − coupon) × RPV01: it makes up the gap between the coupon you pay and the fair spread, over the life of the contract.'),
        `(${s} − ${c}) × ${P.fmt(D)} = ${P.fmt((s - c) * D)} ${P.t('pb', 'bp')}.`,
      ],
      soluzione: [`(${s} − ${c}) ${P.t('pb', 'bp')} × ${P.fmt(D)} = ${P.fmt((s - c) * D)} ${P.t('pb', 'bp')} → ${P.pct(Math.abs(u))}`,
        u >= 0 ? P.t('spread sopra la cedola: chi compra protezione paga', 'spread above the coupon: the protection buyer pays')
          : P.t('spread sotto la cedola: chi compra protezione incassa', 'spread below the coupon: the protection buyer receives')],
    };
  }

  P.trucco({
    id: 'tassi-cds',
    materia: 'tassi',
    capitolo: 'cds',
    numero: 2,
    titolo: { it: 'Il triangolo del credito', en: 'The credit triangle' },
    sottotitolo: {
      it: 'Spread ≈ λ × (1 − R): dallo spread di un CDS alla probabilità di default, e l\'upfront quando la cedola è standard.',
      en: 'Spread ≈ λ × (1 − R): from a CDS spread to the default probability, and the upfront when the coupon is standard.',
    },
    aggancio: {
      it: '«Il CDS di un\'azienda tratta a 300 punti base. Che probabilità di default ci vede il mercato?» Con il 40% di recupero, circa il 5% l\'anno.',
      en: '"A company\'s CDS trades at 300 basis points. What default probability does the market see?" With 40% recovery, about 5% a year.',
    },
    lezione: {
      it: `
<h3>Cosa compra chi compra protezione</h3>
<p>In un CDS chi compra protezione paga uno spread all'anno sul nominale; se l'emittente fa default, riceve la perdita, cioè il nominale meno quanto si recupera. Se il default arriva con intensità λ all'anno e si recupera R, la perdita attesa all'anno è circa λ × (1 − R). Lo spread equo la paga:</p>
<div class="esempio">spread ≈ λ × (1 − R)   (il triangolo del credito)<br>λ = 2%, R = 40%: 200 × 0.6 = 120 pb<br>al contrario: 300 pb con R = 40% → λ ≈ 300 / 0.6 = 500 pb = 5%</div>

<h3>Dall'intensità alla probabilità</h3>
<p>Con intensità costante la probabilità di sopravvivere T anni è e<sup>−λT</sup>, quindi di fare default 1 − e<sup>−λT</sup>. Per λT piccolo è quasi λT, un po' meno: 5% l'anno per 5 anni dà 1 − e<sup>−0.25</sup> ≈ 22%, non 25%.</p>

<h3>L'upfront</h3>
<p>Oggi i CDS si scambiano con una cedola standard (100 o 500 pb). Se lo spread giusto è diverso, la differenza si paga subito: upfront ≈ (spread − cedola) × RPV01, dove RPV01 è il valore di 1 pb all'anno pagato finché non c'è default (circa 4 per un 5 anni).</p>
<div class="esempio">spread 300, cedola 100, RPV01 4: 200 × 4 = 800 pb = 8% del nominale, pagato da chi compra protezione</div>

<div class="trappola">Il recupero conta quanto lo spread: con R = 40% λ è lo spread diviso 0.6; con R = 20% è diviso 0.8. Le probabilità che si leggono dagli spread sono neutrali al rischio: includono il premio per il rischio, quindi sono più alte dei default storici.</div>
`,
      en: `
<h3>What a protection buyer buys</h3>
<p>In a CDS the protection buyer pays a yearly spread on the notional; if the issuer defaults, they receive the loss, that is the notional minus what is recovered. If default arrives with intensity λ a year and R is recovered, the expected loss per year is about λ × (1 − R). The fair spread pays for it:</p>
<div class="esempio">spread ≈ λ × (1 − R)   (the credit triangle)<br>λ = 2%, R = 40%: 200 × 0.6 = 120 bp<br>the other way: 300 bp with R = 40% → λ ≈ 300 / 0.6 = 500 bp = 5%</div>

<h3>From intensity to probability</h3>
<p>With a constant intensity the probability of surviving T years is e<sup>−λT</sup>, so of defaulting 1 − e<sup>−λT</sup>. For small λT it is almost λT, a little less: 5% a year for 5 years gives 1 − e<sup>−0.25</sup> ≈ 22%, not 25%.</p>

<h3>The upfront</h3>
<p>Today CDS trade with a standard coupon (100 or 500 bp). If the fair spread is different, the gap is paid at the start: upfront ≈ (spread − coupon) × RPV01, where RPV01 is the value of 1 bp a year paid until default (about 4 for a 5-year).</p>
<div class="esempio">spread 300, coupon 100, RPV01 4: 200 × 4 = 800 bp = 8% of notional, paid by the protection buyer</div>

<div class="trappola">Recovery matters as much as the spread: with R = 40% λ is the spread divided by 0.6; with R = 20% it is divided by 0.8. Probabilities read from spreads are risk-neutral: they include the risk premium, so they are higher than historical defaults.</div>
`,
    },
    scheda: {
      it: 'Spread ≈ λ × (1 − R); λ ≈ spread / (1 − R). Default entro T: 1 − e^(−λT), poco meno di λT. Upfront ≈ (spread − cedola) × RPV01 (circa 4 a 5 anni). Probabilità neutrali al rischio, sopra quelle storiche.',
      en: 'Spread ≈ λ × (1 − R); λ ≈ spread / (1 − R). Default within T: 1 − e^(−λT), a bit under λT. Upfront ≈ (spread − coupon) × RPV01 (about 4 at 5 years). Risk-neutral probabilities, above historical ones.',
    },
    fonti: [
      P.fonte('isda', 'section "Standardizing coupon dates"', { nota: { it: 'cedole standard 100/500 pb, act/360, date fisse', en: 'standard 100/500 bp coupons, act/360, fixed dates' } }),
      P.fonte('isda', 'section "Converter assumptions"', { nota: { it: 'upfront e rateo restituito al regolamento', en: 'upfront and accrued rebate at settlement' } }),
    ],
    test: false,
    nomiLivelli: { it: ['Spread', 'Probabilità', 'Upfront'], en: ['Spread', 'Probability', 'Upfront'] },
    livelli: [
      () => (P.chance(0.7) ? spread() : cedola()),
      probabilita,
      () => (P.chance(0.6) ? upfront() : regolamento()),
    ],
  });
})();
