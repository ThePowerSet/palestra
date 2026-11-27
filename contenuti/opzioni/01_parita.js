(function () {
  'use strict';
  const P = Palestra;
  const f2 = x => P.fmt(x, 2);

  // a strike near the stock, on a grid of 5; prices on a grid of 0.05
  const sottostante = () => {
    const S = P.pick([40, 50, 60, 75, 80, 100, 100, 120, 150, 200]);
    const passo = S >= 100 ? 5 : S >= 50 ? 2.5 : 1;
    const K = S + passo * P.pick([-2, -1, 0, 1, 2]);
    return { S, K };
  };
  const prezzo = (a, b) => P.int(a * 20, b * 20) / 20;

  function senzaTassi() {
    const { S, K } = sottostante();
    const Pp = prezzo(0.5, S / 10), C = Math.round((Pp + S - K) * 100) / 100;
    if (C <= 0.2) return senzaTassi();
    const daCall = P.chance(0.5);
    return {
      testo: daCall
        ? P.t(`Titolo a ${S}, call con strike ${K} a ${f2(C)}. Quanto vale la put con lo stesso strike e la stessa scadenza?`,
          `Stock at ${S}, call with strike ${K} at ${f2(C)}. What is the put with the same strike and expiry worth?`)
        : P.t(`Titolo a ${S}, put con strike ${K} a ${f2(Pp)}. Quanto vale la call con lo stesso strike e la stessa scadenza?`,
          `Stock at ${S}, put with strike ${K} at ${f2(Pp)}. What is the call with the same strike and expiry worth?`),
      nota: P.t('opzioni europee, tassi e dividendi a zero', 'European options, zero rates and dividends'),
      risposta: P.numero(daCall ? Pp : C, { tol: 0.006, mostra: f2(daCall ? Pp : C) }),
      suggerimenti: [
        P.t('Parità: C − P = S − K. Call comprata e put venduta, stesso strike, fanno un forward.', 'Parity: C − P = S − K. A long call and a short put at the same strike make a forward.'),
        P.t(`S − K = ${S} − ${K} = ${P.fmt(S - K)}.`, `S − K = ${S} − ${K} = ${P.fmt(S - K)}.`),
      ],
      soluzione: daCall
        ? [`P = C − (S − K) = ${f2(C)} − (${P.fmt(S - K)}) = ${f2(Pp)}`]
        : [`C = P + (S − K) = ${f2(Pp)} + (${P.fmt(S - K)}) = ${f2(C)}`],
    };
  }

  function alDesk() {
    if (P.chance(0.5)) {
      // where is the forward: K + C − P
      const K = P.pick([50, 100, 100, 200, 400]), F = K + P.pick([-3, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3]) * (K / 100);
      const Pp = prezzo(1, K / 20), C = Math.round((Pp + F - K) * 100) / 100;
      if (C <= 0.2) return alDesk();
      return {
        testo: P.t(`La call strike ${K} costa ${f2(C)}, la put strike ${K} costa ${f2(Pp)}, stessa scadenza. Dove tratta il forward?`,
          `The ${K}-strike call costs ${f2(C)}, the ${K}-strike put costs ${f2(Pp)}, same expiry. Where is the forward trading?`),
        nota: P.t('tassi a zero', 'zero rates'),
        risposta: P.numero(F, { tol: 0.006, mostra: f2(F) }),
        suggerimenti: [
          P.t('Call comprata più put venduta allo stesso strike è un forward comprato a K: C − P = F − K.', 'Long call plus short put at the same strike is a long forward at K: C − P = F − K.'),
          `F = K + C − P = ${K} + ${f2(C)} − ${f2(Pp)}.`,
        ],
        soluzione: [`C − P = ${f2(C - Pp)}`, `F = ${K} + ${f2(C - Pp)} = ${f2(F)}`],
      };
    }
    // with a rate: K is paid at expiry, so it is discounted: C − P = S − K(1 − rT)
    const S = P.pick([50, 80, 100, 100, 120, 200]), K = S, r = P.pick([2, 3, 4, 5, 6]), T = P.pick([[1, P.t('1 anno', '1 year')], [0.5, P.t('6 mesi', '6 months')], [0.25, P.t('3 mesi', '3 months')]]);
    const sconto = K * r / 100 * T[0], C = prezzo(S / 25, S / 8), Pp = C - sconto;
    if (Pp <= 0.2) return alDesk();
    return {
      testo: P.t(`Titolo a ${S}, call at-the-money a ${T[1]} a ${f2(C)}, tasso ${r}%. Quanto vale la put at-the-money?`,
        `Stock at ${S}, at-the-money call expiring in ${T[1]} at ${f2(C)}, rate ${r}%. What is the at-the-money put worth?`),
      nota: P.t('niente dividendi; sconta lo strike con l\'interesse semplice, K × (1 − rT)', 'no dividends; discount the strike with simple interest, K × (1 − rT)'),
      risposta: P.numero(Pp, { tol: 0.006, mostra: f2(Pp) }),
      suggerimenti: [
        P.t('Con un tasso lo strike si paga alla scadenza, quindi vale meno oggi: C − P = S − K(1 − rT). Se l\'opzione è at-the-money S = K, quindi C − P = K × r × T.',
          'With a rate the strike is paid at expiry, so it is worth less today: C − P = S − K(1 − rT). At the money S = K, so C − P = K × r × T.'),
        `K × r × T = ${K} × ${P.fmt(r / 100)} × ${P.fmt(T[0])} = ${f2(sconto)}.`,
      ],
      soluzione: [`C − P = K r T = ${f2(sconto)}`, `P = ${f2(C)} − ${f2(sconto)} = ${f2(Pp)}`],
    };
  }

  function arbitraggio() {
    const { S, K } = sottostante();
    const giusto = S - K, scarto = P.pick([-1, -0.75, -0.5, -0.4, -0.3, 0.3, 0.4, 0.5, 0.75, 1]) * (S >= 100 ? 1 : 0.5);
    const Pp = prezzo(1, S / 12), C = Math.round((Pp + giusto + scarto) * 100) / 100;
    if (C <= 0.2) return arbitraggio();
    const callCara = scarto > 0;
    const testo = P.t(`Titolo a ${S}. Strike ${K}: call ${f2(C)}, put ${f2(Pp)}. Tassi e dividendi a zero.`,
      `Stock at ${S}. Strike ${K}: call ${f2(C)}, put ${f2(Pp)}. Zero rates and dividends.`);
    const passi = [`C − P = ${f2(C - Pp)}`, `S − K = ${P.fmt(giusto)}`,
      callCara ? P.t(`la call è cara di ${f2(scarto)}: vendi call, compra put e titolo (conversion)`, `the call is rich by ${f2(scarto)}: sell the call, buy the put and the stock (conversion)`)
        : P.t(`la call è economica di ${f2(-scarto)}: compra call, vendi put e titolo (reversal)`, `the call is cheap by ${f2(-scarto)}: buy the call, sell the put and the stock (reversal)`)];
    if (P.chance(0.5)) {
      const opzioni = [
        P.t('Vendi la call, compra la put e il titolo', 'Sell the call, buy the put and the stock'),
        P.t('Compra la call, vendi la put e il titolo', 'Buy the call, sell the put and the stock'),
        P.t('Compra la call e la put', 'Buy the call and the put'),
        P.t('Niente: la parità tiene', 'Nothing: parity holds'),
      ];
      const ordine = P.mescola([0, 1, 2, 3]);
      return {
        testo: testo + ' ' + P.t('Che operazione blocca un guadagno senza rischio?', 'Which trade locks in a riskless profit?'),
        risposta: P.scelta(ordine.map(i => opzioni[i]), ordine.indexOf(callCara ? 0 : 1)),
        suggerimenti: [
          P.t('Confronta C − P con S − K: chi è caro si vende, chi è economico si compra.', 'Compare C − P with S − K: sell what is rich, buy what is cheap.'),
          P.t(`C − P = ${f2(C - Pp)}, S − K = ${P.fmt(giusto)}.`, `C − P = ${f2(C - Pp)}, S − K = ${P.fmt(giusto)}.`),
        ],
        soluzione: passi,
      };
    }
    return {
      testo: testo + ' ' + P.t('Quanto guadagni senza rischio per ogni azione, con l\'operazione giusta?', 'How much do you lock in per share, with the right trade?'),
      risposta: P.numero(Math.abs(scarto), { tol: 0.006, mostra: f2(Math.abs(scarto)) }),
      suggerimenti: [
        P.t('Il guadagno è lo scarto dalla parità: |(C − P) − (S − K)|.', 'The profit is the gap from parity: |(C − P) − (S − K)|.'),
        P.t(`C − P = ${f2(C - Pp)}, S − K = ${P.fmt(giusto)}.`, `C − P = ${f2(C - Pp)}, S − K = ${P.fmt(giusto)}.`),
      ],
      soluzione: passi.concat([P.t(`guadagno: ${f2(Math.abs(scarto))} per azione`, `profit: ${f2(Math.abs(scarto))} per share`)]),
    };
  }

  P.trucco({
    id: 'opz-parita',
    materia: 'opzioni',
    capitolo: 'parita',
    numero: 1,
    titolo: { it: 'Parità put-call', en: 'Put-call parity' },
    sottotitolo: {
      it: 'C − P = S − K: dalla call alla put, dove tratta il forward, e quando c\'è un arbitraggio.',
      en: 'C − P = S − K: from the call to the put, where the forward trades, and when there is an arbitrage.',
    },
    aggancio: {
      it: '«La call 100 vale 7, il titolo è a 103. Quanto vale la put 100?» Quattro. E se te la quotano a 5, sai già cosa fare.',
      en: '"The 100 call is worth 7, the stock is at 103. What is the 100 put worth?" Four. And if someone quotes it at 5, you already know what to do.',
    },
    lezione: {
      it: `
<h3>Da dove viene</h3>
<p>Compra una call e vendi una put con lo stesso strike K e la stessa scadenza. A scadenza, se il titolo è sopra K eserciti la call; se è sotto, la put ti viene esercitata contro. In tutti e due i casi compri il titolo a K. Hai costruito un forward comprato a K.</p>
<div class="esempio">call comprata + put venduta = forward comprato a K<br>C − P = S − K   (tassi e dividendi a zero)</div>
<p>Due portafogli con lo stesso payoff devono costare uguale, altrimenti compri il più economico, vendi il più caro e incassi la differenza senza rischio.</p>

<h3>Le tre domande che ne escono</h3>
<ul>
<li><b>Dalla call alla put</b>: P = C − (S − K). Call 100 a 7, titolo a 103: P = 7 − 3 = 4.</li>
<li><b>Dove tratta il forward</b>: F = K + C − P. Se la call 100 costa 6 e la put 100 costa 4, il forward è a 102.</li>
<li><b>Arbitraggio</b>: se C − P è più alto di S − K la call è cara: vendi la call, compra la put e il titolo (una <i>conversion</i>). Se è più basso fai il contrario (una <i>reversal</i>). Il guadagno è lo scarto.</li>
</ul>

<h3>Con un tasso</h3>
<p>Lo strike si paga a scadenza, quindi oggi vale K scontato: C − P = S − K(1 − rT) con l'interesse semplice. At-the-money, S = K, e la differenza diventa K × r × T: con tasso 4% a un anno, la call ATM costa 4 più della put su un titolo a 100. I dividendi fanno il contrario: abbassano il forward e rendono la put più cara.</p>

<div class="trappola">La parità vale per opzioni europee. Con le americane la put si può esercitare prima, e l'uguaglianza diventa una forchetta.</div>
`,
      en: `
<h3>Where it comes from</h3>
<p>Buy a call and sell a put with the same strike K and the same expiry. At expiry, if the stock is above K you exercise the call; if it is below, the put is exercised against you. Either way you buy the stock at K. You have built a long forward at K.</p>
<div class="esempio">long call + short put = long forward at K<br>C − P = S − K   (zero rates and dividends)</div>
<p>Two portfolios with the same payoff must cost the same, otherwise you buy the cheaper one, sell the richer one and pocket the difference without risk.</p>

<h3>The three questions it answers</h3>
<ul>
<li><b>From the call to the put</b>: P = C − (S − K). 100 call at 7, stock at 103: P = 7 − 3 = 4.</li>
<li><b>Where the forward trades</b>: F = K + C − P. If the 100 call costs 6 and the 100 put costs 4, the forward is at 102.</li>
<li><b>Arbitrage</b>: if C − P is above S − K the call is rich: sell the call, buy the put and the stock (a <i>conversion</i>). If it is below, do the opposite (a <i>reversal</i>). The profit is the gap.</li>
</ul>

<h3>With a rate</h3>
<p>The strike is paid at expiry, so today it is worth K discounted: C − P = S − K(1 − rT) with simple interest. At the money, S = K, and the difference becomes K × r × T: with a 4% rate over one year, the ATM call costs 4 more than the put on a stock at 100. Dividends do the opposite: they lower the forward and make the put dearer.</p>

<div class="trappola">Parity holds for European options. With American options the put can be exercised early, and the equality becomes a range.</div>
`,
    },
    scheda: {
      it: 'C − P = S − K (tassi a zero), C − P = S − K(1 − rT) con un tasso. Forward = K + C − P. Call cara rispetto alla parità: vendi call, compra put e titolo; economica: il contrario. Guadagno = scarto.',
      en: 'C − P = S − K (zero rates), C − P = S − K(1 − rT) with a rate. Forward = K + C − P. Call rich against parity: sell the call, buy the put and the stock; cheap: the opposite. Profit = the gap.',
    },
    test: false,
    nomiLivelli: { it: ['Dalla call alla put', 'Forward e tassi', 'Arbitraggio'], en: ['From call to put', 'Forwards and rates', 'Arbitrage'] },
    livelli: [senzaTassi, alDesk, arbitraggio],
  });
})();
