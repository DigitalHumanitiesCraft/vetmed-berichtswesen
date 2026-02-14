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

---

## 2026-02-14 (Session 2) – Anforderungsanalyse und User Stories

**Teilnehmer:** Christopher Pollin, Claude (KI-Assistent)

### Entscheidungen

1. **Anforderungsdokument**: knowledge/anforderungen.md als eigenstaendiges Dokument (nicht in projektkontext.md integriert), weil es eine andere Funktion hat (Tracking vs. Kontextbeschreibung).
2. **5 Epics entlang des 4-Stufen-Workflows**: Epic 1 (Erfassung), Epic 2 (Konsolidierung), Epic 3 (Dashboard), Epic 4 (Export), Epic 5 (Wissensbasis). Epic 1, 2 und 5 sind Done.
3. **4 Rollen identifiziert**: FV (Forster), PL (Pollin), RK (Rektorat), PE (Projekterfasser).
4. **Forschungsbasierung**: 10 externe Quellen (2024-2025) als Quellenverzeichnis mit URLs aufgenommen.
5. **Streamlit als Dashboard-Technologie**: Fuer Promptotyping-Phase empfohlen (Kanaries 2025).
6. **Naechster Schritt**: Epic 3 (Dashboard), abhaengig vom Workshop 04.03.

### Aenderungen

| Datei | Aenderung |
|-------|-----------|
| knowledge/anforderungen.md | Neu: 5 Epics, 18 User Stories, 4 Rollen, Forschungstabelle, 10 Quellen |
| CLAUDE.md | anforderungen.md in Repository-Struktur und Wissensdokumente aufgenommen |
| README.md | anforderungen.md in Repository-Struktur aufgenommen |
| knowledge/journal.md | Dieser Eintrag |

### Forschungsbefunde (Auswahl)

- ECKM-Studie: Wissensbilanz-Digitalisierung des BMBWF hatte identisches Problem (manuelle PDF-Kompilierung)
- BMBWF LV 2025-2027: Aktiver Zyklus, VetMedUni mit Digitalisierungsschwerpunkt (GSV 4)
- Steiner/Pollin CHI 2025: Promptotyping-Methodik als Grundlage bestaetigt
- TDWI 2024/2025: Propose-Validate-Pattern und 8 Datenqualitaetsdimensionen validieren Ansatz

### Offen

- Unveraendert gegenueber Session 1 (Workshop 04.03. steht noch aus)

---

## 2026-02-14 (Session 3) – Dashboard-Implementierung (Stufe 3)

**Teilnehmer:** Christopher Pollin, Claude (KI-Assistent)

### Entscheidungen

1. **HTML/CSS/JS statt Streamlit**: Dashboard als statische Webanwendung, kein Python-Framework. Begruendung: Zero Dependencies (ausser Chart.js CDN), einfache Verteilung, kein Python-Server im Dauerbetrieb noetig.
2. **Chart.js via CDN**: Einzige externe Abhaengigkeit. Balkendiagramme (Budget, Soll/Ist), Donut-Charts (Ampel, Massnahmen), Pie-Chart (Kapitel).
3. **Getrennte Dateien**: index.html + style.css + app.js statt Single-File. Erfordert lokalen HTTP-Server (start_dashboard.py), ermoeglicht aber saubere Trennung.
4. **Alle 5 User Stories**: E3-S1 bis E3-S5 komplett implementiert. Kein stufenweiser Rollout.
5. **Design**: Sachlich-professionell. Weiss/Grau-Basis, Ampelfarben als Akzente, CSS Custom Properties fuer konsistentes Design-System.
6. **consolidated.json als Datenquelle**: Dashboard liest direkt die JSON-Ausgabe der Konsolidierung. start_dashboard.py kopiert die aktuelle Version automatisch.

### Aenderungen

| Datei | Aenderung |
|-------|-----------|
| docs/index.html | Neu: Semantische HTML-Struktur mit Header, KPI-Leiste, Filter, Ampel-Grid, Budget, Soll/Ist, Verteilungen, Modal, Footer |
| docs/style.css | Neu: Design-System (CSS Custom Properties), Komponenten-Styles, responsive Breakpoints |
| docs/app.js | Neu: Daten laden, KPI-Rendering, Filter-Logik, Ampel-Grid, Budget-Chart+Tabelle, Soll/Ist-Charts, Verteilungs-Charts, Detail-Modal |
| start_dashboard.py | Neu: Lokaler HTTP-Server (Port 8080), kopiert consolidated.json, oeffnet Browser |
| knowledge/anforderungen.md | E3-S1 bis E3-S5 Status auf Done, Roadmap aktualisiert |
| knowledge/journal.md | Dieser Eintrag |

### Dashboard-Features

- **KPI-Leiste**: 7 Karten (Projektanzahl, Ampel-Zaehler, Budget, Warnungen)
- **Sticky-Filter**: Kapitel, Auftraggeber, Ampelstatus mit reaktivem Re-Rendering
- **Ampel-Grid**: Projektkarten mit Ampelpunkt, Budget-Balken, Warnungsanzeige
- **Budget-Uebersicht**: Horizontales Balkendiagramm + Tabelle mit Summenzeile
- **Soll/Ist-Vergleich**: Gruppierte Balken pro Projekt, farbcodiert (gruen/rot/grau)
- **Verteilungen**: 3 Donut/Pie-Charts (Ampel, Kapitel, Massnahmenstatus)
- **Detail-Modal**: Vollstaendige Projektansicht mit Indikatoren, Massnahmen, Warnungen

### Offen

- Kapitel-Zuordnung: A-D vs. Lehre/Forschung/Infrastruktur (Workshop 04.03.)
- Epic 4 (Export): PNG/PDF-Export, Quartalsberichte, LV-Einzelberichte
- pandera-Schema fuer automatisierte Validierung

---

## 2026-02-14 (Session 4) – Dashboard-Refactoring und Knowledge-Update

**Teilnehmer:** Christopher Pollin, Claude (KI-Assistent)

### Entscheidungen

1. **Knowledge-Dokumente aktualisiert**: CLAUDE.md, projektkontext.md, validierung.md, datenmodell.md auf aktuellen Stand gebracht (Dashboard als implementiert, docs/-Struktur, start_dashboard.py).
2. **Kein Over-Engineering**: Refactoring bleibt konservativ — keine Datei-Aufteilung, keine ES-Module, kein Build-Tool. Promptotype-Prinzip.
3. **CSS als Single Source of Truth fuer Farben**: 4 neue CSS Custom Properties (--color-budget-spent, --color-neutral, --color-kapitel-infrastruktur, --color-chart-grid). getCSSColor()-Helper liest Werte fuer Chart.js.
4. **CHART_DEFAULTS + createChart()**: Gemeinsame Chart.js-Konfiguration extrahiert, aber Chart-Konfigurationen bleiben explizit (keine createBarChart()-Abstraktion).
5. **JSDoc fuer alle Funktionen**: 21 Funktionen mit @param/@returns dokumentiert. formatValue()-Heuristik explizit erklaert.

### Aenderungen

| Datei | Aenderung |
|-------|-----------|
| docs/style.css | Datei-Header mit Sektionsverzeichnis, 4 neue CSS Custom Properties, Badge-Sektion nummeriert (10), !important-Kommentar, 14 Sektionen |
| docs/app.js | Datei-Header mit Architektur/Datenfluss, Sektionsnummern korrigiert (15 statt 14, doppelte "3" aufgeloest), getCSSColor()-Helper, CHART_DEFAULTS + initChartDefaults() + createChart(), 12 inline Hex-Farben durch Konstanten ersetzt, JSDoc fuer alle 21 Funktionen |
| docs/index.html | Kommentarblock mit Datei-Beziehungen und Start-Anleitung |
| CLAUDE.md | Dashboard als implementiert, docs/-Struktur mit Dateien, start_dashboard.py, Dashboard-Konventionen |
| knowledge/projektkontext.md | Stufe 3 implementiert, Kann-Anforderung Dashboard entschieden, Offener Punkt 1 entschieden, anforderungen.md in Verwandte Dokumente |
| knowledge/validierung.md | Parquet entfernt, JSON als Dashboard-Datenquelle, neuer Abschnitt "Implementiert im Dashboard", Epic-4-Punkte in "Noch nicht implementiert" |
| knowledge/datenmodell.md | Neuer Abschnitt "Dashboard-Datenfluss" mit berechneten Feldern |
| knowledge/journal.md | Dieser Eintrag |

### Refactoring-Kennzahlen

| Metrik | Vorher | Nachher |
|--------|--------|---------|
| app.js Zeilen | 813 | ~1000 (JSDoc +~120, Helper +~40, Kommentare +~30) |
| app.js Sektionen | 14 (mit Luecke) | 15 (sequentiell) |
| style.css Sektionen | 13 (Badge ohne Nummer) | 14 (alle nummeriert) |
| Hardcodierte Hex-Farben in JS | 26 | ~14 (nur Konstanten + Error-Fallback) |
| JSDoc-dokumentierte Funktionen | 0 | 21 |
| CSS Custom Properties | 27 | 31 |

### Offen

- Unveraendert gegenueber Session 3 (Workshop 04.03. steht noch aus)

---

## 2026-02-14 (Session 5) – UI/UX-Verbesserungen

**Teilnehmer:** Christopher Pollin, Claude (KI-Assistent)

### Kontext

Design-Review des Dashboards aus der Perspektive eines UI/UX-Experten. 10 Kritikpunkte identifiziert und alle 8 umsetzbaren Punkte implementiert.

### Entscheidungen

1. **Gelb-Kontrast (Accessibility)**: Neuer Token `--ampel-gelb-text: #8a6d00` fuer Textelemente. WCAG AA-konform (Kontrastverhaeltnis >4.5:1 auf Weiss). Gelbe Ampelfarbe (`#ffc107`) bleibt fuer Punkte/Balken, nur Text-Darstellung geaendert.
2. **KPI-Leiste verdichtet**: 7 Karten → 5 Karten. Ampel-Zaehler (Gruen/Gelb/Rot) in eine kompakte `ampel-summary`-Komponente zusammengefasst mit Farbpunkten und Zahlen nebeneinander.
3. **Typographische Hierarchie**: Header-Titel `1.25rem → 1.5rem` (font-weight 700), Section-Titles `1.125rem → 1.25rem` (font-weight 700), KPI-Labels `0.75rem uppercase → 0.875rem` normal.
4. **Grid-Layout**: `minmax(300px, 1fr) → minmax(300px, 350px)` — Karten wachsen nicht mehr auf volle Breite.
5. **Budget-Balken**: `8px → 12px` Hoehe, `border-radius: 4px → 6px`.
6. **Loading-State**: CSS-Spinner-Overlay das beim Start angezeigt und nach Laden ausgeblendet wird (300ms Fade-Out).
7. **Filter-Reset bedingt**: Button per CSS (`opacity: 0, pointer-events: none`) unsichtbar, wird via JS-Klasse `is-visible` eingeblendet wenn Filter aktiv.
8. **Testdaten-Banner**: Prominenter gelber Banner direkt unter dem Header statt unauffaellig im Footer.

### Aenderungen

| Datei | Aenderung |
|-------|-----------|
| docs/style.css | `--ampel-gelb-text` Token, Ampel-Summary-Styles, Test-Banner, Loading-Overlay mit Spinner-Animation, KPI-Grid 7→5 Spalten, Typographie-Updates, Budget-Balken 12px, Filter-Reset bedingt sichtbar, Footer zentriert |
| docs/app.js | `AMPEL_COLORS.gelb.text` hinzugefuegt, Loading-Overlay nach Laden entfernen, Filter-Reset `is-visible` Toggle in `applyFilters()` und Reset-Handler |
| docs/index.html | Testdaten-Banner, Loading-Overlay, KPI-Leiste mit `ampel-summary`-Komponente, Footer vereinfacht |
| knowledge/journal.md | Dieser Eintrag |

### UI-Verbesserungen (Vorher/Nachher)

| Punkt | Vorher | Nachher |
|-------|--------|---------|
| KPI-Karten | 7 gleichwertige Karten | 5 Karten, Ampel als kompakte Einheit |
| Gelb-Kontrast | #ffc107 auf Weiss (1.9:1) | #8a6d00 fuer Text (>4.5:1) |
| Header-Titel | 1.25rem, weight 600 | 1.5rem, weight 700 |
| Section-Titles | 1.125rem, weight 600 | 1.25rem, weight 700 |
| Budget-Balken | 8px Hoehe | 12px Hoehe |
| Grid-Karten | Wachsen auf volle Breite | Max 350px breit |
| Loading | "--" Platzhalter | Spinner-Overlay |
| Filter-Reset | Immer sichtbar | Nur bei aktiven Filtern |
| Testdaten-Hinweis | Im Footer | Gelber Banner oben |

### Offen

- Kapitel-Zuordnung: A-D vs. Lehre/Forschung/Infrastruktur (Workshop 04.03.)
- Verhaeltnis Quartalsbericht zu LV-Monitoring-Zyklus (Workshop 04.03.)
- Epic 4 (Export): PNG/PDF-Export, Quartalsberichte, LV-Einzelberichte
- pandera-Schema fuer automatisierte Validierung
- Rolle der Wissensbilanz (WBV) im Workflow
