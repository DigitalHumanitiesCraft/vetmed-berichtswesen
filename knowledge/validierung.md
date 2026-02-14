# Validierung und Berechnungslogik

## Ausgangslage

Administrative Excel-Workflows akkumulieren implizites Domaenenwissen in drei Formen: Berechnungsformeln mit versteckten Abhaengigkeiten, manuelle Zuordnungen ohne dokumentierte Wertelisten und Korrekturen, die nur der Fachverantwortliche kennt. Das Problem ist nicht die Technologie (Excel ist fuer den Zweck ausreichend), sondern die fehlende Explizierung der Regeln. Jede Automatisierung muss dieses Wissen zuerst extrahieren und dokumentieren, bevor Code geschrieben wird.

## Typische Qualitaetsprobleme

### Normalisierung

Freitextfelder und fehlende Eingabevalidierung fuehren zu inkonsistenten Formaten. Beispiel: Der Berichtszeitraum erscheint als "Q1", "Q1/2025", "1. Quartal 2025" oder "Jan-Maerz 2025". Alle meinen dasselbe, aber maschinelle Verarbeitung scheitert an der Varianz. Testfall: PSB_LV-2023-005 verwendet "Q1" statt "Q1/2025".

### Vollstaendigkeit

Fehlende Werte sind nicht immer Fehler. Ein fehlender Istwert kann bedeuten: noch nicht erhoben, nicht anwendbar oder vergessen. Nur der Fachverantwortliche kann diese Faelle unterscheiden. Automatische Validierung kann nur das Fehlen melden, nicht die Ursache bestimmen. Testfall: PSB_LV-2024-003 hat einen fehlenden Istwert bei einem Indikator.

### Konsistenz

Subjektive Bewertungen (Ampelstatus) widersprechen objektiven Indikatoren. Ein Projekt meldet "gruen", obwohl Massnahmen verzoegert sind und Zielwerte verfehlt wurden. Das ist nicht notwendig ein Fehler — der Fachverantwortliche hat moeglicherweise Kontextinformationen, die den Status rechtfertigen. Aber die Inkonsistenz muss sichtbar gemacht werden. Testfall: PSB_LV-2024-004 hat Ampel "gruen" trotz verzoegerter Massnahmen.

### Implizite Klassifikationen

Zuordnungen wie "Kapitel" oder "Auftraggeber" existieren als implizite Wertelisten im Kopf des Fachverantwortlichen, ohne dokumentierte Taxonomie. Das Konsolidierungsscript nimmt die Werte wie eingetragen, validiert aber nicht gegen eine Werteliste. Zur Kapitelstruktur der Leistungsvereinbarung (A/B/C/D) und dem offenen Klaerungsbedarf siehe [rechtlicher-rahmen.md](rechtlicher-rahmen.md).

## Validierungsstrategie

Die Validierung erfolgt in vier Stufen, von automatisierbar bis manuell:

**Stufe 1: Schema-Validierung.** Technisch pruefbar: Existiert das erwartete Feld? Stimmt der Datentyp? Liegt der Wert im gueltigen Bereich? Entspricht das Format dem Standard (z.B. Qn/YYYY, siehe Feldstruktur in [datenmodell.md](datenmodell.md))? Vollstaendig automatisierbar.

**Stufe 2: Konsistenz-Validierung.** Querbezuege innerhalb eines Datensatzes: Ampelstatus gegenueber Massnahmen-Status, Budget verbraucht gegenueber Budget gesamt, Istwert gegenueber Zielwert. Automatisch erkennbar, aber die Bewertung erfordert Domaenenwissen.

**Stufe 3: Vollstaendigkeitspruefung.** Fehlende Pflichtfelder fuer abgelaufene Berichtszeitraeume. Automatisch erkennbar, Ursachenanalyse manuell.

**Stufe 4: Plausibilitaetspruefung.** Statistische Ausreisser, ungewoehnliche Abweichungen, verdaechtige Muster. Erfordert Domaenenwissen und historischen Kontext.

## Berechnungsregeln

### Ampellogik

Der Ampelstatus wird in den PSBs manuell vergeben. Das Konsolidierungsscript validiert die Konsistenz:

| Bedingung | Erwartete Ampel | Warnung bei |
|-----------|----------------|-------------|
| Alle Zielwerte erreicht, keine Verzoegerungen | gruen | – |
| Zielwerte knapp verfehlt oder einzelne Verzoegerungen | gelb | gruen |
| Erhebliche Abweichungen oder kritische Verzoegerungen | rot | gruen oder gelb |

**Implementierte Pruefung:** Wenn eine Massnahme den Status "verzoegert" hat und die Ampel "gruen" ist, wird eine Warnung erzeugt. (Testfall: PSB_LV-2024-004.)

### Budget-Auswertungen

**Pro Projekt:**

- **Verbrauch in Prozent:** `budget_verbraucht / budget_gesamt * 100`
- **Warnung bei Ueberschreitung:** Wenn `budget_verbraucht > budget_gesamt`

**Aggregiert:**

- **Gesamtbudget:** Summe aller `budget_gesamt`
- **Budgeteinbehalt:** Differenz `Gesamtbudget - Summe budget_verbraucht`
- **Uebersicht nach Auftraggeber:** Gruppierung und Summierung nach Feld `auftraggeber`

### Zielwert-Pruefung

Fuer abgelaufene Berichtszeitraeume (aktuell: 2024) wird geprueft:

1. **Istwert vorhanden?** Fehlende Istwerte werden als Warnung gemeldet
2. **Ziel erreicht?** Bei `istwert < zielwert` wird die prozentuale Abweichung berechnet: `(istwert - zielwert) / zielwert * 100`

### Berichtszeitraum-Normalisierung

Erwartetes Format: `Qn/YYYY` (z.B. "Q4/2024"). Abweichungen wie "Q1" (ohne Jahr), "1. Quartal 2024" oder "Jan-Maerz 2025" werden als Warnung gemeldet. Die Normalisierung erfolgt aktuell nicht automatisch, sondern wird zur manuellen Korrektur vorgeschlagen.

## Quality Report

Der Quality Report (quality_report.md) ist der zentrale Mechanismus: ein automatisch generiertes Dokument, das alle Auffaelligkeiten auflistet und zur manuellen Pruefung vorlegt. Das System trifft keine Entscheidungen, es macht Entscheidungsbedarf sichtbar.

Der Fachverantwortliche prueft, bewertet und gibt frei — oder korrigiert die Eingangsdaten. Dieser Ansatz respektiert das Prinzip des [Critical Expert in the Loop](projektkontext.md): Die Automatisierung unterstuetzt, ersetzt aber nicht die Domaenexpertise.

Der Report enthaelt vier Abschnitte:

1. **Ampelstatus-Uebersicht** – Anzahl Projekte pro Ampelfarbe
2. **Budget-Uebersicht** – Gesamtbudget und Verbrauch
3. **Auffaelligkeiten** – Alle Warnungen gruppiert nach Projekt
4. **Projekte mit roter Ampel** – Gesonderte Detailansicht fuer Rektorats-Vorlage

Langfristig verbessert der Feedback-Zyklus (Report → Korrektur → verbesserte Eingabe) die Datenqualitaet an der Quelle. Strukturierte Erfassung ([Stufe 1 des Workflows](projektkontext.md)) ist daher die wirksamste Massnahme — sie verhindert Probleme, statt sie nachtraeglich zu korrigieren.

## Bewusster manueller Anteil

Die vollstaendige Automatisierung ist weder moeglich noch wuenschenswert. Der manuelle Anteil — Pruefung, Bewertung, Freigabe — ist die Qualitaetssicherung. Was sich automatisieren laesst, ist die Erkennung von Auffaelligkeiten und die strukturierte Aufbereitung fuer die manuelle Pruefung.

## Python-Stack

### openpyxl

Excel-Dateien lesen mit Unterstuetzung fuer Merged Cells, Multi-Section-Layouts und Formatierungsinformationen. Der read-only Modus reduziert Speicherverbrauch bei der Verarbeitung vieler Dateien. openpyxl liest auch Dateien mit XLCubed-Elementen und OLAP-Strukturen.

### pandas

Transformation, Aggregation und Export nach der Extraktion. Optimiert fuer tabellarische Operationen, Gruppierungen und statistische Auswertungen.

### pandera

Schema-Validierung fuer DataFrames. Lightweight Alternative zu Great Expectations. Bietet Lazy Validation (alle Fehler auf einmal melden statt beim ersten abzubrechen), native pandas-Integration und deklarative Schema-Definition. Geeignet fuer die automatisierte Stufe 1 und 2 der Validierung.

### Zielformate

| Format | Zweck | Anmerkung |
|--------|-------|-----------|
| JSON | Menschliche Inspektion | Vollstaendig strukturiert, leicht lesbar |
| SQLite | Primaerer Speicher | Abfragbar, transaktional, einzelne Datei |
| CSV | Excel-Kompatibilitaet | Semikolon-Trenner fuer deutschsprachiges Umfeld |
| Parquet | Dashboard-Anbindung | Fuer spaetere Visualisierungen (Stufe 3) |

## Noch nicht implementiert

Die folgenden Auswertungen aus der bestehenden konsolidierten Excel sind noch nicht abgebildet:

- **Zeitleiste/Gantt:** Visuelle Darstellung der Projektlaufzeiten und Fortschrittsgrade
- **Uebersicht nach Kapitel:** Aggregierte Sicht pro [Kapitel](rechtlicher-rahmen.md)
- **Budgeteinbehalt-Berechnung:** Detaillogik noch unklar, muss mit Forster geklaert werden
- **LV-Monitoring-Export:** Jaehrlicher Ampelstatus mit Erklaerungen fuer das Ministerium

## Verwandte Dokumente

- [datenmodell.md](datenmodell.md) — PSB-Feldstruktur und Datentypen
- [projektkontext.md](projektkontext.md) — Critical Expert in the Loop, Promptotyping-Methodik
- [rechtlicher-rahmen.md](rechtlicher-rahmen.md) — LV-Kapitelstruktur und Monitoring-Zyklen
