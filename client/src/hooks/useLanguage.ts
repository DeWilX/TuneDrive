import { useState, useEffect, createContext, useContext } from 'react';
import { translations, defaultLanguage, type Translation } from '@/lib/translations';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: Translation;
  isLoading: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useLanguageState() {
  const [language, setLanguageState] = useState<string>(() => {
    // Try to get language from localStorage, URL, or browser preference
    const stored = localStorage.getItem('preferred-language');
    if (stored && translations[stored]) {
      return stored;
    }

    // Try to get from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && translations[urlLang]) {
      return urlLang;
    }

    // Try to detect from browser language
    const browserLang = navigator.language.split('-')[0];
    if (translations[browserLang]) {
      return browserLang;
    }

    return defaultLanguage;
  });

  const [isLoading, setIsLoading] = useState(false);

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setIsLoading(true);
      setLanguageState(lang);
      localStorage.setItem('preferred-language', lang);
      
      // Update URL parameter without reload
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
      
      // Set functional cookie if GDPR allows
      const consent = localStorage.getItem('cookie-consent');
      if (consent) {
        try {
          const settings = JSON.parse(consent);
          if (settings.functional) {
            document.cookie = `language_preference=${lang}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
          }
        } catch (error) {
          // Invalid consent data, using default
        }
      }
      
      setTimeout(() => setIsLoading(false), 100);
    }
  };

  useEffect(() => {
    // Listen for storage changes (language change in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'preferred-language' && e.newValue && translations[e.newValue]) {
        setLanguageState(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = translations[language] || translations[defaultLanguage];

  return {
    language,
    setLanguage,
    t,
    isLoading
  };
}