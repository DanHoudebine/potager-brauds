// ============================================================
//  Calendrier de plantation (Pro) — « au potager ce mois-ci »
// ============================================================
//  Fonctionnalité NOUVELLE : agrège le catalogue pour dire, mois par mois,
//  quoi semer / planter / récolter, avec un conseil selon la région.
//  (La vue Calendrier existante n'affiche que les tâches de l'utilisateur.)
import { CATALOG } from '../data/catalog';
import type { Plant } from '../types';
import { el, elOpt, openModal, closeModal } from '../ui/dom';
import { state } from '../state';
import { regionById } from '../data/regions';
import { escapeHTML } from '../utils';
import { requirePro } from './paywall';

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

// Abréviations utilisées dans le catalogue (« mars–avr », « fév–mars »…).
const MONTH_LOOKUP: Record<string, number> = {
  jan: 0, janv: 0, janvier: 0,
  fev: 1, 'fév': 1, fevr: 1, 'févr': 1, fevrier: 1, 'février': 1,
  mars: 2,
  avr: 3, avril: 3,
  mai: 4,
  juin: 5,
  juil: 6, juillet: 6,
  aout: 7, 'août': 7,
  sep: 8, sept: 8, septembre: 8,
  oct: 9, octobre: 9,
  nov: 10, novembre: 10,
  dec: 11, 'déc': 11, decembre: 11, 'décembre': 11,
};

function monthIndex(token: string): number | null {
  const t = token.trim().toLowerCase();
  if (t in MONTH_LOOKUP) return MONTH_LOOKUP[t];
  for (const key of Object.keys(MONTH_LOOKUP)) {
    if (t.startsWith(key)) return MONTH_LOOKUP[key];
  }
  return null;
}

/** Convertit « mars–avr », « oct–mars » (chevauche l'année), « 30 jours » (vide)
 *  en un ensemble d'indices de mois (0 = janvier). */
function parseMonths(str: string): Set<number> {
  const out = new Set<number>();
  if (!str) return out;
  const idxs = str
    .split(/\s*[–—-]\s*/)
    .map((t) => monthIndex(t))
    .filter((n): n is number => n !== null);
  if (!idxs.length) return out;
  if (idxs.length === 1) {
    out.add(idxs[0]);
    return out;
  }
  // Plage du premier au dernier mois, en gérant le passage de fin d'année.
  const start = idxs[0];
  const end = idxs[idxs.length - 1];
  let m = start;
  for (let i = 0; i < 12; i++) {
    out.add(m);
    if (m === end) break;
    m = (m + 1) % 12;
  }
  return out;
}

const byName = (a: Plant, b: Plant) => a.name.localeCompare(b.name, 'fr');

let viewMonth = new Date().getMonth();

const COLDER = ['nord', 'est', 'montagne'];
const WARMER = ['med', 'sudouest', 'ocean'];

function regionNoteHTML(): string {
  const region = regionById(state.profile?.region);
  if (!region) {
    return `<div style="background:var(--earth-tint);border-radius:12px;padding:10px 12px;margin-bottom:14px;font-size:13px">🗺️ Renseignez votre région dans <b>Mon compte</b> pour des conseils adaptés à votre climat.</div>`;
  }
  let hint = 'calendrier de référence (climat tempéré).';
  if (COLDER.includes(region.id)) hint = 'en climat plus frais, semez 1 à 2 semaines plus tard et protégez les jeunes semis.';
  else if (WARMER.includes(region.id)) hint = 'en climat doux, vous pouvez souvent semer 1 à 2 semaines plus tôt.';
  return `<div style="background:var(--green-tint);border-radius:12px;padding:10px 12px;margin-bottom:14px;font-size:13px">🗺️ <b>${escapeHTML(region.label)}</b> — ${hint}</div>`;
}

function section(title: string, plants: Plant[]): string {
  if (!plants.length) {
    return `<div style="margin-bottom:16px"><div style="font-weight:800;margin-bottom:6px">${title}</div><div class="small muted">Rien de particulier ce mois-ci.</div></div>`;
  }
  const chips = plants
    .map((p) => `<span style="display:inline-flex;align-items:center;gap:4px;background:var(--bg-soft);border-radius:999px;padding:5px 10px;font-size:13px;font-weight:600">${p.icon} ${escapeHTML(p.name)}</span>`)
    .join('');
  return `<div style="margin-bottom:16px">
    <div style="font-weight:800;margin-bottom:8px">${title} <span class="muted" style="font-weight:600">(${plants.length})</span></div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">${chips}</div>
  </div>`;
}

function render(): void {
  const body = elOpt('planting-cal-body');
  if (!body) return;
  const sow = CATALOG.filter((p) => parseMonths(p.sow).has(viewMonth)).sort(byName);
  const plant = CATALOG.filter((p) => parseMonths(p.plant).has(viewMonth)).sort(byName);
  const harvest = CATALOG.filter((p) => parseMonths(p.harvest).has(viewMonth)).sort(byName);

  body.innerHTML = `
    <div class="row between" style="align-items:center;margin-bottom:14px">
      <button class="icon-btn" id="pc-prev" aria-label="Mois précédent">‹</button>
      <div style="font-weight:800;font-size:18px;text-transform:capitalize">${MONTHS[viewMonth]}</div>
      <button class="icon-btn" id="pc-next" aria-label="Mois suivant">›</button>
    </div>
    ${regionNoteHTML()}
    ${section('🌱 À semer', sow)}
    ${section('🌿 À planter', plant)}
    ${section('🥕 À récolter', harvest)}
  `;
  el('pc-prev').addEventListener('click', () => { viewMonth = (viewMonth + 11) % 12; render(); });
  el('pc-next').addEventListener('click', () => { viewMonth = (viewMonth + 1) % 12; render(); });
}

export function openPlantingCalendar(): void {
  // Fonctionnalité Pro (nouvelle — ne retire rien de gratuit).
  if (!requirePro('Le calendrier de plantation personnalisé fait partie de Pro.')) return;
  viewMonth = new Date().getMonth();
  render();
  openModal('planting-cal-backdrop');
}

export function initPlantingCalendar(): void {
  elOpt('planting-cal-close')?.addEventListener('click', () => closeModal('planting-cal-backdrop'));
  elOpt('open-planting-cal')?.addEventListener('click', openPlantingCalendar);
}
