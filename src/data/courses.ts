import { Course, FAQItem } from '../types';

// No demo/placeholder courses ship with the app anymore — only what the
// teacher adds via the admin panel should ever appear here.
export const COURSES_DATA: Course[] = [];

// IDs of the original demo/seed courses that were auto-populated into
// Firestore on first admin login, before real content existed. Used by the
// admin "Nettoyer les cours de démonstration" button to remove them.
export const SEED_COURSE_IDS = [
  'ts-p1', 'ts-c1', 'ts-p2', 'ts-c2', 'ts-p3',
  '1s-p1', '1s-c1', '1s-p2', '1s-c2',
  '2s-p1', '2s-c1', '2s-p2', '2s-c2',
  'coll-1', 'coll-2', 'coll-3',
  'fascicule-physique-terminale', 'fascicule-chimie-terminale', 'fascicule-formulaire-complet',
  'bac-sujet-2025', 'bac-corrige-2025', 'bac-sujet-2024', 'bac-corrige-2024'
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'Comment sont organisés les cours et les exercices ?',
    answer: 'Chaque chapitre comporte un cours rédigé détaillé, une série d\'exercices d\'application directe, et des problèmes de synthèse. Les corrigés pas-à-pas sont également téléchargeables.'
  },
  {
    question: 'Les sujets de BAC contiennent-ils les corrigés détaillés ?',
    answer: 'Oui, tous nos sujets d\'annales de BAC disposent d\'une correction rédigée par un enseignant, avec les critères de notation officiels et des remarques méthodologiques précieuses.'
  },
  {
    question: 'Qu\'est-ce que les "Fascicules" ?',
    answer: 'Les fascicules sont des recueils thématiques complets ou des livres d\'exercices couvrant de larges parties du programme (voire l\'année entière). Ils sont parfaits pour un entraînement intensif ou des révisions globales.'
  },
  {
    question: 'Comment puis-je proposer un exercice ou poser une question ?',
    answer: 'Vous pouvez utiliser le formulaire de contact en bas de page pour m\'envoyer un message. Je réponds généralement sous 24 à 48 heures.'
  },
  {
    question: 'Les documents PDF sont-ils gratuits et conformes au programme ?',
    answer: 'Absolument. Toutes les ressources proposées sur cette plateforme sont entièrement gratuites et conçues en parfaite conformité avec les programmes d\'enseignement en vigueur.'
  }
];
