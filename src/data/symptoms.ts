import type { Symptom } from '../types';

export const SYMPTOMS: Symptom[] = [
  { id: 'yellow', icon: '🍂', label: 'Feuilles jaunes', causes: [
    { name: 'Carence en azote', signs: 'Jaunissement progressif du bas vers le haut', treat: "Purin d'ortie dilué (10:1) ou engrais azoté", sev: 'medium' },
    { name: "Excès d'eau", signs: 'Feuilles molles + jaunes, sol détrempé', treat: "Stopper l'arrosage, améliorer le drainage", sev: 'high' },
    { name: 'Carence en fer', signs: 'Nervures vertes mais feuilles jaunes entre elles', treat: 'Chélate de fer ou corriger le pH (6–6,5)', sev: 'medium' },
    { name: "Déficit d'eau", signs: 'Feuilles tombantes + bords secs puis jaunes', treat: 'Arrosage profond au pied, paillage', sev: 'medium' },
  ] },
  { id: 'spots', icon: '🔴', label: 'Taches sur les feuilles', causes: [
    { name: 'Mildiou', signs: 'Taches huileuses dessus, duvet gris/blanc dessous', treat: 'Bouillie bordelaise, supprimer feuilles atteintes', sev: 'high' },
    { name: 'Oïdium', signs: 'Poudre blanche sur la face supérieure', treat: 'Bicarbonate de soude (1 c.c/L eau), bien aérer', sev: 'medium' },
    { name: 'Alternariose', signs: 'Taches brunes cerclées de jaune (tomates, choux)', treat: "Supprimer feuilles, éviter l'arrosage foliaire", sev: 'medium' },
    { name: 'Bactériose', signs: 'Taches angulaires humides qui noircissent', treat: 'Cuivre, aération, rotation des cultures', sev: 'high' },
  ] },
  { id: 'holes', icon: '🕳️', label: 'Trous dans les feuilles', causes: [
    { name: 'Limaces / Escargots', signs: 'Trous irréguliers, traces de bave argentée', treat: 'Cendres de bois, pièges à bière, granulés ferriques', sev: 'medium' },
    { name: 'Piéride du chou', signs: 'Trous sur choux, chenilles vert-jaune visibles', treat: 'Filet insect-proof, Bt (Bacillus thuringiensis)', sev: 'medium' },
    { name: 'Doryphores', signs: 'Feuilles de pomme de terre dévorées, larves orangées', treat: 'Ramassage manuel, décoction de fougère', sev: 'high' },
    { name: 'Altises', signs: 'Petits trous ronds sur radis, navets, brassicacées', treat: 'Filet, cendres de bois, rotation', sev: 'low' },
  ] },
  { id: 'wilt', icon: '😿', label: 'Plante qui fane / se dessèche', causes: [
    { name: 'Sécheresse', signs: 'Feuilles tombantes, sol sec', treat: 'Arrosage profond, paillage, arroser tôt le matin', sev: 'medium' },
    { name: 'Fusariose', signs: 'Jaunissement unilatéral, tige brune en coupe', treat: 'Supprimer la plante, ne pas composter, rotation obligatoire', sev: 'high' },
    { name: 'Pourriture du collet', signs: 'Collier noir à la base, racines brunes molles', treat: "Moins d'arrosage, bon drainage, supprimer si très atteinte", sev: 'high' },
    { name: 'Chaleur excessive', signs: 'Toute la plante fléchit le midi, récupère le soir', treat: 'Ombrage temporaire, arrosage régulier en soirée', sev: 'low' },
  ] },
  { id: 'deformed', icon: '🔀', label: 'Feuilles / fruits déformés', causes: [
    { name: 'Pucerons', signs: 'Feuilles enroulées, collantes, insectes verts/noirs/blancs', treat: 'Savon noir (10 ml/L), favoriser coccinelles', sev: 'medium' },
    { name: 'Araignées rouges', signs: 'Feuilles blanchâtres/bronzées, toiles fines dessous', treat: "Pulvériser eau fraîche, augmenter l'humidité", sev: 'medium' },
    { name: 'Virus (mosaïque)', signs: 'Mosaïque vert clair/foncé, déformation foliaire', treat: 'Supprimer la plante, lutter contre pucerons (vecteurs)', sev: 'high' },
    { name: 'Carences multiples', signs: 'Déformation + décoloration irrégulière', treat: 'Analyse de sol, apport de compost équilibré', sev: 'medium' },
  ] },
  { id: 'no-fruit', icon: '🌸', label: 'Fleurs sans fruits', causes: [
    { name: 'Manque de pollinisation', signs: 'Fleurs tombent sans développement', treat: 'Agiter les tiges (tomates), planter des fleurs pollinisatrices', sev: 'medium' },
    { name: 'Températures extrêmes', signs: 'Fleurs avortent si nuit < 10°C ou jour > 35°C', treat: 'Voile de protection la nuit, ombrage le jour', sev: 'medium' },
    { name: "Excès d'azote", signs: 'Végétation luxuriante mais peu de fleurs ou fruits', treat: "Stopper l'azote, apporter potasse et phosphore", sev: 'medium' },
    { name: "Manque d'eau à la floraison", signs: 'Fruits mal formés, creux ou qui tombent', treat: 'Arrosage régulier et profond, surtout pendant la floraison', sev: 'medium' },
  ] },
];
