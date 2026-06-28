// ============================================================
//  State store — load / save / defaults
// ============================================================
import type { AppState, Bed } from './types';
import { iso, addDays } from './utils';

const STORAGE_KEY = 'potager.state.v2.fr';

function buildDefaultState(): AppState {
  const now = new Date();
  return {
    profile: {
      surveyed: false,
      level: null,
      experience: null,
      spaceType: null,
      xp: 0,
      stars: 0,
      milestones: [],
      tutorialDone: false,
      guideSeen: [],
      region: null,
      displayName: null,
      gardenStartDate: null,
    },
    beds: [
      // Version gratuite : une parcelle 2 × 5 (10 cases). Les comptes Pro
      // peuvent en ajouter d'autres et les agrandir.
      { id: 'b1', name: 'Jardin', type: 'jardin', cols: 2, rows: 5, cells: [
        { id: 'c1', plant: 'tomato', planted: '2026-05-01', status: 'healthy', notes: 'Variété : San Marzano. Tuteurée.' },
        { id: 'c2', plant: 'tomato', planted: '2026-05-01', status: 'warn', notes: "Feuilles enroulées, manque d'eau peut-être." },
        { id: 'c3', plant: 'basil', planted: '2026-05-10', status: 'healthy', notes: 'Planté à côté des tomates.' },
        { id: 'c4', plant: 'lettuce', planted: '2026-04-22', status: 'healthy', notes: 'Variété à couper.' },
        { id: 'c5', plant: 'leek', planted: '2026-05-05', status: 'urgent', notes: "Pucerons repérés aujourd'hui." },
        { id: 'c6', plant: 'carrot', planted: '2026-04-15', status: 'healthy', notes: 'Éclaircie la semaine dernière.' },
        { id: 'c7', plant: 'strawberry', planted: '2026-04-01', status: 'healthy', notes: 'Premières fleurs ouvertes !' },
        { id: 'c8', plant: 'strawberry', planted: '2026-04-01', status: 'healthy', notes: '' },
        { id: 'c9', plant: 'radish', planted: '2026-05-10', status: 'healthy', notes: 'Prêts dans ~2 semaines.' },
        null,
      ] },
    ],
    activeBedId: 'b1',
    tasks: [
      { id: 't1', title: 'Arroser les tomates', kind: 'water', date: iso(now), done: false, plantId: 'tomato' },
      { id: 't2', title: 'Récolter les premiers radis', kind: 'harvest', date: iso(now), done: false, plantId: 'radish' },
      { id: 't3', title: 'Pulvériser savon noir sur poireaux (pucerons)', kind: 'treat', date: iso(now), done: false, plantId: 'leek' },
      { id: 't4', title: 'Semer la 2ᵉ série de laitues', kind: 'sow', date: iso(addDays(now, 1)), done: false, plantId: 'lettuce' },
      { id: 't5', title: 'Arroser le basilic', kind: 'water', date: iso(addDays(now, 1)), done: false, plantId: 'basil' },
      { id: 't6', title: 'Vérifier le filet des fraisiers', kind: 'other', date: iso(addDays(now, 2)), done: false, plantId: 'strawberry' },
      { id: 't7', title: 'Pincer les gourmands des tomates', kind: 'other', date: iso(addDays(now, 3)), done: false, plantId: 'tomato' },
    ],
    journal: [
      { id: 'j1', date: iso(addDays(now, -1)), subject: 'Poireaux', icon: '🧅', text: 'Pucerons trouvés sur trois pieds de poireau. Pulvérisation de savon noir dilué. Re-contrôle dans 48h.', tags: ['pest'] },
      { id: 'j2', date: iso(addDays(now, -3)), subject: 'Fraisiers', icon: '🍓', text: 'Premières fleurs ouvertes sur la rangée 2. Paillage de paille pour garder les fruits propres.', tags: ['experiment'] },
      { id: 'j3', date: iso(addDays(now, -5)), subject: 'Météo', icon: '🌧️', text: "Grosse pluie cette nuit (28 mm). Pas d'arrosage aujourd'hui. Les tomates ont meilleure mine.", tags: ['weather'] },
      { id: 'j4', date: iso(addDays(now, -9)), subject: 'Radis', icon: '🟠', text: 'Goûté les premiers — piquants mais pas creux. Bon timing.', tags: ['harvest'] },
    ],
    reminders: [
      { id: 'r1', title: 'Arroser les tomates', schedule: 'Tous les 2 jours', icon: '💧', on: true },
      { id: 'r2', title: 'Surveiller les poireaux', schedule: 'Tous les samedis', icon: '🐛', on: true },
      { id: 'r3', title: 'Semer la laitue', schedule: 'Toutes les 3 semaines', icon: '🌱', on: true },
      { id: 'r4', title: 'Apport potasse fraisiers', schedule: 'Toutes les 2 semaines', icon: '🍓', on: false },
    ],
    prefs: {
      digest: true, weather: true, quiet: true, pushAsked: false, pushOn: false,
      darkMode: false, ambientOn: false,
      alertMildiou: true, alertTraitement: true, alertParasite: true,
      alertTaille: true, alertTraitementArbo: true, alertGreffage: true,
    },
    onboarded: false,
    gardenTab: 'all',
    draft: null,
    streak: 7,
    weather: null,
    shopping: [],
    harvests: [],
  };
}

/** État totalement vierge : jardin et serres vides, aucune donnée de démo.
 *  Sert au « Repartir de zéro » pour que rien ne soit ré-injecté au reload. */
function buildEmptyState(): AppState {
  const def = buildDefaultState();
  return {
    ...def,
    profile: {
      surveyed: false, level: null, experience: null, spaceType: null,
      xp: 0, stars: 0, milestones: [], tutorialDone: false, guideSeen: [], region: null, displayName: null, gardenStartDate: null,
    },
    beds: [{ id: 'b1', name: 'Jardin', type: 'jardin', cols: 2, rows: 5, cells: Array(10).fill(null) }],
    activeBedId: 'b1',
    tasks: [],
    journal: [],
    reminders: [],
    onboarded: false,
    gardenTab: 'all',
    draft: null,
    streak: 0,
    weather: null,
    shopping: [],
    harvests: [],
  };
}

function loadState(): AppState {
  const def = buildDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return def;
    const saved = JSON.parse(raw) as Partial<AppState>;
    const loaded = { ...def, ...saved } as AppState;
    loaded.prefs = { ...def.prefs, ...(saved.prefs || {}) };
    loaded.profile = { ...def.profile, ...(saved.profile || {}) };
    if (!loaded.harvests) loaded.harvests = [];
    return loaded;
  } catch {
    return def;
  }
}

/** The single mutable app state. Mutate then call save(). */
export const state: AppState = loadState();

/** Relit localStorage et écrase l'état en mémoire sans recharger la page. */
export function hotReloadState(): void {
  Object.assign(state, loadState());
}

let _afterSave: ((s: AppState) => void) | undefined;
/** Enregistre un hook appelé après chaque save() — utilisé pour la synchro Firebase. */
export function registerAfterSave(fn: (s: AppState) => void): void {
  _afterSave = fn;
}

export function save(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode — ignore */
  }
  _afterSave?.(state);
}

export function clearStored(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** « Repartir de zéro » : écrase le stockage par un état vierge (et non un
 *  simple removeItem, qui laisserait l'app recharger les données de démo). */
export function resetStored(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buildEmptyState()));
  } catch {
    /* ignore */
  }
}

export function activeBed(): Bed | undefined {
  return state.beds.find((b) => b.id === state.activeBedId) || state.beds[0];
}

export { STORAGE_KEY };
