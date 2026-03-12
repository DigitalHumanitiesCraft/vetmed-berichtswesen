"""
02_visualisierung.py — Charts generieren aus konsolidiertem Excel.

Ausfuehrung: python 02_visualisierung.py
Voraussetzung: output/review/konsolidiert.xlsx muss existieren
Ergebnis:      output/charts/ (PNG)
"""

from pathlib import Path
from datetime import date

import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np

from config import (
    OUTPUT_REVIEW, OUTPUT_CHARTS,
    AMPEL_FARBEN, LEISTUNGSBEREICHE, QUARTAL, STICHTAG,
)

# Matplotlib-Defaults
plt.rcParams.update({
    "font.family": "sans-serif",
    "font.size": 10,
    "figure.facecolor": "white",
    "axes.facecolor": "white",
    "axes.grid": True,
    "grid.alpha": 0.3,
})

AMPEL_COLORS = {"In Ordnung": "#4CAF50", "Vorsicht": "#FFC107", "Krise": "#F44336"}
AMPEL_ORDER = ["In Ordnung", "Vorsicht", "Krise"]


def load_data() -> pd.DataFrame:
    path = OUTPUT_REVIEW / "konsolidiert.xlsx"
    if not path.exists():
        raise FileNotFoundError(f"Bitte zuerst 01_konsolidierung.py ausfuehren.\n  {path}")
    return pd.read_excel(path, sheet_name="Konsolidiert")


def save(fig, name: str):
    OUTPUT_CHARTS.mkdir(parents=True, exist_ok=True)
    fig.savefig(str(OUTPUT_CHARTS / f"{name}.png"), dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  {name}.png")


# =============================================================================
# 1. Ampelverteilung Gesamt (Donut)
# =============================================================================

def chart_ampel_gesamt(df: pd.DataFrame):
    counts = df["ampelstatus"].value_counts()
    labels = [l for l in AMPEL_ORDER if l in counts.index]
    values = [counts[l] for l in labels]
    colors = [AMPEL_COLORS[l] for l in labels]

    fig, ax = plt.subplots(figsize=(8, 6))
    wedges, texts, autotexts = ax.pie(
        values, labels=labels, colors=colors, autopct=lambda p: f"{int(round(p * sum(values) / 100))}",
        startangle=90, pctdistance=0.75, wedgeprops=dict(width=0.4),
        textprops=dict(fontsize=12),
    )
    for at in autotexts:
        at.set_fontsize(14)
        at.set_fontweight("bold")
    ax.set_title(f"Ampelstatus Gesamt ({QUARTAL})", fontsize=16, fontweight="bold", pad=20)
    ax.legend(labels, loc="lower right", fontsize=10)
    save(fig, "ampel_gesamt")


# =============================================================================
# 2. Ampelverteilung nach PAG (gestapelt)
# =============================================================================

def chart_ampel_nach_pag(df: pd.DataFrame):
    ct = pd.crosstab(df["pag"], df["ampelstatus"])
    ct = ct.reindex(columns=[c for c in AMPEL_ORDER if c in ct.columns], fill_value=0)

    fig, ax = plt.subplots(figsize=(10, 6))
    bottom = np.zeros(len(ct))
    for ampel in ct.columns:
        bars = ax.bar(ct.index, ct[ampel], bottom=bottom, label=ampel,
                       color=AMPEL_COLORS.get(ampel, "#999"), edgecolor="white")
        for bar, val in zip(bars, ct[ampel]):
            if val > 0:
                ax.text(bar.get_x() + bar.get_width() / 2, bar.get_y() + bar.get_height() / 2,
                        str(val), ha="center", va="center", fontweight="bold", fontsize=11)
        bottom += ct[ampel].values

    ax.set_title(f"Ampelstatus nach PAG ({QUARTAL})", fontsize=16, fontweight="bold")
    ax.set_ylabel("Anzahl Projekte")
    ax.set_xlabel("Projektauftraggeber:in")
    ax.legend()
    ax.set_axisbelow(True)
    save(fig, "ampel_nach_pag")


# =============================================================================
# 3. Projektanzahl nach PAG
# =============================================================================

def chart_projekte_nach_pag(df: pd.DataFrame):
    counts = df["pag"].value_counts().sort_values()

    fig, ax = plt.subplots(figsize=(8, 5))
    bars = ax.barh(counts.index, counts.values, color="#1F4E79", edgecolor="white")
    for bar, val in zip(bars, counts.values):
        ax.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height() / 2,
                str(val), va="center", fontweight="bold")
    ax.set_title(f"Projekte nach PAG ({QUARTAL})", fontsize=16, fontweight="bold")
    ax.set_xlabel("Anzahl")
    save(fig, "projekte_nach_pag")


# =============================================================================
# 4. Projekte nach Leistungsbereich
# =============================================================================

def chart_projekte_nach_leistungsbereich(df: pd.DataFrame):
    df_copy = df.copy()
    df_copy["lb"] = df_copy["lv_nummer"].astype(str).str.extract(r"^([A-D])", expand=False)
    df_copy["lb_name"] = df_copy["lb"].map(LEISTUNGSBEREICHE).fillna("Unbekannt")
    counts = df_copy["lb_name"].value_counts()

    lb_colors = ["#2E86AB", "#A23B72", "#F18F01", "#C73E1D"]

    fig, ax = plt.subplots(figsize=(10, 6))
    bars = ax.bar(range(len(counts)), counts.values,
                   color=lb_colors[:len(counts)], edgecolor="white")
    ax.set_xticks(range(len(counts)))
    ax.set_xticklabels(counts.index, rotation=15, ha="right", fontsize=9)
    for bar, val in zip(bars, counts.values):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.05,
                str(val), ha="center", fontweight="bold")
    ax.set_title(f"Projekte nach Leistungsbereich ({QUARTAL})", fontsize=16, fontweight="bold")
    ax.set_ylabel("Anzahl")
    save(fig, "projekte_nach_leistungsbereich")


# =============================================================================
# 5. Projekte nach Phase
# =============================================================================

def chart_projekte_nach_phase(df: pd.DataFrame):
    phase_order = [
        "Idee erfasst/noch nicht gestartet", "Planung", "In Arbeit",
        "Blockiert", "Abgeschlossen", "Abgebrochen",
    ]
    counts = df["projektphase"].value_counts()
    counts = counts.reindex([p for p in phase_order if p in counts.index])

    phase_colors = {
        "Idee erfasst/noch nicht gestartet": "#90CAF9",
        "Planung": "#42A5F5", "In Arbeit": "#1565C0",
        "Blockiert": "#FF7043", "Abgeschlossen": "#66BB6A", "Abgebrochen": "#BDBDBD",
    }
    colors = [phase_colors.get(p, "#999") for p in counts.index]

    fig, ax = plt.subplots(figsize=(10, 5))
    bars = ax.barh(counts.index, counts.values, color=colors, edgecolor="white")
    for bar, val in zip(bars, counts.values):
        ax.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height() / 2,
                str(val), va="center", fontweight="bold")
    ax.set_title(f"Projekte nach Phase ({QUARTAL})", fontsize=16, fontweight="bold")
    ax.set_xlabel("Anzahl")
    ax.invert_yaxis()
    save(fig, "projekte_nach_phase")


# =============================================================================
# 6. Budget Plan vs. Ist
# =============================================================================

def chart_budget(df: pd.DataFrame):
    years = ["2025", "2026", "2027"]
    plan_vals = [df[f"plankosten_{y}"].sum() for y in years]
    ist_vals = [df[f"istkosten_{y}"].sum() for y in years]

    x = np.arange(len(years))
    width = 0.35

    fig, ax = plt.subplots(figsize=(10, 6))
    bars1 = ax.bar(x - width / 2, plan_vals, width, label="Plan", color="#1F4E79")
    bars2 = ax.bar(x + width / 2, ist_vals, width, label="Ist", color="#2E86AB")

    ax.set_xticks(x)
    ax.set_xticklabels(years)
    ax.set_title(f"Budget: Plan vs. Ist ({QUARTAL})", fontsize=16, fontweight="bold")
    ax.set_ylabel("EUR")
    ax.legend()

    # Werte auf Balken
    for bars in [bars1, bars2]:
        for bar in bars:
            h = bar.get_height()
            if h > 0:
                ax.text(bar.get_x() + bar.get_width() / 2, h, f"{h:,.0f}",
                        ha="center", va="bottom", fontsize=8)

    ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f"{x:,.0f}"))
    save(fig, "budget_plan_vs_ist")


# =============================================================================
# 7. Gantt-Zeitleiste
# =============================================================================

def chart_gantt(df: pd.DataFrame):
    df_gantt = df.dropna(subset=["start", "ende"]).copy()
    if df_gantt.empty:
        print("  Keine Projekte mit Start/Ende fuer Gantt.")
        return

    df_gantt["start"] = pd.to_datetime(df_gantt["start"])
    df_gantt["ende"] = pd.to_datetime(df_gantt["ende"])
    df_gantt = df_gantt.sort_values("start", ascending=True)

    fig, ax = plt.subplots(figsize=(14, max(3, len(df_gantt) * 0.8)))

    for i, (_, row) in enumerate(df_gantt.iterrows()):
        start = row["start"]
        ende = row["ende"]
        dauer = (ende - start).days
        color = AMPEL_COLORS.get(row.get("ampelstatus", ""), "#1F4E79")
        ax.barh(i, dauer, left=start, height=0.5, color=color, alpha=0.85, edgecolor="white")

    ax.axvline(x=pd.Timestamp(STICHTAG), color="red", linestyle="--", linewidth=1.5,
               label=f"Stichtag ({STICHTAG})")

    labels = [f"{r['lv_nummer']}  {str(r['projektname'])[:35]}" for _, r in df_gantt.iterrows()]
    ax.set_yticks(range(len(df_gantt)))
    ax.set_yticklabels(labels, fontsize=9)
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
    ax.xaxis.set_major_locator(mdates.MonthLocator(interval=3))
    plt.xticks(rotation=45)
    ax.set_title(f"Projektzeitleiste ({QUARTAL})", fontsize=16, fontweight="bold")
    ax.legend(loc="upper right")
    ax.invert_yaxis()
    fig.tight_layout()
    save(fig, "gantt_zeitleiste")


# =============================================================================
# 8. Fertigstellungsgrad
# =============================================================================

def chart_zielwerte(df: pd.DataFrame):
    df_show = df[df["fertigstellungsgrad"] > 0].copy() if (df["fertigstellungsgrad"] > 0).any() else df.copy()

    fig, ax = plt.subplots(figsize=(10, 5))
    colors = [AMPEL_COLORS.get(a, "#999") for a in df_show["ampelstatus"]]
    bars = ax.bar(df_show["lv_nummer"], df_show["fertigstellungsgrad"] * 100,
                   color=colors, edgecolor="white")
    for bar, val in zip(bars, df_show["fertigstellungsgrad"] * 100):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1,
                f"{val:.0f}%", ha="center", fontsize=9, fontweight="bold")
    ax.set_title(f"Fertigstellungsgrad ({QUARTAL})", fontsize=16, fontweight="bold")
    ax.set_ylabel("%")
    ax.set_ylim(0, 110)
    ax.set_xlabel("LV-Nummer")
    save(fig, "zielwerte_fertigstellungsgrad")


# =============================================================================
# Main
# =============================================================================

def main():
    print(f"=== Visualisierungen ({QUARTAL}) ===\n")

    df = load_data()
    print(f"  {len(df)} Projekte geladen.\n")

    print("Charts generieren...")
    chart_ampel_gesamt(df)
    chart_ampel_nach_pag(df)
    chart_projekte_nach_pag(df)
    chart_projekte_nach_leistungsbereich(df)
    chart_projekte_nach_phase(df)
    chart_budget(df)
    chart_gantt(df)
    chart_zielwerte(df)

    print(f"\nFertig. Charts in: {OUTPUT_CHARTS}")


if __name__ == "__main__":
    main()
