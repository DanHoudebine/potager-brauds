// ============================================================
//  Progression — XP, paliers et défis (mode débutant)
// ============================================================
import type { XpEvent } from '../types';
import { state, save } from '../state';
import { elOpt, qs, flash } from '../ui/dom';
import { escapeHTML } from '../utils';
import { MILESTONES, XP_EVENTS, LEVELS } from '../data/progression';

function isBeginner(): boolean {
  return state.profile?.level === 'beginner';
}

export function awardXP(event: XpEvent): void {
  if (!isBeginner()) return;
  const amount = XP_EVENTS[event] || 0;
  if (!amount) return;
  state.profile.xp = (state.profile.xp || 0) + amount;
  state.profile.stars = Math.floor(state.profile.xp / 100);
  checkMilestones();
  save();
  renderXPWidget();
  const bar = qs<HTMLElement>('#xp-widget .xp-bar');
  if (bar) {
    bar.classList.remove('bump');
    void bar.offsetWidth; // reflow → restart animation
    bar.classList.add('bump');
  }
  flash(`+${amount} XP ⭐`);
}

export function checkMilestones(): void {
  if (!isBeginner()) return;
  const done = new Set(state.profile.milestones || []);
  let gained = false;
  MILESTONES.forEach((m) => {
    if (!done.has(m.id) && m.req(state)) {
      state.profile.milestones = state.profile.milestones || [];
      state.profile.milestones.push(m.id);
      if (m.xp) {
        state.profile.xp = (state.profile.xp || 0) + m.xp;
        state.profile.stars = Math.floor(state.profile.xp / 100);
      }
      const delay = gained ? 2500 : 500;
      setTimeout(() => flash(`${m.icon} Défi débloqué : ${m.label} !`), delay);
      gained = true;
    }
  });
  if (gained) renderXPWidget();
}

export function renderXPWidget(): void {
  const widget = elOpt('xp-widget');
  if (!widget) return;
  const begin = isBeginner();
  widget.style.display = begin ? '' : 'none';
  if (!begin) return;

  const xp = state.profile.xp || 0;
  let lvlIdx = 0;
  LEVELS.forEach((l, i) => {
    if (xp >= l.xp) lvlIdx = i;
  });
  const cur = LEVELS[lvlIdx];
  const next = LEVELS[lvlIdx + 1] || null;
  const pct = next ? Math.min(100, Math.round(((xp - cur.xp) / (next.xp - cur.xp)) * 100)) : 100;

  const setText = (id: string, text: string) => {
    const node = elOpt(id);
    if (node) node.textContent = text;
  };
  setText('xp-current', `${xp} XP`);
  setText('xp-next-label', next ? `Prochain : ${next.icon} ${next.label} à ${next.xp} XP` : '🏆 Niveau maximum atteint !');
  setText('xp-level-label', `${cur.icon} ${cur.label}`);
  const fill = elOpt('xp-fill');
  if (fill) fill.style.width = pct + '%';

  const ladder = elOpt('xp-levels');
  if (ladder) {
    ladder.innerHTML = LEVELS.map((l, i) => {
      const cls = i < lvlIdx ? 'past' : i === lvlIdx ? 'current' : '';
      const xpLabel = i === lvlIdx && next ? `${xp} / ${next.xp} XP` : `${l.xp} XP`;
      return `<div class="xp-level ${cls}" title="${escapeHTML(l.label)} — dès ${l.xp} XP">
        <div class="xl-icon">${i < lvlIdx ? '✅' : l.icon}</div>
        <div class="xl-name">${escapeHTML(l.label)}</div>
        <div class="xl-xp">${xpLabel}</div>
      </div>`;
    }).join('');
  }

  const done = new Set(state.profile.milestones || []);
  const mRow = elOpt('milestones-row');
  if (mRow) {
    mRow.innerHTML = MILESTONES.map(
      (m) => `<span class="milestone-badge ${done.has(m.id) ? 'done' : ''}" title="${escapeHTML(m.label)}">${m.icon}</span>`
    ).join('');
  }
}
