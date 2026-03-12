# Datenstrukturen und Schemas

Zurueck zu [[index]]

---

## 1. Projektstatusbericht (PSB)

Quelle: `PSB_2026-01_VORLAGE.xlsx` (2 Sheets: Statusbericht + Parameter)
43 Zeilen × 12 Spalten, 59 Merged-Cell-Bereiche.

### 1.1 Identifikation (Zeilen 1–3)

| Zelle | Feld | Typ | Pflicht | Dropdown |
|---|---|---|---|---|
| L1 | Berichtsdatum | Datum | Ja | – |
| B2 | Bezeichnung des Vorhabens | Text | Ja | – |
| F2 | Projektleitung (Vorname Nachname) | Text | Ja | – |
| I2 | Betroffene Organisationseinheiten | Text | Nein | – |
| L2 | Projektauftraggeber:in | Dropdown | Ja | Rektor:in, VRLK, VRFDI, VRFIN |
| B3 | LV-Nr./Strategiebezug | Text | Ja | – |

> **Hinweis B3:** Wert enthaelt Prefix "LV25-27 " + LV-Nummer (z.B. "LV25-27 A1.1.1.1.1"). Prefix muss bei Verarbeitung entfernt werden.
| F3 | Fertigstellungsgrad in % | Float (0–1) | Nein | 0, 0.1, 0.25, 0.33, 0.5, 0.66, 0.75, 0.9, 1.0 |
| K3 | Projektphase | Dropdown | Ja | Siehe [[parameter]] |

### 1.2 Kurzbeschreibung (Zeile 4)

| Zelle | Feld | Typ |
|---|---|---|
| A4:D4 | Kurzbeschreibung (Anlass, Inhalte, Ziele) | Merged Textfeld |

### 1.3 Meilensteine (Zeilen 5–12, max. 8 Stueck)

| Spalte | Feld | Typ | Beispiel |
|---|---|---|---|
| E | Meilenstein-Bezeichnung | Text | "M1 Projektstart" |
| H | Plan-Datum laut LV | Datum/Text | 2025-02-01 |
| I | Plan-Datum aktuell | Datum | Aktualisierte Prognose |
| J | Ist-Datum | Datum | Tatsaechliche Erreichung |
| K | Erlaeuterungen | Text | Abweichungsbegruendung |

### 1.4 Status und Risiko (Zeilen 13–26)

| Zelle | Feld | Typ | Optionen |
|---|---|---|---|
| C13 | Ampelstatus Gesamt | Dropdown | in Ordnung, Vorsicht, Krise |
| A14:D26 | Erlaeuterung Ampelstatus | Merged Textfeld | – |
| E13 | Projektende | Datum/Text | – |
| E14:L20 | Risiken und Hindernisse | Merged Textfeld | – |
| I14:K14 | Risikoeinschaetzung (Label) | Text | – |
| L14 | Risikoeinschaetzung (Wert) | Dropdown | Sehr Gering, Gering, Mittel, Hoch, Sehr Hoch |
| E21:L26 | Entscheidungsbedarf, naechste Schritte | Merged Textfeld | – |

### 1.5 Ziele und Indikatoren (Zeilen 27–30)

| Zeile | Spalte | Feld | Typ |
|---|---|---|---|
| 29 | A | Zugeordnete Ziele gemaess LV | Text |
| 29 | B | Indikator | Text |
| 29 | F | Ausgangswert 2023 | Zahl |
| 29 | G/H/I | Zielwert 2025/2026/2027 | Zahl |
| 29 | J | Erlaeuterungen | Text |
| 30 | G/H/I | Ist-Wert 2025/2026/2027 | Zahl |

### 1.6 Befuellungsmuster (aus Beispieldaten)

| Feld | A1.1.1.1 | C1.2.2 | C7.7.7.8 | D3.3.3 |
|---|---|---|---|---|
| Ampel | Gruen | Gruen | Gelb | Rot |
| Phase | In Arbeit | Planung | Nicht gestartet | Planung |
| Fortschritt | 33% | 0% | 0% | 10% |
| Meilensteine | 8 | 1 | 1 | 6 |
| Ziele/Indikatoren | 0 | 1 | 0 | 0 |
| Risiko | Mittel | Gering | Mittel | Hoch |

---

## 2. Projektauftrag

Quelle: `Projektauftrag_2026-01_VORLAGE.docx` (5 Tabellen)

### 2.1 Eckdaten (Tabelle 0)

| Feld | Typ | Pflicht | Bemerkung |
|---|---|---|---|
| Bezeichnung des Vorhabens | Text | Ja | Projekttitel |
| Bezug zur LV/Strategie | Text | Ja | z.B. "LV25-27 C1.2.2" |
| Auftraggeber:in | Text | Ja | PAG (VRLK, VRFDI, Rektor) |
| Ansprechperson/Projektleitung | Text | Ja | Name |
| Beteiligte Organisationseinheiten | Text | Nein | Oft leer |
| Geplanter Start | Datum | Nein | In Beispielen nie befuellt |
| Geplantes Ende | Datum | Nein | In Beispielen nie befuellt |

### 2.2 Inhalte (Tabelle 1)

| Abschnitt | Pflicht | Inhalt |
|---|---|---|
| Kurzbeschreibung | Nein | Projektbeschreibung (bei C7.7.7.8 leer) |
| Ziele und Ergebnisse | Ja | Unterteilt in "Ziele:" und "Nichtziele:" |
| Ergaenzungen und Konkretisierungen | Ja | Meilensteine, Budget, Zeitplan, Team |

### 2.3 Freigabe und Signaturen (Tabellen 2–4)

- Tabelle 2: Rechtliche Freigabe-Erklaerung (Standardtext)
- Tabelle 3: Projektleitung – Name + Datum/Unterschrift ("Digital signiert")
- Tabelle 4: Auftraggeber:in – Name + Datum/Unterschrift

---

## 3. Portfolio Dashboard (Master-Excel)

Quelle: `Portfolio_Dashboard_Beispieldaten.xlsx` (11 Sheets)

### 3.1 Sheet-Uebersicht

| Sheet | Zeilen | Spalten | Funktion |
|---|---|---|---|
| Erlaeuterungen | 53 | 14 | Zielsetzung, Hinweise, Disclaimer, Aufbau-Doku |
| Parameter | 51 | 36 | Master-Dropdowns, Feiertage, Werktage |
| Arbeitsbereich | 208 | 33 | Aggregierte Auswertungen (Projektanzahl nach PAG/LV/Phase) |
| **Portfolio_Daten** | **122** | **48 (41 mit Daten)** | **Hauptdatentabelle: alle 118 Projekte** |
| Zielwerte | 19 | 17 | KPI-Tracking (Ausgangswert → Zielwert → Istwert) |
| Zeitleiste | 117 | 193 | Gantt-Darstellung (183 Wochenspalten, 2025–2027) |
| Dashboard_LVUebersicht | 1 | 24 | Gesamtuebersicht (verknuepft) |
| DB_Budgeteinbehalt | 1 | 24 | Gefiltert: Projekte mit Budgeteinbehalt |
| DB_LeistungsbereicheLV | 1 | 22 | Gefiltert: nach Leistungsbereich |
| Dashboard_PAG | 1 | 28 | Gefiltert: nach Projektauftraggeber:in |
| Pipeline_Arbeitsbereich_alt | 118 | 27 | Legacy-Ansicht (#REF!-Fehler, nicht aktiv) |

### 3.2 Portfolio_Daten – Spaltenstruktur (48 Spalten)

| Nr. | Spalte | Typ | Quelle | Berechnet |
|---|---|---|---|---|
| 2 | LV-Nummer | Text | PSB | – |
| 3 | Leistungsbereich | Dropdown | Manuell (PPM) | – |
| 4 | Kapitelzuordnung | Dropdown | Manuell (PPM) | – |
| 5 | Projektname/Bezeichnung | Text | PSB | – |
| 6 | Kurzbeschreibung | Text | PSB | – |
| 7 | Relevante Meilensteine | Text | PSB | – |
| 8 | PL/Ansprechperson | Text | PSB | – |
| 9 | PAG | Dropdown | PSB | – |
| 10 | Beteiligte Organisationseinheiten | Text | PSB | – |
| 11 | LV-Periode | Dropdown | Manuell (PPM) | – |
| 12 | Projektauftrag | Dropdown | Manuell (PPM) | – |
| 13 | PSB vorhanden | Dropdown | Manuell (PPM) | – |
| 14 | Lenkungsausschuss | Dropdown | Manuell (PPM) | – |
| 15 | Externe Kooperationspartner | Dropdown | Manuell (PPM) | – |
| 16 | Thema Begleitgespraech | Text | Manuell (PPM) | – |
| 17 | Budgeteinbehalt | Dropdown | Manuell (PPM) | – |
| 18 | Prioritaet | Dropdown | Manuell (PPM) | – |
| 19 | Risiko | Dropdown | PSB | – |
| 20 | Start | Datum | PSB | – |
| 21 | Ende | Datum | PSB | – |
| 22 | Dauer in Werktagen | Zahl | – | **Ja** (NETWORKDAYS) |
| 23 | Kostenstelle/Innenauftrag | Text | SAP | – |
| 24–26 | Plankosten 2025/2026/2027 | Waehrung | SAP | – |
| 27 | Plankosten 25-27 | Waehrung | SAP | – |
| 28–30 | Istkosten 2025/2026/2027 | Waehrung | SAP | – |
| 31 | Ist-Kosten (Gesamt) | Waehrung | – | **Ja** (SUM) |
| 32 | Ist-Kosten in % | Prozent | – | **Ja** (Ist/Plan) |
| 33 | Projektphase | Dropdown | PSB | – |
| 34 | Ampelstatus Gesamt | Dropdown | PSB | – |
| 35 | Fertigstellungsgrad (%) | Prozent | PSB | – |
| 36 | Dazugehoerige Ziele | Text | PSB/LV | – |
| 37–39 | Status/Risiken/Entscheidung (aktuell) | Text | PSB | – |
| 40–42 | Status/Risiken/Entscheidung (Vorperiode) | Text | PSB | – |

**Strukturierte Tabelle:** Excel-Tabelle `Tabelle1` (dynamischer Bereich, erlaubt Referenzen wie `Tabelle1[PAG]`).

### 3.3 Feld-Mapping: PSB → Dashboard

| PSB-Feld | Dashboard-Spalte |
|---|---|
| Bezeichnung des Vorhabens (B2) | Projektname (5) |
| LV-Nr. (B3) | LV-Nummer (2) |
| Projektleitung (F2) | PL/Ansprechperson (8) |
| Projektauftraggeber:in (L2) | PAG (9) |
| Betroffene Org. (I2) | Beteiligte OE (10) |
| Fertigstellungsgrad (F3) | Fertigstellungsgrad (35) |
| Projektphase (K3) | Projektphase (33) |
| Ampelstatus (C13) | Ampelstatus Gesamt (34) |
| Kurzbeschreibung (A4) | Kurzbeschreibung (6) |
| Meilensteine (E5–E12) | Relevante Meilensteine (7) |
| Erlaeuterung Ampel (A14:D26) | Status aktuell (37) |
| Risiken (E14:L20) | Risiken aktuell (38) |
| Entscheidungsbedarf (E21:L26) | Entscheidung aktuell (39) |

**Manuell durch PPM ergaenzt** (nicht aus PSB): Leistungsbereich, Kapitelzuordnung, LV-Periode, Projektauftrag-Status, PSB vorhanden, Lenkungsausschuss, Externe Kooperationspartner, Thema Begleitgespraech, Budgeteinbehalt, Prioritaet.

---

## 4. SAP-Auszug (Finanzdaten)

Quelle: `LE-Vorhaben_260215_Beispieldaten.xlsx` (1 Sheet: Tabelle1)

### Spaltenstruktur

| Spalte | Feld | Typ |
|---|---|---|
| A | Objekt (LE-Nummer) | Text (z.B. "LE1234567") |
| B | Objekt (LV-Nr. + Bezeichnung) | Text (z.B. "A1.1.1.1.1 Labor") |
| C | Verantwortlich | Text (Nachname Vorname) |
| D | PLAN 2025 | Waehrung (negativ = Ausgabe) |
| E | IST 2025 | Waehrung |
| F | PLAN 2026 | Waehrung |
| G | IST 2026 | Waehrung |
| H | PLAN 2027 | Waehrung |
| I | PLAN 2028 | Waehrung |

**Zeile 4:** Globalbudget (Summenzeile)
**Zeilen 5+:** Einzelne Vorhaben

**Besonderheit:** Betraege sind negativ (Ausgaben). Zeile 4 summiert alle Vorhaben.

**Mehrere LV-Nummern:** Spalte B kann mehrere LV-Nummern enthalten, durch "+" getrennt (z.B. "D3.3.2+D3.3.3 Bauvorhaben"). Bei der Konsolidierung wird das Budget gleichmaessig auf die enthaltenen Vorhaben aufgeteilt.

---

## 5. Portfoliobericht (PowerPoint)

Quelle: `Projektportfolio_LV-Vorhaben25-27_Q42025_Beispieldaten.pptx` (14 Folien)

### Folienstruktur

| Folie | Typ | Inhalt |
|---|---|---|
| 1 | Titelfolie | "Projektportfolio LV-Vorhaben 2025-2027", Q4/2025, Autor, VetMedUni |
| 2 | Agenda | 3 Punkte: Anmerkungen, Portfoliouebersicht, Statusberichte |
| 3–4 | Anmerkungen | Neu abgeschlossene Projekte, relevante Infos, offene Fragen |
| 5–10 | Portfolio-Charts | **WMF-Bilder** (Screenshots aus Dashboard – nicht als Text extrahierbar) |
| 9 | Sonderhinweis | "Abgebrochene scheinen nicht auf, da kein Start-/Enddatum" |
| 11 | Zwischentitel | "Statusberichte (Auszug)", Q4/2025 |
| 12–13 | Statusbericht-Auszuege | **WMF-Bilder** (gelbe/rote Ampel-PSBs als Screenshot) |
| 14 | Schlussfolie | Kontakt, Danke |

**Hinweis Folie 11:** "Beigefuegt sind alle Statusberichte mit roter oder gelber Ampel sowie Auswahl mit relevanten Anmerkungen zu Risiko oder Entscheidungsbedarf. Vollstaendige Sammlung in Veteasy."

---

## 6. Datenqualitaet – Bekannte Probleme

| Problem | Quelle | Beispiel |
|---|---|---|
| Nichtstandardisierte Datumsformate | PSB | "Q1 26" statt 2026-03-31 |
| Fehlende Ist-Werte | PSB | Indikatoren ohne Ist-Wert bei C7.7.7.8 |
| Falsches Datum | PSB D3.3.3 | 1905-07-19 statt 2025 (Eingabefehler) |
| Template-Platzhalter nicht ersetzt | PSB C7.7.7.8 | Projektende = "TT.MM.JJJJ" |
| Leere Pflichtfelder | PSB | Fertigstellungsgrad manchmal leer statt 0 |
| Heterogene Projektauftraege | Projektauftrag | Teilweise nicht vorhanden, unterschiedliche Qualitaet |
| Legacy-Fehler | Dashboard | Pipeline_Arbeitsbereich_alt enthaelt #REF!-Fehler |

---

Verwandte Dateien: [[use-case]] · [[berechnungslogik]] · [[parameter]]
