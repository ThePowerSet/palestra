/* Library: free material from the open web, for the Library page (#/risorse). One object per resource;
   `why` and `start_here` are written in both languages, in our own words. Every link was opened and checked
   on 2026-11-27, without signing in anywhere. Pages published by trading firms are left out, like firm names
   everywhere else in the app. Nothing here is copied from the resources themselves. */
(function () {
  'use strict';
  Palestra.risorse = [
    {
      "id": "yale-financial-markets-shiller",
      "title": "ECON 252: Financial Markets (2011)",
      "author": "Robert Shiller",
      "publisher": "Open Yale Courses",
      "url": "https://oyc.yale.edu/economics/econ-252-11/lecture-1",
      "type": "video",
      "topics": [
        "rates",
        "options"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Lezioni registrate con trascrizione su come funzionano mercati e istituzioni finanziarie: banche, assicurazioni, forward, futures, opzioni. Contesto per le domande del tipo 'perché esiste questo mercato' e per i colloqui con i desk bancari, non materiale da esercizio.",
        "en": "Recorded lectures with transcripts on how financial markets and institutions work: banks, insurance, forwards, futures, options. Context for 'why does this market exist' questions and bank desk interviews, not drill material."
      },
      "start_here": {
        "it": "Lezione 1, poi le lezioni su forward, futures e mercati delle opzioni.",
        "en": "Lecture 1, then the lectures on forwards, futures and options markets."
      }
    },
    {
      "id": "mit-15-401-finance-theory",
      "title": "Finance Theory I (15.401, Fall 2008)",
      "author": "Andrew Lo",
      "publisher": "MIT OpenCourseWare",
      "url": "https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/",
      "type": "course",
      "topics": [
        "options",
        "rates"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Un corso di finanza di livello master con video delle lezioni su forward e futures, opzioni, CAPM ed efficienza dei mercati. Un buon ripasso del lato finanziario per chi arriva da matematica o ingegneria.",
        "en": "A graduate finance course with lecture videos on forwards and futures, options, CAPM and efficient markets. A solid refresh of the finance side for candidates coming from maths or engineering."
      },
      "start_here": {
        "it": "La lezione Options in Video Lectures and Slides.",
        "en": "The Options lecture under Video Lectures and Slides."
      }
    },
    {
      "id": "oic-put-call-parity",
      "title": "Put/Call Parity",
      "author": "",
      "publisher": "The Options Industry Council (OIC)",
      "url": "https://www.optionseducation.org/advancedconcepts/put-call-parity",
      "type": "article",
      "topics": [
        "options"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Spiega la parità put-call attraverso le posizioni sintetiche, con piccoli esempi svolti e l'effetto di tassi e dividendi. È la relazione che chi ti esamina si aspetta che tu usi senza esitare.",
        "en": "Explains put-call parity through synthetic positions, with small worked examples and the effect of interest rates and dividends. This is the relationship interviewers expect you to use without hesitating."
      }
    },
    {
      "id": "cboe-options-101",
      "title": "The Options Institute Options 101",
      "author": "",
      "publisher": "Cboe",
      "url": "https://www.cboe.com/optionsinstitute/courses/options101",
      "type": "course",
      "topics": [
        "options"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Il corso introduttivo di una borsa su call, put e relativi rischi, con collegamenti a brevi corsi su diagrammi di payoff e spread. Quasi tutti i moduli sono aperti; il percorso più lungo richiede un account gratuito.",
        "en": "An exchange's introductory course on calls, puts and their risks, with links to short courses on payoff diagrams and spreads. Most modules are open; the longer learning plan asks for a free account."
      }
    },
    {
      "id": "oic-understanding-options-greeks",
      "title": "Understanding Options Greeks",
      "author": "",
      "publisher": "The Options Industry Council (OIC)",
      "url": "https://www.optionseducation.org/advancedconcepts/understanding-options-greeks",
      "type": "article",
      "topics": [
        "greeks",
        "options"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Un'introduzione neutrale, curata dall'ente di formazione del settore, a delta, gamma, theta, vega e rho e ai sei input del prezzo di un'opzione. Un primo passaggio affidabile prima di allenarsi sui numeri.",
        "en": "A vendor-neutral introduction from the industry's education body to delta, gamma, theta, vega and rho and to the six inputs of an option price. A reliable first pass before drilling the numbers."
      }
    },
    {
      "id": "oic-rule-of-16",
      "title": "Understanding the 'Rule of 16' in Plain Terms",
      "author": "",
      "publisher": "The Options Industry Council (OIC)",
      "url": "https://www.optionseducation.org/news/understanding-the-rule-of-16-in-plain-terms",
      "type": "article",
      "topics": [
        "volatility",
        "mental-maths"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Un articolo breve su come trasformare la volatilità implicita annua in un movimento giornaliero atteso dividendo per 16, e su cosa quel numero promette e cosa no.",
        "en": "A short article on turning annual implied volatility into an expected daily move by dividing by 16, and on what that number does and does not promise."
      }
    },
    {
      "id": "macroption-rule-of-16",
      "title": "Volatility Rule of 16",
      "author": "",
      "publisher": "Macroption",
      "url": "https://www.macroption.com/volatility-rule-of-16/",
      "type": "article",
      "topics": [
        "volatility",
        "mental-maths"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Un riferimento di una pagina su come passare da volatilità giornaliera ad annua usando 16 invece della radice di 252, con l'errore che questo comporta.",
        "en": "A one-page reference on converting between daily and annual volatility with 16 instead of the square root of 252, with the size of the error that introduces."
      }
    },
    {
      "id": "three-blue-one-brown-bayes",
      "title": "Bayes' theorem",
      "author": "Grant Sanderson",
      "publisher": "3Blue1Brown",
      "url": "https://www.3blue1brown.com/lessons/bayes-theorem",
      "type": "video",
      "topics": [
        "probability"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Una lezione visiva (video più testo) che rende concreta la regola di Bayes con un diagramma ad aree e un esempio svolto. Un buon modo per fissare le domande sul tasso di base prima di allenarle.",
        "en": "A visual lesson (video plus text) that makes Bayes' rule concrete with an area diagram and a worked example. A good way to fix base-rate questions in your head before drilling them."
      }
    },
    {
      "id": "brainstellar-puzzles",
      "title": "Brainstellar Puzzles from Quant Interviews",
      "author": "Varun Seth",
      "publisher": "Brainstellar",
      "url": "https://brainstellar.com/",
      "type": "puzzles",
      "topics": [
        "brainteasers",
        "probability",
        "interview-prep"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Un archivio gratuito di rompicapi in stile colloquio, ordinati per difficoltà e argomento (probabilità, strategia, matematica discreta), ognuno con suggerimento, risposta e soluzione spiegata. Adatto a qualche rompicapo al giorno.",
        "en": "A free bank of interview-style puzzles sorted by difficulty and topic (probability, strategy, discrete maths), each with a hint, the answer and a worked solution. It suits a few puzzles a day."
      },
      "start_here": {
        "it": "L'album Probability, poi i rompicapi Medium.",
        "en": "The Probability album, then the Medium puzzles."
      }
    },
    {
      "id": "grinstead-snell-probability",
      "title": "Grinstead and Snell's Introduction to Probability",
      "author": "Charles M. Grinstead, J. Laurie Snell",
      "publisher": "Dartmouth College (originally American Mathematical Society; GNU Free Documentation License)",
      "url": "https://math.dartmouth.edu/~prob/prob/prob.pdf",
      "type": "book",
      "topics": [
        "probability",
        "brainteasers"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Un manuale universitario completo di probabilità, distribuito gratis dagli autori. I capitoli su calcolo combinatorio, probabilità condizionata, valore atteso e passeggiate aleatorie coprono quasi tutto ciò su cui si basano le domande di probabilità nei colloqui, con molti esercizi.",
        "en": "A complete undergraduate probability textbook that the authors released for free. The chapters on combinatorics, conditional probability, expected value and random walks cover most of what interview probability questions draw on, with many exercises."
      },
      "start_here": {
        "it": "Capitolo 4 (probabilità condizionata), poi il 6 (valore atteso e varianza) e il 12 (passeggiate aleatorie).",
        "en": "Chapter 4 (Conditional Probability), then Chapter 6 (Expected Value and Variance) and Chapter 12 (Random Walks)."
      }
    },
    {
      "id": "mit-18-05-probability-statistics",
      "title": "Introduction to Probability and Statistics (18.05, Spring 2022)",
      "author": "Jeremy Orloff, Jennifer French Kamrin",
      "publisher": "MIT OpenCourseWare",
      "url": "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/",
      "type": "course",
      "topics": [
        "probability",
        "statistics"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Letture brevi e chiare, con problem set ed esami corredati di soluzioni. Copre sia la probabilità sia la statistica di base (intervalli di confidenza, test d'ipotesi) che compare nei colloqui di quant research.",
        "en": "Short, clear readings with problem sets and exams that come with solutions. It covers both probability and the basic statistics (confidence intervals, hypothesis tests) asked in quant research interviews."
      },
      "start_here": {
        "it": "Class 3 (probabilità condizionata, indipendenza, Bayes) e Class 4 (valore atteso).",
        "en": "Class 3 (conditional probability, independence, Bayes) and Class 4 (expected value)."
      }
    },
    {
      "id": "openintro-statistics",
      "title": "OpenIntro Statistics",
      "author": "David Diez, Mine Çetinkaya-Rundel, Christopher D. Barr",
      "publisher": "OpenIntro",
      "url": "https://www.openintro.org/book/os/",
      "type": "book",
      "topics": [
        "statistics",
        "probability"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Un manuale introduttivo di statistica il cui PDF si scarica al prezzo che scegli, anche zero. Serve a ripassare campionamento, errori standard, intervalli di confidenza e regressione prima dei colloqui di quant research o di risk.",
        "en": "An introductory statistics textbook whose PDF you can download at a price you choose, including zero. Use it to refresh sampling, standard errors, confidence intervals and regression before quant research or risk interviews."
      },
      "start_here": {
        "it": "Capitolo 3 (probabilità), poi il capitolo sui fondamenti dell'inferenza.",
        "en": "Chapter 3 (Probability), then the chapter on foundations for inference."
      }
    },
    {
      "id": "mit-6-041sc-probability",
      "title": "Probabilistic Systems Analysis and Applied Probability (6.041SC, Fall 2013)",
      "author": "John Tsitsiklis",
      "publisher": "MIT OpenCourseWare",
      "url": "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/",
      "type": "course",
      "topics": [
        "probability",
        "statistics"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Un corso completo di probabilità pensato per lo studio autonomo: video delle lezioni, video di esercitazioni e problem set ed esami con soluzioni. Utile se impari meglio guardando qualcuno che risolve i problemi.",
        "en": "A full probability course built for self-study: lecture videos, recitation and tutorial videos, and problem sets and exams with solutions. Good if you learn better by watching someone solve problems."
      },
      "start_here": {
        "it": "Lezione 2, condizionamento e regola di Bayes, dopo un'occhiata alla Lezione 1.",
        "en": "Lecture 2, Conditioning and Bayes' Rule, after a quick look at Lecture 1."
      }
    },
    {
      "id": "seeing-theory",
      "title": "Seeing Theory",
      "author": "Daniel Kunin, Jingru Guo, Tyler Dae Devlin, Daniel Xiang",
      "publisher": "Brown University",
      "url": "https://seeing-theory.brown.edu/",
      "type": "tool",
      "topics": [
        "probability",
        "statistics"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Un'introduzione visiva e interattiva a probabilità e statistica in sei capitoli brevi. Poco profonda, ma costruisce in fretta l'intuizione su probabilità condizionata e distribuzioni. Il sito è segnato come archiviato e funziona ancora.",
        "en": "An interactive visual introduction to probability and statistics in six short chapters. Light on depth, but it builds intuition for conditional probability and distributions quickly. The site is marked as archived and still works."
      },
      "start_here": {
        "it": "Capitolo 2, Compound Probability.",
        "en": "Chapter 2, Compound Probability."
      }
    },
    {
      "id": "estimathon-rules",
      "title": "Estimathon Rules and Instructions",
      "author": "",
      "publisher": "UC Berkeley Mathematics (ARML 2020 materials)",
      "url": "https://math.berkeley.edu/~moorxu/2020ARML/files/EstimathonRules.pdf",
      "type": "notes",
      "topics": [
        "estimation"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Due pagine che definiscono il formato Estimathon: 13 domande di stima a cui si risponde con intervalli, un punteggio che cresce con l'ampiezza di ogni intervallo corretto ed errori che raddoppiano il punteggio della squadra. Da leggere per capire perché un intervallo calibrato batte una stima precisa.",
        "en": "Two pages that define the Estimathon format: 13 estimation questions answered as intervals, a score that grows with the width of each correct interval, and misses that double the team score. Read it to see why a calibrated range beats a precise guess."
      },
      "start_here": {
        "it": "La sezione Scoring a pagina 2.",
        "en": "The Scoring section on page 2."
      }
    },
    {
      "id": "lesswrong-fermi-estimates",
      "title": "Fermi Estimates",
      "author": "Luke Muehlhauser",
      "publisher": "LessWrong",
      "url": "https://www.lesswrong.com/posts/PsEppdvgRisz5xAHG/fermi-estimates",
      "type": "article",
      "topics": [
        "estimation"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Un tutorial chiaro (2013) sulle stime alla Fermi: scomporre, arrotondare con decisione, delimitare con la media geometrica e controllare i numeri intermedi, con esempi svolti.",
        "en": "A clear tutorial (2013) on making Fermi estimates: decompose, round hard, bound with a geometric mean and sanity-check intermediate numbers, with worked examples."
      }
    },
    {
      "id": "umd-fermi-problems",
      "title": "University of Maryland Fermi Problems Site",
      "author": "E. F. Redish",
      "publisher": "University of Maryland Physics Education Research Group",
      "url": "https://www.physics.umd.edu/perg/fermi/fermi.htm",
      "type": "puzzles",
      "topics": [
        "estimation"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Un semplice elenco di problemi di stima alla Fermi divisi per argomento, senza soluzioni svolte. Ottimo materiale grezzo per esercitarsi a voce: scomporre, stimare ogni fattore, controllare che il risultato abbia senso.",
        "en": "A plain list of Fermi estimation problems by topic, without worked answers. Good raw material for practising out loud: decompose, estimate each factor, check that the result makes sense."
      },
      "start_here": {
        "it": "La sezione General.",
        "en": "The General section."
      }
    },
    {
      "id": "zetamac-arithmetic",
      "title": "Arithmetic Game – Online Speed Drill",
      "author": "",
      "publisher": "Zetamac",
      "url": "https://arithmetic.zetamac.com/",
      "type": "tool",
      "topics": [
        "mental-maths"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Un esercizio di aritmetica a tempo (addizioni, sottrazioni, moltiplicazioni, divisioni) con intervalli e durata regolabili, senza account. Il riferimento abituale per le sezioni di velocità dei test di trading.",
        "en": "A timed arithmetic drill (addition, subtraction, multiplication, division) with adjustable ranges and length, no account needed. The usual benchmark for the speed sections of trading tests."
      },
      "start_here": {
        "it": "Impostazioni predefinite, 120 secondi, una volta al giorno; annota il punteggio.",
        "en": "Default settings, 120 seconds, once a day; write down the score."
      }
    },
    {
      "id": "fred",
      "title": "Federal Reserve Economic Data (FRED)",
      "author": "",
      "publisher": "Federal Reserve Bank of St. Louis",
      "url": "https://fred.stlouisfed.org/",
      "type": "tool",
      "topics": [
        "rates",
        "statistics"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Serie storiche gratuite di rendimenti, tassi ufficiali, spread e dati macro. Serve a conoscere i livelli attuali (rendimenti a 2 e 10 anni, pendenza della curva) prima di un colloquio e a esercitarsi nella stima con numeri veri.",
        "en": "Free time series for yields, policy rates, spreads and macro data. Use it to know current levels (2-year and 10-year yields, curve slope) before an interview and to practise estimation with real numbers."
      }
    },
    {
      "id": "python-data-science-handbook",
      "title": "Python Data Science Handbook",
      "author": "Jake VanderPlas",
      "publisher": "jakevdp.github.io (full text of the O'Reilly book)",
      "url": "https://jakevdp.github.io/PythonDataScienceHandbook/",
      "type": "book",
      "topics": [
        "programming",
        "statistics"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Il testo completo e gratuito su NumPy, pandas, Matplotlib e scikit-learn, scritto come notebook. Un compagno pratico quando il colloquio include un esercizio sui dati.",
        "en": "The full free text on NumPy, pandas, Matplotlib and scikit-learn, written as notebooks. A practical companion when an interview includes a data exercise."
      }
    },
    {
      "id": "ecb-estr",
      "title": "Euro short-term rate (€STR)",
      "author": "",
      "publisher": "European Central Bank",
      "url": "https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_short-term_rate/html/index.en.html",
      "type": "tool",
      "topics": [
        "rates"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "La pagina della BCE sul tasso overnight di riferimento dell'euro: cosa misura, quando viene pubblicato, e i dati. È l'equivalente europeo del SOFR, rilevante per i desk europei e per le candidature alla BCE.",
        "en": "The ECB page for the euro overnight benchmark: what it measures, when it is published, and the data. The euro counterpart of SOFR, relevant for European desks and ECB applications."
      }
    },
    {
      "id": "nyfed-sofr",
      "title": "Secured Overnight Financing Rate Data",
      "author": "",
      "publisher": "Federal Reserve Bank of New York",
      "url": "https://www.newyorkfed.org/markets/reference-rates/sofr",
      "type": "tool",
      "topics": [
        "rates"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "La pagina ufficiale del SOFR: cosa misura il tasso (una mediana ponderata per volumi delle operazioni repo overnight su titoli del Tesoro), quando viene pubblicato, e i dati. Da conoscere prima di qualsiasi colloquio con un desk tassi.",
        "en": "The official SOFR page: what the rate measures (a volume-weighted median of overnight Treasury repo trades), when it is published, and the data. Know this before any rates desk interview."
      }
    },
    {
      "id": "treasurydirect-understanding-pricing",
      "title": "Understanding Pricing and Interest Rates",
      "author": "",
      "publisher": "U.S. Department of the Treasury, Bureau of the Fiscal Service (TreasuryDirect)",
      "url": "https://www.treasurydirect.gov/marketable-securities/understanding-pricing/",
      "type": "article",
      "topics": [
        "rates"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "Come si prezzano bill, note, bond, TIPS e titoli a tasso variabile del Tesoro americano, con la formula di sconto per i bill e i prezzi per 100 di nominale per i titoli con cedola. Breve e autorevole.",
        "en": "How Treasury bills, notes, bonds, TIPS and floating-rate notes are priced, with the discount formula for bills and prices per 100 of face value for coupon securities. Short and authoritative."
      }
    },
    {
      "id": "python-for-data-analysis",
      "title": "Python for Data Analysis, 3E",
      "author": "Wes McKinney",
      "publisher": "wesmckinney.com (open-access edition of the O'Reilly book)",
      "url": "https://wesmckinney.com/book/",
      "type": "book",
      "topics": [
        "programming"
      ],
      "level": 1,
      "free": true,
      "why": {
        "it": "L'edizione ad accesso libero del libro di riferimento su pandas, scritto dal creatore della libreria. Il riferimento per le prove a casa di quant research basate sulla manipolazione di dati.",
        "en": "The open-access edition of the standard pandas book, by the library's creator. The reference for data-handling tasks in quant research take-home tests."
      },
      "start_here": {
        "it": "Capitolo 5, Getting Started with pandas.",
        "en": "Chapter 5, Getting Started with pandas."
      }
    },
    {
      "id": "eurex-trading-strategies",
      "title": "Equity and Equity Index Derivatives: Trading Strategies",
      "author": "",
      "publisher": "Eurex",
      "url": "https://www.eurex.com/resource/blob/255112/ec47e33d6400296c4873a6090d3daccf/data/brochure_equity_equity_index_trading_strategies_en_en.pdf",
      "type": "notes",
      "topics": [
        "options",
        "greeks"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Una brochure di borsa che illustra le strategie in opzioni, di base e di volatilità, con le greche di ciascuna e i diagrammi di payoff. Un documento datato, ma la meccanica non è cambiata.",
        "en": "An exchange brochure that walks through basic and volatility option strategies and the Greeks of each, with payoff diagrams. An older document, but the mechanics have not changed."
      }
    },
    {
      "id": "gundersen-atm-approximation",
      "title": "Estimating ATM Option Prices",
      "author": "Gregory Gundersen",
      "publisher": "gregorygundersen.com",
      "url": "https://gregorygundersen.com/blog/2023/08/19/atm-approximation/",
      "type": "article",
      "topics": [
        "options",
        "volatility",
        "mental-maths"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Una breve derivazione del perché una call o una put at-the-money vale circa 0.4·S·σ·√T, da uno sviluppo di Taylor di Black-Scholes e dalla parità put-call, con un esempio svolto. Da leggere per sapere da dove viene la scorciatoia del desk e quando smette di funzionare.",
        "en": "A short derivation of why an at-the-money call or put is worth about 0.4·S·σ·√T, from a Taylor expansion of Black-Scholes and put-call parity, with a worked example. Read it to know where the desk shortcut comes from and when it stops working."
      }
    },
    {
      "id": "haugh-foundations-financial-engineering",
      "title": "IEOR E4706: Foundations of Financial Engineering",
      "author": "Martin Haugh",
      "publisher": "Martin Haugh (Columbia University course, Fall 2016)",
      "url": "https://martin-haugh.github.io/teaching/foundations-fe",
      "type": "notes",
      "topics": [
        "options",
        "rates",
        "credit"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Appunti ed esercizi gratuiti di un corso di master: forward e futures, pricing con martingale, struttura a termine, Black-Scholes, credito. Derivazioni pulite e compatte da ripassare prima dei colloqui tecnici.",
        "en": "Free lecture notes and assignments from a master's course: forwards and futures, martingale pricing, term structure, Black-Scholes, credit. Clean, compact derivations to revise before technical interviews."
      },
      "start_here": {
        "it": "Lecture Notes, voce 3: Martingale Pricing.",
        "en": "Lecture Notes, item 3: Martingale Pricing."
      }
    },
    {
      "id": "hull-options-futures-derivatives",
      "title": "Options, Futures, and Other Derivatives, 11th edition",
      "author": "John C. Hull",
      "publisher": "Pearson",
      "url": "https://www.pearson.com/en-us/subject-catalog/p/options-futures-and-other-derivatives/P200000005938",
      "type": "book",
      "topics": [
        "options",
        "greeks",
        "rates",
        "credit"
      ],
      "level": 2,
      "free": false,
      "why": {
        "it": "Il manuale di riferimento sui derivati: forward, swap, Black-Scholes-Merton, greche, smile di volatilità, derivati di credito. Da consultare quando serve, non da leggere dall'inizio alla fine.",
        "en": "The standard reference textbook on derivatives: forwards, swaps, Black-Scholes-Merton, Greeks, volatility smiles, credit derivatives. Use it to look things up rather than to read cover to cover."
      },
      "start_here": {
        "it": "I capitoli sulle greche e sugli smile di volatilità.",
        "en": "The chapters on the Greeks and on volatility smiles."
      }
    },
    {
      "id": "moontower-site",
      "title": "Party at the Moontower",
      "author": "Kris Abdelmessih",
      "publisher": "Moontower",
      "url": "https://moontowermeta.com/",
      "type": "newsletter",
      "topics": [
        "options",
        "volatility",
        "interview-prep"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Saggi gratuiti e un wiki sulla volatilità scritti da un ex trader di opzioni, con l'accento sull'intuizione: straddle e percentuali di successo, la teoria delle opzioni come modo di decidere, trading simulato. Buona lettura tra una sessione di esercizi e l'altra.",
        "en": "Free essays and a volatility wiki by a former options trader, focused on intuition: straddles and win rates, option theory as a way to make decisions, mock trading. Good reading between drill sessions."
      },
      "start_here": {
        "it": "Il Moontower Quant Codex (il wiki sulla volatilità), poi l'elenco Top Money Posts.",
        "en": "The Moontower Quant Codex (the volatility wiki), then the Top Money Posts list."
      }
    },
    {
      "id": "mit-18-s096-math-finance",
      "title": "Topics in Mathematics with Applications in Finance (18.S096, Fall 2013)",
      "author": "Peter Kempthorne, Choongbum Lee, Vasily Strela, Jake Xia",
      "publisher": "MIT OpenCourseWare",
      "url": "https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/",
      "type": "course",
      "topics": [
        "statistics",
        "probability",
        "options"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Lezioni che affiancano a uno strumento matematico (algebra lineare, processi stocastici, regressione, serie storiche) professionisti che spiegano come lo si usa in finanza. Video, slide e problem set gratuiti.",
        "en": "Lectures that pair a mathematical tool (linear algebra, stochastic processes, regression, time series) with practitioners explaining how it is used in finance. Videos, slides and problem sets are free."
      },
      "start_here": {
        "it": "Lecture Notes & Slides, oppure la pagina Video Lectures.",
        "en": "Lecture Notes & Slides, or the Video Lectures page."
      }
    },
    {
      "id": "bennett-trading-volatility",
      "title": "Trading Volatility: Trading Volatility, Correlation, Term Structure and Skew",
      "author": "Colin Bennett",
      "publisher": "trading-volatility.com (author's site)",
      "url": "http://trading-volatility.com/",
      "type": "book",
      "topics": [
        "volatility",
        "options"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Un libro da professionisti sul trading di volatilità (variance swap, skew, struttura a termine, correlazione) che l'autore offre in PDF gratuito sul proprio sito. Colma il vuoto tra i libri introduttivi sulle opzioni e i testi di modellistica quantitativa.",
        "en": "A practitioner book on volatility trading (variance swaps, skew, term structure, correlation) that the author offers as a free PDF on his own site. It fills the gap between introductory options books and quant modelling texts."
      },
      "start_here": {
        "it": "La pagina Downloads per il PDF.",
        "en": "The Downloads page for the PDF."
      }
    },
    {
      "id": "sinclair-volatility-trading",
      "title": "Volatility Trading, + Website, 2nd Edition",
      "author": "Euan Sinclair",
      "publisher": "Wiley",
      "url": "https://www.wiley.com/en-us/Volatility+Trading,+++Website,+2nd+Edition-p-9781118347133",
      "type": "book",
      "topics": [
        "volatility",
        "options"
      ],
      "level": 2,
      "free": false,
      "why": {
        "it": "Un libro scritto da un trader su come misurare la volatilità, coprirsi, dimensionare e giudicare le operazioni in opzioni. La pagina dell'editore offre gratis l'indice e il capitolo 1 come estratti.",
        "en": "A trader's book on measuring volatility, hedging, sizing and judging option trades. The publisher page offers the table of contents and Chapter 1 as free excerpts."
      }
    },
    {
      "id": "vollib",
      "title": "vollib",
      "author": "Larry Richards",
      "publisher": "vollib",
      "url": "https://vollib.org/",
      "type": "tool",
      "topics": [
        "options",
        "greeks",
        "programming"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Una libreria open source in Python e TypeScript per prezzi di opzioni, volatilità implicita e greche nei modelli Black, Black-Scholes e Black-Scholes-Merton. Comoda per confrontare le tue approssimazioni mentali con i valori esatti.",
        "en": "An open-source Python and TypeScript library for option prices, implied volatility and Greeks under Black, Black-Scholes and Black-Scholes-Merton. Handy for checking your mental approximations against exact values."
      }
    },
    {
      "id": "moontower-approximating-gamma",
      "title": "approximating gamma in your head",
      "author": "Kris Abdelmessih",
      "publisher": "Moontower",
      "url": "https://moontowermeta.com/approximating-gamma-in-your-head/",
      "type": "article",
      "topics": [
        "greeks",
        "mental-maths"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Una breve nota di un ex market maker in opzioni su come stimare a mente il gamma di uno straddle at-the-money (circa 0.64 diviso il prezzo dello straddle) e su come cambia con spot, volatilità e tempo.",
        "en": "A short note by a former options market maker on estimating the gamma of an at-the-money straddle in your head (about 0.64 divided by the straddle price) and on how spot, volatility and time change it."
      }
    },
    {
      "id": "quantocracy",
      "title": "Quant Mashup",
      "author": "",
      "publisher": "Quantocracy",
      "url": "https://quantocracy.com/",
      "type": "newsletter",
      "topics": [
        "statistics",
        "volatility",
        "programming"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Un flusso quotidiano di link a blog di finanza quantitativa (volatilità, backtesting, statistica). Un modo poco impegnativo per continuare a leggere ricerca vera durante la ricerca di lavoro; la qualità dipende dalla fonte collegata.",
        "en": "A daily feed of links to quant finance blogs (volatility, backtesting, statistics). A low-effort way to keep reading real research during a job search; the quality depends on the linked source."
      }
    },
    {
      "id": "fiddler-on-the-proof",
      "title": "Fiddler on the Proof",
      "author": "Zach Wissner-Gross",
      "publisher": "Substack",
      "url": "https://thefiddler.substack.com/",
      "type": "newsletter",
      "topics": [
        "brainteasers",
        "probability"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Una newsletter di rompicapi con due nuovi problemi ogni venerdì, molti di probabilità e valore atteso. La pagina principale è gratuita; alcuni post dell'archivio sono riservati agli abbonati paganti.",
        "en": "A puzzle newsletter with two new puzzles every Friday, many of them on probability and expected value. The landing page is free; some archive posts are for paying subscribers."
      }
    },
    {
      "id": "chan-probability-for-data-science",
      "title": "Introduction to Probability for Data Science (2nd edition)",
      "author": "Stanley H. Chan",
      "publisher": "Michigan Publishing",
      "url": "https://probability4datascience.com/",
      "type": "book",
      "topics": [
        "probability",
        "statistics"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Un manuale di probabilità gratuito online, con un taglio ingegneristico: variabili aleatorie discrete e continue, distribuzioni congiunte, stima e regressione, con esempi in Python.",
        "en": "A free online probability textbook with an engineering flavour: discrete and continuous random variables, joint distributions, estimation and regression, with Python examples."
      },
      "start_here": {
        "it": "Capitolo 2 (probabilità), poi capitolo 3 (variabili aleatorie discrete).",
        "en": "Chapter 2 (Probability), then Chapter 3 (Discrete Random Variables)."
      }
    },
    {
      "id": "blitzstein-hwang-introduction-to-probability",
      "title": "Introduction to Probability, Second Edition",
      "author": "Joseph K. Blitzstein, Jessica Hwang",
      "publisher": "Chapman & Hall/CRC (Taylor & Francis)",
      "url": "https://www.routledge.com/products/9780429428357",
      "type": "book",
      "topics": [
        "probability"
      ],
      "level": 2,
      "free": false,
      "why": {
        "it": "Il manuale di Stat 110 di Harvard, costruito su 'storie' e condizionamento, che è proprio il modo in cui di solito si risolvono le domande di probabilità nei colloqui. La pagina dell'editore riguarda il libro a stampa; rimanda ai materiali gratuiti sul sito del corso degli autori (soluzioni scelte, esercizi aggiuntivi, esami di prova).",
        "en": "The textbook of Harvard's Stat 110, built around 'stories' and conditioning, which is how interview probability problems are usually cracked. The publisher page is for the print book; it points to free supplements on the authors' course site (selected solutions, extra problems, sample exams)."
      },
      "start_here": {
        "it": "Capitolo 2 (probabilità condizionata) e capitolo 4 (valore atteso).",
        "en": "Chapter 2 (Conditional probability) and Chapter 4 (Expectation)."
      }
    },
    {
      "id": "winkler-mathematical-puzzles-revised",
      "title": "Mathematical Puzzles, Revised Edition",
      "author": "Peter Winkler",
      "publisher": "Dartmouth College, Department of Mathematics",
      "url": "https://math.dartmouth.edu/news-resources/electronic/puzzlebook/",
      "type": "puzzles",
      "topics": [
        "brainteasers",
        "probability"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Una raccolta ampia e ben scelta di rompicapi, di un matematico noto proprio per questo genere di problemi; Dartmouth la pubblica online con enigmi, suggerimenti e il PDF del libro. Ottima per le domande del tipo 'ragiona prima di calcolare' che piacciono nei colloqui di trading.",
        "en": "A large, carefully chosen puzzle collection by a mathematician known for exactly this kind of problem, posted online by Dartmouth with the puzzles, hints and the book PDF. Good for the 'think before you compute' questions that trading interviews like."
      },
      "start_here": {
        "it": "Capitolo 10, In All Probability, e capitolo 14, Great Expectation.",
        "en": "Chapter 10, In All Probability, and Chapter 14, Great Expectation."
      }
    },
    {
      "id": "mit-18-600-probability",
      "title": "Probability and Random Variables (18.600, Fall 2019)",
      "author": "Scott Sheffield",
      "publisher": "MIT OpenCourseWare",
      "url": "https://ocw.mit.edu/courses/18-600-probability-and-random-variables-fall-2019/",
      "type": "course",
      "topics": [
        "probability"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Appunti di 39 lezioni più problem set ed esami. Va un passo oltre le basi e si chiude con martingale, probabilità neutrale al rischio e Black-Scholes: un ponte tra la probabilità dei colloqui e il pricing delle opzioni.",
        "en": "Lecture notes for 39 sessions plus problem sets and exams. It goes a step beyond the basics and ends with martingales, risk-neutral probability and Black-Scholes, which links interview probability to option pricing."
      },
      "start_here": {
        "it": "Lezioni 6-7 (probabilità condizionata, Bayes) e 9 (valore atteso); più avanti la 34-36 su martingale e Black-Scholes.",
        "en": "Lectures 6-7 (conditional probability, Bayes) and 9 (expectation); later 34-36 for martingales and Black-Scholes."
      }
    },
    {
      "id": "thorp-kelly-criterion",
      "title": "The Kelly Criterion in Blackjack, Sports Betting, and the Stock Market",
      "author": "Edward O. Thorp",
      "publisher": "Occidental College course page (paper presented in 1997, revised 1998)",
      "url": "https://sites.oxy.edu/lengyel/M330/thorp/paper.htm",
      "type": "paper",
      "topics": [
        "probability",
        "market-making"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Il resoconto dello stesso Thorp sul dimensionamento delle puntate secondo Kelly, dal lancio di una moneta ai titoli, in capitoli brevi. Il riferimento dietro le domande sul dimensionamento delle posizioni.",
        "en": "Thorp's own account of Kelly bet sizing, from coin tosses to securities, in short chapters. The reference behind position-sizing questions."
      },
      "start_here": {
        "it": "Capitolo 3, Optimal growth: Kelly criterion formulas for practitioners.",
        "en": "Chapter 3, Optimal growth: Kelly criterion formulas for practitioners."
      }
    },
    {
      "id": "project-euler",
      "title": "Project Euler",
      "author": "",
      "publisher": "Project Euler",
      "url": "https://projecteuler.net/",
      "type": "puzzles",
      "topics": [
        "programming",
        "brainteasers"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Centinaia di problemi matematici che richiedono un breve programma per essere risolti. Buon allenamento per i round di coding dei ruoli quant; le soluzioni non sono pubblicate sul sito, si verifica solo la risposta finale. I problemi si leggono senza account.",
        "en": "Hundreds of maths problems that need a short program to solve. Good practice for the coding rounds of quant roles; solutions are not published on the site, so you only check your final answer. Problems can be read without an account."
      },
      "start_here": {
        "it": "Archives, i primi 50 problemi.",
        "en": "Archives, the first 50 problems."
      }
    },
    {
      "id": "oeis",
      "title": "The On-Line Encyclopedia of Integer Sequences (OEIS)",
      "author": "",
      "publisher": "OEIS Foundation",
      "url": "https://oeis.org/",
      "type": "tool",
      "topics": [
        "mental-maths",
        "brainteasers"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Un database consultabile di circa 400,000 successioni di interi. Utile dopo un esercizio sulle successioni: inserisci i termini e vedi quali regole li generano.",
        "en": "A searchable database of about 400,000 integer sequences. Useful after a sequence drill: type the terms and see which rules generate them."
      }
    },
    {
      "id": "hasbrouck-securities-trading",
      "title": "Securities Trading: Principles and Procedures",
      "author": "Joel Hasbrouck",
      "publisher": "NYU Stern School of Business (author's page)",
      "url": "https://pages.stern.nyu.edu/~jhasbrou/STPP/STPPindex.html",
      "type": "notes",
      "topics": [
        "microstructure",
        "market-making"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Una bozza di manuale, libera da leggere anche se protetta da copyright, su come funziona davvero la negoziazione: book di ordini, aste e dealer, con esercizi per capitolo e un foglio di calcolo sul modello di trading sequenziale con trader informati.",
        "en": "A draft textbook, free to read though copyrighted, on how trading actually works: limit order books, auctions and dealers, with chapter problems and a spreadsheet model of sequential trading with informed traders."
      },
      "start_here": {
        "it": "Il PDF della bozza, poi il PDF con gli esercizi dei capitoli.",
        "en": "The draft PDF, then the chapter problems PDF."
      }
    },
    {
      "id": "harris-trading-and-exchanges",
      "title": "Trading and Exchanges: Market Microstructure for Practitioners",
      "author": "Larry Harris",
      "publisher": "Oxford University Press",
      "url": "https://academic.oup.com/book/52292",
      "type": "book",
      "topics": [
        "microstructure",
        "market-making"
      ],
      "level": 2,
      "free": false,
      "why": {
        "it": "Il libro di riferimento su chi negozia, perché, e come la struttura del mercato influenza i prezzi: dealer, broker, tipi di ordine, trader informati, liquidità. Conviene leggerne capitoli scelti prima dei colloqui con i market maker.",
        "en": "The reference book on who trades, why, and how market structure shapes prices: dealers, brokers, order types, informed traders, liquidity. Read selected chapters before market-maker interviews."
      }
    },
    {
      "id": "guesstimation-book",
      "title": "Guesstimation: Solving the World's Problems on the Back of a Cocktail Napkin",
      "author": "Lawrence Weinstein, John A. Adam",
      "publisher": "Princeton University Press",
      "url": "https://press.princeton.edu/books/paperback/9780691129495/guesstimation",
      "type": "book",
      "topics": [
        "estimation"
      ],
      "level": 2,
      "free": false,
      "why": {
        "it": "Circa 80 problemi di stima svolti in forma di domanda e risposta, ognuno risolto con ipotesi plausibili e aritmetica semplice. Un buon serbatoio di esercizi una volta acquisito il metodo.",
        "en": "Around 80 worked estimation problems in question-and-answer form, each solved with plausible assumptions and simple arithmetic. A good bank of exercises once the basic method is in place."
      }
    },
    {
      "id": "flirting-with-models",
      "title": "Flirting with Models",
      "author": "Corey Hoffstein",
      "publisher": "Flirting with Models (podcast)",
      "url": "https://www.flirtingwithmodels.com/",
      "type": "podcast",
      "topics": [
        "statistics",
        "interview-prep"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Lunghe interviste a ricercatori e gestori che seguono strategie sistematiche. Utile per sentire come i professionisti parlano di segnali, rischio e processo di ricerca prima dei colloqui di quant research.",
        "en": "Long interviews with researchers and portfolio managers who run systematic strategies. Useful for hearing how practitioners talk about signals, risk and research process before quant research interviews."
      }
    },
    {
      "id": "quantecon-lectures",
      "title": "Lectures – QuantEcon",
      "author": "",
      "publisher": "QuantEcon",
      "url": "https://quantecon.org/lectures/",
      "type": "course",
      "topics": [
        "programming",
        "statistics"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Serie di lezioni gratuite su Python (e Julia) per economia e finanza, dalle basi della programmazione ai metodi numerici. Utile per affinare NumPy e il Python scientifico prima dei round di coding.",
        "en": "Free lecture series on Python (and Julia) for economics and finance, from programming basics to numerical methods. Good for sharpening NumPy and scientific Python before coding rounds."
      },
      "start_here": {
        "it": "La serie di lezioni sulla programmazione in Python.",
        "en": "The Python programming lecture series."
      }
    },
    {
      "id": "think-stats-3e",
      "title": "Think Stats, 3rd Edition",
      "author": "Allen B. Downey",
      "publisher": "Green Tea Press",
      "url": "https://greenteapress.com/wp/think-stats-3e/",
      "type": "book",
      "topics": [
        "statistics",
        "programming"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Statistica insegnata con notebook Python su dati reali, gratuita online con licenza Creative Commons. Più utile per i ruoli di quant research e di analisi dati che per i rompicapi dei colloqui di trading.",
        "en": "Statistics taught through Python notebooks on real data, free online under a Creative Commons licence. More useful for quant research and data roles than for trading brainteasers."
      },
      "start_here": {
        "it": "Capitoli 3-4 (funzioni di massa di probabilità e funzioni di ripartizione).",
        "en": "Chapters 3-4 (probability mass functions and cumulative distribution functions)."
      }
    },
    {
      "id": "ecb-euro-area-yield-curves",
      "title": "Euro area yield curves",
      "author": "",
      "publisher": "European Central Bank",
      "url": "https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_area_yield_curves/html/index.en.html",
      "type": "tool",
      "topics": [
        "rates"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Curve giornaliere dei rendimenti dei titoli di Stato dell'area euro, nelle versioni zero coupon, forward e par, dal 2004. Ottime per esercitarsi su tassi forward e roll-down con curve reali.",
        "en": "Daily euro area government yield curves in zero-coupon, forward and par form since 2004. Good for practising forward-rate and roll-down calculations on real curves."
      }
    },
    {
      "id": "tuckman-serrat-fixed-income",
      "title": "Fixed Income Securities: Tools for Today's Markets, 4th Edition",
      "author": "Bruce Tuckman, Angel Serrat",
      "publisher": "Wiley",
      "url": "https://www.wiley.com/en-us/Fixed+Income+Securities%3A+Tools+for+Today%27s+Markets%2C+4th+Edition-p-9781119835554",
      "type": "book",
      "topics": [
        "rates",
        "credit"
      ],
      "level": 2,
      "free": false,
      "why": {
        "it": "Il manuale di riferimento per chi lavora sul reddito fisso: DV01, duration e convessità, repo, swap, futures, CDS, con il passaggio dal LIBOR al SOFR in questa edizione. La pagina dell'editore offre estratti gratuiti in PDF.",
        "en": "The standard practitioner textbook on fixed income: DV01, duration and convexity, repo, swaps, futures, CDS, with the move from LIBOR to SOFR in this edition. The publisher page offers free PDF excerpts."
      }
    },
    {
      "id": "ftse-russell-carry-concept",
      "title": "The Carry Concept (FTSE Fixed Income Factor Research Series)",
      "author": "",
      "publisher": "FTSE Russell (LSEG)",
      "url": "https://www.lseg.com/content/dam/ftse-russell/en_us/documents/research/ftse-fixed-income-factor-research-series-carry-concept.pdf",
      "type": "paper",
      "topics": [
        "rates"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Una spiegazione chiara di carry e roll-down sui mercati obbligazionari, con un grafico che separa il rendimento che maturi dal guadagno di prezzo dovuto allo scivolamento lungo la curva. Utile per la domanda 'qual è il carry di questa posizione'.",
        "en": "A clear explanation of carry and roll-down in bond markets, with a diagram that separates the yield you earn from the price gain of rolling down the curve. Useful for the 'what is the carry on this position' question."
      },
      "start_here": {
        "it": "Pagina 3, l'introduzione al concetto di carry e l'Exhibit 1.",
        "en": "Page 3, the introduction to the carry concept and Exhibit 1."
      }
    },
    {
      "id": "isda-standard-cds-examples",
      "title": "Standard CDS Examples",
      "author": "",
      "publisher": "ISDA",
      "url": "https://www.cdsmodel.com/assets/cds-model/docs/Standard%20CDS%20Examples.pdf",
      "type": "notes",
      "topics": [
        "credit"
      ],
      "level": 2,
      "free": true,
      "why": {
        "it": "Un documento breve con esempi svolti delle convenzioni dei CDS standard: scadenze fisse il 20 di marzo, giugno, settembre e dicembre, cedole trimestrali su base actual/360 e il conteggio dei periodi di maturazione.",
        "en": "A short document with worked examples of standard CDS conventions: fixed maturity dates on the 20th of March, June, September and December, quarterly coupons on an actual/360 basis, and how accrual periods are counted."
      }
    },
    {
      "id": "taleb-dynamic-hedging",
      "title": "Dynamic Hedging: Managing Vanilla and Exotic Options",
      "author": "Nassim Nicholas Taleb",
      "publisher": "Wiley",
      "url": "https://www.wiley.com/en-us/Dynamic+Hedging%3A+Managing+Vanilla+and+Exotic+Options-p-9780471152804",
      "type": "book",
      "topics": [
        "greeks",
        "options"
      ],
      "level": 3,
      "free": false,
      "why": {
        "it": "La copertura di un portafoglio di opzioni vista da un trader, scritta per professionisti a metà anni Novanta. Densa; utile quando greche e attribuzione del P&L sono ormai naturali. Estratto gratuito: indice e capitolo 1.",
        "en": "Hedging option books from a trader's point of view, written for professionals in the mid-1990s. Dense; useful once Greeks and P&L attribution feel natural. Free excerpt: table of contents and Chapter 1."
      }
    },
    {
      "id": "sinclair-positional-option-trading",
      "title": "Positional Option Trading: An Advanced Guide",
      "author": "Euan Sinclair",
      "publisher": "Wiley",
      "url": "https://www.wiley.com/en-us/Positional+Option+Trading%3A+An+Advanced+Guide-p-9781119583516",
      "type": "book",
      "topics": [
        "volatility",
        "options"
      ],
      "level": 3,
      "free": false,
      "why": {
        "it": "Un seguito avanzato su da dove nasce il vantaggio nel trading di opzioni (premio di varianza, struttura a termine, trimestrali) e su dimensionamento e rischio. Estratto gratuito: indice e capitolo 1.",
        "en": "An advanced follow-up on where option-trading edges come from (variance premium, term structure, earnings) and on sizing and risk. Free excerpt: table of contents and Chapter 1."
      }
    },
    {
      "id": "quantlib",
      "title": "QuantLib, a free/open-source library for quantitative finance",
      "author": "",
      "publisher": "QuantLib project",
      "url": "https://www.quantlib.org/",
      "type": "tool",
      "topics": [
        "programming",
        "options",
        "rates"
      ],
      "level": 3,
      "free": true,
      "why": {
        "it": "La principale libreria open source per pricing e rischio (C++ con interfaccia Python): curve, obbligazioni, swap, opzioni. Per i colloqui da quant developer o strats in cui si discute come è organizzata una libreria di pricing.",
        "en": "The main open-source library for pricing and risk (C++ with Python bindings): curves, bonds, swaps, options. For quant developer and strats interviews where you may be asked how a pricing library is organised."
      },
      "start_here": {
        "it": "La pagina Docs.",
        "en": "The Docs page."
      }
    },
    {
      "id": "cboe-vix-methodology",
      "title": "Cboe Volatility Index Methodology",
      "author": "",
      "publisher": "Cboe Global Indices",
      "url": "https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf",
      "type": "paper",
      "topics": [
        "volatility"
      ],
      "level": 3,
      "free": true,
      "why": {
        "it": "Il documento ufficiale su come si calcola il VIX a partire da una serie di prezzi di opzioni sull'S&P 500. Vale la pena leggerlo dopo aver capito i variance swap, perché applica la stessa idea di replica a un indice pubblicato.",
        "en": "The official document on how the VIX is computed from a strip of S&P 500 option prices. Worth reading once you understand variance swaps, because it applies the same replication idea to a published index."
      }
    },
    {
      "id": "gatheral-homepage",
      "title": "Jim Gatheral",
      "author": "Jim Gatheral",
      "publisher": "Baruch College, CUNY (personal page)",
      "url": "https://jgatheral.github.io/",
      "type": "notes",
      "topics": [
        "volatility"
      ],
      "level": 3,
      "free": true,
      "why": {
        "it": "La pagina personale di uno dei principali ricercatori sulla superficie di volatilità e sulla volatilità rough, con presentazioni e articoli. Solo per la parte di modellistica della volatilità nei colloqui quant.",
        "en": "Home page of a leading researcher on the volatility surface and rough volatility, with talks and papers. Only for the volatility-modelling end of quant interviews."
      }
    },
    {
      "id": "winkler-seven-puzzles",
      "title": "Seven Puzzles You Think You Must Not Have Heard Correctly",
      "author": "Peter Winkler",
      "publisher": "Dartmouth College (author's page)",
      "url": "https://math.dartmouth.edu/~pw/solutions.pdf",
      "type": "puzzles",
      "topics": [
        "brainteasers",
        "probability"
      ],
      "level": 3,
      "free": true,
      "why": {
        "it": "Sette rompicapi celebri che a prima vista sembrano impossibili (il primo è quello dei 100 prigionieri e delle scatole), ciascuno con soluzione completa. Brevi e difficili, sono un buon test della capacità di riformulare un problema.",
        "en": "Seven famous puzzles that sound impossible at first (the first is the 100 prisoners and boxes), each with a full solution. Short and hard, and a good test of whether you can reframe a problem."
      }
    },
    {
      "id": "avellaneda-stoikov-hft",
      "title": "High-frequency trading in a limit order book",
      "author": "Marco Avellaneda, Sasha Stoikov",
      "publisher": "New York University (author copy; Quantitative Finance, 2008)",
      "url": "https://math.nyu.edu/~avellane/HighFrequencyTrading.pdf",
      "type": "paper",
      "topics": [
        "market-making",
        "microstructure"
      ],
      "level": 3,
      "free": true,
      "why": {
        "it": "Il modello di riferimento su come un market maker dovrebbe posizionare denaro e lettera attorno a un 'prezzo di riserva' che dipende da inventario e avversione al rischio. Articolo breve; le prime sezioni danno l'intuizione che si cerca nei colloqui.",
        "en": "The standard model of how a market maker should place bid and ask around a 'reservation price' that depends on inventory and risk aversion. A short paper; the first sections give the intuition interviewers look for."
      }
    },
    {
      "id": "islr-statistical-learning",
      "title": "An Introduction to Statistical Learning",
      "author": "Gareth James, Daniela Witten, Trevor Hastie, Robert Tibshirani, Jonathan Taylor",
      "publisher": "Springer (free PDFs on the authors' site)",
      "url": "https://www.statlearning.com/",
      "type": "book",
      "topics": [
        "statistics",
        "programming"
      ],
      "level": 3,
      "free": true,
      "why": {
        "it": "Il manuale gratuito di riferimento su regressione, classificazione, ricampionamento e scelta del modello, con laboratori in R e Python. Rilevante per i colloqui di quant research su modelli e overfitting, non per il calcolo mentale del trading.",
        "en": "The standard free textbook on regression, classification, resampling and model selection, with R and Python labs. Relevant for quant research interviews on modelling and overfitting, not for trading mental maths."
      }
    },
    {
      "id": "berd-credit-term-structures",
      "title": "A Guide to Modeling Credit Term Structures",
      "author": "Arthur M. Berd",
      "publisher": "arXiv",
      "url": "https://arxiv.org/abs/0912.4623",
      "type": "paper",
      "topics": [
        "credit"
      ],
      "level": 3,
      "free": true,
      "why": {
        "it": "Un articolo da professionisti su hazard rate, curve di sopravvivenza e misure coerenti dello spread di credito. Ricava il 'credit triangle' (spread ≈ hazard rate × (1 − recupero)) e mostra dove viene usato male.",
        "en": "A practitioner paper on hazard rates, survival curves and consistent measures of credit spread. It derives the credit triangle (spread ≈ hazard rate × (1 − recovery)) and shows where people misuse it."
      }
    },
    {
      "id": "isda-cds-standard-model",
      "title": "ISDA CDS Standard Model",
      "author": "",
      "publisher": "ISDA (administered by S&P Global Market Intelligence)",
      "url": "https://www.cdsmodel.com/",
      "type": "tool",
      "topics": [
        "credit"
      ],
      "level": 3,
      "free": true,
      "why": {
        "it": "La sede del modello open source che il mercato usa per convertire gli spread dei CDS in prezzi upfront, con documentazione e griglie di test. Conviene leggere la documentazione, più che il codice, per imparare le convenzioni standard.",
        "en": "Home of the open-source model the market uses to convert CDS spreads into upfront prices, with documentation and test grids. Read the documentation rather than the code to learn the standard conventions."
      }
    },
    {
      "id": "hull-white-valuing-cds",
      "title": "Valuing Credit Default Swaps I: No Counterparty Default Risk",
      "author": "John Hull, Alan White",
      "publisher": "NYU Stern Finance Working Papers (FIN-00-021)",
      "url": "https://archive.nyu.edu/handle/2451/26688",
      "type": "paper",
      "topics": [
        "credit"
      ],
      "level": 3,
      "free": true,
      "why": {
        "it": "Il working paper che ha impostato la valutazione di un CDS semplice a partire da probabilità di default e tasso di recupero. Utile se un colloquio con un desk di credito va oltre l'approssimazione del triangolo.",
        "en": "The working paper that set out how to value a plain CDS from default probabilities and recovery. Useful if a credit desk interview goes beyond the triangle approximation."
      }
    }
  ];
})();
