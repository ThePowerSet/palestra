(function () {
  'use strict';
  const P = Palestra;

  const COMODE = {
    50: { it: 'la metà', en: 'half' },
    25: { it: 'un quarto', en: 'a quarter' },
    75: { it: 'tre quarti', en: 'three quarters' },
    20: { it: 'un quinto', en: 'a fifth' },
    40: { it: 'due quinti', en: 'two fifths' },
  };

  function scambio() {
    const y = P.pick([25, 50, 20, 75, 40]);
    let x;
    do {
      if (y === 25 || y === 75) x = 4 * P.int(2, 24);
      else if (y === 20 || y === 40) x = 5 * P.int(2, 19);
      else x = P.int(3, 97);
    } while (x === y || x % 10 === 0);
    const v = x * y / 100, nome = P.tr(COMODE[y]);
    return {
      testo: P.t(`Quanto fa ${P.il(x)}% di ${y}?`, `What is ${x}% of ${y}?`),
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`Scambia: ${P.il(x)}% di ${y} è uguale ${P.al(y)}% di ${x}.`, `Swap them: ${x}% of ${y} equals ${y}% of ${x}.`),
        P.t(`${P.cap(P.il(y))}% è ${nome}: ${nome} di ${x}.`, `${y}% is ${nome}: ${nome} of ${x}.`),
      ],
      soluzione: [
        P.t(`${P.il(x)}% di ${y} = ${P.il(y)}% di ${x}`, `${x}% of ${y} = ${y}% of ${x}`),
        P.t(`${y}% = ${nome}, e ${nome} di ${x} fa ${P.fmt(v)}`, `${y}% = ${nome}, and ${nome} of ${x} is ${P.fmt(v)}`),
      ],
    };
  }

  function puntiBase() {
    const n = P.int(2, 80), X = P.pick([5, 10, 20, 25, 40, 50, 75, 100, 125, 250, 500]);
    const v = n * X * 100;
    const testo = P.chance(0.5)
      ? P.t(`Il cliente paga ${n} punti base di commissione su un nozionale di ${X} milioni. Quanto incassa il desk?`,
        `The client pays ${n} basis points of commission on a ${X} million notional. How much does the desk collect?`)
      : P.t(`Un bond rende ${n} punti base più del Bund. Su ${X} milioni investiti, quanto ti dà in più in un anno?`,
        `A bond yields ${n} basis points more than the Bund. On ${X} million invested, how much extra does it pay in a year?`);
    return {
      testo,
      nota: P.t('in euro', 'in euros'),
      risposta: P.numero(v, { unita: '€' }),
      suggerimenti: [
        P.t(`1 punto base = ${P.fmt(0.01)}% = 1/${P.fmt(10000)}. Su 1 milione, 1 bp vale 100 €.`, `1 basis point = ${P.fmt(0.01)}% = 1/${P.fmt(10000)}. On 1 million, 1 bp is worth 100 €.`),
        P.t(`Quindi ${n} × ${X} × 100: fai prima ${n} × ${X}.`, `So ${n} × ${X} × 100: do ${n} × ${X} first.`),
      ],
      soluzione: [P.t('1 bp su 1 milione = 100 €', '1 bp on 1 million = 100 €'), `${n} × ${X} = ${P.fmt(n * X)}`, `${P.fmt(n * X)} × 100 = ${P.fmt(v)} €`],
    };
  }

  function posizione() {
    const y = P.pick([25, 50, 20, 40, 75]);
    let x; do { x = P.int(3, 19); } while (x === 10);
    const m = x * y / 100, v = m * 1e6, nome = P.tr(COMODE[y]);
    return {
      testo: P.t(`Un portafoglio da ${y} milioni ha ${P.il(x)}% in un solo titolo. Quanto vale quella posizione?`,
        `A ${y} million portfolio has ${x}% in a single stock. What is that position worth?`),
      nota: P.t('in euro (vanno bene anche «2.5m» o «2.5 milioni»)', 'in euros ("2.5m" or "2.5 million" work too)'),
      risposta: P.numero(v, { unita: '€' }),
      suggerimenti: [
        P.t(`Scambia: ${P.il(x)}% di ${y} è ${P.il(y)}% di ${x}, cioè ${nome} di ${x}.`, `Swap them: ${x}% of ${y} is ${y}% of ${x}, that is ${nome} of ${x}.`),
        P.t(`${P.cap(nome)} di ${x} = ${P.fmt(m)}: sono milioni.`, `${P.cap(nome)} of ${x} = ${P.fmt(m)}: that is in millions.`),
      ],
      soluzione: [
        P.t(`${P.il(x)}% di ${y} = ${nome} di ${x} = ${P.fmt(m)}`, `${x}% of ${y} = ${nome} of ${x} = ${P.fmt(m)}`),
        P.t(`${P.fmt(m)} milioni = ${P.fmt(v)} €`, `${P.fmt(m)} million = ${P.fmt(v)} €`),
      ],
    };
  }

  function puntiBaseInverso() {
    const n = P.int(2, 60), X = P.pick([10, 20, 25, 40, 50, 100, 125, 250]);
    const E = n * X * 100;
    return {
      testo: P.t(`Su un nozionale di ${X} milioni hai incassato ${P.fmt(E)} €. Quanti punti base sono?`,
        `On a ${X} million notional you collected ${P.fmt(E)} €. How many basis points is that?`),
      risposta: P.numero(n, { unita: 'bp' }),
      suggerimenti: [
        P.t(`Su ${X} milioni, 1 bp vale ${X} × 100 = ${P.fmt(X * 100)} €.`, `On ${X} million, 1 bp is worth ${X} × 100 = ${P.fmt(X * 100)} €.`),
        P.t(`Ora dividi: ${P.fmt(E)} / ${P.fmt(X * 100)}.`, `Now divide: ${P.fmt(E)} / ${P.fmt(X * 100)}.`),
      ],
      soluzione: [
        P.t(`1 bp su ${X} milioni = ${P.fmt(X * 100)} €`, `1 bp on ${X} million = ${P.fmt(X * 100)} €`),
        `${P.fmt(E)} / ${P.fmt(X * 100)} = ${n} bp`,
      ],
    };
  }

  function catena() {
    const x = P.pick([50, 25, 20, 10]), y = 2 * P.int(3, 48), z = P.pick([200, 300, 400, 500, 150, 250]);
    const mezzo = y * z / 100, v = x * mezzo / 100;
    return {
      testo: P.t(`Quanto fa ${P.il(x)}% ${P.del(y)}% di ${z}?`, `What is ${x}% of ${y}% of ${z}?`),
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`Parti da ${P.il(y)}% di ${z}: scambialo, è ${P.il(z)}% di ${y}.`, `Start with ${y}% of ${z}: swap it, it is ${z}% of ${y}.`),
        P.t(`${P.cap(P.il(z))}% di ${y} = ${P.fmt(z / 100)} × ${y} = ${P.fmt(mezzo)}. Poi ${P.il(x)}% di questo.`,
          `${z}% of ${y} = ${P.fmt(z / 100)} × ${y} = ${P.fmt(mezzo)}. Then ${x}% of that.`),
      ],
      soluzione: [
        P.t(`${P.il(y)}% di ${z} = ${P.il(z)}% di ${y} = ${P.fmt(mezzo)}`, `${y}% of ${z} = ${z}% of ${y} = ${P.fmt(mezzo)}`),
        P.t(`${P.il(x)}% di ${P.fmt(mezzo)} = ${P.fmt(v)}`, `${x}% of ${P.fmt(mezzo)} = ${P.fmt(v)}`),
      ],
    };
  }

  P.trucco({
    id: 'percentuali-scambio',
    materia: 'calcolo',
    capitolo: 'percent',
    numero: 3,
    titolo: { it: 'Scambia la percentuale', en: 'Swap the percentage' },
    sottotitolo: {
      it: 'L\'8% di 25 è il 25% di 8. E i punti base su un nozionale si fanno allo stesso modo.',
      en: '8% of 25 is 25% of 8. Basis points on a notional work the same way.',
    },
    aggancio: {
      it: '«Quanto fa l\'8% di 25 milioni?» Detta così sembra un conto. Girata, è il 25% di 8: due milioni, in un secondo.',
      en: '"What is 8% of 25 million?" Put like that it sounds like a calculation. Turned round, it is 25% of 8: two million, in a second.',
    },
    lezione: {
      it: `
<h3>Il gioco di prestigio</h3>
<p>L'8% di 25 vuol dire 8 × 25 / 100. Il 25% di 8 vuol dire 25 × 8 / 100. È lo stesso numero: la moltiplicazione non guarda l'ordine, e il «per cento» divide per 100 una volta sola, chiunque dei due lo porti.</p>
<div class="esempio">8% di 25 = 25% di 8 = un quarto di 8 = 2<br>36% di 50 = 50% di 36 = 18<br>16% di 75 = 75% di 16 = 12</div>

<h3>Quando usarlo</h3>
<p>Quando uno dei due numeri è una percentuale comoda e l'altro no. Le comode sono quelle che conosci come frazioni:</p>
<table class="tab"><tr><td>50%</td><td>la metà</td><td>25%</td><td>un quarto</td></tr><tr><td>20%</td><td>un quinto</td><td>75%</td><td>tre quarti</td></tr><tr><td>40%</td><td>due quinti</td><td>12.5%</td><td>un ottavo</td></tr><tr><td>10%</td><td>sposta la virgola</td><td>5%</td><td>metà del 10%</td></tr></table>
<p>Se nessuno dei due è comodo, spezza: 15% = 10% + 5%, 35% = 25% + 10%.</p>

<h3>Gli zeri a parte</h3>
<p>Con i milioni tieni gli zeri fuori dal conto e rimettili alla fine. L'8% di 25 milioni è il 25% di 8, cioè 2: due milioni.</p>

<h3>Punti base</h3>
<p>Un punto base (bp) è un centesimo di punto percentuale: 0.01% = 1/10,000. Su un milione vale 100 €. Da qui tutto il resto:</p>
<div class="esempio">16 bp su 50 milioni = 16 × 50 × 100 = 80,000 €<br>30,000 € su 25 milioni = 30,000 / 2,500 = 12 bp</div>
<p>Il prodotto 16 × 50 si fa con lo stesso scambio: il 50% di 16.</p>

<div class="trappola">Al contrario, se ti chiedono «quanti bp sono», prima calcola quanto vale 1 bp su quel nozionale (nozionale in milioni × 100) e poi dividi.</div>

<h3>Al desk</h3>
<p>Commissioni, cedole, spread sui bond, pesi di un portafoglio: sono tutte percentuali di un nozionale grande. Lo scambio ti fa fare il conto sul numero piccolo.</p>
`,
      en: `
<h3>The sleight of hand</h3>
<p>8% of 25 means 8 × 25 / 100. 25% of 8 means 25 × 8 / 100. It is the same number: multiplication doesn't care about order, and the "per cent" divides by 100 once, whichever of the two carries it.</p>
<div class="esempio">8% of 25 = 25% of 8 = a quarter of 8 = 2<br>36% of 50 = 50% of 36 = 18<br>16% of 75 = 75% of 16 = 12</div>

<h3>When to use it</h3>
<p>When one of the two numbers is a convenient percentage and the other isn't. The convenient ones are those you know as fractions:</p>
<table class="tab"><tr><td>50%</td><td>half</td><td>25%</td><td>a quarter</td></tr><tr><td>20%</td><td>a fifth</td><td>75%</td><td>three quarters</td></tr><tr><td>40%</td><td>two fifths</td><td>12.5%</td><td>an eighth</td></tr><tr><td>10%</td><td>move the point</td><td>5%</td><td>half of 10%</td></tr></table>
<p>If neither is convenient, split it: 15% = 10% + 5%, 35% = 25% + 10%.</p>

<h3>Keep the zeros aside</h3>
<p>With millions, keep the zeros out of the calculation and put them back at the end. 8% of 25 million is 25% of 8, which is 2: two million.</p>

<h3>Basis points</h3>
<p>A basis point (bp) is a hundredth of a percentage point: 0.01% = 1/10,000. On a million it is worth 100 €. Everything else follows:</p>
<div class="esempio">16 bp on 50 million = 16 × 50 × 100 = 80,000 €<br>30,000 € on 25 million = 30,000 / 2,500 = 12 bp</div>
<p>The product 16 × 50 uses the same swap: 50% of 16.</p>

<div class="trappola">The other way round, when they ask "how many bp is that", first work out what 1 bp is worth on that notional (notional in millions × 100), then divide.</div>

<h3>On the desk</h3>
<p>Commissions, coupons, bond spreads, portfolio weights: they are all percentages of a large notional. The swap lets you do the calculation on the small number.</p>
`,
    },
    scheda: {
      it: 'x% di y = y% di x: metti la percentuale sul numero comodo (50% la metà, 25% un quarto, 20% un quinto, 75% tre quarti, 12.5% un ottavo). Gli zeri dei milioni a parte. 1 bp = 0.01%; su 1 milione vale 100 €.',
      en: 'x% of y = y% of x: put the percentage on the convenient number (50% half, 25% a quarter, 20% a fifth, 75% three quarters, 12.5% an eighth). Keep the zeros of the millions aside. 1 bp = 0.01%; on 1 million it is worth 100 €.',
    },
    test: true,
    nomiLivelli: { it: ['Calcolo', 'Al desk', 'Al contrario e a catena'], en: ['Calculation', 'On the desk', 'Backwards and chained'] },
    livelli: [
      scambio,
      () => P.pesato([[0.55, puntiBase], [0.45, posizione]])(),
      () => P.pesato([[0.5, puntiBaseInverso], [0.5, catena]])(),
    ],
  });
})();
