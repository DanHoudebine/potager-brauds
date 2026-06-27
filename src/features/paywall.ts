// ============================================================
//  Paywall — modale « Passer à Pro » (doux & contextuel)
// ============================================================
//  Affiché UNIQUEMENT au moment où l'utilisateur atteint une capacité Pro
//  (2ᵉ parcelle, parcelle plus grande, partage…), jamais au lancement.
import { el, elOpt, openModal, closeModal, flash } from '../ui/dom';
import { isPro, purchasePro, restorePro, PRICE_LABEL } from '../services/entitlement';
import { refreshView } from '../ui/router';

interface Benefit {
  icon: string;
  title: string;
  desc: string;
}

const PRO_BENEFITS: Benefit[] = [
  { icon: '🌱', title: 'Parcelles illimitées', desc: 'Autant de jardins et de serres que vous voulez, à la taille que vous voulez.' },
  { icon: '📅', title: 'Calendrier personnalisé', desc: 'Semis, plantation et récolte aux bonnes dates selon votre région et les gelées.' },
  { icon: '🔁', title: 'Semis échelonnés', desc: 'Des rappels automatiques pour récolter en continu toute la saison.' },
  { icon: '🤝', title: 'Bon voisinage en direct', desc: 'Alertes de compagnonnage quand vous placez vos plantes sur la grille.' },
  { icon: '🔗', title: 'Partage de jardin', desc: 'Un code à donner à vos proches pour partager vos parcelles.' },
];

/** Si l'utilisateur n'est pas Pro, ouvre le paywall et renvoie false. */
export function requirePro(reason?: string): boolean {
  if (isPro()) return true;
  openPaywall(reason);
  return false;
}

export function openPaywall(reason?: string): void {
  render(reason);
  openModal('paywall-backdrop');
}

function render(reason?: string): void {
  const body = elOpt('paywall-body');
  if (!body) return;
  body.innerHTML = `
    ${reason ? `<div style="background:var(--green-tint);border-radius:12px;padding:10px 12px;margin-bottom:14px;font-size:14px">${reason}</div>` : ''}
    <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:18px">
      ${PRO_BENEFITS.map((b) => `
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span style="font-size:22px;line-height:1.2">${b.icon}</span>
          <div><div style="font-weight:800">${b.title}</div><div class="small muted">${b.desc}</div></div>
        </div>`).join('')}
    </div>
    <button class="btn primary" id="paywall-buy" style="width:100%">Débloquer Pro — ${PRICE_LABEL}</button>
    <button class="btn ghost" id="paywall-restore" style="width:100%;margin-top:8px">J'ai déjà acheté — restaurer</button>
    <div class="xsmall muted mt-2" style="text-align:center">Paiement unique · à vie · sans abonnement · sans pub · sans pistage</div>
  `;
  el('paywall-buy').addEventListener('click', () => void buyPro());
  el('paywall-restore').addEventListener('click', () => void doRestore());
}

async function buyPro(): Promise<void> {
  const ok = await purchasePro();
  if (ok) {
    closeModal('paywall-backdrop');
    flash('Merci ! 🌟 Pro débloqué');
    refreshView();
  } else {
    flash('Le paiement sera disponible très bientôt 🙏');
  }
}

async function doRestore(): Promise<void> {
  const ok = await restorePro();
  if (ok) {
    closeModal('paywall-backdrop');
    flash('Achat restauré ✓');
    refreshView();
  } else {
    flash('Aucun achat trouvé à restaurer.');
  }
}

/** Wire la modale paywall. À appeler une fois au boot. */
export function initPaywall(): void {
  elOpt('paywall-close')?.addEventListener('click', () => closeModal('paywall-backdrop'));
}
