import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";

const defaultFeatures = [
  {
    icon: "fa-award",
    title: "15+ Years Experience",
    description: "Proven expertise in automotive performance optimization since 2008"
  },
  {
    icon: "fa-shield-alt",
    title: "Quality Guarantee",
    description: "All tuning services backed by comprehensive warranty and support"
  },
  {
    icon: "fa-tachometer-alt",
    title: "Dyno Testing",
    description: "Professional power verification on our in-house dynamometer"
  },
  {
    icon: "fa-user-cog",
    title: "Individual Solutions",
    description: "Custom tuning maps tailored to your specific vehicle and requirements"
  }
];

const workshopFeatures = [
  "Professional 4WD dynamometer",
  "OEM diagnostic equipment",
  "Climate-controlled workshop",
  "Certified technicians"
];

export default function WhyChooseUs() {
  const { t, language } = useLanguage();
  
  // Fetch why choose us content from admin panel with auto-refresh
  const { data: whyChooseUsContent = null } = useQuery<any>({
    queryKey: ['/api/why-choose-us'],
    refetchInterval: 1000, // Refresh every second to show admin changes
  });

  // Get translated content based on current language
  const getTranslatedContent = () => {
    if (!whyChooseUsContent || typeof whyChooseUsContent !== 'object') {
      return {
        title: 'Why Choose ChipTuning PRO?',
        description: 'Over 15 years of experience in professional automotive tuning with thousands of satisfied customers worldwide',
        features: defaultFeatures,
        workshopTitle: 'Professional Workshop & Equipment',
        workshopDescription: 'Our state-of-the-art facility is equipped with the latest diagnostic tools, professional dynamometer, and specialized software for all major vehicle brands.',
        workshopFeatures: workshopFeatures,
        workshopImage: null
      };
    }

    // If no translations exist or language doesn't have translation, use original content
    if (!whyChooseUsContent.translations || !whyChooseUsContent.translations[language]) {
      return {
        title: whyChooseUsContent.title,
        description: whyChooseUsContent.description,
        features: Array.isArray(whyChooseUsContent.features) ? whyChooseUsContent.features : defaultFeatures,
        workshopTitle: whyChooseUsContent.workshopTitle,
        workshopDescription: whyChooseUsContent.workshopDescription,
        workshopFeatures: Array.isArray(whyChooseUsContent.workshopFeatures) ? whyChooseUsContent.workshopFeatures : workshopFeatures,
        workshopImage: whyChooseUsContent.workshopImage
      };
    }

    const translation = whyChooseUsContent.translations[language];

    // Merge translation with original content, prioritizing non-empty translation fields
    return {
      title: (translation.title && translation.title.trim()) || whyChooseUsContent.title,
      description: (translation.description && translation.description.trim()) || whyChooseUsContent.description,
      features: (Array.isArray(translation.features) && translation.features.length > 0) 
        ? translation.features 
        : (Array.isArray(whyChooseUsContent.features) ? whyChooseUsContent.features : defaultFeatures),
      workshopTitle: (translation.workshopTitle && translation.workshopTitle.trim()) || whyChooseUsContent.workshopTitle,
      workshopDescription: (translation.workshopDescription && translation.workshopDescription.trim()) || whyChooseUsContent.workshopDescription,
      workshopFeatures: (Array.isArray(translation.workshopFeatures) && translation.workshopFeatures.length > 0) 
        ? translation.workshopFeatures 
        : (Array.isArray(whyChooseUsContent.workshopFeatures) ? whyChooseUsContent.workshopFeatures : workshopFeatures),
      workshopImage: whyChooseUsContent.workshopImage
    };
  };

  const content = getTranslatedContent();
  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl font-bold text-gray-100 mb-4"
            dangerouslySetInnerHTML={{ __html: content.title }}
          />
          <div 
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: content.description }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {content.features.map((feature: any, index: number) => (
            <div key={index} className="text-center">
              <div className="bg-accent-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className={`fas ${feature.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Workshop Section */}
        <div className="bg-gray-800 rounded-xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-100 mb-4">
                {content.workshopTitle}
              </h3>
              <p className="text-gray-400 mb-6">
                {content.workshopDescription}
              </p>
              <ul className="space-y-3">
                {content.workshopFeatures.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <i className="fas fa-check-circle text-accent-500 mr-3"></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <img 
                src={content.workshopImage || "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"} 
                alt="Modern automotive workshop" 
                className="w-full rounded-lg shadow-lg"
                onError={(e) => {
                  // Fallback to default image if custom image fails
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
