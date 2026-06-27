// ============================================================
//  Potager de Poche — point d'entrée
// ============================================================
import './style.css';

import { state, activeBed } from './state';
import { el, qsa, closeModal, initConfirm } from './ui/dom';
import { setView, refreshView } from './ui/router';
import { syncGardenTasks } from './garden-sync';
import { applyTheme } from './theme';
import { applyAmbient } from './services/audio';
import { initNotificationScheduler } from './services/notifications';
import { initAuth, onEnterApp, onFirebaseSyncDone } from './services/auth';
import { initNative, hideSplash, haptic } from './services/native';

import { renderDashboard } from './views/dashboard';
import { renderGarden, addBed, openBedModal, deleteBed } from './views/garden';
import { handleCatalogSearch } from './views/catalog';
import { initCalendar } from './views/calendar';
import { initJournal } from './views/journal';
import { initReminders } from './views/reminders';

import { closePanel } from './features/plantPanel';
import { openQuickAdd, initQuickAdd } from './features/quickAdd';
import { initAccount } from './features/account';
import { initSymptomFinder } from './features/symptomFinder';
import { initShopping } from './features/shopping';
import { initHarvests } from './features/harvests';
import { initTutorial } from './features/tutorial';
import { initSurvey, maybeStartSurvey } from './features/survey';
import { initShare } from './features/share';
import { initPaywall } from './features/paywall';
import { save } from './state';

const PROTECTED_MODALS = ['survey-backdrop', 'auth-backdrop'];

let wired = false;

function wireAll(): void {
  // Navigation (sidebar, bottom-nav, topbar shortcuts with data-nav)
  qsa<HTMLElement>('[data-nav]').forEach((b) =>
    b.addEventListener('click', () => {
      haptic('light');
      setView(b.dataset.nav!);
    })
  );
  el('topbar-search').addEventListener('click', () => setView('catalog'));

  // Plant detail panel
  el('panel-close').addEventListener('click', closePanel);
  el('panel-backdrop').addEventListener('click', closePanel);
  let panelTY = 0;
  const panel = el('plant-panel');
  panel.addEventListener('touchstart', (e) => { panelTY = (e as TouchEvent).touches[0].clientY; }, { passive: true });
  panel.addEventListener('touchend', (e) => {
    if ((e as TouchEvent).changedTouches[0].clientY - panelTY > 80) closePanel();
  }, { passive: true });

  // FAB
  el('fab').addEventListener('click', () => {
    haptic('medium');
    openQuickAdd('task');
  });

  // Garden controls
  qsa<HTMLElement>('.gtab').forEach((b) =>
    b.addEventListener('click', () => {
      state.gardenTab = b.dataset.gt as typeof state.gardenTab;
      save();
      renderGarden();
    })
  );
  el('rename-bed').addEventListener('click', () => {
    const bed = activeBed();
    if (bed) openBedModal(bed.id);
  });
  el('delete-bed').addEventListener('click', deleteBed);
  el('add-bed-btn').addEventListener('click', addBed);
  el('empty-add-bed-btn').addEventListener('click', addBed);
  el('bed-modal-close').addEventListener('click', () => closeModal('bed-modal-backdrop'));
  el('bed-modal-cancel').addEventListener('click', () => closeModal('bed-modal-backdrop'));
  el('addbed-close').addEventListener('click', () => closeModal('addbed-backdrop'));

  // Catalog search
  el<HTMLInputElement>('catalog-search').addEventListener('input', (e) => handleCatalogSearch((e.target as HTMLInputElement).value));

  // Feature modules
  initConfirm();
  initQuickAdd();
  initJournal();
  initReminders();
  initCalendar();
  initAccount();
  initSymptomFinder();
  initShopping();
  initHarvests();
  initTutorial();
  initSurvey();
  initShare();
  initPaywall();

  // Click-outside to close (except mandatory modals)
  qsa<HTMLElement>('.modal-backdrop').forEach((bd) =>
    bd.addEventListener('click', (e) => {
      if (e.target === bd && !PROTECTED_MODALS.includes(bd.id)) {
        bd.classList.remove('open');
        document.body.style.overflow = '';
      }
    })
  );

  // ESC closes modals + panel
  document.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Escape') {
      qsa<HTMLElement>('.modal-backdrop.open').forEach((m) => {
        if (!PROTECTED_MODALS.includes(m.id)) {
          m.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
      closePanel();
    }
  });
}

function boot(): void {
  if (!wired) {
    wireAll();
    wired = true;
  }
  syncGardenTasks();
  renderDashboard();
  renderGarden();
  initNotificationScheduler();
  applyTheme();
  if (state.prefs?.ambientOn) applyAmbient();
  maybeStartSurvey();
  // L'app est prête : on retire l'écran de démarrage natif.
  void hideSplash();
}

// ---- Bootstrap ----------------------------------------------
initNative();
onEnterApp(boot);
// Après synchro Firebase initiale : rafraîchit la vue courante sans recharger la page.
onFirebaseSyncDone(() => { syncGardenTasks(); refreshView(); });
initAuth();

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// Apply theme immediately to avoid a flash before login resolves.
applyTheme();
