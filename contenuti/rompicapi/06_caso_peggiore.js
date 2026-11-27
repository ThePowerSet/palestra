(function () {
  'use strict';
  const P = Palestra;
  const F = {
    calzini: P.fonte('zhou', '§2.6, "Matching socks"'),
    calziniCrack: P.fonte('crack', 'Questions 1.16 and 1.17', { nota: { it: 'due colori, poi N colori', en: 'two colours, then N colours' } }),
    guanti: P.fonte('winkler', '"Shoes, Socks, and Gloves"'),
    paia: P.fonte('crack', 'Question 1.18'),
    generale: P.fonte('zhou', '§2.6, "The Pigeon Hole Principle"', { nota: { it: 'la versione generale, mn + 1', en: 'the general version, mn + 1' } }),
  };
  const COLORI = [['rossi', 'red'], ['gialli', 'yellow'], ['blu', 'blue'], ['verdi', 'green'], ['neri', 'black'], ['bianchi', 'white'], ['grigi', 'grey'], ['viola', 'purple']];
  const elenco = (cc, nn) => cc.map((c, i) => `${nn[i]} ${P.t(c[0], c[1])}`).join(', ');

  function calzini() {
    const k = P.int(2, 6), cc = P.mescola(COLORI).slice(0, k), nn = cc.map(() => P.int(2, 30));
    return {
      testo: P.t(`Nel cassetto ci sono calzini sciolti: ${elenco(cc, nn)}. Al buio non vedi i colori. Quanti calzini devi prendere per essere sicuro di averne due dello stesso colore?`,
        `The drawer holds loose socks: ${elenco(cc, nn)}. In the dark you cannot see colours. How many socks must you take to be sure of two of the same colour?`),
      risposta: P.numero(k + 1),
      suggerimenti: [
        P.t('Pensa al caso più sfortunato: quanti calzini puoi prendere senza avere ancora una coppia?', 'Think of the unluckiest case: how many socks can you take without a pair yet?'),
        P.t(`Al massimo uno per colore: ${k}. Il calzino dopo deve ripetere un colore. Quanti ce ne sono di ogni colore non conta.`, `At most one per colour: ${k}. The next sock must repeat a colour. How many of each there are does not matter.`),
      ],
      soluzione: [P.t(`caso peggiore: uno per colore, ${k} calzini`, `worst case: one of each colour, ${k} socks`), `${k} + 1 = ${k + 1}`],
      fonte: F.calzini,
    };
  }

  // A matching pair of gloves needs the same colour and one left, one right
  function guanti() {
    const a = P.int(3, 12), b = P.int(3, 12);
    return {
      testo: P.t(`Al buio, in un armadio, ci sono ${a} paia di guanti marroni e ${b} paia di guanti beige, tutti mescolati. Quanti guanti devi prendere per essere sicuro di avere un paio che si può indossare: stesso colore, un sinistro e un destro?`,
        `In a dark wardrobe there are ${a} pairs of brown gloves and ${b} pairs of beige gloves, all mixed up. How many gloves must you take to be sure of a pair you can wear: same colour, one left and one right?`),
      risposta: P.numero(a + b + 1),
      suggerimenti: [
        P.t('Caso peggiore: quanti guanti puoi prendere senza avere un sinistro e un destro dello stesso colore?', 'Worst case: how many gloves can you take without a left and a right of the same colour?'),
        P.t(`Per ogni colore puoi prendere solo sinistri, o solo destri: al massimo ${a} marroni e ${b} beige.`, `For each colour you can take only lefts, or only rights: at most ${a} brown and ${b} beige.`),
      ],
      soluzione: [P.t(`caso peggiore: tutti i sinistri (o tutti i destri) di ogni colore, ${a} + ${b} = ${a + b}`, `worst case: all the lefts (or all the rights) of each colour, ${a} + ${b} = ${a + b}`), `${a + b} + 1 = ${a + b + 1}`],
      fonte: F.guanti,
    };
  }

  function coloreScelto() {
    const k = P.int(3, 5), cc = P.mescola(COLORI).slice(0, k), nn = cc.map(() => P.int(3, 20)), x = P.int(0, k - 1);
    const altri = nn.reduce((s, v) => s + v, 0) - nn[x];
    return {
      testo: P.t(`Nel cassetto: ${elenco(cc, nn)}. Al buio, quanti calzini devi prendere per essere sicuro di avere due calzini ${cc[x][0]}?`,
        `The drawer holds: ${elenco(cc, nn)}. In the dark, how many socks must you take to be sure of two ${cc[x][1]} socks?`),
      risposta: P.numero(altri + 2),
      suggerimenti: [
        P.t(`Il caso peggiore è che escano prima tutti quelli che non sono ${cc[x][0]}.`, `The worst case is that every sock that is not ${cc[x][1]} comes out first.`),
        P.t(`Gli altri sono ${altri}; poi servono due ${cc[x][0]}.`, `The others number ${altri}; then you need two ${cc[x][1]} ones.`),
      ],
      soluzione: [P.t(`tutti gli altri: ${altri}`, `all the others: ${altri}`), `${altri} + 2 = ${altri + 2}`],
      fonte: F.calzini,
    };
  }

  // p pairs of any colour with k colours: the worst hand holds p − 1 pairs and one odd sock of every colour
  function piuPaia() {
    const k = P.int(3, 10), p = P.int(2, 5);
    const v = 2 * p + k - 1;
    return {
      testo: P.t(`Nel cassetto ci sono calzini di ${k} colori, almeno 20 per colore. Al buio, quanti calzini devi prendere per essere sicuro di avere ${p} paia (ogni paio dello stesso colore, paia anche di colori diversi)?`,
        `The drawer holds socks in ${k} colours, at least 20 of each. In the dark, how many socks must you take to be sure of ${p} pairs (each pair one colour, different pairs may differ)?`),
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`Qual è la mano più grande con solo ${p - 1} paia? Ogni colore può avere un calzino spaiato.`, `What is the largest hand with only ${p - 1} pairs? Every colour can hold one odd sock.`),
        P.t(`${p - 1} paia sono ${2 * (p - 1)} calzini, più un calzino spaiato per colore: altri ${k}.`, `${p - 1} pairs are ${2 * (p - 1)} socks, plus one odd sock per colour: ${k} more.`),
      ],
      soluzione: [P.t(`caso peggiore: ${2 * (p - 1)} + ${k} = ${2 * (p - 1) + k} calzini con ${p - 1} paia soltanto`, `worst case: ${2 * (p - 1)} + ${k} = ${2 * (p - 1) + k} socks with only ${p - 1} pairs`), `${2 * (p - 1) + k} + 1 = ${v}`],
      fonte: F.paia,
    };
  }

  // m of the same colour: (m − 1) per colour is the worst case, but a colour can run out first
  function stessoColore() {
    const k = P.int(3, 5), m = P.int(3, 6), cc = P.mescola(COLORI).slice(0, k);
    const nn = cc.map(() => (P.chance(0.35) ? P.int(1, m - 1) : P.int(m, 25)));
    if (nn.every(x => x < m)) nn[0] = m + 3;
    const caso = nn.map(x => Math.min(x, m - 1)), peggio = caso.reduce((s, v) => s + v, 0);
    return {
      testo: P.t(`Nel cassetto: ${elenco(cc, nn)}. Al buio, quanti calzini devi prendere per essere sicuro di averne ${m} dello stesso colore?`,
        `The drawer holds: ${elenco(cc, nn)}. In the dark, how many socks must you take to be sure of ${m} of the same colour?`),
      risposta: P.numero(peggio + 1),
      suggerimenti: [
        P.t(`Caso peggiore: da ogni colore prendi al massimo ${m - 1} calzini. Ma da un colore che ne ha meno puoi prenderli tutti, non di più.`, `Worst case: you take at most ${m - 1} socks of each colour. But from a colour with fewer you can take them all, no more.`),
        P.t(`Per ogni colore: il minimo fra quanti ce ne sono e ${m - 1}. Somma, poi aggiungi 1.`, `For each colour: the smaller of how many there are and ${m - 1}. Add them up, then add 1.`),
      ],
      soluzione: [caso.join(' + ') + ` = ${peggio}`, `${peggio} + 1 = ${peggio + 1}`],
      fonte: F.generale,
    };
  }

  P.trucco({
    id: 'bt-caso-peggiore',
    materia: 'rompicapi',
    capitolo: 'contare',
    numero: 6,
    titolo: { it: 'Il caso peggiore', en: 'The worst case' },
    sottotitolo: {
      it: '«Per essere sicuro» vuol dire: immagina la sfortuna massima, poi aggiungi uno. Calzini, guanti, paia: il principio dei cassetti.',
      en: '"To be sure" means: picture the worst possible luck, then add one. Socks, gloves, pairs: the pigeonhole principle.',
    },
    aggancio: {
      it: '«Al buio, quanti calzini prendi per essere sicuro di una coppia?» La domanda è facile; la trappola è quando i colori sono pochi, o le paia sono più di una, o i guanti hanno destra e sinistra.',
      en: '"In the dark, how many socks do you take to be sure of a pair?" The question is easy; the trap is when some colours run short, there is more than one pair, or gloves have a left and a right.',
    },
    lezione: {
      it: `
<h3>Costruisci la mano peggiore</h3>
<p>Quando la domanda dice «per essere sicuro», la risposta è la mano più grande che <em>non</em> soddisfa la richiesta, più uno. Non si calcolano probabilità: si costruisce il caso più sfortunato possibile.</p>
<div class="esempio">Tre colori: la mano peggiore ha un calzino per colore, 3. Il quarto ripete un colore: 4.</div>

<h3>Il principio dei cassetti</h3>
<p>Se metti più di n oggetti in n cassetti, un cassetto ne ha almeno due. Nella versione generale, con mn + 1 oggetti in n cassetti uno ne ha almeno m + 1. Per m calzini dello stesso colore con k colori: (m − 1) × k + 1.</p>

<h3>Quando la mano peggiore è diversa</h3>
<ul>
<li><b>Un colore preciso</b>: la sfortuna è che escano prima tutti gli altri.</li>
<li><b>Colori con pochi calzini</b>: non puoi prenderne m − 1 se ce ne sono meno; prendi quelli che ci sono.</li>
<li><b>Più paia</b>: p − 1 paia più un calzino spaiato per colore.</li>
<li><b>Guanti</b>: tutti i sinistri (o tutti i destri) di ogni colore non formano nessun paio.</li>
</ul>

<div class="trappola">Il numero di calzini per colore conta solo quando è piccolo. Se l'intervistatore dà numeri grandi e diversi per ogni colore, di solito servono solo a distrarre.</div>
`,
      en: `
<h3>Build the worst hand</h3>
<p>When the question says "to be sure", the answer is the largest hand that does <em>not</em> meet the request, plus one. No probabilities: you build the unluckiest case possible.</p>
<div class="esempio">Three colours: the worst hand has one sock of each, 3. The fourth repeats a colour: 4.</div>

<h3>The pigeonhole principle</h3>
<p>Put more than n objects into n boxes and one box holds at least two. In the general version, mn + 1 objects in n boxes put at least m + 1 in one box. For m socks of one colour with k colours: (m − 1) × k + 1.</p>

<h3>When the worst hand looks different</h3>
<ul>
<li><b>One given colour</b>: the bad luck is that all the others come out first.</li>
<li><b>Colours with few socks</b>: you cannot take m − 1 if there are fewer; take the ones there are.</li>
<li><b>Several pairs</b>: p − 1 pairs plus one odd sock of every colour.</li>
<li><b>Gloves</b>: all the lefts (or all the rights) of each colour make no pair at all.</li>
</ul>

<div class="trappola">The number of socks per colour only matters when it is small. When the interviewer gives large, different numbers for each colour, they are usually there to distract.</div>
`,
    },
    scheda: {
      it: '«Sicuro» = mano peggiore + 1. Una coppia con k colori: k + 1. Due di un colore preciso: tutti gli altri + 2. m dello stesso colore: somma di min(calzini del colore, m − 1), + 1. p paia: 2p + k − 1. Guanti: tutti i sinistri + 1.',
      en: '"Sure" = worst hand + 1. A pair with k colours: k + 1. Two of a given colour: all the others + 2. m of one colour: sum of min(socks of that colour, m − 1), + 1. p pairs: 2p + k − 1. Gloves: all the lefts + 1.',
    },
    fonti: [F.calzini, F.calziniCrack, F.guanti, F.paia, F.generale],
    test: false,
    nomiLivelli: { it: ['Una coppia', 'Guanti e un colore preciso', 'Più paia, più calzini'], en: ['One pair', 'Gloves and a given colour', 'More pairs, more socks'] },
    livelli: [
      calzini,
      () => (P.chance(0.5) ? guanti() : coloreScelto()),
      () => (P.chance(0.5) ? piuPaia() : stessoColore()),
    ],
  });
})();
