import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Contact() {
  const { tObj } = useLanguage();
  const contactData = tObj('contact');

  const [formStatus, setFormStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      subject: formData.get('subject') || '',
      budget: formData.get('budget') || '',
      message: formData.get('message') || '',
      status: 'new', // 'new' | 'read' | 'replied'
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'messages'), payload);
      setFormStatus(true);
    } catch (err) {
      console.error('Erreur envoi message Firestore :', err);
      setSubmitError("Une erreur est survenue. Réessaie ou écris-moi directement par email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="w-full bg-white text-black py-28 px-4 md:px-12 lg:px-20 font-sans border-t border-black/5 overflow-hidden"
    >
      <div className={`max-w-5xl mx-auto space-y-16 transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>

        {/* EN-TÊTE DE SECTION CENTRÉ */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
              {contactData?.tag}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black font-serif tracking-tight text-black">
            {contactData?.title}
          </h2>
          <p className="text-sm md:text-base text-black/70 max-w-xl font-sans">
            {contactData?.subtitle}
          </p>
        </div>

        {/* FORMULAIRE PRO CENTRÉ */}
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-black/15 shadow-sm">
          {formStatus ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold text-xl">
                ✓
              </div>
              <h3 className="text-2xl font-serif font-bold text-black">{contactData?.success_title}</h3>
              <p className="text-sm text-black/70">{contactData?.success_desc}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Nom / Entreprise */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold tracking-widest text-black/60 uppercase">
                    {contactData?.name_label}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder={contactData?.name_placeholder}
                    className="w-full px-4 py-3.5 rounded-xl bg-black/[0.02] border border-black/15 text-black placeholder:text-black/30 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold tracking-widest text-black/60 uppercase">
                    {contactData?.email_label}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={contactData?.email_placeholder}
                    className="w-full px-4 py-3.5 rounded-xl bg-black/[0.02] border border-black/15 text-black placeholder:text-black/30 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Sujet */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold tracking-widest text-black/60 uppercase">
                    {contactData?.subject_label}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder={contactData?.subject_placeholder}
                    className="w-full px-4 py-3.5 rounded-xl bg-black/[0.02] border border-black/15 text-black placeholder:text-black/30 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                {/* Budget Estimé */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold tracking-widest text-black/60 uppercase">
                    {contactData?.budget_label}
                  </label>
                  <select
                    name="budget"
                    className="w-full px-4 py-3.5 rounded-xl bg-black/[0.02] border border-black/15 text-black text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  >
                    <option value="">{contactData?.budget_default}</option>
                    <option value="150k-500k">150 000 - 500 000 XOF</option>
                    <option value="500k-1m">500 000 - 1 000 000 XOF</option>
                    <option value="1m-3m">1 000 000 - 3 000 000 XOF</option>
                    <option value="3m+">3 000 000+ XOF</option>
                  </select>
                </div>

              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold tracking-widest text-black/60 uppercase">
                  {contactData?.message_label}
                </label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  placeholder={contactData?.message_placeholder}
                  className="w-full px-4 py-3.5 rounded-xl bg-black/[0.02] border border-black/15 text-black placeholder:text-black/30 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                ></textarea>
              </div>

              {submitError && (
                <p className="text-xs text-red-500 font-mono">{submitError}</p>
              )}

              {/* Bouton d'envoi */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-black text-white font-mono text-xs font-bold tracking-wider uppercase hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? '...' : contactData?.submit_btn}
              </button>
            </form>
          )}
        </div>

        {/* CARTES DE CONTACT DIRECT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">

          {/* Email */}
          <a
            href="mailto:leon@evabas.dev"
            className="flex items-center justify-between p-5 rounded-2xl bg-white border border-black/15 hover:border-[#D4AF37] transition-all group shadow-sm"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-black/50 uppercase">Email</span>
              <p className="text-sm font-bold text-black group-hover:text-[#D4AF37] transition-colors">leon@evabas</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center text-black/70 group-hover:bg-[#D4AF37] group-hover:text-white transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/22961406443"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-5 rounded-2xl bg-white border border-black/15 hover:border-[#D4AF37] transition-all group shadow-sm"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-black/50 uppercase">WhatsApp</span>
              <p className="text-sm font-bold text-black group-hover:text-[#D4AF37] transition-colors">+229 61 40 64 43</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center text-black/70 group-hover:bg-[#D4AF37] group-hover:text-white transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/leonevabas"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-5 rounded-2xl bg-white border border-black/15 hover:border-[#D4AF37] transition-all group shadow-sm"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-black/50 uppercase">LinkedIn</span>
              <p className="text-sm font-bold text-black group-hover:text-[#D4AF37] transition-colors">in/leonevabas</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center text-black/70 group-hover:bg-[#D4AF37] group-hover:text-white transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </div>
          </a>

        </div>

      </div>
    </section>
  );
}