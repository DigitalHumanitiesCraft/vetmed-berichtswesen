# Journal

Arbeitstagebuch des Projekts vetmed-berichtswesen. Dokumentiert Entscheidungen und Aenderungen pro Session. Vor jeder neuen Session lesen.

---

## 2026-02-14 – Repository-Aufbau und erste Konsolidierung

**Teilnehmer:** Christopher Pollin, Claude (KI-Assistent)

### Entscheidungen

1. **docs/ → knowledge/ + docs/**: Wissensdokumente in knowledge/ verschoben. docs/ bleibt reserviert fuer GitHub Pages.
2. **Dokumentenstruktur 6→4**: Redundanzen eliminiert durch Zusammenfuehrung:
   - berechnungslogik.md + datenqualitaet.md → validierung.md
   - projektkontext.md + anforderungen.md → projektkontext.md (erweitert)
   - datenmodell.md und rechtlicher-rahmen.md bleiben eigenstaendig.
3. **Single Source of Truth**: Jedes Konzept wird in genau einem Dokument definiert. Andere Dokumente verlinken per Inline-Link. Kein Duplizieren von Definitionen.
4. **Internes Repository**: Keine MIT-Lizenz. README.md weist auf internen Charakter hin.
5. **.gitignore**: `__pycache__/`, `.claude/`, `.venv/`, `.env` ausgeschlossen. `data/consolidated/` bleibt im Repository (reproduzierbar, aber als Referenz nuetzlich).
6. **Journal als Pflichtlektuere**: journal.md wird in CLAUDE.md als Einstiegspunkt vor jeder Session referenziert.

### Aenderungen

| Datei | Aenderung |
|-------|-----------|
| knowledge/projektkontext.md | Neu: Merge aus projektkontext.md + anforderungen.md (105 Zeilen) |
| knowledge/validierung.md | Neu: Merge aus berechnungslogik.md + datenqualitaet.md (130 Zeilen) |
| knowledge/datenmodell.md | Kapitel-Hypothese gekuerzt, Inline-Links zu rechtlicher-rahmen.md |
| knowledge/rechtlicher-rahmen.md | Korrekturen: §12→§13 LV, BMBWF→BMFWF, WBV-BGBl korrigiert, Begleitgespraeche mind. 2x/Jahr |
| scripts/consolidate.py:97 | **Bugfix**: Indikator-Parsing brach bei Namen mit "Massnahme" ab. Bedingung erweitert um Spalte-B-Pruefung |
| data/consolidated/* | Regeneriert nach Bugfix. quality_report.md zeigt nun alle 9 Warnungen korrekt |
| CLAUDE.md | Repository-Struktur, Wissensdokumente-Abschnitt, offene Punkte aktualisiert |
| README.md | knowledge/-Struktur, Lizenz-Hinweis aktualisiert |
| .gitignore | Erstellt |

### Korrekturen (extern durch C. Pollin)

- rechtlicher-rahmen.md: §13 UG (nicht §12) fuer Leistungsvereinbarungen
- BMFWF (nicht BMBWF) als zustaendiges Ministerium
- WBV: Stammfassung BGBl. II Nr. 97/2016, geltende Fassung BGBl. II Nr. 233/2023
- Begleitgespraeche: Mind. 2x/Jahr (nicht halbjaehrlich)
- Kapitel-Beschreibungen praezisiert, Genehmigungspfad-Fussnote ergaenzt

### Offen

- Kapitel-Zuordnung: A-D (LV-Struktur) vs. Lehre/Forschung/Infrastruktur (PSB). Klaerung am 04.03.
- Verhaeltnis Quartalsbericht zu LV-Monitoring-Zyklus. Klaerung am 04.03.
- Dashboard (Stufe 3) und Export (Stufe 4) noch nicht implementiert
- Rolle der Wissensbilanz (WBV) im Workflow
- pandera-Schema fuer automatisierte Validierung
