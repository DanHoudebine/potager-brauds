// ============================================================
//  Router — bascule de vue + badges de navigation
// ============================================================
import { state } from '../state';
import { qsa } from './dom';
import { closePanel } from '../features/plantPanel';
import { renderDashboard } from '../views/dashboard';
import { renderGarden } from '../views/garden';
import { renderCatalog } from '../views/catalog';
import { renderGuide } from '../views/guide';
import { renderCalendar } from '../views/calendar';
import { renderJournal } from '../views/journal';
import { renderReminders } from '../views/reminders';

const RENDERERS: Record<string, () => void> = {
  dashboard: renderDashboard,
  garden: renderGarden,
  catalog: renderCatalog,
  guide: renderGuide,
  calendar: renderCalendar,
  journal: renderJournal,
  reminders: renderReminders,
};

export function setView(name: string): void {
  closePanel();
  qsa<HTMLElement>('.view').forEach((v) => v.classList.toggle('active', v.dataset.view === name));
  qsa<HTMLElement>('[data-nav]').forEach((b) => b.classList.toggle('active', b.dataset.nav === name));
  RENDERERS[name]?.();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function updateNavBadges(): void {
  const urgentCount = state.beds.flatMap((b) => (b.cells || []).filter((c) => c && c.status === 'urgent')).length;
  const wrap = document.querySelector('[data-nav="garden"] .nav-badge-wrap');
  if (!wrap) return;
  let badge = wrap.querySelector('.nav-badge');
  if (urgentCount > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'nav-badge';
      wrap.appendChild(badge);
    }
    badge.textContent = String(urgentCount);
  } else if (badge) {
    badge.remove();
  }
}
