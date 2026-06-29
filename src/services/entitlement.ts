// ============================================================
//  Entitlement — déverrouillage « Pro » (achat unique)
// ============================================================
//  Règles de sûreté (issues de l'analyse) :
//   - NON DESTRUCTIF : ne supprime ni ne rétrécit JAMAIS de données. Les
//     limites s'appliquent uniquement à la CRÉATION, jamais rétroactivement.
//   - FAIL-OPEN : une erreur de vérification ne révoque jamais un achat déjà
//     accordé et ne bloque jamais l'application.
//   - L'entitlement est mis en cache localement et re-validé au démarrage
//     (initBilling / restorePro) via Google Play.
import { Capacitor } from '@capacitor/core';

const PRO_KEY = 'potager.pro.v1';

/** Prix affiché de l'achat Pro. */
export const PRICE_LABEL = '6,99 €';
/** Version gratuite : nombre de parcelles autorisées. */
export const FREE_MAX_BEDS = 1;
/** Version gratuite : cases max par parcelle (ex. 2 × 5 = 10). */
export const FREE_MAX_CELLS = 10;

function readPro(): boolean {
  try {
    return localStorage.getItem(PRO_KEY) === '1';
  } catch {
    return false;
  }
}

let proCached = readPro();

/** L'utilisateur a-t-il débloqué Pro ? */
export function isPro(): boolean {
  return proCached;
}

/** Accorde Pro (après un achat ou une restauration réussie) et le persiste. */
export function grantPro(): void {
  proCached = true;
  try {
    localStorage.setItem(PRO_KEY, '1');
  } catch {
    /* quota / mode privé — l'état mémoire suffit pour la session */
  }
}

/** Peut-on ajouter une parcelle de plus ? */
export function canAddBed(currentCount: number): boolean {
  return isPro() || currentCount < FREE_MAX_BEDS;
}

/** La taille de grille demandée est-elle autorisée dans la version gratuite ? */
export function canUseGridSize(cols: number, rows: number): boolean {
  return isPro() || cols * rows <= FREE_MAX_CELLS;
}

// ---- Facturation Google Play (cordova-plugin-purchase / CdvPurchase) ----
//  Achat unique non-consommable « pro_unlock ».
//   - NATIF UNIQUEMENT : tout accès au plugin est derrière Capacitor.isNativePlatform().
//   - IMPORT DYNAMIQUE : le plugin n'est jamais évalué dans le build web/dev.
//   - FAIL-OPEN : grantPro() est la seule mutation ; on ne révoque JAMAIS
//     (ni sur erreur, ni sur « non possédé », ni hors-ligne).
//   - LOCAL (sans validateur serveur) : on accorde + finish() dans .approved
//     (l'événement .verified ne se déclenche pas sans validateur, et finish()
//     est obligatoire sinon Google rembourse l'achat sous ~3 jours).

const PRODUCT_ID = 'pro_unlock';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Store = any;

let billingReady: Promise<Store | null> | null = null;

/** Initialise la boutique Google Play une seule fois, sur natif uniquement.
 *  Renvoie le `store` CdvPurchase, ou null sur web/dev. Réappelable sans risque. */
export async function initBilling(): Promise<Store | null> {
  if (!Capacitor.isNativePlatform()) return null; // web/dev : pas de facturation
  if (!billingReady) {
    billingReady = (async () => {
      // Sous Capacitor, le plugin Cordova injecte le global CdvPurchase au runtime
      // (la couche native le charge ; pas besoin d'import ES module). Si le bridge
      // n'est pas encore prêt, on échoue → catch → fail-open + nouvelle tentative.
      const CdvPurchase = (window as unknown as { CdvPurchase?: Store }).CdvPurchase;
      if (!CdvPurchase) throw new Error('CdvPurchase indisponible (bridge natif pas prêt)');
      const store = CdvPurchase.store;
      const { ProductType, Platform, ErrorCode } = CdvPurchase;

      store.register([{ id: PRODUCT_ID, type: ProductType.NON_CONSUMABLE, platform: Platform.GOOGLE_PLAY }]);

      store.error((err: { code?: number; message?: string }) => {
        if (err && err.code === ErrorCode.PAYMENT_CANCELLED) return; // annulation utilisateur
        console.warn('[IAP]', err && err.code, err && err.message);
        // FAIL-OPEN : ne jamais révoquer ici.
      });

      store.when()
        .approved((t: { finish: () => void }) => { grantPro(); t.finish(); })
        .receiptUpdated(() => { if (store.owned(PRODUCT_ID)) grantPro(); });

      await store.initialize([Platform.GOOGLE_PLAY]);
      if (store.owned(PRODUCT_ID)) grantPro(); // possédé sur un autre appareil / réinstall
      return store;
    })().catch((e) => {
      console.warn('[IAP] init failed', e);
      billingReady = null; // permet une nouvelle tentative au prochain achat
      return null;
    });
  }
  return billingReady;
}

/** Lance l'achat. Retourne true si Pro est désormais débloqué. */
export async function purchasePro(): Promise<boolean> {
  // DEV / web : on garde le déblocage simulé pour tester le paywall en local.
  if (!Capacitor.isNativePlatform()) {
    if (import.meta.env.DEV) { grantPro(); return true; }
    return false;
  }
  try {
    const store = await initBilling();
    if (!store) return isPro(); // init indisponible → fail-open
    if (store.owned(PRODUCT_ID)) { grantPro(); return true; }
    const CdvPurchase = (window as unknown as { CdvPurchase: Store }).CdvPurchase;
    const product = store.get(PRODUCT_ID, CdvPurchase.Platform.GOOGLE_PLAY);
    const offer = product && product.getOffer(); // un seul non-consommable → une offre
    if (!offer) return isPro();
    // v13 : on commande une OFFRE. Le déblocage arrive en asynchrone via .approved.
    const err = await store.order(offer);
    if (err) { console.warn('[IAP] order', err.code, err.message); return isPro(); }
    return isPro();
  } catch (e) {
    console.warn('[IAP] purchase error', e);
    return isPro(); // FAIL-OPEN : ne jamais verrouiller sur une erreur transitoire
  }
}

/** Restaure un achat précédent. Retourne true si Pro est actif. */
export async function restorePro(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return isPro();
  try {
    const store = await initBilling();
    if (!store) return isPro();
    await store.restorePurchases();
    if (store.owned(PRODUCT_ID)) grantPro();
    return isPro(); // n'augmente jamais que vers Pro ; ne révoque jamais
  } catch (e) {
    console.warn('[IAP] restore error', e);
    return isPro();
  }
}
