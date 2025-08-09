import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Edit, Plus, Car, Truck, Tractor, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Vehicle {
  id: string;
  vehicleType: 'car' | 'truck' | 'tractor';
  brand: string;
  model: string;
  generation: string;
  engine: string;
  variant: string;
  originalPower: number;
  originalTorque: number;
  stage1Power: number;
  stage1Torque: number;
  stage2Power: number;
  stage2Torque: number;
}

interface VehicleManagerProps {
  token: string;
}

const VehicleManager: React.FC<VehicleManagerProps> = ({ token }) => {
  const [selectedType, setSelectedType] = useState<'car' | 'truck' | 'tractor'>('car');
  const [selectedBrand, setSelectedBrand] = useState<string>('__all__');
  const [selectedModel, setSelectedModel] = useState<string>('__all__');
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    vehicleType: 'car',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create authenticated apiRequest function that includes the auth token
  const authenticatedApiRequest = useCallback(async (
    method: string,
    url: string,
    data?: any
  ) => {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status}: ${errorText}`);
    }

    return response;
  }, [token]);

  const vehicleTypes = [
    { id: 'car', name: 'Cars', icon: Car },
    { id: 'truck', name: 'Trucks', icon: Truck },
    { id: 'tractor', name: 'Tractors', icon: Tractor }
  ];

  // Fetch brands (use main database)
  const { data: brands = [], isLoading: brandsLoading } = useQuery<string[]>({
    queryKey: [`/api/vehicles/brands/${selectedType}`],
    enabled: !!selectedType,
  });

  // Fetch models (use main database)
  const { data: models = [], isLoading: modelsLoading } = useQuery<string[]>({
    queryKey: [`/api/vehicles/models/${selectedType}/${selectedBrand}`],
    enabled: !!selectedType && !!selectedBrand && selectedBrand !== '__all__',
  });

  // Fetch all vehicles for admin management from main database
  const { data: allVehicles = [], isLoading: vehiclesLoading } = useQuery<Vehicle[]>({
    queryKey: [`/api/admin/vehicles/${selectedType}`],
    queryFn: async () => {
      const response = await fetch(`/api/admin/vehicles/${selectedType}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${await response.text()}`);
      }
      return response.json();
    },
  });

  // Filter vehicles based on selected filters
  const filteredVehicles = useMemo(() => {
    return allVehicles.filter((vehicle: Vehicle) => {
      if (vehicle.vehicleType !== selectedType) return false;
      if (selectedBrand !== '__all__' && vehicle.brand !== selectedBrand) return false;
      if (selectedModel !== '__all__' && vehicle.model !== selectedModel) return false;
      return true;
    });
  }, [allVehicles, selectedType, selectedBrand, selectedModel]);

  // Add vehicle mutation
  const addVehicleMutation = useMutation({
    mutationFn: async (vehicleData: Partial<Vehicle>) => {
      return await authenticatedApiRequest('POST', '/api/admin/vehicles', vehicleData);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Vehicle added successfully',
      });
      setIsAddVehicleOpen(false);
      setNewVehicle({ vehicleType: 'car' });
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vehicles'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add vehicle',
        variant: 'destructive',
      });
    },
  });

  // Update vehicle mutation
  const updateVehicleMutation = useMutation({
    mutationFn: async (vehicleData: Vehicle) => {
      return await authenticatedApiRequest('PUT', `/api/admin/vehicles/${vehicleData.id}`, vehicleData);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Vehicle updated successfully',
      });
      setEditingVehicle(null);
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vehicles'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update vehicle',
        variant: 'destructive',
      });
    },
  });

  // Delete vehicle mutation
  const deleteVehicleMutation = useMutation({
    mutationFn: async (vehicleId: string) => {
      return await authenticatedApiRequest('DELETE', `/api/admin/vehicles/${vehicleId}`);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Vehicle deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete vehicle',
        variant: 'destructive',
      });
    },
  });

  // Memoized VehicleForm to prevent re-renders that cause focus loss
  const VehicleForm = useMemo(() => ({ 
    vehicle, 
    onChange, 
    title 
  }: { 
    vehicle: Partial<Vehicle>, 
    onChange: (vehicle: Partial<Vehicle>) => void, 
    title: string 
  }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
      
      <div className="grid grid-cols-5 gap-4">
        <div>
          <Label htmlFor="vehicleType" className="text-gray-300">Vehicle Type</Label>
          <Select value={vehicle.vehicleType} onValueChange={(value) => onChange({...vehicle, vehicleType: value as Vehicle['vehicleType']})}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
              <SelectItem value="tractor">Tractor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="brand" className="text-gray-300">Brand</Label>
          <Input
            id="brand"
            value={vehicle.brand || ''}
            onChange={(e) => onChange({...vehicle, brand: e.target.value})}
            className="bg-gray-700 border-gray-600 text-gray-100"
            placeholder="e.g., BMW, Mercedes"
          />
        </div>
        
        <div>
          <Label htmlFor="model" className="text-gray-300">Model</Label>
          <Input
            id="model"
            value={vehicle.model || ''}
            onChange={(e) => onChange({...vehicle, model: e.target.value})}
            className="bg-gray-700 border-gray-600 text-gray-100"
            placeholder="e.g., A3, 3 Series"
          />
        </div>

        <div>
          <Label htmlFor="generation" className="text-gray-300">Generation</Label>
          <Input
            id="generation"
            value={vehicle.generation || ''}
            onChange={(e) => onChange({...vehicle, generation: e.target.value})}
            className="bg-gray-700 border-gray-600 text-gray-100"
            placeholder="e.g., 8V (2012-2020)"
          />
        </div>

        <div>
          <Label htmlFor="engine" className="text-gray-300">Engine</Label>
          <Input
            id="engine"
            value={vehicle.engine || ''}
            onChange={(e) => onChange({...vehicle, engine: e.target.value})}
            className="bg-gray-700 border-gray-600 text-gray-100"
            placeholder="e.g., 2.0 TDI"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="variant" className="text-gray-300">Variant</Label>
          <Input
            id="variant"
            value={vehicle.variant || ''}
            onChange={(e) => onChange({...vehicle, variant: e.target.value})}
            className="bg-gray-700 border-gray-600 text-gray-100"
            placeholder="e.g., 150hp, 190hp"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-gray-200">Original Performance</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="originalPower" className="text-gray-300">Power (HP)</Label>
            <Input
              id="originalPower"
              type="number"
              value={vehicle.originalPower || ''}
              onChange={(e) => onChange({...vehicle, originalPower: parseInt(e.target.value) || 0})}
              className="bg-gray-700 border-gray-600 text-gray-100"
              placeholder="190"
            />
          </div>
          
          <div>
            <Label htmlFor="originalTorque" className="text-gray-300">Torque (Nm)</Label>
            <Input
              id="originalTorque"
              type="number"
              value={vehicle.originalTorque || ''}
              onChange={(e) => onChange({...vehicle, originalTorque: parseInt(e.target.value) || 0})}
              className="bg-gray-700 border-gray-600 text-gray-100"
              placeholder="400"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-gray-200">Stage 1 Performance</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stage1Power" className="text-gray-300">Power (HP)</Label>
            <Input
              id="stage1Power"
              type="number"
              value={vehicle.stage1Power || ''}
              onChange={(e) => onChange({...vehicle, stage1Power: parseInt(e.target.value) || 0})}
              className="bg-gray-700 border-gray-600 text-gray-100"
              placeholder="220"
            />
          </div>
          
          <div>
            <Label htmlFor="stage1Torque" className="text-gray-300">Torque (Nm)</Label>
            <Input
              id="stage1Torque"
              type="number"
              value={vehicle.stage1Torque || ''}
              onChange={(e) => onChange({...vehicle, stage1Torque: parseInt(e.target.value) || 0})}
              className="bg-gray-700 border-gray-600 text-gray-100"
              placeholder="450"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-gray-200">Stage 2 Performance</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stage2Power" className="text-gray-300">Power (HP)</Label>
            <Input
              id="stage2Power"
              type="number"
              value={vehicle.stage2Power || ''}
              onChange={(e) => onChange({...vehicle, stage2Power: parseInt(e.target.value) || 0})}
              className="bg-gray-700 border-gray-600 text-gray-100"
              placeholder="250"
            />
          </div>
          
          <div>
            <Label htmlFor="stage2Torque" className="text-gray-300">Torque (Nm)</Label>
            <Input
              id="stage2Torque"
              type="number"
              value={vehicle.stage2Torque || ''}
              onChange={(e) => onChange({...vehicle, stage2Torque: parseInt(e.target.value) || 0})}
              className="bg-gray-700 border-gray-600 text-gray-100"
              placeholder="500"
            />
          </div>
        </div>
      </div>
    </div>
  ), []);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100 flex items-center justify-between">
          <span className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Vehicle Database Management
          </span>
          <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-gray-100">Add Vehicle</DialogTitle>
              </DialogHeader>
              <VehicleForm
                vehicle={newVehicle}
                onChange={setNewVehicle}
                title=""
              />
              <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddVehicleOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => addVehicleMutation.mutate(newVehicle)}
                  disabled={addVehicleMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {addVehicleMutation.isPending ? 'Adding...' : 'Add Vehicle'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Vehicle Type Tabs */}
          <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as Vehicle['vehicleType'])}>
            <TabsList className="bg-gray-700 border-gray-600">
              {vehicleTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <TabsTrigger 
                    key={type.id}
                    value={type.id}
                    className="data-[state=active]:bg-accent-500"
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {type.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {/* Vehicle Browser */}
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Brand</Label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="__all__">All Brands</SelectItem>
                      {brands.map((brand: string) => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-gray-300">Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel} disabled={selectedBrand === '__all__'}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="__all__">All Models</SelectItem>
                      {models.map((model: string) => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-gray-300">Actions</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBrand('__all__');
                        setSelectedModel('__all__');
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Vehicle Variants Display */}
              {filteredVehicles.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-100">Available Variants</h3>
                  <div className="grid gap-2">
                    {filteredVehicles.map((variant: any) => (
                      <div key={variant.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-gray-100 font-semibold">
                              {selectedBrand} {selectedModel} {variant.variant}
                            </h4>
                            <div className="flex space-x-4 text-sm text-gray-400 mt-1">
                              <span>Year: {variant.year}</span>
                              <span>Engine: {variant.engineSize}L</span>
                              <span>Fuel: {variant.fuelType}</span>
                            </div>
                            <div className="flex space-x-6 text-sm mt-2">
                              <div>
                                <span className="text-gray-300">Original:</span>
                                <span className="text-blue-400 ml-1">{variant.originalPower}hp / {variant.originalTorque}Nm</span>
                              </div>
                              <div>
                                <span className="text-gray-300">Stage 1:</span>
                                <span className="text-green-400 ml-1">{variant.stage1Power}hp / {variant.stage1Torque}Nm</span>
                              </div>
                              <div>
                                <span className="text-gray-300">Stage 2:</span>
                                <span className="text-yellow-400 ml-1">{variant.stage2Power}hp / {variant.stage2Torque}Nm</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingVehicle(variant)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteVehicleMutation.mutate(variant.id)}
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                              disabled={deleteVehicleMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Loading states */}
              {(brandsLoading || modelsLoading || vehiclesLoading) && (
                <div className="text-center py-4 text-gray-400">
                  Loading vehicle data...
                </div>
              )}
              
              {/* Empty state */}
              {!brandsLoading && !modelsLoading && !vehiclesLoading && filteredVehicles.length === 0 && selectedBrand !== '__all__' && selectedModel !== '__all__' && (
                <div className="text-center py-8 text-gray-400">
                  No variants found for {selectedBrand} {selectedModel}.
                  <br />
                  <Button
                    className="mt-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setNewVehicle({
                        ...newVehicle,
                        vehicleType: selectedType,
                        brand: selectedBrand,
                        model: selectedModel,
                      });
                      setIsAddVehicleOpen(true);
                    }}
                  >
                    Add First Variant
                  </Button>
                </div>
              )}
            </div>
          </Tabs>
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingVehicle} onOpenChange={() => setEditingVehicle(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gray-100">Edit Vehicle</DialogTitle>
            </DialogHeader>
            {editingVehicle && (
              <VehicleForm
                vehicle={editingVehicle}
                onChange={(updates) => setEditingVehicle(prev => prev ? {...prev, ...updates} : null)}
                title=""
              />
            )}
            <div className="flex justify-end space-x-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setEditingVehicle(null)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => editingVehicle && updateVehicleMutation.mutate(editingVehicle)}
                disabled={updateVehicleMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateVehicleMutation.isPending ? 'Updating...' : 'Update Vehicle'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default VehicleManager;