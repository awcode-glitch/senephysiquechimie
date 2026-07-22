export interface Course {
  id: string;
  title: string;
  chapterNumber?: number;
  level: 'TS' | '1S' | '2S' | 'BAC' | 'CSM' | 'Fascicules' | 'CGS' | '3eme' | '4eme';
  subject: 'Physique' | 'Chimie' | 'Mixte';
  description: string;
  fileSize: string;
  downloadsCount: number;
  tags: string[];
  pdfUrl: string;
  publishDate: string;
  youtubeUrl?: string;
  // Document type, used by the "TD Physique/TD Chimie/Évaluations" navbar quick links.
  // Absent/'Cours' = regular chapter content.
  docType?: 'Cours' | 'TD' | 'Évaluation';
  // BAC-specific archive fields (used only when level === 'BAC')
  examYear?: string;
  examRound?: 'Premier tour' | 'Second tour';
  examSeries?: string;
}

export interface DropdownItem {
  name: string;
  chapterId: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
