// ============================================================
//  Région — score de compatibilité + sélecteur
// ============================================================
import { state, save } from '../state';
import { REGIONS, REGION_DATA } from '../data/regions';
import { el, elOpt, qsa, openModal, closeModal, flash } from '../ui/dom';
import { escapeHTML } from '../utils';
import { setView } from '../ui/router';

export function regionScore(plantId: string): number | null {
  const rid = state.profile?.region;
  if (!rid) return null;
  return REGION_DATA[plantId]?.[rid] ?? null;
}

function scoreClass(s: number): string {
  return s >= 85 ? 'excellent' : s >= 70 ? 'good' : s >= 55 ? 'medium' : 'hard';
}
function scoreLabel(s: number): string {
  return s >= 85 ? 'Excellent' : s >= 70 ? 'Bon' : s >= 55 ? 'Moyen' : 'Difficile';
}

export function regionScoreHTML(score: number): string {
  return `<div class="region-score region-${scoreClass(score)}">
    <div class="rs-head"><span class="rs-label">${scoreLabel(score)} dans votre région</span><span class="rs-pct">${score}%</span></div>
    <div class="rs-bar"><div class="rs-fill" style="width:${score}%"></div></div>
  </div>`;
}

export function renderRegionPrompt(): void {
  const node = elOpt('region-catalog-prompt');
  if (!node) return;
  const r = state.profile?.region ? REGIONS.find((x) => x.id === state.profile.region) : null;
  if (!r) {
    node.innerHTML = `<div class="region-prompt-banner">
      <span class="rpb-icon">📍</span>
      <div class="rpb-body">
        <div class="rpb-title">Configurez votre région</div>
        <div class="rpb-sub">Affichez le taux de réussite de chaque plante pour votre climat.</div>
      </div>
      <button class="btn primary sm" id="rpb-set">Configurer →</button>
    </div>`;
    el('rpb-set').onclick = openRegionModal;
  } else {
    node.innerHTML = `<div class="region-prompt-banner region-prompt-set">
      <span class="rpb-icon">${r.emoji}</span>
      <div class="rpb-body">
        <div class="rpb-title">${escapeHTML(r.label)}</div>
        <div class="rpb-sub">Les taux de réussite sont affichés pour votre région.</div>
      </div>
      <button class="btn ghost sm" id="rpb-change">Changer</button>
    </div>`;
    el('rpb-change').onclick = openRegionModal;
  }
}

export function openRegionModal(): void {
  const choices = el('region-modal-choices');
  const cur = state.profile?.region;
  choices.innerHTML = REGIONS.map(
    (r) => `
    <button class="sv-choice region-choice ${cur === r.id ? 'active' : ''}" data-rid="${r.id}">
      <div class="sv-ci">${r.emoji}</div>
      <div class="sv-cd">
        <div class="sv-ct">${escapeHTML(r.label)}</div>
        <div class="sv-cs">${escapeHTML(r.desc)}</div>
      </div>
      ${cur === r.id ? '<div class="sv-arrow" style="color:var(--green)">✓</div>' : '<div class="sv-arrow">›</div>'}
    </button>`
  ).join('');
  qsa<HTMLElement>('[data-rid]', choices).forEach((btn) => {
    btn.addEventListener('click', () => {
      const rid = btn.dataset.rid as typeof state.profile.region;
      state.profile.region = rid;
      save();
      closeModal('region-modal-backdrop');
      closeModal('acc-backdrop');
      flash(`Région mise à jour : ${REGIONS.find((r) => r.id === rid)?.label} ✓`);
      const active = document.querySelector<HTMLElement>('.view.active');
      if (active?.dataset.view) setView(active.dataset.view);
    });
  });
  openModal('region-modal-backdrop');
}
