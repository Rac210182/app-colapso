'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type Language } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt-BR');

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language;
    let detectedLang: Language = 'pt-BR';
    
    if (browserLang.startsWith('pt-BR')) detectedLang = 'pt-BR';
    else if (browserLang.startsWith('pt')) detectedLang = 'pt-PT';
    else if (browserLang.startsWith('en')) detectedLang = 'en';
    else if (browserLang.startsWith('es')) detectedLang = 'es';
    else if (browserLang.startsWith('fr')) detectedLang = 'fr';
    else if (browserLang.startsWith('it')) detectedLang = 'it';
    
    // Check localStorage
    const savedLang = localStorage.getItem('colapso_language') as Language;
    if (savedLang) {
      setLanguageState(savedLang);
    } else {
      setLanguageState(detectedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('colapso_language', lang);
  };

  const t = (key: string): string => {
    // Import translations dynamically
    const { getTranslation } = require('@/lib/translations');
    return getTranslation(key, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
