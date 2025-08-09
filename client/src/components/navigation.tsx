import { useState } from "react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/language-selector";
import { useLanguage } from "@/hooks/useLanguage";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full glass-effect border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-accent-500">ChipTuning</span>
              <span className="text-2xl font-bold text-gray-100">PRO</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-gray-300 hover:text-accent-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t.nav.home}
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-gray-300 hover:text-accent-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t.nav.services}
              </button>
              <button 
                onClick={() => scrollToSection('power-check')}
                className="text-gray-300 hover:text-accent-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t.nav.powerChecker}
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-300 hover:text-accent-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t.nav.about}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-300 hover:text-accent-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t.nav.contact}
              </button>
              
              {/* Language Selector */}
              <LanguageSelector variant="header" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a 
              href="tel:+37122111116" 
              className="flex items-center text-accent-500 font-semibold hover:text-accent-600 transition-colors"
            >
              <i className="fas fa-phone mr-2"></i>
              <span className="hidden sm:inline">+371 22 111 116</span>
            </a>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-gray-300"
              >
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 rounded-lg mt-2">
              <button 
                onClick={() => scrollToSection('home')}
                className="block w-full text-left text-gray-300 hover:text-accent-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t.nav.home}
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="block w-full text-left text-gray-300 hover:text-accent-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t.nav.services}
              </button>
              <button 
                onClick={() => scrollToSection('power-check')}
                className="block w-full text-left text-gray-300 hover:text-accent-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t.nav.powerChecker}
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block w-full text-left text-gray-300 hover:text-accent-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t.nav.about}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left text-gray-300 hover:text-accent-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t.nav.contact}
              </button>
              
              {/* Mobile Language Selector */}
              <div className="px-3 py-2">
                <LanguageSelector variant="inline" className="w-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
