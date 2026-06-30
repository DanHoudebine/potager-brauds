// ============================================================
//  Mon jardin — parcelles, grille, drag & drop
// ============================================================
import { state, save, activeBed } from '../state';
import { el, elOpt, qsa, openModal, closeModal, confirmDialog, flash } from '../ui/dom';
import { escapeHTML, clampInt, statusColor, daysBetween, parseISO, uid } from '../utils';
import type { Bed } from '../types';
import { plantById } from '../data/catalog';
import { updateNavBadges } from '../ui/router';
import { openPlantPanel } from '../features/plantPanel';
import { openQuickAdd } from '../features/quickAdd';
import { syncGardenTasks } from '../garden-sync';
import { getRotationForBed } from '../data/rotation';
import { findBadPairs } from '../data/companions';
import { canAddBed, canUseGridSize, FREE_MAX_CELLS, isPro } from '../services/entitlement';
import { openPaywall } from '../features/paywall';

const TITLE_MAP: Record<string, string> = { all: 'Le potager', jardin: 'Jardin (plein air)', serre: 'Serre (sous abri)' };


function renderRotationHint(bed: Bed): void {
  const node = elOpt('rotation-hint');
  if (!node) return;
  const families = (bed.cells || []).filter(Boolean).map((c) => {
    const p = plantById(c!.plant);
    return p?.family ?? '';
  }).filter(Boolean);
  const result = getRotationForBed(families);
  if (!result) { node.innerHTML = ''; return; }
  node.innerHTML = `
    <div class="rotation-card">
      <div class="rot-label">🔄 Rotation conseillée</div>
      <div class="rot-main">${escapeHTML(result.mainFamily)}</div>
      <div class="rot-reason xsmall muted">${escapeHTML(result.advice.reason)}</div>
      <div class="rot-next">
        Saison prochaine :
        ${result.advice.nextFamilies.map((f) => `<span class="chip green">${escapeHTML(f)}</span>`).join(' ')}
      </div>
      ${result.advice.avoidFamilies.length ? `<div class="rot-avoid xsmall muted">Éviter : ${result.advice.avoidFamilies.map((f) => escapeHTML(f)).join(', ')}</div>` : ''}
    </div>`;
}

// Compagnonnage en direct (Pro) : alerte sur les mauvais voisins d'une parcelle.
function renderCompanionHint(bed: Bed): void {
  const node = elOpt('companion-hint');
  if (!node) return;
  const ids = (bed.cells || []).filter(Boolean).map((c) => c!.plant);

  if (!isPro()) {
    // Aperçu Pro contextuel (seulement quand il y a de quoi comparer).
    if (ids.length >= 2) {
      node.innerHTML = `<button class="btn sm" id="companion-pro-teaser" style="margin-top:8px">🤝 Compagnonnage en direct — 🌟 Pro</button>`;
      elOpt('companion-pro-teaser')?.addEventListener('click', () =>
        openPaywall('Le compagnonnage en direct (alertes de bons et mauvais voisins sur la grille) fait partie de Pro.')
      );
    } else {
      node.innerHTML = '';
    }
    return;
  }

  const bad = findBadPairs(ids);
  if (bad.length) {
    node.innerHTML = `
      <div style="background:var(--urgent-tint);border:1px solid var(--urgent);border-radius:12px;padding:8px 10px;margin-top:8px;font-size:12px">
        <div style="font-weight:800;color:var(--urgent);margin-bottom:2px">🤝 Voisinage à revoir</div>
        ${bad.map(([a, b]) => {
          const pa = plantById(a); const pb = plantById(b);
          return `<div>⚠️ ${pa ? pa.icon : ''} ${escapeHTML(pa?.name || a)} déconseillé près de ${pb ? pb.icon : ''} ${escapeHTML(pb?.name || b)}</div>`;
        }).join('')}
      </div>`;
  } else if (ids.length >= 2) {
    node.innerHTML = `<div style="background:var(--green-tint);border-radius:12px;padding:6px 10px;margin-top:8px;font-size:12px;color:var(--green-dark);font-weight:700">🤝 Bon voisinage ✓</div>`;
  } else {
    node.innerHTML = '';
  }
}

export function renderGarden(): void {
  const gt = state.gardenTab || 'all';
  qsa<HTMLElement>('.gtab').forEach((b) => b.classList.toggle('active', b.dataset.gt === gt));
  const titleEl = elOpt('garden-title');
  if (titleEl) titleEl.textContent = TITLE_MAP[gt] || 'Le potager';

  const beds = gt === 'all' ? state.beds : state.beds.filter((b) => (b.type || 'jardin') === gt);
  if (beds.length && !beds.find((b) => b.id === state.activeBedId)) {
    state.activeBedId = beds[0].id;
  }

  const bar = el('beds-toolbar');
  const bedIcon = (t: string) => (t === 'serre' ? '🏡' : '🌿');
  bar.innerHTML = beds
    .map(
      (b) => `<button class="bed-tab ${b.id === state.activeBedId ? 'active' : ''}" data-bed="${b.id}">${bedIcon(b.type)} ${escapeHTML(b.name)}<span class="x">${(b.cells || []).filter(Boolean).length}/${(b.cols || 4) * (b.rows || 3)}</span></button>`
    )
    .join('');
  qsa<HTMLElement>('[data-bed]', bar).forEach((b) =>
    b.addEventListener('click', () => {
      state.activeBedId = b.dataset.bed!;
      save();
      renderGarden();
    })
  );

  updateNavBadges();

  const stage = el('bed-stage');
  const emptyEl = el('garden-empty');
  const bed = beds.find((b) => b.id === state.activeBedId) || beds[0];
  if (!bed) {
    stage.style.display = 'none';
    emptyEl.style.display = '';
    return;
  }
  stage.style.display = '';
  emptyEl.style.display = 'none';

  el('bed-name').textContent = bed.name;
  const planted = (bed.cells || []).filter(Boolean).length;
  const total = (bed.cols || 4) * (bed.rows || 3);
  el('bed-sub').textContent = `${bed.cols} × ${bed.rows} • ${planted} plantée${planted > 1 ? 's' : ''} • ${total - planted} libre${total - planted > 1 ? 's' : ''}`;
  renderRotationHint(bed);
  renderCompanionHint(bed);

  const grid = el('bed-grid');
  grid.style.setProperty('--cols', String(bed.cols || 4));
  while ((bed.cells || []).length < total) bed.cells.push(null);
  bed.cells.length = total;

  grid.innerHTML = bed.cells
    .map((c, i) => {
      if (c) {
        const p = plantById(c.plant);
        const age = daysBetween(parseISO(c.planted), new Date());
        const hbadge = c.status === 'urgent' ? '🚨' : c.status === 'warn' ? '⚠️' : '🌿';
        return `<div class="cell has-plant" draggable="true" data-idx="${i}" data-cell="${c.id}">
        <span class="cell-status-bar" style="background:${statusColor(c.status)}"></span>
        <div class="cell-emoji">${p ? p.icon : '❓'}</div>
        <div class="cell-name">${p ? escapeHTML(p.name) : '?'}</div>
        <div class="cell-footer">
          <span class="cell-days">${age}j</span>
          <span class="cell-hbadge">${hbadge}</span>
        </div>
      </div>`;
      }
      return `<div class="cell" data-idx="${i}"><div class="cell-empty-inner"><span class="cell-plus">+</span><span class="cell-plus-label">Planter</span></div></div>`;
    })
    .join('');

  qsa<HTMLElement>('.cell', grid).forEach((node) => {
    const idx = Number(node.dataset.idx);
    node.addEventListener('click', () => {
      if (node.classList.contains('has-plant')) {
        openPlantPanel(idx);
      } else {
        openQuickAdd('plant', { bedId: bed.id, index: idx });
      }
    });
  });

  // Drag-and-drop
  let dragSrc: number | null = null;
  qsa<HTMLElement>('.cell', grid).forEach((node) => {
    node.addEventListener('dragstart', (e) => {
      if (!node.classList.contains('has-plant')) {
        e.preventDefault();
        return;
      }
      dragSrc = Number(node.dataset.idx);
      node.classList.add('dragging');
      const dt = (e as DragEvent).dataTransfer;
      if (dt) {
        dt.effectAllowed = 'move';
        try {
          dt.setData('text/plain', String(dragSrc));
        } catch {
          /* ignore */
        }
      }
    });
    node.addEventListener('dragend', () => qsa('.cell', grid).forEach((n) => n.classList.remove('dragging', 'drag-over')));
    node.addEventListener('dragover', (e) => {
      e.preventDefault();
      node.classList.add('drag-over');
    });
    node.addEventListener('dragleave', () => node.classList.remove('drag-over'));
    node.addEventListener('drop', (e) => {
      e.preventDefault();
      const from = dragSrc;
      const to = Number(node.dataset.idx);
      if (from === null || from === to) return;
      const tmp = bed.cells[from];
      bed.cells[from] = bed.cells[to];
      bed.cells[to] = tmp;
      save();
      renderGarden();
    });
  });
}

export function addBed(): void {
  // Version gratuite : une seule parcelle. Au-delà → paywall (jamais de blocage
  // destructif, on n'ouvre simplement pas l'éditeur de nouvelle parcelle).
  if (!canAddBed(state.beds.length)) {
    openPaywall('La version gratuite comprend une parcelle. Passez à Pro pour créer autant de jardins et de serres que vous voulez.');
    return;
  }
  openBedModal();
}

export function openBedModal(bedId?: string): void {
  const bed = bedId ? state.beds.find((b) => b.id === bedId) : null;
  const pro = isPro();
  el('bed-modal-title').textContent = bed ? 'Modifier la parcelle' : 'Nouvelle parcelle';
  el<HTMLInputElement>('bed-modal-name').value = bed ? bed.name : '';
  // Nouvelle parcelle : par défaut 2 × 5 (10 cases) en gratuit pour rester dans
  // la limite et éviter de déclencher le paywall à la création ; 4 × 3 en Pro.
  el<HTMLInputElement>('bed-modal-cols').value = String(bed ? bed.cols : pro ? 4 : 2);
  el<HTMLInputElement>('bed-modal-rows').value = String(bed ? bed.rows : pro ? 3 : 5);
  el<HTMLSelectElement>('bed-modal-type').value = bed ? bed.type || 'jardin' : state.gardenTab !== 'all' ? state.gardenTab : 'jardin';
  const hint = elOpt('bed-modal-size-hint');
  if (hint) {
    hint.textContent = pro
      ? 'Une parcelle peut contenir jusqu\'à 10 × 10 = 100 emplacements.'
      : `Version gratuite : 1 parcelle jusqu'à ${FREE_MAX_CELLS} cases (ex. 2 × 5). Passez à Pro pour des parcelles illimitées et plus grandes.`;
  }
  el('bed-modal-save').onclick = () => saveBedModal(bedId);
  openModal('bed-modal-backdrop');
}

function saveBedModal(editId?: string): void {
  const name = el<HTMLInputElement>('bed-modal-name').value.trim();
  if (!name) {
    flash('Donnez un nom à la parcelle');
    return;
  }
  const cols = clampInt(el<HTMLInputElement>('bed-modal-cols').value, 2, 10, 4);
  const rows = clampInt(el<HTMLInputElement>('bed-modal-rows').value, 2, 10, 3);
  const type = el<HTMLSelectElement>('bed-modal-type').value as 'jardin' | 'serre';
  // Version gratuite : grille limitée. On ne bloque qu'une AUGMENTATION au-delà
  // de la limite (jamais une parcelle déjà existante qu'on garde ou réduit, ni
  // aucune troncature : le blocage intervient AVANT toute mutation). La modale
  // reste ouverte pour réduire la taille ou passer à Pro.
  const existing = editId ? state.beds.find((b) => b.id === editId) : null;
  const existingCells = existing ? existing.cols * existing.rows : 0;
  if (!canUseGridSize(cols, rows) && cols * rows > existingCells) {
    openPaywall(`La version gratuite permet une parcelle jusqu'à ${FREE_MAX_CELLS} cases (par exemple 2 × 5). Passez à Pro pour des parcelles plus grandes.`);
    return;
  }
  if (editId) {
    const bed = state.beds.find((b) => b.id === editId);
    if (bed) {
      bed.name = name;
      bed.type = type;
      bed.cols = cols;
      bed.rows = rows;
      while (bed.cells.length < cols * rows) bed.cells.push(null);
      bed.cells.length = cols * rows;
    }
  } else {
    const newBed = { id: uid('b'), name, type, cols, rows, cells: Array(cols * rows).fill(null) };
    state.beds.push(newBed);
    state.activeBedId = newBed.id;
  }
  syncGardenTasks();
  closeModal('bed-modal-backdrop');
  renderGarden();
  flash(editId ? 'Parcelle modifiée ✓' : 'Parcelle créée ✓');
}

export function deleteBed(): void {
  const bed = activeBed();
  if (!bed) return;
  confirmDialog({
    title: `Supprimer « ${bed.name} » ?`,
    msg: `Les ${(bed.cells || []).filter(Boolean).length} plantes seront retirées. Action irréversible.`,
    yesLabel: 'Oui, supprimer',
    onYes: () => {
      state.beds = state.beds.filter((b) => b.id !== bed.id);
      state.activeBedId = state.beds[0] ? state.beds[0].id : null;
      syncGardenTasks();
      renderGarden();
    },
  });
}
