import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { languages } from '@/lib/translations';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'header' | 'footer' | 'inline';
}

export default function LanguageSelector({ className = '', variant = 'header' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, isLoading } = useLanguage();

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  // Header variant styling
  const headerStyles = {
    button: "flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-colors border border-gray-600/50 hover:border-gray-500",
    dropdown: "absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 backdrop-blur-sm",
    option: "flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
  };

  // Footer variant styling  
  const footerStyles = {
    button: "flex items-center gap-2 px-2 py-1 rounded text-gray-400 hover:text-accent-400 transition-colors text-sm",
    dropdown: "absolute bottom-full right-0 mb-2 w-40 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50",
    option: "flex items-center gap-2 px-3 py-2 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white text-sm"
  };

  // Inline variant styling
  const inlineStyles = {
    button: "flex items-center gap-2 px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
    dropdown: "absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50",
    option: "flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  };

  const styles = variant === 'header' ? headerStyles : variant === 'footer' ? footerStyles : inlineStyles;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={styles.button}
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        {variant !== 'footer' && (
          <>
            <span className="text-lg">{currentLanguage.flag}</span>
            <span className="font-medium">{currentLanguage.name}</span>
          </>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        {isLoading && <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin ml-1" />}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`${styles.option} w-full text-left ${
                language === lang.code ? 'bg-gray-700 text-accent-400' : ''
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="flex-1">{lang.name}</span>
              {language === lang.code && <Check className="w-4 h-4 text-accent-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}