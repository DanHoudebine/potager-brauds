// ============================================================
//  Firebase Realtime Database sync
//  Chemin : /users/{uid}/state
//  Déclenchement : debounce 4 s après chaque save()
// ============================================================
import type { AppState } from '../types';
import { STORAGE_KEY, hotReloadState } from '../state';

let writeTimer: ReturnType<typeof setTimeout> | undefined;

function rtdb() {
  try {
    const firebase = window.firebase;
    if (!firebase || typeof firebase.database !== 'function') return null;
    return firebase.database();
  } catch { return null; }
}

function uid(): string | null {
  try {
    return window.firebase?.auth?.().currentUser?.uid ?? null;
  } catch { return null; }
}

function writeNow(s: AppState): void {
  const u = uid();
  const db = rtdb();
  if (!u || !db) return;
  db.ref(`users/${u}/state`).set(JSON.parse(JSON.stringify(s))).catch(() => {});
}

/** Planifie une écriture dans Firebase 4 s après le dernier save(). */
export function scheduleSync(s: AppState): void {
  clearTimeout(writeTimer);
  writeTimer = setTimeout(() => writeNow(s), 4000);
}

/** Lit l'état depuis Firebase et fusionne dans localStorage (appelé à la connexion). */
export async function syncFromFirebase(): Promise<boolean> {
  const u = uid();
  const db = rtdb();
  if (!u || !db) return false;
  try {
    const snap = await db.ref(`users/${u}/state`).once('value');
    const remote = snap.val() as Partial<AppState> | null;
    if (!remote) return false;
    const raw = localStorage.getItem(STORAGE_KEY);
    const local = raw ? (JSON.parse(raw) as Partial<AppState>) : {};
    // Remote gagne sur local — les prefs (thème/sons) restent locales
    const merged = { ...local, ...remote } as AppState;
    if (local.prefs) merged.prefs = { ...remote.prefs, ...local.prefs } as AppState['prefs'];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    hotReloadState();
    return true;
  } catch { return false; }
}
