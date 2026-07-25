import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

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
    <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-sm bg-[#0f1420] border border-white/10 rounded-2xl p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">
            Admin <span className="text-[#E85D04]">Login</span>
          </h1>
          <p className="text-xs text-white/50 font-mono mt-1">Accès réservé à Léon EVABAS.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E85D04] transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E85D04] transition-colors"
            />
          </div>

          {error && <p className="text-xs text-red-400 font-mono">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#E85D04] hover:bg-[#E85D04]/90 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}