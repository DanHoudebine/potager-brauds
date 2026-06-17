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
