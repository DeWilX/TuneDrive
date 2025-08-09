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
  const { t } = useLanguage();
  
  // Fetch why choose us content from admin panel
  const { data: pageContent = [] } = useQuery<any[]>({
    queryKey: ['/api/page-content'],
  });

  const whyChooseUsContent = pageContent.find((content: any) => content.section === 'why-choose-us') || {
    title: 'Why Choose ChipTuning PRO?',
    content: 'Over 15 years of experience in professional automotive tuning with thousands of satisfied customers worldwide',
    features: defaultFeatures
  };
  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl font-bold text-gray-100 mb-4"
            dangerouslySetInnerHTML={{ __html: whyChooseUsContent.title }}
          />
          <div 
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: whyChooseUsContent.content }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {(Array.isArray(whyChooseUsContent.features) ? whyChooseUsContent.features : defaultFeatures).map((feature: any, index: number) => (
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
                Professional Workshop & Equipment
              </h3>
              <p className="text-gray-400 mb-6">
                Our state-of-the-art facility is equipped with the latest diagnostic tools, 
                professional dynamometer, and specialized software for all major vehicle brands.
              </p>
              <ul className="space-y-3">
                {workshopFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <i className="fas fa-check-circle text-accent-500 mr-3"></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Modern automotive workshop" 
                className="w-full rounded-lg shadow-lg" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
