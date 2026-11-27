(function () {
  'use strict';
  const P = Palestra;
  const frazione = (a, b) => { const g = P.mcd(a, b); return `${a / g}/${b / g}`; };
  // ways of rolling a sum s with two dice
  const modi = s => 6 - Math.abs(s - 7);

  function contare() {
    const tipo = P.pick(['almenoUno', 'almenoUno', 'doppio', 'primo']);
    if (tipo === 'almenoUno') {
      const k = P.int(1, 6);
      return {
        testo: P.t(`Lanci due dadi. Ti dico che almeno uno dei due è un ${k}. Probabilità che siano tutti e due ${k}?`,
          `You roll two dice. I tell you that at least one of them is a ${k}. Probability that both are ${k}s?`),
        nota: P.t('una frazione va bene', 'a fraction is fine'),
        risposta: P.numero(1 / 11, { decimali: 3, mostra: '1/11' }),
        suggerimenti: [
          P.t('Conta i casi rimasti: dei 36, quanti hanno almeno un ' + k + '?', 'Count the cases left: of the 36, how many have at least one ' + k + '?'),
          P.t(`6 con il primo dado a ${k}, 6 con il secondo, meno il caso contato due volte: 11. Uno solo è ${k}-${k}.`, `6 with the first die at ${k}, 6 with the second, minus the case counted twice: 11. Only one is ${k}-${k}.`),
        ],
        soluzione: [P.t('casi con almeno un ' + k + ': 6 + 6 − 1 = 11', 'cases with at least one ' + k + ': 6 + 6 − 1 = 11'), P.t('favorevoli: 1 → 1/11', 'favourable: 1 → 1/11')],
      };
    }
    if (tipo === 'primo') {
      const k = P.int(1, 6);
      return {
        testo: P.t(`Lanci due dadi. Ti dico che il primo è un ${k}. Probabilità che siano tutti e due ${k}?`,
          `You roll two dice. I tell you that the first one is a ${k}. Probability that both are ${k}s?`),
        nota: P.t('una frazione va bene', 'a fraction is fine'),
        risposta: P.numero(1 / 6, { decimali: 3, mostra: '1/6' }),
        suggerimenti: [
          P.t('Qui sai quale dado è: il primo non dice niente sul secondo.', 'Here you know which die it is: the first says nothing about the second.'),
          P.t(`Resta solo da chiedersi se il secondo è un ${k}.`, `All that is left is whether the second is a ${k}.`),
        ],
        soluzione: [P.t('dadi indipendenti: 1/6', 'independent dice: 1/6'), P.t('diverso da «almeno uno è…», che dà 1/11', 'different from "at least one is…", which gives 1/11')],
      };
    }
    const s = P.int(3, 11), m = modi(s), pari = s % 2 === 0, v = pari ? 1 / m : 0;
    return {
      testo: P.t(`Lanci due dadi e la somma è ${s}. Probabilità che siano usciti due numeri uguali?`, `You roll two dice and the sum is ${s}. Probability that the two numbers are equal?`),
      nota: P.t('una frazione va bene', 'a fraction is fine'),
      risposta: P.numero(v, { decimali: 3, mostra: pari ? frazione(1, m) : '0' }),
      suggerimenti: [
        P.t(`Elenca le coppie (primo, secondo) con somma ${s}: sono ${m}.`, `List the pairs (first, second) adding to ${s}: there are ${m}.`),
        pari ? P.t(`Fra queste, una sola è un doppio: ${s / 2}-${s / 2}.`, `Of these, only one is a double: ${s / 2}-${s / 2}.`) : P.t('Con una somma dispari, si può avere un doppio?', 'With an odd sum, can you get a double?'),
      ],
      soluzione: [P.t(`coppie con somma ${s}: ${m}`, `pairs adding to ${s}: ${m}`), pari ? P.t(`un doppio → 1/${m}`, `one double → 1/${m}`) : P.t('somma dispari: nessun doppio → 0', 'odd sum: no double → 0')],
    };
  }

  function test() {
    const base = P.pick([[1, 100], [2, 100], [3, 100], [5, 100], [10, 100]]);
    const p = base[0] / base[1], sens = P.pick([0.8, 0.9, 0.95, 0.99]), fp = P.pick([0.01, 0.02, 0.05, 0.1]);
    const N = 10000, malati = N * p, veri = malati * sens, falsi = (N - malati) * fp, v = veri / (veri + falsi);
    const ctx = P.pick([
      { it: ['una malattia', 'la malattia', 'Un test'], en: ['a disease', 'the disease', 'A test'] },
      { it: ['frode', 'una frode', 'Un filtro antifrode'], en: ['fraud', 'fraud', 'A fraud filter'] },
    ]);
    const c = P.tr(ctx);
    return {
      testo: P.t(`${c[2]} riconosce ${P.il(P.fmt(sens * 100))}% dei casi di ${c[0]}, che riguarda ${P.il(P.fmt(p * 100))}% dei casi, e dà un falso allarme ${P.il(P.fmt(fp * 100)).replace(/^il /, 'nel ').replace(/^l'/, "nell'")}% degli altri. Scatta l'allarme: probabilità che ci sia davvero ${c[1]}?`,
        `${c[2]} catches ${P.fmt(sens * 100)}% of cases of ${c[0]}, which affects ${P.fmt(p * 100)}% of cases, and gives a false alarm on ${P.fmt(fp * 100)}% of the others. The alarm goes off: probability that there really is ${c[1]}?`),
      nota: P.t('in percentuale; basta una stima', 'as a percentage; an estimate is enough'),
      risposta: P.numero(v, { percento: true, rel: 0.04, mostra: P.pct(Math.round(v * 10000) / 10000) }),
      suggerimenti: [
        P.t(`Pensa a ${P.fmt(N)} casi: quanti sono davvero positivi e fanno scattare l'allarme, e quanti lo fanno scattare per errore?`, `Think of ${P.fmt(N)} cases: how many are truly positive and trigger the alarm, and how many trigger it by mistake?`),
        P.t(`veri: ${P.fmt(malati)} × ${P.fmt(sens)} = ${P.fmt(veri)}; falsi: ${P.fmt(N - malati)} × ${P.fmt(fp)} = ${P.fmt(falsi)}.`, `true: ${P.fmt(malati)} × ${P.fmt(sens)} = ${P.fmt(veri)}; false: ${P.fmt(N - malati)} × ${P.fmt(fp)} = ${P.fmt(falsi)}.`),
      ],
      soluzione: [
        P.t(`allarmi veri: ${P.fmt(veri)}; falsi: ${P.fmt(falsi)}`, `true alarms: ${P.fmt(veri)}; false: ${P.fmt(falsi)}`),
        `${P.fmt(veri)} / (${P.fmt(veri)} + ${P.fmt(falsi)}) = ${P.pct(Math.round(v * 10000) / 10000)}`,
      ],
    };
  }

  function moneta() {
    const n = P.pick([2, 3, 4, 5, 10, 100]), k = P.pick([2, 3, 4, 5, 6]), q = 2 ** k, v = q / (q + n - 1);
    return {
      testo: P.t(`In un sacchetto ci sono ${n} monete: una ha due teste, le altre sono normali. Ne prendi una a caso, la lanci ${k} ${k === 1 ? 'volta' : 'volte'} ed esce sempre testa. Probabilità che sia quella con due teste?`,
        `A bag holds ${n} coins: one has two heads, the others are fair. You pick one at random, toss it ${k} time${k === 1 ? '' : 's'} and get heads every time. Probability that it is the two-headed one?`),
      nota: P.t('una frazione va bene', 'a fraction is fine'),
      risposta: P.numero(v, { decimali: 3, mostra: frazione(q, q + n - 1) }),
      suggerimenti: [
        P.t(`Confronta i due modi di vedere ${k} teste: moneta truccata (probabilità 1) o moneta normale (probabilità 1/${q}), ognuno pesato da quanto è probabile prenderla.`,
          `Compare the two ways of seeing ${k} heads: the trick coin (probability 1) or a fair one (probability 1/${q}), each weighted by how likely you are to pick it.`),
        P.t(`Moltiplica tutto per ${n} × ${q}: truccata ${q}, normali ${n - 1} × 1 = ${n - 1}.`, `Multiply everything by ${n} × ${q}: trick coin ${q}, fair ones ${n - 1} × 1 = ${n - 1}.`),
      ],
      soluzione: [
        P.t(`truccata: 1/${n} × 1; normali: ${n - 1}/${n} × 1/${q}`, `trick coin: 1/${n} × 1; fair: ${n - 1}/${n} × 1/${q}`),
        `${q} / (${q} + ${n - 1}) = ${frazione(q, q + n - 1)} ≈ ${P.fmt(Math.round(v * 1000) / 1000)}`,
      ],
    };
  }

  // Monty Hall and its relatives: what the person opening the door knows is what changes the answer
  function monty() {
    const tipo = P.pick(['uno', 'uno', 'tutte', 'caso']);
    const n = tipo === 'caso' ? 3 : tipo === 'uno' ? P.pick([3, 3, 4, 5, 6]) : P.pick([3, 5, 10, 20, 100]);
    let num, den, testo, s1, s2, sol;
    if (tipo === 'uno') {
      num = n - 1; den = n * (n - 2);
      testo = P.t(`Ci sono ${n} porte, un premio dietro una sola. Ne scegli una. Il presentatore, che sa dov'è il premio, apre una delle altre porte vuote. Se cambi e prendi una delle porte chiuse rimaste${n > 3 ? ', a caso' : ''}, con che probabilità vinci?`,
        `There are ${n} doors, a prize behind just one. You pick one. The host, who knows where the prize is, opens one of the other, empty doors. If you switch to one of the closed doors left${n > 3 ? ', at random' : ''}, what is your chance of winning?`);
      s1 = P.t('Il presentatore non apre mai la tua porta né il premio: la tua porta resta a 1/' + n + '.', 'The host never opens your door or the prize: your door stays at 1/' + n + '.');
      s2 = P.t(`Il resto, ${n - 1}/${n}, si divide fra le ${n - 2} porte chiuse rimaste.`, `The rest, ${n - 1}/${n}, spreads over the ${n - 2} closed doors left.`);
      sol = [P.t(`la tua porta: 1/${n}; le altre chiuse insieme: ${n - 1}/${n}`, `your door: 1/${n}; the other closed doors together: ${n - 1}/${n}`), `${n - 1}/${n} ÷ ${n - 2} = ${num}/${den}`];
    } else if (tipo === 'tutte') {
      num = n - 1; den = n;
      testo = P.t(`Ci sono ${n} porte, un premio dietro una sola. Ne scegli una. Il presentatore, che sa dov'è il premio, apre ${n - 2} delle altre porte, tutte vuote, e ne lascia chiusa una. Con che probabilità vinci se cambi?`,
        `There are ${n} doors, a prize behind just one. You pick one. The host, who knows where the prize is, opens ${n - 2} of the other doors, all empty, and leaves one closed. What is your chance of winning if you switch?`);
      s1 = P.t('Quando hai scelto, avevi 1/' + n + '. Il presentatore sa e non tocca la tua porta: quella probabilità non cambia.', 'When you chose you had 1/' + n + '. The host knows and never touches your door: that probability does not change.');
      s2 = P.t(`Tutto il resto, ${n - 1}/${n}, finisce sull'unica porta chiusa che rimane.`, `All the rest, ${n - 1}/${n}, ends up on the one closed door left.`);
      sol = [P.t(`la tua porta: 1/${n}`, `your door: 1/${n}`), P.t(`cambiando: ${n - 1}/${n}`, `switching: ${n - 1}/${n}`)];
    } else {
      num = 1; den = 2;
      testo = P.t('Tre porte, un premio dietro una sola. Ne scegli una. Poi uno spettatore, che non sa niente, apre a caso una delle altre due: per fortuna è vuota. Con che probabilità vinci se cambi?',
        'Three doors, a prize behind just one. You pick one. Then someone from the audience, who knows nothing, opens one of the other two at random: luckily it is empty. What is your chance of winning if you switch?');
      s1 = P.t('Qui la porta aperta poteva nascondere il premio: che sia vuota è un\'informazione su tutte e due le porte chiuse.', 'Here the opened door could have hidden the prize: finding it empty tells you something about both closed doors.');
      s2 = P.t('Probabilità che la porta aperta sia vuota: 1/3 × 1 + 2/3 × 1/2 = 2/3. Di questi casi, quelli con il premio dietro la tua: 1/3.', 'Chance the opened door is empty: 1/3 × 1 + 2/3 × 1/2 = 2/3. Of those cases, the ones with the prize behind yours: 1/3.');
      sol = [P.t('la tua porta: (1/3) / (2/3) = 1/2', 'your door: (1/3) / (2/3) = 1/2'), P.t('cambiando: 1/2, non 2/3: lo spettatore non sapeva', 'switching: 1/2, not 2/3: the spectator did not know')];
    }
    return {
      testo, nota: P.t('una frazione va bene', 'a fraction is fine'),
      risposta: P.numero(num / den, { decimali: 3, mostra: frazione(num, den) }),
      suggerimenti: [s1, s2], soluzione: sol,
      fonte: tipo === 'caso' ? P.fonte('crack', 'Question 4.21') : P.fonte('zhou', '§4.3, "Monty Hall problem"'),
    };
  }

  P.trucco({
    id: 'prob-bayes',
    materia: 'probabilita',
    capitolo: 'condizionata',
    numero: 2,
    titolo: { it: 'Bayes con i numeri interi', en: 'Bayes with whole numbers' },
    sottotitolo: {
      it: 'Le domande di probabilità condizionata si risolvono contando: immagina 10,000 casi, o elenca le coppie rimaste.',
      en: 'Conditional probability questions are solved by counting: picture 10,000 cases, or list the pairs that are left.',
    },
    aggancio: {
      it: '«Un test sbaglia il 5% delle volte, la malattia la ha l\'1% delle persone. Sei positivo: quanto è probabile che tu sia malato?» Circa il 16%, non il 95%.',
      en: '"A test is wrong 5% of the time, the disease affects 1% of people. You test positive: how likely is it that you are ill?" About 16%, not 95%.',
    },
    lezione: {
      it: `
<h3>Contare invece di usare la formula</h3>
<p>La probabilità condizionata è una frazione di casi: fra quelli compatibili con quello che sai, quanti sono quelli che ti interessano. Quasi sempre la si trova più in fretta contando che scrivendo la formula di Bayes.</p>

<h3>Due dadi</h3>
<p>«Almeno uno è un 6»: dei 36 casi restano 11 (sei con il primo a 6, sei con il secondo, meno il 6-6 contato due volte). Il doppio 6 è uno: 1/11. Se invece ti dicono «il primo è un 6», sai quale dado è, e la risposta è 1/6. La differenza fra le due frasi è la domanda.</p>

<h3>I test e i falsi allarmi</h3>
<p>Immagina 10,000 persone. Con una malattia all'1% i malati sono 100; un test che li riconosce al 95% ne trova 95. Dei 9,900 sani, il 5% di falsi allarmi fa 495 positivi. I positivi sono 590, di cui malati 95: circa il 16%.</p>
<div class="esempio">P(malato | positivo) = veri positivi / tutti i positivi<br>= 95 / (95 + 495) ≈ 16%</div>
<p>Quando la cosa che cerchi è rara, i falsi allarmi sugli altri, che sono tanti, pesano più dei veri. È lo stesso per un filtro antifrode o per un segnale di trading che scatta spesso.</p>

<h3>La moneta con due teste</h3>
<p>Su n monete una ha due teste. Ne prendi una e fai k teste di fila. Per la moneta truccata succede sempre, per le altre con probabilità 1/2<sup>k</sup>. Moltiplicando per n × 2<sup>k</sup> restano numeri interi: 2<sup>k</sup> contro n − 1.</p>
<div class="esempio">10 monete, 3 teste: 8 / (8 + 9) = 8/17</div>

<div class="trappola">Il 95% di precisione del test non è la probabilità di essere malato se positivo. Confondere P(positivo | malato) con P(malato | positivo) è esattamente l'errore che la domanda vuole vedere.</div>
`,
      en: `
<h3>Count instead of using the formula</h3>
<p>A conditional probability is a fraction of cases: among those consistent with what you know, how many are the ones you care about. You nearly always find it faster by counting than by writing Bayes' formula.</p>

<h3>Two dice</h3>
<p>"At least one is a 6": of the 36 cases, 11 are left (six with the first at 6, six with the second, minus the 6-6 counted twice). Double 6 is one of them: 1/11. If instead you are told "the first one is a 6", you know which die it is, and the answer is 1/6. The difference between the two sentences is the question.</p>

<h3>Tests and false alarms</h3>
<p>Picture 10,000 people. With a disease at 1% there are 100 ill; a test that catches 95% of them finds 95. Of the 9,900 healthy ones, a 5% false-alarm rate makes 495 positives. There are 590 positives, 95 of them ill: about 16%.</p>
<div class="esempio">P(ill | positive) = true positives / all positives<br>= 95 / (95 + 495) ≈ 16%</div>
<p>When what you are looking for is rare, the false alarms on everyone else, who are many, outweigh the true ones. The same goes for a fraud filter or a trading signal that fires often.</p>

<h3>The two-headed coin</h3>
<p>Of n coins, one has two heads. You pick one and get k heads in a row. For the trick coin that always happens, for the others with probability 1/2<sup>k</sup>. Multiplying by n × 2<sup>k</sup> leaves whole numbers: 2<sup>k</sup> against n − 1.</p>
<div class="esempio">10 coins, 3 heads: 8 / (8 + 9) = 8/17</div>

<div class="trappola">The test's 95% accuracy is not the probability of being ill given a positive. Mixing up P(positive | ill) with P(ill | positive) is exactly the mistake the question wants to see.</div>
`,
    },
    scheda: {
      it: 'Conta i casi compatibili e quelli buoni. Almeno uno è 6 → doppio 6: 1/11; il primo è 6: 1/6. Test: immagina 10,000 casi, veri positivi / tutti i positivi. Moneta con due teste: 2^k / (2^k + n − 1).',
      en: 'Count the consistent cases and the good ones. At least one is a 6 → double 6: 1/11; the first is a 6: 1/6. Tests: picture 10,000 cases, true positives / all positives. Two-headed coin: 2^k / (2^k + n − 1).',
    },
    fonti: [
      P.fonte('zhou', '§4.3, "Boys and girls"', { nota: { it: 'lo stesso «almeno uno» con due figli', en: 'the same "at least one" with two children' } }),
      P.fonte('crack', 'Question 4.36', { nota: { it: 'un test con molti falsi positivi', en: 'a test with many false positives' } }),
      P.fonte('zhou', '§4.3, "Monty Hall problem"'),
      P.fonte('crack', 'Question 4.21'),
      P.fonte('crack', 'Question 4.29'),
      P.fonte('zhou', '§4.3, "Unfair coin"', { nota: { it: 'la stessa moneta con due teste', en: 'the same two-headed coin' } }),
    ],
    test: false,
    nomiLivelli: { it: ['Contare', 'Falsi allarmi', 'La moneta truccata'], en: ['Counting', 'False alarms', 'The trick coin'] },
    livelli: [
      contare,
      () => (P.chance(0.6) ? P.conFonte(test, P.fonte('crack', 'Question 4.36', { nota: { it: 'un test con molti falsi positivi', en: 'a test with many false positives' } }))() : monty()),
      P.conFonte(moneta, P.fonte('crack', 'Question 4.29')),
    ],
  });
})();
