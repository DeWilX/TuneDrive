import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save } from "lucide-react";

interface ZboxFormData {
  title: string;
  description: string;
  features: string[];
  price: string;
  priceNote: string;
  buttonText: string;
  image?: string;
  translations?: {
    [languageCode: string]: {
      title?: string;
      description?: string;
      features?: string[];
      price?: string;
      priceNote?: string;
      buttonText?: string;
    };
  };
}

const languages = [
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' }
];

export default function ZboxManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ZboxFormData>({
    title: "",
    description: "",
    features: [""],
    price: "",
    priceNote: "",
    buttonText: "Learn More About ZBOX",
    translations: {}
  });

  // Fetch current ZBOX content
  const { data: zboxData, isLoading } = useQuery<any>({
    queryKey: ['/api/admin/zbox'],
  });

  useEffect(() => {
    if (zboxData) {
      setFormData({
        title: zboxData.title || "",
        description: zboxData.description || "",
        features: Array.isArray(zboxData.features) ? zboxData.features : [""],
        price: zboxData.price || "",
        priceNote: zboxData.priceNote || "",
        buttonText: zboxData.buttonText || "Learn More About ZBOX",
        image: zboxData.image || "",
        translations: zboxData.translations || {}
      });
    } else {
      // Set default content if no data exists
      setFormData({
        title: 'Introducing <span class="text-accent-500">ZBOX</span> Chiptuning Device',
        description: 'Revolutionary plug-and-play chiptuning solution with smartphone app control. Easy installation, multiple power maps, and real-time adjustment capabilities.',
        features: [
          "Plug-and-play installation in 5 minutes",
          "Multiple power maps via smartphone app", 
          "Real-time performance monitoring",
          "Reversible - no permanent changes"
        ],
        price: 'From €599',
        priceNote: 'Including installation',
        buttonText: 'Learn More About ZBOX',
        translations: {}
      });
    }
  }, [zboxData]);

  const updateZboxMutation = useMutation({
    mutationFn: async (data: ZboxFormData) => {
      return apiRequest('/api/admin/zbox', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "ZBOX content updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/zbox'] });
      queryClient.invalidateQueries({ queryKey: ['/api/zbox'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update ZBOX content",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof ZboxFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? value : feature
      )
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  const updateTranslation = (languageCode: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [languageCode]: {
          ...prev.translations?.[languageCode],
          [field]: value
        }
      }
    }));
  };

  const updateTranslationFeature = (languageCode: string, featureIndex: number, value: string) => {
    setFormData(prev => {
      const currentTranslation = prev.translations?.[languageCode] || {
        title: "",
        description: "",
        features: [],
        price: "",
        priceNote: "",
        buttonText: ""
      };
      const newFeatures = [...(currentTranslation.features || [])];
      
      // Ensure the array is long enough
      while (newFeatures.length <= featureIndex) {
        newFeatures.push("");
      }
      newFeatures[featureIndex] = value;
      
      return {
        ...prev,
        translations: {
          ...prev.translations,
          [languageCode]: {
            ...currentTranslation,
            features: newFeatures
          }
        }
      };
    });
  };

  const addTranslationFeature = (languageCode: string) => {
    setFormData(prev => {
      const currentTranslation = prev.translations?.[languageCode] || {
        title: "",
        description: "",
        features: [],
        price: "",
        priceNote: "",
        buttonText: ""
      };
      
      // Ensure translation features array has same length as main features
      const newFeatures = [...(currentTranslation.features || [])];
      while (newFeatures.length < prev.features.length) {
        newFeatures.push("");
      }
      newFeatures.push("");
      
      return {
        ...prev,
        translations: {
          ...prev.translations,
          [languageCode]: {
            ...currentTranslation,
            features: newFeatures
          }
        }
      };
    });
  };

  const removeTranslationFeature = (languageCode: string, featureIndex: number) => {
    setFormData(prev => {
      const currentTranslation = prev.translations?.[languageCode];
      if (!currentTranslation?.features || currentTranslation.features.length <= 1) return prev;
      
      return {
        ...prev,
        translations: {
          ...prev.translations,
          [languageCode]: {
            ...currentTranslation,
            features: currentTranslation.features.filter((_, i) => i !== featureIndex)
          }
        }
      };
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const cleanedFeatures = formData.features.filter(feature => feature.trim() !== "");
    if (cleanedFeatures.length === 0) {
      toast({
        title: "Error", 
        description: "Please add at least one feature",
        variant: "destructive",
      });
      return;
    }

    updateZboxMutation.mutate({
      ...formData,
      features: cleanedFeatures
    });
  };

  if (isLoading) {
    return <div className="text-white">Loading ZBOX content...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">ZBOX Content Management</h1>
        <Button 
          onClick={handleSubmit} 
          disabled={updateZboxMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {updateZboxMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="bg-gray-700">
          <TabsTrigger value="content" className="text-white data-[state=active]:bg-gray-600">Content</TabsTrigger>
          <TabsTrigger value="translations" className="text-white data-[state=active]:bg-gray-600">Translations</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Title (HTML allowed)</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter ZBOX section title"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter ZBOX description"
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Price</Label>
                  <Input
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="From €599"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Price Note (optional)</Label>
                  <Input
                    value={formData.priceNote}
                    onChange={(e) => handleInputChange('priceNote', e.target.value)}
                    placeholder="Including installation"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Button Text</Label>
                <Input
                  value={formData.buttonText}
                  onChange={(e) => handleInputChange('buttonText', e.target.value)}
                  placeholder="Learn More About ZBOX"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Features
                <Button type="button" onClick={addFeature} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    disabled={formData.features.length === 1}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="translations" className="space-y-6">
          {languages.map((language) => (
            <Card key={language.code} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">{language.name} ({language.code})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Title</Label>
                  <Input
                    value={formData.translations?.[language.code]?.title || ""}
                    onChange={(e) => updateTranslation(language.code, 'title', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder={formData.title || `Enter title in ${language.name}`}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Description</Label>
                  <Textarea
                    value={formData.translations?.[language.code]?.description || ""}
                    onChange={(e) => updateTranslation(language.code, 'description', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder={formData.description || `Enter description in ${language.name}`}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Price</Label>
                    <Input
                      value={formData.translations?.[language.code]?.price || ""}
                      onChange={(e) => updateTranslation(language.code, 'price', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder={formData.price || `Enter price in ${language.name}`}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Price Note</Label>
                    <Input
                      value={formData.translations?.[language.code]?.priceNote || ""}
                      onChange={(e) => updateTranslation(language.code, 'priceNote', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder={formData.priceNote || `Enter price note in ${language.name}`}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Button Text</Label>
                  <Input
                    value={formData.translations?.[language.code]?.buttonText || ""}
                    onChange={(e) => updateTranslation(language.code, 'buttonText', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder={formData.buttonText || `Enter button text in ${language.name}`}
                  />
                </div>
                <div>
                  <Label className="text-gray-300 flex items-center justify-between">
                    Features
                    <Button 
                      type="button" 
                      onClick={() => addTranslationFeature(language.code)} 
                      size="sm" 
                      variant="outline"
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </Label>
                  <div className="space-y-2">
                    {Math.max((formData.translations?.[language.code]?.features || []).length, formData.features.length) > 0 && 
                     Array.from({ length: Math.max((formData.translations?.[language.code]?.features || []).length, formData.features.length) }, (_, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={(formData.translations?.[language.code]?.features || [])[index] || ""}
                          onChange={(e) => updateTranslationFeature(language.code, index, e.target.value)}
                          placeholder={formData.features[index] || `Feature ${index + 1} in ${language.name}`}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTranslationFeature(language.code, index)}
                          disabled={Math.max((formData.translations?.[language.code]?.features || []).length, formData.features.length) === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}