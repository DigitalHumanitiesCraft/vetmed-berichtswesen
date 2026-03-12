# CLAUDE.md – vetmed-berichtswesen

## Projektkontext

Promptotype fuer Use Case 2 des VetMedAI-Projekts (KI-Kompetenzaufbau an der VetMedUni Wien). Das Repository bildet den Workflow fuer das LV-Vorhaben-Berichtswesen ab: Projektstatusberichte (PSB) werden aus Excel-Vorlagen konsolidiert, ausgewertet und fuer das Rektorat aufbereitet.

Fachverantwortliche: Sabrina Laboureix (Referentin PPM, Stabsstelle SUES). Portfolioumfang: ca. 118 Vorhaben.

Das Repository arbeitet mit fiktiven Beispieldaten. Keine realen Werte, keine personenbezogenen Daten.

## Kernproblem

Datenintegration, nicht Visualisierung. Der bestehende manuelle Prozess funktioniert, weil die Fachverantwortliche die Regeln kennt. Dieses Repository dokumentiert diese Regeln explizit und automatisiert die Konsolidierung.

## 4-Stufen-Workflow

1. **Erfassung** – PSB-Excel-Vorlagen werden ausgefuellt (quelldaten/psb/)
2. **Konsolidierung** – PSBs + SAP + Dashboard zusammengefuehrt (prototype/01_konsolidierung.py → output/review/konsolidiert.xlsx)
3. **Dashboard** – Interaktives HTML/CSS/JS-Dashboard (docs/). Start via `python start_dashboard.py`
4. **Export** – PPTX-Quartalsbericht, Dashboard-Excel, LV-Monitoring (prototype/03_bericht.py → output/reports/)

## Repository-Struktur

```
quelldaten/                       Originaldateien (fiktive Beispieldaten)
  briefing/                       Original Use-Case-Auftrag (One-Pager)
  vorlagen/                       Leere Templates (PSB + Projektauftrag)
  psb/                            4 Beispiel-Projektstatusberichte (Excel)
  projektauftraege/               4 Beispiel-Projektauftraege (Word/PDF)
  dashboard/                      Konsolidiertes Portfolio-Dashboard (Excel, 11 Sheets)
  finanzen/                       SAP-Auszug mit Plan-/Ist-Budgetdaten
  berichte/                       Portfoliobericht Q4/2025 (PowerPoint)
prototype/                        Python-Automatisierung
  config.py                       Pfade, Normalisierungs-Mappings, Feiertage
  01_konsolidierung.py            PSBs + SAP → konsolidiertes Excel
  02_visualisierung.py            8 Charts (matplotlib)
  03_bericht.py                   PPTX + Dashboard-Excel + LV-Monitoring
  requirements.txt                Dependencies
output/                           Generierte Ergebnisse (in .gitignore)
  review/                         Konsolidiertes Excel zur Korrektur
  charts/                         PNG-Charts
  reports/                        PPTX, Dashboard-Excel, LV-Monitoring
knowledge/                        Synthetisiertes Domaenenwissen
  index.md                        Einstiegspunkt, Quelldateien, Navigation
  use-case.md                     Prozess, Workflow, Anforderungen
  data.md                         Datenstrukturen und Schemas (PSB, Dashboard, SAP, PPT)
  berechnungslogik.md             Formeln, Ampellogik, Aggregationen
  parameter.md                    Dropdown-Werte, Codelisten, Normalisierung
  projektkontext.md               VetMedAI-Einordnung, Methodik, Beteiligte
  anforderungen.md                Epics, User Stories, Rollen, Forschungsgrundlage
  validierung.md                  Validierungsstrategie, Quality Report, Python-Stack
  rechtlicher-rahmen.md           UG 2002, LV-Kapitelstruktur, Monitoring-Zyklen
  journal.md                      Arbeitstagebuch
docs/                             Dashboard (HTML/CSS/JS)
  index.html                      Dashboard HTML-Struktur
  style.css                       Design-System und Komponenten-Styles
  app.js                          Dashboard-Applikationslogik
  consolidated.json               Generierte Datenquelle (in .gitignore)
plan.md                           Architekturplan und Milestones (abgeschlossen)
start_dashboard.py                Konvertiert XLSX → JSON, startet HTTP-Server auf Port 8080
```

## PSB-Datenstruktur

Jeder Projektstatusbericht ist eine Excel-Datei mit 43 Zeilen x 12 Spalten und 59 Merged-Cell-Bereichen:

**Identifikation:** LV-Nr. (z.B. A1.1.1.1.1), Bezeichnung, Projektleitung, PAG (Rektor/VRLK/VRFDI/VRFIN), Fertigstellungsgrad, Projektphase.

**Meilensteine:** Bis zu 8 Stueck mit Plan-Datum (LV), Plan-Datum (aktuell), Ist-Datum, Erlaeuterung.

**Status:** Ampelstatus (In Ordnung/Vorsicht/Krise), Risikoeinschaetzung, Erlaeuterung, Risiken, Entscheidungsbedarf.

**Zielwerte:** Indikator, Ausgangswert 2023, Ziel-/Istwerte 2025-2027.

## Konsolidiertes Datenmodell (48 Spalten)

Das Portfolio_Daten-Format umfasst: LV-Nummer, Leistungsbereich, Kapitelzuordnung, Projektname, Kurzbeschreibung, Meilensteine, PL, PAG, Organisationseinheiten, LV-Periode, Projektauftrag, PSB vorhanden, Lenkungsausschuss, Externe Kooperationspartner, Thema Begleitgespraech, Budgeteinbehalt, Prioritaet, Risiko, Start, Ende, Dauer (Werktage), Kostenstelle, Plankosten 2025/2026/2027/gesamt, Istkosten 2025/2026/2027/gesamt/%, Projektphase, Ampelstatus, Fertigstellungsgrad, Ziele, Status/Risiken/Entscheidung (aktuell + Vorperiode).

## Normalisierungsprobleme (bekannt)

| Feld | PSB-Wert | Dashboard-Wert |
|---|---|---|
| Ampelstatus | "in Ordnung" (klein) | "In Ordnung" (gross) |
| PAG | "Rektor:in" | "Rektor" |
| Projektphase | "Nicht gestartet" | "Idee erfasst/noch nicht gestartet" |
| Datum | Mixed ("Q1 26", "TT.MM.JJJJ") | DateTime-Objekte |

## Konventionen

- Python 3.11+, openpyxl, pandas, python-pptx, matplotlib
- Dashboard: HTML/CSS/JS, Chart.js via CDN
- Encoding: UTF-8
- Ampelwerte: In Ordnung, Vorsicht, Krise
- LV-Kapitel: A (Gesellschaftliche Ziele), B (Forschung/EEK), C (Lehre), D (Sonstige)
- Zahlenformat Dashboard: Intl.NumberFormat('de-AT')
- SAP-Betraege: Negativ (Ausgaben), werden beim Einlesen negiert

## Wissensdokumente (knowledge/)

**Vor jeder Session:** journal.md lesen. Dokumentiert alle Entscheidungen und Aenderungen.

**Einstiegspunkt:** index.md verlinkt alle Quelldateien und Knowledge-Dateien.

**Fuer den Gesamtkontext:** projektkontext.md (VetMedAI, Methodik, Beteiligte) → use-case.md (Ist-Prozess, Anforderungen).

**Fuer Datenverarbeitung:** data.md (Schemas, Zellpositionen) → berechnungslogik.md (Formeln) → parameter.md (Codelisten, Normalisierung).

**Fuer Anforderungen:** anforderungen.md (Epics, User Stories, Forschungsgrundlage).

**Fuer rechtlichen Kontext:** rechtlicher-rahmen.md (UG 2002, LV-Kapitel, Monitoring-Zyklen).

## Datenschutz

Dieses Repository enthaelt keine realen Daten. Bei der spaeteren Uebertragung auf echte Daten gilt: Alle Daten bleiben intern, keine Uebertragung an externe Dienste. In LLM-Dienste duerfen nur synthetische oder anonymisierte Daten eingegeben werden.
