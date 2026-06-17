// ============================================================
//  Thème clair / sombre
// ============================================================
import { state, save } from './state';
import { elOpt } from './ui/dom';

export function applyTheme(): void {
  document.documentElement.setAttribute('data-theme', state.prefs?.darkMode ? 'dark' : 'light');
}

export function toggleDarkMode(): void {
  state.prefs.darkMode = !state.prefs.darkMode;
  save();
  applyTheme();
  const at = elOpt('acc-darkmode')?.querySelector('.at');
  if (at) at.textContent = state.prefs.darkMode ? '🌙 Mode sombre' : '☀️ Mode clair';
}
