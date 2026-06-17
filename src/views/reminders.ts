// ============================================================
//  Rappels — récurrents + préférences de notification
// ============================================================
import { state, save } from '../state';
import { el, qsa, openModal, closeModal, confirmDialog, flash } from '../ui/dom';
import { escapeHTML, uid } from '../utils';
import { requestNotificationPermission, initNotificationScheduler } from '../services/notifications';

export function renderReminders(): void {
  const wrap = el('push-prompt-wrap');
  const hasNotif = 'Notification' in window;
  const notifGranted = hasNotif && Notification.permission === 'granted';
  const notifDenied = hasNotif && Notification.permission === 'denied';

  if (!state.prefs.pushAsked && !notifGranted) {
    wrap.innerHTML = `<div class="push-prompt-active"><span class="pi">🔔</span><div class="pb"><div class="pt">Activer les notifications</div><div class="ps">Arrosage, gel, ravageurs — soyez alerté au bon moment.</div></div></div><div class="row gap-2 mb-4"><button class="btn primary" id="push-enable" style="flex:1">Activer</button><button class="btn ghost" id="push-skip">Plus tard</button></div>`;
    el('push-enable').onclick = async () => {
      const result = await requestNotificationPermission();
      if (result === 'granted') {
        flash('Notifications activées ✓');
        initNotificationScheduler();
      } else if (result === 'denied') {
        flash('Bloquées — vérifiez les paramètres du navigateur');
      }
      renderReminders();
    };
    el('push-skip').onclick = () => {
      state.prefs.pushAsked = true;
      save();
      renderReminders();
    };
  } else if (notifDenied) {
    wrap.innerHTML = `<div class="push-prompt" style="background:var(--urgent-tint);border-color:#f0bdb9;color:var(--urgent)"><span class="pi">🔕</span><div class="pb"><div class="pt">Notifications bloquées</div><div class="small">Autorisez-les dans les paramètres de votre navigateur.</div></div></div>`;
  } else if (notifGranted) {
    wrap.innerHTML = `<div class="push-prompt" style="border-color:#c6e1bd"><span class="pi">✓</span><div class="pb"><div class="pt" style="color:var(--green-dark)">Notifications actives</div><div class="small muted">Vous recevrez les rappels arrosage et alertes maladies.</div></div></div>`;
  } else {
    wrap.innerHTML = '';
  }

  const list = el('reminders-list');
  if (!(state.reminders || []).length) {
    list.innerHTML = `<div class="empty"><div class="ei">⏰</div><h3>Aucun rappel</h3><p>Créez votre premier rappel récurrent.</p><button class="btn primary" id="empty-rem">+ Nouveau rappel</button></div>`;
    el('empty-rem').onclick = openReminderModal;
  } else {
    list.innerHTML = (state.reminders || [])
      .map(
        (r) => `
      <div class="reminder">
        <div class="ri">${r.icon}</div>
        <div class="rb"><div class="rt">${escapeHTML(r.title)}</div><div class="rs">${escapeHTML(r.schedule)}</div></div>
        <button class="btn ghost sm danger" data-rdel="${r.id}" aria-label="Supprimer">🗑️</button>
        <div class="toggle ${r.on ? 'on' : ''}" data-rid="${r.id}" role="switch" aria-checked="${r.on}" tabindex="0"></div>
      </div>`
      )
      .join('');

    qsa<HTMLElement>('[data-rid]', list).forEach((node) => {
      const toggle = () => {
        const r = (state.reminders || []).find((x) => x.id === node.dataset.rid);
        if (r) {
          r.on = !r.on;
          node.classList.toggle('on', r.on);
          node.setAttribute('aria-checked', String(r.on));
          save();
        }
      };
      node.addEventListener('click', toggle);
      node.addEventListener('keydown', (e) => {
        const ke = e as KeyboardEvent;
        if (ke.key === ' ' || ke.key === 'Enter') {
          e.preventDefault();
          toggle();
        }
      });
    });
    qsa<HTMLElement>('[data-rdel]', list).forEach((node) =>
      node.addEventListener('click', () => {
        const id = node.dataset.rdel;
        const r = (state.reminders || []).find((x) => x.id === id);
        confirmDialog({
          title: `Supprimer « ${r ? r.title : '?'} » ?`,
          msg: 'Ce rappel cessera immédiatement.',
          yesLabel: 'Oui, supprimer',
          onYes: () => {
            state.reminders = (state.reminders || []).filter((x) => x.id !== id);
            save();
            renderReminders();
          },
        });
      })
    );
  }

  qsa<HTMLElement>('[data-pref]').forEach((node) => {
    const key = node.dataset.pref!;
    node.classList.toggle('on', !!state.prefs[key]);
    node.onclick = () => {
      state.prefs[key] = !state.prefs[key];
      node.classList.toggle('on', state.prefs[key]);
      save();
    };
  });
}

export function openReminderModal(): void {
  openModal('reminder-modal-backdrop');
}

function saveReminder(): void {
  const title = el<HTMLInputElement>('reminder-title').value.trim();
  if (!title) {
    flash('Donnez un titre au rappel');
    return;
  }
  const schedule = el<HTMLSelectElement>('reminder-freq').value;
  const icon = el<HTMLSelectElement>('reminder-icon').value;
  state.reminders = state.reminders || [];
  state.reminders.push({ id: uid('r'), title, schedule, icon, on: true });
  save();
  closeModal('reminder-modal-backdrop');
  renderReminders();
  flash('Rappel créé ✓');
}

/** Wire reminder toolbar + modal. Call once at boot. */
export function initReminders(): void {
  el('new-reminder-btn').addEventListener('click', openReminderModal);
  el('reminder-modal-close').addEventListener('click', () => closeModal('reminder-modal-backdrop'));
  el('reminder-modal-cancel').addEventListener('click', () => closeModal('reminder-modal-backdrop'));
  el('reminder-modal-save').addEventListener('click', saveReminder);
}
