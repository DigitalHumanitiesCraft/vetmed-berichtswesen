# Plan: Prototyp Projektportfolio LV-Vorhaben

> **STATUS: Abgeschlossen (2026-03-10).** Alle 6 Milestones umgesetzt und verifiziert. Siehe `knowledge/journal.md` fuer Ergebnisse.

## Kontext

Das PPM konsolidiert manuell ~110 PSB-Excel-Dateien in ein Master-Dashboard und erstellt PowerPoint-Berichte. Dieser Prototyp automatisiert das: Einlesen, Validieren, Visualisieren, Berichte generieren. Rein lokal, Python.

## Architektur (vereinfacht)

```
quelldaten/psb/*.xlsx ──┐
quelldaten/finanzen/    ├─▶ 01_konsolidierung.py ─▶ output/review/konsolidiert.xlsx
quelldaten/dashboard/  ─┘         │                   (manuelle Korrektur)
                                  ▼
                         02_visualisierung.py ──▶ output/charts/ (PNG + HTML)
                                  │
                                  ▼
                         03_bericht.py ──▶ output/reports/ (PPTX, Excel)
```

Drei Skripte, die man der Reihe nach ausfuehrt. Kein Framework, kein CLI, kein Web-Backend.

## Dateistruktur (neu)

```
prototype/
├── config.py                  # Pfade, Normalisierungs-Mappings, Feiertage
├── 01_konsolidierung.py       # PSBs + SAP einlesen, validieren, Excel exportieren
├── 02_visualisierung.py       # Charts generieren
├── 03_bericht.py              # PPTX + Dashboard-Excel + LV-Monitoring
└── requirements.txt
output/
├── review/                    # Konsolidiertes Excel zur manuellen Korrektur
├── charts/                    # PNG + HTML Charts
└── reports/                   # PPTX, Dashboard-Excel, LV-Monitoring
```

## Bibliotheken

| Bibliothek | Zweck |
|---|---|
| openpyxl | PSB-Excel lesen (Merged Cells), Excel schreiben |
| pandas | Datenverarbeitung, Aggregationen |
| python-pptx | PowerPoint generieren |
| plotly + kaleido | Charts mit PNG-Export |
| matplotlib | Gantt-Zeitleiste |

## Milestones

### Milestone 1: PSB-Reader
- [ ] Einzelnen PSB einlesen (openpyxl, zellenweise: B2, C13, L14 etc.)
- [ ] Alle 4 Beispiel-PSBs erfolgreich gelesen
- [ ] Normalisierung: Ampel, PAG, Phase, Datumsformate

**Verifikation:** Fuer jeden der 4 PSBs pruefen:
- A1.1.1.1.1: Ampel=In Ordnung, Phase=In Arbeit, Fortschritt=0.33, Risiko=Mittel, 8 Meilensteine
- C1.2.2: Ampel=In Ordnung, Phase=Planung, Fortschritt=0, Risiko=Gering, 1 Meilenstein
- C7.7.7.8: Ampel=Vorsicht, Phase=Idee erfasst/noch nicht gestartet, Fortschritt=0, Risiko=Mittel, 1 Meilenstein
- D3.3.3: Ampel=Krise, Phase=Planung, Fortschritt=0.1, Risiko=Hoch, 6 Meilensteine

---

### Milestone 2: SAP + Dashboard einlesen
- [ ] SAP-Finanzdaten einlesen (Betraege negieren, ab Zeile 5)
- [ ] Bestehendes Dashboard einlesen (Portfolio_Daten + PPM-Felder)
- [ ] Join-Mapping SAP LE-Nummer → LV-Nummer funktioniert

**Verifikation:** SAP-Werte fuer Beispielprojekte mit Dashboard-Spalten 24-32 vergleichen.

---

### Milestone 3: Konsolidierung + Validierung
- [ ] PSBs + SAP + PPM-Felder in einem DataFrame zusammengefuehrt
- [ ] Berechnete Felder: Dauer in Werktagen, Ist-Kosten Gesamt, Ist-Kosten in %
- [ ] Validierung: Pflichtfelder, Datumsfehler, Template-Platzhalter, ungueltige Werte
- [ ] Export als annotiertes Excel mit Validierungsspalte und farblicher Markierung
- [ ] Re-Import des korrigierten Excel funktioniert

**Verifikation:** Konsolidiertes Ergebnis Zeile fuer Zeile gegen Portfolio_Daten-Sheet im bestehenden Dashboard vergleichen (4 Beispielprojekte, Spalten 2-42).

---

### Milestone 4: Charts
- [ ] Ampelverteilung (gesamt + nach PAG)
- [ ] Projektanzahl nach PAG, Leistungsbereich, Phase
- [ ] Budget Plan vs. Ist
- [ ] Gantt-Zeitleiste
- [ ] Zielwert-Tracking (Soll vs. Ist)
- [ ] PNG-Export fuer PowerPoint

**Verifikation:** Generierte Charts visuell mit den bestehenden Dashboard-Sheets vergleichen (Dashboard_LVUebersicht, Dashboard_PAG, DB_LeistungsbereicheLV, DB_Budgeteinbehalt). Zahlenwerte muessen mit Arbeitsbereich-Sheet uebereinstimmen.

---

### Milestone 5: Quartalsbericht (PPTX)
- [ ] Bestehende PPTX als Template oeffnen (Corporate Design bleibt erhalten)
- [ ] Titelfolie: Quartal und Datum aktualisieren
- [ ] Chart-Folien: WMF-Screenshots durch generierte PNGs ersetzen
- [ ] Statusbericht-Folien: Gelbe/rote Ampel-Projekte als Tabelle/Auszug
- [ ] Anmerkungen-Folien: Platzhalter fuer manuellen Text

**Verifikation:** Generierte PPTX oeffnen → alle Folien pruefen, Charts lesbar, Corporate Design intakt.

---

### Milestone 6: Dashboard-Excel + LV-Monitoring
- [ ] Konsolidiertes Excel im Portfolio_Daten-Format (48 Spalten, als Tabelle1)
- [ ] Conditional Formatting auf Ampelstatus-Spalte
- [ ] LV-Monitoring: Ampelstatus + Erlaeuterung + Zielwerte pro Vorhaben

**Verifikation:** Exportiertes Excel in Excel oeffnen, Tabellenstruktur und Formatierung pruefen. LV-Monitoring-Felder gegen use-case.md Anforderungen abgleichen.

---

## Technische Entscheidungen

- **openpyxl statt pandas fuer PSBs**: 59 Merged-Cell-Bereiche pro PSB, pandas kann das nicht
- **Bestehende PPTX als Template**: Corporate Design der VetMedUni wird beibehalten
- **Lookup-Tabelle fuer SAP-Mapping**: Nur ~6 Eintraege, kein Fuzzy-Matching noetig
- **plotly fuer Charts**: PNG-Export fuer PPTX, optional interaktives HTML

## Was bewusst NICHT enthalten ist

- Kein Web-Frontend, kein Server, kein CLI-Framework
- Keine Datenbank — alles bleibt in Excel/CSV
- Keine automatische Erkennung neuer PSB-Felder — Schema ist fix
- Kein Deployment — Prototyp laeuft direkt mit `python 01_konsolidierung.py`
