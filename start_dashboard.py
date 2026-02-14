"""
Startet einen lokalen HTTP-Server fuer das PSB Dashboard.

Verwendung:
    python start_dashboard.py

Oeffnet http://localhost:8080 im Browser.
Das Dashboard liest consolidated.json aus dem docs/-Verzeichnis.
"""

import http.server
import os
import shutil
import sys
import webbrowser
from pathlib import Path

PORT = 8080
DASHBOARD_DIR = Path(__file__).parent / "docs"


def main():
    if not DASHBOARD_DIR.exists():
        print(f"Fehler: Dashboard-Verzeichnis nicht gefunden: {DASHBOARD_DIR}")
        sys.exit(1)

    source = Path(__file__).parent / "data" / "consolidated" / "consolidated.json"
    target = DASHBOARD_DIR / "consolidated.json"
    if source.exists():
        shutil.copy2(source, target)
        print(f"consolidated.json aktualisiert aus {source}")
    else:
        print(f"Warnung: {source} nicht gefunden. Dashboard verwendet vorhandene Daten.")

    os.chdir(DASHBOARD_DIR)
    handler = http.server.SimpleHTTPRequestHandler
    server = http.server.HTTPServer(("", PORT), handler)

    url = f"http://localhost:{PORT}"
    print(f"PSB Dashboard laeuft auf {url}")
    print("Beenden mit Strg+C")

    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer beendet.")
        server.server_close()


if __name__ == "__main__":
    main()
