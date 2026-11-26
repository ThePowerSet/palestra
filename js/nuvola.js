/* Palestra, i progressi su tutti i dispositivi.
   Se config.js indica un progetto Supabase e dal Registro hai fatto l'accesso, risposte, sessioni e
   trucchi imparati salgono nel database e scendono sugli altri dispositivi. Senza config.js, o senza
   accesso, la palestra lavora solo nel browser, come prima.

   Il browser resta la copia di lavoro: ogni modifica si salva prima qui e poi parte verso il database,
   quindi si risponde anche offline e le righe in attesa salgono alla prima occasione.
   - risposte e sessioni si aggiungono soltanto: ognuna ha un codice (uid), quindi rimandarla non la duplica;
     dal database si scaricano solo le righe nuove (id oltre l'ultimo visto);
   - trucchi imparati: per ogni trucco vince la modifica più recente, da qualunque dispositivo venga;
   - «Cancella risposte e sessioni» lascia nel database la data della cancellazione, così anche gli altri
     dispositivi tolgono le righe più vecchie. */
(function () {
  'use strict';
  const P = window.Palestra;
  const conf = window.PALESTRA_CLOUD || {};
  // la libreria ufficiale di Supabase, versione fissa e controllata con l'impronta (integrity)
  const LIBRERIA = {
    src: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/dist/umd/supabase.js',
    integrity: 'sha384-uteMfOloLDGt042uDz+xHGF3ym63/WQ6rFq7murQRG8Ih7QrXGEGNtWd8688sb4O',
  };
  const BLOCCO = 500;  // righe per invio
  const PAGINA = 1000; // righe per lettura: il massimo che Supabase restituisce di serie

  let db = null, utente = null, attesa = null, inCorso = null, ancora = false;

  const N = P.nuvola = {
    attiva: !!(conf.url && conf.chiave),
    stato: 'spenta',   // spenta · carica · fuori · dentro · errore
    email: '',
    ultima: 0,         // ultima sincronizzazione riuscita (ms)
    errore: '',        // ultimo errore, vuoto se è andato tutto bene
    irraggiungibile: false, // the last attempt could not reach the database (offline, or the project is paused)
    // the project's page on the Supabase dashboard, where a paused project is restored; built from config.js,
    // only for *.supabase.co addresses, and it needs the owner's Supabase login to show anything
    pannello: (r => (r ? 'https://supabase.com/dashboard/project/' + r[1] : ''))(/^https:\/\/([a-z0-9]{1,63})\.supabase\.co\/?$/.exec(conf.url || '')),
    quandoCambia: null, // la imposta app.js: (datiNuovi) => ridisegna
    collegata: () => !!(db && utente),
  };

  const avvisa = datiNuovi => { if (N.quandoCambia) N.quandoCambia(!!datiNuovi); };
  const esegui = async richiesta => { const { data, error } = await richiesta; if (error) throw error; return data; };
  const taglia = (s, n) => (s == null ? '' : String(s)).slice(0, n);
  // network failures, and the gateway errors a paused project answers with
  const nonRaggiunto = m => /fetch|network|load failed|paused|unavailable|gateway|timed? ?out|\b5\d\d\b/i.test(m);
  const messaggio = e => {
    const m = (e && (e.message || e.error_description)) || String(e);
    return /fetch|network|load failed/i.test(m) ? P.t('nessuna connessione, riprovo più tardi', 'no connection, will retry later') : m;
  };

  function carica() {
    return new Promise((ok, ko) => {
      if (window.supabase && window.supabase.createClient) return ok();
      const s = document.createElement('script');
      s.src = LIBRERIA.src; s.integrity = LIBRERIA.integrity; s.crossOrigin = 'anonymous';
      s.onload = () => ok(); s.onerror = () => ko(new Error(P.t('libreria del database non raggiungibile', 'database library unreachable')));
      document.head.appendChild(s);
    });
  }

  function imposta(sessione) {
    const prima = N.stato;
    utente = sessione ? sessione.user : null;
    N.email = utente ? utente.email || '' : '';
    N.stato = utente ? 'dentro' : 'fuori';
    if (N.stato !== prima) avvisa(false);
  }

  // all'apertura della pagina: carica la libreria, riprende l'accesso salvato e sincronizza
  N.avvia = async () => {
    if (!N.attiva || db) return;
    N.stato = 'carica';
    try {
      await carica();
      db = window.supabase.createClient(conf.url, conf.chiave, {
        auth: { persistSession: true, autoRefreshToken: true, storageKey: 'palestra.accesso' },
      });
      const { data } = await db.auth.getSession();
      imposta(data && data.session);
      // niente chiamate al database qui dentro: la libreria lo sconsiglia (si blocca)
      db.auth.onAuthStateChange((evento, sessione) => imposta(sessione));
    } catch (e) {
      N.stato = 'errore'; N.errore = messaggio(e); avvisa(false);
      return;
    }
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') N.sincronizza(); });
    }
    if (typeof window.addEventListener === 'function') window.addEventListener('online', () => N.sincronizza());
    await N.sincronizza();
  };

  N.accedi = async (email, password) => {
    if (!db) return { errore: P.t('database non raggiungibile', 'database unreachable') };
    const { data, error } = await db.auth.signInWithPassword({ email, password });
    if (error) {
      const m = (error.code || '') + ' ' + (error.message || '');
      if (/invalid/i.test(m)) return { errore: P.t('Email o password sbagliate.', 'Wrong email or password.') };
      if (nonRaggiunto(m)) return { errore: P.t('Database non raggiungibile: controlla la connessione e riprova.', 'Database unreachable: check your connection and try again.'), irraggiungibile: true };
      return { errore: m.trim() };
    }
    imposta(data.session);
    await N.sincronizza();
    return {};
  };

  // esce solo da questo dispositivo; i dati restano qui e nel database
  N.esci = async () => {
    if (!db) return;
    try { await db.auth.signOut({ scope: 'local' }); } catch (e) { /* esce comunque qui sotto */ }
    P.dati.sinc = {}; // al prossimo accesso si riallinea da capo, senza doppioni
    P.salva();
    imposta(null);
  };

  // dopo una modifica: aspetta un attimo, così le risposte di fila partono insieme
  N.spingi = () => {
    if (!N.collegata()) return;
    clearTimeout(attesa);
    attesa = setTimeout(() => N.sincronizza(), 1500);
  };

  N.sincronizza = () => {
    if (!N.collegata()) return Promise.resolve();
    if (inCorso) { ancora = true; return inCorso; }
    inCorso = (async () => {
      do {
        ancora = false;
        try {
          const nuovi = await giro();
          P.salva();
          N.errore = ''; N.irraggiungibile = false; N.ultima = Date.now();
          avvisa(nuovi);
        } catch (e) {
          P.salva();
          N.errore = messaggio(e);
          N.irraggiungibile = nonRaggiunto((e && (e.message || e.error_description)) || String(e));
          avvisa(false);
          ancora = false;
        }
      } while (ancora);
      inCorso = null;
    })();
    return inCorso;
  };

  // ---------- un giro di sincronizzazione; restituisce true se sono arrivati dati da altri dispositivi ----------

  async function giro() {
    const D = P.dati, s = D.sinc, io = utente.id;
    let nuovi = false;

    if (s.utente !== io) {
      // primo accesso da questo browser: si manda tutto e si scarica tutto (i doppioni si riconoscono dall'uid)
      const daAzzerare = s.daAzzerare;
      D.sinc = { utente: io, risposte: 0, sessioni: 0, azzerato: 0 };
      if (daAzzerare) D.sinc.daAzzerare = daAzzerare;
      D.risposte.forEach(r => { delete r.su; });
      D.sessioni.forEach(x => { delete x.su; });
      return giro();
    }

    const st = (await esegui(db.from('stato').select('imparati, agg, azzerato').maybeSingle()))
      || { imparati: {}, agg: {}, azzerato: 0 };
    const azzeratoAltrove = +st.azzerato || 0;

    // 1. cancellazione fatta su un altro dispositivo: via le righe più vecchie
    if (azzeratoAltrove > (s.azzerato || 0)) {
      const prima = D.risposte.length + D.sessioni.length;
      D.risposte = D.risposte.filter(r => !r.su && (r.t || 0) >= azzeratoAltrove);
      D.sessioni = D.sessioni.filter(x => !x.su && (x.t || 0) >= azzeratoAltrove);
      s.azzerato = azzeratoAltrove;
      if (D.risposte.length + D.sessioni.length !== prima) nuovi = true;
    }

    // 2. cancellazione fatta qui
    if (s.daAzzerare) {
      const fino = s.daAzzerare;
      await esegui(db.from('risposte').delete().lt('t', fino));
      await esegui(db.from('sessioni').delete().lt('t', fino));
      if (fino > azzeratoAltrove) await esegui(db.from('stato').upsert({ user_id: io, azzerato: fino }));
      s.azzerato = Math.max(s.azzerato || 0, fino);
      delete s.daAzzerare;
    }

    // 3. trucchi imparati: per ogni trucco vince la modifica più recente
    const remImp = st.imparati || {}, remAgg = st.agg || {}, locAgg = D.imparatiAgg;
    let daMandare = false;
    for (const id of new Set(Object.keys(remAgg).concat(Object.keys(locAgg)))) {
      const r = +remAgg[id] || 0, l = +locAgg[id] || 0;
      if (r > l) {
        if (remImp[id]) D.imparati[id] = remImp[id]; else delete D.imparati[id];
        locAgg[id] = r;
        nuovi = true;
      } else if (l > r) daMandare = true;
    }
    if (daMandare) await esegui(db.from('stato').upsert({ user_id: io, imparati: D.imparati, agg: locAgg }));

    // 4. su le righe nuove di questo dispositivo
    await su('risposte', D.risposte, r => ({
      user_id: io, uid: r.uid, t: r.t, sessione: taglia(r.sessione, 80), data: r.data, ora: r.ora, modalita: taglia(r.modalita, 40),
      n: +r.n || 0, materia: taglia(r.materia, 40), capitolo: taglia(r.capitolo, 40), trucco: taglia(r.trucco, 60),
      livello: r.livello === '' || r.livello == null ? null : +r.livello,
      domanda: taglia(r.domanda, 4000), risposta: taglia(r.risposta, 500), corretta: taglia(r.corretta, 500),
      esito: taglia(r.esito, 20), secondi: +r.secondi || 0, suggerimenti: +r.suggerimenti || 0,
    }));
    await su('sessioni', D.sessioni, x => ({
      user_id: io, uid: taglia(x.id, 80), t: x.t, data: x.data, modalita: taglia(x.modalita, 40), titolo: x.titolo,
      domande: +x.domande || 0, giuste: +x.giuste || 0, sbagliate: +x.sbagliate || 0, saltate: +x.saltate || 0,
      punteggio: +x.punteggio || 0, secondi: +x.secondi || 0,
    }));

    // 5. giù le righe arrivate da altri dispositivi
    if (await giu('risposte', D.risposte, r => r.uid, r => ({
      uid: r.uid, t: +r.t, sessione: r.sessione, data: r.data, ora: r.ora, modalita: r.modalita, n: r.n,
      materia: r.materia, capitolo: r.capitolo, trucco: r.trucco, livello: r.livello == null ? '' : r.livello,
      domanda: r.domanda, risposta: r.risposta, corretta: r.corretta, esito: r.esito, secondi: r.secondi,
      suggerimenti: r.suggerimenti, su: true, inviata: true, // inviata: nel CSV locale entra con palestra.py --scarica
    }))) nuovi = true;
    if (await giu('sessioni', D.sessioni, x => x.id, x => ({
      id: x.uid, t: +x.t, data: x.data, modalita: x.modalita, titolo: x.titolo, domande: x.domande, giuste: x.giuste,
      sbagliate: x.sbagliate, saltate: x.saltate, punteggio: x.punteggio, secondi: x.secondi, su: true,
    }))) nuovi = true;

    return nuovi;
  }

  async function su(tabella, righe, mappa) {
    const da = righe.filter(r => !r.su);
    for (let i = 0; i < da.length; i += BLOCCO) {
      const pezzo = da.slice(i, i + BLOCCO);
      await esegui(db.from(tabella).upsert(pezzo.map(mappa), { onConflict: 'user_id,uid', ignoreDuplicates: true }));
      pezzo.forEach(r => { r.su = true; });
      P.salva();
    }
  }

  async function giu(tabella, locali, chiave, mappa) {
    const s = P.dati.sinc, visti = new Set(locali.map(chiave));
    let ultimo = s[tabella] || 0, arrivate = 0;
    for (;;) {
      const righe = await esegui(db.from(tabella).select('*').gt('id', ultimo).order('id', { ascending: true }).limit(PAGINA));
      for (const r of righe) {
        ultimo = Math.max(ultimo, +r.id);
        const l = mappa(r);
        if (!visti.has(chiave(l))) { locali.push(l); visti.add(chiave(l)); arrivate++; }
      }
      s[tabella] = ultimo;
      if (righe.length < PAGINA) break;
    }
    if (arrivate) locali.sort((a, b) => (a.t || 0) - (b.t || 0)); // in ordine di tempo, da qualunque dispositivo
    return arrivate > 0;
  }
})();
