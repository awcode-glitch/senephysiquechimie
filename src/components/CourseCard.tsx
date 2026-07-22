import React from 'react';
import { Course } from '../types';
import { FileText, Atom, Beaker, Download, Sparkles, Calendar, Layers } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onDownloadClick: (course: Course) => void;
  key?: string;
}

export default function CourseCard({ course, onDownloadClick }: CourseCardProps) {
  
  const getSubjectStyles = (subject: Course['subject']) => {
    switch (subject) {
      case 'Physique':
        return {
          badgeBg: 'bg-blue-50/60 text-[#0056D2] border border-blue-100/50',
          textHover: 'group-hover:text-[#0056D2]',
          icon: Atom,
          iconColor: 'text-[#0056D2]'
        };
      case 'Chimie':
        return {
          badgeBg: 'bg-blue-50/60 text-[#0056D2] border border-blue-100/50',
          textHover: 'group-hover:text-[#0056D2]',
          icon: Beaker,
          iconColor: 'text-[#0056D2]'
        };
      default:
        return {
          badgeBg: 'bg-slate-50 text-slate-700 border border-slate-150',
          textHover: 'group-hover:text-slate-900',
          icon: FileText,
          iconColor: 'text-slate-600'
        };
    }
  };

  const { badgeBg, textHover, icon: SubjectIcon } = getSubjectStyles(course.subject);

  const getLevelLabel = (lvl: Course['level']) => {
    switch (lvl) {
      case '3eme': return 'Troisième 3e';
      case '4eme': return 'Quatrième 4e';
      case 'TS': return 'Terminale S (TS)';
      case '1S': return 'Première S (1S)';
      case '2S': return 'Seconde S (2S)';
      default: return lvl;
    }
  };

  const getLevelColor = (lvl: Course['level']) => {
    return 'bg-slate-100/80 text-slate-700 border border-slate-200/60';
  };

  return (
    <div 
      id={`course-card-${course.id}`}
      className="group relative rounded-2xl bg-white border border-slate-200/80 hover:border-[#0056D2] shadow-sm hover:shadow-md transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between overflow-hidden"
    >
      <div>
        
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center space-x-1.5">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase border ${getLevelColor(course.level)}`}>
              {getLevelLabel(course.level)}
            </span>
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase border flex items-center space-x-1 ${badgeBg}`}>
              <SubjectIcon className="h-3 w-3" />
              <span>{course.subject}</span>
            </span>
          </div>

          {course.chapterNumber && (
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
              Chapitre {course.chapterNumber}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`text-base sm:text-lg font-bold text-[#1F1F1F] tracking-tight leading-snug transition-colors duration-200 ${textHover}`}>
          {course.title}
        </h3>

        {/* Description */}
        <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">
          {course.description}
        </p>

        {/* Dynamic Tag Pills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {course.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200/50 font-mono">
              #{tag}
            </span>
          ))}
          {course.tags.length > 3 && (
            <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-full border border-slate-200/50 font-mono">
              +{course.tags.length - 3}
            </span>
          )}
        </div>

      </div>

      {/* Footer Meta & Download Trigger */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        
        {/* Size and downloads info */}
        <div className="flex items-center space-x-3 text-[10px] font-bold font-mono text-slate-500">
          <span className="flex items-center space-x-1">
            <FileText className="h-3.5 w-3.5 text-[#0056D2]" />
            <span>{course.fileSize}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Download className="h-3.5 w-3.5 text-[#0056D2]" />
            <span>{course.downloadsCount.toLocaleString()} tlg.</span>
          </span>
        </div>

        {/* Interactive download button */}
        <button
          onClick={() => onDownloadClick(course)}
          className="flex items-center space-x-1.5 bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-xs py-2 px-4 rounded-xl transition-all duration-200 shadow-sm cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Télécharger le PDF</span>
        </button>

      </div>

    </div>
  );
}
