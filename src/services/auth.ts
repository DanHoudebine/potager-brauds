// ============================================================
//  Auth — Google (Firebase compat, optionnel) + mode local
// ============================================================
import { Capacitor } from '@capacitor/core';
import { state } from '../state';
import { el, elOpt, openModal, closeModal } from '../ui/dom';
import { REGIONS } from '../data/regions';

interface AuthUser {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

let currentUser: AuthUser | null = null;
let localMode = false;
let enterCb: () => void = () => {};

export function getUser(): AuthUser | null {
  return currentUser;
}
export function isLocal(): boolean {
  return localMode;
}
export function onEnterApp(cb: () => void): void {
  enterCb = cb;
}

export function isFirebaseConfigured(): boolean {
  try {
    const fb = window.firebase;
    return !!fb && fb.apps.length > 0 && !!fb.app().options.apiKey;
  } catch {
    return false;
  }
}

export function updateAccountUI(): void {
  const name = currentUser
    ? currentUser.displayName || currentUser.email || 'Utilisateur'
    : localMode ? 'Mode local' : 'Non connecté';
  const email = currentUser?.email || '';
  const initial = name[0]?.toUpperCase() || '?';

  const setAva = (node: HTMLElement | null, src?: string | null) => {
    if (!node) return;
    if (src) {
      node.style.backgroundImage = `url('${src}')`;
      node.style.backgroundSize = 'cover';
      node.textContent = '';
    } else {
      node.style.backgroundImage = '';
      node.textContent = initial;
    }
  };

  setAva(elOpt('ava-desktop'), currentUser?.photoURL);
  setAva(elOpt('ava-mobile'), currentUser?.photoURL);
  setAva(elOpt('ava-menu'), currentUser?.photoURL);

  const set = (id: string, text: string) => {
    const node = elOpt(id);
    if (node) node.textContent = text;
  };
  set('acc-name-desktop', name);
  set('acc-state-desktop', currentUser ? 'Connecté' : 'Mode local');
  set('acc-menu-name', name);
  set('acc-menu-email', email);

  const badge = elOpt('acc-sync-badge');
  if (badge) {
    badge.textContent = currentUser ? '☁ Synchro' : 'Local';
    badge.className = 'sync-badge' + (currentUser ? '' : ' local');
  }
  const regionLbl = elOpt('acc-region-label');
  if (regionLbl) {
    const r = state.profile?.region ? REGIONS.find((x) => x.id === state.profile.region) : null;
    regionLbl.textContent = r ? `${r.emoji} ${r.label}` : 'Non renseignée — touchez pour configurer';
  }
}

function enterApp(): void {
  updateAccountUI();
  closeModal('auth-backdrop');
  enterCb();
}

export function handleLocalMode(): void {
  localMode = true;
  currentUser = null;
  enterApp();
}

function translateAuthError(code: string): string {
  const map: Record<string, string> = {
    'auth/popup-closed-by-user': 'Connexion annulée.',
    'auth/network-request-failed': 'Problème réseau. Vérifiez votre connexion.',
    'auth/user-disabled': 'Ce compte a été désactivé.',
    'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
  };
  return map[code] || 'Une erreur est survenue. Réessayez.';
}

export function handleGoogleSignIn(): void {
  // La connexion Google de Firebase repose sur une fenêtre popup, indisponible
  // dans la WebView Android. On l'indique clairement et on propose le mode local
  // plutôt que de laisser le bouton sembler « cassé ».
  if (Capacitor.isNativePlatform()) {
    const errEl = elOpt('auth-error');
    if (errEl) {
      errEl.textContent = "La connexion Google n'est pas encore disponible dans l'application. Utilisez « Continuer sans compte » — vos données restent sur votre appareil.";
      errEl.classList.add('show');
    }
    return;
  }
  if (!isFirebaseConfigured()) {
    handleLocalMode();
    return;
  }
  const fb = window.firebase;
  const provider = new fb.auth.GoogleAuthProvider();
  fb.auth()
    .signInWithPopup(provider)
    .then((result: { user: AuthUser }) => {
      currentUser = result.user;
      enterApp();
    })
    .catch((err: { code: string }) => {
      const errEl = elOpt('auth-error');
      if (errEl) {
        errEl.textContent = translateAuthError(err.code);
        errEl.classList.add('show');
      }
    });
}

export function signOut(): void {
  if (isFirebaseConfigured()) {
    try {
      window.firebase.auth().signOut();
    } catch {
      /* ignore */
    }
  }
  currentUser = null;
  localMode = false;
  closeModal('acc-backdrop');
  openModal('auth-backdrop');
}

/** Wire auth buttons and resolve initial auth state. Call at boot. */
export function initAuth(): void {
  el('google-signin').addEventListener('click', handleGoogleSignIn);
  el('auth-skip').addEventListener('click', handleLocalMode);

  if (!isFirebaseConfigured()) {
    const warn = elOpt('auth-firebase-warning');
    if (warn) warn.style.display = 'flex';
    openModal('auth-backdrop');
    return;
  }

  window.firebase.auth().onAuthStateChanged((user: AuthUser | null) => {
    if (user) {
      currentUser = user;
      enterApp();
    } else {
      openModal('auth-backdrop');
    }
  });
}
