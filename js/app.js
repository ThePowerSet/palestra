/* Palestra, l'interfaccia: programma, lezioni, sessioni di esercizi, ripasso, test a tempo, registro.
   Una pagina sola con le rotte nell'indirizzo (#/trucco/<id>, #/allenamento, ...).
   Una lingua alla volta: il tasto IT | EN in testata la cambia e ridisegna la pagina. */
(function () {
  'use strict';
  const P = Palestra;
  const vista = document.getElementById('vista');
  const t = P.t, tr = P.tr;
  const due = (it, en) => ({ it, en }); // un testo in tutte e due le lingue, da leggere con tr()

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Sync across devices is for whoever runs this copy of the app. The sign-in box shows only on devices
  // that have signed in before or opened #/accedi once; every other visitor never contacts Supabase or
  // jsdelivr, and their progress stays in their own browser.
  const ownerDevice = () => {
    if (!P.nuvola.attiva) return false;
    try { return !!(localStorage.getItem('palestra.proprietario') || localStorage.getItem('palestra.accesso')); } catch (e) { return false; }
  };
  const piano = html => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent.replace(/\s+/g, ' ').trim(); };
  const perc = x => Math.round(x * 100) + '%';
  const sec = x => (Math.round(x * 10) / 10).toFixed(1) + ' s';
  const mmss = ms => { const s = Math.ceil(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const LIVELLI = due(['Base', 'Applicato', 'Un passo in più'], ['Basic', 'Applied', 'One step further']); // un trucco può dare i suoi (nomiLivelli)
  const nomeLivello = (trucco, k) => tr(trucco.nomiLivelli || LIVELLI)[k];
  const nomeTrucco = trucco => due(`Trucco ${trucco.numero} · ${trucco.titolo.it || trucco.titolo}`, `Trick ${trucco.numero} · ${trucco.titolo.en || trucco.titolo}`);

  let S = null;      // sessione in corso
  let timer = null;  // conto alla rovescia del test

  // ---------- small shared pieces: progress bars, level dots, icons ----------

  // a bar drawn in SVG, because the CSP forbids inline styles: p from 0 to 1
  const barra = (p, cls = '') => `<svg class="barretta ${cls}" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true"><rect width="100" height="6" rx="3" class="fondo"/><rect width="${Math.max(0, Math.min(100, p * 100)).toFixed(1)}" height="6" rx="3" class="pieno"/></svg>`;

  // per level: 0 = fewer than 3 answers, 1 = practising, 2 = at least 80% in the last 10
  const statoLivelli = id => {
    const righe = P.risposteDi(id);
    return [1, 2, 3].map(l => {
      const rr = righe.filter(r => +r.livello === l).slice(-10);
      if (rr.length < 3) return 0;
      return rr.filter(r => r.esito === 'giusta').length / rr.length >= 0.8 ? 2 : 1;
    });
  };
  const puntini = id => {
    const nomi = [t('non ancora', 'not yet'), t('in allenamento', 'practising'), t('solido', 'solid')];
    const st = statoLivelli(id);
    return `<span class="puntini" title="${st.map((s, k) => `L${k + 1}: ${nomi[s]}`).join(' · ')}">${st.map(s => `<i class="p${s}"></i>`).join('')}</span>`;
  };

  const ICONE = {
    lezione: '<path d="M4 5.5C6.5 4 9.5 4 12 5.5v14c-2.5-1.5-5.5-1.5-8 0z"/><path d="M12 5.5c2.5-1.5 5.5-1.5 8 0v14c-2.5-1.5-5.5-1.5-8 0"/>',
    allenamento: '<path d="M4 17l5-5 4 4 7-8"/><path d="M15 8h5v5"/>',
    ripasso: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v5h5"/>',
    test: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9v4l2.5 2.5M9.5 2.5h5"/>',
    debole: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
    risorse: '<path d="M5 4h4v16H5zM10 4h4v16h-4z"/><path d="M15.5 5.2l3.8-1 3.7 15.5-3.8 1z"/>',
    schede: '<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  };
  const icona = (k, cls = 'icona') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONE[k]}</svg>`;

  // the next trick to study: the first one, in programme order, not marked as learnt
  const ordine = () => P.materie.flatMap(m => P.trucchiDi(m.id));
  const prossimoTrucco = () => ordine().find(x => !P.dati.imparati[x.id]);

  // ---------- testata e rotte ----------

  function testata(nome) {
    const voci = [
      ['', t('Programma', 'Programme')],
      ['allenamento', t('Allenamento', 'Practice')],
      ['ripasso', t('Ripasso', 'Review')],
      ['test', t('Test a tempo', 'Timed test')],
      ['risorse', t('Risorse', 'Library')],
      ['registro', t('Registro', 'Log')],
    ];
    const attiva = nome === 'trucco' || nome === 'schede' ? '' : nome;
    document.getElementById('nav').innerHTML = voci.map(([r, l]) =>
      `<a href="#/${r}" class="${r === attiva ? 'attivo' : ''}"${r === attiva ? ' aria-current="page"' : ''}>${l}${r === 'ripasso' ? ' <span class="conta" id="conta-ripasso" hidden></span>' : ''}</a>`).join('');
    document.querySelectorAll('.lingue button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lingua === P.lingua)));
    document.documentElement.lang = P.lingua;
    piede();
    aggiornaTema();
  }

  function piede() {
    const el = document.getElementById('piede');
    if (!el) return;
    el.innerHTML = `<div class="piede-dentro">
      <div class="piede-marchio"><a class="marchio" href="#/">Palestra</a>
        <p>${t('Esercizi per i colloqui di trading, un trucco alla volta. Gratis, senza account, codice aperto.', 'Drills for trading interviews, one trick at a time. Free, no account, open source.')}</p></div>
      <nav class="piede-link" aria-label="${t('Altre pagine', 'More pages')}">
        <a href="#/schede">${t('Formulario', 'Cheat sheet')}</a>
        <a href="#/risorse">${t('Risorse', 'Library')}</a>
        <a href="#/perche">${t('Perché esiste', 'About')}</a>
        <a href="https://github.com/ThePowerSet/palestra" target="_blank" rel="noopener">GitHub</a>
        <a href="https://thepowerset.github.io/" target="_blank" rel="noopener">thepowerset.github.io</a>
      </nav>
    </div>`;
  }

  // ---------- theme: device, light, dark, in the same order as the toggle on thepowerset.github.io ----------

  const TEMI = ['system', 'light', 'dark'];
  const temaScelto = () => document.documentElement.dataset.theme || 'system';
  function aggiornaTema() {
    const b = document.getElementById('tema');
    if (!b) return;
    const tm = temaScelto();
    b.dataset.tema = tm;
    const nome = { system: t('come il dispositivo', 'same as the device'), light: t('chiaro', 'light'), dark: t('scuro', 'dark') }[tm];
    const testo = t(`Tema: ${nome}. Premi per cambiarlo`, `Theme: ${nome}. Press to change it`);
    b.title = testo;
    b.setAttribute('aria-label', testo);
  }
  function cambiaTema() {
    const dopo = TEMI[(TEMI.indexOf(temaScelto()) + 1) % TEMI.length];
    if (dopo === 'system') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = dopo;
    try { localStorage.setItem('palestra.tema', dopo); } catch (e) { /* this visit only */ }
    aggiornaTema();
  }

  const rotte = { '': home, trucco: lezione, allenamento: confAllenamento, ripasso: confRipasso, test: confTest, registro, sessione, accedi, perche, risorse, schede };

  const rotta = () => location.hash.replace(/^#\/?/, '').split('/');

  function vai() {
    ridisegna();
    if (rotta()[0] !== 'sessione') window.scrollTo(0, 0);
  }

  // ridisegna la pagina dov'è, senza tornare in cima (serve quando arrivano dati da un altro dispositivo)
  function ridisegna() {
    const [nome = '', arg] = rotta();
    testata(nome);
    (rotte[nome] || home)(arg ? decodeURIComponent(arg) : undefined);
    aggiornaConta();
  }

  function aggiornaConta() {
    const n = P.ripassi().length, el = document.getElementById('conta-ripasso');
    if (el) { el.textContent = n || ''; el.hidden = !n; }
  }

  function cambiaLingua(l) {
    if (l === P.lingua) return;
    P.impostaLingua(l);
    // la domanda a cui non hai ancora risposto si rigenera nella lingua nuova
    if (S && !S.fine) {
      const v = corrente();
      if (v && !v.esito) Object.assign(v, { q: genera(v), t0: Date.now(), aiuti: 0 });
    }
    vai();
  }

  // ---------- programma ----------

  // The weakest trick worth practising now: under 80% in its last 20 answers (at least 5), lowest first
  function piuDebole() {
    let peggio = null;
    for (const x of P.trucchi) {
      const st = P.statistiche(P.risposteDi(x.id).slice(-20));
      if (st.n >= 5 && st.precisione < 0.8 && (!peggio || st.precisione < peggio.st.precisione)) peggio = { trucco: x, st };
    }
    return peggio;
  }

  // what to do today: due reviews, the next lesson, the weak spot, the timed test
  function oggi() {
    const scad = P.ripassi(), dopo = prossimoTrucco(), debole = piuDebole();
    const test = P.dati.sessioni.filter(s => s.modalita === 'test');
    const ultimo = test[test.length - 1];
    const carta = (cls, ic, kicker, titolo, testo, azione) => `<div class="passo ${cls}">
        <span class="passo-icona">${icona(ic)}</span>
        <div class="passo-corpo"><span class="etichetta">${kicker}</span><b>${titolo}</b><span class="mini">${testo}</span></div>
        ${azione}</div>`;
    const righe = [];
    if (scad.length) {
      righe.push(carta('urgente', 'ripasso', t('Ripasso', 'Review'),
        t(scad.length === 1 ? 'Un trucco torna oggi' : `${scad.length} trucchi tornano oggi`, scad.length === 1 ? 'One trick is due today' : `${scad.length} tricks are due today`),
        esc(scad.map(x => tr(x.trucco.titolo)).slice(0, 3).join(' · ')) + (scad.length > 3 ? ' …' : ''),
        `<a class="bottone primario" href="#/ripasso">${t('Ripassa', 'Review')}</a>`));
    }
    if (debole) {
      righe.push(carta('', 'debole', t('Punto debole', 'Weak spot'), esc(tr(debole.trucco.titolo)),
        t(`${perc(debole.st.precisione)} nelle ultime ${debole.st.n} risposte`, `${perc(debole.st.precisione)} in the last ${debole.st.n} answers`),
        `<button class="bottone" data-allena="${debole.trucco.id}">${t('Allenati', 'Practise')}</button>`));
    }
    if (dopo) {
      righe.push(carta('', 'lezione', Object.keys(P.dati.imparati).length ? t('Prossima lezione', 'Next lesson') : t('Da dove partire', 'Where to start'),
        `${esc(tr(P.trovaMateria(dopo.materia).titolo))} ${dopo.numero} · ${esc(tr(dopo.titolo))}`, esc(tr(dopo.sottotitolo)),
        `<a class="bottone${scad.length ? '' : ' primario'}" href="#/trucco/${dopo.id}">${t('Apri', 'Open')}</a>`));
    }
    righe.push(carta('', 'test', t('Test a tempo', 'Timed test'),
      ultimo ? t(`Ultimo: ${ultimo.punteggio} punti`, `Last: ${ultimo.punteggio} points`) : t('Dieci domande al minuto', 'Ten questions a minute'),
      ultimo ? esc(tr(ultimo.titolo)) + ` · ${P.dataBreve(ultimo.data)}` : t('Calcolo di base e i trucchi di calcolo, senza suggerimenti.', 'Basic arithmetic and the mental maths tricks, no hints.'),
      `<a class="bottone" href="#/test">${t('Prova', 'Take it')}</a>`));
    return righe.join('');
  }

  function home() {
    const tutti = P.trucchi.length, imparati = P.trucchi.filter(x => P.dati.imparati[x.id]).length;
    const tot = P.statistiche(P.dati.risposte);
    const cono = P.grafici.cono({ passi: 120, cammini: 7, W: 1100, H: 420, sigmaGiorno: 0.012, scalaPct: 0.38, classe: 'disegna' }).svg;
    let h = `
      <section class="eroe">
        <div class="eroe-sfondo" aria-hidden="true">${cono}</div>
        <span class="kicker">${t('Colloqui di trading · calcolo, opzioni, probabilità, tassi', 'Trading interviews · mental maths, options, probability, rates')}</span>
        <h1>${t('I numeri che un desk ti chiede, <em>un trucco alla volta</em>.', 'The numbers a desk asks for, <em>one trick at a time</em>.')}</h1>
        <p class="lead">${t('Ogni trucco ha una lezione breve, domande generate a caso su tre livelli con i suggerimenti, e torna nel ripasso finché non è tuo. Poi lo metti alla prova a tempo.',
          'Each trick has a short lesson, random questions on three levels with hints, and comes back in review until it sticks. Then you test it against the clock.')}</p>
        <p class="eroe-dati"><span><b>${tutti}</b> ${t('trucchi', 'tricks')}</span><span><b>${P.materie.filter(m => P.trucchiDi(m.id).length).length}</b> ${t('materie', 'subjects')}</span><span><b>∞</b> ${t('domande', 'questions')}</span>${tot.n
          ? `<span><b>${imparati}/${tutti}</b> ${t('imparati', 'learnt')}</span><span><b>${perc(tot.precisione)}</b> ${t('giuste', 'right')}</span>` : ''}</p>
        ${ownerDevice() && P.nuvola.stato === 'fuori' ? `<p class="mini"><a href="#/registro">${t('Accedi dal Registro', 'Sign in from the Log')}</a> ${t('per avere i progressi su tutti i tuoi dispositivi.', 'to have your progress on all your devices.')}</p>` : ''}
      </section>
      <section class="blocco">
        <div class="blocco-testa"><span class="kicker">${t('Oggi', 'Today')}</span><h2>${t('Cosa fare adesso', 'What to do now')}</h2></div>
        <div class="passi-oggi">${oggi()}</div>
        ${tot.n ? '' : `<ol class="metodo">
          <li><b>${t('Leggi la lezione', 'Read the lesson')}</b><span>${t('La scena da colloquio, perché il trucco funziona, come farlo a mente.', 'The interview scene, why the trick works, how to do it in your head.')}</span></li>
          <li><b>${t('Allenati con i suggerimenti', 'Practise with hints')}</b><span>${t('Dieci domande dal livello base a quello più difficile; il primo suggerimento indica la strada, il secondo fa il primo passo.', 'Ten questions from the basic level to the hardest; the first hint points the way, the second takes the first step.')}</span></li>
          <li><b>${t('Segnalo come imparato', 'Mark it as learnt')}</b><span>${t('Torna nel ripasso dopo 1, 3, 7, 14 e 30 giorni, e prima se sbagli.', 'It comes back in review after 1, 3, 7, 14 and 30 days, and sooner if you slip.')}</span></li>
          <li><b>${t('Mescola e metti il tempo', 'Mix and add the clock')}</b><span>${t('Allenamento misto, dove il trucco lo scopri dopo, e test a tempo come nelle selezioni.', 'Mixed practice, where you find out the trick afterwards, and timed tests as in recruitment.')}</span></li>
        </ol>`}
      </section>
      <section class="blocco">
        <div class="blocco-testa"><span class="kicker">${t('Programma', 'Programme')}</span><h2>${t('Tutti i trucchi', 'Every trick')}</h2>
          <p class="mini">${t('I tre puntini sono i livelli: pieno quando sei sopra l\'80% nelle ultime dieci risposte.', 'The three dots are the levels: filled once you are above 80% in the last ten answers.')} <a href="#/schede">${t('Tutte le schede in una pagina →', 'Every summary on one page →')}</a></p></div>`;
    for (const m of P.materie) {
      const lista = P.trucchiDi(m.id);
      if (!lista.length) continue;
      const fatti = lista.filter(x => P.dati.imparati[x.id]).length;
      h += `<section class="materia" id="materia-${m.id}"><div class="materia-testa"><div><h3>${esc(tr(m.titolo))}</h3><p>${esc(tr(m.descrizione))}</p></div>
        <div class="materia-stato"><span class="mini">${fatti}/${lista.length} ${t('imparati', 'learnt')}</span>${barra(fatti / lista.length)}</div></div>`;
      for (const c of m.capitoli) {
        const tc = P.trucchiDi(m.id, c.id);
        if (tc.length) h += `${m.capitoli.length > 1 ? `<h4 class="capitolo">${esc(tr(c.titolo))}</h4>` : ''}<ul class="trucchi">${tc.map(rigaTrucco).join('')}</ul>`;
      }
      h += '</section>';
    }
    h += '</section>';
    vista.innerHTML = h;
    vista.querySelectorAll('[data-allena]').forEach(b => { b.onclick = () => allenaTrucco(P.trovaTrucco(b.dataset.allena)); });
  }

  function rigaTrucco(trucco) {
    const st = P.statistiche(P.risposteDi(trucco.id)), dal = P.dati.imparati[trucco.id];
    return `<li><a href="#/trucco/${trucco.id}">
      <span class="numero">${String(trucco.numero).padStart(2, '0')}</span>
      <span class="corpo"><span class="titolo">${esc(tr(trucco.titolo))}</span><span class="sotto">${esc(tr(trucco.sottotitolo))}</span></span>
      <span class="lato">${puntini(trucco.id)}${dal ? `<span class="stato fatto">${t('imparato', 'learnt')} ${P.dataBreve(dal)}</span>` : st.n ? `<span class="stato">${perc(st.precisione)} · ${st.n}</span>` : `<span class="stato">${t('da fare', 'to do')}</span>`}</span>
    </a></li>`;
  }

  // ---------- lezione ----------

  function lezione(id) {
    const trucco = P.trovaTrucco(id);
    if (!trucco) return home();
    const m = P.trovaMateria(trucco.materia), c = P.trovaCapitolo(trucco.materia, trucco.capitolo);
    const lista = P.trucchiDi(trucco.materia), i = lista.indexOf(trucco), prec = lista[i - 1], succ = lista[i + 1];
    const dal = P.dati.imparati[trucco.id], st = P.statistiche(P.risposteDi(trucco.id));
    const bottoni = `<div class="azioni-lezione">
        <button class="primario" data-azione="allena">${t('Allenati su questo trucco', 'Practise this trick')}</button>
        <button data-azione="imparato">${dal ? t(`Imparato il ${P.dataBreve(dal)} · togli`, `Learnt on ${P.dataBreve(dal)} · undo`) : t('Segna come imparato', 'Mark as learnt')}</button>
      </div>`;
    const livelli = statoLivelli(trucco.id), nomiStato = [t('meno di 3 risposte', 'fewer than 3 answers'), t('in allenamento', 'practising'), t('solido', 'solid')];
    const lab = P.laboratori && P.laboratori[trucco.id];
    vista.innerHTML = `<article class="lezione">
      <p class="briciole"><a href="#/">${esc(tr(m.titolo))}</a> › ${esc(tr(c.titolo))}</p>
      <h1><span class="sopratitolo">${t('Trucco', 'Trick')} ${trucco.numero}</span>${esc(tr(trucco.titolo))}</h1>
      <p class="sottotitolo-lezione">${esc(tr(trucco.sottotitolo))}</p>
      <div class="aggancio"><span class="etichetta">${t('La domanda', 'The question')}</span><p>${esc(tr(trucco.aggancio))}</p></div>
      ${bottoni}
      ${st.n ? `<div class="andamento">
        <p class="mini">${t(`Finora ${st.n} risposte, ${perc(st.precisione)} giuste, ${sec(st.secondi)} a risposta, suggerimento aperto nel ${perc(st.aiuti)} dei casi.`,
          `So far ${st.n} answers, ${perc(st.precisione)} right, ${sec(st.secondi)} per answer, hint opened ${perc(st.aiuti)} of the time.`)}</p>
        <ul class="livelli-stato">${livelli.map((s, k) => `<li class="s${s}"><i></i>L${k + 1} · ${esc(nomeLivello(trucco, k))}<span>${nomiStato[s]}</span></li>`).join('')}</ul>
      </div>` : ''}
      <div class="testo-lezione">${tr(trucco.lezione)}</div>
      ${lab ? '<section class="lab" id="lab"></section>' : ''}
      <div class="scheda"><span class="etichetta">${t('In breve', 'In short')}</span><p>${esc(tr(trucco.scheda))}</p></div>
      ${bottoni}
      <nav class="vicini">${prec ? `<a href="#/trucco/${prec.id}"><span class="mini">← ${t('Precedente', 'Previous')}</span>${esc(tr(prec.titolo))}</a>` : '<span></span>'}${succ ? `<a class="dopo" href="#/trucco/${succ.id}"><span class="mini">${t('Successivo', 'Next')} →</span>${esc(tr(succ.titolo))}</a>` : ''}</nav>
    </article>`;
    if (lab) lab(document.getElementById('lab'));
    vista.querySelectorAll('[data-azione="allena"]').forEach(b => { b.onclick = () => allenaTrucco(trucco); });
    vista.querySelectorAll('[data-azione="imparato"]').forEach(b => {
      b.onclick = () => {
        P.segnaImparato(trucco.id, !P.dati.imparati[trucco.id]);
        lezione(id); aggiornaConta();
      };
    });
  }

  function allenaTrucco(trucco) {
    const livelli = [0, 0, 0, 1, 1, 1, 1, 2, 2, 2];
    avvia({
      modalita: 'lezione', titolo: nomeTrucco(trucco), totale: livelli.length,
      aiuti: true, subito: true, trucco, ritorno: `#/trucco/${trucco.id}`,
      prossima: i => ({ trucco, livello: livelli[i] }),
    });
  }

  // ---------- sessione: motore ----------

  function avvia(cfg) {
    fermaTimer();
    S = Object.assign({ id: nuovoId(cfg.modalita), voci: [], inizio: Date.now(), fine: false, cfg }, cfg);
    if (S.limite) { S.scade = Date.now() + S.limite * 1000; timer = setInterval(tic, 250); }
    prossimaDomanda();
    if (location.hash === '#/sessione') vai(); else location.hash = '#/sessione';
  }

  function nuovoId(modalita) {
    const d = new Date();
    return `${P.oggi(d).replace(/-/g, '')}-${P.ora(d).replace(/:/g, '')}-${modalita}`;
  }

  const corrente = () => S && S.voci[S.voci.length - 1];
  const genera = s => (s.trucco ? s.trucco.livelli[s.livello]() : s.base.fn());

  function prossimaDomanda() {
    const recenti = new Set(S.voci.slice(-15).map(v => v.q.testo));
    let scelta, q, tentativi = 0;
    do { scelta = S.prossima(S.voci.length); q = genera(scelta); tentativi++; } while (recenti.has(q.testo) && tentativi < 8);
    S.voci.push(Object.assign({}, scelta, { q, t0: Date.now(), aiuti: 0, esito: null, risposta: '', secondi: null }));
  }

  function rispondi(raw) {
    const v = corrente();
    if (!v || v.esito || S.fine) return;
    const r = v.q.risposta;
    if (r.tipo === 'scelta') return chiudi(v, r.opzioni[raw], P.verifica(r, raw).ok ? 'giusta' : 'sbagliata');
    if (!String(raw).trim()) {
      if (!S.subito) chiudi(v, '', 'saltata'); // nel test Invio a vuoto salta
      return;
    }
    const ver = P.verifica(r, raw);
    if (!ver.valido) {
      return avviso(t('Non riesco a leggerla come numero. Vanno bene 0.375 · 3/8 · 99-17 · 25000 · 25k · −4%.', 'I can\'t read that as a number. These work: 0.375 · 3/8 · 99-17 · 25000 · 25k · −4%.'));
    }
    chiudi(v, raw, ver.ok ? 'giusta' : 'sbagliata');
  }

  function chiudi(v, scritto, esito) {
    v.esito = esito; v.risposta = scritto; v.secondi = (Date.now() - v.t0) / 1000;
    const trucco = v.trucco, d = new Date();
    P.registra({
      sessione: S.id, data: P.oggi(d), ora: P.ora(d), modalita: S.modalita, n: S.voci.length,
      materia: trucco ? trucco.materia : 'calcolo', capitolo: trucco ? trucco.capitolo : v.base.blocco, trucco: trucco ? trucco.id : 'base',
      livello: trucco ? v.livello + 1 : '', domanda: piano(v.q.testo), risposta: scritto,
      corretta: P.mostraRisposta(v.q.risposta), esito, secondi: Math.round(v.secondi * 10) / 10, suggerimenti: v.aiuti,
    });
    if (S.subito) mostraDomanda(); else avanti();
  }

  function avanti() {
    if (!S || S.fine) return;
    if (S.totale && S.voci.length >= S.totale) return termina();
    prossimaDomanda();
    mostraDomanda();
  }

  function aiuto() {
    const v = corrente();
    if (!v || v.esito || !S.aiuti) return;
    const tutti = v.q.suggerimenti || [];
    if (v.aiuti >= tutti.length) return;
    v.aiuti++;
    const ol = document.getElementById('suggerimenti');
    if (ol) ol.innerHTML = suggerimentiHtml(v);
    const b = vista.querySelector('[data-azione="aiuto"]');
    if (b) aggiornaBottoneAiuto(b, v);
    const campo = document.getElementById('campo');
    if (campo) campo.focus();
  }

  function termina() {
    if (!S || S.fine) return;
    S.fine = true;
    fermaTimer();
    if (S.voci.length && !S.voci[S.voci.length - 1].esito) S.voci.pop();
    const n = S.voci.length;
    const conta = e => S.voci.filter(v => v.esito === e).length;
    const giuste = conta('giusta'), sbagliate = conta('sbagliata'), saltate = conta('saltata');
    S.riepilogo = {
      n, giuste, sbagliate, saltate,
      punteggio: giuste - (S.penalita || 0) * sbagliate,
      media: n ? S.voci.reduce((s, v) => s + v.secondi, 0) / n : 0,
      aiuti: S.voci.reduce((s, v) => s + v.aiuti, 0),
      durata: Math.round((Date.now() - S.inizio) / 1000),
    };
    if (n) {
      P.aggiungiSessione({ id: S.id, data: P.oggi(), modalita: S.modalita, titolo: S.titolo, domande: n, giuste, sbagliate, saltate, punteggio: S.riepilogo.punteggio, secondi: S.riepilogo.durata });
    }
    if (location.hash === '#/sessione') sessione();
  }

  function tic() {
    if (!S || S.fine) return fermaTimer();
    const resto = Math.max(0, S.scade - Date.now()), el = document.getElementById('tempo');
    if (el) { el.textContent = mmss(resto); el.classList.toggle('poco', resto < 30000); }
    if (resto <= 0) termina();
  }

  function fermaTimer() { if (timer) { clearInterval(timer); timer = null; } }

  // ---------- sessione: schermo ----------

  function sessione() {
    if (!S) {
      vista.innerHTML = `<section class="config"><h1>${t('Nessuna sessione in corso', 'No session in progress')}</h1><p>${t(
        '<a href="#/">Torna al programma</a> e scegli un trucco, oppure parti da <a href="#/allenamento">Allenamento</a>.',
        'Go back to the <a href="#/">programme</a> and pick a trick, or start from <a href="#/allenamento">Practice</a>.')}</p></section>`;
      return;
    }
    if (S.fine) return riepilogo();
    mostraDomanda();
  }

  function suggerimentiHtml(v) {
    return (v.q.suggerimenti || []).slice(0, v.aiuti).map(s => `<li>${esc(s)}</li>`).join('');
  }

  function aggiornaBottoneAiuto(b, v) {
    const tot = (v.q.suggerimenti || []).length;
    b.disabled = v.aiuti >= tot;
    b.innerHTML = (v.aiuti === 0 ? t('Suggerimento', 'Hint') : v.aiuti < tot ? t('Un altro suggerimento', 'Another hint') : t('Niente altro', 'No more hints')) + ' <kbd>?</kbd>';
  }

  function mostraDomanda() {
    const v = corrente(), q = v.q, r = q.risposta, i = S.voci.length, fatto = !!v.esito, scelta = r.tipo === 'scelta';
    const trucco = v.trucco, ultima = S.totale && i >= S.totale;
    const etichetta = trucco ? `L${v.livello + 1} · ${nomeLivello(trucco, v.livello)}` : t('Calcolo di base', 'Basic arithmetic');
    // nelle sessioni miste il trucco si scopre dopo la risposta, come al colloquio
    const origine = trucco && fatto && S.modalita !== 'lezione' ? `<a class="origine" href="#/trucco/${trucco.id}">${esc(tr(nomeTrucco(trucco)))}</a>` : '';
    const avanzamento = S.totale ? (i - (fatto ? 0 : 1)) / S.totale : 0;

    const campo = `<form class="risposta" id="form" autocomplete="off">
        <input id="campo" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false"
          aria-label="${t('Risposta', 'Answer')}" placeholder="${fatto ? '' : t('la tua risposta', 'your answer')}" value="${esc(v.risposta)}" ${fatto ? 'disabled' : ''}>
        ${r.unita ? `<span class="unita">${esc(r.unita)}</span>` : ''}
        ${fatto ? '' : `<button class="primario" type="submit">${t('Rispondi', 'Answer')}</button>`}
      </form>`;
    const scelte = `<div class="scelte">${(r.opzioni || []).map((o, k) => {
      const cls = fatto ? (k === r.giusta ? 'giusta' : o === v.risposta ? 'sbagliata' : '') : '';
      return `<button class="opzione ${cls}" data-k="${k}" ${fatto ? 'disabled' : ''}><span class="lettera">${'ABCDEF'[k]}</span>${esc(o)}</button>`;
    }).join('')}</div>`;

    const verdetto = { giusta: t('✓ Giusto', '✓ Right'), sbagliata: t('✗ Non è giusto', '✗ Not right'), saltata: t('Saltata', 'Skipped') }[v.esito];
    const nAiuti = v.aiuti ? ` · ${v.aiuti} ${v.aiuti === 1 ? t('suggerimento', 'hint') : t('suggerimenti', 'hints')}` : '';
    const esitoHtml = fatto ? `<div class="esito">
        <p class="verdetto">${verdetto}<span class="mini"> · ${sec(v.secondi)}${nAiuti}</span></p>
        ${v.esito !== 'giusta' ? `<p class="giusta">${t('La risposta è', 'The answer is')} <b>${esc(P.mostraRisposta(r))}</b>${r.unita ? ' ' + esc(r.unita) : ''}</p>` : ''}
        <ol class="passi">${(q.soluzione || []).map(s => `<li>${esc(s)}</li>`).join('')}</ol>
        <button class="primario" id="avanti">${ultima ? t('Vedi il riepilogo', 'See the summary') : t('Avanti', 'Next')} <kbd>${t('Invio', 'Enter')}</kbd></button>
      </div>` : '';

    const tasti = fatto ? t('Invio: avanti', 'Enter: next')
      : scelta ? t('Tasti 1–4 o A–D', 'Keys 1–4 or A–D')
        : S.subito ? t('Invio: rispondi · ?: suggerimento', 'Enter: answer · ?: hint')
          : t('Invio: rispondi · Invio a vuoto: salta', 'Enter: answer · empty Enter: skip');

    vista.innerHTML = `<section class="sessione">
      <div class="barra">
        <span class="titolo-sessione">${esc(tr(S.titolo))}</span>
        <span class="meta">${S.totale ? `${i} / ${S.totale}` : `${t('domanda', 'question')} ${i}`}${S.subito ? `<span class="chip">${esc(etichetta)}</span>` : ''}${S.limite ? '<span class="tempo" id="tempo"></span>' : ''}</span>
      </div>
      ${S.totale ? `<div class="progresso"><div id="avanzamento"></div></div>` : ''}
      <article class="domanda ${fatto ? 'chiusa ' + v.esito : ''}${fatto && !v.visto ? ' appena' : ''}">
        ${origine}
        <p class="testo">${q.testo}</p>
        ${q.nota ? `<p class="nota">${esc(q.nota)}</p>` : ''}
        ${scelta ? scelte : campo}
        <p class="avviso" id="avviso" role="status"></p>
        ${S.aiuti && !fatto ? `<div class="aiuti"><button data-azione="aiuto"></button><button data-azione="salta">${t('Non lo so', 'I don\'t know')}</button></div>` : ''}
        <ol class="suggerimenti" id="suggerimenti">${suggerimentiHtml(v)}</ol>
        ${esitoHtml}
      </article>
      <div class="piede-sessione">
        <span class="tasti">${tasti}</span>
        <button class="link" data-azione="termina">${t('Chiudi la sessione', 'End the session')}</button>
      </div>
    </section>`;

    if (fatto) v.visto = true; // the verdict animates once, not on every redraw
    const avanz = document.getElementById('avanzamento');
    if (avanz) avanz.style.width = `${avanzamento * 100}%`;
    const form = document.getElementById('form');
    if (form) form.onsubmit = e => { e.preventDefault(); rispondi(document.getElementById('campo').value); };
    vista.querySelectorAll('.opzione').forEach(b => { b.onclick = () => rispondi(+b.dataset.k); });
    const bAiuto = vista.querySelector('[data-azione="aiuto"]');
    if (bAiuto) { aggiornaBottoneAiuto(bAiuto, v); bAiuto.onclick = aiuto; }
    const bSalta = vista.querySelector('[data-azione="salta"]');
    if (bSalta) bSalta.onclick = () => chiudi(v, '', 'saltata');
    vista.querySelector('[data-azione="termina"]').onclick = termina;
    const bAvanti = document.getElementById('avanti');
    if (bAvanti) { bAvanti.onclick = avanti; bAvanti.focus(); }
    else if (!scelta) document.getElementById('campo').focus();
    if (S.limite) tic();
  }

  function avviso(testo) {
    const el = document.getElementById('avviso');
    if (el) el.textContent = testo;
  }

  document.addEventListener('keydown', e => {
    if (!S || S.fine || location.hash !== '#/sessione' || e.metaKey || e.ctrlKey || e.altKey) return;
    const v = corrente();
    if (!v) return;
    if (e.key === '?') { e.preventDefault(); aiuto(); return; }
    if (v.esito) {
      if (e.key === 'Enter' && document.activeElement && document.activeElement.id !== 'avanti') { e.preventDefault(); avanti(); }
      return;
    }
    if (v.q.risposta.tipo === 'scelta') {
      let k = '123456'.indexOf(e.key);
      if (k < 0) k = 'abcdef'.indexOf(e.key.toLowerCase());
      if (k >= 0 && k < v.q.risposta.opzioni.length) { e.preventDefault(); rispondi(k); }
    }
  });

  // ---------- riepilogo ----------

  function riepilogo() {
    const R = S.riepilogo;
    if (!R.n) {
      vista.innerHTML = `<section class="config"><h1>${t('Sessione chiusa', 'Session ended')}</h1><p>${t('Nessuna risposta data.', 'No answers given.')}</p><p><a class="bottone" href="${S.ritorno || '#/'}">${t('Torna indietro', 'Go back')}</a></p></section>`;
      return;
    }
    const perTrucco = {};
    for (const v of S.voci) {
      const k = v.trucco ? v.trucco.id : 'base:' + v.base.blocco;
      perTrucco[k] = perTrucco[k] || { nome: v.trucco ? `${v.trucco.numero} · ${tr(v.trucco.titolo)}` : `${t('Calcolo di base', 'Basic arithmetic')} · ${tr(v.base.nome)}`, n: 0, giuste: 0 };
      perTrucco[k].n++;
      if (v.esito === 'giusta') perTrucco[k].giuste++;
    }
    const gruppi = Object.values(perTrucco);
    const segno = { giusta: '✓', sbagliata: '✗', saltata: '–' };
    const voce = v => {
      const giusta = P.mostraRisposta(v.q.risposta);
      const risp = v.esito === 'giusta' ? esc(v.risposta) : `${v.risposta ? `<s>${esc(v.risposta)}</s> ` : ''}${esc(giusta)}`;
      return `<li class="${v.esito}"><details><summary>
        <span class="segno">${segno[v.esito]}</span><span class="q">${esc(piano(v.q.testo))}</span><span class="r">${risp}</span><span class="s">${sec(v.secondi)}${v.aiuti ? ' · ' + v.aiuti + ' ' + t('sugg.', 'hints') : ''}</span>
      </summary><ol class="passi">${(v.q.soluzione || []).map(s => `<li>${esc(s)}</li>`).join('')}</ol></details></li>`;
    };
    vista.innerHTML = `<section class="riepilogo">
      <p class="briciole">${esc(tr(S.titolo))}</p>
      <h1>${t(`${R.giuste} su ${R.n}`, `${R.giuste} out of ${R.n}`)}</h1>
      <div class="numeri">
        <div><b>${perc(R.giuste / R.n)}</b><span>${t('giuste', 'right')}</span></div>
        <div><b>${sec(R.media)}</b><span>${t('a risposta', 'per answer')}</span></div>
        ${S.limite
          ? `<div><b>${R.punteggio}</b><span>${t('punteggio', 'score')}${S.penalita ? t(`, −${S.penalita} per errore`, `, −${S.penalita} per mistake`) : ''}</span></div>`
          : `<div><b>${R.aiuti}</b><span>${t('suggerimenti aperti', 'hints opened')}</span></div>`}
        ${S.limite ? `<div><b>${R.saltate}</b><span>${t('saltate', 'skipped')}</span></div>` : ''}
      </div>
      ${S.modalita === 'test' ? graficoTest(S.titolo) : ''}
      ${gruppi.length > 1 ? `<table class="tabella"><thead><tr><th>${t('Trucco', 'Trick')}</th><th>${t('Giuste', 'Right')}</th></tr></thead><tbody>${gruppi.sort((a, b) => a.giuste / a.n - b.giuste / b.n).map(g => `<tr><td>${esc(g.nome)}</td><td>${g.giuste}/${g.n}</td></tr>`).join('')}</tbody></table>` : ''}
      <h2>${t('Le domande', 'The questions')}</h2>
      <p class="mini">${t('Apri una riga per vedere i passi.', 'Open a row to see the steps.')}</p>
      <ol class="rivedi">${S.voci.map(voce).join('')}</ol>
      <div class="azioni-lezione">
        <button class="primario" data-azione="ancora">${t('Ancora', 'Again')}</button>
        ${S.trucco && !P.dati.imparati[S.trucco.id] ? `<button data-azione="impara">${t('Segna il trucco come imparato', 'Mark the trick as learnt')}</button>` : ''}
        <a class="bottone" href="${S.ritorno || '#/'}">${S.trucco ? t('Torna alla lezione', 'Back to the lesson') : t('Torna indietro', 'Go back')}</a>
      </div>
    </section>`;
    vista.querySelector('[data-azione="ancora"]').onclick = () => avvia(S.cfg);
    const bImpara = vista.querySelector('[data-azione="impara"]');
    if (bImpara) bImpara.onclick = () => { P.segnaImparato(S.trucco.id, true); bImpara.remove(); aggiornaConta(); };
  }

  // Scores of the timed tests taken with the same length and scoring, so progress is visible
  function graficoTest(titolo) {
    const simili = P.dati.sessioni.filter(s => s.modalita === 'test' && s.titolo && s.titolo.en === titolo.en).slice(-20);
    if (simili.length < 2) return '';
    const punti = simili.map(s => ({ y: s.punteggio, etichetta: `${P.dataBreve(s.data)}: ${s.punteggio}` }));
    const best = Math.max(...punti.map(p => p.y)), ultimi = simili.slice(-5);
    const media = ultimi.reduce((a, s) => a + s.punteggio, 0) / ultimi.length;
    return `<div class="carta-grafico"><span class="etichetta">${esc(tr(titolo))} · ${t('i tuoi punteggi', 'your scores')}</span>${P.grafici.punteggi(punti)}
      <p class="mini">${t(`Migliore: ${best} · media delle ultime ${ultimi.length}: ${P.fmt(media, 1)} · ${simili.length} test`, `Best: ${best} · average of the last ${ultimi.length}: ${P.fmt(media, 1)} · ${simili.length} tests`)}</p></div>`;
  }

  // ---------- allenamento a caso ----------

  function sceltaTrucchi(selezionati) {
    return P.materie.filter(m => P.trucchiDi(m.id).length).map(m => `
      <fieldset class="gruppo">
        <legend>${esc(tr(m.titolo))} <button type="button" class="link" data-tutti="${m.id}">${t('tutti', 'all')}</button> <button type="button" class="link" data-nessuno="${m.id}">${t('nessuno', 'none')}</button></legend>
        ${P.trucchiDi(m.id).map(x => `<label class="spunta"><input type="checkbox" name="trucco" value="${x.id}" data-materia="${m.id}" ${selezionati.has(x.id) ? 'checked' : ''}><span>${x.numero} · ${esc(tr(x.titolo))}</span></label>`).join('')}
      </fieldset>`).join('');
  }

  function collegaGruppi(form) {
    form.querySelectorAll('[data-tutti]').forEach(b => { b.onclick = () => form.querySelectorAll(`input[data-materia="${b.dataset.tutti}"]`).forEach(c => { c.checked = true; }); });
    form.querySelectorAll('[data-nessuno]').forEach(b => { b.onclick = () => form.querySelectorAll(`input[data-materia="${b.dataset.nessuno}"]`).forEach(c => { c.checked = false; }); });
  }

  function confAllenamento() {
    const imparati = Object.keys(P.dati.imparati);
    const sel = new Set(imparati.length ? imparati : P.trucchi.map(x => x.id));
    vista.innerHTML = `<section class="config">
      <h1>${t('Allenamento', 'Practice')}</h1>
      <p>${t('Domande a caso dai trucchi che scegli, con i suggerimenti. Il trucco da usare lo scopri solo dopo aver risposto, come al colloquio.',
        'Random questions from the tricks you choose, with hints. You only find out which trick to use after answering, as in an interview.')}
      ${imparati.length ? t('Sono selezionati quelli che hai segnato come imparati.', 'The ones you marked as learnt are selected.')
        : t('Non hai ancora segnato trucchi come imparati, quindi sono selezionati tutti.', 'You haven\'t marked any trick as learnt yet, so they are all selected.')}</p>
      <form id="conf">
        ${sceltaTrucchi(sel)}
        <fieldset class="gruppo riga"><legend>${t('Livelli', 'Levels')}</legend>
          ${tr(LIVELLI).map((l, k) => `<label class="pillola"><input type="checkbox" name="livello" value="${k}" checked><span>L${k + 1} · ${l}</span></label>`).join('')}
        </fieldset>
        <fieldset class="gruppo riga"><legend>${t('Quante domande', 'How many questions')}</legend>
          ${[10, 20, 40, 0].map(n => `<label class="pillola"><input type="radio" name="quante" value="${n}" ${n === 20 ? 'checked' : ''}><span>${n || t('senza fine', 'no limit')}</span></label>`).join('')}
        </fieldset>
        <p class="avviso" id="avviso"></p>
        <button class="primario" type="submit">${t('Inizia', 'Start')}</button>
      </form>
    </section>`;
    const form = document.getElementById('conf');
    collegaGruppi(form);
    form.onsubmit = e => {
      e.preventDefault();
      const trucchi = [...form.querySelectorAll('input[name="trucco"]:checked')].map(c => P.trovaTrucco(c.value));
      const livelli = [...form.querySelectorAll('input[name="livello"]:checked')].map(c => +c.value);
      const quante = +form.querySelector('input[name="quante"]:checked').value;
      if (!trucchi.length || !livelli.length) return avviso(t('Scegli almeno un trucco e un livello.', 'Pick at least one trick and one level.'));
      const pesi = [0.35, 0.4, 0.25];
      avvia({
        modalita: 'casuale', titolo: due('Allenamento', 'Practice'), totale: quante, aiuti: true, subito: true, ritorno: '#/allenamento',
        prossima: () => ({ trucco: P.pick(trucchi), livello: P.pesato(livelli.map(l => [pesi[l], l])) }),
      });
    };
  }

  // ---------- ripasso ----------

  function confRipasso() {
    const lista = P.ripassi();
    if (!lista.length) {
      vista.innerHTML = `<section class="config">
        <h1>${t('Ripasso', 'Review')}</h1>
        <p>${Object.keys(P.dati.imparati).length
          ? t('Niente in scadenza oggi. Un trucco torna 1, 3, 7, 14 e 30 giorni dopo la data in cui l\'hai segnato come imparato, e torna prima se nelle ultime risposte sei sotto l\'80%.',
            'Nothing due today. A trick comes back 1, 3, 7, 14 and 30 days after the date you marked it as learnt, and sooner if your recent answers are below 80%.')
          : t('Il ripasso parte dai trucchi che segni come imparati: apri un trucco dal programma e, quando ti senti sicuro, premi «Segna come imparato».',
            'Review starts from the tricks you mark as learnt: open a trick from the programme and, when you feel confident, press "Mark as learnt".')}</p>
        <p><a class="bottone" href="#/allenamento">${t('Vai all\'allenamento', 'Go to practice')}</a></p>
      </section>`;
      return;
    }
    vista.innerHTML = `<section class="config">
      <h1>${t('Ripasso di oggi', 'Today\'s review')}</h1>
      <p>${t('Dodici domande mescolate fra questi trucchi, con i suggerimenti.', 'Twelve questions mixed across these tricks, with hints.')}</p>
      <ul class="lista-ripasso">${lista.map(x => `<li><a href="#/trucco/${x.trucco.id}">${x.trucco.numero} · ${esc(tr(x.trucco.titolo))}</a><span class="mini">${esc(x.motivi.join(' · '))}</span></li>`).join('')}</ul>
      <button class="primario" id="inizia">${t('Inizia il ripasso', 'Start the review')}</button>
    </section>`;
    document.getElementById('inizia').onclick = () => avvia({
      modalita: 'ripasso', titolo: due('Ripasso', 'Review'), totale: 12, aiuti: true, subito: true, ritorno: '#/ripasso',
      prossima: () => ({ trucco: P.pesato(lista.map(x => [x.motivi.length, x.trucco])), livello: P.pesato([[0.3, 0], [0.4, 1], [0.3, 2]]) }),
    });
  }

  // ---------- test a tempo ----------

  // Ten questions a minute: the test ends when time runs out or when every question is done.
  const DURATE = [2, 5, 8, 10, 15];
  const AL_MINUTO = 10;

  function confTest() {
    const daTest = P.trucchi.filter(x => x.test);
    const imparati = daTest.filter(x => P.dati.imparati[x.id]);
    vista.innerHTML = `<section class="config">
      <h1>${t('Test a tempo', 'Timed test')}</h1>
      <p>${t(`Come a un test vero: niente suggerimenti e niente correzione fino alla fine. ${AL_MINUTO} domande al minuto; Invio a vuoto salta la domanda e, con la penalità, saltare costa meno che sbagliare.`,
        `As in a real test: no hints and no marking until the end. ${AL_MINUTO} questions a minute; an empty Enter skips the question and, with the penalty, skipping costs less than getting it wrong.`)}</p>
      <form id="conf">
        <fieldset class="gruppo riga"><legend>${t('Durata', 'Length')}</legend>
          ${DURATE.map(m => `<label class="pillola"><input type="radio" name="minuti" value="${m}" ${m === 5 ? 'checked' : ''}><span>${m} min</span></label>`).join('')}
        </fieldset>
        <fieldset class="gruppo"><legend>${t('Punteggio', 'Scoring')}</legend>
          <label class="spunta larga"><input type="radio" name="penalita" value="0" checked><span><b>${t('Senza penalità', 'No penalty')}</b> · ${t('+1 se giusta, 0 se sbagliata o saltata', '+1 if right, 0 if wrong or skipped')}</span></label>
          <label class="spunta larga"><input type="radio" name="penalita" value="1"><span><b>${t('Con penalità', 'With penalty')}</b> · ${t('+1 se giusta, −1 se sbagliata, 0 se saltata', '+1 if right, −1 if wrong, 0 if skipped')}</span></label>
        </fieldset>
        <fieldset class="gruppo"><legend>${t('Domande', 'Questions')}</legend>
          <label class="spunta larga"><input type="radio" name="fonte" value="base" ${imparati.length ? '' : 'checked'}><span>${t('Solo calcolo di base (somme, prodotti, divisioni, percentuali, frazioni)', 'Basic arithmetic only (sums, products, divisions, percentages, fractions)')}</span></label>
          <label class="spunta larga"><input type="radio" name="fonte" value="imparati" ${imparati.length ? 'checked' : 'disabled'}><span>${t('Calcolo di base e i trucchi di calcolo che hai imparato', 'Basic arithmetic and the mental maths tricks you have learnt')}${imparati.length ? ` (${imparati.length})` : t(' (ancora nessuno)', ' (none yet)')}</span></label>
          <label class="spunta larga"><input type="radio" name="fonte" value="tutti"><span>${t('Calcolo di base e tutti i trucchi di calcolo', 'Basic arithmetic and all the mental maths tricks')}</span></label>
        </fieldset>
        <button class="primario" type="submit">${t('Inizia il test', 'Start the test')}</button>
      </form>
    </section>`;
    const form = document.getElementById('conf');
    form.onsubmit = e => {
      e.preventDefault();
      const scelto = Number(form.querySelector('input[name="minuti"]:checked').value);
      const minuti = DURATE.includes(scelto) ? scelto : 5;
      const pen = form.querySelector('input[name="penalita"]:checked').value === '1' ? 1 : 0;
      const fonte = form.querySelector('input[name="fonte"]:checked').value;
      const trucchi = fonte === 'base' ? [] : fonte === 'imparati' ? imparati : daTest;
      const pesoBase = P.base.map(b => [b.peso, b]);
      avvia({
        modalita: 'test', titolo: due(`Test di ${minuti} minuti${pen ? ' con penalità' : ''}`, `${minuti}-minute test${pen ? ' with penalty' : ''}`),
        totale: minuti * AL_MINUTO, limite: minuti * 60, penalita: pen,
        aiuti: false, subito: false, ritorno: '#/test',
        prossima: () => (trucchi.length && P.chance(0.4) ? { trucco: P.pick(trucchi), livello: 0 } : { base: P.pesato(pesoBase) }),
      });
    };
  }

  // ---------- su tutti i dispositivi (compare solo se config.js è compilato, vedi js/nuvola.js) ----------

  // When the database cannot be reached while the device is online, the likeliest cause is a free Supabase
  // project paused after a week without use: point to the project's dashboard page, where it is restored.
  const online = () => typeof navigator === 'undefined' || navigator.onLine !== false;
  const avvisoPausa = (nascosto = false) => P.nuvola.pannello
    ? `<p class="mini pausa" id="avviso-pausa"${nascosto ? ' hidden' : ''}>${t('Se non usi la palestra da più di una settimana, Supabase potrebbe aver messo in pausa il database:', 'If the app has not been used for over a week, Supabase may have paused the database:')}
        <a href="${esc(P.nuvola.pannello)}" target="_blank" rel="noopener noreferrer">${t('riattivalo da Supabase', 'restore it from Supabase')}</a>
        ${t('(«Restore project») e riprova dopo qualche minuto.', '("Restore project") and try again in a few minutes.')}</p>`
    : '';

  function sezioneNuvola() {
    const N = P.nuvola;
    if (!ownerDevice()) return '';
    let corpo;
    if (N.stato === 'dentro') {
      const inAttesa = P.dati.risposte.filter(r => !r.su).length;
      const alle = N.ultima ? P.ora(new Date(N.ultima)).slice(0, 5) : '';
      corpo = `<p>${t(`Collegato come ${esc(N.email)}: risposte, sessioni e trucchi imparati sono gli stessi su tutti i dispositivi dove accedi.`,
          `Signed in as ${esc(N.email)}: answers, sessions and learnt tricks are the same on every device where you sign in.`)}</p>
        <p class="mini">${N.errore ? `<span class="errore">${esc(N.errore)}</span> · ` : ''}${alle
          ? t(`Ultima sincronizzazione alle ${alle}.`, `Last synced at ${alle}.`) : t('Sincronizzazione in corso…', 'Syncing…')}${inAttesa
          ? ' ' + t(inAttesa === 1 ? 'Una risposta in attesa di salire.' : `${inAttesa} risposte in attesa di salire.`, inAttesa === 1 ? 'One answer waiting to upload.' : `${inAttesa} answers waiting to upload.`) : ''}</p>
        ${N.errore && N.irraggiungibile && online() ? avvisoPausa() : ''}
        <div class="azioni-lezione">
          <button data-azione="sincronizza">${t('Sincronizza ora', 'Sync now')}</button>
          <button data-azione="esci">${t('Esci da questo dispositivo', 'Sign out on this device')}</button>
        </div>`;
    } else if (N.stato === 'fuori') {
      corpo = `<p>${t('Accedi per avere risposte, sessioni e trucchi imparati su tutti i tuoi dispositivi. Senza accesso restano in questo browser.',
          'Sign in to have answers, sessions and learnt tricks on all your devices. Without signing in they stay in this browser.')}</p>
        <form id="accesso" class="accesso">
          <label>Email<input type="email" name="email" autocomplete="username" required></label>
          <label>Password<input type="password" name="password" autocomplete="current-password" required></label>
          <p class="avviso" id="avviso-accesso"></p>
          ${avvisoPausa(true)}
          <div><button class="primario" type="submit">${t('Accedi', 'Sign in')}</button></div>
        </form>`;
    } else if (N.stato === 'errore') {
      corpo = `<p>${t('Database non raggiungibile', 'Database unreachable')}: ${esc(N.errore)}. ${t('La palestra continua a salvare in questo browser.', 'The app keeps saving in this browser.')}</p>`;
    } else {
      corpo = `<p class="mini">${t('Collegamento al database…', 'Connecting to the database…')}</p>`;
    }
    return `<section class="nuvola"><h2>${t('Su tutti i dispositivi', 'On all your devices')}</h2>${corpo}</section>`;
  }

  // #/accedi marks this device as the owner's, starts the sync client and opens the Log with the sign-in box
  function accedi() {
    try { localStorage.setItem('palestra.proprietario', '1'); } catch (e) { /* this visit only */ }
    P.nuvola.avvia();
    location.replace('#/registro');
  }

  // dopo l'accesso, la sincronizzazione o l'uscita la pagina si ridisegna da sola (P.nuvola.quandoCambia)
  function collegaNuvola() {
    const form = document.getElementById('accesso');
    if (form) {
      form.onsubmit = async e => {
        e.preventDefault();
        const b = form.querySelector('button[type="submit"]'), avv = document.getElementById('avviso-accesso');
        const pausa = document.getElementById('avviso-pausa');
        b.disabled = true; avv.textContent = ''; if (pausa) pausa.hidden = true;
        const r = await P.nuvola.accedi(form.elements.email.value.trim(), form.elements.password.value);
        if (r.errore && form.isConnected) {
          b.disabled = false; avv.textContent = r.errore; form.elements.password.focus();
          if (pausa && r.irraggiungibile && online()) pausa.hidden = false;
        }
      };
    }
    const bSinc = vista.querySelector('[data-azione="sincronizza"]');
    if (bSinc) bSinc.onclick = () => { bSinc.disabled = true; P.nuvola.sincronizza(); };
    const bEsci = vista.querySelector('[data-azione="esci"]');
    if (bEsci) bEsci.onclick = () => P.nuvola.esci();
  }

  // ---------- perché esiste (the owner's words, 2026-11-26) ----------

  function perche() {
    vista.innerHTML = `<section class="pagina">
      <h1>${t('Perché esiste', 'Why this exists')}</h1>
      <div class="testo-lezione">
        <p>${t(`Mi sto preparando ai colloqui per ruoli di trading. Ogni volta che mi allenavo per un test di calcolo a mente o per una domanda da colloquio, il lavoro finiva in qualche appunto che poi non riaprivo più. Volevo invece costruire qualcosa che restasse e che avesse un senso: un posto dove ogni trucco ha la sua lezione, i suoi esercizi e il suo ripasso, e dove ogni allenamento si somma a quelli di prima.`,
          `I'm preparing for trading interviews. Every time I practised for a mental maths test or an interview question, the work ended up in notes I never opened again. I wanted to build something that would last and make sense: a place where each trick has its lesson, its exercises and its review, and where every session adds to the ones before.`)}</p>
        <p>${t(`Così è nata la palestra. L'ho costruita usando l'intelligenza artificiale, e con l'AI sono scritti anche molti testi: per questo non darei troppo peso a quello che c'è scritto nelle descrizioni. Gli allenamenti e gli esempi invece li uso io per prepararmi, e penso che siano interessanti e utili anche per chi si prepara agli stessi colloqui.`,
          `That's how Palestra (Italian for gym) came about. I built it using AI, and much of the text is written with AI too, so I wouldn't put too much weight on what the descriptions say. The drills and the examples are another matter: I use them to prepare, and I think they're interesting and useful for anyone getting ready for the same interviews.`)}</p>
        <p>${t(`Il test a tempo segue lo stile dei test di calcolo a mente usati nelle selezioni per il trading, ma non c'è niente di ufficiale: il formato viene da informazioni pubbliche trovate su internet e da testi generati con l'intelligenza artificiale. Non ho aggiunto niente da colloqui o test che ho fatto io.`,
          `The timed test follows the style of the mental maths tests used in trading recruitment, but nothing here is official: the format comes from public information found online and from text generated with AI. I have not added anything from interviews or tests I have taken myself.`)}</p>
      </div>
      <p class="mini">${t('I tuoi progressi restano in questo browser: niente account, niente dati mandati da nessuna parte.', 'Your progress stays in this browser: no account, nothing sent anywhere.')}
        ${t('Il codice è aperto, su', 'The code is open, on')} <a href="https://github.com/ThePowerSet/palestra" target="_blank" rel="noopener">GitHub</a>.
        ${t('Il mio sito:', 'My website:')} <a href="https://thepowerset.github.io/" target="_blank" rel="noopener">thepowerset.github.io</a>.</p>
    </section>`;
  }

  // ---------- formulario: every trick's summary on one page, to reread before an interview ----------

  function schede() {
    let h = `<section class="largo">
      <div class="blocco-testa"><span class="kicker">${t('Formulario', 'Cheat sheet')}</span><h1>${t('Tutte le schede in una pagina', 'Every summary on one page')}</h1>
        <p class="lead">${t('Il riquadro «In breve» di ogni trucco, da rileggere prima di un colloquio o di un test. Si stampa bene.', 'The "In short" box of every trick, to reread before an interview or a test. It prints well.')}</p></div>`;
    for (const m of P.materie) {
      const lista = P.trucchiDi(m.id);
      if (!lista.length) continue;
      h += `<h2 class="schede-materia">${esc(tr(m.titolo))}</h2><div class="schede">${lista.map(x => `
        <a class="scheda-carta" href="#/trucco/${x.id}"><span class="numero">${String(x.numero).padStart(2, '0')}</span>
          <b>${esc(tr(x.titolo))}</b><p>${esc(tr(x.scheda))}</p></a>`).join('')}</div>`;
    }
    vista.innerHTML = h + '</section>';
  }

  // ---------- library: free material found on the open web (contenuti/risorse.js) ----------

  const ARGOMENTI = {
    'options': due('Opzioni', 'Options'), 'greeks': due('Greche', 'Greeks'), 'volatility': due('Volatilità', 'Volatility'),
    'probability': due('Probabilità', 'Probability'), 'brainteasers': due('Rompicapi', 'Brainteasers'), 'market-making': due('Market making', 'Market making'),
    'estimation': due('Stime', 'Estimation'), 'mental-maths': due('Calcolo mentale', 'Mental maths'), 'statistics': due('Statistica', 'Statistics'),
    'rates': due('Tassi e bond', 'Rates and bonds'), 'credit': due('Credito', 'Credit'), 'microstructure': due('Microstruttura', 'Microstructure'),
    'programming': due('Programmazione', 'Programming'), 'interview-prep': due('Colloqui', 'Interviews'),
  };
  const TIPI = {
    notes: due('Dispense', 'Notes'), course: due('Corso', 'Course'), video: due('Video', 'Video'), book: due('Libro', 'Book'), article: due('Articolo', 'Article'),
    paper: due('Paper', 'Paper'), tool: due('Strumento', 'Tool'), puzzles: due('Problemi', 'Puzzles'), podcast: due('Podcast', 'Podcast'), newsletter: due('Newsletter', 'Newsletter'),
  };
  const LIVELLI_RISORSE = due(['Per cominciare', 'Dopo le basi', 'Per approfondire'], ['Start here', 'Once the basics are in', 'Going deeper']);
  const filtro = { argomento: '', livello: 0, testo: '' };

  function risorse() {
    const tutte = P.risorse || [];
    const conta = {};
    tutte.forEach(r => r.topics.forEach(k => { conta[k] = (conta[k] || 0) + 1; }));
    const argomenti = Object.keys(ARGOMENTI).filter(k => conta[k]);
    vista.innerHTML = `<section class="largo">
      <div class="blocco-testa"><span class="kicker">${t('Risorse', 'Library')}</span><h1>${t('Da leggere, guardare e risolvere', 'To read, watch and solve')}</h1>
        <p class="lead">${t('Materiale gratuito trovato sul web aperto, scelto per i colloqui di trading e quant: corsi, dispense, strumenti e problemi. Ogni scheda dice perché vale il tempo e da dove cominciare.',
          'Free material from the open web, chosen for trading and quant interviews: courses, notes, tools and problems. Each card says why it is worth the time and where to start.')}</p></div>
      <div class="filtri">
        <input type="search" id="filtro-testo" placeholder="${t('Cerca per titolo, autore, argomento', 'Search by title, author, topic')}" value="${esc(filtro.testo)}" aria-label="${t('Cerca', 'Search')}">
        <div class="pillole" role="group" aria-label="${t('Argomento', 'Topic')}">
          <button type="button" class="pill" data-arg="" aria-pressed="${!filtro.argomento}">${t('Tutti', 'All')} <span>${tutte.length}</span></button>
          ${argomenti.map(k => `<button type="button" class="pill" data-arg="${k}" aria-pressed="${filtro.argomento === k}">${esc(tr(ARGOMENTI[k]))} <span>${conta[k]}</span></button>`).join('')}
        </div>
        <div class="pillole" role="group" aria-label="${t('Livello', 'Level')}">
          <button type="button" class="pill" data-liv="0" aria-pressed="${!filtro.livello}">${t('Ogni livello', 'Any level')}</button>
          ${tr(LIVELLI_RISORSE).map((l, k) => `<button type="button" class="pill" data-liv="${k + 1}" aria-pressed="${filtro.livello === k + 1}">${l}</button>`).join('')}
        </div>
      </div>
      <p class="mini" id="conteggio" role="status"></p>
      <div class="risorse" id="elenco-risorse"></div>
      <p class="mini nota-risorse">${t('Link esterni, controllati quando sono stati aggiunti. Niente qui è affiliato o sponsorizzato.', 'External links, checked when they were added. Nothing here is affiliated or sponsored.')}</p>
    </section>`;
    const elenco = document.getElementById('elenco-risorse');
    const dominio = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
    const carta = r => `<article class="risorsa">
        <div class="risorsa-testa"><span class="tipo">${esc(tr(TIPI[r.type] || due(r.type, r.type)))}</span><span class="liv l${r.level}" title="${esc(tr(LIVELLI_RISORSE)[r.level - 1] || '')}">${'●'.repeat(r.level)}${'○'.repeat(3 - r.level)}</span></div>
        <h3><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title)}</a></h3>
        <p class="chi">${esc([r.author, r.publisher].filter(Boolean).join(' · '))}</p>
        <p>${esc(tr(r.why))}</p>
        ${r.start_here && tr(r.start_here) ? `<p class="parti"><span class="etichetta">${t('Da dove partire', 'Start with')}</span>${esc(tr(r.start_here))}</p>` : ''}
        <div class="risorsa-piede">${r.topics.map(k => `<span class="tag">${esc(tr(ARGOMENTI[k] || due(k, k)))}</span>`).join('')}${r.free ? '' : `<span class="tag a-pagamento">${t('a pagamento', 'paid')}</span>`}<span class="dominio">${esc(dominio(r.url))} ↗</span></div>
      </article>`;
    const mostra = () => {
      const parole = filtro.testo.toLowerCase().split(/\s+/).filter(Boolean);
      const scelte = tutte.filter(r => (!filtro.argomento || r.topics.includes(filtro.argomento)) && (!filtro.livello || r.level === filtro.livello)
        && parole.every(p => [r.title, r.author, r.publisher, tr(r.why), r.topics.map(k => tr(ARGOMENTI[k] || '')).join(' ')].join(' ').toLowerCase().includes(p)))
        .sort((a, b) => a.level - b.level || (a.free === b.free ? 0 : a.free ? -1 : 1));
      elenco.innerHTML = scelte.map(carta).join('') || `<p class="mini">${t('Nessuna risorsa con questi filtri.', 'No resources match these filters.')}</p>`;
      document.getElementById('conteggio').textContent = t(`${scelte.length} risorse`, `${scelte.length} resources`);
    };
    const campo = document.getElementById('filtro-testo');
    campo.oninput = () => { filtro.testo = campo.value; mostra(); };
    vista.querySelectorAll('[data-arg]').forEach(b => {
      b.onclick = () => { filtro.argomento = b.dataset.arg; vista.querySelectorAll('[data-arg]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); mostra(); };
    });
    vista.querySelectorAll('[data-liv]').forEach(b => {
      b.onclick = () => { filtro.livello = +b.dataset.liv; vista.querySelectorAll('[data-liv]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); mostra(); };
    });
    mostra();
  }

  // ---------- registro ----------

  function registro() {
    const righe = P.dati.risposte, tot = P.statistiche(righe);
    const riga = (nome, st, extra = '') => `<tr><td>${nome}</td><td>${extra}</td><td>${st.n || '–'}</td><td>${st.n ? perc(st.precisione) : '–'}</td><td>${st.n ? sec(st.secondi) : '–'}</td><td>${st.n ? perc(st.aiuti) : '–'}</td><td>${st.n ? P.dataBreve(st.ultima) : '–'}</td></tr>`;
    const trucchi = P.materie.flatMap(m => P.trucchiDi(m.id)).map(x => riga(
      `<a href="#/trucco/${x.id}">${esc(tr(P.trovaMateria(x.materia).titolo))} ${x.numero} · ${esc(tr(x.titolo))}</a>`,
      P.statistiche(P.risposteDi(x.id)), P.dati.imparati[x.id] ? P.dataBreve(P.dati.imparati[x.id]) : ''));
    const blocchi = P.base.map(b => {
      const st = P.statistiche(righe.filter(r => r.trucco === 'base' && r.capitolo === b.blocco));
      return st.n ? riga(`${t('Calcolo di base', 'Basic arithmetic')} · ${tr(b.nome)}`, st) : '';
    }).join('');
    const sessioni = P.dati.sessioni.slice(-15).reverse();
    vista.innerHTML = `<section class="registro">
      <h1>${t('Registro', 'Log')}</h1>
      <p>${tot.n ? t(`${tot.n} risposte in tutto, ${perc(tot.precisione)} giuste, ${sec(tot.secondi)} a risposta.`, `${tot.n} answers in all, ${perc(tot.precisione)} right, ${sec(tot.secondi)} per answer.`) : t('Ancora nessuna risposta.', 'No answers yet.')}
      ${P.server
        ? t('Ogni risposta viene scritta anche in <code>palestra_risposte.csv</code>, nella cartella sopra la palestra.', 'Every answer is also written to <code>palestra_risposte.csv</code>, in the folder above the app.')
        : ownerDevice() ? ''
          : location.protocol === 'file:' ? t('I risultati restano in questo browser; per salvarli in un file usa «Esporta CSV» o avvia la palestra con <code>python3 palestra.py</code>.',
            'Results stay in this browser; to save them to a file use "Export CSV" or start the app with <code>python3 palestra.py</code>.')
            : t('I risultati restano in questo browser e non vengono mandati da nessuna parte. Per tenerne una copia usa «Esporta CSV».',
              'Results stay in this browser and are not sent anywhere. To keep a copy, use "Export CSV".')}</p>
      ${sezioneNuvola()}
      <div class="scorre"><table class="tabella">
        <thead><tr><th>${t('Trucco', 'Trick')}</th><th>${t('Imparato', 'Learnt')}</th><th>${t('Risposte', 'Answers')}</th><th>${t('Giuste', 'Right')}</th><th>${t('Tempo', 'Time')}</th><th>${t('Con sugg.', 'With hint')}</th><th>${t('Ultima', 'Last')}</th></tr></thead>
        <tbody>${trucchi.join('')}${blocchi}</tbody>
      </table></div>
      ${(() => {
        const visti = new Set(), grafici = [];
        for (const s of P.dati.sessioni.slice().reverse()) {
          if (s.modalita !== 'test' || !s.titolo || visti.has(s.titolo.en)) continue;
          visti.add(s.titolo.en);
          const g = graficoTest(s.titolo);
          if (g) grafici.push(g);
        }
        return grafici.length ? `<h2>${t('Test a tempo', 'Timed tests')}</h2><div class="griglia-grafici">${grafici.slice(0, 4).join('')}</div>` : '';
      })()}
      <h2>${t('Ultime sessioni', 'Recent sessions')}</h2>
      ${sessioni.length ? `<div class="scorre"><table class="tabella">
        <thead><tr><th>${t('Data', 'Date')}</th><th>${t('Sessione', 'Session')}</th><th>${t('Giuste', 'Right')}</th><th>${t('Punteggio', 'Score')}</th><th>${t('Durata', 'Time')}</th></tr></thead>
        <tbody>${sessioni.map(s => `<tr><td>${P.dataBreve(s.data)}</td><td>${esc(tr(s.titolo))}</td><td>${s.giuste}/${s.domande}</td><td>${s.punteggio}</td><td>${mmss(s.secondi * 1000)}</td></tr>`).join('')}</tbody>
      </table></div>` : `<p class="mini">${t('Nessuna sessione ancora.', 'No sessions yet.')}</p>`}
      <div class="azioni-lezione">
        <button data-azione="esporta" ${righe.length ? '' : 'disabled'}>${t('Esporta CSV', 'Export CSV')}</button>
        <button data-azione="azzera" class="pericolo" ${righe.length ? '' : 'disabled'}>${t('Cancella risposte e sessioni', 'Delete answers and sessions')}</button>
      </div>
      <p class="mini">${t('Cancellare non tocca i trucchi segnati come imparati.', 'Deleting does not touch the tricks marked as learnt.')}${P.nuvola.collegata()
        ? ' ' + t('Cancella anche nel database, quindi su tutti i dispositivi.', 'It also deletes them from the database, so on every device.') : ''}</p>
    </section>`;
    collegaNuvola();
    vista.querySelector('[data-azione="esporta"]').onclick = () => {
      const blob = new Blob([P.csv(righe)], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `palestra_risposte_${P.oggi()}.csv`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    const bAzzera = vista.querySelector('[data-azione="azzera"]');
    const etichetta = t('Cancella risposte e sessioni', 'Delete answers and sessions');
    bAzzera.onclick = () => {
      if (bAzzera.dataset.sicuro) {
        P.azzera(); registro(); aggiornaConta();
        return;
      }
      bAzzera.dataset.sicuro = '1';
      bAzzera.textContent = t('Sicuro? Premi di nuovo per cancellare', 'Sure? Press again to delete');
      setTimeout(() => { if (bAzzera.isConnected) { delete bAzzera.dataset.sicuro; bAzzera.textContent = etichetta; } }, 4000);
    };
  }

  // ---------- avvio ----------

  document.querySelectorAll('.lingue button').forEach(b => { b.onclick = () => cambiaLingua(b.dataset.lingua); });
  document.getElementById('tema').onclick = cambiaTema;
  window.addEventListener('hashchange', vai);
  P.controllaServer().then(ok => { if (ok && location.hash === '#/registro') registro(); });
  P.nuvola.quandoCambia = datiNuovi => {
    const nome = rotta()[0] || '';
    if (nome === 'registro') return ridisegna();
    if (!datiNuovi) { if (nome === '') ridisegna(); return; }
    // le pagine con un modulo da compilare o una sessione in corso non si toccano: si aggiorna solo il conteggio
    if (nome === '' || nome === 'trucco' || nome === 'ripasso') ridisegna(); else aggiornaConta();
  };
  vai();
  if (ownerDevice()) P.nuvola.avvia();
})();
