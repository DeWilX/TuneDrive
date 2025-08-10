import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Save, RotateCcw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ContactContent {
  id: string;
  title: string;
  description: string;
  formTitle: string;
  formDescription: string;
  translations: {
    lv: {
      title: string;
      description: string;
      formTitle: string;
      formDescription: string;
    };
    ru: {
      title: string;
      description: string;
      formTitle: string;
      formDescription: string;
    };
    en: {
      title: string;
      description: string;
      formTitle: string;
      formDescription: string;
    };
  };
  isActive: boolean;
  updatedAt: string;
}

const LANGUAGES = [
  { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
];

export default function ContactManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ContactContent | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: contactContent, isLoading } = useQuery({
    queryKey: ['/api/admin/contact-content'],
    queryFn: async () => {
      const authToken = (window as any).authToken;
      const response = await fetch('/api/admin/contact-content', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch contact content');
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ContactContent) => {
      const authToken = (window as any).authToken;
      const response = await fetch('/api/admin/contact-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update contact content');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-content'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact-content'] });
      setHasChanges(false);
      toast({
        title: "Success",
        description: "Contact content updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update contact content",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (contactContent && !formData) {
      setFormData({
        ...contactContent,
        translations: contactContent.translations || {
          lv: { title: "", description: "", formTitle: "", formDescription: "" },
          ru: { title: "", description: "", formTitle: "", formDescription: "" },
          en: { title: "", description: "", formTitle: "", formDescription: "" }
        }
      });
    }
  }, [contactContent, formData]);

  const handleFieldChange = (field: keyof ContactContent, value: any) => {
    if (!formData) return;
    
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
    setHasChanges(true);
  };

  const handleTranslationChange = (language: string, field: string, value: string) => {
    if (!formData) return;
    
    setFormData(prev => prev ? {
      ...prev,
      translations: {
        ...prev.translations,
        [language]: {
          ...prev.translations[language as keyof typeof prev.translations],
          [field]: value
        }
      }
    } : null);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!formData) return;
    updateMutation.mutate(formData);
  };

  const handleReset = () => {
    if (contactContent) {
      setFormData({
        ...contactContent,
        translations: contactContent.translations || {
          lv: { title: "", description: "", formTitle: "", formDescription: "" },
          ru: { title: "", description: "", formTitle: "", formDescription: "" },
          en: { title: "", description: "", formTitle: "", formDescription: "" }
        }
      });
      setHasChanges(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!formData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No contact content found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contact Section Management</h2>
          <p className="text-muted-foreground">
            Manage contact section content with multilingual support
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="secondary" className="animate-pulse">
              Unsaved changes
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!hasChanges || updateMutation.isPending}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateMutation.isPending}
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Main Content</TabsTrigger>
          <TabsTrigger value="translations">Translations</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Default Content (Latvian)</CardTitle>
              <CardDescription>
                Main content fields that serve as fallback when translations are missing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Contact section title"
                />
              </div>

              <div>
                <Label htmlFor="description">Section Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Brief description of contact section"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="formTitle">Form Title</Label>
                <Input
                  id="formTitle"
                  value={formData.formTitle}
                  onChange={(e) => handleFieldChange('formTitle', e.target.value)}
                  placeholder="Contact form title"
                />
              </div>

              <div>
                <Label htmlFor="formDescription">Form Description</Label>
                <Textarea
                  id="formDescription"
                  value={formData.formDescription}
                  onChange={(e) => handleFieldChange('formDescription', e.target.value)}
                  placeholder="Instructions for the contact form"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="translations" className="space-y-4">
          <div className="grid gap-6">
            {LANGUAGES.map((language) => (
              <Card key={language.code}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{language.flag}</span>
                    {language.name} Translation
                  </CardTitle>
                  <CardDescription>
                    Content displayed when user's language is set to {language.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`${language.code}-title`}>Section Title</Label>
                    <Input
                      id={`${language.code}-title`}
                      value={formData.translations[language.code as keyof typeof formData.translations]?.title || ''}
                      onChange={(e) => handleTranslationChange(language.code, 'title', e.target.value)}
                      placeholder={`Contact section title in ${language.name}`}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${language.code}-description`}>Section Description</Label>
                    <Textarea
                      id={`${language.code}-description`}
                      value={formData.translations[language.code as keyof typeof formData.translations]?.description || ''}
                      onChange={(e) => handleTranslationChange(language.code, 'description', e.target.value)}
                      placeholder={`Brief description in ${language.name}`}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${language.code}-formTitle`}>Form Title</Label>
                    <Input
                      id={`${language.code}-formTitle`}
                      value={formData.translations[language.code as keyof typeof formData.translations]?.formTitle || ''}
                      onChange={(e) => handleTranslationChange(language.code, 'formTitle', e.target.value)}
                      placeholder={`Contact form title in ${language.name}`}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${language.code}-formDescription`}>Form Description</Label>
                    <Textarea
                      id={`${language.code}-formDescription`}
                      value={formData.translations[language.code as keyof typeof formData.translations]?.formDescription || ''}
                      onChange={(e) => handleTranslationChange(language.code, 'formDescription', e.target.value)}
                      placeholder={`Form instructions in ${language.name}`}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}