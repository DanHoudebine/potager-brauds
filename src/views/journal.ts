// ============================================================
//  Journal — notes du jardin (+ photos)
// ============================================================
import { state, save } from '../state';
import { el, qsa, confirmDialog, flash } from '../ui/dom';
import { formatDate, escapeHTML } from '../utils';
import { openQuickAdd } from '../features/quickAdd';

let journalFilter = 'all';

export function renderJournal(): void {
  qsa<HTMLElement>('#journal-filters .filter-chip').forEach((b) => b.classList.toggle('active', b.dataset.jf === journalFilter));
  const list = (state.journal || [])
    .filter((j) => journalFilter === 'all' || (j.tags || []).includes(journalFilter))
    .sort((a, b) => b.date.localeCompare(a.date));

  const node = el('journal-list');
  if (!list.length) {
    node.innerHTML = `<div class="empty"><div class="ei">📓</div><h3>Aucune note pour le moment</h3><p>Capturez observations et récoltes — votre futur vous remerciera.</p><button class="btn primary" id="empty-new-note">+ Écrire la première note</button></div>`;
    el('empty-new-note').addEventListener('click', () => openQuickAdd('note'));
    return;
  }

  node.innerHTML = list
    .map(
      (j) => `
    <article class="journal-entry" data-j="${j.id}">
      <div class="je-img" data-photo="${j.photo ? '1' : ''}">${j.photo ? '' : j.icon || '🌿'}</div>
      <div class="je-body">
        <div class="je-meta"><span style="font-weight:800;color:var(--ink)">${formatDate(j.date)}</span><span>•</span><span>${escapeHTML(j.subject || '')}</span></div>
        <div class="je-text">${escapeHTML(j.text || '')}</div>
        <div class="je-tags">
          ${(j.tags || []).map((t) => `<span class="tag ${t}">#${t}</span>`).join('')}
          <button class="btn ghost sm" data-add-photo="${j.id}">📷</button>
          <button class="btn ghost sm danger" data-del="${j.id}">Supprimer</button>
        </div>
      </div>
    </article>`
    )
    .join('');

  qsa<HTMLElement>('[data-photo="1"]', node).forEach((div) => {
    const jId = (div.closest('[data-j]') as HTMLElement).dataset.j;
    const j = (state.journal || []).find((x) => x.id === jId);
    if (j?.photo && j.photo.startsWith('data:image/')) {
      div.style.backgroundImage = `url('${j.photo}')`;
      div.style.backgroundSize = 'cover';
      div.style.backgroundPosition = 'center';
    }
  });

  qsa<HTMLElement>('[data-del]', node).forEach((b) =>
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = b.dataset.del;
      confirmDialog({
        title: 'Supprimer cette note ?',
        msg: 'Action irréversible.',
        yesLabel: 'Oui, supprimer',
        onYes: () => {
          state.journal = (state.journal || []).filter((j) => j.id !== id);
          save();
          renderJournal();
        },
      });
    })
  );

  qsa<HTMLElement>('[data-add-photo]', node).forEach((b) =>
    b.addEventListener('click', () => {
      const id = b.dataset.addPhoto;
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
          flash('Photo trop lourde — max 2 Mo');
          return;
        }
        const r = new FileReader();
        r.onload = () => {
          const dataUrl = String(r.result);
          if (!dataUrl.startsWith('data:image/')) {
            flash('Format non supporté');
            return;
          }
          const j = (state.journal || []).find((x) => x.id === id);
          if (j) {
            j.photo = dataUrl;
            save();
            renderJournal();
            flash('Photo ajoutée ✓');
          }
        };
        r.readAsDataURL(file);
      };
      input.click();
    })
  );
}

/** Wire journal toolbar. Call once at boot. */
export function initJournal(): void {
  el('new-note-btn').addEventListener('click', () => openQuickAdd('note'));
  qsa<HTMLElement>('#journal-filters .filter-chip').forEach((b) =>
    b.addEventListener('click', () => {
      journalFilter = b.dataset.jf!;
      renderJournal();
    })
  );
}
