// ============================================================
//  Notifications — natives (Capacitor) avec repli Web Notifications
// ============================================================
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { state, save } from '../state';
import { iso } from '../utils';
import { plantById } from '../data/catalog';

type PermResult = 'granted' | 'denied' | 'unsupported' | 'default';

export async function requestNotificationPermission(): Promise<PermResult> {
  if (Capacitor.isNativePlatform()) {
    try {
      const perm = await LocalNotifications.requestPermissions();
      const granted = perm.display === 'granted';
      state.prefs.pushAsked = true;
      state.prefs.pushOn = granted;
      save();
      return granted ? 'granted' : 'denied';
    } catch {
      /* fall through to web */
    }
  }
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  const result = await Notification.requestPermission();
  state.prefs.pushAsked = true;
  state.prefs.pushOn = result === 'granted';
  save();
  return result as PermResult;
}

export async function sendNotification(title: string, body: string, tag = 'jardin'): Promise<void> {
  const hour = new Date().getHours();
  if (state.prefs?.quiet && (hour < 7 || hour >= 21)) return;

  if (Capacitor.isNativePlatform()) {
    try {
      await LocalNotifications.schedule({
        notifications: [{ title, body, id: Math.floor(Math.random() * 100000), extra: { tag } }],
      });
      return;
    } catch {
      /* fall through to web */
    }
  }
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (!state.prefs?.pushOn) return;
  try {
    new Notification(title, { body, icon: 'icon-192.png', badge: 'icon-192.png', tag });
  } catch {
    /* ignore */
  }
}

export function notifEnabled(): boolean {
  if (Capacitor.isNativePlatform()) return !!state.prefs?.pushOn;
  return 'Notification' in window && Notification.permission === 'granted' && !!state.prefs?.pushOn;
}

export function scheduleWateringChecks(): void {
  if (!notifEnabled()) return;
  const todayStr = iso(new Date());
  const waterTasks = state.tasks.filter((t) => t.kind === 'water' && !t.done && t.date === todayStr);
  if (waterTasks.length) {
    const names = waterTasks.slice(0, 3).map((t) => t.title).join(', ');
    sendNotification('💧 Arrosage du potager', `${waterTasks.length} plante${waterTasks.length > 1 ? 's' : ''} à arroser : ${names}`, 'watering');
  }
  const urgentPlants = state.beds.flatMap((b) => (b.cells || []).filter((c) => c && c.status === 'urgent'));
  if (urgentPlants.length) {
    const pnames = urgentPlants.slice(0, 2).map((c) => plantById(c!.plant)?.name || c!.plant).join(', ');
    sendNotification('🚨 Alerte au jardin', `${urgentPlants.length} plante${urgentPlants.length > 1 ? 's' : ''} urgente${urgentPlants.length > 1 ? 's' : ''} : ${pnames}`, 'urgent');
  }
}

export function initNotificationScheduler(): void {
  if (!notifEnabled()) return;
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 12) scheduleWateringChecks();
  setInterval(() => {
    if (new Date().getHours() === 7) scheduleWateringChecks();
  }, 3600000);
}
