(function () {
  'use strict';
  const P = Palestra;
  const F = {
    continua: P.fonte('xetra', 'section 11.2.1, "Basic Matching Rules"'),
    asta: P.fonte('xetra', 'section 11.1, "Auctions", matching examples'),
    iceberg: P.fonte('xetra', 'section 11.2.2.2, iceberg orders'),
    harrisAsta: P.fonte('harris', 'ch. 6, §6.3.1 "Single Price Auction Example"', { nota: { it: 'lo stesso conto di domanda e offerta, spiegato', en: 'the same supply and demand count, explained' } }),
    harrisPriorita: P.fonte('harris', 'ch. 6, §6.2 "Rule-Based Order-Matching Systems"', { nota: { it: 'priorità di prezzo e di tempo', en: 'price and time priority' } }),
  };
  const f2 = x => P.fmt(Math.round(x * 100) / 100);
  const f4 = x => P.fmt(Math.round(x * 10000) / 10000);

  // A market buy takes the offers by price, then by time; the average price is volume-weighted
  function compraAMercato() {
    const p0 = P.pick([10, 25, 50, 100]), tick = 0.01;
    const livelli = [[p0, P.int(2, 8) * 100, '9:01'], [p0, P.int(2, 8) * 100, '9:03'], [Math.round((p0 + tick) * 100) / 100, P.int(5, 15) * 100, '9:00'], [Math.round((p0 + 2 * tick) * 100) / 100, P.int(5, 15) * 100, '9:02']];
    const primi = livelli[0][1] + livelli[1][1];
    const Q = primi + P.int(1, livelli[2][1] / 100 - 1) * 100;
    let resto = Q, costo = 0; const fill = [];
    for (const [p, q] of livelli) { if (resto <= 0) break; const x = Math.min(q, resto); fill.push([p, x]); costo += p * x; resto -= x; }
    const vwap = costo / Q, rimasto = livelli[2][1] - (Q - primi), chiediMedia = P.chance(0.6);
    const book = livelli.map(([p, q, t]) => `${q} @ ${P.fmt(p)} (${t})`).join(', ');
    return {
      testo: chiediMedia
        ? P.t(`Nel book, dal lato delle vendite: ${book}. Arriva un ordine di acquisto a mercato per ${Q} azioni. A che prezzo medio viene eseguito?`, `On the offer side of the book: ${book}. A market buy order for ${Q} shares arrives. At what average price does it fill?`)
        : P.t(`Nel book, dal lato delle vendite: ${book}. Arriva un ordine di acquisto a mercato per ${Q} azioni. Dopo, quante azioni restano in vendita al miglior prezzo?`, `On the offer side of the book: ${book}. A market buy order for ${Q} shares arrives. Afterwards, how many shares are left on offer at the best price?`),
      nota: chiediMedia ? P.t('quattro decimali', 'four decimals') : '',
      risposta: chiediMedia ? P.numero(vwap, { tol: 0.00006, mostra: f4(vwap) }) : P.numero(rimasto),
      suggerimenti: [
        P.t('Priorità di prezzo, poi di tempo: prima tutto il prezzo migliore (in ordine di arrivo), poi il livello successivo.', 'Price priority, then time: first the whole best price (in order of arrival), then the next level.'),
        P.t(`A ${P.fmt(p0)} ci sono ${primi} azioni; le altre ${Q - primi} si prendono a ${P.fmt(livelli[2][0])}.`, `At ${P.fmt(p0)} there are ${primi} shares; the other ${Q - primi} are taken at ${P.fmt(livelli[2][0])}.`),
      ],
      soluzione: chiediMedia
        ? [fill.map(([p, x]) => `${x} × ${P.fmt(p)}`).join(' + ') + ` = ${f2(costo)}`, `${f2(costo)} / ${Q} = ${f4(vwap)}`]
        : [P.t(`a ${P.fmt(livelli[2][0])} restano ${livelli[2][1]} − ${Q - primi} = ${rimasto}, ora il miglior prezzo in vendita`, `at ${P.fmt(livelli[2][0])} ${livelli[2][1]} − ${Q - primi} = ${rimasto} are left, now the best offer`)],
      fonte: F.continua,
    };
  }

  // Call auction: at each price, demand = bids at or above, supply = offers at or below; take the largest
  // executable volume, then the smallest surplus. Books are drawn until that choice is unique.
  function libro() {
    const base = P.pick([48, 50, 30, 100]), prezzi = [0, 1, 2, 3, 4].map(i => base + i);
    for (;;) {
      const bids = P.mescola(prezzi.slice(1)).slice(0, 3).map(p => [p, P.int(1, 5) * 100]);
      const asks = P.mescola(prezzi.slice(0, 4)).slice(0, 3).map(p => [p, P.int(1, 5) * 100]);
      // the auction price is one of the limits in the book
      const candidati = [...new Set(bids.concat(asks).map(x => x[0]))].sort((x, y) => x - y);
      const righe = candidati.map(p => {
        const d = bids.filter(b => b[0] >= p).reduce((s, b) => s + b[1], 0), o = asks.filter(a => a[0] <= p).reduce((s, a) => s + a[1], 0);
        return { p, d, o, v: Math.min(d, o), s: d - o };
      });
      const max = Math.max(...righe.map(r => r.v));
      if (max === 0) continue;
      const migliori = righe.filter(r => r.v === max), minS = Math.min(...migliori.map(r => Math.abs(r.s)));
      const scelti = migliori.filter(r => Math.abs(r.s) === minS);
      if (scelti.length !== 1) continue;
      const r = scelti[0], chiediVolume = P.chance(0.35);
      const lato = xs => xs.sort((a, b) => b[0] - a[0]).map(([p, q]) => `${q} @ ${p}`).join(', ');
      return {
        testo: P.t(`Asta di apertura, solo ordini con limite. Acquisti: ${lato(bids)}. Vendite: ${lato(asks)}. ${chiediVolume ? 'Quante azioni si scambiano al prezzo d\'asta?' : 'A che prezzo si chiude l\'asta?'}`,
          `Opening auction, limit orders only. Bids: ${lato(bids)}. Offers: ${lato(asks)}. ${chiediVolume ? 'How many shares trade at the auction price?' : 'At what price does the auction clear?'}`),
        risposta: P.numero(chiediVolume ? r.v : r.p),
        suggerimenti: [
          P.t('Prova ogni limite presente nel book: domanda = acquisti con limite uguale o più alto, offerta = vendite con limite uguale o più basso. Si scambia il minimo dei due.', 'Try every limit in the book: demand = bids with a limit at or above it, supply = offers with a limit at or below it. The smaller of the two trades.'),
          P.t('Vince il prezzo con il volume scambiato più alto; a parità, quello con l\'eccedenza più piccola.', 'The price with the largest traded volume wins; on a tie, the one with the smallest surplus.'),
        ],
        soluzione: [
          righe.slice().reverse().map(x => `${x.p}: ${x.d}/${x.o} → ${x.v}`).join('; '),
          r.s === 0 ? P.t(`prezzo ${r.p}, volume ${r.v}, nessuna eccedenza`, `price ${r.p}, volume ${r.v}, no surplus`)
            : P.t(`prezzo ${r.p}, volume ${r.v}, eccedenza di ${Math.abs(r.s)} ${r.s > 0 ? 'in acquisto' : 'in vendita'}`, `price ${r.p}, volume ${r.v}, surplus of ${Math.abs(r.s)} ${r.s > 0 ? 'on the bid' : 'on the offer'}`),
        ],
        fonte: F.asta,
      };
    }
  }

  // Same volume and surplus at two prices: leftover buyers push the price up, leftover sellers down
  function spareggio() {
    const p = P.pick([30.1, 52, 101.5, 12.4]), q = P.pick([0.1, 1, 0.5, 0.05]), alto = Math.round((p + q) * 100) / 100, acquisto = P.chance(0.5);
    return {
      testo: P.t(`In un'asta, i prezzi ${P.fmt(p)} e ${P.fmt(alto)} danno lo stesso volume massimo e la stessa eccedenza, e a entrambi l'eccedenza è dal lato ${acquisto ? 'degli acquisti' : 'delle vendite'}. Quale prezzo sceglie l'asta?`,
        `In an auction, prices ${P.fmt(p)} and ${P.fmt(alto)} give the same maximum volume and the same surplus, and at both the surplus is on the ${acquisto ? 'buy' : 'sell'} side. Which price does the auction pick?`),
      risposta: P.scelta([P.fmt(alto), P.fmt(p), P.t('il prezzo di riferimento', 'the reference price')], acquisto ? 0 : 1),
      suggerimenti: [
        P.t('Un\'eccedenza dice da che parte c\'è pressione rimasta senza contropartita.', 'A surplus says which side has pressure left without a counterpart.'),
        P.t('Compratori rimasti fuori spingono il prezzo in su; venditori rimasti fuori lo spingono in giù. Il prezzo di riferimento serve solo quando i segnali non vanno d\'accordo.', 'Buyers left over push the price up; sellers left over push it down. The reference price is only used when the signals disagree.'),
      ],
      soluzione: [acquisto ? P.t(`eccedenza in acquisto: il più alto, ${P.fmt(alto)}`, `buy-side surplus: the higher, ${P.fmt(alto)}`) : P.t(`eccedenza in vendita: il più basso, ${P.fmt(p)}`, `sell-side surplus: the lower, ${P.fmt(p)}`)],
      fonte: F.asta,
    };
  }

  // An iceberg shows only its peak; the unfilled part of the peak rests at the limit, the rest stays hidden
  function iceberg() {
    const b1 = P.int(10, 30) * 100, b2 = P.int(5, 15) * 100, b3 = P.int(20, 40) * 100, picco = b1 + b2 + P.int(2, 10) * 100, tot = picco * P.int(3, 6);
    const p1 = 30.05, p2 = 30.00, p3 = 29.95, visibile = picco - b1 - b2, nascosto = tot - picco;
    const px = x => x.toFixed(2); // prices always with two decimals, as on a screen
    const cosa = P.pick(['visibile', 'nascosto', 'scambiato']);
    const v = { visibile, nascosto, scambiato: b1 + b2 }[cosa];
    const domanda = {
      visibile: P.t('Quante azioni si vedono in vendita a 30.00 subito dopo?', 'How many shares show on the offer at 30.00 right after?'),
      nascosto: P.t('Quante azioni dell\'iceberg restano nascoste?', 'How many shares of the iceberg stay hidden?'),
      scambiato: P.t('Quante azioni si scambiano subito?', 'How many shares trade at once?'),
    }[cosa];
    return {
      testo: P.t(`Acquisti nel book: ${b1} @ ${px(p1)}, ${b2} @ ${px(p2)}, ${b3} @ ${px(p3)}. Arriva un ordine iceberg di vendita: limite ${px(p2)}, ${P.fmt(tot)} azioni in tutto, ${P.fmt(picco)} visibili alla volta. ${domanda}`,
        `Bids in the book: ${b1} @ ${px(p1)}, ${b2} @ ${px(p2)}, ${b3} @ ${px(p3)}. A sell iceberg order arrives: limit ${px(p2)}, ${P.fmt(tot)} shares in all, ${P.fmt(picco)} shown at a time. ${domanda}`),
      risposta: P.numero(v),
      suggerimenti: [
        P.t('Il picco visibile si scambia contro gli acquisti a un prezzo uguale o migliore del suo limite, in ordine di prezzo.', 'The visible peak trades against bids at or better than its limit, in price order.'),
        P.t(`Si prendono ${b1} a ${px(p1)} e ${b2} a ${px(p2)}; ${px(p3)} è sotto il limite. Il resto del picco resta esposto a ${px(p2)}, il resto dell'ordine dietro, nascosto.`, `It takes ${b1} at ${px(p1)} and ${b2} at ${px(p2)}; ${px(p3)} is below the limit. The rest of the peak rests at ${px(p2)}, the rest of the order behind it, hidden.`),
      ],
      soluzione: [
        P.t(`scambiate ${b1} + ${b2} = ${b1 + b2}`, `traded ${b1} + ${b2} = ${b1 + b2}`),
        P.t(`visibili ${P.fmt(picco)} − ${b1 + b2} = ${visibile}; nascoste ${P.fmt(tot)} − ${P.fmt(picco)} = ${P.fmt(nascosto)}`, `visible ${P.fmt(picco)} − ${b1 + b2} = ${visibile}; hidden ${P.fmt(tot)} − ${P.fmt(picco)} = ${P.fmt(nascosto)}`),
      ],
      fonte: F.iceberg,
    };
  }

  P.trucco({
    id: 'desk-book',
    materia: 'desk',
    capitolo: 'book',
    numero: 3,
    titolo: { it: 'Il book e l\'asta', en: 'The order book and the auction' },
    sottotitolo: {
      it: 'Come si eseguono gli ordini: priorità di prezzo e di tempo, il prezzo medio di un ordine grande, il prezzo d\'asta, gli iceberg.',
      en: 'How orders get filled: price and time priority, the average price of a large order, the auction price, icebergs.',
    },
    aggancio: {
      it: '«Nel book ci sono 500 a 10.02 e 900 a 10.03. Compri 1,000 a mercato: che prezzo medio paghi?» Al desk di market making è la prima cosa da sapere fare a occhio.',
      en: '"The book shows 500 at 10.02 and 900 at 10.03. You buy 1,000 at market: what average price do you pay?" On a market-making desk it is the first thing to do at a glance.',
    },
    lezione: {
      it: `
<h3>Priorità di prezzo e di tempo</h3>
<p>Nella negoziazione continua un ordine che arriva si esegue contro il book al prezzo degli ordini già presenti: prima il prezzo migliore, e allo stesso prezzo chi è arrivato prima. Un ordine grande "mangia" il book livello per livello, e il suo prezzo medio è la media pesata per le quantità.</p>
<div class="esempio">Vendite: 500 @ 10.02, 700 @ 10.02, 900 @ 10.03. Compri 1,800 a mercato:<br>1,200 a 10.02 e 600 a 10.03 → (12,024 + 6,018) / 1,800 = 10.0233.</div>

<h3>L'asta</h3>
<p>All'apertura e alla chiusura gli ordini si raccolgono e si eseguono tutti a un prezzo solo, scelto fra i limiti presenti nel book. Per ogni limite si sommano gli acquisti disposti a pagarlo o di più e le vendite disposte a farlo o di meno: si scambia il minimo dei due. Vince il prezzo con il volume più alto; a parità, quello con l'eccedenza più piccola; se resta la parità, compratori rimasti fuori spingono verso il prezzo più alto e venditori verso il più basso.</p>

<h3>Iceberg</h3>
<p>Un iceberg mostra solo una parte (il picco). Il picco si esegue come un ordine normale; quello che non si esegue resta esposto al limite, e il resto dell'ordine aspetta nascosto, uscendo un picco alla volta.</p>

<div class="trappola">Un ordine a mercato non si esegue "al prezzo di adesso": si esegue ai prezzi dei livelli che consuma. Più è grande rispetto al book, più il prezzo medio si allontana dal migliore.</div>
`,
      en: `
<h3>Price and time priority</h3>
<p>In continuous trading an incoming order fills against the book at the prices of the orders already there: best price first, and at the same price whoever came first. A large order "eats" the book level by level, and its average price is weighted by the quantities.</p>
<div class="esempio">Offers: 500 @ 10.02, 700 @ 10.02, 900 @ 10.03. You buy 1,800 at market:<br>1,200 at 10.02 and 600 at 10.03 → (12,024 + 6,018) / 1,800 = 10.0233.</div>

<h3>The auction</h3>
<p>At the open and the close orders are collected and all filled at one price, chosen among the limits in the book. For each limit, add up the bids willing to pay it or more and the offers willing to sell at it or less: the smaller of the two trades. The price with the largest volume wins; on a tie, the one with the smallest surplus; if still tied, buyers left over push towards the higher price and sellers towards the lower.</p>

<h3>Icebergs</h3>
<p>An iceberg shows only part of itself (the peak). The peak trades like a normal order; whatever does not trade rests at the limit, and the rest of the order waits hidden, coming out one peak at a time.</p>

<div class="trappola">A market order does not fill "at the current price": it fills at the prices of the levels it consumes. The larger it is compared with the book, the further its average price drifts from the best.</div>
`,
    },
    scheda: {
      it: 'Prima il prezzo, poi il tempo. Ordine grande: prezzo medio pesato sui livelli consumati. Asta: per ogni prezzo min(acquisti ≥ p, vendite ≤ p); vince il volume massimo, poi l\'eccedenza minima, poi la direzione dell\'eccedenza. Iceberg: si vede solo il picco.',
      en: 'Price first, then time. Large order: average price weighted over the levels consumed. Auction: at each price min(bids ≥ p, offers ≤ p); largest volume wins, then smallest surplus, then the surplus direction. Iceberg: only the peak shows.',
    },
    fonti: [F.continua, F.asta, F.iceberg, F.harrisPriorita, F.harrisAsta],
    test: false,
    nomiLivelli: { it: ['Un ordine a mercato', 'Il prezzo d\'asta', 'Spareggi e iceberg'], en: ['A market order', 'The auction price', 'Tie-breaks and icebergs'] },
    livelli: [compraAMercato, libro, () => (P.chance(0.5) ? spareggio() : iceberg())],
  });
})();
