import type { TutorialStep } from '../types';

// Petite animation : une plante glissée d'une case à une autre de la grille.
const GARDEN_DEMO = `
  <div class="tut-demo">
    <div class="tut-demo-grid">
      <div class="tdc"></div><div class="tdc"></div><div class="tdc"></div>
      <div class="tdc"></div><div class="tdc"></div><div class="tdc tdc-target"></div>
    </div>
    <div class="tut-demo-tile">🍅</div>
    <div class="tut-demo-hand">👆</div>
  </div>`;

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    view: 'dashboard',
    sel: '.greet,.hero-card',
    title: '🏡 Accueil',
    text: "Votre tableau de bord du jour : alertes sur vos plantes, tâches à faire, météo locale et aperçu de la semaine — tout en un coup d'œil dès l'ouverture.",
  },
  {
    view: 'dashboard',
    sel: '#alerts-list',
    title: '🚨 Alertes du jour',
    text: "Les plantes qui réclament votre attention apparaissent ici en priorité. Rouge = urgent (parasite, soif…), orange = à surveiller, vert = tout va bien.",
  },
  {
    view: 'dashboard',
    sel: '.fab',
    title: '⚡ Ajout rapide',
    text: "Le bouton + (en bas à droite) ajoute une tâche, une plante ou une note en quelques secondes, depuis n'importe quelle page.",
  },
  {
    view: 'garden',
    sel: '#bed-grid',
    title: '🌿 Mon jardin',
    text: "Vos parcelles et votre serre. Touchez une case vide pour y planter exactement ce que vous voulez, et glissez-déposez une plante pour la déplacer d'une case à l'autre :",
    demo: GARDEN_DEMO,
  },
  {
    view: 'catalog',
    sel: '#region-catalog-prompt,#catalog-grid,.view.active .page-head',
    title: '📖 Catalogue',
    text: "Plus de 60 légumes, fruits et aromatiques. Réglez votre région pour afficher le taux de réussite de chaque plante sous votre climat — d'« Excellent » à « Difficile » — et voir celles recommandées chez vous.",
  },
  {
    view: 'guide',
    sel: '.view.active .page-head,[data-view="guide"].view',
    title: '📚 Guide',
    text: "Le manuel complet du potager : préparation du sol, compagnonnage (quoi planter ensemble), semis, arrosage, ravageurs, rotation des cultures, récolte et arboriculture.",
  },
  {
    view: 'calendar',
    sel: '.view.active .page-head,[data-view="calendar"].view',
    title: '🗓️ Calendrier',
    text: "Quoi semer, planter et récolter mois par mois, adapté à vos cultures. Idéal pour planifier la saison sans rien oublier.",
  },
  {
    view: 'journal',
    sel: '.view.active .page-head,[data-view="journal"].view',
    title: '📓 Journal',
    text: "Gardez la mémoire de votre potager : notes, observations et photos datées. Parfait pour comparer d'une année sur l'autre ce qui a bien marché.",
  },
  {
    view: 'reminders',
    sel: '.view.active .page-head,[data-view="reminders"].view',
    title: '🔔 Rappels',
    text: "Programmez des rappels récurrents (arrosage, traitements, surveillance…) pour recevoir une notification au bon moment.",
  },
  {
    view: 'dashboard',
    sel: '#topbar-account,#account-chip-desktop',
    title: '⚙️ Mon compte & réglages',
    text: "Ici : votre région, le mode sombre, le partage de jardin, la liste de courses, l'export de vos données et la connexion Google pour synchroniser entre vos appareils. Bonne culture ! 🌱",
  },
];
