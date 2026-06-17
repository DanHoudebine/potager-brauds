// ============================================================
//  Mes récoltes — saisie des quantités + comparateur mois / année
// ============================================================
import type { HarvestRecord, HarvestUnit } from '../types';
import { state, save } from '../state';
import { el, qs, qsa, openModal, closeModal, flash } from '../ui/dom';
import { iso, parseISO, formatDate, uid, escapeHTML } from '../utils';
import { CATALOG, plantById } from '../data/catalog';
import { awardXP, checkMilestones } from './xp';

const UNITS: HarvestUnit[] = ['kg', 'g', 'pièces', 'bottes', 'L'];
const MONTHS_INI = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const MONTHS_FULL = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

let selectedYear = new Date().getFullYear();

function harvests(): HarvestRecord[] {
  return (state.harvests = state.harvests || []);
}

/** Formate une quantité sans décimales superflues (12.0 → 12, 1.5 → 1,5). */
function fmtQty(n: number): string {
  return (Math.round(n * 100) / 100).toString().replace('.', ',');
}

function recordsForYear(year: number): HarvestRecord[] {
  return harvests().filter((h) => parseISO(h.date).getFullYear() === year);
}

/** { unit: total } sur une liste de récoltes. */
function totalsByUnit(records: HarvestRecord[]): Record<string, number> {
  const map: Record<string, number> = {};
  records.forEach((h) => (map[h.unit] = (map[h.unit] || 0) + h.quantity));
  return map;
}

/** 12 cases (jan→déc) avec le total de l'unité donnée pour chaque mois. */
function monthlyByUnit(records: HarvestRecord[], unit: string): number[] {
  const arr = Array(12).fill(0);
  records.filter((h) => h.unit === unit).forEach((h) => {
    arr[parseISO(h.date).getMonth()] += h.quantity;
  });
  return arr;
}

function deltaBadge(cur: number, prev: number): string {
  if (prev <= 0) return cur > 0 ? '<span class="hv-delta new">nouveau</span>' : '';
  const diff = cur - prev;
  const pct = Math.round((diff / prev) * 100);
  if (diff > 0) return `<span class="hv-delta up">▲ +${fmtQty(diff)} (+${pct}%)</span>`;
  if (diff < 0) return `<span class="hv-delta down">▼ ${fmtQty(diff)} (${pct}%)</span>`;
  return '<span class="hv-delta flat">= stable</span>';
}

function comparatorHTML(): string {
  const recs = recordsForYear(selectedYear);
  const prevRecs = recordsForYear(selectedYear - 1);
  const allYears = harvests().length;

  if (!allYears) {
    return `<div class="hv-empty muted small">Aucune récolte enregistrée pour l'instant. Ajoutez votre première récolte ci-dessus — le comparatif par mois et par année apparaîtra ici. 🌱</div>`;
  }

  const totals = totalsByUnit(recs);
  const prevTotals = totalsByUnit(prevRecs);
  const unitsPresent = UNITS.filter((u) => (totals[u] || 0) > 0 || (prevTotals[u] || 0) > 0);

  let chart: string;
  if (!unitsPresent.length) {
    chart = `<div class="muted small hv-empty">Aucune récolte en ${selectedYear}.</div>`;
  } else {
    chart = unitsPresent
      .map((unit) => {
        const monthly = monthlyByUnit(recs, unit);
        const max = Math.max(...monthly, 0);
        const yearTotal = totals[unit] || 0;
        const bars = monthly
          .map((v, m) => {
            const pct = max > 0 && v > 0 ? Math.max(8, Math.round((v / max) * 100)) : 0;
            const title = `${MONTHS_FULL[m]} ${selectedYear} : ${fmtQty(v)} ${unit}`;
            return `<div class="hv-bar-wrap" title="${title}">
              <div class="hv-bar ${v > 0 ? 'on' : ''}" style="height:${pct}%"></div>
              <span class="hv-bar-lbl">${MONTHS_INI[m]}</span>
            </div>`;
          })
          .join('');
        return `<div class="hv-cmp-unit">
          <div class="hv-cmp-head">
            <span class="hv-cmp-total"><b>${fmtQty(yearTotal)} ${unit}</b> en ${selectedYear}</span>
            ${deltaBadge(yearTotal, prevTotals[unit] || 0)}
          </div>
          <div class="hv-bars">${bars}</div>
        </div>`;
      })
      .join('');
  }

  // Détail par plante pour l'année sélectionnée.
  const byPlant: Record<string, Record<string, number>> = {};
  recs.forEach((h) => {
    const key = h.plantId || h.plantName || '?';
    (byPlant[key] = byPlant[key] || {});
    byPlant[key][h.unit] = (byPlant[key][h.unit] || 0) + h.quantity;
  });
  const plantRows = Object.entries(byPlant)
    .map(([key, units]) => {
      const p = plantById(key);
      const name = p ? p.name : recs.find((h) => (h.plantId || h.plantName) === key)?.plantName || key;
      const icon = p ? p.icon : '🌿';
      const qty = Object.entries(units)
        .map(([u, n]) => `${fmtQty(n)} ${u}`)
        .join(' · ');
      const sortKey = Object.values(units).reduce((a, b) => a + b, 0);
      return { html: `<div class="hv-plant-row"><span>${icon} ${escapeHTML(name)}</span><span class="hv-plant-qty">${qty}</span></div>`, sortKey };
    })
    .sort((a, b) => b.sortKey - a.sortKey)
    .map((x) => x.html)
    .join('');

  return `
    <div class="hv-year-nav">
      <button class="icon-btn" id="hv-year-prev" aria-label="Année précédente">‹</button>
      <div class="hv-year">${selectedYear}</div>
      <button class="icon-btn" id="hv-year-next" aria-label="Année suivante">›</button>
    </div>
    ${chart}
    ${plantRows ? `<div class="sl-title mt-4">Détail par plante — ${selectedYear}</div>${plantRows}` : ''}
  `;
}

function recentHTML(): string {
  const recs = [...harvests()].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 12);
  if (!recs.length) return '';
  const rows = recs
    .map((h) => {
      const p = plantById(h.plantId);
      const name = p ? p.name : h.plantName || h.plantId;
      const icon = p ? p.icon : '🌿';
      return `<div class="hv-log-row">
        <span class="hv-log-main">${icon} <b>${escapeHTML(name)}</b> — ${fmtQty(h.quantity)} ${escapeHTML(h.unit)}</span>
        <span class="hv-log-date muted xsmall">${formatDate(h.date)}</span>
        <button class="btn ghost sm danger" data-hdel="${h.id}" aria-label="Supprimer">✕</button>
      </div>`;
    })
    .join('');
  return `<div class="sl-title mt-4">Dernières récoltes</div>${rows}`;
}

function render(prefillPlantId?: string): void {
  const body = el('harvest-modal-body');
  const plantOptions = CATALOG.map((p) => `<option value="${p.id}">${p.icon} ${p.name}</option>`).join('');

  body.innerHTML = `
    <div class="sl-section">
      <div class="sl-title">➕ Ajouter une récolte</div>
      <div class="field mb-2">
        <label>Plante</label>
        <select class="select" id="hv-plant">${plantOptions}</select>
      </div>
      <div class="grid grid-2">
        <div class="field"><label>Quantité</label><input class="input" type="number" id="hv-qty" min="0" step="0.1" inputmode="decimal" placeholder="0"></div>
        <div class="field"><label>Unité</label><select class="select" id="hv-unit">${UNITS.map((u) => `<option value="${u}">${u}</option>`).join('')}</select></div>
      </div>
      <div class="field mt-2"><label>Date</label><input class="input" type="date" id="hv-date" value="${iso(new Date())}"></div>
      <button class="btn primary mt-3" id="hv-add" style="width:100%">Enregistrer la récolte</button>
    </div>

    <div class="sl-section">
      <div class="sl-title">📊 Comparatif par mois / année</div>
      <div id="hv-comparator">${comparatorHTML()}</div>
    </div>

    <div id="hv-recent">${recentHTML()}</div>
  `;

  if (prefillPlantId && CATALOG.some((p) => p.id === prefillPlantId)) {
    el<HTMLSelectElement>('hv-plant').value = prefillPlantId;
    setTimeout(() => el<HTMLInputElement>('hv-qty').focus(), 60);
  }

  wireBody(body);
}

function wireBody(body: HTMLElement): void {
  el('hv-add').addEventListener('click', addHarvest);

  qs<HTMLElement>('#hv-year-prev', body)?.addEventListener('click', () => {
    selectedYear--;
    refreshComparator();
  });
  qs<HTMLElement>('#hv-year-next', body)?.addEventListener('click', () => {
    selectedYear++;
    refreshComparator();
  });

  qsa<HTMLElement>('[data-hdel]', body).forEach((btn) =>
    btn.addEventListener('click', () => {
      const id = btn.dataset.hdel!;
      state.harvests = harvests().filter((h) => h.id !== id);
      save();
      render();
    })
  );
}

/** Met à jour uniquement le comparatif (changement d'année) sans refaire le formulaire. */
function refreshComparator(): void {
  const wrap = el('hv-comparator');
  wrap.innerHTML = comparatorHTML();
  qs<HTMLElement>('#hv-year-prev', wrap)?.addEventListener('click', () => {
    selectedYear--;
    refreshComparator();
  });
  qs<HTMLElement>('#hv-year-next', wrap)?.addEventListener('click', () => {
    selectedYear++;
    refreshComparator();
  });
}

function addHarvest(): void {
  const plantId = el<HTMLSelectElement>('hv-plant').value;
  const qty = parseFloat(el<HTMLInputElement>('hv-qty').value.replace(',', '.'));
  const unit = el<HTMLSelectElement>('hv-unit').value as HarvestUnit;
  const date = el<HTMLInputElement>('hv-date').value || iso(new Date());

  if (!qty || qty <= 0) {
    flash('Indiquez une quantité');
    return;
  }
  const p = plantById(plantId);
  harvests().push({
    id: uid('h'),
    date,
    plantId,
    plantName: p ? p.name : plantId,
    quantity: qty,
    unit,
  });
  // La récolte saisie devient l'année affichée dans le comparatif.
  selectedYear = parseISO(date).getFullYear();
  save();
  awardXP('harvest_done');
  checkMilestones();
  flash(`Récolte enregistrée : ${fmtQty(qty)} ${unit} ✓`);
  render();
}

export function openHarvests(prefillPlantId?: string): void {
  selectedYear = new Date().getFullYear();
  render(prefillPlantId);
  openModal('harvest-modal-backdrop');
}

/** Wire harvest modal close. Call once at boot. */
export function initHarvests(): void {
  el('harvest-modal-close').addEventListener('click', () => closeModal('harvest-modal-backdrop'));
}
