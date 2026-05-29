'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'blitarflix-language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY) as Language | null;
      if (saved && (saved === 'en' || saved === 'id')) {
        setLanguageState(saved);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
    } catch {
      // localStorage not available
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  const { language, setLanguage, t } = context;

  // Helper function to get a translation by dot path
  const tt = useCallback(
    (path: string): string => {
      const keys = path.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: any = t;
      for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
          result = result[key];
        } else {
          return path; // fallback to key path
        }
      }
      if (result && typeof result === 'object' && language in result) {
        return result[language];
      }
      return typeof result === 'string' ? result : path;
    },
    [t, language]
  );

  return { language, setLanguage, t, tt };
}