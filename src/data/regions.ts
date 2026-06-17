import type { Region, RegionId } from '../types';

export const REGIONS: Region[] = [
  { id: 'nord', emoji: '🌧️', label: 'Nord & Bretagne', desc: 'Frais, pluvieux, hivers doux' },
  { id: 'idf', emoji: '☁️', label: 'Île-de-France & Centre', desc: 'Tempéré, variable, été chaud' },
  { id: 'ocean', emoji: '🌊', label: 'Grand Ouest & Atlantique', desc: 'Océanique, doux, humide' },
  { id: 'sudouest', emoji: '☀️', label: 'Sud-Ouest & Occitanie', desc: 'Chaud et humide en été' },
  { id: 'med', emoji: '🌞', label: 'Méditerranée & PACA', desc: "Très chaud et sec l'été" },
  { id: 'est', emoji: '🌡️', label: 'Est & Rhône-Alpes', desc: 'Continental, hivers froids' },
  { id: 'montagne', emoji: '⛰️', label: 'Montagne', desc: 'Été court, gel possible tardif' },
];

export function regionById(id: RegionId | null | undefined): Region | undefined {
  return id ? REGIONS.find((r) => r.id === id) : undefined;
}

/** Taux de réussite (%) par plante et par région climatique. */
export const REGION_DATA: Record<string, Record<RegionId, number>> = {
  tomato: { nord: 65, idf: 75, ocean: 78, sudouest: 90, med: 95, est: 78, montagne: 50 },
  basil: { nord: 55, idf: 68, ocean: 72, sudouest: 88, med: 95, est: 70, montagne: 38 },
  lettuce: { nord: 85, idf: 88, ocean: 88, sudouest: 80, med: 72, est: 85, montagne: 78 },
  carrot: { nord: 88, idf: 90, ocean: 88, sudouest: 85, med: 78, est: 88, montagne: 80 },
  zucchini: { nord: 68, idf: 80, ocean: 82, sudouest: 92, med: 90, est: 80, montagne: 58 },
  leek: { nord: 92, idf: 88, ocean: 88, sudouest: 82, med: 70, est: 85, montagne: 82 },
  strawberry: { nord: 82, idf: 85, ocean: 85, sudouest: 85, med: 80, est: 82, montagne: 72 },
  radish: { nord: 88, idf: 90, ocean: 90, sudouest: 85, med: 78, est: 88, montagne: 82 },
  pepper: { nord: 52, idf: 65, ocean: 68, sudouest: 88, med: 95, est: 68, montagne: 38 },
  eggplant: { nord: 48, idf: 60, ocean: 65, sudouest: 85, med: 95, est: 62, montagne: 32 },
  pea: { nord: 85, idf: 85, ocean: 88, sudouest: 80, med: 70, est: 82, montagne: 78 },
  pumpkin: { nord: 65, idf: 78, ocean: 80, sudouest: 88, med: 88, est: 78, montagne: 55 },
  'squash-spaghetti': { nord: 62, idf: 75, ocean: 78, sudouest: 88, med: 88, est: 75, montagne: 52 },
  butternut: { nord: 60, idf: 72, ocean: 75, sudouest: 90, med: 92, est: 75, montagne: 50 },
  'pumpkin-marron': { nord: 60, idf: 72, ocean: 75, sudouest: 88, med: 88, est: 75, montagne: 50 },
  chili: { nord: 48, idf: 60, ocean: 65, sudouest: 85, med: 95, est: 65, montagne: 35 },
  'sweet-potato': { nord: 38, idf: 52, ocean: 58, sudouest: 82, med: 92, est: 55, montagne: 28 },
  gherkin: { nord: 60, idf: 72, ocean: 75, sudouest: 88, med: 90, est: 72, montagne: 50 },
  'red-cabbage': { nord: 90, idf: 88, ocean: 85, sudouest: 80, med: 70, est: 85, montagne: 80 },
  cabbage: { nord: 92, idf: 88, ocean: 88, sudouest: 80, med: 68, est: 85, montagne: 82 },
  beans: { nord: 68, idf: 78, ocean: 82, sudouest: 88, med: 90, est: 80, montagne: 58 },
  watermelon: { nord: 32, idf: 45, ocean: 50, sudouest: 75, med: 95, est: 52, montagne: 18 },
  melon: { nord: 38, idf: 52, ocean: 58, sudouest: 82, med: 95, est: 58, montagne: 22 },
  mirabelle: { nord: 70, idf: 80, ocean: 75, sudouest: 85, med: 78, est: 92, montagne: 62 },
  'reine-claude': { nord: 68, idf: 78, ocean: 75, sudouest: 88, med: 80, est: 90, montagne: 60 },
  quetsche: { nord: 72, idf: 80, ocean: 78, sudouest: 85, med: 75, est: 92, montagne: 68 },
  apple: { nord: 82, idf: 85, ocean: 82, sudouest: 80, med: 65, est: 88, montagne: 72 },
  pear: { nord: 78, idf: 82, ocean: 80, sudouest: 82, med: 70, est: 85, montagne: 68 },
  cherry: { nord: 72, idf: 78, ocean: 75, sudouest: 82, med: 88, est: 85, montagne: 65 },
  peach: { nord: 42, idf: 58, ocean: 62, sudouest: 82, med: 95, est: 72, montagne: 42 },
  nectarine: { nord: 38, idf: 55, ocean: 58, sudouest: 80, med: 95, est: 68, montagne: 38 },
  apricot: { nord: 38, idf: 52, ocean: 55, sudouest: 78, med: 95, est: 65, montagne: 35 },
};
