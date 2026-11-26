(function () {
  'use strict';
  const P = Palestra;

  const diff = t => t.slice(1).map((x, i) => x - t[i]);
  const lista = t => t.join(', ');

  function secondeCostanti() {
    const a = P.int(1, 20);
    if (P.chance(0.3)) {
      const d = P.int(2, 15) * (P.chance(0.15) ? -1 : 1);
      const t = [0, 1, 2, 3, 4].map(i => a + 50 + d * i);
      return {
        testo: `<span class="num">${lista(t)}, ?</span>`,
        risposta: P.numero(t[4] + d),
        suggerimenti: [
          P.t(`Scrivi le differenze fra termini vicini: ${lista(diff(t))}.`, `Write the differences between neighbouring terms: ${lista(diff(t))}.`),
          P.t(`La differenza è sempre ${d}.`, `The difference is always ${d}.`),
        ],
        soluzione: [P.t(`differenze: ${lista(diff(t))}`, `differences: ${lista(diff(t))}`), `${t[4]} ${P.piuMeno(d)} = ${t[4] + d}`],
      };
    }
    const d = P.int(1, 6), e = P.int(1, 4) * (P.chance(0.15) ? -1 : 1);
    const t = [a];
    for (let i = 0; i < 5; i++) t.push(t[i] + d + i * e);
    const vis = t.slice(0, 5), D = diff(vis), prossima = D[3] + e;
    return {
      testo: `<span class="num">${lista(vis)}, ?</span>`,
      risposta: P.numero(t[5]),
      suggerimenti: [
        P.t(`Scrivi le differenze fra termini vicini: ${lista(D)}.`, `Write the differences between neighbouring terms: ${lista(D)}.`),
        P.t(`Le differenze cambiano di ${e} ogni volta: la prossima è ${prossima}.`, `The differences change by ${e} each time: the next one is ${prossima}.`),
      ],
      soluzione: [
        P.t(`differenze: ${lista(D)}`, `differences: ${lista(D)}`),
        P.t(`differenze seconde: tutte ${e}`, `second differences: all ${e}`),
        P.t(`prossima differenza ${prossima}: ${vis[4]} ${P.piuMeno(prossima)} = ${t[5]}`, `next difference ${prossima}: ${vis[4]} ${P.piuMeno(prossima)} = ${t[5]}`),
      ],
    };
  }

  const NOTE = {
    geometrica: r => P.t(`si moltiplicano per ${r}`, `multiply by ${r}`),
    quadrati: () => P.t('sono i quadrati', 'are the squares'),
    primi: () => P.t('sono i numeri primi', 'are the primes'),
  };
  const PRIMI = [2, 3, 5, 7, 11, 13, 17, 19, 23];

  function differenzeNote() {
    const tipo = P.pick(['geometrica', 'geometrica', 'quadrati', 'primi']);
    const a = P.int(1, 12);
    let D, r = 0;
    if (tipo === 'geometrica') { r = P.pick([2, 2, 3]); const c = P.pick([1, 2, 3]); D = [0, 1, 2, 3, 4].map(i => c * r ** i); }
    else if (tipo === 'quadrati') { const s = P.int(1, 3); D = [0, 1, 2, 3, 4].map(i => (s + i) ** 2); }
    else { const s = P.int(0, 3); D = PRIMI.slice(s, s + 5); }
    const t = [a];
    for (const d of D) t.push(t[t.length - 1] + d);
    const vis = t.slice(0, 5), Dv = diff(vis), nota = NOTE[tipo](r);
    return {
      testo: `<span class="num">${lista(vis)}, ?</span>`,
      risposta: P.numero(t[5]),
      suggerimenti: [
        P.t(`Le differenze sono ${lista(Dv)}. Riconosci la sequenza delle differenze?`, `The differences are ${lista(Dv)}. Do you recognise the sequence of differences?`),
        P.t(`${P.cap(nota)}: la prossima è ${D[4]}.`, `They ${nota}: the next one is ${D[4]}.`),
      ],
      soluzione: [
        P.t(`differenze: ${lista(Dv)}, che ${nota}`, `differences: ${lista(Dv)}, which ${nota}`),
        `${vis[4]} + ${D[4]} = ${t[5]}`,
      ],
    };
  }

  function buco() {
    const a = P.int(1, 15), d = P.int(1, 6), e = P.int(1, 4);
    const t = [a];
    for (let i = 0; i < 5; i++) t.push(t[i] + d + i * e);
    const D1 = t[1] - t[0], D4 = t[4] - t[3], D5 = t[5] - t[4];
    return {
      testo: `<span class="num">${t[0]}, ${t[1]}, ?, ${t[3]}, ${t[4]}, ${t[5]}</span>`,
      nota: P.t('trova il termine che manca', 'find the missing term'),
      risposta: P.numero(t[2]),
      suggerimenti: [
        P.t('Con il buco non vedi tutte le differenze: usa quelle che hai alla fine per trovare il passo, poi torna indietro.',
          'With a gap you can\'t see all the differences: use the ones at the end to find the step, then work back.'),
        P.t(`Le ultime differenze sono ${D4} e ${D5}: crescono di ${e}. Dopo ${D1} viene ${D1 + e}.`, `The last differences are ${D4} and ${D5}: they grow by ${e}. After ${D1} comes ${D1 + e}.`),
      ],
      soluzione: [
        P.t(`differenze in fondo: ${D4}, ${D5} → passo ${e}`, `differences at the end: ${D4}, ${D5} → step ${e}`),
        P.t(`differenze: ${D1}, ${D1 + e}, ${D1 + 2 * e}, ${D4}, ${D5}`, `differences: ${D1}, ${D1 + e}, ${D1 + 2 * e}, ${D4}, ${D5}`),
        `${t[1]} + ${D1 + e} = ${t[2]}`,
      ],
    };
  }

  function cubi() {
    const k = P.int(-3, 6), s = P.int(1, 2);
    const t = [0, 1, 2, 3, 4, 5].map(i => (s + i) ** 3 + k);
    const vis = t.slice(0, 5);
    const termine = i => `${s + i}³${k ? ' ' + P.piuMeno(k) : ''}`;
    return {
      testo: `<span class="num">${lista(vis)}, ?</span>`,
      risposta: P.numero(t[5]),
      suggerimenti: [
        P.t(`Differenze ${lista(diff(vis))}, poi ${lista(diff(diff(vis)))}: non si fermano. Confronta con i cubi 1, 8, 27, 64, 125, 216.`,
          `Differences ${lista(diff(vis))}, then ${lista(diff(diff(vis)))}: they don't settle. Compare with the cubes 1, 8, 27, 64, 125, 216.`),
        k === 0 ? P.t('Ogni termine è un cubo esatto.', 'Each term is a perfect cube.') : P.t(`Ogni termine è un cubo ${P.piuMeno(k)}.`, `Each term is a cube ${P.piuMeno(k)}.`),
      ],
      soluzione: [lista([0, 1, 2, 3, 4].map(termine)), `${termine(5)} = ${t[5]}`],
    };
  }

  P.trucco({
    id: 'seq-differenze',
    materia: 'sequenze',
    capitolo: 'seq',
    numero: 1,
    titolo: { it: 'Differenze successive', en: 'Successive differences' },
    sottotitolo: {
      it: 'Sotto ogni coppia di numeri scrivi la differenza: metà delle sequenze si risolve in quella riga.',
      en: 'Under each pair of numbers write the difference: half of all sequences are solved on that line.',
    },
    aggancio: {
      it: 'Test a tempo, una sequenza al minuto: 2, 6, 12, 20, 30, ? Sotto scrivi 4, 6, 8, 10. La prossima differenza è 12, e la risposta è 42.',
      en: 'Timed test, one sequence a minute: 2, 6, 12, 20, 30, ? Underneath write 4, 6, 8, 10. The next difference is 12, and the answer is 42.',
    },
    lezione: {
      it: `
<h3>Il primo controllo, sempre</h3>
<p>Davanti a una sequenza, prima di cercare idee brillanti, scrivi sotto ogni coppia di numeri vicini la loro differenza. È il controllo più veloce, e da solo risolve buona parte dei test.</p>
<div class="esempio">2, 6, 12, 20, 30<br>&nbsp;&nbsp;4, 6, 8, 10 → la prossima è 12 → 42</div>

<h3>Cosa può dirti la riga delle differenze</h3>
<ul>
<li><b>Costante:</b> progressione aritmetica. 7, 12, 17, 22 → +5.</li>
<li><b>Cresce di un passo fisso</b> (differenze seconde costanti): la sequenza è un polinomio di secondo grado, come n² o n(n + 1). 2, 6, 12, 20 sono 1·2, 2·3, 3·4, 4·5.</li>
<li><b>Raddoppia o triplica:</b> 2, 3, 5, 9, 17 ha differenze 1, 2, 4, 8 → la prossima è 16 → 33.</li>
<li><b>È una sequenza nota:</b> quadrati (1, 4, 9, 16), primi (2, 3, 5, 7, 11), a volte Fibonacci.</li>
</ul>

<h3>Perché le differenze seconde costanti vogliono dire quadrato</h3>
<p>n² ha differenze (n + 1)² − n² = 2n + 1: 3, 5, 7, 9. Queste crescono sempre di 2. In generale, se la k-esima riga di differenze è costante, la sequenza è un polinomio di grado k. Per i cubi servono tre righe: per questo conviene riconoscerli a vista (1, 8, 27, 64, 125, 216).</p>

<h3>Con un buco in mezzo</h3>
<p>Se manca un termine, usa le differenze che hai alla fine per trovare il passo e torna indietro. 3, 5, ?, 15, 23, 33: in fondo 8 e 10, passo 2, quindi le differenze sono 2, 4, 6, 8, 10 e il buco è 9.</p>

<div class="trappola">Se dopo due righe le differenze non dicono niente, cambia strada: rapporti fra termini, due sequenze intercalate nelle posizioni pari e dispari, regole che si alternano. Sono i prossimi trucchi di questo capitolo.</div>
`,
      en: `
<h3>The first check, always</h3>
<p>Faced with a sequence, before looking for clever ideas, write under each pair of neighbouring numbers their difference. It is the fastest check, and on its own it solves a good share of the tests.</p>
<div class="esempio">2, 6, 12, 20, 30<br>&nbsp;&nbsp;4, 6, 8, 10 → the next is 12 → 42</div>

<h3>What the line of differences can tell you</h3>
<ul>
<li><b>Constant:</b> arithmetic progression. 7, 12, 17, 22 → +5.</li>
<li><b>Grows by a fixed step</b> (constant second differences): the sequence is a second-degree polynomial, like n² or n(n + 1). 2, 6, 12, 20 are 1·2, 2·3, 3·4, 4·5.</li>
<li><b>Doubles or triples:</b> 2, 3, 5, 9, 17 has differences 1, 2, 4, 8 → the next is 16 → 33.</li>
<li><b>Is a known sequence:</b> squares (1, 4, 9, 16), primes (2, 3, 5, 7, 11), sometimes Fibonacci.</li>
</ul>

<h3>Why constant second differences mean a square</h3>
<p>n² has differences (n + 1)² − n² = 2n + 1: 3, 5, 7, 9. These always grow by 2. In general, if the k-th line of differences is constant, the sequence is a polynomial of degree k. Cubes need three lines: that is why it pays to recognise them on sight (1, 8, 27, 64, 125, 216).</p>

<h3>With a gap in the middle</h3>
<p>If a term is missing, use the differences you have at the end to find the step and work back. 3, 5, ?, 15, 23, 33: at the end 8 and 10, step 2, so the differences are 2, 4, 6, 8, 10 and the gap is 9.</p>

<div class="trappola">If after two lines the differences tell you nothing, change approach: ratios between terms, two sequences interleaved in odd and even positions, alternating rules. Those are the next tricks in this chapter.</div>
`,
    },
    scheda: {
      it: 'Scrivi le differenze sotto la sequenza. Costanti: aritmetica. Crescono di un passo fisso: secondo grado (n², n(n + 1)). Raddoppiano: potenze di 2 nascoste. Sono quadrati o primi: riconoscili. Buco: trova il passo dalle differenze in fondo.',
      en: 'Write the differences under the sequence. Constant: arithmetic. Growing by a fixed step: second degree (n², n(n + 1)). Doubling: hidden powers of 2. Squares or primes: recognise them. Gap: find the step from the differences at the end.',
    },
    test: false,
    nomiLivelli: { it: ['Differenze', 'Differenze note', 'Buchi e cubi'], en: ['Differences', 'Known differences', 'Gaps and cubes'] },
    livelli: [
      secondeCostanti,
      differenzeNote,
      () => P.pesato([[0.6, buco], [0.4, cubi]])(),
    ],
  });
})();
