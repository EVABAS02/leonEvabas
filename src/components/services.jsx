import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Services() {
  const { tObj } = useLanguage();
  const servicesData = tObj('services');

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '50px' 
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleScrollToContact = (e) => {
    e.preventDefault();
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn("L'élément avec l'id 'contact' est introuvable.");
      }
    }, 100);
  };

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="w-full bg-white text-black py-24 px-4 md:px-12 lg:px-20 font-sans scroll-mt-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* EN-TÊTE DE SECTION (Animation d'apparition globale) */}
        <div className={`flex flex-col items-center text-center space-y-4 transition-all duration-700 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
            {servicesData?.tag}
          </span>

          <h2 className="text-3xl md:text-5xl font-black font-serif tracking-tight text-black max-w-3xl leading-tight">
            {servicesData?.title}
          </h2>
        </div>

        {/* GRILLE DES SERVICES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {servicesData?.items?.map((service, index) => (
            <div 
              key={index}
              style={{ transitionDelay: `${index * 150}ms` }}
              className={`relative p-8 md:p-10 bg-white border border-black/15 rounded-3xl shadow-sm hover:shadow-md transition-all duration-700 ease-out transform flex flex-col justify-between overflow-hidden group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
              }`}
            >
              {/* Numéro géométrique en arrière-plan */}
              <span className="absolute -top-4 right-4 text-8xl font-serif font-black text-black/[0.03] select-none pointer-events-none group-hover:text-black/[0.06] transition-colors">
                {service.number}
              </span>

              <div className="space-y-6 relative z-10">
                {/* Tags */}
                <div className="text-[10px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
                  {service.tags}
                </div>

                {/* Titre */}
                <h3 className="text-2xl font-black font-serif tracking-tight text-black leading-snug">
                  {service.title}
                </h3>

                {/* Prix & Délai (Multi-devises Pro) */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/10">
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-black/50">{service.price_label}</span>
                    <div className="mt-0.5">
                      <span className="text-sm md:text-base font-bold text-[#D4AF37] font-sans block">
                        {service.prices.fcfa}
                      </span>
                      <span className="text-[11px] font-mono text-black/50 block">
                        {service.prices.eur} / {service.prices.usd}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-black/50">{service.delay_label}</span>
                    <span className="text-sm md:text-base font-bold text-black font-sans mt-0.5 block">
                      {service.delay}
                    </span>
                  </div>
                </div>

                {/* Objection & Description */}
                <div className="space-y-3 pt-4 border-t border-black/10">
                  <p className="text-xs font-serif italic font-semibold text-[#D4AF37]">
                    {service.objection}
                  </p>
                  <p className="text-xs md:text-sm text-black/80 leading-relaxed font-sans">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* CTA & Note */}
              <div className="pt-8 mt-8 border-t border-black/10 relative z-10 space-y-4">
                <a 
                  href="#contact"
                  onClick={handleScrollToContact}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-teal hover:bg-teal-hover text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                >
                  <span>{service.cta}</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </a>
                <span className="block text-center text-[10px] font-mono text-black/40">
                  {service.note}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* PIED DE SECTION */}
        <div className={`text-center pt-4 transition-all duration-700 ease-out delay-500 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <p className="text-sm font-sans text-black/70">
            {servicesData?.custom_text}{' '}
            <a 
              href="#contact" 
              onClick={handleScrollToContact} 
              className="text-[#D4AF37] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              {servicesData?.custom_cta}
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}