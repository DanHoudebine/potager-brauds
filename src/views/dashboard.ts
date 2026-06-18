// ============================================================
//  Tableau de bord
// ============================================================
import { state } from '../state';
import { el, elOpt } from '../ui/dom';
import { escapeHTML, iso, addDays } from '../utils';
import { plantById } from '../data/catalog';
import { getUser } from '../services/auth';
import { fetchWeather, renderWeatherWidget, hasFrostRisk } from '../features/weather';
import { getMoonPhase } from '../data/moonPhase';
import { renderXPWidget } from '../features/xp';
import { updateNavBadges } from '../ui/router';
import { renderTasks } from './tasks';

interface Alert {
  kind: 'urgent' | 'warn' | 'green';
  icon: string;
  text: string;
  act: string;
}

export function renderDashboard(): void {
  const today = new Date();
  el('today-date').textContent = today.toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' });

  const hour = today.getHours();
  const greet = hour < 6 ? 'Bonne nuit' : hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const userName = getUser() ? (getUser()!.displayName || '').split(' ')[0] : '';
  el('greeting').textContent = userName ? `${greet}, ${userName} 👋` : `${greet} 👋`;

  const heroDeco = elOpt('hero-deco');
  if (heroDeco) heroDeco.textContent = hour < 7 ? '🌙' : hour < 12 ? '☀️' : hour < 18 ? '🌻' : '🌿';

  const urgentCount = state.beds.flatMap((b) => (b.cells || []).filter((c) => c && c.status === 'urgent')).length;
  const greetSub = elOpt('greet-sub');
  if (greetSub) {
    if (urgentCount > 0) {
      greetSub.textContent = `🚨 ${urgentCount} plante${urgentCount > 1 ? 's' : ''} nécessite${urgentCount > 1 ? 'nt' : ''} votre attention !`;
    } else if ((state.streak || 0) >= 7) {
      greetSub.textContent = `🔥 ${state.streak} jours de suite — continuez comme ça !`;
    } else {
      greetSub.textContent = 'Tout va bien dans votre potager. 🌱';
    }
  }

  void fetchWeather();
  renderWeatherWidget();
  renderMoonWidget();
  updateNavBadges();
  renderXPWidget();

  // Alertes
  const beds = state.beds;
  const alerts: Alert[] = [];
  const urgentCells = beds.flatMap((b) => (b.cells || []).filter((c) => c && c.status === 'urgent'));
  const warnCells = beds.flatMap((b) => (b.cells || []).filter((c) => c && c.status === 'warn'));
  if (hasFrostRisk()) {
    alerts.unshift({ kind: 'urgent', icon: '❄️', text: 'Gel prévu — couvrez vos plants fragiles cette nuit', act: 'PROTÉGER' });
  }
  urgentCells.slice(0, 2).forEach((c) => {
    const p = plantById(c!.plant);
    alerts.push({ kind: 'urgent', icon: '🐛', text: `${p ? p.name : c!.plant} demande de l'attention — ${c!.notes || 'intervention urgente'}`, act: 'TRAITER' });
  });
  warnCells.slice(0, 1).forEach((c) => {
    const p = plantById(c!.plant);
    alerts.push({ kind: 'warn', icon: '⚠️', text: `${p ? p.name : c!.plant} montre des signes de stress — à vérifier`, act: 'VÉRIFIER' });
  });
  if (!urgentCells.length) alerts.push({ kind: 'green', icon: '☀️', text: "Fenêtre météo parfaite pour semer aujourd'hui", act: 'SEMER' });
  el('alerts-list').innerHTML = alerts
    .slice(0, 3)
    .map((a) => `<div class="alert ${a.kind}"><span class="ai">${a.icon}</span><span>${escapeHTML(a.text)}</span><span class="act">${a.act}</span></div>`)
    .join('');

  // Stats
  const todayStr = iso(today);
  el('stat-plants').textContent = String(beds.flatMap((b) => (b.cells || []).filter(Boolean)).length);
  el('stat-water').textContent = String(state.tasks.filter((t) => t.kind === 'water' && !t.done && t.date === todayStr).length);
  el('stat-harvest').textContent = String(state.tasks.filter((t) => t.kind === 'harvest' && !t.done).length);
  el('stat-streak').textContent = `${state.streak}j`;

  renderTasks(state.tasks.filter((t) => t.date === todayStr));
  renderWeekGlance(today);
}

function renderMoonWidget(): void {
  const node = elOpt('moon-widget');
  if (!node) return;
  const moon = getMoonPhase(new Date());
  node.style.display = '';
  node.innerHTML = `
    <div class="moon-card">
      <div class="moon-emoji">${moon.emoji}</div>
      <div class="moon-body">
        <div class="moon-label">${moon.label}</div>
        <div class="moon-activity">🌱 ${moon.activity}</div>
        <div class="moon-tip xsmall muted">${moon.tip}</div>
      </div>
    </div>`;
}

function renderWeekGlance(today: Date): void {
  const node = el('week-glance');
  const kindMeta: Record<string, { icon: string; color: string }> = {
    water: { icon: '💧', color: 'green' },
    sow: { icon: '🌱', color: 'green' },
    harvest: { icon: '🥕', color: 'earth' },
    treat: { icon: '🛡️', color: 'urgent' },
  };
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(today, i);
    const ds = iso(d);
    const tasks = state.tasks.filter((t) => t.date === ds);
    const chips = (['water', 'sow', 'harvest', 'treat'] as const)
      .map((k) => {
        const n = tasks.filter((t) => t.kind === k).length;
        return n ? `<span class="chip ${kindMeta[k].color}" style="padding:1px 7px;font-size:11px">${kindMeta[k].icon} ${n}</span>` : '';
      })
      .join('');
    out.push(`<div class="card" style="flex:none;min-width:130px;padding:12px">
      <div class="xsmall muted" style="font-weight:800;text-transform:uppercase;letter-spacing:.06em">${d.toLocaleDateString('fr-FR', { weekday: 'short' })} ${d.getDate()}</div>
      <div style="font-family:var(--serif);font-size:22px;font-weight:600;margin-top:2px">${tasks.length}</div>
      <div class="row gap-2 mt-2">${chips}</div>
    </div>`);
  }
  node.innerHTML = out.join('');
}
