-- Palestra: i progressi di chi si allena, per averli su tutti i dispositivi.
-- Da incollare nel SQL Editor di Supabase, una volta sola, in un progetto nuovo.
--
-- Ogni riga appartiene a un utente e le regole RLS fanno vedere e toccare a ciascuno soltanto le sue:
-- oggi l'utente è uno, ma la stessa base andrebbe bene anche se un giorno la palestra ne avesse altri.
-- Il browser manda le righe già pronte (js/nuvola.js); user_id lo controlla il database con auth.uid().

-- Una riga per risposta data, come in palestra_risposte.csv più uid (codice della riga) e t (momento, in ms).
create table public.risposte (
  id           bigint generated always as identity primary key,
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  uid          text not null check (length(uid) between 8 and 64),
  t            bigint not null,
  sessione     text not null,
  data         date not null,
  ora          text not null,
  modalita     text not null,
  n            int not null,
  materia      text not null,
  capitolo     text not null,
  trucco       text not null,
  livello      int,                          -- vuoto per il calcolo di base
  domanda      text not null check (length(domanda) <= 4000),
  risposta     text not null check (length(risposta) <= 500),
  corretta     text not null check (length(corretta) <= 500),
  esito        text not null,                -- giusta, sbagliata, saltata
  secondi      real not null,
  suggerimenti int not null default 0,
  unique (user_id, uid)
);
create index risposte_utente_idx on public.risposte (user_id, id);

-- Una riga per sessione finita (lezione, allenamento, ripasso, test).
create table public.sessioni (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  uid        text not null check (length(uid) between 1 and 80),  -- id della sessione nel browser
  t          bigint not null,
  data       date not null,
  modalita   text not null,
  titolo     jsonb not null,               -- { "it": …, "en": … }
  domande    int not null,
  giuste     int not null,
  sbagliate  int not null,
  saltate    int not null,
  punteggio  real not null,
  secondi    int not null,
  unique (user_id, uid)
);
create index sessioni_utente_idx on public.sessioni (user_id, id);

-- Una riga per utente: trucchi imparati ({ trucco: data }), quando è cambiato ciascuno ({ trucco: ms },
-- vince il più recente) e l'ultima volta che sono state cancellate risposte e sessioni (ms).
create table public.stato (
  user_id   uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  imparati  jsonb not null default '{}'::jsonb,
  agg       jsonb not null default '{}'::jsonb,
  azzerato  bigint not null default 0
);

-- Regole: ciascuno solo le sue righe, e solo dopo l'accesso.
alter table public.risposte enable row level security;
alter table public.sessioni enable row level security;
alter table public.stato    enable row level security;

create policy "risposte: solo le proprie" on public.risposte for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "sessioni: solo le proprie" on public.sessioni for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "stato: solo il proprio" on public.stato for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Chi non ha fatto l'accesso non tocca niente; chi l'ha fatto può leggere, aggiungere e cancellare le sue righe.
revoke all on public.risposte, public.sessioni, public.stato from anon;
grant select, insert, update, delete on public.risposte, public.sessioni, public.stato to authenticated;
