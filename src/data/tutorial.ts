import type { TutorialStep } from '../types';

export const TUTORIAL_STEPS: TutorialStep[] = [
  { sel: '.greet,.hero-card', title: 'Votre tableau de bord', text: "Vue quotidienne : alertes sur vos plantes, tâches du jour, météo et semaine en un coup d'œil." },
  { sel: '#alerts-list', title: 'Alertes instantanées', text: "Vos plantes qui ont besoin d'attention apparaissent ici en priorité. Couleur rouge = urgent." },
  { sel: '.stats', title: 'Vos statistiques', text: "Plantes en terre, arrosages à faire aujourd'hui, récoltes en attente et votre série de jours actifs." },
  { sel: '.fab', title: 'Ajout rapide ⚡', text: "Le bouton + vous permet d'ajouter une tâche, une plante ou une note en 3 secondes depuis n'importe quelle page." },
  { sel: '[data-nav="catalog"]', title: '📍 Taux de réussite par région', text: 'Le catalogue affiche la compatibilité climatique de chaque plante pour votre région — de "Excellent" à "Difficile". Configurez ou changez votre région depuis le bandeau en haut du catalogue.' },
  { sel: 'nav.bottom-nav,.sidebar', title: 'Navigation', text: 'Accédez à votre jardin, catalogue, guide, calendrier et journal. La serre et le jardin sont bien séparés dans "Jardin".' },
  { sel: '[data-view="guide"].view', title: 'Le Guide du potager', text: 'Le guide complet — sol, compagnonnage (quoi planter ensemble), semis, arrosage, ravageurs, rotation, récolte et arboriculture — accessible à tout moment.' },
];
