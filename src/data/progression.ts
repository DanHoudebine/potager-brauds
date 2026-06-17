import type { Milestone, LevelTier, XpEvent, AppState } from '../types';
import { CATALOG } from './catalog';

const plantedCells = (s: AppState) => s.beds.flatMap((b) => b.cells || []).filter(Boolean);

export const MILESTONES: Milestone[] = [
  { id: 'first_plant', label: 'Première plante', icon: '🌱', xp: 15, req: (s) => plantedCells(s).length >= 1 },
  { id: 'first_task', label: "À l'action !", icon: '✅', xp: 10, req: (s) => (s.tasks || []).some((t) => t.done) },
  { id: 'first_note', label: 'Observateur', icon: '📝', xp: 10, req: (s) => (s.journal || []).length >= 1 },
  { id: 'plants_3', label: 'Mini jardin', icon: '🌼', xp: 20, req: (s) => plantedCells(s).length >= 3 },
  { id: 'diversity_5', label: 'Diversité', icon: '🌈', xp: 25, req: (s) => new Set(plantedCells(s).map((c) => c!.plant)).size >= 5 },
  { id: 'xp_100', label: 'Curieux', icon: '⭐', xp: 0, req: (s) => (s.profile?.xp || 0) >= 100 },
  { id: 'xp_300', label: 'Main verte', icon: '🌿', xp: 0, req: (s) => (s.profile?.xp || 0) >= 300 },
  { id: 'streak_7', label: 'Régularité', icon: '🔥', xp: 20, req: (s) => (s.streak || 0) >= 7 },
  { id: 'guide_done', label: 'Bon élève', icon: '📚', xp: 30, req: (s) => (s.profile?.guideSeen || []).length >= 5 },
  { id: 'trees_planted', label: 'Arboriculteur', icon: '🌳', xp: 20, req: (s) => plantedCells(s).some((c) => CATALOG.find((x) => x.id === c!.plant)?.category === 'arbre-fruitier') },
];

export const XP_EVENTS: Record<XpEvent, number> = {
  task_done: 5,
  plant_added: 10,
  journal_entry: 8,
  harvest_done: 15,
  guide_read: 5,
};

// Paliers de progression — affichés dans le widget XP pour motiver.
export const LEVELS: LevelTier[] = [
  { xp: 0, icon: '🔰', label: 'Débutant' },
  { xp: 100, icon: '🌱', label: 'Apprenti' },
  { xp: 300, icon: '🌿', label: 'Main verte' },
  { xp: 600, icon: '🌻', label: 'Confirmé' },
  { xp: 1000, icon: '🏆', label: 'Maître du potager' },
];
