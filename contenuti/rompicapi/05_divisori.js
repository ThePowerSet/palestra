(function () {
  'use strict';
  const P = Palestra;
  const F = {
    zeri: P.fonte('zhou', '§2.2, "Trailing zeros"'),
    zeriCrack: P.fonte('crack', 'Question 1.63', { nota: { it: 'gli zeri di 100!', en: 'the zeros of 100!' } }),
    lampadine: P.fonte('zhou', '§2.3, "Light switches"'),
    armadietti: P.fonte('winkler', '"Locker Doors"'),
    armadiettiCrack: P.fonte('crack', 'Questions 1.14 and 1.15', { nota: { it: 'cento lampadine e cento operatori', en: 'a hundred bulbs and a hundred brokers' } }),
    resti: P.fonte('crack', 'Question 1.30'),
  };
  const divisori = k => { const d = []; for (let i = 1; i <= k; i++) if (k % i === 0) d.push(i); return d; };
  const mcm = (a, b) => a / P.mcd(a, b) * b;
  const primo = p => p > 1 && divisori(p).length === 2;

  function zeri() {
    const n = P.int(20, 260);
    const termini = [];
    for (let q = 5; q <= n; q *= 5) termini.push([q, Math.floor(n / q)]);
    const z = termini.reduce((s, t) => s + t[1], 0);
    return {
      testo: P.t(`Con quanti zeri finisce ${n}! (il prodotto 1 × 2 × … × ${n})?`, `How many zeros does ${n}! (the product 1 × 2 × … × ${n}) end with?`),
      risposta: P.numero(z),
      suggerimenti: [
        P.t('Ogni zero finale è un 10 = 2 × 5. I fattori 2 abbondano: conta i fattori 5.', 'Each trailing zero is a 10 = 2 × 5. Factors of 2 are plentiful: count the factors of 5.'),
        P.t(`Ogni multiplo di 5 ne dà uno, ogni multiplo di 25 uno in più${n >= 125 ? ', ogni multiplo di 125 un altro ancora' : ''}.`, `Every multiple of 5 gives one, every multiple of 25 one more${n >= 125 ? ', every multiple of 125 yet another' : ''}.`),
      ],
      soluzione: [termini.map(([q, c]) => `⌊${n}/${q}⌋ = ${c}`).join('; '), `${termini.map(t => t[1]).join(' + ')} = ${z}`],
      fonte: F.zeri,
    };
  }

  // Lockers: locker k is touched once per divisor of k, so it ends open only if k is a perfect square
  function aperti() {
    const n = P.pick([50, 80, 100, 120, 150, 200, 250, 300, 500, 1000]), r = Math.floor(Math.sqrt(n));
    return {
      testo: P.t(`In un corridoio ci sono ${n} armadietti chiusi, numerati da 1 a ${n}, e passano ${n} studenti. Lo studente numero i cambia lo stato (apre se chiuso, chiude se aperto) di tutti gli armadietti multipli di i. Quando sono passati tutti, quanti armadietti sono aperti?`,
        `A corridor has ${n} closed lockers, numbered 1 to ${n}, and ${n} students walk past. Student number i changes the state (opens if closed, closes if open) of every locker that is a multiple of i. Once they have all passed, how many lockers are open?`),
      risposta: P.numero(r),
      suggerimenti: [
        P.t('Quante volte viene toccato l\'armadietto k? Una volta per ogni divisore di k.', 'How many times is locker k touched? Once for every divisor of k.'),
        P.t('I divisori vanno a coppie (d e k/d), tranne quando d = k/d: solo i quadrati perfetti hanno un numero dispari di divisori.', 'Divisors come in pairs (d and k/d), except when d = k/d: only perfect squares have an odd number of divisors.'),
      ],
      soluzione: [
        P.t('restano aperti gli armadietti toccati un numero dispari di volte: i quadrati perfetti', 'the lockers touched an odd number of times stay open: the perfect squares'),
        P.t(`quadrati fino a ${n}: 1, 4, 9, …, ${r * r} → ${r}`, `squares up to ${n}: 1, 4, 9, …, ${r * r} → ${r}`),
      ],
      fonte: F.lampadine,
    };
  }

  function tocchi() {
    let k;
    do { k = P.int(12, 100); } while (divisori(k).length < 6);
    const d = divisori(k), aperto = d.length % 2 === 1;
    return {
      testo: P.t(`Stessi armadietti, cento in fila, tutti chiusi; lo studente i cambia lo stato dei multipli di i, per i da 1 a 100. Quante volte viene toccato l'armadietto ${k}?`,
        `Same lockers, a hundred in a row, all closed; student i changes the state of the multiples of i, for i from 1 to 100. How many times is locker ${k} touched?`),
      risposta: P.numero(d.length),
      suggerimenti: [
        P.t(`Lo studente i tocca l'armadietto ${k} quando i divide ${k}.`, `Student i touches locker ${k} when i divides ${k}.`),
        P.t(`Scomponi ${k} in fattori primi: con ${k} = p^a × q^b … i divisori sono (a + 1)(b + 1)…`, `Factor ${k} into primes: with ${k} = p^a × q^b … there are (a + 1)(b + 1)… divisors.`),
      ],
      soluzione: [
        P.t(`divisori di ${k}: ${d.join(', ')}`, `divisors of ${k}: ${d.join(', ')}`),
        P.t(`${d.length} tocchi: alla fine è ${aperto ? 'aperto' : 'chiuso'}`, `${d.length} touches: at the end it is ${aperto ? 'open' : 'closed'}`),
      ],
      fonte: F.armadietti,
    };
  }

  // The lockers touched exactly three times are the squares of primes
  function treVolte() {
    const n = P.pick([50, 100, 150, 200, 300, 500, 1000]);
    const pp = []; for (let p = 2; p * p <= n; p++) if (primo(p)) pp.push(p);
    return {
      testo: P.t(`${n} armadietti chiusi, ${n} studenti; lo studente i cambia lo stato dei multipli di i. Quanti armadietti vengono toccati esattamente tre volte?`,
        `${n} closed lockers, ${n} students; student i changes the state of the multiples of i. How many lockers are touched exactly three times?`),
      risposta: P.numero(pp.length),
      suggerimenti: [
        P.t('Toccato tre volte vuol dire tre divisori. Che forma ha un numero con tre divisori?', 'Touched three times means three divisors. What does a number with exactly three divisors look like?'),
        P.t('Con k = p^a × q^b … i divisori sono (a + 1)(b + 1)…; per avere 3 serve un solo primo con esponente 2: k = p².', 'With k = p^a × q^b … there are (a + 1)(b + 1)… divisors; to get 3 you need one prime with exponent 2: k = p².'),
      ],
      soluzione: [
        P.t(`quadrati di primi fino a ${n}: ${pp.map(p => `${p}² = ${p * p}`).join(', ')}`, `squares of primes up to ${n}: ${pp.map(p => `${p}² = ${p * p}`).join(', ')}`),
        P.t(`sono ${pp.length}`, `there are ${pp.length}`),
      ],
      fonte: F.armadietti,
    };
  }

  // A number that leaves remainder i − 1 when divided by every i up to m is one less than a common multiple
  function resti() {
    const m = P.pick([5, 6, 7, 8, 9, 10]);
    let l = 1; for (let i = 2; i <= m; i++) l = mcm(l, i);
    return {
      testo: P.t(`Qual è il più piccolo intero positivo che diviso per 2 dà resto 1, diviso per 3 dà resto 2, diviso per 4 dà resto 3, e così via fino a: diviso per ${m} dà resto ${m - 1}?`,
        `What is the smallest positive whole number that leaves remainder 1 when divided by 2, remainder 2 when divided by 3, remainder 3 when divided by 4, and so on up to remainder ${m - 1} when divided by ${m}?`),
      risposta: P.numero(l - 1),
      suggerimenti: [
        P.t('Che cosa succede se al numero aggiungi 1?', 'What happens if you add 1 to the number?'),
        P.t(`Più 1, il numero è divisibile per 2, 3, …, ${m}: è un multiplo comune. Il più piccolo è il minimo comune multiplo.`, `Plus 1, the number is divisible by 2, 3, …, ${m}: a common multiple. The smallest is the least common multiple.`),
      ],
      soluzione: [
        P.t(`mcm(2, …, ${m}) = ${l}`, `lcm(2, …, ${m}) = ${l}`),
        `${l} − 1 = ${l - 1}`,
      ],
      fonte: F.resti,
    };
  }

  P.trucco({
    id: 'bt-divisori',
    materia: 'rompicapi',
    capitolo: 'contare',
    numero: 5,
    titolo: { it: 'Divisori, zeri e resti', en: 'Divisors, zeros and remainders' },
    sottotitolo: {
      it: 'Quanti zeri ha un fattoriale, quali armadietti restano aperti, quale numero lascia tutti i resti giusti: basta guardare i fattori.',
      en: 'How many zeros a factorial has, which lockers stay open, which number leaves all the right remainders: just look at the factors.',
    },
    aggancio: {
      it: '«Cento interruttori, cento persone; la persona i preme tutti gli interruttori multipli di i. Quante luci restano accese?» Si risponde in dieci secondi, se si pensa ai divisori.',
      en: '"A hundred switches, a hundred people; person i flips every switch that is a multiple of i. How many lights stay on?" Ten seconds, if you think in divisors.',
    },
    lezione: {
      it: `
<h3>Zeri finali</h3>
<p>Uno zero finale è un fattore 10 = 2 × 5. In n! i fattori 2 sono molti più dei 5, quindi gli zeri sono i fattori 5: uno per ogni multiplo di 5, uno in più per ogni multiplo di 25, un altro per ogni multiplo di 125.</p>
<div class="esempio">100! → ⌊100/5⌋ + ⌊100/25⌋ = 20 + 4 = 24 zeri.</div>

<h3>Divisori a coppie</h3>
<p>I divisori di k vanno a coppie d e k/d. Fa eccezione solo il caso d = k/d, cioè k quadrato perfetto: allora i divisori sono dispari. Quanti sono? Con k = p^a × q^b … sono (a + 1)(b + 1)…. Tre divisori esatti vogliono dire k = p², il quadrato di un primo.</p>
<div class="esempio">Armadietti o lampadine: l'armadietto k cambia stato una volta per divisore. Resta aperto se i divisori sono dispari: 1, 4, 9, …; con 100 armadietti sono 10.</div>

<h3>Resti tutti "uno in meno"</h3>
<p>Un numero che diviso per 2, 3, …, m lascia sempre il resto massimo è uno in meno di un multiplo comune di 2, 3, …, m. Il più piccolo è il minimo comune multiplo meno 1.</p>

<div class="trappola">Negli zeri di n! non fermarti ai multipli di 5: 25, 50, 75 e 100 portano due fattori 5 ciascuno, 125 ne porta tre.</div>
`,
      en: `
<h3>Trailing zeros</h3>
<p>A trailing zero is a factor 10 = 2 × 5. In n! the factors of 2 far outnumber the 5s, so the zeros are the factors of 5: one for each multiple of 5, one more for each multiple of 25, another for each multiple of 125.</p>
<div class="esempio">100! → ⌊100/5⌋ + ⌊100/25⌋ = 20 + 4 = 24 zeros.</div>

<h3>Divisors come in pairs</h3>
<p>The divisors of k pair up as d and k/d. The only exception is d = k/d, that is a perfect square: then the number of divisors is odd. How many are there? With k = p^a × q^b … there are (a + 1)(b + 1)…. Exactly three divisors means k = p², the square of a prime.</p>
<div class="esempio">Lockers or light bulbs: locker k changes state once per divisor. It stays open if the divisors are odd in number: 1, 4, 9, …; with 100 lockers that is 10.</div>

<h3>Remainders all "one short"</h3>
<p>A number that, divided by 2, 3, …, m, always leaves the largest possible remainder is one less than a common multiple of 2, 3, …, m. The smallest is the least common multiple minus 1.</p>

<div class="trappola">For the zeros of n! do not stop at the multiples of 5: 25, 50, 75 and 100 bring two factors of 5 each, 125 brings three.</div>
`,
    },
    scheda: {
      it: 'Zeri di n!: ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋. Divisori a coppie: numero dispari solo per i quadrati; (a + 1)(b + 1)… divisori; tre divisori = quadrato di un primo. Resto sempre "uno in meno": mcm − 1.',
      en: 'Zeros of n!: ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋. Divisors pair up: an odd count only for squares; (a + 1)(b + 1)… divisors; three divisors = square of a prime. Remainder always "one short": lcm − 1.',
    },
    fonti: [F.zeri, F.zeriCrack, F.lampadine, F.armadietti, F.armadiettiCrack, F.resti],
    test: false,
    nomiLivelli: { it: ['Zeri del fattoriale', 'Armadietti', 'Tre tocchi e resti'], en: ['Factorial zeros', 'Lockers', 'Three touches and remainders'] },
    livelli: [
      zeri,
      () => (P.chance(0.5) ? aperti() : tocchi()),
      () => (P.chance(0.5) ? treVolte() : resti()),
    ],
  });
})();
