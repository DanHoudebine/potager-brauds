export interface MoonDay {
  phase: number;     // 0-7
  emoji: string;
  label: string;
  activity: string;  // gardening recommendation
  tip: string;       // short tip
}

export function getMoonPhase(date: Date): MoonDay {
  // Julian date
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const jd = 367 * y
    - Math.floor(7 * (y + Math.floor((m + 9) / 12)) / 4)
    + Math.floor(275 * m / 9)
    + d + 1721013.5;
  // Days since known new moon (Jan 6, 2000 = JD 2451549.5)
  let days = (jd - 2451549.5) % 29.530588853;
  if (days < 0) days += 29.530588853;
  const phase = Math.round(days / 29.530588853 * 8) % 8;

  const PHASES: Omit<MoonDay, 'phase'>[] = [
    { emoji: '🌑', label: 'Nouvelle lune',            activity: 'Repos du jardin',        tip: 'Évitez de planter, laissez la terre se reposer.' },
    { emoji: '🌒', label: 'Premier croissant',         activity: 'Semer les feuilles',     tip: 'Idéal pour semer laitue, épinards et salades.' },
    { emoji: '🌓', label: 'Premier quartier',          activity: 'Planter & repiquer',     tip: 'Excellent moment pour repiquer et transplanter.' },
    { emoji: '🌔', label: 'Gibbeuse croissante',       activity: 'Arroser & fertiliser',   tip: 'La sève monte — arrosez et apportez du compost.' },
    { emoji: '🌕', label: 'Pleine lune',               activity: 'Récolter & cueillir',    tip: 'Les fruits et légumes sont à leur maximum de saveur.' },
    { emoji: '🌖', label: 'Gibbeuse décroissante',     activity: 'Tailler & élaguer',      tip: 'Les plaies cicatrisent mieux avec la lune décroissante.' },
    { emoji: '🌗', label: 'Dernier quartier',          activity: 'Travailler le sol',      tip: 'Bêchez, désherbez et amendez la terre.' },
    { emoji: '🌘', label: 'Dernier croissant',         activity: 'Déchaumage & compost',   tip: 'Préparez le compost, récoltez les tubercules.' },
  ];
  return { phase, ...PHASES[phase] };
}
