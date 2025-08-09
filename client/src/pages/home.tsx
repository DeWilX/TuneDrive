import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import PowerChecker from "@/components/power-checker";
import Services from "@/components/services";
import ZBox from "@/components/zbox";
import WhyChooseUs from "@/components/why-choose-us";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navigation />
      <main>
        <Hero />
        <PowerChecker />
        <Services />
        <ZBox />
        <WhyChooseUs />
        <Contact />
      </main>
      <Footer />
      
      {/* WhatsApp Float Button */}
      <a 
        href="https://wa.me/37129242069"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 animate-pulse-gentle"
        aria-label="Contact us on WhatsApp"
      >
        <i className="fab fa-whatsapp text-2xl"></i>
      </a>
    </div>
  );
}
