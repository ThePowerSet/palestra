(function () {
  'use strict';
  const P = Palestra;

  const euro2 = x => x.toFixed(2); // prezzi sempre con due decimali

  function tondo() {
    const R = P.pick([20, 30, 40, 50, 60, 70, 80, 90, 100, 100, 200]);
    const dmax = R >= 100 ? 3 : 2;
    let d; do { d = P.int(-dmax, dmax); } while (d === 0);
    const n = R + d;
    let m; do { m = P.int(13, 97); } while (m % 10 === 0 || Math.abs(m - n) < 4);
    const v = n * m, corr = Math.abs(d) * m;
    const prima = P.chance(0.5);
    return {
      testo: `<span class="num">${prima ? `${n} × ${m}` : `${m} × ${n}`}</span>`,
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`${n} è ${R} ${P.piuMeno(d)}: fai ${R} × ${m} e poi correggi.`, `${n} is ${R} ${P.piuMeno(d)}: do ${R} × ${m} and then correct.`),
        P.t(`${R} × ${m} = ${P.fmt(R * m)}; la correzione è ${Math.abs(d)} × ${m} = ${corr}, da ${d > 0 ? 'aggiungere' : 'togliere'}.`,
          `${R} × ${m} = ${P.fmt(R * m)}; the correction is ${Math.abs(d)} × ${m} = ${corr}, to ${d > 0 ? 'add' : 'take off'}.`),
      ],
      soluzione: [
        `${n} × ${m} = (${R} ${P.piuMeno(d)}) × ${m}`,
        `${R} × ${m} = ${P.fmt(R * m)}`,
        `${Math.abs(d)} × ${m} = ${corr}`,
        `${P.fmt(R * m)} ${P.piuMeno(d * m)} = ${P.fmt(v)}`,
      ],
    };
  }

  function prezzo() {
    const R = P.pick([10, 20, 25, 50, 100]), c = P.pick([0.01, 0.02, 0.05, 0.1, 0.25, 0.5]);
    const q = P.pick([40, 80, 120, 200, 250, 300, 400, 500, 600, 800, 1000, 1200]);
    const centesimi = Math.round((R - c) * 100), v = q * centesimi / 100;
    const p = euro2(centesimi / 100), cs = euro2(c);
    return {
      testo: P.t(`Compri ${q} azioni a <span class="num">${p} €</span>. Quanto paghi in tutto?`, `You buy ${q} shares at <span class="num">${p} €</span>. How much do you pay in total?`),
      risposta: P.numero(v, { unita: '€' }),
      suggerimenti: [
        P.t(`${p} è ${R} − ${cs}: paghi ${q} × ${R} e togli ${q} × ${cs}.`, `${p} is ${R} − ${cs}: you pay ${q} × ${R} and take off ${q} × ${cs}.`),
        `${q} × ${R} = ${P.fmt(q * R)}.`,
      ],
      soluzione: [`${q} × ${R} = ${P.fmt(q * R)}`, `${q} × ${cs} = ${P.fmt(q * c)}`, `${P.fmt(q * R)} − ${P.fmt(q * c)} = ${P.fmt(v)} €`],
    };
  }

  function cento() {
    let a, b; do { a = P.int(-12, 12); b = P.int(-12, 12); } while (!a || !b);
    const n1 = 100 + a, n2 = 100 + b, s = 100 + a + b, ab = a * b, v = n1 * n2;
    return {
      testo: `<span class="num">${n1} × ${n2}</span>`,
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`Tutti e due vicini a 100: (100 + a)(100 + b) = 100 × (100 + a + b) + a·b, con a = ${a} e b = ${b}.`,
          `Both near 100: (100 + a)(100 + b) = 100 × (100 + a + b) + a·b, with a = ${a} and b = ${b}.`),
        P.t(`100 ${P.piuMeno(a)} ${P.piuMeno(b)} = ${s}, e (${a}) × (${b}) = ${ab}.`, `100 ${P.piuMeno(a)} ${P.piuMeno(b)} = ${s}, and (${a}) × (${b}) = ${ab}.`),
      ],
      soluzione: [`100 × ${s} = ${P.fmt(100 * s)}`, `(${a}) × (${b}) = ${ab}`, `${P.fmt(100 * s)} ${P.piuMeno(ab)} = ${P.fmt(v)}`],
    };
  }

  P.trucco({
    id: 'molt-tondo',
    materia: 'calcolo',
    capitolo: 'mul',
    numero: 5,
    titolo: { it: 'Vicino a un numero tondo', en: 'Near a round number' },
    sottotitolo: {
      it: '98 × 47 è 4700 meno due volte 47. E 97 × 96 si legge al volo: 93|12.',
      en: '98 × 47 is 4700 minus two 47s. And 97 × 96 reads straight off: 93|12.',
    },
    aggancio: {
      it: 'Compri 300 azioni a 49.75. Nessuno al desk fa 300 × 49.75 in colonna: 300 × 50 fa 15,000, meno 300 × 0.25 che fa 75. Pagato 14,925.',
      en: 'You buy 300 shares at 49.75. Nobody on the desk does 300 × 49.75 longhand: 300 × 50 is 15,000, minus 300 × 0.25, which is 75. You paid 14,925.',
    },
    lezione: {
      it: `
<h3>L'idea</h3>
<p>98 × 47 in colonna è lento. Ma 98 è quasi 100: 100 × 47 = 4700, e così hai contato due 47 di troppo. Li togli: 4700 − 94 = 4606.</p>
<p>È la proprietà distributiva, usata apposta: sposti un fattore sul numero tondo più vicino e correggi con un prodotto piccolo.</p>
<div class="esempio">(100 − 2) × 47 = 100 × 47 − 2 × 47 = 4700 − 94 = 4606</div>

<h3>Quale fattore spostare</h3>
<p>Quello più vicino a un tondo, così la correzione resta piccola.</p>
<div class="esempio">49 × 36 = 50 × 36 − 36 = 1800 − 36 = 1764<br>102 × 64 = 6400 + 128 = 6528<br>× 9 = × 10 − una volta; × 99 = × 100 − una volta; × 11 = × 10 + una volta</div>

<h3>Prezzi quasi tondi</h3>
<p>Il caso più comune al desk: una quantità per un prezzo che sta appena sotto un tondo.</p>
<div class="esempio">300 × 49.75 = 300 × 50 − 300 × 0.25 = 15,000 − 75 = 14,925</div>

<h3>Tutti e due vicini a 100</h3>
<p>(100 + a)(100 + b) = 10,000 + 100a + 100b + ab = 100 × (100 + a + b) + ab. In pratica: le prime cifre sono 100 + a + b, le ultime due sono a × b.</p>
<div class="esempio">97 × 96: 100 − 3 − 4 = 93, e 3 × 4 = 12 → 9312<br>104 × 107: 100 + 4 + 7 = 111, e 4 × 7 = 28 → 11,128<br>88 × 89: 100 − 12 − 11 = 77, e 12 × 11 = 132 → 7700 + 132 = 7832<br>103 × 98: 100 + 3 − 2 = 101, e 3 × (−2) = −6 → 10,100 − 6 = 10,094</div>
<div class="trappola">Se a × b supera 99, non sta in due cifre: sommalo, come in 88 × 89. Se a e b hanno segno opposto, a × b è negativo e va tolto.</div>
`,
      en: `
<h3>The idea</h3>
<p>98 × 47 longhand is slow. But 98 is almost 100: 100 × 47 = 4700, and that counts two 47s too many. Take them off: 4700 − 94 = 4606.</p>
<p>It is the distributive law, used on purpose: move one factor to the nearest round number and correct with a small product.</p>
<div class="esempio">(100 − 2) × 47 = 100 × 47 − 2 × 47 = 4700 − 94 = 4606</div>

<h3>Which factor to move</h3>
<p>The one closest to a round number, so that the correction stays small.</p>
<div class="esempio">49 × 36 = 50 × 36 − 36 = 1800 − 36 = 1764<br>102 × 64 = 6400 + 128 = 6528<br>× 9 = × 10 minus once; × 99 = × 100 minus once; × 11 = × 10 plus once</div>

<h3>Almost-round prices</h3>
<p>The most common case on a desk: a quantity times a price just below a round number.</p>
<div class="esempio">300 × 49.75 = 300 × 50 − 300 × 0.25 = 15,000 − 75 = 14,925</div>

<h3>Both near 100</h3>
<p>(100 + a)(100 + b) = 10,000 + 100a + 100b + ab = 100 × (100 + a + b) + ab. In practice: the first digits are 100 + a + b, the last two are a × b.</p>
<div class="esempio">97 × 96: 100 − 3 − 4 = 93, and 3 × 4 = 12 → 9312<br>104 × 107: 100 + 4 + 7 = 111, and 4 × 7 = 28 → 11,128<br>88 × 89: 100 − 12 − 11 = 77, and 12 × 11 = 132 → 7700 + 132 = 7832<br>103 × 98: 100 + 3 − 2 = 101, and 3 × (−2) = −6 → 10,100 − 6 = 10,094</div>
<div class="trappola">If a × b is more than 99 it doesn't fit in two digits: add it, as in 88 × 89. If a and b have opposite signs, a × b is negative and has to be taken off.</div>
`,
    },
    scheda: {
      it: 'Sposta un fattore sul tondo più vicino e correggi: 98 × 47 = 4700 − 94. Prezzi: 300 × 49.75 = 15,000 − 75. Vicini a 100: (100 + a)(100 + b) = 100 × (100 + a + b) + a·b.',
      en: 'Move a factor to the nearest round number and correct: 98 × 47 = 4700 − 94. Prices: 300 × 49.75 = 15,000 − 75. Near 100: (100 + a)(100 + b) = 100 × (100 + a + b) + a·b.',
    },
    test: true,
    nomiLivelli: { it: ['Calcolo', 'Prezzi', 'Vicini a 100'], en: ['Calculation', 'Prices', 'Near 100'] },
    livelli: [tondo, prezzo, cento],
  });
})();
