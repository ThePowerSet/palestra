(function () {
  'use strict';
  const P = Palestra;

  function sommaDadi() {
    if (P.chance(0.7)) {
      const n = P.int(2, 10), k = P.pick([6, 6, 6, 4, 8, 10, 12, 20]), m = (k + 1) / 2, v = n * m;
      return {
        testo: P.t(`Lanci ${n} dadi da ${k} facce e sommi i punti. Qual è il valore atteso della somma?`, `You roll ${n} ${k}-sided dice and add up the points. What is the expected value of the sum?`),
        risposta: P.numero(v),
        suggerimenti: [
          P.t(`Un dado da ${k} facce vale in media (1 + ${k})/2 = ${P.fmt(m)}.`, `A ${k}-sided die is worth (1 + ${k})/2 = ${P.fmt(m)} on average.`),
          P.t(`Il valore atteso della somma è la somma dei valori attesi: ${n} × ${P.fmt(m)}.`, `The expected value of the sum is the sum of the expected values: ${n} × ${P.fmt(m)}.`),
        ],
        soluzione: [P.t(`E[un dado] = ${P.fmt(m)}`, `E[one die] = ${P.fmt(m)}`), P.t(`E[somma] = ${n} × ${P.fmt(m)} = ${P.fmt(v)}`, `E[sum] = ${n} × ${P.fmt(m)} = ${P.fmt(v)}`)],
      };
    }
    const a = P.int(1, 40), b = a + P.int(5, 200), v = (a + b) / 2;
    return {
      testo: P.t(`Scegli a caso un intero fra ${a} e ${b}, estremi compresi, tutti con la stessa probabilità. Valore atteso?`,
        `Pick an integer between ${a} and ${b} inclusive, all equally likely. Expected value?`),
      risposta: P.numero(v),
      suggerimenti: [
        P.t('Per una distribuzione uniforme su interi consecutivi la media è il punto di mezzo: (primo + ultimo)/2.', 'For a uniform distribution on consecutive integers the mean is the midpoint: (first + last)/2.'),
        `(${a} + ${b})/2.`,
      ],
      soluzione: [`(${a} + ${b})/2 = ${P.fmt(v)}`],
    };
  }

  function mercato() {
    const tipo = P.pick(['carte', 'carte', 'sei', 'teste', 'prodotto', 'zero']);
    if (tipo === 'carte') {
      const n = P.int(2, 8), v = 7 * n;
      return {
        testo: P.t(`Fammi un mercato sulla somma di ${n} carte pescate, senza rimetterle, da un mazzo da 52 (asso = 1, fante = 11, donna = 12, re = 13). Dove metti il centro?`,
          `Make me a market on the sum of ${n} cards drawn, without replacement, from a 52-card deck (ace = 1, jack = 11, queen = 12, king = 13). Where do you put the centre?`),
        risposta: P.numero(v),
        suggerimenti: [
          P.t('Una carta vale in media (1 + 13)/2 = 7. Senza reinserimento le carte non sono indipendenti, ma la linearità del valore atteso non lo chiede.',
            'One card is worth (1 + 13)/2 = 7 on average. Without replacement the cards are not independent, but linearity of expectation does not need that.'),
          `${n} × 7.`,
        ],
        soluzione: [
          P.t('E[una carta] = 7', 'E[one card] = 7'),
          P.t(`E[somma] = ${n} × 7 = ${v}`, `E[sum] = ${n} × 7 = ${v}`),
          P.t('il centro del mercato è il valore atteso; la larghezza dipende da quanto è incerto', 'the centre of the market is the expected value; the width depends on how uncertain it is'),
        ],
      };
    }
    if (tipo === 'sei' || tipo === 'teste') {
      const sei = tipo === 'sei';
      const n = sei ? P.pick([6, 10, 12, 18, 20, 30, 36, 50]) : P.pick([7, 10, 15, 25, 33, 50]);
      const p = sei ? 1 / 6 : 1 / 2, v = n * p, fr = sei ? '1/6' : '1/2';
      return {
        testo: sei ? P.t(`Lanci un dado ${n} volte. Quanti 6 ti aspetti?`, `You roll a die ${n} times. How many 6s do you expect?`)
          : P.t(`Lanci una moneta ${n} volte. Quante teste ti aspetti?`, `You toss a coin ${n} times. How many heads do you expect?`),
        nota: v % 1 ? P.t('bastano due decimali', 'two decimals are enough') : '',
        risposta: P.numero(v, { decimali: 2 }),
        suggerimenti: [
          P.t('Conta con gli indicatori: ogni lancio vale 1 se esce quello che cerchi e 0 altrimenti, e il suo valore atteso è la probabilità.',
            'Count with indicators: each roll is worth 1 if you get what you are looking for and 0 otherwise, and its expected value is the probability.'),
          `${n} × ${fr}.`,
        ],
        soluzione: [P.t(`ogni lancio contribuisce ${fr}`, `each roll contributes ${fr}`), `${n} × ${fr} = ${P.fmt(v, 4)}`],
      };
    }
    if (tipo === 'prodotto') {
      const n = P.pick([2, 2, 3]), v = 3.5 ** n;
      return {
        testo: P.t(`Lanci ${n} dadi indipendenti e moltiplichi i punti. Qual è il valore atteso del prodotto?`, `You roll ${n} independent dice and multiply the points. What is the expected value of the product?`),
        risposta: P.numero(v),
        suggerimenti: [
          P.t('Con variabili indipendenti il valore atteso del prodotto è il prodotto dei valori attesi.', 'With independent variables the expected value of the product is the product of the expected values.'),
          `${P.fmt(3.5)}${P.apice(n)}.`,
        ],
        soluzione: [
          P.t(`E[prodotto] = ${P.fmt(3.5)}${P.apice(n)} = ${P.fmt(v)}`, `E[product] = ${P.fmt(3.5)}${P.apice(n)} = ${P.fmt(v)}`),
          P.t('senza indipendenza non varrebbe: la somma sì, il prodotto no', 'without independence it would not hold: for the sum it does, for the product it doesn\'t'),
        ],
      };
    }
    const n = P.int(2, 8), v = n * 2.5;
    return {
      testo: P.t(`Lanci ${n} dadi e sommi i punti, ma ogni 6 vale 0. Valore atteso della somma?`, `You roll ${n} dice and add the points, but every 6 counts as 0. Expected value of the sum?`),
      risposta: P.numero(v),
      suggerimenti: [
        P.t('Un dado così vale in media (1 + 2 + 3 + 4 + 5 + 0)/6.', 'A die like that is worth (1 + 2 + 3 + 4 + 5 + 0)/6 on average.'),
        P.t(`15/6 = ${P.fmt(2.5)}, per ${n} dadi.`, `15/6 = ${P.fmt(2.5)}, for ${n} dice.`),
      ],
      soluzione: [P.t(`E[un dado] = 15/6 = ${P.fmt(2.5)}`, `E[one die] = 15/6 = ${P.fmt(2.5)}`), `${n} × ${P.fmt(2.5)} = ${P.fmt(v)}`],
    };
  }

  const ATTESE = [
    [{ it: 'esce un 6 lanciando un dado', en: 'a die shows a 6' }, 1, 6],
    [{ it: 'esce testa lanciando una moneta', en: 'a coin lands heads' }, 1, 2],
    [{ it: 'escono due 6 lanciando due dadi insieme', en: 'two dice rolled together both show 6' }, 1, 36],
    [{ it: 'la somma di due dadi fa 7', en: 'two dice add up to 7' }, 6, 36],
    [{ it: 'la somma di due dadi fa 12', en: 'two dice add up to 12' }, 1, 36],
    [{ it: 'la somma di due dadi fa 10', en: 'two dice add up to 10' }, 3, 36],
    [{ it: 'la somma di due dadi fa 11', en: 'two dice add up to 11' }, 2, 36],
    [{ it: 'esce un numero da 5 in su lanciando un dado', en: 'a die shows 5 or more' }, 2, 6],
    [{ it: 'esce un asso pescando una carta (e rimettendola nel mazzo)', en: 'you draw an ace (putting the card back each time)' }, 4, 52],
    [{ it: 'esce una figura pescando una carta (e rimettendola nel mazzo)', en: 'you draw a face card (putting the card back each time)' }, 12, 52],
    [{ it: 'escono due teste lanciando due monete', en: 'two coins both land heads' }, 1, 4],
    [{ it: 'esce almeno un 6 lanciando due dadi', en: 'at least one of two dice shows a 6' }, 11, 36],
  ];

  function attesa() {
    const [evento, a, b] = P.pick(ATTESE), g = P.mcd(a, b), v = b / a;
    return {
      testo: P.t(`Ripeti la prova finché ${P.tr(evento)}. Quante prove servono in media, contando l'ultima?`,
        `You repeat the trial until ${P.tr(evento)}. How many trials do you need on average, counting the last one?`),
      nota: v % 1 ? P.t('bastano due decimali', 'two decimals are enough') : '',
      risposta: P.numero(v, { decimali: 2, mostra: P.fmt(v, 4) }),
      suggerimenti: [
        P.t('Se ogni prova riesce con probabilità p, servono in media 1/p prove.', 'If each trial succeeds with probability p, you need 1/p trials on average.'),
        P.t(`Qui p = ${a / g}/${b / g}.`, `Here p = ${a / g}/${b / g}.`),
      ],
      soluzione: [`p = ${a}/${b} = ${a / g}/${b / g}`, `1/p = ${b / g}/${a / g} = ${P.fmt(v, 4)}`],
    };
  }

  P.trucco({
    id: 'prob-valore-atteso',
    materia: 'probabilita',
    capitolo: 'prob',
    numero: 1,
    titolo: { it: 'Linearità e attesa 1/p', en: 'Linearity and waiting 1/p' },
    sottotitolo: {
      it: 'Il valore atteso di una somma è la somma dei valori attesi, sempre. E per un evento di probabilità p si aspetta 1/p prove.',
      en: 'The expected value of a sum is the sum of the expected values, always. And for an event of probability p you wait 1/p trials.',
    },
    aggancio: {
      it: '«Fammi un mercato sulla somma di tre dadi.» Il centro è 10.5 e non serve elencare 216 casi: ogni dado vale in media 3.5.',
      en: '"Make me a market on the sum of three dice." The centre is 10.5 and you don\'t need to list 216 cases: each die is worth 3.5 on average.',
    },
    lezione: {
      it: `
<h3>La domanda da market maker</h3>
<p>Nei colloqui da trader ti chiedono di quotare su cose che si possono contare: la somma di tre dadi, la somma di cinque carte, il numero di teste in cento lanci. Il primo passo è sempre il centro del mercato, cioè il valore atteso. Per trovarlo quasi mai serve elencare i casi.</p>

<h3>Linearità</h3>
<p>Il valore atteso di una somma è la somma dei valori attesi: E[X + Y] = E[X] + E[Y]. Vale <b>sempre</b>, anche se X e Y dipendono l'una dall'altra.</p>
<div class="esempio">un dado: (1 + 6)/2 = 3.5 → tre dadi: 10.5<br>una carta (asso 1 … re 13): 7 → cinque carte, anche senza rimetterle: 35</div>
<p>Le carte pescate senza reinserimento non sono indipendenti, eppure il conto non cambia: ogni carta, presa da sola, ha la stessa distribuzione e vale 7 in media.</p>

<h3>Gli indicatori</h3>
<p>Per contare quante volte succede qualcosa, scrivi il conteggio come somma di indicatori: 1 se succede alla prova i, 0 altrimenti. Il valore atteso di un indicatore è la sua probabilità.</p>
<div class="esempio">numero di 6 in 30 lanci: 30 × 1/6 = 5<br>quante persone, in una permutazione a caso, ritrovano il proprio posto: n × 1/n = 1</div>

<div class="trappola">Il prodotto è diverso: E[XY] = E[X]·E[Y] solo se X e Y sono indipendenti. Due dadi indipendenti: 3.5² = 12.25.</div>

<h3>Quanto si aspetta</h3>
<p>Se ogni prova riesce con probabilità p, servono in media <b>1/p</b> prove (contando quella buona). Perché: alla prima prova riesci con probabilità p; altrimenti hai speso una prova e sei di nuovo al punto di partenza. Quindi E = 1 + (1 − p)·E, cioè E = 1/p.</p>
<div class="esempio">un 6: 6 lanci · testa: 2 lanci · doppio 6: 36 lanci · somma 7 con due dadi: 6 lanci</div>

<h3>Al desk</h3>
<p>Il valore atteso ti dà il centro del mercato. La larghezza viene dopo, da quanto è incerto il risultato e da quanto rischio vuoi prendere. Ma senza un centro giusto, nessuna larghezza ti salva.</p>
`,
      en: `
<h3>The market maker's question</h3>
<p>In trader interviews you are asked to quote on things you can count: the sum of three dice, the sum of five cards, the number of heads in a hundred tosses. The first step is always the centre of the market, that is the expected value. You almost never need to list the cases to find it.</p>

<h3>Linearity</h3>
<p>The expected value of a sum is the sum of the expected values: E[X + Y] = E[X] + E[Y]. It holds <b>always</b>, even when X and Y depend on each other.</p>
<div class="esempio">one die: (1 + 6)/2 = 3.5 → three dice: 10.5<br>one card (ace 1 … king 13): 7 → five cards, even without replacement: 35</div>
<p>Cards drawn without replacement are not independent, yet the calculation doesn't change: each card, taken on its own, has the same distribution and is worth 7 on average.</p>

<h3>Indicators</h3>
<p>To count how many times something happens, write the count as a sum of indicators: 1 if it happens on trial i, 0 otherwise. The expected value of an indicator is its probability.</p>
<div class="esempio">number of 6s in 30 rolls: 30 × 1/6 = 5<br>how many people, in a random permutation, end up in their own seat: n × 1/n = 1</div>

<div class="trappola">Products are different: E[XY] = E[X]·E[Y] only if X and Y are independent. Two independent dice: 3.5² = 12.25.</div>

<h3>How long you wait</h3>
<p>If each trial succeeds with probability p, you need on average <b>1/p</b> trials (counting the successful one). Why: on the first trial you succeed with probability p; otherwise you have spent one trial and are back where you started. So E = 1 + (1 − p)·E, which gives E = 1/p.</p>
<div class="esempio">a 6: 6 rolls · heads: 2 tosses · double 6: 36 rolls · a sum of 7 with two dice: 6 rolls</div>

<h3>On the desk</h3>
<p>The expected value gives you the centre of the market. The width comes afterwards, from how uncertain the outcome is and how much risk you want to take. But without the right centre, no width will save you.</p>
`,
    },
    scheda: {
      it: 'E[X + Y] = E[X] + E[Y] sempre, anche senza indipendenza (dado 3.5; carta 7). Conteggi: somma di indicatori, ognuno vale la sua probabilità. Prodotto: solo con indipendenza. Attesa per un evento di probabilità p: 1/p prove.',
      en: 'E[X + Y] = E[X] + E[Y] always, even without independence (die 3.5; card 7). Counts: a sum of indicators, each worth its probability. Products: only with independence. Waiting for an event of probability p: 1/p trials.',
    },
    test: false,
    nomiLivelli: { it: ['Linearità', 'Mercati', 'Attese'], en: ['Linearity', 'Markets', 'Waiting times'] },
    livelli: [sommaDadi, mercato, attesa],
  });
})();
