// ============================================================
//  Couche native (Capacitor) — barre de statut, splash, bouton
//  retour Android, vibrations, clavier.
//  Tout est protégé : sur le web, chaque appel devient un no-op.
// ============================================================
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { state } from '../state';
import { flash } from '../ui/dom';
import { closePanel } from '../features/plantPanel';
import { setView, goBack, canGoBack } from '../ui/router';

const isNative = Capacitor.isNativePlatform();

// Couleurs de fond de la barre de statut, alignées sur le thème.
const STATUSBAR_BG = { light: '#f9f6f0', dark: '#141a12' };

/** Aligne la barre de statut Android sur le thème clair/sombre. */
export async function syncStatusBar(isDark: boolean): Promise<void> {
  if (!isNative) return;
  try {
    await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
    await StatusBar.setBackgroundColor({ color: isDark ? STATUSBAR_BG.dark : STATUSBAR_BG.light });
  } catch {
    /* StatusBar indisponible (web) — on ignore */
  }
}

/** Petite vibration tactile. No-op sur le web. */
export async function haptic(kind: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light'): Promise<void> {
  if (!isNative) return;
  try {
    if (kind === 'success') await Haptics.notification({ type: NotificationType.Success });
    else if (kind === 'warning') await Haptics.notification({ type: NotificationType.Warning });
    else {
      const style = kind === 'heavy' ? ImpactStyle.Heavy : kind === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light;
      await Haptics.impact({ style });
    }
  } catch {
    /* indisponible — on ignore */
  }
}

/** Cache l'écran de démarrage natif (appelé une fois l'app prête).
 *  Le splash est aussi configuré en auto-hide (1200 ms) pour qu'un crash
 *  au démarrage ne bloque jamais l'utilisateur sur l'écran de lancement. */
export async function hideSplash(): Promise<void> {
  if (!isNative) return;
  try {
    await SplashScreen.hide({ fadeOutDuration: 300 });
  } catch {
    /* ignore */
  }
}

// Gestion du « appuyer deux fois pour quitter » au niveau racine.
let lastBackPress = 0;

/** Logique du bouton retour matériel Android. */
function handleHardwareBack(): void {
  // 1) Une fenêtre modale ouverte (hors questionnaire / connexion) ?
  const openModals = Array.from(document.querySelectorAll<HTMLElement>('.modal-backdrop.open')).filter(
    (m) => m.id !== 'survey-backdrop' && m.id !== 'auth-backdrop'
  );
  if (openModals.length) {
    const top = openModals[openModals.length - 1];
    top.classList.remove('open');
    document.body.style.overflow = '';
    haptic('light');
    return;
  }

  // 2) Le panneau plante (fiche détaillée) ?
  if (document.getElementById('plant-panel')?.classList.contains('open')) {
    closePanel();
    haptic('light');
    return;
  }

  // 3) Une vue autre que le tableau de bord → revenir en arrière.
  if (canGoBack()) {
    goBack();
    haptic('light');
    return;
  }
  const activeView = document.querySelector<HTMLElement>('.view.active')?.dataset.view;
  if (activeView && activeView !== 'dashboard') {
    setView('dashboard');
    haptic('light');
    return;
  }

  // 4) Racine : appuyer deux fois rapidement pour quitter.
  const now = Date.now();
  if (now - lastBackPress < 2000) {
    CapApp.exitApp();
  } else {
    lastBackPress = now;
    flash('Appuyez encore pour quitter');
  }
}

/** Initialise toute la couche native. À appeler une fois au démarrage. */
export function initNative(): void {
  if (!isNative) return;

  // Barre de statut alignée sur le thème courant.
  void syncStatusBar(!!state.prefs?.darkMode);
  StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});

  // Le clavier redimensionne le contenu plutôt que de le recouvrir.
  Keyboard.setResizeMode({ mode: KeyboardResize.Native }).catch(() => {});
  Keyboard.setScroll({ isDisabled: false }).catch(() => {});

  // Bouton retour matériel.
  CapApp.addListener('backButton', handleHardwareBack).catch(() => {});
}
