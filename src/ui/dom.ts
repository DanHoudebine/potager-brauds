// ============================================================
//  DOM helpers — selectors, toast, modals, confirm dialog
// ============================================================

/** Get an element by id; throws if missing (catches wiring bugs early). */
export function el<T extends HTMLElement = HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Élément #${id} introuvable`);
  return node as T;
}

/** Get an element by id, or null if absent. */
export function elOpt<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

export function qs<T extends Element = Element>(sel: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(sel);
}

export function qsa<T extends Element = Element>(sel: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(sel));
}

// ---- Toast ---------------------------------------------------
let toastEl: HTMLElement | null = null;
let toastTimer: ReturnType<typeof setTimeout> | undefined;

export function flash(msg: string): void {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = '_toast';
    toastEl.style.cssText =
      'position:fixed;left:50%;bottom:calc(var(--bottom-h) + 24px + env(safe-area-inset-bottom));transform:translate(-50%,20px);background:var(--ink);color:var(--bg);padding:10px 16px;border-radius:999px;font-size:13px;font-weight:700;box-shadow:var(--shadow-lg);opacity:0;transition:transform .25s,opacity .25s;z-index:300;pointer-events:none;white-space:nowrap;';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  requestAnimationFrame(() => {
    if (!toastEl) return;
    toastEl.style.opacity = '1';
    toastEl.style.transform = 'translate(-50%,0)';
  });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    if (!toastEl) return;
    toastEl.style.opacity = '0';
    toastEl.style.transform = 'translate(-50%,20px)';
  }, 2400);
}

// ---- Modals --------------------------------------------------
export function openModal(id: string): void {
  el(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeModal(id: string): void {
  el(id).classList.remove('open');
  document.body.style.overflow = '';
}

// ---- Confirm dialog -----------------------------------------
interface ConfirmOptions {
  title: string;
  msg: string;
  yesLabel?: string;
  onYes: () => void;
}

let confirmCb: (() => void) | null = null;

export function confirmDialog({ title, msg, yesLabel = 'Oui, supprimer', onYes }: ConfirmOptions): void {
  el('confirm-title').textContent = title;
  el('confirm-msg').textContent = msg;
  el('confirm-yes').textContent = yesLabel;
  confirmCb = onYes;
  openModal('confirm-backdrop');
}

/** Wire the confirm modal buttons. Call once at boot. */
export function initConfirm(): void {
  qsa('[data-confirm-no]').forEach((b) =>
    b.addEventListener('click', () => {
      confirmCb = null;
      closeModal('confirm-backdrop');
    })
  );
  el('confirm-yes').addEventListener('click', () => {
    const cb = confirmCb;
    confirmCb = null;
    closeModal('confirm-backdrop');
    if (cb) cb();
  });
}
