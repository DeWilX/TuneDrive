import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calculator, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface PowerCalculatorData {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  features: string[];
  buttonText: string;
  backgroundImage?: string;
  isActive: boolean;
  updatedAt: string;
}

interface PowerCalculatorFormProps {
  data?: PowerCalculatorData;
  onSave: (data: Partial<PowerCalculatorData>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const PowerCalculatorForm: React.FC<PowerCalculatorFormProps> = ({ 
  data, 
  onSave, 
  onCancel, 
  isLoading 
}) => {
  const [formData, setFormData] = useState({
    title: data?.title || 'Vehicle Power Potential Checker',
    subtitle: data?.subtitle || 'Discover Your Vehicle\'s Hidden Performance',
    description: data?.description || 'Check the tuning potential of your vehicle with our comprehensive database.',
    features: data?.features?.join('\n') || 'Real-time power calculations\nExtensive vehicle database\nProfessional tuning recommendations',
    buttonText: data?.buttonText || 'Check Your Vehicle Power',
    backgroundImage: data?.backgroundImage || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      features: formData.features.split('\n').filter(f => f.trim())
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-gray-300">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
          className="bg-gray-700 border-gray-600 text-gray-100"
          placeholder="Vehicle Power Potential Checker"
        />
      </div>

      <div>
        <Label htmlFor="subtitle" className="text-gray-300">Subtitle</Label>
        <Input
          id="subtitle"
          value={formData.subtitle}
          onChange={(e) => setFormData(prev => ({...prev, subtitle: e.target.value}))}
          className="bg-gray-700 border-gray-600 text-gray-100"
          placeholder="Discover Your Vehicle's Hidden Performance"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-gray-300">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
          className="bg-gray-700 border-gray-600 text-gray-100"
          rows={3}
          placeholder="Check the tuning potential of your vehicle..."
        />
      </div>

      <div>
        <Label htmlFor="features" className="text-gray-300">Features (one per line)</Label>
        <Textarea
          id="features"
          value={formData.features}
          onChange={(e) => setFormData(prev => ({...prev, features: e.target.value}))}
          className="bg-gray-700 border-gray-600 text-gray-100"
          rows={4}
          placeholder="Real-time power calculations&#10;Extensive vehicle database&#10;Professional tuning recommendations"
        />
      </div>

      <div>
        <Label htmlFor="buttonText" className="text-gray-300">Button Text</Label>
        <Input
          id="buttonText"
          value={formData.buttonText}
          onChange={(e) => setFormData(prev => ({...prev, buttonText: e.target.value}))}
          className="bg-gray-700 border-gray-600 text-gray-100"
          placeholder="Check Your Vehicle Power"
        />
      </div>

      <div>
        <Label htmlFor="backgroundImage" className="text-gray-300">Background Image URL</Label>
        <Input
          id="backgroundImage"
          value={formData.backgroundImage}
          onChange={(e) => setFormData(prev => ({...prev, backgroundImage: e.target.value}))}
          className="bg-gray-700 border-gray-600 text-gray-100"
          placeholder="https://example.com/bg-image.jpg"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

const PowerCalculatorManager: React.FC = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState<PowerCalculatorData | null>(null);

  const { data: calculatorData = [], isLoading } = useQuery<PowerCalculatorData[]>({
    queryKey: ['/api/admin/power-calculator'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<PowerCalculatorData>) => {
      const response = await apiRequest('POST', '/api/admin/power-calculator', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/power-calculator'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Power calculator data created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to create power calculator data",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PowerCalculatorData) => {
      const response = await apiRequest('PUT', `/api/admin/power-calculator/${data.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/power-calculator'] });
      setEditingData(null);
      toast({
        title: "Success",
        description: "Power calculator data updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update power calculator data",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8">
          <div className="text-center text-gray-400">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100 flex items-center justify-between">
          <span className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Power Calculator Content Management
          </span>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-gray-100">Add Power Calculator Content</DialogTitle>
              </DialogHeader>
              <PowerCalculatorForm
                onSave={(data) => createMutation.mutate(data)}
                onCancel={() => setIsAddDialogOpen(false)}
                isLoading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {calculatorData.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No power calculator content found. Add some content to get started.
            </div>
          ) : (
            <div className="grid gap-4">
              {calculatorData.map((item: PowerCalculatorData) => (
                <div key={item.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-100 mb-2">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-gray-300 mb-2">{item.subtitle}</p>
                      )}
                      <p className="text-gray-400 mb-3">{item.description}</p>
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-gray-200 mb-1">Features:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-400">
                          {item.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-sm text-gray-400">
                        <strong>Button Text:</strong> {item.buttonText}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingData(item)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={!!editingData} onOpenChange={() => setEditingData(null)}>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-gray-100">Edit Power Calculator Content</DialogTitle>
              </DialogHeader>
              {editingData && (
                <PowerCalculatorForm
                  data={editingData}
                  onSave={(data) => updateMutation.mutate({ ...editingData, ...data })}
                  onCancel={() => setEditingData(null)}
                  isLoading={updateMutation.isPending}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default PowerCalculatorManager;