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
