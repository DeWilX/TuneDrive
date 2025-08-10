import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Save, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface WhyChooseUsFormData {
  title: string;
  description: string;
  features: Feature[];
  workshopTitle: string;
  workshopDescription: string;
  workshopFeatures: string[];
  workshopImage?: string;
  translations?: Record<string, {
    title?: string;
    description?: string;
    features?: Feature[];
    workshopTitle?: string;
    workshopDescription?: string;
    workshopFeatures?: string[];
  }>;
}

export default function WhyChooseUsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<WhyChooseUsFormData>({
    title: '',
    description: '',
    features: [],
    workshopTitle: '',
    workshopDescription: '',
    workshopFeatures: [],
    workshopImage: '',
    translations: {}
  });

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [newFeature, setNewFeature] = useState<Feature>({ icon: '', title: '', description: '' });
  const [newWorkshopFeature, setNewWorkshopFeature] = useState('');

  // Fetch current content with authentication
  const { data: currentContent, isLoading } = useQuery<any>({
    queryKey: ['/api/admin/why-choose-us'],
    queryFn: async () => {
      const response = await fetch('/api/admin/why-choose-us', {
        headers: {
          'Authorization': `Bearer ${(window as any).authToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      return response.json();
    }
  });

  // Update form when content loads
  useEffect(() => {
    if (currentContent) {
      setFormData({
        title: currentContent.title || 'Why Choose ChipTuning PRO?',
        description: currentContent.description || 'Over 15 years of experience in professional automotive tuning with thousands of satisfied customers worldwide',
        features: Array.isArray(currentContent.features) && currentContent.features.length > 0 ? currentContent.features : [],
        workshopTitle: currentContent.workshopTitle || 'Professional Workshop & Equipment',
        workshopDescription: currentContent.workshopDescription || 'Our state-of-the-art facility is equipped with the latest diagnostic tools, professional dynamometer, and specialized software for all major vehicle brands.',
        workshopFeatures: Array.isArray(currentContent.workshopFeatures) && currentContent.workshopFeatures.length > 0 ? currentContent.workshopFeatures : [],
        workshopImage: currentContent.workshopImage || '',
        translations: currentContent.translations || {
          'lv': {
            title: 'Kāpēc izvēlēties ChipTuning PRO?',
            description: 'Vairāk nekā 15 gadu pieredze profesionālā automobiļu tuninga jomā ar tūkstošiem apmierinātu klientu visā pasaulē',
            workshopTitle: 'Profesionāla darbnīca un aprīkojums',
            workshopDescription: 'Mūsu mūsdienīgais uzņēmums ir aprīkots ar jaunākajiem diagnostikas rīkiem, profesionālu dinamometru un specializētu programmatūru visiem galvenajiem automobiļu zīmoliem.'
          }
        }
      });
    } else {
      // Set default content if no current content exists
      setFormData({
        title: 'Why Choose ChipTuning PRO?',
        description: 'Over 15 years of experience in professional automotive tuning with thousands of satisfied customers worldwide',
        features: [
          { icon: 'fa-award', title: '15+ Years Experience', description: 'Proven expertise in automotive tuning' },
          { icon: 'fa-tachometer-alt', title: 'Professional Equipment', description: 'State-of-the-art diagnostic tools' },
          { icon: 'fa-user-cog', title: 'Certified Technicians', description: 'Highly trained professionals' },
          { icon: 'fa-shield-alt', title: 'Warranty Coverage', description: 'Full guarantee on all work' }
        ],
        workshopTitle: 'Professional Workshop & Equipment',
        workshopDescription: 'Our state-of-the-art facility is equipped with the latest diagnostic tools, professional dynamometer, and specialized software for all major vehicle brands.',
        workshopFeatures: [
          'Professional dynamometer testing',
          'Latest diagnostic equipment',
          'Specialized tuning software',
          'Climate-controlled workshop',
          'Certified technicians'
        ],
        workshopImage: '',
        translations: {
          'lv': {
            title: 'Kāpēc izvēlēties ChipTuning PRO?',
            description: 'Vairāk nekā 15 gadu pieredze profesionālā automobiļu tuninga jomā ar tūkstošiem apmierinātu klientu visā pasaulē',
            workshopTitle: 'Profesionāla darbnīca un aprīkojums',
            workshopDescription: 'Mūsu mūsdienīgais uzņēmums ir aprīkots ar jaunākajiem diagnostikas rīkiem, profesionālu dinamometru un specializētu programmatūru visiem galvenajiem automobiļu zīmoliem.'
          }
        }
      });
    }
  }, [currentContent]);

  // Save content mutation
  const saveMutation = useMutation({
    mutationFn: async (data: WhyChooseUsFormData) => {
      const response = await fetch('/api/admin/why-choose-us', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(window as any).authToken}`
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to save content');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Why Choose Us content updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/why-choose-us'] });
      queryClient.invalidateQueries({ queryKey: ['/api/why-choose-us'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
      console.error('Save error:', error);
    },
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const addFeature = () => {
    if (newFeature.icon && newFeature.title && newFeature.description) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, { ...newFeature }]
      }));
      setNewFeature({ icon: '', title: '', description: '' });
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addWorkshopFeature = () => {
    if (newWorkshopFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        workshopFeatures: [...prev.workshopFeatures, newWorkshopFeature.trim()]
      }));
      setNewWorkshopFeature('');
    }
  };

  const removeWorkshopFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workshopFeatures: prev.workshopFeatures.filter((_, i) => i !== index)
    }));
  };

  // Get current translation data
  const getCurrentTranslation = () => {
    return formData.translations?.[selectedLanguage] || {};
  };

  // Update translation data
  const updateTranslation = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [selectedLanguage]: {
          ...prev.translations?.[selectedLanguage],
          [field]: value
        }
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading Why Choose Us content...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Why Choose Us Management</h1>
          <p className="text-muted-foreground">
            Manage the "Why Choose ChipTuning PRO" section content and features
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSave} 
            disabled={saveMutation.isPending}
            className="bg-accent-600 hover:bg-accent-700 text-white font-semibold px-6"
            size="lg"
          >
            <Save className="w-5 h-5 mr-2" />
            {saveMutation.isPending ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="content">Main Content</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="translations">Translations</TabsTrigger>
          </TabsList>
          <Button 
            onClick={handleSave} 
            disabled={saveMutation.isPending}
            variant="default"
            className="bg-accent-600 hover:bg-accent-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Main Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Main Section</CardTitle>
              <CardDescription>
                Edit the main title and description for the Why Choose Us section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Why Choose ChipTuning PRO?"
                />
              </div>
              <div>
                <Label htmlFor="description">Section Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Over 15 years of experience in professional automotive tuning..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workshop Section</CardTitle>
              <CardDescription>
                Edit the workshop information and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workshopTitle">Workshop Title</Label>
                <Input
                  id="workshopTitle"
                  value={formData.workshopTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, workshopTitle: e.target.value }))}
                  placeholder="Professional Workshop & Equipment"
                />
              </div>
              <div>
                <Label htmlFor="workshopDescription">Workshop Description</Label>
                <Textarea
                  id="workshopDescription"
                  value={formData.workshopDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, workshopDescription: e.target.value }))}
                  placeholder="Our state-of-the-art facility is equipped..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="workshopImage">Workshop Image URL</Label>
                <Input
                  id="workshopImage"
                  value={formData.workshopImage || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, workshopImage: e.target.value }))}
                  placeholder="https://example.com/workshop-image.jpg"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Leave empty to use the default workshop image
                </p>
              </div>

              <div>
                <Label>Workshop Features</Label>
                <div className="space-y-2 mt-2">
                  {formData.workshopFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex-1">
                        {feature}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWorkshopFeature(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Input
                    value={newWorkshopFeature}
                    onChange={(e) => setNewWorkshopFeature(e.target.value)}
                    placeholder="Add workshop feature..."
                    onKeyDown={(e) => e.key === 'Enter' && addWorkshopFeature()}
                  />
                  <Button onClick={addWorkshopFeature} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Main Features</CardTitle>
              <CardDescription>
                Add and manage the key features that highlight your advantages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <i className={`fas ${feature.icon} text-accent-500`}></i>
                      <h4 className="font-semibold">{feature.title}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Add New Feature</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="newIcon">Icon (Font Awesome class)</Label>
                    <Input
                      id="newIcon"
                      value={newFeature.icon}
                      onChange={(e) => setNewFeature(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="fa-calendar-alt"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Example: fa-award, fa-tachometer-alt, fa-user-cog
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="newTitle">Feature Title</Label>
                    <Input
                      id="newTitle"
                      value={newFeature.title}
                      onChange={(e) => setNewFeature(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="15+ Years Experience"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newDescription">Feature Description</Label>
                    <Input
                      id="newDescription"
                      value={newFeature.description}
                      onChange={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Proven expertise in automotive..."
                    />
                  </div>
                </div>
                <Button onClick={addFeature} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Translations Tab */}
        <TabsContent value="translations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Translation Management</CardTitle>
              <CardDescription>
                Translate content for different languages. Leave fields empty to use default content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Language</Label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background text-foreground"
                >
                  <option value="en">English (en)</option>
                  <option value="lv">Latvian (lv)</option>
                  <option value="ru">Russian (ru)</option>
                  <option value="de">German (de)</option>
                  <option value="fr">French (fr)</option>
                  <option value="es">Spanish (es)</option>
                </select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label>Title Translation</Label>
                  <Input
                    value={getCurrentTranslation().title || ''}
                    onChange={(e) => updateTranslation('title', e.target.value)}
                    placeholder={`Translation for: ${formData.title}`}
                  />
                </div>

                <div>
                  <Label>Description Translation</Label>
                  <Textarea
                    value={getCurrentTranslation().description || ''}
                    onChange={(e) => updateTranslation('description', e.target.value)}
                    placeholder={`Translation for: ${formData.description}`}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Workshop Title Translation</Label>
                  <Input
                    value={getCurrentTranslation().workshopTitle || ''}
                    onChange={(e) => updateTranslation('workshopTitle', e.target.value)}
                    placeholder={`Translation for: ${formData.workshopTitle}`}
                  />
                </div>

                <div>
                  <Label>Workshop Description Translation</Label>
                  <Textarea
                    value={getCurrentTranslation().workshopDescription || ''}
                    onChange={(e) => updateTranslation('workshopDescription', e.target.value)}
                    placeholder={`Translation for: ${formData.workshopDescription}`}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Workshop Features Translation</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Translate each workshop feature (one per line):
                  </p>
                  <Textarea
                    value={getCurrentTranslation().workshopFeatures?.join('\n') || ''}
                    onChange={(e) => updateTranslation('workshopFeatures', e.target.value.split('\n').filter(line => line.trim()))}
                    placeholder={formData.workshopFeatures.join('\n')}
                    rows={formData.workshopFeatures.length + 1}
                  />
                </div>

                <div>
                  <Label>Features Translation</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Translate the main features. Each feature needs icon, title, and description.
                  </p>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <i className={`fas ${feature.icon} text-accent-500`}></i>
                        <span className="font-medium">Feature {index + 1}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Title Translation</Label>
                          <Input
                            value={getCurrentTranslation().features?.[index]?.title || ''}
                            onChange={(e) => {
                              const currentFeatures = getCurrentTranslation().features || [];
                              const updatedFeatures = [...currentFeatures];
                              updatedFeatures[index] = {
                                ...updatedFeatures[index],
                                icon: feature.icon,
                                title: e.target.value,
                                description: updatedFeatures[index]?.description || ''
                              };
                              updateTranslation('features', updatedFeatures);
                            }}
                            placeholder={`Original: ${feature.title}`}
                          />
                        </div>
                        <div>
                          <Label>Description Translation</Label>
                          <Input
                            value={getCurrentTranslation().features?.[index]?.description || ''}
                            onChange={(e) => {
                              const currentFeatures = getCurrentTranslation().features || [];
                              const updatedFeatures = [...currentFeatures];
                              updatedFeatures[index] = {
                                ...updatedFeatures[index],
                                icon: feature.icon,
                                title: updatedFeatures[index]?.title || '',
                                description: e.target.value
                              };
                              updateTranslation('features', updatedFeatures);
                            }}
                            placeholder={`Original: ${feature.description}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}