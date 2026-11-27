(function () {
  'use strict';
  const P = Palestra;
  const F = {
    bill: P.fonte('treasurydirect', 'section "Bills"'),
    rendimento: P.fonte('richmondBill', 'section "Yield Calculation"'),
    rateo: P.fonte('cfr356', 'section I.D, "Accrued Interest"'),
    fra: P.fonte('richmondDerivati', 'section on forward rate agreements'),
  };
  const soldi = x => P.fmt(Math.round(x * 100) / 100);

  // US bills are quoted on a discount basis: price = face × (1 − d × days/360)
  function bill() {
    const faccia = P.pick([1000, 10000, 100000]), giorni = P.pick([28, 91, 182, 364]), d = P.int(60, 110) / 2000;
    const prezzo = faccia * (1 - d * giorni / 360), sconto = faccia - prezzo, chiediSconto = P.chance(0.35);
    const v = chiediSconto ? sconto : prezzo;
    return {
      testo: P.t(`Un Treasury bill a ${giorni} giorni con valore nominale ${P.fmt(faccia)} $ viene venduto a un tasso di sconto del ${P.pct(d, 3)}. ${chiediSconto ? 'Quanto guadagna chi lo compra e lo tiene a scadenza?' : 'Quanto costa?'}`,
        `A ${giorni}-day Treasury bill with a face value of $${P.fmt(faccia)} is sold at a ${P.pct(d, 3)} discount rate. ${chiediSconto ? 'How much does a buyer who holds it to maturity earn?' : 'What does it cost?'}`),
      nota: P.t('in dollari, al centesimo', 'in dollars, to the cent'),
      risposta: P.numero(v, { tol: 0.011, mostra: soldi(v) }),
      suggerimenti: [
        P.t('I bill non pagano cedole: si comprano sotto la pari e a scadenza rendono il nominale. Lo sconto si calcola sul nominale, su un anno di 360 giorni.', 'Bills pay no coupon: you buy them below face and get the face back at maturity. The discount is worked out on the face value, over a 360-day year.'),
        `${P.fmt(faccia)} × ${P.fmt(d)} × ${giorni}/360 = ${soldi(sconto)}.`,
      ],
      soluzione: [P.t(`sconto: ${soldi(sconto)} $`, `discount: $${soldi(sconto)}`), P.t(`prezzo: ${P.fmt(faccia)} − ${soldi(sconto)} = ${soldi(prezzo)} $`, `price: ${P.fmt(faccia)} − ${soldi(sconto)} = $${soldi(prezzo)}`)],
      fonte: F.bill,
    };
  }

  // The discount yield divides by face over 360 days; what you earn divides by the price paid over 365
  function rendimento() {
    const giorni = P.pick([91, 182, 364]), Pz = Math.round((100 - P.int(80, 260) / 100 * giorni / 182) * 1000) / 1000;
    const sconto = (100 - Pz) / 100 * 360 / giorni, investimento = (100 - Pz) / Pz * 365 / giorni, chiediSconto = P.chance(0.35);
    const v = chiediSconto ? sconto : investimento;
    return {
      testo: P.t(`Un bill a ${giorni} giorni costa ${P.fmt(Pz)} ogni 100 di nominale. ${chiediSconto ? 'Qual è il suo rendimento su base sconto (nominale, 360 giorni)?' : 'Qual è il suo rendimento come investimento (sul prezzo pagato, 365 giorni)?'}`,
        `A ${giorni}-day bill costs ${P.fmt(Pz)} per 100 face. ${chiediSconto ? 'What is its yield on a discount basis (face, 360 days)?' : 'What is its investment yield (on the price paid, 365 days)?'}`),
      nota: P.t('in percentuale, due decimali', 'as a percentage, two decimals'),
      risposta: P.numero(v, { percento: true, tol: 0.00011, mostra: P.pct(Math.round(v * 10000) / 10000, 2) }),
      suggerimenti: [
        P.t(`Guadagni ${P.fmt(Math.round((100 - Pz) * 1000) / 1000)} in ${giorni} giorni.`, `You earn ${P.fmt(Math.round((100 - Pz) * 1000) / 1000)} over ${giorni} days.`),
        chiediSconto ? P.t('Su base sconto: diviso il nominale (100), riportato a 360 giorni.', 'Discount basis: divided by face (100), scaled to 360 days.')
          : P.t(`Come investimento: diviso il prezzo pagato (${P.fmt(Pz)}), riportato a 365 giorni. Viene sempre più alto del tasso di sconto.`, `As an investment: divided by the price paid (${P.fmt(Pz)}), scaled to 365 days. It always comes out above the discount rate.`),
      ],
      soluzione: chiediSconto ? [`${P.fmt(Math.round((100 - Pz) * 1000) / 1000)} / 100 × 360 / ${giorni} = ${P.pct(Math.round(v * 10000) / 10000, 2)}`]
        : [`${P.fmt(Math.round((100 - Pz) * 1000) / 1000)} / ${P.fmt(Pz)} × 365 / ${giorni} = ${P.pct(Math.round(v * 10000) / 10000, 2)}`, P.t(`su base sconto sarebbe ${P.pct(Math.round(sconto * 10000) / 10000, 2)}`, `on a discount basis it would be ${P.pct(Math.round(sconto * 10000) / 10000, 2)}`)],
      fonte: F.rendimento,
    };
  }

  // Accrued interest on a note: half-year coupon × days accrued / days in the half-year
  function rateo() {
    const c = P.pick([1.5, 2.25, 3, 3.875, 4.125, 4.625, 5]), periodo = P.pick([181, 182, 183, 184]), gg = P.int(10, periodo - 10);
    const nom = P.pick([100000, 250000, 1000000]), v = nom * c / 100 / 2 * gg / periodo;
    return {
      testo: P.t(`Un Treasury note con cedola ${c}% paga ogni sei mesi. Regoli l'acquisto ${gg} giorni dopo l'ultima cedola, in un semestre di ${periodo} giorni. Quanti interessi maturati paghi al venditore su ${P.fmt(nom)} $ di nominale?`,
        `A Treasury note with a ${c}% coupon pays every six months. You settle a purchase ${gg} days after the last coupon, in a half-year of ${periodo} days. How much accrued interest do you pay the seller on $${P.fmt(nom)} face?`),
      nota: P.t('in dollari, al centesimo', 'in dollars, to the cent'),
      risposta: P.numero(v, { tol: 0.011, mostra: soldi(v) }),
      suggerimenti: [
        P.t('Il venditore ha diritto alla parte di cedola maturata mentre teneva il titolo: giorni passati su giorni del semestre, giorni effettivi.', 'The seller is owed the part of the coupon earned while holding the note: days elapsed over days in the half-year, actual days.'),
        P.t(`Cedola semestrale: ${P.fmt(nom)} × ${c}% / 2 = ${soldi(nom * c / 200)}.`, `Half-year coupon: ${P.fmt(nom)} × ${c}% / 2 = ${soldi(nom * c / 200)}.`),
      ],
      soluzione: [`${soldi(nom * c / 200)} × ${gg} / ${periodo} = ${soldi(v)}`],
      fonte: F.rateo,
    };
  }

  // FRA: the rate difference is owed at the end of the period but settled at the start, so it is discounted at the fixing
  function fra() {
    const N = P.pick([1, 5, 10, 25]) * 1e6, k = P.int(200, 450) / 10000, L = Math.max(0.005, k + P.pick([-1, 1]) * P.int(10, 60) / 10000);
    const gg = P.pick([90, 91, 92, 181, 182]), diff = N * (L - k) * gg / 360, v = diff / (1 + L * gg / 360);
    const mesi = gg < 100 ? '3x6' : '6x12';
    return {
      testo: P.t(`Hai comprato un FRA ${mesi} al ${P.pct(k, 2)} su ${P.fmt(N / 1e6)} milioni di euro. Al fixing il tasso del periodo (${gg} giorni, act/360) è ${P.pct(L, 2)}. Quanto incassi al regolamento, all'inizio del periodo? (Negativo se paghi.)`,
        `You bought a ${mesi} FRA at ${P.pct(k, 2)} on EUR ${P.fmt(N / 1e6)} million. At fixing the rate for the period (${gg} days, act/360) is ${P.pct(L, 2)}. How much do you receive at settlement, at the start of the period? (Negative if you pay.)`),
      nota: P.t('in euro, con il segno', 'in euros, with its sign'),
      risposta: P.numero(v, { tol: Math.max(1, Math.abs(v) * 0.002), mostra: soldi(v) }),
      suggerimenti: [
        P.t('Chi compra un FRA si è fissato il tasso da pagare: guadagna se il fixing sale. La differenza di interessi vale N × (fixing − FRA) × giorni/360.', 'Whoever buys a FRA has locked in the rate to pay: they gain if the fixing rises. The interest difference is N × (fixing − FRA) × days/360.'),
        P.t(`Quella differenza sarebbe dovuta a fine periodo; si paga all'inizio, quindi la sconti: diviso (1 + fixing × ${gg}/360).`, `That difference would be due at the end of the period; it is paid at the start, so discount it: divide by (1 + fixing × ${gg}/360).`),
      ],
      soluzione: [`${P.fmt(N)} × (${P.pct(L, 2)} − ${P.pct(k, 2)}) × ${gg}/360 = ${soldi(diff)}`, `${soldi(diff)} / (1 + ${P.fmt(L, 4)} × ${gg}/360) = ${soldi(v)}`],
      fonte: F.fra,
    };
  }

  P.trucco({
    id: 'tassi-titoli',
    materia: 'tassi',
    capitolo: 'titoli',
    numero: 4,
    titolo: { it: 'Bill, ratei e FRA', en: 'Bills, accrued interest and FRAs' },
    sottotitolo: {
      it: 'Le convenzioni del mercato monetario con i numeri dei documenti ufficiali: tasso di sconto, rendimento vero, interessi maturati, regolamento di un FRA.',
      en: 'Money-market conventions with the numbers from official documents: discount rate, true yield, accrued interest, settling a FRA.',
    },
    aggancio: {
      it: '«Il bill a sei mesi è al 4% di sconto. Quanto rende davvero?» Più del 4%: lo sconto si calcola sul nominale e su 360 giorni, il rendimento sul prezzo pagato e su 365.',
      en: '"The six-month bill is at a 4% discount. What does it really yield?" More than 4%: the discount is worked out on face and 360 days, the yield on the price paid and 365.',
    },
    lezione: {
      it: `
<h3>Il tasso di sconto</h3>
<p>I Treasury bill non pagano cedole: si comprano sotto la pari e rimborsano il nominale. Il prezzo si ricava dal tasso di sconto d: prezzo = nominale × (1 − d × giorni/360).</p>
<div class="esempio">10,000 $ a 91 giorni, sconto 4.20%: 10,000 × 0.042 × 91/360 = 106.17 → prezzo 9,893.83 $.</div>

<h3>Rendimento vero</h3>
<p>Il tasso di sconto sottostima quello che guadagni: divide per il nominale invece che per il prezzo pagato, e usa 360 giorni invece di 365. Il rendimento come investimento è (100 − P)/P × 365/giorni, sempre un po' più alto.</p>

<h3>Interessi maturati</h3>
<p>Comprando un titolo con cedola fra due date di pagamento, paghi al venditore la parte di cedola che ha maturato: cedola semestrale × giorni passati / giorni del semestre (giorni effettivi). Il prezzo quotato è "secco"; quello che paghi è secco più rateo.</p>

<h3>Un FRA</h3>
<p>Chi compra un FRA fissa oggi il tasso che pagherà su un periodo futuro. Al fixing incassa N × (fixing − tasso FRA) × giorni/360 se il fixing è più alto, e paga se è più basso. Il regolamento avviene all'inizio del periodo, quindi la differenza si sconta al tasso del fixing.</p>

<div class="trappola">Le basi contano: sconto su 360 e sul nominale, rendimento su 365 e sul prezzo, ratei sui giorni effettivi del semestre. Un errore di base vale facilmente qualche punto base.</div>
`,
      en: `
<h3>The discount rate</h3>
<p>Treasury bills pay no coupons: you buy them below face and they repay the face. The price comes from the discount rate d: price = face × (1 − d × days/360).</p>
<div class="esempio">$10,000 for 91 days, discount 4.20%: 10,000 × 0.042 × 91/360 = 106.17 → price $9,893.83.</div>

<h3>The true yield</h3>
<p>The discount rate understates what you earn: it divides by face instead of the price paid, and uses 360 days instead of 365. The investment yield is (100 − P)/P × 365/days, always a little higher.</p>

<h3>Accrued interest</h3>
<p>Buying a coupon bond between payment dates, you pay the seller the part of the coupon they earned: half-year coupon × days elapsed / days in the half-year (actual days). The quoted price is "clean"; what you pay is clean plus accrued.</p>

<h3>A FRA</h3>
<p>Whoever buys a FRA locks in today the rate they will pay over a future period. At fixing they receive N × (fixing − FRA rate) × days/360 if the fixing is higher, and pay if it is lower. Settlement happens at the start of the period, so the difference is discounted at the fixing rate.</p>

<div class="trappola">Day counts matter: discount on 360 and on face, yield on 365 and on price, accrued on actual days in the half-year. A wrong basis easily costs a few basis points.</div>
`,
    },
    scheda: {
      it: 'Bill: prezzo = nominale × (1 − d × giorni/360). Rendimento come investimento = (100 − P)/P × 365/giorni, sopra lo sconto. Rateo = cedola semestrale × giorni passati / giorni del semestre. FRA comprato: N × (fixing − FRA) × giorni/360, scontato di (1 + fixing × giorni/360).',
      en: 'Bill: price = face × (1 − d × days/360). Investment yield = (100 − P)/P × 365/days, above the discount. Accrued = half-year coupon × days elapsed / days in the half-year. Bought FRA: N × (fixing − FRA) × days/360, discounted by (1 + fixing × days/360).',
    },
    fonti: [F.bill, F.rendimento, F.rateo, F.fra],
    test: false,
    nomiLivelli: { it: ['Prezzo di un bill', 'Rendimenti e ratei', 'Un FRA'], en: ['A bill\'s price', 'Yields and accrued interest', 'A FRA'] },
    livelli: [bill, () => (P.chance(0.5) ? rendimento() : rateo()), fra],
  });
})();
