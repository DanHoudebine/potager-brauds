// ============================================================
//  Mon compte — préférences, export, reset, déconnexion
// ============================================================
import { state, save, resetStored, STORAGE_KEY } from '../state';
import type { AppState } from '../types';
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
  updateProfileLabel();
  openModal('acc-backdrop');
}

function updateProfileLabel(): void {
  const lbl = elOpt('acc-profile-label');
  if (!lbl) return;
  const name = state.profile?.displayName;
  const start = state.profile?.gardenStartDate;
  if (name || start) {
    const parts = [];
    if (name) parts.push(name);
    if (start) {
      const days = Math.floor((Date.now() - new Date(start).getTime()) / 86400000);
      parts.push(`${days} jour${days > 1 ? 's' : ''} de jardinage`);
    }
    lbl.textContent = parts.join(' · ');
  } else {
    lbl.textContent = 'Nom et date de début de jardinage';
  }
}

function openProfileModal(): void {
  const nameEl = elOpt<HTMLInputElement>('profile-name');
  const dateEl = elOpt<HTMLInputElement>('profile-start-date');
  if (nameEl) nameEl.value = state.profile?.displayName || '';
  if (dateEl) dateEl.value = state.profile?.gardenStartDate || '';
  updateStartLabel();
  openModal('profile-modal-backdrop');
}

function updateStartLabel(): void {
  const dateEl = elOpt<HTMLInputElement>('profile-start-date');
  const lbl = elOpt('profile-start-label');
  if (!lbl || !dateEl?.value) { if (lbl) lbl.textContent = ''; return; }
  const days = Math.floor((Date.now() - new Date(dateEl.value).getTime()) / 86400000);
  lbl.textContent = days > 0 ? `🌱 ${days} jour${days > 1 ? 's' : ''} de jardinage !` : '';
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

function importData(): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json,.json';
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(String(reader.result));
      } catch {
        flash('Fichier illisible ❌');
        return;
      }
      // Validation minimale : doit ressembler à un état d'application.
      const data = parsed as Partial<AppState>;
      if (!data || typeof data !== 'object' || !Array.isArray(data.beds) || !data.profile) {
        flash("Ce fichier n'est pas une sauvegarde valide ❌");
        return;
      }
      confirmDialog({
        title: 'Restaurer cette sauvegarde ?',
        msg: 'Vos données actuelles seront entièrement remplacées par celles du fichier. Cette action est irréversible.',
        yesLabel: 'Oui, restaurer',
        onYes: () => {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          } catch {
            flash('Restauration impossible (stockage) ❌');
            return;
          }
          location.reload();
        },
      });
    };
    reader.readAsText(file);
  };
  input.click();
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
  el('acc-import').addEventListener('click', () => {
    closeModal('acc-backdrop');
    importData();
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
      msg: "Plantes, tâches, journal, progression et questionnaire : tout sera effacé définitivement. Pensez à sauvegarder votre jardin avant — vous pourrez le restaurer plus tard.",
      yesLabel: 'Oui, tout effacer',
      onYes: resetEverything,
      extraLabel: '💾 Sauvegarder mon jardin d\'abord',
      onExtra: () => { void exportData(); },
    });
  });

  el('acc-profile').addEventListener('click', () => {
    closeModal('acc-backdrop');
    openProfileModal();
  });
  el('profile-modal-close').addEventListener('click', () => closeModal('profile-modal-backdrop'));
  elOpt<HTMLInputElement>('profile-start-date')?.addEventListener('input', updateStartLabel);
  el('profile-save').addEventListener('click', () => {
    const name = (elOpt<HTMLInputElement>('profile-name')?.value || '').trim();
    const date = elOpt<HTMLInputElement>('profile-start-date')?.value || '';
    state.profile.displayName = name || null;
    state.profile.gardenStartDate = date || null;
    save();
    closeModal('profile-modal-backdrop');
    updateProfileLabel();
    flash('Profil enregistré ✓');
  });

  el('region-modal-close').addEventListener('click', () => closeModal('region-modal-backdrop'));
  el('privacy-modal-close').addEventListener('click', () => closeModal('privacy-modal-backdrop'));
  el('privacy-modal-close-btn').addEventListener('click', () => closeModal('privacy-modal-backdrop'));
}
