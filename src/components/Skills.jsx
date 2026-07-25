import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

// --- VRAIS LOGOS SVG OFFICIELS (PROFESSIONNELS) ---
const icons = {
  // Design UI/UX
  Figma: (
    <svg className="w-4 h-4" viewBox="0 0 38 57" fill="none"><path d="M19 0C8.50659 0 0 8.50659 0 19C0 29.4934 8.50659 38 19 38V57C29.4934 57 38 48.4934 38 38C38 27.5066 29.4934 19 19 19V0Z" fill="#0ACF83"/><path d="M19 19C29.4934 19 38 27.5066 38 38C38 48.4934 29.4934 57 19 57C8.50659 57 0 48.4934 0 38C0 27.5066 8.50659 19 19 19Z" fill="#A259FF"/><path d="M19 19C23.9706 19 28 14.9706 28 10C28 5.02944 23.9706 1 19 17L19 19Z" fill="#F24E1E"/><path d="M19 19C14.0294 19 10 14.9706 10 10C10 5.02944 14.0294 1 19 1L19 19Z" fill="#FF7262"/><path d="M19 19V38C14.0294 38 10 33.9706 10 29C10 24.0294 14.0294 20 19 19Z" fill="#1ABCFE"/></svg>
  ),
  Prototypage: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
  ),
  Wireframing: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
  ),
  UserResearch: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
  ),
  DesignSystem: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  ),
  BentoGrid: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="8" rx="1"/><rect x="14" y="13" width="7" height="8" rx="1"/></svg>
  ),

  // Dev Full Stack
  React: (
    <svg className="w-4 h-4" viewBox="0 0 115.3 100" fill="none"><path d="M57.6 22.8c-13.8 0-25 2.5-31.5 6.7-3.4 2.2-5.4 5-5.9 8.2-.4 2.8.5 5.8 2.6 8.8 4.3 6.2 12.3 11.8 22.5 15.6 1.4.5 2.9 1 4.4 1.4-1.5 3.3-3.2 6.8-5 10.3-2.1 4.2-4.3 8.5-6.7 12.7-10.4-3.8-19.1-9-25.4-14.9-5.1-4.7-8.9-9.9-11.2-15.5C1 51.5 0 46 0 40.5c0-6.2 1.4-12.1 4.2-17.5C9.8 12.1 20 5.1 33.3 2 40.8.3 49.1-.5 57.6-.5c8.5 0 16.8.8 24.3 2.5 13.3 3.1 23.5 10.1 29.1 21 2.8 5.4 4.2 11.3 4.2 17.5 0 5.5-1 11-3.1 16.2-2.3 5.6-6.1 10.8-11.2 15.5-6.3 5.9-15 11.1-25.4 14.9-2.4-4.2-4.6-8.5-6.7-12.7-1.8-3.5-3.5-7-5-10.3 1.5-.4 3-.9 4.4-1.4 10.2-3.8 18.2-9.4 22.5-15.6 2.1-3 3-6 2.6-8.8-.5-3.2-2.5-6-5.9-8.2-6.5-4.2-17.7-6.7-31.5-6.7z" fill="#61DAFB"/></svg>
  ),
  Nextjs: (
    <svg className="w-4 h-4" viewBox="0 0 128 128" fill="none"><path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm32.8 97.9L45.8 30.1h-10v67.8h10V47.5l50.9 69.3c3.3-1.8 6.4-3.9 9.2-6.4z" fill="currentColor"/><path d="M96 90.5L45.1 21.2C48 19.3 51.2 17.7 54.6 16.5L102 81.3c-2 3.5-4.2 6.7-6 9.2z" fill="currentColor"/></svg>
  ),
  TypeScript: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M2 2v20h20V2H2zm17.2 17.2H4.8V4.8h14.4v14.4z" fill="#3178C6"/><path d="M12.9 14.9c0 .4-.1.7-.3 1-.2.3-.5.5-.9.6-.4.1-.9.2-1.4.2-.8 0-1.4-.1-1.9-.3-.5-.2-.9-.5-1.1-.9l.9-.7c.2.3.5.5.8.7.3.2.7.3 1.1.3.4 0 .7-.1.9-.2.2-.1.3-.3.3-.5 0-.2-.1-.4-.3-.5-.2-.1-.5-.3-.9-.4l-.8-.3c-.6-.2-1-.5-1.3-.8-.3-.3-.4-.7-.4-1.2 0-.4.1-.7.3-1 .2-.3.5-.5.9-.6.4-.1.8-.2 1.3-.2.7 0 1.3.1 1.8.3.5.2.8.4 1.1.7l-.8.7c-.2-.2-.5-.4-.8-.6-.3-.1-.6-.2-1-.2-.3 0-.6.1-.8.2-.2.1-.3.3-.3.5 0 .2.1.3.3.4.2.1.5.3.9.4l.7.3c.7.2 1.2.5 1.5.9.3.4.5.9.5 1.5zm5.1 2.3h-1.6V11.2h-1.3V9.8h4.2v1.4h-1.3v6z" fill="#3178C6"/></svg>
  ),
  Nodejs: (
    <svg className="w-4 h-4" viewBox="0 0 96 96" fill="none"><path d="M48 91.2C39.36 96 31.2 91.2 27.6 85.2L4.8 48V38.4L27.6 0L48 9.6V76.8L68.4 85.2L91.2 44.4V36L73.2 48L64.8 39.6V9.6L84 0L91.2 7.2V20.4L69.6 62.4L48 74.4V45.6L56.4 37.2L48 33.6L39.6 37.2L48 45.6V57.6L24 16.8V36L42 67.2C44.4 70.8 46.8 75.6 48 79.2V91.2Z" fill="#5FA04E"/></svg>
  ),
  Laravel: (
    <svg className="w-4 h-4" viewBox="0 0 240 240" fill="none"><path d="M133.658 185.47H106.338L74.606 130.245C67.1319 117.193 66.9433 116.857 59.4692 103.806H86.7888C94.263 116.857 94.4515 117.193 101.926 130.245H73.131L133.658 185.47Z" fill="#FF2D20"/><path d="M154.583 185.47H166.537L211.395 107.509C218.87 94.4575 219.058 94.1217 226.532 81.0701H199.213C191.739 94.1217 191.55 94.4575 184.076 107.509H212.87L154.583 185.47Z" fill="#FF2D20"/><path d="M110.151 133.633H129.575V54.4705H110.151V133.633Z" fill="#FF2D20"/></svg>
  ),
  Python: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M11.956 0C5.938 0 5.405 2.684 5.405 2.684v2.705h6.47v.933H3.218S0 5.922 0 12.008c0 6.086 2.923 5.753 2.923 5.753h1.74v-2.732s-.096-3.23 3.14-3.23h5.518s3.045.048 3.045-2.97V3.12C16.366 3.12 17.065 0 11.956 0zM8.563 1.932a1.01 1.01 0 1 1 0 2.02 1.01 1.01 0 0 1 0-2.02z" fill="#3776AB"/><path d="M12.044 24c6.018 0 6.551-2.684 6.551-2.684v-2.705h-6.47-.933v-3.322s-.12-3.324-3.37-3.324H3.264s-3.045-.048-3.045 2.97v5.661S0 24 12.044 24zM15.437 22.068a1.01 1.01 0 1 1 0-2.02 1.01 1.01 0 0 1 0 2.02z" fill="#FFD43B"/></svg>
  ),
  SQL: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
  ),
  Tailwind: (
    <svg className="w-4 h-4" viewBox="0 0 54 33" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.05.51 3.52 1.99 5.14 3.63C31.5 13.5 35.1 17.1 43.5 17.1c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.05-.51-3.52-1.99-5.14-3.63C38.7 3.6 35.1 0 27 0zM13.5 16.5C6.3 16.5 1.8 20.1 0 27.3c2.7-3.6 5.85-4.95 9.45-4.05 2.05.51 3.52 1.99 5.14 3.63 3.41 3.42 7.01 7.02 15.41 7.02 7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.05-.51-3.52-1.99-5.14-3.63-3.41-3.42-7.01-7.02-15.41-7.02z" fill="#38BDF8"/></svg>
  ),

  // Dev Mobile
  Flutter: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M10.3 0L0 10.3l2.3 2.3L14.9 2.3 10.3 0z" fill="#02569B"/><path d="M10.3 16l4.6-4.6-4.6-4.6-2.3 2.3 2.3 2.3L8 13.7l2.3 2.3z" fill="#02569B"/></svg>
  ),
  Dart: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3.486 20.514L12 12l8.514 8.514a1.2 1.2 0 0 1-1.697 1.698L13.7 17.1l-1.7 1.7 4.9 4.9a1.2 1.2 0 1 1-1.7 1.7l-5.7-5.7-5.7 5.7a1.2 1.2 0 1 1-1.7-1.7l4.9-4.9-1.7-1.7-5.129 5.128a1.2 1.2 0 0 1-1.697-1.697z" fill="#0175C2"/><path d="M20.514 3.486L12 12 3.486 3.486a1.2 1.2 0 1 1 1.697-1.697L10.3 6.9l1.7-1.7-4.9-4.9a1.2 1.2 0 1 1 1.7-1.7l5.7 5.7 5.7-5.7a1.2 1.2 0 1 1 1.7 1.7l-4.9 4.9 1.7 1.7 5.129-5.128a1.2 1.2 0 0 1 1.697 1.697z" fill="#0175C2"/></svg>
  ),
  ApiRest: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1z"/></svg>
  ),
  Integrations: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
  ),

  // No-Code & AI
  Supabase: (
    <svg className="w-4 h-4" viewBox="0 0 108 108" fill="none"><path d="M60.1 2.3L3.8 54.4h48.3L47.9 105.7l56.3-52.1H55.4L60.1 2.3z" fill="#3ECF8E"/></svg>
  ),
  Firebase: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3.55 17.55L1.13 13.5c-.32-.54-.34-1.21-.06-1.77l2.84-5.69 5.86 11.51-6.22 1 z" fill="#FFC107"/><path d="M13.77 2.14l-8.08 4.67 3.73 7.33 4.35-12z" fill="#FFA000"/><path d="M13.77 2.14L9.62 14.14l4.15 8.16 7.02-12.27-7.02-7.89z" fill="#F57C00"/></svg>
  ),
  Base44: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  ),
  Glide: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  AppSheet: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2" ry="2"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
  ),
  LovableDev: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
  ),
  Automatisations: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  )
};

// Dictionnaire de correspondance intelligent pour mapper le nom traduit de la compétence à son icône SVG
const iconMapping = {
  // UI/UX
  "Figma": icons.Figma,
  "Prototypage": icons.Prototypage,
  "Prototyping": icons.Prototypage,
  "Wireframing": icons.Wireframing,
  "User Research": icons.UserResearch,
  "Design System": icons.DesignSystem,
  "Bento Grid Layout": icons.BentoGrid,

  // Full Stack
  "React": icons.React,
  "Next.js": icons.Nextjs,
  "TypeScript": icons.TypeScript,
  "Node.js": icons.Nodejs,
  "PHP (Laravel)": icons.Laravel,
  "Python": icons.Python,
  "SQL": icons.SQL,
  "Tailwind CSS": icons.Tailwind,

  // Mobile
  "Flutter": icons.Flutter,
  "Dart": icons.Dart,
  "APIs REST natives": icons.ApiRest,
  "Native REST APIs": icons.ApiRest,
  "Intégrations tierces": icons.Integrations,
  "Third-party integrations": icons.Integrations,

  // No-Code & AI
  "Supabase": icons.Supabase,
  "Firebase": icons.Firebase,
  "Base44": icons.Base44,
  "Glide": icons.Glide,
  "AppSheet": icons.AppSheet,
  "Lovable Dev": icons.LovableDev,
  "Automatisations métier": icons.Automatisations,
  "Business Automations": icons.Automatisations
};

export default function Skills() {
  const { tObj } = useLanguage();
  const skillsData = tObj('skills');

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
      id="competences" 
      className="w-full bg-white text-black py-24 px-4 md:px-12 lg:px-20 font-sans scroll-mt-10"
    >
      <div className={`max-w-6xl mx-auto space-y-16 transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        
        {/* EN-TÊTE DE SECTION */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
              {skillsData?.tag}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black font-serif tracking-tight text-black max-w-3xl leading-tight">
            {skillsData?.title}
          </h2>
        </div>

        {/* GRILLE DES COMPÉTENCES */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-black/15 shadow-sm rounded-2xl overflow-hidden bg-black/15 gap-[1px]">
          {skillsData?.categories?.map((group, index) => (
            <div 
              key={index}
              className="p-8 md:p-10 bg-white hover:bg-black/[0.01] transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="flex items-center justify-between border-b border-black/10 pb-4">
                <span className="text-xs font-mono font-bold tracking-wider text-[#D4AF37] uppercase">
                  {group.name}
                </span>
                <span className="text-[10px] font-mono text-black/40">
                  0{index + 1}
                </span>
              </div>

              {/* Badges de compétences dynamiques et multilingues avec logos SVG */}
              <div className="flex flex-wrap gap-2.5">
                {group.items.map((itemName, sIndex) => {
                  const SkillIcon = iconMapping[itemName];

                  return (
                    <div 
                      key={sIndex}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAFAFA] border border-black/10 text-xs font-sans text-black/90 hover:border-black hover:bg-black hover:text-white transition-all shadow-2xs group/item cursor-default"
                    >
                      {SkillIcon && (
                        <span className="flex items-center justify-center shrink-0 text-black group-hover/item:text-white transition-colors">
                          {SkillIcon}
                        </span>
                      )}
                      <span className="font-medium tracking-wide">{itemName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}