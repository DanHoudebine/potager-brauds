// ============================================================
//  Questionnaire d'accueil (onboarding)
// ============================================================
import type { Experience, SkillLevel, SpaceType, RegionId } from '../types';
import { state, save } from '../state';
import { el, qsa, closeModal } from '../ui/dom';
import { REGIONS } from '../data/regions';
import { uid } from '../utils';
import { syncGardenTasks } from '../garden-sync';
import { startTutorial } from './tutorial';
import { requestNotificationPermission } from '../services/notifications';
import { isPro, FREE_MAX_BEDS } from '../services/entitlement';

interface SurveyData {
  experience?: Experience;
  level?: SkillLevel;
  spaceType?: SpaceType;
  region?: RegionId;
}

let surveyData: SurveyData = {};

export function renderSurveyStep(step: number): void {
  qsa<HTMLElement>('.sv-step').forEach((s) => s.classList.toggle('active', Number(s.dataset.step) === step));
  qsa<HTMLElement>('.sv-dot').forEach((d, i) => d.classList.toggle('on', i < step));
}

function selectExperience(level: Experience): void {
  surveyData.experience = level;
  surveyData.level = level === 'lots' ? 'expert' : 'beginner';
  renderSurveyStep(3);
}

function selectSpaceType(type: SpaceType): void {
  surveyData.spaceType = type;
  renderSurveyStep(4);
}

function selectRegion(id: RegionId): void {
  surveyData.region = id;
  buildSurveyResult();
  renderSurveyStep(5);
}

async function handleSurveyNotifRequest(btn: HTMLButtonElement): Promise<void> {
  btn.disabled = true;
  btn.textContent = '⏳ En attente…';
  const result = await requestNotificationPermission();
  if (result === 'granted') {
    btn.textContent = '✓ Notifications activées !';
    btn.style.background = 'var(--green-dark)';
    btn.style.borderColor = 'var(--green-dark)';
  } else if (result === 'denied') {
    btn.textContent = '✗ Bloquées — modifiez dans Paramètres';
    btn.style.background = 'var(--urgent)';
    btn.style.borderColor = 'var(--urgent)';
  } else if (result === 'unsupported') {
    btn.textContent = '⚠️ Non supporté sur cet appareil';
  } else {
    btn.disabled = false;
    btn.textContent = '🔔 Activer les notifications';
  }
}

function buildSurveyResult(): void {
  const isBegin = surveyData.level === 'beginner';
  const spaceLabel = ({ jardin: 'jardin', serre: 'serre', both: 'jardin et serre' } as Record<string, string>)[surveyData.spaceType || ''] || '';
  const region = surveyData.region ? REGIONS.find((r) => r.id === surveyData.region) : null;
  const regionLine = region ? `${region.emoji} ${region.label}` : '';
  const node = el('sv-result-step');
  const backBtn = '<button class="sv-back" data-sv-back="4">‹ Retour</button>';

  if (isBegin) {
    node.innerHTML = `
      ${backBtn}
      <div class="center mb-3"><div style="font-size:60px">🎉</div></div>
      <h2 class="sv-q">Parfait, on s'adapte à vous !</h2>
      <div class="card mt-3" style="background:var(--green-tint);border:none">
        <div class="row gap-2">
          <span style="font-size:28px">🌱</span>
          <div>
            <div style="font-weight:800;margin-bottom:4px">Mode Débutant activé</div>
            <div class="small muted">Guide pas-à-pas · Système d'XP et d'étoiles · Conseils contextuels</div>
          </div>
        </div>
      </div>
      <div class="card mt-3" style="background:var(--earth-tint);border:none">
        <div class="row gap-2">
          <span style="font-size:28px">📚</span>
          <div class="small">Le <b>Guide du Potager</b> est disponible à tout moment dans le menu — il couvre le sol, les semis, l'arrosage, les ravageurs, la récolte et les fruitiers.</div>
        </div>
      </div>
      <div class="card mt-3" style="border:1px solid var(--line)">
        <div class="small muted">Espace : <b>${spaceLabel}</b></div>
        ${regionLine ? `<div class="small muted mt-2">Région : <b>${regionLine}</b></div>` : ''}
      </div>
      <div class="card mt-3 sv-notif-card">
        <div class="row gap-2">
          <span style="font-size:28px">🔔</span>
          <div style="flex:1">
            <div style="font-weight:800;margin-bottom:4px">Activer les rappels</div>
            <div class="small muted">Arrosages, maladies et alertes — ne ratez plus rien.</div>
          </div>
        </div>
        <button class="btn primary mt-3" style="width:100%" id="sv-notif-btn">🔔 Activer les notifications</button>
      </div>
      <button class="btn primary sv-cta mt-4" id="sv-finish-btn">Lancer l'application →</button>`;
  } else {
    node.innerHTML = `
      ${backBtn}
      <div class="center mb-3"><div style="font-size:60px">🏆</div></div>
      <h2 class="sv-q">Bienvenue, expert !</h2>
      <div class="card mt-3" style="background:var(--green-tint);border:none">
        <div class="row gap-2">
          <span style="font-size:28px">🌿</span>
          <div>
            <div style="font-weight:800;margin-bottom:4px">Catalogue complet à explorer</div>
            <div class="small muted">62 plantes · Fiches de culture détaillées · Outils avancés</div>
          </div>
        </div>
      </div>
      <div class="card mt-3" style="border:1px solid var(--line)">
        <div class="small muted">Le Guide reste accessible si besoin depuis le menu 📚<br>Espace : <b>${spaceLabel}</b>${regionLine ? `<br>Région : <b>${regionLine}</b>` : ''}</div>
      </div>
      <div class="card mt-3 sv-notif-card">
        <div class="row gap-2">
          <span style="font-size:28px">🔔</span>
          <div style="flex:1">
            <div style="font-weight:800;margin-bottom:4px">Activer les rappels</div>
            <div class="small muted">Arrosages, alertes maladies et taille des fruitiers.</div>
          </div>
        </div>
        <button class="btn primary mt-3" style="width:100%" id="sv-notif-btn">🔔 Activer les notifications</button>
      </div>
      <button class="btn primary sv-cta mt-4" id="sv-finish-btn">Accéder à l'application →</button>`;
  }

  el<HTMLButtonElement>('sv-notif-btn').addEventListener('click', (e) => handleSurveyNotifRequest(e.currentTarget as HTMLButtonElement));
  el('sv-finish-btn').addEventListener('click', finishSurvey);
  node.querySelector<HTMLElement>('[data-sv-back]')?.addEventListener('click', () => renderSurveyStep(4));
}

function finishSurvey(): void {
  Object.assign(state.profile, {
    surveyed: true,
    level: surveyData.level,
    experience: surveyData.experience,
    spaceType: surveyData.spaceType,
    region: surveyData.region || null,
    xp: 0,
    stars: 0,
    milestones: [],
    tutorialDone: false,
    guideSeen: [],
  });

  // Ajuster les parcelles selon l'espace — sans jamais supprimer une parcelle peuplée.
  const hasPlants = (b: { cells: unknown[] }) => (b.cells || []).some(Boolean);
  if (surveyData.spaceType === 'jardin') {
    state.beds = state.beds.filter((b) => (b.type || 'jardin') === 'jardin' || hasPlants(b));
  } else if (surveyData.spaceType === 'serre') {
    state.beds = state.beds.filter((b) => b.type === 'serre' || hasPlants(b));
    // N'ajoute une serre que s'il reste de la place dans la version gratuite.
    if (!state.beds.some((b) => b.type === 'serre') && (isPro() || state.beds.length < FREE_MAX_BEDS)) {
      state.beds.push({ id: uid('b'), name: 'Serre', type: 'serre', cols: 2, rows: 5, cells: Array(10).fill(null) });
    }
  }
  if (!state.beds.length) {
    state.beds = [{ id: uid('b'), name: 'Jardin', type: 'jardin', cols: 2, rows: 5, cells: Array(10).fill(null) }];
  }
  // Version gratuite : ne conserver que les parcelles autorisées (contenu de
  // démonstration uniquement — aucune donnée utilisateur n'est créée ici).
  if (!isPro() && state.beds.length > FREE_MAX_BEDS) {
    state.beds = state.beds.slice(0, FREE_MAX_BEDS);
  }
  if (!state.beds.find((b) => b.id === state.activeBedId)) state.activeBedId = state.beds[0].id;
  state.gardenTab = surveyData.spaceType === 'both' ? 'all' : surveyData.spaceType || 'all';
  state.onboarded = true;
  syncGardenTasks();
  save();
  closeModal('survey-backdrop');
  setTimeout(() => startTutorial(), 400);
}

/** Wire the survey choice buttons. Call once at boot. */
export function initSurvey(): void {
  qsa<HTMLElement>('[data-sv-next]').forEach((b) => b.addEventListener('click', () => renderSurveyStep(Number(b.dataset.svNext))));
  qsa<HTMLElement>('[data-sv-back]').forEach((b) => b.addEventListener('click', () => renderSurveyStep(Number(b.dataset.svBack))));
  qsa<HTMLElement>('[data-sv-exp]').forEach((b) => b.addEventListener('click', () => selectExperience(b.dataset.svExp as Experience)));
  qsa<HTMLElement>('[data-sv-space]').forEach((b) => b.addEventListener('click', () => selectSpaceType(b.dataset.svSpace as SpaceType)));
  qsa<HTMLElement>('[data-sv-region]').forEach((b) => b.addEventListener('click', () => selectRegion(b.dataset.svRegion as RegionId)));
}

export function maybeStartSurvey(): void {
  if (!state.profile || !state.profile.surveyed) {
    surveyData = {};
    renderSurveyStep(1);
    openSurvey();
  }
}

function openSurvey(): void {
  el('survey-backdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}
