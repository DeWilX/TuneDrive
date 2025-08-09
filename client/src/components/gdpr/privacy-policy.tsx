import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <button className="flex items-center text-accent-400 hover:text-accent-300 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </button>
            </Link>
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                ChipTuning PRO ("we," "our," or "us") is committed to protecting your privacy and personal data. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
                you visit our website and use our services.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This policy complies with the General Data Protection Regulation (GDPR) and other applicable 
                data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-accent-400 mb-3">2.1 Personal Information</h3>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• Name and contact information (email, phone number)</li>
                <li>• Vehicle information (make, model, year, engine details)</li>
                <li>• Service preferences and communication history</li>
                <li>• Payment information (processed securely by third-party providers)</li>
              </ul>

              <h3 className="text-xl font-semibold text-accent-400 mb-3">2.2 Technical Information</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• IP address and browser information</li>
                <li>• Device type and operating system</li>
                <li>• Website usage data and analytics</li>
                <li>• Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• Provide and improve our ECU tuning services</li>
                <li>• Communicate about services, appointments, and updates</li>
                <li>• Process payments and maintain customer records</li>
                <li>• Analyze website usage to enhance user experience</li>
                <li>• Comply with legal obligations and protect our rights</li>
                <li>• Send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Legal Basis for Processing</h2>
              <div className="text-gray-300 space-y-3">
                <div>
                  <strong className="text-accent-400">Contract Performance:</strong> Processing necessary to provide our services
                </div>
                <div>
                  <strong className="text-accent-400">Legitimate Interest:</strong> Improving services, fraud prevention, and business operations
                </div>
                <div>
                  <strong className="text-accent-400">Consent:</strong> Marketing communications and optional analytics
                </div>
                <div>
                  <strong className="text-accent-400">Legal Compliance:</strong> Meeting regulatory and tax obligations
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Your GDPR Rights</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong className="text-accent-400">Right of Access:</strong> Request copies of your personal data</li>
                <li>• <strong className="text-accent-400">Right to Rectification:</strong> Correct inaccurate information</li>
                <li>• <strong className="text-accent-400">Right to Erasure:</strong> Request deletion of your data</li>
                <li>• <strong className="text-accent-400">Right to Restrict Processing:</strong> Limit how we use your data</li>
                <li>• <strong className="text-accent-400">Right to Data Portability:</strong> Receive your data in a portable format</li>
                <li>• <strong className="text-accent-400">Right to Object:</strong> Opt-out of certain processing activities</li>
                <li>• <strong className="text-accent-400">Right to Withdraw Consent:</strong> Change your mind about optional processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your browsing experience. You can control 
                cookie preferences through our cookie consent banner or browser settings.
              </p>
              
              <h3 className="text-xl font-semibold text-accent-400 mb-3">Cookie Categories:</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>Necessary:</strong> Essential for website functionality</li>
                <li>• <strong>Functional:</strong> Remember your preferences and settings</li>
                <li>• <strong>Analytics:</strong> Help us understand website usage patterns</li>
                <li>• <strong>Marketing:</strong> Deliver personalized advertisements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Data Security</h2>
              <p className="text-gray-300 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal 
                data against unauthorized access, alteration, disclosure, or destruction. This includes encryption, 
                secure servers, and regular security assessments.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Data Retention</h2>
              <p className="text-gray-300 leading-relaxed">
                We retain personal data only for as long as necessary to fulfill the purposes for which it was 
                collected, comply with legal obligations, and resolve disputes. Customer service records are 
                typically retained for 7 years for warranty and legal purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. Third-Party Services</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may share data with trusted third-party service providers who assist in delivering our services:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Payment processors (for secure transaction handling)</li>
                <li>• Cloud storage providers (for data backup and security)</li>
                <li>• Analytics services (for website improvement)</li>
                <li>• Communication tools (for customer support)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">10. International Data Transfers</h2>
              <p className="text-gray-300 leading-relaxed">
                If we transfer your data outside the European Economic Area (EEA), we ensure appropriate 
                safeguards are in place, including Standard Contractual Clauses or adequacy decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Information</h2>
              <div className="text-gray-300 space-y-2">
                <p>For privacy-related questions or to exercise your rights, contact us:</p>
                <div className="bg-gray-800 p-4 rounded-lg mt-4">
                  <p><strong>Email:</strong> privacy@chiptuningpro.lv</p>
                  <p><strong>Phone:</strong> +371 22 111 116</p>
                  <p><strong>Address:</strong> Riga, Latvia</p>
                </div>
                <p className="mt-4">
                  You also have the right to lodge a complaint with the Data State Inspectorate of Latvia 
                  or your local supervisory authority.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">12. Policy Updates</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of significant changes 
                by posting the updated policy on our website and updating the "Last Updated" date.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}