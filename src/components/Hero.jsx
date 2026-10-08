import React from 'react';
import { ArrowRight, PenTool, Layout, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { tObj } = useLanguage();
  const heroData = tObj('hero');

  return (
    <section id="accueil" className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 px-4 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        {/* COLONNE GAUCHE : TEXTES & ACTIONS */}
        <div className="lg:col-span-7 flex flex-col justify-center z-10 order-2 lg:order-1">

          {/* ACCROCHE SECONDAIRE */}
          <p className="font-mono text-[11px] sm:text-xs text-black/70 uppercase tracking-widest mb-3 font-medium ml-6 sm:ml-12">
            {heroData?.tag}
          </p>

          {/* TITRE PRINCIPAL H1 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-[1.12] tracking-tight mb-6">
            {heroData?.title} <br />
            <span className="text-gold-dark italic font-serif font-normal">
              {heroData?.title_highlight}
            </span>
          </h1>

          {/* PARAGRAPHE DESCRIPTIF */}
          <p className="text-base md:text-lg text-black/80 max-w-xl font-normal mb-8 leading-relaxed">
            {heroData?.description}
          </p>

          {/* BOUTONS D'ACTION */}
          <div className="flex flex-wrap items-center gap-4 mb-12">

            {/* BOUTON 1 : COMMENÇONS UN PROJET */}
            <a
              href="#services"
              className="group flex items-center gap-2 bg-teal hover:bg-teal-hover text-white font-mono text-xs md:text-sm font-semibold uppercase tracking-wider px-7 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{heroData?.btn_project}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>

            {/* BOUTON 2 : ME CONTACTER */}
            <a
              href="#contact"
              className="group flex items-center gap-2 bg-transparent border-2 border-gold hover:bg-gold/10 text-gold-dark font-mono text-xs md:text-sm font-semibold uppercase tracking-wider px-7 py-3.5 rounded-full transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{heroData?.btn_contact}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>

          </div>

          {/* STATISTIQUES */}
          <div className="pt-8 border-t border-black/10 grid grid-cols-3 gap-4 max-w-lg font-mono">
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

        {/* COLONNE DROITE : PHOTO + BADGES */}
        <div className="lg:col-span-5 relative flex justify-center items-center py-6 order-1 lg:order-2">

          {/* HALO LUMINEUX */}
          <div className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full bg-gradient-to-tr from-teal/15 via-gold/15 to-transparent blur-3xl -z-10"></div>

          {/* CONTENEUR DE LA PHOTO */}
          <div className="relative z-0 w-full max-w-[280px] sm:max-w-[380px]">

            <div className="relative">
              <img
                src="/images/leon.webp"
                alt="Léon EVABAS - Designer & Développeur"
                width="380"
                height="475"
                className="w-full h-auto object-contain select-none"
              />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </div>

            {/* BADGE 1 : UI/UX Design */}
            <div className="absolute top-[12%] -left-4 sm:-left-12 bg-white/95 backdrop-blur-md border border-black/10 py-2 px-3.5 rounded-full shadow-xl flex items-center gap-2.5 z-20 hover:scale-105 transition-transform">
              <div className="w-6 h-6 rounded-full bg-teal/15 text-teal flex items-center justify-center shrink-0">
                <PenTool className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-black tracking-wide font-mono whitespace-nowrap">{heroData?.badges?.ui_ux}</span>
            </div>

            {/* BADGE 2 : Développement Web */}
            <div className="absolute top-[42%] -right-4 sm:-right-16 bg-white/95 backdrop-blur-md border border-black/10 py-2 px-3.5 rounded-full shadow-xl flex items-center gap-2.5 z-20 hover:scale-105 transition-transform">
              <div className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0">
                <Layout className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-black tracking-wide font-mono whitespace-nowrap">{heroData?.badges?.web_dev}</span>
            </div>

            {/* BADGE 3 : No-Code & IA */}
            <div className="absolute bottom-[18%] -left-2 sm:-left-10 bg-white/95 backdrop-blur-md border border-black/10 py-2 px-3.5 rounded-full shadow-xl flex items-center gap-2.5 z-20 hover:scale-105 transition-transform">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-black tracking-wide font-mono whitespace-nowrap">{heroData?.badges?.nocode_ai}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}