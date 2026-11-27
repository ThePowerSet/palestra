(function () {
  'use strict';
  const P = Palestra;
  const pc = x => P.pct(Math.round(x * 10000) / 10000);

  function allaPari() {
    const p = P.pick([0.51, 0.52, 0.53, 0.55, 0.56, 0.6, 0.65, 0.7, 0.75]), f = 2 * p - 1;
    return {
      testo: P.t(`Una scommessa alla pari: se vinci incassi quanto hai puntato, se perdi lo perdi. Vinci ${P.il(P.fmt(p * 100))}% delle volte. Che frazione del capitale punti, secondo Kelly?`,
        `An even-money bet: if you win you collect what you staked, if you lose you lose it. You win ${P.fmt(p * 100)}% of the time. What fraction of your bankroll do you bet, by Kelly?`),
      nota: P.t('in percentuale', 'as a percentage'),
      risposta: P.numero(f, { percento: true, rel: 0.01, mostra: pc(f) }),
      suggerimenti: [
        P.t('Alla pari Kelly dice: punta il tuo vantaggio, f = p − q = 2p − 1.', 'At even money Kelly says: bet your edge, f = p − q = 2p − 1.'),
        `${P.fmt(p)} − ${P.fmt(1 - p)}.`,
      ],
      soluzione: [`f = 2 × ${P.fmt(p)} − 1 = ${pc(f)}`],
    };
  }

  function quota() {
    const b = P.pick([2, 3, 4, 5]), p = P.pick([0.25, 0.3, 0.35, 0.4, 0.45, 0.5]), q = 1 - p, f = p - q / b;
    if (f <= 0) return quota();
    return {
      testo: P.t(`Una scommessa paga ${b} a 1: se vinci incassi ${b} volte la puntata, se perdi la perdi. Vinci con probabilità ${P.fmt(p)}. Frazione di Kelly?`,
        `A bet pays ${b} to 1: if you win you collect ${b} times your stake, if you lose you lose it. You win with probability ${P.fmt(p)}. Kelly fraction?`),
      nota: P.t('in percentuale', 'as a percentage'),
      risposta: P.numero(f, { percento: true, rel: 0.01, mostra: pc(f) }),
      suggerimenti: [
        P.t('f = p − q / b: la probabilità di vincere meno quella di perdere divisa per la quota.', 'f = p − q / b: the probability of winning minus the probability of losing divided by the odds.'),
        `${P.fmt(p)} − ${P.fmt(q)} / ${b}.`,
      ],
      soluzione: [`${P.fmt(q)} / ${b} = ${P.fmt(q / b, 4)}`, `f = ${P.fmt(p)} − ${P.fmt(q / b, 4)} = ${pc(f)}`],
    };
  }

  function capitale() {
    if (P.chance(0.35)) {
      const b = P.pick([1, 2, 3]), p = P.pick([0.2, 0.25, 0.3]), e = p * b - (1 - p);
      const opz = [P.t('Niente: il vantaggio è negativo', 'Nothing: the edge is negative'), P.t('Un po\', per diversificare', 'A little, to diversify'), P.t('Metà di Kelly', 'Half Kelly'), P.t('Tutto, se la quota è alta', 'Everything, if the odds are high')];
      const ordine = P.mescola([0, 1, 2, 3]);
      if (e >= 0) return capitale();
      return {
        testo: P.t(`Una scommessa paga ${b} a 1 e vinci con probabilità ${P.fmt(p)}. Quanto punti?`, `A bet pays ${b} to 1 and you win with probability ${P.fmt(p)}. How much do you bet?`),
        risposta: P.scelta(ordine.map(i => opz[i]), ordine.indexOf(0)),
        suggerimenti: [
          P.t('Prima del quanto, il segno: guadagno atteso per 1 puntato = p × b − q.', 'Before how much, the sign: expected profit per 1 staked = p × b − q.'),
          `${P.fmt(p)} × ${b} − ${P.fmt(1 - p)} = ${P.fmt(e)}.`,
        ],
        soluzione: [P.t(`valore atteso: ${P.fmt(e)} per 1 puntato`, `expected value: ${P.fmt(e)} per 1 staked`), P.t('negativo: Kelly dice zero', 'negative: Kelly says zero')],
      };
    }
    const K = P.pick([10000, 20000, 50000, 100000]), b = P.pick([1, 2, 3]), p = b === 1 ? P.pick([0.55, 0.6]) : P.pick([0.4, 0.45, 0.5]);
    const f = p - (1 - p) / b, meta = P.chance(0.4), v = K * f * (meta ? 0.5 : 1);
    if (f <= 0) return capitale();
    return {
      testo: P.t(`Hai ${P.fmt(K)} €. Una scommessa paga ${b} a 1 e vinci con probabilità ${P.fmt(p)}. Quanto punti ${meta ? 'con mezzo Kelly' : 'con Kelly pieno'}?`,
        `You have ${P.fmt(K)} €. A bet pays ${b} to 1 and you win with probability ${P.fmt(p)}. How much do you bet ${meta ? 'at half Kelly' : 'at full Kelly'}?`),
      risposta: P.numero(v, { rel: 0.01, unita: '€', mostra: P.fmt(Math.round(v)) }),
      suggerimenti: [
        P.t('f = p − q / b, poi moltiplica per il capitale' + (meta ? ', e dimezza.' : '.'), 'f = p − q / b, then multiply by the bankroll' + (meta ? ', and halve it.' : '.')),
        `f = ${P.fmt(p)} − ${P.fmt(1 - p)} / ${b} = ${P.fmt(f, 4)}.`,
      ],
      soluzione: [`f = ${pc(f)}`, `${P.fmt(K)} × ${P.fmt(f, 4)}${meta ? ' × 0.5' : ''} = ${P.fmt(Math.round(v))} €`],
    };
  }

  P.trucco({
    id: 'prob-kelly',
    materia: 'probabilita',
    capitolo: 'giochi',
    numero: 4,
    titolo: { it: 'Quanto puntare: Kelly', en: 'How much to bet: Kelly' },
    sottotitolo: {
      it: 'Con un vantaggio, la frazione di capitale che fa crescere di più nel lungo periodo: alla pari è il vantaggio stesso.',
      en: 'With an edge, the fraction of your bankroll that grows it fastest over time: at even money it is the edge itself.',
    },
    aggancio: {
      it: '«Vinci il 60% delle volte, scommessa alla pari. Quanto punti?» Il 20% del capitale. Tutto è troppo, perché una sconfitta ti azzera.',
      en: '"You win 60% of the time, even-money bet. How much do you bet?" 20% of your bankroll. Everything is too much, because one loss wipes you out.',
    },
    lezione: {
      it: `
<h3>Il problema</h3>
<p>Avere un vantaggio non basta: se punti troppo, una serie di sconfitte ti porta a zero; se punti troppo poco, il vantaggio rende poco. Kelly sceglie la frazione f del capitale che massimizza la crescita del capitale nel lungo periodo, cioè il valore atteso del logaritmo.</p>

<h3>La formula</h3>
<p>Una scommessa che paga b a 1 (vinci b volte la puntata, o perdi la puntata), vinta con probabilità p:</p>
<div class="esempio">f = p − q / b,   q = 1 − p<br>alla pari (b = 1): f = p − q = 2p − 1<br>60% alla pari: 20% · 40% a 2 a 1: 0.4 − 0.6/2 = 10%</div>
<p>Si legge come vantaggio diviso per quota: il guadagno atteso per 1 puntato è p × b − q, e diviso per b dà la stessa f.</p>

<h3>Nella pratica</h3>
<p>Le probabilità vere non si conoscono mai: chi stima un vantaggio troppo grande punta troppo, e puntare il doppio di Kelly porta la crescita attesa più o meno a zero. Per questo molti usano mezzo Kelly: si perde poca crescita e si dimezzano le oscillazioni. Se il vantaggio è negativo, Kelly dice di non giocare, qualunque sia la quota.</p>

<div class="trappola">Una quota alta non giustifica una puntata grande: conta il vantaggio. A 3 a 1 con probabilità 0.2 il valore atteso è 0.2 × 3 − 0.8 = −0.2, e la risposta giusta è zero.</div>
`,
      en: `
<h3>The problem</h3>
<p>Having an edge is not enough: bet too much and a losing streak takes you to zero; bet too little and the edge earns little. Kelly picks the fraction f of your bankroll that maximises its long-run growth, that is the expected value of the logarithm.</p>

<h3>The formula</h3>
<p>A bet paying b to 1 (you win b times your stake, or lose the stake), won with probability p:</p>
<div class="esempio">f = p − q / b,   q = 1 − p<br>even money (b = 1): f = p − q = 2p − 1<br>60% at even money: 20% · 40% at 2 to 1: 0.4 − 0.6/2 = 10%</div>
<p>It reads as edge over odds: the expected profit per 1 staked is p × b − q, and dividing by b gives the same f.</p>

<h3>In practice</h3>
<p>True probabilities are never known: whoever overestimates the edge bets too much, and betting twice Kelly brings expected growth down to roughly zero. That is why many use half Kelly: little growth is lost and the swings are halved. If the edge is negative, Kelly says do not play, whatever the odds.</p>

<div class="trappola">High odds do not justify a big bet: the edge does. At 3 to 1 with probability 0.2 the expected value is 0.2 × 3 − 0.8 = −0.2, and the right answer is zero.</div>
`,
    },
    scheda: {
      it: 'Kelly: f = p − q/b (vantaggio / quota). Alla pari: 2p − 1. Vantaggio negativo: zero. Il doppio di Kelly azzera più o meno la crescita attesa; mezzo Kelly è la scelta prudente.',
      en: 'Kelly: f = p − q/b (edge / odds). Even money: 2p − 1. Negative edge: zero. Twice Kelly brings expected growth to roughly zero; half Kelly is the careful choice.',
    },
    test: false,
    nomiLivelli: { it: ['Alla pari', 'Con la quota', 'Capitale e segno'], en: ['Even money', 'With odds', 'Bankroll and sign'] },
    livelli: [allaPari, quota, capitale],
  });
})();
