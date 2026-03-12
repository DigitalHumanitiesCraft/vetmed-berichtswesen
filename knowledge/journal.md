# Journal

Arbeitstagebuch des Projekts vetmed-berichtswesen. Dokumentiert Entscheidungen und Aenderungen pro Session. Vor jeder neuen Session lesen. Eintraege umgekehrt chronologisch.

---

## 2026-03-12 – Repository-Migration und Dashboard-Update

**Teilnehmer:** Christopher Pollin, Claude (KI-Assistent)

### Kontext

Die Fachverantwortliche (Sabrina Laboureix) hat die echten Quelldaten uebermittelt. Daraus wurde am 10.03.2026 ein vollstaendiger Prototyp erstellt (im Ordner "Use Case Projektportfolio_LV-Vorhaben"). Dieser wird jetzt ins Git-Repository ueberfuehrt und mit dem bestehenden Wissen zusammengefuehrt.

### Entscheidungen

1. **Downloads-Prototyp ist fuehrend**: Der am 10.03. mit echten Quelldaten erstellte Prototyp ersetzt die vereinfachten synthetischen Daten vom 14.02.
2. **Fachverantwortliche**: Sabrina Laboureix (Referentin PPM, SUES) statt Michael Forster
3. **Knowledge-Zusammenfuehrung**: Neue Dateien aus Downloads (data.md, berechnungslogik.md, parameter.md, use-case.md, index.md) + wertvolle Dateien aus Git (rechtlicher-rahmen.md, anforderungen.md, validierung.md)
4. **Alte vereinfachte Struktur entfernt**: data/sample/, data/templates/, scripts/consolidate.py, datenmodell.md
5. **Dashboard ans neue Datenmodell angepasst**: HTML/JS-Dashboard liest jetzt konsolidiert.xlsx via JSON-Konvertierung

### Aenderungen

| Datei/Ordner | Aenderung |
|-------|-----------|
| quelldaten/ | Neu: Echte Vorlagen (PSBs, SAP, Dashboard, PPTX, Projektauftraege) |
| prototype/ | Neu: 3 Skripte + config.py (01_konsolidierung, 02_visualisierung, 03_bericht) |
| output/ | Neu: Charts (PNG), Reports (PPTX, Excel), Review (konsolidiert.xlsx) |
| plan.md | Neu: Architekturplan mit 6 Milestones (abgeschlossen) |
| knowledge/index.md | Neu: Einstiegspunkt mit Quelldateien-Inventar |
| knowledge/use-case.md | Neu: Detaillierter Ist-Prozess, Workflow, Anforderungen |
| knowledge/data.md | Neu: Ersetzt datenmodell.md — PSB (43 Zeilen, 59 Merged Cells), Dashboard (48 Spalten), SAP, PPTX |
| knowledge/berechnungslogik.md | Neu: NETWORKDAYS, Ampellogik, Aggregationen, Zielwert-Tracking |
| knowledge/parameter.md | Neu: Alle Dropdown-Werte, Normalisierungstabellen, 18 Kapitelzuordnungen |
| knowledge/projektkontext.md | Aktualisiert: Neue Referenzen, Laboureix statt Forster, offene Punkte geklaert |
| knowledge/anforderungen.md | Aktualisiert: Epic 4 auf Done, Laboureix, Roadmap aktualisiert |
| knowledge/validierung.md | Aktualisiert: Referenzen auf data.md, implementierte Features |
| knowledge/journal.md | Zusammengefuehrt: Downloads-Journal + Git-Journal |
| docs/ | Dashboard ans neue Datenmodell angepasst |
| CLAUDE.md | Komplett neu geschrieben |
| README.md | Komplett neu geschrieben |
| data/ | Entfernt (ersetzt durch quelldaten/ + output/) |
| scripts/ | Entfernt (ersetzt durch prototype/) |
| knowledge/datenmodell.md | Entfernt (ersetzt durch data.md) |

### Offene Punkte aus frueheren Sessions (Stand)

| Punkt | Status |
|-------|--------|
| Kapitel-Zuordnung A-D | Geklaert: Quelldaten verwenden A/B/C/D mit 18 Unterkategorien |
| Verhaeltnis Quartalsbericht/LV-Monitoring | Geklaert: Gemeinsame Datenbasis, getrennte Exporte |
| Dashboard (Stufe 3) | Implementiert und ans neue Datenmodell angepasst |
| Export (Stufe 4) | Implementiert (PPTX, Dashboard-Excel, LV-Monitoring) |
| pandera-Schema | Noch offen |

---

## 2026-03-10 (Spaet) – Knowledge und Dokumentation bereinigt

**Teilnehmer:** Christopher Pollin, Claude (KI-Assistent)

- 8 generierte Charts visuell gegen Quelldaten verifiziert — alle Werte korrekt
- 4 Faktenfehler in Knowledge korrigiert:
  - index.md: A1.1.1.1 PAG war VRFDI, richtig ist VRFIN (aus PSB L2)
  - data.md Section 1.6: A1.1.1.1 Meilensteine 6→8, D3.3.3 Meilensteine 4→6
- 2 neue Erkenntnisse in data.md dokumentiert:
  - PSB B3 enthaelt Prefix "LV25-27 " (Section 1.1)
  - SAP kann Mehrfach-LV-Nummern enthalten, "+"-getrennt (Section 4)
- README.md und CLAUDE.md aktualisiert: prototype/ und output/ ergaenzt
- plan.md als abgeschlossen markiert

---

## 2026-03-10 (Abend) – Prototyp implementiert und getestet

**Teilnehmer:** Christopher Pollin, Claude (KI-Assistent)

- 3 Python-Skripte + config.py erstellt in prototype/
- **01_konsolidierung.py**: PSB-Reader (zellenweise, Merged Cells), SAP-Reader (Mehrfach-LV-Nummern), Dashboard-Reader (PPM-Felder), Konsolidierung, Validierung, Excel-Export
- **02_visualisierung.py**: 8 Charts via matplotlib (Ampelverteilung Gesamt+PAG, Projekte nach PAG/Leistungsbereich/Phase, Budget Plan vs. Ist, Gantt-Zeitleiste, Fertigstellungsgrad)
- **03_bericht.py**: PPTX-Quartalsbericht (Template-basiert, Charts eingebettet, Statusbericht-Tabelle), Dashboard-Excel (Tabelle1-Format mit Conditional Formatting), LV-Monitoring-Excel
- Verifikation Milestone 1: Alle 4 PSBs korrekt gelesen (Ampel, Phase, Fortschritt, Risiko, Meilensteine)
- Technische Entscheidung: plotly/kaleido → matplotlib (Kaleido-Chromium war auf Windows zu langsam)
- Korrektur: LV-Nr-Prefix "LV25-27" wird aus PSB-Werten extrahiert; SAP-Mehrfach-LV-Nummern aufgesplittet

---

## 2026-03-10 – Knowledge Vault angelegt

**Teilnehmer:** Christopher Pollin, Claude (KI-Assistent)

- Alle Quelldateien systematisch analysiert (4 parallele Agents: Dashboard, PSBs, Projektauftraege, SAP+PPT)
- 5 Knowledge-Dateien erstellt: index.md, use-case.md, data.md, berechnungslogik.md, parameter.md
- Verifikation: 8 Stichproben gegen Originaldaten, 2 Fehler korrigiert:
  - Risikoeinschaetzung-Zelle: I14 war Label, Wert steht in L14
  - Projektphase-Normalisierung: PSB="Nicht gestartet" vs. Dashboard="Idee erfasst/noch nicht gestartet"
- Ordnerstruktur: quelldaten/ mit 7 Unterordnern
- 14 Quelldateien identifiziert und nach Funktion klassifiziert

---

## 2026-02-14 (Session 5) – UI/UX-Verbesserungen

**Teilnehmer:** Christopher Pollin, Claude (KI-Assistent)

Design-Review des Dashboards. 10 Kritikpunkte identifiziert, 8 umgesetzt: Gelb-Kontrast (WCAG AA), KPI-Leiste 7→5 Karten, Typographische Hierarchie, Grid-Layout max 350px, Budget-Balken 12px, Loading-Spinner, Filter-Reset bedingt, Testdaten-Banner.

---

## 2026-02-14 (Session 4) – Dashboard-Refactoring und Knowledge-Update

**Teilnehmer:** Christopher Pollin, Claude (KI-Assistent)

CSS als Single Source of Truth fuer Farben (getCSSColor()-Helper), CHART_DEFAULTS + createChart(), JSDoc fuer 21 Funktionen, Knowledge-Dokumente aktualisiert.

---

## 2026-02-14 (Session 3) – Dashboard-Implementierung (Stufe 3)

**Teilnehmer:** Christopher Pollin, Claude (KI-Assistent)

HTML/CSS/JS statt Streamlit. Chart.js via CDN. Alle 5 User Stories (E3-S1 bis E3-S5) implementiert: KPI-Leiste, Sticky-Filter, Ampel-Grid, Budget-Uebersicht, Soll/Ist-Vergleich, Verteilungen, Detail-Modal.

---

## 2026-02-14 (Session 2) – Anforderungsanalyse und User Stories

**Teilnehmer:** Christopher Pollin, Claude (KI-Assistent)

5 Epics, 18 User Stories, 4 Rollen, 10 Forschungsquellen (2024-2025). ECKM-Studie validiert Ansatz. anforderungen.md als eigenstaendiges Dokument.

---

## 2026-02-14 (Session 1) – Repository-Aufbau und erste Konsolidierung

**Teilnehmer:** Christopher Pollin, Claude (KI-Assistent)

Repository-Struktur, Knowledge-Dokumente (6→4 Dateien), Single Source of Truth, .gitignore, consolidate.py mit Bugfix (Indikator-Parsing). Korrekturen durch C. Pollin: §13 UG, BMFWF, WBV-BGBl, Begleitgespraeche mind. 2x/Jahr.
