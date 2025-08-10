// CareEcuSoft API integration with caching
const API_BASE_URL = "https://api.carecusoft.com";
const API_KEY = "5c78cfd1ca4ff97888f564558177b3e7";
const LANG = "lv";

interface CareEcuBrand {
  id: number;
  var_title: string;
  name?: string;
  is_car?: number;
  is_truck?: number;
  is_tractor?: number;
}

interface CareEcuModel {
  id: number;
  name?: string;
  var_title?: string;
  brand_id: number;
}

interface CareEcuYear {
  id: number;
  year?: string;
  var_title?: string;
  model_id: number;
}

interface CareEcuEngine {
  id: number;
  name?: string;
  var_title?: string;
  year_id: number;
}

interface CareEcuStage {
  id: number;
  user_id: number | null;
  stage_type: number;
  int_parent: number;
  int_eco: number | null;
  int_hp_new: number | null;
  int_hp_diff: number | null;
  int_nm_new: number | null;
  int_nm_diff: number | null;
  int_status: number;
  var_alias: string | null;
  seo_url: string;
  price: number;
  var_title: string;
  seo_title: string;
  my_data: any;
  parent: {
    id: number;
    user_id: number | null;
    var_title: string;
    seo_title: string;
    var_subtitle: string | null;
    int_parent: number;
    int_fuel_type: number;
    int_status: number;
    var_alias: string;
    int_hp: number;
    int_nm: number;
    is_development: any;
    int_pending: number;
    rpm_values: any;
    hp_percentage: any;
    nm_percentage: any;
    seo_url: string;
    my_data: any;
    parent: any;
  };
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
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "CareEcuApiError";
  }
}

// Simple in-memory cache object
const cache = new Map<string, any>();

// Cache TTL (time to live) in milliseconds (e.g., 10 minutes)
const CACHE_TTL = 10 * 60 * 1000;

function getCacheKey(functionName: string, params: any[]): string {
  return `${functionName}:${JSON.stringify(params)}`;
}

async function cachedApiRequest<T>(fullUrl: string, cacheKey: string): Promise<T> {
  const cached = cache.get(cacheKey);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL) {
    // Return cached data if not expired
    return cached.data as T;
  }

  // If no cache or expired, fetch fresh data
  const data = await apiRequest<T>(fullUrl);
  cache.set(cacheKey, { data, timestamp: now });
  return data;
}

async function apiRequest<T>(fullUrl: string): Promise<T> {
  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new CareEcuApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status,
      );
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
  const cacheKey = getCacheKey("getBrands", []);
  try {
    const response = await cachedApiRequest<any>(
      `https://api.carecusoft.com/en/v1/chiptuning?key=${API_KEY}`,
      cacheKey,
    );

    let brands: CareEcuBrand[] = [];
    if (Array.isArray(response)) {
      brands = response.filter(
        (item) =>
          item && typeof item === "object" && (item.name || item.var_title),
      );
    } else if (response && response.data && Array.isArray(response.data)) {
      brands = response.data.filter(
        (item: any) =>
          item && typeof item === "object" && (item.name || item.var_title),
      );
    } else if (response && response.brands && Array.isArray(response.brands)) {
      brands = response.brands.filter(
        (item: any) =>
          item && typeof item === "object" && (item.name || item.var_title),
      );
    }

    if (brands.length === 0) {
      console.log(
        "CareEcu API returned data but no valid brands found, using database fallback",
      );
      throw new CareEcuApiError("No valid brand data received from API");
    }

    console.log(
      `Successfully fetched ${brands.length} brands from CareEcu API`,
    );
    return brands.map((brand) => brand.name || brand.var_title).filter(Boolean).sort();
  } catch (error) {
    console.error("Failed to fetch brands from CareEcu API:", error);
    throw new CareEcuApiError("Failed to fetch vehicle brands");
  }
}

export async function getModels(brandName: string): Promise<string[]> {
  const cacheKey = getCacheKey("getModels", [brandName.toLowerCase()]);
  try {
    // Get all brands (cached)
    const brands = await cachedApiRequest<CareEcuBrand[]>(
      `https://api.carecusoft.com/en/v1/chiptuning?key=${API_KEY}`,
      getCacheKey("getBrands", []),
    );
    const brand = brands.find(
      (b) => (b.name || b.var_title).toLowerCase() === brandName.toLowerCase(),
    );

    if (!brand) {
      throw new CareEcuApiError(`Brand "${brandName}" not found`);
    }

    const models = await cachedApiRequest<CareEcuModel[]>(
      `${API_BASE_URL}/lv/v1/tuning/models/${brand.id}?key=${API_KEY}`,
      cacheKey,
    );
    const validModels = models.filter(
      (model) => model && (model.name || model.var_title),
    );
    console.log(
      `Successfully fetched models for ${brandName} from CareEcu API: ${validModels.length}`,
    );
    return validModels.map((model) => model.name || model.var_title).filter(Boolean).sort();
  } catch (error) {
    console.error(`Failed to fetch models for brand ${brandName}:`, error);
    throw error instanceof CareEcuApiError
      ? error
      : new CareEcuApiError("Failed to fetch vehicle models");
  }
}

export async function getYears(
  brandName: string,
  modelName: string,
): Promise<string[]> {
  const cacheKey = getCacheKey("getYears", [
    brandName.toLowerCase(),
    modelName.toLowerCase(),
  ]);
  try {
    // Get brands (cached)
    const brands = await cachedApiRequest<CareEcuBrand[]>(
      `https://api.carecusoft.com/en/v1/chiptuning?key=${API_KEY}`,
      getCacheKey("getBrands", []),
    );
    const brand = brands.find(
      (b) => (b.name || b.var_title).toLowerCase() === brandName.toLowerCase(),
    );

    if (!brand) {
      throw new CareEcuApiError(`Brand "${brandName}" not found`);
    }

    // Get models (cached)
    const models = await cachedApiRequest<CareEcuModel[]>(
      `${API_BASE_URL}/lv/v1/tuning/models/${brand.id}?key=${API_KEY}`,
      getCacheKey("getModels", [brandName.toLowerCase()]),
    );
    const model = models.find(
      (m) => (m.name || m.var_title)?.toLowerCase() === modelName.toLowerCase(),
    );

    if (!model) {
      throw new CareEcuApiError(
        `Model "${modelName}" not found for brand "${brandName}"`,
      );
    }

    const years = await cachedApiRequest<CareEcuYear[]>(
      `${API_BASE_URL}/lv/v1/tuning/years/${model.id}?key=${API_KEY}`,
      cacheKey,
    );
    const validYears = years.filter(
      (year) => year && (year.year || year.var_title),
    );
    console.log(
      `Successfully fetched years for ${brandName} ${modelName} from CareEcu API: ${validYears.length}`,
    );
    return validYears
      .map((year) => year.year || year.var_title)
      .filter(Boolean)
      .sort()
      .reverse();
  } catch (error) {
    console.error(
      `Failed to fetch years for ${brandName} ${modelName}:`,
      error,
    );
    throw error instanceof CareEcuApiError
      ? error
      : new CareEcuApiError("Failed to fetch vehicle years");
  }
}

// New function to get engine specifications from CareEcu year data
export async function getEnginesFromYear(
  brandName: string,
  modelName: string,
  year: string,
): Promise<string[]> {
  const cacheKey = getCacheKey("getEnginesFromYear", [
    brandName.toLowerCase(),
    modelName.toLowerCase(),
    year,
  ]);
  try {
    // Get brands (cached)
    const brands = await cachedApiRequest<CareEcuBrand[]>(
      `https://api.carecusoft.com/en/v1/chiptuning?key=${API_KEY}`,
      getCacheKey("getBrands", []),
    );
    const brand = brands.find(
      (b) => (b.name || b.var_title).toLowerCase() === brandName.toLowerCase(),
    );

    if (!brand) {
      throw new CareEcuApiError(`Brand "${brandName}" not found`);
    }

    // Get models (cached)
    const models = await cachedApiRequest<CareEcuModel[]>(
      `${API_BASE_URL}/lv/v1/tuning/models/${brand.id}?key=${API_KEY}`,
      getCacheKey("getModels", [brandName.toLowerCase()]),
    );
    const model = models.find(
      (m) => (m.name || m.var_title)?.toLowerCase() === modelName.toLowerCase(),
    );

    if (!model) {
      throw new CareEcuApiError(
        `Model "${modelName}" not found for brand "${brandName}"`,
      );
    }

    // Get years (cached)
    const years = await cachedApiRequest<CareEcuYear[]>(
      `${API_BASE_URL}/lv/v1/tuning/years/${model.id}?key=${API_KEY}`,
      getCacheKey("getYears", [brandName.toLowerCase(), modelName.toLowerCase()]),
    );
    const yearObj = years.find((y) => (y.year || y.var_title) === year);

    if (!yearObj) {
      throw new CareEcuApiError(
        `Year "${year}" not found for ${brandName} ${modelName}`,
      );
    }

    // Get all stages for this year to extract unique engine specifications
    const stages = await cachedApiRequest<CareEcuStage[]>(
      `${API_BASE_URL}/lv/v1/tuning/stages/${yearObj.id}?key=${API_KEY}`,
      cacheKey,
    );
    
    if (!stages || stages.length === 0) {
      throw new CareEcuApiError("No engine data available from CareEcu API");
    }
    
    // Extract unique engine specifications from the parent data
    const engineSpecs = new Set<string>();
    stages.forEach(stage => {
      if (stage.parent && stage.parent.var_title) {
        engineSpecs.add(stage.parent.var_title);
      }
    });
    
    const engines = Array.from(engineSpecs).filter(engine => engine.length > 0);
    
    if (engines.length === 0) {
      throw new CareEcuApiError("No valid engine specifications found in CareEcu API data");
    }
    
    console.log(
      `Successfully fetched ${engines.length} engines for ${brandName} ${modelName} ${year} from CareEcu API`,
    );
    return engines.sort();
  } catch (error) {
    console.error(
      `Failed to fetch engines for ${brandName} ${modelName} ${year}:`,
      error,
    );
    throw error instanceof CareEcuApiError
      ? error
      : new CareEcuApiError("Failed to fetch vehicle engines");
  }
}

// Keep the old function for backward compatibility but redirect to new function
export async function getEngines(
  brandName: string,
  modelName: string,
  year: string,
): Promise<string[]> {
  return getEnginesFromYear(brandName, modelName, year);
}

export async function getTuningData(
  brandName: string,
  modelName: string,
  year: string,
  engineName: string,
): Promise<TuningData | null> {
  const cacheKey = getCacheKey("getTuningData", [
    brandName.toLowerCase(),
    modelName.toLowerCase(),
    year,
    engineName.toLowerCase(),
  ]);
  try {
    // Get brands (cached)
    const brands = await cachedApiRequest<CareEcuBrand[]>(
      `https://api.carecusoft.com/en/v1/chiptuning?key=${API_KEY}`,
      getCacheKey("getBrands", []),
    );
    const brand = brands.find(
      (b) => (b.name || b.var_title).toLowerCase() === brandName.toLowerCase(),
    );

    if (!brand) {
      throw new CareEcuApiError(`Brand "${brandName}" not found`);
    }

    // Get models (cached)
    const models = await cachedApiRequest<CareEcuModel[]>(
      `${API_BASE_URL}/lv/v1/tuning/models/${brand.id}?key=${API_KEY}`,
      getCacheKey("getModels", [brandName.toLowerCase()]),
    );
    const model = models.find(
      (m) => (m.name || m.var_title)?.toLowerCase() === modelName.toLowerCase(),
    );

    if (!model) {
      throw new CareEcuApiError(
        `Model "${modelName}" not found for brand "${brandName}"`,
      );
    }

    // Get years (cached)
    const years = await cachedApiRequest<CareEcuYear[]>(
      `${API_BASE_URL}/lv/v1/tuning/years/${model.id}?key=${API_KEY}`,
      getCacheKey("getYears", [brandName.toLowerCase(), modelName.toLowerCase()]),
    );
    const yearObj = years.find((y) => (y.year || y.var_title) === year);

    if (!yearObj) {
      throw new CareEcuApiError(
        `Year "${year}" not found for ${brandName} ${modelName}`,
      );
    }

    // Get stages (cached)
    const stages = await cachedApiRequest<CareEcuStage[]>(
      `${API_BASE_URL}/lv/v1/tuning/stages/${yearObj.id}?key=${API_KEY}`,
      getCacheKey("getEnginesFromYear", [
        brandName.toLowerCase(),
        modelName.toLowerCase(),
        year,
      ]),
    );

    if (!stages || stages.length === 0) {
      return null;
    }

    // Find stages for the specific engine
    const engineStages = stages.filter(
      (s) => s.parent && s.parent.var_title === engineName
    );

    if (engineStages.length === 0) {
      console.log(`No stages found for engine ${engineName}`);
      return null;
    }

    // Find ECO and STAGE 1 data for this specific engine
    const ecoStage = engineStages.find(
      (s) => (s.var_title || "").toUpperCase().includes("ECO")
    );
    const stage1 = engineStages.find(
      (s) => (s.var_title || "").toUpperCase().includes("STAGE 1")
    );
    const stage2 = engineStages.find(
      (s) => (s.var_title || "").toUpperCase().includes("STAGE 2")
    );

    if (!ecoStage && !stage1) {
      console.log(`No valid tuning stages found for engine ${engineName}`);
      return null;
    }

    // Extract power data from the stages
    const originalPower = ecoStage?.parent?.int_hp || stage1?.parent?.int_hp || 0;
    const originalTorque = ecoStage?.parent?.int_nm || stage1?.parent?.int_nm || 0;
    const stage1Power = stage1?.int_hp_new || 0;
    const stage1Torque = stage1?.int_nm_new || 0;
    const stage2Power = stage2?.int_hp_new || undefined;
    const stage2Torque = stage2?.int_nm_new || undefined;

    console.log(`Successfully fetched power data for ${engineName} from CareEcu API`);
    return {
      originalPower,
      originalTorque,
      stage1Power,
      stage1Torque,
      stage2Power,
      stage2Torque,
    };
  } catch (error) {
    console.error(
      `Failed to fetch tuning data for ${brandName} ${modelName} ${year} ${engineName}:`,
      error,
    );
    return null;
  }
}
