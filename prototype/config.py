"""
Konfiguration fuer den Prototyp Projektportfolio LV-Vorhaben.
Pfade, Normalisierungs-Mappings, Feiertage, Spaltendefinitionen.
"""

from pathlib import Path
from datetime import date

# --- Pfade ---

BASE_DIR = Path(__file__).resolve().parent.parent
QUELLDATEN = BASE_DIR / "quelldaten"
OUTPUT = BASE_DIR / "output"

PSB_DIR = QUELLDATEN / "psb"
DASHBOARD_FILE = QUELLDATEN / "dashboard" / "Portfolio_Dashboard_Beispieldaten.xlsx"
SAP_FILE = QUELLDATEN / "finanzen" / "LE-Vorhaben_260215_Beispieldaten.xlsx"
PPTX_TEMPLATE = QUELLDATEN / "berichte" / "Projektportfolio_LV-Vorhaben25-27_Q42025_Beispieldaten.pptx"

OUTPUT_REVIEW = OUTPUT / "review"
OUTPUT_CHARTS = OUTPUT / "charts"
OUTPUT_REPORTS = OUTPUT / "reports"

# --- Aktuelles Quartal ---

QUARTAL = "Q1/2026"
STICHTAG = date(2026, 3, 10)

# --- Normalisierungs-Mappings (PSB → Dashboard) ---

AMPEL_NORM = {
    "in Ordnung": "In Ordnung",
    "In Ordnung": "In Ordnung",
    "Vorsicht": "Vorsicht",
    "Krise": "Krise",
}

PAG_NORM = {
    "Rektor:in": "Rektor",
    "Rektor": "Rektor",
    "VRLK": "VRLK",
    "VRFDI": "VRFDI",
    "VRFIN": "VRFIN",
}

PHASE_NORM = {
    "Nicht gestartet": "Idee erfasst/noch nicht gestartet",
    "Idee erfasst/noch nicht gestartet": "Idee erfasst/noch nicht gestartet",
    "Planung": "Planung",
    "In Arbeit": "In Arbeit",
    "Blockiert": "Blockiert",
    "Abgeschlossen": "Abgeschlossen",
    "Abgebrochen": "Abgebrochen",
}

RISIKO_NORM = {
    "Sehr Gering": "Sehr Gering",
    "Gering": "Gering",
    "Mittel": "Mittel",
    "Hoch": "Hoch",
    "Sehr Hoch": "Sehr Hoch",
}

# --- PSB Zellpositionen ---

PSB_CELLS = {
    "berichtsdatum": "L1",
    "bezeichnung": "B2",
    "projektleitung": "F2",
    "organisationseinheiten": "I2",
    "pag": "L2",
    "lv_nr": "B3",
    "fertigstellungsgrad": "F3",
    "projektphase": "K3",
    "kurzbeschreibung": "A4",
    "ampelstatus": "C13",
    "projektende": "E13",
    "risikoeinschaetzung": "L14",
}

# Meilensteine: Zeilen 5-12
PSB_MEILENSTEIN_ROWS = range(5, 13)  # 5, 6, 7, 8, 9, 10, 11, 12
PSB_MEILENSTEIN_COLS = {
    "bezeichnung": "E",
    "plan_lv": "H",
    "plan_aktuell": "I",
    "ist": "J",
    "erlaeuterung": "K",
}

# Textbloecke (merged cells)
PSB_TEXT_RANGES = {
    "erlaeuterung_ampel": ("A14", "D26"),
    "risiken": ("E14", "L20"),
    "entscheidungsbedarf": ("E21", "L26"),
}

# Zielwerte: Zeile 29 (Soll), Zeile 30 (Ist)
PSB_ZIELWERT_CELLS = {
    "ziel_text": "A29",
    "indikator": "B29",
    "ausgangswert_2023": "F29",
    "zielwert_2025": "G29",
    "zielwert_2026": "H29",
    "zielwert_2027": "I29",
    "erlaeuterung_ziel": "J29",
    "istwert_2025": "G30",
    "istwert_2026": "H30",
    "istwert_2027": "I30",
}

# --- Dashboard Portfolio_Daten Spalten (1-basiert) ---

DASHBOARD_COLS = {
    2: "lv_nummer",
    3: "leistungsbereich",
    4: "kapitelzuordnung",
    5: "projektname",
    6: "kurzbeschreibung",
    7: "meilensteine",
    8: "projektleitung",
    9: "pag",
    10: "organisationseinheiten",
    11: "lv_periode",
    12: "projektauftrag",
    13: "psb_vorhanden",
    14: "lenkungsausschuss",
    15: "externe_kooperationspartner",
    16: "thema_begleitgespraech",
    17: "budgeteinbehalt",
    18: "prioritaet",
    19: "risiko",
    20: "start",
    21: "ende",
    22: "dauer_werktage",
    23: "kostenstelle",
    24: "plankosten_2025",
    25: "plankosten_2026",
    26: "plankosten_2027",
    27: "plankosten_gesamt",
    28: "istkosten_2025",
    29: "istkosten_2026",
    30: "istkosten_2027",
    31: "istkosten_gesamt",
    32: "istkosten_prozent",
    33: "projektphase",
    34: "ampelstatus",
    35: "fertigstellungsgrad",
    36: "ziele",
    37: "status_aktuell",
    38: "risiken_aktuell",
    39: "entscheidung_aktuell",
    40: "status_vorperiode",
    41: "risiken_vorperiode",
    42: "entscheidung_vorperiode",
}

# --- Oesterreichische Feiertage 2025-2027 ---

FEIERTAGE = [
    date(2025, 1, 1),   # Neujahr
    date(2025, 1, 6),   # Heilige Drei Koenige
    date(2025, 4, 21),  # Ostermontag
    date(2025, 5, 1),   # Staatsfeiertag
    date(2025, 5, 29),  # Christi Himmelfahrt
    date(2025, 6, 9),   # Pfingstmontag
    date(2025, 6, 19),  # Fronleichnam
    date(2025, 8, 15),  # Maria Himmelfahrt
    date(2025, 10, 26), # Nationalfeiertag
    date(2025, 11, 1),  # Allerheiligen
    date(2025, 12, 8),  # Maria Empfaengnis
    date(2025, 12, 25), # Christtag
    date(2025, 12, 26), # Stefanitag
    date(2026, 1, 1),   # Neujahr
    date(2026, 1, 6),   # Heilige Drei Koenige
    date(2026, 4, 6),   # Ostermontag
    date(2026, 5, 1),   # Staatsfeiertag
    date(2026, 5, 14),  # Christi Himmelfahrt
    date(2026, 5, 25),  # Pfingstmontag
    date(2026, 6, 4),   # Fronleichnam
    date(2026, 8, 15),  # Maria Himmelfahrt
    date(2026, 10, 26), # Nationalfeiertag
    date(2026, 11, 1),  # Allerheiligen
    date(2026, 12, 8),  # Maria Empfaengnis
    date(2026, 12, 25), # Christtag
    date(2026, 12, 26), # Stefanitag
    date(2027, 1, 1),   # Neujahr
    date(2027, 1, 6),   # Heilige Drei Koenige
    date(2027, 3, 29),  # Ostermontag
    date(2027, 5, 1),   # Staatsfeiertag
    date(2027, 5, 6),   # Christi Himmelfahrt
    date(2027, 5, 17),  # Pfingstmontag
    date(2027, 5, 27),  # Fronleichnam
    date(2027, 8, 15),  # Maria Himmelfahrt
    date(2027, 10, 26), # Nationalfeiertag
    date(2027, 11, 1),  # Allerheiligen
    date(2027, 12, 8),  # Maria Empfaengnis
    date(2027, 12, 25), # Christtag
    date(2027, 12, 26), # Stefanitag
]

# --- Ampelfarben (fuer Charts und Formatierung) ---

AMPEL_FARBEN = {
    "In Ordnung": "#4CAF50",  # Gruen
    "Vorsicht": "#FFC107",    # Gelb
    "Krise": "#F44336",       # Rot
}

# --- Leistungsbereiche ---

LEISTUNGSBEREICHE = {
    "A": "Gesellschaftliche Zielsetzungen",
    "B": "Forschung und Entwicklung",
    "C": "Lehre",
    "D": "Sonstige Leistungsbereiche",
}
