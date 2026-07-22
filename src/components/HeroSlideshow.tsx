import React, { useEffect, useState } from 'react';
import physiqueFormules from '../assets/hero/physique-formules.jpg';
import physiqueEinstein from '../assets/hero/physique-einstein.webp';
import physiqueEquations from '../assets/hero/physique-equations.webp';
import chimieMolecule from '../assets/hero/chimie-molecule.webp';
import chimieTableau from '../assets/hero/chimie-tableau.webp';

const SLIDE_DURATION_MS = 5000;

const slides = [
  { src: physiqueFormules, alt: 'Tableau noir couvert de formules de physique, dont E=mc²' },
  { src: physiqueEinstein, alt: 'Portrait d\'Albert Einstein avec la formule E=mc²' },
  { src: chimieTableau, alt: 'Formules de chimie organique écrites à la craie sur un tableau noir' },
  { src: chimieMolecule, alt: 'Modèle moléculaire posé sur un tableau périodique des éléments' },
  { src: physiqueEquations, alt: 'Équations de physique en arrière-plan flou' }
];

export default function HeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {slides.map((slide, idx) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            idx === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Pagination dots */}
      <div className="absolute bottom-5 inset-x-0 z-10 flex items-center justify-center gap-2">
        {slides.map((slide, idx) => (
          <button
            key={slide.src}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Aller à l'image ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
