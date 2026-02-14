# Rechtlicher Rahmen: Leistungsvereinbarungen und Wissensbilanz

## Gesetzliche Grundlage

Österreichische öffentliche Universitäten unterliegen zwei zentralen Steuerungsinstrumenten aus dem Universitätsgesetz 2002 (UG).

**Leistungsvereinbarungen (§13 UG)** sind öffentlich-rechtliche Verträge zwischen einzelnen Universitäten und dem Bund (BMFWF) für jeweils drei Jahre. Sie definieren strategische Ziele, Vorhaben und Ressourcen. Die aktuelle Periode läuft von 2025 bis 2027. Der Bund bestimmt den Gesamtbetrag bis spätestens 31. Oktober des zweiten Jahres der laufenden Periode (§12 Abs. 2 UG). Das Globalbudget jeder Universität gliedert sich gemäß §12a Abs. 2 UG in die Budgetsäulen Lehre, Forschung/EEK und Infrastruktur/strategische Entwicklung.

**Wissensbilanz (§13 Abs. 6 UG)** ist ein jährlicher Rechenschaftsbericht bis 30. April für das vergangene Kalenderjahr. Sie enthält standardisierte Kennzahlen gemäß WBV 2016 und einen Berichtsteil auf Grundlage der Leistungsvereinbarung.[^1]

**Wissensbilanzverordnung 2016** (WBV 2016, Stammfassung BGBl. II Nr. 97/2016, geltende Fassung BGBl. II Nr. 233/2023) konkretisiert Struktur, Gestaltung und Kennzahlen der Wissensbilanz.

[^1]: Genehmigungspfad gemäß UG: Rektorat legt vor → Universitätsrat genehmigt innerhalb von vier Wochen → Weiterleitung an BMFWF.

## Kapitelstruktur der LV 2025–2027

| Kapitel | Bereich |
|---------|---------|
| A | Strategische Ziele, Profilbildung, Gesellschaftliche Zielsetzungen, Qualitätssicherung, Personalentwicklung, Standortentwicklung |
| B | Forschung/EEK und Wissens-/Technologietransfer |
| C | Lehre (Studien, Lehr-/Lernorganisation, Weiterbildung) |
| D | Sonstige Leistungsbereiche (Kooperationen, spezifische Bereiche) |

Bezeichnungen variieren geringfügig je Universität. Die Struktur hat sich über LV-Perioden verändert (z.B. lagen "Gesellschaftliche Zielsetzungen" früher unter D).

**Hypothese für UC2:** Die Dimension "[Kapitel](datenmodell.md)" in den Projektstatusberichten entspricht dieser Struktur. Die synthetischen Testdaten verwenden aktuell "Lehre", "Forschung" und "Infrastruktur" — möglicherweise auf A/B/C/D umzustellen, sobald die reale Zuordnung geklärt ist (siehe [offene Punkte](projektkontext.md)).

## Monitoring-Zyklen

| Zyklus | Frequenz | Adressat |
|--------|----------|----------|
| Begleitgespräche | Mind. 2×/Jahr | BMFWF |
| Wissensbilanz | Jährlich (bis 30.04.) | BMFWF, öffentlich |
| Interner Quartalsbericht | Quartalsweise | Rektorat VetMed |
| LV-Periode | 3 Jahre | BMFWF |

**Offener Punkt (zu klären am 04.03.):** Beziehung zwischen internem Quartalsbericht und externen Begleitgesprächen. Getrennte Prozesse oder speisen die internen Berichte in die externen Gespräche ein?

## VetMedUni Wien LV 2025–2027

Veröffentlicht am 18.12.2024 im Mitteilungsblatt (Studienjahr 2024/2025, 13. Stück, Punkt 27). Bereits ergänzt (1. Ergänzung vom 19.03.2025).

## Dateninfrastruktur

**unidata.gv.at** ist die gemeinsame, qualitätsgesicherte Datenbasis für Universitäten und BMFWF. Ein Data-Clearing-Prozess sichert die Datenqualität. Der WBV-Arbeitsbehelf V18.0 enthält die operativen Anleitungen.

## Bezug UC1 und UC2

**UC1 (vetmed-wissensbilanz)** visualisiert öffentliche WBV-Kennzahlen aus unidata.gv.at. **UC2 (vetmed-berichtswesen)** trackt intern den LV-Vorhabenfortschritt (PSB → Quartalsbericht). Der Berührungspunkt: Ampelstatus und Fortschrittsberichte aus UC2 fließen als Datengrundlage in die Wissensbilanz ein, die UC1 als Kennzahlen darstellt.

## Quellen

- UG 2002 (konsolidiert): https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20002128
- WBV 2016 (konsolidiert): https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20009519
- BMFWF Leistungsvereinbarungen: https://www.bmfwf.gv.at/wissenschaft/hochschulgovernance/steuerungsinstrumente/leistungsvereinbarungen.html
- VetMedUni LV: https://www.vetmeduni.ac.at/universitaet/infoservice/berichte/leistungsvereinbarung
- WBV-Arbeitsbehelf V18.0: https://unidata.gv.at/RechtlicheGrundlagen/WBV-Arbeitsbehelf%20Version%2018.0.pdf