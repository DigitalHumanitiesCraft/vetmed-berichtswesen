# CLAUDE.md – vetmed-berichtswesen

## Projektkontext

Promptotype fuer Use Case 2 des VetMedAI-Projekts (KI-Kompetenzaufbau an der VetMedUni Wien). Das Repository bildet den Workflow fuer das LV-Vorhaben-Berichtswesen ab: Projektstatusberichte (PSB) werden aus Excel-Vorlagen konsolidiert, ausgewertet und fuer das Rektorat aufbereitet.

Das Repository arbeitet ausschliesslich mit synthetischen Testdaten. Keine realen Werte, keine personenbezogenen Daten.

## Kernproblem

Datenintegration, nicht Visualisierung. Der bestehende manuelle Prozess funktioniert, weil der Fachverantwortliche die Regeln kennt. Dieses Repository dokumentiert diese Regeln explizit und automatisiert die Konsolidierung.

## 4-Stufen-Workflow

1. **Erfassung** – PSB-Excel-Vorlagen werden ausgefuellt (data/templates/)
2. **Konsolidierung** – Einzelne PSBs werden zusammengefuehrt (scripts/consolidate.py). Enthaelt bewusst eine manuelle Ueberpruefungsphase via quality_report.md
3. **Dashboard** – Auswertungen visualisieren (noch nicht implementiert)
4. **Export** – Zielgruppenspezifische Ausgabeformate (noch nicht implementiert)

## Repository-Struktur

```
data/
  templates/     Leere PSB-Vorlage (PSB_Vorlage.xlsx)
  sample/        5 synthetische ausgefuellte PSBs
  consolidated/  Konsolidierte Ausgabe (JSON, CSV, Quality Report)
scripts/
  generate_sample_data.py   Erzeugt die synthetischen Testdaten
  consolidate.py            Konsolidierungsscript (Stufe 2)
knowledge/
  projektkontext.md         Gesamtkontext, Methodik, Beteiligte, Anforderungen, Workflow, offene Punkte
  rechtlicher-rahmen.md     UG 2002, LV-Kapitelstruktur, Monitoring-Zyklen
  datenmodell.md            PSB-Struktur und Felddefinitionen
  validierung.md            Berechnungsregeln, Validierungsstrategie, Quality Report, Python-Stack
  journal.md                Arbeitstagebuch: Entscheidungen, Aenderungen, offene Punkte pro Session
docs/                       GitHub Pages-Publikation (noch nicht implementiert)
```

## PSB-Datenstruktur

Jeder Projektstatusbericht enthaelt:

**Metadaten:** Projekt-ID (Format: LV-YYYY-NNN), Titel, Kapitel (Lehre/Forschung/Infrastruktur), Auftraggeber, Laufzeit (von/bis), Budget (gesamt/verbraucht), Projektauftrag (ja/nein), Berichtszeitraum (Format: Qn/YYYY), Ampelstatus (gruen/gelb/rot).

**Indikatoren:** Name, Einheit, Ziel- und Istwerte pro Jahr (2024, 2025, 2026).

**Massnahmen:** Name, Status (geplant/in Umsetzung/abgeschlossen/verzoegert), Termin.

**Freitext:** Kommentar/Erlaeuterung, Kurzbeschreibung.

## Bekannte Qualitaetsprobleme (bewusst eingebaut)

Diese Probleme bilden reale Datenqualitaetsfaelle ab:

- **PSB_LV-2023-005:** Berichtszeitraum "Q1" statt "Q1/2025" (Normalisierungsproblem)
- **PSB_LV-2024-003:** Fehlender Istwert bei einem Indikator (unvollstaendige Erfassung)
- **PSB_LV-2024-004:** Ampel "gruen" trotz verzoegerter Massnahmen und verfehlter Zielwerte (inkonsistente Bewertung)

Das Konsolidierungsscript erkennt diese Faelle und meldet sie im quality_report.md.

## Konventionen

- Python 3.11+, openpyxl fuer Excel-Verarbeitung
- Encoding: UTF-8
- CSV-Trenner: Semikolon (deutschsprachiges Umfeld)
- Datumsformat: DD.MM.YYYY
- Berichtszeitraum: Qn/YYYY
- Ampelwerte: gruen, gelb, rot (lowercase)

## Wissensdokumente (knowledge/)

Die Dokumente in knowledge/ sind die stabilen Artefakte dieses Repositories. Sie dokumentieren das Domaenenwissen, das vor jeder Code-Aenderung konsultiert werden sollte. Der Code in scripts/ kann jederzeit neu generiert werden, solange die Wissensdokumente korrekt und vollstaendig sind.

**Vor jeder Session:** journal.md lesen. Es dokumentiert alle bisherigen Entscheidungen, Aenderungen und offenen Punkte. Neue Eintraege am Ende jeder Session ergaenzen.

**Einstiegspunkt:** projektkontext.md erklaert das Gesamtprojekt, die Methodik, die Rollen, Anforderungen und offene Punkte. Von dort aus verweisen Inline-Links auf alle anderen Dokumente.

**Fuer Datenverarbeitung:** datenmodell.md (Feldstruktur) → validierung.md (Berechnungsregeln, Validierungsstrategie, Quality Report, Python-Stack).

**Fuer fachlichen Kontext:** rechtlicher-rahmen.md (UG 2002, LV-Kapitel, Monitoring-Zyklen).

**Offene Punkte:** Alle im Workshop am 13.02. identifizierten Klaerungsbedarfe sind in projektkontext.md dokumentiert. Die wichtigsten: Kapitel-Zuordnung (A-D oder Lehre/Forschung/Infrastruktur?) und Verhaeltnis Quartalsbericht/LV-Monitoring. Klaerung geplant fuer 04.03.

## Datenschutz

Dieses Repository enthaelt keine realen Daten. Bei der spaeteren Uebertragung auf echte Daten gilt: Alle Daten bleiben intern, keine Uebertragung an externe Dienste. Das betrifft insbesondere die Nutzung von LLM-Diensten – dort duerfen nur synthetische oder anonymisierte Daten eingegeben werden.
