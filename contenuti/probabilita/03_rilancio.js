(function () {
  'use strict';
  const P = Palestra;
  const DADI = [4, 6, 6, 6, 8, 10, 12, 20];
  const un = n => ([8, 11, 18].includes(n) ? 'an' : 'a'); // 'an 8-sided die'

  // value of the game with r re-rolls left on an n-sided die, playing well: keep a face if it beats
  // what re-rolling is worth. valori[0] = one roll, no choice.
  function valori(n, r) {
    const v = [(n + 1) / 2];
    for (let i = 1; i <= r; i++) {
      let s = 0;
      for (let x = 1; x <= n; x++) s += Math.max(x, v[i - 1]);
      v.push(s / n);
    }
    return v;
  }
  const soglia = (c) => Math.floor(c) + 1; // smallest face strictly better than c

  function unRilancio() {
    const n = P.pick(DADI), c = (n + 1) / 2, v = valori(n, 1)[1], k = soglia(c), tieni = n - k + 1;
    const somma = (k + n) * tieni / 2;
    return {
      testo: P.t(`Lanci un dado da ${n} facce e vinci il numero che esce. Puoi rilanciare una volta, ma allora tieni il secondo risultato. Quanto vale il gioco, giocando al meglio?`,
        `You roll ${un(n)} ${n}-sided die and win the number that comes up. You may re-roll once, but then you keep the second result. What is the game worth, played well?`),
      nota: P.t('due decimali bastano', 'two decimals are enough'),
      risposta: P.numero(v, { tol: 0.006, mostra: P.fmt(Math.round(v * 1000) / 1000) }),
      suggerimenti: [
        P.t(`Rilanciare vale ${P.fmt(c)}, la media del dado: tieni ogni faccia sopra ${P.fmt(c)}.`, `Re-rolling is worth ${P.fmt(c)}, the die's average: keep every face above ${P.fmt(c)}.`),
        P.t(`Tieni da ${k} a ${n} (${tieni} facce su ${n}); nelle altre ${n - tieni} rilanci e prendi in media ${P.fmt(c)}.`, `Keep ${k} to ${n} (${tieni} faces out of ${n}); on the other ${n - tieni} you re-roll and get ${P.fmt(c)} on average.`),
      ],
      soluzione: [
        P.t(`tieni ${k}…${n}: somma ${P.fmt(somma)}, su ${n} → ${P.fmt(somma)}/${n}`, `keep ${k}…${n}: they add to ${P.fmt(somma)}, over ${n} → ${P.fmt(somma)}/${n}`),
        P.t(`rilanci con probabilità ${n - tieni}/${n}: ${n - tieni}/${n} × ${P.fmt(c)}`, `re-roll with probability ${n - tieni}/${n}: ${n - tieni}/${n} × ${P.fmt(c)}`),
        `${P.fmt(somma)}/${n} + ${P.fmt((n - tieni) * c)}/${n} = ${P.fmt(Math.round(v * 1000) / 1000)}`,
      ],
    };
  }

  function dueRilanci() {
    const n = P.pick([4, 6, 6, 6, 8, 10]), v = valori(n, 2), k1 = soglia(v[1]);
    if (P.chance(0.5)) {
      return {
        testo: P.t(`Stesso gioco con un dado da ${n} facce, ma puoi rilanciare fino a due volte. Al primo lancio, qual è il numero più basso che tieni?`,
          `Same game with ${un(n)} ${n}-sided die, but you may re-roll up to twice. On the first roll, what is the lowest number you keep?`),
        risposta: P.numero(k1),
        suggerimenti: [
          P.t('Si ragiona dalla fine: con un solo rilancio rimasto, il gioco vale quanto nella versione con un rilancio.', 'Work backwards: with one re-roll left, the game is worth what it is in the one-re-roll version.'),
          P.t(`Con un rilancio il gioco vale ${P.fmt(Math.round(v[1] * 1000) / 1000)}: tieni solo le facce che battono quel valore.`, `With one re-roll the game is worth ${P.fmt(Math.round(v[1] * 1000) / 1000)}: keep only the faces that beat it.`),
        ],
        soluzione: [
          P.t(`valore con un rilancio: ${P.fmt(Math.round(v[1] * 1000) / 1000)}`, `value with one re-roll: ${P.fmt(Math.round(v[1] * 1000) / 1000)}`),
          P.t(`al primo lancio tieni da ${k1} in su`, `on the first roll keep ${k1} and up`),
        ],
      };
    }
    return {
      testo: P.t(`Lanci un dado da ${n} facce e vinci il numero finale. Puoi rilanciare fino a due volte. Quanto vale il gioco, giocando al meglio?`,
        `You roll ${un(n)} ${n}-sided die and win the final number. You may re-roll up to twice. What is the game worth, played well?`),
      nota: P.t('due decimali bastano', 'two decimals are enough'),
      risposta: P.numero(v[2], { tol: 0.006, mostra: P.fmt(Math.round(v[2] * 1000) / 1000) }),
      suggerimenti: [
        P.t(`Dalla fine: un lancio solo vale ${P.fmt(v[0])}; con un rilancio vale ${P.fmt(Math.round(v[1] * 1000) / 1000)}.`, `From the end: a single roll is worth ${P.fmt(v[0])}; with one re-roll it is worth ${P.fmt(Math.round(v[1] * 1000) / 1000)}.`),
        P.t(`Al primo lancio tieni da ${k1} in su, altrimenti prendi ${P.fmt(Math.round(v[1] * 1000) / 1000)}.`, `On the first roll keep ${k1} and up, otherwise take ${P.fmt(Math.round(v[1] * 1000) / 1000)}.`),
      ],
      soluzione: [
        P.t(`valore con un rilancio: ${P.fmt(Math.round(v[1] * 1000) / 1000)}`, `value with one re-roll: ${P.fmt(Math.round(v[1] * 1000) / 1000)}`),
        P.t(`tieni ${k1}…${n}, altrimenti ${P.fmt(Math.round(v[1] * 1000) / 1000)}: ${P.fmt(Math.round(v[2] * 1000) / 1000)}`, `keep ${k1}…${n}, otherwise ${P.fmt(Math.round(v[1] * 1000) / 1000)}: ${P.fmt(Math.round(v[2] * 1000) / 1000)}`),
      ],
    };
  }

  function prezzo() {
    // how much to pay: value minus the edge you want, or which game is worth more
    if (P.chance(0.5)) {
      const n = 6, costo = P.pick([3, 3.5, 4, 4.5]), r = P.pick([0, 1, 2]), v = valori(n, r)[r], e = v - costo;
      return {
        testo: P.t(`Ti offro di giocare per ${P.fmt(costo)}: un dado, ${r === 0 ? 'nessun rilancio' : r === 1 ? 'un rilancio' : 'fino a due rilanci'}, vinci il numero finale. Quanto guadagni in media a partita, giocando al meglio?`,
          `I offer you the game for ${P.fmt(costo)}: one die, ${r === 0 ? 'no re-rolls' : r === 1 ? 'one re-roll' : 'up to two re-rolls'}, you win the final number. How much do you make per game on average, playing well?`),
        nota: P.t('con il segno; due decimali bastano', 'with its sign; two decimals are enough'),
        risposta: P.numero(e, { tol: 0.006, mostra: P.fmt(Math.round(e * 1000) / 1000) }),
        suggerimenti: [
          P.t('Il guadagno atteso è il valore del gioco meno quello che paghi.', 'The expected profit is the game\'s value minus what you pay.'),
          P.t('Dado da 6: nessun rilancio 3.5; uno 4.25; due 14/3 ≈ 4.67.', 'Six-sided die: no re-roll 3.5; one 4.25; two 14/3 ≈ 4.67.'),
        ],
        soluzione: [P.t(`valore: ${P.fmt(Math.round(v * 1000) / 1000)}`, `value: ${P.fmt(Math.round(v * 1000) / 1000)}`), `${P.fmt(Math.round(v * 1000) / 1000)} − ${P.fmt(costo)} = ${P.fmt(Math.round(e * 1000) / 1000)}`],
      };
    }
    const n = P.pick([6, 8, 10, 12, 20]), r = 1, v = valori(n, r)[1], soglie = soglia((n + 1) / 2);
    const opz = [P.fmt(soglie), P.fmt(soglie - 1), P.fmt(soglie + 1), P.fmt(n)];
    const ordine = P.mescola([0, 1, 2, 3]);
    return {
      testo: P.t(`Dado da ${n} facce, un rilancio. Da che numero in su conviene tenere il primo lancio?`, `${n}-sided die, one re-roll. From which number up should you keep the first roll?`),
      risposta: P.scelta(ordine.map(i => opz[i]), ordine.indexOf(0)),
      suggerimenti: [
        P.t('Tieni una faccia se vale più di quanto ti dà, in media, rilanciare.', 'Keep a face if it is worth more than re-rolling gives you on average.'),
        P.t(`Rilanciare vale ${P.fmt((n + 1) / 2)}.`, `Re-rolling is worth ${P.fmt((n + 1) / 2)}.`),
      ],
      soluzione: [P.t(`rilanciare vale ${P.fmt((n + 1) / 2)}: tieni da ${soglie} in su; il gioco vale ${P.fmt(Math.round(v * 1000) / 1000)}`, `re-rolling is worth ${P.fmt((n + 1) / 2)}: keep ${soglie} and up; the game is worth ${P.fmt(Math.round(v * 1000) / 1000)}`)],
    };
  }

  P.trucco({
    id: 'prob-rilancio',
    materia: 'probabilita',
    capitolo: 'giochi',
    numero: 3,
    titolo: { it: 'Rilanciare il dado', en: 'Re-rolling the die' },
    sottotitolo: {
      it: 'Quanto vale un gioco in cui puoi rilanciare: si ragiona dalla fine e si tiene solo quello che batte il valore di continuare.',
      en: 'What a game with re-rolls is worth: work back from the end and keep only what beats the value of carrying on.',
    },
    aggancio: {
      it: '«Lanci un dado e ti pago il numero. Puoi rilanciare una volta. Quanto paghi per giocare?» Meno di 4.25: tieni 4, 5 e 6, rilanci il resto.',
      en: '"You roll a die and I pay you the number. You can re-roll once. How much do you pay to play?" Less than 4.25: keep 4, 5 and 6, re-roll the rest.',
    },
    lezione: {
      it: `
<h3>Il ragionamento all'indietro</h3>
<p>Nei giochi in cui puoi fermarti o continuare si parte dall'ultima scelta. All'ultimo lancio non scegli niente: il dado da 6 vale 3.5. Al lancio prima, tieni il risultato solo se batte 3.5, cioè 4, 5 o 6; altrimenti rilanci e prendi 3.5 in media.</p>
<div class="esempio">un rilancio: (4 + 5 + 6)/6 + 3/6 × 3.5 = 2.5 + 1.75 = 4.25<br>due rilanci: tieni 5 e 6 (battono 4.25): (5 + 6)/6 + 4/6 × 4.25 = 14/3 ≈ 4.67</div>

<h3>La regola della soglia</h3>
<p>Ogni volta il confronto è lo stesso: quello che hai in mano contro quanto vale continuare. Con più rilanci la soglia sale, perché continuare vale di più. Con un dado da n facce e un rilancio, continuare vale (n + 1)/2 e tieni tutto quello che sta sopra.</p>

<h3>Prezzo e mercato</h3>
<p>Il valore del gioco è il centro: per giocare paghi meno, per farlo giocare a qualcun altro chiedi di più. La differenza è il tuo margine. Spesso la domanda successiva è «e se potessi rilanciare quante volte vuoi?»: il valore sale verso 6, ma ogni rilancio in più aggiunge sempre meno.</p>

<div class="trappola">Tenere il 3 «perché è sopra la metà» è l'errore tipico: la media del dado da 6 è 3.5, e un 3 vale meno di quanto ti dà rilanciare.</div>
`,
      en: `
<h3>Reasoning backwards</h3>
<p>In games where you can stop or carry on, start from the last choice. On the last roll you choose nothing: a six-sided die is worth 3.5. On the roll before, keep the result only if it beats 3.5, that is 4, 5 or 6; otherwise re-roll and get 3.5 on average.</p>
<div class="esempio">one re-roll: (4 + 5 + 6)/6 + 3/6 × 3.5 = 2.5 + 1.75 = 4.25<br>two re-rolls: keep 5 and 6 (they beat 4.25): (5 + 6)/6 + 4/6 × 4.25 = 14/3 ≈ 4.67</div>

<h3>The threshold rule</h3>
<p>Every time the comparison is the same: what you hold against what carrying on is worth. With more re-rolls the threshold rises, because carrying on is worth more. With an n-sided die and one re-roll, carrying on is worth (n + 1)/2 and you keep everything above it.</p>

<h3>Price and market</h3>
<p>The game's value is the centre: to play you pay less, to let someone else play you ask for more. The difference is your margin. The follow-up is often "and if you could re-roll as many times as you like?": the value climbs towards 6, but each extra re-roll adds less and less.</p>

<div class="trappola">Keeping a 3 "because it is above half" is the usual slip: a six-sided die averages 3.5, and a 3 is worth less than what re-rolling gives you.</div>
`,
    },
    scheda: {
      it: 'Si parte dalla fine: tieni solo ciò che batte il valore di continuare. Dado da 6: 3.5 → un rilancio 4.25 (tieni 4+) → due rilanci 14/3 ≈ 4.67 (tieni 5+). Dado da n, un rilancio: tieni sopra (n + 1)/2.',
      en: 'Start from the end: keep only what beats the value of carrying on. Six-sided die: 3.5 → one re-roll 4.25 (keep 4+) → two re-rolls 14/3 ≈ 4.67 (keep 5+). n-sided die, one re-roll: keep above (n + 1)/2.',
    },
    fonti: [
      P.fonte('crack', 'Question 4.8', { nota: { it: 'tre lanci di un dado, fermandosi quando conviene', en: 'three rolls of a die, stopping when it pays' } }),
    ],
    test: false,
    nomiLivelli: { it: ['Un rilancio', 'Due rilanci', 'Prezzo e soglia'], en: ['One re-roll', 'Two re-rolls', 'Price and threshold'] },
    livelli: [unRilancio, P.conFonte(dueRilanci, P.fonte('crack', 'Question 4.8', { nota: { it: 'tre lanci di un dado, fermandosi quando conviene', en: 'three rolls of a die, stopping when it pays' } })), prezzo],
  });
})();
