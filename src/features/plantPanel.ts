// ============================================================
//  Panneau détail d'une plante
// ============================================================
import { state, activeBed } from '../state';
import { el } from '../ui/dom';
import { confirmDialog, flash } from '../ui/dom';
import { plantById } from '../data/catalog';
import { daysBetween, parseISO, addDays, iso, formatDate, seasonLabel, escapeHTML, compressImage } from '../utils';
import { regionScore, regionScoreHTML } from './region';
import { awardXP, checkMilestones } from './xp';
import { openHarvests } from './harvests';
import { syncGardenTasks } from '../garden-sync';
import { renderGarden } from '../views/garden';

export function closePanel(): void {
  el('plant-panel').classList.remove('open');
  el('panel-backdrop').classList.remove('open');
}

const STATUS_LABEL: Record<string, string> = {
  healthy: '🌿 En forme',
  warn: '⚠️ À surveiller',
  urgent: '🚨 Intervention urgente',
};

export function openPlantPanel(idx: number): void {
  const bed = activeBed();
  if (!bed) return;
  const cell = bed.cells[idx];
  if (!cell) return;
  const p = plantById(cell.plant);

  el('pd-bed-name').textContent = `${bed.name} • cellule ${idx + 1}`;
  const dot = el('pd-status');
  dot.className = 'dot ' + (cell.status === 'urgent' ? 'urgent' : cell.status === 'warn' ? 'warn' : 'healthy');

  const today = new Date();
  const since = daysBetween(parseISO(cell.planted), today);
  const tip = p?.tip || '';
  const sci = p?.sci || '';
  const season = p?.season || [];
  const family = p?.family || '';
  const companions = p?.companions || [];
  const sc = regionScore(cell.plant);

  el('panel-body').innerHTML = `
    <div class="pd-hero">
      <div class="pdi">${p ? p.icon : '❓'}</div>
      <div>
        <h2>${p ? p.name : escapeHTML(cell.plant || '?')}</h2>
        ${sci ? `<div class="sci">${escapeHTML(sci)}</div>` : ''}
        <div class="row gap-2 mt-2">
          ${season.slice(0, 1).map((s) => `<span class="chip green">${seasonLabel(s)}</span>`).join('')}
          ${family ? `<span class="chip">${escapeHTML(family)}</span>` : ''}
        </div>
      </div>
    </div>

    <div class="pd-photo-wrap">
      ${cell.photo
        ? `<div class="pd-photo-preview"><img src="${cell.photo}" alt="Photo de la plante" class="pd-photo-img"><button class="pd-photo-del" id="pd-photo-del">✕ Retirer</button></div>`
        : `<label class="pd-photo-add" id="pd-photo-label">
            <input type="file" accept="image/*" capture="environment" id="pd-photo-input" style="display:none">
            📷 Ajouter une photo
          </label>`
      }
    </div>

    <div class="pd-section">
      <h4>En un coup d'œil</h4>
      <div class="pd-rows">
        <div class="pd-row"><b>État</b><span class="v">${STATUS_LABEL[cell.status] || '—'}</span></div>
        <div class="pd-row"><b>Plantée</b><span class="v">${formatDate(cell.planted)} — il y a ${since} jour${since > 1 ? 's' : ''}</span></div>
        ${p ? `<div class="pd-row"><b>Rythme d'arrosage</b><span class="v">Tous les ${p.waterEvery} jours</span></div>` : ''}
        ${p ? `<div class="pd-row"><b>Récolte prévue</b><span class="v">${escapeHTML(p.harvest)}</span></div>` : ''}
        ${p ? `<div class="pd-row"><b>Espacement</b><span class="v">${escapeHTML(p.space)}</span></div>` : ''}
      </div>
    </div>

    ${tip ? `<div class="pd-section">
      <h4>Conseils</h4>
      <div class="card" style="background:var(--green-tint);border-color:transparent">
        <div class="small">💡 <b>Astuce :</b> ${escapeHTML(tip)}</div>
      </div>
      ${cell.notes ? `<div class="card mt-3"><div class="small"><b>Vos notes :</b> ${escapeHTML(cell.notes)}</div></div>` : ''}
    </div>` : ''}

    ${sc !== null ? `<div class="pd-section"><h4>Compatibilité régionale</h4>${regionScoreHTML(sc)}</div>` : ''}
    ${companions.length ? `<div class="pd-section">
      <h4>Bons voisinages</h4>
      <div class="row gap-2" style="flex-wrap:wrap">
        ${companions.map((c) => `<span class="chip earth">🤝 ${escapeHTML(c)}</span>`).join('')}
      </div>
    </div>` : ''}
    ${p && p.varieties.length ? `<div class="pd-section">
      <h4>Variétés populaires</h4>
      <div class="row gap-2" style="flex-wrap:wrap">
        ${p.varieties.map((v) => `<span class="chip">${escapeHTML(v)}</span>`).join('')}
      </div>
    </div>` : ''}

    <div class="pd-section">
      <h4>Historique</h4>
      <div class="pd-history">
        <div class="pd-event"><div class="pe-d">${formatDate(cell.planted)}</div><div class="pe-t">🌱 Plantée dans ${escapeHTML(bed.name)}</div></div>
        ${since > 7 ? `<div class="pd-event"><div class="pe-d">${formatDate(iso(addDays(parseISO(cell.planted), 7)))}</div><div class="pe-t">💧 Premier arrosage hebdomadaire</div></div>` : ''}
        ${cell.status === 'urgent' ? `<div class="pd-event"><div class="pe-d">${formatDate(iso(addDays(today, -1)))}</div><div class="pe-t">🐛 Ravageur repéré — traitement programmé</div></div>` : ''}
        ${cell.status === 'warn' ? `<div class="pd-event"><div class="pe-d">${formatDate(iso(addDays(today, -2)))}</div><div class="pe-t">⚠️ Signes de stress — mise sous surveillance</div></div>` : ''}
      </div>
    </div>

    <div class="row gap-2 mt-4" style="flex-wrap:wrap">
      <button class="btn" id="pd-water">💧 Marquer arrosée</button>
      <button class="btn" id="pd-harvest">🧺 J'ai récolté</button>
      <button class="btn danger" id="pd-remove">🗑️ Retirer</button>
    </div>
  `;

  el('pd-harvest').onclick = () => {
    closePanel();
    openHarvests(cell.plant);
  };
  el('pd-water').onclick = () => {
    const todayStr = iso(new Date());
    const t = state.tasks.find((x) => !x.done && x.kind === 'water' && x.plantId === cell.plant && x.date <= todayStr);
    if (t) {
      t.done = true;
      awardXP('task_done');
      checkMilestones();
    }
    flash('Arrosée ✓');
    closePanel();
  };
  el('pd-remove').onclick = () => {
    confirmDialog({
      title: `Retirer ${p ? p.name : 'cette plante'} ?`,
      msg: 'La plante sera retirée de cette cellule. Ses tâches en attente seront aussi supprimées.',
      yesLabel: 'Oui, retirer',
      onYes: () => {
        bed.cells[idx] = null;
        syncGardenTasks();
        closePanel();
        renderGarden();
      },
    });
  };

  const photoInput = document.getElementById('pd-photo-input') as HTMLInputElement | null;
  const photoLabel = document.getElementById('pd-photo-label');
  const photoDel = document.getElementById('pd-photo-del');

  if (photoLabel && photoInput) {
    photoLabel.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', () => {
      const file = photoInput.files?.[0];
      if (!file) return;
      compressImage(file).then((dataUrl) => {
        cell.photo = dataUrl;
        import('../state').then(({ save }) => save());
        flash('Photo enregistrée ✓');
        openPlantPanel(idx);
      }).catch(() => flash('Impossible de lire cette image'));
    });
  }

  if (photoDel) {
    photoDel.addEventListener('click', () => {
      cell.photo = undefined;
      import('../state').then(({ save }) => save());
      openPlantPanel(idx);
    });
  }

  el('plant-panel').classList.add('open');
  el('panel-backdrop').classList.add('open');
}
