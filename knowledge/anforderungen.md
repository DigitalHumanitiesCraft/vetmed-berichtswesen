# Anforderungen: Epics und User Stories

Pragmatische Anforderungsstruktur fuer das PSB-Berichtswesen. Jede User Story ist einer Rolle zugeordnet, priorisiert (Muss/Kann) und mit einem Status versehen. Die Struktur bildet den 4-Stufen-Workflow ab.

Forschungsgrundlage: Die Anforderungen stuetzen sich auf externe Befunde aus 2024-2025 (siehe [Quellenverzeichnis](#quellenverzeichnis)).

## Rollen

| Kuerzel | Rolle | Person | Kernbeduerfnis |
|---------|-------|--------|----------------|
| **FV** | Fachverantwortlicher | Michael Forster | Korrekte, vollstaendige Konsolidierung mit Kontrollmoeglichkeit |
| **PL** | Projektleiter VetMedAI UC2 | Christopher Pollin | Funktionsfaehiger Promptotype, uebertragbare Methodik |
| **RK** | Rektorat | (Gremium) | Ampel-Uebersicht, rote Projekte, Budgetstatus auf einen Blick |
| **PE** | Projekterfasser | (diverse) | Einfache, fehlertolerante Dateneingabe |

## Roadmap

```
Done                    Naechster Schritt           Spaeter
─────────────────────   ─────────────────────────   ──────────────────
Epic 1 (Erfassung)      Epic 3 (Dashboard)          Epic 4 (Export)
Epic 2 (Konsolidierung) ├─ E3-S1 Ampel-Uebersicht
Epic 5 (Wissensbasis)   ├─ E3-S2 Filterung
                        └─ E3-S3 Budget-Auswertung

                        Abhaengigkeit: Workshop 04.03.
                        (Kapitel-Dimension, LV-Monitoring)
```

---

## Epic 1: PSB-Erfassung (Stufe 1)

*Status: Implementiert (Vorlage + Testdaten)*

| ID | User Story | Prioritaet | Status |
|----|-----------|-------------|--------|
| E1-S1 | Als PE will ich eine vorbefuellte Excel-Vorlage, damit ich nur die projektspezifischen Felder ausfuellen muss. | Muss | Done |
| E1-S2 | Als FV will ich synthetische Testdaten mit realistischen Qualitaetsproblemen, damit ich die Konsolidierung validieren kann. | Muss | Done |

CHE-Studie [2]: Standardisierte Templates sind Grundvoraussetzung fuer konsistente Konsolidierung. Die 3 eingebauten Qualitaetsprobleme (Format, Vollstaendigkeit, Konsistenz) decken die haeufigsten Datenqualitaetsdimensionen ab (TDWI [6]).

---

## Epic 2: Konsolidierung und Qualitaetssicherung (Stufe 2)

*Status: Implementiert*

| ID | User Story | Prioritaet | Status |
|----|-----------|-------------|--------|
| E2-S1 | Als FV will ich alle PSBs per Script konsolidieren, damit ich nicht manuell Excel-Dateien zusammenfuehren muss. | Muss | Done |
| E2-S2 | Als FV will ich einen Quality Report, der Auffaelligkeiten auflistet, damit ich gezielt pruefen kann statt alles durchzulesen. | Muss | Done |
| E2-S3 | Als FV will ich, dass Format-Fehler (z.B. "Q1" statt "Q1/2025") automatisch erkannt werden, damit sie nicht unbemerkt in den Bericht gelangen. | Muss | Done |
| E2-S4 | Als FV will ich, dass inkonsistente Ampelbewertungen (gruen trotz Verzoegerung) gemeldet werden, damit ich die Bewertung hinterfragen kann. | Muss | Done |
| E2-S5 | Als FV will ich JSON- und CSV-Ausgaben, damit die Daten maschinell weiterverarbeitet werden koennen. | Muss | Done |
| E2-S6 | Als FV will ich, dass rote Projekte im Quality Report separat aufgefuehrt werden, damit ich sie dem Rektorat gesondert vorlegen kann. | Muss | Done |

TDWI Human-in-the-Loop-Forschung [5]: Das Propose-Validate-Pattern (System meldet, Mensch entscheidet) ist der effektivste Ansatz fuer institutionelles Reporting. Die ECKM-Studie [1] zum oesterreichischen Wissensbilanz-Prozess zeigt: Manuelle Kompilierung war der Engpass auf Ministeriumsebene — strukturell identisch mit dem PSB-Problem.

---

## Epic 3: Dashboard (Stufe 3)

*Status: Offen — naechster Implementierungsschritt*

| ID | User Story | Prioritaet | Status |
|----|-----------|-------------|--------|
| E3-S1 | Als RK will ich eine Ampel-Uebersicht aller Projekte auf einen Blick, damit ich den Gesamtstatus in <30 Sekunden erfassen kann. | Muss | Offen |
| E3-S2 | Als RK will ich nach Kapitel/Auftraggeber/Ampel filtern, damit ich mich auf relevante Teilmengen konzentrieren kann. | Muss | Offen |
| E3-S3 | Als FV will ich Budget-Auswertungen (Gesamtbudget, Verbrauch, Verbrauch%), damit ich finanzielle Risiken frueh erkenne. | Muss | Offen |
| E3-S4 | Als FV will ich Zielwert-Ist-Vergleiche pro Indikator sehen, damit ich Zielerreichung bewerten kann. | Kann | Offen |
| E3-S5 | Als RK will ich eine Detailansicht pro Projekt (Indikatoren, Massnahmen, Kommentar), damit ich bei Bedarf in die Tiefe gehen kann. | Kann | Offen |

Streamlit ist fuer die Promptotyping-Phase die richtige Wahl (Kanaries [7]: schnellstes Prototyping). Datenquelle: consolidated.json aus Stufe 2. Kein eigenes Backend noetig — Streamlit liest direkt aus JSON, Filterung ueber Widgets.

**Abhaengigkeit:** Klaerung Kapitel-Dimension (A-D vs. Lehre/Forschung/Infrastruktur) am 04.03. beeinflusst Filterdimensionen (E3-S2). Siehe [projektkontext.md](projektkontext.md).

---

## Epic 4: Export (Stufe 4)

*Status: Offen — nach Dashboard*

| ID | User Story | Prioritaet | Status |
|----|-----------|-------------|--------|
| E4-S1 | Als RK will ich eine Ampel-Uebersicht als PNG/PDF, damit ich sie in Praesentationen einbetten kann. | Muss | Offen |
| E4-S2 | Als FV will ich einen aggregierten Quartalsbericht als PDF, damit ich ihn ohne technische Werkzeuge weitergeben kann. | Kann | Offen |
| E4-S3 | Als FV will ich einzelne Projektberichte als Vorlage fuer die LV-Begleitgespraeche exportieren, damit ich nicht manuell zusammenstellen muss. | Kann | Offen |

Der aktuelle Prozess nutzt Screenshots (Excel → PowerPoint). Automatisierter Export ersetzt diesen Medienbruch. BMBWF-Begleitgespraeche finden mind. 2x/Jahr statt (siehe [rechtlicher-rahmen.md](rechtlicher-rahmen.md)) — E4-S3 adressiert diesen konkreten Berichtsanlass.

---

## Epic 5: Wissensbasis und Methodik

*Status: Implementiert — laufende Pflege*

| ID | User Story | Prioritaet | Status |
|----|-----------|-------------|--------|
| E5-S1 | Als PL will ich alle Domaenenregeln in Wissensdokumenten dokumentiert haben, damit der Code jederzeit neu generiert werden kann (Promptotyping-Prinzip). | Muss | Done |
| E5-S2 | Als PL will ich ein Session-Journal, damit Entscheidungen und offene Punkte zwischen Sessions nicht verloren gehen. | Muss | Done |
| E5-S3 | Als PL will ich Cross-Referenzen zwischen Dokumenten (Single Source of Truth), damit keine widersprüchlichen Definitionen entstehen. | Muss | Done |

Steiner/Pollin [3, 4]: "Documents as Source of Truth, Code as Disposable Artifact." Die ECKM-Studie [1] zeigt: Der Wissensbilanz-Prozess scheiterte an fehlender Dokumentation der Kompilierungsregeln — genau das Problem, das knowledge/ loest.

---

## Forschungsgrundlage

| Quelle | Kernaussage | Relevanz |
|--------|-------------|----------|
| ECKM [1] | Wissensbilanz-Verarbeitung des BMBWF war manuell; Loesung: durchsuchbare Datenbank mit Export | Strukturell identisches Problem, validiert Ansatz |
| CHE [2] | Einheitliche Templates reduzieren Heterogenitaet in Zielvereinbarungs-Berichten | Validiert PSB-Vorlage als Ausgangspunkt |
| Steiner/Pollin [3, 4] | Promptotyping: Dokumente als Source of Truth, Code als Disposable Artifact | Methodische Grundlage dieses Projekts |
| TDWI [5] | Propose-Validate-Pattern fuer KI-gestuetzte Qualitaetssicherung | Validiert quality_report.md-Ansatz |
| TDWI [6] | 8 kanonische Datenqualitaetsdimensionen (Completeness, Consistency, Validity, ...) | Testdaten decken die 3 haeufigsten ab |
| Kanaries [7] | Streamlit schneller fuer Prototyping, Dash fuer Produktion | Empfehlung fuer Dashboard-Stufe |
| BMBWF [8, 9] | Aktiver LV-Zyklus 2025-2027, Digitalisierung als Schwerpunkt | Zeitliche Relevanz, strategische Einbettung |
| VetMedUni [10] | Wissensbilanz 2024 veroeffentlicht, GSV 4 "Digitalisierung" aktiv | Institutioneller Kontext |

## Quellenverzeichnis

1. ECKM: Digitizing Austrian Universities' Intellectual Capital Reports. European Conference on Knowledge Management. https://papers.academic-conferences.org/index.php/eckm/article/view/383
2. CHE: Standardisierung der Berichtspflichten im Rahmen der Zielvereinbarungen. https://www.che.de/projekt/standardisierung-der-berichtspflichten-der-hochschulen-im-rahmen-der-zielvereinbarungen/
3. Steiner/Pollin: Prototyping with Prompts. CHI 2025 / ACM. https://dl.acm.org/doi/10.1145/3706598.3713166
4. Steiner/Pollin: Promptotyping. Zenodo, November 2024. https://zenodo.org/records/14160876
5. TDWI: Role of Human-in-the-Loop in AI Data Management, 2025. https://tdwi.org/articles/2025/09/03/adv-all-role-of-human-in-the-loop-in-ai-data-management.aspx
6. TDWI: 2024 State of Data Quality Report. https://tdwi.org/research/2024/05/diq-all-2024-state-of-data-quality-report.aspx
7. Kanaries: Streamlit vs Dash Comparison, 2025. https://docs.kanaries.net/topics/Streamlit/streamlit-vs-dash
8. BMBWF: Leistungsvereinbarungen 2025-2027 Gesamtueberblick. https://www.bmfwf.gv.at/wissenschaft/hochschulgovernance/steuerungsinstrumente/leistungsvereinbarungen.html
9. BMBWF: Universitaetsbericht 2023, Abschnitt 2.4. https://unibericht.bmbwf.gv.at/2023/18/
10. VetMedUni Wien: Wissensbilanz 2024. https://www.vetmeduni.ac.at/fileadmin/v/z/mitteilungsblatt/organisation/2025/20250528_Vetmeduni_Wissensbilanz_2024_final_exkl.DB.pdf
