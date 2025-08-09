import { Link } from "wouter";

const serviceLinks = [
  "Stage 1 Chiptuning",
  "Stage 2 Chiptuning",
  "EGR/DPF Off",
  "AdBlue Off",
  "DSG Tuning",
  "ZBOX Device"
];

const contactDetails = [
  { icon: "fa-phone", text: "+371 22 111 116", color: "text-accent-500" },
  { icon: "fa-envelope", text: "info@chiptunepro.lv", color: "text-accent-500" },
  { icon: "fab fa-whatsapp", text: "+371 29 242 069", color: "text-green-500" },
  { icon: "fa-map-marker-alt", text: "Riga, Latvia", color: "text-accent-500" }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleManageCookies = () => {
    // Trigger cookie settings by clearing consent
    localStorage.removeItem('cookie-consent');
    window.location.reload();
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-accent-500">ChipTuning</span>
              <span className="text-2xl font-bold text-gray-100">PRO</span>
            </div>
            <p className="text-gray-400 mb-4">
              Professional ECU tuning and performance optimization services. 
              Over 15 years of experience serving customers worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent-500 transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-500 transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-500 transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-100 mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              {serviceLinks.map((service, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-accent-500 transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-100 mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              {contactDetails.map((contact, index) => (
                <li key={index} className="flex items-center">
                  <i className={`fas ${contact.icon} ${contact.color} mr-2`}></i>
                  {contact.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div>
            <h4 className="text-lg font-semibold text-gray-100 mb-4">Privacy & Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-accent-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-accent-500 transition-colors">Cookie Policy</Link></li>
              <li>
                <button 
                  onClick={handleManageCookies}
                  className="hover:text-accent-500 transition-colors text-left"
                >
                  Cookie Preferences
                </button>
              </li>
              <li><a href="#" className="hover:text-accent-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              <p>&copy; {currentYear} ChipTuning PRO. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center gap-2">
                <i className="fas fa-shield-alt text-green-400"></i>
                <span className="text-gray-400">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-lock text-blue-400"></i>
                <span className="text-gray-400">Secure Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
