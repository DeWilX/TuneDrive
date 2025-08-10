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

export async function getEngines(
  brandName: string,
  modelName: string,
  year: string,
): Promise<string[]> {
  const cacheKey = getCacheKey("getEngines", [
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

    // IMPORTANT: CareEcu API's /stages/ endpoint returns tuning stages (ECO, STAGE 1) 
    // NOT actual engine specifications. We need to extract engine info from the stage data
    // or fall back to the static database for proper engine specifications.
    const stages = await cachedApiRequest<CareEcuStage[]>(
      `${API_BASE_URL}/lv/v1/tuning/stages/${yearObj.id}?key=${API_KEY}`,
      cacheKey,
    );
    
    // Check if stages contain actual engine info (not just tuning stages)
    const validStages = stages.filter(
      (stage) => stage && (stage.name || stage.var_title),
    );
    
    // If we only get tuning stages (ECO, STAGE 1, etc.), this means CareEcu API
    // doesn't have proper engine specifications for this vehicle
    const stageNames = validStages.map((stage) => stage.name || stage.var_title || "");
    const isTuningStagesOnly = stageNames.every(name => 
      name.toUpperCase().includes("ECO") || 
      name.toUpperCase().includes("STAGE") ||
      name.toUpperCase().includes("STEP")
    );
    
    if (isTuningStagesOnly) {
      // CareEcu API only has tuning stages, not engine specifications
      // This should trigger fallback to static database in the routes
      throw new CareEcuApiError("CareEcu API returned tuning stages instead of engine specifications");
    }
    
    console.log(
      `Successfully fetched engines for ${brandName} ${modelName} ${year} from CareEcu API: ${validStages.length}`,
    );
    return stageNames.filter(name => name.length > 0).sort();
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
      getCacheKey("getEngines", [
        brandName.toLowerCase(),
        modelName.toLowerCase(),
        year,
      ]),
    );

    if (!stages || stages.length === 0) {
      return null;
    }

    // For CareEcu API, we need to find the ECO or original stage to get base power
    // and STAGE 1 to get tuned power
    const ecoStage = stages.find(
      (s) => (s.name || "").toUpperCase().includes("ECO") || 
             (s.name || "").toUpperCase().includes("ORIGINAL")
    );
    const stage1 = stages.find(
      (s) => (s.name || "").toUpperCase().includes("STAGE") ||
             (s.name || "").toUpperCase().includes("STEP")
    );
    
    if (!ecoStage && !stage1) {
      // Try to find any stage that matches the engine name
      const stage = stages.find(
        (s) => (s.name || "").toLowerCase() === engineName.toLowerCase(),
      );
      if (!stage) {
        return null;
      }
      
      return {
        originalPower: stage.hp_original,
        originalTorque: stage.nm_original,
        stage1Power: stage.hp_tuned,
        stage1Torque: stage.nm_tuned,
      };
    }

    // Use ECO stage for original power and STAGE 1 for tuned power
    const originalPower = ecoStage ? ecoStage.hp_original : (stage1?.hp_original || 0);
    const originalTorque = ecoStage ? ecoStage.nm_original : (stage1?.nm_original || 0);
    const stage1Power = stage1 ? stage1.hp_tuned : (ecoStage?.hp_tuned || 0);
    const stage1Torque = stage1 ? stage1.nm_tuned : (ecoStage?.nm_tuned || 0);

    return {
      originalPower,
      originalTorque,
      stage1Power,
      stage1Torque,
    };
  } catch (error) {
    console.error(
      `Failed to fetch tuning data for ${brandName} ${modelName} ${year} ${engineName}:`,
      error,
    );
    return null;
  }
}
