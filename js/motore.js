/* Palestra, il motore: registro di materie e trucchi, numeri a caso, formati,
   lettura e controllo delle risposte, salvataggio dei risultati.
   Non disegna niente: l'interfaccia sta in app.js. */
(function () {
  'use strict';
  const P = (window.Palestra = window.Palestra || {});

  // ---------- lingua ----------
  // Ogni testo esiste in italiano e in inglese. Nei generatori: P.t('testo', 'text').
  // Nei campi fissi di un trucco: { it: '...', en: '...' }, letti con P.tr(campo).

  P.LINGUE = ['it', 'en'];
  // English on the first visit; the IT | EN choice is remembered
  P.lingua = 'en';
  try {
    const l = localStorage.getItem('palestra.lingua');
    if (P.LINGUE.includes(l)) P.lingua = l;
  } catch (e) { /* this visit stays in English */ }
  P.t = (it, en) => (P.lingua === 'en' && en != null ? en : it);
  P.tr = x => (x && typeof x === 'object' && !Array.isArray(x) && ('it' in x || 'en' in x) ? (x[P.lingua] != null ? x[P.lingua] : x.it) : x);
  P.impostaLingua = l => {
    if (!P.LINGUE.includes(l)) return;
    P.lingua = l;
    try { localStorage.setItem('palestra.lingua', l); } catch (e) { /* solo per questa visita */ }
    if (typeof document !== 'undefined') document.documentElement.lang = l;
  };

  // ---------- registro ----------

  P.materie = [];
  P.trucchi = [];
  P.base = []; // generatori di calcolo di base per il test a tempo (js/base.js)

  P.materia = def => { P.materie.push(def); };
  P.trucco = def => { P.trucchi.push(def); };
  P.trovaMateria = id => P.materie.find(m => m.id === id);
  P.trovaTrucco = id => P.trucchi.find(t => t.id === id);
  P.trovaCapitolo = (materiaId, capId) => {
    const m = P.trovaMateria(materiaId);
    return m && m.capitoli.find(c => c.id === capId);
  };
  P.trucchiDi = (materiaId, capId) => P.trucchi
    .filter(t => t.materia === materiaId && (!capId || t.capitolo === capId))
    .sort((a, b) => a.numero - b.numero);

  // ---------- caso ----------

  P.int = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  P.pick = arr => arr[Math.floor(Math.random() * arr.length)];
  P.chance = p => Math.random() < p;
  P.segno = () => (Math.random() < 0.5 ? -1 : 1);
  P.mescola = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  // sceglie fra varianti con un peso: P.pesato([[0.6, f], [0.4, g]])
  P.pesato = coppie => {
    const tot = coppie.reduce((s, c) => s + c[0], 0);
    let x = Math.random() * tot;
    for (const [w, v] of coppie) { if ((x -= w) < 0) return v; }
    return coppie[coppie.length - 1][1];
  };
  P.mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };

  // Same text, same numbers: runs fn with Math.random replaced by a generator seeded from a string, so the
  // daily challenge gives everyone the same questions on the same day, in either language.
  P.conSeme = (seme, fn) => {
    let h = 1779033703 ^ seme.length;
    for (let i = 0; i < seme.length; i++) { h = Math.imul(h ^ seme.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    let a = h >>> 0;
    const originale = Math.random;
    Math.random = () => {                                        // mulberry32
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    try { return fn(); } finally { Math.random = originale; }
  };

  // ---------- formati: one notation in both languages, decimal point and a comma for thousands
  //            (from 10,000 up, so 4-digit numbers stay as 4700) ----------

  // P.fmt(0.428571428, 6) -> "0.428571…"; P.fmt(25000) -> "25,000"
  P.fmt = (x, dec = 6) => {
    if (!isFinite(x)) return String(x);
    const r = Math.round(x * 10 ** dec) / 10 ** dec;
    let s = Math.abs(r).toFixed(dec);
    if (dec > 0) s = s.replace(/\.?0+$/, ''); // only decimals: with dec = 0, 30 must stay 30
    let [int, frac] = s.split('.');
    if (int.length > 4) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    s = frac ? int + '.' + frac : int;
    if (r < 0 || (r === 0 && x < 0 && Math.abs(x) > 1e-12)) s = '−' + s;
    if (Math.abs(r - x) > 1e-12 * Math.max(1, Math.abs(x))) s += '…';
    return s;
  };
  P.pct = (x, dec = 2) => P.fmt(x * 100, dec) + '%';
  P.conSegno = (x, f = P.fmt) => (x > 0 ? '+' : '') + f(x);
  P.pctSegno = (x, dec = 2) => (x > 0 ? '+' : '') + P.pct(x, dec);

  const APICI = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  P.apice = n => String(n).split('').map(c => APICI[c] || c).join('');

  // ---------- risposte attese ----------

  // Risposta numerica. Opzioni:
  //   decimali: per i risultati che non finiscono, quanti decimali servono almeno (arrotondati o troncati)
  //   tol, rel: tolleranza assoluta o relativa (per le stime da desk)
  //   percento: la risposta è una frazione (0.25) ma vale anche scritta come 25 o 25%
  //   mostra: come scrivere la risposta giusta (altrimenti P.fmt)
  //   unita: testo dopo la casella (€, $, ...)
  P.numero = (valore, opz = {}) => Object.assign({ tipo: 'numero', valore }, opz);
  // Scelta multipla: opzioni come testo, indice di quella giusta
  P.scelta = (opzioni, giusta) => ({ tipo: 'scelta', opzioni, giusta });

  P.mostraRisposta = r => {
    if (r.tipo === 'scelta') return r.opzioni[r.giusta];
    if (r.mostra) return r.mostra;
    return r.percento ? P.pct(r.valore, 4) : P.fmt(r.valore);
  };

  // ---------- lettura di quello che scrivi ----------

  // Un numero scritto con punti e virgole. Restituisce una o due letture:
  // "25.000" può essere 25 mila o 25 con tre decimali, e le teniamo tutte e due.
  function numeri(s) {
    if (!/^-?[\d.,]+$/.test(s) || !/\d/.test(s)) return [];
    const neg = s[0] === '-';
    if (neg) s = s.slice(1);
    const out = [];
    const add = (int, dec) => {
      if (!/^\d*$/.test(int) || !/^\d*$/.test(dec || '')) return;
      const v = parseFloat((int || '0') + '.' + (dec || '0'));
      if (isFinite(v)) out.push({ v: neg ? -v : v, dec: dec ? dec.length : 0 });
    };
    const punti = (s.match(/\./g) || []).length, virgole = (s.match(/,/g) || []).length;
    if (punti && virgole) {
      const ultimo = Math.max(s.lastIndexOf('.'), s.lastIndexOf(','));
      add(s.slice(0, ultimo).replace(/[.,]/g, ''), s.slice(ultimo + 1));
    } else if (punti + virgole === 0) {
      add(s, '');
    } else if (punti + virgole > 1) {
      const parti = s.split(/[.,]/);
      if (parti.slice(1).every(p => p.length === 3)) add(parti.join(''), '');
    } else {
      const [a, b] = s.split(/[.,]/);
      add(a, b);
      if (b.length === 3 && a && !/^0*$/.test(a)) add(a + b, '');
    }
    return out;
  }

  P.letture = raw => {
    let s = String(raw).trim().toLowerCase()
      .replace(/…|\.\.\.$/g, '')
      .replace(/[\s   '’_]/g, '')
      .replace(/[−–—]/g, '-')
      .replace(/^\+/, '')
      .replace(/(€|\$|euros|euro|eur|usd|dollari|dollars)/g, '');
    if (!s) return [];
    // prezzi dei Treasury: 99-17 = 99 + 17/32; il + aggiunge 1/64
    let m = s.match(/^(\d+)-(\d{1,2})(\+?)$/);
    if (m && +m[2] < 32) return [{ v: +m[1] + +m[2] / 32 + (m[3] ? 1 / 64 : 0), dec: Infinity, pct: false }];
    let pct = false, scala = 0;
    if (s.endsWith('%')) { pct = true; s = s.slice(0, -1); }
    else if (/(bps?|pb|punti)$/.test(s)) { s = s.replace(/(bps?|pb|punti)$/, ''); } // unità scritta per abitudine
    else if (/(milioni|milione|millions|million|mln|mio|mn|mm|m)$/.test(s)) { scala = 6; s = s.replace(/(milioni|milione|millions|million|mln|mio|mn|mm|m)$/, ''); }
    else if (/(mila|thousand|k)$/.test(s)) { scala = 3; s = s.replace(/(mila|thousand|k)$/, ''); }
    else if (/\d[a-z]+$/.test(s)) { s = s.replace(/[a-z]+$/, ''); } // "6 lanci", "12 ordini"
    let base;
    m = s.match(/^(-?[\d.,]+)\/(-?[\d.,]+)$/);
    if (m) {
      base = [];
      for (const a of numeri(m[1])) for (const b of numeri(m[2])) {
        if (b.v !== 0) base.push({ v: a.v / b.v, dec: Infinity });
      }
    } else {
      base = numeri(s);
    }
    return base.map(c => ({
      v: c.v * 10 ** scala / (pct ? 100 : 1),
      dec: c.dec + (pct ? 2 : 0) - scala,
      pct,
    }));
  };

  function vicino(c, r) {
    const v = r.valore, d = Math.abs(c.v - v);
    if (d <= 1e-9 * Math.max(1, Math.abs(v))) return true;
    if (r.tol != null && d <= r.tol + 1e-12) return true;
    if (r.rel != null && d <= r.rel * Math.abs(v) + 1e-12) return true;
    if (r.decimali != null && isFinite(c.dec) && c.dec >= r.decimali && d < 10 ** -c.dec) return true;
    return false;
  }

  // Restituisce { valido, ok }: valido = falso se non si legge come numero
  P.verifica = (r, raw) => {
    if (r.tipo === 'scelta') return { valido: true, ok: Number(raw) === r.giusta };
    let c = P.letture(raw);
    if (r.percento) c = c.concat(c.filter(x => !x.pct).map(x => ({ v: x.v / 100, dec: x.dec + 2 })));
    return { valido: c.length > 0, ok: c.some(x => vicino(x, r)) };
  };

  // ---------- date ----------

  const due = n => String(n).padStart(2, '0');
  P.oggi = (d = new Date()) => `${d.getFullYear()}-${due(d.getMonth() + 1)}-${due(d.getDate())}`;
  P.ora = (d = new Date()) => `${due(d.getHours())}:${due(d.getMinutes())}:${due(d.getSeconds())}`;
  P.giorniTra = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
  const MESI = {
    it: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  };
  P.dataBreve = iso => { const [, m, g] = iso.split('-'); return `${+g} ${MESI[P.lingua][+m - 1]}`; };

  // ---------- storage: always in the browser, in ../palestra_risposte.csv when palestra.py is running,
  // nel database se config.js lo indica e hai fatto l'accesso (js/nuvola.js) ----------

  const CHIAVE = 'palestra.v1';
  // imparatiAgg: per ogni trucco, quando è stato segnato o tolto (ms); serve a mettere d'accordo i dispositivi.
  // sinc: a che punto è la sincronizzazione con il database (la gestisce nuvola.js).
  P.dati = { imparati: {}, imparatiAgg: {}, risposte: [], sessioni: [], sinc: {} };
  try {
    const letti = JSON.parse(localStorage.getItem(CHIAVE) || 'null');
    if (letti && typeof letti === 'object') Object.assign(P.dati, letti);
  } catch (e) { /* niente storage: si lavora solo in memoria */ }

  // un codice a caso per ogni risposta, così la stessa riga non entra due volte nel database
  P.nuovoUid = () => {
    const a = new Uint8Array(12), c = typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto : null;
    if (c) c.getRandomValues(a); else for (let i = 0; i < a.length; i++) a[i] = Math.floor(Math.random() * 256);
    return Array.from(a, x => x.toString(16).padStart(2, '0')).join('');
  };

  // dati salvati prima della sincronizzazione: si completano una volta, senza cambiare nulla di visibile
  (function () {
    const D = P.dati, quando = x => Date.parse(`${x.data}T${x.ora || '12:00:00'}`) || 0;
    if (!D.imparatiAgg || typeof D.imparatiAgg !== 'object') D.imparatiAgg = {};
    if (!D.sinc || typeof D.sinc !== 'object') D.sinc = {};
    for (const id in D.imparati) if (!D.imparatiAgg[id]) D.imparatiAgg[id] = 1; // più vecchio di qualunque modifica vera
    for (const r of D.risposte) { if (!r.uid) r.uid = P.nuovoUid(); if (!r.t) r.t = quando(r); }
    for (const s of D.sessioni) if (!s.t) s.t = quando(s);
  })();

  P.salva = () => {
    try { localStorage.setItem(CHIAVE, JSON.stringify(P.dati)); } catch (e) { /* pieno o bloccato */ }
  };

  // dopo ogni modifica: salva qui, poi avvisa la sincronizzazione (che parte solo se c'è)
  const cambiato = () => { P.salva(); if (P.nuvola) P.nuvola.spingi(); };

  P.segnaImparato = (id, si) => {
    if (si) P.dati.imparati[id] = P.oggi(); else delete P.dati.imparati[id];
    P.dati.imparatiAgg[id] = Date.now();
    cambiato();
  };

  P.aggiungiSessione = s => {
    P.dati.sessioni.push(Object.assign({ t: Date.now() }, s));
    cambiato();
  };

  // Cancella risposte e sessioni. Con l'accesso fatto cancella anche nel database, quindi ovunque;
  // senza, solo in questo browser (e al prossimo accesso torna quello che c'è nel database).
  P.azzera = () => {
    P.dati.risposte = [];
    P.dati.sessioni = [];
    if (P.nuvola && P.nuvola.collegata()) P.dati.sinc.daAzzerare = Date.now();
    else P.dati.sinc = {};
    cambiato();
  };

  P.COLONNE = ['sessione', 'data', 'ora', 'modalita', 'n', 'materia', 'capitolo', 'trucco', 'livello',
    'domanda', 'risposta', 'corretta', 'esito', 'secondi', 'suggerimenti'];

  P.server = false;
  let inviando = false;

  P.registra = riga => {
    P.dati.risposte.push(Object.assign({ uid: P.nuovoUid(), t: Date.now() }, riga));
    cambiato();
    P.invia();
  };

  P.invia = async () => {
    if (!P.server || inviando) return;
    const da = P.dati.risposte.filter(r => !r.inviata);
    if (!da.length) return;
    inviando = true;
    try {
      const corpo = da.map(r => Object.fromEntries(P.COLONNE.map(k => [k, r[k]])));
      const res = await fetch('api/risposte', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo),
      });
      if (res.ok) { da.forEach(r => { r.inviata = true; }); P.salva(); }
    } catch (e) { /* riprova alla prossima risposta */ }
    inviando = false;
    // le risposte arrivate mentre si inviava partono subito, senza aspettare la prossima
    if (P.dati.risposte.some(r => !r.inviata) && da.every(r => r.inviata)) P.invia();
  };

  P.controllaServer = async () => {
    // only palestra.py on this computer answers api/stato; online there is nothing to ask
    if (!/^https?:$/.test(location.protocol) || !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return false;
    try {
      const res = await fetch('api/stato', { cache: 'no-store' });
      P.server = res.ok && (await res.json()).ok === true;
    } catch (e) { P.server = false; }
    if (P.server) P.invia();
    return P.server;
  };

  P.csv = righe => {
    const q = v => {
      const s = v == null ? '' : String(v);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    return [P.COLONNE.join(',')].concat(righe.map(r => P.COLONNE.map(k => q(r[k])).join(','))).join('\n') + '\n';
  };

  // ---------- statistiche e ripasso ----------

  P.risposteDi = id => P.dati.risposte.filter(r => r.trucco === id);

  P.statistiche = righe => {
    const n = righe.length;
    if (!n) return { n: 0 };
    const giuste = righe.filter(r => r.esito === 'giusta').length;
    const sec = righe.reduce((s, r) => s + (+r.secondi || 0), 0) / n;
    const aiuti = righe.filter(r => +r.suggerimenti > 0).length;
    return { n, giuste, precisione: giuste / n, secondi: sec, aiuti: aiuti / n, ultima: righe[n - 1].data };
  };

  // Ripasso a 1, 3, 7, 14, 30 giorni dalla data in cui hai segnato il trucco come imparato,
  // poi ogni 30. Un trucco torna anche se nelle ultime 20 risposte sei sotto l'80%.
  const PASSI = [1, 3, 7, 14, 30];
  P.ripassi = (oggi = P.oggi()) => {
    const out = [];
    for (const t of P.trucchi) {
      const dal = P.dati.imparati[t.id];
      if (!dal) continue;
      const motivi = [];
      const gg = P.giorniTra(dal, oggi);
      let passo = null;
      for (const p of PASSI) if (gg >= p) passo = p;
      if (gg > 30) passo = 30 * Math.floor(gg / 30);
      const righe = P.risposteDi(t.id);
      if (passo != null) {
        const scade = P.oggi(new Date(Date.parse(dal) + passo * 86400000));
        const fatto = righe.some(r => r.data >= scade);
        if (!fatto) motivi.push(P.t(`ripasso dei ${passo} giorni`, `${passo}-day review`));
      }
      const st = P.statistiche(righe.slice(-20));
      if (st.n >= 5 && st.precisione < 0.8) motivi.push(P.t(`${Math.round(st.precisione * 100)}% nelle ultime ${st.n}`, `${Math.round(st.precisione * 100)}% in the last ${st.n}`));
      if (motivi.length) out.push({ trucco: t, motivi });
    }
    return out;
  };
})();

// articoli davanti ai numeri: "l'8%", "il 25%", "dell'11%", "al 20%"
(function () {
  const P = window.Palestra;
  const vocale = x => {
    const s = String(x);
    return s[0] === '8' || s === '1' || s === '11' || /^1\./.test(s) || /^11\./.test(s);
  };
  P.il = x => (vocale(x) ? "l'" : 'il ') + String(x);
  P.del = x => (vocale(x) ? "dell'" : 'del ') + String(x);
  P.dal = x => (vocale(x) ? "dall'" : 'dal ') + String(x);
  P.al = x => (vocale(x) ? "all'" : 'al ') + String(x);
  P.cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  // "+ 3" / "− 3" per scrivere i passi
  P.piuMeno = x => (x < 0 ? '− ' : '+ ') + P.fmt(Math.abs(x));
})();
