(function () {
  'use strict';
  const P = Palestra;
  const F = {
    auto: P.fonte('crack', 'Question 4.54'),
    incontro: P.fonte('zhou', '§4.4, "Meeting probability"'),
    incontroCrack: P.fonte('crack', 'Question 4.45', { nota: { it: 'lo stesso appuntamento, un quarto d\'ora di attesa', en: 'the same meeting, a quarter of an hour of waiting' } }),
    massimo: P.fonte('zhou', '§4.6, "Expected value of max and min"'),
    bastone: P.fonte('zhou', '§4.4, "Probability of triangle"'),
    bastoneCrack: P.fonte('crack', 'Questions 4.40 and 4.41', { nota: { it: 'il triangolo e il pezzo più lungo', en: 'the triangle and the longest piece' } }),
  };
  const ridotta = (a, b) => { const g = P.mcd(a, b); return `${a / g}/${b / g}`; };

  // "No car in an hour" is "no car in the first half hour and none in the second": 1 − q = (1 − x)²
  function auto() {
    const [q, x] = P.pick([[0.36, 0.2], [0.19, 0.1], [0.51, 0.3], [0.64, 0.4], [0.75, 0.5], [0.84, 0.6], [0.91, 0.7]]);
    const doppio = P.chance(0.3), v = doppio ? 1 - (1 - q) ** 2 : x;
    return {
      testo: doppio
        ? P.t(`Sei fermo in auto nel deserto. La probabilità di vedere passare almeno un'auto in un'ora è ${P.pct(q, 0)}. E in due ore?`, `Your car has broken down in the desert. The chance of seeing at least one car go by in an hour is ${P.pct(q, 0)}. And in two hours?`)
        : P.t(`Sei fermo in auto nel deserto. La probabilità di vedere passare almeno un'auto in un'ora è ${P.pct(q, 0)}. E nella prossima mezz'ora?`, `Your car has broken down in the desert. The chance of seeing at least one car go by in an hour is ${P.pct(q, 0)}. And in the next half hour?`),
      nota: P.t('le auto passano a caso, senza memoria', 'cars come at random, with no memory'),
      risposta: P.numero(v, { percento: true, tol: 0.003, mostra: P.pct(v, 2) }),
      suggerimenti: [
        P.t('Lavora con "nessuna auto": in un\'ora è 1 − ' + P.fmt(q) + ' = ' + P.fmt(1 - q) + '.', 'Work with "no car": in an hour it is 1 − ' + P.fmt(q) + ' = ' + P.fmt(1 - q) + '.'),
        doppio ? P.t('Due ore senza auto sono due ore indipendenti senza auto: eleva al quadrato.', 'Two hours with no car are two independent hours with no car: square it.')
          : P.t('Un\'ora senza auto sono due mezz\'ore indipendenti senza auto: prendi la radice.', 'An hour with no car is two independent half hours with no car: take the square root.'),
      ],
      soluzione: doppio ? [`${P.fmt(1 - q)}² = ${P.fmt((1 - q) ** 2, 4)}`, `1 − ${P.fmt((1 - q) ** 2, 4)} = ${P.pct(v, 2)}`] : [`√${P.fmt(1 - q)} = ${P.fmt(1 - x)}`, `1 − ${P.fmt(1 - x)} = ${P.pct(x, 0)}`],
      fonte: F.auto,
    };
  }

  // Two arrivals uniform over T minutes meet if they are within w: 1 − ((T − w)/T)²
  function incontro() {
    const T = 60, w = P.pick([5, 10, 12, 15, 20, 30]), a = T - w, num = T * T - a * a, v = num / (T * T);
    return {
      testo: P.t(`Tu e un amico arrivate alla stazione in un momento a caso fra le 13 e le 14, indipendenti. Ognuno aspetta l'altro ${w} minuti, poi se ne va (e nessuno resta dopo le 14). Con che probabilità vi incontrate?`,
        `You and a friend each reach the station at a random time between 1 and 2 pm, independently. Each waits ${w} minutes for the other, then leaves (and nobody stays past 2). What is the probability that you meet?`),
      nota: P.t('una frazione o tre decimali', 'a fraction or three decimals'),
      risposta: P.numero(v, { tol: 0.0015, mostra: ridotta(num, T * T) }),
      suggerimenti: [
        P.t('Disegna il quadrato 60 × 60 degli orari di arrivo: vi incontrate quando |x − y| ≤ ' + w + ', una striscia lungo la diagonale.', 'Draw the 60 × 60 square of arrival times: you meet when |x − y| ≤ ' + w + ', a band along the diagonal.'),
        P.t(`Fuori dalla striscia restano due triangoli che insieme fanno un quadrato di lato ${a}.`, `Outside the band there are two triangles that together make a square of side ${a}.`),
      ],
      soluzione: [`1 − (${a}/60)² = (3600 − ${a * a}) / 3600 = ${ridotta(num, T * T)}`, `≈ ${P.fmt(Math.round(v * 1000) / 1000)}`],
      fonte: P.chance(0.5) ? F.incontro : F.incontroCrack,
    };
  }

  // n uniform points split [0, L] into n + 1 gaps of the same expected length
  function massimo() {
    const n = P.int(2, 6), L = P.pick([1, 10, 60, 100]), max = P.chance(0.6), v = max ? n * L / (n + 1) : L / (n + 1);
    return {
      testo: P.t(`Estrai ${n} numeri a caso, indipendenti e uniformi fra 0 e ${L}. Qual è il valore atteso del ${max ? 'più grande' : 'più piccolo'}?`,
        `You draw ${n} random numbers, independent and uniform between 0 and ${L}. What is the expected value of the ${max ? 'largest' : 'smallest'}?`),
      nota: P.t('due decimali', 'two decimals'),
      risposta: P.numero(v, { tol: 0.006, mostra: P.fmt(Math.round(v * 100) / 100) }),
      suggerimenti: [
        P.t(`${n} punti dividono l'intervallo in ${n + 1} pezzi, e per simmetria i pezzi hanno tutti la stessa lunghezza media.`, `${n} points cut the interval into ${n + 1} pieces, and by symmetry the pieces all have the same average length.`),
        P.t(`Ogni pezzo vale in media ${L}/${n + 1}. ${max ? `Il più grande sta prima dell'ultimo pezzo` : 'Il più piccolo sta dopo il primo pezzo'}.`, `Each piece is ${L}/${n + 1} on average. ${max ? 'The largest sits before the last piece' : 'The smallest sits after the first piece'}.`),
      ],
      soluzione: [max ? `${n} × ${L} / ${n + 1} = ${P.fmt(Math.round(v * 100) / 100)}` : `${L} / ${n + 1} = ${P.fmt(Math.round(v * 100) / 100)}`],
      fonte: F.massimo,
    };
  }

  // A stick broken at two uniform points: triangle 1/4; shortest L/9, middle 5L/18, longest 11L/18
  function bastone() {
    const L = P.pick([1, 18, 36, 90]), cosa = P.pick(['triangolo', 'triangolo', 'lungo', 'corto']);
    const v = cosa === 'triangolo' ? 0.25 : cosa === 'lungo' ? 11 * L / 18 : L / 9;
    const domanda = {
      triangolo: P.t('Con che probabilità i tre pezzi formano un triangolo?', 'What is the probability that the three pieces form a triangle?'),
      lungo: P.t('Quanto è lungo in media il pezzo più lungo?', 'How long is the longest piece on average?'),
      corto: P.t('Quanto è lungo in media il pezzo più corto?', 'How long is the shortest piece on average?'),
    }[cosa];
    return {
      testo: P.t(`Rompi un bastone lungo ${L} in due punti scelti a caso, indipendenti e uniformi. ${domanda}`, `You break a stick of length ${L} at two points chosen at random, independent and uniform. ${domanda}`),
      nota: cosa === 'triangolo' ? P.t('una frazione va bene', 'a fraction is fine') : P.t('due decimali', 'two decimals'),
      risposta: cosa === 'triangolo' ? P.numero(v, { tol: 0.0015, mostra: '1/4' }) : P.numero(v, { tol: 0.006, mostra: P.fmt(Math.round(v * 100) / 100) }),
      suggerimenti: cosa === 'triangolo' ? [
        P.t('Tre pezzi fanno un triangolo se nessuno supera metà bastone.', 'Three pieces make a triangle if none is longer than half the stick.'),
        P.t('Nel quadrato dei due punti di rottura, la regione buona è fatta da due triangoli che insieme valgono un quarto dell\'area.', 'In the square of the two break points, the good region is two triangles that together make a quarter of the area.'),
      ] : [
        P.t('Il più corto: la probabilità che tutti i pezzi superino x è (1 − 3x)², per x fino a 1/3 del bastone. Integra.', 'The shortest: the chance that every piece exceeds x is (1 − 3x)², for x up to a third of the stick. Integrate.'),
        P.t('Per un bastone lungo 1: corto 1/9, medio 5/18, lungo 11/18 (la somma fa 1).', 'For a stick of length 1: shortest 1/9, middle 5/18, longest 11/18 (they add up to 1).'),
      ],
      soluzione: cosa === 'triangolo' ? [P.t('ogni pezzo sotto ½: due triangoli di area 1/8', 'every piece under ½: two triangles of area 1/8'), '1/8 + 1/8 = 1/4']
        : [cosa === 'lungo' ? `11/18 × ${L} = ${P.fmt(Math.round(v * 100) / 100)}` : `${L} / 9 = ${P.fmt(Math.round(v * 100) / 100)}`],
      fonte: cosa === 'triangolo' ? F.bastone : F.bastoneCrack,
    };
  }

  P.trucco({
    id: 'prob-area',
    materia: 'probabilita',
    capitolo: 'continua',
    numero: 6,
    titolo: { it: 'La probabilità come area', en: 'Probability as area' },
    sottotitolo: {
      it: 'Con due tempi o due punti a caso, disegna il quadrato e misura la regione buona. Più: il "nessuno" che si moltiplica, i pezzi tutti uguali in media.',
      en: 'With two random times or points, draw the square and measure the good region. Plus: "none" that multiplies, pieces that are all alike on average.',
    },
    aggancio: {
      it: '«Ci vediamo fra l\'una e le due, ognuno aspetta un quarto d\'ora. Probabilità di incontrarci?» Si risponde con un disegno: un quadrato, una striscia, due triangoli.',
      en: '"We meet between one and two, each waits a quarter of an hour. Chance we meet?" The answer is a drawing: a square, a band, two triangles.',
    },
    lezione: {
      it: `
<h3>Due variabili uniformi: un quadrato</h3>
<p>Quando due cose succedono in un momento a caso, metti un orario su ogni asse: tutte le coppie riempiono un quadrato, e la probabilità di un evento è l'area della sua regione divisa per l'area del quadrato.</p>
<div class="esempio">Arrivi fra 0 e 60 minuti, attesa 15: ci si incontra se |x − y| ≤ 15.<br>Fuori restano due triangoli che insieme fanno 45 × 45: 1 − (45/60)² = 7/16.</div>

<h3>"Nessuno" si moltiplica</h3>
<p>Per eventi che arrivano a caso e senza memoria, conviene ragionare su "nessun arrivo": un'ora senza auto sono due mezz'ore indipendenti senza auto. Se in un'ora la probabilità di almeno un'auto è 36%, "nessuna" è 64% = 0.8²: in mezz'ora "almeno una" vale 20%.</p>

<h3>Pezzi uguali in media</h3>
<p>n punti uniformi in [0, 1] tagliano n + 1 pezzi che, per simmetria, hanno la stessa lunghezza media 1/(n + 1). Il più grande sta in media a n/(n + 1), il più piccolo a 1/(n + 1). Con un bastone rotto in due punti: tre pezzi fanno un triangolo con probabilità 1/4 (nessuno deve superare metà), e in media il più corto è 1/9, il più lungo 11/18.</p>

<div class="trappola">Nell'incontro non dimenticare che si vincono anche gli arrivi vicini al bordo: la regione buona è la striscia intera intorno alla diagonale, non un rettangolo. E per le auto non dividere 36% per due: le probabilità di "almeno uno" non si dividono, quelle di "nessuno" si moltiplicano.</div>
`,
      en: `
<h3>Two uniform variables: a square</h3>
<p>When two things happen at a random time, put one time on each axis: all the pairs fill a square, and the probability of an event is the area of its region divided by the area of the square.</p>
<div class="esempio">Arrivals between 0 and 60 minutes, waiting 15: you meet if |x − y| ≤ 15.<br>Outside are two triangles that together make 45 × 45: 1 − (45/60)² = 7/16.</div>

<h3>"None" multiplies</h3>
<p>For events that arrive at random with no memory, reason about "no arrival": an hour with no car is two independent half hours with no car. If the chance of at least one car in an hour is 36%, "none" is 64% = 0.8²: in half an hour "at least one" is 20%.</p>

<h3>Pieces alike on average</h3>
<p>n uniform points in [0, 1] cut n + 1 pieces which, by symmetry, have the same average length 1/(n + 1). The largest sits on average at n/(n + 1), the smallest at 1/(n + 1). With a stick broken at two points: the three pieces form a triangle with probability 1/4 (none may exceed half), and on average the shortest is 1/9, the longest 11/18.</p>

<div class="trappola">In the meeting, remember that arrivals near the edge count too: the good region is the whole band around the diagonal, not a rectangle. And for the cars do not halve 36%: probabilities of "at least one" do not divide, those of "none" multiply.</div>
`,
    },
    scheda: {
      it: 'Due tempi uniformi: area nel quadrato. Incontro con attesa w su T: 1 − ((T − w)/T)². Nessun arrivo si moltiplica: mezz\'ora = 1 − √(1 − q). n uniformi: massimo n/(n + 1), minimo 1/(n + 1). Bastone: triangolo 1/4, pezzi medi 1/9, 5/18, 11/18.',
      en: 'Two uniform times: area in the square. Meeting with wait w over T: 1 − ((T − w)/T)². No arrivals multiply: half an hour = 1 − √(1 − q). n uniforms: max n/(n + 1), min 1/(n + 1). Stick: triangle 1/4, average pieces 1/9, 5/18, 11/18.',
    },
    fonti: [F.auto, F.incontro, F.incontroCrack, F.massimo, F.bastone, F.bastoneCrack],
    test: false,
    nomiLivelli: { it: ['Nessun arrivo', 'Incontri e massimi', 'Il bastone rotto'], en: ['No arrivals', 'Meetings and maxima', 'The broken stick'] },
    livelli: [auto, () => (P.chance(0.55) ? incontro() : massimo()), bastone],
  });
})();
