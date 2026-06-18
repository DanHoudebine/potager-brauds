export interface RotationAdvice {
  nextFamilies: string[];   // families to plant next season
  avoidFamilies: string[];  // families to avoid (same family or antagonist)
  reason: string;
}

const ROTATION_MAP: Record<string, RotationAdvice> = {
  'Solanacées': {
    nextFamilies: ['Légumineuses', 'Alliacées'],
    avoidFamilies: ['Solanacées', 'Brassicacées'],
    reason: 'Après solanacées : fixez l\'azote avec des légumineuses.',
  },
  'Brassicacées': {
    nextFamilies: ['Solanacées', 'Cucurbitacées'],
    avoidFamilies: ['Brassicacées', 'Apiacées'],
    reason: 'Les brassicacées épuisent le sol — passez aux solanacées.',
  },
  'Légumineuses': {
    nextFamilies: ['Brassicacées', 'Cucurbitacées'],
    avoidFamilies: ['Légumineuses'],
    reason: 'Les légumineuses enrichissent le sol en azote.',
  },
  'Cucurbitacées': {
    nextFamilies: ['Légumineuses', 'Alliacées'],
    avoidFamilies: ['Cucurbitacées'],
    reason: 'Après cucurbitacées : légumineuses pour régénérer.',
  },
  'Alliacées': {
    nextFamilies: ['Légumineuses', 'Cucurbitacées'],
    avoidFamilies: ['Alliacées'],
    reason: 'Les alliacées nettoient le sol. Suivez avec des légumineuses.',
  },
  'Apiacées': {
    nextFamilies: ['Légumineuses', 'Solanacées'],
    avoidFamilies: ['Apiacées', 'Brassicacées'],
    reason: 'Après apiacées : enrichissez avec des légumineuses.',
  },
  'Astéracées': {
    nextFamilies: ['Légumineuses', 'Solanacées', 'Cucurbitacées'],
    avoidFamilies: ['Astéracées'],
    reason: 'Les astéracées (laitue, endive) sont neutres.',
  },
  'Rosacées': {
    nextFamilies: ['Légumineuses'],
    avoidFamilies: ['Rosacées'],
    reason: 'Évitez de replanter des rosacées au même endroit.',
  },
};

export function getRotationAdvice(family: string): RotationAdvice | null {
  return ROTATION_MAP[family] ?? null;
}

export function getRotationForBed(families: string[]): { advice: RotationAdvice; mainFamily: string } | null {
  // Find the most common family in the bed
  const counts: Record<string, number> = {};
  families.forEach((f) => { if (f) counts[f] = (counts[f] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!sorted.length) return null;
  const mainFamily = sorted[0][0];
  const advice = getRotationAdvice(mainFamily);
  if (!advice) return null;
  return { advice, mainFamily };
}
