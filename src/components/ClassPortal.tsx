import React from 'react';
import { Course } from '../types';
import {
  Atom,
  Beaker,
  GraduationCap,
  Award,
  Files,
  Compass,
  ChevronRight,
  ShieldPlus,
  Trophy,
  Boxes
} from 'lucide-react';

interface ClassPortalProps {
  courses: Course[];
  onSelectLevel: (level: string) => void;
}

export default function ClassPortal({ courses, onSelectLevel }: ClassPortalProps) {
  
  // Calculate document counts per level in real time
  const getDocCount = (level: string) => {
    return courses.filter(c => c.level === level).length;
  };

  const portalLevels = [
    {
      id: 'TS',
      title: 'Terminale S (TS)',
      desc: 'Préparation intensive au baccalauréat avec chapitres de Cinématique, Énergie, Cinétique et transformations Acido-Basiques.',
      icon: GraduationCap,
      tag: 'Lycée • Terminale'
    },
    {
      id: '1S',
      title: 'Première S (1S)',
      desc: 'Bases solides en forces et champs fondamentaux, représentations de Lewis des molécules, énergie mécanique et dosages.',
      icon: Atom,
      tag: 'Lycée • Première'
    },
    {
      id: '2S',
      title: 'Seconde S (2S)',
      desc: 'Introduction aux sciences physiques et chimiques du lycée : signaux périodiques, atomes, forces et calcul de moles.',
      icon: Beaker,
      tag: 'Lycée • Seconde'
    },
    {
      id: '3eme',
      title: 'Troisième (3ème)',
      desc: 'Mouvement et vitesse, interaction gravitationnelle, approfondissement de l’électricité et des transformations chimiques du collège.',
      icon: Compass,
      tag: 'Collège'
    },
    {
      id: '4eme',
      title: 'Quatrième (4ème)',
      desc: 'Constitution et états de la matière, atomes et molécules, premières lois de l’électricité élémentaire et des circuits.',
      icon: Boxes,
      tag: 'Collège'
    },
    {
      id: 'Fascicules',
      title: 'Fascicules & Livres',
      desc: 'Recueils thématiques d’exercices progressifs et formulaires mémos compacts indispensables pour réviser toutes les formules.',
      icon: Files,
      tag: 'Outils de révision'
    },
    {
      id: 'CSM',
      title: 'Cours Santé Militaire (CSM)',
      desc: 'Ressources dédiées à la préparation du concours d\'entrée aux Cours Santé Militaire. Contenu en cours d\'ajout.',
      icon: ShieldPlus,
      tag: 'Concours Militaire'
    },
    {
      id: 'CGS',
      title: 'Concours Général Sénégalais (CGS)',
      desc: 'Sujets et corrections dédiés à la préparation du Concours Général Sénégalais. Contenu en cours d\'ajout.',
      icon: Trophy,
      tag: 'Concours National'
    },
    {
      id: 'BAC',
      title: 'Annales de BAC',
      desc: 'Sujets réels d’examens nationaux et corrections pas-à-pas avec fiches méthodologiques, barèmes détaillés et pièges courants.',
      icon: Award,
      tag: 'Préparation Examen'
    }
  ];

  return (
    <section id="espace-classes" className="py-14 bg-[#F5F7FA] relative border-b border-slate-200/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F] tracking-tight">
            Accédez à vos Salles de Cours Dédiées
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
            Choisissez votre classe pour accéder instantanément aux chapitres, supports de cours PDF officiels et aux leçons vidéos YouTube configurées par votre enseignant.
          </p>
        </div>

        {/* Portal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portalLevels.map((lvl) => {
            const Icon = lvl.icon;
            const docCount = getDocCount(lvl.id);
            return (
              <div
                key={lvl.id}
                onClick={() => onSelectLevel(lvl.id)}
                className="group relative bg-white border border-slate-200 hover:border-[#0056D2] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Badge & Level Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200/60 px-2.5 py-0.5 rounded-md">
                      {lvl.tag}
                    </span>
                    <span className="text-[10px] font-mono font-extrabold text-[#0056D2] bg-[#0056D2]/5 px-2 py-0.5 rounded border border-[#0056D2]/10">
                      {docCount} {docCount > 1 ? 'fichiers' : 'fichier'}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-[#0056D2]/5 text-[#0056D2] group-hover:bg-[#0056D2] group-hover:text-white transition-all duration-300">
                      <Icon className="h-5.5 w-5.5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1F1F1F] group-hover:text-[#0056D2] transition-colors">
                      {lvl.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {lvl.desc}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0056D2] group-hover:translate-x-1 transition-transform">
                  <span>Ouvrir l'espace de cours</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
