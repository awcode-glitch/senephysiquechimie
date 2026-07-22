import React from 'react';
import { Course } from '../types';
import { X, FileText, Download, Printer, BookOpen, AlertCircle } from 'lucide-react';
import { getCourseDownloadFilename, getCourseDownloadHref } from '../utils/coursePdf';

interface PdfPreviewModalProps {
  course: Course | null;
  onClose: () => void;
}

export default function PdfPreviewModal({ course, onClose }: PdfPreviewModalProps) {
  if (!course) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate some realistic syllabus content for the "PDF Online Reader" simulation
  const getSyllabusContent = () => {
    return [
      { title: "I. Introduction aux concepts fondamentaux", desc: "Définition des grandeurs physiques clés, système international d'unités (SI) et analyse dimensionnelle." },
      { title: "II. Principes théoriques & Équations directrices", desc: "Démonstrations des relations fondamentales du chapitre et hypothèses simplificatrices." },
      { title: "III. Méthodes expérimentales & Protocoles", desc: "Description du matériel de laboratoire requis, étapes du protocole et traitement des incertitudes." },
      { title: "IV. Exercices d'application directe", desc: "Questions types résolues avec rappels de cours méthodologiques indispensables." }
    ];
  };

  return (
    <div
      id="pdf-preview-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="modal-content"
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-50 text-[#0056D2]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0056D2]">
                Visualiseur PDF Intégré
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 line-clamp-1">
                {course.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 custom-scrollbar bg-white">

          {/* Document info strip */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-[10px] font-mono font-bold text-slate-500">
            <div className="text-left">
              <span className="block text-slate-400 uppercase tracking-wider text-[8px] mb-0.5 font-bold">Taille Fichier</span>
              <span className="text-slate-800">{course.fileSize}</span>
            </div>
            <div className="text-center">
              <span className="block text-slate-400 uppercase tracking-wider text-[8px] mb-0.5 font-bold">Niveau</span>
              <span className="text-[#0056D2]">{course.level}</span>
            </div>
            <div className="text-right">
              <span className="block text-slate-400 uppercase tracking-wider text-[8px] mb-0.5 font-bold">Publié le</span>
              <span className="text-emerald-700">{course.publishDate}</span>
            </div>
          </div>

          {/* Interactive Document Preview Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <BookOpen className="h-4 w-4 text-[#0056D2]" />
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Sommaire & Contenu du Document
                </h4>
              </div>
              <span className="text-[10px] font-mono bg-blue-50 text-[#0056D2] px-2.5 py-0.5 rounded border border-blue-100">
                Format PDF Officiel
              </span>
            </div>

            {/* Simulated Document Preview Page */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner max-h-80 overflow-y-auto custom-scrollbar relative">
              <div className="space-y-4 font-sans">

                {/* Title inside document */}
                <div className="text-center border-b border-slate-200 pb-4 mb-4">
                  <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-100">
                    PROGRAMME OFFICIEL - NIVEAU {course.level}
                  </span>
                  <h1 className="text-lg font-extrabold text-slate-900 mt-2">
                    {course.title}
                  </h1>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    Auteur: Professeur de Physique-Chimie • Révision 2026
                  </p>
                </div>

                {/* Subsections list */}
                <div className="space-y-3.5">
                  {getSyllabusContent().map((section, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-[#0056D2]/30 transition-all">
                      <h5 className="text-xs font-bold text-[#0056D2] flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 bg-[#0056D2] rounded-full" />
                        <span>{section.title}</span>
                      </h5>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed pl-3 font-medium">
                        {section.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Simulated alert info box */}
                <div className="mt-4 p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-[#0056D2] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                    <span className="text-[#0056D2] font-bold">Conseil de l'enseignant :</span> Pour maximiser l'efficacité de vos révisions, essayez de résoudre la série d'exercices d'application par vous-même avant de consulter la correction pas-à-pas présente à la fin du document.
                  </p>
                </div>

                {/* PDF Footer branding indicator */}
                <div className="text-center pt-4 border-t border-slate-200 text-[9px] text-slate-400 font-mono">
                  Document numérique libre de droit • Senephysiquechimie
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between p-5 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
          >
            Fermer le visualiseur
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs py-2 px-3.5 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>
            <a
              href={getCourseDownloadHref(course)}
              download={getCourseDownloadFilename(course)}
              className="flex items-center space-x-1.5 bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Télécharger</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
