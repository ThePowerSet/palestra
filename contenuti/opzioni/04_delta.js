(function () {
  'use strict';
  const P = Palestra;
  const DELTA = [0.1, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.9];
  const azioni = n => P.t(`${P.fmt(Math.abs(n))} azioni`, `${P.fmt(Math.abs(n))} shares`);

  function copertura() {
    const n = P.pick([5, 10, 10, 20, 25, 40, 50]), call = P.chance(0.6), d = P.pick(DELTA), lungo = P.chance(0.6);
    const dOpz = call ? d : -(1 - d);
    const tot = (lungo ? 1 : -1) * n * dOpz * 100, compra = tot < 0;
    return {
      testo: P.t(`Sei ${lungo ? 'lungo' : 'corto'} di ${n} ${call ? 'call' : 'put'} con delta ${P.fmt(dOpz)}, ognuna su 100 azioni. Quante azioni devi ${compra ? 'comprare' : 'vendere'} per essere delta neutrale?`,
        `You are ${lungo ? 'long' : 'short'} ${n} ${call ? 'calls' : 'puts'} with delta ${P.fmt(dOpz)}, each on 100 shares. How many shares do you ${compra ? 'buy' : 'sell'} to be delta neutral?`),
      risposta: P.numero(Math.abs(tot), { unita: P.t('azioni', 'shares') }),
      suggerimenti: [
        P.t('Delta della posizione = numero di opzioni × delta × 100, con il segno: corto cambia segno. Poi tratti azioni per il valore opposto.',
          'Position delta = number of options × delta × 100, with its sign: short flips the sign. Then trade shares for the opposite amount.'),
        `${lungo ? '+' : '−'}${n} × ${P.fmt(dOpz)} × 100 = ${P.fmt(tot)}.`,
      ],
      soluzione: [P.t(`delta: ${lungo ? '+' : '−'}${n} × (${P.fmt(dOpz)}) × 100 = ${P.conSegno(tot)} azioni`, `delta: ${lungo ? '+' : '−'}${n} × (${P.fmt(dOpz)}) × 100 = ${P.conSegno(tot)} shares`),
        P.t(`per tornare a zero ${compra ? 'compri' : 'vendi'} ${azioni(tot)}`, `to get back to zero, ${compra ? 'buy' : 'sell'} ${azioni(tot)}`)],
    };
  }

  function callPut() {
    const d = P.pick(DELTA);
    if (P.chance(0.5)) {
      const daCall = P.chance(0.5), v = daCall ? d - 1 : d;
      return {
        testo: daCall
          ? P.t(`Una call ha delta ${P.fmt(d)}. Che delta ha la put con lo stesso strike e la stessa scadenza?`, `A call has delta ${P.fmt(d)}. What is the delta of the put with the same strike and expiry?`)
          : P.t(`Una put ha delta ${P.fmt(d - 1)}. Che delta ha la call con lo stesso strike e la stessa scadenza?`, `A put has delta ${P.fmt(d - 1)}. What is the delta of the call with the same strike and expiry?`),
        risposta: P.numero(v),
        suggerimenti: [
          P.t('Dalla parità, call meno put è un forward, che ha delta 1: Δcall − Δput = 1.', 'From parity, call minus put is a forward, which has delta 1: Δcall − Δput = 1.'),
          daCall ? `Δput = ${P.fmt(d)} − 1.` : `Δcall = 1 + (${P.fmt(d - 1)}).`,
        ],
        soluzione: [daCall ? `Δput = ${P.fmt(d)} − 1 = ${P.fmt(v)}` : `Δcall = 1 ${P.piuMeno(d - 1)} = ${P.fmt(v)}`],
      };
    }
    // a straddle: call delta + put delta = 2·Δcall − 1
    const n = P.pick([10, 20, 25, 50]), v = (2 * d - 1) * n * 100, compra = v < 0;
    if (Math.abs(v) < 1e-9) return callPut();
    return {
      testo: P.t(`Compri ${n} straddle; la call ha delta ${P.fmt(d)}. Quante azioni devi ${compra ? 'comprare' : 'vendere'} per coprire il delta?`,
        `You buy ${n} straddles; the call has delta ${P.fmt(d)}. How many shares do you ${compra ? 'buy' : 'sell'} to hedge the delta?`),
      nota: P.t('ogni opzione su 100 azioni', 'each option on 100 shares'),
      risposta: P.numero(Math.abs(v), { unita: P.t('azioni', 'shares') }),
      suggerimenti: [
        P.t('Straddle = call + put. La put ha delta Δcall − 1, quindi lo straddle ha delta 2 × Δcall − 1.', 'Straddle = call + put. The put has delta Δcall − 1, so the straddle has delta 2 × Δcall − 1.'),
        `2 × ${P.fmt(d)} − 1 = ${P.fmt(2 * d - 1)}; × ${n} × 100.`,
      ],
      soluzione: [`Δ straddle = 2 × ${P.fmt(d)} − 1 = ${P.fmt(2 * d - 1)}`, `${P.fmt(2 * d - 1)} × ${n} × 100 = ${P.fmt(v)}`,
        P.t(`${compra ? 'compri' : 'vendi'} ${azioni(v)}`, `${compra ? 'buy' : 'sell'} ${azioni(v)}`)],
    };
  }

  function portafoglio() {
    const a = P.pick([5, 10, 20, 30]), da = P.pick(DELTA);
    const b = P.pick([5, 10, 15, 20]), db = -P.pick(DELTA);
    const s = P.pick([-800, -500, -300, 200, 400, 600, 1000]);
    const lungoCall = P.chance(0.5), lungoPut = P.chance(0.5);
    const dc = (lungoCall ? 1 : -1) * a * da * 100, dp = (lungoPut ? 1 : -1) * b * db * 100, v = dc + dp + s;
    return {
      testo: P.t(`Sei ${lungoCall ? 'lungo' : 'corto'} di ${a} call (delta ${P.fmt(da)}), ${lungoPut ? 'lungo' : 'corto'} di ${b} put (delta ${P.fmt(db)}) e ${s > 0 ? 'lungo' : 'corto'} di ${Math.abs(s)} azioni. Qual è il delta totale, in azioni?`,
        `You are ${lungoCall ? 'long' : 'short'} ${a} calls (delta ${P.fmt(da)}), ${lungoPut ? 'long' : 'short'} ${b} puts (delta ${P.fmt(db)}) and ${s > 0 ? 'long' : 'short'} ${Math.abs(s)} shares. What is the total delta, in shares?`),
      nota: P.t('ogni opzione su 100 azioni; con il segno', 'each option on 100 shares; with its sign'),
      risposta: P.numero(v),
      suggerimenti: [
        P.t('Somma i pezzi, ognuno con il suo segno: corto cambia segno, e la put ha già delta negativo.', 'Add up the pieces, each with its sign: short flips the sign, and the put already has a negative delta.'),
        P.t(`call: ${P.fmt(dc)}; put: ${P.fmt(dp)}; azioni: ${P.fmt(s)}.`, `calls: ${P.fmt(dc)}; puts: ${P.fmt(dp)}; shares: ${P.fmt(s)}.`),
      ],
      soluzione: [
        `${lungoCall ? '+' : '−'}${a} × ${P.fmt(da)} × 100 = ${P.fmt(dc)}`,
        `${lungoPut ? '+' : '−'}${b} × (${P.fmt(db)}) × 100 = ${P.fmt(dp)}`,
        `${P.fmt(dc)} ${P.piuMeno(dp)} ${P.piuMeno(s)} = ${P.fmt(v)}`,
      ],
    };
  }

  P.trucco({
    id: 'opz-delta',
    materia: 'opzioni',
    capitolo: 'greche',
    numero: 4,
    titolo: { it: 'Delta e copertura', en: 'Delta and hedging' },
    sottotitolo: {
      it: 'Quante azioni compri o vendi per essere neutrale, e perché il delta della put è quello della call meno uno.',
      en: 'How many shares you buy or sell to be flat, and why the put\'s delta is the call\'s minus one.',
    },
    aggancio: {
      it: '«Hai appena comprato 20 call con delta 0.3. Cosa fai sul titolo?» Vendi 600 azioni. Il trader che sbaglia il segno lo scopre alla prima apertura.',
      en: '"You have just bought 20 calls with delta 0.3. What do you do in the stock?" Sell 600 shares. The trader who gets the sign wrong finds out at the next open.',
    },
    lezione: {
      it: `
<h3>Cos'è il delta</h3>
<p>Il delta dice di quanto cambia il prezzo dell'opzione se il titolo sale di 1. Una call con delta 0.3 guadagna circa 0.30 per ogni euro di rialzo: si comporta come 0.3 azioni. Va da 0 a 1 per le call, da −1 a 0 per le put. At-the-money vale circa 0.5; molto in the money si avvicina a 1, molto out of the money a 0.</p>

<h3>Coprirsi</h3>
<p>Il delta di una posizione si conta in azioni: numero di opzioni × delta × 100 (se ogni contratto è su 100 azioni), con il segno. Per essere neutrale tratti azioni per il valore opposto.</p>
<div class="esempio">lungo 20 call, delta 0.3: +20 × 0.3 × 100 = +600 → vendi 600 azioni<br>lungo 10 put, delta −0.4: −400 → compri 400 azioni</div>

<h3>Call e put</h3>
<p>Dalla parità, call comprata meno put comprata allo stesso strike è un forward, che ha delta 1. Quindi Δcall − Δput = 1: se la call ha delta 0.3, la put ha delta −0.7. Uno straddle (call + put) ha delta 2 × Δcall − 1: vicino a zero at-the-money, ed è per questo che si usa per comprare volatilità senza una direzione.</p>

<h3>Un portafoglio</h3>
<p>Il delta si somma: ogni pezzo con il suo segno. Corto di put con delta negativo vuol dire delta positivo, il punto dove si sbaglia più spesso.</p>

<div class="trappola">Il delta cambia quando il titolo si muove: la copertura di oggi non è quella di domani. Di quanto cambia lo dice il gamma, nel trucco sul break-even.</div>
`,
      en: `
<h3>What delta is</h3>
<p>Delta tells you how much the option's price changes if the stock rises by 1. A call with delta 0.3 gains about 0.30 for every euro the stock goes up: it behaves like 0.3 shares. It runs from 0 to 1 for calls, from −1 to 0 for puts. At the money it is about 0.5; deep in the money it gets close to 1, far out of the money close to 0.</p>

<h3>Hedging</h3>
<p>A position's delta is counted in shares: number of options × delta × 100 (if each contract is on 100 shares), with its sign. To be flat you trade shares for the opposite amount.</p>
<div class="esempio">long 20 calls, delta 0.3: +20 × 0.3 × 100 = +600 → sell 600 shares<br>long 10 puts, delta −0.4: −400 → buy 400 shares</div>

<h3>Calls and puts</h3>
<p>From parity, a long call minus a long put at the same strike is a forward, which has delta 1. So Δcall − Δput = 1: if the call has delta 0.3, the put has delta −0.7. A straddle (call + put) has delta 2 × Δcall − 1: close to zero at the money, which is why it is used to buy volatility without a direction.</p>

<h3>A portfolio</h3>
<p>Delta adds up: each piece with its sign. Short a put with a negative delta means a positive delta, the place where people slip most often.</p>

<div class="trappola">Delta changes when the stock moves: today's hedge is not tomorrow's. How much it changes is what gamma tells you, in the break-even trick.</div>
`,
    },
    scheda: {
      it: 'Delta della posizione = n × delta × 100 con il segno; per coprirti tratti il contrario. Δcall − Δput = 1. Straddle: 2Δcall − 1. Corto di put = delta positivo.',
      en: 'Position delta = n × delta × 100 with its sign; to hedge, trade the opposite. Δcall − Δput = 1. Straddle: 2Δcall − 1. Short puts = positive delta.',
    },
    test: false,
    nomiLivelli: { it: ['Copertura', 'Call, put, straddle', 'Portafoglio'], en: ['Hedging', 'Calls, puts, straddles', 'Portfolio'] },
    livelli: [copertura, callPut, portafoglio],
  });
})();
