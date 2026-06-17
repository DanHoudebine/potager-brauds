// ============================================================
//  Calendrier — vue mensuelle des tâches
// ============================================================
import type { Task } from '../types';
import { state } from '../state';
import { el, qsa, flash } from '../ui/dom';
import { iso, formatDate } from '../utils';
import { taskHTML, bindTaskCheckboxes } from './tasks';

let calMonth = new Date();
calMonth.setDate(1);
let calFilter = 'all';

const DOWS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export function renderCalendar(): void {
  el('cal-month').textContent = calMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  qsa<HTMLElement>('#cal-filters .filter-chip').forEach((b) => b.classList.toggle('active', b.dataset.cf === calFilter));

  const grid = el('cal-grid');
  const today = new Date();
  let html = DOWS.map((d) => `<div class="cal-dow">${d}</div>`).join('');
  const first = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0).getDate();

  for (let i = 0; i < startOffset; i++) html += `<div class="cal-day off"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const dd = new Date(calMonth.getFullYear(), calMonth.getMonth(), d);
    const dStr = iso(dd);
    const tasks = state.tasks.filter((t) => t.date === dStr && (calFilter === 'all' || t.kind === calFilter));
    const kinds = new Set(tasks.map((t) => t.kind));
    const dots = ['water', 'sow', 'harvest', 'treat']
      .filter((k) => kinds.has(k as never))
      .map((k) => `<span class="d-dot ${k}"></span>`)
      .join('');
    const isToday = dStr === iso(today);
    html += `<button class="cal-day ${isToday ? 'today' : ''}" data-d="${dStr}"><div>${d}</div><div class="dots">${dots}</div></button>`;
  }
  grid.innerHTML = html;

  qsa<HTMLElement>('[data-d]', grid).forEach((node) => {
    node.addEventListener('click', () => {
      const date = node.dataset.d!;
      const tasks = state.tasks.filter((t) => t.date === date && (calFilter === 'all' || t.kind === calFilter));
      if (!tasks.length) {
        flash(`Aucune tâche le ${formatDate(date)}`);
        return;
      }
      showDayTasks(date, tasks);
    });
  });
}

function showDayTasks(date: string, tasks: Task[]): void {
  el('pd-bed-name').textContent = formatDate(date);
  el('pd-status').className = 'dot healthy';
  el('panel-body').innerHTML = `<h2 class="mb-4">${tasks.length} tâche${tasks.length > 1 ? 's' : ''} ce jour-là</h2>${tasks.map(taskHTML).join('')}`;
  bindTaskCheckboxes(el('panel-body'));
  el('plant-panel').classList.add('open');
  el('panel-backdrop').classList.add('open');
}

/** Wire calendar navigation + swipe. Call once at boot. */
export function initCalendar(): void {
  el('cal-prev').addEventListener('click', () => {
    calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  el('cal-next').addEventListener('click', () => {
    calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1);
    renderCalendar();
  });
  el('cal-today').addEventListener('click', () => {
    calMonth = new Date();
    calMonth.setDate(1);
    renderCalendar();
  });
  qsa<HTMLElement>('#cal-filters .filter-chip').forEach((b) =>
    b.addEventListener('click', () => {
      calFilter = b.dataset.cf!;
      renderCalendar();
    })
  );

  let touchX: number | null = null;
  const grid = el('cal-grid');
  grid.addEventListener('touchstart', (e) => { touchX = (e as TouchEvent).touches[0].clientX; }, { passive: true });
  grid.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = (e as TouchEvent).changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 60) {
      calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + (dx < 0 ? 1 : -1), 1);
      renderCalendar();
    }
    touchX = null;
  }, { passive: true });
}
