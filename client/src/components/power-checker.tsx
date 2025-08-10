import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/hooks/useLanguage";
import { Car, Truck, Tractor } from "lucide-react";

interface VehiclePower {
  originalPower: number;
  originalTorque: number;
  stage1Power: number;
  stage1Torque: number;
  stage2Power: number;
  stage2Torque: number;
}

export default function PowerChecker() {
  const [vehicleType, setVehicleType] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedGeneration, setSelectedGeneration] = useState<string>("");
  const [selectedEngine, setSelectedEngine] = useState<string>("");
  const [powerData, setPowerData] = useState<VehiclePower | null>(null);
  const { trackClick } = useAnalytics();
  const { t } = useLanguage();

  // Fetch brands based on vehicle type
  const { data: brands = [] } = useQuery({
    queryKey: [`/api/vehicles/brands/${vehicleType}`],
    enabled: !!vehicleType,
  });

  // Fetch models based on brand and vehicle type
  const { data: models = [] } = useQuery({
    queryKey: [`/api/vehicles/models/${vehicleType}/${selectedBrand}`],
    enabled: !!selectedBrand && !!vehicleType,
  });

  // Fetch generations based on model, brand and vehicle type
  const { data: generations = [] } = useQuery({
    queryKey: [`/api/vehicles/generations/${vehicleType}/${selectedBrand}/${selectedModel}`],
    enabled: !!selectedModel && !!selectedBrand && !!vehicleType,
  });

  const { data: enginesData = [], isLoading: enginesLoading } = useQuery<string[]>({
    queryKey: [`/api/vehicles/engines/${vehicleType}/${selectedBrand}/${selectedModel}/${selectedGeneration}`],
    enabled: !!selectedGeneration && !!selectedModel && !!selectedBrand && !!vehicleType,
  });

  // Ensure engines is always an array
  const engines = Array.isArray(enginesData) ? enginesData : [];
  
  const handleCheckPower = async () => {
    if (!selectedEngine || !selectedGeneration || !selectedModel || !selectedBrand || !vehicleType) return;

    try {
      const response = await fetch(`/api/vehicles/power/${vehicleType}/${selectedBrand}/${selectedModel}/${selectedGeneration}/${selectedEngine}`);
      if (response.ok) {
        const data = await response.json();
        setPowerData(data);
        trackClick('power-check', `${selectedBrand} ${selectedModel} ${selectedGeneration} ${selectedEngine}`);
      }
    } catch (error) {
      console.error('Error fetching power data:', error);
    }
  };

  // Reset dependent selections when parent selections change
  const handleVehicleTypeChange = (value: string) => {
    setVehicleType(value);
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedGeneration("");
    setSelectedEngine("");
    setPowerData(null);
  };

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    setSelectedModel("");
    setSelectedGeneration("");
    setSelectedEngine("");
    setPowerData(null);
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    setSelectedGeneration("");
    setSelectedEngine("");
    setPowerData(null);
  };

  const handleGenerationChange = (value: string) => {
    setSelectedGeneration(value);
    setSelectedEngine("");
    setPowerData(null);
  };

  const vehicleTypeOptions = [
    { value: 'car', label: 'Car', icon: Car },
    { value: 'truck', label: 'Truck', icon: Truck },
    { value: 'tractor', label: 'Tractor', icon: Tractor },
  ];

  return (
    <section id="power-check" className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
            {t.powerChecker.title}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t.powerChecker.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Selection */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">{t.powerChecker.selectVehicle}</CardTitle>
              <CardDescription className="text-gray-400">
                Choose your vehicle specifications to check tuning potential
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Vehicle Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {vehicleTypeOptions.map(({ value, label, icon: Icon }) => (
                    <Button
                      key={value}
                      variant={vehicleType === value ? "default" : "outline"}
                      className={`h-16 flex flex-col items-center justify-center ${
                        vehicleType === value 
                          ? "bg-accent-500 text-white" 
                          : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                      }`}
                      onClick={() => handleVehicleTypeChange(value)}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-xs">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Brand Selection */}
              {vehicleType && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t.powerChecker.selectBrand}
                  </label>
                  <Select value={selectedBrand} onValueChange={handleBrandChange}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                      <SelectValue placeholder={t.powerChecker.selectBrand} />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {(brands as string[]).map((brand: string) => (
                        <SelectItem key={brand} value={brand} className="text-gray-100 hover:bg-gray-600">
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Model Selection */}
              {selectedBrand && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t.powerChecker.selectModel}
                  </label>
                  <Select value={selectedModel} onValueChange={handleModelChange}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                      <SelectValue placeholder={t.powerChecker.selectModel} />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {(models as string[]).map((model: string) => (
                        <SelectItem key={model} value={model} className="text-gray-100 hover:bg-gray-600">
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Generation Selection */}
              {selectedModel && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Generation
                  </label>
                  <Select value={selectedGeneration} onValueChange={handleGenerationChange}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                      <SelectValue placeholder="Select Generation" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {(generations as string[]).map((generation: string) => (
                        <SelectItem key={generation} value={generation} className="text-gray-100 hover:bg-gray-600">
                          {generation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Engine Selection */}
              {selectedGeneration && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Engine Type
                  </label>
                  <Select value={selectedEngine} onValueChange={setSelectedEngine}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                      <SelectValue placeholder="Select Engine" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {engines.map((engine: string) => (
                        <SelectItem key={engine} value={engine} className="text-gray-100 hover:bg-gray-600">
                          {engine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Check Power Button */}
              {selectedEngine && (
                <Button
                  onClick={handleCheckPower}
                  className="w-full bg-accent-500 hover:bg-accent-600 text-white"
                >
                  <i className="fas fa-search mr-2"></i>
                  {t.powerChecker.checkPower}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Power Results */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Power Results</CardTitle>
              <CardDescription className="text-gray-400">
                Tuning potential for your vehicle
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!powerData ? (
                <div className="text-center py-12">
                  <i className="fas fa-tachometer-alt text-gray-600 text-4xl mb-4"></i>
                  <p className="text-gray-400">Select your vehicle to see tuning potential</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Original Power */}
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-100 mb-2">{t.powerChecker.originalPower}</h4>
                    <div className="flex justify-between">
                      <span className="text-gray-300">{powerData.originalPower} HP</span>
                      <span className="text-gray-300">{powerData.originalTorque} Nm</span>
                    </div>
                  </div>

                  {/* Stage 1 */}
                  <div className="bg-accent-500/10 rounded-lg p-4 border border-accent-500/20">
                    <h4 className="font-semibold text-accent-400 mb-2">{t.powerChecker.stage1Power}</h4>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">{powerData.stage1Power} HP</span>
                      <span className="text-gray-300">{powerData.stage1Torque} Nm</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-accent-400">
                        +{powerData.stage1Power - powerData.originalPower} HP
                      </span>
                      <span className="text-accent-400">
                        +{powerData.stage1Torque - powerData.originalTorque} Nm
                      </span>
                    </div>
                  </div>

                  {/* Stage 2 */}
                  <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                    <h4 className="font-semibold text-green-400 mb-2">{t.powerChecker.stage2Power}</h4>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">{powerData.stage2Power} HP</span>
                      <span className="text-gray-300">{powerData.stage2Torque} Nm</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">
                        +{powerData.stage2Power - powerData.originalPower} HP
                      </span>
                      <span className="text-green-400">
                        +{powerData.stage2Torque - powerData.originalTorque} Nm
                      </span>
                    </div>
                  </div>

                  {/* Get Quote Button */}
                  <Button
                    onClick={() => {
                      trackClick('power-check-quote', `${selectedBrand} ${selectedModel}`);
                      const element = document.getElementById('contact');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <i className="fas fa-envelope mr-2"></i>
                    Get Free Quote
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}