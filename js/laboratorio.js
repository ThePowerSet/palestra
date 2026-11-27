/* "Try it": small interactive pieces shown under some lessons, keyed by the trick's id.
   Each one gets an empty element and fills it; nothing runs until a lesson asks for it.
   Values are written into the page with textContent and SVG attributes only (no inline styles: CSP). */
(function () {
  'use strict';
  const P = Palestra;
  const G = P.grafici;
  const L = (P.laboratori = {});
  // rounded for display, without the '…' that P.fmt adds to numbers it cuts
  const tondo = (x, d = 2) => P.fmt(Math.round(x * 10 ** d) / 10 ** d);
  const pct = (x, d = 2) => tondo(x * 100, d) + '%';
  const r1 = x => Math.round(x * 10) / 10;

  // ---------- rule of 16: annual vol → daily, weekly, monthly moves, and paths inside the cone ----------

  L['desk-regola-16'] = el => {
    const ORIZZONTI = [[21, P.t('1 mese', '1 month')], [63, P.t('3 mesi', '3 months')], [252, P.t('1 anno', '1 year')]];
    let passi = 63;
    el.innerHTML = `
      <div class="lab-testa"><span class="etichetta">${P.t('Prova tu', 'Try it')}</span>
        <h3>${P.t('Dalla vol annua al movimento di oggi', 'From annual vol to today\'s move')}</h3></div>
      <label class="cursore"><span>${P.t('Vol implicita annua', 'Annual implied vol')}</span><output id="lab-v"></output>
        <input type="range" id="lab-vol" min="5" max="100" step="1" value="32" aria-label="${P.t('Vol annua', 'Annual vol')}"></label>
      <div class="lab-numeri">
        <div><b id="lab-g"></b><span>${P.t('al giorno · σ / 16', 'a day · σ / 16')}</span></div>
        <div><b id="lab-s"></b><span>${P.t('a settimana · σ / 7.2', 'a week · σ / 7.2')}</span></div>
        <div><b id="lab-m"></b><span>${P.t('al mese · σ / 3.5', 'a month · σ / 3.5')}</span></div>
      </div>
      <div class="lab-grafico" id="lab-cono"></div>
      <div class="lab-piede">
        <div class="pillole" role="group" aria-label="${P.t('Orizzonte', 'Horizon')}">${ORIZZONTI.map(([n, l]) => `<button type="button" class="pill" data-passi="${n}" aria-pressed="${n === passi}">${l}</button>`).join('')}</div>
        <button type="button" class="pill" id="lab-nuovi">${P.t('Altri cammini', 'New paths')} ↻</button>
      </div>
      <p class="mini" id="lab-nota"></p>`;
    const vol = el.querySelector('#lab-vol');
    const disegna = () => {
      const v = +vol.value / 100, giorno = v / 16;
      el.querySelector('#lab-v').textContent = `${vol.value}%`;
      el.querySelector('#lab-g').textContent = pct(giorno);
      el.querySelector('#lab-s').textContent = pct(v / Math.sqrt(52));
      el.querySelector('#lab-m').textContent = pct(v / Math.sqrt(12));
      // the scale is fixed for each horizon at 100% vol, so a higher vol visibly widens the cone
      const c = G.cono({ passi, cammini: 12, sigmaGiorno: v / Math.sqrt(252), W: 640, H: 260, assi: true, scalaPct: 2.4 * Math.sqrt(passi / 252) });
      el.querySelector('#lab-cono').innerHTML = c.svg;
      el.querySelector('#lab-nota').textContent = P.t(
        `Fascia scura: ±1σ, chiara: ±2σ. In questa estrazione ${c.fuori} cammini su ${c.cammini} finiscono fuori da ±1σ; in media è uno su tre.`,
        `Dark band: ±1σ, light band: ±2σ. In this draw ${c.fuori} of ${c.cammini} paths end outside ±1σ; on average it is one in three.`);
    };
    vol.oninput = disegna;
    el.querySelectorAll('[data-passi]').forEach(b => {
      b.onclick = () => {
        passi = +b.dataset.passi;
        el.querySelectorAll('[data-passi]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        disegna();
      };
    });
    el.querySelector('#lab-nuovi').onclick = disegna;
    disegna();
  };

  // ---------- ATM call: the 0.4 rule against Black-Scholes, and where it starts to drift ----------

  L['desk-atm'] = el => {
    const GIORNI = [7, 14, 30, 61, 91, 182, 273, 365, 547, 730, 1095, 1460, 1825];
    const nomeT = g => {
      if (g < 30) return P.t(`${g} giorni`, `${g} days`);
      const m = Math.round(g / 30.4), y = Math.round((g / 365) * 10) / 10;
      if (g < 365) return m === 1 ? P.t('1 mese', '1 month') : P.t(`${m} mesi`, `${m} months`);
      return y === 1 ? P.t('1 anno', '1 year') : P.t(`${P.fmt(y)} anni`, `${P.fmt(y)} years`);
    };
    el.innerHTML = `
      <div class="lab-testa"><span class="etichetta">${P.t('Prova tu', 'Try it')}</span>
        <h3>${P.t('La regola dello 0.4 contro Black-Scholes', 'The 0.4 rule against Black-Scholes')}</h3></div>
      <div class="cursori">
        <label class="cursore"><span>${P.t('Prezzo del titolo', 'Stock price')} S</span><output id="lab-So"></output><input type="range" id="lab-S" min="10" max="400" step="5" value="100"></label>
        <label class="cursore"><span>${P.t('Vol implicita', 'Implied vol')} σ</span><output id="lab-sigo"></output><input type="range" id="lab-sig" min="5" max="120" step="1" value="20"></label>
        <label class="cursore"><span>${P.t('Scadenza', 'Expiry')} T</span><output id="lab-To"></output><input type="range" id="lab-T" min="0" max="${GIORNI.length - 1}" step="1" value="4"></label>
      </div>
      <div class="lab-numeri">
        <div><b id="lab-reg"></b><span>0.4 × S × σ × √T</span></div>
        <div><b id="lab-bs"></b><span>Black-Scholes${P.t(', tassi a zero', ', zero rates')}</span></div>
        <div><b id="lab-err"></b><span>${P.t('scarto della regola', 'gap of the rule')}</span></div>
        <div><b id="lab-str"></b><span>${P.t('straddle ≈ 0.8 × S × σ × √T', 'straddle ≈ 0.8 × S × σ × √T')}</span></div>
        <div><b id="lab-vega"></b><span>${P.t('vega per punto di vol ≈ 0.004 × S × √T', 'vega per vol point ≈ 0.004 × S × √T')}</span></div>
      </div>
      <div class="lab-grafico" id="lab-curva"></div>
      <p class="mini">${P.t('Il grafico mostra il prezzo diviso per S in funzione di σ√T: la retta è la regola, la curva è Black-Scholes. Finché σ√T resta sotto 0.5 circa le due quasi coincidono; con vol alte e scadenze lunghe la regola sovrastima.',
        'The chart shows the price divided by S as a function of σ√T: the straight line is the rule, the curve is Black-Scholes. While σ√T stays below about 0.5 the two nearly coincide; with high vols and long expiries the rule overprices.')}</p>`;
    const S = el.querySelector('#lab-S'), sig = el.querySelector('#lab-sig'), Ti = el.querySelector('#lab-T');
    const curva = x => {
      const W = 640, H = 230, px = 44, py = 14, xmax = 2, ymax = 0.8;
      const X = v => px + (v / xmax) * (W - px - 14), Y = v => H - py - 18 - (v / ymax) * (H - 2 * py - 18);
      const reg = [], bs = [];
      for (let i = 0; i <= 80; i++) {
        const v = (i / 80) * xmax;
        reg.push(`${r1(X(v))},${r1(Y(Math.min(0.4 * v, ymax)))}`);
        bs.push(`${r1(X(v))},${r1(Y(2 * G.N(v / 2) - 1))}`);
      }
      const xs = Math.min(x, xmax), yR = Math.min(0.4 * xs, ymax), yB = 2 * G.N(xs / 2) - 1;
      const tacche = [0, 0.5, 1, 1.5, 2].map(v => `<text x="${r1(X(v))}" y="${H - 6}" class="g-asse" text-anchor="middle">${P.fmt(v)}</text>`).join('');
      const yt = [0, 0.2, 0.4, 0.6].map(v => `<text x="${px - 8}" y="${r1(Y(v)) + 4}" class="g-asse" text-anchor="end">${P.fmt(v)}</text><line x1="${px}" x2="${W - 14}" y1="${r1(Y(v))}" y2="${r1(Y(v))}" class="g-griglia"/>`).join('');
      return `<svg class="grafico curva" viewBox="0 0 ${W} ${H}" role="img" aria-label="${P.t('Regola contro Black-Scholes', 'Rule against Black-Scholes')}">
        ${yt}${tacche}<text x="${W - 14}" y="${H - 22}" class="g-asse" text-anchor="end">σ√T</text>
        <polyline points="${reg.join(' ')}" class="g-regola"/><polyline points="${bs.join(' ')}" class="g-bs"/>
        <line x1="${r1(X(xs))}" x2="${r1(X(xs))}" y1="${r1(Y(yR))}" y2="${r1(Y(yB))}" class="g-scarto"/>
        <circle cx="${r1(X(xs))}" cy="${r1(Y(yR))}" r="4.5" class="g-punto-regola"/><circle cx="${r1(X(xs))}" cy="${r1(Y(yB))}" r="4.5" class="g-punto-bs"/>
        <g class="g-legenda"><line x1="${px + 10}" x2="${px + 30}" y1="${py + 4}" y2="${py + 4}" class="g-regola"/><text x="${px + 36}" y="${py + 8}">0.4 · σ√T</text>
        <line x1="${px + 120}" x2="${px + 140}" y1="${py + 4}" y2="${py + 4}" class="g-bs"/><text x="${px + 146}" y="${py + 8}">Black-Scholes</text></g>
      </svg>`;
    };
    const disegna = () => {
      const s = +S.value, v = +sig.value / 100, g = GIORNI[+Ti.value], T = g / 365, rt = Math.sqrt(T);
      const regola = 0.4 * s * v * rt, bs = G.callATM(s, v, T), vega = s * rt * Math.exp(-(v * v * T) / 8) / Math.sqrt(2 * Math.PI) / 100;
      el.querySelector('#lab-So').textContent = String(s);
      el.querySelector('#lab-sigo').textContent = `${sig.value}%`;
      el.querySelector('#lab-To').textContent = nomeT(g);
      el.querySelector('#lab-reg').textContent = tondo(regola, 2);
      el.querySelector('#lab-bs').textContent = tondo(bs, 2);
      const e = (regola - bs) / bs;
      const err = el.querySelector('#lab-err');
      err.textContent = (e >= 0 ? '+' : '−') + tondo(Math.abs(e) * 100, 1) + '%';
      err.className = Math.abs(e) > 0.03 ? 'lontano' : '';
      el.querySelector('#lab-str').textContent = tondo(0.8 * s * v * rt, 2);
      el.querySelector('#lab-vega').textContent = tondo(vega, 3);
      el.querySelector('#lab-curva').innerHTML = curva(v * rt);
    };
    [S, sig, Ti].forEach(i => { i.oninput = disegna; });
    disegna();
  };

  // ---------- gamma against theta: one day of a delta-hedged at-the-money option ----------

  L['opz-gamma-theta'] = el => {
    const S = 100, T = 21 / 252;   // a one-month option on a stock at 100
    el.innerHTML = `
      <div class="lab-testa"><span class="etichetta">${P.t('Prova tu', 'Try it')}</span>
        <h3>${P.t('Un giorno da lungo gamma', 'One day long gamma')}</h3></div>
      <div class="cursori">
        <label class="cursore"><span>${P.t('Vol implicita pagata', 'Implied vol paid')}</span><output id="lab-vo"></output><input type="range" id="lab-vi" min="10" max="80" step="1" value="32"></label>
        <label class="cursore"><span>${P.t('Movimento di oggi', 'Today\'s move')}</span><output id="lab-mo"></output><input type="range" id="lab-m" min="-60" max="60" step="1" value="10"></label>
      </div>
      <div class="lab-numeri">
        <div><b id="lab-gp"></b><span>${P.t('dal gamma · ½ Γ ΔS²', 'from gamma · ½ Γ ΔS²')}</span></div>
        <div><b id="lab-th"></b><span>${P.t('theta di un giorno', 'one day of theta')}</span></div>
        <div><b id="lab-net"></b><span>${P.t('P&L della giornata', 'P&L for the day')}</span></div>
        <div><b id="lab-be"></b><span>${P.t('pareggio · σ × S / 16', 'break-even · σ × S / 16')}</span></div>
      </div>
      <div class="lab-grafico" id="lab-parabola"></div>
      <p class="mini">${P.t('Opzione at-the-money a un mese su un titolo a 100, coperta in delta la sera prima; per 100 azioni. La parabola è il P&L della giornata per ogni movimento: sopra lo zero fuori dai due punti di pareggio, sotto dentro. Cambia la vol pagata e guarda i punti di pareggio spostarsi con σ/16.',
        'One-month at-the-money option on a stock at 100, delta-hedged the evening before; for 100 shares. The parabola is the day\'s P&L for every move: above zero outside the two break-even points, below inside. Change the vol paid and watch the break-evens move with σ/16.')}</p>`;
    const vi = el.querySelector('#lab-vi'), mi = el.querySelector('#lab-m');
    const disegna = () => {
      const s = +vi.value / 100, m = +mi.value / 10;                 // move in points of a stock at 100
      const d1 = s * Math.sqrt(T) / 2, phi = Math.exp(-d1 * d1 / 2) / Math.sqrt(2 * Math.PI);
      const gamma = phi / (S * s * Math.sqrt(T)) * 100;              // per 100 shares
      const theta = -0.5 * gamma * s * s * S * S / 252;              // one trading day
      const pnl = x => 0.5 * gamma * x * x + theta, be = s * S / Math.sqrt(252);
      el.querySelector('#lab-vo').textContent = `${vi.value}%`;
      el.querySelector('#lab-mo').textContent = `${m > 0 ? '+' : m < 0 ? '−' : ''}${tondo(Math.abs(m), 1)}`;
      el.querySelector('#lab-gp').textContent = tondo(0.5 * gamma * m * m, 2);
      el.querySelector('#lab-th').textContent = '−' + tondo(-theta, 2);
      const net = el.querySelector('#lab-net');
      net.textContent = (pnl(m) >= 0 ? '+' : '−') + tondo(Math.abs(pnl(m)), 2);
      net.className = pnl(m) >= 0 ? 'bene' : 'lontano';
      el.querySelector('#lab-be').textContent = '±' + tondo(be, 2);
      // the chart: moves from −6 to +6, P&L scaled to the largest value on screen
      const W = 640, H = 240, px = 44, py = 16, xm = 6;
      const lo = Math.min(theta, -0.1), hi = Math.max(pnl(xm), 0.1);
      const X = x => px + ((x + xm) / (2 * xm)) * (W - px - 14), Y = y => py + ((hi - y) / (hi - lo)) * (H - 2 * py - 16);
      const pts = [];
      for (let i = 0; i <= 120; i++) { const x = -xm + (i / 120) * 2 * xm; pts.push(`${r1(X(x))},${r1(Y(pnl(x)))}`); }
      const tacche = [-6, -4, -2, 0, 2, 4, 6].map(x => `<text x="${r1(X(x))}" y="${H - 4}" class="g-asse" text-anchor="middle">${x > 0 ? '+' : x < 0 ? '−' : ''}${Math.abs(x)}</text>`).join('');
      const bex = [-be, be].filter(x => x > -xm && x < xm);
      el.querySelector('#lab-parabola').innerHTML = `<svg class="grafico curva" viewBox="0 0 ${W} ${H}" role="img" aria-label="${P.t('P&L per movimento', 'P&L by move')}">
        <rect x="${r1(X(-Math.min(be, xm)))}" y="${py}" width="${r1(X(Math.min(be, xm)) - X(-Math.min(be, xm)))}" height="${H - 2 * py - 16}" class="g-perdita"/>
        <line x1="${px}" x2="${W - 14}" y1="${r1(Y(0))}" y2="${r1(Y(0))}" class="g-griglia"/>
        <text x="${px - 8}" y="${r1(Y(0)) + 4}" class="g-asse" text-anchor="end">0</text>
        <text x="${px - 8}" y="${r1(Y(theta)) + 4}" class="g-asse" text-anchor="end">${tondo(theta, 1)}</text>
        ${tacche}<text x="${W - 14}" y="${H - 20}" class="g-asse" text-anchor="end">ΔS</text>
        ${bex.map(x => `<line x1="${r1(X(x))}" x2="${r1(X(x))}" y1="${py}" y2="${H - py - 16}" class="g-pareggio"/>`).join('')}
        <polyline points="${pts.join(' ')}" class="g-bs"/>
        <circle cx="${r1(X(Math.max(-xm, Math.min(xm, m))))}" cy="${r1(Y(pnl(Math.max(-xm, Math.min(xm, m)))))}" r="5" class="g-punto-regola"/>
      </svg>`;
    };
    [vi, mi].forEach(i => { i.oninput = disegna; });
    disegna();
  };
})();
