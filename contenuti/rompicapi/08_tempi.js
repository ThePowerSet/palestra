(function () {
  'use strict';
  const P = Palestra;
  const F = {
    angolo: P.fonte('crack', 'Question 1.12'),
    campane: P.fonte('crack', 'Question 1.3'),
    fiume: P.fonte('zhou', '§2.2, "River crossing"'),
    corde: P.fonte('zhou', '§2.2, "Burning ropes"'),
    cordeAltri: P.fonte('winkler', '"Measuring with Fuses"', { nota: { it: 'le stesse micce, 45 secondi; anche Crack, Question 1.60', en: 'the same fuses, 45 seconds; also Crack, Question 1.60' } }),
    lancette: P.fonte('crack', 'Question 1.13'),
    mosca: P.fonte('crack', 'Question 1.31'),
  };
  const mcm = (a, b) => a / P.mcd(a, b) * b;
  const ora = (h, m) => `${h}:${String(m).padStart(2, '0')}`;

  function angolo() {
    const h = P.int(1, 12), m = P.pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 12, 18, 24, 36, 42, 48]);
    const ore = (h % 12) * 30 + m / 2, minuti = m * 6;
    let a = Math.abs(ore - minuti); if (a > 180) a = 360 - a;
    return {
      testo: P.t(`Che angolo formano la lancetta delle ore e quella dei minuti alle ${ora(h, m)}?`, `What angle do the hour hand and the minute hand make at ${ora(h, m)}?`),
      nota: P.t('in gradi, l\'angolo più piccolo fra le due', 'in degrees, the smaller angle between them'),
      risposta: P.numero(a),
      suggerimenti: [
        P.t('La lancetta dei minuti fa 6° al minuto. Quella delle ore 30° all\'ora, cioè 0.5° al minuto: alle ' + ora(h, m) + ' non è ferma ' + (h === 8 || h === 11 ? 'sull\'' : 'sul ') + h + '.', 'The minute hand moves 6° a minute. The hour hand 30° an hour, so 0.5° a minute: at ' + ora(h, m) + ' it is not sitting on the ' + h + '.'),
        P.t(`Ore: ${h % 12} × 30 + ${m} × 0.5 = ${P.fmt(ore)}°. Minuti: ${m} × 6 = ${minuti}°.`, `Hours: ${h % 12} × 30 + ${m} × 0.5 = ${P.fmt(ore)}°. Minutes: ${m} × 6 = ${minuti}°.`),
      ],
      soluzione: [`|${P.fmt(ore)} − ${minuti}| = ${P.fmt(Math.abs(ore - minuti))}°${Math.abs(ore - minuti) > 180 ? ` → 360 − ${P.fmt(Math.abs(ore - minuti))} = ${P.fmt(a)}°` : ''}`],
      fonte: F.angolo,
    };
  }

  function campane() {
    let a, b;
    do { a = P.pick([2, 3, 4, 5, 6, 10, 12, 15, 20]); b = P.pick([2, 3, 4, 5, 6, 10, 12, 15, 20]); } while (a === b || 60 % a || 60 % b);
    const ia = 60 / a, ib = 60 / b, t = mcm(ia, ib);
    return {
      testo: P.t(`Una campana suona ${a} volte al minuto, un'altra ${b} volte al minuto, a intervalli regolari. Suonano insieme adesso. Dopo quanti secondi suonano di nuovo insieme?`,
        `One bell rings ${a} times a minute, another ${b} times a minute, at regular intervals. They ring together now. After how many seconds do they next ring together?`),
      nota: P.t('in secondi', 'in seconds'),
      risposta: P.numero(t),
      suggerimenti: [
        P.t('Passa dagli intervalli: ogni quanti secondi suona ognuna?', 'Switch to intervals: every how many seconds does each ring?'),
        P.t(`Ogni ${ia} e ogni ${ib} secondi: suonano insieme ai multipli comuni.`, `Every ${ia} and every ${ib} seconds: they ring together at the common multiples.`),
      ],
      soluzione: [P.t(`intervalli: 60/${a} = ${ia} s e 60/${b} = ${ib} s`, `intervals: 60/${a} = ${ia} s and 60/${b} = ${ib} s`), P.t(`mcm(${ia}, ${ib}) = ${t} secondi`, `lcm(${ia}, ${ib}) = ${t} seconds`)],
      fonte: F.campane,
    };
  }

  // Four people, one torch, the bridge holds two: either the fastest escorts everyone,
  // or the two slowest cross together
  function fiume() {
    let a, b, c, d;
    do { a = P.int(1, 3); b = P.int(a + 1, 6); c = P.int(b + 1, 12); d = P.int(c + 1, 25); } while (false);
    const s1 = 2 * a + b + c + d, s2 = a + 3 * b + d, v = Math.min(s1, s2);
    return {
      testo: P.t(`Quattro persone devono attraversare di notte un ponte che regge due persone alla volta, con una sola torcia che deve accompagnare ogni attraversamento. Da sole impiegano ${a}, ${b}, ${c} e ${d} minuti; in due si va al passo del più lento. Qual è il tempo minimo per portarle tutte dall'altra parte?`,
        `Four people must cross a bridge at night; it holds two at a time and their single torch must go with every crossing. Alone they take ${a}, ${b}, ${c} and ${d} minutes; two together go at the slower one's pace. What is the shortest time to get everyone across?`),
      nota: P.t('in minuti', 'in minutes'),
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`Prova due piani: il più veloce (${a}) accompagna tutti e torna ogni volta; oppure i due più lenti attraversano insieme.`, `Try two plans: the fastest (${a}) escorts everyone and comes back each time; or the two slowest cross together.`),
        P.t(`Primo piano: 2 × ${a} + ${b} + ${c} + ${d}. Secondo: ${a} e ${b} vanno, ${a} torna, ${c} e ${d} vanno, ${b} torna, ${a} e ${b} vanno: ${a} + 3 × ${b} + ${d}.`, `First plan: 2 × ${a} + ${b} + ${c} + ${d}. Second: ${a} and ${b} go, ${a} returns, ${c} and ${d} go, ${b} returns, ${a} and ${b} go: ${a} + 3 × ${b} + ${d}.`),
      ],
      soluzione: [
        P.t(`il più veloce accompagna: ${s1} minuti`, `the fastest escorts: ${s1} minutes`),
        P.t(`i due lenti insieme: ${s2} minuti`, `the two slow ones together: ${s2} minutes`),
        P.t(`minimo: ${v}`, `shortest: ${v}`),
      ],
      fonte: F.fiume,
    };
  }

  // Fuses burn unevenly, but lit at both ends they always take half their time
  function corde(tre = false) {
    const T = P.pick([40, 60, 80, 120]);
    const v = tre ? 9 * T / 8 : 3 * T / 4;
    return {
      testo: tre
        ? P.t(`Hai tre micce che bruciano ognuna in ${T} minuti, ma in modo irregolare. Accendi la prima da tutti e due i capi e la seconda da un capo. Quando la prima finisce, accendi l'altro capo della seconda e un capo della terza. Quando finisce la seconda, accendi l'altro capo della terza. Dopo quanti minuti dall'inizio finisce la terza?`,
          `You have three fuses that each burn in ${T} minutes, but unevenly. You light the first at both ends and the second at one end. When the first is gone, you light the other end of the second and one end of the third. When the second is gone, you light the other end of the third. How many minutes after the start does the third burn out?`)
        : P.t(`Hai due micce che bruciano ognuna in ${T} minuti, ma in modo irregolare: metà lunghezza non vuol dire metà tempo. Accendi la prima da tutti e due i capi e la seconda da un capo solo; quando la prima finisce, accendi l'altro capo della seconda. Dopo quanti minuti dall'inizio finisce la seconda?`,
          `You have two fuses that each burn in ${T} minutes, but unevenly: half the length does not mean half the time. You light the first at both ends and the second at one end only; when the first is gone, you light the other end of the second. How many minutes after the start does the second burn out?`),
      nota: P.t('in minuti', 'in minutes'),
      risposta: P.numero(v),
      suggerimenti: [
        P.t('Una miccia accesa da tutti e due i capi brucia nella metà del tempo che le resta, comunque sia irregolare: i due fuochi si incontrano.', 'A fuse lit at both ends burns in half its remaining time, however uneven it is: the two flames meet.'),
        P.t(`La prima finisce dopo ${T / 2} minuti; alla seconda restano allora ${T / 2} minuti di fuoco, che con due capi accesi diventano ${T / 4}.`, `The first is gone after ${T / 2} minutes; the second then has ${T / 2} minutes of burning left, which with both ends lit becomes ${T / 4}.`),
      ],
      soluzione: tre ? [
        P.t(`la prima finisce a ${T / 2}; la seconda a ${T / 2} + ${T / 4} = ${3 * T / 4}`, `the first is gone at ${T / 2}; the second at ${T / 2} + ${T / 4} = ${3 * T / 4}`),
        P.t(`la terza, accesa a ${T / 2}, ha bruciato ${T / 4}: le restano ${3 * T / 4}, a due capi ${3 * T / 8}`, `the third, lit at ${T / 2}, has burnt ${T / 4}: ${3 * T / 4} are left, at both ends ${3 * T / 8}`),
        `${3 * T / 4} + ${3 * T / 8} = ${v}`,
      ] : [
        P.t(`prima miccia: ${T}/2 = ${T / 2} minuti`, `first fuse: ${T}/2 = ${T / 2} minutes`),
        P.t(`seconda: le restano ${T / 2} minuti, a due capi ${T / 4}: ${T / 2} + ${T / 4} = ${v}`, `second: ${T / 2} minutes left, at both ends ${T / 4}: ${T / 2} + ${T / 4} = ${v}`),
      ],
      fonte: F.corde,
    };
  }

  // The minute hand gains 5.5° a minute on the hour hand: it catches up 360° every 720/11 minutes
  function lancette() {
    const h = P.int(1, 10), v = 60 * h / 11;
    return {
      testo: P.t(`Dopo le ${h}:00, fra quanti minuti la lancetta dei minuti e quella delle ore si sovrappongono per la prima volta?`,
        `After ${h}:00, in how many minutes do the minute hand and the hour hand first lie on top of each other?`),
      nota: P.t('in minuti, due decimali', 'in minutes, two decimals'),
      risposta: P.numero(v, { tol: 0.011, mostra: P.fmt(Math.round(v * 100) / 100) }),
      suggerimenti: [
        P.t('Alle ' + h + ':00 la lancetta delle ore è ' + (30 * h) + '° avanti. Quella dei minuti guadagna 6 − 0.5 = 5.5° al minuto.', 'At ' + h + ':00 the hour hand is ' + (30 * h) + '° ahead. The minute hand gains 6 − 0.5 = 5.5° a minute.'),
        P.t(`Minuti = ${30 * h} / 5.5 = ${60 * h} / 11.`, `Minutes = ${30 * h} / 5.5 = ${60 * h} / 11.`),
      ],
      soluzione: [`${30 * h}° / 5.5°/min = ${60 * h}/11 = ${P.fmt(Math.round(v * 100) / 100)} min`, P.t(`cioè alle ${h}:${String(Math.floor(v)).padStart(2, '0')} e ${Math.round((v % 1) * 60)} secondi circa`, `that is about ${h}:${String(Math.floor(v)).padStart(2, '0')} and ${Math.round((v % 1) * 60)} seconds`)],
      fonte: F.lancette,
    };
  }

  function mosca() {
    const D = P.pick([20, 25, 30, 40, 60, 90]), v1 = P.pick([10, 15, 20, 30]), v2 = P.pick([20, 25, 30, 40, 50]), f = P.pick([45, 50, 60, 75, 80, 100]);
    const t = D / (v1 + v2), s = f * t;
    return {
      testo: P.t(`Due ciclisti distano ${D} km e si vengono incontro, uno a ${v1} km/h e l'altro a ${v2} km/h. Una mosca parte dal primo, vola a ${f} km/h fino al secondo, torna indietro, e continua avanti e indietro finché i ciclisti si incontrano. Quanti km vola la mosca in tutto?`,
        `Two cyclists are ${D} km apart and ride towards each other, one at ${v1} km/h and the other at ${v2} km/h. A fly leaves the first, flies at ${f} km/h to the second, turns back, and keeps going back and forth until the cyclists meet. How many km does the fly cover in all?`),
      nota: P.t('in km', 'in km'),
      risposta: P.numero(s, { tol: 0.011, mostra: P.fmt(Math.round(s * 100) / 100) }),
      suggerimenti: [
        P.t('Non sommare i viaggi della mosca: chiediti per quanto tempo vola.', 'Do not add up the fly\'s trips: ask how long it flies.'),
        P.t(`I ciclisti si avvicinano a ${v1} + ${v2} = ${v1 + v2} km/h: si incontrano dopo ${D}/${v1 + v2} ore.`, `The cyclists close in at ${v1} + ${v2} = ${v1 + v2} km/h: they meet after ${D}/${v1 + v2} hours.`),
      ],
      soluzione: [P.t(`tempo: ${D} / ${v1 + v2} = ${P.fmt(t, 4)} ore`, `time: ${D} / ${v1 + v2} = ${P.fmt(t, 4)} hours`), `${f} × ${P.fmt(t, 4)} = ${P.fmt(Math.round(s * 100) / 100)} km`],
      fonte: F.mosca,
    };
  }

  P.trucco({
    id: 'bt-tempi',
    materia: 'rompicapi',
    capitolo: 'informazione',
    numero: 8,
    titolo: { it: 'Orologi, micce e ponti', en: 'Clocks, fuses and bridges' },
    sottotitolo: {
      it: 'Problemi di tempo dove il trucco è scegliere che cosa misurare: gradi al minuto, mezze micce, il tempo invece della strada.',
      en: 'Timing problems where the trick is choosing what to measure: degrees per minute, half fuses, the time instead of the distance.',
    },
    aggancio: {
      it: '«Hai due micce da un minuto che bruciano in modo irregolare. Misura 45 secondi.» Non si può tagliarle a metà: si può accenderle da due capi.',
      en: '"You have two one-minute fuses that burn unevenly. Measure 45 seconds." You cannot cut them in half: you can light them at both ends.',
    },
    lezione: {
      it: `
<h3>Velocità relative</h3>
<p>Le lancette sono due corridori su una pista di 360°: i minuti fanno 6° al minuto, le ore 0.5°. Per un angolo basta sapere dove sta ognuna; per sapere quando si sovrappongono conta il vantaggio da recuperare, a 5.5° al minuto.</p>
<div class="esempio">Alle 3:20: ore a 90 + 10 = 100°, minuti a 120°: 20°.<br>Dopo le 3:00 si sovrappongono dopo 90 / 5.5 = 16.36 minuti.</div>

<h3>Il tempo invece della strada</h3>
<p>La mosca che vola avanti e indietro fra due ciclisti fa una serie infinita di viaggi. Non serve sommarli: vola finché i ciclisti si incontrano, e quel tempo è la distanza divisa per la somma delle velocità.</p>

<h3>Mezze micce e ponti</h3>
<p>Una miccia irregolare non si taglia a metà, ma accesa da due capi brucia sempre nella metà del tempo che le resta. Nel ponte con una torcia, ci sono due piani: il più veloce accompagna tutti (2a + b + c + d), oppure i due più lenti attraversano insieme (a + 3b + d). Si calcolano tutti e due e si prende il più corto.</p>

<div class="trappola">La lancetta delle ore si muove: alle 3:20 non è sul 3. E le campane che suonano «5 volte al minuto» lo fanno ogni 12 secondi: lavora con gli intervalli, non con le frequenze.</div>
`,
      en: `
<h3>Relative speeds</h3>
<p>The hands are two runners on a 360° track: minutes move 6° a minute, hours 0.5°. For an angle you just need where each one is; for when they overlap, count the lead to make up at 5.5° a minute.</p>
<div class="esempio">At 3:20: hours at 90 + 10 = 100°, minutes at 120°: 20°.<br>After 3:00 they overlap after 90 / 5.5 = 16.36 minutes.</div>

<h3>Time instead of distance</h3>
<p>The fly flying back and forth between two cyclists makes an infinite series of trips. No need to add them up: it flies until the cyclists meet, and that time is the distance divided by the sum of the speeds.</p>

<h3>Half fuses and bridges</h3>
<p>An uneven fuse cannot be cut in half, but lit at both ends it always burns in half its remaining time. On the bridge with one torch there are two plans: the fastest escorts everyone (2a + b + c + d), or the two slowest cross together (a + 3b + d). Work out both and take the shorter.</p>

<div class="trappola">The hour hand moves: at 3:20 it is not on the 3. And bells that ring "5 times a minute" do so every 12 seconds: work with intervals, not frequencies.</div>
`,
    },
    scheda: {
      it: 'Angolo: |30h + 0.5m − 6m|, al massimo 180. Sovrapposizione dopo le h: 60h/11 minuti. Mosca: tempo = distanza / somma delle velocità. Miccia a due capi: metà del tempo che resta. Ponte: min(2a + b + c + d, a + 3b + d). Campane: mcm degli intervalli.',
      en: 'Angle: |30h + 0.5m − 6m|, at most 180. Overlap after h: 60h/11 minutes. Fly: time = distance / sum of speeds. Fuse at both ends: half the time left. Bridge: min(2a + b + c + d, a + 3b + d). Bells: lcm of the intervals.',
    },
    fonti: [F.angolo, F.campane, F.fiume, F.corde, F.cordeAltri, F.lancette, F.mosca],
    test: false,
    nomiLivelli: { it: ['Lancette e campane', 'Ponte e micce', 'Sovrapposizioni, mosche, tre micce'], en: ['Hands and bells', 'Bridge and fuses', 'Overlaps, flies, three fuses'] },
    livelli: [
      () => (P.chance(0.6) ? angolo() : campane()),
      () => (P.chance(0.5) ? fiume() : corde()),
      () => P.pick([lancette, mosca, () => corde(true)])(),
    ],
  });
})();
