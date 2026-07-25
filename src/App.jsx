import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Services from './components/services';
import Portfolio from './components/Portfolio';
import CvPage from './pages/CvPage';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import ReplyThread from './pages/ReplyThread';
import ProtectedRoute from './components/ProtectedRoute';
import { trackPageView, trackVisit } from './lib/analytics';

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
      <Route path="/cv" element={<CvRoute />} />
      <Route path="/reply/:messageId" element={<ReplyThread />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;