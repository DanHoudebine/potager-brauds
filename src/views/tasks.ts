// ============================================================
//  Tâches — rendu & cases à cocher (partagé dashboard/calendrier/panel)
// ============================================================
import type { Task, TaskKind } from '../types';
import { state, save } from '../state';
import { el, elOpt, qsa } from '../ui/dom';
import { escapeHTML, iso } from '../utils';
import { plantById } from '../data/catalog';
import { awardXP, checkMilestones } from '../features/xp';
import { setView } from '../ui/router';

const KIND_ICONS: Record<TaskKind, string> = { water: '💧', harvest: '🥕', treat: '🛡️', sow: '🌱', other: '📌' };
const KIND_LABELS: Record<TaskKind, string> = { water: 'Arrosage', harvest: 'Récolte', treat: 'Traitement', sow: 'Semis', other: 'Note' };

export function taskHTML(t: Task): string {
  const p = t.plantId ? plantById(t.plantId) : undefined;
  return `<div class="task ${t.done ? 'done' : ''}" data-task="${t.id}">
    <div class="t-kind ${t.kind}">${KIND_ICONS[t.kind] || '📌'}</div>
    <div class="t-body">
      <div class="t-text">${escapeHTML(t.title)}</div>
      <div class="t-meta"><span>${KIND_LABELS[t.kind] || ''}</span>${p ? `<span>•</span><span>${p.icon} ${p.name}</span>` : ''}</div>
    </div>
    <div class="checkbox" role="checkbox" tabindex="0" aria-checked="${t.done}"></div>
  </div>`;
}

export function bindTaskCheckboxes(scope: ParentNode): void {
  qsa<HTMLElement>('.task', scope).forEach((node) => {
    const cb = node.querySelector('.checkbox');
    if (!cb) return;
    const toggle = () => {
      const id = node.dataset.task;
      const t = state.tasks.find((x) => x.id === id);
      if (!t) return;
      t.done = !t.done;
      if (t.done) {
        awardXP('task_done');
        if (t.kind === 'harvest') awardXP('harvest_done');
        checkMilestones();
      }
      save();
      node.classList.toggle('done', t.done);
      cb.setAttribute('aria-checked', String(t.done));
      const todayStr = iso(new Date());
      const todayTasks = state.tasks.filter((x) => x.date === todayStr);
      const doneCount = todayTasks.filter((x) => x.done).length;
      const meta = elOpt('tasks-meta');
      if (meta) meta.textContent = `${doneCount} sur ${todayTasks.length} terminées`;
    };
    cb.addEventListener('click', toggle);
    cb.addEventListener('keydown', (e) => {
      const ke = e as KeyboardEvent;
      if (ke.key === ' ' || ke.key === 'Enter') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

export function renderTasks(tasks: Task[]): void {
  const node = el('tasks-list');
  const done = tasks.filter((t) => t.done).length;
  el('tasks-meta').textContent = `${done} sur ${tasks.length} terminées`;
  if (!tasks.length) {
    node.innerHTML = `<div class="empty"><div class="ei">🌼</div><h3>Aucune tâche aujourd'hui</h3><p>Profitez du jardin, ou parcourez le catalogue.</p><button class="btn primary" id="tasks-open-catalog">Ouvrir le catalogue</button></div>`;
    el('tasks-open-catalog').addEventListener('click', () => setView('catalog'));
    return;
  }
  node.innerHTML = tasks.map(taskHTML).join('');
  bindTaskCheckboxes(node);
}
