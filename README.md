# vetmed-berichtswesen

Promptotype fuer das LV-Vorhaben-Berichtswesen der VetMedUni Wien (Use Case 2 im [VetMedAI-Projekt](https://github.com/DigitalHumanitiesCraft)).

## Was ist das?

Das Repository automatisiert den manuellen Prozess der Projektportfolio-Konsolidierung: ca. 118 Projektstatusberichte (PSB) werden quartalsweise in ein Master-Dashboard zusammengefuehrt und fuer das Rektorat und das BMBWF aufbereitet. Es arbeitet mit fiktiven Beispieldaten und dient als Lehrbeispiel fuer [Promptotyping](https://github.com/DigitalHumanitiesCraft/promptotyping-evaluation-framework).

| Aspekt | Details |
|---|---|
| Fachverantwortlich | Sabrina Laboureix, Referentin PPM |
| Organisation | Stabsstelle Universitaere Entwicklung und Steuerung (SUES) |
| Portfolioumfang | ca. 118 Vorhaben |
| LV-Periode | 2025–2027 |

## Workflow

```
quelldaten/psb/*.xlsx ──┐
quelldaten/finanzen/    ├─▶ 01_konsolidierung.py ─▶ output/review/konsolidiert.xlsx
quelldaten/dashboard/  ─┘         │                   (manuelle Korrektur)
                                  ▼
                         02_visualisierung.py ──▶ output/charts/ (8 PNG)
                                  │
                                  ▼
                         03_bericht.py ──▶ output/reports/ (PPTX, Excel, LV-Monitoring)
```

## Schnellstart

```bash
# Prototyp ausfuehren
cd prototype
pip install -r requirements.txt
python 01_konsolidierung.py   # → output/review/konsolidiert.xlsx
python 02_visualisierung.py   # → output/charts/*.png
python 03_bericht.py          # → output/reports/ (PPTX, Excel)

# Dashboard starten
cd ..
python start_dashboard.py     # → http://localhost:8080
```

Voraussetzung: Python 3.11+

## Beispielprojekte (fiktiv)

| LV-Nr. | Bezeichnung | PAG | Ampel | Phase |
|---|---|---|---|---|
| A1.1.1.1.1 | Zentrale Beschaffung Labormaterialien | VRFIN | In Ordnung | In Arbeit (33%) |
| C1.2.2 | Digitale Lehr- und Pruefungsorganisation | VRLK | In Ordnung | Planung |
| C7.7.7.8 | Einfuehrung Erweiterungsstudium | VRLK | Vorsicht | Nicht gestartet |
| D3.3.3 | Neubau Elefantenhaus | Rektor | Krise | Planung (10%) |

## Repository-Struktur

```
quelldaten/            Originaldateien (fiktive Beispieldaten)
  psb/                 4 Beispiel-Projektstatusberichte (Excel)
  dashboard/           Konsolidiertes Master-Dashboard (11 Sheets)
  finanzen/            SAP-Auszug mit Plan-/Ist-Budgetdaten
  berichte/            Portfoliobericht Q4/2025 (PowerPoint)
  projektauftraege/    4 Beispiel-Projektauftraege (Word/PDF)
  vorlagen/            Leere Templates (PSB + Projektauftrag)
prototype/             Python-Automatisierung (3 Skripte + config)
knowledge/             Synthetisiertes Domaenenwissen
docs/                  Interaktives HTML/JS-Dashboard
```

**Fuer das synthetisierte Wissen** → [knowledge/index.md](knowledge/index.md)

## Kontext

Teil des VetMedAI-Projekts (KI-Kompetenzaufbau an der VetMedUni Wien, 01/2026–10/2026). Verwandtes Repository: [vetmed-wissensbilanz](https://github.com/DigitalHumanitiesCraft/vetmed-wissensbilanz) (Use Case 1).

## Hinweis

Internes Repository der VetMedUni Wien. Enthaelt ausschliesslich fiktive Beispieldaten.
