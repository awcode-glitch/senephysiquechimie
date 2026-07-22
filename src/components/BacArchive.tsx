import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { getCourseDownloadFilename, getCourseDownloadHref, hasRealPdf, isDataUrlPdf, dataUrlToBlobUrl } from '../utils/coursePdf';
import { ChevronDown, CalendarDays, Flag, Eye, Download } from 'lucide-react';

interface BacArchiveProps {
  courses: Course[];
  onDownloadClick: (course: Course) => void;
}

const SERIES_ORDER = ['S1', 'S2', 'L2'];
const ROUND_ORDER: (Course['examRound'] | 'Non précisé')[] = ['Premier tour', 'Second tour', 'Non précisé'];

function seriesRank(series: string): number {
  const idx = SERIES_ORDER.indexOf(series);
  return idx === -1 ? SERIES_ORDER.length : idx;
}

function BacRow({ course, onDownloadClick }: { course: Course; onDownloadClick: (c: Course) => void; key?: string }) {
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

  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-[#0056D2]/30 transition-colors">
      <span className="flex-1 min-w-0 text-xs sm:text-sm font-semibold text-slate-800 truncate">{course.title}</span>
      {course.examYear && (
        <span className="hidden sm:inline-block shrink-0 text-[10px] font-mono font-bold text-[#0056D2] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
          {course.examYear}
        </span>
      )}
      {course.examSeries && (
        <span className="hidden sm:inline-block shrink-0 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
          {course.examSeries}
        </span>
      )}

      {pdfViewUrl ? (
        <a
          href={pdfViewUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="shrink-0 flex items-center gap-1.5 bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-[11px] py-2 px-3 rounded-lg transition-colors cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Visualiser</span>
        </a>
      ) : (
        <button
          onClick={() => onDownloadClick(course)}
          className="shrink-0 flex items-center gap-1.5 bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-[11px] py-2 px-3 rounded-lg transition-colors cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Visualiser</span>
        </button>
      )}

      <a
        href={pdfViewUrl ?? getCourseDownloadHref(course)}
        download={getCourseDownloadFilename(course)}
        className="shrink-0 flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-[11px] py-2 px-3 rounded-lg transition-colors cursor-pointer"
      >
        <Download className="h-3.5 w-3.5 text-[#0056D2]" />
        <span className="hidden sm:inline">Télécharger</span>
      </a>
    </div>
  );
}

export default function BacArchive({ courses, onDownloadClick }: BacArchiveProps) {
  const years = Array.from(new Set(courses.map((c) => c.examYear || 'Année non précisée')))
    .sort((a, b) => {
      const na = Number(a);
      const nb = Number(b);
      if (!isNaN(na) && !isNaN(nb)) return nb - na; // most recent first
      if (!isNaN(na)) return -1;
      if (!isNaN(nb)) return 1;
      return a.localeCompare(b);
    });

  const [openYear, setOpenYear] = useState<string | null>(years[0] ?? null);

  return (
    <div className="flex flex-col gap-4">
      {years.map((year) => {
        const yearCourses = courses.filter((c) => (c.examYear || 'Année non précisée') === year);
        const isOpen = openYear === year;

        const rounds = ROUND_ORDER
          .map((round) => ({
            round,
            courses: yearCourses.filter((c) => (c.examRound || 'Non précisé') === round)
          }))
          .filter((r) => r.courses.length > 0);

        return (
          <div key={year} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Year header (collapsible) */}
            <button
              onClick={() => setOpenYear(isOpen ? null : year)}
              className="w-full flex items-center gap-3 px-5 sm:px-6 py-4 bg-slate-50/60 hover:bg-slate-100/60 transition-colors cursor-pointer"
            >
              <CalendarDays className="h-4.5 w-4.5 text-[#0056D2] shrink-0" />
              <span className="text-sm sm:text-base font-extrabold text-slate-900">Session {year}</span>
              <span className="text-[10px] font-mono font-bold text-[#0056D2] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {yearCourses.length} document{yearCourses.length > 1 ? 's' : ''}
              </span>
              <ChevronDown className={`h-4 w-4 text-slate-400 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="p-4 sm:p-5 pt-2 space-y-4">
                {rounds.map(({ round, courses: roundCourses }) => {
                  const seriesList = Array.from(new Set(roundCourses.map((c) => c.examSeries || 'Toutes séries')))
                    .sort((a, b) => seriesRank(a) - seriesRank(b));

                  return (
                    <div key={round} className="space-y-2.5">
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 first:border-t-0 first:pt-0">
                        <Flag className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">
                          {round}
                        </h4>
                      </div>

                      {seriesList.map((series) => {
                        const seriesCourses = roundCourses
                          .filter((c) => (c.examSeries || 'Toutes séries') === series)
                          .sort((a, b) => a.publishDate.localeCompare(b.publishDate));
                        const showSeriesLabel = !(seriesList.length === 1 && series === 'Toutes séries');
                        return (
                          <div key={series} className={showSeriesLabel ? 'pl-2 sm:pl-3 border-l-2 border-blue-100 space-y-2' : 'space-y-2'}>
                            {showSeriesLabel && (
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                                Série {series}
                              </span>
                            )}
                            <div className="flex flex-col gap-2">
                              {seriesCourses.map((course) => (
                                <BacRow key={course.id} course={course} onDownloadClick={onDownloadClick} />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
