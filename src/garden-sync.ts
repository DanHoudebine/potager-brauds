// ============================================================
//  Synchronisation jardin → tâches / calendrier
//   1. Purge des tâches liées à des plantes retirées.
//   2. Génération auto des arrosages (7 jours) selon waterEvery.
// ============================================================
import { state, save } from './state';
import { plantById } from './data/catalog';
import { iso, parseISO, addDays, daysBetween, uid } from './utils';
import { isPro } from './services/entitlement';

// Semis échelonnés (Pro) : intervalle de re-semis (en jours) pour les cultures
// à récolte continue. Un rappel « Ressemer » est généré au prochain créneau.
const SUCCESSION_DAYS: Record<string, number> = {
  lettuce: 21, radish: 14, carrot: 21, beans: 21, turnip: 21,
  spinach: 21, beetroot: 21, 'lambs-lettuce': 21, pea: 21,
};

export function syncGardenTasks(): void {
  const todayStr = iso(new Date());
  const present = new Set(
    state.beds.flatMap((b) => (b.cells || []).filter(Boolean).map((c) => c!.plant))
  );

  state.tasks = (state.tasks || []).filter((t) => {
    if (t.done) return true; // historique conservé
    if (t.auto && t.kind === 'sow' && !isPro()) return false; // rappels semis échelonnés = Pro
    if (t.auto && t.date < todayStr) return false; // tâche auto expirée
    if (t.plantId && !present.has(t.plantId)) return false; // plante retirée
    return true;
  });

  const keys = new Set(state.tasks.map((t) => `${t.plantId}|${t.kind}|${t.date}`));
  const today = new Date();
  state.beds.forEach((bed) =>
    (bed.cells || []).filter(Boolean).forEach((cell) => {
      const p = plantById(cell!.plant);
      if (!p || !p.waterEvery) return;
      const plantedAt = parseISO(cell!.planted);
      for (let i = 0; i < 7; i++) {
        const d = parseISO(iso(addDays(today, i)));
        const age = daysBetween(plantedAt, d);
        if (age <= 0 || age % p.waterEvery !== 0) continue;
        const key = `${p.id}|water|${iso(d)}`;
        if (keys.has(key)) continue;
        keys.add(key);
        state.tasks.push({ id: uid('t'), title: `Arroser : ${p.name}`, kind: 'water', date: iso(d), done: false, plantId: p.id, auto: true });
      }
    })
  );

  // Semis échelonnés (Pro) : un rappel « Ressemer » au prochain créneau (≤ 35 j).
  if (isPro()) {
    state.beds.forEach((bed) =>
      (bed.cells || []).filter(Boolean).forEach((cell) => {
        const interval = SUCCESSION_DAYS[cell!.plant];
        const p = plantById(cell!.plant);
        if (!interval || !p) return;
        const plantedAt = parseISO(cell!.planted);
        for (let i = 1; i <= 35; i++) {
          const d = parseISO(iso(addDays(today, i)));
          const age = daysBetween(plantedAt, d);
          if (age <= 0 || age % interval !== 0) continue;
          const key = `${p.id}|sow|${iso(d)}`;
          if (!keys.has(key)) {
            keys.add(key);
            state.tasks.push({ id: uid('t'), title: `Ressemer : ${p.name} (récolte continue)`, kind: 'sow', date: iso(d), done: false, plantId: p.id, auto: true });
          }
          break; // un seul prochain rappel par plante
        }
      })
    );
  }

  save();
}
