import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LiquidButton from './LiquidButton';

/* Même comportement que les anciens liens href="#services" et href="#contact". */
const goTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', `#${id}`);
  }
};

export default function Hero() {
  const { tObj } = useLanguage();
  const heroData = tObj('hero');

  /*
    Nouveaux textes du titre. Si les clés headline_start / headline_end ne
    sont pas encore dans ton fichier de traductions, le français ci-dessous
    s'affiche. Ajoute les deux clés (FR + EN) pour que le switch de langue
    fonctionne aussi sur ce titre.
  */
  const headlineStart =
    heroData?.headline_start ?? 'Du premier pixel au déploiement,';
  const headlineEnd =
    heroData?.headline_end ??
    'je conçois et livre des applications web robustes à une vitesse fulgurante.';

  return (
    <section
      id="accueil"
      className="relative overflow-hidden bg-white px-4 md:px-12 pt-16 pb-20 md:pt-24 md:pb-28 min-h-[80vh] flex items-center"
    >
      <div className="relative z-10 mx-auto w-full max-w-5xl flex flex-col items-center text-center">

        {/* ACCROCHE SECONDAIRE */}
        <p className="font-mono text-[11px] sm:text-xs text-black/70 uppercase tracking-widest mb-6 font-medium">
          {heroData?.tag}
        </p>

        {/* TITRE PRINCIPAL H1 — police géométrique (Outfit) */}
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-[1.15] tracking-tight mb-8 max-w-4xl"
          style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
          {headlineStart}{' '}
          <br />
          {headlineEnd}
        </h1>

        {/* PARAGRAPHE DESCRIPTIF */}
        <p className="text-base md:text-lg text-black/80 max-w-2xl font-normal mb-10 leading-relaxed">
          {heroData?.description}
        </p>

        {/* BOUTONS D'ACTION */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <LiquidButton
            variant="primary"
            className="font-mono font-semibold uppercase tracking-wider"
            onClick={() => goTo('services')}
          >
            <span>{heroData?.btn_project}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </LiquidButton>

          <LiquidButton
            variant="outline"
            className="font-mono font-semibold uppercase tracking-wider"
            onClick={() => goTo('contact')}
          >
            <span>{heroData?.btn_contact}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </LiquidButton>
        </div>

        {/* STATISTIQUES */}
        <div className="w-full max-w-lg pt-8 border-t border-black/10 grid grid-cols-3 gap-4 font-mono">
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-black">3</div>
            <div className="text-[11px] md:text-xs text-black/70 leading-tight mt-1 uppercase font-medium">
              {heroData?.stats?.pme}
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-black">12+</div>
            <div className="text-[11px] md:text-xs text-black/70 leading-tight mt-1 uppercase font-medium">
              {heroData?.stats?.projects}
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-black">0</div>
            <div className="text-[11px] md:text-xs text-black/70 leading-tight mt-1 uppercase font-medium">
              {heroData?.stats?.delay}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}