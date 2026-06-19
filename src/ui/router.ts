// ============================================================
//  Router — bascule de vue + badges de navigation
// ============================================================
import { state } from '../state';
import { qs, qsa } from './dom';
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

// Pile d'historique pour le bouton retour Android.
const history: string[] = ['dashboard'];

export function setView(name: string, opts: { fromBack?: boolean } = {}): void {
  closePanel();
  qsa<HTMLElement>('.view').forEach((v) => v.classList.toggle('active', v.dataset.view === name));
  qsa<HTMLElement>('[data-nav]').forEach((b) => b.classList.toggle('active', b.dataset.nav === name));
  RENDERERS[name]?.();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!opts.fromBack && history[history.length - 1] !== name) {
    history.push(name);
    if (history.length > 20) history.shift();
  }
}

/** Vrai s'il existe une vue précédente où revenir. */
export function canGoBack(): boolean {
  return history.length > 1;
}

/** Revient à la vue précédente. Renvoie false si on est déjà à la racine. */
export function goBack(): boolean {
  if (history.length <= 1) return false;
  history.pop();
  setView(history[history.length - 1], { fromBack: true });
  return true;
}

/** Relance le renderer de la vue active sans déclencher d'animation ni changer
 *  l'historique de navigation. À utiliser pour rafraîchir après une action
 *  (ajout de plante, sauvegarde…) sans le flash de fadeIn. */
export function refreshView(): void {
  const active = qs<HTMLElement>('.view.active');
  if (active?.dataset.view) RENDERERS[active.dataset.view]?.();
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
