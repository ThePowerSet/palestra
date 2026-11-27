(function () {
  'use strict';
  const P = Palestra;
  const F = {
    pesante: P.fonte('crack', 'Question 1.52'),
    difettosa: P.fonte('zhou', '§2.2, "Defective ball"'),
    falsa: P.fonte('winkler', '"Finding the Counterfeit"', { nota: { it: 'dodici monete, tre pesate', en: 'twelve coins, three weighings' } }),
    veleno: P.fonte('zhou', '§7.2, "Poisonous wine"'),
    lingotto: P.fonte('crack', 'Question 1.64'),
    uova: P.fonte('zhou', '§2.5, "Glass balls"'),
    uovaW: P.fonte('winkler', '"Testing Ostrich Eggs"', { nota: { it: 'lo stesso problema con le uova', en: 'the same problem with eggs' } }),
  };
  // smallest w with base^w >= n
  const esponente = (base, n) => { let w = 0, p = 1; while (p < n) { p *= base; w++; } return w; };

  function pallinaPesante() {
    const n = P.int(4, 300), w = esponente(3, n);
    return {
      testo: P.t(`Hai ${n} palline identiche all'aspetto; una è un po' più pesante delle altre. Con una bilancia a due piatti, quante pesate ti servono, nel caso peggiore, per trovarla con certezza?`,
        `You have ${n} balls that look identical; one is slightly heavier than the rest. With a two-pan balance, how many weighings do you need, in the worst case, to be sure of finding it?`),
      risposta: P.numero(w),
      suggerimenti: [
        P.t('Una pesata ha tre esiti: pende a sinistra, a destra, sta in equilibrio. Dividi le palline in tre gruppi, non in due.', 'A weighing has three outcomes: left down, right down, balanced. Split the balls into three groups, not two.'),
        P.t(`Con w pesate distingui al massimo 3^w palline: cerca la potenza di 3 che arriva a ${n}.`, `With w weighings you can tell apart at most 3^w balls: find the power of 3 that reaches ${n}.`),
      ],
      soluzione: [
        `3^${w - 1} = ${3 ** (w - 1)} < ${n} ≤ 3^${w} = ${3 ** w}`,
        P.t(`${w} pesate: ogni volta tieni il terzo che contiene la pesante`, `${w} weighings: each time keep the third that holds the heavy one`),
      ],
      fonte: F.pesante,
    };
  }

  function veleno() {
    const n = P.pick([100, 200, 500, 1000, 1500, 3000, 5000]), w = esponente(2, n);
    return {
      testo: P.t(`Un re ha ${P.fmt(n)} bottiglie di vino; una è avvelenata, e il veleno agisce dopo un giorno anche in dose minima. Hai un giorno solo per fare assaggiare il vino a dei volontari, che possono bere da più bottiglie. Quanti volontari ti servono al minimo per trovare la bottiglia avvelenata?`,
        `A king has ${P.fmt(n)} bottles of wine; one is poisoned, and the poison works after one day even in a tiny dose. You have a single day to let volunteers taste the wine, and each may drink from several bottles. What is the fewest volunteers you need to find the poisoned bottle?`),
      risposta: P.numero(w),
      suggerimenti: [
        P.t('Ogni volontario alla fine dà un sì o un no: vivo o no. Quante combinazioni danno w volontari?', 'Each volunteer ends up giving a yes or a no: alive or not. How many combinations do w volunteers give?'),
        P.t(`Numera le bottiglie in binario: il volontario i beve dalle bottiglie con la cifra i uguale a 1. Servono 2^w ≥ ${P.fmt(n)}.`, `Number the bottles in binary: volunteer i drinks from the bottles whose digit i is 1. You need 2^w ≥ ${P.fmt(n)}.`),
      ],
      soluzione: [`2^${w - 1} = ${P.fmt(2 ** (w - 1))} < ${P.fmt(n)} ≤ 2^${w} = ${P.fmt(2 ** w)}`, P.t(`${w} volontari: chi muore scrive in binario il numero della bottiglia`, `${w} volunteers: those who die spell out the bottle's number in binary`)],
      fonte: F.veleno,
    };
  }

  // Paying a worker one share a day out of a bar: pieces 1, 2, 4, … let you give and take back change
  function lingotto() {
    const n = P.int(5, 60), pezzi = esponente(2, n + 1), tagli = pezzi - 1;
    const misure = []; let resto = n;
    for (let i = 0; i < pezzi - 1; i++) { misure.push(2 ** i); resto -= 2 ** i; }
    misure.push(resto);
    return {
      testo: P.t(`Assumi un operaio per ${n} giorni e lo paghi con un lingotto d'oro diviso in ${n} parti uguali: una parte al giorno, alla fine di ogni giorno. Puoi farti restituire pezzi già dati per dare il resto. Quanti tagli devi fare al minimo nel lingotto?`,
        `You hire a worker for ${n} days and pay him with a gold bar marked in ${n} equal parts: one part a day, at the end of each day. You may take back pieces already given to make change. What is the fewest cuts you must make in the bar?`),
      risposta: P.numero(tagli),
      suggerimenti: [
        P.t('Con dei pezzi che puoi dare e riprendere, ogni giorno l\'operaio deve avere una somma diversa: con quali misure copri tutte le somme da 1 a ' + n + '?', 'With pieces you can give and take back, each day the worker must hold a different total: which sizes cover every total from 1 to ' + n + '?'),
        P.t('Pezzi da 1, 2, 4, 8, … fanno ogni somma, come le cifre binarie. Con k pezzi arrivi fino a 2^k − 1.', 'Pieces of 1, 2, 4, 8, … make every total, like binary digits. With k pieces you reach up to 2^k − 1.'),
      ],
      soluzione: [
        P.t(`servono ${pezzi} pezzi (2^${pezzi} − 1 = ${2 ** pezzi - 1} ≥ ${n}), per esempio ${misure.join(' + ')}`, `you need ${pezzi} pieces (2^${pezzi} − 1 = ${2 ** pezzi - 1} ≥ ${n}), for example ${misure.join(' + ')}`),
        P.t(`${pezzi} pezzi = ${tagli} tagli`, `${pezzi} pieces = ${tagli} cuts`),
      ],
      fonte: F.lingotto,
    };
  }

  // One coin is heavier or lighter, and you must also say which: w weighings handle (3^w − 3)/2 coins
  function falsa() {
    const w = P.pick([2, 3, 3, 4]), n = (3 ** w - 3) / 2;
    return {
      testo: P.t(`Fra delle monete identiche all'aspetto una è falsa: può essere più pesante o più leggera, non sai quale. Con una bilancia a due piatti e ${w} pesate, qual è il numero massimo di monete fra cui puoi trovare sempre la falsa e dire se pesa di più o di meno?`,
        `Among some coins that look identical, one is fake: it may be heavier or lighter, you do not know which. With a two-pan balance and ${w} weighings, what is the largest number of coins among which you can always find the fake and say whether it is heavier or lighter?`),
      risposta: P.numero(n),
      suggerimenti: [
        P.t('Conta i casi da distinguere: con n monete sono 2n (ogni moneta, pesante o leggera). Le pesate danno al massimo 3^w esiti.', 'Count the cases to tell apart: with n coins there are 2n (each coin, heavy or light). The weighings give at most 3^w outcomes.'),
        P.t('L\'esito "sempre in equilibrio" non indica nessuna moneta, e nella prima pesata i casi si dividono in modo pari: il massimo è (3^w − 3)/2. Con 3 pesate, 12.', 'The "always balanced" outcome points to no coin, and the first weighing splits the cases evenly: the maximum is (3^w − 3)/2. With 3 weighings, 12.'),
      ],
      soluzione: [`(3^${w} − 3) / 2 = (${3 ** w} − 3) / 2 = ${n}`, P.t(`${n} monete, ${2 * n} casi: ci stanno nei ${3 ** w} esiti con il margine necessario`, `${n} coins, ${2 * n} cases: they fit in the ${3 ** w} outcomes with the margin needed`)],
      fonte: F.difettosa,
    };
  }

  // Two eggs, F floors: with d drops in the worst case you can cover d + (d − 1) + … + 1 floors
  function uova() {
    const f = P.pick([36, 50, 80, 100, 120, 150, 200]);
    let d = 0; while (d * (d + 1) / 2 < f) d++;
    return {
      testo: P.t(`Hai due uova uguali e un palazzo di ${f} piani. Un uovo si rompe se cade da un piano uguale o più alto di un certo piano X, altrimenti resta intero e si può riusare. Qual è il numero minimo di lanci che ti garantisce di trovare X, nel caso peggiore?`,
        `You have two identical eggs and a ${f}-storey building. An egg breaks if dropped from a floor at or above some floor X, otherwise it survives and can be reused. What is the fewest drops that guarantees finding X in the worst case?`),
      risposta: P.numero(d),
      suggerimenti: [
        P.t('Se vuoi al massimo d lanci, il primo uovo parte dal piano d: se si rompe, il secondo prova i piani da 1 a d − 1 uno per uno.', 'If you want at most d drops, the first egg starts at floor d: if it breaks, the second tries floors 1 to d − 1 one by one.'),
        P.t('Se non si rompe, il passo dopo è più corto di uno: d, poi d − 1, … In tutto copri d + (d − 1) + … + 1 = d(d + 1)/2 piani.', 'If it survives, the next jump is one shorter: d, then d − 1, … In all you cover d + (d − 1) + … + 1 = d(d + 1)/2 floors.'),
      ],
      soluzione: [`${d - 1} × ${d} / 2 = ${(d - 1) * d / 2} < ${f} ≤ ${d} × ${d + 1} / 2 = ${d * (d + 1) / 2}`, P.t(`${d} lanci: il primo uovo dai piani ${d}, ${2 * d - 1}, ${3 * d - 3}, …`, `${d} drops: the first egg from floors ${d}, ${2 * d - 1}, ${3 * d - 3}, …`)],
      fonte: F.uova,
    };
  }

  P.trucco({
    id: 'bt-pesate',
    materia: 'rompicapi',
    capitolo: 'informazione',
    numero: 7,
    titolo: { it: 'Quanta informazione dà una prova', en: 'How much a test can tell you' },
    sottotitolo: {
      it: 'Una pesata ha tre esiti, un assaggio due: conta gli esiti possibili e sai il minimo di prove. Palline, veleno, lingotti, uova.',
      en: 'A weighing has three outcomes, a tasting two: count the possible outcomes and you know the fewest tests. Balls, poison, gold bars, eggs.',
    },
    aggancio: {
      it: '«Dodici monete, una è falsa ma non sai se pesa di più o di meno. Tre pesate.» Prima di cercare la sequenza di pesate, conta: quanti casi, quanti esiti.',
      en: '"Twelve coins, one is fake but you do not know if heavier or lighter. Three weighings." Before looking for the sequence of weighings, count: how many cases, how many outcomes.',
    },
    lezione: {
      it: `
<h3>Contare i casi, contare gli esiti</h3>
<p>Ogni prova ha un numero di esiti: una bilancia a due piatti tre (sinistra, destra, equilibrio), un assaggiatore due (vivo, no). Con w prove gli esiti possibili sono al massimo 3^w o 2^w. Se i casi da distinguere sono di più, non basta nessuna strategia; se sono di meno, di solito la strategia c'è.</p>
<div class="esempio">Una pallina più pesante fra 9: 9 casi, 3² = 9 esiti → 2 pesate. Fra 10 ne servono 3.<br>1,000 bottiglie, una avvelenata: 2^10 = 1,024 → 10 assaggiatori.</div>

<h3>Dividere in tre</h3>
<p>Con la bilancia metti un terzo per piatto e un terzo da parte: l'esito dice in quale terzo sta la pesante. Con gli assaggiatori scrivi il numero della bottiglia in binario: l'assaggiatore i beve dove la cifra i è 1, e chi sta male scrive il numero.</p>

<h3>Quando i casi sono di più</h3>
<p>Se la moneta falsa può essere più pesante o più leggera, i casi sono 2n. L'esito «sempre in equilibrio» non indica nessuna moneta, e con w pesate si arriva a (3^w − 3)/2 monete: 12 con tre pesate. Per le uova il vincolo è diverso: con due uova, se il primo si rompe il secondo va usato un piano alla volta, e con d lanci si coprono d(d + 1)/2 piani.</p>

<div class="trappola">Non dividere in due: con la bilancia la metà spreca l'esito «equilibrio». E nel lingotto non servono pezzi uguali: 1, 2, 4, … come le cifre binarie, perché puoi riprendere i pezzi.</div>
`,
      en: `
<h3>Count the cases, count the outcomes</h3>
<p>Every test has a number of outcomes: a two-pan balance three (left, right, balanced), a taster two (alive or not). With w tests there are at most 3^w or 2^w outcomes. If there are more cases to tell apart, no strategy works; if there are fewer, a strategy usually exists.</p>
<div class="esempio">One heavy ball among 9: 9 cases, 3² = 9 outcomes → 2 weighings. Among 10 you need 3.<br>1,000 bottles, one poisoned: 2^10 = 1,024 → 10 tasters.</div>

<h3>Split in three</h3>
<p>With the balance put a third on each pan and a third aside: the outcome says which third holds the heavy one. With tasters write the bottle's number in binary: taster i drinks wherever digit i is 1, and those who fall ill spell out the number.</p>

<h3>When there are more cases</h3>
<p>If the fake coin may be heavier or lighter, there are 2n cases. The "always balanced" outcome points to no coin, and with w weighings you reach (3^w − 3)/2 coins: 12 with three weighings. For eggs the constraint is different: with two eggs, once the first breaks the second must go one floor at a time, and d drops cover d(d + 1)/2 floors.</p>

<div class="trappola">Do not split in two: with a balance, halves waste the "balanced" outcome. And for the gold bar you do not need equal pieces: 1, 2, 4, … like binary digits, because you can take pieces back.</div>
`,
    },
    scheda: {
      it: 'Prove con 3 esiti: 3^w ≥ casi (pallina pesante). Con 2 esiti: 2^w ≥ casi (veleno, in binario). Pesante o leggera: (3^w − 3)/2 monete. Due uova: d(d + 1)/2 ≥ piani. Lingotto: pezzi 1, 2, 4, …, k pezzi coprono 2^k − 1.',
      en: 'Tests with 3 outcomes: 3^w ≥ cases (heavy ball). With 2 outcomes: 2^w ≥ cases (poison, in binary). Heavy or light: (3^w − 3)/2 coins. Two eggs: d(d + 1)/2 ≥ floors. Gold bar: pieces 1, 2, 4, …, k pieces cover 2^k − 1.',
    },
    fonti: [F.pesante, F.difettosa, F.falsa, F.veleno, F.lingotto, F.uova, F.uovaW],
    test: false,
    nomiLivelli: { it: ['La pallina pesante', 'Veleno e lingotto', 'Pesante o leggera, e le uova'], en: ['The heavy ball', 'Poison and gold bar', 'Heavy or light, and the eggs'] },
    livelli: [
      pallinaPesante,
      () => (P.chance(0.5) ? veleno() : lingotto()),
      () => (P.chance(0.45) ? falsa() : uova()),
    ],
  });
})();
