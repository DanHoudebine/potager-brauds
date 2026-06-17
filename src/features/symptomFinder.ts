// ============================================================
//  Identifier un problème — assistant symptômes
// ============================================================
import type { Symptom, Severity } from '../types';
import { el, qsa, openModal, closeModal } from '../ui/dom';
import { escapeHTML } from '../utils';
import { SYMPTOMS } from '../data/symptoms';

let step = 0;
let selected: Symptom | null = null;

const SEV_COLOR: Record<Severity, string> = { high: 'var(--urgent)', medium: 'var(--warn)', low: 'var(--green-dark)' };
const SEV_LABEL: Record<Severity, string> = { high: 'Urgent', medium: 'À surveiller', low: 'Peu grave' };

export function openSymptomFinder(): void {
  step = 0;
  selected = null;
  render();
  openModal('symptom-modal-backdrop');
}

function render(): void {
  const body = el('symptom-modal-body');
  if (step === 0) {
    body.innerHTML = `
      <p class="muted small mb-4">Quel est le principal symptôme observé sur votre plante ?</p>
      <div class="sf-grid">
        ${SYMPTOMS.map((s) => `<button class="sf-item" data-sid="${s.id}"><span class="sf-icon">${s.icon}</span><span class="sf-label">${escapeHTML(s.label)}</span></button>`).join('')}
      </div>`;
    qsa<HTMLElement>('[data-sid]', body).forEach((btn) =>
      btn.addEventListener('click', () => {
        selected = SYMPTOMS.find((s) => s.id === btn.dataset.sid) || null;
        step = 1;
        render();
      })
    );
  } else if (step === 1 && selected) {
    body.innerHTML = `
      <button class="btn ghost sm mb-3" id="sf-back">← Retour</button>
      <div class="sf-result-head">${selected.icon} ${escapeHTML(selected.label)}</div>
      <p class="muted small mb-4">${selected.causes.length} causes possibles :</p>
      ${selected.causes
        .map(
          (c) => `
        <div class="sf-cause">
          <div class="sf-cause-head">
            <b>${escapeHTML(c.name)}</b>
            <span class="sf-sev" style="color:${SEV_COLOR[c.sev]}">${SEV_LABEL[c.sev]}</span>
          </div>
          <div class="sf-signs">🔎 ${escapeHTML(c.signs)}</div>
          <div class="sf-treat">✅ ${escapeHTML(c.treat)}</div>
        </div>`
        )
        .join('')}`;
    el('sf-back').addEventListener('click', () => {
      step = 0;
      render();
    });
  }
}

/** Wire the symptom finder trigger + close. Call once at boot. */
export function initSymptomFinder(): void {
  el('symptom-btn').addEventListener('click', openSymptomFinder);
  el('symptom-modal-close').addEventListener('click', () => closeModal('symptom-modal-backdrop'));
}
