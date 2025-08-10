import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ObjectUploader } from "@/components/ObjectUploader";
import { toast } from "@/hooks/use-toast";
import { Pen, Trash2, Plus, Upload } from "lucide-react";
import type { ServiceItem, InsertServiceItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface ServiceFormData {
  title: string;
  description: string;
  icon: string;
  image?: string;
  features: string[];
  price: string;
  order: number;
  translations?: {
    [languageCode: string]: {
      title: string;
      description: string;
    };
  };
}

const defaultLanguages = [
  { code: 'en', name: 'English' },
  { code: 'lv', name: 'Latvian' },
  { code: 'ru', name: 'Russian' }
];

export function ServicesManagement() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    icon: "fas fa-cog",
    features: [""],
    price: "",
    order: 1,
    translations: {} as { [languageCode: string]: { title: string; description: string; } }
  });

  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["/api/admin/services"],
    queryFn: async () => {
      const authFetch = (window as any).authFetch || fetch;
      const response = await authFetch("/api/admin/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const { data: languages = defaultLanguages } = useQuery({
    queryKey: ["/api/admin/languages"],
    queryFn: async () => {
      const authFetch = (window as any).authFetch || fetch;
      const response = await authFetch("/api/admin/languages");
      if (!response.ok) return defaultLanguages;
      return response.json();
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: async (data: InsertServiceItem) => {
      const authFetch = (window as any).authFetch || fetch;
      const response = await authFetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      setIsFormOpen(false);
      resetForm();
      toast({ title: "Service created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create service", variant: "destructive" });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertServiceItem> }) => {
      const authFetch = (window as any).authFetch || fetch;
      const response = await authFetch(`/api/admin/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      setIsFormOpen(false);
      resetForm();
      toast({ title: "Service updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update service", variant: "destructive" });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const authFetch = (window as any).authFetch || fetch;
      const response = await authFetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      toast({ title: "Service deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete service", variant: "destructive" });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async ({ id, imageURL }: { id: string; imageURL: string }) => {
      const authFetch = (window as any).authFetch || fetch;
      const response = await authFetch(`/api/admin/services/${id}/image`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageURL }),
      });
      if (!response.ok) throw new Error("Failed to update service image");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      toast({ title: "Service image updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update service image", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "fas fa-cog",
      features: [""],
      price: "",
      order: services.length + 1,
      translations: {} as { [languageCode: string]: { title: string; description: string; } }
    });
    setSelectedService(null);
  };

  const openEditForm = (service: ServiceItem) => {
    setSelectedService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      image: service.image || "",
      features: Array.isArray(service.features) ? service.features : [""],
      price: service.price,
      order: service.order,
      translations: (service.translations as { [languageCode: string]: { title: string; description: string; } }) || ({} as { [languageCode: string]: { title: string; description: string; } })
    });
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    const serviceData: InsertServiceItem = {
      title: formData.title,
      description: formData.description,
      icon: formData.icon,
      image: formData.image,
      features: formData.features.filter(f => f.trim() !== ""),
      price: formData.price,
      order: formData.order,
      translations: formData.translations,
      isActive: true
    };

    if (selectedService) {
      updateServiceMutation.mutate({ id: selectedService.id, data: serviceData });
    } else {
      createServiceMutation.mutate(serviceData);
    }
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
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

  const updateTranslation = (languageCode: string, field: 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [languageCode]: {
          title: prev.translations?.[languageCode]?.title || "",
          description: prev.translations?.[languageCode]?.description || "",
          [field]: value
        }
      }
    }));
  };

  const handleGetUploadParameters = async () => {
    const response = await fetch("/api/objects/upload", { method: "POST" });
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleImageUploadComplete = (result: any, serviceId: string) => {
    if (result.successful && result.successful[0]) {
      const uploadURL = result.successful[0].uploadURL;
      uploadImageMutation.mutate({ id: serviceId, imageURL: uploadURL });
    }
  };

  if (isLoading) {
    return <div>Loading services...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services Management</h2>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service: ServiceItem) => (
          <Card key={service.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <i className={`${service.icon} text-accent-500 text-xl`}></i>
                  <div>
                    <CardTitle className="text-white text-lg">{service.title}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      Order: {service.order}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditForm(service)}
                  >
                    <Pen className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteServiceMutation.mutate(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-4">{service.description}</p>
              
              {service.image && (
                <div className="mb-4">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-gray-300">Features:</Label>
                <ul className="text-sm text-gray-400 space-y-1">
                  {Array.isArray(service.features) && service.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <span className="text-accent-500 font-semibold">{service.price}</span>
                <ObjectUploader
                  maxNumberOfFiles={1}
                  maxFileSize={5242880} // 5MB
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={(result) => handleImageUploadComplete(result, service.id)}
                  buttonClassName="text-xs"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Update Image
                </ObjectUploader>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedService ? "Edit Service" : "Create New Service"}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="translations">Translations</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="price" className="text-gray-300">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="From €250"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon" className="text-gray-300">Icon (FontAwesome class)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="fas fa-cog"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="order" className="text-gray-300">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image" className="text-gray-300">Image URL (Optional)</Label>
                <Input
                  id="image"
                  value={formData.image || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg or /objects/path/to/image.jpg"
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">You can paste a direct image URL here or upload using the button below</p>
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-gray-300">Features</Label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Feature description"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        disabled={formData.features.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addFeature}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="translations" className="space-y-4">
              {languages.map((language: any) => (
                <Card key={language.code} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">{language.name} ({language.code})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-gray-300">Title</Label>
                      <Input
                        value={formData.translations?.[language.code]?.title || ""}
                        onChange={(e) => updateTranslation(language.code, 'title', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder={`Enter title in ${language.name}`}
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Description</Label>
                      <Textarea
                        value={formData.translations?.[language.code]?.description || ""}
                        onChange={(e) => updateTranslation(language.code, 'description', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder={`Enter description in ${language.name}`}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-6">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
              className="bg-accent-500 hover:bg-accent-600 text-white"
            >
              {createServiceMutation.isPending || updateServiceMutation.isPending 
                ? "Saving..." 
                : selectedService ? "Save Changes" : "Create Service"
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}