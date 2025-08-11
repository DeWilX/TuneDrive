import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";
import bcrypt from "bcrypt";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

async function populateInitialData() {
  console.log("Starting database population with initial data...");

  try {
    // 1. Site Identity
    console.log("Populating site identity...");
    await db.insert(schema.siteIdentity).values({
      companyName: "ChipTuning PRO",
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

    // 2. Navigation Items
    console.log("Populating navigation items...");
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
      }
    ];

    for (const nav of navigationData) {
      await db.insert(schema.navigationItems).values(nav).onConflictDoNothing();
    }

    // 3. Service Items
    console.log("Populating service items...");
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
      }
    ];

    for (const service of serviceData) {
      await db.insert(schema.serviceItems).values(service).onConflictDoNothing();
    }

    // 4. ZBOX Content
    console.log("Populating ZBOX content...");
    await db.insert(schema.zboxContent).values({
      title: "ZBOX Professional Tuning Device",
      description: "Advanced plug-and-play tuning solution for instant performance gains",
      translations: {
        en: {
          title: "ZBOX Professional Tuning Device",
          description: "Advanced plug-and-play tuning solution for instant performance gains",
          features: ["Plug & Play installation", "Instant power increase", "Reversible tuning", "Multiple tuning maps", "Professional support"],
          price: "€899",
          priceNote: "Installation included",
          buttonText: "Learn More About ZBOX"
        },
        lv: {
          title: "ZBOX Profesionāla Regulēšanas Ierīce",
          description: "Uzlabots plug-and-play regulēšanas risinājums tūlītējiem veiktspējas uzlabojumiem",
          features: ["Plug & Play uzstādīšana", "Tūlītējs jaudas pieaugums", "Atgriezeniska regulēšana", "Vairākas regulēšanas kartes", "Profesionāls atbalsts"],
          price: "€899",
          priceNote: "Uzstādīšana iekļauta",
          buttonText: "Uzzināt Vairāk Par ZBOX"
        },
        ru: {
          title: "ZBOX Профессиональное Устройство Тюнинга",
          description: "Продвинутое plug-and-play решение для мгновенного увеличения производительности",
          features: ["Plug & Play установка", "Мгновенное увеличение мощности", "Обратимый тюнинг", "Множественные карты настройки", "Профессиональная поддержка"],
          price: "€899",
          priceNote: "Установка включена",
          buttonText: "Узнать Больше о ZBOX"
        }
      },
      features: ["Plug & Play installation", "Instant power increase", "Reversible tuning", "Multiple tuning maps", "Professional support"],
      price: "€899",
      priceNote: "Installation included",
      buttonText: "Learn More About ZBOX"
    }).onConflictDoNothing();

    // 5. Why Choose Us Content
    console.log("Populating why choose us content...");
    await db.insert(schema.whyChooseUsContent).values({
      title: "Why Choose ChipTuning PRO?",
      description: "Over 15 years of experience in professional automotive tuning with thousands of satisfied customers worldwide",
      translations: {
        en: {
          title: "Why Choose ChipTuning PRO?",
          features: [
            { icon: "fa-fire", title: "15+ Years Experience", description: "Proven expertise in automotive chiptuning" },
            { icon: "fa-tachometer-alt", title: "Latest Equipment", description: "State-of-the-art tuning tools and diagnostics" },
            { icon: "fa-user-cog", title: "Expert Technicians", description: "Certified professionals with extensive training" },
            { icon: "fa-shield-alt", title: "Comprehensive Warranty", description: "Full warranty coverage for peace of mind" }
          ],
          description: "Over 15 years of experience in professional automotive tuning with thousands of satisfied customers worldwide",
          workshopTitle: "Professional Workshop & Equipment",
          workshopFeatures: ["Professional dyno testing", "Latest diagnostic equipment", "Specialized tuning software", "Climate-controlled facility", "Certified technicians"],
          workshopDescription: "Our state-of-the-art facility is equipped with the latest diagnostic tools, professional dynamometer, and specialized software for precise tuning results. We maintain the highest standards in automotive performance enhancement."
        },
        lv: {
          title: "Kāpēc izvēlēties ChipTuning PRO?",
          features: [
            { icon: "fa-fire", title: "15+ Gadu pieredze", description: "Pierādīta ekspertīze auto čipošanā" },
            { icon: "fa-tachometer-alt", title: "Labākās iekārtas", description: "Labakie tooli" },
            { icon: "fa-user-cog", title: "Labakie Tehniķi", description: "Litrabola trenēti" },
            { icon: "fa-shield-alt", title: "Garantija galīgi nenosedz šito", description: "Bet nu mēs par savu darbu gan dodam garantiju\n" }
          ],
          description: "Vairāk nekā 15 gadu pieredze profesionālā automobiļu tuninga jomā ar tūkstošiem apmierinātu klientu visā pasaulē",
          workshopTitle: "Profesionāla darbnīca un aprīkojums",
          workshopFeatures: ["Profesionāla dinamometra pārbaude", "Jaunākās diagnostikas iekārtas", "Specializēta regulēšanas programmatūra", "Darbnīca ar klimata kontroli", "Sertificēti tehniķi"],
          workshopDescription: "Mūsu mūsdienīgais uzņēmums ir aprīkots ar jaunākajiem diagnostikas rīkiem, profesionālu dinamometru un specializētu programmatūru precīziem regulēšanas rezultātiem. Mēs uzturām augstākos standartus automobiļu veiktspējas uzlabošanā."
        },
        ru: {
          title: "Почему выбирают ChipTuning PRO?",
          features: [
            { icon: "fa-fire", title: "15+ лет опыта", description: "Проверенная экспертиза в автомобильном чип-тюнинге" },
            { icon: "fa-tachometer-alt", title: "Новейшее оборудование", description: "Современные инструменты настройки и диагностики" },
            { icon: "fa-user-cog", title: "Экспертные технические специалисты", description: "Сертифицированные профессионалы с обширной подготовкой" },
            { icon: "fa-shield-alt", title: "Комплексная гарантия", description: "Полное гарантийное покрытие для спокойствия" }
          ],
          description: "Более 15 лет опыта в профессиональном автомобильном тюнинге с тысячами довольных клиентов по всему миру",
          workshopTitle: "Профессиональная мастерская и оборудование",
          workshopFeatures: ["Профессиональное тестирование на динамометре", "Новейшее диагностическое оборудование", "Специализированное программное обеспечение для настройки", "Помещение с климат-контролем", "Сертифицированные технические специалисты"],
          workshopDescription: "Наш современный объект оборудован новейшими диагностическими инструментами, профессиональным динамометром и специализированным программным обеспечением для точных результатов настройки. Мы поддерживаем самые высокие стандарты в улучшении автомобильной производительности."
        }
      },
      features: [
        { icon: "fa-fire", title: "15+ Years Experience", description: "Proven expertise in automotive chiptuning" },
        { icon: "fa-tachometer-alt", title: "Latest Equipment", description: "State-of-the-art tuning tools and diagnostics" },
        { icon: "fa-user-cog", title: "Expert Technicians", description: "Certified professionals with extensive training" },
        { icon: "fa-shield-alt", title: "Comprehensive Warranty", description: "Full warranty coverage for peace of mind" }
      ],
      workshopTitle: "Professional Workshop & Equipment",
      workshopDescription: "Our state-of-the-art facility is equipped with the latest diagnostic tools, professional dynamometer, and specialized software for precise tuning results. We maintain the highest standards in automotive performance enhancement.",
      workshopFeatures: ["Professional dyno testing", "Latest diagnostic equipment", "Specialized tuning software", "Climate-controlled facility", "Certified technicians"]
    }).onConflictDoNothing();

    // 6. Global Contact Information
    console.log("Populating global contact information...");
    await db.insert(schema.globalContactInfo).values({
      phone: "+371 12345678",
      whatsapp: "+371 12345678",
      email: "info@chiptuningpro.lv",
      location: "Riga, Latvia",
      workingHours: "Monday - Friday: 9:00 - 18:00",
      quotesEmail: "quotes@chiptuningpro.lv"
    }).onConflictDoNothing();

    // 7. Contact Page Content
    console.log("Populating contact page content...");
    await db.insert(schema.contactPageContent).values({
      heroTitle: "Get Your Free Quote Today",
      heroDescription: "Contact our experts for professional ECU tuning consultation and personalized service recommendations",
      formTitle: "Request Your Quote",
      formDescription: "Fill out the form below and our team will get back to you within 24 hours with a personalized quote",
      translations: {
        en: {
          heroTitle: "Get Your Free Quote Today",
          heroDescription: "Contact our experts for professional ECU tuning consultation and personalized service recommendations",
          formTitle: "Request Your Quote",
          formDescription: "Fill out the form below and our team will get back to you within 24 hours with a personalized quote"
        },
        lv: {
          heroTitle: "Saņemiet Bezmaksas Piedāvājumu Šodien",
          heroDescription: "Sazinieties ar mūsu ekspertiem profesionālai ECU regulēšanas konsultācijai un personalizētiem pakalpojumu ieteikumiem",
          formTitle: "Pieprasīt Piedāvājumu",
          formDescription: "Aizpildiet zemāk esošo formu un mūsu komanda sazināsies ar jums 24 stundu laikā ar personalizētu piedāvājumu"
        },
        ru: {
          heroTitle: "Получите Бесплатное Предложение Сегодня",
          heroDescription: "Свяжитесь с нашими экспертами для профессиональной консультации по настройке ЭБУ и персонализированных рекомендаций по услугам",
          formTitle: "Запросить Предложение",
          formDescription: "Заполните форму ниже, и наша команда свяжется с вами в течение 24 часов с персонализированным предложением"
        }
      }
    }).onConflictDoNothing();

    // 8. Page Content (Hero Section)
    console.log("Populating page content...");
    await db.insert(schema.pageContent).values({
      pageName: "home",
      title: "Unlock Your Vehicle's True Potential",
      subtitle: "Professional ECU Tuning & Performance Enhancement",
      content: {
        heroDescription: "Experience the ultimate in automotive performance with our professional ECU tuning services. From Stage 1 chiptuning to advanced hardware modifications, we unlock your vehicle's hidden potential while maintaining reliability and fuel efficiency.",
        callToAction: "Check Your Vehicle Power",
        features: [
          "Professional ECU Remapping",
          "Stage 1 & 2 Chiptuning",
          "EGR/DPF Removal",
          "ZBOX Tuning Device"
        ]
      }
    }).onConflictDoNothing();

    // 9. Power Calculator Data
    console.log("Populating power calculator data...");
    await db.insert(schema.powerCalculatorData).values({
      title: "Vehicle Power Checker",
      subtitle: "Check your vehicle's tuning potential",
      description: "Select your vehicle to see potential power gains from our professional tuning services",
      features: ["Real-time power calculations", "Stage 1 & 2 comparisons", "Comprehensive vehicle database", "Professional recommendations"],
      buttonText: "Check Vehicle Power"
    }).onConflictDoNothing();

    // 10. Sample Vehicles (Popular models)
    console.log("Populating sample vehicle data...");
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
        engine: "2.0 TDI",
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
        engine: "2.2 CDI",
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
      }
    ];

    for (const vehicle of vehicleData) {
      await db.insert(schema.vehicles).values(vehicle).onConflictDoNothing();
    }

    // 11. Create Default Admin User (password: admin123)
    console.log("Creating default admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(schema.adminUsers).values({
      username: "admin",
      password: hashedPassword,
      isActive: true
    }).onConflictDoNothing();

    console.log("✅ Database population completed successfully!");
    console.log("📝 Default admin credentials: username=admin, password=admin123");
    console.log("🔧 Please change the default admin password after first login");
    
  } catch (error) {
    console.error("❌ Error populating database:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  populateInitialData()
    .then(() => {
      console.log("Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

export { populateInitialData };