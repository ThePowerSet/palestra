(function () {
  'use strict';
  const P = Palestra;
  const F = {
    mucchi: P.fonte('zhou', '§2.4, "Coin piles"'),
    casino: P.fonte('zhou', '§2.2, "Card game"'),
    lanci: P.fonte('crack', 'Question 4.7'),
    lanciZhou: P.fonte('zhou', '§4.1, "Coin toss game"', { nota: { it: 'lo stesso gioco con n + 1 monete contro n', en: 'the same game with n + 1 coins against n' } }),
    formiche: P.fonte('winkler', '"Falling Ants"'),
    formicheCrack: P.fonte('crack', 'Question 1.23', { nota: { it: 'diecimila formiche su un righello', en: 'ten thousand ants on a ruler' } }),
    aereo: P.fonte('winkler', '"Lost Boarding Pass"'),
    aereoZhou: P.fonte('zhou', '§4.1, "Drunk passenger"', { nota: { it: 'lo stesso problema', en: 'the same problem' } }),
    voti: P.fonte('winkler', '"Leading All the Way"'),
  };
  const tre = x => P.fmt(Math.round(x * 1000) / 1000);

  function mucchi() {
    const n = P.pick([100, 200, 300, 500, 1000]), h = P.int(6, 40);
    return {
      testo: P.t(`Sul tavolo ci sono ${n} monete: ${h} mostrano testa, le altre croce. Sei bendato, puoi girare le monete ma non sentire da che parte stanno. Devi dividerle in due mucchi con lo stesso numero di teste. Quante monete metti nel mucchio più piccolo, prima di girarle tutte?`,
        `There are ${n} coins on the table: ${h} show heads, the rest tails. You are blindfolded: you can flip coins but cannot feel which side is up. You must split them into two piles with the same number of heads. How many coins go in the smaller pile, before you flip all of them?`),
      risposta: P.numero(h),
      suggerimenti: [
        P.t('Prendi un mucchio di k monete a caso: se dentro ci sono x teste, nell\'altro ce ne sono ' + h + ' − x. Che cosa succede alle x se giri tutto il mucchio piccolo?', 'Take a pile of k coins at random: if it holds x heads, the other holds ' + h + ' − x. What happens to the x if you flip the whole small pile?'),
        P.t('Girato, il mucchio piccolo ha k − x teste. Serve k − x = ' + h + ' − x per ogni x.', 'Once flipped, the small pile has k − x heads. You need k − x = ' + h + ' − x whatever x is.'),
      ],
      soluzione: [
        P.t(`metti da parte ${h} monete qualsiasi e girale tutte`, `set aside any ${h} coins and flip them all`),
        P.t(`se fra quelle c'erano x teste, ora ne hanno ${h} − x, come l'altro mucchio`, `if they held x heads, they now hold ${h} − x, like the other pile`),
      ],
      fonte: F.mucchi,
    };
  }

  function casino() {
    const coppie = P.pick([10, 13, 20, 26]), premio = P.pick([50, 100, 200, 500]);
    return {
      testo: P.t(`Un casinò propone un gioco con un mazzo di ${2 * coppie} carte, ${coppie} rosse e ${coppie} nere. Si girano due carte alla volta: se sono tutte e due nere vanno al banco, se sono tutte e due rosse vanno a te, se sono di colori diversi si scartano. Alla fine, se hai più carte del banco vinci ${premio} euro, altrimenti (pareggio compreso) niente. Quanto pagheresti per giocare?`,
        `A casino offers a game with a deck of ${2 * coppie} cards, ${coppie} red and ${coppie} black. Two cards are turned at a time: if both are black they go to the house, if both are red they go to you, if they differ they are thrown away. At the end, if you hold more cards than the house you win ${premio} euros, otherwise (a tie included) nothing. How much would you pay to play?`),
      nota: P.t('in euro', 'in euros'),
      risposta: P.numero(0),
      suggerimenti: [
        P.t('Guarda le coppie scartate: quante rosse e quante nere contengono?', 'Look at the pairs thrown away: how many red and how many black cards do they hold?'),
        P.t(`Ogni coppia scartata ha una rossa e una nera. Le rosse che restano sono quindi tante quante le nere che restano.`, `Every discarded pair has one red and one black. So the reds left over equal the blacks left over.`),
      ],
      soluzione: [
        P.t(`le carte tue = ${coppie} − rosse scartate; quelle del banco = ${coppie} − nere scartate, cioè lo stesso numero`, `your cards = ${coppie} − reds thrown away; the house's = ${coppie} − blacks thrown away, the same number`),
        P.t('finisce sempre pari: non vinci mai, il gioco vale 0', 'it always ends in a tie: you never win, the game is worth 0'),
      ],
      fonte: F.casino,
    };
  }

  function lanci() {
    const n = P.int(3, 12);
    return {
      testo: P.t(`Tu lanci ${n + 1} monete, io ne lancio ${n}. Vinci se ottieni strettamente più teste di me. Qual è la probabilità che vinca tu?`,
        `You toss ${n + 1} coins, I toss ${n}. You win if you get strictly more heads than me. What is the probability that you win?`),
      risposta: P.numero(0.5, { percento: true, mostra: '1/2' }),
      suggerimenti: [
        P.t(`Metti da parte la tua ultima moneta e confronta prima ${n} monete contro ${n}.`, `Set your last coin aside and first compare ${n} coins against ${n}.`),
        P.t(`Con ${n} contro ${n}: o hai più teste, o meno, o lo stesso numero; più e meno hanno la stessa probabilità. Poi l'ultima moneta decide solo il pareggio.`, `With ${n} against ${n}: you have more heads, fewer, or the same; more and fewer are equally likely. Then the last coin only settles the tie.`),
      ],
      soluzione: [
        P.t('chiama p la probabilità di avere più teste con le prime monete; anche "meno" ha probabilità p, il pareggio 1 − 2p', 'call p the chance of more heads with the first coins; "fewer" also has chance p, a tie 1 − 2p'),
        P.t('vinci se eri avanti (p) o se eri pari e l\'ultima è testa: p + (1 − 2p)/2 = 1/2', 'you win if you were ahead (p) or tied and the last is heads: p + (1 − 2p)/2 = 1/2'),
      ],
      fonte: F.lanci,
    };
  }

  // Ants that bounce off each other behave like ants that walk through each other
  function formiche() {
    const L = P.pick([50, 80, 100, 120, 150, 200]), v = P.pick([1, 2, 4, 5]), n = P.pick([12, 24, 50, 100]);
    const t = L / v;
    return {
      testo: P.t(`${n} formiche sono messe a caso su un'asta lunga ${L} cm, ognuna rivolta a destra o a sinistra. Al via camminano a ${v} cm al secondo; quando due si scontrano, invertono tutte e due la direzione. Dopo quanti secondi sei certo che siano tutte cadute dall'asta?`,
        `${n} ants are placed at random on a ${L} cm rod, each facing left or right. At the signal they walk at ${v} cm per second; when two collide, both turn around. After how many seconds are you sure they have all fallen off?`),
      nota: P.t('in secondi, nel caso peggiore', 'in seconds, in the worst case'),
      risposta: P.numero(t),
      suggerimenti: [
        P.t('Le formiche sono tutte uguali: uno scontro con inversione si vede come due formiche che si passano attraverso.', 'The ants all look the same: a collision with a turn looks like two ants walking through each other.'),
        P.t(`Allora ogni "formica" va dritta fino in fondo. La più lenta a uscire è al massimo ${L} cm dal bordo verso cui cammina.`, `Then each "ant" walks straight to the end. The slowest to leave is at most ${L} cm from the end it walks towards.`),
      ],
      soluzione: [
        P.t('scambiare le etichette dopo ogni scontro non cambia le posizioni: si può pensare che si attraversino', 'swapping labels after each collision does not change the positions: think of them as passing through'),
        P.t(`la più lontana ha ${L} cm da fare: ${L} / ${v} = ${P.fmt(t)} secondi`, `the farthest has ${L} cm to go: ${L} / ${v} = ${P.fmt(t)} seconds`),
      ],
      fonte: F.formiche,
    };
  }

  // Lost boarding pass: everything is decided the moment someone takes seat 1 or the seat in question
  function aereo() {
    const n = P.pick([50, 80, 100, 120, 150, 200]);
    const ultimo = P.chance(0.45);
    const k = ultimo ? n : n - P.int(1, 5), v = (n - k + 1) / (n - k + 2);
    const chi = ultimo ? P.t('l\'ultimo passeggero', 'the last passenger') : P.t(`il passeggero numero ${k}`, `passenger number ${k}`);
    return {
      testo: P.t(`${n} passeggeri salgono in ordine su un aereo da ${n} posti, ognuno con il suo posto assegnato. Il primo ha perso la carta d'imbarco e si siede a caso. Ogni passeggero dopo di lui prende il suo posto se è libero, altrimenti uno a caso fra quelli liberi. Con che probabilità ${chi} trova libero il suo posto?`,
        `${n} passengers board in order a plane with ${n} seats, each with an assigned seat. The first has lost his boarding pass and sits at random. Each passenger after him takes his own seat if it is free, otherwise a random free one. What is the probability that ${chi} finds his own seat free?`),
      nota: P.t('una frazione o tre decimali', 'a fraction or three decimals'),
      risposta: P.numero(v, { tol: 0.0006, mostra: `${n - k + 1}/${n - k + 2}` }),
      suggerimenti: [
        P.t('Chi si siede a caso sceglie fra posti tutti uguali per lui. Il gioco si chiude quando qualcuno occupa il posto 1 (tutti gli altri trovano il loro) o il posto in questione.', 'Whoever sits at random picks among seats that all look alike to them. The game is settled when someone takes seat 1 (everyone else then finds their own) or the seat in question.'),
        ultimo ? P.t('Per l\'ultimo i due posti decisivi sono il suo e il posto 1, e ogni scelta a caso li tratta allo stesso modo.', 'For the last passenger the two seats that matter are his own and seat 1, and every random choice treats them alike.')
          : P.t(`Quando arriva il passeggero ${k}, chi ha scelto a caso finora ha trattato allo stesso modo il posto 1 e i posti da ${k} a ${n}: ${n - k + 2} posti in tutto.`, `By the time passenger ${k} boards, every random choice so far has treated seat 1 and seats ${k} to ${n} alike: ${n - k + 2} seats in all.`),
      ],
      soluzione: ultimo ? [
        P.t('il posto 1 e il posto dell\'ultimo sono simmetrici: chi sceglie a caso non li distingue', 'seat 1 and the last passenger\'s seat are symmetric: random choices cannot tell them apart'),
        P.t('quando uno dei due viene occupato tutto è deciso, con la stessa probabilità: 1/2', 'when one of the two is taken everything is settled, with equal chances: 1/2'),
      ] : [
        P.t(`i posti 1, ${k}, ${k + 1}, …, ${n} sono simmetrici per chi sceglie a caso prima di ${k}`, `seats 1, ${k}, ${k + 1}, …, ${n} are symmetric for every random choice before ${k}`),
        P.t(`il primo di questi ${n - k + 2} posti a essere occupato decide: se è il posto ${k}, perdi (1 su ${n - k + 2})`, `the first of these ${n - k + 2} seats to be taken decides: if it is seat ${k}, you lose (1 in ${n - k + 2})`),
        `1 − 1/${n - k + 2} = ${n - k + 1}/${n - k + 2} ≈ ${tre(v)}`,
      ],
      fonte: F.aereo,
    };
  }

  // Ballot theorem: the winner leads all the way with probability (a − b)/(a + b)
  function voti() {
    const b = P.int(20, 120), a = b + P.pick([2, 4, 5, 6, 8, 10, 12, 20]), v = (a - b) / (a + b);
    return {
      testo: P.t(`In un'elezione Anna prende ${a} voti e Bruno ${b}. Le schede vengono contate in ordine casuale. Con che probabilità Anna è in vantaggio dal primo voto contato fino all'ultimo?`,
        `In an election Anna gets ${a} votes and Bruno ${b}. The ballots are counted in random order. What is the probability that Anna is ahead from the first vote counted to the last?`),
      nota: P.t('una frazione o tre decimali', 'a fraction or three decimals'),
      risposta: P.numero(v, { tol: 0.0006, mostra: `${a - b}/${a + b}` }),
      suggerimenti: [
        P.t('Il primo voto deve essere di Anna. Conta gli spogli "cattivi" che partono da Anna ma la raggiungono in parità: ribaltando il tratto fino al primo pareggio diventano spogli che partono da Bruno.', 'The first vote must be Anna\'s. Count the "bad" counts that start with Anna but reach a tie: flipping the stretch up to the first tie turns them into counts that start with Bruno.'),
        P.t(`Quindi gli spogli cattivi che partono da Anna sono tanti quanti quelli che partono da Bruno: probabilità ${b}/${a + b} ciascuno.`, `So the bad counts starting with Anna are as many as those starting with Bruno: probability ${b}/${a + b} each.`),
      ],
      soluzione: [
        P.t(`spogli che partono da Bruno: ${b}/${a + b}; spogli che partono da Anna ma pareggiano: altrettanti, ${b}/${a + b}`, `counts starting with Bruno: ${b}/${a + b}; counts starting with Anna that later tie: as many, ${b}/${a + b}`),
        `1 − 2 × ${b}/${a + b} = ${a - b}/${a + b} ≈ ${tre(v)}`,
      ],
      fonte: F.voti,
    };
  }

  P.trucco({
    id: 'bt-simmetria',
    materia: 'rompicapi',
    capitolo: 'invarianti',
    numero: 3,
    titolo: { it: 'Usa la simmetria', en: 'Use symmetry' },
    sottotitolo: {
      it: 'Quando due casi sono uguali per costruzione hanno la stessa probabilità, e il conto sparisce: monete, carte, formiche, posti in aereo, spogli.',
      en: 'When two cases are alike by construction they have the same probability, and the sum disappears: coins, cards, ants, plane seats, vote counts.',
    },
    aggancio: {
      it: '«Tu lanci 5 monete, io 4: con che probabilità fai più teste di me?» Chi comincia a sommare binomiali si perde; chi vede la simmetria risponde 1/2 in dieci secondi.',
      en: '"You toss 5 coins, I toss 4: what is the chance you get more heads than me?" Whoever starts adding binomials gets lost; whoever sees the symmetry answers 1/2 in ten seconds.',
    },
    lezione: {
      it: `
<h3>Due casi uguali valgono uguale</h3>
<p>Se scambiando i nomi (testa e croce, rosso e nero, due posti, due formiche) il problema resta lo stesso, i due casi hanno la stessa probabilità. Spesso basta questo: la risposta è 1/2, oppure due quantità sono uguali senza calcolarle.</p>
<div class="esempio">5 monete contro 4: metti da parte la quinta. Con 4 contro 4, "più" e "meno" hanno la stessa probabilità p, il pareggio 1 − 2p.<br>Vinci con p + (1 − 2p)/2 = 1/2, qualunque sia p.</div>

<h3>Rietichettare</h3>
<p>Formiche che si scontrano e tornano indietro, viste da lontano, sono formiche che si attraversano: scambiare le etichette non cambia le posizioni. Così un problema con mille rimbalzi diventa una formica che cammina dritta.</p>

<h3>Ridurre ai casi che decidono</h3>
<p>Nel problema dell'aereo, chi si siede a caso sceglie fra posti che per lui sono tutti uguali. Il gioco si decide quando viene occupato il posto 1 o quello che ti interessa: due casi simmetrici, quindi 1/2 per l'ultimo passeggero. Nello spoglio dei voti, ribaltare un tratto di conteggio trasforma un caso cattivo in un altro caso cattivo: si contano a coppie.</p>

<div class="trappola">La simmetria deve esserci davvero: con monete truccate, o con un giocatore che ha un vantaggio nelle regole, "più" e "meno" non hanno più la stessa probabilità. Prima di dire 1/2 chiediti che cosa scambi e perché il problema non cambia.</div>
`,
      en: `
<h3>Two alike cases are worth the same</h3>
<p>If swapping names (heads and tails, red and black, two seats, two ants) leaves the problem the same, the two cases have the same probability. Often that is all you need: the answer is 1/2, or two quantities are equal without working them out.</p>
<div class="esempio">5 coins against 4: set the fifth aside. With 4 against 4, "more" and "fewer" have the same probability p, a tie 1 − 2p.<br>You win with p + (1 − 2p)/2 = 1/2, whatever p is.</div>

<h3>Relabel</h3>
<p>Ants that collide and turn back look, from a distance, like ants that pass through each other: swapping labels does not change positions. So a problem with a thousand bounces becomes one ant walking straight.</p>

<h3>Shrink to the cases that decide</h3>
<p>In the plane problem, whoever sits at random chooses among seats that all look alike to them. The game is decided when seat 1 or the seat you care about is taken: two symmetric cases, so 1/2 for the last passenger. In the vote count, flipping a stretch of the count turns one bad case into another bad case: they come in pairs.</p>

<div class="trappola">The symmetry has to be real: with biased coins, or a player the rules favour, "more" and "fewer" no longer have the same probability. Before saying 1/2, ask what you are swapping and why the problem does not change.</div>
`,
    },
    scheda: {
      it: 'Scambia i nomi: se il problema non cambia, i due casi hanno la stessa probabilità. n + 1 monete contro n: 1/2. Formiche che rimbalzano = formiche che si attraversano. Posto in aereo: 1/2 per l\'ultimo. Spoglio: vantaggio sempre con (a − b)/(a + b).',
      en: 'Swap the names: if the problem does not change, the two cases are equally likely. n + 1 coins against n: 1/2. Bouncing ants = ants passing through. Plane seat: 1/2 for the last. Vote count: ahead all the way with (a − b)/(a + b).',
    },
    fonti: [F.mucchi, F.casino, F.lanci, F.lanciZhou, F.formiche, F.formicheCrack, F.aereo, F.aereoZhou, F.voti],
    test: false,
    nomiLivelli: { it: ['Monete e carte', 'Lanci e formiche', 'Aereo e spoglio'], en: ['Coins and cards', 'Tosses and ants', 'Plane and vote count'] },
    livelli: [
      () => (P.chance(0.5) ? mucchi() : casino()),
      () => (P.chance(0.5) ? lanci() : formiche()),
      () => (P.chance(0.55) ? aereo() : voti()),
    ],
  });
})();
