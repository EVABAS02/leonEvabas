import React from 'react';
import { useLanguage } from '../context/LanguageContext';

// Images et liens ne sont pas des textes à traduire : ils restent ici,
// mappés par index sur les projets définis dans translations.js (même ordre : Moravi, Evabas Proforma, Biscotino).
const PROJECT_MEDIA = [
  { image: "/images/moravi-web.png", link: "https://moravi-sarl.vercel.app/" },
  { image: "/images/evabas-proforma.png", link: "https://evabas-proforma-gamma.vercel.app/" },
  { image: "/images/biscotino-web.png", link: "https://biscotino-web.vercel.app/" }
];

export default function Portfolio() {
  const { tObj } = useLanguage();
  const portfolioData = tObj('portfolio');

  const PROJECTS_DATA = (portfolioData?.projects || []).map((project, index) => ({
    ...project,
    ...PROJECT_MEDIA[index]
  }));

  const marqueeProjects = [...PROJECTS_DATA, ...PROJECTS_DATA, ...PROJECTS_DATA];

  return (
    <section id="portfolio" className="w-full bg-white text-black py-28 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-20 space-y-4 mb-12">
        
        {/* EN-TÊTE DE SECTION (Centré) */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
              {portfolioData?.tag}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black font-serif tracking-tight text-black max-w-3xl leading-tight">
            {portfolioData?.title}
          </h2>
        </div>

      </div>

      {/* CONTENEUR DU CARROUSEL INFINI (MARQUEE) */}
      <div className="relative w-full flex overflow-x-hidden group">
        
        <div className="flex gap-8 py-4 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
          {marqueeProjects.map((project, index) => (
            <div 
              key={index}
              className="w-[320px] md:w-[380px] flex-shrink-0 bg-white border border-black/15 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group/card"
            >
              {/* Image miniature du projet */}
              <div className="relative w-full h-[180px] rounded-xl overflow-hidden bg-black mb-4 border border-black/10">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover object-top transform group-hover/card:scale-105 transition-transform duration-500"
                  onError={(e)=>{e.target.src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"}}
                />
              </div>

              {/* Infos textuelles compactes */}
              <div className="space-y-3">
                <h3 className="text-xl font-black font-serif tracking-tight text-black">
                  {project.title}
                </h3>
                <p className="text-xs text-black/70 font-sans truncate">
                  {project.category}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/[0.03] text-black border border-black/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lien d'action direct */}
              <div className="pt-4 mt-4 border-t border-black/10 flex items-center justify-between">
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase text-black hover:text-[#D4AF37] transition-colors"
                >
                  <span>{portfolioData?.view_project}</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}