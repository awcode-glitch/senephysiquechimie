import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { getCourseDownloadFilename, getCourseDownloadHref, hasRealPdf, isDataUrlPdf, dataUrlToBlobUrl } from '../utils/coursePdf';
import {
  FileText,
  Video,
  Download,
  Eye,
  ExternalLink,
  Youtube,
  Atom,
  Beaker,
  Calendar
} from 'lucide-react';

interface ChapterRowProps {
  course: Course;
  onDownloadClick: (course: Course) => void;
  key?: string;
}

export const getChapterVideoUrl = (courseId: string, title: string, youtubeUrl?: string): string => {
  if (youtubeUrl) return youtubeUrl;

  // High quality educational default videos
  const defaults: Record<string, string> = {
    'ts-p1': 'https://www.youtube.com/watch?v=9L-eD6_FkCg', // Cinématique Newton
    'ts-c1': 'https://www.youtube.com/watch?v=VAs5gNCOaXw', // Cinétique Chimique
    'ts-p2': 'https://www.youtube.com/watch?v=7hXzU3Y86zY', // Ondes et dualité
    'ts-c2': 'https://www.youtube.com/watch?v=1uH05zM_57E', // Acido-basique pH
    'ts-p3': 'https://www.youtube.com/watch?v=jHq_T7D39R4', // Thermodynamique
    '1s-p1': 'https://www.youtube.com/watch?v=1F9N4_Q6fM8', // Champs et interactions
    '1s-c1': 'https://www.youtube.com/watch?v=b8nPhy7i0Xw', // Molécules cohésion
    '1s-p2': 'https://www.youtube.com/watch?v=48-g-W26XzY', // Énergie mécanique
    '1s-c2': 'https://www.youtube.com/watch?v=H7SskOid6H4', // Spectrophotométrie
    '2s-p1': 'https://www.youtube.com/watch?v=3RAtzby4Oig', // Signaux médecine
    '2s-c1': 'https://www.youtube.com/watch?v=K1hP7I0X3Z0', // Atome chimie
    '2s-p2': 'https://www.youtube.com/watch?v=v3vRmsWz1rU', // Mouvement forces
    '2s-c2': 'https://www.youtube.com/watch?v=P_mSbyg_LVs', // Quantité mole
  };
  
  return defaults[courseId] || `https://www.youtube.com/results?search_query=Cours+Physique+Chimie+${encodeURIComponent(title)}`;
};

export default function ChapterRow({ course, onDownloadClick }: ChapterRowProps) {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    setVideoUrl(getChapterVideoUrl(course.id, course.title, course.youtubeUrl));
  }, [course.id, course.title, course.youtubeUrl]);

  // Real Storage URLs (https://...) can be opened directly. Legacy base64
  // PDFs (data:...) need converting to a blob: URL first — Chromium browsers
  // block top-level navigation straight to a data: URL.
  const [pdfViewUrl, setPdfViewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!hasRealPdf(course)) {
      setPdfViewUrl(null);
      return;
    }
    if (!isDataUrlPdf(course)) {
      setPdfViewUrl(course.pdfUrl);
      return;
    }
    const blobUrl = dataUrlToBlobUrl(course.pdfUrl);
    setPdfViewUrl(blobUrl);
    return () => URL.revokeObjectURL(blobUrl);
  }, [course.pdfUrl]);

  const getSubjectStyles = (subject: Course['subject']) => {
    switch (subject) {
      case 'Physique':
        return {
          badgeBg: 'bg-blue-50/60 text-[#0056D2] border border-blue-100/50',
          icon: Atom,
          iconColor: 'text-[#0056D2]'
        };
      case 'Chimie':
        return {
          badgeBg: 'bg-blue-50/60 text-[#0056D2] border border-blue-100/50',
          icon: Beaker,
          iconColor: 'text-[#0056D2]'
        };
      default:
        return {
          badgeBg: 'bg-slate-50 text-slate-700 border border-slate-150',
          icon: FileText,
          iconColor: 'text-slate-600'
        };
    }
  };

  const { badgeBg, icon: SubjectIcon } = getSubjectStyles(course.subject);

  return (
    <div 
      id={`chapter-row-${course.id}`}
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col space-y-6"
    >
      {/* Chapter Main Info Line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            {course.chapterNumber && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50/60 px-2 py-0.5 rounded border border-blue-100/50">
                Chapitre {course.chapterNumber}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border flex items-center space-x-1 ${badgeBg}`}>
              <SubjectIcon className="h-3 w-3" />
              <span>{course.subject}</span>
            </span>
            <span className="bg-slate-100 text-slate-700 border-slate-200/60 px-2 py-0.5 rounded text-[10px] font-bold uppercase border">
              Classe : {course.level === '3eme' ? 'Troisième (3e)' : course.level === '4eme' ? 'Quatrième (4e)' : course.level === 'BAC' ? 'Annales BAC' : course.level}
            </span>
            <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Publié le {course.publishDate}</span>
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#1F1F1F] mt-2 tracking-tight">
            {course.title}
          </h3>
        </div>
      </div>

      {/* Two Spaces: PDF Space and YouTube Course Space */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Espace PDF */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-[#0056D2] font-bold text-xs uppercase tracking-wider">
              <FileText className="h-4 w-4" />
              <span>Espace Document PDF</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {pdfViewUrl ? (
              <a
                href={pdfViewUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex-grow flex items-center justify-center space-x-1.5 bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-sm cursor-pointer border border-[#0056D2]/10"
              >
                <Eye className="h-4 w-4" />
                <span>Visualiser le PDF</span>
              </a>
            ) : (
              <button
                onClick={() => onDownloadClick(course)}
                className="flex-grow flex items-center justify-center space-x-1.5 bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-sm cursor-pointer border border-[#0056D2]/10"
              >
                <Eye className="h-4 w-4" />
                <span>Visualiser le PDF</span>
              </button>
            )}
            <a
              href={pdfViewUrl ?? getCourseDownloadHref(course)}
              download={getCourseDownloadFilename(course)}
              className="flex items-center justify-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-350 font-bold text-xs py-2.5 px-3 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <Download className="h-4 w-4 text-[#0056D2]" />
              <span className="hidden sm:inline">Télécharger</span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Espace Cours Vidéo YouTube */}
        <div className="p-5 rounded-2xl bg-[#0056D2]/5 border border-blue-100/60 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-[#0056D2] font-bold text-xs uppercase tracking-wider">
                <Video className="h-4 w-4 text-red-600 animate-pulse" />
                <span>Espace Cours Vidéo</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Consultez la leçon explicative en vidéo pour mieux assimiler les concepts théoriques et les méthodes d'application.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-white border border-blue-100/50 flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <Youtube className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[8px] font-mono uppercase tracking-wider text-slate-400 font-bold">Provenance du Lien</span>
                <span className="text-xs font-bold text-slate-700 truncate max-w-[150px] sm:max-w-[200px] block">
                  {videoUrl.includes('youtube.com/results') ? "Recherche Automatique" : "Vidéo Enseignante"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Youtube className="h-4 w-4" />
              <span>Regarder le cours sur YouTube</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
