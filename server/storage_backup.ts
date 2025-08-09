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
  type Translation,
  type InsertTranslation,
  type Language,
  type InsertLanguage,
  vehicles,
  contactRequests,
  adminUsers,
  pageContent,
  navigationItems,
  serviceItems,
  contactInfo,
  translations,
  languages
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
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

  // Translation management
  getTranslations(language?: string, section?: string): Promise<Translation[]>;
  getTranslationById(id: string): Promise<Translation | undefined>;
  createTranslation(translation: InsertTranslation): Promise<Translation>;
  updateTranslation(id: string, translation: Partial<InsertTranslation>): Promise<Translation | undefined>;
  deleteTranslation(id: string): Promise<void>;

  // Language management
  getLanguages(): Promise<Language[]>;
  getLanguageByCode(code: string): Promise<Language | undefined>;
  createLanguage(language: InsertLanguage): Promise<Language>;
  updateLanguage(code: string, language: Partial<InsertLanguage>): Promise<Language | undefined>;
  deleteLanguage(code: string): Promise<void>;
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
  async getLanguages(): Promise<Language[]> {
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
}

// Initialize database with sample data if empty
async function initializeDatabase() {
  try {
    // Check if we have any vehicles in the database
    const existingVehicles = await db.select().from(vehicles).limit(1);
    
    if (existingVehicles.length === 0) {
      // Sample vehicle data with proper hierarchy for initialization
      const carData: InsertVehicle[] = [
        // Audi A4 B8 Generation
        { brand: "Audi", model: "A4", generation: "B8 (2008-2015)", engine: "2.0 TDI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 320, stage1Power: 185, stage1Torque: 385, stage2Power: 210, stage2Torque: 420 },
        { brand: "Audi", model: "A4", generation: "B8 (2008-2015)", engine: "3.0 TDI", variant: "272hp", vehicleType: "car", originalPower: 272, originalTorque: 600, stage1Power: 320, stage1Torque: 720, stage2Power: 360, stage2Torque: 800 },
        // BMW 3 Series F30
        { brand: "BMW", model: "3 Series", generation: "F30 (2012-2018)", engine: "2.0d", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
        // Mercedes C-Class W204
        { brand: "Mercedes-Benz", model: "C-Class", generation: "W204 (2007-2014)", engine: "2.2 CDI", variant: "194hp", vehicleType: "car", originalPower: 194, originalTorque: 400, stage1Power: 240, stage1Torque: 480, stage2Power: 275, stage2Torque: 520 }
      ];
      
      await db.insert(vehicles).values(carData);
      console.log('Database initialized with sample vehicle data');
    }
    
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

export const storage = new DatabaseStorage();

// Initialize database with sample data if empty
initializeDatabase();

async function initializeDatabase() {
  try {
    // Check if we have any vehicles in the database
    const existingVehicles = await db.select().from(vehicles).limit(1);
    
    if (existingVehicles.length === 0) {
      console.log('Initializing database with sample data...');
      
      await db.insert(vehicles).values(carData);
      console.log('Database initialized with sample vehicle data');
    }
    
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

    // Initialize default page content from existing website
    const existingPages = await db.select().from(pageContent).limit(1);
    if (existingPages.length === 0) {
      const defaultPages: InsertPageContent[] = [
        {
          pageName: 'home',
          title: 'ChipTuning PRO - Professional ECU Tuning Services',
          subtitle: 'Professional ECU Tuning & Performance Enhancement',
          content: {
            hero: {
              title: 'ChipTuning PRO',
              subtitle: 'Professional ECU Tuning & Performance Enhancement',
              description: 'Unlock your vehicle\'s true potential with our expert chiptuning services. We provide Stage 1 & Stage 2 tuning, DPF/EGR removal, and professional ZBOX devices for maximum performance gains.',
              buttons: [
                { text: 'Check Vehicle Power', href: '#power-checker', type: 'primary' },
                { text: 'Our Services', href: '#services', type: 'secondary' }
              ]
            },
            stats: [
              { number: '500+', label: 'Vehicles Tuned' },
              { number: '15+', label: 'Years Experience' },
              { number: '100%', label: 'Satisfaction Rate' }
            ]
          },
          isActive: true
        },
        {
          pageName: 'services',
          title: 'Professional Tuning Services - ChipTuning PRO',
          subtitle: 'Comprehensive ECU tuning services for all vehicle types',
          content: {
            intro: {
              title: 'Our Professional Services',
              description: 'Comprehensive ECU tuning services including Stage 1/2 chiptuning, DPF/EGR removal, and ZBOX devices.'
            },
            services: [
              {
                title: 'Stage 1 Chiptuning',
                icon: '🚗',
                description: 'Optimize your engine performance with our Stage 1 ECU remapping.',
                benefits: ['+25-35% Power', '+30-40% Torque', 'Better Fuel Economy'],
                price: 'From €299'
              },
              {
                title: 'Stage 2 Chiptuning',
                icon: '⚡',
                description: 'Maximum performance gains with Stage 2 tuning.',
                benefits: ['+40-50% Power', '+50-60% Torque', 'Track-Ready Performance'],
                price: 'From €499'
              }
            ]
          },
          isActive: true
        },
        {
          pageName: 'about',
          title: 'About ChipTuning PRO - Expert ECU Tuning Services',
          subtitle: '15+ years of professional ECU tuning experience',
          content: {
            intro: {
              title: 'About ChipTuning PRO',
              description: 'With over 15 years of experience in automotive performance tuning, ChipTuning PRO has established itself as a leading provider of professional ECU remapping and performance enhancement services.'
            },
            features: [
              {
                title: 'Professional Equipment',
                description: 'State-of-the-art diagnostic tools and tuning software'
              },
              {
                title: 'Certified Technicians',
                description: 'Experienced professionals with industry certifications'
              },
              {
                title: 'Quality Guarantee',
                description: 'All work backed by our comprehensive warranty'
              },
              {
                title: 'Customer Support',
                description: 'Ongoing support and maintenance services'
              }
            ]
          },
          isActive: true
        }
      ];
      
      await db.insert(pageContent).values(defaultPages);
      console.log('Default page content initialized');
    }

    // Initialize default navigation items
    const existingNav = await db.select().from(navigationItems).limit(1);
    if (existingNav.length === 0) {
      const defaultNav: InsertNavigationItem[] = [
        { label: 'Home', href: '/', order: 1, isActive: true },
        { label: 'Services', href: '#services', order: 2, isActive: true },
        { label: 'Power Checker', href: '#power-checker', order: 3, isActive: true },
        { label: 'ZBOX Device', href: '#zbox', order: 4, isActive: true },
        { label: 'Contact', href: '#contact', order: 5, isActive: true }
      ];
      
      await db.insert(navigationItems).values(defaultNav);
      console.log('Default navigation initialized');
    }

    // Initialize default services
    const existingServices = await db.select().from(serviceItems).limit(1);
    if (existingServices.length === 0) {
      const defaultServices: InsertServiceItem[] = [
        {
          title: 'Stage 1 Chiptuning',
          description: 'Optimize your engine performance with ECU remapping. Increase power and torque while maintaining reliability.',
          price: 'From €299',
          features: ['25-35% Power Increase', '30-40% Torque Increase', 'Improved Fuel Economy', 'Maintains Reliability'],
          icon: '🚗',
          order: 1,
          isActive: true
        },
        {
          title: 'Stage 2 Chiptuning',
          description: 'Maximum performance gains with advanced tuning requiring hardware modifications.',
          price: 'From €499',
          features: ['40-50% Power Increase', '50-60% Torque Increase', 'Track-Ready Performance', 'Hardware Upgrades Required'],
          icon: '⚡',
          order: 2,
          isActive: true
        },
        {
          title: 'DPF/EGR Removal',
          description: 'Remove restrictive emissions components for improved performance and reduced maintenance.',
          price: 'From €399',
          features: ['No More DPF Issues', 'Improved Reliability', 'Lower Maintenance Costs', 'Better Performance'],
          icon: '🔧',
          order: 3,
          isActive: true
        },
        {
          title: 'ZBOX Tuning Device',
          description: 'Professional tuning device with smartphone app control and real-time monitoring.',
          price: '€899',
          features: ['Multiple Power Maps', 'Smartphone Control', 'Real-time Monitoring', 'Easy Installation'],
          icon: '📱',
          order: 4,
          isActive: true
        }
      ];
      
      await db.insert(serviceItems).values(defaultServices);
      console.log('Default services initialized');
    }

    // Initialize default contact information
    const existingContact = await db.select().from(contactInfo).limit(1);
    if (existingContact.length === 0) {
      const defaultContact: InsertContactInfo[] = [
        { 
          type: 'phone', 
          title: 'Main Phone', 
          content: '+371 12345678', 
          icon: '📞', 
          bgColor: 'bg-blue-500', 
          order: 1, 
          isActive: true 
        },
        { 
          type: 'email', 
          title: 'Email', 
          content: 'info@chiptuningpro.lv', 
          icon: '✉️', 
          bgColor: 'bg-green-500', 
          order: 2, 
          isActive: true 
        },
        { 
          type: 'address', 
          title: 'Address', 
          content: 'Riga, Latvia\nProfessional Tuning Center', 
          icon: '📍', 
          bgColor: 'bg-red-500', 
          order: 3, 
          isActive: true 
        },
        { 
          type: 'hours', 
          title: 'Business Hours', 
          content: 'Monday - Friday: 9:00 - 18:00\nSaturday: 9:00 - 16:00\nSunday: Closed', 
          icon: '🕒', 
          bgColor: 'bg-purple-500', 
          order: 4, 
          isActive: true 
        }
      ];
      
      await db.insert(contactInfo).values(defaultContact);
      console.log('Default contact information initialized');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize the database
initializeDatabase();

export const storage = new DatabaseStorage();
