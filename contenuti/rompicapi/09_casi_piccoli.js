(function () {
  'use strict';
  const P = Palestra;
  const F = {
    cioccolato: P.fonte('zhou', '§2.8, "Chocolate bar problem"'),
    lumaca: P.fonte('crack', 'Question 1.27'),
    ninfee: P.fonte('crack', 'Question 1.24'),
    hanoi: P.fonte('crack', 'Question 1.41'),
    monete: P.fonte('zhou', '§2.8, "Coin split problem"'),
    cammini: P.fonte('crack', 'Question 1.68'),
    teste: P.fonte('winkler', '"Waiting for Heads"'),
  };
  const binom = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };

  function cioccolato() {
    const r = P.int(3, 12), c = P.int(4, 15);
    return {
      testo: P.t(`Una tavoletta di cioccolato ha ${r} righe e ${c} colonne di quadretti. A ogni mossa prendi un pezzo e lo spezzi in due lungo una linea. Quante mosse servono per arrivare a ${r * c} quadretti singoli?`,
        `A chocolate bar has ${r} rows and ${c} columns of squares. Each move takes one piece and breaks it in two along a line. How many moves does it take to end up with ${r * c} single squares?`),
      risposta: P.numero(r * c - 1),
      suggerimenti: [
        P.t('Prova con tavolette piccole: 1 × 2, 2 × 2, 2 × 3. Conta i pezzi prima e dopo ogni mossa.', 'Try small bars: 1 × 2, 2 × 2, 2 × 3. Count the pieces before and after each move.'),
        P.t('Ogni mossa aumenta i pezzi di esattamente uno, comunque spezzi.', 'Every move adds exactly one piece, however you break.'),
      ],
      soluzione: [P.t(`da 1 pezzo a ${r * c} pezzi, uno in più per mossa`, `from 1 piece to ${r * c} pieces, one more per move`), `${r * c} − 1 = ${r * c - 1}`],
      fonte: F.cioccolato,
    };
  }

  function lumaca() {
    let h, su, giu;
    do { h = P.int(8, 40); su = P.int(3, 8); giu = P.int(1, su - 1); } while (h <= su);
    const giorni = Math.ceil((h - su) / (su - giu)) + 1, prima = (giorni - 1) * (su - giu);
    return {
      testo: P.t(`Una lumaca sale su un palo alto ${h} metri: di giorno sale di ${su} metri, di notte scivola giù di ${giu}. Parte dal fondo la mattina del primo giorno. In che giorno arriva in cima?`,
        `A snail climbs a ${h}-metre pole: by day it climbs ${su} metres, by night it slides down ${giu}. It starts at the bottom on the morning of day 1. On which day does it reach the top?`),
      risposta: P.numero(giorni),
      suggerimenti: [
        P.t('Attenzione all\'ultimo giorno: quando arriva in cima non scivola più.', 'Mind the last day: once it reaches the top it does not slide back.'),
        P.t(`Ogni giorno intero guadagna ${su - giu} metri; l'ultimo giorno basta partire da ${h - su} metri o più.`, `Each full day it gains ${su - giu} metres; on the last day it is enough to start from ${h - su} metres or more.`),
      ],
      soluzione: [
        P.t(`deve partire da almeno ${h} − ${su} = ${h - su} m; a ${su - giu} m al giorno servono ${giorni - 1} giorni interi (arriva a ${prima} m)`, `it must start from at least ${h} − ${su} = ${h - su} m; at ${su - giu} m a day that takes ${giorni - 1} full days (it reaches ${prima} m)`),
        P.t(`il giorno ${giorni} sale da ${prima} a ${prima + su} ≥ ${h}`, `on day ${giorni} it climbs from ${prima} to ${prima + su} ≥ ${h}`),
      ],
      fonte: F.lumaca,
    };
  }

  function ninfee() {
    const D = P.int(20, 60), j = P.int(1, 4), k = 2 ** j;
    return {
      testo: P.t(`In uno stagno una ninfea raddoppia la sua superficie ogni giorno; partendo da una sola, copre lo stagno in ${D} giorni. Se parti da ${k} ninfee uguali, in quanti giorni coprono lo stagno?`,
        `In a pond a water lily doubles its area every day; starting from one, it covers the pond in ${D} days. If you start from ${k} identical lilies, how many days do they take to cover the pond?`),
      risposta: P.numero(D - j),
      suggerimenti: [
        P.t('Le ninfee non si dividono il lavoro: guarda la superficie totale, che raddoppia ogni giorno.', 'The lilies do not share out the work: look at the total area, which doubles every day.'),
        P.t(`${k} ninfee sono la superficie che una sola raggiunge dopo ${j} giorn${j === 1 ? 'o' : 'i'}.`, `${k} lilies are the area a single one reaches after ${j} day${j === 1 ? '' : 's'}.`),
      ],
      soluzione: [`${k} = 2^${j}`, `${D} − ${j} = ${D - j}`],
      fonte: F.ninfee,
    };
  }

  function hanoi() {
    const n = P.int(3, 12), m = 2 ** n - 1;
    return {
      testo: P.t(`Una torre di ${n} dischi, dal più grande in basso al più piccolo in alto, va spostata da un piolo a un altro, con un terzo piolo d'appoggio. Si sposta un disco alla volta, e un disco non va mai sopra uno più piccolo. Quante mosse servono al minimo?`,
        `A tower of ${n} discs, from the largest at the bottom to the smallest on top, must move from one peg to another, with a third peg to help. You move one disc at a time, and a disc never goes on top of a smaller one. What is the fewest moves needed?`),
      risposta: P.numero(m),
      suggerimenti: [
        P.t('Per spostare il disco più grande, prima devi spostare tutti gli altri sul piolo d\'appoggio.', 'To move the largest disc, you first have to move all the others onto the spare peg.'),
        P.t('M(n) = 2 M(n − 1) + 1: sposta n − 1, poi il grande, poi di nuovo n − 1. M(1) = 1, M(2) = 3, M(3) = 7: è 2^n − 1.', 'M(n) = 2 M(n − 1) + 1: move n − 1, then the big one, then n − 1 again. M(1) = 1, M(2) = 3, M(3) = 7: it is 2^n − 1.'),
      ],
      soluzione: [`M(n) = 2^n − 1`, `2^${n} − 1 = ${P.fmt(m)}`],
      fonte: F.hanoi,
    };
  }

  // Splitting n coins and adding up x × y at every split always gives n(n − 1)/2
  function monete() {
    const n = P.pick([10, 12, 20, 25, 40, 50, 60, 100, 200, 1000]), v = n * (n - 1) / 2;
    return {
      testo: P.t(`Dividi ${n} monete in due mucchi da x e y monete e scrivi x × y. Poi dividi ogni mucchio ancora in due, scrivendo ogni volta il prodotto, finché restano solo mucchi da una moneta. Quanto fa la somma di tutti i prodotti scritti?`,
        `Split ${n} coins into two piles of x and y coins and write down x × y. Then split each pile in two again, writing the product each time, until only one-coin piles are left. What do all the products written down add up to?`),
      risposta: P.numero(v),
      suggerimenti: [
        P.t('Prova con 2, 3, 4 monete e in modi diversi: la somma cambia?', 'Try 2, 3, 4 coins in different ways: does the sum change?'),
        P.t('2 → 1, 3 → 3, 4 → 6: sono le coppie di monete. Ogni prodotto x × y conta le coppie che quella divisione separa, e ogni coppia viene separata una volta sola.', '2 → 1, 3 → 3, 4 → 6: these are pairs of coins. Each product x × y counts the pairs that split separates, and every pair is separated exactly once.'),
      ],
      soluzione: [P.t('la somma è il numero di coppie di monete: n(n − 1)/2', 'the sum is the number of pairs of coins: n(n − 1)/2'), `${n} × ${n - 1} / 2 = ${P.fmt(v)}`],
      fonte: F.monete,
    };
  }

  function cammini() {
    const a = P.int(2, 6), b = P.int(2, 6), v = binom(a + b, a);
    return {
      testo: P.t(`Su una griglia parti da (0, 0) e arrivi a (${a}, ${b}), facendo ogni volta un passo verso destra o verso l'alto. Quanti percorsi diversi ci sono?`,
        `On a grid you start at (0, 0) and finish at (${a}, ${b}), each step going one unit right or one unit up. How many different paths are there?`),
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`Ogni percorso è una sequenza di ${a + b} passi, di cui ${a} a destra. Quante sequenze così ci sono?`, `Each path is a sequence of ${a + b} steps, ${a} of them to the right. How many such sequences are there?`),
        P.t(`Scegli quali ${a} dei ${a + b} passi vanno a destra: C(${a + b}, ${a}).`, `Choose which ${a} of the ${a + b} steps go right: C(${a + b}, ${a}).`),
      ],
      soluzione: [`C(${a + b}, ${a}) = ${a + b}! / (${a}! × ${b}!) = ${v}`],
      fonte: F.cammini,
    };
  }

  // Waiting for r heads in a row: E(r) = 2 E(r − 1) + 2, so 2, 6, 14, 30, …
  function teste() {
    const r = P.int(2, 6), v = 2 ** (r + 1) - 2;
    return {
      testo: P.t(`Lanci una moneta equa finché escono ${r} teste di fila. Quanti lanci servono in media?`, `You toss a fair coin until ${r} heads come up in a row. How many tosses does it take on average?`),
      risposta: P.numero(v),
      suggerimenti: [
        P.t('Parti da 1 testa: servono 2 lanci in media. Per averne due di fila, prima devi averne una; poi un lancio: testa e hai finito, croce e riparti da zero.', 'Start from 1 head: 2 tosses on average. To get two in a row you first need one; then one toss: heads and you are done, tails and you start from zero.'),
        P.t('E(r) = E(r − 1) + 1 + ½ × E(r), quindi E(r) = 2 E(r − 1) + 2: 2, 6, 14, 30, …', 'E(r) = E(r − 1) + 1 + ½ × E(r), so E(r) = 2 E(r − 1) + 2: 2, 6, 14, 30, …'),
      ],
      soluzione: [P.t('E(1) = 2 e E(r) = 2 E(r − 1) + 2, cioè E(r) = 2^(r+1) − 2', 'E(1) = 2 and E(r) = 2 E(r − 1) + 2, so E(r) = 2^(r+1) − 2'), `2^${r + 1} − 2 = ${v}`],
      fonte: F.teste,
    };
  }

  P.trucco({
    id: 'bt-casi-piccoli',
    materia: 'rompicapi',
    capitolo: 'contare',
    numero: 9,
    titolo: { it: 'Parti dai casi piccoli', en: 'Start from small cases' },
    sottotitolo: {
      it: 'Quando il numero è grande, risolvi per 1, 2, 3, guarda lo schema e trova perché regge: cioccolato, torri, monete, teste di fila.',
      en: 'When the number is big, solve for 1, 2, 3, spot the pattern and find why it holds: chocolate, towers, coins, heads in a row.',
    },
    aggancio: {
      it: '«Dividi mille monete in due mucchi, moltiplica, ripeti fino a mucchi da una. Quanto fa la somma?» Con mille non si vede niente; con 2, 3 e 4 monete lo schema salta fuori.',
      en: '"Split a thousand coins into two piles, multiply, repeat down to one-coin piles. What is the sum?" With a thousand you see nothing; with 2, 3 and 4 coins the pattern jumps out.',
    },
    lezione: {
      it: `
<h3>Rimpicciolisci il problema</h3>
<p>Davanti a 1,000 monete o 64 dischi, la prima mossa è risolvere lo stesso problema con 1, 2, 3. Scrivi i risultati in fila e cerca la regola: differenze costanti, raddoppi, coppie. Poi chiediti perché la regola vale: di solito c'è una frase che la spiega.</p>
<div class="esempio">Monete: 2 → 1, 3 → 3, 4 → 6. Sono le coppie di monete: ogni divisione x × y separa x × y coppie, e ogni coppia si separa una volta sola. 1,000 → 499,500.</div>

<h3>Ricorrenze</h3>
<p>Spesso il caso n si costruisce dal caso n − 1. Torre di dischi: per muovere il grande sposti n − 1 dischi due volte, quindi M(n) = 2M(n − 1) + 1 = 2^n − 1. Teste di fila: per r teste servono r − 1 teste, poi un lancio che chiude o fa ripartire: E(r) = 2E(r − 1) + 2.</p>

<h3>Quello che non cambia a ogni passo</h3>
<p>Spezzare una tavoletta aumenta i pezzi di uno, sempre: da 1 a 48 pezzi servono 47 mosse, comunque si spezzi. Una ninfea che raddoppia ogni giorno, partendo in 8, risparmia 3 raddoppi. La lumaca è il caso al contrario: l'ultimo giorno è diverso dagli altri, e va trattato a parte.</p>

<div class="trappola">Lo schema dei casi piccoli va controllato con un argomento, non solo con un caso in più: 1, 2, 4, 8 può continuare con 16 o con 15. Al colloquio dì la regola e anche perché vale.</div>
`,
      en: `
<h3>Shrink the problem</h3>
<p>Faced with 1,000 coins or 64 discs, the first move is to solve the same problem with 1, 2, 3. Write the results in a row and look for the rule: constant differences, doubling, pairs. Then ask why the rule holds: there is usually a sentence that explains it.</p>
<div class="esempio">Coins: 2 → 1, 3 → 3, 4 → 6. These are pairs of coins: each split x × y separates x × y pairs, and every pair is separated once. 1,000 → 499,500.</div>

<h3>Recurrences</h3>
<p>Often case n is built from case n − 1. Tower of discs: to move the big one you move n − 1 discs twice, so M(n) = 2M(n − 1) + 1 = 2^n − 1. Heads in a row: r heads need r − 1 heads, then one toss that finishes or restarts: E(r) = 2E(r − 1) + 2.</p>

<h3>What every step does</h3>
<p>Breaking a bar adds one piece, always: from 1 to 48 pieces takes 47 moves, however you break it. A lily that doubles every day, starting from 8, saves 3 doublings. The snail is the opposite case: the last day differs from the others and has to be treated on its own.</p>

<div class="trappola">The pattern of the small cases must be backed by an argument, not just one more case: 1, 2, 4, 8 can go on with 16 or with 15. In an interview, give the rule and why it holds.</div>
`,
    },
    scheda: {
      it: 'Risolvi 1, 2, 3, poi trova perché. Cioccolato: pezzi − 1 mosse. Torre: 2^n − 1. Monete divise: n(n − 1)/2. Ninfee: partire da 2^j fa risparmiare j giorni. Lumaca: l\'ultimo giorno non scivola. Cammini: C(a + b, a). r teste di fila: 2^(r+1) − 2.',
      en: 'Solve 1, 2, 3, then find why. Chocolate: pieces − 1 moves. Tower: 2^n − 1. Coin splits: n(n − 1)/2. Lilies: starting with 2^j saves j days. Snail: no slide on the last day. Paths: C(a + b, a). r heads in a row: 2^(r+1) − 2.',
    },
    fonti: [F.cioccolato, F.lumaca, F.ninfee, F.hanoi, F.monete, F.cammini, F.teste],
    test: false,
    nomiLivelli: { it: ['Cioccolato e lumache', 'Ninfee e torri', 'Monete, cammini, teste di fila'], en: ['Chocolate and snails', 'Lilies and towers', 'Coins, paths, heads in a row'] },
    livelli: [
      () => (P.chance(0.5) ? cioccolato() : lumaca()),
      () => (P.chance(0.5) ? ninfee() : hanoi()),
      () => P.pick([monete, cammini, teste])(),
    ],
  });
})();
