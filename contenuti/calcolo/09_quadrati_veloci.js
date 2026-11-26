(function () {
  'use strict';
  const P = Palestra;

  const due = n => String(n).padStart(2, '0');

  function finaleIn5() {
    const t = P.int(1, 11), n = 10 * t + 5, v = n * n;
    return {
      testo: `<span class="num">${n}²</span>`,
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`Finisce per 5: prendi ${t}, moltiplicalo per il numero dopo e scrivi 25 in fondo.`, `It ends in 5: take ${t}, multiply it by the next number and write 25 at the end.`),
        `${t} × ${t + 1} = ${t * (t + 1)}.`,
      ],
      soluzione: [`${t} × ${t + 1} = ${t * (t + 1)}`, P.t(`poi 25: ${P.fmt(v)}`, `then 25: ${P.fmt(v)}`)],
    };
  }

  function vicino50() {
    let d; do { d = P.int(-9, 9); } while (d === 0 || d === 5 || d === -5);
    const n = 50 + d, v = n * n;
    return {
      testo: `<span class="num">${n}²</span>`,
      risposta: P.numero(v),
      suggerimenti: [
        P.t('Vicino a 50: (50 + d)² = 2500 + 100·d + d². Le prime cifre sono 25 + d, le ultime due d².', 'Near 50: (50 + d)² = 2500 + 100·d + d². The first digits are 25 + d, the last two d².'),
        P.t(`d = ${d}: 25 ${P.piuMeno(d)} = ${25 + d}, e d² = ${d * d}, cioè ${due(d * d)}.`, `d = ${d}: 25 ${P.piuMeno(d)} = ${25 + d}, and d² = ${d * d}, written ${due(d * d)}.`),
      ],
      soluzione: [
        `d = ${d}`,
        P.t(`prime cifre 25 ${P.piuMeno(d)} = ${25 + d}, ultime due ${due(d * d)}`, `first digits 25 ${P.piuMeno(d)} = ${25 + d}, last two ${due(d * d)}`),
        `${n}² = ${P.fmt(v)}`,
      ],
    };
  }

  function vicino100() {
    let d; do { d = P.int(-9, 9); } while (d === 0);
    const n = 100 + d, v = n * n;
    return {
      testo: `<span class="num">${n}²</span>`,
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`Vicino a 100: (100 + d)² = ${P.fmt(10000)} + 200·d + d². Le prime cifre sono 100 + 2d, le ultime due d².`, `Near 100: (100 + d)² = ${P.fmt(10000)} + 200·d + d². The first digits are 100 + 2d, the last two d².`),
        P.t(`d = ${d}: 100 ${P.piuMeno(2 * d)} = ${100 + 2 * d}, e d² = ${due(d * d)}.`, `d = ${d}: 100 ${P.piuMeno(2 * d)} = ${100 + 2 * d}, and d² = ${due(d * d)}.`),
      ],
      soluzione: [
        P.t(`prime cifre 100 ${P.piuMeno(2 * d)} = ${100 + 2 * d}, ultime due ${due(d * d)}`, `first digits 100 ${P.piuMeno(2 * d)} = ${100 + 2 * d}, last two ${due(d * d)}`),
        `${n}² = ${P.fmt(v)}`,
      ],
    };
  }

  function generico() {
    let n; do { n = P.int(12, 89); } while (n % 10 === 0 || n % 10 === 5 || (n > 40 && n < 60));
    const u = n % 10, sopra = u >= 6;
    const a = sopra ? Math.ceil(n / 10) * 10 : Math.floor(n / 10) * 10, b = n - a, v = n * n;
    return {
      testo: `<span class="num">${n}²</span>`,
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`Scrivi ${n} = ${a} ${P.piuMeno(b)} e usa (a + b)² = a² + 2ab + b².`, `Write ${n} = ${a} ${P.piuMeno(b)} and use (a + b)² = a² + 2ab + b².`),
        P.t(`${a}² = ${a * a}; 2 × ${a} × ${P.fmt(b)} = ${P.fmt(2 * a * b)}; ${P.fmt(b)}² = ${b * b}.`, `${a}² = ${a * a}; 2 × ${a} × ${P.fmt(b)} = ${P.fmt(2 * a * b)}; ${P.fmt(b)}² = ${b * b}.`),
      ],
      soluzione: [`${n} = ${a} ${P.piuMeno(b)}`, `${a * a} ${P.piuMeno(2 * a * b)} + ${b * b} = ${P.fmt(v)}`],
    };
  }

  function varianza() {
    const v = P.pick([10, 12, 15, 16, 18, 20, 24, 25, 30, 35, 40, 45, 50]);
    const s = v / 100, var_ = s * s;
    if (P.chance(0.55)) {
      return {
        testo: P.t(`La vol annua di un titolo è ${v}%. Quanto vale la varianza annua?`, `A stock's annual vol is ${v}%. What is the annual variance?`),
        nota: P.t('in decimale (va bene anche in percentuale)', 'as a decimal (a percentage works too)'),
        risposta: P.numero(var_, { percento: true, mostra: P.fmt(var_) }),
        suggerimenti: [
          P.t(`La varianza è la vol al quadrato, con la vol in decimale: ${P.fmt(s)}².`, `Variance is vol squared, with vol as a decimal: ${P.fmt(s)}².`),
          P.t(`${v}² = ${v * v}; poi quattro posti di virgola.`, `${v}² = ${v * v}; then four decimal places.`),
        ],
        soluzione: [`${P.fmt(s)}² = ${v * v}/${P.fmt(10000)} = ${P.fmt(var_)}`],
      };
    }
    return {
      testo: P.t(`La varianza annua dei rendimenti è ${P.fmt(var_)}. Che vol è?`, `The annual variance of returns is ${P.fmt(var_)}. What vol is that?`),
      nota: P.t('in percentuale', 'as a percentage'),
      risposta: P.numero(s, { percento: true, mostra: v + '%' }),
      suggerimenti: [
        P.t(`Vol = √varianza. ${P.fmt(var_)} = ${v * v}/${P.fmt(10000)}.`, `Vol = √variance. ${P.fmt(var_)} = ${v * v}/${P.fmt(10000)}.`),
        P.t(`√${v * v} = ${v}, √${P.fmt(10000)} = 100.`, `√${v * v} = ${v}, √${P.fmt(10000)} = 100.`),
      ],
      soluzione: [`√(${v * v}/${P.fmt(10000)}) = ${v}/100 = ${v}%`],
    };
  }

  const TERNE = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15], [12, 16, 20], [20, 21, 29]];

  function rischi() {
    if (P.chance(0.6)) {
      const [a, b, c] = P.pick(TERNE), k = P.pick([1, 2, 5, 10]);
      const A = a * k, B = b * k, C = c * k;
      return {
        testo: P.t(`Due posizioni indipendenti hanno un rischio (deviazione standard del P&L) di ${A} e ${B} mila euro. Qual è il rischio delle due insieme?`,
          `Two independent positions have a risk (standard deviation of P&L) of ${A} and ${B} thousand euros. What is the risk of the two together?`),
        nota: P.t('in migliaia di euro', 'in thousands of euros'),
        risposta: P.numero(C, { unita: P.t('mila €', 'thousand €') }),
        suggerimenti: [
          P.t('Con posizioni indipendenti si sommano le varianze, non le deviazioni standard: √(a² + b²).', 'With independent positions you add the variances, not the standard deviations: √(a² + b²).'),
          `${A}² + ${B}² = ${P.fmt(A * A)} + ${P.fmt(B * B)} = ${P.fmt(A * A + B * B)}.`,
        ],
        soluzione: [
          `${P.fmt(A * A)} + ${P.fmt(B * B)} = ${P.fmt(A * A + B * B)}`,
          `√${P.fmt(A * A + B * B)} = ${C}`,
          P.t(`non ${A + B}: la diversificazione toglie ${A + B - C}`, `not ${A + B}: diversification takes off ${A + B - C}`),
        ],
      };
    }
    const [a, b, c] = P.pick([[30, 40, 50], [12, 16, 20], [24, 32, 40], [15, 20, 25], [36, 48, 60], [18, 24, 30]]);
    const v = c / 2 / 100;
    return {
      testo: P.t(`Metti metà del capitale in un titolo con vol ${a}% e metà in uno con vol ${b}%, indipendenti. Che vol ha il portafoglio?`,
        `You put half your capital in a stock with ${a}% vol and half in one with ${b}% vol, independent. What is the portfolio's vol?`),
      nota: P.t('in percentuale', 'as a percentage'),
      risposta: P.numero(v, { percento: true, mostra: P.pct(v) }),
      suggerimenti: [
        P.t('Varianza del portafoglio = (½)²·σ₁² + (½)²·σ₂², quindi vol = ½·√(σ₁² + σ₂²).', 'Portfolio variance = (½)²·σ₁² + (½)²·σ₂², so vol = ½·√(σ₁² + σ₂²).'),
        `√(${a}² + ${b}²) = √${P.fmt(a * a + b * b)} = ${c}.`,
      ],
      soluzione: [`√(${P.fmt(a * a)} + ${P.fmt(b * b)}) = ${c}`, P.t(`metà: ${P.fmt(c / 2)}%`, `half: ${P.fmt(c / 2)}%`)],
    };
  }

  P.trucco({
    id: 'potenze-quadrati',
    materia: 'calcolo',
    capitolo: 'powers',
    numero: 9,
    titolo: { it: 'Quadrati veloci', en: 'Fast squares' },
    sottotitolo: {
      it: '65² = 4225, 47² = 2209, 97² = 9409: tre schemi, e dalla vol alla varianza in un passo.',
      en: '65² = 4225, 47² = 2209, 97² = 9409: three patterns, and from vol to variance in one step.',
    },
    aggancio: {
      it: 'La vol è al 35%: la varianza è 0.35² = 0.1225. Al desk si passa da vol a varianza e ritorno di continuo, e due rischi da 30 e 40 non fanno 70 ma 50.',
      en: 'Vol is at 35%: variance is 0.35² = 0.1225. On the desk you go from vol to variance and back all the time, and two risks of 30 and 40 don\'t make 70 but 50.',
    },
    lezione: {
      it: `
<h3>Finali in 5</h3>
<p>Per un numero che finisce per 5, prendi quello che c'è davanti al 5, moltiplicalo per il numero successivo e scrivi 25 in fondo.</p>
<div class="esempio">65²: 6 × 7 = 42 → 4225<br>115²: 11 × 12 = 132 → 13,225</div>
<p>Perché: (10n + 5)² = 100n² + 100n + 25 = 100·n(n + 1) + 25.</p>

<h3>Vicino a 50</h3>
<p>(50 + d)² = 2500 + 100d + d². Le prime cifre sono 25 + d, le ultime due sono d².</p>
<div class="esempio">53²: 25 + 3 = 28, 3² = 09 → 2809<br>47²: 25 − 3 = 22, 3² = 09 → 2209</div>

<h3>Vicino a 100</h3>
<p>(100 + d)² = 10,000 + 200d + d². Le prime cifre sono 100 + 2d, le ultime due sono d².</p>
<div class="esempio">97²: 100 − 6 = 94, 3² = 09 → 9409<br>104²: 100 + 8 = 108, 4² = 16 → 10,816</div>

<h3>Tutti gli altri</h3>
<p>(a + b)² = a² + 2ab + b², con a la decina più vicina. Se l'unità è 6 o più, parti dalla decina sopra e togli.</p>
<div class="esempio">43² = 1600 + 240 + 9 = 1849<br>38² = (40 − 2)² = 1600 − 160 + 4 = 1444</div>

<h3>Al desk: vol e varianza</h3>
<p>La volatilità è una deviazione standard; la varianza è il suo quadrato. Vol 20% → varianza 0.04. Vol 35% → 0.1225. Al contrario, varianza 0.09 → vol 30%.</p>
<p>Il motivo per cui serve: <b>le varianze di rischi indipendenti si sommano, le deviazioni standard no.</b> Due posizioni indipendenti con rischio 30 e 40 fanno √(900 + 1600) = √2500 = 50, non 70. I 20 che mancano sono la diversificazione.</p>
<div class="trappola">Le terne da riconoscere: 3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29, e i loro multipli (6-8-10, 9-12-15, 12-16-20).</div>
`,
      en: `
<h3>Ending in 5</h3>
<p>For a number ending in 5, take what comes before the 5, multiply it by the next number and write 25 at the end.</p>
<div class="esempio">65²: 6 × 7 = 42 → 4225<br>115²: 11 × 12 = 132 → 13,225</div>
<p>Why: (10n + 5)² = 100n² + 100n + 25 = 100·n(n + 1) + 25.</p>

<h3>Near 50</h3>
<p>(50 + d)² = 2500 + 100d + d². The first digits are 25 + d, the last two are d².</p>
<div class="esempio">53²: 25 + 3 = 28, 3² = 09 → 2809<br>47²: 25 − 3 = 22, 3² = 09 → 2209</div>

<h3>Near 100</h3>
<p>(100 + d)² = 10,000 + 200d + d². The first digits are 100 + 2d, the last two are d².</p>
<div class="esempio">97²: 100 − 6 = 94, 3² = 09 → 9409<br>104²: 100 + 8 = 108, 4² = 16 → 10,816</div>

<h3>All the others</h3>
<p>(a + b)² = a² + 2ab + b², with a the nearest ten. If the units digit is 6 or more, start from the ten above and subtract.</p>
<div class="esempio">43² = 1600 + 240 + 9 = 1849<br>38² = (40 − 2)² = 1600 − 160 + 4 = 1444</div>

<h3>On the desk: vol and variance</h3>
<p>Volatility is a standard deviation; variance is its square. Vol 20% → variance 0.04. Vol 35% → 0.1225. The other way, variance 0.09 → vol 30%.</p>
<p>Why it matters: <b>the variances of independent risks add up, standard deviations don't.</b> Two independent positions with risk 30 and 40 make √(900 + 1600) = √2500 = 50, not 70. The missing 20 is diversification.</p>
<div class="trappola">Triples to recognise: 3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29, and their multiples (6-8-10, 9-12-15, 12-16-20).</div>
`,
    },
    scheda: {
      it: 'Finale in 5: n × (n + 1) poi 25. Vicino a 50: (25 + d) poi d². Vicino a 100: (100 + 2d) poi d². Altri: a² + 2ab + b². Varianza = vol²; rischi indipendenti: √(a² + b²).',
      en: 'Ending in 5: n × (n + 1) then 25. Near 50: (25 + d) then d². Near 100: (100 + 2d) then d². Others: a² + 2ab + b². Variance = vol²; independent risks: √(a² + b²).',
    },
    test: true,
    nomiLivelli: { it: ['Quadrati', 'Vol e varianza', 'Rischi indipendenti'], en: ['Squares', 'Vol and variance', 'Independent risks'] },
    livelli: [
      () => P.pesato([[0.3, finaleIn5], [0.25, vicino50], [0.2, vicino100], [0.25, generico]])(),
      varianza,
      rischi,
    ],
  });
})();
