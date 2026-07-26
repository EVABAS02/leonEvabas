import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase-admin';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Styles liés à la position (pas du texte) : alternent entre doré et teal
// pour ne pas dépendre d'un nombre fixe d'expériences/projets.
const DOT_COLORS = ['bg-gold', 'bg-black/30'];
const EXPERIENCE_BADGE_CLASSES = [
  'text-teal font-mono text-[10px] font-bold bg-teal/10 px-2 py-0.5 rounded w-max',
  'text-black/60 font-mono text-[10px] font-bold bg-black/5 px-2 py-0.5 rounded w-max'
];
const PROJECT_BADGE_CLASSES = [
  'text-[9px] uppercase tracking-wider bg-gold/15 text-gold-700 px-2 py-0.5 rounded font-bold',
  'text-[9px] uppercase tracking-wider bg-teal/10 text-teal px-2 py-0.5 rounded font-bold'
];

export default function CvPage({ onBack }) {
  const { tObj } = useLanguage();
  const cvData = tObj('cv');

  const [experiences, setExperiences] = useState([]);
  const [formations, setFormations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  useEffect(() => {
    const unsubExp = onSnapshot(
      query(collection(db, 'cv_experiences'), orderBy('createdAt', 'desc')),
      (snap) => setExperiences(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubForm = onSnapshot(
      query(collection(db, 'cv_formations'), orderBy('createdAt', 'desc')),
      (snap) => setFormations(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubSkills = onSnapshot(
      query(collection(db, 'cv_skills'), orderBy('createdAt', 'desc')),
      (snap) => setSkills(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubProjects = onSnapshot(
      query(collection(db, 'projects'), orderBy('createdAt', 'desc')),
      (snap) => {
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setFeaturedProjects(all.filter((p) => p.featured));
      }
    );
    return () => {
      unsubExp();
      unsubForm();
      unsubSkills();
      unsubProjects();
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-black p-4 md:p-8 lg:p-12 font-sans antialiased selection:bg-teal selection:text-white print:p-0">
      
      {/* INJECTION CSS POUR OPTIMISER L'IMPRESSION EN UN VRAI CV A4 */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Actions (Masqué à l'impression) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-6 print:hidden">
          
          <button 
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs md:text-sm text-black/70 hover:text-teal transition-colors group tracking-wider font-mono font-semibold uppercase cursor-pointer"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="transform group-hover:-translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            {cvData?.back_btn}
          </button>

          <button 
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 bg-teal hover:bg-teal/90 text-white text-xs md:text-sm font-semibold px-6 py-2.5 rounded-full transition-all cursor-pointer tracking-wider font-mono shadow-sm hover:shadow-md hover:-translate-y-0.5 uppercase"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.725 14.25v6m10.5-6v6M6.725 10.5h10.5m-10.5-3.75h10.5M5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V8.25A2.25 2.25 0 0 0 18.75 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21Z" />
            </svg>
            {cvData?.print_btn}
          </button>

        </div>

        {/* --- CORPS DU CV (FORMAT PROFESSIONNEL) --- */}
        <div className="bg-white border border-black/10 rounded-2xl p-6 md:p-10 shadow-sm print:shadow-none print:border-none space-y-8">

          {/* EN-TÊTE : PHOTO + IDENTITÉ + CONTACTS */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-black/10 pb-8">
            
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-teal/30 shadow-md bg-[#F9F9F8] flex-shrink-0">
              <img 
                src="/images/leon.png" 
                alt="Léon AZON" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center text-teal font-bold font-mono text-xs text-center p-2">PHOTO PRO</div>';
                }}
              />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-grow">
              <h1 className="text-3xl md:text-4xl font-black font-serif tracking-tight text-black uppercase">
                LÉON <span className="text-gold">AZON</span>
              </h1>
              <p className="text-xs md:text-sm text-gold font-mono font-bold tracking-widest uppercase">
                {cvData?.role}
              </p>
              <p className="text-xs md:text-sm text-black/70 max-w-xl leading-relaxed font-sans italic">
                "{cvData?.quote}"
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2 text-xs font-mono text-black/80">
                <span className="flex items-center gap-1.5 bg-black/5 px-2.5 py-1 rounded-md">
                  <span className="text-teal font-bold">📍</span> {cvData?.location}
                </span>
                <span className="flex items-center gap-1.5 bg-black/5 px-2.5 py-1 rounded-md">
                  <span className="text-teal font-bold">💼</span> {cvData?.availability}
                </span>
                <a href="https://github.com/EVABAS02" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-black/5 px-2.5 py-1 rounded-md hover:bg-teal/10 hover:text-teal transition-colors">
                  <span className="text-teal font-bold">📂</span> {cvData?.github_label}
                </a>
              </div>
            </div>
          </div>

          {/* GRILLE CENTRALE DU CV (2 COLONNES) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* COLONNE GAUCHE (1/3) : Compétences & Formations */}
            <div className="md:col-span-1 space-y-6">
              
              {/* COMPÉTENCES */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold text-teal uppercase tracking-widest border-b-2 border-teal/20 pb-1.5 font-mono">
                  {cvData?.section_skills}
                </h2>
                <div className="space-y-2.5 font-sans text-xs">
                  {skills.map((cat) => (
                    <div key={cat.id}>
                      <span className="text-gold font-mono font-bold block">{cat.category}</span>
                      <p className="text-black/80">{(cat.items || []).join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FORMATIONS */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold text-teal uppercase tracking-widest border-b-2 border-teal/20 pb-1.5 font-mono">
                  {cvData?.section_formations}
                </h2>
                <div className="space-y-3 font-sans text-xs">
                  {formations.map((formation) => (
                    <div key={formation.id} className="border-l-2 border-teal/30 pl-3 space-y-0.5">
                      <span className="text-black/50 block font-mono text-[10px] font-bold">{formation.date}</span>
                      <span className="text-black font-bold block">{formation.title}</span>
                      <p className="text-black/60">{formation.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* COLONNE DROITE (2/3) : Expériences & Projets Phares */}
            <div className="md:col-span-2 space-y-6">
              
              {/* EXPÉRIENCES PROFESSIONNELLES */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-teal uppercase tracking-widest border-b-2 border-teal/20 pb-1.5 font-mono">
                  {cvData?.section_experience}
                </h2> 

                <div className="space-y-4 font-sans text-xs">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="space-y-1 relative pl-4 border-l border-black/20">
                      <div className={`absolute w-2 h-2 ${DOT_COLORS[index % 2]} rounded-full -left-[4.5px] top-1`}></div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <h3 className="text-black font-bold text-sm">{exp.title}</h3>
                        <span className={EXPERIENCE_BADGE_CLASSES[index % 2]}>{exp.period}</span>
                      </div>
                      <p className="text-black/60 font-mono">{exp.company}</p>
                      <p className="text-black/80 leading-relaxed">
                        {exp.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* PROJETS PHARES */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-teal uppercase tracking-widest border-b-2 border-teal/20 pb-1.5 font-mono">
                  {cvData?.section_projects}
                </h2> 

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs">
                  {featuredProjects.map((project, index) => (
                    <div key={project.id} className="bg-[#F9F9F8] border border-black/5 p-3 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-black font-mono">{project.name}</span>
                        <span className={PROJECT_BADGE_CLASSES[index % 2]}>{project.badge}</span>
                      </div>
                      <p className="text-black/70 text-[11px]">{project.description}</p>
                      <p className="text-[10px] text-black/50 font-mono">{project.stack}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}