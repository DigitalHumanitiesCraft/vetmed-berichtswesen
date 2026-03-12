# Berechnungslogik und Dashboard-Metriken

Zurueck zu [[index]]

---

## 1. Formeln in Portfolio_Daten

### Dauer in Werktagen (Spalte 22)

```excel
=IF(Ende="", "", NETWORKDAYS(Start, Ende, Parameter!$C$4:$C$51))
```

- Berechnet Arbeitstage zwischen Start und Ende
- Schliesst Wochenenden und Feiertage aus (40 Eintraege im Parameter-Sheet, 2025–2026)
- Leer wenn kein Enddatum

### Ist-Kosten Gesamt (Spalte 31)

```excel
=SUM(Istkosten_2025, Istkosten_2026, Istkosten_2027)
```

- Summe der jaehrlichen Ist-Kosten (Spalten 28–30)

### Ist-Kosten in % (Spalte 32)

```excel
=IF(Plankosten_25-27="", "", Ist-Kosten_Gesamt / Plankosten_25-27)
```

- Verhaeltnis Ist zu Plan (Budgetausschoepfung)
- Leer wenn keine Plankosten vorhanden

---

## 2. Aggregationen im Arbeitsbereich-Sheet

### Projektanzahl

```excel
=COUNTA(Tabelle1[Projektname/Bezeichnung des Vorhabens])
```

- Zaehlt alle nicht-leeren Projekteintraege (= Gesamtanzahl)

### Nach Einzelkriterium

```excel
=COUNTIF(Tabelle1[PAG], "VRLK")
=COUNTIF(Tabelle1[Budgeteinbehalt], "Ja")
=COUNTIF(Tabelle1[Projektphase], "In Arbeit")
```

### Nach Mehrfachkriterien

```excel
=COUNTIFS(Tabelle1[LV-Periode], $C8, Tabelle1[PAG], $F$7)
```

- Kombiniert z.B. LV-Periode + PAG
- Verwendet absolute/relative Referenzen fuer Matrix-Auswertungen

### Prozentanteile

```excel
=Anzahl_Kriterium / Gesamtanzahl
```

---

## 3. Ampellogik

### Drei Stufen

| Ampel | Bedeutung | Farbe | Aktion |
|---|---|---|---|
| In Ordnung | Projekt im Plan | Gruen | Keine |
| Vorsicht | Probleme, aber beherrschbar | Gelb | Aufmerksamkeit |
| Krise | Kritischer Zustand | Rot | Entscheidungsbedarf |

### Conditional Formatting (Portfolio_Daten, Spalte 34)

- Bereich: AG5:AH119
- Regel 1: Zellwert = "Krise" → Rote Hintergrundfarbe
- Regel 2: Zellwert = "Vorsicht" → Gelbe Hintergrundfarbe
- Regel 3: Zellwert = "In Ordnung" → Gruene Hintergrundfarbe
- Zusatzregel: Projektphase = "Blockiert" → Spezialformatierung
- Zusatzregel: Projektphase = "Abgeschlossen" → Spezialformatierung

### Ampel im PSB

- Manuelle Eingabe durch PL (Dropdown: in Ordnung / Vorsicht / Krise)
- Wird 1:1 ins Dashboard uebernommen (Spalte 34)
- Gelbe/rote Ampeln werden im Portfoliobericht (PPT) als Screenshot beigefuegt
- Ampelstatus + Erlaeuterung = Grundlage fuer LV-Monitoring ans Ministerium

---

## 4. Dashboard-Views

Vier gefilterte Ansichten, alle basierend auf Portfolio_Daten:

| View | Sheet | Filter/Gruppierung | Metriken |
|---|---|---|---|
| LV-Uebersicht | Dashboard_LVUebersicht | Alle LV-Vorhaben | Gesamtbild, Ampelverteilung |
| Budgeteinbehalt | DB_Budgeteinbehalt | Budgeteinbehalt = "Ja" | Projekte mit Budgetruecklage |
| Leistungsbereiche | DB_LeistungsbereicheLV | Gruppiert nach A/B/C/D | Verteilung nach LV-Kapitel |
| PAG | Dashboard_PAG | Gruppiert nach PAG | Projekte pro Auftraggeber:in |

**Technisch:** Diese Sheets enthalten Titel/Header und beziehen Daten ueber Verknuepfungen aus Portfolio_Daten. Die eigentlichen Visualisierungen sind Excel-Charts/Diagramme.

---

## 5. Zielwert-Tracking (Sheet: Zielwerte)

### Schema

| Feld | Typ | Beschreibung |
|---|---|---|
| Kapitel | Text | LV-Kapitelreferenz (z.B. C1.2.2) |
| Leistungsbereich | Text | z.B. "Lehr-/Lernorganisation" |
| Ziel(e) gemaess LV | Text | Wortlaut des LV-Ziels |
| Indikator | Text | Messgroesse (z.B. "Anzahl der abgearbeiteten Massnahmen") |
| Ausgangswert 2023 | Zahl | Baseline |
| Zielwert 2025 | Zahl | Soll-Wert |
| Zielwert 2026 | Zahl | Soll-Wert |
| Zielwert 2027 | Zahl | Soll-Wert |
| Referenz Vorhaben | Text | Zugeordnetes Projekt |
| Istwert 2025 | Zahl | Erreichter Wert |
| Istwert 2026 | Zahl | Erreichter Wert |

### Abweichungsberechnung

```
Abweichung absolut = Istwert - Zielwert
Abweichung in %    = (Istwert - Zielwert) / Zielwert
```

Negative Werte = Ziel nicht erreicht.

---

## 6. Zeitleiste (Gantt)

- 183 Wochenspalten (2025–2027), Wochenbeginn = Montag
- Betrachtungszeitraum ab 2025-01-01
- Aktuelles Datum: 2026-03-10
- Jede Zeile = ein Projekt mit Start/Ende-Markierungen
- **Sonderfaelle:** Abgebrochene Projekte ohne Start-/Enddatum erscheinen nicht in der Zeitleiste

---

## 7. Verfuegbare Aggregationsmetriken (Zusammenfassung)

| Metrik | Gruppierung | Formel-Typ |
|---|---|---|
| Projektanzahl | Gesamt, PAG, LV-Periode, Phase | COUNTA/COUNTIF |
| Ampelverteilung | Gesamt, PAG | COUNTIF |
| Budgetausschoepfung | Pro Projekt, Gesamt | Ist/Plan |
| Phasenverteilung | 6 Phasen | COUNTIF |
| Fertigstellungsgrad | Pro Projekt | Aus PSB |
| Risikoverteilung | 5 Stufen | COUNTIF |
| Zielabweichung | Pro Indikator | Ist - Ziel |
| Projektdauer | Pro Projekt | NETWORKDAYS |
| Kosten pro Jahr | 2025/2026/2027 | SUM |

---

Verwandte Dateien: [[data]] · [[parameter]] · [[use-case]]
