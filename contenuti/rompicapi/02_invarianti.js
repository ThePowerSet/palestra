(function () {
  'use strict';
  const P = Palestra;
  const F = {
    pallina: P.fonte('zhou', '§2.3, "Last ball"'),
    camaleonti: P.fonte('zhou', '§2.7, "Chameleon colors"'),
    camaleontiW: P.fonte('winkler', '"Chameleons"', { nota: { it: 'lo stesso problema con altri numeri', en: 'the same problem with other numbers' } }),
    scacchiera: P.fonte('crack', 'Question 1.55'),
  };

  // Two balls out, one back: the parity of one colour never changes, so it decides the last ball
  function ultimaPallina() {
    const blu = P.int(10, 30), rosse = P.int(5, 25), regolaA = P.chance(0.5);
    // A: same colour → a blue back, different → a red back (reds keep their parity)
    // B: same colour → a red back, different → a blue back (blues keep their parity)
    const conta = regolaA ? rosse : blu, rossa = regolaA ? conta % 2 === 1 : conta % 2 === 0;
    const regola = regolaA
      ? P.t('se sono dello stesso colore rimetti nel sacchetto una pallina blu, se sono di colori diversi una rossa', 'if they are the same colour you put a blue ball back in the bag, if they are different colours a red one')
      : P.t('se sono dello stesso colore rimetti nel sacchetto una pallina rossa, se sono di colori diversi una blu', 'if they are the same colour you put a red ball back in the bag, if they are different colours a blue one');
    const colore = regolaA ? P.t('rosse', 'red') : P.t('blu', 'blue');
    return {
      testo: P.t(`Un sacchetto ha ${blu} palline blu e ${rosse} rosse. A ogni passo ne togli due a caso e non le rimetti; ${regola}. Le palline di scorta non mancano. Di che colore è l'ultima pallina che resta?`,
        `A bag holds ${blu} blue balls and ${rosse} red ones. At each step you take two at random and keep them out; ${regola}. There are plenty of spare balls. What colour is the last ball left?`),
      risposta: P.scelta([P.t('Rossa', 'Red'), P.t('Blu', 'Blue'), P.t('Dipende dall\'ordine', 'It depends on the order')], rossa ? 0 : 1),
      suggerimenti: [
        P.t('Guarda come cambia il numero delle palline di un colore a ogni passo, nei tre casi possibili.', 'Look at how the number of balls of one colour changes at each step, in the three possible cases.'),
        P.t(`Le ${colore} calano di 2 o restano uguali: la loro parità non cambia mai.`, `The ${colore} balls go down by 2 or stay the same: their parity never changes.`),
      ],
      soluzione: [
        P.t(`all'inizio le ${colore} sono ${conta}, ${conta % 2 ? 'un numero dispari' : 'un numero pari'}`, `at the start there are ${conta} ${colore} balls, an ${conta % 2 ? 'odd' : 'even'} number`),
        P.t(`alla fine resta una pallina sola: le ${colore} sono ${conta % 2 ? '1' : '0'}`, `at the end one ball is left: the ${colore} balls number ${conta % 2 ? '1' : '0'}`),
        P.t(`l'ultima è ${rossa ? 'rossa' : 'blu'}`, `the last one is ${rossa ? 'red' : 'blue'}`),
      ],
      fonte: F.pallina,
    };
  }

  // Chameleons: two of different colours meet and both take the third colour.
  // Every difference between two groups changes by 0 or 3, so it keeps its remainder mod 3.
  function camaleonti() {
    const possibile = P.chance(0.55);
    let c;
    do {
      c = [P.int(6, 30), P.int(6, 30), P.int(6, 30)];
      const r = c.map(x => x % 3), uguali = (r[0] === r[1]) + (r[0] === r[2]) + (r[1] === r[2]);
      if (possibile ? uguali === 1 : uguali === 0) break;
    } while (true);
    const r = c.map(x => x % 3);
    const coppia = r[0] === r[1] ? [0, 1] : r[0] === r[2] ? [0, 2] : [1, 2];
    const terzo = [0, 1, 2].find(i => !coppia.includes(i));
    const nomi = [P.t('rossi', 'red'), P.t('verdi', 'green'), P.t('blu', 'blue')];
    const opz = [P.t('Sì, tutti rossi', 'Yes, all red'), P.t('Sì, tutti verdi', 'Yes, all green'), P.t('Sì, tutti blu', 'Yes, all blue'), P.t('No, mai', 'No, never')];
    return {
      testo: P.t(`Su un'isola vivono ${c[0]} camaleonti rossi, ${c[1]} verdi e ${c[2]} blu. Quando due camaleonti di colori diversi si incontrano, tutti e due prendono il terzo colore. Possono diventare, dopo un po' di incontri, tutti dello stesso colore?`,
        `An island has ${c[0]} red chameleons, ${c[1]} green and ${c[2]} blue. When two chameleons of different colours meet, both take the third colour. Can they all end up, after some meetings, the same colour?`),
      risposta: P.scelta(opz, possibile ? terzo : 3),
      suggerimenti: [
        P.t('Guarda le differenze fra i gruppi, e i loro resti nella divisione per 3.', 'Look at the differences between the groups, and their remainders when divided by 3.'),
        P.t('A ogni incontro due gruppi perdono 1 e il terzo guadagna 2: ogni differenza cambia di 0 o di 3. Perché tutti abbiano un colore, due gruppi devono arrivare a 0 insieme.',
          'At each meeting two groups lose 1 and the third gains 2: every difference changes by 0 or 3. For all to share one colour, two groups must reach 0 together.'),
      ],
      soluzione: [
        P.t(`resti nella divisione per 3: ${c[0]} → ${r[0]}, ${c[1]} → ${r[1]}, ${c[2]} → ${r[2]}`, `remainders when divided by 3: ${c[0]} → ${r[0]}, ${c[1]} → ${r[1]}, ${c[2]} → ${r[2]}`),
        possibile
          ? P.t(`i ${nomi[coppia[0]]} e i ${nomi[coppia[1]]} hanno lo stesso resto: possono sparire insieme, e restano tutti ${nomi[terzo]}`, `the ${nomi[coppia[0]]} and the ${nomi[coppia[1]]} share a remainder: they can vanish together, leaving everyone ${nomi[terzo]}`)
          : P.t('tre resti diversi: nessuna coppia di gruppi può arrivare a 0 insieme', 'three different remainders: no two groups can reach 0 together'),
      ],
      fonte: F.camaleonti,
    };
  }

  // Dominoes on a chessboard with two squares removed: each domino covers one light and one dark square.
  // Same colour removed: impossible. Opposite colours: always possible (Gomory's theorem).
  function scacchiera() {
    const casa = () => [P.int(0, 7), P.int(0, 7)];
    let a, b;
    const stesso = P.chance(0.5);
    do { a = casa(); b = casa(); } while ((a[0] === b[0] && a[1] === b[1]) || (((a[0] + a[1]) % 2 === (b[0] + b[1]) % 2) !== stesso));
    const nome = x => 'abcdefgh'[x[0]] + (x[1] + 1);
    const scura = x => (x[0] + x[1]) % 2 === 0; // a1 is dark
    const col = x => (scura(x) ? P.t('scura', 'dark') : P.t('chiara', 'light'));
    return {
      testo: P.t(`Da una scacchiera 8 × 8 togli le caselle ${nome(a)} e ${nome(b)}. Puoi coprire le 62 caselle rimaste con 31 tessere del domino, ognuna grande due caselle, senza sovrapporle?`,
        `From an 8 × 8 chessboard you remove squares ${nome(a)} and ${nome(b)}. Can you cover the 62 squares left with 31 dominoes, each the size of two squares, without overlaps?`),
      risposta: P.scelta([P.t('Sì', 'Yes'), P.t('No', 'No')], stesso ? 1 : 0),
      suggerimenti: [
        P.t('Pensa ai colori della scacchiera: che cosa copre ogni tessera?', 'Think of the colours of the board: what does each domino cover?'),
        P.t('Ogni tessera copre una casella chiara e una scura. a1 è scura; una casella è scura quando colonna e riga hanno la stessa parità.', 'Each domino covers one light and one dark square. a1 is dark; a square is dark when its column and row have the same parity.'),
      ],
      soluzione: [
        P.t(`${nome(a)} è ${col(a)}, ${nome(b)} è ${col(b)}`, `${nome(a)} is ${col(a)}, ${nome(b)} is ${col(b)}`),
        stesso ? P.t('restano 30 caselle di un colore e 32 dell\'altro: 31 tessere ne coprono 31 per colore, quindi no', 'that leaves 30 squares of one colour and 32 of the other: 31 dominoes cover 31 of each, so no')
          : P.t('colori diversi: sì, sempre (teorema di Gomory: un giro chiuso che passa per tutte le caselle, tolte due di colore diverso, si spezza in due tratti pari da riempire di tessere)', 'different colours: yes, always (Gomory\'s theorem: a closed tour through every square, with two squares of different colours removed, breaks into two even stretches to fill with dominoes)'),
      ],
      fonte: F.scacchiera,
    };
  }

  P.trucco({
    id: 'bt-invarianti',
    materia: 'rompicapi',
    capitolo: 'invarianti',
    numero: 2,
    titolo: { it: 'Cerca quello che non cambia', en: 'Find what never changes' },
    sottotitolo: {
      it: 'Un processo lungo e caotico ha spesso una quantità che resta ferma: una parità, un resto, un colore. Quella decide la fine.',
      en: 'A long, messy process often has one quantity that stays put: a parity, a remainder, a colour. That decides the ending.',
    },
    aggancio: {
      it: '«Togli due palline a caso, ne rimetti una secondo una regola, e vai avanti finché ne resta una. Di che colore è?» Simulare non serve: serve trovare che cosa la regola non può cambiare.',
      en: '"Take two balls at random, put one back by some rule, and go on until one is left. What colour is it?" Simulating does not help: you need what the rule cannot change.',
    },
    lezione: {
      it: `
<h3>Un invariante</h3>
<p>Quando un problema descrive mosse ripetute (togliere palline, far incontrare animali, coprire caselle) e chiede dove si arriva, di solito non va seguito passo per passo. Si cerca una quantità che nessuna mossa cambia: un <em>invariante</em>. Il suo valore all'inizio è il suo valore alla fine.</p>
<div class="esempio">Palline: due dello stesso colore → rimetti una blu; diverse → rimetti una rossa.<br>Le rosse calano di 2 (due rosse) o restano uguali: la loro parità è fissa. 13 rosse all'inizio → l'ultima è rossa.</div>

<h3>Dove cercarlo</h3>
<ul>
<li><b>Parità</b>: conta come cambia ogni gruppo in ogni caso possibile; se cambia sempre di un numero pari, la parità resta.</li>
<li><b>Resti</b>: se una differenza cambia di 0 o di 3, il suo resto nella divisione per 3 è fisso (i camaleonti).</li>
<li><b>Colori</b>: colora la tavola in modo che ogni pezzo copra lo stesso numero di caselle per colore (domino sulla scacchiera).</li>
</ul>

<h3>Per dire di no basta l'invariante, per dire di sì serve una costruzione</h3>
<p>Un invariante dimostra che qualcosa è impossibile. Quando invece la risposta è sì, al colloquio basta indicare come si fa: due gruppi di camaleonti con lo stesso resto si fanno incontrare con il terzo finché scendono insieme a zero.</p>

<div class="trappola">«Dipende dall'ordine» è quasi sempre la risposta sbagliata in questi problemi: se l'intervistatore chiede il risultato di un processo casuale, è perché qualcosa lo fissa.</div>
`,
      en: `
<h3>An invariant</h3>
<p>When a problem describes repeated moves (taking balls out, chameleons meeting, covering squares) and asks where you end up, you usually should not follow it step by step. Look for a quantity no move can change: an <em>invariant</em>. Its value at the start is its value at the end.</p>
<div class="esempio">Balls: two of the same colour → put a blue back; different → put a red back.<br>Reds go down by 2 (two reds) or stay the same: their parity is fixed. 13 reds at the start → the last ball is red.</div>

<h3>Where to look</h3>
<ul>
<li><b>Parity</b>: work out how each group changes in every possible case; if it always changes by an even number, its parity stays.</li>
<li><b>Remainders</b>: if a difference changes by 0 or 3, its remainder when divided by 3 is fixed (the chameleons).</li>
<li><b>Colours</b>: colour the board so that every piece covers the same number of squares of each colour (dominoes on a chessboard).</li>
</ul>

<h3>An invariant can say no; a yes needs a construction</h3>
<p>An invariant proves that something is impossible. When the answer is yes, in an interview it is enough to show how: two groups of chameleons with the same remainder meet the third group until they reach zero together.</p>

<div class="trappola">"It depends on the order" is almost always the wrong answer to these problems: if the interviewer asks for the result of a random process, something is fixing it.</div>
`,
    },
    scheda: {
      it: 'Cerca una quantità che nessuna mossa cambia: parità di un gruppo, resto di una differenza, numero di caselle per colore. Il suo valore iniziale decide la fine. Domino: ogni tessera copre una chiara e una scura.',
      en: 'Look for a quantity no move changes: the parity of a group, the remainder of a difference, the number of squares of each colour. Its starting value decides the end. Dominoes: each covers one light and one dark square.',
    },
    fonti: [F.pallina, F.camaleonti, F.camaleontiW, F.scacchiera],
    test: false,
    nomiLivelli: { it: ['L\'ultima pallina', 'Camaleonti', 'Domino'], en: ['The last ball', 'Chameleons', 'Dominoes'] },
    livelli: [ultimaPallina, camaleonti, scacchiera],
  });
})();
