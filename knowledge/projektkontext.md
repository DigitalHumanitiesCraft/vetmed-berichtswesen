# Projektkontext: Use Case 2 – LV-Vorhaben Berichtswesen

## Einordnung

Dieses Repository ist Use Case 2 des VetMedAI-Projekts, eines KI-Kompetenzaufbauprogramms fuer die Veterinaermedizinische Universitaet Wien (Leistungszeitraum 01/2026–10/2026). Das Programm kombiniert AI-Literacy-Workshops mit Promptotyping-Entwicklung fuer Verwaltungsprozesse.

Use Case 1 ([vetmed-wissensbilanz](https://github.com/DigitalHumanitiesCraft/vetmed-wissensbilanz)) behandelt die Visualisierung oeffentlicher Wissensbilanz-Kennzahlen. Use Case 2 behandelt die interne Konsolidierung von Projektstatusberichten (PSB) fuer das Rektorat. Zum Zusammenspiel beider Use Cases siehe [rechtlicher-rahmen.md](rechtlicher-rahmen.md).

## Kernproblem

Datenintegration, nicht Visualisierung. Der bestehende manuelle Prozess funktioniert, weil die Fachverantwortliche (Sabrina Laboureix, Referentin PPM, Stabsstelle SUES) die Regeln kennt. Formeln, Zuordnungsregeln und Sonderfaelle in der konsolidierten Excel sind nirgends dokumentiert, funktionieren aber seit Jahren. Dieses Repository macht dieses implizite Domaenenwissen explizit.

## Beteiligte

**Sabrina Laboureix** — Fachverantwortliche, Referentin PPM (Stabsstelle Universitaere Entwicklung und Steuerung, SUES). Kennt den bestehenden Prozess, die Datenstrukturen und die Berechnungslogik. Nicht-technischer Hintergrund. Soll am Ende des Projekts den Konsolidierungsprozess verstehen, Erweiterungen einschaetzen koennen und die Methodik auf andere Prozesse uebertragen koennen.

**Christopher Pollin** — Projektleiter, Digital Humanities Craft. Verantwortet die Promptotyping-Methodik und technische Umsetzung.

## Methodik: Promptotyping

Promptotyping ist eine iterative Context-Engineering-Arbeitstechnik in vier Phasen:

1. **Preparation:** Domaenenwissen, Datenstrukturen und Anforderungen zusammentragen
2. **Exploration:** Moeglichkeitsraeume sondieren, Entscheidungen identifizieren
3. **Destillation:** Wissensdokumente verdichten, die als Spezifikation dienen
4. **Implementation:** Iterative Entwicklung, Code als disposable artifact

Kernprinzip: **Documents as Source of Truth, Code as Disposable Artifact.** Die Dokumente in `knowledge/` sind die stabilen Artefakte. Der Code in `prototype/` kann jederzeit neu generiert werden, solange die Wissensdokumente korrekt und vollstaendig sind.

## Critical Expert in the Loop

Laboureix ist die Critical Expert. Ihre Rolle:
- **Domaenenwissen liefern:** Berechnungslogik, Zuordnungsregeln, Sonderfaelle
- **Ergebnisse validieren:** Konsolidierte Daten auf inhaltliche Korrektheit pruefen
- **Edge Cases identifizieren:** Faelle aus der Praxis benennen, die das Script abfangen muss
- **Quality Reports pruefen:** Automatisch erkannte Auffaelligkeiten bewerten und freigeben

Das System trifft keine Entscheidungen — es macht Entscheidungsbedarf sichtbar. Die Automatisierung unterstuetzt, ersetzt aber nicht die Domaenexpertise.

## Workflow

Der Workflow gliedert sich in vier Stufen. Fuer den detaillierten Ist-Prozess siehe [use-case.md](use-case.md).

**Stufe 1: Erfassung.** PSB-Excel-Vorlagen werden von Projektleitungen ausgefuellt (siehe [data.md](data.md) fuer die Feldstruktur). Ca. 118 Vorhaben, 43 Zeilen x 12 Spalten pro PSB, 59 Merged-Cell-Bereiche.

**Stufe 2: Konsolidierung.** PSBs + SAP-Finanzdaten + bestehendes Dashboard werden automatisiert zusammengefuehrt (`prototype/01_konsolidierung.py`). Enthaelt bewusst eine manuelle Ueberpruefungsphase via konsolidiertes Excel. Implementiert.

**Stufe 3: Dashboard.** Interaktives HTML/CSS/JS-Dashboard in `docs/`. Liest `consolidated.json` via fetch(). Visualisierungen mit Chart.js. Implementiert.

**Stufe 4: Export.** PPTX-Quartalsbericht, Dashboard-Excel (Portfolio_Daten-Format), LV-Monitoring-Excel (`prototype/03_bericht.py`). Implementiert.

## Offene Punkte

| Nr. | Klaerungsbedarf | Status | Termin |
|-----|----------------|--------|--------|
| 1 | Umsetzungsform: Dashboard, automatisierter Bericht oder beides? | entschieden (beides) | – |
| 2 | Datenstruktur: Kapitelzuordnung A-D (LV-Struktur) bestaetigt durch Quelldaten | geklaert | – |
| 3 | Verhaeltnis Quartalsbericht und LV-Monitoring: Gemeinsame Datenbasis, getrennte Exporte | geklaert | – |
| 4 | Hosting und IT-Zustaendigkeiten (rein interner Betrieb) | offen | offen |

## Zeitplan

| Termin | Ereignis | Status |
|--------|----------|--------|
| 13.02.2026 | Arbeitstreffen: Anforderungen erhoben | abgeschlossen |
| 04.03.2026 | Entwicklungsworkshop (online, 3h) | abgeschlossen |
| 10.03.2026 | Quelldaten uebermittelt, Prototyp erstellt | abgeschlossen |
| 12.03.2026 | Repository-Migration und Dashboard-Update | abgeschlossen |
| 06.05.2026 | Follow-Up-Workshop | geplant |
| 31.10.2026 | Projektende VetMedAI | – |

## Datenschutz

Alle PSB-Daten sind intern und enthalten personenbezogene sowie institutionell sensible Informationen. Dieses Repository arbeitet ausschliesslich mit synthetischen/fiktiven Testdaten. Bei der spaeteren Uebertragung auf echte Daten gilt: Keine Daten verlassen die Universitaet. In LLM-Dienste duerfen nur synthetische oder anonymisierte Daten eingegeben werden.

## Verwandte Dokumente

- [index.md](index.md) — Einstiegspunkt, Quelldateien, Navigation
- [use-case.md](use-case.md) — Prozess, Workflow, Anforderungen, rechtlicher Rahmen
- [data.md](data.md) — Datenstrukturen und Schemas aller Quellen (PSB, Dashboard, SAP, PPT)
- [berechnungslogik.md](berechnungslogik.md) — Formeln, Ampellogik, Aggregationen, Dashboard-Metriken
- [parameter.md](parameter.md) — Dropdown-Werte, Codelisten, Normalisierungsregeln
- [anforderungen.md](anforderungen.md) — Epics, User Stories, Rollen, Roadmap, Forschungsgrundlage
- [validierung.md](validierung.md) — Validierungsstrategie, Quality Report, Python-Stack
- [rechtlicher-rahmen.md](rechtlicher-rahmen.md) — UG 2002, LV-Kapitelstruktur, Monitoring-Zyklen
