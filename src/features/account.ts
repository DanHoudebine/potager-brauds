// ============================================================
//  Mon compte — préférences, export, reset, déconnexion
// ============================================================
import { state, clearStored } from '../state';
import { el, openModal, closeModal, confirmDialog, flash } from '../ui/dom';
import { updateAccountUI, signOut } from '../services/auth';
import { toggleDarkMode } from '../theme';
import { toggleAmbient } from '../services/audio';
import { openShoppingList } from './shopping';
import { openRegionModal } from './region';
import { startTutorial } from './tutorial';

export function openAccountModal(): void {
  updateAccountUI();
  openModal('acc-backdrop');
}

export function openPrivacyModal(): void {
  closeModal('acc-backdrop');
  openModal('privacy-modal-backdrop');
}

function exportData(): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'jardin-de-poche-export.json';
  a.click();
  flash('Export téléchargé ✓');
}

async function resetEverything(): Promise<void> {
  clearStored();
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
    if (window.caches) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {
    /* ignore */
  }
  location.reload();
}

/** Wire account modal openers + rows. Call once at boot. */
export function initAccount(): void {
  el('topbar-account').addEventListener('click', openAccountModal);
  el('account-chip-desktop').addEventListener('click', openAccountModal);
  el('acc-close').addEventListener('click', () => closeModal('acc-backdrop'));

  el('acc-export').addEventListener('click', exportData);
  el('acc-region').addEventListener('click', () => {
    closeModal('acc-backdrop');
    openRegionModal();
  });
  el('acc-darkmode').addEventListener('click', toggleDarkMode);
  el('acc-ambient').addEventListener('click', toggleAmbient);
  el('acc-shopping').addEventListener('click', () => {
    closeModal('acc-backdrop');
    openShoppingList();
  });
  el('acc-privacy').addEventListener('click', openPrivacyModal);
  el('acc-replay-tutorial').addEventListener('click', () => {
    closeModal('acc-backdrop');
    startTutorial();
  });
  el('acc-signout').addEventListener('click', () => {
    confirmDialog({
      title: 'Se déconnecter ?',
      msg: 'Vos données locales seront conservées.',
      yesLabel: 'Se déconnecter',
      onYes: signOut,
    });
  });
  el('acc-reset').addEventListener('click', () => {
    confirmDialog({
      title: 'Tout réinitialiser ?',
      msg: "Plantes, tâches, journal, progression et questionnaire : tout sera effacé définitivement. L'application redémarrera comme à la première visite.",
      yesLabel: 'Oui, tout effacer',
      onYes: resetEverything,
    });
  });

  el('region-modal-close').addEventListener('click', () => closeModal('region-modal-backdrop'));
  el('privacy-modal-close').addEventListener('click', () => closeModal('privacy-modal-backdrop'));
  el('privacy-modal-close-btn').addEventListener('click', () => closeModal('privacy-modal-backdrop'));
}
