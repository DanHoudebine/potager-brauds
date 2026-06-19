// ============================================================
//  Mon compte — préférences, export, reset, déconnexion
// ============================================================
import { state, resetStored } from '../state';
import { el, elOpt, openModal, closeModal, confirmDialog, flash } from '../ui/dom';
import { updateAccountUI, signOut } from '../services/auth';
import { toggleDarkMode } from '../theme';
import { toggleAmbient } from '../services/audio';
import { openShoppingList } from './shopping';
import { openHarvests } from './harvests';
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

async function exportData(): Promise<void> {
  const json = JSON.stringify(state, null, 2);
  const date = new Date().toISOString().slice(0, 10);
  const filename = `potager-de-poche-${date}.json`;
  if (navigator.share) {
    try {
      const file = new File([json], filename, { type: 'application/json' });
      await navigator.share({ files: [file], title: 'Potager de Poche — sauvegarde' });
      return;
    } catch { /* annulé ou non supporté */ }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
  flash('Sauvegarde téléchargée ✓');
}

async function resetEverything(): Promise<void> {
  // Écrit un état vierge (jardin et serres vides) AVANT de recharger, pour que
  // l'app ne ré-injecte pas les données de démonstration au redémarrage.
  resetStored();
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

  el('acc-harvests').addEventListener('click', () => {
    closeModal('acc-backdrop');
    openHarvests();
  });
  elOpt('acc-share')?.addEventListener('click', () => {
    closeModal('acc-backdrop');
    import('./share').then(({ openShareModal }) => openShareModal());
  });
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
  el('acc-export').addEventListener('click', () => { void exportData(); });
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
