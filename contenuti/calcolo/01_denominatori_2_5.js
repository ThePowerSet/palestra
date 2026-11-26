(function () {
  'use strict';
  const P = Palestra;

  // ---------- strumenti del trucco ----------

  function fattori(b) {
    let e2 = 0, e5 = 0, r = b;
    while (r % 2 === 0) { r /= 2; e2++; }
    while (r % 5 === 0) { r /= 5; e5++; }
    return { e2, e5, r };
  }
  const scomposto = b => { const f = fattori(b); return Array(f.e2).fill(2).concat(Array(f.e5).fill(5)).join('·'); };
  const potenzaDi2 = b => b >= 2 && (b & (b - 1)) === 0;
  const PAROLE = { it: ['', 'un', 'due', 'tre', 'quattro', 'cinque', 'sei'], en: ['', 'one', 'two', 'three', 'four', 'five', 'six'] };
  const pad = n => String(n).padStart(2, '0');
  const TICK = () => P.fmt(1 / 32);          // 0.03125
  const DOLLARI = () => '312.50';

  // a/b con b potenza di 2: dimezzamenti, poi pezzi che conosci (ottavi più o meno qualche 1/b)
  function dimezza(a, b) {
    if (b <= 4) return { primo: `${a}/${b} = ${P.fmt(a / b)}`, passi: [`${a}/${b} = ${P.fmt(a / b)}`] };
    if (b === 8) return { primo: `${a}/8 = ${a} × ${P.fmt(0.125)}`, passi: [`${a}/8 = ${a} × ${P.fmt(0.125)} = ${P.fmt(a / 8)}`] };
    const u = b / 8, k = Math.round(a / u), m = k * u, r = a - m;
    if (r === 0) return { primo: `${a}/${b} = ${k}/8`, passi: [`${a}/${b} = ${k}/8 = ${P.fmt(k / 8)}`] };
    if (m === 0 || Math.abs(r) >= a) { // pochi pezzi da 1/b: si contano e basta
      return {
        primo: `${a}/${b} = ${a} × 1/${b}`,
        passi: [`1/${b} = ${P.fmt(1 / b)}`, `${a} × ${P.fmt(1 / b)} = ${P.fmt(a / b)}`],
      };
    }
    const s = r > 0 ? '+' : '−', ar = Math.abs(r);
    return {
      primo: P.t(`${a} = ${m} ${s} ${ar}, e ${m}/${b} = ${k}/8 = ${P.fmt(k / 8)}`, `${a} = ${m} ${s} ${ar}, and ${m}/${b} = ${k}/8 = ${P.fmt(k / 8)}`),
      passi: [
        `${a}/${b} = ${m}/${b} ${s} ${ar}/${b}`,
        `${m}/${b} = ${k}/8 = ${P.fmt(k / 8)}`,
        ar === 1 ? `1/${b} = ${P.fmt(1 / b)}` : `${ar}/${b} = ${ar} × ${P.fmt(1 / b)} = ${P.fmt(ar / b)}`,
        `${P.fmt(k / 8)} ${s} ${P.fmt(ar / b)} = ${P.fmt(a / b)}`,
      ],
    };
  }

  // a/b con dei 5 nel denominatore: completa le coppie fino a una potenza di 10
  function completa(a, b) {
    const f = fattori(b), n = Math.max(f.e2, f.e5), p = 10 ** n, c = p / b;
    const diff = Math.abs(f.e2 - f.e5), solo = f.e2 > f.e5 ? '2' : '5', partner = f.e2 > f.e5 ? '5' : '2';
    const chi = P.t(
      diff === 1 ? `un ${solo} resta senza il suo ${partner}` : `${PAROLE.it[diff]} ${solo} restano senza il loro ${partner}`,
      diff === 1 ? `one ${solo} has no ${partner} to pair with` : `${PAROLE.en[diff]} ${solo}s have no ${partner} to pair with`);
    return {
      come: P.t(`${b} = ${scomposto(b)}: ${chi}. Completa le coppie: moltiplica sopra e sotto per ${c} e arrivi a ${P.fmt(p)}.`,
        `${b} = ${scomposto(b)}: ${chi}. Complete the pairs: multiply top and bottom by ${c} to reach ${P.fmt(p)}.`),
      passo: P.t(`${b} × ${c} = ${P.fmt(p)}, quindi anche ${a} × ${c} = ${a * c}.`, `${b} × ${c} = ${P.fmt(p)}, so on top ${a} × ${c} = ${a * c}.`),
      passi: [
        P.t(`${b} = ${scomposto(b)}, manca ${c} per arrivare a ${P.fmt(p)}`, `${b} = ${scomposto(b)}, missing ${c} to reach ${P.fmt(p)}`),
        `${a}/${b} = ${a * c}/${P.fmt(p)}`,
        P.t(`${a * c}/${P.fmt(p)} = ${P.fmt(a / b)} (${n} decimali)`, `${a * c}/${P.fmt(p)} = ${P.fmt(a / b)} (${n} decimal places)`),
      ],
    };
  }

  // spiegazione completa di a/b (eventualmente da semplificare prima)
  function spiega(as, bs) {
    const g = P.mcd(as, bs), a = as / g, b = bs / g;
    const sugg = [], sol = [];
    const pre = g > 1 ? P.t(`Prima semplifica: ${as}/${bs} = ${a}/${b}. `, `Simplify first: ${as}/${bs} = ${a}/${b}. `) : '';
    if (g > 1) sol.push(P.t(`Semplifica per ${g}: ${as}/${bs} = ${a}/${b}`, `Divide top and bottom by ${g}: ${as}/${bs} = ${a}/${b}`));
    if (potenzaDi2(b)) {
      const d = dimezza(a, b);
      sugg.push(pre + (b > 4
        ? P.t(`${b} = 2${P.apice(Math.log2(b))} è una potenza di 2: dimezza partendo da ${P.fmt(0.5)} fino a 1/${b} = ${P.fmt(1 / b)}.`,
          `${b} = 2${P.apice(Math.log2(b))} is a power of 2: halve from ${P.fmt(0.5)} down to 1/${b} = ${P.fmt(1 / b)}.`)
        : P.t(`${b} è una potenza di 2: lo sai a memoria.`, `${b} is a power of 2: you know this one by heart.`)));
      sugg.push(P.t(`Costruiscilo con pezzi che conosci: ${d.primo}.`, `Build it from pieces you know: ${d.primo}.`));
      sol.push(...d.passi);
    } else {
      const c = completa(a, b);
      sugg.push(pre + c.come);
      sugg.push(c.passo);
      sol.push(...c.passi);
    }
    return { sugg, sol };
  }

  const DEN2 = [8, 16, 16, 32, 32, 64];
  const DEN5 = [20, 25, 40, 50, 80, 125, 250];
  const coprimo = b => { let a; do { a = P.int(1, b - 1); } while (P.mcd(a, b) !== 1); return a; };

  // ---------- livelli ----------

  function calcolo() {
    const b = P.chance(0.55) ? P.pick(DEN2) : P.pick(DEN5);
    const a = coprimo(b);
    const k = P.chance(0.2) ? 3 : 1; // ogni tanto la frazione arriva con un 3 da togliere
    const e = spiega(a * k, b * k);
    return {
      testo: P.t(`<span class="num">${a * k}/${b * k}</span> in decimale`, `<span class="num">${a * k}/${b * k}</span> as a decimal`),
      risposta: P.numero(a / b),
      suggerimenti: e.sugg,
      soluzione: e.sol,
    };
  }

  function treasury() {
    const fig = P.int(95, 112), t = P.int(1, 31), piu = P.chance(0.2);
    const v = fig + t / 32 + (piu ? 1 / 64 : 0);
    const g = P.mcd(t, 32), ts = t / g, bs = 32 / g;
    const d = dimezza(ts, bs);
    const schermo = `${fig}-${pad(t)}${piu ? '+' : ''}`;
    const sol = [`${schermo} = ${fig} + ${t}/32${piu ? ' + 1/64' : ''}`];
    if (g > 1) sol.push(`${t}/32 = ${ts}/${bs}`);
    sol.push(...d.passi);
    if (piu) sol.push(P.t(`il + vale 1/64 = ${P.fmt(1 / 64)}`, `the + is 1/64 = ${P.fmt(1 / 64)}`));
    sol.push(P.t(`prezzo: ${P.fmt(v)}`, `price: ${P.fmt(v)}`));
    return {
      testo: P.t(`Sullo schermo del desk Treasury leggi <span class="num">${schermo}</span>. Che prezzo è in decimale?`,
        `The Treasury screen shows <span class="num">${schermo}</span>. What is the price as a decimal?`),
      risposta: P.numero(v),
      suggerimenti: [
        P.t(`Dopo il trattino ci sono trentaduesimi: ${schermo} = ${fig} + ${t}/32${piu ? ', e il + vale mezzo trentaduesimo, cioè 1/64' : ''}.`,
          `After the dash come 32nds: ${schermo} = ${fig} + ${t}/32${piu ? ', and the + is half a 32nd, i.e. 1/64' : ''}.`),
        `${t}/32${g > 1 ? ` = ${ts}/${bs}` : ''}: ${d.primo}.`,
      ],
      soluzione: sol,
    };
  }

  function spread() {
    const fig = P.int(96, 110), t1 = P.int(0, 26), mezzi = P.pick([1, 2, 2, 3, 4, 6, 8]); // in 64esimi
    const a2 = t1 * 2 + mezzi;
    const bid = `${fig}-${pad(t1)}`, ask = `${fig}-${pad(Math.floor(a2 / 2))}${a2 % 2 ? '+' : ''}`;
    const ticks = mezzi / 2, v = mezzi / 64;
    return {
      testo: P.t(`Il broker mostra <span class="num">${bid} / ${ask}</span>. Quanto è largo il prezzo, in punti decimali?`,
        `The broker shows <span class="num">${bid} / ${ask}</span>. How wide is the market, in decimal points?`),
      risposta: P.numero(v),
      suggerimenti: [
        P.t('Conta i trentaduesimi fra denaro e lettera; il + vale mezzo trentaduesimo.', 'Count the 32nds between bid and offer; the + is half a 32nd.'),
        P.t(`Sono ${P.fmt(ticks)} trentaduesimi, e 1/32 = ${TICK()}.`, `That is ${P.fmt(ticks)} 32nds, and 1/32 = ${TICK()}.`),
      ],
      soluzione: [P.t(`da ${bid} a ${ask}`, `from ${bid} to ${ask}`) + `: ${P.fmt(ticks)}/32 = ${mezzi}/64`, `${P.fmt(ticks)} × ${TICK()} = ${P.fmt(v)}`],
    };
  }

  function ottaviAzioni() {
    const den = P.pick([8, 8, 16]), int = P.int(12, 95), k = coprimo(den);
    const d = dimezza(k, den);
    return {
      testo: P.t(`Nel 1997 un'azione alla borsa di New York quotava <span class="num">${int} ${k}/${den}</span> dollari. Quanto fa in decimale?`,
        `In 1997 a stock on the New York Stock Exchange traded at <span class="num">${int} ${k}/${den}</span> dollars. What is that as a decimal?`),
      risposta: P.numero(int + k / den),
      suggerimenti: [
        P.t(`Prima del 2001 si quotava in ottavi e sedicesimi: ${k}/${den} si fa con i dimezzamenti.`, `Before 2001 prices were quoted in eighths and sixteenths: get ${k}/${den} by halving.`),
        `${d.primo}.`,
      ],
      soluzione: d.passi.concat([`${int} + ${P.fmt(k / den)} = ${P.fmt(int + k / den)}`]),
    };
  }

  function inverso() {
    const fig = P.int(96, 110), t = P.int(1, 31), x = t / 32, k = Math.floor(t / 4), r = t % 4;
    const pezzi = [];
    if (k) pezzi.push(`${P.fmt(k / 8)} = ${k}/8 = ${4 * k}/32`);
    if (r) pezzi.push(`${P.fmt(r / 32)} = ${r} × ${TICK()} = ${r}/32`);
    return {
      testo: P.t(`Il prezzo di un Treasury è <span class="num">${P.fmt(fig + x)}</span>. Quanti trentaduesimi ci sono dopo il ${fig}?`,
        `A Treasury is priced at <span class="num">${P.fmt(fig + x)}</span>. How many 32nds are there after the ${fig}?`),
      risposta: P.numero(t, { unita: P.t('trentaduesimi', '32nds') }),
      suggerimenti: [
        P.t(`Togli i pezzi grandi che conosci: ${P.fmt(0.5)} = 16/32, ${P.fmt(0.25)} = 8/32, ${P.fmt(0.125)} = 4/32. Poi conta quanti ${TICK()} restano.`,
          `Take out the big pieces you know: ${P.fmt(0.5)} = 16/32, ${P.fmt(0.25)} = 8/32, ${P.fmt(0.125)} = 4/32. Then count how many ${TICK()}s are left.`),
        `${P.fmt(x)} = ${k ? P.fmt(k / 8) : '0'}${r ? ` + ${P.fmt(r / 32)}` : ''}.`,
      ],
      soluzione: pezzi.concat([
        P.t(`${k ? 4 * k : 0} + ${r} = ${t} trentaduesimi`, `${k ? 4 * k : 0} + ${r} = ${t} 32nds`),
        P.t(`al desk lo dici ${fig}-${pad(t)}`, `on the desk you say ${fig}-${pad(t)}`),
      ]),
    };
  }

  function pnl() {
    const X = P.pick([1, 2, 5, 10, 10, 20, 25, 50, 100]);
    const delta = P.int(1, 24) * (P.chance(0.25) ? -1 : 1);
    const tot1 = P.int(97, 108) * 32 + P.int(0, 31), tot2 = tot1 + delta;
    const prezzo = tot => `${Math.floor(tot / 32)}-${pad(tot % 32)}`;
    const v = delta * 312.5 * X;
    return {
      testo: P.t(`Compri ${X} milion${X === 1 ? 'e' : 'i'} di nominale a <span class="num">${prezzo(tot1)}</span> e rivendi a <span class="num">${prezzo(tot2)}</span>. Quanto hai guadagnato, in dollari?`,
        `You buy ${X} million face value at <span class="num">${prezzo(tot1)}</span> and sell at <span class="num">${prezzo(tot2)}</span>. What is your P&L in dollars?`),
      nota: P.t('se hai perso, con il meno davanti', 'negative if you lost money'),
      risposta: P.numero(v, { unita: '$' }),
      suggerimenti: [
        P.t(`I prezzi sono in punti su 100 di nominale: un punto è l'1% del nominale. Un trentaduesimo su 1 milione vale ${P.fmt(1e6)} × ${TICK()}% = ${DOLLARI()} dollari.`,
          `Prices are in points per 100 of face value: one point is 1% of face. One 32nd on 1 million is ${P.fmt(1e6)} × ${TICK()}% = ${DOLLARI()} dollars.`),
        P.t(`Da ${prezzo(tot1)} a ${prezzo(tot2)} ci sono ${Math.abs(delta)} trentaduesimi${delta < 0 ? ', in discesa' : ''}.`,
          `From ${prezzo(tot1)} to ${prezzo(tot2)} is ${Math.abs(delta)} 32nds${delta < 0 ? ', down' : ''}.`),
      ],
      soluzione: [
        P.t(`differenza: ${delta} trentaduesimi`, `difference: ${delta} 32nds`),
        P.t(`1/32 di punto su 1 milione = ${DOLLARI()} dollari`, `1/32 of a point on 1 million = ${DOLLARI()} dollars`),
        `${delta} × ${DOLLARI()} × ${X} = ${P.fmt(v)} ${P.t('dollari', 'dollars')}`,
      ],
    };
  }

  function quantiDecimali() {
    const b = P.pick([16, 32, 64, 20, 40, 80, 125, 250, 625, 160]), a = coprimo(b);
    const f = fattori(b), n = Math.max(f.e2, f.e5);
    return {
      testo: P.t(`Quanti decimali ha <span class="num">${a}/${b}</span>? Rispondi prima di calcolarlo.`,
        `How many decimal places does <span class="num">${a}/${b}</span> have? Answer before working it out.`),
      risposta: P.numero(n, { unita: P.t('decimali', 'decimal places') }),
      suggerimenti: [
        P.t('Ogni coppia 2·5 fa un 10, cioè un decimale. Conta i 2 e i 5 del denominatore: i decimali sono tanti quanti il conteggio più grande.',
          'Each 2·5 pair makes a 10, that is one decimal place. Count the 2s and 5s in the denominator: the number of decimal places is the larger count.'),
        `${b} = ${scomposto(b)}.`,
      ],
      soluzione: [
        P.t(`${b} = ${scomposto(b)}: ${f.e2} volte 2 e ${f.e5} volte 5`, `${b} = ${scomposto(b)}: ${f.e2} twos and ${f.e5} fives`),
        P.t(`servono ${n} coppie, cioè ${P.fmt(10 ** n)}: ${n} decimali`, `you need ${n} pairs, i.e. ${P.fmt(10 ** n)}: ${n} decimal places`),
        P.t(`infatti ${a}/${b} = ${P.fmt(a / b, 8)}`, `indeed ${a}/${b} = ${P.fmt(a / b, 8)}`),
      ],
    };
  }

  // ---------- il trucco ----------

  P.trucco({
    id: 'frazioni-2-5',
    materia: 'calcolo',
    capitolo: 'fractions',
    numero: 1,
    titolo: { it: 'Denominatori di 2 e 5', en: 'Denominators made of 2s and 5s' },
    sottotitolo: {
      it: 'Ottavi, sedicesimi, trentaduesimi: i prezzi dei Treasury in decimale, al volo.',
      en: 'Eighths, sixteenths, thirty-seconds: Treasury prices as decimals, on the spot.',
    },
    aggancio: {
      it: 'Sullo schermo del desk Treasury leggi 99-17. Vuol dire 99 e 17 trentaduesimi, e il prezzo in decimale lo devi avere in testa prima che il collega finisca la frase: 99.53125.',
      en: 'The Treasury screen shows 99-17. That means 99 and 17 thirty-seconds, and you need the decimal price in your head before your colleague finishes the sentence: 99.53125.',
    },
    lezione: {
      it: `
<h3>Da dove nasce</h3>
<p>Sul mercato dei titoli di Stato americani i prezzi si dicono ancora in trentaduesimi di punto. Se un collega ti dice «novantanove e diciassette», intende 99 + 17/32, e devi sapere subito che è 99.53125. Le azioni americane si sono quotate in ottavi e poi in sedicesimi di dollaro fino al 2001. Ottavi, sedicesimi e trentaduesimi sono le frazioni che sul desk si incontrano davvero, e nei test di calcolo tornano di continuo.</p>

<h3>Perché alcune frazioni finiscono e altre no</h3>
<p>Un decimale è una frazione con sotto 10, 100 o 1000: 0.125 è 125/1000. Quindi convertire a/b in decimale vuol dire una cosa sola: riscriverla con sotto una potenza di 10.</p>
<p>Ogni potenza di 10 è fatta solo di 2 e di 5, sempre in coppia: 1000 = (2·5)(2·5)(2·5). Moltiplicando sopra e sotto puoi aggiungere fattori, ma non toglierli. Se nel denominatore c'è un 3 o un 7, quel fattore resta lì per sempre e il decimale non finisce mai: è il caso di 1/3. Se ci sono solo dei 2 e dei 5, basta completare le coppie.</p>
<div class="trappola">Guarda il denominatore dopo aver semplificato. 9/24 sembra avere un 3 sotto, ma diventa 3/8 = 0.375.</div>

<h3>Tre strade, scegli la più corta</h3>
<p><b>A. Completa le coppie.</b> Ogni 2 vuole un 5 e ogni 5 vuole un 2. 40 = 2·2·2·5: un 2 ha già il suo 5, gli altri due no, quindi servono 5·5 = 25.</p>
<div class="esempio">7/40 = (7 × 25)/(40 × 25) = 175/1000 = 0.175</div>
<p><b>B. Dimezza.</b> Con le potenze di 2 moltiplicare per 625 è scomodo, dimezzare no. Parti da una metà e dimezza:</p>
<div class="esempio">1/2 = 0.5 → 1/4 = 0.25 → 1/8 = 0.125 → 1/16 = 0.0625 → 1/32 = 0.03125 → 1/64 = 0.015625</div>
<p>Poi costruisci il numero con pezzi che conosci, in più o in meno:</p>
<div class="esempio">17/32 = 16/32 + 1/32 = 0.5 + 0.03125 = 0.53125<br>23/32 = 24/32 − 1/32 = 0.75 − 0.03125 = 0.71875</div>
<p><b>C. Dividere per 5 è raddoppiare.</b> È lo specchio della strada B: diviso 5 vuol dire per 2 e una cifra decimale; diviso 25 vuol dire per 4 e due cifre; diviso 125 vuol dire per 8 e tre cifre.</p>
<div class="esempio">7/25 = 28/100 = 0.28<br>3/125 = 24/1000 = 0.024</div>

<h3>Il controllo gratuito</h3>
<p>Ogni coppia completata è un 10, cioè una cifra decimale. Quindi i decimali sono tanti quanto il più grande fra il numero di 2 e il numero di 5 nel denominatore. 3/125 ha tre 5: tre decimali, 0.024 e non 0.24. Sotto pressione lo zero perso è l'errore più frequente, e questo controllo lo prende.</p>

<h3>Al desk</h3>
<ul>
<li>101-05 è 101 + 5/32 = 101.15625. 98-24 è 98 + 24/32, e 24/32 = 3/4: 98.75. Semplifica sempre prima.</li>
<li>Il + vale mezzo trentaduesimo, cioè 1/64: 99-17+ = 99.546875.</li>
<li>Un trentaduesimo su un milione di nominale vale 1/32 dell'1% di un milione: 312.50 dollari. Un movimento di 8 trentaduesimi su 10 milioni vale quindi 8 × 312.50 × 10 = 25,000 dollari.</li>
</ul>

<h3>Perché proprio queste frazioni</h3>
<p>Nascono dimezzando: metà, metà della metà, e così via. Si racconta che vengano dalle monete spagnole da otto reali, che si tagliavano in pezzi. La borsa di New York ha quotato in ottavi per circa due secoli, poi in sedicesimi, e solo nel 2001 è passata ai decimali. I Treasury sono rimasti ai trentaduesimi.</p>
`,
      en: `
<h3>Where it comes from</h3>
<p>In the US Treasury market prices are still quoted in thirty-seconds of a point. When a colleague says "ninety-nine seventeen", they mean 99 + 17/32, and you need to know straight away that it is 99.53125. US stocks were quoted in eighths and then sixteenths of a dollar until 2001. Eighths, sixteenths and thirty-seconds are the fractions you actually meet on a desk, and they keep coming back in mental maths tests.</p>

<h3>Why some fractions end and others don't</h3>
<p>A decimal is a fraction with 10, 100 or 1000 underneath: 0.125 is 125/1000. So turning a/b into a decimal means one thing only: rewriting it with a power of 10 underneath.</p>
<p>Every power of 10 is made only of 2s and 5s, always in pairs: 1000 = (2·5)(2·5)(2·5). Multiplying top and bottom lets you add factors, not remove them. If the denominator has a 3 or a 7, that factor stays there for ever and the decimal never ends: that is 1/3. If it has only 2s and 5s, you just complete the pairs.</p>
<div class="trappola">Look at the denominator after simplifying. 9/24 seems to have a 3 underneath, but it becomes 3/8 = 0.375.</div>

<h3>Three routes, take the shortest</h3>
<p><b>A. Complete the pairs.</b> Every 2 wants a 5 and every 5 wants a 2. 40 = 2·2·2·5: one 2 already has its 5, the other two don't, so you need 5·5 = 25.</p>
<div class="esempio">7/40 = (7 × 25)/(40 × 25) = 175/1000 = 0.175</div>
<p><b>B. Halve.</b> With powers of 2, multiplying by 625 is awkward; halving isn't. Start from one half and keep halving:</p>
<div class="esempio">1/2 = 0.5 → 1/4 = 0.25 → 1/8 = 0.125 → 1/16 = 0.0625 → 1/32 = 0.03125 → 1/64 = 0.015625</div>
<p>Then build the number from pieces you know, adding or taking away:</p>
<div class="esempio">17/32 = 16/32 + 1/32 = 0.5 + 0.03125 = 0.53125<br>23/32 = 24/32 − 1/32 = 0.75 − 0.03125 = 0.71875</div>
<p><b>C. Dividing by 5 is doubling.</b> It is the mirror image of route B: divided by 5 means times 2 and one decimal place; divided by 25 means times 4 and two places; divided by 125 means times 8 and three places.</p>
<div class="esempio">7/25 = 28/100 = 0.28<br>3/125 = 24/1000 = 0.024</div>

<h3>The free check</h3>
<p>Every completed pair is a 10, that is one decimal place. So the number of decimal places is the larger of the number of 2s and the number of 5s in the denominator. 3/125 has three 5s: three decimal places, 0.024 and not 0.24. Under pressure a lost zero is the most common mistake, and this check catches it.</p>

<h3>On the desk</h3>
<ul>
<li>101-05 is 101 + 5/32 = 101.15625. 98-24 is 98 + 24/32, and 24/32 = 3/4: 98.75. Always simplify first.</li>
<li>The + is half a thirty-second, that is 1/64: 99-17+ = 99.546875.</li>
<li>One thirty-second on a million of face value is 1/32 of 1% of a million: 312.50 dollars. So a move of 8 thirty-seconds on 10 million is worth 8 × 312.50 × 10 = 25,000 dollars.</li>
</ul>

<h3>Why these fractions</h3>
<p>They come from halving: a half, half of a half, and so on. The story goes that they come from the Spanish eight-real coins, which were cut into pieces. The New York Stock Exchange quoted in eighths for about two centuries, then in sixteenths, and only moved to decimals in 2001. Treasuries kept their thirty-seconds.</p>
`,
    },
    scheda: {
      it: 'Se il denominatore, dopo aver semplificato, ha solo 2 e 5, completa le coppie fino a 10, 100, 1000. Per le potenze di 2 dimezza da 0.5: 1/32 = 0.03125, 1/64 = 0.015625. Diviso 5, 25, 125: per 2, 4, 8 e sposta la virgola. I decimali sono tanti quanto il conteggio più grande fra 2 e 5.',
      en: 'If the denominator, once simplified, has only 2s and 5s, complete the pairs up to 10, 100, 1000. For powers of 2, halve from 0.5: 1/32 = 0.03125, 1/64 = 0.015625. Divided by 5, 25, 125: times 2, 4, 8 and move the decimal point. Decimal places = the larger count of 2s or 5s.',
    },
    test: true,
    nomiLivelli: { it: ['Calcolo', 'Al desk', 'Al contrario e P&L'], en: ['Calculation', 'On the desk', 'Backwards and P&L'] },
    livelli: [
      calcolo,
      () => P.pesato([[0.6, treasury], [0.2, spread], [0.2, ottaviAzioni]])(),
      () => P.pesato([[0.35, inverso], [0.45, pnl], [0.2, quantiDecimali]])(),
    ],
  });
})();
