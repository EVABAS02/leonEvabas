import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { tObj } = useLanguage();
  const aboutData = tObj('about');
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="a-propos"
      className="scroll-mt-12 md:scroll-mt-16 pt-4 md:pt-8 pb-16 md:pb-20 px-6 md:px-12 bg-white text-black"
    >
      <div className={`max-w-4xl mx-auto flex flex-col items-center text-center transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>

        <div className="mb-3">
          <span className="font-mono text-xs md:text-sm text-[#D4AF37] font-bold tracking-[0.25em] uppercase">
             {aboutData?.tag}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-black leading-[1.25] tracking-tight mb-8 max-w-3xl">
          {aboutData?.title}
        </h2>

        <div className="space-y-6 text-black/80 text-base md:text-lg leading-relaxed font-normal text-left sm:text-justify max-w-3xl mb-10">
          <p>{aboutData?.p1}</p>
          <p>{aboutData?.p2}</p>
          <p>{aboutData?.p3}</p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => navigate('/cv')}
            className="group inline-flex items-center gap-3 border-2 border-black text-black hover:bg-black hover:text-white font-mono text-xs md:text-sm font-semibold uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            <span>{aboutData?.cta}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
}