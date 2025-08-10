import { 
  type Vehicle, 
  type InsertVehicle, 
  type ContactRequest, 
  type InsertContactRequest,
  type AdminUser,
  type InsertAdminUser,
  type PageContent,
  type InsertPageContent,
  type NavigationItem,
  type InsertNavigationItem,
  type ServiceItem,
  type InsertServiceItem,
  type ContactInfo,
  type InsertContactInfo,
  type GlobalContactInfo,
  type InsertGlobalContactInfo,
  type ContactPageContent,
  type InsertContactPageContent,
  type PowerCalculatorData,
  type InsertPowerCalculatorData,
  type Translation,
  type InsertTranslation,
  type Language,
  type InsertLanguage,
  type SiteIdentity,
  type InsertSiteIdentity,
  type PageView,
  type InsertPageView,
  type ClickEvent,
  type InsertClickEvent,
  type VehicleSelection,
  type InsertVehicleSelection,
  type GeoLocation,
  type InsertGeoLocation,
  type ZboxContent,
  type InsertZboxContent,
  type WhyChooseUsContent,
  type InsertWhyChooseUsContent,
  type ContactContent,
  type InsertContactContent,
  vehicles,
  contactRequests,
  adminUsers,
  pageContent,
  navigationItems,
  serviceItems,
  contactInfo,
  globalContactInfo,
  contactPageContent,
  powerCalculatorData,
  translations,
  languages,
  siteIdentity,
  pageViews,
  clickEvents,
  vehicleSelections,
  geoLocations,
  zboxContent,
  whyChooseUsContent,
  contactContent
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // Vehicle operations
  getVehiclesByType(vehicleType: string): Promise<Vehicle[]>;
  getBrandsByType(vehicleType: string): Promise<string[]>;
  getModelsByBrand(brand: string, vehicleType: string): Promise<string[]>;
  getGenerationsByModel(brand: string, model: string, vehicleType: string): Promise<string[]>;
  getEnginesByGeneration(brand: string, model: string, generation: string, vehicleType: string): Promise<string[]>;
  getVariantsByEngine(brand: string, model: string, generation: string, engine: string, vehicleType: string): Promise<Vehicle[]>;
  getVehicle(brand: string, model: string, generation: string, engine: string, variant: string, vehicleType: string): Promise<Vehicle | undefined>;
  getVehicleBySpecs(brand: string, model: string, generation: string, engine: string, vehicleType: string): Promise<Vehicle | undefined>;
  getAllVehicles(): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: string): Promise<void>;
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  
  // Admin operations
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  
  // Content management operations
  getAllPageContent(): Promise<PageContent[]>;
  getPageContent(pageName: string): Promise<PageContent | undefined>;
  upsertPageContent(content: InsertPageContent): Promise<PageContent>;
  
  // Services management operations
  getAllServices(): Promise<ServiceItem[]>;
  getService(id: string): Promise<ServiceItem | undefined>;
  createService(service: InsertServiceItem): Promise<ServiceItem>;
  updateService(id: string, service: Partial<InsertServiceItem>): Promise<ServiceItem | undefined>;
  deleteService(id: string): Promise<void>;
  
  getAllNavigationItems(): Promise<NavigationItem[]>;
  createNavigationItem(item: InsertNavigationItem): Promise<NavigationItem>;
  updateNavigationItem(id: string, item: Partial<InsertNavigationItem>): Promise<NavigationItem>;
  deleteNavigationItem(id: string): Promise<void>;
  
  getAllServiceItems(): Promise<ServiceItem[]>;
  createServiceItem(item: InsertServiceItem): Promise<ServiceItem>;
  updateServiceItem(id: string, item: Partial<InsertServiceItem>): Promise<ServiceItem>;
  deleteServiceItem(id: string): Promise<void>;
  
  getAllContactInfo(): Promise<ContactInfo[]>;
  createContactInfo(info: InsertContactInfo): Promise<ContactInfo>;
  updateContactInfo(id: string, info: Partial<InsertContactInfo>): Promise<ContactInfo>;
  deleteContactInfo(id: string): Promise<void>;
  
  // Power calculator data operations
  getAllPowerCalculatorData(): Promise<PowerCalculatorData[]>;
  getPowerCalculatorData(): Promise<PowerCalculatorData | undefined>;
  createPowerCalculatorData(data: InsertPowerCalculatorData): Promise<PowerCalculatorData>;
  updatePowerCalculatorData(id: string, data: Partial<InsertPowerCalculatorData>): Promise<PowerCalculatorData | undefined>;

  // Translation management
  getTranslations(language?: string, section?: string): Promise<Translation[]>;
  getTranslationById(id: string): Promise<Translation | undefined>;
  createTranslation(translation: InsertTranslation): Promise<Translation>;
  updateTranslation(id: string, translation: Partial<InsertTranslation>): Promise<Translation | undefined>;
  deleteTranslation(id: string): Promise<void>;

  // Language management
  getAllLanguages(): Promise<Language[]>;
  getLanguageByCode(code: string): Promise<Language | undefined>;
  createLanguage(language: InsertLanguage): Promise<Language>;
  updateLanguage(code: string, language: Partial<InsertLanguage>): Promise<Language | undefined>;
  deleteLanguage(code: string): Promise<void>;
  
  // Site identity operations
  getSiteIdentity(): Promise<SiteIdentity | undefined>;
  upsertSiteIdentity(identity: InsertSiteIdentity): Promise<SiteIdentity>;

  // Analytics methods
  trackPageView(data: InsertPageView): Promise<PageView>;
  trackClick(data: InsertClickEvent): Promise<ClickEvent>;
  trackVehicleSelection(data: InsertVehicleSelection): Promise<VehicleSelection>;
  upsertGeoLocation(data: InsertGeoLocation): Promise<GeoLocation>;
  
  // Analytics query methods
  getPageViewStats(startDate?: Date, endDate?: Date): Promise<any[]>;
  getClickStats(startDate?: Date, endDate?: Date): Promise<any[]>;
  getVehicleSelectionStats(startDate?: Date, endDate?: Date): Promise<any[]>;
  getGeoLocationStats(startDate?: Date, endDate?: Date): Promise<any[]>;
  
  // ZBOX content operations
  getZboxContent(): Promise<ZboxContent | undefined>;
  upsertZboxContent(content: InsertZboxContent): Promise<ZboxContent>;
  
  // Why Choose Us content operations
  getWhyChooseUsContent(): Promise<WhyChooseUsContent | undefined>;
  upsertWhyChooseUsContent(content: InsertWhyChooseUsContent): Promise<WhyChooseUsContent>;
  
  // Global contact info operations (centralized contact management)
  getGlobalContactInfo(): Promise<GlobalContactInfo | undefined>;
  upsertGlobalContactInfo(info: Partial<InsertGlobalContactInfo>): Promise<GlobalContactInfo>;
  
  // Contact page content operations
  getContactPageContent(): Promise<ContactPageContent | undefined>;
  upsertContactPageContent(content: Partial<InsertContactPageContent>): Promise<ContactPageContent>;
  
  // Contact content operations (multilingual)
  getContactContent(): Promise<ContactContent | undefined>;
  upsertContactContent(content: Partial<InsertContactContent>): Promise<ContactContent>;
}

export class DatabaseStorage implements IStorage {
  // Vehicle operations
  async getVehiclesByType(vehicleType: string): Promise<Vehicle[]> {
    const result = await db.select().from(vehicles).where(eq(vehicles.vehicleType, vehicleType));
    return result;
  }

  async getBrandsByType(vehicleType: string): Promise<string[]> {
    const result = await db
      .selectDistinct({ brand: vehicles.brand })
      .from(vehicles)
      .where(eq(vehicles.vehicleType, vehicleType));
    return result.map(r => r.brand).sort();
  }

  async getModelsByBrand(brand: string, vehicleType: string): Promise<string[]> {
    const result = await db
      .selectDistinct({ model: vehicles.model })
      .from(vehicles)
      .where(and(eq(vehicles.brand, brand), eq(vehicles.vehicleType, vehicleType)));
    return result.map(r => r.model).sort();
  }

  async getGenerationsByModel(brand: string, model: string, vehicleType: string): Promise<string[]> {
    const result = await db
      .selectDistinct({ generation: vehicles.generation })
      .from(vehicles)
      .where(and(
        eq(vehicles.brand, brand),
        eq(vehicles.model, model),
        eq(vehicles.vehicleType, vehicleType)
      ));
    return result.map(r => r.generation).sort();
  }

  async getEnginesByGeneration(brand: string, model: string, generation: string, vehicleType: string): Promise<string[]> {
    const result = await db
      .selectDistinct({ engine: vehicles.engine })
      .from(vehicles)
      .where(and(
        eq(vehicles.brand, brand),
        eq(vehicles.model, model),
        eq(vehicles.generation, generation),
        eq(vehicles.vehicleType, vehicleType)
      ));
    return result.map(r => r.engine).sort();
  }

  async getVariantsByEngine(brand: string, model: string, generation: string, engine: string, vehicleType: string): Promise<Vehicle[]> {
    const result = await db
      .select()
      .from(vehicles)
      .where(and(
        eq(vehicles.brand, brand),
        eq(vehicles.model, model),
        eq(vehicles.generation, generation),
        eq(vehicles.engine, engine),
        eq(vehicles.vehicleType, vehicleType)
      ));
    return result;
  }

  async getVehicle(brand: string, model: string, generation: string, engine: string, variant: string, vehicleType: string): Promise<Vehicle | undefined> {
    const [result] = await db
      .select()
      .from(vehicles)
      .where(and(
        eq(vehicles.brand, brand),
        eq(vehicles.model, model),
        eq(vehicles.generation, generation),
        eq(vehicles.engine, engine),
        eq(vehicles.variant, variant),
        eq(vehicles.vehicleType, vehicleType)
      ));
    return result;
  }

  async getVehicleBySpecs(brand: string, model: string, generation: string, engine: string, vehicleType: string): Promise<Vehicle | undefined> {
    const result = await db
      .select()
      .from(vehicles)
      .where(and(
        eq(vehicles.brand, brand),
        eq(vehicles.model, model),
        eq(vehicles.generation, generation),
        eq(vehicles.engine, engine),
        eq(vehicles.vehicleType, vehicleType)
      ))
      .limit(1);
    
    return result[0];
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles);
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const [result] = await db
      .insert(vehicles)
      .values(vehicle)
      .returning();
    return result;
  }

  async updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const [result] = await db
      .update(vehicles)
      .set(vehicle)
      .where(eq(vehicles.id, id))
      .returning();
    return result;
  }

  async deleteVehicle(id: string): Promise<void> {
    await db.delete(vehicles).where(eq(vehicles.id, id));
  }

  async createContactRequest(request: InsertContactRequest): Promise<ContactRequest> {
    const [result] = await db
      .insert(contactRequests)
      .values(request)
      .returning();
    return result;
  }

  // Admin operations
  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const [result] = await db
      .insert(adminUsers)
      .values({ ...user, password: hashedPassword })
      .returning();
    return result;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [result] = await db
      .select()
      .from(adminUsers)
      .where(and(eq(adminUsers.username, username), eq(adminUsers.isActive, true)));
    return result;
  }

  // Content management operations
  async getAllPageContent(): Promise<PageContent[]> {
    return await db.select().from(pageContent).where(eq(pageContent.isActive, true));
  }

  async getPageContent(pageName: string): Promise<PageContent | undefined> {
    const [result] = await db
      .select()
      .from(pageContent)
      .where(and(eq(pageContent.pageName, pageName), eq(pageContent.isActive, true)));
    return result;
  }

  async upsertPageContent(content: InsertPageContent): Promise<PageContent> {
    const [result] = await db
      .insert(pageContent)
      .values(content)
      .onConflictDoUpdate({
        target: pageContent.pageName,
        set: { ...content, updatedAt: new Date() }
      })
      .returning();
    return result;
  }

  async getAllNavigationItems(): Promise<NavigationItem[]> {
    return await db
      .select()
      .from(navigationItems)
      .where(eq(navigationItems.isActive, true))
      .orderBy(navigationItems.order);
  }

  async createNavigationItem(item: InsertNavigationItem): Promise<NavigationItem> {
    const [result] = await db
      .insert(navigationItems)
      .values(item)
      .returning();
    return result;
  }

  async updateNavigationItem(id: string, item: Partial<InsertNavigationItem>): Promise<NavigationItem> {
    const [result] = await db
      .update(navigationItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(navigationItems.id, id))
      .returning();
    return result;
  }

  async deleteNavigationItem(id: string): Promise<void> {
    await db
      .update(navigationItems)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(navigationItems.id, id));
  }

  // Services management operations  
  async getAllServices(): Promise<ServiceItem[]> {
    return await db
      .select()
      .from(serviceItems)
      .where(eq(serviceItems.isActive, true))
      .orderBy(serviceItems.order);
  }

  async getService(id: string): Promise<ServiceItem | undefined> {
    const [result] = await db
      .select()
      .from(serviceItems)
      .where(and(eq(serviceItems.id, id), eq(serviceItems.isActive, true)))
      .limit(1);
    return result;
  }

  async createService(service: InsertServiceItem): Promise<ServiceItem> {
    const [result] = await db
      .insert(serviceItems)
      .values(service)
      .returning();
    return result;
  }

  async updateService(id: string, service: Partial<InsertServiceItem>): Promise<ServiceItem | undefined> {
    const [result] = await db
      .update(serviceItems)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(serviceItems.id, id))
      .returning();
    return result;
  }

  async deleteService(id: string): Promise<void> {
    await db
      .update(serviceItems)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(serviceItems.id, id));
  }

  async getAllServiceItems(): Promise<ServiceItem[]> {
    return await db
      .select()
      .from(serviceItems)
      .where(eq(serviceItems.isActive, true))
      .orderBy(serviceItems.order);
  }

  async createServiceItem(item: InsertServiceItem): Promise<ServiceItem> {
    const [result] = await db
      .insert(serviceItems)
      .values(item)
      .returning();
    return result;
  }

  async updateServiceItem(id: string, item: Partial<InsertServiceItem>): Promise<ServiceItem> {
    const [result] = await db
      .update(serviceItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(serviceItems.id, id))
      .returning();
    return result;
  }

  async deleteServiceItem(id: string): Promise<void> {
    await db
      .update(serviceItems)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(serviceItems.id, id));
  }

  async getAllContactInfo(): Promise<ContactInfo[]> {
    return await db
      .select()
      .from(contactInfo)
      .where(eq(contactInfo.isActive, true))
      .orderBy(contactInfo.order);
  }

  async createContactInfo(info: InsertContactInfo): Promise<ContactInfo> {
    const [result] = await db
      .insert(contactInfo)
      .values(info)
      .returning();
    return result;
  }

  async updateContactInfo(id: string, info: Partial<InsertContactInfo>): Promise<ContactInfo> {
    const [result] = await db
      .update(contactInfo)
      .set({ ...info, updatedAt: new Date() })
      .where(eq(contactInfo.id, id))
      .returning();
    return result;
  }

  async deleteContactInfo(id: string): Promise<void> {
    await db
      .update(contactInfo)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(contactInfo.id, id));
  }

  // Power calculator data operations
  async getAllPowerCalculatorData(): Promise<PowerCalculatorData[]> {
    const result = await db.select().from(powerCalculatorData);
    return result;
  }

  async getPowerCalculatorData(): Promise<PowerCalculatorData | undefined> {
    const result = await db.select().from(powerCalculatorData).limit(1);
    return result[0];
  }

  async createPowerCalculatorData(data: InsertPowerCalculatorData): Promise<PowerCalculatorData> {
    const [result] = await db.insert(powerCalculatorData).values(data).returning();
    return result;
  }

  async updatePowerCalculatorData(id: string, data: Partial<InsertPowerCalculatorData>): Promise<PowerCalculatorData | undefined> {
    const [result] = await db.update(powerCalculatorData)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(powerCalculatorData.id, id))
      .returning();
    return result;
  }

  // Translation management
  async getTranslations(language?: string, section?: string): Promise<Translation[]> {
    let conditions = [];
    
    if (language) {
      conditions.push(eq(translations.language, language));
    }
    
    if (section) {
      conditions.push(eq(translations.section, section));
    }
    
    let query = db.select().from(translations);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(translations.section, translations.key);
  }

  async getTranslationById(id: string): Promise<Translation | undefined> {
    const [result] = await db
      .select()
      .from(translations)
      .where(eq(translations.id, id))
      .limit(1);
    return result;
  }

  async createTranslation(translation: InsertTranslation): Promise<Translation> {
    const [result] = await db
      .insert(translations)
      .values(translation)
      .returning();
    return result;
  }

  async updateTranslation(id: string, translation: Partial<InsertTranslation>): Promise<Translation | undefined> {
    const [result] = await db
      .update(translations)
      .set({ ...translation, updatedAt: new Date() })
      .where(eq(translations.id, id))
      .returning();
    return result;
  }

  async deleteTranslation(id: string): Promise<void> {
    await db
      .delete(translations)
      .where(eq(translations.id, id));
  }

  // Language management
  async getAllLanguages(): Promise<Language[]> {
    return await db
      .select()
      .from(languages)
      .orderBy(languages.name);
  }

  async getLanguageByCode(code: string): Promise<Language | undefined> {
    const [result] = await db
      .select()
      .from(languages)
      .where(eq(languages.code, code))
      .limit(1);
    return result;
  }

  async createLanguage(language: InsertLanguage): Promise<Language> {
    const [result] = await db
      .insert(languages)
      .values(language)
      .returning();
    return result;
  }

  async updateLanguage(code: string, language: Partial<InsertLanguage>): Promise<Language | undefined> {
    const [result] = await db
      .update(languages)
      .set({ ...language, updatedAt: new Date() })
      .where(eq(languages.code, code))
      .returning();
    return result;
  }

  async deleteLanguage(code: string): Promise<void> {
    await db
      .delete(languages)
      .where(eq(languages.code, code));
  }

  // Site identity operations
  async getSiteIdentity(): Promise<SiteIdentity | undefined> {
    const [identity] = await db.select().from(siteIdentity).limit(1);
    return identity;
  }

  async upsertSiteIdentity(identityData: InsertSiteIdentity): Promise<SiteIdentity> {
    // Check if identity exists
    const existing = await this.getSiteIdentity();
    
    if (existing) {
      // Update existing
      const [updated] = await db
        .update(siteIdentity)
        .set({ ...identityData, updatedAt: new Date() })
        .where(eq(siteIdentity.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new
      const [created] = await db
        .insert(siteIdentity)
        .values(identityData)
        .returning();
      return created;
    }
  }

  // Analytics methods
  async trackPageView(data: InsertPageView): Promise<PageView> {
    const [result] = await db.insert(pageViews).values(data).returning();
    return result;
  }

  async trackClick(data: InsertClickEvent): Promise<ClickEvent> {
    const [result] = await db.insert(clickEvents).values(data).returning();
    return result;
  }

  async trackVehicleSelection(data: InsertVehicleSelection): Promise<VehicleSelection> {
    const [result] = await db.insert(vehicleSelections).values(data).returning();
    return result;
  }

  async upsertGeoLocation(data: InsertGeoLocation): Promise<GeoLocation> {
    // Try to find existing geolocation for this IP
    const [existing] = await db
      .select()
      .from(geoLocations)
      .where(eq(geoLocations.ipAddress, data.ipAddress))
      .limit(1);

    if (existing) {
      // Update existing record with latest data
      const [updated] = await db
        .update(geoLocations)
        .set({ ...data, lastSeen: new Date() })
        .where(eq(geoLocations.ipAddress, data.ipAddress))
        .returning();
      return updated;
    } else {
      // Create new record
      const [created] = await db
        .insert(geoLocations)
        .values(data)
        .returning();
      return created;
    }
  }

  // Analytics query methods
  async getPageViewStats(startDate?: Date, endDate?: Date): Promise<any[]> {
    let query = db
      .select({
        pageName: pageViews.pageName,
        views: sql<number>`count(*)`,
        uniqueViews: sql<number>`count(distinct ${pageViews.sessionId})`,
        date: sql<string>`date(${pageViews.timestamp})`,
      })
      .from(pageViews);

    if (startDate || endDate) {
      const conditions = [];
      if (startDate) conditions.push(sql`${pageViews.timestamp} >= ${startDate}`);
      if (endDate) conditions.push(sql`${pageViews.timestamp} <= ${endDate}`);
      query = query.where(and(...conditions));
    }

    return await query
      .groupBy(pageViews.pageName, sql`date(${pageViews.timestamp})`)
      .orderBy(sql`date(${pageViews.timestamp})`, pageViews.pageName);
  }

  async getClickStats(startDate?: Date, endDate?: Date): Promise<any[]> {
    let query = db
      .select({
        element: clickEvents.element,
        clicks: sql<number>`count(*)`,
        pageName: clickEvents.pageName,
        date: sql<string>`date(${clickEvents.timestamp})`,
      })
      .from(clickEvents);

    if (startDate || endDate) {
      const conditions = [];
      if (startDate) conditions.push(sql`${clickEvents.timestamp} >= ${startDate}`);
      if (endDate) conditions.push(sql`${clickEvents.timestamp} <= ${endDate}`);
      query = query.where(and(...conditions));
    }

    return await query
      .groupBy(clickEvents.element, clickEvents.pageName, sql`date(${clickEvents.timestamp})`)
      .orderBy(sql`date(${clickEvents.timestamp})`, clickEvents.element);
  }

  async getVehicleSelectionStats(startDate?: Date, endDate?: Date): Promise<any[]> {
    let query = db
      .select({
        vehicleType: vehicleSelections.vehicleType,
        brand: vehicleSelections.brand,
        model: vehicleSelections.model,
        selections: sql<number>`count(*)`,
        date: sql<string>`date(${vehicleSelections.timestamp})`,
      })
      .from(vehicleSelections);

    if (startDate || endDate) {
      const conditions = [];
      if (startDate) conditions.push(sql`${vehicleSelections.timestamp} >= ${startDate}`);
      if (endDate) conditions.push(sql`${vehicleSelections.timestamp} <= ${endDate}`);
      query = query.where(and(...conditions));
    }

    return await query
      .groupBy(
        vehicleSelections.vehicleType,
        vehicleSelections.brand,
        vehicleSelections.model,
        sql`date(${vehicleSelections.timestamp})`
      )
      .orderBy(sql`count(*) desc`, sql`date(${vehicleSelections.timestamp})`);
  }

  async getGeoLocationStats(startDate?: Date, endDate?: Date): Promise<any[]> {
    let query = db
      .select({
        country: geoLocations.country,
        city: geoLocations.city,
        visitors: sql<number>`count(*)`,
        date: sql<string>`date(${geoLocations.lastSeen})`,
      })
      .from(geoLocations);

    if (startDate || endDate) {
      const conditions = [];
      if (startDate) conditions.push(sql`${geoLocations.lastSeen} >= ${startDate}`);
      if (endDate) conditions.push(sql`${geoLocations.lastSeen} <= ${endDate}`);
      query = query.where(and(...conditions));
    }

    return await query
      .groupBy(geoLocations.country, geoLocations.city, sql`date(${geoLocations.lastSeen})`)
      .orderBy(sql`count(*) desc`, sql`date(${geoLocations.lastSeen})`);
  }

  // ZBOX content operations
  async getZboxContent(): Promise<ZboxContent | undefined> {
    const [result] = await db.select().from(zboxContent).where(eq(zboxContent.isActive, true)).limit(1);
    return result || undefined;
  }

  async upsertZboxContent(contentData: InsertZboxContent): Promise<ZboxContent> {
    const existing = await this.getZboxContent();
    
    if (existing) {
      // Update existing
      const [updated] = await db
        .update(zboxContent)
        .set({ ...contentData, updatedAt: new Date() })
        .where(eq(zboxContent.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new
      const [created] = await db
        .insert(zboxContent)
        .values(contentData)
        .returning();
      return created;
    }
  }

  // Why Choose Us content operations
  async getWhyChooseUsContent(): Promise<WhyChooseUsContent | undefined> {
    const [result] = await db.select().from(whyChooseUsContent).where(eq(whyChooseUsContent.isActive, true)).limit(1);
    return result || undefined;
  }

  async upsertWhyChooseUsContent(contentData: InsertWhyChooseUsContent): Promise<WhyChooseUsContent> {
    const existing = await this.getWhyChooseUsContent();
    
    if (existing) {
      // Update existing
      const [updated] = await db
        .update(whyChooseUsContent)
        .set({ ...contentData, updatedAt: new Date() })
        .where(eq(whyChooseUsContent.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new
      const [created] = await db
        .insert(whyChooseUsContent)
        .values(contentData)
        .returning();
      return created;
    }
  }

  // Global contact info operations (centralized contact management)
  async getGlobalContactInfo(): Promise<GlobalContactInfo | undefined> {
    const [result] = await db.select().from(globalContactInfo).where(eq(globalContactInfo.isActive, true)).limit(1);
    return result || undefined;
  }

  async upsertGlobalContactInfo(infoData: Partial<InsertGlobalContactInfo>): Promise<GlobalContactInfo> {
    const existing = await this.getGlobalContactInfo();
    
    if (existing) {
      // Update existing
      const [updated] = await db
        .update(globalContactInfo)
        .set({ ...infoData, updatedAt: new Date() })
        .where(eq(globalContactInfo.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new with defaults if not provided
      const defaultContactInfo: InsertGlobalContactInfo = {
        phone: infoData.phone || '+371 123 456 789',
        whatsapp: infoData.whatsapp || '+371 123 456 789',
        email: infoData.email || 'info@chiptuningpro.lv',
        location: infoData.location || 'Riga, Latvia',
        workingHours: infoData.workingHours || 'Mon-Fri: 9:00-18:00',
        quotesEmail: infoData.quotesEmail || 'quotes@chiptuningpro.lv',
        ...infoData
      };
      
      const [created] = await db
        .insert(globalContactInfo)
        .values(defaultContactInfo)
        .returning();
      return created;
    }
  }

  // Contact page content operations
  async getContactPageContent(): Promise<ContactPageContent | undefined> {
    const [result] = await db.select().from(contactPageContent).where(eq(contactPageContent.isActive, true)).limit(1);
    return result || undefined;
  }

  async upsertContactPageContent(contentData: Partial<InsertContactPageContent>): Promise<ContactPageContent> {
    const existing = await this.getContactPageContent();
    
    if (existing) {
      // Update existing
      const [updated] = await db
        .update(contactPageContent)
        .set({ ...contentData, updatedAt: new Date() })
        .where(eq(contactPageContent.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new with defaults if not provided
      const defaultContent: InsertContactPageContent = {
        heroTitle: contentData.heroTitle || 'Get Your Custom ECU Tune',
        heroDescription: contentData.heroDescription || 'Ready to unlock your engine potential? Contact our experts for a personalized quote.',
        formTitle: contentData.formTitle || 'Request Your Quote',
        formDescription: contentData.formDescription || 'Fill out the form below and we will get back to you within 24 hours with a customized quote.',
        ...contentData
      };
      
      const [created] = await db
        .insert(contactPageContent)
        .values(defaultContent)
        .returning();
      return created;
    }
  }

  // Contact content operations (multilingual)
  async getContactContent(): Promise<ContactContent | undefined> {
    const [content] = await db.select().from(contactContent).limit(1);
    return content;
  }

  async upsertContactContent(contentData: Partial<InsertContactContent>): Promise<ContactContent> {
    const existing = await this.getContactContent();
    
    if (existing) {
      const [updated] = await db
        .update(contactContent)
        .set({
          ...contentData,
          updatedAt: new Date()
        })
        .where(eq(contactContent.id, existing.id))
        .returning();
      return updated;
    } else {
      const defaultContent = {
        phone: "+371 20123456",
        email: "info@chiptuningpro.lv",
        location: "Riga, Latvia",
        quotesEmail: "quotes@chiptuningpro.lv",
        heroTitleLv: "Saņemiet Bezmaksas Piedāvājumu",
        heroTitleRu: "Получите Бесплатное Предложение",
        heroTitleEn: "Get Your Free Quote",
        heroDescriptionLv: "Sazinieties ar mums profesionālu ECU čipošanas pakalpojumu saņemšanai",
        heroDescriptionRu: "Свяжитесь с нами для получения профессиональных услуг по чип-тюнингу ECU",
        heroDescriptionEn: "Contact us for professional ECU tuning services",
        formTitleLv: "Pieprasiet Savu Piedāvājumu",
        formTitleRu: "Запросите Ваше Предложение",
        formTitleEn: "Request Your Quote",
        formDescriptionLv: "Aizpildiet formu zemāk un mēs ar jums sazināsimies 24 stundu laikā ar personalizētu piedāvājumu.",
        formDescriptionRu: "Заполните форму ниже, и мы свяжемся с вами в течение 24 часов с персонализированным предложением.",
        formDescriptionEn: "Fill out the form below and we will get back to you within 24 hours with a personalized quote.",
        ...contentData
      };
      
      const [created] = await db
        .insert(contactContent)
        .values(defaultContent)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();

// Initialize database with sample data if empty
async function initializeDatabase() {
  try {
    // Initialize JVK Pro comprehensive vehicle database if empty
    const { populateJVKVehicles } = await import('./populate-jvk-vehicles');
    await populateJVKVehicles();
    
    // Create default admin user if none exists
    const existingAdmin = await db.select().from(adminUsers).limit(1);
    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.insert(adminUsers).values({
        username: 'admin',
        password: hashedPassword
      });
      console.log('Default admin user created (username: admin, password: admin123)');
    }

  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Call initialization
initializeDatabase();