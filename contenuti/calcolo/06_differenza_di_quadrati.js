(function () {
  'use strict';
  const P = Palestra;

  function simmetrici() {
    const m = P.pick([20, 30, 40, 50, 60, 70, 80, 90, 100]), d = P.int(1, 9);
    const a = m - d, b = m + d, v = m * m - d * d;
    return {
      testo: `<span class="num">${P.chance(0.5) ? `${a} × ${b}` : `${b} × ${a}`}</span>`,
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`${a} e ${b} sono simmetrici attorno a ${m}, a distanza ${d}: (m − d)(m + d) = m² − d².`, `${a} and ${b} are symmetric around ${m}, at distance ${d}: (m − d)(m + d) = m² − d².`),
        P.t(`${m}² = ${P.fmt(m * m)} e ${d}² = ${d * d}.`, `${m}² = ${P.fmt(m * m)} and ${d}² = ${d * d}.`),
      ],
      soluzione: [P.t(`media ${m}, distanza ${d}`, `midpoint ${m}, distance ${d}`), `${m}² − ${d}² = ${P.fmt(m * m)} − ${d * d} = ${P.fmt(v)}`],
    };
  }

  function centroIn5() {
    const m = P.pick([15, 25, 35, 45, 55, 65, 75, 85, 95]), d = P.int(1, 4), t = (m - 5) / 10;
    const a = m - d, b = m + d, v = m * m - d * d;
    return {
      testo: `<span class="num">${a} × ${b}</span>`,
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`Simmetrici attorno a ${m}, a distanza ${d}: ${m}² − ${d}².`, `Symmetric around ${m}, at distance ${d}: ${m}² − ${d}².`),
        P.t(`${m}² finisce per 25: ${t} × ${t + 1} = ${t * (t + 1)}, quindi ${m}² = ${m * m}.`, `${m}² ends in 25: ${t} × ${t + 1} = ${t * (t + 1)}, so ${m}² = ${m * m}.`),
      ],
      soluzione: [
        P.t(`${m}² = ${m * m} (${t} × ${t + 1} = ${t * (t + 1)}, poi 25)`, `${m}² = ${m * m} (${t} × ${t + 1} = ${t * (t + 1)}, then 25)`),
        `${m * m} − ${d * d} = ${P.fmt(v)}`,
      ],
    };
  }

  function suEGiu() {
    const d = P.int(1, 9), v = -d * d / 10000;
    return {
      testo: P.t(`Un titolo sale ${P.del(d)}% e il giorno dopo scende ${P.del(d)}%. Di quanto è cambiato in tutto?`,
        `A stock rises by ${d}% and the next day falls by ${d}%. What is the total change?`),
      nota: P.t('in percentuale, con il segno', 'as a percentage, with the sign'),
      risposta: P.numero(v, { percento: true, mostra: P.pctSegno(v, 4) }),
      suggerimenti: [
        P.t(`(1 + x)(1 − x) = 1 − x², con x = ${d}% = ${P.fmt(d / 100)}.`, `(1 + x)(1 − x) = 1 − x², with x = ${d}% = ${P.fmt(d / 100)}.`),
        P.t(`x² = ${P.fmt(d * d / 10000)}, cioè ${P.fmt(d * d / 100)}%.`, `x² = ${P.fmt(d * d / 10000)}, i.e. ${P.fmt(d * d / 100)}%.`),
      ],
      soluzione: [
        `${P.fmt(1 + d / 100)} × ${P.fmt(1 - d / 100)} = 1 − ${P.fmt(d / 100)}² = ${P.fmt(1 + v)}`,
        P.t(`variazione: ${P.pctSegno(v, 4)}`, `change: ${P.pctSegno(v, 4)}`),
      ],
    };
  }

  function asimmetrici() {
    const m = P.pick([20, 30, 40, 50, 60, 70, 80, 90]), d = P.int(1, 8);
    const a = m - d, b = m + d + 1, base = m * m - d * d, v = a * b;
    return {
      testo: `<span class="num">${a} × ${b}</span>`,
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`Non sono simmetrici: ${a} + ${b} è dispari. Rendili simmetrici togliendo 1: ${a} × ${b} = ${a} × ${b - 1} + ${a}.`,
          `They are not symmetric: ${a} + ${b} is odd. Make them symmetric by taking 1 off: ${a} × ${b} = ${a} × ${b - 1} + ${a}.`),
        `${a} × ${b - 1} = ${m}² − ${d}² = ${P.fmt(base)}.`,
      ],
      soluzione: [`${a} × ${b - 1} = ${m}² − ${d}² = ${P.fmt(base)}`, `+ ${a} = ${P.fmt(v)}`],
    };
  }

  function decimali() {
    const d = P.int(1, 9), x = 1 + d / 100, y = 1 - d / 100, v = 1 - d * d / 10000;
    return {
      testo: `<span class="num">${P.fmt(x)} × ${P.fmt(y)}</span>`,
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`Simmetrici attorno a 1, a distanza ${P.fmt(d / 100)}: 1 − ${P.fmt(d / 100)}².`, `Symmetric around 1, at distance ${P.fmt(d / 100)}: 1 − ${P.fmt(d / 100)}².`),
        `${P.fmt(d / 100)}² = ${P.fmt(d * d / 10000)}.`,
      ],
      soluzione: [`1 − ${P.fmt(d / 100)}² = 1 − ${P.fmt(d * d / 10000)} = ${P.fmt(v)}`],
    };
  }

  P.trucco({
    id: 'molt-quadrati',
    materia: 'calcolo',
    capitolo: 'mul',
    numero: 6,
    titolo: { it: 'Differenza di quadrati', en: 'Difference of squares' },
    sottotitolo: {
      it: '47 × 53 = 50² − 3². Due numeri simmetrici si moltiplicano con un quadrato e una sottrazione.',
      en: '47 × 53 = 50² − 3². Two symmetric numbers multiply with one square and one subtraction.',
    },
    aggancio: {
      it: '«47 per 53?» In un test a tempo hai sei secondi. Sono simmetrici attorno a 50: 2500 − 9 = 2491, e ne avanzano cinque.',
      en: '"47 times 53?" In a timed test you have six seconds. They are symmetric around 50: 2500 − 9 = 2491, with five seconds to spare.',
    },
    lezione: {
      it: `
<h3>Il rettangolo che diventa un quadrato</h3>
<p>Disegna un rettangolo 53 × 47. Taglia dal lato lungo una striscia larga 3 e attaccala al lato corto. Ottieni un quadrato 50 × 50 a cui manca un angolino 3 × 3. Quindi:</p>
<div class="esempio">47 × 53 = 50² − 3² = 2500 − 9 = 2491</div>
<p>In formula: (m − d)(m + d) = m² − md + md − d² = m² − d². I due termini in mezzo si cancellano.</p>

<h3>Quando usarlo</h3>
<p>Quando i due numeri hanno una media comoda: un tondo (30, 50, 100) oppure un numero di cui conosci il quadrato. La media è la metà della somma, la distanza è la metà della differenza.</p>
<div class="esempio">38 × 42 = 40² − 2² = 1596<br>96 × 104 = 100² − 4² = 9984<br>33 × 37 = 35² − 2² = 1225 − 4 = 1221 (35² = 3 × 4 poi 25)</div>

<h3>Se non sono simmetrici</h3>
<p>Se la somma è dispari, la media non è intera. Sposta di uno e correggi:</p>
<div class="esempio">48 × 53 = 48 × 52 + 48 = (50² − 2²) + 48 = 2496 + 48 = 2544</div>

<h3>Al desk</h3>
<p>Lo stesso trucco spiega perché un su e giù fa perdere soldi: +3% e poi −3% è 1.03 × 0.97 = 1 − 0.03² = 0.9991, cioè −0.09%. La perdita è il quadrato della mossa, ed è per questo che la volatilità costa a chi tiene la posizione senza coprirla.</p>
`,
      en: `
<h3>The rectangle that becomes a square</h3>
<p>Draw a 53 × 47 rectangle. Cut a strip 3 wide off the long side and stick it onto the short side. You get a 50 × 50 square with a 3 × 3 corner missing. So:</p>
<div class="esempio">47 × 53 = 50² − 3² = 2500 − 9 = 2491</div>
<p>As a formula: (m − d)(m + d) = m² − md + md − d² = m² − d². The two middle terms cancel.</p>

<h3>When to use it</h3>
<p>When the two numbers have a convenient midpoint: a round number (30, 50, 100) or a number whose square you know. The midpoint is half the sum, the distance is half the difference.</p>
<div class="esempio">38 × 42 = 40² − 2² = 1596<br>96 × 104 = 100² − 4² = 9984<br>33 × 37 = 35² − 2² = 1225 − 4 = 1221 (35² = 3 × 4 then 25)</div>

<h3>If they are not symmetric</h3>
<p>If the sum is odd, the midpoint is not a whole number. Shift by one and correct:</p>
<div class="esempio">48 × 53 = 48 × 52 + 48 = (50² − 2²) + 48 = 2496 + 48 = 2544</div>

<h3>On the desk</h3>
<p>The same trick explains why going up and down loses money: +3% then −3% is 1.03 × 0.97 = 1 − 0.03² = 0.9991, that is −0.09%. The loss is the square of the move, and that is why volatility costs whoever holds the position without hedging it.</p>
`,
    },
    scheda: {
      it: '(m − d)(m + d) = m² − d²: media e distanza, poi quadrato meno quadrato. Somma dispari: sposta di uno e correggi. Su e giù del x%: −x².',
      en: '(m − d)(m + d) = m² − d²: midpoint and distance, then square minus square. Odd sum: shift by one and correct. Up and down by x%: −x².',
    },
    fonti: [P.fonte('crack', 'Question 1.88', { nota: { it: 'la stessa domanda, 21 × 19', en: 'the same question, 21 × 19' } })],
    test: true,
    nomiLivelli: { it: ['Simmetrici', 'Quadrati in 5 e rendimenti', 'Asimmetrici'], en: ['Symmetric', 'Squares ending in 5 and returns', 'Asymmetric'] },
    livelli: [
      simmetrici,
      () => P.pesato([[0.6, centroIn5], [0.4, suEGiu]])(),
      () => P.pesato([[0.65, asimmetrici], [0.35, decimali]])(),
    ],
  });
})();
