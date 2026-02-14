# Projektkontext: Use Case 2 – LV-Vorhaben Berichtswesen

## Einordnung

Dieses Repository ist Use Case 2 des VetMedAI-Projekts, eines KI-Kompetenzaufbauprogramms fuer die Veterinaermedizinische Universitaet Wien (Leistungszeitraum 01/2026–10/2026). Das Programm kombiniert AI-Literacy-Workshops mit Promptotyping-Entwicklung fuer Verwaltungsprozesse.

Use Case 1 ([vetmed-wissensbilanz](https://github.com/DigitalHumanitiesCraft/vetmed-wissensbilanz)) behandelt die Visualisierung oeffentlicher Wissensbilanz-Kennzahlen. Use Case 2 behandelt die interne Konsolidierung von Projektstatusberichten (PSB) fuer das Rektorat. Zum Zusammenspiel beider Use Cases siehe [rechtlicher-rahmen.md](rechtlicher-rahmen.md).

## Kernproblem

Datenintegration, nicht Visualisierung. Der bestehende manuelle Prozess funktioniert, weil der Fachverantwortliche (Michael Forster) die Regeln kennt. Formeln, Zuordnungsregeln und Sonderfaelle in der konsolidierten Excel sind nirgends dokumentiert, funktionieren aber seit Jahren. Dieses Repository macht dieses implizite Domaenenwissen explizit.

## Beteiligte

**Michael Forster** — Fachverantwortlicher. Kennt den bestehenden Prozess, die Datenstrukturen und die Berechnungslogik. Nicht-technischer Hintergrund. Soll am Ende des Projekts den Konsolidierungsprozess verstehen, Erweiterungen einschaetzen koennen und die Methodik auf andere Prozesse uebertragen koennen.

**Christopher Pollin** — Projektleiter, Digital Humanities Craft. Verantwortet die Promptotyping-Methodik und technische Umsetzung.

## Methodik: Promptotyping

Promptotyping ist eine iterative Context-Engineering-Arbeitstechnik in vier Phasen:

1. **Preparation:** Domaenenwissen, Datenstrukturen und Anforderungen zusammentragen
2. **Exploration:** Moeglichkeitsraeume sondieren, Entscheidungen identifizieren
3. **Destillation:** Wissensdokumente verdichten, die als Spezifikation dienen
4. **Implementation:** Iterative Entwicklung, Code als disposable artifact

Kernprinzip: **Documents as Source of Truth, Code as Disposable Artifact.** Die Dokumente in `knowledge/` sind die stabilen Artefakte. Der Code in `scripts/` kann jederzeit neu generiert werden, solange die Wissensdokumente korrekt und vollstaendig sind.

## Critical Expert in the Loop

Forster ist der Critical Expert. Seine Rolle:
- **Domaenenwissen liefern:** Berechnungslogik, Zuordnungsregeln, Sonderfaelle
- **Ergebnisse validieren:** Konsolidierte Daten auf inhaltliche Korrektheit pruefen
- **Edge Cases identifizieren:** Faelle aus der Praxis benennen, die das Script abfangen muss
- **Quality Reports pruefen:** Automatisch erkannte Auffaelligkeiten bewerten und freigeben

Das System trifft keine Entscheidungen — es macht Entscheidungsbedarf sichtbar. Die Automatisierung unterstuetzt, ersetzt aber nicht die Domaenexpertise.

## Anforderungen

Erhoben im Workshop am 13.02.2026 mit Michael Forster und Christopher Pollin. Ergaenzt durch Recherche zu UG 2002, Wissensbilanzverordnung und Leistungsvereinbarungen (siehe [rechtlicher-rahmen.md](rechtlicher-rahmen.md)).

### Muss-Anforderungen

**Konsolidierung.** Alle PSB-Einzeldateien (Excel) muessen in eine gemeinsame Datenbasis zusammengefuehrt werden. Der bisherige manuelle Prozess wird automatisiert, das implizite Domaenenwissen explizit gemacht.

**Ampelstatus-Uebersicht.** Alle Vorhaben mit aktuellem Ampelstatus auf einen Blick. Projekte mit roter Ampel werden dem Rektorat gesondert vorgelegt.

**Filterung.** Mindestens nach Auftraggeber, Berichtszeitraum und Ampelstatus. Weitere Dimensionen (Kapitel, Laufzeit) sind wahrscheinlich, muessen im Workshop am 04.03. geklaert werden.

**Erweiterbarkeit.** Neue Vorhaben aus kuenftigen LV-Perioden muessen ohne Strukturaenderung aufgenommen werden koennen. Das betrifft sowohl die Datenpipeline als auch die Auswertungen.

**Interner Betrieb.** Alle Daten bleiben innerhalb der Universitaet. Keine Uebertragung an externe Dienste. Bei Nutzung von LLM-Diensten duerfen nur synthetische oder anonymisierte Daten eingegeben werden.

### Kann-Anforderungen

**Dashboard.** Interaktives Dashboard auf Basis der konsolidierten Daten. Implementiert als HTML/CSS/JS-Anwendung in docs/ (Epic 3, alle 5 User Stories). Technologieentscheidung: HTML statt Streamlit, weil Zero Dependencies (ausser Chart.js CDN) und einfache Verteilung via GitHub Pages.

**Automatisierte Quartalsberichte.** Abloesung des aktuellen Screenshot-Prozesses (Excel-Grafiken → PowerPoint). Koennten direkt aus der konsolidierten Datenbasis erzeugt werden.

**Finanz- und Fortschrittsauswertungen.** Budgetuebersichten, Zielwerterreichung, Trendanalysen ueber mehrere Quartale.

**KI-gestuetzte Textgenerierung.** Nutzung der Kurzbeschreibungen und Projektauftraege als Kontext fuer automatisierte Zusammenfassungen. Nur mit synthetischen oder anonymisierten Daten.

## 4-Stufen-Workflow

Der angestrebte Prozess gliedert sich in vier Stufen:

**Stufe 1: Erfassung.** Viele Personen erfassen PSBs in Excel-Vorlagen (siehe [datenmodell.md](datenmodell.md) fuer die Feldstruktur). Die Erfassung soll normalisierte Daten erzeugen (standardisierte Datumsformate, einheitliche Wertebereiche). Eine strukturierte Eingabemaske koennte die Datenqualitaet an der Quelle sichern und waere die wirksamste Massnahme gegen Qualitaetsprobleme.

**Stufe 2: Konsolidierung.** Einzelne PSBs werden automatisiert zusammengefuehrt (Python-Script). Dieser Schritt enthaelt bewusst eine manuelle Ueberpruefungsphase (Quality Report, siehe [validierung.md](validierung.md)). Der manuelle Anteil kann langfristig sinken, wenn die Eingabequalitaet durch Stufe 1 steigt. Aktuell implementiert in scripts/consolidate.py.

**Stufe 3: Dashboard.** Interaktives HTML/CSS/JS-Dashboard in docs/ (fuer GitHub Pages). Liest consolidated.json direkt via fetch(). Visualisierungen mit Chart.js (CDN). Keine Python-Abhaengigkeit im Frontend. Implementiert: KPI-Leiste, Ampel-Grid, Budget-Uebersicht (Chart + Tabelle), Zielwert/Istwert-Vergleich, Verteilungs-Charts, Detail-Modal, Filter (Kapitel/Auftraggeber/Ampel). Start via `python start_dashboard.py` (Port 8080). Siehe [anforderungen.md](anforderungen.md) E3-S1 bis E3-S5.

**Stufe 4: Export.** Zielgruppenspezifische Ausgabeformate fuer das Rektorat (PNG, aggregierte Uebersichten, PowerPoint-Folien). Entkoppelt Darstellung und Lieferformat. Noch nicht implementiert.

## Offene Punkte

| Nr. | Klaerungsbedarf | Status | Termin |
|-----|----------------|--------|--------|
| 1 | Umsetzungsform: Dashboard, automatisierter Bericht oder beides? | entschieden | – |
| 2 | Datenstruktur: PSB-Vorlagen, SAP-Format, Berechnungslogik der konsolidierten Excel. Bedeutung "Kapitel": Hypothese ist LV-Kapitel A-D (siehe [rechtlicher-rahmen.md](rechtlicher-rahmen.md)), muss verifiziert werden | offen | 04.03. |
| 3 | Verhaeltnis Quartalsbericht und [LV-Monitoring](rechtlicher-rahmen.md): BMFWF fuehrt mind. 2x/Jahr Begleitgespraeche, VetMed erstellt intern quartalsweise PSBs. Gemeinsame Datenbasis oder getrennte Prozesse? | offen | 04.03. |
| 4 | Zuordnung und Speicherort der Kurzbeschreibungen | offen | offen |
| 5 | Hosting und IT-Zustaendigkeiten (rein interner Betrieb) | offen | offen |

**Zu Punkt 1:** Dashboard als HTML/CSS/JS implementiert (Session 3, 14.02.2026). Entscheidung: Interaktives Dashboard mit Charts und Tabellen. Technologie: HTML statt Streamlit. Export (Epic 4) als separate naechste Stufe.

## Zeitplan

| Termin | Ereignis | Status |
|--------|----------|--------|
| 13.02.2026 | Arbeitstreffen: Anforderungen erhoben | abgeschlossen |
| 04.03.2026 | Entwicklungsworkshop (online, 3h): Domaenenwissen extrahieren, Repository durcharbeiten | geplant |
| 06.05.2026 | Follow-Up-Workshop | geplant |
| 31.10.2026 | Projektende VetMedAI | – |

## Datenschutz

Alle PSB-Daten sind intern und enthalten personenbezogene sowie institutionell sensible Informationen. Dieses Repository arbeitet ausschliesslich mit synthetischen Testdaten. Bei der spaeteren Uebertragung auf echte Daten gilt: Keine Daten verlassen die Universitaet. In LLM-Dienste duerfen nur synthetische oder anonymisierte Daten eingegeben werden.

## Verwandte Dokumente

- [anforderungen.md](anforderungen.md) — Epics, User Stories, Rollen, Roadmap, Forschungsgrundlage
- [datenmodell.md](datenmodell.md) — PSB-Feldstruktur und Datentypen
- [validierung.md](validierung.md) — Validierungsregeln, Berechnungslogik, Quality Report, Python-Stack
- [rechtlicher-rahmen.md](rechtlicher-rahmen.md) — UG 2002, LV-Kapitelstruktur, Monitoring-Zyklen
