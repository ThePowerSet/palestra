(function () {
  'use strict';
  const P = Palestra;

  const verbo = a => P.t(a > 0 ? 'sale' : 'scende', a > 0 ? 'rises' : 'falls');

  function dueVariazioni() {
    const a = P.pick([5, 10, 15, 20, 25, 30, 40, 50]) * P.segno();
    const b = P.pick([5, 10, 20, 25, 40, 50]) * P.segno();
    const ab = a * b / 100, tot = a + b + ab, v = tot / 100;
    return {
      testo: P.t(`Un titolo ${verbo(a)} ${P.del(Math.abs(a))}% e poi ${verbo(b)} ${P.del(Math.abs(b))}%. Di quanto è cambiato in tutto?`,
        `A stock ${verbo(a)} by ${Math.abs(a)}% and then ${verbo(b)} by ${Math.abs(b)}%. What is the total change?`),
      nota: P.t('in percentuale, con il segno', 'as a percentage, with the sign'),
      risposta: P.numero(v, { percento: true, mostra: P.pctSegno(v) }),
      suggerimenti: [
        P.t(`Ogni variazione è un fattore: × ${P.fmt(1 + a / 100)} e poi × ${P.fmt(1 + b / 100)}. Per due variazioni a e b il totale è a + b + a·b.`,
          `Each change is a factor: × ${P.fmt(1 + a / 100)} and then × ${P.fmt(1 + b / 100)}. For two changes a and b the total is a + b + a·b.`),
        P.t(`a + b = ${a + b}; a·b = (${a}%) × (${b}%) = ${P.fmt(ab)} punti.`, `a + b = ${a + b}; a·b = (${a}%) × (${b}%) = ${P.fmt(ab)} points.`),
      ],
      soluzione: [
        `a + b = ${P.conSegno(a)} ${P.piuMeno(b)} = ${a + b}`,
        P.t(`a·b = ${P.fmt(a / 100)} × ${P.fmt(b / 100)} = ${P.fmt(ab / 100)}, cioè ${P.fmt(ab)} punti`, `a·b = ${P.fmt(a / 100)} × ${P.fmt(b / 100)} = ${P.fmt(ab / 100)}, i.e. ${P.fmt(ab)} points`),
        P.t(`totale: ${a + b} ${P.piuMeno(ab)} = ${P.fmt(tot)}%`, `total: ${a + b} ${P.piuMeno(ab)} = ${P.fmt(tot)}%`),
        P.t(`controllo: ${P.fmt(1 + a / 100)} × ${P.fmt(1 + b / 100)} = ${P.fmt(1 + v)}`, `check: ${P.fmt(1 + a / 100)} × ${P.fmt(1 + b / 100)} = ${P.fmt(1 + v)}`),
      ],
    };
  }

  function recupero() {
    const x = P.pick([10, 20, 25, 40, 50, 60, 75, 80, 90]), v = x / (100 - x);
    return {
      testo: P.t(`Il book perde ${P.il(x)}% in un mese. Di quanto deve salire per tornare al livello di partenza?`,
        `The book loses ${x}% in a month. How much does it need to gain to get back to where it started?`),
      nota: P.t('in percentuale; se non è intera, basta un decimale', 'as a percentage; if it is not whole, one decimal is enough'),
      risposta: P.numero(v, { percento: true, tol: 0.0006, mostra: P.pct(v, 2) }),
      suggerimenti: [
        P.t(`Dopo la perdita resta ${P.fmt(1 - x / 100)} del capitale: per tornare a 1 devi moltiplicare per 1/${P.fmt(1 - x / 100)}.`,
          `After the loss ${P.fmt(1 - x / 100)} of the capital is left: to get back to 1 you have to multiply by 1/${P.fmt(1 - x / 100)}.`),
        P.t(`Il guadagno che serve è quello che hai perso diviso quello che resta: ${x}/${100 - x}.`, `The gain you need is what you lost divided by what is left: ${x}/${100 - x}.`),
      ],
      soluzione: [
        P.t(`resta ${100 - x} su 100`, `${100 - x} out of 100 is left`),
        P.t(`serve +${x} su ${100 - x}: ${x}/${100 - x} = ${P.pct(v, 2)}`, `you need +${x} on ${100 - x}: ${x}/${100 - x} = ${P.pct(v, 2)}`),
      ],
    };
  }

  function volRelativa() {
    let v1, rel, v2;
    do {
      rel = P.pick([0.1, 0.2, 0.25, 0.5, -0.2, -0.25, -0.1]);
      v1 = P.pick([12, 15, 16, 20, 24, 30, 40]);
      v2 = v1 * (1 + rel);
    } while (Math.abs(v2 - Math.round(v2)) > 1e-9);
    v2 = Math.round(v2);
    const d = Math.abs(v2 - v1);
    return {
      testo: P.t(`La vol implicita passa ${P.dal(v1)}% ${P.al(v2)}%. Di quanto è cambiata in termini relativi?`,
        `Implied vol moves from ${v1}% to ${v2}%. What is the relative change?`),
      nota: P.t('in percentuale, con il segno', 'as a percentage, with the sign'),
      risposta: P.numero(rel, { percento: true, mostra: P.pctSegno(rel) }),
      suggerimenti: [
        P.t(`Attenzione: ${d} punti di vol non sono il ${d}%. La variazione relativa è (nuovo − vecchio) / vecchio.`,
          `Careful: ${d} vol points are not ${d}%. The relative change is (new − old) / old.`),
        `${v2 - v1} / ${v1}.`,
      ],
      soluzione: [
        P.t(`differenza: ${P.conSegno(v2 - v1)} punti di vol`, `difference: ${P.conSegno(v2 - v1)} vol points`),
        P.t(`relativa: ${v2 - v1}/${v1} = ${P.pctSegno(rel)}`, `relative: ${v2 - v1}/${v1} = ${P.pctSegno(rel)}`),
      ],
    };
  }

  function composto() {
    const x = P.pick([2, 3, 5, 10, 20]) * (P.chance(0.25) ? -1 : 1), n = P.pick([2, 3]);
    const d = x / 100, v = (1 + d) ** n - 1;
    const c2 = n === 2 ? 1 : 3;
    const termini = [`${n}·x = ${P.pct(n * d, 4)}`, `${c2 === 1 ? '' : '3·'}x² = ${P.pct(c2 * d * d, 4)}`];
    if (n === 3) termini.push(`x³ = ${P.pct(d ** 3, 4)}`);
    return {
      testo: P.t(`Un fondo ${x > 0 ? 'guadagna' : 'perde'} ${P.il(Math.abs(x))}% all'anno per ${n} anni di fila. Qual è la variazione totale?`,
        `A fund ${x > 0 ? 'gains' : 'loses'} ${Math.abs(x)}% a year for ${n} years in a row. What is the total change?`),
      nota: P.t('in percentuale, con il segno; basta un decimale', 'as a percentage, with the sign; one decimal is enough'),
      risposta: P.numero(v, { percento: true, tol: 0.0006, mostra: P.pctSegno(v, 4) }),
      suggerimenti: [
        P.t(`(1 + x)${P.apice(n)} = 1 + ${n}·x + ${n === 2 ? 'x²' : '3·x² + x³'}, con x = ${P.fmt(d)}.`, `(1 + x)${P.apice(n)} = 1 + ${n}·x + ${n === 2 ? 'x²' : '3·x² + x³'}, with x = ${P.fmt(d)}.`),
        termini.join('; ') + '.',
      ],
      soluzione: termini.concat([P.t(`totale: ${P.pctSegno(v, 4)}`, `total: ${P.pctSegno(v, 4)}`)]),
    };
  }

  P.trucco({
    id: 'percentuali-composte',
    materia: 'calcolo',
    capitolo: 'percent',
    numero: 4,
    titolo: { it: 'Le variazioni si moltiplicano', en: 'Changes multiply' },
    sottotitolo: {
      it: '−20% e poi +20% non fa zero. E per recuperare un −50% serve un +100%.',
      en: '−20% then +20% is not zero. And recovering a −50% takes +100%.',
    },
    aggancio: {
      it: '«Il titolo perde il 20% e poi guadagna il 20%. Dove sei?» Chi risponde «in pari» si gioca la domanda. Sei al −4%, e il perché è tutto il trucco.',
      en: '"The stock loses 20% and then gains 20%. Where are you?" Answer "back to even" and the question is lost. You are at −4%, and the reason why is the whole trick.',
    },
    lezione: {
      it: `
<h3>Le percentuali non si sommano</h3>
<p>Una variazione percentuale è una moltiplicazione. +20% vuol dire × 1.2; −20% vuol dire × 0.8. Due variazioni di fila sono due moltiplicazioni:</p>
<div class="esempio">100 × 1.2 = 120, poi 120 × 0.8 = 96: hai perso il 4%</div>
<p>Il −20% si applica a 120, non a 100: per questo pesa di più del +20% che l'ha preceduto. L'ordine invece non conta: 0.8 × 1.2 fa sempre 0.96.</p>

<h3>La scorciatoia per due variazioni</h3>
<p>(1 + a)(1 + b) = 1 + a + b + a·b. Quindi il totale è <b>a + b + a·b</b>: la somma, più un termine di correzione.</p>
<div class="esempio">+20% e −20%: 0 + (−4) = −4%<br>+10% e +10%: 20 + 1 = +21%<br>+50% e −20%: 30 + (−10) = +20%</div>
<p>Il termine a·b si calcola in punti: 20% × 20% = 0.04 = 4 punti. Se le variazioni sono piccole, a·b è trascurabile e le percentuali quasi si sommano: è per questo che l'errore sembra ragionevole.</p>

<h3>Recuperare una perdita</h3>
<p>Dopo un −x% resta 1 − x. Per tornare a 1 devi moltiplicare per 1/(1 − x), cioè guadagnare <b>x/(1 − x)</b>: quello che hai perso diviso quello che ti resta.</p>
<table class="tab"><tr><td>−10%</td><td>+11.1%</td><td>−20%</td><td>+25%</td></tr><tr><td>−25%</td><td>+33.3%</td><td>−50%</td><td>+100%</td></tr><tr><td>−75%</td><td>+300%</td><td>−90%</td><td>+900%</td></tr></table>

<h3>Più periodi</h3>
<p>(1 + x)ⁿ = 1 + n·x + (coppie)·x² + … Per due periodi: 2x + x². Per tre: 3x + 3x² + x³.</p>
<div class="esempio">+5% per 3 anni: 15% + 0.75% + 0.0125% = 15.76%<br>−10% per 3 anni: −30% + 3% − 0.1% = −27.1%</div>

<div class="trappola">Punti contro percento. Se la vol passa dal 20% al 25%, è salita di 5 punti di vol, ma del 25% in termini relativi. Al desk «la vol è su di 5» vuol dire punti. Leggi bene cosa ti chiedono.</div>
`,
      en: `
<h3>Percentages don't add up</h3>
<p>A percentage change is a multiplication. +20% means × 1.2; −20% means × 0.8. Two changes in a row are two multiplications:</p>
<div class="esempio">100 × 1.2 = 120, then 120 × 0.8 = 96: you have lost 4%</div>
<p>The −20% applies to 120, not to 100: that is why it weighs more than the +20% before it. The order, on the other hand, doesn't matter: 0.8 × 1.2 is always 0.96.</p>

<h3>The shortcut for two changes</h3>
<p>(1 + a)(1 + b) = 1 + a + b + a·b. So the total is <b>a + b + a·b</b>: the sum, plus a correction term.</p>
<div class="esempio">+20% and −20%: 0 + (−4) = −4%<br>+10% and +10%: 20 + 1 = +21%<br>+50% and −20%: 30 + (−10) = +20%</div>
<p>The a·b term is worked out in points: 20% × 20% = 0.04 = 4 points. When the changes are small, a·b is negligible and percentages almost add up: that is why the mistake looks reasonable.</p>

<h3>Recovering a loss</h3>
<p>After a −x% you have 1 − x left. To get back to 1 you have to multiply by 1/(1 − x), that is gain <b>x/(1 − x)</b>: what you lost divided by what you have left.</p>
<table class="tab"><tr><td>−10%</td><td>+11.1%</td><td>−20%</td><td>+25%</td></tr><tr><td>−25%</td><td>+33.3%</td><td>−50%</td><td>+100%</td></tr><tr><td>−75%</td><td>+300%</td><td>−90%</td><td>+900%</td></tr></table>

<h3>Several periods</h3>
<p>(1 + x)ⁿ = 1 + n·x + (pairs)·x² + … For two periods: 2x + x². For three: 3x + 3x² + x³.</p>
<div class="esempio">+5% for 3 years: 15% + 0.75% + 0.0125% = 15.76%<br>−10% for 3 years: −30% + 3% − 0.1% = −27.1%</div>

<div class="trappola">Points versus per cent. If vol goes from 20% to 25%, it is up 5 vol points, but 25% in relative terms. On the desk "vol is up 5" means points. Read carefully what they are asking.</div>
`,
    },
    scheda: {
      it: 'Ogni variazione è un fattore: +a → × (1 + a). Due variazioni: a + b + a·b (−20% e +20% fanno −4%). Per recuperare una perdita x serve x/(1 − x): −20% → +25%, −50% → +100%. Punti di vol non sono percento.',
      en: 'Every change is a factor: +a → × (1 + a). Two changes: a + b + a·b (−20% and +20% make −4%). To recover a loss x you need x/(1 − x): −20% → +25%, −50% → +100%. Vol points are not per cent.',
    },
    test: true,
    nomiLivelli: { it: ['Due variazioni', 'Recuperi e vol', 'Più periodi'], en: ['Two changes', 'Recoveries and vol', 'Several periods'] },
    livelli: [
      dueVariazioni,
      () => P.pesato([[0.55, recupero], [0.45, volRelativa]])(),
      composto,
    ],
  });
})();
