import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  generation: text("generation").notNull(),
  engine: text("engine").notNull(),
  variant: text("variant").notNull(),
  vehicleType: text("vehicle_type").notNull(), // 'car', 'truck', 'tractor'
  originalPower: integer("original_power").notNull(), // HP
  originalTorque: integer("original_torque").notNull(), // Nm
  stage1Power: integer("stage1_power").notNull(), // HP
  stage1Torque: integer("stage1_torque").notNull(), // Nm
  stage2Power: integer("stage2_power"), // HP (optional)
  stage2Torque: integer("stage2_torque"), // Nm (optional)
});

export const contactRequests = pgTable("contact_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  vehicleDetails: text("vehicle_details"),
  serviceRequired: text("service_required").notNull(),
  additionalInfo: text("additional_info"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  password: text("password").notNull(), // hashed password
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content management tables
export const pageContent = pgTable("page_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageName: varchar("page_name").unique().notNull(), // 'home', 'services', etc.
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  content: jsonb("content").notNull(), // flexible content structure
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const navigationItems = pgTable("navigation_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  label: text("label").notNull(),
  href: text("href").notNull(),
  translations: jsonb("translations"), // Object with language codes as keys
  icon: text("icon"),
  order: integer("order").notNull(),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceItems = pgTable("service_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  translations: jsonb("translations"), // Object with language codes as keys for title/description/features/price
  icon: text("icon").notNull(),
  image: text("image"),
  features: jsonb("features").notNull(), // array of feature strings
  price: text("price").notNull(),
  order: integer("order").notNull(),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Global Contact Information - Single source of truth for all contact details
export const globalContactInfo = pgTable("global_contact_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull(),
  location: text("location").notNull(),
  workingHours: text("working_hours").notNull(),
  quotesEmail: text("quotes_email").notNull(), // Email where quote requests are sent
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact Section Content - Following "Why Choose Us" pattern
export const contactContent = pgTable("contact_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull().default("Sazinieties ar mums"),
  description: text("description").notNull().default("Saņemiet profesionālu konsultāciju un bezmaksas piedāvājumu"),
  formTitle: text("form_title").notNull().default("Pieprasīt piedāvājumu"),
  formDescription: text("form_description").notNull().default("Aizpildiet formu zemāk un mēs sazināsimies ar jums 24 stundu laikā"),
  translations: jsonb("translations").$type<{
    lv: {
      title: string;
      description: string;
      formTitle: string;
      formDescription: string;
    };
    ru: {
      title: string;
      description: string;
      formTitle: string;
      formDescription: string;
    };
    en: {
      title: string;
      description: string;
      formTitle: string;
      formDescription: string;
    };
  }>().default({
    lv: {
      title: "Sazinieties ar mums",
      description: "Saņemiet profesionālu konsultāciju un bezmaksas piedāvājumu",
      formTitle: "Pieprasīt piedāvājumu",
      formDescription: "Aizpildiet formu zemāk un mēs sazināsimies ar jums 24 stundu laikā"
    },
    ru: {
      title: "Свяжитесь с нами",
      description: "Получите профессиональную консультацию и бесплатное предложение",
      formTitle: "Запросить предложение",
      formDescription: "Заполните форму ниже, и мы свяжемся с вами в течение 24 часов"
    },
    en: {
      title: "Contact Us",
      description: "Get professional consultation and free quote",
      formTitle: "Request Quote",
      formDescription: "Fill out the form below and we will get back to you within 24 hours"
    }
  }),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Keep old contactInfo for backward compatibility
export const contactInfo = pgTable("contact_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'phone', 'email', 'whatsapp', 'address'
  title: text("title").notNull(),
  content: text("content").notNull(),
  subtitle: text("subtitle"),
  icon: text("icon").notNull(),
  bgColor: text("bg_color").notNull(),
  order: integer("order").notNull(),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const powerCalculatorData = pgTable("power_calculator_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description").notNull(),
  features: jsonb("features").notNull(), // array of feature strings
  buttonText: text("button_text").notNull().default("Check Your Vehicle Power"),
  backgroundImage: text("background_image"),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const zboxContent = pgTable("zbox_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  translations: jsonb("translations"), // Object with language codes as keys for title/description/features/price/button
  features: jsonb("features").notNull(), // array of feature strings
  price: text("price").notNull(),
  priceNote: text("price_note"),
  buttonText: text("button_text").notNull().default("Learn More About ZBOX"),
  image: text("image"),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const whyChooseUsContent = pgTable("why_choose_us_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  translations: jsonb("translations"), // Object with language codes as keys for all fields
  features: jsonb("features").notNull(), // array of feature objects with icon, title, description
  workshopTitle: text("workshop_title").notNull(),
  workshopDescription: text("workshop_description").notNull(),
  workshopImage: text("workshop_image"),
  workshopFeatures: jsonb("workshop_features").notNull(), // array of workshop feature strings
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
});

export const insertContactRequestSchema = createInsertSchema(contactRequests).omit({
  id: true,
  createdAt: true,
});

export const insertZboxContentSchema = createInsertSchema(zboxContent).omit({
  id: true,
  updatedAt: true,
});

export const insertWhyChooseUsContentSchema = createInsertSchema(whyChooseUsContent).omit({
  id: true,
  updatedAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export const insertPageContentSchema = createInsertSchema(pageContent).omit({
  id: true,
  updatedAt: true,
});

export const insertNavigationItemSchema = createInsertSchema(navigationItems).omit({
  id: true,
  updatedAt: true,
});

export const insertServiceItemSchema = createInsertSchema(serviceItems).omit({
  id: true,
  updatedAt: true,
});

export const insertGlobalContactInfoSchema = createInsertSchema(globalContactInfo).omit({
  id: true,
  updatedAt: true,
});

export const insertContactPageContentSchema = createInsertSchema(contactPageContent).omit({
  id: true,
  updatedAt: true,
});

export const insertContactInfoSchema = createInsertSchema(contactInfo).omit({
  id: true,
  updatedAt: true,
});

export const insertPowerCalculatorDataSchema = createInsertSchema(powerCalculatorData).omit({
  id: true,
  updatedAt: true,
});

export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;
export type PowerCalculatorData = typeof powerCalculatorData.$inferSelect;
export type InsertPowerCalculatorData = z.infer<typeof insertPowerCalculatorDataSchema>;
export type ContactRequest = typeof contactRequests.$inferSelect;

// Site Identity table for branding customization
export const siteIdentity = pgTable("site_identity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  logoUrl: varchar("logo_url"),
  faviconUrl: varchar("favicon_url"),
  heroImageUrl: varchar("hero_image_url"),
  primaryColor: varchar("primary_color").default("#3b82f6"),
  secondaryColor: varchar("secondary_color").default("#1e40af"),
  accentColor: varchar("accent_color").default("#f59e0b"),
  backgroundColor: varchar("background_color").default("#000000"),
  textColor: varchar("text_color").default("#ffffff"),
  companyName: varchar("company_name").default("ChipTuning PRO"),
  tagline: varchar("tagline"),
  heroTitle: varchar("hero_title"),
  heroSubtitle: varchar("hero_subtitle"),
  clientCount: integer("client_count").default(500),
  projectCount: integer("project_count").default(1200),
  experienceYears: integer("experience_years").default(10),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteIdentitySchema = createInsertSchema(siteIdentity);
export type InsertSiteIdentity = z.infer<typeof insertSiteIdentitySchema>;
export type SiteIdentity = typeof siteIdentity.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertPageContent = z.infer<typeof insertPageContentSchema>;
export type PageContent = typeof pageContent.$inferSelect;
export type InsertNavigationItem = z.infer<typeof insertNavigationItemSchema>;
export type NavigationItem = typeof navigationItems.$inferSelect;
export type InsertServiceItem = z.infer<typeof insertServiceItemSchema>;
export type ServiceItem = typeof serviceItems.$inferSelect;
export type InsertGlobalContactInfo = z.infer<typeof insertGlobalContactInfoSchema>;
export type GlobalContactInfo = typeof globalContactInfo.$inferSelect;
export type InsertContactPageContent = z.infer<typeof insertContactPageContentSchema>;
export type ContactPageContent = typeof contactPageContent.$inferSelect;
export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type ContactInfo = typeof contactInfo.$inferSelect;
export type ZboxContent = typeof zboxContent.$inferSelect;
export type InsertZboxContent = z.infer<typeof insertZboxContentSchema>;
export type WhyChooseUsContent = typeof whyChooseUsContent.$inferSelect;
export type InsertWhyChooseUsContent = z.infer<typeof insertWhyChooseUsContentSchema>;

// Translations table for multilingual support
export const translations = pgTable("translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").notNull(),
  language: varchar("language").notNull(),
  value: text("value").notNull(),
  section: varchar("section").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Languages table for managing available languages
export const languages = pgTable("languages", {
  code: varchar("code").primaryKey(), // e.g., 'en', 'lv', 'ru'
  name: varchar("name").notNull(), // e.g., 'English', 'Latvian'
  nativeName: varchar("native_name").notNull(), // e.g., 'English', 'Latviešu'
  isActive: boolean("is_active").default(true),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLanguageSchema = createInsertSchema(languages).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type Translation = typeof translations.$inferSelect;
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;
export type Language = typeof languages.$inferSelect;

// Analytics and tracking tables
export const pageViews = pgTable("page_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageName: text("page_name").notNull(), // '/', '/services', etc.
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  country: text("country"),
  city: text("city"),
  sessionId: text("session_id"),
  referrer: text("referrer"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const clickEvents = pgTable("click_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  element: text("element").notNull(), // 'cta-button', 'service-card', etc.
  pageName: text("page_name").notNull(),
  elementText: text("element_text"),
  targetUrl: text("target_url"),
  sessionId: text("session_id"),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const vehicleSelections = pgTable("vehicle_selections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleType: text("vehicle_type").notNull(), // 'car', 'truck', 'tractor'
  brand: text("brand").notNull(),
  model: text("model"),
  generation: text("generation"),
  engine: text("engine"),
  variant: text("variant"),
  sessionId: text("session_id"),
  ipAddress: text("ip_address"),
  country: text("country"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const geoLocations = pgTable("geo_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ipAddress: text("ip_address").notNull(),
  country: text("country"),
  countryCode: text("country_code"),
  city: text("city"),
  region: text("region"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  timezone: text("timezone"),
  isp: text("isp"),
  lastSeen: timestamp("last_seen").defaultNow(),
});

// Analytics schema validations
export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
  timestamp: true,
});

export const insertClickEventSchema = createInsertSchema(clickEvents).omit({
  id: true,
  timestamp: true,
});

export const insertVehicleSelectionSchema = createInsertSchema(vehicleSelections).omit({
  id: true,
  timestamp: true,
});

export const insertGeoLocationSchema = createInsertSchema(geoLocations).omit({
  id: true,
  lastSeen: true,
});

// Analytics types
export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type ClickEvent = typeof clickEvents.$inferSelect;
export type InsertClickEvent = z.infer<typeof insertClickEventSchema>;
export type VehicleSelection = typeof vehicleSelections.$inferSelect;
export type InsertVehicleSelection = z.infer<typeof insertVehicleSelectionSchema>;
export type GeoLocation = typeof geoLocations.$inferSelect;
export type InsertGeoLocation = z.infer<typeof insertGeoLocationSchema>;

// Contact Content Management - with multilingual support
export const contactContent = pgTable("contact_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Global contact information
  phone: text("phone"),
  email: text("email"),
  location: text("location"),
  quotesEmail: text("quotes_email"),
  // Multilingual content - hero section
  heroTitleLv: text("hero_title_lv"),
  heroTitleRu: text("hero_title_ru"),
  heroTitleEn: text("hero_title_en"),
  heroDescriptionLv: text("hero_description_lv"),
  heroDescriptionRu: text("hero_description_ru"),
  heroDescriptionEn: text("hero_description_en"),
  // Multilingual content - form section
  formTitleLv: text("form_title_lv"),
  formTitleRu: text("form_title_ru"),
  formTitleEn: text("form_title_en"),
  formDescriptionLv: text("form_description_lv"),
  formDescriptionRu: text("form_description_ru"),
  formDescriptionEn: text("form_description_en"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact content schema validations
export const insertContactContentSchema = createInsertSchema(contactContent).omit({
  id: true,
  updatedAt: true,
});

export const contactContentSchema = insertContactContentSchema.partial();

// Contact content types
export type ContactContent = typeof contactContent.$inferSelect;
export type InsertContactContent = z.infer<typeof insertContactContentSchema>;
