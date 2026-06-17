// ============================================================
//  Catalogue — filtres, cartes plantes, ajout au jardin
// ============================================================
import { state } from '../state';
import { el, elOpt, qsa, openModal, closeModal, flash } from '../ui/dom';
import { escapeHTML, categoryLabel, categoryColor, seasonLabel, uid, iso } from '../utils';
import { CATALOG, plantById } from '../data/catalog';
import { regionScore, regionScoreHTML, renderRegionPrompt } from '../features/region';
import { setView } from '../ui/router';
import { syncGardenTasks } from '../garden-sync';
import { awardXP, checkMilestones } from '../features/xp';

interface CatalogFilter {
  q: string;
  category: string;
  season: string;
  difficulty: string;
}

let filter: CatalogFilter = { q: '', category: 'all', season: 'all', difficulty: 'all' };

export function handleCatalogSearch(q: string): void {
  filter.q = q;
  renderCatalog();
}

const FILTER_GROUPS = [
  { label: 'Type', chips: [
    { k: 'category', v: 'all', label: 'Toutes catégories' },
    { k: 'category', v: 'legume', label: '🥕 Légumes' },
    { k: 'category', v: 'herbe', label: '🌿 Herbes' },
    { k: 'category', v: 'fruit', label: '🍓 Fruits' },
    { k: 'category', v: 'arbre-fruitier', label: '🌳 Fruitiers' },
  ] },
  { label: 'Saison', chips: [
    { k: 'season', v: 'all', label: 'Toutes saisons' },
    { k: 'season', v: 'spring', label: '🌷 Printemps' },
    { k: 'season', v: 'summer', label: '☀️ Été' },
    { k: 'season', v: 'autumn', label: '🍂 Automne' },
    { k: 'season', v: 'winter', label: '❄️ Hiver' },
  ] },
  { label: 'Niveau', chips: [
    { k: 'difficulty', v: 'all', label: 'Tous niveaux' },
    { k: 'difficulty', v: '1', label: '🟢 Facile' },
    { k: 'difficulty', v: '2', label: '🟡 Moyen' },
    { k: 'difficulty', v: '3', label: '🔴 Délicat' },
  ] },
] as const;

export function renderCatalog(): void {
  renderRegionPrompt();

  const f = el('catalog-filters');
  f.innerHTML = FILTER_GROUPS.map(
    (g) =>
      `<div class="filter-group"><span class="filter-group-label">${g.label}</span>${g.chips
        .map((x) => `<button class="filter-chip ${filter[x.k as keyof CatalogFilter] === x.v ? 'active' : ''}" data-k="${x.k}" data-v="${x.v}">${x.label}</button>`)
        .join('')}</div>`
  ).join('');
  qsa<HTMLElement>('.filter-chip', f).forEach((b) =>
    b.addEventListener('click', () => {
      (filter as unknown as Record<string, string>)[b.dataset.k!] = b.dataset.v!;
      renderCatalog();
    })
  );

  const q = filter.q.trim().toLowerCase();
  const list = CATALOG.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q) && !(p.family || '').toLowerCase().includes(q) && !(p.sci || '').toLowerCase().includes(q)) return false;
    if (filter.category !== 'all' && p.category !== filter.category) return false;
    if (filter.season !== 'all' && !p.season.includes(filter.season as never)) return false;
    if (filter.difficulty !== 'all' && p.difficulty !== Number(filter.difficulty)) return false;
    return true;
  });

  const grid = el('catalog-grid');
  if (!list.length) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="ei">🔍</div><h3>Aucune plante ne correspond</h3><p>Retirez un filtre ou essayez un autre mot-clé.</p><button class="btn primary" id="reset-catalog">Réinitialiser</button></div>`;
    el('reset-catalog').addEventListener('click', () => {
      filter = { q: '', category: 'all', season: 'all', difficulty: 'all' };
      const search = elOpt<HTMLInputElement>('catalog-search');
      if (search) search.value = '';
      renderCatalog();
    });
    return;
  }

  grid.innerHTML = list
    .map((p) => {
      const sc = regionScore(p.id);
      return `
    <article class="plant-card">
      <div class="pc-head">
        <div class="pc-icon">${p.icon}</div>
        <div>
          <h3>${escapeHTML(p.name)}</h3>
          <div class="pc-sub">${escapeHTML(p.family || '')} • <em>${escapeHTML(p.sci || '')}</em></div>
          <div class="row gap-2 mt-2">
            <span class="difficulty" aria-label="Difficulté ${p.difficulty} sur 3">
              ${[1, 2, 3].map((n) => `<span class="pip ${n <= p.difficulty ? 'on' : ''}"></span>`).join('')}
            </span>
            <span class="xsmall muted">${['Facile', 'Moyen', 'Délicat'][p.difficulty - 1]}</span>
          </div>
        </div>
      </div>
      <div class="pc-rows">
        <div class="r"><b>Semer</b> ${escapeHTML(p.sow || '—')}</div>
        <div class="r"><b>Planter</b> ${escapeHTML(p.plant || '—')}</div>
        <div class="r"><b>Récolter</b> ${escapeHTML(p.harvest || '—')}</div>
        <div class="r"><b>Espacement</b> ${escapeHTML(p.space || '—')}</div>
      </div>
      <div class="pc-tags">
        <span class="chip ${categoryColor(p.category)}">${categoryLabel(p.category)}</span>
        ${p.season.map((s) => `<span class="chip green">${seasonLabel(s)}</span>`).join('')}
        ${p.companions.length ? `<span class="chip earth">🤝 ${escapeHTML(p.companions.slice(0, 2).join(', '))}</span>` : ''}
      </div>
      ${sc !== null ? regionScoreHTML(sc) : ''}
      ${p.varieties.length ? `<div class="cat-varieties"><span class="cat-var-label">Variétés :</span>${p.varieties.map((v) => `<span class="cat-var-chip">${escapeHTML(v)}</span>`).join('')}</div>` : ''}
      <div class="pc-actions">
        <button class="btn primary" data-add="${p.id}">+ Ajouter à mon jardin</button>
      </div>
    </article>`;
    })
    .join('');

  qsa<HTMLElement>('[data-add]', grid).forEach((b) => b.addEventListener('click', () => openAddToBedPicker(b.dataset.add!)));
}

export function openAddToBedPicker(plantId: string): void {
  const p = plantById(plantId);
  el('addbed-msg').textContent = `Où voulez-vous planter ${p ? p.icon + ' ' + p.name : plantId} ?`;
  const wrap = el('addbed-grid');
  if (!state.beds.length) {
    wrap.innerHTML = `<div class="empty"><div class="ei">🪴</div><h3>Aucune parcelle</h3><p>Créez d'abord une parcelle dans Mon jardin.</p></div>`;
    openModal('addbed-backdrop');
    return;
  }
  wrap.innerHTML = state.beds
    .map((b) => {
      const cells = b.cells || [];
      const free = cells.filter((c) => !c).length;
      return `<div class="card mb-2" style="padding:12px;cursor:pointer${free === 0 ? ';opacity:.5;pointer-events:none' : ''}" data-bed="${b.id}">
      <div class="row between">
        <div><div style="font-weight:800">🌿 ${escapeHTML(b.name)}</div><div class="xsmall muted">${cells.filter(Boolean).length}/${(b.cols || 4) * (b.rows || 3)} plantées • ${free} libre${free > 1 ? 's' : ''}</div></div>
        ${free > 0 ? '<div class="btn primary sm">Planter ici →</div>' : '<div class="xsmall muted">Plein</div>'}
      </div>
    </div>`;
    })
    .join('');
  qsa<HTMLElement>('[data-bed]', wrap).forEach((node) => {
    node.addEventListener('click', () => {
      const bed = state.beds.find((b) => b.id === node.dataset.bed);
      if (!bed) return;
      const emptyIdx = (bed.cells || []).findIndex((c) => !c);
      if (emptyIdx === -1) {
        flash('Parcelle pleine.');
        return;
      }
      bed.cells[emptyIdx] = { id: uid('c'), plant: plantId, planted: iso(new Date()), status: 'healthy', notes: '' };
      syncGardenTasks();
      awardXP('plant_added');
      checkMilestones();
      closeModal('addbed-backdrop');
      flash(`${p ? p.name : plantId} ajoutée dans ${bed.name} ✓`);
      state.activeBedId = bed.id;
      setView('garden');
    });
  });
  openModal('addbed-backdrop');
}
