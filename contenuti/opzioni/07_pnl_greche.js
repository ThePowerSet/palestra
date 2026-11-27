(function () {
  'use strict';
  const P = Palestra;
  const f = x => P.fmt(Math.round(x * 1000) / 1000);
  const segno = x => (x < 0 ? '−' : '+') + f(Math.abs(x));

  function deltaGamma() {
    const d = P.pick([0.3, 0.4, 0.5, 0.6, 0.7]) * (P.chance(0.75) ? 1 : -1), g = P.pick([0.02, 0.03, 0.04, 0.05]);
    const dS = P.pick([1, 2, 3, 4, 5]) * P.segno(), v = d * dS + 0.5 * g * dS * dS;
    return {
      testo: P.t(`Hai un'opzione con delta ${P.fmt(d)} e gamma ${P.fmt(g)}. Il titolo si muove di ${P.conSegno(dS)}. Quanto guadagni o perdi?`,
        `You hold an option with delta ${P.fmt(d)} and gamma ${P.fmt(g)}. The stock moves ${P.conSegno(dS)}. What do you make or lose?`),
      nota: P.t('con il segno, per un\'opzione', 'with its sign, for one option'),
      risposta: P.numero(v, { tol: 0.0006, mostra: f(v) }),
      suggerimenti: [
        P.t('P&L ≈ Δ × ΔS + ½ × Γ × ΔS²: il primo termine ha il segno del movimento, il secondo è sempre positivo per chi è lungo gamma.', 'P&L ≈ Δ × ΔS + ½ × Γ × ΔS²: the first term has the sign of the move, the second is always positive when long gamma.'),
        `Δ × ΔS = ${P.fmt(d)} × (${P.conSegno(dS)}) = ${P.fmt(d * dS)}; ½ × ${P.fmt(g)} × ${dS * dS} = ${P.fmt(0.5 * g * dS * dS)}.`,
      ],
      soluzione: [`${P.fmt(d)} × (${P.conSegno(dS)}) = ${segno(d * dS)}`, `½ × ${P.fmt(g)} × (${P.fmt(dS)})² = ${segno(0.5 * g * dS * dS)}`, `${P.t('totale', 'total')}: ${segno(v)}`],
    };
  }

  function conVega() {
    const d = P.pick([0.3, 0.4, 0.5, 0.6]), g = P.pick([0.02, 0.03, 0.04]), ve = P.pick([0.1, 0.15, 0.2, 0.25, 0.3]);
    const dS = P.pick([1, 2, 3]) * P.segno(), dv = P.pick([-3, -2, -1, 1, 2, 3, 4]);
    const a = d * dS, b = 0.5 * g * dS * dS, c = ve * dv, v = a + b + c;
    return {
      testo: P.t(`Call con delta ${P.fmt(d)}, gamma ${P.fmt(g)}, vega ${P.fmt(ve)} per punto. Il titolo fa ${P.conSegno(dS)} e la vol implicita ${dv > 0 ? 'sale' : 'scende'} di ${Math.abs(dv)} punt${Math.abs(dv) === 1 ? 'o' : 'i'}. P&L?`,
        `Call with delta ${P.fmt(d)}, gamma ${P.fmt(g)}, vega ${P.fmt(ve)} per point. The stock moves ${P.conSegno(dS)} and implied vol ${dv > 0 ? 'rises' : 'falls'} by ${Math.abs(dv)} point${Math.abs(dv) === 1 ? '' : 's'}. P&L?`),
      nota: P.t('con il segno, per un\'opzione', 'with its sign, for one option'),
      risposta: P.numero(v, { tol: 0.0006, mostra: f(v) }),
      suggerimenti: [
        P.t('Un termine per greca: Δ × ΔS + ½ × Γ × ΔS² + vega × Δvol. Calcolali uno per uno, poi somma con i segni.', 'One term per Greek: Δ × ΔS + ½ × Γ × ΔS² + vega × Δvol. Work them out one by one, then add with their signs.'),
        `delta ${segno(a)}; gamma ${segno(b)}; vega ${P.fmt(ve)} × (${P.conSegno(dv)}) = ${segno(c)}.`,
      ],
      soluzione: [`delta: ${segno(a)}`, `gamma: ${segno(b)}`, `vega: ${segno(c)}`, `${P.t('totale', 'total')}: ${segno(v)}`],
    };
  }

  function libro() {
    const D = P.pick([-300, -150, 100, 200, 400]), G = P.pick([-80, -40, 20, 50, 100]), V = P.pick([-500, -200, 150, 300, 600]);
    const Th = -Math.sign(G) * P.pick([60, 100, 150, 200]);
    const dS = P.pick([0.5, 1, 1.5, 2]) * P.segno(), dv = P.pick([-2, -1, 1, 2]);
    const a = D * dS, b = 0.5 * G * dS * dS, c = V * dv, v = a + b + c + Th;
    return {
      testo: P.t(`Il tuo libro di opzioni ha delta ${P.conSegno(D)} azioni, gamma ${P.conSegno(G)} azioni per punto, vega ${P.conSegno(V)} € per punto di vol, theta ${P.conSegno(Th)} € al giorno. Domani il titolo fa ${P.conSegno(dS)} e la vol ${dv > 0 ? 'sale' : 'scende'} di ${Math.abs(dv)}. P&L della giornata?`,
        `Your options book has delta ${P.conSegno(D)} shares, gamma ${P.conSegno(G)} shares per point, vega ${P.conSegno(V)} € per vol point, theta ${P.conSegno(Th)} € a day. Tomorrow the stock moves ${P.conSegno(dS)} and vol ${dv > 0 ? 'rises' : 'falls'} by ${Math.abs(dv)}. P&L for the day?`),
      nota: P.t('in euro, con il segno', 'in euros, with its sign'),
      risposta: P.numero(v, { tol: 0.01, unita: '€', mostra: f(v) }),
      suggerimenti: [
        P.t('Stessa scomposizione, con le greche già in euro: delta × ΔS + ½ × gamma × ΔS² + vega × Δvol + theta.', 'Same breakdown, with the Greeks already in euros: delta × ΔS + ½ × gamma × ΔS² + vega × Δvol + theta.'),
        `delta ${segno(a)}; gamma ½ × ${P.conSegno(G)} × ${P.fmt(dS * dS)} = ${segno(b)}; vega ${segno(c)}; theta ${segno(Th)}.`,
      ],
      soluzione: [`delta: ${P.conSegno(D)} × (${P.conSegno(dS)}) = ${segno(a)}`, `gamma: ½ × ${P.conSegno(G)} × ${P.fmt(dS * dS)} = ${segno(b)}`,
        `vega: ${P.conSegno(V)} × (${P.conSegno(dv)}) = ${segno(c)}`, `theta: ${segno(Th)}`, `${P.t('totale', 'total')}: ${segno(v)}`],
    };
  }

  P.trucco({
    id: 'opz-pnl-greche',
    materia: 'opzioni',
    capitolo: 'greche',
    numero: 7,
    titolo: { it: 'Il P&L spiegato con le greche', en: 'P&L explained by the Greeks' },
    sottotitolo: {
      it: 'Delta, gamma, vega e theta, un termine alla volta: quanto ha fatto un\'opzione o un libro in una giornata, e perché.',
      en: 'Delta, gamma, vega and theta, one term at a time: what an option or a book made in a day, and why.',
    },
    aggancio: {
      it: '«Il titolo è salito di 2, la vol è scesa di un punto, è passato un giorno. Quanto hai fatto?» Al desk è la prima domanda della mattina: il P&L si spiega greca per greca.',
      en: '"The stock is up 2, vol is down a point, a day has gone by. What did you make?" On the desk it is the first question of the morning: P&L is explained Greek by Greek.',
    },
    lezione: {
      it: `
<h3>Un'espansione, un termine per rischio</h3>
<p>Il prezzo di un'opzione dipende dal titolo, dalla vol implicita e dal tempo. Per piccoli movimenti il cambiamento di valore si scompone in un termine per greca:</p>
<div class="esempio">P&L ≈ Δ × ΔS + ½ × Γ × ΔS² + vega × Δvol + Θ × Δt<br>Δ 0.5, Γ 0.04, vega 0.2, titolo +3, vol −2: 1.5 + 0.18 − 0.4 = +1.28</div>
<p>Il termine del gamma è sempre positivo per chi è lungo opzioni, qualunque sia la direzione; quello del delta ha il segno del movimento; quello del vega il segno del movimento della vol.</p>

<h3>Su un libro intero</h3>
<p>Al desk le greche si danno già sommate e in euro: delta in azioni (euro per punto), gamma in azioni per punto, vega in euro per punto di vol, theta in euro al giorno. Il conto è lo stesso, solo con numeri più grandi, e serve a capire da dove viene il P&L: se hai guadagnato sul delta ma perso sul vega, la giornata ti dice cose diverse da quelle che dice il totale.</p>

<h3>Quello che resta</h3>
<p>La differenza fra il P&L vero e la somma dei termini è il residuo: movimenti grandi (dove contano i termini dopo), il vega che cambia con il titolo, lo skew che si sposta. Un residuo grande vuol dire che le greche non descrivono più bene la posizione.</p>

<div class="trappola">Il ½ del gamma e i segni sono dove si sbaglia: chi è corto gamma perde ½ × |Γ| × ΔS² sia che il titolo salga sia che scenda, e chi è lungo vega perde quando la vol scende anche se il titolo va nella direzione giusta.</div>
`,
      en: `
<h3>An expansion, one term per risk</h3>
<p>An option's price depends on the stock, the implied vol and time. For small moves the change in value splits into one term per Greek:</p>
<div class="esempio">P&L ≈ Δ × ΔS + ½ × Γ × ΔS² + vega × Δvol + Θ × Δt<br>Δ 0.5, Γ 0.04, vega 0.2, stock +3, vol −2: 1.5 + 0.18 − 0.4 = +1.28</div>
<p>The gamma term is always positive for whoever is long options, whatever the direction; the delta term has the sign of the move; the vega term the sign of the vol move.</p>

<h3>On a whole book</h3>
<p>On the desk the Greeks come already added up and in euros: delta in shares (euros per point), gamma in shares per point, vega in euros per vol point, theta in euros a day. The sum is the same, just with bigger numbers, and it tells you where the P&L came from: if you made money on delta but lost on vega, the day says something different from what the total says.</p>

<h3>What is left over</h3>
<p>The gap between the real P&L and the sum of the terms is the residual: big moves (where the higher terms matter), vega changing with the stock, skew shifting. A big residual means the Greeks no longer describe the position well.</p>

<div class="trappola">The ½ on gamma and the signs are where people slip: whoever is short gamma loses ½ × |Γ| × ΔS² whether the stock goes up or down, and whoever is long vega loses when vol falls even if the stock goes the right way.</div>
`,
    },
    scheda: {
      it: 'P&L ≈ Δ·ΔS + ½·Γ·ΔS² + vega·Δvol + Θ·Δt. Gamma: sempre positivo se lungo, con il ½. Al desk le greche sono già in euro: stesso conto. Il residuo misura quanto le greche spiegano.',
      en: 'P&L ≈ Δ·ΔS + ½·Γ·ΔS² + vega·Δvol + Θ·Δt. Gamma: always positive when long, with the ½. On the desk the Greeks are already in euros: same sum. The residual measures how much the Greeks explain.',
    },
    fonti: [
      P.fonte('zhou', '§6.2, "The Greeks"', { nota: { it: 'le definizioni di ogni greca, da cui viene l\'espansione del P&L', en: 'the definition of each Greek, where the P&L expansion comes from' } }),
      P.fonte('crack', 'Question 2.7', { nota: { it: 'un\'opzione coperta in delta quando arriva una notizia', en: 'a delta-hedged option when news hits' } }),
    ],
    test: false,
    nomiLivelli: { it: ['Delta e gamma', 'Più il vega', 'Un libro intero'], en: ['Delta and gamma', 'Adding vega', 'A whole book'] },
    livelli: [deltaGamma, conVega, libro],
  });
})();
