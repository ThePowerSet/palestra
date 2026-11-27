/* Subjects and chapters, in Italian and English. The mental maths chapter ids match the blocks of the
   basic arithmetic generators (js/base.js), so results can be read together. To add a subject: another
   call below, then its tricks in contenuti/<subject>/. */
Palestra.materia({
  id: 'calcolo',
  titolo: { it: 'Calcolo mentale', en: 'Mental maths' },
  descrizione: { it: 'I conti che i test a tempo e i colloqui danno per scontati.', en: 'The calculations timed tests and interviews take for granted.' },
  capitoli: [
    { id: 'fractions', titolo: { it: 'Frazioni e decimali', en: 'Fractions and decimals' } },
    { id: 'percent', titolo: { it: 'Percentuali', en: 'Percentages' } },
    { id: 'mul', titolo: { it: 'Moltiplicazione', en: 'Multiplication' } },
    { id: 'div', titolo: { it: 'Divisione', en: 'Division' } },
    { id: 'add_sub', titolo: { it: 'Somme e controlli', en: 'Sums and checks' } },
    { id: 'powers', titolo: { it: 'Potenze e radici', en: 'Powers and roots' } },
  ],
});

Palestra.materia({
  id: 'desk',
  titolo: { it: 'Numeri da desk', en: 'Desk numbers' },
  descrizione: { it: 'Le stime che un trader di opzioni fa a voce, senza calcolatrice.', en: 'The estimates an options trader makes out loud, without a calculator.' },
  capitoli: [
    { id: 'desk', titolo: { it: 'Volatilità e opzioni', en: 'Volatility and options' } },
    { id: 'book', titolo: { it: 'Il book di negoziazione', en: 'The order book' } },
  ],
});

Palestra.materia({
  id: 'opzioni',
  titolo: { it: 'Opzioni e greche', en: 'Options and Greeks' },
  descrizione: { it: 'Parità, delta, gamma, theta e vega fatti a voce: le domande di un colloquio da market maker.', en: 'Parity, delta, gamma, theta and vega done out loud: the questions of a market-making interview.' },
  capitoli: [
    { id: 'parita', titolo: { it: 'Parità e payoff', en: 'Parity and payoffs' } },
    { id: 'greche', titolo: { it: 'Le greche', en: 'The Greeks' } },
    { id: 'volatilita', titolo: { it: 'Volatilità nel tempo', en: 'Volatility over time' } },
    { id: 'albero', titolo: { it: 'Prezzo senza arbitraggio', en: 'Pricing without arbitrage' } },
  ],
});

Palestra.materia({
  id: 'tassi',
  titolo: { it: 'Tassi e credito', en: 'Rates and credit' },
  descrizione: { it: 'I conti di un desk tassi o credito: quanto si muove un bond, come si copre, cosa dice lo spread di un CDS.', en: 'The sums of a rates or credit desk: how much a bond moves, how it is hedged, what a CDS spread says.' },
  capitoli: [
    { id: 'duration', titolo: { it: 'Duration e DV01', en: 'Duration and DV01' } },
    { id: 'cds', titolo: { it: 'CDS', en: 'CDS' } },
    { id: 'curva', titolo: { it: 'La curva dei tassi', en: 'The yield curve' } },
    { id: 'titoli', titolo: { it: 'Titoli e mercato monetario', en: 'Bills, notes and the money market' } },
    { id: 'futures', titolo: { it: 'Futures', en: 'Futures' } },
  ],
});

Palestra.materia({
  id: 'sequenze',
  titolo: { it: 'Sequenze', en: 'Sequences' },
  descrizione: { it: 'Trovare la regola in pochi secondi, come nei test numerici.', en: 'Finding the rule in a few seconds, as in numerical tests.' },
  capitoli: [
    { id: 'seq', titolo: { it: 'Sequenze di numeri', en: 'Number sequences' } },
  ],
});

Palestra.materia({
  id: 'probabilita',
  titolo: { it: 'Probabilità', en: 'Probability' },
  descrizione: { it: 'Le domande a voce dei colloqui: valore atteso, probabilità condizionata, giochi da giocare al meglio e quanto puntare.', en: 'The verbal interview questions: expected value, conditional probability, games to play well and how much to bet.' },
  capitoli: [
    { id: 'prob', titolo: { it: 'Valore atteso', en: 'Expected value' } },
    { id: 'condizionata', titolo: { it: 'Probabilità condizionata', en: 'Conditional probability' } },
    { id: 'giochi', titolo: { it: 'Giochi e puntate', en: 'Games and bets' } },
    { id: 'attese', titolo: { it: 'Attese e passeggiate a caso', en: 'Waiting times and random walks' } },
    { id: 'continua', titolo: { it: 'Probabilità come area', en: 'Probability as area' } },
    { id: 'combinatoria', titolo: { it: 'Contare i casi', en: 'Counting the cases' } },
  ],
});

Palestra.materia({
  id: 'rompicapi',
  titolo: { it: 'Brain teaser', en: 'Brain teasers' },
  descrizione: {
    it: 'I rompicapi dei colloqui, raggruppati per l\'idea che li apre: partire dalla fine, cercare l\'invariante, prendere il caso peggiore, dividere in tre.',
    en: 'Interview brain teasers, grouped by the idea that cracks them: work backwards, find the invariant, take the worst case, split three ways.',
  },
  intro: {
    it: 'Ogni rompicapo dei colloqui si apre con poche idee che tornano sempre. Qui ogni lezione ne spiega una, poi la allena su problemi classici presi dai libri di preparazione, riscritti con numeri diversi: ogni domanda dice da dove viene. Il giro misto nasconde la tecnica, come al colloquio.',
    en: 'Interview brain teasers open up with a handful of ideas that keep coming back. Here each lesson explains one, then drills it on classic problems from the preparation books, rewritten with different numbers: every question says where it comes from. The mixed round hides the technique, as in an interview.',
  },
  capitoli: [
    { id: 'strategia', titolo: { it: 'Giochi e strategie', en: 'Games and strategy' } },
    { id: 'invarianti', titolo: { it: 'Invarianti e simmetria', en: 'Invariants and symmetry' } },
    { id: 'contare', titolo: { it: 'Contare senza contare', en: 'Counting without counting' } },
    { id: 'informazione', titolo: { it: 'Informazione e tempo', en: 'Information and time' } },
  ],
});
