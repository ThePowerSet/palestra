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
  descrizione: { it: 'Le domande a voce dei colloqui: valore atteso, attese, mercati su dadi e carte.', en: 'The verbal interview questions: expected value, waiting times, markets on dice and cards.' },
  capitoli: [
    { id: 'prob', titolo: { it: 'Valore atteso', en: 'Expected value' } },
  ],
});
