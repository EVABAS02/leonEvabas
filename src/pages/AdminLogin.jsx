import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-admin';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 font-sans relative overflow-hidden bg-[#082032]"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay sombre semi-transparent (#082032) pour garder l'harmonie de ta palette et la lisibilité */}
      <div className="absolute inset-0 bg-[#082032]/90 backdrop-blur-[2px] z-0"></div>

      {/* Bouton retour en arrière vers le portfolio */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2C394B]/90 border border-[#334756] text-[#D2D2D2] hover:text-white hover:border-[#FF4C29] text-xs font-mono transition-all shadow-lg cursor-pointer backdrop-blur-md"
      >
        <span>←</span> Retour au portfolio
      </button>

      {/* Conteneur principal du formulaire avec le badge centré en haut */}
      <div className="relative w-full max-w-md mt-12 z-10">
        
        {/* Badge supérieur (Icône / Avatar UI/UX Designer & Fullstack) */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-20 h-20 rounded-2xl bg-[#2C394B] border-2 border-[#FF4C29] shadow-2xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform">
            <svg className="w-10 h-10 text-[#FF4C29]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
          </div>
        </div>

        {/* Boîte du formulaire */}
        <div className="bg-[#2C394B]/90 backdrop-blur-md border border-[#334756] rounded-3xl pt-14 pb-8 px-8 space-y-6 shadow-2xl relative">
          
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold tracking-widest text-white uppercase font-mono">
              Admin <span className="text-[#FF4C29]">Portal</span>
            </h1>
            <p className="text-[11px] text-[#D2D2D2]/70 font-mono tracking-wide">
              UI/UX & Full-Stack • Accès Réservé
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold tracking-widest text-[#D2D2D2]/80 uppercase">
                Email Professionnel
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#082032] border border-[#334756] text-[#D2D2D2] text-sm placeholder-[#D2D2D2]/30 focus:outline-none focus:border-[#FF4C29] focus:ring-1 focus:ring-[#FF4C29] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold tracking-widest text-[#D2D2D2]/80 uppercase">
                Mot de Passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#082032] border border-[#334756] text-[#D2D2D2] text-sm placeholder-[#D2D2D2]/30 focus:outline-none focus:border-[#FF4C29] focus:ring-1 focus:ring-[#FF4C29] transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#FF4C29] hover:bg-[#FF4C29]/90 text-white text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-lg shadow-[#FF4C29]/20 disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          {/* Footer discret de la carte */}
          <div className="pt-2 text-center border-t border-[#334756]/50">
            <p className="text-[10px] font-mono text-[#D2D2D2]/40 tracking-wider">
              SECURED FIREBASE AUTH
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}