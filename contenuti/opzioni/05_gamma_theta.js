(function () {
  'use strict';
  const P = Palestra;
  const f2 = x => P.fmt(x, 2), f3 = x => P.fmt(x, 3);
  const GAMMA = [0.01, 0.02, 0.025, 0.04, 0.05, 0.08, 0.1];

  function gammaPnl() {
    const g = P.pick(GAMMA), m = P.pick([1, 2, 2.5, 3, 4, 5, 6]), giu = P.chance(0.5);
    if (P.chance(0.35)) {
      const v = g * m;
      return {
        testo: P.t(`Un'opzione ha gamma ${P.fmt(g)}. Il titolo ${giu ? 'scende' : 'sale'} di ${P.fmt(m)}. Di quanto cambia il delta?`,
          `An option has gamma ${P.fmt(g)}. The stock ${giu ? 'falls' : 'rises'} by ${P.fmt(m)}. By how much does delta change?`),
        nota: P.t('con il segno', 'with its sign'),
        risposta: P.numero(giu ? -v : v, { tol: 0.0006, mostra: P.fmt(giu ? -v : v) }),
        suggerimenti: [
          P.t('Il gamma è di quanto cambia il delta per ogni punto di movimento del titolo.', 'Gamma is how much delta changes for each point the stock moves.'),
          `${P.fmt(g)} × ${giu ? '(−' + P.fmt(m) + ')' : P.fmt(m)}.`,
        ],
        soluzione: [`Δdelta = Γ × ΔS = ${P.fmt(g)} × ${giu ? '(−' + P.fmt(m) + ')' : P.fmt(m)} = ${P.fmt(giu ? -v : v)}`],
      };
    }
    const v = 0.5 * g * m * m;
    return {
      testo: P.t(`Sei lungo di un'opzione coperta in delta, con gamma ${P.fmt(g)}. Il titolo ${giu ? 'scende' : 'sale'} di ${P.fmt(m)}. Quanto guadagni dal gamma?`,
        `You are long a delta-hedged option with gamma ${P.fmt(g)}. The stock ${giu ? 'falls' : 'rises'} by ${P.fmt(m)}. How much do you make from gamma?`),
      nota: P.t('prima del theta', 'before theta'),
      risposta: P.numero(v, { tol: 0.0006, mostra: f3(v) }),
      suggerimenti: [
        P.t('Coperti in delta, il primo termine che resta è ½ × Γ × ΔS². Il segno del movimento non conta: è al quadrato.', 'Delta-hedged, the first term left is ½ × Γ × ΔS². The sign of the move does not matter: it is squared.'),
        `${P.fmt(m)}² = ${P.fmt(m * m)}; ½ × ${P.fmt(g)} = ${P.fmt(g / 2)}.`,
      ],
      soluzione: [`½ × ${P.fmt(g)} × ${P.fmt(m)}² = ${P.fmt(g / 2)} × ${P.fmt(m * m)} = ${f3(v)}`],
    };
  }

  function netto() {
    const g = P.pick(GAMMA), m = P.pick([1, 1.5, 2, 3, 4, 5]), th = P.pick([0.02, 0.05, 0.08, 0.1, 0.12, 0.15, 0.2, 0.25]);
    const lungo = P.chance(0.6), gp = 0.5 * g * m * m, v = (lungo ? 1 : -1) * (gp - th);
    return {
      testo: P.t(`Sei ${lungo ? 'lungo' : 'corto'} di un'opzione coperta in delta. L'opzione ha gamma ${P.fmt(g)} e theta −${P.fmt(th)} al giorno. Oggi il titolo si muove di ${P.fmt(m)}. Il tuo P&L della giornata?`,
        `You are ${lungo ? 'long' : 'short'} a delta-hedged option. The option has gamma ${P.fmt(g)} and theta −${P.fmt(th)} a day. Today the stock moves by ${P.fmt(m)}. Your P&L for the day?`),
      nota: P.t('con il segno', 'with its sign'),
      risposta: P.numero(v, { tol: 0.0006, mostra: f3(v) }),
      suggerimenti: [
        P.t('P&L ≈ ½ × Γ × ΔS² − theta pagato. Chi è corto prende il theta e paga il gamma: cambia il segno a tutto.', 'P&L ≈ ½ × Γ × ΔS² − theta paid. Whoever is short collects theta and pays gamma: flip the sign of everything.'),
        P.t(`gamma: ½ × ${P.fmt(g)} × ${P.fmt(m * m)} = ${f3(gp)}; theta: ${P.fmt(th)}.`, `gamma: ½ × ${P.fmt(g)} × ${P.fmt(m * m)} = ${f3(gp)}; theta: ${P.fmt(th)}.`),
      ],
      soluzione: [
        `½ × ${P.fmt(g)} × ${P.fmt(m)}² = ${f3(gp)}`,
        lungo ? `${f3(gp)} − ${P.fmt(th)} = ${f3(v)}` : `−(${f3(gp)} − ${P.fmt(th)}) = ${f3(v)}`,
      ],
    };
  }

  // Black-Scholes at zero rates: theta = −½ Γ σ² S², so one day's theta is −½ Γ (σS/16)²
  function thetaDaGamma() {
    const [S, s] = P.pick([[100, 32], [100, 40], [100, 48], [200, 16], [200, 20], [200, 24], [200, 32], [200, 40], [400, 16], [400, 20]]);
    const g = P.pick([0.02, 0.03, 0.04, 0.05, 0.08]), m = s / 100 * S / 16, v = 0.5 * g * m * m;
    return {
      testo: P.t(`Tassi a zero, Black-Scholes. Un'opzione su un titolo a ${S} con vol implicita ${s}% ha gamma ${P.fmt(g)}. Quanto perde di valore in un giorno, se niente si muove?`,
        `Zero rates, Black-Scholes. An option on a stock at ${S} with implied vol ${s}% has gamma ${P.fmt(g)}. How much value does it lose in a day if nothing moves?`),
      nota: P.t('il theta di un giorno, in valore assoluto; un anno = 256 giorni', 'one day\'s theta, in absolute value; a year = 256 days'),
      risposta: P.numero(v, { rel: 0.02, mostra: P.fmt(Math.round(v * 10000) / 10000) }),
      suggerimenti: [
        P.t('A tassi zero l\'equazione di Black-Scholes dice θ + ½ Γ σ² S² = 0: theta e gamma hanno segni opposti.', 'At zero rates the Black-Scholes equation says θ + ½ Γ σ² S² = 0: theta and gamma have opposite signs.'),
        P.t(`In un giorno: ½ × Γ × (movimento giornaliero)², con movimento σS/16 = ${P.fmt(m)}.`, `In a day: ½ × Γ × (daily move)², with the move σS/16 = ${P.fmt(m)}.`),
      ],
      soluzione: [`σS/16 = ${P.fmt(s / 100)} × ${S} / 16 = ${P.fmt(m)}`, `½ × ${P.fmt(g)} × ${P.fmt(m)}² = ${P.fmt(Math.round(v * 10000) / 10000)}`],
      fonte: P.fonte('crack', 'Question 2.54'),
    };
  }

  function pareggio() {
    if (P.chance(0.5)) {
      // ATM in Black-Scholes: the break-even move is the implied daily move, σ × S / 16
      const S = P.pick([50, 80, 100, 100, 200, 400]), s = P.pick([16, 20, 24, 32, 40, 48, 64]), v = s / 100 * S / 16;
      return {
        testo: P.t(`Compri un'opzione at-the-money su un titolo a ${S} con vol implicita ${s}% e la copri in delta ogni sera. Di quanto deve muoversi il titolo in un giorno perché il gamma paghi il theta?`,
          `You buy an at-the-money option on a stock at ${S} with implied vol ${s}% and delta-hedge it every evening. How much must the stock move in a day for gamma to pay for theta?`),
        risposta: P.numero(v, { rel: 0.03, mostra: f2(v) }),
        suggerimenti: [
          P.t('Il theta di un\'opzione è il prezzo del gamma alla vol implicita: il pareggio è il movimento giornaliero implicito.', 'An option\'s theta is the price of its gamma at the implied vol: break-even is the implied daily move.'),
          P.t(`Regola del 16: ${s}% / 16 = ${P.fmt(s / 16)}% di ${S}.`, `Rule of 16: ${s}% / 16 = ${P.fmt(s / 16)}% of ${S}.`),
        ],
        soluzione: [`${s}% / 16 = ${P.fmt(s / 16)}%`, `${P.fmt(s / 16)}% × ${S} = ${f2(v)}`],
      };
    }
    const m = P.pick([1, 1.5, 2, 2.5, 3, 4, 5]), g = P.pick(GAMMA), th = 0.5 * g * m * m;
    return {
      testo: P.t(`Opzione coperta in delta: gamma ${P.fmt(g)}, theta −${f3(th)} al giorno. Che movimento giornaliero ti serve per andare in pari?`,
        `Delta-hedged option: gamma ${P.fmt(g)}, theta −${f3(th)} a day. What daily move do you need to break even?`),
      risposta: P.numero(m, { rel: 0.02 }),
      suggerimenti: [
        P.t('Pari quando ½ × Γ × ΔS² = theta, cioè ΔS = √(2 × theta / Γ).', 'Break-even when ½ × Γ × ΔS² = theta, so ΔS = √(2 × theta / Γ).'),
        `2 × ${f3(th)} / ${P.fmt(g)} = ${P.fmt(m * m)}.`,
      ],
      soluzione: [`2 × ${f3(th)} / ${P.fmt(g)} = ${P.fmt(m * m)}`, `√${P.fmt(m * m)} = ${P.fmt(m)}`],
    };
  }

  P.trucco({
    id: 'opz-gamma-theta',
    materia: 'opzioni',
    capitolo: 'greche',
    numero: 5,
    titolo: { it: 'Gamma, theta e il break-even', en: 'Gamma, theta and the break-even' },
    sottotitolo: {
      it: 'Il P&L di un\'opzione coperta è ½ Γ ΔS² meno il theta, e si va in pari quando il titolo si muove quanto dice la vol implicita.',
      en: 'A hedged option\'s P&L is ½ Γ ΔS² minus theta, and you break even when the stock moves as much as the implied vol says.',
    },
    aggancio: {
      it: '«Sei lungo gamma su un titolo a 100 con vol 32. Quanto deve muoversi oggi perché tu guadagni?» Più di 2: 32/16 per cento di 100. Il theta è il prezzo di quel movimento.',
      en: '"You are long gamma on a stock at 100 with vol 32. How much must it move today for you to make money?" More than 2: 32/16 percent of 100. Theta is the price of that move.',
    },
    lezione: {
      it: `
<h3>Cosa resta dopo la copertura</h3>
<p>Coperta in delta, un'opzione non guadagna né perde per piccoli movimenti in una direzione. Resta la curvatura: se il titolo si muove di ΔS, il delta cambia di Γ × ΔS e la posizione guadagna circa ½ × Γ × ΔS², qualunque sia il verso. In cambio, ogni giorno l'opzione perde valore: il theta.</p>
<div class="esempio">P&L di un giorno ≈ ½ × Γ × ΔS² + Θ   (Θ negativo per chi compra)<br>Γ = 0.04, ΔS = 3, Θ = −0.10: 0.18 − 0.10 = +0.08</div>

<h3>Il pareggio</h3>
<p>Si va in pari quando ½ × Γ × ΔS² = |Θ|, cioè ΔS = √(2|Θ|/Γ). Sopra quel movimento chi è lungo gamma guadagna, sotto perde. Chi è corto ha il P&L opposto: incassa il theta e paga i movimenti grandi.</p>

<h3>Il legame con la vol implicita</h3>
<p>In Black-Scholes, per un'opzione at-the-money, il theta di un giorno è proprio ½ × Γ × (σS/16)²: il prezzo del gamma calcolato alla vol implicita. Quindi il movimento di pareggio è il movimento giornaliero implicito, σ × S / 16, la regola del 16.</p>
<div class="esempio">titolo a 100, vol implicita 32%: pareggio ≈ 2 al giorno<br>se il titolo si muove in media più di 2, la vol realizzata supera quella implicita e chi è lungo guadagna</div>
<p>È tutta la scommessa di chi compra o vende opzioni coperte: la vol che si realizzerà contro quella che hai pagato.</p>

<div class="trappola">Il ½ conta. Senza, raddoppi il P&L del gamma e il pareggio esce più basso di √2. E il gamma è per punto di movimento: un titolo a 400 si muove di più in punti, a parità di percentuale.</div>
`,
      en: `
<h3>What is left after hedging</h3>
<p>Delta-hedged, an option neither gains nor loses on small moves in one direction. What is left is curvature: if the stock moves by ΔS, delta changes by Γ × ΔS and the position gains about ½ × Γ × ΔS², whatever the direction. In exchange, the option loses value every day: theta.</p>
<div class="esempio">one day's P&L ≈ ½ × Γ × ΔS² + Θ   (Θ negative for the buyer)<br>Γ = 0.04, ΔS = 3, Θ = −0.10: 0.18 − 0.10 = +0.08</div>

<h3>Break-even</h3>
<p>You break even when ½ × Γ × ΔS² = |Θ|, so ΔS = √(2|Θ|/Γ). Above that move whoever is long gamma makes money, below it they lose. Whoever is short has the opposite P&L: collects theta and pays for big moves.</p>

<h3>The link with implied vol</h3>
<p>In Black-Scholes, for an at-the-money option, one day's theta is exactly ½ × Γ × (σS/16)²: the price of gamma at the implied vol. So the break-even move is the implied daily move, σ × S / 16, the rule of 16.</p>
<div class="esempio">stock at 100, implied vol 32%: break-even ≈ 2 a day<br>if the stock moves more than 2 on average, realised vol beats implied and the long side makes money</div>
<p>That is the whole bet of anyone buying or selling hedged options: the vol that will be realised against the vol you paid.</p>

<div class="trappola">The ½ matters. Without it you double the gamma P&L and the break-even comes out √2 too low. And gamma is per point of move: a stock at 400 moves more in points for the same percentage.</div>
`,
    },
    scheda: {
      it: 'P&L coperto ≈ ½ Γ ΔS² + Θ. Pareggio: ΔS = √(2|Θ|/Γ). Per un\'opzione at-the-money il pareggio è il movimento giornaliero implicito, σS/16. Lungo gamma vince se la vol realizzata supera l\'implicita.',
      en: 'Hedged P&L ≈ ½ Γ ΔS² + Θ. Break-even: ΔS = √(2|Θ|/Γ). At the money the break-even is the implied daily move, σS/16. Long gamma wins if realised vol beats implied.',
    },
    fonti: [
      P.fonte('zhou', '§6.2, "Gamma" and "Theta"', { nota: { it: 'la teoria: gamma, theta e l\'equazione che li lega', en: 'the theory: gamma, theta and the equation linking them' } }),
      P.fonte('crack', 'Question 2.54'),
    ],
    test: false,
    nomiLivelli: { it: ['Gamma', 'Gamma meno theta', 'Pareggio'], en: ['Gamma', 'Gamma minus theta', 'Break-even'] },
    livelli: [gammaPnl, () => (P.chance(0.6) ? netto() : thetaDaGamma()), pareggio],
  });
})();
