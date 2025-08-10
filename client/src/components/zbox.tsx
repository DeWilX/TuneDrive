import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";

export default function ZBox() {
  const { t, language } = useLanguage();
  
  // Fetch ZBox content from admin panel
  const { data: zboxContent = null } = useQuery<any>({
    queryKey: ['/api/zbox'],
  });

  const defaultContent = {
    title: 'Introducing <span class="text-accent-500">ZBOX</span> Chiptuning Device',
    description: 'Revolutionary plug-and-play chiptuning solution with smartphone app control. Easy installation, multiple power maps, and real-time adjustment capabilities.',
    features: [
      "Plug-and-play installation in 5 minutes",
      "Multiple power maps via smartphone app", 
      "Real-time performance monitoring",
      "Reversible - no permanent changes"
    ],
    price: 'From €599',
    priceNote: 'Including installation',
    buttonText: 'Learn More About ZBOX'
  };
  
  // Get translated content based on current language
  const getTranslatedContent = () => {
    if (!zboxContent || typeof zboxContent !== 'object') {
      return defaultContent;
    }

    // If no translations exist or language doesn't have translation, use original content
    if (!zboxContent.translations || !zboxContent.translations[language]) {
      return {
        title: zboxContent.title || defaultContent.title,
        description: zboxContent.description || defaultContent.description,
        features: Array.isArray(zboxContent.features) ? zboxContent.features : defaultContent.features,
        price: zboxContent.price || defaultContent.price,
        priceNote: zboxContent.priceNote || defaultContent.priceNote,
        buttonText: zboxContent.buttonText || defaultContent.buttonText,
        image: zboxContent.image
      };
    }

    const translation = zboxContent.translations[language];

    // Merge translation with original content, prioritizing non-empty translation fields
    return {
      title: (translation.title && translation.title.trim()) || zboxContent.title || defaultContent.title,
      description: (translation.description && translation.description.trim()) || zboxContent.description || defaultContent.description,
      features: (Array.isArray(translation.features) && translation.features.length > 0) 
        ? translation.features.filter((f: string) => f && f.trim()) 
        : (Array.isArray(zboxContent.features) ? zboxContent.features : defaultContent.features),
      price: (translation.price && translation.price.trim()) || zboxContent.price || defaultContent.price,
      priceNote: (translation.priceNote && translation.priceNote.trim()) || zboxContent.priceNote || defaultContent.priceNote,
      buttonText: (translation.buttonText && translation.buttonText.trim()) || zboxContent.buttonText || defaultContent.buttonText,
      image: zboxContent.image
    };
  };

  const content = getTranslatedContent();
  
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 
              className="text-3xl md:text-4xl font-bold text-gray-100 mb-6"
              dangerouslySetInnerHTML={{ __html: content.title }}
            />
            <div 
              className="text-xl text-gray-400 mb-8"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
            
            <div className="space-y-4 mb-8">
              {(Array.isArray(content.features) ? content.features : [
                "Plug-and-play installation in 5 minutes",
                "Multiple power maps via smartphone app",
                "Real-time performance monitoring",
                "Reversible - no permanent changes"
              ]).map((feature: string, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="bg-accent-500 p-1 rounded-full mr-4 flex-shrink-0">
                    <i className="fas fa-check text-white text-sm"></i>
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Button 
                onClick={scrollToContact}
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 text-lg h-auto"
              >
                <i className="fas fa-info-circle mr-2"></i>
                {content.buttonText || 'Learn More About ZBOX'}
              </Button>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-accent-500">{content.price}</div>
                {content.priceNote && <div className="text-sm text-gray-400">{content.priceNote}</div>}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src={(content as any).image || "https://pixabay.com/get/gef47e70d2325ba5852f361aac8b997f684bfe06892d136d5fda0eb30606cdee09118bc1bd44183147c08af49373554f97344181f9885cebf3b1181e4290ad95f_1280.jpg"} 
              alt="ZBOX Chiptuning device installation" 
              className="w-full rounded-xl shadow-2xl"
              onError={(e) => {
                // Fallback to default image if custom image fails
                (e.target as HTMLImageElement).src = "https://pixabay.com/get/gef47e70d2325ba5852f361aac8b997f684bfe06892d136d5fda0eb30606cdee09118bc1bd44183147c08af49373554f97344181f9885cebf3b1181e4290ad95f_1280.jpg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent rounded-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
