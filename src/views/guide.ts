// ============================================================
//  Guide du potager — sections dépliables + compagnonnage
// ============================================================
import { state, save } from '../state';
import { el, qsa } from '../ui/dom';
import { escapeHTML } from '../utils';
import { GUIDE_SECTIONS } from '../data/guide';
import { COMPANION_DATA, COMPANION_FLOWERS } from '../data/companions';
import { awardXP, checkMilestones } from '../features/xp';

function companionGridHTML(): string {
  const rows = COMPANION_DATA.map(
    (c) => `
    <div class="comp-row">
      <div class="comp-veg"><span class="comp-veg-icon">${c.icon}</span><span class="comp-veg-name">${escapeHTML(c.plant)}</span></div>
      <div class="comp-lists">
        <div class="comp-line"><span class="comp-tag comp-tag-good">✓ avec</span>${c.good.map((x) => `<span class="comp-chip comp-chip-good">${escapeHTML(x)}</span>`).join('')}</div>
        <div class="comp-line"><span class="comp-tag comp-tag-bad">✗ éviter</span>${c.avoid.map((x) => `<span class="comp-chip comp-chip-bad">${escapeHTML(x)}</span>`).join('')}</div>
      </div>
    </div>`
  ).join('');
  const flowers = COMPANION_FLOWERS.map(
    (f) => `
    <div class="comp-flower">
      <span class="comp-flower-icon">${f.icon}</span>
      <div><div class="comp-flower-name">${escapeHTML(f.name)}</div><div class="comp-flower-role">${escapeHTML(f.role)}</div></div>
    </div>`
  ).join('');
  return `
    <div class="comp-grid">${rows}</div>
    <div class="comp-flowers-title">🌸 Fleurs alliées à glisser partout</div>
    <div class="comp-flowers">${flowers}</div>`;
}

export function renderGuide(): void {
  const node = el('guide-content');
  const isBegin = state.profile?.level === 'beginner';
  const seen = new Set(state.profile?.guideSeen || []);

  node.innerHTML = GUIDE_SECTIONS.map(
    (s) => `
    <div class="guide-card card mb-3" data-gid="${s.id}">
      <div class="guide-head">
        <div class="guide-icon guide-icon-${s.color}">${s.icon}</div>
        <div class="guide-meta">
          <div class="guide-htitle">${escapeHTML(s.title)}</div>
          <div class="xsmall muted">${s.type === 'companion' ? COMPANION_DATA.length + ' légumes associés' : s.tips.length + ' conseils'}${seen.has(s.id) ? ' · <span style="color:var(--green-dark)">✓ Lu</span>' : ''}</div>
        </div>
        <div class="guide-chevron">›</div>
      </div>
      <div class="guide-body" style="display:none">
        <ul class="guide-list">${s.tips.map((t) => `<li>${escapeHTML(t)}</li>`).join('')}</ul>
        ${s.type === 'companion' ? companionGridHTML() : ''}
        ${isBegin && !seen.has(s.id) ? `<button class="btn primary sm mt-3" data-guide-read="${s.id}">✓ Marquer comme lu (+5 XP)</button>` : ''}
      </div>
    </div>`
  ).join('');

  qsa<HTMLElement>('.guide-card', node).forEach((card) => {
    const head = card.querySelector('.guide-head');
    head?.addEventListener('click', () => {
      const body = card.querySelector<HTMLElement>('.guide-body');
      const chevron = card.querySelector('.guide-chevron');
      if (!body) return;
      const open = body.style.display !== 'none';
      body.style.display = open ? 'none' : 'block';
      if (chevron) chevron.textContent = open ? '›' : '∨';
    });
  });

  qsa<HTMLElement>('[data-guide-read]', node).forEach((btn) =>
    btn.addEventListener('click', () => {
      const id = btn.dataset.guideRead!;
      state.profile.guideSeen = state.profile.guideSeen || [];
      if (!state.profile.guideSeen.includes(id)) {
        state.profile.guideSeen.push(id);
        awardXP('guide_read');
        checkMilestones();
        save();
      }
      (btn as HTMLButtonElement).textContent = '✓ Lu';
      (btn as HTMLButtonElement).disabled = true;
      const meta = btn.closest('.guide-card')?.querySelector('.xsmall.muted');
      if (meta) meta.innerHTML = `${GUIDE_SECTIONS.find((s) => s.id === id)?.tips.length || 0} conseils · <span style="color:var(--green-dark)">✓ Lu</span>`;
    })
  );
}
