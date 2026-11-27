/* Where the problems come from. Every exercise is written in our own words and numbers; when the idea comes
   from a book or an official page, the trick lists it in `fonti` and the question carries it in `fonte`, so
   the reader can find the original. Nothing is copied from these works: only the reference.

   P.fonte('crack', 'Question 1.19') → { opera: 'crack', dove: 'Question 1.19' }
   `dove` is the place in the work (section, question number, problem title, page of a document) and stays
   in the work's own language, like a book title. An optional `nota` ({ it, en }) says what the reader finds there.
   A work has an author (a person or an institution), a title, edition details and, for pages on the web,
   the address. */
(function () {
  'use strict';
  const P = Palestra;

  P.opere = {
    zhou: {
      autore: 'Xinfeng Zhou', breve: 'Zhou', titolo: 'A Practical Guide to Quantitative Finance Interviews', dettagli: '2008',
    },
    crack: {
      autore: 'Timothy Falcon Crack', breve: 'Crack', titolo: 'Heard on the Street: Quantitative Questions from Wall Street Job Interviews', dettagli: '22nd ed., 2021',
    },
    winkler: {
      autore: 'Peter Winkler', breve: 'Winkler', titolo: 'Mathematical Puzzles', dettagli: 'revised ed., CRC Press, 2024',
    },
    harris: {
      autore: 'Larry Harris', breve: 'Harris', titolo: 'Trading and Exchanges: Market Microstructure for Practitioners', dettagli: 'Oxford University Press, 2003',
    },
    // official and institutional pages, opened and checked on 2026-11-27 without signing in anywhere
    grinstead: {
      autore: 'Charles M. Grinstead and J. Laurie Snell', breve: 'Grinstead and Snell', titolo: 'Introduction to Probability', dettagli: 'Dartmouth College, GNU Free Documentation License',
      url: 'https://math.dartmouth.edu/~prob/prob/prob.pdf',
    },
    treasurydirect: {
      autore: 'U.S. Department of the Treasury (TreasuryDirect)', titolo: 'Understanding Pricing and Interest Rates',
      url: 'https://treasurydirect.gov/marketable-securities/understanding-pricing/',
    },
    cfr356: {
      autore: 'U.S. Department of the Treasury', titolo: '31 CFR Part 356, Appendix B: Formulas and Tables', dettagli: 'text on Cornell LII',
      url: 'https://www.law.cornell.edu/cfr/text/31/appendix-B_to_part_356',
    },
    richmondBill: {
      autore: 'Federal Reserve Bank of Richmond', titolo: 'Instruments of the Money Market, chapter 7: Treasury Bills',
      url: 'https://www.richmondfed.org/-/media/richmondfedorg/publications/research/special_reports/instruments_of_the_money_market/pdf/chapter_07.pdf',
    },
    richmondDerivati: {
      autore: 'Federal Reserve Bank of Richmond', titolo: 'Instruments of the Money Market, chapter 16: Over-the-Counter Interest Rate Derivatives',
      url: 'https://www.richmondfed.org/-/media/richmondfedorg/publications/research/special_reports/instruments_of_the_money_market/pdf/chapter_16.pdf',
    },
    eurexAzioni: {
      autore: 'Eurex', titolo: 'Equity and Equity Index Derivatives: Trading Strategies, Questions and Case Studies',
      url: 'https://www.eurex.com/resource/blob/255024/7a7a8387fea0d34a0588eb755d89648e/data/brochure_equity_equity_index_trading_strategies_questions_casestudies_en.pdf',
    },
    eurexTassi: {
      autore: 'Eurex', titolo: 'Interest Rate Derivatives: Fixed Income Trading Strategies',
      url: 'https://www.eurex.com/resource/blob/298900/fb9a739a9da7ea294164c90678435c13/data/brochure_fixed_income_trading_strategies_en.pdf',
    },
    isda: {
      autore: 'ISDA CDS Standard Model', titolo: 'Standard CDS Examples',
      url: 'https://www.cdsmodel.com/assets/cds-model/docs/Standard%20CDS%20Examples.pdf',
    },
    cboeVix: {
      autore: 'Cboe Global Indices', titolo: 'Cboe Volatility Index Methodology',
      url: 'https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf',
    },
    cboe16: {
      autore: 'Cboe Insights', titolo: 'Inside Volatility Trading: Options and Markets to Be Grateful For', dettagli: '2021',
      url: 'https://www.cboe.com/insights/posts/inside-volatility-trading-options-and-markets-to-be-grateful-for',
    },
    xetra: {
      autore: 'Deutsche Börse', titolo: 'T7 Release 10.1: Market Model for the Trading Venue Xetra',
      url: 'https://www.eurexchange.com/resource/blob/3044352/a96e9c96638e877d08aa81d74c4a5f16/data/T7_Release_10.1_-_Market_Model%20_Xetra.pdf',
    },
  };

  // extra: { nota: { it, en } } and, for a page inside a larger site, { url }
  P.fonte = (opera, dove, extra) => Object.assign({ opera, dove }, extra || {});

  // a level generator whose questions all come from one source: P.conFonte(gen, P.fonte(...))
  P.conFonte = (gen, f) => () => Object.assign(gen(), { fonte: f });

  // plain text, for the answers file: "Zhou, A Practical Guide to Quantitative Finance Interviews (2008), §2.1 "Screwy pirates""
  P.citazione = f => {
    const o = P.opere[f.opera];
    if (!o) return f.dove || '';
    return `${o.breve || o.autore}, ${o.titolo}${o.dettagli ? ` (${o.dettagli})` : ''}${f.dove ? ', ' + f.dove : ''}`;
  };
})();
