import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/hooks/useLanguage";

export default function Hero() {
  const { trackClick } = useAnalytics();
  const { t } = useLanguage();
  
  // Fetch hero content from admin panel
  const { data: pageContent = [] } = useQuery({
    queryKey: ['/api/page-content'],
  });

  // Fetch site identity for hero background image
  const { data: siteIdentity = {} } = useQuery({
    queryKey: ['/api/site-identity'],
  });

  const heroContent = (pageContent as any[])?.find((content: any) => content.section === 'hero') || {};
  
  // Use site identity data for hero text if no page content exists
  const heroTitle = (siteIdentity as any)?.heroTitle || 
    heroContent.title || 
    'Professional<br /><span class="text-accent-500">ECU Tuning</span><br />& Performance Enhancement';
  
  const heroSubtitle = (siteIdentity as any)?.heroSubtitle || 
    heroContent.content ||
    'Unlock your vehicle\'s true potential with our advanced chiptuning solutions. Over 15 years of experience in automotive performance optimization.';
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${(siteIdentity as any)?.heroImageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080'}')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-3xl animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-gray-100">
            <div dangerouslySetInnerHTML={{ __html: heroTitle }} />
          </h1>
          <div className="text-xl text-gray-300 mb-8 leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: heroSubtitle }} />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8 text-center">
            <div>
              <div className="text-3xl font-bold text-accent-500 mb-1">{(siteIdentity as any)?.clientCount || heroContent.stat1Value || '500'}</div>
              <div className="text-sm text-gray-400">{heroContent.stat1Label || t.hero.statsClients}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-500 mb-1">{(siteIdentity as any)?.projectCount || heroContent.stat2Value || '1200'}</div>
              <div className="text-sm text-gray-400">{heroContent.stat2Label || t.hero.statsProjects}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-500 mb-1">{(siteIdentity as any)?.experienceYears || heroContent.stat3Value || '10'}+</div>
              <div className="text-sm text-gray-400">{heroContent.stat3Label || t.hero.statsExperience}</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => {
                trackClick('hero-button', t.hero.primaryButton);
                scrollToSection('power-check');
              }}
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 text-lg h-auto"
            >
              <i className="fas fa-tachometer-alt mr-2"></i>
              {t.hero.primaryButton}
            </Button>
            <Button 
              onClick={() => {
                trackClick('hero-button', t.hero.secondaryButton);
                scrollToSection('contact');
              }}
              variant="outline"
              className="border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white px-8 py-4 text-lg h-auto"
            >
              <i className="fas fa-phone mr-2"></i>
              {t.hero.secondaryButton}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
