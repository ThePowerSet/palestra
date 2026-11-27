/* Small SVG charts drawn as strings: timed-test scores, and the random walks with their volatility cone
   for the lessons. No library and no inline styles (the CSP forbids them):
   colours come from classes in stile.css, so the charts follow the light and dark themes.
   Nothing here touches the page when the file loads, so strumenti/verifica.js can load it too. */
(function () {
  'use strict';
  const P = Palestra;
  const G = (P.grafici = {});
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const r1 = x => Math.round(x * 10) / 10;

  // a standard normal draw (Box-Muller); uses Math.random, so P.conSeme makes it repeatable
  G.normale = () => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  // Scores of past timed tests with the same settings, oldest first: [{ y, etichetta }]
  G.punteggi = punti => {
    if (punti.length < 2) return '';
    const W = 560, H = 150, px = 34, py = 16;
    const ys = punti.map(p => p.y), lo = Math.min(0, ...ys), hi = Math.max(...ys, lo + 1);
    const X = i => px + (i * (W - px - 10)) / (punti.length - 1), Y = y => H - py - ((y - lo) / (hi - lo)) * (H - 2 * py);
    const linea = punti.map((p, i) => `${r1(X(i))},${r1(Y(p.y))}`).join(' ');
    const area = `${r1(X(0))},${r1(Y(lo))} ${linea} ${r1(X(punti.length - 1))},${r1(Y(lo))}`;
    const best = Math.max(...ys);
    return `<svg class="grafico punteggi" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(P.t('Punteggi dei test', 'Test scores'))}">
      <line x1="${px}" x2="${W - 10}" y1="${r1(Y(best))}" y2="${r1(Y(best))}" class="g-guida"/>
      <text x="${px - 6}" y="${r1(Y(best)) + 4}" class="g-asse" text-anchor="end">${best}</text>
      <text x="${px - 6}" y="${r1(Y(lo)) + 4}" class="g-asse" text-anchor="end">${lo}</text>
      <polygon points="${area}" class="g-area"/><polyline points="${linea}" class="g-linea"/>
      ${punti.map((p, i) => `<circle cx="${r1(X(i))}" cy="${r1(Y(p.y))}" r="${i === punti.length - 1 ? 4.5 : 3}" class="g-punto${i === punti.length - 1 ? ' ultimo' : ''}"><title>${esc(p.etichetta)}</title></circle>`).join('')}
    </svg>`;
  };

  // Random walks inside their ±1σ and ±2σ cone. passi = trading days, cammini = how many paths.
  // dentro(sigma1): fraction of paths' end points inside ±1σ is returned too, for the lesson widget.
  G.cono = ({ passi = 63, cammini = 5, W = 640, H = 280, sigmaGiorno = 0.0125, classe = '', assi = false, scalaPct = null } = {}) => {
    const x0 = assi ? 40 : 0, x1 = W - (assi ? 12 : 0), y0 = H / 2;
    const fine = sigmaGiorno * Math.sqrt(passi);
    const scala = (H / 2 - 10) / ((scalaPct != null ? scalaPct : 2.6 * fine) || 1);  // pixels per unit of return
    const X = t => x0 + (t / passi) * (x1 - x0), Y = r => y0 - r * scala;
    const banda = k => {
      const su = [], giu = [];
      for (let t = 0; t <= passi; t++) { const d = k * sigmaGiorno * Math.sqrt(t); su.push(`${r1(X(t))},${r1(Y(d))}`); giu.unshift(`${r1(X(t))},${r1(Y(-d))}`); }
      return su.concat(giu).join(' ');
    };
    let fuori = 0, linee = '';
    for (let c = 0; c < cammini; c++) {
      let r = 0;
      const pts = [`${r1(X(0))},${r1(Y(0))}`];
      for (let t = 1; t <= passi; t++) { r += sigmaGiorno * G.normale(); pts.push(`${r1(X(t))},${r1(Y(r))}`); }
      if (Math.abs(r) > fine) fuori++;
      linee += `<polyline points="${pts.join(' ')}" class="g-cammino g-cammino-${c % 5}" pathLength="1"/>`;
    }
    let etichette = '';
    if (assi) {
      const f = x => (x * 100).toFixed(x * 100 < 10 ? 1 : 0) + '%';
      etichette = `<text x="${x0 - 6}" y="${r1(Y(fine)) + 4}" class="g-asse" text-anchor="end">+${f(fine)}</text>
        <text x="${x0 - 6}" y="${r1(Y(-fine)) + 4}" class="g-asse" text-anchor="end">−${f(fine)}</text>
        <text x="${x0 - 6}" y="${y0 + 4}" class="g-asse" text-anchor="end">0</text>
        <text x="${x1}" y="${H - 2}" class="g-asse" text-anchor="end">${passi} ${P.t('giorni', 'days')}</text>`;
    }
    const svg = `<svg class="grafico cono ${classe}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <polygon points="${banda(2)}" class="g-banda2"/><polygon points="${banda(1)}" class="g-banda1"/>
      <line x1="${x0}" x2="${x1}" y1="${y0}" y2="${y0}" class="g-zero"/>
      ${linee}${etichette}</svg>`;
    return { svg, fuori, cammini };
  };

  // Black-Scholes with zero rates, for the option widget: N(x) via the error function (A&S 7.1.26)
  G.N = x => {
    const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x / 2);
    return x >= 0 ? (1 + y) / 2 : (1 - y) / 2;
  };
  G.callATM = (S, sigma, T) => S * (2 * G.N(sigma * Math.sqrt(T) / 2) - 1);
})();
