import type { Companion, CompanionFlower } from '../types';

// Compagnonnage : pour chaque légume, les bons voisins (✓) et ceux à éviter (✗).
export const COMPANION_DATA: Companion[] = [
  { icon: '🍅', plant: 'Tomate', good: ['Basilic', "Œillet d'Inde", 'Carotte', 'Persil', 'Oignon', 'Ail', 'Capucine'], avoid: ['Pomme de terre', 'Chou', 'Fenouil', 'Concombre'] },
  { icon: '🥕', plant: 'Carotte', good: ['Oignon', 'Poireau', 'Radis', 'Laitue', 'Tomate', 'Romarin'], avoid: ['Aneth', 'Persil', 'Betterave'] },
  { icon: '🥬', plant: 'Laitue', good: ['Carotte', 'Radis', 'Fraisier', 'Concombre', 'Betterave'], avoid: ['Persil', 'Tournesol'] },
  { icon: '🥒', plant: 'Courgette', good: ['Capucine', 'Maïs', 'Haricot', "Œillet d'Inde", 'Bourrache'], avoid: ['Pomme de terre', 'Concombre'] },
  { icon: '🧅', plant: 'Oignon / Poireau', good: ['Carotte', 'Betterave', 'Laitue', 'Fraisier', 'Tomate'], avoid: ['Pois', 'Haricot', 'Chou'] },
  { icon: '🫘', plant: 'Haricot', good: ['Maïs', 'Courge', 'Carotte', 'Concombre', 'Capucine'], avoid: ['Oignon', 'Ail', 'Poireau', 'Fenouil'] },
  { icon: '🟢', plant: 'Petit pois', good: ['Carotte', 'Radis', 'Concombre', 'Maïs', 'Navet'], avoid: ['Oignon', 'Ail', 'Échalote'] },
  { icon: '🥬', plant: 'Chou', good: ['Aneth', 'Camomille', 'Céleri', 'Bourrache', 'Capucine', 'Romarin'], avoid: ['Tomate', 'Fraisier', 'Oignon'] },
  { icon: '🍓', plant: 'Fraisier', good: ['Laitue', 'Épinard', 'Bourrache', 'Ail', 'Haricot'], avoid: ['Chou', 'Tomate'] },
  { icon: '🥔', plant: 'Pomme de terre', good: ['Haricot', 'Maïs', 'Chou', 'Capucine', "Œillet d'Inde"], avoid: ['Tomate', 'Courge', 'Concombre'] },
  { icon: '🌶️', plant: 'Poivron / Piment', good: ['Basilic', 'Tomate', 'Carotte', 'Oignon'], avoid: ['Haricot', 'Fenouil'] },
  { icon: '🟠', plant: 'Radis', good: ['Laitue', 'Carotte', 'Petit pois', 'Concombre', 'Épinard'], avoid: ['Hysope'] },
  { icon: '🎃', plant: 'Courge / Citrouille', good: ['Maïs', 'Haricot', 'Capucine', 'Bourrache'], avoid: ['Pomme de terre'] },
  { icon: '🌿', plant: 'Basilic', good: ['Tomate', 'Poivron', 'Aubergine', 'Courgette'], avoid: ['Concombre', 'Rue'] },
];

// Fleurs et aromatiques alliées du potager (compagnonnage utile partout).
export const COMPANION_FLOWERS: CompanionFlower[] = [
  { icon: '🌼', name: "Œillet d'Inde", role: 'Repousse nématodes et pucerons. À semer entre tomates, choux, pommes de terre.' },
  { icon: '🌺', name: 'Capucine', role: "Plante-piège à pucerons : ils s'y concentrent et épargnent les légumes." },
  { icon: '💙', name: 'Bourrache', role: 'Attire les pollinisateurs, éloigne la piéride du chou et les limaces.' },
  { icon: '🟡', name: 'Souci (calendula)', role: 'Attire syrphes et coccinelles, prédateurs des pucerons.' },
  { icon: '💜', name: 'Lavande', role: 'Éloigne pucerons et fourmis, attire abeilles. Idéale en bordure.' },
];

// ── Mauvaises associations (compagnonnage) par identifiant de catalogue ──
//  Couples de plantes à ÉVITER côte à côte. Établis à partir de COMPANION_DATA
//  mais exprimés par id de catalogue → repérage fiable, sans correspondance floue.
const INCOMPATIBLE: [string, string][] = [
  ['tomato', 'potato'], ['tomato', 'cabbage'], ['tomato', 'red-cabbage'],
  ['tomato', 'fennel'], ['tomato', 'cucumber'],
  ['carrot', 'parsley'], ['carrot', 'beetroot'],
  ['lettuce', 'parsley'],
  ['zucchini', 'potato'], ['zucchini', 'cucumber'],
  ['onion', 'pea'], ['onion', 'beans'], ['onion', 'cabbage'], ['onion', 'red-cabbage'],
  ['leek', 'pea'], ['leek', 'beans'], ['leek', 'cabbage'], ['leek', 'red-cabbage'],
  ['beans', 'garlic'], ['beans', 'fennel'],
  ['pea', 'garlic'], ['pea', 'shallot'],
  ['cabbage', 'strawberry'], ['red-cabbage', 'strawberry'],
  ['potato', 'cucumber'], ['potato', 'pumpkin'], ['potato', 'squash-spaghetti'],
  ['potato', 'butternut'], ['potato', 'pumpkin-marron'],
  ['pepper', 'beans'], ['pepper', 'fennel'],
  ['chili', 'beans'], ['chili', 'fennel'],
  ['basil', 'cucumber'],
];

const pairKey = (a: string, b: string): string => (a < b ? `${a}|${b}` : `${b}|${a}`);
const INCOMPATIBLE_SET = new Set(INCOMPATIBLE.map(([a, b]) => pairKey(a, b)));

/** Deux plantes (par id de catalogue) sont-elles de mauvaises voisines ? */
export function areIncompatible(idA: string, idB: string): boolean {
  return INCOMPATIBLE_SET.has(pairKey(idA, idB));
}

/** Paires de mauvaises voisines présentes parmi une liste d'ids de plantes. */
export function findBadPairs(plantIds: string[]): [string, string][] {
  const uniq = Array.from(new Set(plantIds));
  const out: [string, string][] = [];
  for (let i = 0; i < uniq.length; i++) {
    for (let j = i + 1; j < uniq.length; j++) {
      if (areIncompatible(uniq[i], uniq[j])) out.push([uniq[i], uniq[j]]);
    }
  }
  return out;
}
