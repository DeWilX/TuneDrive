import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/hooks/useLanguage";

// Default services as fallback
const defaultServices = [
  {
    title: "Stage 1 Chiptuning",
    icon: "fa-microchip",
    image: "https://pixabay.com/get/gec3ecea16ae86fe59839f9b251c98e4ac0d2d0a7f0fdf5f10a8359959b1fc5c134773a2aaeec4f3dc666f59efc325a1357c156d2eabe0567c977f5b82af65a3e_1280.jpg",
    description: "Professional ECU remapping for optimal power and torque gains while maintaining reliability and fuel efficiency.",
    features: [
      "Up to 30% power increase",
      "Improved throttle response",
      "Better fuel economy",
      "Factory warranty safe"
    ],
    price: "From €299"
  },
  {
    title: "EGR Off",
    icon: "fa-cog",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    description: "Disable problematic EGR valve system to prevent carbon buildup and improve engine longevity.",
    features: [
      "Prevents carbon deposits",
      "Reduces maintenance costs",
      "Improves engine reliability",
      "Cleaner combustion"
    ],
    price: "From €199"
  },
  {
    title: "DPF/FAP Off",
    icon: "fa-filter",
    image: "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    description: "Remove diesel particulate filter limitations for improved performance and reduced maintenance.",
    features: [
      "Eliminates DPF regeneration",
      "Improved fuel consumption",
      "No more DPF warning lights",
      "Reduced operating costs"
    ],
    price: "From €249"
  },
  {
    title: "Stage 2 Chiptuning",
    icon: "fa-rocket",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    description: "Advanced tuning with hardware modifications for maximum performance gains and racing applications.",
    features: [
      "Up to 50% power increase",
      "Custom exhaust required",
      "Track-ready performance",
      "Professional installation"
    ],
    price: "From €499"
  },
  {
    title: "AdBlue Off",
    icon: "fa-tint",
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    description: "Disable AdBlue/SCR system to eliminate refill requirements and related system failures.",
    features: [
      "No more AdBlue refills",
      "Eliminates system errors",
      "Reduces operating costs",
      "Professional calibration"
    ],
    price: "From €199"
  },
  {
    title: "DSG Tuning",
    icon: "fa-exchange-alt",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    description: "Optimize automatic transmission shift points, torque limits, and launch control settings.",
    features: [
      "Faster shift speeds",
      "Improved launch control",
      "Custom shift points",
      "Enhanced driving dynamics"
    ],
    price: "From €349"
  }
];

export default function Services() {
  const { trackClick } = useAnalytics();
  const { t } = useLanguage();

  // Fetch services from admin panel
  const { data: servicesData = [] } = useQuery({
    queryKey: ['/api/services'],
  });

  // Fetch page content for services section
  const { data: pageContent = [] } = useQuery({
    queryKey: ['/api/page-content'],
  });

  // Transform admin data to match expected structure, fallback to default
  const services = (servicesData as any[]).length > 0 
    ? (servicesData as any[]).map((service: any) => ({
        title: service.title,
        icon: service.icon || 'fa-cog',
        image: service.image || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3',
        description: service.description,
        features: service.features ? service.features.split('\n').filter(Boolean) : [],
        price: service.price || 'Contact for price'
      }))
    : defaultServices;

  // Get services section content
  const servicesContent = (pageContent as any[])?.find((content: any) => content.section === 'services') || {};
  const servicesTitle = servicesContent.title || t.services.title;
  const servicesSubtitle = servicesContent.subtitle || t.services.subtitle;

  const handleServiceClick = (serviceName: string) => {
    trackClick('service-card', serviceName);
  };

  return (
    <section id="services" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
            {servicesTitle}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {servicesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: any, index: number) => (
            <Card 
              key={index}
              className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 group overflow-hidden cursor-pointer"
              onClick={() => handleServiceClick(service.title)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-accent-500 p-2 rounded-lg mr-3">
                      <i className={`fas ${service.icon} text-white`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-100">{service.title}</h3>
                  </div>
                  
                  <p className="text-gray-400 mb-4">
                    {service.description}
                  </p>
                  
                  <ul className="text-gray-300 text-sm space-y-1 mb-4">
                    {service.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex}>• {feature}</li>
                    ))}
                  </ul>
                  
                  <div className="text-accent-500 font-bold text-lg">
                    {service.price}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
