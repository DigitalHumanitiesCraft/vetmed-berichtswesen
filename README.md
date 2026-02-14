# vetmed-berichtswesen

Promptotype fuer das LV-Vorhaben-Berichtswesen der VetMedUni Wien (Use Case 2 im [VetMedAI-Projekt](https://github.com/DigitalHumanitiesCraft)).

## Was ist das?

Das Repository demonstriert, wie der manuelle Prozess der Projektstatusberichts-Konsolidierung automatisiert werden kann. Es arbeitet mit synthetischen Testdaten und dient als Lehrbeispiel fuer [Promptotyping](https://github.com/DigitalHumanitiesCraft/promptotyping-evaluation-framework) auf ein Datenintegrationsproblem.

## Workflow

```
PSB-Vorlagen (Excel)  →  Konsolidierung (Python)  →  Dashboard  →  Export
     data/sample/          scripts/consolidate.py      (geplant)    (geplant)
```

## Schnellstart

```bash
# Synthetische Testdaten generieren
python scripts/generate_sample_data.py

# PSBs konsolidieren
python scripts/consolidate.py

# Ergebnis pruefen
cat data/consolidated/quality_report.md
```

Voraussetzung: Python 3.11+ und openpyxl (`pip install openpyxl`).

## Repository-Struktur

```
data/
  templates/        Leere PSB-Vorlage
  sample/           5 synthetische Projektstatusberichte
  consolidated/     Konsolidierte Ausgabe (JSON, CSV, Quality Report)
scripts/
  generate_sample_data.py   Testdaten erzeugen
  consolidate.py            Konsolidierungsscript
knowledge/
  projektkontext.md         Gesamtkontext, Methodik, Anforderungen, Workflow
  rechtlicher-rahmen.md     UG 2002, LV-Kapitelstruktur, Monitoring-Zyklen
  datenmodell.md            PSB-Struktur und Felddefinitionen
  validierung.md            Berechnungsregeln, Validierungsstrategie, Quality Report
  journal.md                Arbeitstagebuch (Entscheidungen, Aenderungen pro Session)
docs/                       GitHub Pages-Publikation (geplant)
```

## Synthetische Testdaten

Die 5 PSBs bilden realistische Szenarien ab:

| ID | Projekt | Ampel | Besonderheit |
|----|---------|-------|-------------|
| LV-2024-001 | Digitalisierung Labormanagement | gruen | Planmaessiger Verlauf |
| LV-2024-002 | Curriculumreform | gelb | Verzoegerung, Zielwert knapp verfehlt |
| LV-2023-005 | Forschungsinfrastruktur Biobank | gruen | Berichtszeitraum "Q1" statt "Q1/2025" |
| LV-2024-003 | IT-Sicherheitskonzept | rot | Fehlender Istwert, kein Projektauftrag |
| LV-2024-004 | Nachhaltigkeitsstrategie | gruen | Inkonsistente Ampel (gruen trotz Verzoegerung) |

## Kontext

Teil des VetMedAI-Projekts (KI-Kompetenzaufbau an der VetMedUni Wien, 01/2026–10/2026). Verwandtes Repository: [vetmed-wissensbilanz](https://github.com/DigitalHumanitiesCraft/vetmed-wissensbilanz) (Use Case 1).

## Hinweis

Internes Repository der VetMedUni Wien. Enthaelt ausschliesslich synthetische Testdaten.
