(function () {
  'use strict';
  const P = Palestra;
  const f2 = x => P.fmt(Math.round(x * 100) / 100);
  // DV01 per million of notional, roughly, for bonds priced near par (rounded to friendly numbers)
  const SCADENZE = [
    { nome: { it: '2 anni', en: '2-year' }, dv: 200 },
    { nome: { it: '5 anni', en: '5-year' }, dv: 450 },
    { nome: { it: '10 anni', en: '10-year' }, dv: 900 },
    { nome: { it: '30 anni', en: '30-year' }, dv: 1800 },
  ];

  function prezzo() {
    const Pz = P.pick([95, 98, 100, 100, 102, 104, 110]), D = P.pick([2, 4, 5, 6, 7, 8, 10, 15]), bp = P.pick([5, 10, 15, 20, 25, 40, 50]) * P.segno();
    const dP = -D * Pz * bp / 10000, nuovo = P.chance(0.5);
    const v = nuovo ? Pz + dP : dP;
    return {
      testo: nuovo
        ? P.t(`Un bond quota ${Pz} con duration modificata ${D}. I rendimenti ${bp > 0 ? 'salgono' : 'scendono'} di ${Math.abs(bp)} punti base. A quanto va il prezzo?`,
          `A bond trades at ${Pz} with modified duration ${D}. Yields ${bp > 0 ? 'rise' : 'fall'} by ${Math.abs(bp)} basis points. Where does the price go?`)
        : P.t(`Un bond quota ${Pz} con duration modificata ${D}. I rendimenti ${bp > 0 ? 'salgono' : 'scendono'} di ${Math.abs(bp)} punti base. Di quanto cambia il prezzo?`,
          `A bond trades at ${Pz} with modified duration ${D}. Yields ${bp > 0 ? 'rise' : 'fall'} by ${Math.abs(bp)} basis points. By how much does the price change?`),
      nota: nuovo ? P.t('al primo ordine', 'to first order') : P.t('con il segno, al primo ordine', 'with its sign, to first order'),
      risposta: P.numero(v, { tol: 0.006, mostra: f2(v) }),
      suggerimenti: [
        P.t('ΔP ≈ −D × P × Δy: il prezzo si muove al contrario del rendimento, D volte tanto in percentuale.', 'ΔP ≈ −D × P × Δy: the price moves against the yield, D times as much in percentage.'),
        P.t(`${Math.abs(bp)} pb = ${P.fmt(Math.abs(bp) / 100)}%; × ${D} = ${P.fmt(Math.abs(bp) * D / 100)}% del prezzo.`, `${Math.abs(bp)} bp = ${P.fmt(Math.abs(bp) / 100)}%; × ${D} = ${P.fmt(Math.abs(bp) * D / 100)}% of the price.`),
      ],
      soluzione: [
        `−${D} × ${Pz} × (${P.conSegno(bp / 10000)}) = ${P.conSegno(Math.round(dP * 100) / 100)}`,
        ...(nuovo ? [`${Pz} ${P.piuMeno(Math.round(dP * 100) / 100)} = ${f2(v)}`] : []),
      ],
    };
  }

  function dv01() {
    const N = P.pick([5, 10, 20, 25, 50, 100]), Pz = P.pick([95, 100, 100, 100, 105, 110]), D = P.pick([2, 4, 5, 6.5, 8, 10, 18]);
    const v = D * (Pz / 100) * N * 1e6 * 1e-4, bp = P.pick([0, 0, 3, 5, 10]);
    if (bp) {
      const pnl = -v * bp * P.segno(), su = pnl < 0;
      return {
        testo: P.t(`Sei lungo ${N} milioni di nominale di un bond a ${Pz}, duration modificata ${P.fmt(D)}. I rendimenti ${su ? 'salgono' : 'scendono'} di ${bp} pb. P&L in euro?`,
          `You are long ${N} million notional of a bond at ${Pz}, modified duration ${P.fmt(D)}. Yields ${su ? 'rise' : 'fall'} by ${bp} bp. P&L in euros?`),
        nota: P.t('con il segno; 1 pb = 0.01%', 'with its sign; 1 bp = 0.01%'),
        risposta: P.numero(pnl, { rel: 0.01, unita: '€', mostra: P.fmt(Math.round(pnl)) }),
        suggerimenti: [
          P.t('Prima il DV01, cioè quanto perdi per 1 pb: D × valore di mercato × 0.0001. Poi per i punti base.', 'First the DV01, what you lose per 1 bp: D × market value × 0.0001. Then times the basis points.'),
          P.t(`valore: ${N} milioni × ${P.fmt(Pz / 100)} = ${P.fmt(N * Pz / 100)} milioni; DV01 = ${P.fmt(Math.round(v))} €.`, `value: ${N} million × ${P.fmt(Pz / 100)} = ${P.fmt(N * Pz / 100)} million; DV01 = ${P.fmt(Math.round(v))} €.`),
        ],
        soluzione: [`DV01 = ${P.fmt(D)} × ${P.fmt(N * Pz / 100)}m × 0.0001 = ${P.fmt(Math.round(v))} €`, `${P.fmt(Math.round(v))} × ${bp} = ${P.fmt(Math.round(Math.abs(pnl)))} € ${su ? P.t('persi', 'lost') : P.t('guadagnati', 'made')}`],
      };
    }
    return {
      testo: P.t(`Hai ${N} milioni di nominale di un bond a ${Pz}, duration modificata ${P.fmt(D)}. Qual è il DV01 della posizione, in euro?`,
        `You hold ${N} million notional of a bond at ${Pz}, modified duration ${P.fmt(D)}. What is the position's DV01, in euros?`),
      nota: P.t('quanto cambia il valore per 1 punto base', 'how much the value changes per 1 basis point'),
      risposta: P.numero(v, { rel: 0.01, unita: '€', mostra: P.fmt(Math.round(v)) }),
      suggerimenti: [
        P.t('DV01 = D × valore di mercato × 0.0001.', 'DV01 = D × market value × 0.0001.'),
        P.t(`valore di mercato: ${N} milioni × ${P.fmt(Pz / 100)} = ${P.fmt(N * Pz / 100)} milioni.`, `market value: ${N} million × ${P.fmt(Pz / 100)} = ${P.fmt(N * Pz / 100)} million.`),
      ],
      soluzione: [`${P.fmt(D)} × ${P.fmt(N * Pz / 100 * 1e6)} × 0.0001 = ${P.fmt(Math.round(v))} €`],
    };
  }

  function copertura() {
    const [a, b] = P.pick([[2, 0], [1, 0], [3, 2], [2, 1], [3, 1], [1, 2]]), A = SCADENZE[a], B = SCADENZE[b], N = P.pick([10, 20, 25, 50]);
    const v = N * A.dv / B.dv;
    return {
      testo: P.t(`Sei lungo ${N} milioni del bond a ${P.tr(A.nome)} (DV01 circa ${P.fmt(A.dv)} € per milione). Quanti milioni del bond a ${P.tr(B.nome)} (DV01 circa ${P.fmt(B.dv)} € per milione) vendi per non avere DV01?`,
        `You are long ${N} million of the ${P.tr(A.nome)} bond (DV01 about ${P.fmt(A.dv)} € per million). How many million of the ${P.tr(B.nome)} bond (DV01 about ${P.fmt(B.dv)} € per million) do you sell to have no DV01?`),
      nota: P.t('in milioni', 'in millions'),
      risposta: P.numero(v, { rel: 0.02, mostra: P.fmt(Math.round(v * 10) / 10) }),
      suggerimenti: [
        P.t('Stesso DV01 dalle due parti: N₁ × DV01₁ = N₂ × DV01₂.', 'Same DV01 on both sides: N₁ × DV01₁ = N₂ × DV01₂.'),
        P.t(`DV01 da coprire: ${N} × ${P.fmt(A.dv)} = ${P.fmt(N * A.dv)} €.`, `DV01 to hedge: ${N} × ${P.fmt(A.dv)} = ${P.fmt(N * A.dv)} €.`),
      ],
      soluzione: [`${N} × ${P.fmt(A.dv)} = ${P.fmt(N * A.dv)} €`, `${P.fmt(N * A.dv)} / ${P.fmt(B.dv)} = ${P.fmt(Math.round(v * 10) / 10)} ${P.t('milioni', 'million')}`,
        P.t('coperto per movimenti paralleli; resta esposto se la curva cambia pendenza', 'hedged for parallel moves; still exposed if the curve changes slope')],
    };
  }

  P.trucco({
    id: 'tassi-dv01',
    materia: 'tassi',
    capitolo: 'duration',
    numero: 1,
    titolo: { it: 'Duration e DV01', en: 'Duration and DV01' },
    sottotitolo: {
      it: 'Di quanto si muove un bond quando si muovono i rendimenti, quanto vale un punto base e come si copre una posizione.',
      en: 'How much a bond moves when yields move, what a basis point is worth and how a position is hedged.',
    },
    aggancio: {
      it: '«Sei lungo 10 milioni del decennale, i rendimenti salgono di 5 punti base. Quanto hai perso?» Circa 45,000 euro: DV01 di 9,000 per 5.',
      en: '"You are long 10 million of the ten-year, yields rise 5 basis points. How much have you lost?" About 45,000 euros: a DV01 of 9,000 times 5.',
    },
    lezione: {
      it: `
<h3>La duration</h3>
<p>Il prezzo di un bond si muove al contrario del suo rendimento. La duration modificata D dice di quanto, in percentuale: se il rendimento sale di Δy, il prezzo scende di circa D × Δy.</p>
<div class="esempio">ΔP ≈ −D × P × Δy<br>prezzo 100, D = 7, rendimenti +20 pb: −7 × 100 × 0.002 = −1.40 → 98.60</div>
<p>Più lunga la scadenza e più basse le cedole, più alta la duration: un decennale ha D intorno a 8 o 9, un bond a 2 anni intorno a 2.</p>

<h3>Il DV01</h3>
<p>Al desk il rischio si conta in euro per punto base: il DV01 (o PV01) è quanto cambia il valore della posizione se i rendimenti si muovono di 1 pb.</p>
<div class="esempio">DV01 = D × valore di mercato × 0.0001<br>10 milioni a 100 con D = 9: 9 × 10,000,000 × 0.0001 = 9,000 € per pb</div>
<p>Il P&L di un movimento è DV01 × punti base, con il segno: chi è lungo bond perde quando i rendimenti salgono.</p>

<h3>Coprire con un altro bond</h3>
<p>Per togliere il rischio di tasso si vende un altro bond con lo stesso DV01 totale: N₂ = N₁ × DV01₁ / DV01₂. Lungo 10 milioni del decennale (900 € per milione) si coprono con circa 45 milioni del biennale (200 € per milione).</p>

<div class="trappola">Lo stesso DV01 copre solo i movimenti paralleli. Se la curva si irripidisce, i rendimenti lunghi salgono più di quelli corti e la copertura con il biennale perde: è proprio la scommessa sulla pendenza della curva. E per movimenti grandi conta anche la convessità, che il primo ordine ignora.</div>
`,
      en: `
<h3>Duration</h3>
<p>A bond's price moves against its yield. Modified duration D says by how much, in percentage: if the yield rises by Δy, the price falls by about D × Δy.</p>
<div class="esempio">ΔP ≈ −D × P × Δy<br>price 100, D = 7, yields +20 bp: −7 × 100 × 0.002 = −1.40 → 98.60</div>
<p>The longer the maturity and the lower the coupons, the higher the duration: a ten-year has D around 8 or 9, a two-year around 2.</p>

<h3>DV01</h3>
<p>On the desk risk is counted in euros per basis point: DV01 (or PV01) is how much the position's value changes if yields move by 1 bp.</p>
<div class="esempio">DV01 = D × market value × 0.0001<br>10 million at 100 with D = 9: 9 × 10,000,000 × 0.0001 = 9,000 € per bp</div>
<p>A move's P&L is DV01 × basis points, with its sign: whoever is long bonds loses when yields rise.</p>

<h3>Hedging with another bond</h3>
<p>To take out the rate risk you sell another bond with the same total DV01: N₂ = N₁ × DV01₁ / DV01₂. Long 10 million of the ten-year (900 € per million) is hedged with about 45 million of the two-year (200 € per million).</p>

<div class="trappola">The same DV01 only hedges parallel moves. If the curve steepens, long yields rise more than short ones and the two-year hedge loses: that is exactly the bet on the slope of the curve. And for big moves convexity matters too, which first order ignores.</div>
`,
    },
    scheda: {
      it: 'ΔP ≈ −D × P × Δy. DV01 = D × valore × 0.0001, in euro per pb; P&L = DV01 × pb con il segno. Copertura: N₂ = N₁ × DV01₁ / DV01₂, solo per movimenti paralleli.',
      en: 'ΔP ≈ −D × P × Δy. DV01 = D × value × 0.0001, in euros per bp; P&L = DV01 × bp with its sign. Hedge: N₂ = N₁ × DV01₁ / DV01₂, parallel moves only.',
    },
    fonti: [
      P.fonte('zhou', '§6.4, "Duration and convexity"', { nota: { it: 'la teoria: duration, convessità e variazione di prezzo', en: 'the theory: duration, convexity and price change' } }),
      P.fonte('crack', 'Question 3.13', { nota: { it: 'dimezzare l\'esposizione di una posizione in bond', en: 'halving the exposure of a bond position' } }),
    ],
    test: false,
    nomiLivelli: { it: ['Prezzo', 'DV01 e P&L', 'Copertura'], en: ['Price', 'DV01 and P&L', 'Hedging'] },
    livelli: [prezzo, dv01, copertura],
  });
})();
