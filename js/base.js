/* Basic arithmetic for the timed test: sums, products, divisions, percentages, decimals,
   fractions and comparisons, one generator per block. */
(function () {
  'use strict';
  const P = Palestra;
  const NOMI = {
    add_sub: { it: 'somme e sottrazioni', en: 'sums and differences' },
    mul: { it: 'prodotti', en: 'products' },
    div: { it: 'divisioni', en: 'divisions' },
    percent: { it: 'percentuali', en: 'percentages' },
    decimal: { it: 'decimali', en: 'decimals' },
    fraction_ops: { it: 'frazioni', en: 'fractions' },
    compare: { it: 'confronti', en: 'comparisons' },
  };
  const B = (blocco, peso, fn) => P.base.push({ blocco, nome: NOMI[blocco], peso, fn });

  B('add_sub', 2, () => {
    const a = P.int(100, 999), b = P.int(100, 999);
    if (P.chance(0.5)) {
      const t = Math.round(b / 100) * 100;
      return {
        testo: `${a} + ${b}`, risposta: P.numero(a + b),
        soluzione: [`${a} + ${t} = ${a + t}`, P.t(`${b} = ${t} ${P.piuMeno(b - t)}, quindi ${a + t} ${P.piuMeno(b - t)} = ${a + b}`, `${b} = ${t} ${P.piuMeno(b - t)}, so ${a + t} ${P.piuMeno(b - t)} = ${a + b}`)],
      };
    }
    const x = Math.max(a, b), y = Math.min(a, b), t = Math.round(y / 100) * 100;
    return {
      testo: `${x} − ${y}`, risposta: P.numero(x - y),
      soluzione: [`${x} − ${t} = ${x - t}`, P.t(`${y} = ${t} ${P.piuMeno(y - t)}, quindi ${x - t} ${P.piuMeno(t - y)} = ${x - y}`, `${y} = ${t} ${P.piuMeno(y - t)}, so ${x - t} ${P.piuMeno(t - y)} = ${x - y}`)],
    };
  });

  B('mul', 2, () => {
    let a, b;
    if (P.chance(0.5)) { a = P.int(12, 99); b = P.int(3, 9); } else { a = P.int(11, 29); b = P.int(11, 29); }
    const dec = Math.floor(b / 10) * 10, u = b % 10;
    const passi = b < 10
      ? [`${a} × ${b} = ${Math.floor(a / 10) * 10} × ${b} + ${a % 10} × ${b} = ${Math.floor(a / 10) * 10 * b} + ${(a % 10) * b} = ${a * b}`]
      : [`${a} × ${b} = ${a} × ${dec} + ${a} × ${u} = ${a * dec} + ${a * u} = ${a * b}`];
    return { testo: `${a} × ${b}`, risposta: P.numero(a * b), soluzione: passi };
  });

  B('div', 1, () => {
    const b = P.int(3, 15), c = P.int(3, 40);
    return { testo: `${b * c} ÷ ${b}`, risposta: P.numero(c), soluzione: [`${b} × ${c} = ${b * c}`] };
  });

  B('percent', 1, () => {
    const p = P.pick([5, 10, 12.5, 15, 20, 25, 30, 40, 60, 75]);
    const base = P.pick([40, 80, 120, 160, 200, 240, 360, 480, 640]);
    const v = p * base / 100;
    return {
      testo: P.t(`${P.cap(P.il(p))}% di ${base}`, `${P.fmt(p)}% of ${base}`), risposta: P.numero(v),
      soluzione: [`${P.fmt(p)}% = ${P.fmt(p / 100)}`, `${base} × ${P.fmt(p / 100)} = ${P.fmt(v)}`],
    };
  });

  B('decimal', 1, () => {
    let a, b; do { a = P.int(2, 49); b = P.int(2, 19); } while (a % 10 === 0 || b % 10 === 0);
    return {
      testo: `${P.fmt(a / 10)} × ${P.fmt(b / 10)}`, risposta: P.numero(a * b / 100),
      soluzione: [`${a} × ${b} = ${a * b}`, P.t(`due cifre decimali in tutto: ${P.fmt(a * b / 100)}`, `two decimal places in all: ${P.fmt(a * b / 100)}`)],
    };
  });

  B('fraction_ops', 1, () => {
    const da = P.pick([2, 3, 4, 5, 6, 8]), db = P.pick([2, 3, 4, 5, 6, 8]);
    const na = P.int(1, da - 1), nb = P.int(1, db - 1);
    if (P.chance(0.5)) {
      const den = da * db / P.mcd(da, db), num = na * den / da + nb * den / db, g = P.mcd(num, den);
      return {
        testo: `${na}/${da} + ${nb}/${db}`, risposta: P.numero(num / den, { decimali: 3, mostra: `${num / g}/${den / g}` }),
        nota: P.t('frazione o almeno 3 decimali', 'a fraction or at least 3 decimals'),
        soluzione: [
          P.t(`denominatore comune ${den}`, `common denominator ${den}`) + `: ${na * den / da}/${den} + ${nb * den / db}/${den} = ${num}/${den}`,
          `= ${num / g}/${den / g} = ${P.fmt(num / den, 4)}`,
        ],
      };
    }
    const n = P.pick([24, 32, 40, 48, 64, 72, 96]), v = na * n / da;
    return {
      testo: P.t(`${na}/${da} di ${n}`, `${na}/${da} of ${n}`), risposta: P.numero(v, { decimali: 2 }),
      soluzione: [`${n} ÷ ${da} = ${P.fmt(n / da)}`, `× ${na} = ${P.fmt(v)}`],
    };
  });

  B('compare', 1, () => {
    let a, b, c, d;
    do { a = P.int(5, 40); b = P.int(5, 40); c = P.int(5, 40); d = P.int(5, 40); }
    while (!(a < b && c < d && a * d !== c * b && Math.abs(a / b - c / d) < 0.1));
    const primo = a * d > c * b, grande = primo ? `${a}/${b}` : `${c}/${d}`;
    return {
      testo: P.t('Quale frazione è più grande?', 'Which fraction is larger?'), risposta: P.scelta([`${a}/${b}`, `${c}/${d}`], primo ? 0 : 1),
      soluzione: [
        P.t(`in croce: ${a} × ${d} = ${a * d} contro ${c} × ${b} = ${c * b}`, `cross-multiply: ${a} × ${d} = ${a * d} against ${c} × ${b} = ${c * b}`),
        P.t(`più grande ${grande}`, `larger: ${grande}`),
      ],
    };
  });
})();
