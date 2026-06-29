// ============================================================
//  Thème clair / sombre
// ============================================================
import { state, save } from './state';
import { elOpt } from './ui/dom';
import { syncStatusBar } from './services/native';

export function applyTheme(): void {
  const dark = !!state.prefs?.darkMode;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  // Garde la couleur de la barre du navigateur / barre de statut native cohérente.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#141a12' : '#f9f6f0');
  void syncStatusBar(dark);
}

export function toggleDarkMode(): void {
  state.prefs.darkMode = !state.prefs.darkMode;
  save();
  applyTheme();
  const at = elOpt('acc-darkmode')?.querySelector('.at');
  if (at) at.textContent = state.prefs.darkMode ? '🌙 Mode sombre' : '☀️ Mode clair';
}

/** Applique le mode daltonien (couleurs d'état adaptées). */
export function applyColorblind(): void {
  document.documentElement.setAttribute('data-cb', state.prefs?.colorblind ? 'on' : 'off');
}

export function toggleColorblind(): void {
  state.prefs.colorblind = !state.prefs.colorblind;
  save();
  applyColorblind();
  const at = elOpt('acc-colorblind')?.querySelector('.at');
  if (at) at.textContent = state.prefs.colorblind ? '👁️ Mode daltonien activé ✓' : '👁️ Mode daltonien';
}
