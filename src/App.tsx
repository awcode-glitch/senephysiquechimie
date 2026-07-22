import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ClassPortal from './components/ClassPortal';
import ChapterRow from './components/ChapterRow';
import BacArchive from './components/BacArchive';
import PdfPreviewModal from './components/PdfPreviewModal';
import ContactSection from './components/ContactSection';
import AdminDashboard from './components/AdminDashboard';
import { Course } from './types';
import { getWhatsAppLink, WHATSAPP_DISPLAY } from './utils/whatsapp';
import { subscribeToCourses } from './lib/coursesStore';
import { 
  FileText,
  ListRestart,
  Sparkles, 
  Phone, 
  Mail,
  Award,
  RefreshCw,
  ArrowLeft, 
  Tv, 
  Search, 
  BookOpen,
  Layers,
  ChevronRight
} from 'lucide-react';

// These levels use the year/tour/série archive layout (BacArchive) instead of the standard chapter list
const ARCHIVE_LEVELS = ['BAC', 'CSM', 'CGS'];

// Explains what these acronyms actually mean, shown at the top of their pages
const ARCHIVE_LEVEL_SUBTITLES: Record<string, string> = {
  CSM: "Concours d'entrée à l'École Militaire de Santé",
  CGS: 'Concours Général Sénégalais'
};

export default function App() {
  const [activeLevel, setActiveLevel] = useState<string>(() =>
    window.location.pathname === '/admin' ? 'Admin' : 'Accueil'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Physique' | 'Chimie'>('All');
  const [selectedDocType, setSelectedDocType] = useState<'All' | 'Cours' | 'TD' | 'Évaluation'>('All');
  const [selectedCourseForDownload, setSelectedCourseForDownload] = useState<Course | null>(null);

  // Force light mode on mount
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  // Live list of courses, shared across every visitor via Firestore
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoaded, setCoursesLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCourses((liveCourses) => {
      setCourses(liveCourses);
      setCoursesLoaded(true);
    });
    return unsubscribe;
  }, []);

  // Scroll to top on page transition to simulate real page loads
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [activeLevel]);

  // Keep the URL in sync with the Admin panel (accessible only via /admin, no public nav link)
  useEffect(() => {
    if (activeLevel === 'Admin') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
    } else if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    }
  }, [activeLevel]);

  // Support browser back/forward navigation to and from /admin
  useEffect(() => {
    const handlePopState = () => {
      setActiveLevel(window.location.pathname === '/admin' ? 'Admin' : 'Accueil');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Smooth scroll helper
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 90; // Navbar offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle homepage search submission
  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '') {
      setActiveLevel('Search');
    } else {
      setActiveLevel('Accueil');
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('All');
    setSelectedDocType('All');
  };

  // Reset page and filters
  const handleResetToAccueil = () => {
    setActiveLevel('Accueil');
    setSearchQuery('');
    setSelectedSubject('All');
    setSelectedDocType('All');
  };

  // Filter courses dynamically based on Level, Subject, Document type, and Search query
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // 1. Level Filter (Only apply if we are not on the global search page)
      if (activeLevel !== 'Search' && course.level !== activeLevel) {
        return false;
      }

      // 2. Subject Filter
      if (selectedSubject !== 'All' && course.subject !== selectedSubject) {
        return false;
      }

      // 3. Document Type Filter (Cours / TD / Évaluation)
      if (selectedDocType !== 'All' && (course.docType || 'Cours') !== selectedDocType) {
        return false;
      }

      // 4. Search Query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesDesc = course.description.toLowerCase().includes(query);
        const matchesLevel = course.level.toLowerCase().includes(query);
        const matchesSubject = course.subject.toLowerCase().includes(query);
        const matchesTags = course.tags.some(tag => tag.toLowerCase().includes(query));

        return matchesTitle || matchesDesc || matchesLevel || matchesSubject || matchesTags;
      }

      return true;
    });
  }, [activeLevel, selectedSubject, selectedDocType, searchQuery, courses]);

  // Full syllabus for the current level (ignores subject/search sub-filters), used by the "Programme" table of contents
  const levelCourses = useMemo(() => {
    if (activeLevel === 'Search') return [];
    return courses
      .filter((course) => course.level === activeLevel)
      .sort((a, b) => (a.chapterNumber ?? 999) - (b.chapterNumber ?? 999));
  }, [activeLevel, courses]);

  // Determine current category view title
  const viewTitle = useMemo(() => {
    if (activeLevel === 'Search') return `Résultats de recherche pour "${searchQuery}"`;
    if (activeLevel === '3eme') return 'Classe de Troisième (3ème)';
    if (activeLevel === '4eme') return 'Classe de Quatrième (4ème)';
    if (activeLevel === 'BAC') return 'Annales & Corrections du BAC S';
    if (activeLevel === 'CSM') return 'Cours Santé Militaire (CSM)';
    if (activeLevel === 'CGS') return 'Concours Général Sénégalais (CGS)';
    if (activeLevel === 'Fascicules') return 'Fascicules d\'exercices & Recueils';
    if (activeLevel === 'TS') return 'Classe de Terminale S (TS)';
    if (activeLevel === '1S') return 'Classe de Première S (1S)';
    if (activeLevel === '2S') return 'Classe de Seconde S (2S)';
    return `Espace de cours ${activeLevel}`;
  }, [activeLevel, searchQuery]);

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-slate-900 transition-colors duration-300">
      
      {/* 1. Header Navigation */}
      <Navbar
        activeLevel={activeLevel}
        setActiveLevel={setActiveLevel}
        setSearchQuery={setSearchQuery}
        setSelectedSubject={setSelectedSubject}
        setSelectedDocType={setSelectedDocType}
        scrollToSection={scrollToSection}
      />

      {/* PAGE 1: ACCUEIL (HOMEPAGE) */}
      {activeLevel === 'Accueil' && (
        <div className="animate-in fade-in duration-300">
          {/* Welcome Hero Section with search */}
          <Hero 
            searchQuery={searchQuery}
            setSearchQuery={handleSearchSubmit}
            setActiveLevel={setActiveLevel}
            scrollToSection={scrollToSection}
            totalCoursesCount={courses.length}
          />

          {/* Core Level Navigation Portal - Grid of Classes */}
          <ClassPortal 
            courses={courses}
            onSelectLevel={(level) => setActiveLevel(level)}
          />
        </div>
      )}

      {/* PAGE 2: INDIVIDUAL CLASS ROOMS & SEARCH RESULTS */}
      {activeLevel !== 'Accueil' && (
        <main id="telechargements" className="flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative animate-in fade-in duration-300">

          {activeLevel === 'Admin' ? (
            <AdminDashboard
              courses={courses}
              onClose={handleResetToAccueil}
            />
          ) : (
            <>
              {/* Back button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <button
                  onClick={handleResetToAccueil}
                  className="inline-flex items-center space-x-2 text-xs font-bold text-[#0056D2] hover:text-blue-800 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Retour à l'accueil</span>
                </button>
              </div>

              {ARCHIVE_LEVEL_SUBTITLES[activeLevel] && (
                <p className="text-sm text-slate-600 font-medium bg-blue-50/60 border border-blue-100 rounded-xl px-4 py-3 mb-6">
                  {ARCHIVE_LEVEL_SUBTITLES[activeLevel]}
                </p>
              )}

          {/* Header Controls for Directory (BAC has its own year/tour/série archive header instead) */}
          {!ARCHIVE_LEVELS.includes(activeLevel) && (
            <div className="border-b border-slate-200 pb-6 mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
                  <span>{viewTitle}</span>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-[#0056D2] border border-slate-200 px-2.5 py-0.5 rounded-full shadow-sm">
                    {filteredCourses.length} {filteredCourses.length > 1 ? 'chapitres' : 'chapitre'}
                  </span>
                </h2>
                <p className="text-xs text-slate-600 mt-2 font-medium">
                  {activeLevel === 'Search'
                    ? 'Résultats de recherche à travers tous les niveaux scolaires de la plateforme.'
                    : 'Consultez ci-dessous les chapitres officiels de ce niveau. Chaque chapitre dispose d\'un support PDF et d\'une vidéo de cours dédiée.'
                  }
                </p>
              </div>

              {/* Subject Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 mr-1.5 hidden sm:inline">Matière :</span>
                <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                  {(['All', 'Physique', 'Chimie'] as const).map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                        selectedSubject === subject
                          ? 'bg-white text-[#0056D2] border border-slate-200 shadow-sm'
                          : 'text-slate-600 hover:text-[#0056D2] hover:bg-white/50'
                      }`}
                    >
                      {subject === 'All' ? 'Tous' : subject}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Selected query pill display & mini search within level */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-blue-50/50 border border-blue-100 rounded-2xl px-4 py-3 mb-8 text-xs shadow-sm">
            <div className="flex flex-wrap items-center gap-2 font-medium text-slate-700">
              <span>Filtres actifs :</span>
              {activeLevel !== 'Search' && (
                <span className="bg-white text-[#0056D2] px-2.5 py-1 rounded-lg border border-slate-200 font-semibold font-mono shadow-sm">
                  Niveau: {activeLevel === '3eme' ? '3ème' : activeLevel === '4eme' ? '4ème' : activeLevel}
                </span>
              )}
              {selectedSubject !== 'All' && (
                <span className="bg-white text-emerald-700 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold font-mono shadow-sm">
                  Matière: {selectedSubject}
                </span>
              )}
              {selectedDocType !== 'All' && (
                <span className="bg-white text-amber-700 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold font-mono shadow-sm">
                  Type: {selectedDocType}
                </span>
              )}
              {searchQuery && (
                <span className="bg-white text-purple-700 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold font-mono italic shadow-sm">
                  Recherche: "{searchQuery}"
                </span>
              )}
            </div>
            
            {/* Inline search box to refine within class */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-inner">
                <Search className="h-3.5 w-3.5 text-slate-400 ml-1.5" />
                <input
                  type="text"
                  placeholder="Filtrer ici..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-0 pl-2 pr-2 text-xs font-semibold focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400 w-32 sm:w-44"
                />
              </div>

              {(searchQuery || selectedSubject !== 'All' || selectedDocType !== 'All') && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center space-x-1 text-[#0056D2] hover:text-blue-800 font-bold font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Réinitialiser</span>
                </button>
              )}
            </div>
          </div>

          {/* Programme: full syllabus table of contents for the current level (BAC uses its own year/tour/série archive view instead) */}
          {coursesLoaded && !ARCHIVE_LEVELS.includes(activeLevel) && levelCourses.length > 0 && (
            <div className="mb-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                <BookOpen className="h-4 w-4 text-[#0056D2]" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Programme {activeLevel === '3eme' ? '3ème' : activeLevel === '4eme' ? '4ème' : activeLevel}
                </h3>
                <span className="ml-auto text-[10px] font-mono font-bold text-[#0056D2] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {levelCourses.length} chapitre{levelCourses.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y divide-slate-100 sm:divide-y-0">
                {levelCourses.map((course, idx) => (
                  <button
                    key={course.id}
                    onClick={() => scrollToSection(`chapter-row-${course.id}`)}
                    className="group flex items-center gap-3 px-5 sm:px-6 py-3.5 text-left hover:bg-blue-50/50 transition-colors cursor-pointer border-b border-slate-100 sm:border-b-0 sm:even:border-l sm:border-slate-100"
                  >
                    <span className="shrink-0 w-7 h-7 rounded-lg bg-[#0056D2]/5 text-[#0056D2] text-[11px] font-mono font-bold flex items-center justify-center border border-blue-100/60 group-hover:bg-[#0056D2] group-hover:text-white transition-colors">
                      {course.chapterNumber ?? idx + 1}
                    </span>
                    <span className="flex-1 text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-[#0056D2] transition-colors line-clamp-1">
                      {course.title}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#0056D2] shrink-0 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Courses Rows / Lists */}
          {!coursesLoaded ? (
            <div className="text-center py-16">
              <div className="w-6 h-6 mx-auto border-2 border-[#0056D2] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500 font-medium mt-3">Chargement des cours...</p>
            </div>
          ) : filteredCourses.length > 0 ? (
            ARCHIVE_LEVELS.includes(activeLevel) ? (
              <BacArchive
                courses={filteredCourses}
                onDownloadClick={(c) => setSelectedCourseForDownload(c)}
              />
            ) : (
              <div id="courses-grid" className="flex flex-col space-y-6">
                {filteredCourses.map((course) => (
                  <ChapterRow
                    key={course.id}
                    course={course}
                    onDownloadClick={(c) => setSelectedCourseForDownload(c)}
                  />
                ))}
              </div>
            )
          ) : (
            <div id="no-courses-fallback" className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-200 shadow-sm max-w-lg mx-auto">
              <div className="inline-flex p-4 rounded-2xl bg-blue-50 text-[#0056D2] border border-blue-100 mb-4 shadow-sm">
                <ListRestart className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Aucun cours trouvé</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
                Aucun chapitre ne correspond à vos critères de filtrage dans cet espace classe.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-5 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
            </>
          )}
        </main>
      )}

      {/* 4. Contact & Interactive FAQ Section (Home Page only) */}
      {activeLevel === 'Accueil' && <ContactSection />}

      {/* 5. Custom Professional Footer */}
      <footer id="app-footer" className="bg-[#001e62] border-t border-[#001440] text-blue-100 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

            {/* Column 1: Teacher Bio & Logo */}
            <div className="md:col-span-1.5 flex flex-col space-y-2.5">
              <div className="flex items-center space-x-3 select-none">
                <div className="p-2 rounded-lg bg-blue-900 border border-blue-800/50">
                  <Award className="h-5 w-5 text-blue-300" />
                </div>
                <span className="text-base font-bold text-white tracking-tight">
                  SENEPHYSIQUECHIMIE
                </span>
              </div>
              <p className="text-blue-200 leading-relaxed font-medium text-[11px] pr-4">
                Une plateforme d'apprentissage d'élite hébergeant des ressources complètes et actualisées pour les étudiants en Sciences Physiques et Chimiques du secondaire au supérieur.
              </p>
            </div>

            {/* Column 2: Secondary Levels */}
            <div className="flex flex-col space-y-1.5">
              <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider text-blue-300">
                Niveaux Scolaires
              </h4>
              <ul className="space-y-1 text-[11px]">
                <li>
                  <button onClick={() => setActiveLevel('TS')} className="hover:text-white transition-colors cursor-pointer text-left font-medium">
                    Terminale S (TS)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveLevel('1S')} className="hover:text-white transition-colors cursor-pointer text-left font-medium">
                    Première S (1S)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveLevel('2S')} className="hover:text-white transition-colors cursor-pointer text-left font-medium">
                    Seconde S (2S)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveLevel('3eme')} className="hover:text-white transition-colors cursor-pointer text-left font-medium">
                    Troisième (3ème)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveLevel('4eme')} className="hover:text-white transition-colors cursor-pointer text-left font-medium">
                    Quatrième (4ème)
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Advanced Topics */}
            <div className="flex flex-col space-y-1.5">
              <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider text-blue-300">
                Spécialités & Recueils
              </h4>
              <ul className="space-y-1 text-[11px]">
                <li>
                  <button onClick={() => setActiveLevel('Fascicules')} className="hover:text-white transition-colors cursor-pointer text-left font-medium">
                    Fascicules d'exercices
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveLevel('CSM')} className="hover:text-white transition-colors cursor-pointer text-left font-medium">
                    Cours Santé Militaire (CSM)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveLevel('CGS')} className="hover:text-white transition-colors cursor-pointer text-left font-medium">
                    Concours Général Sénégalais (CGS)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveLevel('BAC')} className="hover:text-white transition-colors cursor-pointer text-left font-medium">
                    Annales de BAC rédigées
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact details info */}
            <div className="flex flex-col space-y-1.5">
              <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider text-blue-300">
                Contact & Coordonnées
              </h4>
              <ul className="space-y-1 text-[11px] font-medium">
                <li className="flex items-center space-x-2 text-blue-200">
                  <Mail className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span className="hover:text-white transition-colors cursor-pointer select-all">maw106277@gmail.com</span>
                </li>
                <li className="flex items-center space-x-2 text-blue-200">
                  <Phone className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <a href={getWhatsAppLink()} target="_blank" rel="noreferrer noopener" className="hover:text-white transition-colors">
                    {WHATSAPP_DISPLAY} (WhatsApp)
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Legal / Copyright Bottom */}
          <div className="mt-6 pt-4 border-t border-blue-900 flex items-center justify-center text-blue-300 text-[10px] font-mono">
            <p>© {new Date().getFullYear()} Senephysiquechimie. Tous droits réservés.</p>
          </div>

        </div>
      </footer>

      {/* 6. Document Viewer Modal (Download progress Simulator) */}
      <PdfPreviewModal
        course={selectedCourseForDownload}
        onClose={() => setSelectedCourseForDownload(null)}
      />

    </div>
  );
}
