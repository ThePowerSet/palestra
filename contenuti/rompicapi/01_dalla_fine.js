(function () {
  'use strict';
  const P = Palestra;
  const F = {
    gioco: P.fonte('crack', 'Question 1.19'),
    tigri: P.fonte('zhou', '§2.1, "Tiger and sheep"'),
    pirati: P.fonte('zhou', '§2.1, "Screwy pirates"'),
    duello: P.fonte('winkler', '"Three-Way Duel"'),
    duelloCrack: P.fonte('crack', 'Question 4.23', { nota: { it: 'lo stesso duello con altre mire', en: 'the same duel with other aims' } }),
    carte: P.fonte('crack', 'Question 1.56'),
  };
  const due = x => P.fmt(Math.round(x * 100) / 100);

  // Naming numbers up to a target: the safe numbers are the target minus multiples of k + 1
  function contaAlTraguardo(perde = false) {
    const k = P.int(3, 10);
    let T, r;
    do { T = P.int(25, 100); r = (perde ? T - 1 : T) % (k + 1); } while (r === 0);
    const ultimo = perde ? T - 1 : T;
    return {
      testo: P.t(`Due giocatori dicono numeri a turno. Chi comincia dice un intero da 1 a ${k}; ogni numero dopo deve superare quello appena detto di almeno 1 e al massimo ${k}. ${perde ? `Chi è costretto a dire ${T} perde.` : `Vince chi dice ${T}.`} Cominci tu: quale numero dici per essere sicuro di vincere?`,
        `Two players take turns naming numbers. The first player names a whole number from 1 to ${k}; every number after that must beat the one just named by at least 1 and at most ${k}. ${perde ? `Whoever is forced to name ${T} loses.` : `Whoever names ${T} wins.`} You go first: which number do you name to be sure of winning?`),
      risposta: P.numero(r),
      suggerimenti: [
        perde ? P.t(`Perdere dicendo ${T} è come vincere dicendo ${T - 1}: chi dice ${T - 1} costringe l'altro a dire ${T}.`, `Losing on ${T} is the same as winning on ${T - 1}: whoever names ${T - 1} forces the other to name ${T}.`)
          : P.t(`Parti dalla fine: da quale numero l'altro non arriva a ${T}, ma tu ci arrivi qualunque cosa dica?`, `Start from the end: from which number can the other player not reach ${T}, while you always can, whatever they say?`),
        P.t(`Se dici ${ultimo - (k + 1)}, l'altro arriva al massimo a ${ultimo - 1} e tu chiudi su ${ultimo}. I numeri sicuri scendono di ${k + 1} alla volta.`,
          `If you name ${ultimo - (k + 1)}, the other player gets at most to ${ultimo - 1} and you close on ${ultimo}. The safe numbers go down ${k + 1} at a time.`),
      ],
      soluzione: [
        P.t(`numeri sicuri: ${ultimo}, ${ultimo - (k + 1)}, ${ultimo - 2 * (k + 1)}, … (passo ${k + 1})`, `safe numbers: ${ultimo}, ${ultimo - (k + 1)}, ${ultimo - 2 * (k + 1)}, … (step ${k + 1})`),
        P.t(`il più piccolo è il resto di ${ultimo} diviso ${k + 1}: ${r}`, `the smallest is the remainder of ${ultimo} divided by ${k + 1}: ${r}`),
        P.t(`dopo, a ogni turno aggiungi quanto manca a ${k + 1} rispetto all'aumento appena fatto dall'altro`, `after that, each turn add whatever makes ${k + 1} together with the other player's last increase`),
      ],
      fonte: F.gioco,
    };
  }

  function tigri() {
    const n = P.int(2, 101), mangiata = n % 2 === 1;
    return {
      testo: P.t(`Su un'isola ci sono ${n} tigri e una pecora. Una tigre che mangia la pecora diventa a sua volta una pecora, e può essere mangiata. Le tigri sono perfettamente razionali: vogliono mangiare, ma prima di tutto vogliono sopravvivere; a parte la pecora c'è solo erba. La pecora viene mangiata?`,
        `On an island there are ${n} tigers and one sheep. A tiger that eats the sheep turns into a sheep itself, and can then be eaten. The tigers are perfectly rational: they want to eat, but above all they want to survive; apart from the sheep there is only grass. Does the sheep get eaten?`),
      risposta: P.scelta([P.t('Sì, viene mangiata', 'Yes, it gets eaten'), P.t('No, resta viva', 'No, it survives')], mangiata ? 0 : 1),
      suggerimenti: [
        P.t('Parti da poche tigri: che cosa succede con 1 tigre? Con 2? Con 3?', 'Start with few tigers: what happens with 1 tiger? With 2? With 3?'),
        P.t('Con 1 tigre la pecora è mangiata. Con 2, chi mangia diventa una pecora davanti a 1 tigre: verrebbe mangiato, quindi nessuno mangia. Con 3, chi mangia lascia 2 tigri che non mangeranno: allora mangia.',
          'With 1 tiger the sheep is eaten. With 2, whoever eats becomes a sheep facing 1 tiger and would be eaten, so nobody eats. With 3, whoever eats leaves 2 tigers that will not eat: so one eats.'),
      ],
      soluzione: [
        P.t('dispari: la pecora viene mangiata; pari: resta viva (ogni pasto riporta al caso con una tigre in meno)', 'odd: the sheep is eaten; even: it survives (every meal leads to the case with one tiger fewer)'),
        P.t(`${n} è ${mangiata ? 'dispari' : 'pari'}: ${mangiata ? 'viene mangiata' : 'resta viva'}`, `${n} is ${mangiata ? 'odd' : 'even'}: ${mangiata ? 'it gets eaten' : 'it survives'}`),
      ],
      fonte: F.tigri,
    };
  }

  function pirati() {
    const n = P.int(3, 8), m = P.pick([60, 80, 100, 120, 150, 200, 250, 300, 500]);
    const voti = Math.ceil(n / 2), comprati = voti - 1, tiene = m - comprati;
    return {
      testo: P.t(`${n} pirati, in ordine di anzianità, si dividono ${m} monete d'oro. Il più anziano propone una divisione e tutti votano, lui compreso: se almeno metà dei voti è a favore si fa così, altrimenti lui finisce in mare e propone il successivo. Ogni pirata vuole prima restare vivo, poi avere più monete possibile; a parità di monete preferisce buttare in mare chi propone. Quante monete tiene per sé il più anziano?`,
        `${n} pirates, ranked by seniority, are splitting ${m} gold coins. The most senior proposes a split and everyone votes, him included: if at least half the votes are in favour it goes ahead, otherwise he goes overboard and the next one proposes. Each pirate wants first to stay alive, then as many coins as possible; with the same coins he would rather throw the proposer overboard. How many coins does the most senior keep?`),
      risposta: P.numero(tiene),
      suggerimenti: [
        P.t('Parti da 2 pirati: il più anziano ha già metà dei voti con il suo. Poi 3, poi 4: chi resterebbe a mani vuote nel caso precedente si compra con una moneta.',
          'Start from 2 pirates: the senior one already has half the votes with his own. Then 3, then 4: whoever would get nothing in the case before can be bought with one coin.'),
        P.t(`Con 2 pirati: ${m} a 0. Con 3: il proponente dà 1 moneta a quello che con 2 avrebbe 0 e tiene ${m - 1}. Ogni volta servono abbastanza voti fra chi nel caso precedente avrebbe 0.`,
          `With 2 pirates: ${m} to 0. With 3: the proposer gives 1 coin to the one who would get 0 with 2, and keeps ${m - 1}. Each time, enough votes must come from those who would get 0 in the case before.`),
      ],
      soluzione: [
        P.t(`voti necessari con ${n} pirati: ${voti}, cioè il suo più ${comprati}`, `votes needed with ${n} pirates: ${voti}, that is his own plus ${comprati}`),
        comprati === 1 ? P.t(`compra con 1 moneta il pirata che con ${n - 1} pirati avrebbe 0`, `he buys with 1 coin the pirate who would get 0 with ${n - 1} pirates`)
          : P.t(`compra con 1 moneta ciascuno ${comprati} pirati che con ${n - 1} pirati avrebbero 0`, `he buys with 1 coin each ${comprati} pirates who would get 0 with ${n - 1} pirates`),
        P.t(`tiene ${m} − ${comprati} = ${tiene}`, `he keeps ${m} − ${comprati} = ${tiene}`),
      ],
      fonte: F.pirati,
    };
  }

  // Three-way duel: the weakest shot does best by missing on purpose while both others are alive
  function duello() {
    const [a, at] = P.pick([[1 / 3, '1/3'], [1 / 4, '1/4']]), [b, bt] = P.pick([[1 / 2, '1/2'], [2 / 3, '2/3'], [3 / 4, '3/4']]);
    const D = a / (1 - (1 - a) * (1 - b));           // Anna shoots first in a duel with Bruno
    const aria = b * D + (1 - b) * a;                 // fire in the air: Bruno aims at Carla
    const carla = a * (1 - b) * D + (1 - a) * aria;   // hit Carla: Bruno shoots first at Anna
    const bruno = (1 - a) * aria;                     // hit Bruno: Carla never misses
    const opz = [P.t('Mirare a Carla', 'Aim at Carla'), P.t('Mirare a Bruno', 'Aim at Bruno'), P.t('Sparare in aria', 'Fire into the air'), P.t('È indifferente', 'It makes no difference')];
    return {
      testo: P.t(`Anna, Bruno e Carla fanno un duello a tre. Anna colpisce con probabilità ${at}, Bruno con ${bt}, Carla non sbaglia mai. Sparano a turno, Anna per prima, poi Bruno, poi Carla, finché ne resta uno solo; ognuno spara a chi vuole. Che cosa conviene fare ad Anna con il primo colpo?`,
        `Anna, Bruno and Carla fight a three-way duel. Anna hits with probability ${at}, Bruno with ${bt}, Carla never misses. They shoot in turn, Anna first, then Bruno, then Carla, until only one is left; each shoots at whoever they like. What should Anna do with her first shot?`),
      risposta: P.scelta(opz, 2),
      suggerimenti: [
        P.t('Chiediti con chi resti se colpisci, e chi spara per primo dopo.', 'Ask who you are left with if you hit, and who shoots first after that.'),
        P.t('Se colpisci Carla resti in duello con Bruno e spara lui per primo; se colpisci Bruno, Carla non sbaglia. Finché sono vivi tutti e due, nessuno dei due spara a te.',
          'If you hit Carla you are left in a duel with Bruno and he shoots first; if you hit Bruno, Carla never misses. While both are alive, neither of them shoots at you.'),
      ],
      soluzione: [
        P.t(`in aria: Bruno mira a Carla, e tu resti viva con probabilità ${due(aria)}`, `into the air: Bruno aims at Carla, and you survive with probability ${due(aria)}`),
        P.t(`mirando a Carla: ${due(carla)}; mirando a Bruno: ${due(bruno)}`, `aiming at Carla: ${due(carla)}; aiming at Bruno: ${due(bruno)}`),
        P.t('il più debole guadagna a non togliere di mezzo nessuno: gli altri due si sparano fra loro', 'the weakest gains by removing nobody: the other two shoot at each other'),
      ],
      fonte: F.duello,
    };
  }

  // A deck of r red and b black cards: a red card pays 1, a black one costs 1, stop whenever you like
  function valoreMazzo(R, B) {
    const V = [];
    for (let r = 0; r <= R; r++) {
      V.push([]);
      for (let b = 0; b <= B; b++) {
        if (r === 0) V[r][b] = 0;
        else if (b === 0) V[r][b] = r;
        else V[r][b] = Math.max(0, (r / (r + b)) * (1 + V[r - 1][b]) + (b / (r + b)) * (-1 + V[r][b - 1]));
      }
    }
    return V;
  }
  function carte() {
    const [r, b] = P.pick([[2, 2], [2, 3], [3, 2], [3, 3], [2, 1], [1, 2]]);
    const V = valoreMazzo(r, b), v = V[r][b];
    const pr = r / (r + b), pb = b / (r + b);
    return {
      testo: P.t(`Un mazzo ha ${r} cart${r === 1 ? 'a rossa' : 'e rosse'} e ${b} ner${b === 1 ? 'a' : 'e'}, mescolate. Giri una carta alla volta: per ogni rossa vinci 1 euro, per ogni nera ne paghi 1. Puoi fermarti quando vuoi, anche prima di cominciare. Quanto vale il gioco, giocando al meglio?`,
        `A deck has ${r} red card${r === 1 ? '' : 's'} and ${b} black card${b === 1 ? '' : 's'}, shuffled. You turn one card at a time: every red card wins you 1 euro, every black one costs you 1. You may stop whenever you like, even before starting. What is the game worth, played well?`),
      nota: P.t('in euro, due decimali', 'in euros, two decimals'),
      risposta: P.numero(v, { tol: 0.006, mostra: due(v) }),
      suggerimenti: [
        P.t('Un mazzo vale il massimo fra fermarsi (0) e girare: la media dei due esiti, ciascuno più il valore del mazzo che resta. Parti dai mazzi più piccoli.',
          'A deck is worth the larger of stopping (0) and turning: the average of the two outcomes, each plus the value of the deck that is left. Start from the smallest decks.'),
        P.t('Solo rosse: le giri tutte. Solo nere: ti fermi, vale 0. Una rossa e una nera: ½ × (1 + 0) + ½ × (−1 + 1) = ½.',
          'Only red: you turn them all. Only black: you stop, worth 0. One red and one black: ½ × (1 + 0) + ½ × (−1 + 1) = ½.'),
      ],
      soluzione: [
        P.t(`V(rosse, nere) = max(0, rosse/totale × (1 + V(una rossa in meno)) + nere/totale × (−1 + V(una nera in meno)))`, `V(red, black) = max(0, red/total × (1 + V(one red fewer)) + black/total × (−1 + V(one black fewer)))`),
        `V(${r}, ${b}) = max(0, ${P.fmt(pr, 3)} × (1 + ${due(V[r - 1][b])}) + ${P.fmt(pb, 3)} × (−1 + ${due(V[r][b - 1])}))`,
        `= ${due(v)}`,
      ],
      fonte: F.carte,
    };
  }

  P.trucco({
    id: 'bt-dalla-fine',
    materia: 'rompicapi',
    capitolo: 'strategia',
    numero: 1,
    titolo: { it: 'Parti dalla fine', en: 'Work backwards' },
    sottotitolo: {
      it: 'Nei giochi con un\'ultima mossa la fine è facile: risolvi l\'ultimo passo, poi quello prima. Pirati, tigri, duelli, carte.',
      en: 'In games with a last move the end is easy: solve the last step, then the one before. Pirates, tigers, duels, cards.',
    },
    aggancio: {
      it: '«Diciamo numeri a turno, ognuno aggiunge da 1 a 10, vince chi dice 50. Vuoi cominciare tu?» La risposta si trova solo partendo da 50 e tornando indietro.',
      en: '"We take turns naming numbers, each adding 1 to 10, and whoever says 50 wins. Do you want to go first?" The answer only shows up if you start from 50 and walk back.',
    },
    lezione: {
      it: `
<h3>La fine è il caso più facile</h3>
<p>Quando un gioco ha un'ultima mossa, l'ultima mossa si risolve a occhio. Allora si risolve quella prima, sapendo come finirà; poi quella prima ancora. È l'<em>induzione all'indietro</em>: ogni passo usa il risultato del passo dopo, che è già noto.</p>
<div class="esempio">Si arriva a 21 aggiungendo da 1 a 3. Chi dice 17 vince: l'altro arriva fra 18 e 20, e tu chiudi.<br>Allora chi dice 13 vince, e chi dice 9, 5, 1. Cominci e dici 1.</div>

<h3>Posizioni vincenti e perdenti</h3>
<p>Una posizione è perdente se ogni mossa porta l'altro in una posizione vincente; è vincente se esiste una mossa che lo lascia in una perdente. Nel gioco del contare le posizioni sicure distano sempre k + 1, perché qualunque passo dell'altro (da 1 a k) tu lo completi a k + 1.</p>

<h3>Quando ci sono persone</h3>
<p>Pirati e tigri seguono la stessa logica: risolvi il caso con 1 o 2 giocatori, poi chiedi che cosa cambia aggiungendone uno. Nei pirati, chi propone compra i voti di chi nel caso precedente resterebbe a mani vuote; nelle tigri, conta solo se il numero è pari o dispari. Nel duello a tre ragiona su chi resta dopo ogni colpo: a volte la mossa migliore è non togliere di mezzo nessuno.</p>

<div class="trappola">Non cercare la strategia dall'inizio: con 50 numeri o 5 pirati le possibilità esplodono. Scrivi i casi 1, 2, 3, guarda lo schema, poi controlla che regga un passo dopo.</div>
`,
      en: `
<h3>The end is the easiest case</h3>
<p>When a game has a last move, the last move can be solved at a glance. Then you solve the one before it, knowing how it ends; then the one before that. This is <em>backward induction</em>: each step uses the result of the step after it, which is already known.</p>
<div class="esempio">You reach 21 adding 1 to 3 at a time. Whoever names 17 wins: the other gets to somewhere between 18 and 20, and you close.<br>So whoever names 13 wins, and 9, 5, 1. You go first and name 1.</div>

<h3>Winning and losing positions</h3>
<p>A position is losing if every move hands the other player a winning one; it is winning if some move leaves them in a losing one. In the counting game the safe positions are always k + 1 apart, because whatever step the other takes (1 to k) you top it up to k + 1.</p>

<h3>When there are people</h3>
<p>Pirates and tigers follow the same logic: solve the case with 1 or 2 players, then ask what changes when one more is added. With the pirates, the proposer buys the votes of those who would get nothing in the case before; with the tigers, only whether the number is odd or even matters. In the three-way duel, think about who is left after each shot: sometimes the best move is to remove nobody.</p>

<div class="trappola">Do not look for the strategy from the start: with 50 numbers or 5 pirates the possibilities explode. Write out cases 1, 2, 3, spot the pattern, then check that it holds one step further.</div>
`,
    },
    scheda: {
      it: 'Risolvi l\'ultimo passo, poi quello prima. Gioco del contare: numeri sicuri ogni k + 1, il primo è il resto del traguardo diviso k + 1. Pirati: compri con 1 moneta chi nel caso precedente avrebbe 0. Tigri: dispari mangia, pari no.',
      en: 'Solve the last step, then the one before. Counting game: safe numbers every k + 1, the first is the remainder of the target divided by k + 1. Pirates: buy with 1 coin those who would get 0 in the case before. Tigers: odd eats, even does not.',
    },
    fonti: [F.gioco, F.tigri, F.pirati, F.duello, F.duelloCrack, F.carte],
    test: false,
    nomiLivelli: { it: ['Contare e tigri', 'Pirati e contare al contrario', 'Duelli e carte'], en: ['Counting and tigers', 'Pirates and reverse counting', 'Duels and cards'] },
    livelli: [
      () => (P.chance(0.5) ? contaAlTraguardo() : tigri()),
      () => (P.chance(0.6) ? pirati() : contaAlTraguardo(true)),
      () => (P.chance(0.5) ? duello() : carte()),
    ],
  });
})();
