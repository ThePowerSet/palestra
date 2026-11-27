(function () {
  'use strict';
  const P = Palestra;
  const F = {
    terne: P.fonte('zhou', '§5.1, "Coin triplets"'),
    hth: P.fonte('crack', 'Question 4.17'),
    treUguali: P.fonte('crack', 'Question 4.46'),
    rovina: P.fonte('zhou', '§4.3, "Gambler\'s ruin problem"'),
    rovinaMarkov: P.fonte('zhou', '§5.1, "Gambler\'s ruin problem"', { nota: { it: 'la stessa rovina con una moneta truccata, come catena di Markov', en: 'the same ruin with a biased coin, as a Markov chain' } }),
    truccata: P.fonte('crack', 'Question 4.15'),
  };
  const due = x => P.fmt(Math.round(x * 100) / 100);
  const lato = c => (c === 'T' ? P.t('T', 'H') : P.t('C', 'T')); // T/C in Italian (testa, croce), H/T in English
  const scrivi = m => m.split('').map(lato).join('');
  // fair coin: expected tosses to see the pattern = sum of 2^k over the k where the first k letters equal the last k
  const attesaMotivo = m => { let e = 0; for (let k = 1; k <= m.length; k++) if (m.slice(0, k) === m.slice(-k)) e += 2 ** k; return e; };
  const sovrapposizioni = m => { const v = []; for (let k = 1; k <= m.length; k++) if (m.slice(0, k) === m.slice(-k)) v.push(k); return v; };

  function motivo(lungo = false) {
    const m = lungo ? P.pick(['TTT', 'CTT', 'TCT', 'TTC', 'CCC']) : P.pick(['TT', 'TC', 'CC', 'CT']);
    const e = attesaMotivo(m), ss = sovrapposizioni(m);
    const fonte = m === 'TCT' ? F.hth : F.terne;
    return {
      testo: P.t(`Lanci una moneta equa finché compare la sequenza ${scrivi(m)} (T = testa, C = croce), di fila. Quanti lanci servono in media?`,
        `You toss a fair coin until the sequence ${scrivi(m)} (H = heads, T = tails) shows up, in a row. How many tosses does it take on average?`),
      risposta: P.numero(e),
      suggerimenti: [
        P.t('Scrivi uno stato per ogni pezzo della sequenza già fatto (niente, la prima lettera, …) e per ognuno: attesa = 1 + media delle attese dopo il prossimo lancio.', 'Write one state for each piece of the sequence already done (nothing, the first letter, …) and for each: wait = 1 + the average of the waits after the next toss.'),
        P.t('Scorciatoia per una moneta equa: somma 2^k per ogni k in cui le prime k lettere sono uguali alle ultime k. Le sequenze che si sovrappongono a se stesse costano di più.', 'Shortcut for a fair coin: add 2^k for every k where the first k letters equal the last k. Sequences that overlap themselves take longer.'),
      ],
      soluzione: [
        P.t(`prime lettere uguali alle ultime per k = ${ss.join(', ')}`, `first letters equal to the last ones for k = ${ss.join(', ')}`),
        `${ss.map(k => `2^${k}`).join(' + ')} = ${e}`,
      ],
      fonte,
    };
  }

  // Until k heads or k tails in total (not in a row): the game ends between toss k and toss 2k − 1
  function treUguali() {
    const k = P.pick([2, 3, 3, 4]);
    const comb = (n, r) => { let x = 1; for (let i = 1; i <= r; i++) x = x * (n - r + i) / i; return x; };
    const termini = [];
    for (let n = k; n <= 2 * k - 1; n++) termini.push([n, 2 * comb(n - 1, k - 1) / 2 ** n]);
    const e = termini.reduce((s, [n, p]) => s + n * p, 0);
    return {
      testo: P.t(`Lanci una moneta equa finché hai visto ${k} teste o ${k} croci in tutto, non per forza di fila. Quanti lanci servono in media?`,
        `You toss a fair coin until you have seen ${k} heads or ${k} tails in total, not necessarily in a row. How many tosses does it take on average?`),
      nota: P.t('tre decimali', 'three decimals'),
      risposta: P.numero(e, { tol: 0.0015, mostra: P.fmt(Math.round(e * 1000) / 1000) }),
      suggerimenti: [
        P.t(`Il gioco finisce fra il lancio ${k} e il lancio ${2 * k - 1}: con ${2 * k - 1} lanci uno dei due arriva per forza a ${k}.`, `The game ends between toss ${k} and toss ${2 * k - 1}: with ${2 * k - 1} tosses one side must reach ${k}.`),
        P.t(`Finisce al lancio n se quel lancio porta un lato a ${k}: prima ce ne sono ${k - 1} di quel lato fra i primi n − 1. Probabilità 2 × C(n − 1, ${k - 1}) / 2^n.`, `It ends at toss n if that toss takes one side to ${k}: there are ${k - 1} of that side among the first n − 1. Probability 2 × C(n − 1, ${k - 1}) / 2^n.`),
      ],
      soluzione: [
        termini.map(([n, p]) => `P(${n}) = ${P.fmt(p, 4)}`).join('; '),
        `${termini.map(([n, p]) => `${n} × ${P.fmt(p, 4)}`).join(' + ')} = ${P.fmt(Math.round(e * 1000) / 1000)}`,
      ],
      fonte: F.treUguali,
    };
  }

  // Fair game: wealth is a martingale, so P(reach N from i) = i/N and the expected number of bets is i(N − i)
  function rovina() {
    const N = P.pick([5, 6, 8, 10, 12, 20]), i = P.int(1, N - 1), durata = P.chance(0.4);
    const v = durata ? i * (N - i) : i / N;
    return {
      testo: P.t(`Hai ${i} euro e scommetti 1 euro alla volta su una moneta equa, finché arrivi a ${N} euro o resti a zero. ${durata ? 'Quante scommesse fai in media?' : `Con che probabilità arrivi a ${N}?`}`,
        `You have ${i} euros and bet 1 euro at a time on a fair coin, until you reach ${N} euros or go broke. ${durata ? 'How many bets do you make on average?' : `What is the probability of reaching ${N}?`}`),
      nota: durata ? '' : P.t('una frazione va bene', 'a fraction is fine'),
      risposta: durata ? P.numero(v) : P.numero(v, { decimali: 3, mostra: `${i}/${N}` }),
      suggerimenti: durata ? [
        P.t('Chiama D(x) le scommesse attese partendo da x: D(x) = 1 + ½ D(x − 1) + ½ D(x + 1), con D(0) = D(N) = 0.', 'Call D(x) the expected bets starting from x: D(x) = 1 + ½ D(x − 1) + ½ D(x + 1), with D(0) = D(N) = 0.'),
        P.t('La soluzione è D(x) = x × (N − x).', 'The solution is D(x) = x × (N − x).'),
      ] : [
        P.t('In un gioco equo la ricchezza attesa non cambia mai, nemmeno alla fine.', 'In a fair game expected wealth never changes, not even at the end.'),
        P.t(`Alla fine hai ${N} con probabilità p o 0: p × ${N} = ${i}.`, `At the end you have ${N} with probability p, or 0: p × ${N} = ${i}.`),
      ],
      soluzione: durata ? [`D(${i}) = ${i} × (${N} − ${i}) = ${v}`] : [`p × ${N} + (1 − p) × 0 = ${i}`, `p = ${i}/${N}`],
      fonte: F.rovina,
    };
  }

  function hhTruccata() {
    const p = P.pick([0.4, 0.5, 0.6, 0.75, 0.8]), tre = P.chance(0.4);
    const e = tre ? (1 + p + p * p) / p ** 3 : (1 + p) / (p * p);
    return {
      testo: P.t(`Una moneta dà testa con probabilità ${P.fmt(p)}. Quanti lanci servono in media per avere ${tre ? 'tre' : 'due'} teste di fila?`,
        `A coin shows heads with probability ${P.fmt(p)}. How many tosses does it take on average to get ${tre ? 'three' : 'two'} heads in a row?`),
      nota: P.t('due decimali', 'two decimals'),
      risposta: P.numero(e, { tol: 0.011, mostra: due(e) }),
      suggerimenti: [
        P.t(`Stati: niente, T${tre ? ', TT' : ''}. Ogni croce riporta a "niente".`, `States: nothing, H${tre ? ', HH' : ''}. Every tail sends you back to "nothing".`),
        tre ? P.t('E = (1 + p + p²) / p³: per arrivare a tre di fila ti servono le due prime, poi un lancio che chiude o fa ripartire.', 'E = (1 + p + p²) / p³: to get three in a row you need the first two, then a toss that finishes or restarts.')
          : P.t('E₀ = 1 + p E₁ + q E₀ ed E₁ = 1 + q E₀: risolvendo, E₀ = (1 + p) / p².', 'E₀ = 1 + p E₁ + q E₀ and E₁ = 1 + q E₀: solving, E₀ = (1 + p) / p².'),
      ],
      soluzione: tre ? [`(1 + ${P.fmt(p)} + ${P.fmt(p * p)}) / ${P.fmt(p ** 3)} = ${due(e)}`] : [`(1 + ${P.fmt(p)}) / ${P.fmt(p * p)} = ${due(e)}`],
      fonte: F.truccata,
    };
  }

  function rovinaTruccata() {
    const [p, pt] = P.pick([[0.6, '0.6'], [0.4, '0.4'], [2 / 3, '2/3'], [1 / 3, '1/3']]);
    const N = P.int(3, 5), i = P.int(1, N - 1), r = (1 - p) / p, v = (1 - r ** i) / (1 - r ** N);
    const rt = { 0.6: '2/3', 0.4: '3/2', [2 / 3]: '1/2', [1 / 3]: '2' }[p];
    return {
      testo: P.t(`Hai ${i} euro e scommetti 1 euro alla volta; vinci ogni scommessa con probabilità ${pt}. Giochi finché arrivi a ${N} euro o resti a zero. Con che probabilità arrivi a ${N}?`,
        `You have ${i} euros and bet 1 euro at a time; you win each bet with probability ${pt}. You play until you reach ${N} euros or go broke. What is the probability of reaching ${N}?`),
      nota: P.t('tre decimali', 'three decimals'),
      risposta: P.numero(v, { tol: 0.0015, mostra: P.fmt(Math.round(v * 1000) / 1000) }),
      suggerimenti: [
        P.t('Con P(x) la probabilità di arrivare a N da x: P(x) = p P(x + 1) + q P(x − 1), P(0) = 0, P(N) = 1.', 'With P(x) the chance of reaching N from x: P(x) = p P(x + 1) + q P(x − 1), P(0) = 0, P(N) = 1.'),
        P.t(`La soluzione è P(x) = (1 − r^x) / (1 − r^N) con r = q/p = ${rt}.`, `The solution is P(x) = (1 − r^x) / (1 − r^N) with r = q/p = ${rt}.`),
      ],
      soluzione: [`r = ${rt}`, `(1 − ${rt}^${i}) / (1 − ${rt}^${N}) = (1 − ${P.fmt(r ** i, 4)}) / (1 − ${P.fmt(r ** N, 4)}) = ${P.fmt(Math.round(v * 1000) / 1000)}`],
      fonte: F.rovinaMarkov,
    };
  }

  P.trucco({
    id: 'prob-primo-passo',
    materia: 'probabilita',
    capitolo: 'attese',
    numero: 5,
    titolo: { it: 'Condiziona sul primo passo', en: 'Condition on the first step' },
    sottotitolo: {
      it: 'Quanto si aspetta una sequenza di lanci, con che probabilità si vince una rovina: uno stato per ogni situazione, un\'equazione per stato.',
      en: 'How long a run of tosses takes, how likely you are to win a ruin game: one state per situation, one equation per state.',
    },
    aggancio: {
      it: '«Quanti lanci in media per vedere testa-testa? E testa-croce?» Le risposte sono 6 e 4, e chi non sa perché sono diverse non ha ancora visto il metodo degli stati.',
      en: '"How many tosses on average to see heads-heads? And heads-tails?" The answers are 6 and 4, and whoever does not know why they differ has not yet seen the method of states.',
    },
    lezione: {
      it: `
<h3>Uno stato per situazione</h3>
<p>Quando un gioco va avanti finché succede qualcosa, si scrivono gli <em>stati</em> (che cosa conta di quello che è già successo) e per ognuno un'equazione: quello che ti aspetti da qui = 1 lancio + la media di quello che ti aspetti dallo stato in cui finisci.</p>
<div class="esempio">Testa-testa: stati 0 (niente) e T (una testa).<br>E₀ = 1 + ½E_T + ½E₀ ; E_T = 1 + ½ × 0 + ½E₀ → E₀ = 6.<br>Testa-croce: dopo una testa, una testa non ti fa ripartire: E_T = 1 + ½E_T → E₀ = 4.</div>

<h3>La scorciatoia per le monete eque</h3>
<p>Per una sequenza di lanci di una moneta equa, l'attesa è la somma di 2^k per ogni k in cui le prime k lettere coincidono con le ultime k. TT: 2 + 4 = 6. TCT: 2 + 8 = 10. TTC: solo 8. Le sequenze che si sovrappongono a se stesse costano di più, perché quando falliscono non lasciano niente di utile.</p>

<h3>La rovina del giocatore</h3>
<p>Parti da i euro, punti 1 alla volta, ti fermi a 0 o a N. Con una moneta equa la ricchezza attesa resta i fino alla fine, quindi P(arrivare a N) = i/N, e le scommesse attese sono i(N − i). Con una moneta truccata, r = q/p e P = (1 − r^i)/(1 − r^N).</p>

<div class="trappola">Lo stato deve contenere tutto quello che serve per il futuro. In testa-croce-testa, dopo «testa-croce» una croce non ti riporta a «testa»: ti riporta a zero. Scrivi gli stati prima di scrivere i numeri.</div>
`,
      en: `
<h3>One state per situation</h3>
<p>When a game goes on until something happens, write down the <em>states</em> (what matters about what has already happened) and one equation for each: what you expect from here = 1 toss + the average of what you expect from the state you land in.</p>
<div class="esempio">Heads-heads: states 0 (nothing) and H (one head).<br>E₀ = 1 + ½E_H + ½E₀ ; E_H = 1 + ½ × 0 + ½E₀ → E₀ = 6.<br>Heads-tails: after a head, another head does not reset you: E_H = 1 + ½E_H → E₀ = 4.</div>

<h3>The shortcut for fair coins</h3>
<p>For a sequence of fair coin tosses, the wait is the sum of 2^k for every k where the first k letters match the last k. HH: 2 + 4 = 6. HTH: 2 + 8 = 10. HHT: just 8. Sequences that overlap themselves take longer, because when they fail they leave nothing useful behind.</p>

<h3>Gambler's ruin</h3>
<p>Start with i euros, bet 1 at a time, stop at 0 or at N. With a fair coin expected wealth stays at i to the end, so P(reach N) = i/N, and the expected number of bets is i(N − i). With a biased coin, r = q/p and P = (1 − r^i)/(1 − r^N).</p>

<div class="trappola">A state must hold everything that matters for the future. In heads-tails-heads, after "heads-tails" a tail does not send you back to "heads": it sends you to zero. Write the states before writing numbers.</div>
`,
    },
    scheda: {
      it: 'Stati + un\'equazione per stato: E = 1 + media delle E dopo un lancio. Moneta equa: attesa di una sequenza = somma di 2^k dove le prime k lettere sono le ultime k (TT 6, TC 4, TTT 14, TCT 10). Rovina equa: i/N, durata i(N − i); truccata: (1 − r^i)/(1 − r^N).',
      en: 'States + one equation per state: E = 1 + the average of the Es after one toss. Fair coin: wait for a sequence = sum of 2^k where the first k letters are the last k (HH 6, HT 4, HHH 14, HTH 10). Fair ruin: i/N, length i(N − i); biased: (1 − r^i)/(1 − r^N).',
    },
    fonti: [F.terne, F.hth, F.treUguali, F.rovina, F.rovinaMarkov, F.truccata],
    test: false,
    nomiLivelli: { it: ['Due lanci di fila', 'Tre lanci, tre uguali, rovina', 'Monete truccate'], en: ['Two tosses in a row', 'Three tosses, three alike, ruin', 'Biased coins'] },
    livelli: [
      () => motivo(false),
      () => P.pick([() => motivo(true), treUguali, rovina])(),
      () => (P.chance(0.5) ? hhTruccata() : rovinaTruccata()),
    ],
  });
})();
