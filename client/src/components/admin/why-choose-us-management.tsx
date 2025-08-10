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
        description: "Changes saved automatically!",
      });
      // Force immediate refresh of all related queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/why-choose-us'] });
      queryClient.invalidateQueries({ queryKey: ['/api/why-choose-us'] });
      queryClient.refetchQueries({ queryKey: ['/api/why-choose-us'] });
      
      // Also invalidate any cached data to force fresh fetch
      queryClient.removeQueries({ queryKey: ['/api/why-choose-us'] });
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
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { icon: 'fa-star', title: 'New Feature', description: 'Enter description here' }]
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addWorkshopFeature = () => {
    setFormData(prev => ({
      ...prev,
      workshopFeatures: [...prev.workshopFeatures, 'New workshop feature']
    }));
  };

  const removeWorkshopFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workshopFeatures: prev.workshopFeatures.filter((_, i) => i !== index)
    }));
  };

  // Helper functions for direct editing with auto-save
  const updateFeature = (index: number, field: 'icon' | 'title' | 'description', value: string) => {
    const newFormData = {
      ...formData,
      features: formData.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    };
    setFormData(newFormData);
    
    // Auto-save after a short delay
    setTimeout(() => {
      saveMutation.mutate(newFormData);
    }, 500);
  };

  const updateWorkshopFeature = (index: number, value: string) => {
    const newFormData = {
      ...formData,
      workshopFeatures: formData.workshopFeatures.map((feature, i) => 
        i === index ? value : feature
      )
    };
    setFormData(newFormData);
    
    // Auto-save after a short delay
    setTimeout(() => {
      saveMutation.mutate(newFormData);
    }, 500);
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
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="content">Main Content</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="translations">Translations</TabsTrigger>
        </TabsList>

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
                    <div key={index} className="flex items-center gap-2 p-3 border-2 rounded-lg bg-background border-border">
                      <Input
                        value={feature}
                        onChange={(e) => updateWorkshopFeature(index, e.target.value)}
                        className="flex-1 bg-background text-foreground border-border"
                        placeholder="Workshop feature"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeWorkshopFeature(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={addWorkshopFeature} 
                  className="w-full border-2 border-dashed border-accent-400 bg-accent-50 dark:bg-accent-900/20 hover:bg-accent-100 dark:hover:bg-accent-800/30 text-accent-700 dark:text-accent-300 font-medium py-3 mt-3"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Workshop Feature
                </Button>
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
                Click directly on any field to edit - simple and fast
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="p-4 border-2 rounded-lg space-y-3 bg-background border-border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <i className={`fas ${feature.icon} text-accent-500 text-xl`}></i>
                          <select
                            value={feature.icon}
                            onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                            className="p-2 border rounded text-sm bg-background text-foreground border-border"
                          >
                            <option value="fa-award">🏆 Award</option>
                            <option value="fa-calendar-alt">📅 Calendar</option>
                            <option value="fa-tachometer-alt">⚡ Speed</option>
                            <option value="fa-user-cog">👨‍🔧 Expert</option>
                            <option value="fa-shield-alt">🛡️ Shield</option>
                            <option value="fa-tools">🔧 Tools</option>
                            <option value="fa-chart-line">📈 Growth</option>
                            <option value="fa-heart">❤️ Heart</option>
                            <option value="fa-star">⭐ Star</option>
                            <option value="fa-thumbs-up">👍 Thumbs Up</option>
                            <option value="fa-check-circle">✅ Check</option>
                            <option value="fa-cog">⚙️ Settings</option>
                            <option value="fa-rocket">🚀 Rocket</option>
                            <option value="fa-lightbulb">💡 Idea</option>
                            <option value="fa-fire">🔥 Fire</option>
                            <option value="fa-wrench">🔧 Wrench</option>
                            <option value="fa-car">🚗 Car</option>
                            <option value="fa-industry">🏭 Industry</option>
                            <option value="fa-clock">⏰ Clock</option>
                            <option value="fa-medal">🏅 Medal</option>
                          </select>
                        </div>
                        <Input
                          value={feature.title}
                          onChange={(e) => updateFeature(index, 'title', e.target.value)}
                          className="font-medium flex-1 bg-background text-foreground border-border"
                          placeholder="Feature title"
                        />
                      </div>
                      <textarea
                        value={feature.description}
                        onChange={(e) => updateFeature(index, 'description', e.target.value)}
                        className="w-full p-3 border rounded-md bg-background text-foreground border-border resize-none"
                        rows={2}
                        placeholder="Feature description"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button 
                onClick={addFeature} 
                className="w-full border-2 border-dashed border-accent-400 bg-accent-50 dark:bg-accent-900/20 hover:bg-accent-100 dark:hover:bg-accent-800/30 text-accent-700 dark:text-accent-300 font-medium py-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Feature
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Translations Tab */}
        <TabsContent value="translations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Language Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🌍</span>
                  Choose Language
                </CardTitle>
                <CardDescription>
                  Select a language to add or edit translations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { code: 'en', name: 'English', flag: '🇺🇸' },
                    { code: 'lv', name: 'Latvian', flag: '🇱🇻' },
                    { code: 'ru', name: 'Russian', flag: '🇷🇺' }
                  ].map((lang) => (
                    <Button
                      key={lang.code}
                      variant={selectedLanguage === lang.code ? "default" : "outline"}
                      className={`p-4 h-auto flex flex-col gap-2 ${
                        selectedLanguage === lang.code 
                          ? 'bg-accent-500 text-white border-accent-500' 
                          : 'hover:bg-accent-50 hover:border-accent-300'
                      }`}
                      onClick={() => setSelectedLanguage(lang.code)}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Translation Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>📊</span>
                  Translation Progress
                </CardTitle>
                <CardDescription>
                  Track which languages have been translated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { code: 'en', name: 'English', flag: '🇺🇸' },
                    { code: 'lv', name: 'Latvian', flag: '🇱🇻' },
                    { code: 'ru', name: 'Russian', flag: '🇷🇺' }
                  ].map((lang) => {
                    const hasTranslation = formData.translations?.[lang.code]?.title || formData.translations?.[lang.code]?.description;
                    return (
                      <div key={lang.code} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {hasTranslation ? (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              Translated
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm flex items-center gap-1">
                              <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                              Not translated
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Translation Form */}
          {selectedLanguage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">
                    {selectedLanguage === 'en' ? '🇺🇸' : 
                     selectedLanguage === 'lv' ? '🇱🇻' : '🇷🇺'}
                  </span>
                  Translate to {selectedLanguage === 'en' ? 'English' : 
                              selectedLanguage === 'lv' ? 'Latvian' : 'Russian'}
                </CardTitle>
                <CardDescription>
                  Fill in the translations below. Leave blank to use the original content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title Translation */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Original Title</Label>
                    <div className="p-3 bg-gray-50 border rounded-md text-sm text-gray-700">
                      {formData.title}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`title-${selectedLanguage}`}>Translation</Label>
                    <Input
                      id={`title-${selectedLanguage}`}
                      value={formData.translations?.[selectedLanguage]?.title || ''}
                      onChange={(e) => updateTranslation('title', e.target.value)}
                      placeholder={`Title in ${selectedLanguage.toUpperCase()}`}
                      className="bg-background text-foreground border-border"
                    />
                  </div>
                </div>

                {/* Description Translation */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Original Description</Label>
                    <div className="p-3 bg-gray-50 border rounded-md text-sm text-gray-700 min-h-[80px]">
                      {formData.description}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`description-${selectedLanguage}`}>Translation</Label>
                    <Textarea
                      id={`description-${selectedLanguage}`}
                      value={formData.translations?.[selectedLanguage]?.description || ''}
                      onChange={(e) => updateTranslation('description', e.target.value)}
                      placeholder={`Description in ${selectedLanguage.toUpperCase()}`}
                      rows={3}
                      className="bg-background text-foreground border-border"
                    />
                  </div>
                </div>

                {/* Workshop Section Translation */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>🏭</span>
                    Workshop Section
                  </h3>
                  
                  {/* Workshop Title */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Original Workshop Title</Label>
                      <div className="p-3 bg-gray-50 border rounded-md text-sm text-gray-700">
                        {formData.workshopTitle}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`workshop-title-${selectedLanguage}`}>Translation</Label>
                      <Input
                        id={`workshop-title-${selectedLanguage}`}
                        value={formData.translations?.[selectedLanguage]?.workshopTitle || ''}
                        onChange={(e) => updateTranslation('workshopTitle', e.target.value)}
                        placeholder={`Workshop title in ${selectedLanguage.toUpperCase()}`}
                        className="bg-background text-foreground border-border"
                      />
                    </div>
                  </div>

                  {/* Workshop Description */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Original Workshop Description</Label>
                      <div className="p-3 bg-gray-50 border rounded-md text-sm text-gray-700 min-h-[80px]">
                        {formData.workshopDescription}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`workshop-description-${selectedLanguage}`}>Translation</Label>
                      <Textarea
                        id={`workshop-description-${selectedLanguage}`}
                        value={formData.translations?.[selectedLanguage]?.workshopDescription || ''}
                        onChange={(e) => updateTranslation('workshopDescription', e.target.value)}
                        placeholder={`Workshop description in ${selectedLanguage.toUpperCase()}`}
                        rows={3}
                        className="bg-background text-foreground border-border"
                      />
                    </div>
                  </div>

                  {/* Workshop Features */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Original Workshop Features</Label>
                      <div className="p-3 bg-gray-50 border rounded-md text-sm text-gray-700 min-h-[120px]">
                        <ul className="space-y-1">
                          {formData.workshopFeatures.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="text-green-600">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`workshop-features-${selectedLanguage}`}>Translation (one per line)</Label>
                      <Textarea
                        id={`workshop-features-${selectedLanguage}`}
                        value={formData.translations?.[selectedLanguage]?.workshopFeatures?.join('\n') || ''}
                        onChange={(e) => updateTranslation('workshopFeatures', e.target.value.split('\n').filter(line => line.trim()))}
                        placeholder={`Workshop features in ${selectedLanguage.toUpperCase()}, one per line`}
                        rows={5}
                        className="bg-background text-foreground border-border"
                      />
                    </div>
                  </div>
                </div>

                {/* Main Features Translation */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>⭐</span>
                    Main Features
                  </h3>
                  
                  <div className="space-y-6">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <i className={`fas ${feature.icon} text-accent-500 text-lg`}></i>
                          <span className="font-medium">Feature {index + 1}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Feature Title */}
                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Original Title</Label>
                              <div className="p-2 bg-gray-50 border rounded text-sm text-gray-700">
                                {feature.title}
                              </div>
                            </div>
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
                                placeholder={`Title in ${selectedLanguage.toUpperCase()}`}
                                className="bg-background text-foreground border-border"
                              />
                            </div>
                          </div>

                          {/* Feature Description */}
                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Original Description</Label>
                              <div className="p-2 bg-gray-50 border rounded text-sm text-gray-700 min-h-[40px]">
                                {feature.description}
                              </div>
                            </div>
                            <div>
                              <Label>Description Translation</Label>
                              <Textarea
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
                                placeholder={`Description in ${selectedLanguage.toUpperCase()}`}
                                rows={2}
                                className="bg-background text-foreground border-border"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    💡 Tip: Translations are automatically saved as you type
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        translations: {
                          ...prev.translations,
                          [selectedLanguage]: {
                            title: '',
                            description: '',
                            workshopTitle: '',
                            workshopDescription: '',
                            workshopFeatures: [],
                            features: []
                          }
                        }
                      }));
                    }}
                  >
                    Clear Translation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}