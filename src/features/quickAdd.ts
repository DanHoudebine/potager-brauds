// ============================================================
//  Ajout rapide — tâche / plante / note (avec brouillon auto)
// ============================================================
import { state, save } from '../state';
import { el, elOpt, qs, qsa, openModal, closeModal, flash } from '../ui/dom';
import { escapeHTML, iso, uid } from '../utils';
import { CATALOG, plantById } from '../data/catalog';
import { syncGardenTasks } from '../garden-sync';
import { awardXP, checkMilestones } from './xp';
import { refreshView } from '../ui/router';

let draftTimer: ReturnType<typeof setTimeout> | undefined;

/** Cellule visée quand on ouvre l'ajout depuis une case précise de la grille. */
let plantTarget: { bedId: string; index: number } | null = null;

type FieldEl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const draftField = (name: string) => qs<FieldEl>(`[data-draft="${name}"]`);

export function openQuickAdd(
  type: 'task' | 'plant' | 'note' = 'task',
  target?: { bedId: string; index: number }
): void {
  plantTarget = target ?? null;
  const draft = state.draft;
  if (draft) {
    el('qa-draft').style.display = 'inline-flex';
    Object.entries(draft.fields || {}).forEach(([k, v]) => {
      const node = draftField(k);
      if (node) node.value = v;
    });
    type = (draft.type as typeof type) || type;
  } else {
    el('qa-draft').style.display = 'none';
  }

  const taskDate = draftField('task-date');
  if (taskDate && !taskDate.value) taskDate.value = iso(new Date());
  const plantDate = draftField('plant-date');
  if (plantDate && !plantDate.value) plantDate.value = iso(new Date());

  el('qa-plant-select').innerHTML = CATALOG.map((p) => `<option value="${p.id}">${p.icon} ${p.name}</option>`).join('');
  el('qa-bed-select').innerHTML = state.beds.length
    ? state.beds.map((b) => `<option value="${b.id}">${escapeHTML(b.name)}</option>`).join('')
    : '<option value="">Aucune parcelle</option>';
  el('qa-note-subject').innerHTML =
    '<option value="">Général</option>' +
    state.beds
      .flatMap((b) =>
        (b.cells || []).filter(Boolean).map((c) => {
          const p = plantById(c!.plant);
          return `<option value="${b.name}: ${p ? p.name : c!.plant}">${p ? p.icon : ''} ${b.name}: ${p ? p.name : c!.plant}</option>`;
        })
      )
      .join('');

  // Ouvert depuis une case précise : on force l'onglet « plante » et on
  // pré-sélectionne la bonne parcelle pour que la plante atterrisse au bon endroit.
  if (plantTarget) {
    type = 'plant';
    el<HTMLSelectElement>('qa-bed-select').value = plantTarget.bedId;
  }

  setQAType(type);
  openModal('quickadd-backdrop');
}

function setQAType(type: string): void {
  qsa<HTMLElement>('[data-qa]').forEach((b) => b.classList.toggle('active', b.dataset.qa === type));
  qsa<HTMLElement>('[data-qa-form]').forEach((f) => (f.style.display = f.dataset.qaForm === type ? '' : 'none'));
}

function saveQuickAdd(): void {
  const activeTab = qs<HTMLElement>('[data-qa].active');
  if (!activeTab) return;
  const type = activeTab.dataset.qa;

  if (type === 'task') {
    const title = (draftField('task-title')?.value || '').trim();
    if (!title) {
      flash("Donnez d'abord un nom à la tâche");
      return;
    }
    const kind = (draftField('task-kind')?.value || 'other') as never;
    const date = draftField('task-date')?.value || iso(new Date());
    state.tasks.push({ id: uid('t'), title, kind, date, done: false, plantId: null });
    flash('Tâche ajoutée ✓');
  } else if (type === 'plant') {
    const plantId = draftField('plant-id')?.value || '';
    const bedId = draftField('plant-bed')?.value || '';
    const planted = draftField('plant-date')?.value || iso(new Date());
    const bed = state.beds.find((b) => b.id === bedId);
    if (!bed) {
      flash('Choisissez une parcelle');
      return;
    }
    // Si on a cliqué une case précise (et qu'elle est toujours libre), on plante
    // exactement là. Sinon on prend la première case libre de la parcelle.
    let targetIdx = -1;
    if (plantTarget && plantTarget.bedId === bedId && !bed.cells[plantTarget.index]) {
      targetIdx = plantTarget.index;
    } else {
      targetIdx = (bed.cells || []).findIndex((c) => !c);
    }
    if (targetIdx === -1) {
      flash('Parcelle pleine.');
      return;
    }
    bed.cells[targetIdx] = { id: uid('c'), plant: plantId, planted, status: 'healthy', notes: '' };
    syncGardenTasks();
    awardXP('plant_added');
    checkMilestones();
    flash(`${plantById(plantId)?.name || plantId} ajoutée ✓`);
  } else if (type === 'note') {
    const text = (draftField('note-text')?.value || '').trim();
    if (!text) {
      flash("Écrivez une note d'abord");
      return;
    }
    const tag = draftField('note-tag')?.value || '';
    const subject = draftField('note-subject')?.value || 'Général';
    state.journal.push({ id: uid('j'), date: iso(new Date()), subject, icon: '🌿', text, tags: tag ? [tag] : [] });
    awardXP('journal_entry');
    checkMilestones();
    flash('Note enregistrée ✓');
  }

  state.draft = null;
  plantTarget = null;
  save();
  clearDraftFields();
  closeModal('quickadd-backdrop');
  refreshView();
}

function clearDraftFields(): void {
  qsa<FieldEl>('[data-draft]').forEach((node) => {
    if (node.tagName !== 'SELECT' && (node as HTMLInputElement).type !== 'date') node.value = '';
  });
}

/** Wire the quick-add modal. Call once at boot. */
export function initQuickAdd(): void {
  el('qa-close').addEventListener('click', () => { plantTarget = null; closeModal('quickadd-backdrop'); });
  el('qa-cancel').addEventListener('click', () => { plantTarget = null; closeModal('quickadd-backdrop'); });
  el('qa-save').addEventListener('click', saveQuickAdd);
  qsa<HTMLElement>('[data-qa]').forEach((b) => b.addEventListener('click', () => setQAType(b.dataset.qa!)));
  el('qa-clear-draft').addEventListener('click', () => {
    state.draft = null;
    save();
    clearDraftFields();
    el('qa-draft').style.display = 'none';
    flash('Brouillon effacé');
  });

  qsa<FieldEl>('[data-draft]').forEach((node) =>
    node.addEventListener('input', () => {
      clearTimeout(draftTimer);
      draftTimer = setTimeout(() => {
        const activeTab = qs<HTMLElement>('[data-qa].active');
        if (!activeTab?.dataset.qa) return;
        const type = activeTab.dataset.qa;
        const fields: Record<string, string> = {};
        qsa<FieldEl>(`[data-qa-form="${type}"] [data-draft]`).forEach((n) => {
          fields[n.dataset.draft!] = n.value;
        });
        state.draft = { type, fields, ts: Date.now() };
        save();
        const pill = elOpt('qa-draft');
        if (pill) pill.style.display = 'inline-flex';
      }, 400);
    })
  );
}
