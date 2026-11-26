#!/usr/bin/env node
/* Prova della sincronizzazione (js/nuvola.js) senza Supabase: due «dispositivi», ciascuno con il suo
   browser finto, parlano con un database finto in memoria che applica le stesse regole (ogni utente
   vede solo le sue righe, uid unico per utente). Controlla che risposte, sessioni, trucchi imparati e
   cancellazioni arrivino da un dispositivo all'altro senza doppioni, anche dopo un periodo offline.

       node strumenti/prova_nuvola.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const radice = path.join(__dirname, '..');
const clona = x => (x === undefined ? undefined : JSON.parse(JSON.stringify(x)));

// ---------- il database finto ----------

const server = {
  tabelle: { risposte: [], sessioni: [], stato: [] },
  prossimoId: 1,
  utenti: { 'omar@prova.it': { id: 'u-omar', password: 'giusta' }, 'altro@prova.it': { id: 'u-altro', password: 'giusta' } },
  giu: false, // true = rete assente
};

class Richiesta {
  constructor(client, tabella) { Object.assign(this, { client, tabella, op: 'select', filtri: [], lim: Infinity, singola: false }); }
  select() { return this; }
  maybeSingle() { this.singola = true; return this; }
  gt(c, v) { this.filtri.push(r => r[c] > v); return this; }
  lt(c, v) { this.filtri.push(r => r[c] < v); return this; }
  order(c) { this.ordine = c; return this; }
  limit(n) { this.lim = n; return this; }
  upsert(righe, opz = {}) { Object.assign(this, { op: 'upsert', righe: clona([].concat(righe)), opz }); return this; }
  delete() { this.op = 'delete'; return this; }
  then(ok, ko) { return Promise.resolve().then(() => this.esegui()).then(ok, ko); }
  esegui() {
    if (server.giu) return { data: null, error: { message: 'TypeError: Failed to fetch' } };
    const io = this.client.utente;
    if (!io) return { data: null, error: { message: 'permission denied' } };
    const tab = server.tabelle[this.tabella], mie = r => r.user_id === io;
    if (this.op === 'select') {
      let righe = tab.filter(mie).filter(r => this.filtri.every(f => f(r)));
      if (this.ordine) righe.sort((a, b) => a[this.ordine] - b[this.ordine]);
      righe = clona(righe.slice(0, this.lim));
      return { data: this.singola ? righe[0] || null : righe, error: null };
    }
    if (this.op === 'delete') {
      server.tabelle[this.tabella] = tab.filter(r => !(mie(r) && this.filtri.every(f => f(r))));
      return { data: null, error: null };
    }
    for (const r of this.righe) {
      if (r.user_id !== io) return { data: null, error: { message: 'new row violates row-level security policy' } };
      if (this.tabella === 'stato') {
        const c = tab.find(x => x.user_id === io);
        if (c) Object.assign(c, r); else tab.push(Object.assign({ imparati: {}, agg: {}, azzerato: 0 }, r));
      } else {
        if (tab.some(x => x.user_id === io && x.uid === r.uid)) {
          if (this.opz.ignoreDuplicates) continue;
          return { data: null, error: { message: 'duplicate key' } };
        }
        tab.push(Object.assign({ id: server.prossimoId++ }, r));
      }
    }
    return { data: null, error: null };
  }
}

function nuovoClient() {
  const ascoltatori = [];
  const client = {
    utente: null,
    from: t => new Richiesta(client, t),
    auth: {
      getSession: async () => ({ data: { session: client.utente ? { user: { id: client.utente, email: client.email } } : null } }),
      onAuthStateChange: cb => { ascoltatori.push(cb); return { data: { subscription: { unsubscribe() {} } } }; },
      signInWithPassword: async ({ email, password }) => {
        const u = server.utenti[email];
        if (!u || u.password !== password) return { data: {}, error: { code: 'invalid_credentials', message: 'Invalid login credentials' } };
        client.utente = u.id; client.email = email;
        const session = { user: { id: u.id, email } };
        ascoltatori.forEach(cb => cb('SIGNED_IN', session));
        return { data: { session }, error: null };
      },
      signOut: async () => { client.utente = null; ascoltatori.forEach(cb => cb('SIGNED_OUT', null)); return { error: null }; },
    },
  };
  return client;
}

// ---------- i dispositivi ----------

let orologio = Date.parse('2026-11-25T10:00:00');
class Ora extends Date {
  constructor(...a) { if (a.length) super(...a); else super(orologio); }
  static now() { orologio += 1000; return orologio; }
}

function dispositivo(nome) {
  const memoria = new Map();
  const ctx = {
    console, Math, JSON, Date: Ora,
    localStorage: { getItem: k => (memoria.has(k) ? memoria.get(k) : null), setItem: (k, v) => memoria.set(k, String(v)) },
    location: { protocol: 'https:' },
    setTimeout: () => 0, clearTimeout: () => {}, // la prova chiama sincronizza() a mano
    PALESTRA_CLOUD: { url: 'https://finto.supabase.co', chiave: 'sb_publishable_finta' },
  };
  ctx.window = ctx;
  ctx.supabase = { createClient: () => nuovoClient() };
  vm.createContext(ctx);
  for (const f of ['js/motore.js', 'js/nuvola.js']) vm.runInContext(fs.readFileSync(path.join(radice, f), 'utf8'), ctx, { filename: f });
  const P = ctx.Palestra;
  P.nome = nome;
  return P;
}

// ---------- la prova ----------

const errori = [];
const verifica = (cosa, ok) => { if (!ok) errori.push(cosa); };
const riga = (P, trucco) => P.registra({
  sessione: 's', data: P.oggi(), ora: P.ora(), modalita: 'lezione', n: 1, materia: 'calcolo', capitolo: 'fractions',
  trucco, livello: 1, domanda: 'quanto fa 3/8?', risposta: '0,375', corretta: '0,375', esito: 'giusta', secondi: 4.2, suggerimenti: 0,
});
const uids = P => P.dati.risposte.map(r => r.uid).sort().join();
const imparati = P => Object.keys(P.dati.imparati).sort().join();
const nel = t => server.tabelle[t].filter(r => r.user_id === 'u-omar');

(async () => {
  const A = dispositivo('A'), B = dispositivo('B');

  // A ha già lavorato da solo, prima della sincronizzazione
  riga(A, 'frazioni-2-5'); riga(A, 'frazioni-2-5'); riga(A, 'frazioni-settimi');
  A.segnaImparato('frazioni-2-5', true);
  A.aggiungiSessione({ id: 'S1', data: A.oggi(), modalita: 'lezione', titolo: { it: 'Lezione', en: 'Lesson' }, domande: 3, giuste: 3, sbagliate: 0, saltate: 0, punteggio: 3, secondi: 20 });

  await A.nuvola.avvia(); await B.nuvola.avvia();
  verifica('prima dell\'accesso lo stato è «fuori»', A.nuvola.stato === 'fuori' && !A.nuvola.collegata());
  const sbagliata = await A.nuvola.accedi('omar@prova.it', 'no');
  verifica('password sbagliata: messaggio chiaro', /sbagliate|wrong/i.test(sbagliata.errore || ''));

  await A.nuvola.accedi('omar@prova.it', 'giusta');
  verifica('A: tre risposte salite', nel('risposte').length === 3);
  verifica('A: una sessione salita', nel('sessioni').length === 1);
  verifica('A: trucco imparato salito', nel('stato')[0] && nel('stato')[0].imparati['frazioni-2-5']);
  verifica('A: niente in attesa', A.dati.risposte.every(r => r.su));

  await B.nuvola.accedi('omar@prova.it', 'giusta');
  verifica('B: riceve le risposte di A', uids(B) === uids(A));
  verifica('B: riceve la sessione di A', B.dati.sessioni.length === 1 && B.dati.sessioni[0].titolo.en === 'Lesson');
  verifica('B: riceve il trucco imparato', imparati(B) === 'frazioni-2-5');

  // B lavora, toglie un trucco e ne segna un altro; A riceve
  riga(B, 'molt-tondo'); riga(B, 'molt-tondo');
  B.segnaImparato('frazioni-2-5', false); B.segnaImparato('molt-tondo', true);
  await B.nuvola.sincronizza(); await A.nuvola.sincronizza();
  verifica('A: cinque risposte, le stesse di B', A.dati.risposte.length === 5 && uids(A) === uids(B));
  verifica('A: imparati come su B', imparati(A) === 'molt-tondo');

  // giri ripetuti: nessun doppione
  await A.nuvola.sincronizza(); await B.nuvola.sincronizza(); await A.nuvola.sincronizza();
  verifica('nessun doppione nel database', nel('risposte').length === 5 && new Set(nel('risposte').map(r => r.uid)).size === 5);

  // offline: tutti e due segnano un trucco diverso senza rete, poi la rete torna
  server.giu = true;
  A.segnaImparato('potenze-quadrati', true); riga(A, 'potenze-quadrati');
  B.segnaImparato('controlli-nove', true); riga(B, 'controlli-nove');
  await A.nuvola.sincronizza();
  verifica('offline: errore mostrato e riga in attesa', /connessione|connection/i.test(A.nuvola.errore) && A.dati.risposte.some(r => !r.su));
  verifica('offline: database segnato come non raggiunto', A.nuvola.irraggiungibile === true);
  verifica('link al pannello ricavato da config.js', A.nuvola.pannello === 'https://supabase.com/dashboard/project/finto');
  server.giu = false;
  await A.nuvola.sincronizza(); await B.nuvola.sincronizza(); await A.nuvola.sincronizza();
  verifica('dopo l\'offline: imparati uniti', imparati(A) === 'controlli-nove,molt-tondo,potenze-quadrati' && imparati(B) === imparati(A));
  verifica('dopo l\'offline: sette risposte ovunque', A.dati.risposte.length === 7 && uids(A) === uids(B) && nel('risposte').length === 7);
  verifica('errore sparito', A.nuvola.errore === '' && A.nuvola.irraggiungibile === false);
  verifica('risposte in ordine di tempo', A.dati.risposte.every((r, i, a) => !i || a[i - 1].t <= r.t));

  // un altro utente non vede niente di Omar
  const C = dispositivo('C');
  await C.nuvola.avvia(); await C.nuvola.accedi('altro@prova.it', 'giusta');
  verifica('altro utente: niente righe di Omar', C.dati.risposte.length === 0 && imparati(C) === '');

  // A cancella risposte e sessioni: sparisce ovunque; quello che B fa dopo resta
  A.azzera();
  await A.nuvola.sincronizza();
  verifica('cancellato nel database', nel('risposte').length === 0 && nel('sessioni').length === 0);
  riga(B, 'desk-atm');
  await B.nuvola.sincronizza(); await A.nuvola.sincronizza();
  verifica('B: resta solo la risposta nuova', B.dati.risposte.length === 1 && B.dati.risposte[0].trucco === 'desk-atm');
  verifica('A: riceve la risposta nuova di B', A.dati.risposte.length === 1 && uids(A) === uids(B));
  verifica('cancellare non tocca gli imparati', imparati(A) === 'controlli-nove,molt-tondo,potenze-quadrati');

  // esci e rientra: si riallinea senza doppioni
  await A.nuvola.esci();
  verifica('A: fuori dopo l\'uscita', A.nuvola.stato === 'fuori');
  riga(A, 'desk-regola-16');
  await A.nuvola.accedi('omar@prova.it', 'giusta');
  verifica('A: dopo il rientro due risposte, nessun doppione', A.dati.risposte.length === 2 && nel('risposte').length === 2);

  // cancellare senza accesso tocca solo questo browser; al rientro torna quello del database
  await A.nuvola.esci();
  A.azzera();
  verifica('A: cancellato qui', A.dati.risposte.length === 0);
  verifica('database intatto', nel('risposte').length === 2);
  await A.nuvola.accedi('omar@prova.it', 'giusta');
  verifica('A: al rientro tornano le risposte', A.dati.risposte.length === 2);

  // un browser nuovo riparte dai dati salvati (localStorage) e non rimanda niente
  const prima = nel('risposte').length;
  await B.nuvola.sincronizza();
  verifica('B: niente di nuovo da mandare', nel('risposte').length === prima);

  if (errori.length) {
    console.log(`${errori.length} controlli falliti:`);
    errori.forEach(e => console.log('  - ' + e));
    process.exit(1);
  }
  console.log('Sincronizzazione: tutti i controlli passati.');
})().catch(e => { console.error(e); process.exit(1); });
