// CareEcuSoft API integration
const API_BASE_URL = 'https://api.carecusoft.com';
const API_KEY = '5c78cfd1ca4ff97888f564558177b3e7';
const LANG = 'lv';

interface CareEcuBrand {
  id: number;
  name: string;
}

interface CareEcuModel {
  id: number;
  name: string;
  brand_id: number;
}

interface CareEcuYear {
  id: number;
  year: string;
  model_id: number;
}

interface CareEcuEngine {
  id: number;
  name: string;
  year_id: number;
}

interface CareEcuStage {
  id: number;
  name: string;
  hp_original: number;
  nm_original: number;
  hp_tuned: number;
  nm_tuned: number;
  engine_id: number;
}

export interface TuningData {
  originalPower: number;
  originalTorque: number;
  stage1Power: number;
  stage1Torque: number;
  stage2Power?: number;
  stage2Torque?: number;
}

class CareEcuApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'CareEcuApiError';
  }
}

async function apiRequest<T>(endpoint: string, body?: any): Promise<T> {
  const url = `${API_BASE_URL}/${LANG}/v1/tuning/${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: API_KEY,
        ...body
      })
    });
    
    if (!response.ok) {
      throw new CareEcuApiError(`API request failed: ${response.status} ${response.statusText}`, response.status);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof CareEcuApiError) {
      throw error;
    }
    throw new CareEcuApiError(`Network error: ${error}`);
  }
}

export async function getBrands(): Promise<string[]> {
  try {
    const brands = await apiRequest<CareEcuBrand[]>('brands');
    return brands.map(brand => brand.name).sort();
  } catch (error) {
    console.error('Failed to fetch brands from CareEcu API:', error);
    throw new CareEcuApiError('Failed to fetch vehicle brands');
  }
}

export async function getModels(brandName: string): Promise<string[]> {
  try {
    // First get all brands to find the brand ID
    const brands = await apiRequest<CareEcuBrand[]>('brands');
    const brand = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
    
    if (!brand) {
      throw new CareEcuApiError(`Brand "${brandName}" not found`);
    }
    
    const models = await apiRequest<CareEcuModel[]>(`models`, { brand_id: brand.id });
    return models.map(model => model.name).sort();
  } catch (error) {
    console.error(`Failed to fetch models for brand ${brandName}:`, error);
    throw error instanceof CareEcuApiError ? error : new CareEcuApiError('Failed to fetch vehicle models');
  }
}

export async function getYears(brandName: string, modelName: string): Promise<string[]> {
  try {
    // Get brand ID
    const brands = await apiRequest<CareEcuBrand[]>('brands');
    const brand = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
    
    if (!brand) {
      throw new CareEcuApiError(`Brand "${brandName}" not found`);
    }
    
    // Get model ID
    const models = await apiRequest<CareEcuModel[]>(`models`, { brand_id: brand.id });
    const model = models.find(m => m.name.toLowerCase() === modelName.toLowerCase());
    
    if (!model) {
      throw new CareEcuApiError(`Model "${modelName}" not found for brand "${brandName}"`);
    }
    
    const years = await apiRequest<CareEcuYear[]>(`years`, { model_id: model.id });
    return years.map(year => year.year).sort().reverse(); // Most recent years first
  } catch (error) {
    console.error(`Failed to fetch years for ${brandName} ${modelName}:`, error);
    throw error instanceof CareEcuApiError ? error : new CareEcuApiError('Failed to fetch vehicle years');
  }
}

export async function getEngines(brandName: string, modelName: string, year: string): Promise<string[]> {
  try {
    // Get brand ID
    const brands = await apiRequest<CareEcuBrand[]>('brands');
    const brand = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
    
    if (!brand) {
      throw new CareEcuApiError(`Brand "${brandName}" not found`);
    }
    
    // Get model ID
    const models = await apiRequest<CareEcuModel[]>(`models`, { brand_id: brand.id });
    const model = models.find(m => m.name.toLowerCase() === modelName.toLowerCase());
    
    if (!model) {
      throw new CareEcuApiError(`Model "${modelName}" not found for brand "${brandName}"`);
    }
    
    // Get year ID
    const years = await apiRequest<CareEcuYear[]>(`years`, { model_id: model.id });
    const yearData = years.find(y => y.year === year);
    
    if (!yearData) {
      throw new CareEcuApiError(`Year "${year}" not found for ${brandName} ${modelName}`);
    }
    
    const engines = await apiRequest<CareEcuEngine[]>(`engines`, { year_id: yearData.id });
    return engines.map(engine => engine.name).sort();
  } catch (error) {
    console.error(`Failed to fetch engines for ${brandName} ${modelName} ${year}:`, error);
    throw error instanceof CareEcuApiError ? error : new CareEcuApiError('Failed to fetch vehicle engines');
  }
}

export async function getTuningData(brandName: string, modelName: string, year: string, engineName: string): Promise<TuningData> {
  try {
    // Get brand ID
    const brands = await apiRequest<CareEcuBrand[]>('brands');
    const brand = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
    
    if (!brand) {
      throw new CareEcuApiError(`Brand "${brandName}" not found`);
    }
    
    // Get model ID
    const models = await apiRequest<CareEcuModel[]>(`models`, { brand_id: brand.id });
    const model = models.find(m => m.name.toLowerCase() === modelName.toLowerCase());
    
    if (!model) {
      throw new CareEcuApiError(`Model "${modelName}" not found for brand "${brandName}"`);
    }
    
    // Get year ID
    const years = await apiRequest<CareEcuYear[]>(`years`, { model_id: model.id });
    const yearData = years.find(y => y.year === year);
    
    if (!yearData) {
      throw new CareEcuApiError(`Year "${year}" not found for ${brandName} ${modelName}`);
    }
    
    // Get engine ID
    const engines = await apiRequest<CareEcuEngine[]>(`engines`, { year_id: yearData.id });
    const engine = engines.find(e => e.name.toLowerCase() === engineName.toLowerCase());
    
    if (!engine) {
      throw new CareEcuApiError(`Engine "${engineName}" not found for ${brandName} ${modelName} ${year}`);
    }
    
    // Get tuning stages
    const stages = await apiRequest<CareEcuStage[]>(`stages`, { engine_id: engine.id });
    
    if (stages.length === 0) {
      throw new CareEcuApiError(`No tuning data available for ${brandName} ${modelName} ${year} ${engineName}`);
    }
    
    // Find original power (usually the first stage or look for a stage with no tuning)
    const originalStage = stages.find(s => s.hp_tuned === s.hp_original && s.nm_tuned === s.nm_original) || stages[0];
    
    // Find stage 1 (first tuning stage)
    const stage1 = stages.find(s => s.name.toLowerCase().includes('stage 1') || s.name.toLowerCase().includes('eco')) || 
                   stages.find(s => s.hp_tuned > s.hp_original) || stages[0];
    
    // Find stage 2 if available
    const stage2 = stages.find(s => s.name.toLowerCase().includes('stage 2') || s.name.toLowerCase().includes('sport'));
    
    return {
      originalPower: originalStage.hp_original,
      originalTorque: originalStage.nm_original,
      stage1Power: stage1.hp_tuned,
      stage1Torque: stage1.nm_tuned,
      stage2Power: stage2?.hp_tuned,
      stage2Torque: stage2?.nm_tuned,
    };
  } catch (error) {
    console.error(`Failed to fetch tuning data for ${brandName} ${modelName} ${year} ${engineName}:`, error);
    throw error instanceof CareEcuApiError ? error : new CareEcuApiError('Failed to fetch tuning data');
  }
}