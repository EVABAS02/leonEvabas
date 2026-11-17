import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('accueil');

  const navLinks = [
    { name: t('nav', 'home'), href: '#accueil', keyName: 'accueil' },
    { name: t('nav', 'about'), href: '#a-propos', keyName: 'a-propos' },
    { name: t('nav', 'portfolio'), href: '#portfolio', keyName: 'portfolio' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5 px-4 md:px-12 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO (Agrandis) */}
        <a href="#accueil" aria-label="Léon EVABAS, retour à l'accueil" className="flex items-center">
  <img src="/images/tech logo .webp" alt="Léon EVABAS" width="160" height="40" className="h-10 w-auto" />
            </a>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden lg:flex items-center gap-2 font-mono text-sm font-semibold tracking-wider border border-black/10 rounded-full px-4 py-2 bg-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = activeLink === link.keyName;
            return (
              <a
                key={link.keyName}
                href={link.href}
                onClick={() => setActiveLink(link.keyName)}
                className={`transition-all duration-200 px-5 py-2.5 rounded-full ${
                  isActive
                    ? 'bg-gold text-white font-bold shadow-sm'
                    : 'text-black hover:bg-black/5 hover:text-black'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* ACTIONS DROITE (LANGUE + CTA AGRANDIS) */}
        <div className="hidden md:flex items-center gap-3.5">
          {/* TOGGLE LANGUE (Agrandis) */}
          <div className="flex items-center border border-black/10 rounded-full p-0.5 bg-white/60 shadow-sm font-mono text-sm">
            <button
              onClick={() => setLang('fr')}
              className={`px-4 py-2 rounded-full transition-all duration-200 ${
                lang === 'fr'
                  ? 'bg-gold-dark text-white font-bold shadow-sm'
                  : 'text-black hover:text-black/70'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-2 rounded-full transition-all duration-200 ${
                lang === 'en'
                  ? 'bg-gold-dark text-white font-bold shadow-sm'
                  : 'text-black hover:text-black/70'
              }`}
            >
              EN
            </button>
          </div>

          {/* BOUTON CTA (Agrandis) */}
          <a
            href="#contact"
            className="group flex items-center gap-2 bg-teal hover:bg-teal-hover text-white font-mono text-sm uppercase font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{t('nav', 'lets_talk')}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* MENU MOBILE TOGGLE */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex items-center border border-black/10 rounded-full p-0.5 bg-white/60 font-mono text-xs mr-1">
            <button
              onClick={() => setLang('fr')}
              className={`px-3 py-1 rounded-full ${lang === 'fr' ? 'bg-gold-dark text-white font-bold' : 'text-black'}`}
            >
              FR
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full ${lang === 'en' ? 'bg-gold-dark text-white font-bold' : 'text-black'}`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-black hover:bg-black/5 rounded-full transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE DROPDOWN */}
      {isOpen && (
        <div className="lg:hidden mt-3 pt-3 pb-2 border-t border-black/5 bg-white/95 rounded-2xl p-4 shadow-xl">
          <div className="flex flex-col gap-2 font-mono text-base">
            {navLinks.map((link) => (
              <a
                key={link.keyName}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.keyName);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 rounded-xl transition-all ${
                  activeLink === link.keyName
                    ? 'bg-gold text-white font-bold'
                    : 'text-black hover:bg-black/5'
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 bg-teal text-white font-mono text-sm uppercase font-semibold px-6 py-3.5 rounded-full mt-2 shadow-sm"
            >
              <span>{t('nav', 'lets_talk')}</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}