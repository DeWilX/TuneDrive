import { useState } from "react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/language-selector";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuery } from "@tanstack/react-query";

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  icon?: string;
}

interface SiteIdentity {
  logoUrl?: string;
  companyName?: string;
  primaryColor?: string;
  accentColor?: string;
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  // Fetch navigation items from database
  const { data: navigationItems = [] } = useQuery({
    queryKey: ['/api/navigation'],
    queryFn: async () => {
      const response = await fetch('/api/navigation');
      if (!response.ok) throw new Error('Failed to fetch navigation');
      return response.json();
    },
  });

  // Fetch site identity for logo and branding
  const { data: siteIdentity = {} } = useQuery({
    queryKey: ['/api/site-identity'],
  });

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
            <div className="flex-shrink-0 flex items-center">
              {(siteIdentity as SiteIdentity)?.logoUrl ? (
                <img 
                  src={(siteIdentity as SiteIdentity).logoUrl} 
                  alt={(siteIdentity as SiteIdentity).companyName || 'ChipTuning PRO'} 
                  className="h-10 w-auto"
                />
              ) : (
                <div>
                  <span className="text-2xl font-bold text-accent-500">
                    {(siteIdentity as SiteIdentity)?.companyName?.split(' ')[0] || 'ChipTuning'}
                  </span>
                  <span className="text-2xl font-bold text-gray-100">
                    {(siteIdentity as SiteIdentity)?.companyName?.split(' ')[1] || 'PRO'}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems
                .filter((item: NavigationItem) => item.isActive)
                .sort((a: NavigationItem, b: NavigationItem) => a.order - b.order)
                .map((item: NavigationItem) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.href.replace('#', ''))}
                    className="text-gray-300 hover:text-accent-500 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    {item.icon && <i className={`${item.icon} text-sm`}></i>}
                    {item.label}
                  </button>
                ))}
              
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
              {navigationItems
                .filter((item: NavigationItem) => item.isActive)
                .sort((a: NavigationItem, b: NavigationItem) => a.order - b.order)
                .map((item: NavigationItem) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.href.replace('#', ''))}
                    className="w-full text-left text-gray-300 hover:text-accent-500 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    {item.icon && <i className={`${item.icon} text-sm`}></i>}
                    {item.label}
                  </button>
                ))}
              
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
