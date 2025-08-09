import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/hooks/useLanguage";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleInfo: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { trackClick } = useAnalytics();
  const { t } = useLanguage();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    trackClick('contact-form-submit', 'Contact Form');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: t.contact.success,
        });
        setFormData({ name: "", email: "", phone: "", vehicleInfo: "", message: "" });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: t.contact.error,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
            {t.contact.title}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Send us a message</CardTitle>
              <CardDescription className="text-gray-400">
                Fill out the form below and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">{t.contact.name}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="bg-gray-700 border-gray-600 text-gray-100"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-300">{t.contact.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="bg-gray-700 border-gray-600 text-gray-100"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-300">{t.contact.phone}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-100"
                    placeholder="+371 XX XXX XXX"
                  />
                </div>

                <div>
                  <Label htmlFor="vehicle" className="text-gray-300">{t.contact.vehicleInfo}</Label>
                  <Input
                    id="vehicle"
                    value={formData.vehicleInfo}
                    onChange={(e) => handleInputChange("vehicleInfo", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-100"
                    placeholder="e.g., 2018 BMW 320d xDrive"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-300">{t.contact.message}</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-100 min-h-[120px]"
                    placeholder="Tell us about your tuning needs..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent-500 hover:bg-accent-600 text-white"
                >
                  {isSubmitting ? (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-paper-plane mr-2"></i>
                  )}
                  {isSubmitting ? "Sending..." : t.contact.submit}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent-500 p-3 rounded-lg">
                    <i className="fas fa-phone text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-100 mb-1">Phone</h4>
                    <p className="text-gray-300">+371 22 111 116</p>
                    <p className="text-sm text-gray-400">Mon-Fri 9:00-18:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 p-3 rounded-lg">
                    <i className="fab fa-whatsapp text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-100 mb-1">WhatsApp</h4>
                    <a 
                      href="https://wa.me/37129242069" 
                      className="text-green-400 hover:text-green-300 transition-colors"
                      onClick={() => trackClick('contact-whatsapp', 'WhatsApp Contact')}
                    >
                      +371 29 242 069
                    </a>
                    <p className="text-sm text-gray-400">Instant messaging & quotes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <i className="fas fa-envelope text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-100 mb-1">Email</h4>
                    <a 
                      href="mailto:info@chiptuningpro.lv" 
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      info@chiptuningpro.lv
                    </a>
                    <p className="text-sm text-gray-400">24/7 email support</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-600 p-3 rounded-lg">
                    <i className="fas fa-map-marker-alt text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-100 mb-1">Location</h4>
                    <p className="text-gray-300">Riga, Latvia</p>
                    <p className="text-sm text-gray-400">Mobile service available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}