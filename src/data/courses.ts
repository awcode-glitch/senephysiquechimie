import { Course, FAQItem } from '../types';

export const COURSES_DATA: Course[] = [
  // --- TERMINALE S (TS) ---
  {
    id: 'ts-p1',
    title: 'Cinématique et Dynamique de Newton',
    chapterNumber: 1,
    level: 'TS',
    subject: 'Physique',
    description: 'Étude des vecteurs position, vitesse et accélération. Application des trois lois de Newton aux mouvements de projectiles dans un champ de pesanteur uniforme.',
    fileSize: '3.4 MB',
    downloadsCount: 1240,
    tags: ['Mécanique', 'Newton', 'Vecteurs', 'Projectiles'],
    pdfUrl: '#ts-cinematique-dynamique',
    publishDate: '2026-02-15'
  },
  {
    id: 'ts-c1',
    title: 'Cinétique Chimique et Suivi Temporel',
    chapterNumber: 1,
    level: 'TS',
    subject: 'Chimie',
    description: 'Vitesse de réaction, facteurs cinétiques (température, catalyseur). Suivi par spectrophotométrie et conductimétrie. Temps de demi-réaction t1/2.',
    fileSize: '2.8 MB',
    downloadsCount: 945,
    tags: ['Cinétique', 'Spectrophotométrie', 'Conductimétrie', 'Vitesse'],
    pdfUrl: '#ts-cinetique-chimique',
    publishDate: '2026-02-20'
  },
  {
    id: 'ts-p2',
    title: 'Ondes et Particules : Dualité Onde-Corpuscule',
    chapterNumber: 2,
    level: 'TS',
    subject: 'Physique',
    description: 'Propriétés des ondes (diffraction, interférences). Relation d\'Einstein-Planck, relation de de Broglie et aspect probabiliste de la mécanique quantique.',
    fileSize: '4.1 MB',
    downloadsCount: 1102,
    tags: ['Ondes', 'Diffraction', 'Quantum', 'Interférences'],
    pdfUrl: '#ts-ondes-particules',
    publishDate: '2026-03-05'
  },
  {
    id: 'ts-c2',
    title: 'Transformations Acido-Basiques et pH',
    chapterNumber: 2,
    level: 'TS',
    subject: 'Chimie',
    description: 'Définition du pH, constante d\'acidité Ka, diagrammes de prédominance et de distribution. Solutions tampons et titrages acido-basiques.',
    fileSize: '3.1 MB',
    downloadsCount: 1410,
    tags: ['Acide-Base', 'pH', 'Ka', 'Titrage', 'Tampon'],
    pdfUrl: '#ts-acide-base-ph',
    publishDate: '2026-03-12'
  },
  {
    id: 'ts-p3',
    title: 'Thermodynamique et Transferts Thermiques',
    chapterNumber: 3,
    level: 'TS',
    subject: 'Physique',
    description: 'Énergie interne, premier principe de la thermodynamique. Transferts thermiques par conduction, convection et rayonnement. Loi de refroidissement de Newton.',
    fileSize: '3.9 MB',
    downloadsCount: 812,
    tags: ['Thermodynamique', 'Chaleur', 'Énergie', 'Newton'],
    pdfUrl: '#ts-thermodynamique',
    publishDate: '2026-03-22'
  },

  // --- PREMIÈRE S (1S) ---
  {
    id: '1s-p1',
    title: 'Interactions fondamentales et Champs',
    chapterNumber: 1,
    level: '1S',
    subject: 'Physique',
    description: 'Interactions gravitationnelle, électrostatique et forte. Notion de champ scalaire et vectoriel (gravitationnel et électrostatique).',
    fileSize: '2.9 MB',
    downloadsCount: 780,
    tags: ['Champs', 'Gravitation', 'Électrostatique', 'Forces'],
    pdfUrl: '#1s-interactions-champs',
    publishDate: '2026-01-10'
  },
  {
    id: '1s-c1',
    title: 'Molécules et Cohésion de la Matière',
    chapterNumber: 1,
    level: '1S',
    subject: 'Chimie',
    description: 'Représentation de Lewis, géométrie des molécules (VSEPR), polarité. Forces de Van der Waals et liaisons hydrogène. Solubilité et extraction.',
    fileSize: '3.5 MB',
    downloadsCount: 890,
    tags: ['Lewis', 'VSEPR', 'Polarité', 'Solubilité', 'Cohésion'],
    pdfUrl: '#1s-molecules-cohesion',
    publishDate: '2026-01-18'
  },
  {
    id: '1s-p2',
    title: 'Énergie Mécanique et Conservation',
    chapterNumber: 2,
    level: '1S',
    subject: 'Physique',
    description: 'Travail d\'une force constante. Énergie cinétique, énergie potentielle de pesanteur. Théorème de l\'énergie cinétique et forces non conservatives.',
    fileSize: '3.2 MB',
    downloadsCount: 920,
    tags: ['Énergie', 'Travail', 'Cinétique', 'Conservatif'],
    pdfUrl: '#1s-energie-mecanique',
    publishDate: '2026-02-05'
  },
  {
    id: '1s-c2',
    title: 'Dosages Spectrophotométriques et Colorimétriques',
    chapterNumber: 2,
    level: '1S',
    subject: 'Chimie',
    description: 'Loi de Beer-Lambert. Préparation de gammes étalons. Détermination de la concentration d\'une espèce colorée par dosage spectrophotométrique.',
    fileSize: '2.5 MB',
    downloadsCount: 742,
    tags: ['Beer-Lambert', 'Dosage', 'Spectre', 'Colorimétrie'],
    pdfUrl: '#1s-dosages',
    publishDate: '2026-02-28'
  },

  // --- SECONDE S (2S) ---
  {
    id: '2s-p1',
    title: 'Signaux Périodiques en Médecine',
    chapterNumber: 1,
    level: '2S',
    subject: 'Physique',
    description: 'Période, fréquence, amplitude. Ondes sonores et électromagnétiques. Applications médicales : électrocardiogramme, échographie et radiographie.',
    fileSize: '2.2 MB',
    downloadsCount: 650,
    tags: ['Signaux', 'Ondes', 'Médical', 'Fréquence'],
    pdfUrl: '#2s-signaux-periodiques',
    publishDate: '2025-10-12'
  },
  {
    id: '2s-c1',
    title: 'Constitution de l\'Atome et Éléments Chimiques',
    chapterNumber: 1,
    level: '2S',
    subject: 'Chimie',
    description: 'Structure du noyau (protons, neutrons) et cortège électronique. Configuration électronique en sous-couches (s, p). Classification périodique des éléments.',
    fileSize: '2.7 MB',
    downloadsCount: 910,
    tags: ['Atome', 'Électrons', 'Mendeleïev', 'Classification'],
    pdfUrl: '#2s-atome-elements',
    publishDate: '2025-10-20'
  },
  {
    id: '2s-p2',
    title: 'Mouvement et Forces : Lois du Mouvement',
    chapterNumber: 2,
    level: '2S',
    subject: 'Physique',
    description: 'Relativité du mouvement, trajectoire, vitesse moyenne. Modélisation d\'une action par une force. Principe d\'inertie (première loi de Newton).',
    fileSize: '2.6 MB',
    downloadsCount: 715,
    tags: ['Mouvement', 'Vitesse', 'Forces', 'Inertie'],
    pdfUrl: '#2s-mouvement-forces',
    publishDate: '2025-11-15'
  },
  {
    id: '2s-c2',
    title: 'Quantité de Matière et la Mole',
    chapterNumber: 2,
    level: '2S',
    subject: 'Chimie',
    description: 'La mole comme unité de quantité de matière. Constante d\'Avogadro. Masses molaires atomiques et moléculaires. Relation entre masse, volume et quantité de matière.',
    fileSize: '2.1 MB',
    downloadsCount: 1045,
    tags: ['Mole', 'Masse molaire', 'Avogadro', 'Quantité de matière'],
    pdfUrl: '#2s-quantite-matiere',
    publishDate: '2025-12-02'
  },

  // --- 3EME (Collège) ---
  {
    id: 'coll-3',
    title: 'Mouvement, Vitesse et Gravitation (3ème)',
    level: '3eme',
    subject: 'Physique',
    description: 'Relativité du mouvement, trajectoire rectiligne ou circulaire. Vitesse uniforme ou accélérée. Interaction gravitationnelle et poids d\'un corps.',
    fileSize: '2.1 MB',
    downloadsCount: 1350,
    tags: ['Collège', 'Gravitation', 'Vitesse', 'Poids'],
    pdfUrl: '#college-mouvement-gravitation',
    publishDate: '2025-11-12'
  },

  // --- 4EME (Collège) ---
  {
    id: 'coll-1',
    title: 'Constitution et États de la Matière (4ème)',
    level: '4eme',
    subject: 'Chimie',
    description: 'Molécules et atomes pour expliquer la conservation de la masse lors d\'une transformation chimique. Composition de l\'air et pollution atmosphérique.',
    fileSize: '1.9 MB',
    downloadsCount: 1120,
    tags: ['Collège', 'Atome', 'Matière', 'Air'],
    pdfUrl: '#college-matiere',
    publishDate: '2025-09-18'
  },
  {
    id: 'coll-2',
    title: 'Électricité : Lois des Circuits Électriques (4ème)',
    level: '4eme',
    subject: 'Physique',
    description: 'Intensité du courant, tension électrique et résistance. Loi d\'Ohm. Montage en série et dérivation. Utilisation d\'un multimètre.',
    fileSize: '2.3 MB',
    downloadsCount: 980,
    tags: ['Collège', 'Électricité', 'Loi d\'Ohm', 'Circuits', 'Multimètre'],
    pdfUrl: '#college-electricite',
    publishDate: '2025-10-05'
  },

  // --- FASCICULES ---
  {
    id: 'fascicule-physique-terminale',
    title: 'Le Compagnon Physique TS : Exercices Corrigés',
    level: 'Fascicules',
    subject: 'Physique',
    description: 'Un recueil complet de plus de 150 exercices classés par difficulté, couvrant l\'intégralité du programme de physique de Terminale S avec corrections pas-à-pas.',
    fileSize: '12.4 MB',
    downloadsCount: 5210,
    tags: ['Livre', 'Recueil', 'Exercices', 'Révisions', 'TS'],
    pdfUrl: '#fascicule-physique-terminale',
    publishDate: '2026-01-05'
  },
  {
    id: 'fascicule-chimie-terminale',
    title: 'Le Compagnon Chimie TS : Recueil de Problèmes',
    level: 'Fascicules',
    subject: 'Chimie',
    description: 'Fascicule officiel d\'exercices de Chimie pour Terminale S. Méthodes de résolution rapides, fiches mémos et sujets types corrigés pour exceller au baccalauréat.',
    fileSize: '10.2 MB',
    downloadsCount: 4890,
    tags: ['Livre', 'Chimie', 'Problèmes', 'Méthodes', 'TS'],
    pdfUrl: '#fascicule-chimie-terminale',
    publishDate: '2026-01-12'
  },
  {
    id: 'fascicule-formulaire-complet',
    title: 'Mémento de toutes les formules de PC (Seconde à Terminale)',
    level: 'Fascicules',
    subject: 'Mixte',
    description: 'Fiche de synthèse ultra-compacte regroupant 100% des formules mathématiques, constantes physiques et relations chimiques indispensables du lycée.',
    fileSize: '1.5 MB',
    downloadsCount: 6120,
    tags: ['Formulaire', 'Synthèse', 'Aide-mémoire', 'Constantes'],
    pdfUrl: '#fascicule-formulaire-complet',
    publishDate: '2025-09-01'
  },

  // --- CSM (Cours Santé Militaire) : en attente de contenu ---

  // --- CGS (Concours Général Sénégalais) : en attente de contenu ---

  // --- BAC ---
  {
    id: 'bac-sujet-2025',
    title: 'Sujet Officiel BAC S - Session de Juin 2025',
    level: 'BAC',
    subject: 'Mixte',
    description: 'Épreuve complète de Physique-Chimie du baccalauréat. Exercices sur le mouvement des satellites, la synthèse organique et le titrage conductimétrique.',
    fileSize: '1.8 MB',
    downloadsCount: 3450,
    tags: ['Sujet', 'Annales', 'Bac 2025', 'Satellites'],
    pdfUrl: '#bac-2025-sujet',
    publishDate: '2025-06-22',
    examYear: '2025',
    examRound: 'Premier tour',
    examSeries: 'S1'
  },
  {
    id: 'bac-corrige-2025',
    title: 'Correction Détaillée BAC S - Session de Juin 2025',
    level: 'BAC',
    subject: 'Mixte',
    description: 'Corrigé complet rédigé avec conseils méthodologiques, barème officiel et pièges à éviter pour l\'épreuve de Physique-Chimie 2025.',
    fileSize: '2.4 MB',
    downloadsCount: 4120,
    tags: ['Correction', 'Méthodologie', 'Bac 2025', 'Rédigé'],
    pdfUrl: '#bac-2025-corrige',
    publishDate: '2025-06-25',
    examYear: '2025',
    examRound: 'Premier tour',
    examSeries: 'S1'
  },
  {
    id: 'bac-sujet-2024',
    title: 'Sujet Officiel BAC S - Session de Juin 2024',
    level: 'BAC',
    subject: 'Mixte',
    description: 'Épreuve écrite de sciences physiques. Exercices sur la lunette astronomique, la cinétique d\'une eau de Javel et les transferts d\'énergie.',
    fileSize: '1.7 MB',
    downloadsCount: 2890,
    tags: ['Sujet', 'Annales', 'Bac 2024', 'Optique'],
    pdfUrl: '#bac-2024-sujet',
    publishDate: '2024-06-20',
    examYear: '2024',
    examRound: 'Premier tour',
    examSeries: 'S1'
  },
  {
    id: 'bac-corrige-2024',
    title: 'Correction Détaillée BAC S - Session de Juin 2024',
    level: 'BAC',
    subject: 'Mixte',
    description: 'Corrigé officiel rédigé par notre équipe pédagogique. Idéal pour s\'entraîner en conditions réelles d\'examen.',
    fileSize: '2.2 MB',
    downloadsCount: 3100,
    tags: ['Correction', 'Annales', 'Bac 2024', 'Cinétique'],
    pdfUrl: '#bac-2024-corrige',
    publishDate: '2024-06-23',
    examYear: '2024',
    examRound: 'Premier tour',
    examSeries: 'S1'
  }
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
