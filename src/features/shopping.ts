// ============================================================
//  Liste de courses — suggestions saisonnières + checklist
// ============================================================
import { state, save } from '../state';
import { el, qsa, openModal, closeModal } from '../ui/dom';
import { escapeHTML } from '../utils';
import { CATALOG } from '../data/catalog';

const MONTH_NAMES = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];

export function openShoppingList(): void {
  render();
  openModal('shopping-modal-backdrop');
}

function render(): void {
  const body = el('shopping-modal-body');
  const shopping = (state.shopping = state.shopping || []);

  const m = new Date().getMonth();
  const cur = MONTH_NAMES[m];
  const next = MONTH_NAMES[(m + 1) % 12];
  const suggestions = CATALOG.filter((p) => {
    if (!p.sow || p.sow === '—') return false;
    const sow = p.sow.toLowerCase();
    return sow.includes(cur) || sow.includes(next);
  }).map((p) => `${p.icon} ${p.name} (semis : ${p.sow})`);

  body.innerHTML = `
    <div class="sl-section">
      <div class="sl-title">💡 À semer ce mois-ci</div>
      ${suggestions.length ? suggestions.map((s) => `<div class="sl-suggest">${escapeHTML(s)}</div>`).join('') : '<div class="muted small">Aucune suggestion pour le moment.</div>'}
    </div>
    <div class="sl-section">
      <div class="sl-title">Ma liste personnelle</div>
      <div id="sl-items">${
        shopping
          .map(
            (item, i) => `
        <div class="sl-item ${item.done ? 'sl-done' : ''}">
          <label class="sl-check"><input type="checkbox" data-si="${i}" ${item.done ? 'checked' : ''}/><span>${escapeHTML(item.text)}</span></label>
          <button class="btn ghost sm danger" data-sdel="${i}">✕</button>
        </div>`
          )
          .join('') || '<div class="muted small">Aucun article.</div>'
      }</div>
      <div class="row gap-2 mt-3">
        <input class="input" id="sl-input" placeholder="Ajouter un article…" style="flex:1">
        <button class="btn primary" id="sl-add">Ajouter</button>
      </div>
    </div>`;

  qsa<HTMLInputElement>('[data-si]', body).forEach((cb) =>
    cb.addEventListener('change', () => {
      const i = Number(cb.dataset.si);
      if (state.shopping[i]) {
        state.shopping[i].done = cb.checked;
        save();
        render();
      }
    })
  );
  qsa<HTMLElement>('[data-sdel]', body).forEach((btn) =>
    btn.addEventListener('click', () => {
      state.shopping.splice(Number(btn.dataset.sdel), 1);
      save();
      render();
    })
  );
  const add = () => {
    const input = el<HTMLInputElement>('sl-input');
    const v = input.value.trim();
    if (!v) return;
    state.shopping.push({ text: v, done: false });
    save();
    render();
  };
  el('sl-add').addEventListener('click', add);
  el<HTMLInputElement>('sl-input').addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') add();
  });
}

/** Wire shopping list close. Call once at boot. */
export function initShopping(): void {
  el('shopping-modal-close').addEventListener('click', () => closeModal('shopping-modal-backdrop'));
}
