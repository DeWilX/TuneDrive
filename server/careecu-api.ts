// CareEcuSoft API integration
const API_BASE_URL = 'https://api.carecusoft.com';
const API_KEY = '5c78cfd1ca4ff97888f564558177b3e7';
const LANG = 'lv';

interface CareEcuBrand {
  id: number;
  var_title: string;
  name?: string;
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

async function apiRequest<T>(fullUrl: string): Promise<T> {
  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
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
    const response = await apiRequest<any>('https://api.carecusoft.com/en/v1/chiptuning?key=5c78cfd1ca4ff97888f564558177b3e7');
    console.log('CareEcu API brands response structure:', JSON.stringify(response).substring(0, 500));
    
    // Handle different possible response structures
    let brands: CareEcuBrand[] = [];
    if (Array.isArray(response)) {
      brands = response.filter(item => item && typeof item === 'object' && (item.name || item.var_title));
    } else if (response && response.data && Array.isArray(response.data)) {
      brands = response.data.filter(item => item && typeof item === 'object' && (item.name || item.var_title));
    } else if (response && response.brands && Array.isArray(response.brands)) {
      brands = response.brands.filter(item => item && typeof item === 'object' && (item.name || item.var_title));
    }
    
    // If no valid brands found or API returned insufficient data, throw error to use fallback
    if (brands.length === 0) {
      console.log('CareEcu API returned data but no valid brands found, using database fallback');
      throw new CareEcuApiError('No valid brand data received from API');
    }
    
    console.log(`Successfully fetched brands from CareEcu API: ${brands.length}`);
    return brands.map(brand => brand.name || brand.var_title).sort();
  } catch (error) {
    console.error('Failed to fetch brands from CareEcu API:', error);
    throw new CareEcuApiError('Failed to fetch vehicle brands');
  }
}

export async function getModels(brandName: string): Promise<string[]> {
  try {
    // First get all brands to find the brand ID
    const brands = await apiRequest<CareEcuBrand[]>('https://api.carecusoft.com/en/v1/chiptuning?key=5c78cfd1ca4ff97888f564558177b3e7');
    const brand = brands.find(b => (b.name || b.var_title).toLowerCase() === brandName.toLowerCase());
    
    if (!brand) {
      throw new CareEcuApiError(`Brand "${brandName}" not found`);
    }
    
    const models = await apiRequest<CareEcuModel[]>(`https://api.carecusoft.com/lv/v1/tuning/models/${brand.id}?key=5c78cfd1ca4ff97888f564558177b3e7`);
    return models.map(model => model.name).sort();
  } catch (error) {
    console.error(`Failed to fetch models for brand ${brandName}:`, error);
    throw error instanceof CareEcuApiError ? error : new CareEcuApiError('Failed to fetch vehicle models');
  }
}

export async function getYears(brandName: string, modelName: string): Promise<string[]> {
  try {
    // Get brand ID
    const brands = await apiRequest<CareEcuBrand[]>('https://api.carecusoft.com/en/v1/chiptuning?key=5c78cfd1ca4ff97888f564558177b3e7');
    const brand = brands.find(b => (b.name || b.var_title).toLowerCase() === brandName.toLowerCase());
    
    if (!brand) {
      throw new CareEcuApiError(`Brand "${brandName}" not found`);
    }
    
    // Get model ID
    const models = await apiRequest<CareEcuModel[]>(`https://api.carecusoft.com/lv/v1/tuning/models/${brand.id}?key=5c78cfd1ca4ff97888f564558177b3e7`);
    const model = models.find(m => m.name.toLowerCase() === modelName.toLowerCase());
    
    if (!model) {
      throw new CareEcuApiError(`Model "${modelName}" not found for brand "${brandName}"`);
    }
    
    const years = await apiRequest<CareEcuYear[]>(`https://api.carecusoft.com/lv/v1/tuning/years/${model.id}?key=5c78cfd1ca4ff97888f564558177b3e7`);
    return years.map(year => year.year).sort().reverse(); // Most recent years first
  } catch (error) {
    console.error(`Failed to fetch years for ${brandName} ${modelName}:`, error);
    throw error instanceof CareEcuApiError ? error : new CareEcuApiError('Failed to fetch vehicle years');
  }
}

export async function getEngines(brandName: string, modelName: string, year: string): Promise<string[]> {
  try {
    // Note: The API structure suggests that engines/stages are accessed differently
    // For now, this function will throw an error to use database fallback
    throw new CareEcuApiError('Engine data structure needs clarification from API documentation');
  } catch (error) {
    console.error(`Failed to fetch engines for ${brandName} ${modelName} ${year}:`, error);
    throw error instanceof CareEcuApiError ? error : new CareEcuApiError('Failed to fetch vehicle engines');
  }
}

export async function getTuningData(brandName: string, modelName: string, year: string, engineName: string): Promise<TuningData> {
  try {
    // Note: The stages endpoint requires stage_id, but we need to determine how to get stage_ids
    // For now, this function will throw an error to use database fallback
    throw new CareEcuApiError('Tuning data structure needs clarification from API documentation');
  } catch (error) {
    console.error(`Failed to fetch tuning data for ${brandName} ${modelName} ${year} ${engineName}:`, error);
    throw error instanceof CareEcuApiError ? error : new CareEcuApiError('Failed to fetch tuning data');
  }
}