// ============================================================
//  Troc de graines — annonces locales + Firebase communauté
// ============================================================
import type { SeedListing } from '../types';
import { state, save } from '../state';
import { elOpt, openModal, closeModal, flash } from '../ui/dom';
import { escapeHTML, uid } from '../utils';
import { CATALOG, plantById } from '../data/catalog';
import { isFirebaseConfigured, getUser } from '../services/auth';

function seeds(): SeedListing[] {
  return (state.seeds = state.seeds || []);
}

async function publishToFirebase(listing: SeedListing): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const user = getUser();
  if (!user) return;
  const path = `seeds/${(window.firebase.auth() as { currentUser: { uid: string } }).currentUser?.uid || 'anon'}/${listing.id}`;
  await window.firebase.database().ref(path).set({ ...listing, uid: (window.firebase.auth() as { currentUser: { uid: string } }).currentUser?.uid });
}

async function fetchCommunitySeeds(): Promise<SeedListing[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    const snap = await window.firebase.database().ref('seeds').get();
    if (!snap.exists()) return [];
    const data = snap.val() as Record<string, Record<string, SeedListing>>;
    const result: SeedListing[] = [];
    Object.values(data).forEach((userSeeds) => {
      Object.values(userSeeds).forEach((s) => result.push(s));
    });
    return result.sort((a, b) => b.ts - a.ts).slice(0, 30);
  } catch {
    return [];
  }
}

function myListingsHTML(): string {
  const mySeeds = seeds();
  if (!mySeeds.length) return '<div class="muted small">Vous n\'avez pas encore d\'annonce. Ajoutez-en une ci-dessus.</div>';
  return mySeeds.map((s) => {
    const p = plantById(s.plantId);
    const icon = p?.icon || '🌱';
    const name = p?.name || s.plantName || s.plantId;
    return `<div class="troc-row">
      <span class="troc-ic">${icon}</span>
      <div class="troc-info">
        <div class="troc-name">${escapeHTML(name)}</div>
        <div class="xsmall muted">${escapeHTML(s.quantity)} ${s.notes ? '· ' + escapeHTML(s.notes) : ''}</div>
      </div>
      <button class="btn ghost sm danger" data-sdel="${s.id}" aria-label="Supprimer">✕</button>
    </div>`;
  }).join('');
}

function communityHTML(community: SeedListing[]): string {
  if (!isFirebaseConfigured()) {
    return '<div class="muted small">Connectez-vous avec Google pour voir les annonces de la communauté.</div>';
  }
  if (!community.length) return '<div class="muted small">Aucune annonce disponible pour le moment.</div>';
  return community.map((s) => {
    const p = plantById(s.plantId);
    const icon = p?.icon || '🌱';
    const name = p?.name || s.plantName || s.plantId;
    const date = new Date(s.ts).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
    return `<div class="troc-row">
      <span class="troc-ic">${icon}</span>
      <div class="troc-info">
        <div class="troc-name">${escapeHTML(name)}</div>
        <div class="xsmall muted">${escapeHTML(s.quantity)} ${s.notes ? '· ' + escapeHTML(s.notes) : ''}</div>
        <div class="xsmall muted">Par ${escapeHTML(s.ownerName || 'Jardinier')} · ${date}</div>
      </div>
      ${s.ownerEmail ? `<a class="btn sm" href="mailto:${escapeHTML(s.ownerEmail)}?subject=Troc graines - ${encodeURIComponent(name)}">Contacter</a>` : ''}
    </div>`;
  }).join('');
}

async function render(): Promise<void> {
  const body = elOpt('troc-modal-body');
  if (!body) return;

  const plantOptions = CATALOG.map((p) => `<option value="${p.id}">${p.icon} ${p.name}</option>`).join('');

  body.innerHTML = `
    <div class="sl-section">
      <div class="sl-title">➕ Proposer des graines</div>
      <div class="field mb-2">
        <label>Plante</label>
        <select class="select" id="troc-plant">${plantOptions}</select>
      </div>
      <div class="grid grid-2">
        <div class="field"><label>Quantité</label><input class="input" id="troc-qty" placeholder="Ex. 3 sachets"></div>
        <div class="field"><label>Notes</label><input class="input" id="troc-notes" placeholder="Variété, lieu…"></div>
      </div>
      <button class="btn primary mt-3" id="troc-add-btn" style="width:100%">Publier mon annonce</button>
    </div>

    <div class="sl-section mt-4">
      <div class="sl-title">📋 Mes annonces</div>
      <div id="troc-my-list">${myListingsHTML()}</div>
    </div>

    <div class="sl-section mt-4">
      <div class="sl-title">🌍 Annonces de la communauté</div>
      <div id="troc-community-list"><div class="muted small">Chargement…</div></div>
    </div>
  `;

  // Wire add button
  const addBtn = elOpt<HTMLButtonElement>('troc-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const plantId = elOpt<HTMLSelectElement>('troc-plant')?.value || '';
      const quantity = elOpt<HTMLInputElement>('troc-qty')?.value.trim() || '';
      const notes = elOpt<HTMLInputElement>('troc-notes')?.value.trim() || '';
      if (!quantity) { flash('Indiquez une quantité.'); return; }
      const user = getUser();
      const listing: SeedListing = {
        id: uid('s'),
        plantId,
        plantName: plantById(plantId)?.name,
        quantity,
        notes,
        ownerName: user?.displayName || undefined,
        ownerEmail: user?.email || undefined,
        ts: Date.now(),
      };
      seeds().push(listing);
      save();
      await publishToFirebase(listing);
      flash('Annonce publiée ✓');
      void render();
    });
  }

  // Wire delete buttons
  elOpt('troc-my-list')?.querySelectorAll<HTMLElement>('[data-sdel]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.sdel!;
      state.seeds = seeds().filter((s) => s.id !== id);
      save();
      void render();
    });
  });

  // Load community
  const community = await fetchCommunitySeeds();
  const communityEl = elOpt('troc-community-list');
  if (communityEl) communityEl.innerHTML = communityHTML(community);
}

export function openTrocModal(): void {
  void render();
  openModal('troc-modal-backdrop');
}

export function initTroc(): void {
  elOpt('troc-modal-close')?.addEventListener('click', () => closeModal('troc-modal-backdrop'));
}
