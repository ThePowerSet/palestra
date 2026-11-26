/* Collegamento al database, per avere i progressi su tutti i dispositivi (README, sezione «Online»).
   Vuoto: la palestra lavora solo nel browser, come prima.

   url:    l'indirizzo del progetto Supabase (Project Settings → Data API → Project URL)
   chiave: la chiave pubblica (Project Settings → API Keys): «publishable» (sb_publishable_…),
           o «anon» nei progetti più vecchi.

   Tutte e due possono stare nel codice: i dati si leggono solo dopo l'accesso, e le regole del
   database (RLS) mostrano a ciascuno soltanto le sue righe. La chiave segreta (secret o service_role)
   non va MAI qui: sta solo in .env.local, che non finisce su GitHub. */
window.PALESTRA_CLOUD = {
  url: 'https://aefwnsgtymtmlokguqyw.supabase.co',
  chiave: 'sb_publishable_tQx5QvE0nJCXV2VbLaaeTg_po80ue1J',
};
