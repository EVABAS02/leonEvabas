import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase-admin';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function Portfolio() {
  const { tObj } = useLanguage();
  const portfolioData = tObj('portfolio');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('Erreur chargement des projets :', err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <section id="portfolio" className="w-full bg-white text-black py-28 font-sans">
      <div className="max-w-7xl mx-auto px x-4 md:px-12 lg:px-20">

        {/* EN-TÊTE */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
            {portfolioData?.tag}
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-serif tracking-tight text-black max-w-3xl leading-tight">
            {portfolioData?.title}
          </h2>
        </div>

        {/* ÉTAT CHARGEMENT */}
        {loading && (
          <p className="text-center text-black/40 font-mono text-sm">
            Chargement...
          </p>
        )}

        {/* ÉTAT VIDE */}
        {!loading && projects.length === 0 && (
          <p className="text-center text-black/40 font-mono text-sm">
            Aucun projet publié pour l'instant.
          </p>
        )}

        {/* GRILLE PROJETS */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-black/15 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group/card"
              >
                {/* Image */}
                <div className="relative w-full h-[200px] rounded-xl overflow-hidden bg-black mb-4 border border-black/10">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover object-top transform group-hover/card:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                </div>

                {/* Infos */}
                <div className="space-y-3 flex-1">
                  <h3 className="text-xl font-black font-serif tracking-tight text-black">
                    {project.name}
                  </h3>
                  <p className="text-xs text-black/70 font-sans">
                    {project.category}
                  </p>

                  {/* Délai si disponible */}
                  {project.duration && (
                    <p className="text-xs text-[#D4AF37] font-mono font-bold">
                      ⏱ Livré en {project.duration}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(project.tags || []).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/[0.03] text-black border border-black/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Lien */}
                <div className="pt-4 mt-4 border-t border-black/10">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase text-black hover:text-[#D4AF37] transition-colors"
                  >
                    <span>{portfolioData?.view_project}</span>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}