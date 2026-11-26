#!/usr/bin/env node
/* Controllo dei contenuti, in italiano e in inglese: genera molte domande per ogni livello di ogni trucco
   (e per il calcolo di base) e verifica che siano coerenti: testo e passi senza "undefined" o "NaN",
   risposta giusta accettata, risposta sbagliata rifiutata, scelte multiple distinte, nessuna parola
   rimasta nella lingua sbagliata, e numeri scritti in un solo modo in tutte e due le lingue
   (punto decimale e virgola per le migliaia: 0.375, 25,000).

       node strumenti/verifica.js          400 domande per livello e per lingua
       node strumenti/verifica.js 2000     di più
*/
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const radice = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(radice, 'index.html'), 'utf8');
const file = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]).filter(s => !s.endsWith('app.js'));

const ctx = { console, Math, JSON, Date, localStorage: { getItem: () => null, setItem() {} }, location: { protocol: 'file:' } };
ctx.window = ctx;
vm.createContext(ctx);
for (const f of file) vm.runInContext(fs.readFileSync(path.join(radice, f), 'utf8'), ctx, { filename: f });
const P = ctx.Palestra;

const N = +process.argv[2] || 400;
const errori = [];
const sporco = s => /undefined|NaN|Infinity|\[object/.test(String(s));
const piano = s => String(s).replace(/<[^>]+>/g, ' ');
// parole che non devono comparire nell'altra lingua
const ESTRANEE = {
  en: /\b(di|il|che|della|sono|quanto|quindi|poi|prima|ogni|con|dalla|nel|gli|una|resta|volte|cifra|vale|anche|oppure|cioè|perché)\b|\bè\b/i,
  it: /\b(the|of|and|with|which|then|each|you|is|are|what|how)\b/i,
};
// termini tecnici che restano uguali nelle due lingue
const COMUNI = /at-the-money|Black-Scholes|P&L/g;
const lingua = s => { const m = piano(s).replace(COMUNI, ' ').match(ESTRANEE[P.lingua]); return m && m[0]; };
const visti = new Set(); // un avviso di lingua per generatore e parola, non uno per domanda
// numbers in the old Italian notation: decimal comma (0,375 or 12,5) or thousands split by a thin space
const virgolaDecimale = s => {
  const m = piano(s).match(/(?<![\d,.])(?:0,\d+|\d+,(?:\d{1,2}|\d{4,})(?!\d))|\d[\u2009\u202f]\d{3}/);
  return m && m[0];
};

function controlla(nome, q, conAiuti) {
  const dove = `[${P.lingua}] ${nome}: ${piano(q && q.testo).trim()}`;
  if (!q || typeof q.testo !== 'string' || !q.testo) return errori.push(`${nome}: domanda vuota`);
  const testi = [q.testo, q.nota || ''].concat(q.suggerimenti || [], q.soluzione || []);
  if (testi.some(sporco)) errori.push(`${dove} → testo sporco: ${testi.find(sporco)}`);
  for (const s of testi) {
    const w = lingua(s), chiave = `${P.lingua} ${nome} ${w}`;
    if (w && !visti.has(chiave)) { visti.add(chiave); errori.push(`${dove} → parola «${w}» in: ${piano(s).trim()}`); break; }
  }
  for (const s of testi.concat(q.risposta && q.risposta.tipo !== 'scelta' ? [P.mostraRisposta(q.risposta)] : [])) {
    const v = virgolaDecimale(s);
    if (v) { errori.push(`${dove} → numero «${v}» non in notazione inglese`); break; }
  }
  if (conAiuti && !(q.suggerimenti && q.suggerimenti.length)) errori.push(`${dove} → nessun suggerimento`);
  if (!(q.soluzione && q.soluzione.length)) errori.push(`${dove} → nessuna soluzione`);
  const r = q.risposta;
  if (!r) return errori.push(`${dove} → nessuna risposta`);
  if (r.tipo === 'scelta') {
    if (!(r.giusta >= 0 && r.giusta < r.opzioni.length)) errori.push(`${dove} → indice giusto fuori dalle opzioni`);
    if (new Set(r.opzioni).size !== r.opzioni.length) errori.push(`${dove} → opzioni ripetute: ${r.opzioni}`);
    if (!P.verifica(r, r.giusta).ok) errori.push(`${dove} → la scelta giusta non passa`);
    return;
  }
  if (!isFinite(r.valore)) return errori.push(`${dove} → valore non finito`);
  const mostra = P.mostraRisposta(r);
  if (sporco(mostra)) errori.push(`${dove} → risposta mostrata sporca: ${mostra}`);
  if (!P.verifica(r, mostra).ok) errori.push(`${dove} → la risposta mostrata «${mostra}» non passa (valore ${r.valore})`);
  if (!P.verifica(r, String(r.valore)).ok) errori.push(`${dove} → il valore esatto ${r.valore} non passa`);
  const falso = r.valore === 0 ? 1 : r.valore * 1.37 + (r.percento ? 0.05 : 1);
  if (P.verifica(r, String(falso)).ok) errori.push(`${dove} → passa anche una risposta sbagliata (${falso})`);
}

let totale = 0;
const CAMPI = ['titolo', 'sottotitolo', 'aggancio', 'lezione', 'scheda'];
for (const l of P.LINGUE) {
  P.impostaLingua(l);
  for (const m of P.materie) {
    for (const x of [m.titolo, m.descrizione].concat(m.capitoli.map(c => c.titolo))) {
      if (!x || !x[l]) errori.push(`[${l}] materia ${m.id}: manca un testo`);
    }
  }
  for (const t of P.trucchi) {
    if (!P.trovaCapitolo(t.materia, t.capitolo)) errori.push(`${t.id}: capitolo ${t.materia}/${t.capitolo} non esiste`);
    for (const k of CAMPI) {
      if (!t[k] || !t[k][l]) { errori.push(`[${l}] ${t.id}: manca ${k}`); continue; }
      const w = lingua(t[k][l]);
      if (w && k !== 'lezione') errori.push(`[${l}] ${t.id}.${k}: parola «${w}»`);
      const v = virgolaDecimale(t[k][l]);
      if (v) errori.push(`[${l}] ${t.id}.${k}: numero «${v}» non in notazione inglese`);
    }
    if (t.nomiLivelli && !(t.nomiLivelli[l] && t.nomiLivelli[l].length === 3)) errori.push(`[${l}] ${t.id}: nomiLivelli incompleti`);
    t.livelli.forEach((gen, i) => {
      for (let n = 0; n < N; n++) {
        let q;
        try { q = gen(); } catch (e) { errori.push(`[${l}] ${t.id} L${i + 1}: eccezione ${e.message}`); break; }
        controlla(`${t.id} L${i + 1}`, q, true);
        totale++;
      }
    });
  }
  for (const b of P.base) {
    if (!b.nome || !b.nome[l]) errori.push(`[${l}] base ${b.blocco}: manca il nome`);
    for (let n = 0; n < N; n++) { controlla(`base ${b.blocco}`, b.fn(), false); totale++; }
  }
}

// lettura delle risposte: casi scritti a mano, in tutte e due le convenzioni
const casi = [
  ['0,375', 0.375, {}, true], ['0.375', 0.375, {}, true], ['3/8', 0.375, {}, true], ['99-17', 99.53125, {}, true],
  ['99-17+', 99.546875, {}, true], ['25.000', 25000, {}, true], ['25,000', 25000, {}, true], ['25 000', 25000, {}, true],
  ['25k', 25000, {}, true], ['2,5m', 2.5e6, {}, true], ['2.5 million', 2.5e6, {}, true], ['−4%', -0.04, { percento: true }, true],
  ['-4', -0.04, { percento: true }, true], ['4', -0.04, { percento: true }, false], ['0,4286', 3 / 7, { decimali: 4 }, true],
  ['0,4285', 3 / 7, { decimali: 4 }, true], ['0,43', 3 / 7, { decimali: 4 }, false], ['14,29%', 1 / 7, { percento: true, decimali: 4 }, true],
  ['14.29', 1 / 7, { percento: true, decimali: 4 }, true], ['1,692', 1692, {}, true], ['12 bp', 12, {}, true], ['6 lanci', 6, {}, true],
  ['6 trials', 6, {}, true], ['25,000 dollars', 25000, {}, true],
];
for (const [scritto, valore, opz, atteso] of casi) {
  const ok = P.verifica(P.numero(valore, opz), scritto).ok;
  if (ok !== atteso) errori.push(`lettura: «${scritto}» per ${valore} ${JSON.stringify(opz)} → ${ok}, atteso ${atteso}`);
}

const unici = [...new Set(errori)];
console.log(`${P.trucchi.length} trucchi, ${P.base.length} generatori di base, ${totale} domande generate in ${P.LINGUE.join(' e ')}.`);
if (unici.length) {
  console.log(`${unici.length} problemi:`);
  unici.slice(0, 60).forEach(e => console.log('  - ' + e));
  process.exit(1);
}
console.log('Tutto coerente.');
