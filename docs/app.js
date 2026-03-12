/**
 * Projektportfolio Dashboard - app.js
 * LV-Vorhaben 2025-2027, VetMedUni Wien
 *
 * Datenquelle: consolidated.json (48-Spalten-Modell aus konsolidiert.xlsx)
 * Felder: lv_nummer, leistungsbereich, kapitelzuordnung, projektname,
 *         pag, ampelstatus, projektphase, fertigstellungsgrad, risiko,
 *         plankosten_2025/2026/2027/gesamt, istkosten_2025/2026/2027/gesamt/prozent,
 *         start, ende, dauer_werktage, meilensteine, status_aktuell, etc.
 *
 * Ampelwerte: "In Ordnung" (gruen), "Vorsicht" (gelb), "Krise" (rot)
 */

// ---- 1. State & Konstanten ----

const APP_STATE = {
    allProjects: [],
    filteredProjects: [],
    meta: {},
    charts: {}
};

const AMPEL_COLORS = {
    'In Ordnung': { bg: '#e6f4ea', color: '#4CAF50', border: '#388E3C', label: 'In Ordnung' },
    'Vorsicht':   { bg: '#fff8e1', color: '#FFC107', border: '#FFA000', text: '#8a6d00', label: 'Vorsicht' },
    'Krise':      { bg: '#fce8e8', color: '#F44336', border: '#D32F2F', label: 'Krise' }
};

const AMPEL_ORDER = ['In Ordnung', 'Vorsicht', 'Krise'];

const LEISTUNGSBEREICH_COLORS = {
    'A': '#2E86AB',
    'B': '#A23B72',
    'C': '#F18F01',
    'D': '#C73E1D'
};

const LEISTUNGSBEREICH_LABELS = {
    'A': 'A: Gesellschaftliche Ziele',
    'B': 'B: Forschung/EEK',
    'C': 'C: Lehre',
    'D': 'D: Sonstige'
};

const PHASE_COLORS = {
    'Idee erfasst/noch nicht gestartet': '#90CAF9',
    'Planung': '#42A5F5',
    'In Arbeit': '#1565C0',
    'Blockiert': '#FF7043',
    'Abgeschlossen': '#66BB6A',
    'Abgebrochen': '#BDBDBD'
};

// ---- 2. Daten laden ----

async function loadData() {
    const response = await fetch('consolidated.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    APP_STATE.meta = data.meta;
    APP_STATE.allProjects = data.projekte;
    APP_STATE.filteredProjects = [...data.projekte];
}

// ---- 3. Hilfsfunktionen ----

const eurFormatter = new Intl.NumberFormat('de-AT', { style: 'decimal', maximumFractionDigits: 0 });
const pctFormatter = new Intl.NumberFormat('de-AT', { style: 'decimal', minimumFractionDigits: 1, maximumFractionDigits: 1 });

function formatEUR(value) {
    if (value == null || value === '' || value === 0) return '--';
    return eurFormatter.format(value);
}

function formatPct(value) {
    if (value == null || value === '') return '--';
    return pctFormatter.format(value * 100) + ' %';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function getAmpelClass(ampel) {
    if (ampel === 'In Ordnung') return 'gruen';
    if (ampel === 'Vorsicht') return 'gelb';
    if (ampel === 'Krise') return 'rot';
    return 'gruen';
}

function getLeistungsbereich(lv_nummer) {
    if (!lv_nummer) return '';
    const match = String(lv_nummer).match(/^([A-D])/);
    return match ? match[1] : '';
}

function getBudgetColorClass(pct) {
    if (pct > 0.8) return 'rot';
    if (pct > 0.6) return 'gelb';
    return 'gruen';
}

function hasValidationIssues(p) {
    const v = p._validierung || p['_validierung'];
    return v && v !== 'OK';
}

// ---- 4. Meta-Rendering ----

function renderMeta() {
    const ts = APP_STATE.meta.generiert;
    if (ts) {
        const date = new Date(ts);
        document.getElementById('metaTimestamp').textContent =
            'Stand: ' + date.toLocaleDateString('de-AT') + ' ' + date.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' });
    }
    document.getElementById('metaCount').textContent =
        APP_STATE.meta.anzahl_projekte + ' Projekte | Quelle: ' + (APP_STATE.meta.quelle || 'konsolidiert.xlsx');
}

// ---- 5. KPI-Rendering ----

function renderKPIs() {
    const projects = APP_STATE.filteredProjects;
    const n = projects.length;

    document.getElementById('kpiTotalProjects').textContent = n;

    // Ampel
    const ampelCounts = { 'In Ordnung': 0, 'Vorsicht': 0, 'Krise': 0 };
    projects.forEach(p => {
        const a = p.ampelstatus;
        if (a in ampelCounts) ampelCounts[a]++;
    });
    document.getElementById('kpiGruen').textContent = ampelCounts['In Ordnung'];
    document.getElementById('kpiGelb').textContent = ampelCounts['Vorsicht'];
    document.getElementById('kpiRot').textContent = ampelCounts['Krise'];

    // Budget
    const totalPlan = projects.reduce((s, p) => s + (p.plankosten_gesamt || 0), 0);
    const totalIst = projects.reduce((s, p) => s + (p.istkosten_gesamt || 0), 0);
    document.getElementById('kpiBudgetTotal').textContent = formatEUR(totalPlan);
    document.getElementById('kpiBudgetPct').textContent = totalPlan > 0 ? formatPct(totalIst / totalPlan) : '--';

    // Validierung
    const nIssues = projects.filter(hasValidationIssues).length;
    document.getElementById('kpiValidierung').textContent = nIssues;
    const card = document.getElementById('kpiValidierung').closest('.kpi-card');
    if (card) card.classList.toggle('kpi-card--has-warnings', nIssues > 0);
}

// ---- 6. Filter-Logik ----

function populateFilterDropdowns() {
    const projects = APP_STATE.allProjects;

    // Leistungsbereich
    const lbs = [...new Set(projects.map(p => p.leistungsbereich).filter(Boolean))].sort();
    const lbSelect = document.getElementById('filterLeistungsbereich');
    lbs.forEach(lb => {
        const opt = document.createElement('option');
        opt.value = lb;
        opt.textContent = lb;
        lbSelect.appendChild(opt);
    });

    // PAG
    const pags = [...new Set(projects.map(p => p.pag).filter(Boolean))].sort();
    const pagSelect = document.getElementById('filterPAG');
    pags.forEach(pag => {
        const opt = document.createElement('option');
        opt.value = pag;
        opt.textContent = pag;
        pagSelect.appendChild(opt);
    });

    // Phase
    const phases = [...new Set(projects.map(p => p.projektphase).filter(Boolean))].sort();
    const phaseSelect = document.getElementById('filterPhase');
    phases.forEach(phase => {
        const opt = document.createElement('option');
        opt.value = phase;
        opt.textContent = phase;
        phaseSelect.appendChild(opt);
    });
}

function applyFilters() {
    const lb = document.getElementById('filterLeistungsbereich').value;
    const pag = document.getElementById('filterPAG').value;
    const ampel = document.getElementById('filterAmpel').value;
    const phase = document.getElementById('filterPhase').value;

    APP_STATE.filteredProjects = APP_STATE.allProjects.filter(p => {
        if (lb && p.leistungsbereich !== lb) return false;
        if (pag && p.pag !== pag) return false;
        if (ampel && p.ampelstatus !== ampel) return false;
        if (phase && p.projektphase !== phase) return false;
        return true;
    });

    const hasActiveFilter = lb || pag || ampel || phase;
    document.getElementById('filterReset').classList.toggle('is-visible', hasActiveFilter);

    renderAll();
}

function setupFilterListeners() {
    ['filterLeistungsbereich', 'filterPAG', 'filterAmpel', 'filterPhase'].forEach(id => {
        document.getElementById(id).addEventListener('change', applyFilters);
    });
    document.getElementById('filterReset').addEventListener('click', () => {
        document.getElementById('filterLeistungsbereich').value = '';
        document.getElementById('filterPAG').value = '';
        document.getElementById('filterAmpel').value = '';
        document.getElementById('filterPhase').value = '';
        applyFilters();
    });
}

// ---- 7. Ampel-Grid ----

function renderAmpelGrid() {
    const grid = document.getElementById('ampelGrid');
    const projects = APP_STATE.filteredProjects;

    if (projects.length === 0) {
        grid.innerHTML = '<div class="empty-state">Keine Projekte gefunden.</div>';
        return;
    }

    // Sort: Krise first, then Vorsicht, then In Ordnung
    const sorted = [...projects].sort((a, b) => {
        const order = { 'Krise': 0, 'Vorsicht': 1, 'In Ordnung': 2 };
        return (order[a.ampelstatus] ?? 3) - (order[b.ampelstatus] ?? 3);
    });

    grid.innerHTML = sorted.map(p => {
        const ampelClass = getAmpelClass(p.ampelstatus);
        const planGesamt = p.plankosten_gesamt || 0;
        const istGesamt = p.istkosten_gesamt || 0;
        const budgetPct = planGesamt > 0 ? (istGesamt / planGesamt * 100) : 0;
        const budgetColor = getBudgetColorClass(budgetPct / 100);
        const fg = p.fertigstellungsgrad ? (p.fertigstellungsgrad * 100).toFixed(0) + '%' : '0%';
        const validation = hasValidationIssues(p);

        return `
        <div class="ampel-card" data-lv="${escapeHtml(p.lv_nummer)}">
            <div class="ampel-card__header">
                <span class="ampel ampel--${ampelClass}"></span>
                <span class="ampel-card__id">${escapeHtml(p.lv_nummer)}</span>
                ${validation ? '<span class="ampel-card__warning" title="Validierungsproblem">!</span>' : ''}
            </div>
            <div class="ampel-card__title">${escapeHtml(p.projektname)}</div>
            <div class="ampel-card__details">
                <span>${escapeHtml(p.pag || '')}</span>
                <span>${escapeHtml(p.projektphase || '')}</span>
                <span>${fg}</span>
            </div>
            <div class="ampel-card__budget">
                <div class="budget-bar">
                    <div class="budget-bar__fill budget-bar__fill--${budgetColor}" style="width: ${Math.min(budgetPct, 100)}%"></div>
                </div>
                <span class="ampel-card__budget-label">${formatEUR(istGesamt)} / ${formatEUR(planGesamt)} EUR</span>
            </div>
            <button class="ampel-card__detail-btn" onclick="openDetailModal('${escapeHtml(p.lv_nummer)}')">Details</button>
        </div>`;
    }).join('');
}

// ---- 8. Budget-Section ----

function renderBudgetSection() {
    const container = document.getElementById('budgetContent');
    const projects = APP_STATE.filteredProjects.filter(p => p.plankosten_gesamt > 0);

    if (projects.length === 0) {
        container.innerHTML = '<div class="empty-state">Keine Budgetdaten vorhanden.</div>';
        return;
    }

    // Chart: Plan vs. Ist nach Jahr
    const years = ['2025', '2026', '2027'];
    const planPerYear = years.map(y => projects.reduce((s, p) => s + (p[`plankosten_${y}`] || 0), 0));
    const istPerYear = years.map(y => projects.reduce((s, p) => s + (p[`istkosten_${y}`] || 0), 0));

    container.innerHTML = `
        <div class="section__grid section__grid--2col">
            <div class="chart-container chart-container--budget">
                <canvas id="budgetChart"></canvas>
            </div>
            <div class="table-container">
                <table class="data-table" id="budgetTable">
                    <thead>
                        <tr>
                            <th>LV-Nr.</th>
                            <th>Projekt</th>
                            <th class="text-right">Plan (EUR)</th>
                            <th class="text-right">Ist (EUR)</th>
                            <th class="text-right">Ist %</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>`;

    // Chart
    destroyChart('budgetChart');
    APP_STATE.charts.budgetChart = new Chart(document.getElementById('budgetChart'), {
        type: 'bar',
        data: {
            labels: years,
            datasets: [
                { label: 'Plan', data: planPerYear, backgroundColor: '#1F4E79' },
                { label: 'Ist', data: istPerYear, backgroundColor: '#2E86AB' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: 'Budget: Plan vs. Ist nach Jahr' },
                tooltip: {
                    callbacks: {
                        label: ctx => ctx.dataset.label + ': ' + eurFormatter.format(ctx.raw) + ' EUR'
                    }
                }
            },
            scales: {
                y: {
                    ticks: { callback: v => eurFormatter.format(v) }
                }
            }
        }
    });

    // Table
    const tbody = container.querySelector('tbody');
    const sorted = [...projects].sort((a, b) => (b.plankosten_gesamt || 0) - (a.plankosten_gesamt || 0));
    let totalPlan = 0, totalIst = 0;

    sorted.forEach(p => {
        const plan = p.plankosten_gesamt || 0;
        const ist = p.istkosten_gesamt || 0;
        const pct = plan > 0 ? ist / plan : 0;
        totalPlan += plan;
        totalIst += ist;

        const pctClass = pct > 0.8 ? 'value--missed' : pct > 0.6 ? 'value--warning' : '';
        tbody.innerHTML += `<tr>
            <td>${escapeHtml(p.lv_nummer)}</td>
            <td>${escapeHtml(String(p.projektname || '').substring(0, 40))}</td>
            <td class="text-right">${eurFormatter.format(plan)}</td>
            <td class="text-right">${eurFormatter.format(ist)}</td>
            <td class="text-right ${pctClass}">${formatPct(pct)}</td>
        </tr>`;
    });

    const totalPct = totalPlan > 0 ? totalIst / totalPlan : 0;
    tbody.innerHTML += `<tr class="data-table__total">
        <td colspan="2"><strong>Gesamt</strong></td>
        <td class="text-right"><strong>${eurFormatter.format(totalPlan)}</strong></td>
        <td class="text-right"><strong>${eurFormatter.format(totalIst)}</strong></td>
        <td class="text-right"><strong>${formatPct(totalPct)}</strong></td>
    </tr>`;
}

// ---- 9. Verteilungs-Charts ----

function renderDistributionCharts() {
    const container = document.getElementById('verteilungContent');
    const projects = APP_STATE.filteredProjects;

    container.innerHTML = `
        <div class="section__grid section__grid--3col">
            <div class="chart-container"><canvas id="chartAmpel"></canvas></div>
            <div class="chart-container"><canvas id="chartLeistungsbereich"></canvas></div>
            <div class="chart-container"><canvas id="chartPhase"></canvas></div>
        </div>`;

    // Ampel-Donut
    const ampelCounts = {};
    AMPEL_ORDER.forEach(a => ampelCounts[a] = 0);
    projects.forEach(p => { if (p.ampelstatus in ampelCounts) ampelCounts[p.ampelstatus]++; });
    const ampelLabels = AMPEL_ORDER.filter(a => ampelCounts[a] > 0);
    const ampelValues = ampelLabels.map(a => ampelCounts[a]);
    const ampelColors = ampelLabels.map(a => AMPEL_COLORS[a].color);

    destroyChart('chartAmpel');
    APP_STATE.charts.chartAmpel = new Chart(document.getElementById('chartAmpel'), {
        type: 'doughnut',
        data: { labels: ampelLabels, datasets: [{ data: ampelValues, backgroundColor: ampelColors }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { title: { display: true, text: 'Ampelverteilung' } }
        }
    });

    // Leistungsbereich-Pie
    const lbCounts = {};
    projects.forEach(p => {
        const lb = getLeistungsbereich(p.lv_nummer);
        if (lb) lbCounts[lb] = (lbCounts[lb] || 0) + 1;
    });
    const lbLabels = Object.keys(lbCounts).sort();
    const lbValues = lbLabels.map(l => lbCounts[l]);
    const lbColors = lbLabels.map(l => LEISTUNGSBEREICH_COLORS[l] || '#999');
    const lbDisplayLabels = lbLabels.map(l => LEISTUNGSBEREICH_LABELS[l] || l);

    destroyChart('chartLeistungsbereich');
    APP_STATE.charts.chartLeistungsbereich = new Chart(document.getElementById('chartLeistungsbereich'), {
        type: 'pie',
        data: { labels: lbDisplayLabels, datasets: [{ data: lbValues, backgroundColor: lbColors }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { title: { display: true, text: 'Nach Leistungsbereich' } }
        }
    });

    // Phase-Bar
    const phaseCounts = {};
    projects.forEach(p => { if (p.projektphase) phaseCounts[p.projektphase] = (phaseCounts[p.projektphase] || 0) + 1; });
    const phaseLabels = Object.keys(phaseCounts);
    const phaseValues = phaseLabels.map(l => phaseCounts[l]);
    const phaseColors = phaseLabels.map(l => PHASE_COLORS[l] || '#999');

    destroyChart('chartPhase');
    APP_STATE.charts.chartPhase = new Chart(document.getElementById('chartPhase'), {
        type: 'bar',
        data: {
            labels: phaseLabels,
            datasets: [{ data: phaseValues, backgroundColor: phaseColors }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                title: { display: true, text: 'Nach Projektphase' },
                legend: { display: false }
            },
            scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

// ---- 10. Detail-Modal ----

function openDetailModal(lv_nummer) {
    const p = APP_STATE.allProjects.find(x => x.lv_nummer === lv_nummer);
    if (!p) return;

    const ampelClass = getAmpelClass(p.ampelstatus);
    document.getElementById('modalAmpel').className = 'ampel ampel--' + ampelClass;
    document.getElementById('modalTitle').textContent = `${p.lv_nummer}: ${p.projektname || ''}`;

    // Meta
    const fg = p.fertigstellungsgrad ? (p.fertigstellungsgrad * 100).toFixed(0) + '%' : '0%';
    document.getElementById('modalMeta').innerHTML = `
        <div class="modal__meta-item"><strong>PAG:</strong> ${escapeHtml(p.pag)}</div>
        <div class="modal__meta-item"><strong>Leistungsbereich:</strong> ${escapeHtml(p.leistungsbereich)}</div>
        <div class="modal__meta-item"><strong>Kapitel:</strong> ${escapeHtml(p.kapitelzuordnung)}</div>
        <div class="modal__meta-item"><strong>Phase:</strong> ${escapeHtml(p.projektphase)}</div>
        <div class="modal__meta-item"><strong>Fortschritt:</strong> ${fg}</div>
        <div class="modal__meta-item"><strong>Risiko:</strong> ${escapeHtml(p.risiko)}</div>
        <div class="modal__meta-item"><strong>Projektleitung:</strong> ${escapeHtml(p.projektleitung)}</div>
        <div class="modal__meta-item"><strong>Start:</strong> ${p.start ? new Date(p.start).toLocaleDateString('de-AT') : '--'}</div>
        <div class="modal__meta-item"><strong>Ende:</strong> ${p.ende ? new Date(p.ende).toLocaleDateString('de-AT') : '--'}</div>
        <div class="modal__meta-item"><strong>Dauer:</strong> ${p.dauer_werktage ? p.dauer_werktage + ' Werktage' : '--'}</div>
        <div class="modal__meta-item"><strong>Plankosten:</strong> ${formatEUR(p.plankosten_gesamt)} EUR</div>
        <div class="modal__meta-item"><strong>Istkosten:</strong> ${formatEUR(p.istkosten_gesamt)} EUR (${formatPct(p.istkosten_prozent)})</div>
    `;

    document.getElementById('modalKurzbeschreibung').textContent = p.kurzbeschreibung || 'Keine Kurzbeschreibung vorhanden.';
    document.getElementById('modalMeilensteine').textContent = p.meilensteine || 'Keine Meilensteine erfasst.';
    document.getElementById('modalStatus').textContent = p.status_aktuell || 'Kein Statusbericht vorhanden.';
    document.getElementById('modalRisiken').textContent = p.risiken_aktuell || 'Keine Risiken erfasst.';
    document.getElementById('modalEntscheidung').textContent = p.entscheidung_aktuell || 'Kein Entscheidungsbedarf.';

    // Validierung
    const valSection = document.getElementById('modalValidierungSection');
    const val = p._validierung || p['_validierung'];
    if (val && val !== 'OK') {
        valSection.style.display = '';
        document.getElementById('modalValidierung').textContent = val;
    } else {
        valSection.style.display = 'none';
    }

    document.getElementById('modalBackdrop').classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeDetailModal() {
    document.getElementById('modalBackdrop').classList.remove('is-open');
    document.body.style.overflow = '';
}

function setupModalListeners() {
    document.getElementById('modalClose').addEventListener('click', closeDetailModal);
    document.getElementById('modalBackdrop').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeDetailModal();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeDetailModal();
    });
}

// ---- 11. Chart-Verwaltung ----

function destroyChart(id) {
    if (APP_STATE.charts[id]) {
        APP_STATE.charts[id].destroy();
        delete APP_STATE.charts[id];
    }
}

function destroyAllCharts() {
    Object.keys(APP_STATE.charts).forEach(destroyChart);
}

// ---- 12. Haupt-Render-Funktion ----

function renderAll() {
    destroyAllCharts();
    renderKPIs();
    renderAmpelGrid();
    renderBudgetSection();
    renderDistributionCharts();
}

// ---- 13. Initialisierung ----

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadData();
        renderMeta();
        populateFilterDropdowns();
        setupFilterListeners();
        setupModalListeners();
        renderAll();
    } catch (err) {
        console.error('[Dashboard]', err);
        document.getElementById('ampelGrid').innerHTML =
            `<div class="empty-state">Fehler beim Laden: ${escapeHtml(err.message)}<br>
             Bitte <code>python start_dashboard.py</code> ausfuehren.</div>`;
    } finally {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
    }
});
