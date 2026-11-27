(function () {
  'use strict';
  const P = Palestra;
  const F = {
    indice: P.fonte('eurexAzioni', 'case study "Futures Pricing: Fair Value", exercise 154'),
    ctd: P.fonte('eurexTassi', 'section "Identifying the CTD Bond"'),
    copertura: P.fonte('eurexTassi', 'chapter "Hedging Strategies", section "Sensitivity Method"'),
    teorico: P.fonte('eurexTassi', 'section "Conversion Factor (Price Factor) and Cheapest-to-Deliver (CTD) Bond"'),
  };
  const f2 = x => P.fmt(Math.round(x * 100) / 100);

  // Index future: spot plus the cost of carrying it, minus the dividends you would have collected
  function indice() {
    const S = P.pick([4000, 4800, 7500, 15000, 18000]), gg = P.pick([30, 60, 90, 120, 180]), r = P.int(10, 45) / 1000;
    const totale = P.chance(0.3), D = totale ? 0 : Math.round(S * P.int(2, 12) / 1000);
    const v = S * (1 + r * gg / 360) - D;
    return {
      testo: totale
        ? P.t(`Un indice total return (i dividendi sono già reinvestiti) vale ${P.fmt(S)}. Il future scade fra ${gg} giorni, tasso monetario ${P.pct(r, 2)} act/360. Prezzo equo del future?`, `A total-return index (dividends already reinvested) is at ${P.fmt(S)}. The future expires in ${gg} days, money-market rate ${P.pct(r, 2)} act/360. Fair futures price?`)
        : P.t(`Un indice di prezzo vale ${P.fmt(S)}. Il future scade fra ${gg} giorni, tasso monetario ${P.pct(r, 2)} act/360, dividendi attesi fino a scadenza ${D} punti. Prezzo equo del future?`, `A price index is at ${P.fmt(S)}. The future expires in ${gg} days, money-market rate ${P.pct(r, 2)} act/360, expected dividends to expiry ${D} points. Fair futures price?`),
      nota: P.t('in punti indice, due decimali', 'in index points, two decimals'),
      risposta: P.numero(v, { tol: 0.011, mostra: f2(v) }),
      suggerimenti: [
        P.t('Comprare il future equivale a comprare l\'indice a credito: paghi gli interessi del finanziamento, ma non incassi i dividendi.', 'Buying the future is like buying the index on credit: you pay the financing interest, but you do not collect the dividends.'),
        P.t(`Interessi: ${P.fmt(S)} × ${P.fmt(r)} × ${gg}/360 = ${f2(S * r * gg / 360)}.${totale ? ' Un indice total return non stacca dividendi da togliere.' : ''}`, `Interest: ${P.fmt(S)} × ${P.fmt(r)} × ${gg}/360 = ${f2(S * r * gg / 360)}.${totale ? ' A total-return index pays out no dividends to subtract.' : ''}`),
      ],
      soluzione: [`${P.fmt(S)} + ${f2(S * r * gg / 360)}${totale ? '' : ` − ${D}`} = ${f2(v)}`],
      fonte: F.indice,
    };
  }

  // At delivery the short gets future × CF for whichever bond he hands over: the cheapest is the lowest price / CF
  function ctd() {
    const fut = P.int(11000, 13500) / 100;
    const bond = ['A', 'B', 'C'].map(() => {
      const cf = P.int(7600, 9400) / 10000, base = P.int(-40, 40) / 100;
      return { cf, prezzo: Math.round((fut * cf + base) * 100) / 100 };
    });
    const rapporti = bond.map(b => b.prezzo / b.cf), i = rapporti.indexOf(Math.min(...rapporti));
    if (new Set(rapporti.map(x => x.toFixed(2))).size < 3) return ctd();
    const chiediGuadagno = P.chance(0.4), g = fut * bond[i].cf - bond[i].prezzo;
    const elenco = bond.map((b, k) => `${'ABC'[k]} ${P.fmt(b.prezzo)} / ${P.fmt(b.cf)}`).join(' · ');
    return {
      testo: chiediGuadagno
        ? P.t(`Giorno di consegna del future su bond, che regola a ${P.fmt(fut)}. Bond consegnabili, prezzo secco / fattore di conversione: ${elenco}. Il venditore compra il bond più conveniente sul mercato e lo consegna. Quanto guadagna ogni 100 di nominale?`, `Delivery day of a bond future settling at ${P.fmt(fut)}. Deliverable bonds, clean price / conversion factor: ${elenco}. The short buys the cheapest bond in the market and delivers it. What does he make per 100 face?`)
        : P.t(`Giorno di consegna del future su bond. Bond consegnabili, prezzo secco / fattore di conversione: ${elenco}. Quale conviene consegnare (il cheapest to deliver)?`, `Delivery day of a bond future. Deliverable bonds, clean price / conversion factor: ${elenco}. Which one is cheapest to deliver?`),
      nota: chiediGuadagno ? P.t('tre decimali, con il segno', 'three decimals, with its sign') : '',
      risposta: chiediGuadagno ? P.numero(g, { tol: 0.0015, mostra: P.fmt(Math.round(g * 1000) / 1000) }) : P.scelta(['A', 'B', 'C'], i),
      suggerimenti: [
        P.t('Chi consegna riceve future × fattore di conversione per il bond che sceglie, e quel bond gli costa il suo prezzo.', 'Whoever delivers receives future × conversion factor for the bond he picks, and that bond costs him its price.'),
        P.t('Il più conveniente ha il prezzo diviso fattore più basso: ' + bond.map((b, k) => `${'ABC'[k]} ${f2(rapporti[k])}`).join(', ') + '.', 'The cheapest has the lowest price divided by factor: ' + bond.map((b, k) => `${'ABC'[k]} ${f2(rapporti[k])}`).join(', ') + '.'),
      ],
      soluzione: chiediGuadagno
        ? [P.t(`CTD: ${'ABC'[i]}`, `CTD: ${'ABC'[i]}`), `${P.fmt(fut)} × ${P.fmt(bond[i].cf)} − ${P.fmt(bond[i].prezzo)} = ${P.fmt(Math.round(g * 1000) / 1000)}`]
        : [bond.map((b, k) => `${'ABC'[k]}: ${P.fmt(b.prezzo)} / ${P.fmt(b.cf)} = ${f2(rapporti[k])}`).join('; '), P.t(`il più basso è ${'ABC'[i]}`, `the lowest is ${'ABC'[i]}`)],
      fonte: F.ctd,
    };
  }

  // Hedge with bond futures: portfolio BPV / BPV of the CTD per contract × conversion factor
  function copertura() {
    const bpv = P.pick([5000, 8000, 12000, 18500, 25000]), prezzo = P.int(940, 1040) / 10, md = P.int(40, 90) / 10, cf = P.int(7500, 9500) / 10000;
    const bpvCtd = 100000 * prezzo / 100 * md / 10000, n = bpv / bpvCtd * cf;
    return {
      testo: P.t(`Il tuo portafoglio di bond perde ${P.fmt(bpv)} € per ogni punto base di rialzo dei rendimenti. Lo copri con un future su 100,000 € di nominale; il CTD quota ${P.fmt(prezzo)}, duration modificata ${P.fmt(md)}, fattore di conversione ${P.fmt(cf)}. Quanti contratti vendi?`,
        `Your bond portfolio loses €${P.fmt(bpv)} for every basis point that yields rise. You hedge with a future on €100,000 face; the CTD trades at ${P.fmt(prezzo)}, modified duration ${P.fmt(md)}, conversion factor ${P.fmt(cf)}. How many contracts do you sell?`),
      nota: P.t('arrotonda al contratto', 'round to the contract'),
      risposta: P.numero(Math.round(n), { tol: 1 }),
      suggerimenti: [
        P.t('Il future si muove come il CTD diviso il fattore di conversione: il suo BPV è quello del CTD / CF.', 'The future moves like the CTD divided by the conversion factor: its BPV is the CTD\'s / CF.'),
        P.t(`BPV del CTD per 100,000 di nominale: 100,000 × ${P.fmt(prezzo / 100)} × ${P.fmt(md)} / 10,000 = ${f2(bpvCtd)} €.`, `BPV of the CTD per 100,000 face: 100,000 × ${P.fmt(prezzo / 100)} × ${P.fmt(md)} / 10,000 = €${f2(bpvCtd)}.`),
      ],
      soluzione: [`${P.fmt(bpv)} / ${f2(bpvCtd)} × ${P.fmt(cf)} = ${P.fmt(Math.round(n * 10) / 10)}`, P.t(`vendi ${Math.round(n)} contratti`, `sell ${Math.round(n)} contracts`)],
      fonte: F.copertura,
    };
  }

  // Theoretical bond future: (clean + financing on the dirty price − coupon earned) / CF
  function teorico() {
    const pulito = P.int(9600, 10400) / 100, c = P.pick([2, 2.5, 3, 3.5, 4]), maturati = P.int(30, 300), repo = P.int(15, 40) / 1000, gg = P.pick([30, 45, 60, 90]), cf = P.int(8000, 9500) / 10000;
    const rateo = c * maturati / 365, fin = (pulito + rateo) * repo * gg / 360, cedola = c * gg / 365, v = (pulito + fin - cedola) / cf;
    return {
      testo: P.t(`Il CTD di un future su bond quota ${P.fmt(pulito)} secco, cedola annua ${c}% (act/act) con ${maturati} giorni di rateo. Repo ${P.pct(repo, 2)} act/360, consegna fra ${gg} giorni, fattore di conversione ${P.fmt(cf)}. Prezzo teorico del future?`,
        `The CTD of a bond future trades at ${P.fmt(pulito)} clean, annual coupon ${c}% (act/act) with ${maturati} days accrued. Repo ${P.pct(repo, 2)} act/360, delivery in ${gg} days, conversion factor ${P.fmt(cf)}. Theoretical futures price?`),
      nota: P.t('due decimali', 'two decimals'),
      risposta: P.numero(v, { tol: 0.021, mostra: f2(v) }),
      suggerimenti: [
        P.t('Compra il bond oggi e finanzialo in repo fino alla consegna: paghi interessi sul prezzo tel quel (secco + rateo) e incassi la cedola che matura nel frattempo.', 'Buy the bond today and fund it in repo until delivery: you pay interest on the dirty price (clean + accrued) and earn the coupon that accrues meanwhile.'),
        P.t(`Rateo ${P.fmt(rateo, 4)}; finanziamento ${P.fmt(fin, 4)}; cedola maturata ${P.fmt(cedola, 4)}. Poi dividi per il fattore.`, `Accrued ${P.fmt(rateo, 4)}; financing ${P.fmt(fin, 4)}; coupon earned ${P.fmt(cedola, 4)}. Then divide by the factor.`),
      ],
      soluzione: [
        `${P.fmt(c)} × ${maturati}/365 = ${P.fmt(rateo, 4)}; (${P.fmt(pulito)} + ${P.fmt(rateo, 4)}) × ${P.fmt(repo)} × ${gg}/360 = ${P.fmt(fin, 4)}; ${P.fmt(c)} × ${gg}/365 = ${P.fmt(cedola, 4)}`,
        `(${P.fmt(pulito)} + ${P.fmt(fin, 4)} − ${P.fmt(cedola, 4)}) / ${P.fmt(cf)} = ${f2(v)}`,
      ],
      fonte: F.teorico,
    };
  }

  P.trucco({
    id: 'tassi-futures',
    materia: 'tassi',
    capitolo: 'futures',
    numero: 5,
    titolo: { it: 'Futures: costo di finanziamento e CTD', en: 'Futures: cost of carry and the CTD' },
    sottotitolo: {
      it: 'Il prezzo equo di un future su indice e su bond, il bond più conveniente da consegnare, quanti contratti per coprire un portafoglio.',
      en: 'The fair price of an index future and a bond future, the cheapest bond to deliver, how many contracts hedge a portfolio.',
    },
    aggancio: {
      it: '«L\'indice è a 4,800, i tassi al 3.6%, mancano 120 giorni e 52 punti di dividendi. Dove deve stare il future?» Sopra lo spot di 57.60, sotto di 52: 4,805.60.',
      en: '"The index is at 4,800, rates at 3.6%, 120 days to go and 52 points of dividends. Where should the future be?" Up 57.60 for carry, down 52 for dividends: 4,805.60.',
    },
    lezione: {
      it: `
<h3>Il costo di portarsi dietro il sottostante</h3>
<p>Un future equivale a comprare il sottostante oggi a credito e tenerlo fino a scadenza. Quindi: prezzo equo = spot + interessi sul finanziamento − redditi incassati nel frattempo (dividendi, cedole). Se il future si allontana da lì, c'è un arbitraggio (cash and carry).</p>
<div class="esempio">Indice 4,800, 120 giorni al 3.6% act/360, dividendi 52: 4,800 + 57.60 − 52 = 4,805.60.<br>Un indice total return ha già dentro i dividendi: niente da togliere.</div>

<h3>Future su bond: il fattore di conversione</h3>
<p>Nel future su bond chi vende può consegnare uno fra molti titoli, e riceve future × fattore di conversione (CF). Gli conviene il bond con il prezzo / CF più basso: il cheapest to deliver. Il prezzo teorico del future è quello del CTD finanziato fino alla consegna, diviso per il suo CF.</p>

<h3>Coprire con i future</h3>
<p>Il future si muove come il CTD diviso CF. Per coprire un portafoglio: contratti = BPV del portafoglio / BPV del CTD per contratto × CF, con BPV = nominale × prezzo × duration modificata / 10,000.</p>

<div class="trappola">Il finanziamento si paga sul prezzo tel quel (secco + rateo), la cedola si incassa sui giorni effettivi; e nel rapporto di copertura il CF moltiplica, non divide.</div>
`,
      en: `
<h3>The cost of carrying the underlying</h3>
<p>A future is the same as buying the underlying today on credit and holding it to expiry. So: fair price = spot + interest on the financing − income collected meanwhile (dividends, coupons). If the future strays from there, there is an arbitrage (cash and carry).</p>
<div class="esempio">Index 4,800, 120 days at 3.6% act/360, dividends 52: 4,800 + 57.60 − 52 = 4,805.60.<br>A total-return index already holds the dividends: nothing to subtract.</div>

<h3>Bond futures: the conversion factor</h3>
<p>In a bond future the short may deliver any of several bonds, and receives future × conversion factor (CF). The bond with the lowest price / CF pays best: the cheapest to deliver. The theoretical futures price is the CTD financed to delivery, divided by its CF.</p>

<h3>Hedging with futures</h3>
<p>The future moves like the CTD divided by its CF. To hedge a portfolio: contracts = portfolio BPV / BPV of the CTD per contract × CF, with BPV = face × price × modified duration / 10,000.</p>

<div class="trappola">Financing is paid on the dirty price (clean + accrued), the coupon is earned on actual days; and in the hedge ratio the CF multiplies, it does not divide.</div>
`,
    },
    scheda: {
      it: 'Future = spot + finanziamento − redditi. Indice: S × (1 + r × giorni/360) − dividendi. CTD = prezzo / CF più basso; chi consegna incassa F × CF − prezzo. Future su bond = (secco + finanziamento sul tel quel − cedola maturata) / CF. Contratti = BPV portafoglio / BPV CTD × CF.',
      en: 'Future = spot + financing − income. Index: S × (1 + r × days/360) − dividends. CTD = lowest price / CF; the deliverer gets F × CF − price. Bond future = (clean + financing on the dirty price − coupon earned) / CF. Contracts = portfolio BPV / CTD BPV × CF.',
    },
    fonti: [F.indice, F.ctd, F.copertura, F.teorico],
    test: false,
    nomiLivelli: { it: ['Future su indice', 'CTD e copertura', 'Prezzo teorico'], en: ['Index future', 'CTD and hedging', 'Theoretical price'] },
    livelli: [indice, () => (P.chance(0.55) ? ctd() : copertura()), teorico],
  });
})();
