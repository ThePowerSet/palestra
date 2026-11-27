(function () {
  'use strict';
  const P = Palestra;
  const F = {
    dadi: P.fonte('crack', 'Question 4.52'),
    fondi: P.fonte('crack', 'Question 4.37'),
    torneo: P.fonte('zhou', '§4.2, "Chess tournament"'),
    poker: P.fonte('zhou', '§4.2, "Poker hands"'),
    lettere: P.fonte('zhou', '§4.2, "Application letters"'),
  };
  const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
  const ridotta = (a, b) => { const g = P.mcd(a, b); return `${a / g}/${b / g}`; };

  // The largest of k dice is exactly m: all at most m, minus all at most m − 1
  function massimoDadi() {
    const k = P.pick([2, 3, 3]), m = P.int(2, 6), num = m ** k - (m - 1) ** k, den = 6 ** k, v = num / den;
    return {
      testo: P.t(`Lanci ${k} dadi. Con che probabilità il numero più alto è esattamente ${m}?`, `You roll ${k} dice. What is the probability that the highest number is exactly ${m}?`),
      nota: P.t('tre decimali, o una frazione', 'three decimals, or a fraction'),
      risposta: P.numero(v, { tol: 0.0015, mostra: ridotta(num, den) }),
      suggerimenti: [
        P.t(`"Il più alto è ${m}" = "tutti al massimo ${m}" meno "tutti al massimo ${m - 1}".`, `"The highest is ${m}" = "all at most ${m}" minus "all at most ${m - 1}".`),
        `(${m}/6)^${k} − (${m - 1}/6)^${k}.`,
      ],
      soluzione: [`(${m ** k} − ${(m - 1) ** k}) / ${den} = ${num}/${den} = ${ridotta(num, den)}`, `≈ ${P.fmt(Math.round(v * 1000) / 1000)}`],
      fonte: F.dadi,
    };
  }

  // "At least one" is 1 minus "none": the two bets of the Chevalier de Méré
  function almenoUno() {
    const dadi = P.chance(0.5), n = dadi ? P.int(2, 6) : P.pick([20, 24, 25, 30]);
    const p = dadi ? 1 / 6 : 1 / 36, v = 1 - (1 - p) ** n;
    return {
      testo: dadi
        ? P.t(`Lanci un dado ${n} volte. Con che probabilità esce almeno un 6?`, `You roll a die ${n} times. What is the probability of at least one 6?`)
        : P.t(`Lanci due dadi ${n} volte. Con che probabilità esce almeno un doppio 6?`, `You roll two dice ${n} times. What is the probability of at least one double 6?`),
      nota: P.t('tre decimali', 'three decimals'),
      risposta: P.numero(v, { tol: 0.0015, mostra: P.fmt(Math.round(v * 1000) / 1000) }),
      suggerimenti: [
        P.t('"Almeno uno" è il contrario di "nessuno", e "nessuno" si moltiplica lancio per lancio.', '"At least one" is the opposite of "none", and "none" multiplies toss by toss.'),
        `1 − (${dadi ? '5/6' : '35/36'})^${n}.`,
      ],
      soluzione: [`(${dadi ? '5/6' : '35/36'})^${n} = ${P.fmt(Math.round((1 - p) ** n * 1000) / 1000)}`, `1 − ${P.fmt(Math.round((1 - p) ** n * 1000) / 1000)} = ${P.fmt(Math.round(v * 1000) / 1000)}`, ...(dadi ? [] : [P.t('con 24 lanci si perde ancora (sotto ½), con 25 si vince', 'with 24 rolls you still lose (below ½), with 25 you win')])],
      fonte: P.fonte('grinstead', 'section 1.1, Example 1.3'),
    };
  }

  // Stars and bars: n identical units into k funds, zeros allowed
  function fondi() {
    const k = P.int(3, 5), n = P.int(5, 20), v = C(n + k - 1, k - 1);
    return {
      testo: P.t(`Devi investire ${P.fmt(n * 1000)} euro in ${k} fondi, a multipli di 1,000 euro (un fondo può restare a zero). In quanti modi diversi puoi farlo?`,
        `You must invest ${P.fmt(n * 1000)} euros across ${k} funds, in multiples of 1,000 euros (a fund may get nothing). In how many different ways can you do it?`),
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`Metti in fila ${n} gettoni da 1,000 e ${k - 1} separatori: ogni disposizione è un modo di dividere.`, `Line up ${n} tokens of 1,000 and ${k - 1} dividers: each arrangement is one way to split.`),
        P.t(`Scegli dove vanno i ${k - 1} separatori fra ${n + k - 1} posti: C(${n + k - 1}, ${k - 1}).`, `Choose where the ${k - 1} dividers go among ${n + k - 1} places: C(${n + k - 1}, ${k - 1}).`),
      ],
      soluzione: [`C(${n + k - 1}, ${k - 1}) = ${P.fmt(v)}`],
      fonte: F.fondi,
    };
  }

  // Knockout with 2^n players, the best always wins: the two best meet in the final if they start in different halves
  function torneo() {
    const n = P.int(2, 6), giocatori = 2 ** n, num = giocatori / 2, den = giocatori - 1;
    return {
      testo: P.t(`Un torneo a eliminazione diretta ha ${giocatori} giocatori, tutti di forza diversa; vince sempre il più forte, e gli accoppiamenti di ogni turno sono a caso. Con che probabilità i due giocatori più forti si incontrano in finale?`,
        `A knockout tournament has ${giocatori} players, all of different strength; the stronger always wins, and each round's pairings are random. What is the probability that the two strongest players meet in the final?`),
      nota: P.t('una frazione o tre decimali', 'a fraction or three decimals'),
      risposta: P.numero(num / den, { tol: 0.0015, mostra: `${num}/${den}` }),
      suggerimenti: [
        P.t('Guarda il tabellone come due metà da cui esce un finalista ciascuna. Il più forte vince la sua metà.', 'See the bracket as two halves, each producing one finalist. The strongest wins his half.'),
        P.t(`Il secondo arriva in finale solo se sta nell'altra metà: ${num} posti su ${den} rimasti.`, `The second reaches the final only if he is in the other half: ${num} places out of the ${den} left.`),
      ],
      soluzione: [`${num} / ${den} ≈ ${P.fmt(Math.round(num / den * 1000) / 1000)}`],
      fonte: F.torneo,
    };
  }

  const MANI = [
    { it: 'un poker (quattro carte uguali)', en: 'four of a kind', n: 624, passi: ['13 × 48'] },
    { it: 'un full (tris più coppia)', en: 'a full house (three of a kind plus a pair)', n: 3744, passi: ['13 × C(4, 3) × 12 × C(4, 2) = 13 × 4 × 12 × 6'] },
    { it: 'una doppia coppia', en: 'two pair', n: 123552, passi: ['C(13, 2) × C(4, 2)² × 44 = 78 × 36 × 44'] },
    { it: 'un tris (e le altre due diverse fra loro)', en: 'three of a kind (the other two different from each other)', n: 54912, passi: ['13 × C(4, 3) × C(12, 2) × 4² = 13 × 4 × 66 × 16'] },
    { it: 'colore (cinque dello stesso seme, scale comprese)', en: 'a flush (five of one suit, straights included)', n: 5148, passi: ['4 × C(13, 5) = 4 × 1,287'] },
  ];
  function poker() {
    const m = P.pick(MANI);
    return {
      testo: P.t(`Su ${P.fmt(2598960)} mani di 5 carte da un mazzo da 52, quante sono ${m.it}?`, `Out of the ${P.fmt(2598960)} five-card hands from a 52-card deck, how many are ${m.en}?`),
      risposta: P.numero(m.n),
      suggerimenti: [
        P.t('Costruisci la mano un passo alla volta: scegli i valori, poi i semi per ogni valore, poi le carte che restano.', 'Build the hand one step at a time: choose the ranks, then the suits for each rank, then the remaining cards.'),
        P.t('Attento all\'ordine: due coppie di valori diversi si scelgono insieme con C(13, 2), non 13 × 12.', 'Mind the order: the two ranks of two pair are chosen together with C(13, 2), not 13 × 12.'),
      ],
      soluzione: [`${m.passi[0]} = ${P.fmt(m.n)}`, P.t(`probabilità ≈ ${P.fmt(m.n / 2598960, 5)}`, `probability ≈ ${P.fmt(m.n / 2598960, 5)}`)],
      fonte: F.poker,
    };
  }

  // No letter in the right envelope: derangements, D(n)/n! → 1/e
  const SCOMPIGLI = { 3: [2, 6], 4: [9, 24], 5: [44, 120], 6: [265, 720] };
  function lettere() {
    const n = P.int(3, 6), [d, f] = SCOMPIGLI[n], v = d / f;
    return {
      testo: P.t(`Hai ${n} lettere di presentazione per ${n} aziende diverse e ${n} buste già intestate. Un bambino mette le lettere nelle buste a caso, una per busta. Con che probabilità nessuna lettera è nella busta giusta?`,
        `You have ${n} cover letters for ${n} different companies and ${n} addressed envelopes. A child puts the letters into the envelopes at random, one per envelope. What is the probability that no letter is in the right envelope?`),
      nota: P.t('tre decimali, o una frazione', 'three decimals, or a fraction'),
      risposta: P.numero(v, { tol: 0.0015, mostra: ridotta(d, f) }),
      suggerimenti: [
        P.t('Inclusione-esclusione: togli i casi con almeno una giusta, rimetti quelli con almeno due, e così via.', 'Inclusion-exclusion: remove the cases with at least one right, add back those with at least two, and so on.'),
        P.t(`P = 1 − 1/1! + 1/2! − 1/3! + … ± 1/${n}!, che si avvicina in fretta a 1/e ≈ 0.368.`, `P = 1 − 1/1! + 1/2! − 1/3! + … ± 1/${n}!, which quickly approaches 1/e ≈ 0.368.`),
      ],
      soluzione: [P.t(`disposizioni senza nessuna lettera giusta: ${d} su ${n}! = ${f}`, `arrangements with no letter right: ${d} out of ${n}! = ${f}`), `${d}/${f} = ${ridotta(d, f)} ≈ ${P.fmt(Math.round(v * 1000) / 1000)}`],
      fonte: F.lettere,
    };
  }

  P.trucco({
    id: 'prob-contare',
    materia: 'probabilita',
    capitolo: 'combinatoria',
    numero: 7,
    titolo: { it: 'Contare i casi', en: 'Counting the cases' },
    sottotitolo: {
      it: 'Dadi, fondi, tornei, mani di poker, lettere nelle buste: scegli bene che cosa contare, poi C(n, k) fa il resto.',
      en: 'Dice, funds, tournaments, poker hands, letters in envelopes: choose well what to count, then C(n, k) does the rest.',
    },
    aggancio: {
      it: '«Quanti modi ci sono di investire 20 mila euro in 5 fondi, a blocchi da mille?» Non si elencano: si mettono in fila gettoni e separatori.',
      en: '"How many ways are there to invest 20 thousand euros in 5 funds, in blocks of a thousand?" You do not list them: you line up tokens and dividers.',
    },
    lezione: {
      it: `
<h3>Contare il complemento, o la differenza</h3>
<p>"Il massimo di tre dadi è esattamente 4" è difficile da contare direttamente, facile come differenza: tutti al massimo 4 (4³) meno tutti al massimo 3 (3³). 64 − 27 = 37 casi su 216.</p>

<h3>Gettoni e separatori</h3>
<p>Dividere n oggetti uguali fra k scatole, anche vuote, è mettere in fila n gettoni e k − 1 separatori: C(n + k − 1, k − 1) modi. 20 blocchi in 5 fondi: C(24, 4) = 10,626.</p>

<h3>Costruire una mano</h3>
<p>Per le mani di poker si sceglie un passo alla volta: i valori, poi i semi, poi il resto. Full: 13 valori per il tris × C(4, 3) semi × 12 valori per la coppia × C(4, 2) = 3,744. L'errore tipico è contare due volte lo stesso insieme scegliendo in ordine due valori che hanno lo stesso ruolo.</p>

<h3>Vedere la struttura</h3>
<p>Nel torneo a eliminazione il più forte vince la sua metà del tabellone; il secondo arriva in finale solo se sta nell'altra: 2^(n−1) posti su 2^n − 1. Nelle lettere a caso, l'inclusione-esclusione dà 1 − 1/1! + 1/2! − …, cioè circa 1/e già con 5 lettere.</p>

<div class="trappola">Prima di moltiplicare chiediti se l'ordine conta. Se due scelte hanno lo stesso ruolo (le due coppie di una doppia coppia), si sceglie con C(n, k), non con n × (n − 1).</div>
`,
      en: `
<h3>Count the complement, or the difference</h3>
<p>"The highest of three dice is exactly 4" is hard to count directly, easy as a difference: all at most 4 (4³) minus all at most 3 (3³). 64 − 27 = 37 cases out of 216.</p>

<h3>Tokens and dividers</h3>
<p>Splitting n identical objects among k boxes, empty ones allowed, is lining up n tokens and k − 1 dividers: C(n + k − 1, k − 1) ways. 20 blocks in 5 funds: C(24, 4) = 10,626.</p>

<h3>Building a hand</h3>
<p>For poker hands you choose one step at a time: ranks, then suits, then the rest. Full house: 13 ranks for the three × C(4, 3) suits × 12 ranks for the pair × C(4, 2) = 3,744. The typical slip is counting the same set twice by choosing, in order, two ranks that play the same role.</p>

<h3>See the structure</h3>
<p>In a knockout the strongest wins his half of the bracket; the second reaches the final only if he is in the other half: 2^(n−1) places out of 2^n − 1. With letters at random, inclusion-exclusion gives 1 − 1/1! + 1/2! − …, about 1/e already with 5 letters.</p>

<div class="trappola">Before multiplying, ask whether order matters. If two choices play the same role (the two pairs of two pair), choose with C(n, k), not n × (n − 1).</div>
`,
    },
    scheda: {
      it: 'Esattamente m = al massimo m − al massimo m − 1. n oggetti in k scatole: C(n + k − 1, k − 1). Torneo da 2^n: i due migliori in finale con 2^(n−1)/(2^n − 1). Full 3,744; poker 624; doppia coppia 123,552. Nessuna lettera giusta: ≈ 1/e.',
      en: 'Exactly m = at most m − at most m − 1. n objects in k boxes: C(n + k − 1, k − 1). Knockout of 2^n: the two best meet in the final with 2^(n−1)/(2^n − 1). Full house 3,744; four of a kind 624; two pair 123,552. No letter right: ≈ 1/e.',
    },
    fonti: [F.dadi, P.fonte('grinstead', 'section 1.1, Example 1.3', { nota: { it: 'le due scommesse del cavaliere de Méré', en: 'the two bets of the Chevalier de Méré' } }), F.fondi, F.torneo, F.poker, F.lettere],
    test: false,
    nomiLivelli: { it: ['Il massimo dei dadi', 'Fondi e tornei', 'Poker e lettere'], en: ['The highest die', 'Funds and tournaments', 'Poker and letters'] },
    livelli: [() => (P.chance(0.6) ? massimoDadi() : almenoUno()), () => (P.chance(0.5) ? fondi() : torneo()), () => (P.chance(0.5) ? poker() : lettere())],
  });
})();
