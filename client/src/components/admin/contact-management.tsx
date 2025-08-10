import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ContactContent, InsertContactContent } from "@shared/schema";

// Language configuration
const languages = [
  { code: 'lv', name: 'Latvian', flag: '🇱🇻' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

export function ContactManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("content");

  // Contact content query
  const { data: contactContent, isLoading: isLoadingContent } = useQuery<ContactContent>({
    queryKey: ["/api/admin/contact-content"],
  });

  // Contact content mutation
  const updateContactContentMutation = useMutation({
    mutationFn: (data: Partial<InsertContactContent>) =>
      apiRequest("/api/admin/contact-content", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-content"] });
      toast({
        title: "Success",
        description: "Contact information updated successfully",
      });
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update contact information",
        variant: "destructive",
      });
    },
  });

  const handleContactInfoUpdate = (data: Partial<InsertContactContent>) => {
    updateContactContentMutation.mutate(data);
  };

  if (isLoadingContent) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contact Management</h2>
          <p className="text-muted-foreground">
            Manage all contact information, forms, and email settings from one central location
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          Centralized Contact System
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Contact Content</TabsTrigger>
          <TabsTrigger value="details">Contact Details</TabsTrigger>
          <TabsTrigger value="settings">Email Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <ContactContentForm
            contactContent={contactContent}
            onUpdate={handleContactInfoUpdate}
            isUpdating={updateContactContentMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <ContactDetailsForm
            contactContent={contactContent}
            onUpdate={handleContactInfoUpdate}
            isUpdating={updateContactContentMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <EmailSettingsForm
            contactContent={contactContent}
            onUpdate={handleContactInfoUpdate}
            isUpdating={updateContactContentMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface FormProps {
  contactContent?: ContactContent;
  onUpdate: (data: Partial<InsertContactContent>) => void;
  isUpdating: boolean;
}

function ContactContentForm({ contactContent, onUpdate, isUpdating }: FormProps) {
  const [formData, setFormData] = useState({
    heroTitleLv: contactContent?.heroTitleLv || "",
    heroTitleRu: contactContent?.heroTitleRu || "",
    heroTitleEn: contactContent?.heroTitleEn || "",
    heroDescriptionLv: contactContent?.heroDescriptionLv || "",
    heroDescriptionRu: contactContent?.heroDescriptionRu || "",
    heroDescriptionEn: contactContent?.heroDescriptionEn || "",
    formTitleLv: contactContent?.formTitleLv || "",
    formTitleRu: contactContent?.formTitleRu || "",
    formTitleEn: contactContent?.formTitleEn || "",
    formDescriptionLv: contactContent?.formDescriptionLv || "",
    formDescriptionRu: contactContent?.formDescriptionRu || "",
    formDescriptionEn: contactContent?.formDescriptionEn || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Hero Section Content
            <Badge variant="secondary">Multilingual</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hero Title */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Hero Title</Label>
            <div className="grid gap-4">
              {languages.map((lang) => (
                <div key={`heroTitle${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`} className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-base">{lang.flag}</span>
                    {lang.name}
                  </Label>
                  <Input
                    value={formData[`heroTitle${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}` as keyof typeof formData]}
                    onChange={(e) => updateField(`heroTitle${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`, e.target.value)}
                    placeholder={`Hero title in ${lang.name}`}
                    className="font-medium"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hero Description */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Hero Description</Label>
            <div className="grid gap-4">
              {languages.map((lang) => (
                <div key={`heroDescription${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`} className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-base">{lang.flag}</span>
                    {lang.name}
                  </Label>
                  <Textarea
                    value={formData[`heroDescription${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}` as keyof typeof formData]}
                    onChange={(e) => updateField(`heroDescription${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`, e.target.value)}
                    placeholder={`Hero description in ${lang.name}`}
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Contact Form Content
            <Badge variant="secondary">Multilingual</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form Title */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Form Title</Label>
            <div className="grid gap-4">
              {languages.map((lang) => (
                <div key={`formTitle${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`} className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-base">{lang.flag}</span>
                    {lang.name}
                  </Label>
                  <Input
                    value={formData[`formTitle${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}` as keyof typeof formData]}
                    onChange={(e) => updateField(`formTitle${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`, e.target.value)}
                    placeholder={`Form title in ${lang.name}`}
                    className="font-medium"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Form Description */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Form Description</Label>
            <div className="grid gap-4">
              {languages.map((lang) => (
                <div key={`formDescription${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`} className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-base">{lang.flag}</span>
                    {lang.name}
                  </Label>
                  <Textarea
                    value={formData[`formDescription${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}` as keyof typeof formData]}
                    onChange={(e) => updateField(`formDescription${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}`, e.target.value)}
                    placeholder={`Form description in ${lang.name}`}
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isUpdating} className="min-w-32">
          {isUpdating ? "Saving..." : "Save Content"}
        </Button>
      </div>
    </form>
  );
}

function ContactDetailsForm({ contactContent, onUpdate, isUpdating }: FormProps) {
  const [formData, setFormData] = useState({
    phone: contactContent?.phone || "",
    email: contactContent?.email || "",
    location: contactContent?.location || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Contact Information
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
              Site-wide Display
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            This information will be displayed consistently across your entire website
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="info@chiptuningpro.lv"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Riga, Latvia"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isUpdating} className="min-w-32">
          {isUpdating ? "Saving..." : "Save Details"}
        </Button>
      </div>
    </form>
  );
}

function EmailSettingsForm({ contactContent, onUpdate, isUpdating }: FormProps) {
  const [formData, setFormData] = useState({
    quotesEmail: contactContent?.quotesEmail || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Email Configuration
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
              Form Destination
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure where contact form submissions should be sent
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quotesEmail">Quotes & Contact Form Email</Label>
            <Input
              id="quotesEmail"
              type="email"
              value={formData.quotesEmail}
              onChange={(e) => updateField("quotesEmail", e.target.value)}
              placeholder="quotes@chiptuningpro.lv"
            />
            <p className="text-xs text-muted-foreground">
              All contact form submissions and quote requests will be sent to this email address
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isUpdating} className="min-w-32">
          {isUpdating ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}