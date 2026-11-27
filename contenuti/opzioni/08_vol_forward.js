(function () {
  'use strict';
  const P = Palestra;

  // right triangles, so that the square roots come out whole
  const TERNE = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [1.5, 2, 2.5]];
  // normal daily move d over n quiet days, plus an event day e: total t (all exact)
  const EVENTI = [[1.5, 4, 4, 5], [2, 4, 3, 5], [1, 9, 4, 5], [2, 9, 8, 10], [3, 4, 8, 10], [1, 16, 3, 5], [2, 5, 4, 6], [1, 12, 2, 4], [2, 12, 4, 8], [1.5, 20, 6, 9]];

  function somma() {
    const [a, b, c] = P.pick(TERNE), su = P.chance(0.5);
    if (su) {
      return {
        testo: P.t(`Due periodi indipendenti: nel primo il titolo ha una deviazione standard ${P.del(P.fmt(a))}%, nel secondo ${P.del(P.fmt(b))}%. Qual è la deviazione standard sui due periodi insieme?`,
          `Two independent periods: in the first the stock has a standard deviation of ${P.fmt(a)}%, in the second of ${P.fmt(b)}%. What is the standard deviation over both together?`),
        nota: P.t('in percentuale', 'as a percentage'),
        risposta: P.numero(c / 100, { percento: true, rel: 0.01, mostra: P.pct(c / 100) }),
        suggerimenti: [
          P.t('Si sommano le varianze, non le deviazioni standard: √(a² + b²).', 'Variances add, standard deviations do not: √(a² + b²).'),
          `${P.fmt(a)}² + ${P.fmt(b)}² = ${P.fmt(a * a)} + ${P.fmt(b * b)} = ${P.fmt(c * c)}.`,
        ],
        soluzione: [`√(${P.fmt(a * a)} + ${P.fmt(b * b)}) = √${P.fmt(c * c)} = ${P.fmt(c)}%`],
      };
    }
    return {
      testo: P.t(`Su due periodi indipendenti la deviazione standard totale è ${P.del(P.fmt(c))}%. Nel primo è ${P.del(P.fmt(a))}%. E nel secondo?`,
        `Over two independent periods the total standard deviation is ${P.fmt(c)}%. In the first it is ${P.fmt(a)}%. What about the second?`),
      nota: P.t('in percentuale', 'as a percentage'),
      risposta: P.numero(b / 100, { percento: true, rel: 0.01, mostra: P.pct(b / 100) }),
      suggerimenti: [
        P.t('Varianza totale = somma delle varianze: togli quella del primo periodo.', 'Total variance = sum of the variances: take away the first period\'s.'),
        `${P.fmt(c)}² − ${P.fmt(a)}² = ${P.fmt(c * c)} − ${P.fmt(a * a)} = ${P.fmt(b * b)}.`,
      ],
      soluzione: [`√(${P.fmt(c * c)} − ${P.fmt(a * a)}) = √${P.fmt(b * b)} = ${P.fmt(b)}%`],
    };
  }

  function forward() {
    // T1 = 1 month, T2 = 2 months (or 3 and 6): σf² = (σ2² T2 − σ1² T1) / (T2 − T1)
    const [t1, t2, nome1, nome2] = P.pick([
      [1, 2, P.t('1 mese', '1 month'), P.t('2 mesi', '2 months')],
      [3, 6, P.t('3 mesi', '3 months'), P.t('6 mesi', '6 months')],
      [1, 4, P.t('1 mese', '1 month'), P.t('4 mesi', '4 months')],
    ]);
    const s1 = P.pick([15, 18, 20, 22, 25, 30, 35]), s2 = s1 + P.pick([-4, -3, -2, 2, 3, 4, 5]);
    const varf = (s2 * s2 * t2 - s1 * s1 * t1) / (t2 - t1), v = Math.sqrt(varf);
    if (!(varf > 0)) return forward();
    return {
      testo: P.t(`Vol implicita: ${s1}% a ${nome1}, ${s2}% a ${nome2}. Che vol implicano le opzioni per il periodo fra ${nome1} e ${nome2}?`,
        `Implied vol: ${s1}% to ${nome1}, ${s2}% to ${nome2}. What vol do the options imply for the period between ${nome1} and ${nome2}?`),
      nota: P.t('la vol forward, in percentuale; basta una stima', 'the forward vol, as a percentage; an estimate is enough'),
      risposta: P.numero(v / 100, { percento: true, rel: 0.02, mostra: P.pct(Math.round(v * 10) / 1000) }),
      suggerimenti: [
        P.t('Le varianze totali si sommano nel tempo: σ₂² × T₂ = σ₁² × T₁ + σf² × (T₂ − T₁).', 'Total variances add over time: σ₂² × T₂ = σ₁² × T₁ + σf² × (T₂ − T₁).'),
        `(${s2}² × ${t2} − ${s1}² × ${t1}) / ${t2 - t1} = (${P.fmt(s2 * s2 * t2)} − ${P.fmt(s1 * s1 * t1)}) / ${t2 - t1}.`,
      ],
      soluzione: [`(${P.fmt(s2 * s2 * t2)} − ${P.fmt(s1 * s1 * t1)}) / ${t2 - t1} = ${P.fmt(varf, 1)}`, `√${P.fmt(varf, 1)} ≈ ${P.fmt(Math.round(v * 10) / 10)}%`],
    };
  }

  // Variance adds up over days: one day at σ' instead of σ is worth (σ'² − σ²)/σ² extra days at σ
  function giornoInPiu() {
    const s = P.pick([16, 20, 20, 25, 30]), s2 = s + P.pick([2, 4, 5, 6, 8, 10]), g = P.pick([60, 100, 120, 200]);
    const v = (s2 * s2 - s * s) / (s * s);
    return {
      testo: P.t(`Hai una call europea a ${g} giorni con vol implicita ${s}%. Sai che domani la vol implicita sarà ${s2}% per un giorno, poi torna a ${s}% fino alla scadenza. Di quanti giorni dovrebbe allungarsi la vita dell'opzione, a vol ${s}% costante, per avere lo stesso effetto sul prezzo?`,
        `You hold a ${g}-day European call with implied vol ${s}%. You know that tomorrow implied vol will be ${s2}% for one day, then back to ${s}% until expiry. By how many days would the option's life have to grow, at a constant ${s}% vol, for the same effect on its price?`),
      nota: P.t('in giorni, due decimali', 'in days, two decimals'),
      risposta: P.numero(v, { tol: 0.011, mostra: P.fmt(Math.round(v * 100) / 100) }),
      suggerimenti: [
        P.t('Il prezzo dipende dalla varianza totale fino a scadenza, cioè dalla somma delle varianze giornaliere.', 'The price depends on the total variance up to expiry, that is the sum of the daily variances.'),
        P.t(`Il giorno a ${s2}% aggiunge ${s2}² − ${s}² = ${s2 * s2 - s * s} di varianza (in unità annue); un giorno a ${s}% ne vale ${s * s}.`, `The day at ${s2}% adds ${s2}² − ${s}² = ${s2 * s2 - s * s} of variance (in annual units); a day at ${s}% is worth ${s * s}.`),
      ],
      soluzione: [`(${s2 * s2} − ${s * s}) / ${s * s} = ${P.fmt(Math.round(v * 100) / 100)}`, P.t(`quanti giorni restano non conta: ${g} o un altro numero danno la stessa risposta`, `the days left do not matter: ${g} or any other number gives the same answer`)],
      fonte: P.fonte('crack', 'Question 2.23'),
    };
  }

  // The VIX weights total variances (σ² T), not vols, to reach a constant 30 days
  function vix() {
    const N1 = P.pick([16, 20, 23, 25]), N2 = P.pick([37, 40, 44, 51]), s1 = P.pick([15, 18, 20, 22, 25]), s2 = s1 + P.pick([-2, 1, 2, 3, 4]);
    const w1 = (N2 - 30) / (N2 - N1), w2 = (30 - N1) / (N2 - N1);
    const v30 = (N1 / 365 * (s1 / 100) ** 2 * w1 + N2 / 365 * (s2 / 100) ** 2 * w2) * 365 / 30, v = 100 * Math.sqrt(v30);
    return {
      testo: P.t(`Le opzioni a ${N1} giorni implicano una vol del ${s1}%, quelle a ${N2} giorni del ${s2}%. Come fa il VIX, interpola a 30 giorni costanti. Che vol a 30 giorni ottieni?`,
        `Options with ${N1} days left imply ${s1}% vol, those with ${N2} days ${s2}%. As the VIX does, interpolate to a constant 30 days. What 30-day vol do you get?`),
      nota: P.t('in punti di vol, due decimali', 'in vol points, two decimals'),
      risposta: P.numero(v, { tol: 0.02, mostra: P.fmt(Math.round(v * 100) / 100) }),
      suggerimenti: [
        P.t('Si interpolano le varianze totali, σ² × T, non le vol: è la varianza che si somma nel tempo.', 'Interpolate total variances, σ² × T, not vols: variance is what adds up over time.'),
        P.t(`Pesi: (${N2} − 30)/(${N2} − ${N1}) = ${P.fmt(w1, 3)} sulla prima, (30 − ${N1})/(${N2} − ${N1}) = ${P.fmt(w2, 3)} sulla seconda; poi riporta a 30 giorni e prendi la radice.`, `Weights: (${N2} − 30)/(${N2} − ${N1}) = ${P.fmt(w1, 3)} on the first, (30 − ${N1})/(${N2} − ${N1}) = ${P.fmt(w2, 3)} on the second; then scale to 30 days and take the root.`),
      ],
      soluzione: [
        `[${N1} × ${s1}² × ${P.fmt(w1, 3)} + ${N2} × ${s2}² × ${P.fmt(w2, 3)}] / 30 = ${P.fmt(Math.round(v * v * 10) / 10)}`,
        `√${P.fmt(Math.round(v * v * 10) / 10)} = ${P.fmt(Math.round(v * 100) / 100)}`,
      ],
      fonte: P.fonte('cboeVix', 'Appendix 3, sample calculation'),
    };
  }

  function evento() {
    const [d, n, e, tot] = P.pick(EVENTI), giorni = n + 1;
    return {
      testo: P.t(`Un titolo si muove di solito ${P.del(P.fmt(d))}% al giorno. Le opzioni che scadono fra ${giorni} giorni di borsa, uno dei quali è il giorno dei risultati, implicano un movimento totale ${P.del(P.fmt(tot))}%. Che movimento prezzano per il giorno dei risultati?`,
        `A stock usually moves ${P.fmt(d)}% a day. Options expiring in ${giorni} trading days, one of which is earnings day, imply a total move of ${P.fmt(tot)}%. What move do they price for earnings day?`),
      nota: P.t('tutto in deviazioni standard', 'everything in standard deviations'),
      risposta: P.numero(e / 100, { percento: true, rel: 0.02, mostra: P.pct(e / 100) }),
      suggerimenti: [
        P.t(`Varianza totale = ${n} giorni normali + il giorno dei risultati.`, `Total variance = ${n} normal days + earnings day.`),
        `${P.fmt(tot)}² − ${n} × ${P.fmt(d)}² = ${P.fmt(tot * tot)} − ${P.fmt(n * d * d)}.`,
      ],
      soluzione: [
        P.t(`giorni normali: ${n} × ${P.fmt(d * d)} = ${P.fmt(n * d * d)}`, `normal days: ${n} × ${P.fmt(d * d)} = ${P.fmt(n * d * d)}`),
        `${P.fmt(tot * tot)} − ${P.fmt(n * d * d)} = ${P.fmt(e * e)}`,
        `√${P.fmt(e * e)} = ${P.fmt(e)}%`,
      ],
    };
  }

  P.trucco({
    id: 'opz-vol-forward',
    materia: 'opzioni',
    capitolo: 'volatilita',
    numero: 8,
    titolo: { it: 'Le varianze si sommano', en: 'Variances add up' },
    sottotitolo: {
      it: 'La vol forward fra due scadenze e il movimento prezzato per i risultati, con una sola regola: si sommano le varianze, non le vol.',
      en: 'The forward vol between two expiries and the move priced for earnings, with a single rule: variances add, vols do not.',
    },
    aggancio: {
      it: '«Vol a un mese 20, a due mesi 25. Che vol sta prezzando il mercato per il secondo mese?» Non 30: circa 29. Si sommano le varianze, non le vol.',
      en: '"One-month vol 20, two-month vol 25. What vol is the market pricing for the second month?" Not 30: about 29. Variances add, not vols.',
    },
    lezione: {
      it: `
<h3>La regola</h3>
<p>Se i rendimenti di periodi diversi sono indipendenti, le varianze si sommano. Le deviazioni standard no: si sommano i quadrati, poi si fa la radice, come i lati di un triangolo rettangolo.</p>
<div class="esempio">3% e 4% in due periodi: √(9 + 16) = 5%, non 7%</div>
<p>È la stessa ragione per cui la vol cresce con √T, la base della regola del 16.</p>

<h3>La vol forward</h3>
<p>Una vol implicita a scadenza T ti dice la varianza totale fino a T: σ² × T. La differenza fra due scadenze è la varianza del periodo in mezzo.</p>
<div class="esempio">σ₂² × T₂ = σ₁² × T₁ + σf² × (T₂ − T₁)<br>1 mese 20%, 2 mesi 25%: (625 × 2 − 400) / 1 = 850 → σf ≈ 29.2%</div>
<p>Per la radice: 29² = 841, quindi un po' più di 29. Se la vol forward esce negativa sotto radice, le due vol non sono coerenti: c'è un arbitraggio di calendario.</p>

<h3>Il giorno dei risultati</h3>
<p>Prima dei risultati la vol a breve sale perché dentro c'è un giorno speciale. Separalo: varianza totale = giorni normali + giorno dell'evento.</p>
<div class="esempio">titolo che si muove dell'1.5% al giorno; opzioni a 5 giorni con dentro i risultati implicano il 5% in tutto<br>giorni normali: 4 × 2.25 = 9 · evento: 25 − 9 = 16 → 4%</div>
<p>Il 4% è la mossa che il mercato prezza per quel giorno. Se pensi che sarà più grande, compri le opzioni a breve; se più piccola, le vendi.</p>

<div class="trappola">Le vol implicite si danno annualizzate: prima di sommare, moltiplica ogni varianza per il suo tempo. Sommare le vol, o le varianze senza pesarle per il tempo, è l'errore che la domanda cerca.</div>
`,
      en: `
<h3>The rule</h3>
<p>If returns over different periods are independent, variances add. Standard deviations do not: you add the squares, then take the root, like the sides of a right triangle.</p>
<div class="esempio">3% and 4% over two periods: √(9 + 16) = 5%, not 7%</div>
<p>It is the same reason vol grows with √T, the basis of the rule of 16.</p>

<h3>Forward vol</h3>
<p>An implied vol to expiry T tells you the total variance up to T: σ² × T. The difference between two expiries is the variance of the period in between.</p>
<div class="esempio">σ₂² × T₂ = σ₁² × T₁ + σf² × (T₂ − T₁)<br>1 month 20%, 2 months 25%: (625 × 2 − 400) / 1 = 850 → σf ≈ 29.2%</div>
<p>For the root: 29² = 841, so a little more than 29. If the forward variance comes out negative, the two vols are not consistent: there is a calendar arbitrage.</p>

<h3>Earnings day</h3>
<p>Before earnings, short-dated vol rises because a special day is inside it. Split it out: total variance = normal days + event day.</p>
<div class="esempio">a stock that moves 1.5% a day; 5-day options that include earnings imply 5% in all<br>normal days: 4 × 2.25 = 9 · event: 25 − 9 = 16 → 4%</div>
<p>That 4% is the move the market prices for that day. If you think it will be bigger, you buy the short-dated options; if smaller, you sell them.</p>

<div class="trappola">Implied vols are quoted annualised: before adding, multiply each variance by its time. Adding vols, or adding variances without weighting them by time, is the mistake the question is looking for.</div>
`,
    },
    scheda: {
      it: 'Si sommano le varianze: √(a² + b²). Vol forward: σf² = (σ₂²T₂ − σ₁²T₁)/(T₂ − T₁). Giorno dei risultati: varianza totale − giorni normali × d², poi la radice.',
      en: 'Variances add: √(a² + b²). Forward vol: σf² = (σ₂²T₂ − σ₁²T₁)/(T₂ − T₁). Earnings day: total variance − normal days × d², then the root.',
    },
    fonti: [
      P.fonte('crack', 'Question 2.23'),
      P.fonte('cboeVix', 'Appendix 3, sample calculation', { nota: { it: 'come il VIX interpola due scadenze a 30 giorni', en: 'how the VIX interpolates two expiries to 30 days' } }),
    ],
    test: false,
    nomiLivelli: { it: ['Somma', 'Vol forward', 'Giorno dei risultati'], en: ['Adding up', 'Forward vol', 'Earnings day'] },
    livelli: [somma, () => (P.chance(0.65) ? forward() : giornoInPiu()), () => (P.chance(0.65) ? evento() : vix())],
  });
})();
