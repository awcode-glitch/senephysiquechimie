import React, { useState } from 'react';
import { Search, Sparkles, ChevronRight } from 'lucide-react';
import HeroSlideshow from './HeroSlideshow';
import teacherPhoto from '../assets/teacher/mr-sene.png';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setActiveLevel: (level: string) => void;
  scrollToSection: (sectionId: string) => void;
}

export default function Hero({
  searchQuery,
  setSearchQuery,
  setActiveLevel,
  scrollToSection
}: HeroProps) {
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    scrollToSection('telechargements');
  };

  const handleLevelQuickClick = (levelId: string) => {
    setActiveLevel(levelId);
    scrollToSection('telechargements');
  };


  return (
    <div id="accueil" className="relative overflow-hidden bg-gradient-to-b from-[#0056D2]/5 via-white to-[#F5F7FA] pb-16 border-b border-slate-200/60 transition-colors duration-300">

      {/* Full-bleed rotating Physics & Chemistry showcase with overlaid headline */}
      <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] overflow-hidden">
        <HeroSlideshow />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/75 via-slate-900/55 to-slate-900/85" />
        <div className="relative z-[1] h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-3xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            Maîtrisez la <span className="text-blue-300">Physique</span> et la <span className="text-white underline decoration-blue-300 decoration-4 underline-offset-8">Chimie</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-blue-50/90 leading-relaxed font-medium max-w-2xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
            Bienvenue sur votre portail d'apprentissage personnalisé. Retrouvez ici tous mes supports de cours structurés, fiches de révisions, recueils d'exercices corrigés et annales pour vous accompagner vers l'excellence académique.
          </p>
        </div>
      </div>

      {/* Subtle math/science backdrop grid */}
      <div className="absolute inset-x-0 bottom-0 top-[520px] sm:top-[600px] lg:top-[680px] bg-[linear-gradient(to_right,#0056d206_1px,transparent_1px),linear-gradient(to_bottom,#0056d206_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

        {/* Search Engine Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="absolute inset-0 bg-[#0056D2]/5 rounded-2xl blur-md pointer-events-none" />
            <div className="relative flex items-center bg-white border border-slate-300 rounded-2xl p-2.5 shadow-md focus-within:border-[#0056D2] focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-150">
              <div className="pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="h-5 w-5 text-[#0056D2]" />
              </div>
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Ex: Cinématique, Acido-Basique, BAC 2025..."
                className="w-full bg-transparent border-0 py-3 pl-3 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 font-medium"
              />
              <button
                type="submit"
                className="bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-xs py-3.5 px-6 rounded-xl transition-all duration-200 uppercase tracking-wider shadow-md flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Rechercher</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Quick Filter Pill Tags */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-5">
            <span className="text-xs text-slate-500 font-bold tracking-wide uppercase mr-1">Raccourcis:</span>
            <button
              onClick={() => handleLevelQuickClick('TS')}
              className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#0056D2] hover:text-[#0056D2] hover:bg-blue-50/50 transition-all cursor-pointer shadow-sm"
            >
              Terminale
            </button>
            <button
              onClick={() => handleLevelQuickClick('1S')}
              className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#0056D2] hover:text-[#0056D2] hover:bg-blue-50/50 transition-all cursor-pointer shadow-sm"
            >
              Première
            </button>
            <button
              onClick={() => handleLevelQuickClick('2S')}
              className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#0056D2] hover:text-[#0056D2] hover:bg-blue-50/50 transition-all cursor-pointer shadow-sm"
            >
              Seconde
            </button>
            <button
              onClick={() => handleLevelQuickClick('Fascicules')}
              className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#0056D2] hover:text-[#0056D2] hover:bg-blue-50/50 transition-all cursor-pointer shadow-sm"
            >
              Fascicules
            </button>
            <button
              onClick={() => handleLevelQuickClick('BAC')}
              className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#0056D2] hover:text-[#0056D2] hover:bg-blue-50/50 transition-all cursor-pointer shadow-sm"
            >
              BAC S
            </button>
          </div>
        </div>

        {/* Beautiful Welcoming Message Card from the PC teacher */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#0056D2]/5 border border-blue-100/60 shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#0056D2]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="shrink-0 flex flex-col items-center gap-2.5">
              <img
                src={teacherPhoto}
                alt="Photo de l'enseignant, M. Sène"
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-white shadow-md"
              />
              <span className="bg-[#0056D2] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                Enseignant
              </span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-slate-900 text-center md:text-left">
                Mot de bienvenue de votre enseignant
              </h3>
              <p className="mt-1 text-sm font-bold text-[#0056D2]">
                Mousa SENE
              </p>
              <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">
                Professeur de Sciences Physiques — Lycée Banque Islamique (LBI)
              </p>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "Bonjour ! Bienvenue sur la plateforme SENEPHYSIQUECHIMIE. Cette plateforme a pour but d'échanger et de partager des cours et des exercices de sciences physiques. Notre objectif : rendre les sciences physiques accessibles chez les élèves."
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
