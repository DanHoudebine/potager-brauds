// ============================================================
//  Synchronisation jardin → tâches / calendrier
//   1. Purge des tâches liées à des plantes retirées.
//   2. Génération auto des arrosages (7 jours) selon waterEvery.
// ============================================================
import { state, save } from './state';
import { plantById } from './data/catalog';
import { iso, parseISO, addDays, daysBetween, uid } from './utils';

export function syncGardenTasks(): void {
  const todayStr = iso(new Date());
  const present = new Set(
    state.beds.flatMap((b) => (b.cells || []).filter(Boolean).map((c) => c!.plant))
  );

  state.tasks = (state.tasks || []).filter((t) => {
    if (t.done) return true; // historique conservé
    if (t.auto && t.date < todayStr) return false; // arrosage auto expiré
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
  save();
}
