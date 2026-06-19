// ============================================================
//  Musique d'ambiance — boucle lofi optionnelle
// ============================================================
import { state, save } from '../state';
import { elOpt } from '../ui/dom';

let ambientAudio: HTMLAudioElement | null = null;

function getAmbientAudio(): HTMLAudioElement {
  if (!ambientAudio) {
    ambientAudio = new Audio('./ambient.mp3');
    ambientAudio.loop = true;
    ambientAudio.volume = 0.3;
  }
  return ambientAudio;
}

export function applyAmbient(): void {
  const audio = getAmbientAudio();
  if (state.prefs?.ambientOn) audio.play().catch(() => {});
  else audio.pause();

  const btn = elOpt('acc-ambient');
  if (btn) {
    const ai = btn.querySelector('.ai');
    const as = btn.querySelector('.as');
    if (ai) ai.textContent = state.prefs?.ambientOn ? '🎵' : '🎶';
    if (as) as.textContent = state.prefs?.ambientOn ? 'En cours de lecture — toucher pour arrêter' : 'Sons de nature relaxants en fond';
  }
}

export function toggleAmbient(): void {
  state.prefs.ambientOn = !state.prefs.ambientOn;
  save();
  applyAmbient();
}
