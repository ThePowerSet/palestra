(function () {
  'use strict';
  const P = Palestra;
  const F = {
    passo: P.fonte('crack', 'Question 2.55'),
    nodi: P.fonte('crack', 'Question 2.59'),
  };
  const f2 = x => P.fmt(Math.round(x * 100) / 100);

  // One step, zero rates: the risk-neutral q makes the stock a fair bet, q = (S − D)/(U − D); the real odds do not matter
  function scenario() {
    // moves chosen so that q is a simple fraction: ½, ⅓, ⅔, ¼, ¾, ⅖, ⅗
    const [su, giu] = P.pick([[10, 10], [20, 20], [30, 30], [50, 50], [20, 10], [10, 20], [40, 20], [30, 10], [10, 30], [30, 20], [20, 30]]), S = 100;
    const U = S + su, D = S - giu, q = giu / (su + giu);
    return { S, U, D, q };
  }

  function unPasso() {
    const { S, U, D, q } = scenario();
    const K = P.pick([S, S, S + (U - S) / 2, S - (S - D) / 2]), call = P.chance(0.7);
    const cu = call ? Math.max(U - K, 0) : Math.max(K - U, 0), cd = call ? Math.max(D - K, 0) : Math.max(K - D, 0);
    const v = q * cu + (1 - q) * cd, reale = P.pick([0.6, 0.7, 0.8, 0.9]);
    return {
      testo: P.t(`Tassi a zero, niente dividendi. Un titolo vale ${S}; fra un anno varrà ${U} con probabilità ${P.fmt(reale)} oppure ${D}. Quanto vale oggi una ${call ? 'call' : 'put'} europea a un anno con strike ${K}?`,
        `Zero rates, no dividends. A stock is at ${S}; in a year it will be ${U} with probability ${P.fmt(reale)}, or ${D}. What is a one-year European ${call ? 'call' : 'put'} with strike ${K} worth today?`),
      nota: P.t('due decimali', 'two decimals'),
      risposta: P.numero(v, { tol: 0.011, mostra: f2(v) }),
      suggerimenti: [
        P.t(`La probabilità ${P.fmt(reale)} non serve: l'opzione si replica con azioni e contanti, e il prezzo usa la probabilità q che rende il titolo una scommessa equa.`, `The probability ${P.fmt(reale)} is not needed: the option is replicated with shares and cash, and the price uses the probability q that makes the stock a fair bet.`),
        P.t(`q × ${U} + (1 − q) × ${D} = ${S}, quindi q = (${S} − ${D}) / (${U} − ${D}) = ${P.fmt(q, 4)}.`, `q × ${U} + (1 − q) × ${D} = ${S}, so q = (${S} − ${D}) / (${U} − ${D}) = ${P.fmt(q, 4)}.`),
      ],
      soluzione: [
        P.t(`payoff: ${cu} se sale, ${cd} se scende`, `payoff: ${cu} if it goes up, ${cd} if it goes down`),
        `${P.fmt(q, 4)} × ${cu} + ${P.fmt(1 - q, 4)} × ${cd} = ${f2(v)}`,
      ],
      fonte: F.passo,
    };
  }

  function copertura() {
    const { S, U, D } = scenario(), K = S;
    const cu = U - K, cd = 0, delta = (cu - cd) / (U - D), n = P.pick([1, 10, 100]);
    return {
      testo: P.t(`Titolo a ${S} che fra un anno vale ${U} o ${D}. Hai venduto ${n === 1 ? 'una call' : `${n} call`} at-the-money a un anno. Quante azioni compri per coprirti, in modo che il portafoglio valga lo stesso nei due casi?`,
        `A stock at ${S} that in a year is worth ${U} or ${D}. You have sold ${n === 1 ? 'one' : n} at-the-money one-year call${n === 1 ? '' : 's'}. How many shares do you buy to hedge, so that the portfolio is worth the same in both cases?`),
      nota: P.t('due decimali', 'two decimals'),
      risposta: P.numero(delta * n, { tol: 0.011, mostra: f2(delta * n) }),
      suggerimenti: [
        P.t('Il delta di un albero è il rapporto fra quanto cambia l\'opzione e quanto cambia il titolo fra i due rami.', 'The delta of a tree is how much the option changes over how much the stock changes between the two branches.'),
        `(${cu} − ${cd}) / (${U} − ${D}) = ${P.fmt(delta, 4)}${n > 1 ? P.t(` per call, per ${n}`, ` per call, times ${n}`) : ''}.`,
      ],
      soluzione: [`Δ = ${cu} / ${U - D} = ${P.fmt(delta, 4)}`, `${n} × ${P.fmt(delta, 4)} = ${f2(delta * n)}`, P.t(`controllo: con Δ azioni e −1 call il portafoglio vale ${f2(delta * U - cu)} se sale e ${f2(delta * D)} se scende`, `check: with Δ shares and −1 call the portfolio is worth ${f2(delta * U - cu)} up and ${f2(delta * D)} down`)],
      fonte: F.passo,
    };
  }

  function nodi() {
    const N = P.int(3, 20), ricombina = P.chance(0.6), v = ricombina ? (N + 1) * (N + 2) / 2 : 2 ** (N + 1) - 1;
    return {
      testo: P.t(`Un albero binomiale ha ${N} passi. Quanti nodi ha in tutto, contando la radice, se ${ricombina ? 'ricombina (su-giù porta allo stesso nodo di giù-su)' : 'non ricombina (ogni percorso ha i suoi nodi)'}?`,
        `A binomial tree has ${N} steps. How many nodes does it have in all, counting the root, if it ${ricombina ? 'recombines (up-down reaches the same node as down-up)' : 'does not recombine (every path has its own nodes)'}?`),
      risposta: P.numero(v),
      suggerimenti: ricombina ? [P.t('Al passo k ci sono k + 1 nodi.', 'At step k there are k + 1 nodes.'), `1 + 2 + … + ${N + 1}.`]
        : [P.t('Al passo k ci sono 2^k nodi.', 'At step k there are 2^k nodes.'), `1 + 2 + 4 + … + 2^${N} = 2^${N + 1} − 1.`],
      soluzione: ricombina ? [`(${N} + 1)(${N} + 2) / 2 = ${v}`] : [`2^${N + 1} − 1 = ${P.fmt(v)}`],
      fonte: F.nodi,
    };
  }

  // Two steps of +a or −b each, zero rates: q is the same at every node, so price = E_q[payoff]
  function dueTappe() {
    const S = 100, a = P.pick([10, 20]), b = P.pick([10, 20]), q = b / (a + b);
    const finali = [[S + 2 * a, q * q], [S + a - b, 2 * q * (1 - q)], [S - 2 * b, (1 - q) * (1 - q)]];
    const K = P.pick([S, S + a, S - b, S + 10]);
    const v = finali.reduce((s, [x, p]) => s + p * Math.max(x - K, 0), 0);
    return {
      testo: P.t(`Tassi a zero. Un titolo vale ${S} e ogni sei mesi sale di ${a} o scende di ${b}. Quanto vale oggi una call europea a un anno con strike ${K}?`,
        `Zero rates. A stock is at ${S} and every six months it rises by ${a} or falls by ${b}. What is a one-year European call with strike ${K} worth today?`),
      nota: P.t('due decimali', 'two decimals'),
      risposta: P.numero(v, { tol: 0.011, mostra: f2(v) }),
      suggerimenti: [
        P.t(`A ogni passo q × ${a} = (1 − q) × ${b}: q = ${b}/${a + b}, uguale in ogni nodo.`, `At every step q × ${a} = (1 − q) × ${b}: q = ${b}/${a + b}, the same at every node.`),
        P.t(`Prezzi finali ${S + 2 * a}, ${S + a - b}, ${S - 2 * b} con probabilità q², 2q(1 − q), (1 − q)².`, `Final prices ${S + 2 * a}, ${S + a - b}, ${S - 2 * b} with probabilities q², 2q(1 − q), (1 − q)².`),
      ],
      soluzione: [
        finali.map(([x, p]) => `${P.fmt(p, 4)} × ${Math.max(x - K, 0)}`).join(' + ') + ` = ${f2(v)}`,
      ],
      fonte: F.passo,
    };
  }

  P.trucco({
    id: 'opz-albero',
    materia: 'opzioni',
    capitolo: 'albero',
    numero: 9,
    titolo: { it: 'Un albero a un passo', en: 'A one-step tree' },
    sottotitolo: {
      it: 'Il prezzo di un\'opzione non dipende da quanto è probabile che il titolo salga: si replica, e la replica ha un prezzo solo.',
      en: 'An option\'s price does not depend on how likely the stock is to rise: it is replicated, and the replica has one price.',
    },
    aggancio: {
      it: '«Il titolo è a 100 e fra un anno sarà a 130 con probabilità 80%, altrimenti a 70. Quanto vale la call 110?» Chi usa l\'80% sbaglia: la risposta è 10.',
      en: '"The stock is at 100 and in a year it will be at 130 with 80% probability, otherwise at 70. What is the 110 call worth?" Whoever uses the 80% gets it wrong: the answer is 10.',
    },
    lezione: {
      it: `
<h3>Replicare, non scommettere</h3>
<p>Con due soli esiti possibili, un'opzione si può copiare con Δ azioni e un po' di contanti. Il portafoglio che la copia ha un prezzo oggi, e l'opzione deve costare uguale. La probabilità vera dei due rami non entra mai nel conto.</p>
<div class="esempio">100 → 130 o 70, call 110: paga 20 o 0.<br>Δ = (20 − 0)/(130 − 70) = 1/3; q = (100 − 70)/(130 − 70) = ½; prezzo ½ × 20 = 10.</div>

<h3>La probabilità neutrale al rischio</h3>
<p>Il prezzo si calcola come media dei payoff con la probabilità q che rende il titolo una scommessa equa: q × U + (1 − q) × D = S (a tassi zero). Con più passi additivi uguali, q resta la stessa in ogni nodo e il prezzo è la media dei payoff finali, pesati con la binomiale.</p>

<h3>Quante azioni</h3>
<p>Il delta dell'albero è Δ = (C_su − C_giù)/(U − D): con Δ azioni contro una call venduta, il portafoglio vale lo stesso nei due rami. Quel portafoglio senza rischio è il motivo per cui la probabilità vera non conta.</p>

<div class="trappola">La probabilità reale è un dato messo apposta per distrarre. E con i tassi non a zero, q si trova da q × U + (1 − q) × D = S × (1 + r), e il prezzo va scontato.</div>
`,
      en: `
<h3>Replicate, don't bet</h3>
<p>With only two possible outcomes, an option can be copied with Δ shares and some cash. The portfolio that copies it has a price today, and the option must cost the same. The real probability of the two branches never enters the sum.</p>
<div class="esempio">100 → 130 or 70, 110 call: pays 20 or 0.<br>Δ = (20 − 0)/(130 − 70) = 1/3; q = (100 − 70)/(130 − 70) = ½; price ½ × 20 = 10.</div>

<h3>The risk-neutral probability</h3>
<p>The price is the average payoff under the probability q that makes the stock a fair bet: q × U + (1 − q) × D = S (at zero rates). With several equal additive steps, q is the same at every node and the price is the average of the final payoffs, weighted with the binomial.</p>

<h3>How many shares</h3>
<p>The tree's delta is Δ = (C_up − C_down)/(U − D): with Δ shares against one sold call, the portfolio is worth the same on both branches. That riskless portfolio is why the real probability does not matter.</p>

<div class="trappola">The real probability is there on purpose, to distract. And with non-zero rates, q comes from q × U + (1 − q) × D = S × (1 + r), and the price must be discounted.</div>
`,
    },
    scheda: {
      it: 'q = (S − D)/(U − D) a tassi zero; prezzo = q × payoff su + (1 − q) × payoff giù. La probabilità vera non conta. Δ = (C_su − C_giù)/(U − D). Nodi: (N + 1)(N + 2)/2 se ricombina, 2^(N+1) − 1 se no.',
      en: 'q = (S − D)/(U − D) at zero rates; price = q × payoff up + (1 − q) × payoff down. The real probability does not matter. Δ = (C_up − C_down)/(U − D). Nodes: (N + 1)(N + 2)/2 if it recombines, 2^(N+1) − 1 if not.',
    },
    fonti: [F.passo, F.nodi],
    test: false,
    nomiLivelli: { it: ['Un passo', 'Copertura e nodi', 'Due passi'], en: ['One step', 'Hedge and nodes', 'Two steps'] },
    livelli: [unPasso, () => (P.chance(0.65) ? copertura() : nodi()), dueTappe],
  });
})();
