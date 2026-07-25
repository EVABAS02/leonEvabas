import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function FAQ() {
  const { tObj } = useLanguage();
  const faqData = tObj('faq');

  const [openIndex, setOpenIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Animation d'apparition au scroll (Intersection Observer)
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

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      ref={sectionRef}
      id="faq" 
      className="w-full bg-white text-black py-28 px-4 md:px-12 lg:px-20 font-sans overflow-hidden"
    >
      <div className={`max-w-4xl mx-auto space-y-16 transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
        
        {/* EN-TÊTE DE SECTION CENTRÉ */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
              {faqData?.tag}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black font-serif tracking-tight text-black">
            {faqData?.title}
          </h2>
        </div>

        {/* ACCORDÉON DES QUESTIONS */}
        <div className="divide-y divide-black/10 border-t border-b border-black/10">
          {faqData?.items?.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="py-6 transition-all">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between text-left group focus:outline-none cursor-pointer"
                >
                  <span className={`text-lg md:text-xl font-serif font-bold tracking-tight transition-colors pr-6 ${
                    isOpen ? 'text-[#D4AF37]' : 'text-black group-hover:text-[#D4AF37]'
                  }`}>
                    {item.question}
                  </span>
                  
                  {/* Icône + / - stylisée avec rotation fluide */}
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full border border-black/15 flex items-center justify-center font-mono text-sm text-[#D4AF37] bg-black/[0.02] transition-transform duration-300 ${
                    isOpen ? 'rotate-45 bg-[#D4AF37]/10 border-[#D4AF37]/30' : 'rotate-0'
                  }`}>
                    +
                  </span>
                </button>

                {/* Réponse avec transition de hauteur et d'opacité fluide */}
                <div className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-150 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
                } overflow-hidden`}>
                  <div className="overflow-hidden">
                    <p className="text-sm md:text-base text-black/75 font-sans leading-relaxed pr-12">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}