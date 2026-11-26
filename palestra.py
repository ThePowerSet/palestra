#!/usr/bin/env python3
"""Avvia la Palestra in locale e scrive ogni risposta in ../palestra_risposte.csv, fuori dal repository.

    python3 palestra.py                 apre il browser su http://127.0.0.1:8765
    python3 palestra.py --porta 9000
    python3 palestra.py --no-browser
    python3 palestra.py --scarica       porta nel CSV le risposte date online, da tutti i dispositivi

Senza questo script la palestra funziona lo stesso con un doppio clic su index.html:
i risultati restano nel browser e si esportano dal Registro.
--scarica legge SUPABASE_URL e SUPABASE_SECRET_KEY da .env.local (README, sezione «Online»).
Solo libreria standard, nessuna installazione. Ctrl+C per chiudere.
"""
import argparse
import csv
import json
import os
import sys
import threading
import urllib.error
import urllib.request
import webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

QUI = Path(__file__).resolve().parent
CSV = QUI.parent / "palestra_risposte.csv"
COLONNE = ["sessione", "data", "ora", "modalita", "n", "materia", "capitolo", "trucco", "livello",
           "domanda", "risposta", "corretta", "esito", "secondi", "suggerimenti"]
LUCCHETTO = threading.Lock()


class Gestore(SimpleHTTPRequestHandler):
    def end_headers(self):
        # niente cache: se cambia un trucco, basta ricaricare la pagina
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        if self.path.split("?")[0] == "/api/stato":
            return self._json({"ok": True, "file": str(CSV.name)})
        return super().do_GET()

    def do_POST(self):
        if self.path != "/api/risposte":
            return self.send_error(404)
        n = int(self.headers.get("Content-Length") or 0)
        if n <= 0 or n > 5_000_000:
            return self.send_error(413)
        try:
            righe = json.loads(self.rfile.read(n))
            assert isinstance(righe, list)
        except (ValueError, AssertionError):
            return self.send_error(400)
        with LUCCHETTO:
            nuovo = not CSV.exists()
            with CSV.open("a", newline="", encoding="utf-8") as f:
                w = csv.DictWriter(f, fieldnames=COLONNE, extrasaction="ignore")
                if nuovo:
                    w.writeheader()
                for r in righe:
                    if isinstance(r, dict):
                        w.writerow({k: r.get(k, "") for k in COLONNE})
        return self._json({"ok": True, "scritte": len(righe)})

    def _json(self, obj):
        corpo = json.dumps(obj).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(corpo)))
        self.end_headers()
        self.wfile.write(corpo)

    def log_message(self, *args):
        pass


def leggi_env():
    env, f = {}, QUI / ".env.local"
    if f.exists():
        for riga in f.read_text(encoding="utf-8").splitlines():
            riga = riga.strip()
            if riga and not riga.startswith("#") and "=" in riga:
                k, v = riga.split("=", 1)
                env[k.strip()] = v.strip().strip("\"'")
    return env


def scarica():
    """Scarica dal database tutte le risposte (di ogni dispositivo) e le unisce a palestra_risposte.csv.
    Stessa sessione e stesso numero di domanda = stessa risposta: vince la copia del database, e le righe
    che erano solo nel file restano. Pensato per un utente solo: la chiave segreta vede tutte le righe."""
    env = leggi_env()
    url = env.get("SUPABASE_URL", "").rstrip("/")
    chiave = env.get("SUPABASE_SECRET_KEY") or env.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not chiave:
        sys.exit("Manca .env.local con SUPABASE_URL e SUPABASE_SECRET_KEY: vedi README, sezione «Online».")
    intestazioni = {"apikey": chiave}
    if not chiave.startswith("sb_"):  # chiave service_role dei progetti più vecchi
        intestazioni["Authorization"] = f"Bearer {chiave}"

    dal_db, ultimo = [], 0
    while True:
        q = f"{url}/rest/v1/risposte?select=*&id=gt.{ultimo}&order=id.asc&limit=1000"
        try:
            with urllib.request.urlopen(urllib.request.Request(q, headers=intestazioni), timeout=30) as r:
                pezzo = json.load(r)
        except urllib.error.HTTPError as e:
            sys.exit(f"Il database ha risposto {e.code}: {e.read().decode(errors='replace')[:300]}")
        except urllib.error.URLError as e:
            sys.exit(f"Database non raggiungibile: {e.reason}")
        dal_db += pezzo
        if len(pezzo) < 1000:
            break
        ultimo = pezzo[-1]["id"]

    chiave_riga = lambda r: (str(r.get("sessione", "")), str(r.get("n", "")))
    tutte = {}
    if CSV.exists():
        with CSV.open(newline="", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                tutte[chiave_riga(r)] = r
    for r in dal_db:
        r = {k: "" if r.get(k) is None else r.get(k) for k in COLONNE}
        tutte[chiave_riga(r)] = r
    righe = sorted(tutte.values(), key=lambda r: (str(r["data"]), str(r["ora"]), str(r["sessione"]), int(r["n"] or 0)))

    tmp = CSV.with_suffix(".tmp")
    with LUCCHETTO, tmp.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=COLONNE, extrasaction="ignore")
        w.writeheader()
        w.writerows(righe)
    os.replace(tmp, CSV)
    solo_file = len(righe) - len({chiave_riga(r) for r in dal_db})
    print(f"{len(dal_db)} risposte dal database, {solo_file} solo nel file: {len(righe)} righe in {CSV}")


def main():
    ap = argparse.ArgumentParser(description="Palestra in locale")
    ap.add_argument("--porta", type=int, default=8765)
    ap.add_argument("--no-browser", action="store_true")
    ap.add_argument("--scarica", action="store_true", help="porta nel CSV le risposte date online")
    a = ap.parse_args()
    if a.scarica:
        return scarica()
    server = ThreadingHTTPServer(("127.0.0.1", a.porta), partial(Gestore, directory=str(QUI)))
    url = f"http://127.0.0.1:{a.porta}/"
    print(f"Palestra su {url}  ·  risposte in {CSV}  ·  Ctrl+C per chiudere")
    if not a.no_browser:
        threading.Timer(0.4, webbrowser.open, args=(url,)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nChiusa.")


if __name__ == "__main__":
    main()
