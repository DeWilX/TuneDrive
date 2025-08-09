import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactRequestSchema,
  insertPageContentSchema,
  insertNavigationItemSchema,
  insertServiceItemSchema,
  insertContactInfoSchema,
  insertVehicleSchema,
  insertPowerCalculatorDataSchema,
  insertTranslationSchema,
  insertLanguageSchema,
  insertPageViewSchema,
  insertClickEventSchema,
  insertVehicleSelectionSchema,
  insertGeoLocationSchema
} from "@shared/schema";
import { login, requireAuth, type AuthRequest } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Vehicle data routes
  app.get("/api/vehicles/brands/:vehicleType", async (req, res) => {
    try {
      const { vehicleType } = req.params;
      const brands = await storage.getBrandsByType(vehicleType);
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  app.get("/api/vehicles/models/:vehicleType/:brand", async (req, res) => {
    try {
      const { vehicleType, brand } = req.params;
      const models = await storage.getModelsByBrand(brand, vehicleType);
      res.json(models);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch models" });
    }
  });

  app.get("/api/vehicles/generations/:vehicleType/:brand/:model", async (req, res) => {
    try {
      const { vehicleType, brand, model } = req.params;
      const generations = await storage.getGenerationsByModel(brand, model, vehicleType);
      res.json(generations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch generations" });
    }
  });

  app.get("/api/vehicles/engines/:vehicleType/:brand/:model/:generation", async (req, res) => {
    try {
      const { vehicleType, brand, model, generation } = req.params;
      const engines = await storage.getEnginesByGeneration(brand, model, generation, vehicleType);
      res.json(engines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch engines" });
    }
  });

  // Power data endpoint for the enhanced database structure
  app.get("/api/vehicles/power/:vehicleType/:brand/:model/:generation/:engine", async (req, res) => {
    try {
      const { vehicleType, brand, model, generation, engine } = req.params;
      
      const decodedGeneration = decodeURIComponent(generation);
      const decodedEngine = decodeURIComponent(engine);
      
      const vehicle = await storage.getVehicleBySpecs(brand, model, decodedGeneration, decodedEngine, vehicleType);
      
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      const powerData = {
        originalPower: vehicle.originalPower,
        originalTorque: vehicle.originalTorque,
        stage1Power: vehicle.stage1Power,
        stage1Torque: vehicle.stage1Torque,
        stage2Power: vehicle.stage2Power,
        stage2Torque: vehicle.stage2Torque
      };
      
      res.json(powerData);
    } catch (error) {
      console.error('Power API error:', error);
      res.status(500).json({ message: "Failed to fetch power data" });
    }
  });

  app.get("/api/vehicles/variants/:vehicleType/:brand/:model/:generation/:engine", async (req, res) => {
    try {
      const { vehicleType, brand, model, generation, engine } = req.params;
      const variants = await storage.getVariantsByEngine(brand, model, generation, engine, vehicleType);
      res.json(variants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch variants" });
    }
  });

  app.get("/api/vehicles/:vehicleType/:brand/:model/:generation/:engine/:variant", async (req, res) => {
    try {
      const { vehicleType, brand, model, generation, engine, variant } = req.params;
      const vehicle = await storage.getVehicle(brand, model, generation, engine, variant, vehicleType);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicle" });
    }
  });

  // Contact form route
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactRequestSchema.parse(req.body);
      const contactRequest = await storage.createContactRequest(validatedData);
      
      // Here you could add email sending functionality
      // await sendEmail(contactRequest);
      
      res.status(201).json({ 
        message: "Contact request submitted successfully",
        id: contactRequest.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to submit contact request" });
    }
  });

  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const result = await login(username, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  });

  // Admin content management routes
  app.get("/api/admin/page-content", requireAuth, async (req: AuthRequest, res) => {
    try {
      const content = await storage.getAllPageContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page content" });
    }
  });

  app.post("/api/admin/page-content", requireAuth, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertPageContentSchema.parse(req.body);
      const content = await storage.upsertPageContent(validatedData);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save page content" });
    }
  });

  // Initialize default page content
  app.post("/api/admin/init-default-content", requireAuth, async (req: AuthRequest, res) => {
    try {
      const defaultPages = [
        {
          pageName: 'hero-section',
          title: 'Hero Section',
          subtitle: 'Main homepage hero section with title, subtitle and CTA',
          content: {
            htmlContent: '<h1>Professional ECU Tuning</h1><p>Unlock your vehicle\'s true potential with our professional ECU tuning services. Experience enhanced performance, improved fuel efficiency, and optimal engine behavior.</p><a href="#services" class="cta-button">Explore Our Services</a>',
            sections: []
          },
          isActive: true
        },
        {
          pageName: 'about-section',
          title: 'About Section',
          subtitle: 'About us content and company information',
          content: {
            htmlContent: '<h2>About ChipTuning PRO</h2><p>With years of experience in automotive performance optimization, we specialize in professional ECU tuning services that deliver measurable results. Our expert technicians use state-of-the-art equipment and proven methodologies to safely enhance your vehicle\'s performance.</p><ul><li>✓ Certified ECU specialists</li><li>✓ Latest tuning technology</li><li>✓ Performance guarantee</li><li>✓ Comprehensive aftercare</li></ul>',
            sections: []
          },
          isActive: true
        },
        {
          pageName: 'services-overview', 
          title: 'Services Overview',
          subtitle: 'Services section introduction content',
          content: {
            htmlContent: '<h2>Our Tuning Services</h2><p>We offer comprehensive ECU tuning solutions tailored to your specific vehicle and performance goals. From basic Stage 1 modifications to advanced performance packages, our services deliver proven results.</p>',
            sections: []
          },
          isActive: true
        },
        {
          pageName: 'power-calculator-section',
          title: 'Power Calculator Section', 
          subtitle: 'Power calculator introduction and description',
          content: {
            htmlContent: '<h2>Check Your Vehicle\'s Power Potential</h2><p>Discover what performance improvements our tuning services can achieve for your specific vehicle. Our power calculator provides accurate estimates based on your car\'s make, model, and engine specifications.</p><p>Simply select your vehicle details below to see potential power and torque gains from our Stage 1 and Stage 2 tuning programs.</p>',
            sections: []
          },
          isActive: true
        },
        {
          pageName: 'testimonials-section',
          title: 'Testimonials Section',
          subtitle: 'Customer testimonials and reviews', 
          content: {
            htmlContent: '<h2>What Our Customers Say</h2><blockquote><p>"Amazing results! My BMW gained 40hp and the fuel economy actually improved. Professional service from start to finish."</p><cite>— Mark S., BMW 320d Owner</cite></blockquote><blockquote><p>"The team at ChipTuning PRO transformed my Audi. The power delivery is smoother and I can feel the difference immediately."</p><cite>— Sarah M., Audi A4 Owner</cite></blockquote>',
            sections: []
          },
          isActive: true
        },
        {
          pageName: 'contact-section',
          title: 'Contact Section',
          subtitle: 'Contact form and contact information',
          content: {
            htmlContent: '<h2>Get Your Free Consultation</h2><p>Ready to unlock your vehicle\'s potential? Contact us today for a free consultation and personalized tuning recommendation.</p><p>Our experts will analyze your vehicle and driving requirements to recommend the optimal tuning package for maximum performance and reliability.</p>',
            sections: []
          },
          isActive: true
        },
        {
          pageName: 'footer-content',
          title: 'Footer Content',
          subtitle: 'Footer links, legal information and company details',
          content: {
            htmlContent: '<div class="footer-content"><div class="footer-section"><h4>ChipTuning PRO</h4><p>Professional ECU tuning services for enhanced vehicle performance.</p></div><div class="footer-section"><h4>Services</h4><ul><li>Stage 1 Tuning</li><li>Stage 2 Tuning</li><li>EGR/DPF Removal</li><li>ZBOX Solutions</li></ul></div><div class="footer-section"><h4>Legal</h4><ul><li><a href="/privacy-policy">Privacy Policy</a></li><li><a href="/terms-of-service">Terms of Service</a></li><li><a href="/warranty">Warranty Information</a></li></ul></div></div>',
            sections: []
          },
          isActive: true
        }
      ];

      const createdPages = [];
      for (const pageData of defaultPages) {
        const content = await storage.upsertPageContent(pageData as any);
        createdPages.push(content);
      }

      res.json({ 
        message: 'Default content initialized successfully',
        pages: createdPages
      });
    } catch (error) {
      console.error('Error initializing default content:', error);
      res.status(500).json({ message: 'Failed to initialize default content' });
    }
  });

  app.get("/api/admin/navigation", requireAuth, async (req: AuthRequest, res) => {
    try {
      const items = await storage.getAllNavigationItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch navigation items" });
    }
  });

  app.post("/api/admin/navigation", requireAuth, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertNavigationItemSchema.parse(req.body);
      const item = await storage.createNavigationItem(validatedData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create navigation item" });
    }
  });

  app.put("/api/admin/navigation/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertNavigationItemSchema.partial().parse(req.body);
      const item = await storage.updateNavigationItem(id, validatedData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update navigation item" });
    }
  });

  app.delete("/api/admin/navigation/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      await storage.deleteNavigationItem(id);
      res.json({ message: "Navigation item deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete navigation item" });
    }
  });

  app.get("/api/admin/services", requireAuth, async (req: AuthRequest, res) => {
    try {
      const services = await storage.getAllServiceItems();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post("/api/admin/services", requireAuth, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertServiceItemSchema.parse(req.body);
      const service = await storage.createServiceItem(validatedData);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  app.put("/api/admin/services/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertServiceItemSchema.partial().parse(req.body);
      const service = await storage.updateServiceItem(id, validatedData);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update service" });
    }
  });

  app.delete("/api/admin/services/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      await storage.deleteServiceItem(id);
      res.json({ message: "Service deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  app.get("/api/admin/contact-info", requireAuth, async (req: AuthRequest, res) => {
    try {
      const contactInfo = await storage.getAllContactInfo();
      res.json(contactInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact info" });
    }
  });

  app.post("/api/admin/contact-info", requireAuth, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertContactInfoSchema.parse(req.body);
      const info = await storage.createContactInfo(validatedData);
      res.json(info);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create contact info" });
    }
  });

  app.put("/api/admin/contact-info/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertContactInfoSchema.partial().parse(req.body);
      const info = await storage.updateContactInfo(id, validatedData);
      res.json(info);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update contact info" });
    }
  });

  app.delete("/api/admin/contact-info/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      await storage.deleteContactInfo(id);
      res.json({ message: "Contact info deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contact info" });
    }
  });

  // Power calculator data routes
  app.get("/api/admin/power-calculator", requireAuth, async (req: AuthRequest, res) => {
    try {
      const data = await storage.getAllPowerCalculatorData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch power calculator data" });
    }
  });

  app.post("/api/admin/power-calculator", requireAuth, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertPowerCalculatorDataSchema.parse(req.body);
      const data = await storage.createPowerCalculatorData(validatedData);
      res.json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create power calculator data" });
    }
  });

  app.put("/api/admin/power-calculator/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertPowerCalculatorDataSchema.partial().parse(req.body);
      const data = await storage.updatePowerCalculatorData(id, validatedData);
      res.json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update power calculator data" });
    }
  });

  // Admin user management routes
  app.get("/api/admin/users", requireAuth, async (req: AuthRequest, res) => {
    try {
      // For now, return basic user info - can be expanded later
      const users = [
        {
          id: '1',
          username: 'admin',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ];
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Vehicle management routes
  app.get("/api/admin/vehicles/:vehicleType", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { vehicleType } = req.params;
      const vehicles = await storage.getVehiclesByType(vehicleType);
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/admin/vehicles", requireAuth, async (req: AuthRequest, res) => {
    try {
      const allVehicles = await storage.getAllVehicles();
      res.json(allVehicles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.post("/api/admin/vehicles", requireAuth, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(validatedData);
      res.json(vehicle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create vehicle" });
    }
  });

  app.put("/api/admin/vehicles/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.updateVehicle(id, validatedData);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update vehicle" });
    }
  });

  app.delete("/api/admin/vehicles/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      await storage.deleteVehicle(id);
      res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vehicle" });
    }
  });

  // Translation Management Routes
  app.get("/api/admin/translations", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { language, section } = req.query;
      const translations = await storage.getTranslations(
        language as string,
        section as string
      );
      res.json(translations);
    } catch (error) {
      console.error("Error fetching translations:", error);
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });

  app.post("/api/admin/translations", requireAuth, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertTranslationSchema.parse(req.body);
      const translation = await storage.createTranslation(validatedData);
      res.json(translation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create translation" });
    }
  });

  app.put("/api/admin/translations/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertTranslationSchema.partial().parse(req.body);
      const translation = await storage.updateTranslation(id, validatedData);
      if (!translation) {
        return res.status(404).json({ message: "Translation not found" });
      }
      res.json(translation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update translation" });
    }
  });

  app.delete("/api/admin/translations/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTranslation(id);
      res.json({ message: "Translation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete translation" });
    }
  });

  // Language Management Routes
  app.get("/api/admin/languages", requireAuth, async (req: AuthRequest, res) => {
    try {
      const languages = await storage.getLanguages();
      res.json(languages);
    } catch (error) {
      console.error("Error fetching languages:", error);
      res.status(500).json({ message: "Failed to fetch languages" });
    }
  });

  app.post("/api/admin/languages", requireAuth, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertLanguageSchema.parse(req.body);
      const language = await storage.createLanguage(validatedData);
      res.json(language);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create language" });
    }
  });

  app.put("/api/admin/languages/:code", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { code } = req.params;
      const validatedData = insertLanguageSchema.partial().parse(req.body);
      const language = await storage.updateLanguage(code, validatedData);
      if (!language) {
        return res.status(404).json({ message: "Language not found" });
      }
      res.json(language);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update language" });
    }
  });

  app.delete("/api/admin/languages/:code", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { code } = req.params;
      await storage.deleteLanguage(code);
      res.json({ message: "Language deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete language" });
    }
  });

  // Object storage routes for image uploads
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const { ObjectStorageService, ObjectNotFoundError } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error: any) {
      console.error("Error accessing object:", error);
      if (error instanceof Error && error.name === "ObjectNotFoundError") {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.put("/api/site-images", async (req, res) => {
    if (!req.body.imageURL || !req.body.imageType) {
      return res.status(400).json({ error: "imageURL and imageType are required" });
    }

    try {
      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(req.body.imageURL);

      res.status(200).json({
        objectPath: objectPath,
        imageType: req.body.imageType,
      });
    } catch (error) {
      console.error("Error processing site image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Site identity routes
  app.get('/api/admin/site-identity', requireAuth, async (req: AuthRequest, res) => {
    try {
      const identity = await storage.getSiteIdentity();
      res.json(identity || {});
    } catch (error) {
      console.error('Error fetching site identity:', error);
      res.status(500).json({ message: 'Failed to fetch site identity' });
    }
  });

  app.post('/api/admin/site-identity', requireAuth, async (req: AuthRequest, res) => {
    try {
      const identity = await storage.upsertSiteIdentity(req.body);
      res.json(identity);
    } catch (error) {
      console.error('Error updating site identity:', error);
      res.status(500).json({ message: 'Failed to update site identity' });
    }
  });

  // Public site identity route (for frontend to load branding)
  app.get('/api/site-identity', async (req, res) => {
    try {
      const identity = await storage.getSiteIdentity();
      res.json(identity || {});
    } catch (error) {
      console.error('Error fetching site identity:', error);
      res.status(500).json({ message: 'Failed to fetch site identity' });
    }
  });

  // Analytics tracking routes (public endpoints)
  app.post("/api/analytics/page-view", async (req, res) => {
    try {
      const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
      const validatedData = insertPageViewSchema.parse({
        ...req.body,
        ipAddress: Array.isArray(clientIP) ? clientIP[0] : clientIP,
        userAgent: req.headers['user-agent'],
        referrer: req.headers['referer']
      });
      const pageView = await storage.trackPageView(validatedData);
      res.json({ success: true, id: pageView.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to track page view" });
    }
  });

  app.post("/api/analytics/click", async (req, res) => {
    try {
      const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
      const validatedData = insertClickEventSchema.parse({
        ...req.body,
        ipAddress: Array.isArray(clientIP) ? clientIP[0] : clientIP
      });
      const clickEvent = await storage.trackClick(validatedData);
      res.json({ success: true, id: clickEvent.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to track click" });
    }
  });

  app.post("/api/analytics/vehicle-selection", async (req, res) => {
    try {
      const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
      const validatedData = insertVehicleSelectionSchema.parse({
        ...req.body,
        ipAddress: Array.isArray(clientIP) ? clientIP[0] : clientIP
      });
      const vehicleSelection = await storage.trackVehicleSelection(validatedData);
      res.json({ success: true, id: vehicleSelection.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to track vehicle selection" });
    }
  });

  app.post("/api/analytics/geolocation", async (req, res) => {
    try {
      const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
      const validatedData = insertGeoLocationSchema.parse({
        ...req.body,
        ipAddress: Array.isArray(clientIP) ? clientIP[0] : clientIP
      });
      const geoLocation = await storage.upsertGeoLocation(validatedData);
      res.json({ success: true, id: geoLocation.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update geolocation" });
    }
  });

  // Analytics admin routes (protected endpoints)
  app.get("/api/admin/analytics/page-views", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { startDate, endDate } = req.query;
      const stats = await storage.getPageViewStats(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page view statistics" });
    }
  });

  app.get("/api/admin/analytics/clicks", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { startDate, endDate } = req.query;
      const stats = await storage.getClickStats(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch click statistics" });
    }
  });

  app.get("/api/admin/analytics/vehicles", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { startDate, endDate } = req.query;
      const stats = await storage.getVehicleSelectionStats(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicle selection statistics" });
    }
  });

  app.get("/api/admin/analytics/geolocation", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { startDate, endDate } = req.query;
      const stats = await storage.getGeoLocationStats(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch geolocation statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
