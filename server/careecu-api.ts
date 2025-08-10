// CareEcuSoft API integration with caching
const API_BASE_URL = "https://api.carecusoft.com";
const API_KEY = "5c78cfd1ca4ff97888f564558177b3e7";
const ENGINES_API_KEY = "AD5AS45D464DAS6D4SA65D46ASD4AS8F4AS6F4A68";
const LANG = "lv";

interface CareEcuBrand {
  id: number;
  var_title: string;
  name?: string;
  is_car?: number;
  is_truck?: number;
  is_tractor?: number;
  logo?: string;
  image?: string;
  var_logo?: string;
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
  var_alias?: string;
  year_id: number;
  int_hp?: number;
  int_nm?: number;
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
  stage1PowerGain?: number;
  stage1TorqueGain?: number;
  stage2PowerGain?: number;
  stage2TorqueGain?: number;
  stage1FuelEconomy?: number;
  stage2FuelEconomy?: number;
  brandLogo?: string;
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

    console.log(`[API DEBUG] Using brand ID: ${brand.id} for brand: ${brandName}`);
    
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
    return validModels.map((model) => model.name || model.var_title).filter((name): name is string => Boolean(name)).sort();
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

    console.log(`[API DEBUG] Using brand ID: ${brand.id} for brand: ${brandName}`);

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

    console.log(`[API DEBUG] Using model ID: ${model.id} for model: ${modelName}`);

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
      .filter((year): year is string => Boolean(year))
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

// Get engines using the correct API endpoint
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

    console.log(`[API DEBUG] Using brand ID: ${brand.id} for brand: ${brandName}`);

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

    console.log(`[API DEBUG] Using model ID: ${model.id} for model: ${modelName}`);

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

    console.log(`[API DEBUG] Using year ID: ${yearObj.id} for year: ${year}`);

    // Get engines using the correct API endpoint with different API key
    const engines = await cachedApiRequest<CareEcuEngine[]>(
      `${API_BASE_URL}/en/v1/tuning/engines/${yearObj.id}?key=${ENGINES_API_KEY}`,
      cacheKey,
    );
    
    if (!engines || engines.length === 0) {
      throw new CareEcuApiError("No engine data available from CareEcu API");
    }
    
    // Extract engine names using var_alias and HP to make them unique
    const validEngines = engines.filter(
      (engine) => engine && (engine.var_alias || engine.name || engine.var_title),
    );
    
    if (validEngines.length === 0) {
      throw new CareEcuApiError("No valid engine specifications found in CareEcu API data");
    }
    
    const engineNames = validEngines
      .map((engine) => {
        const title = engine.var_title || engine.name;
        const alias = engine.var_alias || "";
        
        // Extract HP from var_alias (e.g., "3.0-tdi-dpf-240hp" -> "240")
        const hpMatch = alias.match(/(\d+)hp/i);
        const hp = hpMatch ? hpMatch[1] : engine.int_hp;
        
        // Create readable name with proper formatting
        if (title && hp) {
          return `${title} (${hp} HP)`;
        } else if (title) {
          return title;
        } else {
          return alias;
        }
      })
      .filter((name): name is string => Boolean(name))
      .sort();
    
    console.log(
      `Successfully fetched ${engineNames.length} engines for ${brandName} ${modelName} ${year} from CareEcu API`,
    );
    return engineNames;
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

    console.log(`[API DEBUG] getTuningData - Using brand ID: ${brand.id} for brand: ${brandName}`);

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

    console.log(`[API DEBUG] getTuningData - Using model ID: ${model.id} for model: ${modelName}`);

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

    console.log(`[API DEBUG] getTuningData - Using year ID: ${yearObj.id} for year: ${year}`);
    console.log(`[API DEBUG] getTuningData - Looking for engine: ${engineName}`);

    // Get engines using correct API
    const engines = await cachedApiRequest<CareEcuEngine[]>(
      `${API_BASE_URL}/en/v1/tuning/engines/${yearObj.id}?key=${ENGINES_API_KEY}`,
      getCacheKey("getEnginesFromYear", [
        brandName.toLowerCase(),
        modelName.toLowerCase(),
        year,
      ]),
    );

    if (!engines || engines.length === 0) {
      return null;
    }

    // Find the specific engine by matching the formatted name
    const engine = engines.find((e) => {
      const title = e.var_title || e.name;
      const alias = e.var_alias || "";
      
      // Extract HP from var_alias (e.g., "3.0-tdi-dpf-240hp" -> "240")
      const hpMatch = alias.match(/(\d+)hp/i);
      const hp = hpMatch ? hpMatch[1] : e.int_hp;
      
      // Create readable name with proper formatting
      let formattedName;
      if (title && hp) {
        formattedName = `${title} (${hp} HP)`;
      } else if (title) {
        formattedName = title;
      } else {
        formattedName = alias;
      }
      
      return formattedName === engineName;
    });

    if (!engine) {
      console.log(`Engine ${engineName} not found`);
      return null;
    }

    console.log(`[API DEBUG] getTuningData - Using engine ID: ${engine.id} for engine: ${engineName}`);

    // Get tuning stages for this engine
    const stages = await cachedApiRequest<CareEcuStage[]>(
      `${API_BASE_URL}/lv/v1/tuning/stages/${engine.id}?key=${API_KEY}`,
      cacheKey,
    );

    if (!stages || stages.length === 0) {
      return null;
    }

    // Find ECO and STAGE 1 data for this engine
    const ecoStage = stages.find(
      (s) => (s.var_title || "").toUpperCase().includes("ECO")
    );
    const stage1 = stages.find(
      (s) => (s.var_title || "").toUpperCase().includes("STAGE 1")
    );
    const stage2 = stages.find(
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

    // Extract fuel economy data (int_eco) - only if not null
    const stage1FuelEconomy = stage1?.int_eco !== null && stage1?.int_eco !== undefined ? stage1.int_eco : undefined;
    const stage2FuelEconomy = stage2?.int_eco !== null && stage2?.int_eco !== undefined ? stage2.int_eco : undefined;

    // Get brand logo - fetch brand data to get logo URL
    let brandLogo: string | undefined;
    try {
      const brands = await cachedApiRequest<CareEcuBrand[]>(
        `https://api.carecusoft.com/en/v1/chiptuning?key=${API_KEY}`,
        getCacheKey("getBrands", [])
      );
      const brand = brands.find(
        (b) => (b.name || b.var_title).toLowerCase() === brandName.toLowerCase()
      );
      brandLogo = brand?.var_logo || brand?.logo || brand?.image;
    } catch (error) {
      console.log("Could not fetch brand logo:", error);
    }

    // Calculate percentage gains
    const stage1PowerGain = originalPower > 0 ? Math.round(((stage1Power - originalPower) / originalPower) * 100) : 0;
    const stage1TorqueGain = originalTorque > 0 ? Math.round(((stage1Torque - originalTorque) / originalTorque) * 100) : 0;
    const stage2PowerGain = stage2Power && originalPower > 0 ? Math.round(((stage2Power - originalPower) / originalPower) * 100) : undefined;
    const stage2TorqueGain = stage2Torque && originalTorque > 0 ? Math.round(((stage2Torque - originalTorque) / originalTorque) * 100) : undefined;

    console.log(`Successfully fetched power data for ${engineName} from CareEcu API`);
    return {
      originalPower,
      originalTorque,
      stage1Power,
      stage1Torque,
      stage2Power,
      stage2Torque,
      stage1PowerGain,
      stage1TorqueGain,
      stage2PowerGain,
      stage2TorqueGain,
      stage1FuelEconomy,
      stage2FuelEconomy,
      brandLogo,
    };
  } catch (error) {
    console.error(
      `Failed to fetch tuning data for ${brandName} ${modelName} ${year} ${engineName}:`,
      error,
    );
    return null;
  }
}
