# Palestra

Mental maths and quick-reasoning drills for trading interviews, one trick at a time. Each trick has a short lesson, exercises generated at random on three levels with a hint for every question, and a worked solution. Then you mix them: random practice, spaced review, timed tests. It opens in English, and every text also has an Italian version.

**Use it:** https://palestra-opal.vercel.app (no account, nothing to install)

## Why it exists

I'm preparing for trading interviews. Every time I practised for a mental maths test or an interview question, the work ended up in notes I never opened again. I wanted to build something that would last and make sense: a place where each trick has its lesson, its exercises and its review, and where every session adds to the ones before.

That's how Palestra (Italian for gym) came about. I built it using AI, and much of the text is written with AI too, so I wouldn't put too much weight on what the descriptions say. The drills and the examples are another matter: I use them to prepare, and I think they're interesting and useful for anyone getting ready for the same interviews.

### About the timed test

The timed test follows the style of the mental maths tests used in trading recruitment, but nothing here is official: the format comes from public information found online and from text generated with AI. I have not added anything from interviews or tests I have taken myself.

## Modes

| Mode | What it does |
|---|---|
| Lesson | Open a trick from the programme: the interview question it comes from, the lesson, a short summary card. "Practise this trick" gives 10 questions: 3 at level 1, 4 at level 2, 3 at level 3 |
| Practice | Random questions from the tricks you pick (by default the ones you have learnt), with hints. The trick's name shows only after you answer |
| Review | A trick comes back 1, 3, 7, 14 and 30 days after you mark it as learnt, then every 30 days; sooner if you are under 80% in its last 20 answers |
| Timed test | Ten questions a minute for 2, 5, 8, 10 or 15 minutes, with or without a penalty (+1 if right, −1 if wrong, 0 if skipped). No hints, marking at the end. See "About the timed test" above |
| Log | Per trick: answers, accuracy, average time, how often you opened a hint. Recent sessions, CSV export |

Keys: Enter answers and moves on, `?` opens the next hint, 1–4 or A–D pick a multiple-choice option. Answers can be typed the way they come: `0.375`, `0,375`, `3/8`, `99-17`, `25000`, `25k`, `2.5m`, `−4%`.

Theme: the button next to the language switch cycles device, light and dark, like the toggle on thepowerset.github.io, and is remembered. A link can open the app in a given theme with `?tema=system`, `?tema=light` or `?tema=dark`; the website's links use it to pass on the theme you are looking at.

Languages: the app opens in English; the **IT | EN** switch in the header changes everything, lessons included, and is remembered. Numbers are written the same way in both languages, with a decimal point and a comma for thousands: 0.375, 25,000.

## Your data

Progress (answers, sessions, tricks marked as learnt) is kept in your browser's local storage and is not sent anywhere. Clearing the site's data in the browser deletes it; "Export CSV" in the Log keeps a copy.

## Run it on your computer

- Double-click `index.html`: everything works, results stay in the browser.
- Or `python3 palestra.py`: a small local server on `http://127.0.0.1:8765` that also appends every answer to `palestra_risposte.csv` in the folder above this one, so the file never ends up in the repository.

No build step and no dependencies: plain HTML, CSS and JavaScript.

## Add a trick

1. Create `contenuti/<subject>/NN_name.js` from the template below.
2. Add `<script src="contenuti/<subject>/NN_name.js"></script>` to `index.html`, before `js/app.js`.
3. Run `node strumenti/verifica.js`. It generates hundreds of questions per level in both languages and checks that the right answer is accepted, that a wrong one is not, that no text contains `undefined` or `NaN`, that no word is left in the wrong language, and that every number uses the notation above.

Every text is written in both languages: `P.t('testo italiano', 'English text')` inside generators, `{ it: '...', en: '...' }` for the trick's fixed fields. Numbers keep the same notation in both (0.375, 25,000); inside generators `P.fmt` writes them.

```js
(function () {
  'use strict';
  const P = Palestra;

  // a generator returns one question; every call makes a new one
  function calcolo() {
    const a = P.int(2, 9), b = P.int(11, 19);
    return {
      testo: `<span class="num">${a} × ${b}</span>`,          // HTML; .num highlights numbers
      nota: P.t('facoltativa: unità, decimali', 'optional: units, decimals'),
      risposta: P.numero(a * b),                               // or P.scelta(['A', 'B'], 0)
      suggerimenti: [
        P.t('come applicare il trucco qui', 'how to apply the trick here'),
        P.t('il primo passo già fatto', 'the first step, done'),
      ],
      soluzione: [P.t('passo 1', 'step 1'), P.t('passo 2', 'step 2')],
    };
  }

  P.trucco({
    id: 'subject-name',            // unique and kept in the logs: do not change it later
    materia: 'calcolo',            // id in contenuti/materie.js
    capitolo: 'mul',
    numero: 10,                    // order within the subject
    titolo: { it: 'Titolo corto', en: 'Short title' },
    sottotitolo: { it: 'Una riga per il programma.', en: 'One line for the programme.' },
    aggancio: { it: 'La scena da colloquio o da desk.', en: 'The interview or desk scene.' },
    lezione: { it: `<h3>…</h3><p>…</p><div class="esempio">…</div><div class="trappola">…</div>`, en: `<h3>…</h3><p>…</p>` },
    scheda: { it: 'Tre righe da ripasso.', en: 'Three lines to review.' },
    test: true,                    // level 1 joins the timed test
    nomiLivelli: { it: ['Calcolo', 'Al desk', 'Un passo in più'], en: ['Calculation', 'On the desk', 'One step further'] },
    livelli: [calcolo, calcolo, calcolo],                      // three generators, one per level
  });
})();
```

`P.numero(value, options)` takes `decimali` (how many decimals an answer that does not terminate needs), `tol` and `rel` (absolute or relative tolerance, for estimates), `percento` (the value is a fraction such as 0.25, also accepted as 25 or 25%), `mostra` (how to display the right answer) and `unita` (text next to the input). Helpers: `P.t` and `P.tr` (language), `P.int`, `P.pick`, `P.pesato`, `P.mcd`, `P.fmt`, `P.pct`, and `P.il`/`P.del`/`P.al` (Italian articles before numbers).

A new subject is one `Palestra.materia` call in `contenuti/materie.js` and a folder in `contenuti/`.

## Content rules

- No problems, solutions or pages copied from books, courses or paid tests: classic problems are rewritten with new wording and numbers.
- Nothing from real interviews or tests: only public information and generated material.
- Every trick starts from an interview or desk scene, explains why it works and shows the method to do it in your head.
- Hints say how to apply the trick to that question, not the answer: the first points the way, the second takes the first step.

## Files

```
index.html                  the page; one <script> per content file
stile.css                   look, light and dark themes, phone layout
js/motore.js                trick registry, random numbers, formats, answer parsing, storage, review schedule
js/base.js                  basic arithmetic for the timed test
js/app.js                   interface
js/tema.js                  theme applied before the page is drawn (device, light, dark)
js/nuvola.js                optional sync with a database (see below)
config.js                   database address and public key; empty = browser only
contenuti/materie.js        subjects and chapters
contenuti/<subject>/        one file per trick
strumenti/verifica.js       automatic content check
strumenti/prova_nuvola.js   sync test with two simulated devices and a simulated database
supabase/0001_palestra.sql  database tables and access rules
palestra.py                 local server that writes the CSV; --scarica pulls answers from the database
vercel.json                 security headers for the hosted site
fonts/                      Inter, Newsreader and JetBrains Mono, latin subset, with their licences
```

The code, its comments and the content identifiers are in Italian; the interface is in both languages.

## Optional: sync across your own devices

If you run your own copy, you can keep the same progress on your phone and your computer through a free [Supabase](https://supabase.com) project. Visitors never see this: the sign-in box appears only on a device that has opened `#/accedi` once, and the database client is loaded only there.

1. Create a Supabase project and run `supabase/0001_palestra.sql` in its SQL Editor.
2. In *Authentication → Users* add your own user, then turn off *Allow new users to sign up*.
3. Put the project URL and the publishable key in `config.js`, and the project URL in the `connect-src` line of `vercel.json`.
4. On each device, open `…/#/accedi` once and sign in from the Log.
5. To pull every answer into the CSV, put `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in a `.env.local` file (never committed) and run `python3 palestra.py --scarica`.

A free Supabase project is paused after a week without use. The data stays; when the app cannot reach the database while online, the sync box in the Log links to the project's page on the Supabase dashboard, where "Restore project" brings it back in a few minutes.

The browser stays the working copy and the database keeps devices in line: each answer has its own id, so sending it twice never duplicates it; for tricks marked as learnt the latest change wins; deleting answers while signed in deletes them on every device. After changing `js/nuvola.js`, run `node strumenti/prova_nuvola.js`.

## Security

- A static site: no server code, nothing that runs on the host.
- `vercel.json` sets a strict Content Security Policy: the page runs only its own scripts plus one pinned version of the Supabase client, can connect only to itself and to the sync database, and cannot be framed by other sites.
- The Supabase client is pinned to a fixed version and checked with Subresource Integrity, and it is loaded only on devices that use sync.
- Everything the page shows from user input is escaped before it reaches the HTML.
- Database rows are protected by row-level security (each user sees only their own rows), sign-ups are closed, and anonymous access is revoked. The key in `config.js` is the publishable one, public by design; the secret key never leaves `.env.local`.

## Licence

MIT, see `LICENSE`. The fonts in `fonts/` (Inter, Newsreader, JetBrains Mono) are under the SIL Open Font License; their licence texts are next to them.
