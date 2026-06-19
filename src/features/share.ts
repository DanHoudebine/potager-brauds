// ============================================================
//  Partage de jardin — génère un code de partage Firebase
// ============================================================
import { state, save } from '../state';
import { elOpt, openModal, closeModal, flash } from '../ui/dom';
import { isFirebaseConfigured, getUser } from '../services/auth';
import { escapeHTML, uid } from '../utils';

function genCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function shareGarden(): Promise<void> {
  const shareEl = elOpt('share-result');
  const shareCode = elOpt('share-code');
  const shareBtn = elOpt<HTMLButtonElement>('share-generate-btn');
  if (!shareEl || !shareCode || !shareBtn) return;

  if (!isFirebaseConfigured()) {
    flash('Firebase non configuré — partage indisponible en mode local.');
    return;
  }
  const user = getUser();
  if (!user) {
    flash('Connectez-vous avec Google pour partager votre jardin.');
    return;
  }

  shareBtn.disabled = true;
  shareBtn.textContent = 'Génération…';

  const code = genCode();
  const payload = {
    owner: user.displayName || user.email || 'Jardinier',
    beds: state.beds.map((b) => ({
      name: b.name,
      type: b.type,
      cols: b.cols,
      rows: b.rows,
      plants: (b.cells || []).filter(Boolean).map((c) => ({
        plant: c!.plant,
        planted: c!.planted,
      })),
    })),
    ts: Date.now(),
  };

  try {
    await window.firebase.database().ref(`shares/${code}`).set(payload);
    shareEl.style.display = '';
    if (shareCode) shareCode.textContent = code;
    shareBtn.disabled = false;
    shareBtn.textContent = '🔄 Nouveau code';
  } catch (err) {
    shareBtn.disabled = false;
    shareBtn.textContent = 'Partager mon jardin';
    flash('Erreur lors du partage. Réessayez.');
  }
}

async function importGarden(): Promise<void> {
  const codeInput = elOpt<HTMLInputElement>('import-code-input');
  const importBtn = elOpt<HTMLButtonElement>('import-confirm-btn');
  if (!codeInput || !importBtn) return;

  const code = codeInput.value.trim().toUpperCase();
  if (code.length !== 6) { flash('Code à 6 caractères requis.'); return; }

  if (!isFirebaseConfigured()) { flash('Firebase non configuré.'); return; }

  importBtn.disabled = true;
  importBtn.textContent = 'Chargement…';

  try {
    const snap = await window.firebase.database().ref(`shares/${code}`).get();
    if (!snap.exists()) {
      flash('Code introuvable. Vérifiez le code partagé.');
      importBtn.disabled = false;
      importBtn.textContent = 'Importer';
      return;
    }
    const data = snap.val();
    const preview = elOpt('import-preview');
    if (preview) {
      const plantsCount = data.beds?.reduce((acc: number, b: { plants: unknown[] }) => acc + (b.plants?.length ?? 0), 0) ?? 0;
      preview.innerHTML = `
        <div class="import-preview-card">
          <div><b>${escapeHTML(data.owner || '?')}</b> partage <b>${data.beds?.length ?? 0} parcelle(s)</b> avec <b>${plantsCount} plante(s)</b></div>
          <button class="btn primary mt-3" id="import-apply-btn">Ajouter à mon jardin</button>
        </div>`;
      const applyBtn = elOpt<HTMLButtonElement>('import-apply-btn');
      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          if (!data.beds) return;
          const isoDate = (d: Date) => d.toISOString().split('T')[0];
          data.beds.forEach((b: { name: string; type: string; cols: number; rows: number; plants: { plant: string; planted: string }[] }) => {
            const cells = Array((b.cols || 4) * (b.rows || 3)).fill(null);
            (b.plants || []).forEach((pc, i) => {
              if (i < cells.length) {
                cells[i] = { id: uid(`c`), plant: pc.plant, planted: pc.planted || isoDate(new Date()), status: 'healthy', notes: '' };
              }
            });
            state.beds.push({
              id: `b${Date.now()}${Math.random().toString(36).slice(2)}`,
              name: b.name || 'Parcelle importée',
              type: (b.type as 'jardin' | 'serre') || 'jardin',
              cols: b.cols || 4,
              rows: b.rows || 3,
              cells,
            });
          });
          save();
          closeModal('share-modal-backdrop');
          flash(`${data.beds.length} parcelle(s) importée(s) depuis ${data.owner} ✓`);
        });
      }
    }
    importBtn.disabled = false;
    importBtn.textContent = 'Importer';
  } catch {
    flash('Erreur lors de l\'import.');
    importBtn.disabled = false;
    importBtn.textContent = 'Importer';
  }
}

function render(): void {
  const body = elOpt('share-modal-body');
  if (!body) return;
  body.innerHTML = `
    <div class="sl-section">
      <div class="sl-title">📤 Partager mon jardin</div>
      <div class="small muted mb-3">Générez un code de 6 lettres à donner à quelqu'un. Il pourra importer vos parcelles dans son application.</div>
      <button class="btn primary" id="share-generate-btn" style="width:100%">Partager mon jardin</button>
      <div id="share-result" style="display:none;margin-top:16px">
        <div class="share-code-wrap">
          <div class="share-code-label xsmall muted">Code de partage</div>
          <div class="share-code" id="share-code">——————</div>
          <button class="btn sm" id="share-copy-btn">📋 Copier</button>
        </div>
        <div class="xsmall muted mt-2">Ce code est valable 24h. Donnez-le à votre contact.</div>
      </div>
    </div>

    <div class="sl-section mt-4">
      <div class="sl-title">📥 Importer depuis un code</div>
      <div class="small muted mb-3">Entrez le code partagé par quelqu'un d'autre pour ajouter ses parcelles à votre jardin.</div>
      <div class="row gap-2">
        <input class="input" id="import-code-input" placeholder="Ex. ABC123" maxlength="6" style="text-transform:uppercase;letter-spacing:.15em;font-size:18px;flex:1">
        <button class="btn primary" id="import-confirm-btn">Importer</button>
      </div>
      <div id="import-preview" class="mt-3"></div>
    </div>
  `;

  const genBtn = elOpt<HTMLButtonElement>('share-generate-btn');
  if (genBtn) genBtn.addEventListener('click', () => void shareGarden());

  const copyBtn = elOpt('share-copy-btn');
  if (copyBtn) copyBtn.addEventListener('click', () => {
    const code = elOpt('share-code')?.textContent || '';
    navigator.clipboard.writeText(code).then(() => flash('Code copié ✓')).catch(() => flash('Code : ' + code));
  });

  const confirmBtn = elOpt<HTMLButtonElement>('import-confirm-btn');
  if (confirmBtn) confirmBtn.addEventListener('click', () => void importGarden());
}

export function openShareModal(): void {
  render();
  openModal('share-modal-backdrop');
}

export function initShare(): void {
  elOpt('share-modal-close')?.addEventListener('click', () => closeModal('share-modal-backdrop'));
}
