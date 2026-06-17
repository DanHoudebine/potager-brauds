// ============================================================
//  Types — Jardin de Poche
// ============================================================

export type Category = 'legume' | 'herbe' | 'fruit' | 'arbre-fruitier';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Difficulty = 1 | 2 | 3;
export type RegionId = 'nord' | 'idf' | 'ocean' | 'sudouest' | 'med' | 'est' | 'montagne';
export type CellStatus = 'healthy' | 'warn' | 'urgent';
export type BedType = 'jardin' | 'serre';
export type TaskKind = 'water' | 'sow' | 'harvest' | 'treat' | 'other';
export type Severity = 'high' | 'medium' | 'low';
export type SkillLevel = 'beginner' | 'expert';
export type Experience = 'none' | 'some' | 'lots';
export type SpaceType = 'jardin' | 'serre' | 'both';
export type GardenTab = 'all' | 'jardin' | 'serre';
export type XpEvent = 'task_done' | 'plant_added' | 'journal_entry' | 'harvest_done' | 'guide_read';

export interface Plant {
  id: string;
  name: string;
  sci: string;
  icon: string;
  category: Category;
  family: string;
  season: Season[];
  difficulty: Difficulty;
  sow: string;
  plant: string;
  harvest: string;
  space: string;
  companions: string[];
  waterEvery: number;
  tip: string;
  varieties: string[];
}

export interface Region {
  id: RegionId;
  emoji: string;
  label: string;
  desc: string;
}

export interface WeatherCodeInfo {
  icon: string;
  label: string;
}

export interface WeatherState {
  fetched: number;
  lat: number;
  lon: number;
  temp: number;
  rain: number;
  code: number;
  wind: number;
}

export interface SymptomCause {
  name: string;
  signs: string;
  treat: string;
  sev: Severity;
}

export interface Symptom {
  id: string;
  icon: string;
  label: string;
  causes: SymptomCause[];
}

export interface Milestone {
  id: string;
  label: string;
  icon: string;
  xp: number;
  req: (s: AppState) => boolean;
}

export interface LevelTier {
  xp: number;
  icon: string;
  label: string;
}

export interface Companion {
  icon: string;
  plant: string;
  good: string[];
  avoid: string[];
}

export interface CompanionFlower {
  icon: string;
  name: string;
  role: string;
}

export interface GuideSection {
  id: string;
  icon: string;
  title: string;
  color: 'earth' | 'green' | 'urgent';
  type?: 'companion';
  tips: string[];
}

export interface TutorialStep {
  sel: string;
  title: string;
  text: string;
}

export interface Cell {
  id: string;
  plant: string;
  planted: string;
  status: CellStatus;
  notes: string;
}

export interface Bed {
  id: string;
  name: string;
  type: BedType;
  cols: number;
  rows: number;
  cells: (Cell | null)[];
}

export interface Task {
  id: string;
  title: string;
  kind: TaskKind;
  date: string;
  done: boolean;
  plantId: string | null;
  auto?: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  subject: string;
  icon: string;
  text: string;
  tags: string[];
  photo?: string;
}

export interface Reminder {
  id: string;
  title: string;
  schedule: string;
  icon: string;
  on: boolean;
}

export interface Prefs {
  digest: boolean;
  weather: boolean;
  quiet: boolean;
  pushAsked: boolean;
  pushOn: boolean;
  darkMode: boolean;
  ambientOn: boolean;
  alertMildiou: boolean;
  alertTraitement: boolean;
  alertParasite: boolean;
  alertTaille: boolean;
  alertTraitementArbo: boolean;
  alertGreffage: boolean;
  [key: string]: boolean;
}

export interface Profile {
  surveyed: boolean;
  level: SkillLevel | null;
  experience: Experience | null;
  spaceType: SpaceType | null;
  xp: number;
  stars: number;
  milestones: string[];
  tutorialDone: boolean;
  guideSeen: string[];
  region: RegionId | null;
}

export interface Draft {
  type: string;
  fields: Record<string, string>;
  ts: number;
}

export interface ShoppingItem {
  text: string;
  done: boolean;
}

export interface AppState {
  profile: Profile;
  beds: Bed[];
  activeBedId: string | null;
  tasks: Task[];
  journal: JournalEntry[];
  reminders: Reminder[];
  prefs: Prefs;
  onboarded: boolean;
  gardenTab: GardenTab;
  draft: Draft | null;
  streak: number;
  weather: WeatherState | null;
  shopping: ShoppingItem[];
}
