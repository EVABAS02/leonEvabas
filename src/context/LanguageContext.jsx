// useContext (ex: src/context/LanguageContext.jsx)
import React, { createContext, useContext, useState } from 'react';
import { translations } from "../locales/translations";// Chemin vers votre fichier de traductions

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('fr');

  const t = (section, key) => {
    return translations[lang]?.[section]?.[key] || translations['fr'][section]?.[key] || key;
  };

  const tObj = (section) => {
    return translations[lang]?.[section] || translations['fr'][section];
  };

  const toggleLang = () => {
    setLang((prev) => (prev === 'fr' ? 'en' : 'fr'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, tObj }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);