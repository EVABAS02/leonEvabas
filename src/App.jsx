import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Services from './components/services';
import Portfolio from './components/Portfolio';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { trackPageView, trackVisit } from './lib/analytics';

// Routes non critiques pour le premier chargement : elles sortent du bundle
// principal et ne sont téléchargées que si le visiteur les demande vraiment.
const CvPage = lazy(() => import('./pages/CvPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ReplyThread = lazy(() => import('./pages/ReplyThread'));

// Fallback neutre pendant le téléchargement du chunk : évite un flash
// de contenu blanc trop brut, sans dépendre d'assets supplémentaires.
function RouteFallback() {
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black/10 border-t-[#C59B27] rounded-full animate-spin" />
    </div>
  );
}

function Home() {
  const location = useLocation();

  useEffect(() => {
    trackPageView('/');
    trackVisit();
  }, []);

  // Si on arrive sur "/" avec un hash (ex: revenu depuis /cv via "Retour à propos"),
  // on scroll jusqu'à la section correspondante une fois la page montée.
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white text-charcoal">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Services />
        <Portfolio />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function CvRoute() {
  const navigate = useNavigate();
  useEffect(() => {
    trackPageView('/cv');
    trackVisit();
  }, []);
  return (
    <div className="min-h-screen bg-white text-charcoal">
      <CvPage onBack={() => navigate('/#a-propos')} />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/cv"
        element={
          <Suspense fallback={<RouteFallback />}>
            <CvRoute />
          </Suspense>
        }
      />
      <Route
        path="/reply/:messageId"
        element={
          <Suspense fallback={<RouteFallback />}>
            <ReplyThread />
          </Suspense>
        }
      />
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<RouteFallback />}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Suspense fallback={<RouteFallback />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;