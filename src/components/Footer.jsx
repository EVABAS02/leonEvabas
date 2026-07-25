import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t, tObj } = useLanguage();
  const footerData = tObj('footer');
  const currentYear = new Date().getFullYear();

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#0a0c10] text-white border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-20 py-16 space-y-12">
        
        {/* GRILLE PRINCIPALE DU FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start justify-between">
          
          {/* COLONNE GAUCHE : IDENTITÉ & DESCRIPTION */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-serif font-bold tracking-tight text-white">
                Léon <span className="text-[#D4AF37]"></span> EVABAS
              </span>
            </div>
            <p className="text-sm text-white/60 max-w-sm leading-relaxed font-sans">
              {footerData?.description}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-mono text-white/80">{footerData?.location}</span>
            </div>
          </div>

          {/* COLONNE MILIEU : NAVIGATION RAPIDE */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
              {footerData?.nav_title}
            </h4>
            <ul className="space-y-2.5 text-sm font-sans text-white/70">
              <li>
                <a href="#a-propos" onClick={(e) => handleScrollTo(e, 'a-propos')} className="hover:text-[#D4AF37] transition-colors">
                  {t('nav', 'about')}
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => handleScrollTo(e, 'services')} className="hover:text-[#D4AF37] transition-colors">
                  {t('nav', 'services')}
                </a>
              </li>
              <li>
                <a href="#portfolio" onClick={(e) => handleScrollTo(e, 'portfolio')} className="hover:text-[#D4AF37] transition-colors">
                  {t('nav', 'portfolio')}
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleScrollTo(e, 'contact')} className="hover:text-[#D4AF37] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* COLONNE DROITE : RÉSEAUX SOCIAUX */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
              {footerData?.social_title}
            </h4>
            <div className="flex items-center gap-3">
              {/* GitHub */}
              <a 
                href="https://github.com/EVABAS02" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/80 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all"
                title="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>

              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/léon-azon-206792415" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/80 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all"
                title="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>

              {/* Email */}
              <a 
                href="mailto:leon@evabas.dev"
                className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/80 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all"
                title="Email"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>
          </div>

        </div>

        {/* LIGNE DE SÉPARATION & COPYRIGHT */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 font-mono">
          <p>© {currentYear} Léon EVABAS {footerData?.rights}</p>
        </div>

      </div>
    </footer>
  );
}