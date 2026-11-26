(function () {
  'use strict';
  const P = Palestra;

  function giornaliero() {
    const v = P.pick([8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80]), x = v / 16 / 100;
    return {
      testo: P.t(`La vol implicita di un titolo è ${v}%. Di quanto ti aspetti che si muova in un giorno?`, `A stock's implied vol is ${v}%. How much do you expect it to move in a day?`),
      nota: P.t('una deviazione standard, in percentuale', 'one standard deviation, as a percentage'),
      risposta: P.numero(x, { percento: true, rel: 0.02, mostra: P.pct(x) }),
      suggerimenti: [
        P.t('Un anno ha circa 252 giorni di borsa e √252 ≈ 16. Movimento giornaliero = vol annua / 16.', 'A year has about 252 trading days and √252 ≈ 16. Daily move = annual vol / 16.'),
        P.t(`16 = 2 × 8: ${v}/2 = ${v / 2}, poi diviso 8.`, `16 = 2 × 8: ${v}/2 = ${v / 2}, then divide by 8.`),
      ],
      soluzione: [P.t(`${v}% / 16 = ${P.pct(x)} al giorno`, `${v}% / 16 = ${P.pct(x)} a day`)],
    };
  }

  function inEuro() {
    const S = P.pick([50, 80, 100, 120, 160, 200, 240, 400]), v = P.pick([16, 20, 24, 32, 40, 48]);
    const x = v / 16, m = S * x / 100;
    return {
      testo: P.t(`Un titolo quota ${S} € con vol implicita ${v}%. Di quanti euro ti aspetti che si muova in un giorno?`, `A stock trades at ${S} € with implied vol ${v}%. How many euros do you expect it to move in a day?`),
      nota: P.t('una deviazione standard', 'one standard deviation'),
      risposta: P.numero(m, { rel: 0.03, unita: '€', mostra: P.fmt(m, 2) }),
      suggerimenti: [
        P.t(`Prima la percentuale: ${v}/16 = ${P.fmt(x)}%.`, `Percentage first: ${v}/16 = ${P.fmt(x)}%.`),
        P.t(`${P.fmt(x)}% di ${S} = ${P.fmt(S / 100)} × ${P.fmt(x)}.`, `${P.fmt(x)}% of ${S} = ${P.fmt(S / 100)} × ${P.fmt(x)}.`),
      ],
      soluzione: [
        P.t(`${v}/16 = ${P.fmt(x)}% al giorno`, `${v}/16 = ${P.fmt(x)}% a day`),
        P.t(`${P.fmt(x)}% di ${S} = ${P.fmt(m, 2)} €`, `${P.fmt(x)}% of ${S} = ${P.fmt(m, 2)} €`),
      ],
    };
  }

  function inverso() {
    const x = P.pick([0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3]), v = 16 * x / 100;
    return {
      testo: P.t(`Un titolo si muove di circa ${P.fmt(x)}% al giorno. Che vol annua implica?`, `A stock moves about ${P.fmt(x)}% a day. What annual vol does that imply?`),
      nota: P.t('in percentuale', 'as a percentage'),
      risposta: P.numero(v, { percento: true, rel: 0.03, mostra: P.pct(v) }),
      suggerimenti: [
        P.t('Al contrario: vol annua = movimento giornaliero × 16.', 'The other way round: annual vol = daily move × 16.'),
        `${P.fmt(x)} × 16 = ${P.fmt(x)} × 10 + ${P.fmt(x)} × 6.`,
      ],
      soluzione: [`${P.fmt(x)}% × 16 = ${P.pct(v)}`],
    };
  }

  function radiceDelTempo() {
    const x = P.pick([0.5, 1, 1.5, 2]), n = P.pick([4, 9, 16, 25]), r = Math.sqrt(n), v = x * r / 100;
    return {
      testo: P.t(`Un titolo ha una vol giornaliera ${{ 0.5: 'dello 0.5', 1: "dell'1", 1.5: "dell'1.5", 2: 'del 2' }[x]}%. Quanto ti aspetti che si muova in ${n} giorni?`,
        `A stock has a daily vol of ${P.fmt(x)}%. How much do you expect it to move in ${n} days?`),
      nota: P.t('una deviazione standard, in percentuale', 'one standard deviation, as a percentage'),
      risposta: P.numero(v, { percento: true, mostra: P.pct(v) }),
      suggerimenti: [
        P.t('I giorni sono indipendenti: le varianze si sommano, quindi la deviazione standard cresce con la radice del tempo.',
          'Days are independent: the variances add up, so the standard deviation grows with the square root of time.'),
        `√${n} = ${r}: ${P.fmt(x)}% × ${r}.`,
      ],
      soluzione: [
        P.t(`varianza × ${n}, deviazione standard × √${n} = ${r}`, `variance × ${n}, standard deviation × √${n} = ${r}`),
        `${P.fmt(x)}% × ${r} = ${P.pct(v)}`,
      ],
    };
  }

  function settimana() {
    const v = P.pick([18, 36, 54, 72]), x = v / 7.2 / 100;
    return {
      testo: P.t(`Vol annua ${v}%. Di quanto ti aspetti che si muova il titolo in una settimana?`, `Annual vol ${v}%. How much do you expect the stock to move in a week?`),
      nota: P.t('una deviazione standard, in percentuale', 'one standard deviation, as a percentage'),
      risposta: P.numero(x, { percento: true, rel: 0.05, mostra: P.pct(x, 1) }),
      suggerimenti: [
        P.t('Una settimana è 1/52 di anno: dividi per √52.', 'A week is 1/52 of a year: divide by √52.'),
        P.t(`√52 ≈ ${P.fmt(7.2)} (perché ${P.fmt(7.2)}² ≈ ${P.fmt(51.8)}).`, `√52 ≈ ${P.fmt(7.2)} (because ${P.fmt(7.2)}² ≈ ${P.fmt(51.8)}).`),
      ],
      soluzione: [`√52 ≈ ${P.fmt(7.2)}`, `${v} / ${P.fmt(7.2)} = ${P.fmt(v / 7.2, 1)}%`],
    };
  }

  function gamma() {
    const v = P.pick([16, 20, 24, 32, 40]), f = P.pick([0.6, 0.75, 1.25, 1.5]);
    const m = Math.round(v * f / 16 * 4) / 4, realizzata = 16 * m;
    if (Math.abs(realizzata - v) < 2) return gamma();
    const guadagna = realizzata > v;
    return {
      testo: P.t(`Hai comprato uno straddle con vol implicita ${v}% e lo tieni coperto in delta ogni giorno. Il titolo si muove di circa ${P.fmt(m)}% al giorno. Stai guadagnando?`,
        `You bought a straddle at ${v}% implied vol and delta-hedge it every day. The stock moves about ${P.fmt(m)}% a day. Are you making money?`),
      risposta: P.scelta(P.t(['Sì', 'No'], ['Yes', 'No']), guadagna ? 0 : 1),
      suggerimenti: [
        P.t('Da lungo gamma guadagni se la vol realizzata supera quella implicita che hai pagato. Trasforma il movimento giornaliero in vol annua.',
          'Long gamma makes money if realised vol beats the implied vol you paid. Turn the daily move into an annual vol.'),
        `${P.fmt(m)}% × 16 = ${P.fmt(realizzata)}%.`,
      ],
      soluzione: [
        P.t(`vol realizzata ≈ ${P.fmt(m)}% × 16 = ${P.fmt(realizzata)}%`, `realised vol ≈ ${P.fmt(m)}% × 16 = ${P.fmt(realizzata)}%`),
        guadagna
          ? P.t(`implicita ${v}%: la realizzata è sopra, il gamma guadagna più di quanto il theta costa`, `implied ${v}%: realised is above it, so gamma earns more than theta costs`)
          : P.t(`implicita ${v}%: la realizzata è sotto, il theta costa più di quanto il gamma rende`, `implied ${v}%: realised is below it, so theta costs more than gamma earns`),
        P.t(`pareggio: un movimento giornaliero di ${v}/16 = ${P.fmt(v / 16)}%`, `breakeven: a daily move of ${v}/16 = ${P.fmt(v / 16)}%`),
      ],
    };
  }

  P.trucco({
    id: 'desk-regola-16',
    materia: 'desk',
    capitolo: 'desk',
    numero: 1,
    titolo: { it: 'La regola del 16', en: 'The rule of 16' },
    sottotitolo: {
      it: 'Vol annua diviso 16 = movimento giornaliero. Il conto che ogni trader di opzioni fa a voce.',
      en: 'Annual vol divided by 16 = daily move. The calculation every options trader does out loud.',
    },
    aggancio: {
      it: '«La vol implicita è 32. Quanto si muove oggi?» Il 2%. Perché 16? Perché un anno ha circa 256 giorni di borsa, e √256 = 16.',
      en: '"Implied vol is 32. How much does it move today?" 2%. Why 16? Because a year has about 256 trading days, and √256 = 16.',
    },
    lezione: {
      it: `
<h3>La domanda</h3>
<p>Il trader ti dice che la vol implicita di un titolo è al 32% e ti chiede quanto si aspetta il mercato che si muova oggi. La risposta è 2%, e ci arrivi dividendo per 16.</p>

<h3>Da dove viene il 16</h3>
<p>La volatilità è la deviazione standard dei rendimenti su un anno. Se i giorni sono indipendenti, le varianze giornaliere si sommano: in n giorni la varianza è n volte quella di un giorno, e la deviazione standard è √n volte quella di un giorno.</p>
<p>Un anno ha circa 252 giorni di borsa, e √252 ≈ 15.9. Visto che 16² = 256, si arrotonda a 16:</p>
<div class="esempio">movimento giornaliero ≈ vol annua / 16<br>vol 32% → 2% al giorno · vol 20% → 1.25% · vol 48% → 3%</div>

<h3>Che cosa vuol dire «si muove del 2%»</h3>
<p>È una deviazione standard. Circa due giorni su tre il titolo resta entro ±2%; circa un giorno su venti va oltre ±4%. Il movimento medio in valore assoluto è un po' più basso, circa 0.8 × 2% = 1.6%, perché la media di |Z| per una normale è √(2/π) ≈ 0.8.</p>

<h3>Le altre scale</h3>
<ul>
<li>Al contrario: movimento giornaliero × 16 = vol annua. Un titolo che si muove dell'1.5% al giorno ha una vol di circa 24%.</li>
<li>Una settimana: dividi per √52 ≈ 7.2. Un mese: dividi per √12 ≈ 3.5.</li>
<li>n giorni: movimento giornaliero × √n. Con l'1% al giorno, in 9 giorni ti aspetti il 3%.</li>
</ul>

<h3>Al desk: il pareggio del gamma</h3>
<p>Se compri uno straddle e lo copri in delta ogni giorno, guadagni quando il titolo si muove più di quanto l'implicita prometteva. Con implicita al 32%, il pareggio è un movimento di circa 2% al giorno. Se il titolo si muove del 3% al giorno, la vol realizzata è circa 48% e il gamma rende più di quanto il theta costa.</p>
`,
      en: `
<h3>The question</h3>
<p>The trader tells you a stock's implied vol is 32% and asks how much the market expects it to move today. The answer is 2%, and you get there by dividing by 16.</p>

<h3>Where 16 comes from</h3>
<p>Volatility is the standard deviation of returns over a year. If days are independent, daily variances add up: over n days the variance is n times that of one day, and the standard deviation is √n times that of one day.</p>
<p>A year has about 252 trading days, and √252 ≈ 15.9. Since 16² = 256, round it to 16:</p>
<div class="esempio">daily move ≈ annual vol / 16<br>vol 32% → 2% a day · vol 20% → 1.25% · vol 48% → 3%</div>

<h3>What "it moves 2%" means</h3>
<p>It is one standard deviation. About two days in three the stock stays within ±2%; about one day in twenty it goes beyond ±4%. The average move in absolute value is a little lower, about 0.8 × 2% = 1.6%, because the mean of |Z| for a normal is √(2/π) ≈ 0.8.</p>

<h3>Other time scales</h3>
<ul>
<li>The other way round: daily move × 16 = annual vol. A stock moving 1.5% a day has a vol of about 24%.</li>
<li>A week: divide by √52 ≈ 7.2. A month: divide by √12 ≈ 3.5.</li>
<li>n days: daily move × √n. At 1% a day, over 9 days you expect 3%.</li>
</ul>

<h3>On the desk: the gamma breakeven</h3>
<p>If you buy a straddle and delta-hedge it every day, you make money when the stock moves more than implied vol promised. With implied at 32%, the breakeven is a move of about 2% a day. If the stock moves 3% a day, realised vol is about 48% and gamma earns more than theta costs.</p>
`,
    },
    scheda: {
      it: 'Movimento giornaliero ≈ vol annua / 16 (√252 ≈ 16), ed è una deviazione standard. Al contrario × 16. Settimana: / 7.2. n giorni: × √n. Lungo gamma guadagna se la realizzata (movimento × 16) supera l\'implicita.',
      en: 'Daily move ≈ annual vol / 16 (√252 ≈ 16), and it is one standard deviation. The other way, × 16. Week: / 7.2. n days: × √n. Long gamma wins if realised vol (move × 16) beats implied.',
    },
    test: false,
    nomiLivelli: { it: ['Giornaliero', 'In euro e al contrario', 'Tempo e gamma'], en: ['Daily', 'In euros and backwards', 'Time and gamma'] },
    livelli: [
      giornaliero,
      () => P.pesato([[0.55, inEuro], [0.45, inverso]])(),
      () => P.pesato([[0.35, radiceDelTempo], [0.25, settimana], [0.4, gamma]])(),
    ],
  });
})();
