# Parameter und Codelisten

Zurueck zu [[index]]

Quelle: Sheet "Parameter" in `Portfolio_Dashboard_Beispieldaten.xlsx` und `PSB_2026-01_VORLAGE.xlsx`

---

## 1. Ampelstatus

| Wert | Bedeutung |
|---|---|
| In Ordnung / in Ordnung | Projekt im Plan (Gruen) |
| Vorsicht | Probleme, beherrschbar (Gelb) |
| Krise | Kritischer Zustand (Rot) |

> Hinweis: Dashboard verwendet "In Ordnung" (gross), PSB verwendet "in Ordnung" (klein). Normalisierung erforderlich.

---

## 2. Projektphase

| Wert | Beschreibung |
|---|---|
| Idee erfasst/noch nicht gestartet | Vorhaben angelegt, noch nicht begonnen |
| Planung | In Planungsphase |
| In Arbeit | Aktiv in Umsetzung |
| Blockiert | Gestoppt durch Hindernis |
| Abgeschlossen | Erfolgreich beendet |
| Abgebrochen | Vorzeitig beendet |

---

## 3. Projektauftraggeber:in (PAG)

| Kuerzel | Bedeutung |
|---|---|
| Rektor / Rektor:in | Rektor der VetMedUni |
| VRLK | Vizerektor:in fuer Lehre und klinische Veterinaermedizin |
| VRFDI | Vizerektor:in fuer Forschung, Digitalisierung und Innovation |
| VRFIN | Vizerektor:in fuer Finanzen und Infrastruktur |

> PSB-Dropdown enthaelt "Rektor:in", Dashboard enthaelt "Rektor". Normalisierung erforderlich.

---

## 4. Projektfortschritt (Fertigstellungsgrad)

| Wert | Prozent |
|---|---|
| 0 | 0% |
| 0.1 | 10% |
| 0.25 | 25% |
| 0.33 | 33% |
| 0.5 | 50% |
| 0.66 | 66% |
| 0.75 | 75% |
| 0.9 | 90% |
| 1.0 | 100% |

---

## 5. Projektauftrag-Status

| Wert | Bedeutung |
|---|---|
| Unterzeichnet | Formal genehmigt |
| Entwurf | In Abstimmung |
| Offen | Noch nicht erstellt |
| n/a | Nicht zutreffend |

---

## 6. LV-Periode

| Wert | Bedeutung |
|---|---|
| LV25-27 | Aktuelle Leistungsvereinbarung 2025–2027 |
| LV28-30 | Naechste Periode (Planung) |
| Nein | Kein LV-Vorhaben |

---

## 7. Projektklasse

| Wert |
|---|
| Regelbetrieb |
| Projekt |
| Strategisches Projekt/Schluesselprojekt/Programm |

---

## 8. Risikoeinstufung

| Wert | Stufe |
|---|---|
| Sehr Gering | 1 |
| Gering | 2 |
| Mittel | 3 |
| Hoch | 4 |
| Sehr Hoch | 5 |

---

## 9. Prioritaet

| Wert |
|---|
| Hoch |
| Mittel |
| Gering |

---

## 10. Innovationskraft

| Wert |
|---|
| Hoch |
| Mittel |
| Gering |

---

## 11. Leistungsbereich (LV-Kapitel)

### Hauptkategorien

| Kuerzel | Leistungsbereich |
|---|---|
| A | Gesellschaftliche Zielsetzungen |
| B | Forschung und Entwicklung |
| C | Lehre |
| D | Sonstige Leistungsbereiche (Kooperation/Strategie) |

### Kapitelzuordnung (18 Unterkategorien)

| Kapitel | Bezeichnung |
|---|---|
| A1 | Gesellschaftliche Zielsetzungen (Detail) |
| A2 | Weitere gesellschaftliche Ziele |
| B1 | Forschung Grundlagen |
| B2 | Forschung Anwendung |
| B3 | Forschungsinfrastruktur |
| C1 | Studienorganisation |
| C2 | Weiterbildung |
| C3 | Digitale Lehre |
| C4 | Pruefungswesen |
| C5 | Studierendenbetreuung |
| C6 | Curriculum |
| C7 | Erweiterungsstudien |
| D1 | Kooperationen |
| D2 | Internationalisierung |
| D3 | Infrastruktur/Bau |
| D4 | Digitalisierung |
| D5 | Personal |
| D6 | Strategie |

> Die exakten Bezeichnungen der 18 Kapitel sind aus den Parameter-Daten abgeleitet. Die tatsaechlichen LV-Kapitelnummern folgen dem Schema X.Y (z.B. A1.1, C7.7).

---

## 12. Weitere Ja/Nein-Felder

| Feld | Werte | Verwendet in |
|---|---|---|
| LV-Vorhaben | Ja, Nein | PSB |
| Budgeteinbehalt | Ja, Nein | Dashboard |
| PSB vorhanden | Ja, Nein | Dashboard |
| Lenkungsausschuss | Ja, Nein | Dashboard |
| Externe Kooperationspartner | Ja, Nein | Dashboard |

---

## 13. Feiertage (fuer NETWORKDAYS)

40 Eintraege im Parameter-Sheet (Spalte C, Zeilen 4–51), abdeckend 2025–2026. Verwendet fuer die Berechnung der Projektdauer in Werktagen. Umfasst oesterreichische gesetzliche Feiertage.

---

## 14. Normalisierungsbedarf

| Feld | Problem | PSB-Wert | Dashboard-Wert |
|---|---|---|---|
| Ampelstatus | Gross-/Kleinschreibung | "in Ordnung" | "In Ordnung" |
| PAG | Schreibweise | "Rektor:in" | "Rektor" |
| Projektphase | Kurzform vs. Langform | "Nicht gestartet" | "Idee erfasst/noch nicht gestartet" |
| Datum | Format | Teilweise "Q1 26", "TT.MM.JJJJ" | DateTime-Objekt |

---

Verwandte Dateien: [[data]] · [[berechnungslogik]] · [[use-case]]
