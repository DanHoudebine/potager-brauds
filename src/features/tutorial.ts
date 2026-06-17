// ============================================================
//  Tutoriel — visite guidée surlignée
// ============================================================
import { state, save } from '../state';
import { el, elOpt, flash } from '../ui/dom';
import { setView } from '../ui/router';
import { TUTORIAL_STEPS } from '../data/tutorial';

let tutStep = 0;

export function startTutorial(): void {
  setView('dashboard');
  tutStep = 0;
  el('tutorial-overlay').style.display = 'flex';
  renderTutStep();
}

function renderTutStep(): void {
  const s = TUTORIAL_STEPS[tutStep];
  if (!s) {
    endTutorial();
    return;
  }
  el('tut-num').textContent = String(tutStep + 1);
  el('tut-total').textContent = String(TUTORIAL_STEPS.length);
  el('tut-title').textContent = s.title;
  el('tut-text').textContent = s.text;
  el('tut-next').textContent = tutStep < TUTORIAL_STEPS.length - 1 ? 'Suivant →' : 'Terminer ✓';

  const ov = el('tutorial-overlay');
  const hl = el('tut-highlight');
  const card = el('tut-card');

  let target: HTMLElement | null = null;
  for (const sel of s.sel.split(',').map((x) => x.trim())) {
    const node = document.querySelector<HTMLElement>(sel);
    if (node) {
      const r = node.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        target = node;
        break;
      }
    }
  }

  if (target) {
    const pos = getComputedStyle(target).position;
    const isFixed = pos === 'fixed' || pos === 'sticky';
    const r0 = target.getBoundingClientRect();
    if (!isFixed && (r0.top < 80 || r0.bottom > window.innerHeight - 80)) {
      target.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
    const r = target.getBoundingClientRect();
    const pad = 8;
    ov.style.background = 'transparent';
    hl.style.display = 'block';
    hl.style.top = r.top - pad + 'px';
    hl.style.left = r.left - pad + 'px';
    hl.style.width = r.width + pad * 2 + 'px';
    hl.style.height = r.height + pad * 2 + 'px';
    const spaceBelow = window.innerHeight - r.bottom;
    if (spaceBelow > 220) {
      card.style.top = r.bottom + 18 + 'px';
      card.style.bottom = '';
    } else {
      card.style.bottom = window.innerHeight - r.top + 16 + 'px';
      card.style.top = '';
    }
    card.style.left = '50%';
    card.style.transform = 'translateX(-50%)';
    card.style.position = 'fixed';
  } else {
    ov.style.background = 'rgba(0,0,0,.6)';
    hl.style.display = 'none';
    card.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%)';
  }
}

function nextTutStep(): void {
  tutStep++;
  if (tutStep >= TUTORIAL_STEPS.length) {
    endTutorial();
    return;
  }
  renderTutStep();
}

function endTutorial(): void {
  el('tutorial-overlay').style.display = 'none';
  el('tut-highlight').style.display = 'none';
  if (state.profile) {
    state.profile.tutorialDone = true;
    save();
  }
  flash('Tutoriel terminé — bonne culture ! 🌱');
}

/** Wire tutorial buttons. Call once at boot. */
export function initTutorial(): void {
  elOpt('tut-next')?.addEventListener('click', nextTutStep);
  elOpt('tut-skip')?.addEventListener('click', endTutorial);
  elOpt('guide-restart-tut')?.addEventListener('click', startTutorial);
}
