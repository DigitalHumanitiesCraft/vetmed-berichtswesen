/**
 * PSB Dashboard - app.js
 * Projektstatusbericht Dashboard fuer VetMedUni Wien
 *
 * Architektur:
 *   Vanilla JS (kein Framework, kein Build-Tool). Chart.js 4.x via CDN.
 *   Datenquelle: consolidated.json (aus Stufe 2 des PSB-Workflows).
 *
 * Datenfluss:
 *   loadData() → APP_STATE → renderAll() → DOM
 *   Filter aendern APP_STATE.filteredProjects und triggern renderAll() erneut.
 *
 * Farbwerte:
 *   CSS Custom Properties (:root in style.css) sind die Single Source of Truth.
 *   Fuer Chart.js (Canvas-basiert, kein CSS-Zugriff) liest getCSSColor() die
 *   Werte via getComputedStyle(). Die Konstanten (AMPEL_COLORS etc.) werden
 *   vor DOMContentLoaded ausgewertet und muessen mit style.css uebereinstimmen.
 *
 * Sektionen:
 *    1. State & Konstanten       9. Budget-Section
 *    2. Logging                 10. Soll/Ist-Charts
 *    3. Daten laden             11. Verteilungs-Charts
 *    4. Hilfsfunktionen         12. Detail-Modal
 *    5. Meta-Rendering          13. Chart-Verwaltung
 *    6. KPI-Rendering           14. Haupt-Render-Funktion
 *    7. Filter-Logik            15. Initialisierung
 *    8. Ampel-Grid Rendering
 */

// ------------------------------------------------------------
// 1. State & Konstanten
// ------------------------------------------------------------

const APP_STATE = {
    allProjects: [],
    filteredProjects: [],
    meta: {},
    charts: {},
    filters: {
        kapitel: '',
        auftraggeber: '',
        ampel: ''
    }
};

/**
 * Ampelfarben fuer Projektkarten und Chart.js-Konfigurationen.
 * WICHTIG: Diese Werte muessen mit den CSS Custom Properties in style.css
 * uebereinstimmen (--ampel-gruen, --ampel-gelb, --ampel-rot etc.).
 * Fuer CSS-gestylte Elemente werden die Custom Properties via CSS genutzt.
 * Fuer Chart.js (Canvas-basiert) muessen die Farben als JS-Werte vorliegen.
 */
const AMPEL_COLORS = {
    gruen: { bg: '#e6f4ea', color: '#28a745', border: '#1e7e34', label: 'Gruen' },
    gelb:  { bg: '#fff8e1', color: '#ffc107', border: '#d4a106', text: '#8a6d00', label: 'Gelb' },
    rot:   { bg: '#fce8e8', color: '#dc3545', border: '#bd2130', label: 'Rot' }
};

/** Farben fuer Massnahmen-Status (Donut-Chart und Badges). */
const MASSNAHMEN_COLORS = {
    'abgeschlossen': '#28a745',
    'in Umsetzung':  '#1a5490',
    'geplant':       '#adb5bd',
    'verzoegert':    '#dc3545'
};

/** Farben fuer Kapitel-Zuordnung (Pie-Chart). */
const KAPITEL_COLORS = {
    'Lehre':          '#1a5490',
    'Forschung':      '#28a745',
    'Infrastruktur':  '#fd7e14'
};

// ------------------------------------------------------------
// 2. Logging
// ------------------------------------------------------------

const LOG_PREFIX = '[PSB]';

/**
 * Loggt eine Nachricht mit [PSB]-Prefix in die Konsole.
 * @param {string} msg - Log-Nachricht.
 * @param {*} [data] - Optionale Daten (werden als zweites Argument an console.log uebergeben).
 */
function log(msg, data) {
    if (data !== undefined) {
        console.log(`${LOG_PREFIX} ${msg}`, data);
    } else {
        console.log(`${LOG_PREFIX} ${msg}`);
    }
}

/**
 * Loggt eine Tabelle in einer eingeklappten Konsolengruppe.
 * @param {string} label - Gruppenname.
 * @param {Array<Object>} rows - Tabellenzeilen fuer console.table().
 */
function logTable(label, rows) {
    console.groupCollapsed(`${LOG_PREFIX} ${label}`);
    console.table(rows);
    console.groupEnd();
}

// ------------------------------------------------------------
// 3. Daten laden
// ------------------------------------------------------------

/**
 * Laedt consolidated.json via fetch() und initialisiert APP_STATE.
 * @throws {Error} Bei HTTP-Fehlern oder fehlender Datei.
 */
async function loadData() {
    const response = await fetch('consolidated.json');
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: consolidated.json konnte nicht geladen werden.`);
    }
    const data = await response.json();
    APP_STATE.meta = data.meta;
    APP_STATE.allProjects = data.projekte;
    APP_STATE.filteredProjects = [...data.projekte];

    log(`Geladen: ${data.projekte.length} Projekte (${data.meta.generiert})`);
    logTable('Projekte', data.projekte.map(p => ({
        ID: p.id, Ampel: p.ampel, Budget: p.budget_gesamt,
        Verbraucht: p.budget_verbrauch_pct + '%', Warnungen: p.warnungen.length
    })));
}

// ------------------------------------------------------------
// 4. Hilfsfunktionen
// ------------------------------------------------------------

const eurFormatter = new Intl.NumberFormat('de-AT', {
    style: 'decimal',
    maximumFractionDigits: 0
});

const pctFormatter = new Intl.NumberFormat('de-AT', {
    style: 'decimal',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
});

/**
 * Formatiert einen Zahlenwert als EUR-Betrag (ohne Nachkommastellen).
 * @param {number|null} value - Der zu formatierende Betrag.
 * @returns {string} Formatierter Wert (z.B. "350.000") oder '--' bei null/undefined.
 */
function formatEUR(value) {
    if (value == null) return '--';
    return eurFormatter.format(value);
}

/**
 * Formatiert einen Zahlenwert als Prozentwert (1 Nachkommastelle).
 * @param {number|null} value - Der zu formatierende Prozentwert.
 * @returns {string} Formatierter Wert (z.B. "46,7 %") oder '--' bei null/undefined.
 */
function formatPct(value) {
    if (value == null) return '--';
    return pctFormatter.format(value) + ' %';
}

/**
 * Formatiert einen Indikatorwert kontextabhaengig.
 * Heuristik: Ganzzahlen werden als Stueckzahl formatiert (keine Nachkommastellen),
 * Dezimalzahlen als Prozentwert (1 Nachkommastelle). Funktioniert, weil PSB-Indikatoren
 * Ganzzahlen fuer Zaehler (Personen, Stueck) und Dezimalzahlen fuer Prozentangaben verwenden.
 * @param {number|string|null} value - Der zu formatierende Wert.
 * @returns {string} Formatierter Wert oder '--' bei null/undefined.
 */
function formatValue(value) {
    if (value == null) return '--';
    if (typeof value === 'number') {
        return Number.isInteger(value) ? eurFormatter.format(value) : pctFormatter.format(value);
    }
    return String(value);
}

/**
 * Bestimmt die CSS-Farbklasse fuer einen Budget-Fortschrittsbalken.
 * Schwellenwerte: >80% rot, >60% gelb, sonst gruen.
 * @param {number} pct - Budget-Verbrauch in Prozent.
 * @returns {string} CSS-Klassen-Suffix ('gruen', 'gelb' oder 'rot').
 */
function getBudgetColorClass(pct) {
    if (pct > 80) return 'rot';
    if (pct > 60) return 'gelb';
    return 'gruen';
}

/**
 * Gibt die CSS-Badge-Klasse fuer einen Massnahmen-Status zurueck.
 * @param {string} status - Massnahmen-Status (geplant, in Umsetzung, abgeschlossen, verzoegert).
 * @returns {string} CSS-Klassenname (z.B. 'badge--abgeschlossen').
 */
function getBadgeClass(status) {
    const map = {
        'abgeschlossen': 'badge--abgeschlossen',
        'in Umsetzung':  'badge--in-umsetzung',
        'geplant':       'badge--geplant',
        'verzoegert':    'badge--verzoegert'
    };
    return map[status] || 'badge--geplant';
}

/**
 * Escaped HTML-Sonderzeichen zur Vermeidung von XSS.
 * @param {string} text - Rohtext.
 * @returns {string} HTML-escaped Text.
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Liest eine CSS Custom Property aus :root.
 * Wird fuer Chart.js-Konfigurationen verwendet, da Canvas-Elemente
 * keinen Zugriff auf CSS Custom Properties haben.
 * @param {string} name - Property-Name ohne '--' Prefix (z.B. 'ampel-gruen').
 * @returns {string} Farbwert (z.B. '#28a745').
 */
function getCSSColor(name) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue('--' + name).trim();
}

// ------------------------------------------------------------
// 5. Meta-Rendering
// ------------------------------------------------------------

/**
 * Rendert die Header-Metadaten (Generierungszeitpunkt, Projektanzahl).
 */
function renderMeta() {
    const ts = APP_STATE.meta.generiert;
    if (ts) {
        const date = new Date(ts);
        document.getElementById('metaTimestamp').textContent =
            'Generiert: ' + date.toLocaleDateString('de-AT') + ' ' + date.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' });
    }
    document.getElementById('metaCount').textContent =
        APP_STATE.meta.anzahl_projekte + ' Projekte aus ' + APP_STATE.meta.quelldateien.length + ' Dateien';
}

// ------------------------------------------------------------
// 6. KPI-Rendering
// ------------------------------------------------------------

/**
 * Berechnet und rendert die 7 KPI-Karten (Projektanzahl, Ampel-Zaehler,
 * Gesamtbudget, Budget-Verbrauch, Warnungen).
 * @param {Array<Object>} projects - Gefilterte Projektliste.
 */
function renderKPIs(projects) {
    document.getElementById('kpiTotalProjects').textContent = projects.length;

    const ampelCounts = { gruen: 0, gelb: 0, rot: 0 };
    let budgetTotal = 0;
    let budgetSpent = 0;
    let warningCount = 0;

    projects.forEach(p => {
        ampelCounts[p.ampel] = (ampelCounts[p.ampel] || 0) + 1;
        budgetTotal += p.budget_gesamt || 0;
        budgetSpent += p.budget_verbraucht || 0;
        warningCount += (p.warnungen || []).length;
    });

    document.getElementById('kpiGruen').textContent = ampelCounts.gruen;
    document.getElementById('kpiGelb').textContent = ampelCounts.gelb;
    document.getElementById('kpiRot').textContent = ampelCounts.rot;
    document.getElementById('kpiBudgetTotal').textContent = formatEUR(budgetTotal);
    document.getElementById('kpiBudgetPct').textContent = budgetTotal > 0
        ? formatPct((budgetSpent / budgetTotal) * 100)
        : '--';
    document.getElementById('kpiWarnungen').textContent = warningCount;
}

// ------------------------------------------------------------
// 7. Filter-Logik
// ------------------------------------------------------------

/**
 * Befuellt die Filter-Dropdowns (Kapitel, Auftraggeber) mit den
 * eindeutigen Werten aus allen Projekten. Einmalig beim Start aufgerufen.
 */
function populateFilterDropdowns() {
    const kapitels = [...new Set(APP_STATE.allProjects.map(p => p.kapitel))].sort();
    const auftraggebers = [...new Set(APP_STATE.allProjects.map(p => p.auftraggeber))].sort();

    const kapitelSelect = document.getElementById('filterKapitel');
    kapitels.forEach(k => {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = k;
        kapitelSelect.appendChild(opt);
    });

    const auftraggeberSelect = document.getElementById('filterAuftraggeber');
    auftraggebers.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a;
        opt.textContent = a;
        auftraggeberSelect.appendChild(opt);
    });
}

/**
 * Wendet die aktuellen Filter (APP_STATE.filters) auf allProjects an
 * und aktualisiert APP_STATE.filteredProjects. Steuert die Sichtbarkeit
 * des Reset-Buttons.
 */
function applyFilters() {
    const { kapitel, auftraggeber, ampel } = APP_STATE.filters;
    APP_STATE.filteredProjects = APP_STATE.allProjects.filter(p => {
        if (kapitel && p.kapitel !== kapitel) return false;
        if (auftraggeber && p.auftraggeber !== auftraggeber) return false;
        if (ampel && p.ampel !== ampel) return false;
        return true;
    });

    const active = [kapitel, auftraggeber, ampel].filter(Boolean);
    log(`Filter: ${active.length ? active.join(' + ') : 'alle'} → ${APP_STATE.filteredProjects.length} Projekte`);

    // Reset-Button nur bei aktiven Filtern anzeigen
    const resetBtn = document.getElementById('filterReset');
    if (active.length > 0) {
        resetBtn.classList.add('is-visible');
    } else {
        resetBtn.classList.remove('is-visible');
    }
}

/**
 * Registriert Event-Listener fuer alle Filter-Dropdowns und den Reset-Button.
 * Jede Aenderung loest applyFilters() und renderAll() aus.
 */
function setupFilterListeners() {
    const filterKapitel = document.getElementById('filterKapitel');
    const filterAuftraggeber = document.getElementById('filterAuftraggeber');
    const filterAmpel = document.getElementById('filterAmpel');
    const filterReset = document.getElementById('filterReset');

    filterKapitel.addEventListener('change', () => {
        APP_STATE.filters.kapitel = filterKapitel.value;
        applyFilters();
        renderAll(APP_STATE.filteredProjects);
    });

    filterAuftraggeber.addEventListener('change', () => {
        APP_STATE.filters.auftraggeber = filterAuftraggeber.value;
        applyFilters();
        renderAll(APP_STATE.filteredProjects);
    });

    filterAmpel.addEventListener('change', () => {
        APP_STATE.filters.ampel = filterAmpel.value;
        applyFilters();
        renderAll(APP_STATE.filteredProjects);
    });

    filterReset.addEventListener('click', () => {
        filterKapitel.value = '';
        filterAuftraggeber.value = '';
        filterAmpel.value = '';
        APP_STATE.filters = { kapitel: '', auftraggeber: '', ampel: '' };
        APP_STATE.filteredProjects = [...APP_STATE.allProjects];
        filterReset.classList.remove('is-visible');
        renderAll(APP_STATE.filteredProjects);
    });
}

// ------------------------------------------------------------
// 8. Ampel-Grid Rendering
// ------------------------------------------------------------

/**
 * Rendert das Ampel-Grid mit einer Projektkarte pro Projekt.
 * Jede Karte zeigt Ampelpunkt, Titel, Tags, Budget-Balken und Warnungen.
 * Klick auf die Karte oeffnet das Detail-Modal.
 * @param {Array<Object>} projects - Gefilterte Projektliste.
 */
function renderAmpelGrid(projects) {
    const grid = document.getElementById('ampelGrid');
    grid.innerHTML = '';

    if (projects.length === 0) {
        grid.innerHTML = '<div class="empty-state">Keine Projekte fuer die gewaehlten Filter.</div>';
        return;
    }

    projects.forEach(p => {
        const budgetColor = getBudgetColorClass(p.budget_verbrauch_pct || 0);
        const warningCount = (p.warnungen || []).length;

        const card = document.createElement('div');
        card.className = `project-card project-card--${p.ampel}`;
        card.setAttribute('data-project-id', p.id);
        card.innerHTML = `
            <div class="project-card__header">
                <span class="ampel ampel--${p.ampel}"></span>
                <span class="project-card__id">${escapeHtml(p.id)}</span>
            </div>
            <h3 class="project-card__title">${escapeHtml(p.titel)}</h3>
            <div class="project-card__meta">
                <span class="tag">${escapeHtml(p.kapitel)}</span>
                <span class="tag">${escapeHtml(p.auftraggeber)}</span>
            </div>
            <div>
                <div class="budget-bar">
                    <div class="budget-bar__fill budget-bar__fill--${budgetColor}"
                         style="width: ${Math.min(p.budget_verbrauch_pct || 0, 100)}%"></div>
                </div>
                <span class="project-card__budget-label">
                    ${formatEUR(p.budget_verbraucht)} / ${formatEUR(p.budget_gesamt)} EUR (${formatPct(p.budget_verbrauch_pct)})
                </span>
            </div>
            <span class="project-card__warnings" data-count="${warningCount}">
                ${warningCount} Warnung${warningCount !== 1 ? 'en' : ''}
            </span>
            <button class="project-card__detail-btn" data-project-id="${escapeHtml(p.id)}">Details</button>
        `;

        card.addEventListener('click', () => {
            openDetailModal(p.id);
        });

        grid.appendChild(card);
    });
}

// ------------------------------------------------------------
// 9. Budget-Section (Chart + Tabelle)
// ------------------------------------------------------------

/**
 * Rendert die Budget-Uebersicht: horizontales Balkendiagramm (Chart.js)
 * und Tabelle mit Summenzeile. Baut den Container-Inhalt dynamisch auf,
 * damit Canvas-Elemente bei Filter-Wechsel sauber neu erstellt werden.
 * @param {Array<Object>} projects - Gefilterte Projektliste.
 */
function renderBudgetSection(projects) {
    const container = document.getElementById('budgetContent');

    if (projects.length === 0) {
        container.innerHTML = '<div class="empty-state">Keine Projekte fuer die gewaehlten Filter.</div>';
        return;
    }

    let totalGesamt = 0;
    let totalVerbraucht = 0;
    let tableRows = '';

    projects.forEach(p => {
        totalGesamt += p.budget_gesamt || 0;
        totalVerbraucht += p.budget_verbraucht || 0;
        tableRows += `<tr>
            <td>${escapeHtml(p.id)}</td>
            <td class="text-right">${formatEUR(p.budget_gesamt)}</td>
            <td class="text-right">${formatEUR(p.budget_verbraucht)}</td>
            <td class="text-right">${formatPct(p.budget_verbrauch_pct)}</td>
        </tr>`;
    });

    const totalPct = totalGesamt > 0 ? formatPct((totalVerbraucht / totalGesamt) * 100) : '--';

    container.innerHTML = `
        <div class="section__grid section__grid--2col">
            <div class="chart-container chart-container--budget">
                <canvas id="chartBudget"></canvas>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Projekt</th>
                            <th class="text-right">Budget gesamt</th>
                            <th class="text-right">Verbraucht</th>
                            <th class="text-right">Verbrauch %</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                    <tfoot>
                        <tr class="data-table__total">
                            <td>Gesamt</td>
                            <td class="text-right">${formatEUR(totalGesamt)}</td>
                            <td class="text-right">${formatEUR(totalVerbraucht)}</td>
                            <td class="text-right">${totalPct}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>`;

    createChart('budget', document.getElementById('chartBudget'), {
        type: 'bar',
        data: {
            labels: projects.map(p => p.id),
            datasets: [
                {
                    label: 'Budget gesamt',
                    data: projects.map(p => p.budget_gesamt),
                    backgroundColor: getCSSColor('color-primary'),
                    borderRadius: CHART_DEFAULTS.barRadius
                },
                {
                    label: 'Budget verbraucht',
                    data: projects.map(p => p.budget_verbraucht),
                    backgroundColor: getCSSColor('color-budget-spent'),
                    borderRadius: CHART_DEFAULTS.barRadius
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ctx.dataset.label + ': ' + formatEUR(ctx.raw) + ' EUR'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { callback: (val) => formatEUR(val) },
                    grid: { color: CHART_DEFAULTS.gridColor }
                },
                y: {
                    grid: { display: false }
                }
            }
        }
    });
}

// ------------------------------------------------------------
// 10. Soll/Ist-Charts
// ------------------------------------------------------------

/**
 * Rendert ein gruppiertes Balkendiagramm pro Projekt fuer den
 * Zielwert/Istwert-Vergleich 2024. Istwert-Balken farbcodiert:
 * gruen (Ziel erreicht), rot (verfehlt), grau (fehlend).
 * @param {Array<Object>} projects - Gefilterte Projektliste.
 */
function renderSollIstCharts(projects) {
    const grid = document.getElementById('sollIstGrid');
    grid.innerHTML = '';

    if (projects.length === 0) {
        grid.innerHTML = '<div class="empty-state">Keine Projekte fuer die gewaehlten Filter.</div>';
        return;
    }

    projects.forEach(projekt => {
        const indikatoren = projekt.indikatoren || [];
        if (indikatoren.length === 0) return;

        const card = document.createElement('div');
        card.className = 'chart-card';

        const canvasId = 'chartSollIst_' + projekt.id.replace(/[^a-zA-Z0-9]/g, '_');
        card.innerHTML = `
            <h3 class="chart-card__title">
                <span class="ampel ampel--${projekt.ampel}" style="width:10px;height:10px;"></span>
                ${escapeHtml(projekt.id)}: ${escapeHtml(projekt.titel)}
            </h3>
            <canvas id="${canvasId}"></canvas>
        `;
        grid.appendChild(card);

        const ctx = card.querySelector('canvas').getContext('2d');
        const labels = indikatoren.map(i => i.name);
        const zielwerte = indikatoren.map(i => i.zielwert_2024);
        const istwerte = indikatoren.map(i => i.istwert_2024);

        createChart('sollIst_' + projekt.id, ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Zielwert 2024',
                        data: zielwerte,
                        backgroundColor: getCSSColor('color-primary'),
                        borderRadius: CHART_DEFAULTS.barRadius
                    },
                    {
                        label: 'Istwert 2024',
                        data: istwerte,
                        backgroundColor: istwerte.map((ist, i) => {
                            if (ist == null) return getCSSColor('color-neutral');
                            return ist >= zielwerte[i] ? AMPEL_COLORS.gruen.color : AMPEL_COLORS.rot.color;
                        }),
                        borderRadius: CHART_DEFAULTS.barRadius
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { font: { size: 11 } } },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                if (ctx.raw == null) return ctx.dataset.label + ': Kein Wert';
                                return ctx.dataset.label + ': ' + ctx.raw;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            font: { size: 10 },
                            callback: function(value) {
                                const label = this.getLabelForValue(value);
                                return label.length > 25 ? label.substring(0, 22) + '...' : label;
                            }
                        },
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: CHART_DEFAULTS.gridColor }
                    }
                }
            }
        });
    });
}

// ------------------------------------------------------------
// 11. Verteilungs-Charts
// ------------------------------------------------------------

/**
 * Rendert 3 Donut/Pie-Charts: Ampelverteilung, Projekte nach Kapitel,
 * Massnahmenstatus. Baut den Container dynamisch auf.
 * @param {Array<Object>} projects - Gefilterte Projektliste.
 */
function renderDistributionCharts(projects) {
    const container = document.getElementById('verteilungContent');

    if (projects.length === 0) {
        container.innerHTML = '<div class="empty-state">Keine Projekte fuer die gewaehlten Filter.</div>';
        return;
    }

    container.innerHTML = `
        <div class="section__grid section__grid--3col">
            <div class="chart-container">
                <h3 class="chart-container__title">Ampelverteilung</h3>
                <canvas id="chartAmpelPie"></canvas>
            </div>
            <div class="chart-container">
                <h3 class="chart-container__title">Projekte nach Kapitel</h3>
                <canvas id="chartKapitelPie"></canvas>
            </div>
            <div class="chart-container">
                <h3 class="chart-container__title">Massnahmenstatus</h3>
                <canvas id="chartMassnahmenPie"></canvas>
            </div>
        </div>`;

    // Ampelverteilung
    const ampelCounts = { gruen: 0, gelb: 0, rot: 0 };
    projects.forEach(p => { ampelCounts[p.ampel] = (ampelCounts[p.ampel] || 0) + 1; });

    createChart('ampelPie', document.getElementById('chartAmpelPie'), {
        type: 'doughnut',
        data: {
            labels: ['Gruen', 'Gelb', 'Rot'],
            datasets: [{
                data: [ampelCounts.gruen, ampelCounts.gelb, ampelCounts.rot],
                backgroundColor: [AMPEL_COLORS.gruen.color, AMPEL_COLORS.gelb.color, AMPEL_COLORS.rot.color],
                ...CHART_DEFAULTS.pieBorder
            }]
        },
        options: {
            responsive: true,
            cutout: '50%',
            plugins: { legend: CHART_DEFAULTS.legendBottom }
        }
    });

    // Kapitelverteilung
    const kapitelCounts = {};
    projects.forEach(p => { kapitelCounts[p.kapitel] = (kapitelCounts[p.kapitel] || 0) + 1; });
    const kapitelLabels = Object.keys(kapitelCounts);

    createChart('kapitelPie', document.getElementById('chartKapitelPie'), {
        type: 'pie',
        data: {
            labels: kapitelLabels,
            datasets: [{
                data: kapitelLabels.map(k => kapitelCounts[k]),
                backgroundColor: kapitelLabels.map(k => KAPITEL_COLORS[k] || getCSSColor('color-text-muted')),
                ...CHART_DEFAULTS.pieBorder
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: CHART_DEFAULTS.legendBottom }
        }
    });

    // Massnahmenstatus
    const statusCounts = {};
    projects.forEach(p => {
        (p.massnahmen || []).forEach(m => {
            statusCounts[m.status] = (statusCounts[m.status] || 0) + 1;
        });
    });
    const statusLabels = Object.keys(statusCounts);

    createChart('massnahmenPie', document.getElementById('chartMassnahmenPie'), {
        type: 'doughnut',
        data: {
            labels: statusLabels,
            datasets: [{
                data: statusLabels.map(s => statusCounts[s]),
                backgroundColor: statusLabels.map(s => MASSNAHMEN_COLORS[s] || getCSSColor('color-text-muted')),
                ...CHART_DEFAULTS.pieBorder
            }]
        },
        options: {
            responsive: true,
            cutout: '50%',
            plugins: { legend: CHART_DEFAULTS.legendBottom }
        }
    });
}

// ------------------------------------------------------------
// 12. Detail-Modal
// ------------------------------------------------------------

/**
 * Oeffnet das Detail-Modal fuer ein Projekt. Zeigt alle Metadaten,
 * Indikatoren (mit Farbcodierung), Massnahmen (mit Badges),
 * Kommentar und Warnungen.
 * @param {string} projectId - Projekt-ID (z.B. 'LV-2024-001').
 */
function openDetailModal(projectId) {
    const projekt = APP_STATE.allProjects.find(p => p.id === projectId);
    if (!projekt) return;

    // Ampelpunkt
    const modalAmpel = document.getElementById('modalAmpel');
    modalAmpel.className = 'ampel ampel--' + projekt.ampel;

    // Titel
    document.getElementById('modalTitle').textContent = projekt.titel;

    // Metadaten
    const metaGrid = document.getElementById('modalMeta');
    metaGrid.innerHTML = `
        <div class="meta-item">
            <span class="meta-item__label">Projekt-ID</span>
            <span class="meta-item__value">${escapeHtml(projekt.id)}</span>
        </div>
        <div class="meta-item">
            <span class="meta-item__label">Kapitel</span>
            <span class="meta-item__value">${escapeHtml(projekt.kapitel)}</span>
        </div>
        <div class="meta-item">
            <span class="meta-item__label">Auftraggeber</span>
            <span class="meta-item__value">${escapeHtml(projekt.auftraggeber)}</span>
        </div>
        <div class="meta-item">
            <span class="meta-item__label">Laufzeit</span>
            <span class="meta-item__value">${escapeHtml(projekt.laufzeit_von)} – ${escapeHtml(projekt.laufzeit_bis)}</span>
        </div>
        <div class="meta-item">
            <span class="meta-item__label">Budget gesamt</span>
            <span class="meta-item__value">${formatEUR(projekt.budget_gesamt)} EUR</span>
        </div>
        <div class="meta-item">
            <span class="meta-item__label">Budget verbraucht</span>
            <span class="meta-item__value">${formatEUR(projekt.budget_verbraucht)} EUR (${formatPct(projekt.budget_verbrauch_pct)})</span>
        </div>
        <div class="meta-item">
            <span class="meta-item__label">Berichtszeitraum</span>
            <span class="meta-item__value">${escapeHtml(projekt.berichtszeitraum)}</span>
        </div>
        <div class="meta-item">
            <span class="meta-item__label">Projektauftrag</span>
            <span class="meta-item__value">${projekt.projektauftrag === 'ja' ? 'Ja' : 'Nein'}</span>
        </div>
    `;

    // Kurzbeschreibung
    document.getElementById('modalKurzbeschreibung').textContent = projekt.kurzbeschreibung || '--';

    // Indikatoren-Tabelle
    const indBody = document.getElementById('modalIndikatorenBody');
    indBody.innerHTML = '';
    (projekt.indikatoren || []).forEach(ind => {
        const tr = document.createElement('tr');

        const cells2024 = renderIndikatorCell(ind.zielwert_2024, ind.istwert_2024);
        const cells2025 = renderIndikatorCell(ind.zielwert_2025, ind.istwert_2025);

        tr.innerHTML = `
            <td>${escapeHtml(ind.name)}</td>
            <td>${escapeHtml(ind.einheit)}</td>
            <td class="text-right">${formatValue(ind.zielwert_2024)}</td>
            <td class="text-right ${cells2024.cssClass}">${cells2024.display}</td>
            <td class="text-right">${formatValue(ind.zielwert_2025)}</td>
            <td class="text-right ${cells2025.cssClass}">${cells2025.display}</td>
            <td class="text-right">${formatValue(ind.zielwert_2026)}</td>
        `;
        indBody.appendChild(tr);
    });

    // Massnahmen-Tabelle
    const massBody = document.getElementById('modalMassnahmenBody');
    massBody.innerHTML = '';
    (projekt.massnahmen || []).forEach(m => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(m.name)}</td>
            <td><span class="badge ${getBadgeClass(m.status)}">${escapeHtml(m.status)}</span></td>
            <td>${escapeHtml(m.termin)}</td>
        `;
        massBody.appendChild(tr);
    });

    // Kommentar
    document.getElementById('modalKommentar').textContent = projekt.kommentar || '--';

    // Warnungen
    const warnSection = document.getElementById('modalWarnungenSection');
    const warnList = document.getElementById('modalWarnungen');
    const warnungen = projekt.warnungen || [];

    if (warnungen.length === 0) {
        warnSection.style.display = 'none';
    } else {
        warnSection.style.display = '';
        warnList.innerHTML = '';
        warnungen.forEach(w => {
            const li = document.createElement('li');
            li.textContent = w;
            warnList.appendChild(li);
        });
    }

    // Modal anzeigen
    document.getElementById('modalBackdrop').classList.add('is-visible');
    document.body.style.overflow = 'hidden';
}

/**
 * Bestimmt Anzeige und CSS-Klasse fuer eine Indikator-Zelle im Modal.
 * Vergleicht Istwert gegen Zielwert und farbcodiert entsprechend.
 * @param {number|null} ziel - Zielwert.
 * @param {number|null} ist - Istwert.
 * @returns {{ display: string, cssClass: string }} Anzeige-String und CSS-Klasse.
 */
function renderIndikatorCell(ziel, ist) {
    if (ist == null) {
        return { display: '--', cssClass: 'cell--missing' };
    }
    const val = formatValue(ist);
    if (ziel != null && ist < ziel) {
        return { display: val, cssClass: 'cell--missed' };
    }
    if (ziel != null && ist >= ziel) {
        return { display: val, cssClass: 'cell--met' };
    }
    return { display: val, cssClass: '' };
}

/**
 * Schliesst das Detail-Modal und stellt den Scroll-Zustand wieder her.
 */
function closeDetailModal() {
    document.getElementById('modalBackdrop').classList.remove('is-visible');
    document.body.style.overflow = '';
}

/**
 * Registriert Event-Listener fuer das Schliessen des Detail-Modals:
 * X-Button, Klick auf Backdrop, Escape-Taste.
 */
function setupModalListeners() {
    document.getElementById('modalClose').addEventListener('click', closeDetailModal);

    document.getElementById('modalBackdrop').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalBackdrop')) {
            closeDetailModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDetailModal();
        }
    });
}

// ------------------------------------------------------------
// 13. Chart-Verwaltung
// ------------------------------------------------------------

/** Gemeinsame Chart.js-Standardwerte fuer alle Charts. */
const CHART_DEFAULTS = {
    barRadius: 3,
    gridColor: '#eeeeee',  // Wird in initChartDefaults() durch CSS-Wert ersetzt
    pieBorder: {            // Wird in initChartDefaults() durch CSS-Werte ersetzt
        borderWidth: 2,
        borderColor: '#ffffff'
    },
    legendBottom: {
        position: 'bottom',
        labels: { font: { size: 12 } }
    }
};

/**
 * Initialisiert CHART_DEFAULTS mit Farbwerten aus den CSS Custom Properties.
 * Muss nach DOMContentLoaded aufgerufen werden, da getComputedStyle DOM benoetigt.
 */
function initChartDefaults() {
    CHART_DEFAULTS.gridColor = getCSSColor('color-chart-grid');
    CHART_DEFAULTS.pieBorder.borderColor = getCSSColor('color-bg');
}

/**
 * Zerstoert alle Chart.js-Instanzen in APP_STATE.charts und leert das Objekt.
 * Muss vor jedem Neurendering aufgerufen werden, um Memory Leaks zu vermeiden.
 */
function destroyCharts() {
    Object.values(APP_STATE.charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    APP_STATE.charts = {};
}

/**
 * Erstellt einen Chart.js-Chart und registriert ihn in APP_STATE.charts.
 * Zentraler Erstellungspunkt, damit alle Charts bei destroyCharts() erfasst werden.
 * @param {string} key - Schluessel fuer APP_STATE.charts (z.B. 'budget', 'ampelPie').
 * @param {HTMLCanvasElement|CanvasRenderingContext2D} ctx - Canvas-Element oder Context.
 * @param {Object} config - Chart.js-Konfigurationsobjekt.
 * @returns {Chart} Die erstellte Chart-Instanz.
 */
function createChart(key, ctx, config) {
    APP_STATE.charts[key] = new Chart(ctx, config);
    return APP_STATE.charts[key];
}

// ------------------------------------------------------------
// 14. Haupt-Render-Funktion
// ------------------------------------------------------------

/**
 * Haupt-Render-Funktion. Zerstoert alle bestehenden Charts und rendert
 * alle Sektionen neu. Wird bei jeder Filteraenderung aufgerufen.
 * @param {Array<Object>} projects - Gefilterte Projektliste.
 */
function renderAll(projects) {
    destroyCharts();
    renderKPIs(projects);
    renderAmpelGrid(projects);
    renderBudgetSection(projects);
    renderSollIstCharts(projects);
    renderDistributionCharts(projects);
    log(`Render: ${projects.length} Projekte, ${Object.keys(APP_STATE.charts).length} Charts`);
}

// ------------------------------------------------------------
// 15. Initialisierung
// ------------------------------------------------------------

document.addEventListener('DOMContentLoaded', async () => {
    const loadingOverlay = document.getElementById('loadingOverlay');

    try {
        initChartDefaults();
        await loadData();
        renderMeta();
        populateFilterDropdowns();
        renderAll(APP_STATE.allProjects);
        setupFilterListeners();
        setupModalListeners();

        // Loading-Overlay ausblenden
        loadingOverlay.classList.add('is-hidden');
        setTimeout(() => loadingOverlay.remove(), 300);
    } catch (error) {
        console.error('Dashboard-Fehler:', error);
        loadingOverlay.classList.add('is-hidden');
        setTimeout(() => loadingOverlay.remove(), 300);
        document.querySelector('.kpi-bar').innerHTML = `
            <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; background: #fce8e8; border-radius: 8px;">
                <h2 style="color: #dc3545; margin-bottom: 0.5rem;">Fehler beim Laden der Daten</h2>
                <p>${escapeHtml(error.message)}</p>
                <p style="color: #6c757d; margin-top: 0.5rem;">
                    Stellen Sie sicher, dass <code>consolidated.json</code> vorhanden ist
                    und der Server laeuft (<code>python start_dashboard.py</code>).
                </p>
            </div>
        `;
    }
});
