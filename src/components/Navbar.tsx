import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, ChevronDown, Atom, FlaskConical, GraduationCap } from 'lucide-react';

interface NavbarProps {
  activeLevel: string;
  setActiveLevel: (level: any) => void;
  setSearchQuery: (query: string) => void;
  setSelectedSubject: (subject: 'All' | 'Physique' | 'Chimie') => void;
  setSelectedDocType: (docType: 'All' | 'Cours' | 'TD' | 'Évaluation') => void;
  scrollToSection: (sectionId: string) => void;
}

const LEVELS: { id: string; label: string; isDropdown: boolean }[] = [
  { id: 'TS', label: 'TS', isDropdown: true },
  { id: '1S', label: '1S', isDropdown: true },
  { id: '2S', label: '2S', isDropdown: true },
  { id: '3eme', label: '3ème', isDropdown: true },
  { id: '4eme', label: '4ème', isDropdown: true },
  { id: 'Fascicules', label: 'Fascicules', isDropdown: false },
  { id: 'CSM', label: 'CSM', isDropdown: false },
  { id: 'CGS', label: 'CGS', isDropdown: false },
  { id: 'BAC', label: 'BAC', isDropdown: false }
];

// Matière (Physique/Chimie) is chosen via the filter tabs on the page itself,
// not split across separate quick links — same 3 links for every level.
const getQuickLinks = (label: string) => [
  { title: `Cours ${label}`, subject: 'All' as const, docType: 'Cours' as const },
  { title: `TD ${label}`, subject: 'All' as const, docType: 'TD' as const },
  { title: `Évaluations ${label}`, subject: 'All' as const, docType: 'Évaluation' as const }
];

const menuItems = [
  { id: 'Accueil', label: 'Accueil', isDropdown: false },
  ...LEVELS.map((lvl) => ({ id: lvl.id, label: lvl.label, isDropdown: lvl.isDropdown }))
];

export default function Navbar({
  activeLevel,
  setActiveLevel,
  setSearchQuery,
  setSelectedSubject,
  setSelectedDocType,
  scrollToSection
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);

  const dropdownTimeout = useRef<any>(null);

  const handleMouseEnter = (menuName: string) => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleMenuItemClick = (itemId: string) => {
    if (itemId === 'Accueil') {
      setActiveLevel('Accueil');
      setSearchQuery('');
      scrollToSection('accueil');
    } else {
      setActiveLevel(itemId);
      setSelectedSubject('All');
      setSelectedDocType('All');
      setSearchQuery('');
      scrollToSection('telechargements');
    }
    setIsMobileMenuOpen(false);
    setExpandedMobileSection(null);
  };

  const handleQuickLinkClick = (levelId: string, subject: 'All' | 'Physique' | 'Chimie', docType: 'Cours' | 'TD' | 'Évaluation') => {
    setActiveLevel(levelId);
    setSelectedSubject(subject);
    setSelectedDocType(docType);
    setSearchQuery('');
    scrollToSection('telechargements');
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setExpandedMobileSection(null);
  };

  const toggleMobileSection = (label: string) => {
    setExpandedMobileSection(expandedMobileSection === label ? null : label);
  };

  return (
    <nav id="app-navbar" className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo Brand */}
          <div
            id="brand-logo"
            onClick={() => handleMenuItemClick('Accueil')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="relative p-2.5 rounded-xl bg-blue-50/60 border border-blue-100/50 group-hover:border-[#0056D2]/50 transition-all duration-300 shadow-sm">
              <Atom className="h-7 w-7 text-[#0056D2] animate-spin-slow" />
              <FlaskConical className="h-4.5 w-4.5 text-blue-700 absolute bottom-1 right-1 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#0056D2] transition-colors duration-200">
                SENE<span className="text-[#0056D2] font-black">PHYSIQUE</span>CHIMIE
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#0056D2] uppercase font-bold">
                Portail Académique
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden xl:flex items-center space-x-1">
            {menuItems.map((item) => {
              const isLevelActive = activeLevel === item.id;

              if (item.isDropdown) {
                const quickLinks = getQuickLinks(item.label);
                return (
                  <div
                    key={item.id}
                    id={`menu-item-${item.id}`}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                    className="relative py-2"
                  >
                    <button
                      onClick={() => handleMenuItemClick(item.id)}
                      className={`flex items-center space-x-1 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 select-none ${
                        isLevelActive
                          ? 'bg-blue-50 text-[#0056D2] border border-blue-200/60 shadow-sm'
                          : 'text-slate-600 hover:text-[#0056D2] hover:bg-slate-100/70 border border-transparent'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`h-3.5 w-3.5 opacity-70 transition-transform duration-200 ${
                        activeDropdown === item.id ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === item.id && (
                      <div
                        id={`dropdown-${item.id}`}
                        className="absolute left-0 mt-1 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-150"
                      >
                        {quickLinks.map((link) => (
                          <button
                            key={link.title}
                            onClick={() => handleQuickLinkClick(item.id, link.subject, link.docType)}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:text-[#0056D2] hover:bg-blue-50 hover:border-l-2 hover:border-[#0056D2] transition-all duration-150"
                          >
                            {link.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  id={`menu-item-${item.id}`}
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isLevelActive
                      ? 'bg-blue-50 text-[#0056D2] border border-blue-200/60 shadow-sm'
                      : 'text-slate-600 hover:text-[#0056D2] hover:bg-slate-100/70 border border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

          </div>

          {/* Mobile Menu Burger Button */}
          <div className="xl:hidden flex items-center space-x-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6 text-slate-800" />
              ) : (
                <Menu className="block h-6 w-6 text-slate-800" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel — rendered via a portal straight into <body>.
          The <nav> above uses backdrop-blur, which (like transform/filter)
          creates a new containing block for position:fixed descendants — so a
          fixed full-screen panel nested inside it only ever spanned the nav's
          own ~56px height instead of the whole viewport. Portal-ing it out
          from under <nav> avoids that trap entirely. */}
      {createPortal(
      <div
        id="mobile-menu-panel"
        className={`fixed inset-0 z-50 xl:hidden transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full bg-white flex flex-col">
          {/* Top bar with brand + close button */}
          <div className="flex items-center justify-between px-5 h-14 border-b border-slate-100 shrink-0">
            <div className="flex items-center space-x-2 select-none">
              <div className="p-1.5 rounded-lg bg-blue-50/60 border border-blue-100/50">
                <Atom className="h-4 w-4 text-[#0056D2]" />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-slate-900">
                SENE<span className="text-[#0056D2] font-black">PHYSIQUE</span>CHIMIE
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation list — sized to fill the screen without scrolling or a dead gap */}
          <div className="flex flex-col px-5 pt-2 overflow-hidden">
            {menuItems.map((item) => {
              const isLevelActive = activeLevel === item.id;

              if (item.isDropdown) {
                const isExpanded = expandedMobileSection === item.id;
                const quickLinks = getQuickLinks(item.label);
                return (
                  <div key={item.id} className="border-b border-slate-100">
                    <button
                      onClick={() => toggleMobileSection(item.id)}
                      className={`flex items-center justify-between w-full py-3.5 text-left text-lg font-semibold transition-colors cursor-pointer ${
                        isLevelActive ? 'text-[#0056D2]' : 'text-slate-800 hover:text-[#0056D2]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180 text-[#0056D2]' : 'text-slate-400'}`} />
                    </button>

                    {/* Mobile Accordion Content */}
                    {isExpanded && (
                      <div className="pb-3 -mt-1 pl-1 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                        <button
                          onClick={() => handleMenuItemClick(item.id)}
                          className="w-full text-left py-1.5 text-sm font-bold text-[#0056D2] flex items-center gap-1.5 cursor-pointer"
                        >
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>Tous les cours {item.label}</span>
                        </button>

                        {quickLinks.map((link) => (
                          <button
                            key={link.title}
                            onClick={() => handleQuickLinkClick(item.id, link.subject, link.docType)}
                            className="w-full text-left py-1.5 text-sm text-slate-600 hover:text-[#0056D2] cursor-pointer"
                          >
                            {link.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full py-3.5 text-left text-lg font-semibold border-b border-slate-100 transition-colors cursor-pointer ${
                    isLevelActive ? 'text-[#0056D2]' : 'text-slate-800 hover:text-[#0056D2]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>,
      document.body
      )}
    </nav>
  );
}
