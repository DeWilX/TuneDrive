// populate-postgres.js - PostgreSQL Data Populator for TuneDrive
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

// Configure Neon for serverless
neonConfig.webSocketConstructor = ws;

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL must be set. Did you forget to provision a database?");
}

console.log("🔌 Connecting to PostgreSQL database...");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

async function testConnection() {
  try {
    console.log("🧪 Testing database connection...");
    const result = await pool.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log("✅ Database connection successful!");
    console.log(`📅 Server time: ${result.rows[0].current_time}`);
    console.log(`🐘 PostgreSQL version: ${result.rows[0].postgres_version.split(' ')[0]}`);
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
}

async function clearExistingData() {
  console.log("🧹 Clearing existing data (if any)...");
  try {
    // Clear data in reverse order due to foreign key constraints
    const tables = [
      'vehicles',
      'power_calculator_data', 
      'page_content',
      'contact_page_content',
      'global_contact_info',
      'why_choose_us_content',
      'zbox_content',
      'service_items',
      'navigation_items',
      'site_identity',
      'admin_users'
    ];

    for (const table of tables) {
      try {
        await pool.query(`DELETE FROM ${table}`);
        console.log(`  ✅ Cleared ${table}`);
      } catch (error) {
        console.log(`  ⚠️  Table ${table} might not exist or is empty: ${error.message}`);
      }
    }
  } catch (error) {
    console.log("⚠️  Some tables couldn't be cleared (this is normal for new databases)");
  }
}

async function populatePostgresData() {
  console.log("🌱 Starting PostgreSQL database population...");
  console.log("=" .repeat(50));

  try {
    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      throw new Error("Cannot proceed without database connection");
    }

    // Option to clear existing data
    const shouldClear = process.argv.includes('--clear');
    if (shouldClear) {
      await clearExistingData();
    }

    // 1. Site Identity
    console.log("🏢 Populating site identity...");
    await db.insert(schema.siteIdentity).values({
      companyName: "TuneDrive PRO",
      tagline: "Professional ECU Tuning & Performance Enhancement",
      heroTitle: "Unlock Your Vehicle's True Potential",
      heroSubtitle: "Professional ECU tuning services for cars, trucks, and agricultural vehicles",
      primaryColor: "#3b82f6",
      secondaryColor: "#1e40af", 
      accentColor: "#f59e0b",
      backgroundColor: "#000000",
      textColor: "#ffffff",
      clientCount: 500,
      projectCount: 1200,
      experienceYears: 15,
    }).onConflictDoNothing();
    console.log("  ✅ Site identity created");

    // 2. Navigation Items
    console.log("🧭 Populating navigation items...");
    const navigationData = [
      {
        label: "Home",
        href: "/",
        translations: {
          en: "Home",
          lv: "Sākums",
          ru: "Главная"
        },
        icon: "fa-home",
        order: 1
      },
      {
        label: "Services",
        href: "#services",
        translations: {
          en: "Services",
          lv: "Pakalpojumi", 
          ru: "Услуги"
        },
        icon: "fa-cogs",
        order: 2
      },
      {
        label: "Power Checker",
        href: "#power-checker",
        translations: {
          en: "Power Checker",
          lv: "Jaudas Pārbaude",
          ru: "Проверка Мощности"
        },
        icon: "fa-tachometer-alt",
        order: 3
      },
      {
        label: "About",
        href: "#about",
        translations: {
          en: "About",
          lv: "Par Mums",
          ru: "О Нас"
        },
        icon: "fa-info-circle",
        order: 4
      },
      {
        label: "Contact",
        href: "#contact",
        translations: {
          en: "Contact",
          lv: "Kontakti",
          ru: "Контакты"
        },
        icon: "fa-envelope",
        order: 5
      }
    ];

    for (const nav of navigationData) {
      await db.insert(schema.navigationItems).values(nav).onConflictDoNothing();
    }
    console.log(`  ✅ Inserted ${navigationData.length} navigation items`);

    // 3. Service Items
    console.log("🔧 Populating service items...");
    const serviceData = [
      {
        title: "Stage 1 Chiptuning",
        description: "Professional ECU remapping for improved performance and fuel efficiency",
        translations: {
          en: {
            title: "Stage 1 Chiptuning",
            description: "Professional ECU remapping for improved performance and fuel efficiency",
            features: ["Up to 30% more power", "Improved fuel economy", "Better throttle response", "Professional warranty"],
            price: "From €299"
          },
          lv: {
            title: "1. Posma Čipošana",
            description: "Profesionāla ECU pārprogrammēšana uzlabotai veiktspējai un degvielas ekonomijai",
            features: ["Līdz 30% vairāk jaudas", "Uzlabota degvielas ekonomija", "Labāka akceleratora atsaucība", "Profesionāla garantija"],
            price: "No €299"
          },
          ru: {
            title: "Чип-тюнинг Этап 1",
            description: "Профессиональная перепрошивка ЭБУ для улучшения производительности и экономии топлива",
            features: ["До 30% больше мощности", "Улучшенная экономия топлива", "Лучшая отзывчивость педали газа", "Профессиональная гарантия"],
            price: "От €299"
          }
        },
        icon: "fa-microchip",
        features: ["Up to 30% more power", "Improved fuel economy", "Better throttle response", "Professional warranty"],
        price: "From €299",
        order: 1
      },
      {
        title: "Stage 2 Chiptuning",
        description: "Advanced performance tuning with hardware modifications",
        translations: {
          en: {
            title: "Stage 2 Chiptuning", 
            description: "Advanced performance tuning with hardware modifications",
            features: ["Up to 50% power increase", "Custom hardware upgrades", "Track-ready performance", "Extended warranty"],
            price: "From €599"
          },
          lv: {
            title: "2. Posma Čipošana",
            description: "Uzlabota veiktspējas regulēšana ar aparatūras modifikācijām",
            features: ["Līdz 50% jaudas pieaugums", "Pielāgotas aparatūras uzlabojumi", "Trases gatava veiktspēja", "Paplašināta garantija"],
            price: "No €599"
          },
          ru: {
            title: "Чип-тюнинг Этап 2",
            description: "Продвинутая настройка производительности с модификациями оборудования",
            features: ["До 50% увеличения мощности", "Кастомные обновления оборудования", "Производительность готовая для трека", "Расширенная гарантия"],
            price: "От €599"
          }
        },
        icon: "fa-rocket",
        features: ["Up to 50% power increase", "Custom hardware upgrades", "Track-ready performance", "Extended warranty"],
        price: "From €599",
        order: 2
      },
      {
        title: "EGR/DPF Removal",
        description: "Professional removal of emission control systems",
        translations: {
          en: {
            title: "EGR/DPF Removal",
            description: "Professional removal of emission control systems",
            features: ["Improved engine longevity", "Better performance", "Reduced maintenance costs", "Professional coding"],
            price: "From €249"
          },
          lv: {
            title: "EGR/DPF Izņemšana",
            description: "Profesionāla emisiju kontroles sistēmu izņemšana",
            features: ["Uzlabota dzinēja ilgmūžība", "Labāka veiktspēja", "Samazinātas apkopes izmaksas", "Profesionāla kodēšana"],
            price: "No €249"
          },
          ru: {
            title: "Удаление EGR/DPF",
            description: "Профессиональное удаление систем контроля выбросов",
            features: ["Улучшенная долговечность двигателя", "Лучшая производительность", "Снижение затрат на обслуживание", "Профессиональное кодирование"],
            price: "От €249"
          }
        },
        icon: "fa-filter",
        features: ["Improved engine longevity", "Better performance", "Reduced maintenance costs", "Professional coding"],
        price: "From €249",
        order: 3
      },
      {
        title: "ZBOX Professional Device",
        description: "Advanced plug-and-play tuning solution",
        translations: {
          en: {
            title: "ZBOX Professional Device",
            description: "Advanced plug-and-play tuning solution",
            features: ["Plug & Play installation", "Instant power increase", "Reversible tuning", "Multiple maps"],
            price: "From €899"
          },
          lv: {
            title: "ZBOX Profesionāla Ierīce",
            description: "Uzlabots plug-and-play regulēšanas risinājums",
            features: ["Plug & Play uzstādīšana", "Tūlītējs jaudas pieaugums", "Atgriezeniska regulēšana", "Vairākas kartes"],
            price: "No €899"
          },
          ru: {
            title: "ZBOX Профессиональное Устройство",
            description: "Продвинутое plug-and-play решение",
            features: ["Plug & Play установка", "Мгновенное увеличение мощности", "Обратимый тюнинг", "Множественные карты"],
            price: "От €899"
          }
        },
        icon: "fa-cube",
        features: ["Plug & Play installation", "Instant power increase", "Reversible tuning", "Multiple maps"],
        price: "From €899",
        order: 4
      }
    ];

    for (const service of serviceData) {
      await db.insert(schema.serviceItems).values(service).onConflictDoNothing();
    }
    console.log(`  ✅ Inserted ${serviceData.length} service items`);

    // 4. Global Contact Information
    console.log("📞 Populating global contact information...");
    await db.insert(schema.globalContactInfo).values({
      phone: "+371 12345678",
      whatsapp: "+371 12345678",
      email: "info@tunedrive.pro",
      location: "Riga, Latvia",
      workingHours: "Monday - Friday: 9:00 - 18:00",
      quotesEmail: "quotes@tunedrive.pro"
    }).onConflictDoNothing();
    console.log("  ✅ Contact information created");

    // 5. Sample Vehicle Data for Power Checker
    console.log("🚗 Populating sample vehicle data...");
    const vehicleData = [
      {
        brand: "Audi",
        model: "A4",
        generation: "B9 (2016-2023)",
        engine: "2.0 TDI",
        variant: "150 HP",
        vehicleType: "car",
        originalPower: 150,
        originalTorque: 320,
        stage1Power: 190,
        stage1Torque: 400,
        stage2Power: 220,
        stage2Torque: 450
      },
      {
        brand: "BMW",
        model: "3 Series",
        generation: "F30 (2012-2019)",
        engine: "320d",
        variant: "184 HP",
        vehicleType: "car",
        originalPower: 184,
        originalTorque: 380,
        stage1Power: 220,
        stage1Torque: 450,
        stage2Power: 250,
        stage2Torque: 500
      },
      {
        brand: "Volkswagen",
        model: "Golf",
        generation: "MK7 (2012-2020)",
        engine: "2.0 TDI",
        variant: "150 HP",
        vehicleType: "car",
        originalPower: 150,
        originalTorque: 320,
        stage1Power: 190,
        stage1Torque: 400,
        stage2Power: 220,
        stage2Torque: 450
      },
      {
        brand: "Mercedes-Benz",
        model: "C-Class",
        generation: "W205 (2014-2021)",
        engine: "220d",
        variant: "170 HP",
        vehicleType: "car",
        originalPower: 170,
        originalTorque: 400,
        stage1Power: 210,
        stage1Torque: 480,
        stage2Power: 240,
        stage2Torque: 520
      },
      {
        brand: "Ford",
        model: "Focus",
        generation: "MK3 (2011-2018)",
        engine: "2.0 TDCi",
        variant: "150 HP",
        vehicleType: "car",
        originalPower: 150,
        originalTorque: 320,
        stage1Power: 185,
        stage1Torque: 390,
        stage2Power: 210,
        stage2Torque: 430
      },
      {
        brand: "Toyota",
        model: "Hilux",
        generation: "AN120 (2015-2023)",
        engine: "2.4 D-4D",
        variant: "150 HP",
        vehicleType: "truck",
        originalPower: 150,
        originalTorque: 400,
        stage1Power: 180,
        stage1Torque: 480,
        stage2Power: 200,
        stage2Torque: 520
      },
      {
        brand: "John Deere",
        model: "6M Series",
        generation: "2013-2020",
        engine: "6.8L",
        variant: "140 HP",
        vehicleType: "agricultural",
        originalPower: 140,
        originalTorque: 650,
        stage1Power: 165,
        stage1Torque: 750,
        stage2Power: 185,
        stage2Torque: 850
      }
    ];

    for (const vehicle of vehicleData) {
      await db.insert(schema.vehicles).values(vehicle).onConflictDoNothing();
    }
    console.log(`  ✅ Inserted ${vehicleData.length} sample vehicles`);

    // 6. Power Calculator Configuration
    console.log("⚡ Populating power calculator data...");
    await db.insert(schema.powerCalculatorData).values({
      title: "Vehicle Power Checker",
      subtitle: "Check your vehicle's tuning potential",
      description: "Select your vehicle to see potential power gains from our professional tuning services",
      features: ["Real-time power calculations", "Stage 1 & 2 comparisons", "Comprehensive vehicle database", "Professional recommendations"],
      buttonText: "Check Vehicle Power"
    }).onConflictDoNothing();
    console.log("  ✅ Power calculator configured");

    // 7. Create Default Admin User
    console.log("👤 Creating default admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(schema.adminUsers).values({
      username: "admin",
      password: hashedPassword,
      isActive: true
    }).onConflictDoNothing();
    console.log("  ✅ Admin user created");

    // 8. Verify data insertion
    console.log("🔍 Verifying data insertion...");
    const counts = await Promise.all([
      pool.query('SELECT COUNT(*) FROM site_identity'),
      pool.query('SELECT COUNT(*) FROM navigation_items'),
      pool.query('SELECT COUNT(*) FROM service_items'),
      pool.query('SELECT COUNT(*) FROM vehicles'),
      pool.query('SELECT COUNT(*) FROM admin_users')
    ]);

    console.log("📊 Database population summary:");
    console.log(`  • Site Identity: ${counts[0].rows[0].count} records`);
    console.log(`  • Navigation Items: ${counts[1].rows[0].count} records`);
    console.log(`  • Service Items: ${counts[2].rows[0].count} records`);
    console.log(`  • Sample Vehicles: ${counts[3].rows[0].count} records`);
    console.log(`  • Admin Users: ${counts[4].rows[0].count} records`);

    console.log("\n" + "=" .repeat(50));
    console.log("🎉 PostgreSQL database population completed successfully!");
    console.log("\n📝 Admin Login Credentials:");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("\n🚀 Next Steps:");
    console.log("1. Run: npm run dev");
    console.log("2. Visit: http://localhost:5000");
    console.log("3. Admin panel: http://localhost:5000/admin/login");
    console.log("4. ⚠️  Change admin password after first login!");

  } catch (error) {
    console.error("\n💥 Database population failed:", error);
    
    // Provide helpful error context
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log("\n🔧 Solution: Run database schema push first:");
      console.log("   npm run db:push");
    }
    
    if (error.message.includes('connect')) {
      console.log("\n🔧 Solution: Check your DATABASE_URL in .env file");
    }
    
    throw error;
  } finally {
    await pool.end();
    console.log("🔌 Database connection closed");
  }
}

// Run with command line options
const runPopulation = async () => {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log("🚗 TuneDrive PostgreSQL Data Populator");
    console.log("=====================================");
    console.log("\nUsage:");
    console.log("  node populate-postgres.js [options]");
    console.log("\nOptions:");
    console.log("  --clear    Clear existing data before populating");
    console.log("  --help     Show this help message");
    console.log("\nExamples:");
    console.log("  node populate-postgres.js");
    console.log("  node populate-postgres.js --clear");
    return;
  }

  await populatePostgresData();
};

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runPopulation()
    .then(() => {
      console.log("✨ Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Migration failed:", error.message);
      process.exit(1);
    });
}

export { populatePostgresData };