// ============================================================
//  Auth — Google natif (Capacitor) + Firebase web SDK + mode local
// ============================================================
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@capacitor-community/google-auth';
import { state, registerAfterSave } from '../state';
import { el, elOpt, openModal, closeModal } from '../ui/dom';
import { REGIONS } from '../data/regions';
import { scheduleSync, syncFromFirebase } from './firebase-sync';

// window.firebase est déclaré comme `any` dans src/global.d.ts (CDN Firebase compat)

interface AuthUser {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

let currentUser: AuthUser | null = null;
let localMode = false;
let enterCb: () => void = () => {};

export function getUser(): AuthUser | null { return currentUser; }
export function isLocal(): boolean { return localMode; }
export function onEnterApp(cb: () => void): void { enterCb = cb; }

export function isFirebaseConfigured(): boolean {
  try {
    const f = window.firebase;
    return !!f && f.apps.length > 0 && !!f.app().options.apiKey;
  } catch { return false; }
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

  const set = (id: string, text: string) => { const n = elOpt(id); if (n) n.textContent = text; };
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

function showAuthError(msg: string): void {
  const errEl = elOpt('auth-error');
  if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
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

async function enterApp(freshLogin: boolean): Promise<void> {
  if (currentUser && isFirebaseConfigured()) {
    registerAfterSave(scheduleSync);
    if (freshLogin) {
      const synced = await syncFromFirebase();
      if (synced) { window.location.reload(); return; }
    }
  }
  updateAccountUI();
  closeModal('auth-backdrop');
  enterCb();
}

export function handleLocalMode(): void {
  localMode = true;
  currentUser = null;
  void enterApp(false);
}

// ---- Connexion Google native (Android) ----------------------
async function nativeGoogleSignIn(): Promise<void> {
  try {
    await GoogleAuth.initialize({
      clientId: '813154716183-tgdujrasr772i91lc63fhlg4ef3t0c24.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });
    const gUser = await GoogleAuth.signIn();

    if (isFirebaseConfigured()) {
      const cred = window.firebase.auth.GoogleAuthProvider.credential(gUser.authentication.idToken);
      const result = await window.firebase.auth().signInWithCredential(cred);
      currentUser = result.user as AuthUser;
    } else {
      currentUser = { displayName: gUser.displayName, email: gUser.email, photoURL: gUser.imageUrl };
    }
    await enterApp(true);
  } catch (err) {
    const msg = (err as { message?: string }).message ?? '';
    if (!msg.includes('12501') && !msg.toLowerCase().includes('cancel')) {
      showAuthError('Connexion Google impossible. Vérifiez votre réseau ou utilisez « Continuer sans compte ».');
    }
  }
}

// ---- Connexion Google web (navigateur) ----------------------
function webGoogleSignIn(): void {
  if (!isFirebaseConfigured()) { handleLocalMode(); return; }
  const provider = new window.firebase.auth.GoogleAuthProvider();
  window.firebase
    .auth()
    .signInWithPopup(provider)
    .then((result: { user: AuthUser }) => { currentUser = result.user; void enterApp(true); })
    .catch((err: { code: string }) => showAuthError(translateAuthError(err.code)));
}

export function handleGoogleSignIn(): void {
  if (Capacitor.isNativePlatform()) void nativeGoogleSignIn();
  else webGoogleSignIn();
}

export function signOut(): void {
  if (isFirebaseConfigured()) window.firebase.auth().signOut().catch(() => {});
  if (Capacitor.isNativePlatform()) GoogleAuth.signOut().catch(() => {});
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
      registerAfterSave(scheduleSync);
      updateAccountUI();
      closeModal('auth-backdrop');
      enterCb();
      void syncFromFirebase().then((synced) => {
        if (synced) window.location.reload();
      });
    } else {
      openModal('auth-backdrop');
    }
  });
}
