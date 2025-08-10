import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/hooks/useLanguage";

interface VehiclePower {
  originalPower: number;
  originalTorque: number;
  stage1Power: number;
  stage1Torque: number;
  stage2Power: number;
  stage2Torque: number;
  stage1PowerGain?: number;
  stage1TorqueGain?: number;
  stage2PowerGain?: number;
  stage2TorqueGain?: number;
}

export default function PowerChecker() {
  const vehicleType = "car"; // Fixed to car only
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedGeneration, setSelectedGeneration] = useState<string>("");
  const [selectedEngine, setSelectedEngine] = useState<string>("");
  const [powerData, setPowerData] = useState<VehiclePower | null>(null);
  const { trackClick } = useAnalytics();
  const { t } = useLanguage();

  // Fetch brands (always cars)
  const { data: brands = [] } = useQuery({
    queryKey: [`/api/vehicles/brands/car`],
  });

  // Fetch models based on brand
  const { data: models = [] } = useQuery({
    queryKey: [`/api/vehicles/models/car/${selectedBrand}`],
    enabled: !!selectedBrand,
  });

  // Fetch generations based on model and brand
  const { data: generations = [] } = useQuery({
    queryKey: [`/api/vehicles/generations/car/${selectedBrand}/${selectedModel}`],
    enabled: !!selectedModel && !!selectedBrand,
  });

  const { data: enginesData = [], isLoading: enginesLoading } = useQuery<string[]>({
    queryKey: [`/api/vehicles/engines/car/${selectedBrand}/${selectedModel}/${selectedGeneration}`],
    enabled: !!selectedGeneration && !!selectedModel && !!selectedBrand,
  });

  // Ensure engines is always an array
  const engines = Array.isArray(enginesData) ? enginesData : [];
  
  const handleCheckPower = async () => {
    if (!selectedEngine || !selectedGeneration || !selectedModel || !selectedBrand) return;

    try {
      const response = await fetch(`/api/vehicles/power/car/${selectedBrand}/${selectedModel}/${selectedGeneration}/${selectedEngine}`);
      if (response.ok) {
        const data = await response.json();
        setPowerData(data);
        trackClick('power-check', `${selectedBrand} ${selectedModel} ${selectedGeneration} ${selectedEngine}`);
      }
    } catch (error) {
      console.error('Error fetching power data:', error);
    }
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
              {/* Brand Selection */}
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
                  {/* Vehicle Info Header */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-white rounded-full p-3 mr-4">
                      <i className="fas fa-car text-gray-700 text-xl"></i>
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-white">{selectedBrand} {selectedModel}</h3>
                      <p className="text-gray-400 text-sm">{selectedGeneration} • {selectedEngine}</p>
                    </div>
                  </div>

                  {/* Professional Power Results Cards - Horizontal Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Standard/Original Power Card */}
                    <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                      <div className="flex items-center justify-center mb-3">
                        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">STANDARD</h3>
                      </div>
                      <div className="text-3xl font-bold text-gray-800 mb-1">{powerData.originalPower}<span className="text-lg font-normal text-gray-600">HP</span></div>
                      <div className="text-2xl font-semibold text-gray-600">{powerData.originalTorque}<span className="text-lg font-normal text-gray-500">NM</span></div>
                    </div>

                    {/* Stage 1 Card */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-center shadow-lg border border-gray-700">
                      <div className="flex items-center justify-center mb-3 space-x-2">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          +{powerData.stage1PowerGain}% FUEL
                        </span>
                        <h3 className="font-bold text-white text-sm uppercase tracking-wider">STAGE 1</h3>
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{powerData.stage1Power}<span className="text-lg font-normal text-gray-300">HP</span></div>
                      <div className="text-2xl font-semibold text-gray-300 mb-3">{powerData.stage1Torque}<span className="text-lg font-normal text-gray-400">NM</span></div>
                      <div className="flex justify-center space-x-6 text-sm mb-3">
                        <span className="text-red-400 font-bold">+{powerData.stage1Power - powerData.originalPower} HP</span>
                        <span className="text-red-400 font-bold">+{powerData.stage1Torque - powerData.originalTorque} NM</span>
                      </div>
                      <div className="text-right text-sm text-gray-400 font-semibold">€300</div>
                    </div>

                    {/* Stage 2 Card */}
                    {powerData.stage2Power && (
                      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-center shadow-lg border border-gray-600">
                        <div className="flex items-center justify-center mb-3 space-x-2">
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            +{powerData.stage2PowerGain}% FUEL
                          </span>
                          <h3 className="font-bold text-white text-sm uppercase tracking-wider">STAGE 2</h3>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{powerData.stage2Power}<span className="text-lg font-normal text-gray-300">HP</span></div>
                        <div className="text-2xl font-semibold text-gray-300 mb-3">{powerData.stage2Torque}<span className="text-lg font-normal text-gray-400">NM</span></div>
                        <div className="flex justify-center space-x-6 text-sm mb-3">
                          <span className="text-red-400 font-bold">+{powerData.stage2Power - powerData.originalPower} HP</span>
                          <span className="text-red-400 font-bold">+{powerData.stage2Torque - powerData.originalTorque} NM</span>
                        </div>
                        <div className="text-right text-sm text-gray-400 font-semibold">€400</div>
                      </div>
                    )}
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