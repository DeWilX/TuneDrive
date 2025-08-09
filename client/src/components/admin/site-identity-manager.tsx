import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { SiteIdentity } from "@shared/schema";
import type { UploadResult } from "@uppy/core";

interface SiteIdentityManagerProps {
  token: string;
}

export default function SiteIdentityManager({ token }: SiteIdentityManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: siteIdentity, isLoading } = useQuery<SiteIdentity>({
    queryKey: ['/api/admin/site-identity'],
    queryFn: async () => {
      const response = await fetch('/api/admin/site-identity', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch site identity');
      }
      return response.json();
    },
  });

  const [formData, setFormData] = useState<Partial<SiteIdentity>>({
    companyName: '',
    tagline: '',
    heroTitle: '',
    heroSubtitle: '',
    logoUrl: '',
    faviconUrl: '',
    heroImageUrl: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    accentColor: '#f59e0b',
    backgroundColor: '#000000',
    textColor: '#ffffff',
  });

  // Update form data when site identity loads
  useEffect(() => {
    if (siteIdentity) {
      setFormData({
        companyName: siteIdentity.companyName || '',
        tagline: siteIdentity.tagline || '',
        heroTitle: siteIdentity.heroTitle || '',
        heroSubtitle: siteIdentity.heroSubtitle || '',
        logoUrl: siteIdentity.logoUrl || '',
        faviconUrl: siteIdentity.faviconUrl || '',
        heroImageUrl: siteIdentity.heroImageUrl || '',
        primaryColor: siteIdentity.primaryColor || '#3b82f6',
        secondaryColor: siteIdentity.secondaryColor || '#1e40af',
        accentColor: siteIdentity.accentColor || '#f59e0b',
        backgroundColor: siteIdentity.backgroundColor || '#000000',
        textColor: siteIdentity.textColor || '#ffffff',
      });
    }
  }, [siteIdentity]);

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<SiteIdentity>) => {
      const response = await apiRequest('POST', '/api/admin/site-identity', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/site-identity'] });
      toast({
        title: "Success",
        description: "Site identity updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update site identity",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleImageUpload = async (imageType: 'logo' | 'favicon' | 'heroImage') => {
    try {
      const response = await fetch('/api/objects/upload', { method: 'POST' });
      const data = await response.json();
      return {
        method: 'PUT' as const,
        url: data.uploadURL,
      };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get upload URL",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleImageComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>, imageType: 'logo' | 'favicon' | 'heroImage') => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const imageURL = uploadedFile.uploadURL;

      try {
        const response = await fetch('/api/site-images', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageURL, imageType }),
        });

        const data = await response.json();
        const fieldMap = {
          logo: 'logoUrl',
          favicon: 'faviconUrl',
          heroImage: 'heroImageUrl',
        };
        
        setFormData(prev => ({
          ...prev,
          [fieldMap[imageType]]: data.objectPath,
        }));

        toast({
          title: "Success",
          description: `${imageType} uploaded successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to process ${imageType} upload`,
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (field: keyof SiteIdentity, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-accent-500 mb-4"></i>
          <p className="text-gray-400">Loading site identity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Site Identity</h2>
          <p className="text-gray-400">Customize your website's branding and visual identity</p>
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="bg-accent-500 hover:bg-accent-600"
        >
          {updateMutation.isPending ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Saving...
            </>
          ) : (
            <>
              <i className="fas fa-save mr-2"></i>
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Brand Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName" className="text-gray-300">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName || ''}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="ChipTuning PRO"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="tagline" className="text-gray-300">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline || ''}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  placeholder="Professional ECU Tuning Services"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <i className="fas fa-palette text-accent-500"></i>
                  Color Palette
                </CardTitle>
                <p className="text-gray-400 text-sm">Define your brand colors - these will be applied throughout your website</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-gray-300">Primary Color (Buttons, Links)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="color"
                        value={formData.primaryColor || '#3b82f6'}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="w-16 h-10 p-1 bg-gray-700 border-gray-600"
                      />
                      <Input
                        type="text"
                        value={formData.primaryColor || '#3b82f6'}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Secondary Color (Secondary Buttons)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="color"
                        value={formData.secondaryColor || '#1e40af'}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        className="w-16 h-10 p-1 bg-gray-700 border-gray-600"
                      />
                      <Input
                        type="text"
                        value={formData.secondaryColor || '#1e40af'}
                        onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="#1e40af"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Accent Color (Highlights, Icons)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="color"
                        value={formData.accentColor || '#f59e0b'}
                        onChange={(e) => handleInputChange('accentColor', e.target.value)}
                        className="w-16 h-10 p-1 bg-gray-700 border-gray-600"
                      />
                      <Input
                        type="text"
                        value={formData.accentColor || '#f59e0b'}
                        onChange={(e) => handleInputChange('accentColor', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="#f59e0b"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Background Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="color"
                        value={formData.backgroundColor || '#000000'}
                        onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                        className="w-16 h-10 p-1 bg-gray-700 border-gray-600"
                      />
                      <Input
                        type="text"
                        value={formData.backgroundColor || '#000000'}
                        onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">Text Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="color"
                        value={formData.textColor || '#ffffff'}
                        onChange={(e) => handleInputChange('textColor', e.target.value)}
                        className="w-16 h-10 p-1 bg-gray-700 border-gray-600"
                      />
                      <Input
                        type="text"
                        value={formData.textColor || '#ffffff'}
                        onChange={(e) => handleInputChange('textColor', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Color Preview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <i className="fas fa-eye text-accent-500"></i>
                  Live Preview
                </CardTitle>
                <p className="text-gray-400 text-sm">See how your colors will look on your website</p>
              </CardHeader>
              <CardContent>
                <div 
                  className="p-6 rounded-lg space-y-4"
                  style={{ 
                    backgroundColor: formData.backgroundColor || '#000000',
                    color: formData.textColor || '#ffffff'
                  }}
                >
                  <h3 className="text-xl font-bold">
                    {formData.companyName || 'ChipTuning PRO'}
                  </h3>
                  <p className="text-sm opacity-80">
                    Your website will use these colors throughout
                  </p>
                  
                  <div className="flex gap-3 flex-wrap">
                    <button 
                      className="px-4 py-2 rounded-lg font-semibold text-white"
                      style={{ backgroundColor: formData.primaryColor || '#3b82f6' }}
                    >
                      Primary Button
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg font-semibold text-white"
                      style={{ backgroundColor: formData.secondaryColor || '#1e40af' }}
                    >
                      Secondary Button
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <i 
                      className="fas fa-star"
                      style={{ color: formData.accentColor || '#f59e0b' }}
                    ></i>
                    <span className="text-sm">
                      Accent color for icons and highlights
                    </span>
                  </div>

                  <div className="mt-4 p-3 rounded border" style={{ 
                    borderColor: formData.accentColor || '#f59e0b',
                    backgroundColor: `${formData.accentColor || '#f59e0b'}10`
                  }}>
                    <p className="text-sm">Sample content with accent border</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Hero Section Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heroTitle" className="text-gray-300">Hero Title</Label>
                <Input
                  id="heroTitle"
                  value={formData.heroTitle || ''}
                  onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                  placeholder="Professional ECU Tuning"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="heroSubtitle" className="text-gray-300">Hero Subtitle</Label>
                <Textarea
                  id="heroSubtitle"
                  value={formData.heroSubtitle || ''}
                  onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                  placeholder="Unlock your vehicle's true potential with our professional ECU tuning services..."
                  rows={3}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <i className="fas fa-image text-accent-500"></i>
                  Logo
                </CardTitle>
                <p className="text-gray-400 text-sm">Your main company logo (recommended: PNG format, transparent background)</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.logoUrl && (
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-300 mb-2">Current Logo:</p>
                    <img 
                      src={formData.logoUrl} 
                      alt="Current Logo" 
                      className="max-h-16 max-w-full object-contain bg-white/10 rounded p-2"
                    />
                  </div>
                )}
                <div className="flex gap-3">
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={5242880} // 5MB
                    onGetUploadParameters={() => handleImageUpload('logo')}
                    onComplete={(result) => handleImageComplete(result, 'logo')}
                    buttonClassName="bg-accent-500 hover:bg-accent-600"
                  >
                    <i className="fas fa-upload mr-2"></i>
                    Upload Logo
                  </ObjectUploader>
                  <Input
                    value={formData.logoUrl || ''}
                    onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                    placeholder="/objects/logo.png or URL"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Favicon Upload */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <i className="fas fa-star text-accent-500"></i>
                  Favicon
                </CardTitle>
                <p className="text-gray-400 text-sm">Small icon shown in browser tabs (recommended: 32x32 ICO or PNG)</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.faviconUrl && (
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-300 mb-2">Current Favicon:</p>
                    <img 
                      src={formData.faviconUrl} 
                      alt="Current Favicon" 
                      className="w-8 h-8 object-contain bg-white/10 rounded"
                    />
                  </div>
                )}
                <div className="flex gap-3">
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={1048576} // 1MB
                    onGetUploadParameters={() => handleImageUpload('favicon')}
                    onComplete={(result) => handleImageComplete(result, 'favicon')}
                    buttonClassName="bg-accent-500 hover:bg-accent-600"
                  >
                    <i className="fas fa-upload mr-2"></i>
                    Upload Favicon
                  </ObjectUploader>
                  <Input
                    value={formData.faviconUrl || ''}
                    onChange={(e) => handleInputChange('faviconUrl', e.target.value)}
                    placeholder="/objects/favicon.ico or URL"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Hero Image Upload */}
            <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <i className="fas fa-camera text-accent-500"></i>
                  Hero Background Image
                </CardTitle>
                <p className="text-gray-400 text-sm">Large background image for your homepage hero section (recommended: 1920x1080 JPG)</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.heroImageUrl && (
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-300 mb-2">Current Hero Image:</p>
                    <img 
                      src={formData.heroImageUrl} 
                      alt="Current Hero Image" 
                      className="max-h-48 max-w-full object-cover rounded bg-gray-600"
                    />
                  </div>
                )}
                <div className="flex gap-3">
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={10485760} // 10MB
                    onGetUploadParameters={() => handleImageUpload('heroImage')}
                    onComplete={(result) => handleImageComplete(result, 'heroImage')}
                    buttonClassName="bg-accent-500 hover:bg-accent-600"
                  >
                    <i className="fas fa-upload mr-2"></i>
                    Upload Hero Image
                  </ObjectUploader>
                  <Input
                    value={formData.heroImageUrl || ''}
                    onChange={(e) => handleInputChange('heroImageUrl', e.target.value)}
                    placeholder="/objects/hero-bg.jpg or URL"
                    className="bg-gray-700 border-gray-600 text-white flex-1"
                  />
                </div>
                
                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-info-circle text-blue-400"></i>
                    <span className="font-medium text-blue-300">Image Upload Tips</span>
                  </div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>• <strong>Logo:</strong> Transparent PNG, 200x80px or similar ratio</p>
                    <p>• <strong>Favicon:</strong> Square ICO or PNG, 32x32px or 16x16px</p>
                    <p>• <strong>Hero Image:</strong> High-quality JPG, 1920x1080px for best results</p>
                    <p>• Images are stored securely and optimized for web display</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}