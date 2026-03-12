# Use Case: Prozess und Anforderungen

Zurueck zu [[index]]

---

## Ausgangslage

Die VetMed Wien steuert ca. 118 Vorhaben aus der Leistungsvereinbarung (LV) 2025–2027 mit dem BMBWF. Das Projektportfoliomanagement (PPM) konsolidiert quartalsweise Statusinformationen und erstellt Berichte fuer das Rektorat und jaehrlich fuer das Ministerium.

**Kernproblem:** Der gesamte Prozess ist manuell, Excel-basiert und fehleranfaellig. Implizites Domaenenwissen steckt in Formeln, Hilfstabellen und Zuordnungsregeln des Master-Excel.

---

## Berichtszyklen

| Zyklus | Frequenz | Empfaenger | Inhalt | Format |
|---|---|---|---|---|
| Quartalsbericht | 4x/Jahr | Rektorat (intern) | Portfoliouebersicht, Ampelstatus, Auswertungen, kritische Projekte | PowerPoint |
| LV-Monitoring | 1x/Jahr (Q1) | BMBWF (extern) | Ampelstatus + Erlaeuterung pro Vorhaben, Zielindikatoren | Vorgegebenes Format |

Beide Zyklen nutzen **dieselbe Datenbasis** (die Projektstatusberichte). Das LV-Monitoring aggregiert die quartalsweise erhobenen Informationen fuer den Jahresbericht. Die Ergebnisse fliessen in die jaehrliche Wissensbilanz ein (UG 2002 §13 Abs. 2).

---

## Workflow (Ist-Prozess)

### Stufe 1 – Datenerfassung

- PPM stellt individuelle PSB-Excel-Vorlagen (ca. 110) in Veteasy (Intranet) bereit
- PPM versendet Mail mit Bitte um Aktualisierung an PL/Ansprechpersonen
- PL aktualisieren ihre Statusberichte direkt in Veteasy
- Qualitaet und Vollstaendigkeit variieren stark je nach PL

### Stufe 2 – Konsolidierung

- PPM fuehrt alle Einzel-PSBs manuell in das Master-Excel (Portfolio Dashboard) zusammen
- Zusaetzliche Infos werden manuell eingetragen: Projektauftrag-Status, Prioritaet, etc.
- SAP-Auszug der Finanzabteilung (Plan-/Ist-Werte) wird integriert
- Hilfstabellen und Formeln berechnen Dashboard-Auswertungen automatisch

### Stufe 3 – Dashboard-Auswertungen

- Uebersicht nach PAG, Leistungsbereich, LV-Periode, Ampelstatus
- Budgeteinbehalt, Zeitleiste (Gantt-aehnlich), Zielwert-Tracking
- Alles innerhalb des Master-Excel ueber verschiedene Tabellenblaetter

### Stufe 4 – Portfoliobericht

- Screenshots der Dashboard-Auswertungen werden in PowerPoint uebertragen
- Inhaltliche Ergaenzungen: Veraenderungen, abgeschlossene Projekte, offene Fragen
- Gelbe/rote Ampel-Statusberichte werden als Screenshot eingefuegt
- Versand per Mail, Vorstellung in Rektoratssitzung, Ablage in Veteasy

---

## Zielgruppen

| Gruppe | Zugang | Informationsbedarf |
|---|---|---|
| Rektorat | Portfoliobericht (PPT) in Rektoratssitzung | Ueberblick, Entscheidung bei kritischen Projekten |
| Eingeschraenkter Personenkreis | Veteasy-Ablage | Detailinfos zum Portfolio |
| BMBWF | LV-Monitoring (jaehrlich) | Ampelstatus + Erlaeuterung, Zielindikatoren |
| PL/Ansprechpersonen | Eigener PSB in Veteasy | Eigenes Vorhaben aktualisieren |

---

## Anforderungen

### Muss

- Konsolidierung der PSBs in eine gemeinsame Datenbasis
- Ampelstatus-Uebersicht aller Vorhaben
- Filterung nach Auftraggeber:in, Zeitraum, Status
- Erweiterbarkeit fuer zukuenftige Projekte
- Interner Betrieb ohne externe Datenexposition

### Kann

- Automatisierte Quartalsberichte (Abloesung des Screenshot-Prozesses)
- Finanz- und Fortschrittsauswertungen
- Inhaltliche Zusammenfassung und Bewertung von Veraenderungen (LLM-Anwendungsfall)
- Mehr/bessere Auswertungen und Darstellungen
- Schnellere Visualisierung (weniger manuelle Schritte, breiterer Zugang)

---

## Rechtlicher Rahmen

| Aspekt | Regelung |
|---|---|
| Rechtsgrundlage | UG 2002 §12 (Leistungsvereinbarung) |
| LV-Periode | 2025–2027, verbindlich zwischen Universitaet und BMBWF |
| Kapitelstruktur | A (Gesellschaftliche Ziele), B (Forschung), C (Lehre), D (Kooperation/Strategie) |
| LV-Monitoring | Gesetzlich vorgegebener Aufbau, 1x jaehrlich ans Ministerium |
| Wissensbilanz | LV-Monitoring fliesst ein (§13 Abs. 2 UG) |
| Portfoliobericht | Auf Wunsch des Rektorats, keine zwingenden Vorgaben |

---

## Gestaltungsrahmen

- Aufbau und Darstellung des Portfolios: **frei gestaltbar** auf Wunsch des Rektorats
- Corporate Design und Farbvorgaben der VetMedUni sollen eingehalten werden
- LV-Monitoring-Format: **gesetzlich vorgegeben**, nicht aenderbar

---

## Einschraenkungen

- **Datenschutz:** Personenbezogene Daten (Namen der PL) und Finanzdaten duerfen nicht in externe Dienste. Fuer den Use Case werden fiktive Beispielprojekte verwendet.
- **Datenqualitaet:** PSBs variieren in Vollstaendigkeit und Konsistenz. Normalisierungsprobleme bei Dateneingabe (z.B. "Q1" statt Datum).
- **Heterogene Formate:** Projektauftraege in Word oder PDF, teilweise gar nicht vorhanden.
- **Akzeptanz:** Eigene Eingabemaske schwer als Alternative zu Excel einfuehrbar.

---

## Ziel des Promptotype

Ein funktionierender Prototyp, der zeigt, wie die Datenkonsolidierung automatisiert, die Visualisierung verbessert und der manuelle Aufwand reduziert werden kann – als Entscheidungsgrundlage fuer einen produktiven Einsatz.

---

Verwandte Dateien: [[data]] · [[berechnungslogik]] · [[parameter]]
