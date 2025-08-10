import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { apiRequest } from "@/lib/queryClient";
import type { ContactContent } from "@shared/schema";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  service: string;
  message: string;
}

export default function ContactPage() {
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    vehicleBrand: "",
    vehicleModel: "",
    vehicleYear: "",
    service: "stage1",
    message: "",
  });

  // Contact content query
  const { data: contactContent, isLoading: isLoadingContent } = useQuery<ContactContent>({
    queryKey: ["/api/contact-content"],
  });

  // Contact form submission mutation
  const submitContactMutation = useMutation({
    mutationFn: (data: ContactFormData) =>
      apiRequest("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your message has been sent successfully. We'll get back to you within 24 hours!",
      });
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        vehicleBrand: "",
        vehicleModel: "",
        vehicleYear: "",
        service: "stage1",
        message: "",
      });
    },
    onError: (error: any) => {
      console.error("Contact form error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactMutation.mutate(formData);
  };

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get content for current language
  const getLocalizedContent = (
    lvContent: string,
    ruContent: string,
    enContent: string
  ) => {
    switch (currentLanguage) {
      case 'ru':
        return ruContent || lvContent;
      case 'en':
        return enContent || lvContent;
      default:
        return lvContent;
    }
  };

  if (isLoadingContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const heroTitle = contactContent ? getLocalizedContent(
    contactContent.heroTitleLv,
    contactContent.heroTitleRu,
    contactContent.heroTitleEn
  ) : "Get Your Free Quote";

  const heroDescription = contactContent ? getLocalizedContent(
    contactContent.heroDescriptionLv,
    contactContent.heroDescriptionRu,
    contactContent.heroDescriptionEn
  ) : "Contact us for professional ECU tuning services";

  const formTitle = contactContent ? getLocalizedContent(
    contactContent.formTitleLv,
    contactContent.formTitleRu,
    contactContent.formTitleEn
  ) : "Request Your Quote";

  const formDescription = contactContent ? getLocalizedContent(
    contactContent.formDescriptionLv,
    contactContent.formDescriptionRu,
    contactContent.formDescriptionEn
  ) : "Fill out the form below and we will get back to you within 24 hours with a personalized quote.";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {heroTitle}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Contact Form */}
            <Card className="border-muted bg-background">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {formTitle}
                </CardTitle>
                <p className="text-muted-foreground">
                  {formDescription}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+371 20123456"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleBrand">Vehicle Brand</Label>
                      <Input
                        id="vehicleBrand"
                        value={formData.vehicleBrand}
                        onChange={(e) => updateField("vehicleBrand", e.target.value)}
                        placeholder="Audi, BMW, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleModel">Model</Label>
                      <Input
                        id="vehicleModel"
                        value={formData.vehicleModel}
                        onChange={(e) => updateField("vehicleModel", e.target.value)}
                        placeholder="A4, 320d, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleYear">Year</Label>
                      <Input
                        id="vehicleYear"
                        value={formData.vehicleYear}
                        onChange={(e) => updateField("vehicleYear", e.target.value)}
                        placeholder="2020"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Service Type</Label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => updateField("service", e.target.value)}
                      className="w-full px-3 py-2 border border-muted rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="stage1">Stage 1 Chiptuning</option>
                      <option value="stage2">Stage 2 Chiptuning</option>
                      <option value="egr-dpf">EGR/DPF Removal</option>
                      <option value="zbox">ZBOX Tuning Device</option>
                      <option value="custom">Custom Tuning</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      placeholder="Tell us about your tuning goals and any specific requirements..."
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={submitContactMutation.isPending}
                  >
                    {submitContactMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="border-muted bg-background">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-primary"></i>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-phone text-primary"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-muted-foreground">
                        {contactContent?.phone || "+371 20123456"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-envelope text-primary"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">
                        {contactContent?.email || "info@chiptuningpro.lv"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-map-marker-alt text-primary"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="text-muted-foreground">
                        {contactContent?.location || "Riga, Latvia"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-muted bg-background">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <i className="fas fa-clock text-primary"></i>
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="text-muted-foreground">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="text-muted-foreground">10:00 - 16:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-muted-foreground">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-muted bg-background">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <i className="fab fa-whatsapp text-primary"></i>
                    Quick Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Need immediate assistance? Contact us directly via WhatsApp for the fastest response.
                  </p>
                  <Button
                    onClick={() => window.open(`https://wa.me/${contactContent?.phone?.replace(/\D/g, '') || '37120123456'}`, '_blank')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <i className="fab fa-whatsapp mr-2"></i>
                    WhatsApp Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}