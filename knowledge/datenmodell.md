# Datenmodell: Projektstatusbericht (PSB)

## Ueberblick

Jeder PSB ist eine Excel-Datei mit einem Sheet "PSB", das vier Bereiche enthaelt: Metadaten, Indikatoren, Massnahmen und Freitext. Die Datei folgt einer festen Zeilenstruktur (Zeile 3–13 Metadaten, danach variable Laenge fuer Indikatoren und Massnahmen).

## Metadaten (Zeile 3–13)

| Zeile | Feld | Spalte | Typ | Format/Werte | Pflicht |
|-------|------|--------|-----|-------------|---------|
| 3 | Projekt-ID | B | String | LV-YYYY-NNN | ja |
| 4 | Projekttitel | B | String | Freitext | ja |
| 5 | Kapitel | B | String | Lehre, Forschung, Infrastruktur | ja |
| 6 | Auftraggeber | B | String | Rektorat, Vizerektorat Lehre, Vizerektorat Forschung, Vizerektorat Infrastruktur | ja |
| 7 | Laufzeit von | B | Datum | DD.MM.YYYY | ja |
| 8 | Laufzeit bis | B | Datum | DD.MM.YYYY | ja |
| 9 | Budget gesamt | B | Zahl | EUR, ganzzahlig | ja |
| 10 | Budget verbraucht | B | Zahl | EUR, ganzzahlig | ja |
| 11 | Projektauftrag | B | String | ja, nein | ja |
| 12 | Berichtszeitraum | B | String | Qn/YYYY (z.B. Q4/2024) | ja |
| 13 | Ampelstatus | B | String | gruen, gelb, rot | ja |

### Dimension "Kapitel"

Das Feld "Kapitel" gruppiert Projekte nach thematischer Zuordnung. Die aktuellen Werte in den synthetischen Testdaten sind Lehre, Forschung und Infrastruktur. Die Zuordnung erfolgt durch den Fachverantwortlichen und ist nicht aus den Projektdaten ableitbar.

**Hypothese:** Die Dimension entspricht wahrscheinlich der [Kapitelstruktur der Leistungsvereinbarung](rechtlicher-rahmen.md) (A/B/C/D). Die aktuellen Werte "Lehre", "Forschung", "Infrastruktur" koennten eine vereinfachte Darstellung sein oder einer aelteren Gliederung folgen. Im Workshop am 04.03. mit Forster klaeren (siehe [offene Punkte](projektkontext.md)).

## Indikatoren (ab Zeile 15, variable Laenge)

Tabellenformat mit Header-Zeile (erkennbar an "Indikator" in Spalte A, "Einheit" in Spalte B).

| Spalte | Feld | Typ | Anmerkung |
|--------|------|-----|-----------|
| A | Indikatorname | String | Eindeutig pro Projekt |
| B | Einheit | String | %, Personen, Stueck, Skala 1-5 |
| C | Zielwert 2024 | Zahl | |
| D | Istwert 2024 | Zahl | Kann fehlen |
| E | Zielwert 2025 | Zahl | |
| F | Istwert 2025 | Zahl | Wird spaeter befuellt |
| G | Zielwert 2026 | Zahl | |

Anzahl Indikatoren pro Projekt: 1–3 (variabel). Ende der Tabelle: leere Zeile oder Beginn des Massnahmen-Blocks.

## Massnahmen (nach Indikatoren, variable Laenge)

Tabellenformat mit Header-Zeile (erkennbar an "Massnahme" in Spalte A, "Status" in Spalte B).

| Spalte | Feld | Typ | Werte |
|--------|------|-----|-------|
| A | Massnahmenname | String | |
| B | Status | String | geplant, in Umsetzung, abgeschlossen, verzoegert |
| C | Termin | Datum/String | DD.MM.YYYY |

Ende der Tabelle: leere Zeile oder Beginn des Kommentar-Blocks.

## Freitext

**Kommentar / Erlaeuterung:** Freitext-Block nach den Massnahmen. Erkennbar an Sektions-Header "Kommentar / Erlaeuterung". Inhalt in der Folgezeile, merged ueber Spalten A–H.

**Kurzbeschreibung:** Freitext-Block nach dem Kommentar. Erkennbar an Sektions-Header "Kurzbeschreibung". Inhalt in der Folgezeile.

## Konsolidierte Ausgabe

Das Konsolidierungsscript erzeugt drei Dateien:

- **consolidated.json** – Vollstaendige strukturierte Daten aller Projekte mit Metablock. Datenquelle fuer das Dashboard.
- **consolidated.csv** – Flache Uebersichtstabelle (Semikolon-getrennt)
- **quality_report.md** – Auffaelligkeiten und Warnungen zur manuellen Pruefung

## Dashboard-Datenfluss

`data/consolidated/consolidated.json` → `start_dashboard.py` kopiert nach `docs/consolidated.json` → Dashboard liest via `fetch('consolidated.json')`.

Die JSON-Struktur enthaelt einen `meta`-Block (Generierungszeitpunkt, Anzahl Projekte) und ein `projekte`-Array. Das Dashboard berechnet folgende abgeleitete Werte im Frontend:

| Berechnetes Feld | Formel | Verwendung |
|-----------------|--------|------------|
| Budget-Verbrauch % | `budget_verbraucht / budget_gesamt * 100` | KPI-Karte, Budget-Tabelle, Fortschrittsbalken |
| Gesamtbudget | `Summe(budget_gesamt)` | KPI-Karte, Budget-Tabelle Summenzeile |
| Ampel-Zaehler | `Count je Ampelwert` | KPI-Karten, Ampel-Donut |
| Warnungen gesamt | `Summe(warnungen.length)` | KPI-Karte |
| Massnahmenstatus-Verteilung | `Count je Status ueber alle Projekte` | Massnahmen-Donut |
| Zielwert-Erreichung | `istwert >= zielwert` | Farbcodierung Soll/Ist-Balken (gruen/rot/grau) |

## Verwandte Dokumente

- [validierung.md](validierung.md) — Berechnungsregeln, Validierungsstrategie, Quality Report
- [projektkontext.md](projektkontext.md) — Anforderungen, 4-Stufen-Workflow, offene Punkte
- [rechtlicher-rahmen.md](rechtlicher-rahmen.md) — LV-Kapitelstruktur und Monitoring-Zyklen
