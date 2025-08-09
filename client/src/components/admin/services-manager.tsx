import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Save, Trash2, DollarSign } from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  category: string;
  order: number;
  isActive: boolean;
}

interface ServicesManagerProps {
  token: string;
}

export default function ServicesManager({ token }: ServicesManagerProps) {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setServices(data.sort((a: ServiceItem, b: ServiceItem) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (service: ServiceItem) => {
    setIsSaving(true);
    try {
      const url = service.id ? `/api/admin/services/${service.id}` : '/api/admin/services';
      const method = service.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(service),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Service saved successfully",
        });
        await fetchServices();
        setEditingService(null);
      } else {
        throw new Error('Failed to save service');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Service deleted successfully",
        });
        await fetchServices();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const handleNewService = () => {
    const maxOrder = services.length > 0 ? Math.max(...services.map(s => s.order)) : 0;
    setEditingService({
      id: '',
      name: '',
      description: '',
      price: '',
      features: [],
      category: 'chiptuning',
      order: maxOrder + 1,
      isActive: true,
    });
  };

  const updateFeatures = (features: string) => {
    if (!editingService) return;
    const featuresArray = features.split('\n').filter(f => f.trim());
    setEditingService({ ...editingService, features: featuresArray });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
      <div className="text-gray-400">Loading services...</div>
    </div>;
  }

  if (editingService) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-100">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </CardTitle>
              <p className="text-gray-400 text-sm mt-1">
                {editingService.id ? 'Update the details of this service' : 'Create a new service that customers will see on your website'}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-900/20 border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-info-circle text-blue-400"></i>
              <span className="font-medium text-blue-300">Service Tips</span>
            </div>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• Use clear names customers understand (avoid technical jargon)</p>
              <p>• Include competitive pricing - this shows on your website</p>
              <p>• List benefits that matter to customers (power gains, fuel savings)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Service Name *
              </label>
              <Input
                value={editingService.name}
                onChange={(e) => setEditingService({
                  ...editingService,
                  name: e.target.value
                })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Stage 1 Chiptuning, DPF Removal, etc."
              />
              <p className="text-xs text-gray-500 mt-1">This appears as the main title on your website</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price *
              </label>
              <Input
                value={editingService.price}
                onChange={(e) => setEditingService({
                  ...editingService,
                  price: e.target.value
                })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="From €299, Contact for price, etc."
              />
              <p className="text-xs text-gray-500 mt-1">Shown on service cards - be competitive but fair</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={editingService.category}
              onChange={(e) => setEditingService({
                ...editingService,
                category: e.target.value
              })}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
            >
              <option value="chiptuning">Chiptuning</option>
              <option value="removal">DPF/EGR Removal</option>
              <option value="device">ZBOX Device</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <Textarea
              value={editingService.description}
              onChange={(e) => setEditingService({
                ...editingService,
                description: e.target.value
              })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Service description"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Features (one per line)
            </label>
            <Textarea
              value={editingService.features.join('\n')}
              onChange={(e) => updateFeatures(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              rows={6}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Order
              </label>
              <Input
                type="number"
                value={editingService.order}
                onChange={(e) => setEditingService({
                  ...editingService,
                  order: parseInt(e.target.value) || 0
                })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-7">
              <input
                type="checkbox"
                id="serviceActive"
                checked={editingService.isActive}
                onChange={(e) => setEditingService({
                  ...editingService,
                  isActive: e.target.checked
                })}
                className="rounded"
              />
              <label htmlFor="serviceActive" className="text-sm text-gray-300">
                Active (visible on website)
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleSave(editingService)}
              disabled={isSaving}
              className="bg-accent-500 hover:bg-accent-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Service'}
            </Button>
            <Button
              onClick={() => setEditingService(null)}
              variant="outline"
              className="border-gray-600"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-100">Services Management</h2>
        <Button onClick={handleNewService} className="bg-accent-500 hover:bg-accent-600">
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
        </Button>
      </div>

      <div className="grid gap-4">
        {services.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-8">
              <p className="text-gray-400">No services found. Add your first service!</p>
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-100">
                        {service.name}
                      </h3>
                      {service.price && (
                        <span className="bg-accent-500 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {service.price}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      {service.description}
                    </p>
                    {service.features.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {service.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-sm text-xs">
                              {feature}
                            </span>
                          ))}
                          {service.features.length > 3 && (
                            <span className="text-xs text-gray-500">+{service.features.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Category: {service.category}</span>
                      <span>Order: {service.order}</span>
                      <span className={service.isActive ? 'text-green-400' : 'text-red-400'}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditingService(service)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(service.id)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}