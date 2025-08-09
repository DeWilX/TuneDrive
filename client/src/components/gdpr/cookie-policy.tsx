import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';

export default function CookiePolicy() {
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
            <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
            <p className="text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies?</h2>
              <p className="text-gray-300 leading-relaxed">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better browsing experience by remembering your preferences, 
                understanding how you use our site, and enabling certain functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Types of Cookies We Use</h2>

              <div className="space-y-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-accent-400 mb-3">
                    🛡️ Necessary Cookies (Always Active)
                  </h3>
                  <p className="text-gray-300 mb-3">
                    These cookies are essential for the website to function properly. They enable basic 
                    features like page navigation, security, and access to secure areas.
                  </p>
                  <div className="text-sm text-gray-400">
                    <p><strong>Purpose:</strong> Website functionality, security, session management</p>
                    <p><strong>Duration:</strong> Session or up to 1 year</p>
                    <p><strong>Legal Basis:</strong> Legitimate interest (essential functionality)</p>
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-accent-400 mb-3">
                    ⚡ Functional Cookies
                  </h3>
                  <p className="text-gray-300 mb-3">
                    These cookies remember your preferences and choices to provide a more personalized 
                    experience, such as language settings and user interface customizations.
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p><strong>Examples:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Language preference settings</li>
                      <li>Theme and display preferences</li>
                      <li>Form data retention for user convenience</li>
                    </ul>
                    <p><strong>Duration:</strong> Up to 1 year</p>
                    <p><strong>Legal Basis:</strong> Consent</p>
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-accent-400 mb-3">
                    📊 Analytics Cookies
                  </h3>
                  <p className="text-gray-300 mb-3">
                    These cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously. This helps us improve our website and services.
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p><strong>Information collected:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Pages visited and time spent on site</li>
                      <li>Click tracking and user interactions</li>
                      <li>Traffic sources and referral data</li>
                      <li>General location data (country/city level)</li>
                      <li>Device and browser information</li>
                    </ul>
                    <p><strong>Duration:</strong> Up to 2 years</p>
                    <p><strong>Legal Basis:</strong> Consent</p>
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-accent-400 mb-3">
                    🎯 Marketing Cookies
                  </h3>
                  <p className="text-gray-300 mb-3">
                    These cookies track your browsing habits to deliver personalized advertisements 
                    and measure the effectiveness of marketing campaigns.
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p><strong>Purpose:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Personalized advertising delivery</li>
                      <li>Campaign performance measurement</li>
                      <li>Audience targeting and remarketing</li>
                      <li>Social media integration</li>
                    </ul>
                    <p><strong>Duration:</strong> Up to 2 years</p>
                    <p><strong>Legal Basis:</strong> Consent</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Some cookies are set by third-party services that appear on our pages:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>Google Analytics:</strong> Website usage analytics and performance tracking</li>
                <li>• <strong>Social Media Platforms:</strong> Social sharing and embedded content</li>
                <li>• <strong>Payment Processors:</strong> Secure payment handling and fraud prevention</li>
                <li>• <strong>Customer Support Tools:</strong> Live chat and support functionality</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Managing Your Cookie Preferences</h2>
              
              <h3 className="text-xl font-semibold text-accent-400 mb-3">On Our Website</h3>
              <p className="text-gray-300 mb-4">
                You can manage your cookie preferences at any time using our cookie consent banner or 
                by clicking the "Cookie Preferences" link in the footer of any page.
              </p>

              <h3 className="text-xl font-semibold text-accent-400 mb-3">In Your Browser</h3>
              <p className="text-gray-300 mb-4">
                Most web browsers allow you to control cookies through their settings:
              </p>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li>• <strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data</li>
                <li>• <strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li>• <strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
              </ul>

              <div className="bg-amber-900/20 border border-amber-700/50 p-4 rounded-lg">
                <p className="text-amber-200 text-sm">
                  <strong>Note:</strong> Disabling certain cookies may affect the functionality and user 
                  experience of our website. Necessary cookies cannot be disabled as they are essential 
                  for basic website operations.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Data Protection and Privacy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                All cookie data is processed in accordance with our Privacy Policy and applicable data 
                protection laws, including GDPR. We implement appropriate security measures to protect 
                your information.
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Data is encrypted during transmission and storage</li>
                <li>• Access to cookie data is restricted to authorized personnel only</li>
                <li>• We do not sell personal information to third parties</li>
                <li>• Data retention periods are clearly defined and enforced</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Updates to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in technology, 
                legislation, or our practices. The updated policy will be posted on this page with 
                a revised "Last Updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <div className="text-gray-300">
                <p className="mb-4">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p><strong>Email:</strong> privacy@chiptuningpro.lv</p>
                  <p><strong>Phone:</strong> +371 22 111 116</p>
                  <p><strong>Address:</strong> Riga, Latvia</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}