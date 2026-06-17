// ============================================================
//  Partage de potager — QR code / code texte (hors-ligne, sans serveur)
// ============================================================
//  Le potager (parcelles + récoltes) est sérialisé, compressé (gzip via
//  CompressionStream quand disponible) puis encodé en base64 avec un préfixe
//  de version. Aucun serveur, aucune donnée envoyée à un tiers : le code peut
//  être affiché en QR, copié, ou partagé via la feuille de partage native.
// ============================================================
import qrcode from 'qrcode-generator';
import type { Bed, HarvestRecord, RegionId } from '../types';
import { state, save } from '../state';
import { el, qsa, openModal, closeModal, flash, confirmDialog } from '../ui/dom';
import { uid, clampInt } from '../utils';
import { syncGardenTasks } from '../garden-sync';
import { renderGarden } from '../views/garden';
import { setView } from '../ui/router';

interface SharePayload {
  v: number;
  beds: Bed[];
  harvests: HarvestRecord[];
  region: RegionId | null;
}

let lastCode = '';

// ---- Encodage binaire ↔ base64 ------------------------------
function bytesToB64(bytes: Uint8Array): string {
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}
function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function gzip(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as unknown as BlobPart]).stream().pipeThrough(new CompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
async function gunzip(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as unknown as BlobPart]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// ---- Encode / decode ----------------------------------------
async function encodeShare(): Promise<string> {
  const payload: SharePayload = {
    v: 1,
    beds: state.beds,
    harvests: state.harvests || [],
    region: state.profile?.region ?? null,
  };
  const raw = new TextEncoder().encode(JSON.stringify(payload));
  if (typeof CompressionStream !== 'undefined') {
    try {
      return 'JDP1:' + bytesToB64(await gzip(raw));
    } catch {
      /* repli sans compression */
    }
  }
  return 'JDP0:' + bytesToB64(raw);
}

async function decodeShare(code: string): Promise<SharePayload> {
  const m = code.trim().match(/^JDP([01]):([A-Za-z0-9+/=\s]+)$/);
  if (!m) throw new Error('Code non reconnu');
  const bytes = b64ToBytes(m[2].replace(/\s+/g, ''));
  const jsonBytes = m[1] === '1' ? await gunzip(bytes) : bytes;
  const parsed = JSON.parse(new TextDecoder().decode(jsonBytes)) as SharePayload;
  if (!parsed || !Array.isArray(parsed.beds)) throw new Error('Données invalides');
  return parsed;
}

// ---- QR ------------------------------------------------------
function renderQR(container: HTMLElement, text: string): boolean {
  try {
    const qr = qrcode(0, 'L'); // type auto, correction L = capacité maximale
    qr.addData(text);
    qr.make();
    container.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
    return true;
  } catch {
    container.innerHTML = '';
    return false;
  }
}

// ---- UI ------------------------------------------------------
function setShareTab(tab: string): void {
  qsa<HTMLElement>('.share-tab').forEach((b) => b.classList.toggle('active', b.dataset.shareTab === tab));
  qsa<HTMLElement>('[data-share-pane]').forEach((p) => (p.style.display = p.dataset.sharePane === tab ? '' : 'none'));
}

export async function openShare(): Promise<void> {
  closeModal('acc-backdrop');
  setShareTab('export');
  el<HTMLTextAreaElement>('import-code').value = '';
  el('import-preview').textContent = '';
  el('import-preview').className = 'share-preview';
  openModal('share-backdrop');

  const qrBox = el('share-qr');
  const note = el('share-qr-note');
  qrBox.innerHTML = '<div class="share-qr-wait">…</div>';
  note.textContent = '';

  try {
    lastCode = await encodeShare();
  } catch {
    note.textContent = 'Impossible de préparer le partage.';
    return;
  }
  el<HTMLTextAreaElement>('share-code').value = lastCode;

  if (renderQR(qrBox, lastCode)) {
    note.textContent = `Scannez ce code avec l'appareil photo de l'autre téléphone.`;
  } else {
    qrBox.innerHTML = '<div class="share-qr-fail">📦</div>';
    note.textContent = 'Potager trop volumineux pour un QR code — utilisez « Copier » ou « Envoyer ».';
  }
}

async function copyCode(): Promise<void> {
  if (!lastCode) return;
  try {
    await navigator.clipboard.writeText(lastCode);
    flash('Code copié ✓');
  } catch {
    const ta = el<HTMLTextAreaElement>('share-code');
    ta.removeAttribute('readonly');
    ta.select();
    try {
      document.execCommand('copy');
      flash('Code copié ✓');
    } catch {
      flash('Sélectionnez et copiez le code manuellement');
    }
    ta.setAttribute('readonly', '');
  }
}

async function sendCode(): Promise<void> {
  if (!lastCode) return;
  const nav = navigator as Navigator & { share?: (d: { title?: string; text?: string }) => Promise<void> };
  if (nav.share) {
    try {
      await nav.share({ title: 'Mon potager — Jardin de Poche', text: lastCode });
      return;
    } catch {
      /* annulé ou indisponible → repli copie */
    }
  }
  await copyCode();
}

async function previewImport(): Promise<void> {
  const raw = el<HTMLTextAreaElement>('import-code').value.trim();
  const box = el('import-preview');
  if (!raw) {
    box.textContent = '';
    box.className = 'share-preview';
    return;
  }
  try {
    const p = await decodeShare(raw);
    const beds = p.beds.length;
    const plants = p.beds.reduce((n, b) => n + (b.cells || []).filter(Boolean).length, 0);
    const harvests = (p.harvests || []).length;
    box.className = 'share-preview ok';
    box.textContent = `✅ ${beds} parcelle${beds > 1 ? 's' : ''} · ${plants} plante${plants > 1 ? 's' : ''} · ${harvests} récolte${harvests > 1 ? 's' : ''}`;
  } catch {
    box.className = 'share-preview err';
    box.textContent = '❌ Code invalide ou incomplet.';
  }
}

async function applyImport(): Promise<void> {
  const raw = el<HTMLTextAreaElement>('import-code').value.trim();
  if (!raw) {
    flash("Collez d'abord un code");
    return;
  }
  let p: SharePayload;
  try {
    p = await decodeShare(raw);
  } catch {
    flash('Code invalide');
    return;
  }
  const beds = p.beds.length;
  confirmDialog({
    title: 'Importer ce potager ?',
    msg: `${beds} parcelle${beds > 1 ? 's' : ''} et leurs plantes seront ajoutées à votre potager. Vos données actuelles sont conservées.`,
    yesLabel: 'Importer',
    onYes: () => {
      p.beds.slice(0, 50).forEach((b) => {
        const cols = clampInt(b.cols, 2, 10, 4);
        const rows = clampInt(b.rows, 2, 10, 3);
        const cells = (b.cells || [])
          .slice(0, cols * rows)
          .map((c) => (c && c.plant ? { id: uid('c'), plant: String(c.plant), planted: String(c.planted || ''), status: c.status || 'healthy', notes: String(c.notes || '') } : null));
        while (cells.length < cols * rows) cells.push(null);
        state.beds.push({
          id: uid('b'),
          name: (b.name ? String(b.name) : 'Parcelle') + ' (importée)',
          type: b.type === 'serre' ? 'serre' : 'jardin',
          cols,
          rows,
          cells,
        });
      });
      (p.harvests || []).slice(0, 500).forEach((h) => {
        if (!h || typeof h.quantity !== 'number') return;
        state.harvests.push({ ...h, id: uid('h') });
      });
      save();
      syncGardenTasks();
      closeModal('share-backdrop');
      setView('garden');
      renderGarden();
      flash('Potager importé ✓');
    },
  });
}

/** Wire le bouton du compte et la fenêtre de partage. Appeler une fois au boot. */
export function initShare(): void {
  el('acc-share').addEventListener('click', () => void openShare());
  el('share-close').addEventListener('click', () => closeModal('share-backdrop'));
  qsa<HTMLElement>('.share-tab').forEach((b) => b.addEventListener('click', () => setShareTab(b.dataset.shareTab!)));
  el('share-copy').addEventListener('click', () => void copyCode());
  el('share-send').addEventListener('click', () => void sendCode());
  el<HTMLTextAreaElement>('import-code').addEventListener('input', () => void previewImport());
  el('import-apply').addEventListener('click', () => void applyImport());
}
