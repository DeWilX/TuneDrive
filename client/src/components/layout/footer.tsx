import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleManageCookies = () => {
    // Trigger cookie settings by clearing consent
    localStorage.removeItem('cookie-consent');
    window.location.reload();
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">ChipTuning PRO</h3>
            <p className="text-gray-400 text-sm mb-4">
              Professional ECU tuning and performance enhancement services. 
              Unlock your vehicle's true potential with our expert solutions.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#services" className="hover:text-accent-400 transition-colors">Stage 1 Tuning</Link></li>
              <li><Link href="/#services" className="hover:text-accent-400 transition-colors">Stage 2 Tuning</Link></li>
              <li><Link href="/#services" className="hover:text-accent-400 transition-colors">EGR Removal</Link></li>
              <li><Link href="/#services" className="hover:text-accent-400 transition-colors">DPF Removal</Link></li>
              <li><Link href="/#services" className="hover:text-accent-400 transition-colors">ZBOX Tuning</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-accent-400 transition-colors">Home</Link></li>
              <li><Link href="/#power-checker" className="hover:text-accent-400 transition-colors">Power Checker</Link></li>
              <li><Link href="/#contact" className="hover:text-accent-400 transition-colors">Contact</Link></li>
              <li><Link href="/#about" className="hover:text-accent-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal & Privacy */}
          <div>
            <h4 className="text-white font-semibold mb-4">Privacy & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-accent-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-accent-400 transition-colors">Cookie Policy</Link></li>
              <li>
                <button 
                  onClick={handleManageCookies}
                  className="hover:text-accent-400 transition-colors text-left"
                >
                  Cookie Preferences
                </button>
              </li>
              <li><a href="#" className="hover:text-accent-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              © {currentYear} ChipTuning PRO. All rights reserved.
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