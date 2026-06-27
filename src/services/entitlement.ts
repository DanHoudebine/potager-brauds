// ============================================================
//  Entitlement — déverrouillage « Pro » (achat unique)
// ============================================================
//  Règles de sûreté (issues de l'analyse) :
//   - NON DESTRUCTIF : ne supprime ni ne rétrécit JAMAIS de données. Les
//     limites s'appliquent uniquement à la CRÉATION, jamais rétroactivement.
//   - FAIL-OPEN : une erreur de vérification ne révoque jamais un achat déjà
//     accordé et ne bloque jamais l'application.
//   - L'entitlement est mis en cache localement et sera re-validé au démarrage
//     (restorePro) une fois la facturation réelle branchée (Étape B).

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

// ---- Facturation (adaptateur) -------------------------------
//  Étape B : remplacer le corps par cordova-plugin-purchase (produit
//  non-consommable « pro_unlock »). En attendant, achat simulé en DEV
//  UNIQUEMENT pour pouvoir tester le verrouillage ; en PROD rien n'est
//  accordé tant que la facturation réelle n'est pas branchée.

/** Lance l'achat. Retourne true si Pro est désormais débloqué. */
export async function purchasePro(): Promise<boolean> {
  if (import.meta.env.DEV) {
    grantPro();
    return true;
  }
  return false; // facturation réelle pas encore branchée (Étape B)
}

/** Restaure un achat précédent. Retourne true si Pro est actif. */
export async function restorePro(): Promise<boolean> {
  return isPro();
}
