export interface Translation {
  // Navigation
  nav: {
    home: string;
    services: string;
    powerChecker: string;
    contact: string;
    about: string;
  };
  
  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    statsClients: string;
    statsProjects: string;
    statsExperience: string;
  };

  // Power Checker
  powerChecker: {
    title: string;
    subtitle: string;
    selectVehicle: string;
    selectBrand: string;
    selectModel: string;
    selectEngine: string;
    checkPower: string;
    originalPower: string;
    stage1Power: string;
    stage2Power: string;
    powerGain: string;
    torqueGain: string;
  };

  // Services
  services: {
    title: string;
    subtitle: string;
    stage1Title: string;
    stage1Description: string;
    stage2Title: string;
    stage2Description: string;
    egrTitle: string;
    egrDescription: string;
    dpfTitle: string;
    dpfDescription: string;
    getQuote: string;
  };

  // Contact
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    phone: string;
    vehicleInfo: string;
    message: string;
    submit: string;
    success: string;
    error: string;
  };

  // Footer
  footer: {
    company: string;
    services: string;
    contact: string;
    privacy: string;
    privacyPolicy: string;
    cookiePolicy: string;
    cookiePreferences: string;
    termsOfService: string;
    gdprCompliant: string;
    secureProcessing: string;
    allRightsReserved: string;
  };

  // GDPR
  gdpr: {
    cookieTitle: string;
    cookieDescription: string;
    acceptAll: string;
    declineAll: string;
    customize: string;
    savePreferences: string;
    necessary: string;
    analytics: string;
    marketing: string;
    functional: string;
    alwaysOn: string;
  };

  // Common
  common: {
    loading: string;
    error: string;
    retry: string;
    close: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    add: string;
    search: string;
    filter: string;
  };
}

export const translations: Record<string, Translation> = {
  en: {
    nav: {
      home: "Home",
      services: "Services",
      powerChecker: "Power Checker",
      contact: "Contact",
      about: "About"
    },
    hero: {
      title: "Professional ECU Tuning Services",
      subtitle: "Unlock Your Vehicle's True Potential",
      description: "Expert chiptuning solutions for cars, trucks, and agricultural vehicles. Increase power, improve fuel efficiency, and enhance performance with our professional ECU optimization services.",
      primaryButton: "Get Free Quote",
      secondaryButton: "Check Power",
      statsClients: "Happy Clients",
      statsProjects: "Completed Projects",
      statsExperience: "Years Experience"
    },
    powerChecker: {
      title: "Vehicle Power Checker",
      subtitle: "Discover your vehicle's tuning potential",
      selectVehicle: "Select Vehicle Type",
      selectBrand: "Select Brand",
      selectModel: "Select Model",
      selectEngine: "Select Engine",
      checkPower: "Check Power",
      originalPower: "Original Power",
      stage1Power: "Stage 1 Power",
      stage2Power: "Stage 2 Power",
      powerGain: "Power Gain",
      torqueGain: "Torque Gain"
    },
    services: {
      title: "Our Services",
      subtitle: "Professional tuning solutions for all vehicle types",
      stage1Title: "Stage 1 Chiptuning",
      stage1Description: "Software-only optimization that safely increases power and torque while maintaining reliability",
      stage2Title: "Stage 2 Chiptuning", 
      stage2Description: "Advanced tuning with hardware modifications for maximum performance gains",
      egrTitle: "EGR Removal",
      egrDescription: "Eliminate exhaust gas recirculation issues and improve engine performance",
      dpfTitle: "DPF Removal",
      dpfDescription: "Remove diesel particulate filter problems and reduce maintenance costs",
      getQuote: "Get Quote"
    },
    contact: {
      title: "Get Your Free Quote",
      subtitle: "Contact us for professional ECU tuning services",
      name: "Full Name",
      email: "Email Address", 
      phone: "Phone Number",
      vehicleInfo: "Vehicle Information",
      message: "Additional Message",
      submit: "Send Quote Request",
      success: "Your quote request has been sent successfully!",
      error: "Failed to send quote request. Please try again."
    },
    footer: {
      company: "ChipTuning PRO",
      services: "Services",
      contact: "Contact",
      privacy: "Privacy & Legal",
      privacyPolicy: "Privacy Policy",
      cookiePolicy: "Cookie Policy", 
      cookiePreferences: "Cookie Preferences",
      termsOfService: "Terms of Service",
      gdprCompliant: "GDPR Compliant",
      secureProcessing: "Secure Processing",
      allRightsReserved: "All rights reserved"
    },
    gdpr: {
      cookieTitle: "We Value Your Privacy",
      cookieDescription: "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and provide personalized content.",
      acceptAll: "Accept All Cookies",
      declineAll: "Decline All",
      customize: "Customize",
      savePreferences: "Save Preferences",
      necessary: "Necessary Cookies",
      analytics: "Analytics Cookies",
      marketing: "Marketing Cookies", 
      functional: "Functional Cookies",
      alwaysOn: "Always On"
    },
    common: {
      loading: "Loading...",
      error: "Error",
      retry: "Retry",
      close: "Close",
      save: "Save", 
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      add: "Add",
      search: "Search",
      filter: "Filter"
    }
  },
  
  lv: {
    nav: {
      home: "Sākums",
      services: "Pakalpojumi",
      powerChecker: "Jaudas Pārbaude",
      contact: "Kontakti",
      about: "Par Mums"
    },
    hero: {
      title: "Profesionāli ECU Čipošanas Pakalpojumi",
      subtitle: "Atklājiet Sava Auto Īsto Potenciālu",
      description: "Ekspertu čipošanas risinājumi automašīnām, kravas automašīnām un lauksaimniecības tehnika. Palieliniet jaudu, uzlabojiet degvielas ekonomiju un veiktspēju ar mūsu profesionālajiem ECU optimizācijas pakalpojumiem.",
      primaryButton: "Bezmaksas Cenas Piedāvājums",
      secondaryButton: "Pārbaudīt Jaudu",
      statsClients: "Apmierināti Klienti",
      statsProjects: "Pabeigti Projekti", 
      statsExperience: "Gadu Pieredze"
    },
    powerChecker: {
      title: "Transportlīdzekļa Jaudas Pārbaude",
      subtitle: "Atklājiet sava auto čipošanas potenciālu",
      selectVehicle: "Izvēlieties Transportlīdzekļa Veidu",
      selectBrand: "Izvēlieties Zīmolu",
      selectModel: "Izvēlieties Modeli",
      selectEngine: "Izvēlieties Dzinēju",
      checkPower: "Pārbaudīt Jaudu",
      originalPower: "Sākotnējā Jauda",
      stage1Power: "1. Pakāpes Jauda",
      stage2Power: "2. Pakāpes Jauda", 
      powerGain: "Jaudas Pieaugums",
      torqueGain: "Griezes Momenta Pieaugums"
    },
    services: {
      title: "Mūsu Pakalpojumi",
      subtitle: "Profesionāli čipošanas risinājumi visiem transportlīdzekļu veidiem",
      stage1Title: "1. Pakāpes Čipošana",
      stage1Description: "Tikai programmatūras optimizācija, kas droši palielina jaudu un griezes momentu, saglabājot uzticamību",
      stage2Title: "2. Pakāpes Čipošana",
      stage2Description: "Uzlabota čipošana ar aparatūras modifikācijām maksimālam veiktspējas pieaugumam",
      egrTitle: "EGR Noņemšana",
      egrDescription: "Novērsiet izplūdes gāzu recirkulācijas problēmas un uzlabojiet dzinēja veiktspēju",
      dpfTitle: "DPF Noņemšana", 
      dpfDescription: "Novērsiet dīzeļa daļiņu filtra problēmas un samaziniet apkopes izmaksas",
      getQuote: "Saņemt Piedāvājumu"
    },
    contact: {
      title: "Saņemiet Bezmaksas Piedāvājumu",
      subtitle: "Sazinieties ar mums profesionālu ECU čipošanas pakalpojumu saņemšanai",
      name: "Pilns Vārds",
      email: "E-pasta Adrese",
      phone: "Tālruņa Numurs", 
      vehicleInfo: "Transportlīdzekļa Informācija",
      message: "Papildu Ziņojums",
      submit: "Nosūtīt Pieprasījumu",
      success: "Jūsu pieprasījums ir veiksmīgi nosūtīts!",
      error: "Neizdevās nosūtīt pieprasījumu. Lūdzu, mēģiniet vēlreiz."
    },
    footer: {
      company: "ChipTuning PRO",
      services: "Pakalpojumi",
      contact: "Kontakti",
      privacy: "Privātums un Juridiskā Informācija",
      privacyPolicy: "Privātuma Politika",
      cookiePolicy: "Sīkfailu Politika",
      cookiePreferences: "Sīkfailu Preferences", 
      termsOfService: "Pakalpojuma Noteikumi",
      gdprCompliant: "GDPR Atbilstošs",
      secureProcessing: "Droša Apstrāde",
      allRightsReserved: "Visas tiesības aizsargātas"
    },
    gdpr: {
      cookieTitle: "Mēs Vērtējam Jūsu Privātumu",
      cookieDescription: "Mēs izmantojam sīkfailus un līdzīgas tehnoloģijas, lai uzlabotu jūsu pārlūkošanas pieredzi, analizētu vietnes satiksmi un nodrošinātu personalizētu saturu.",
      acceptAll: "Pieņemt Visus Sīkfailus",
      declineAll: "Noraidīt Visus",
      customize: "Pielāgot", 
      savePreferences: "Saglabāt Preferences",
      necessary: "Nepieciešamie Sīkfaili",
      analytics: "Analītikas Sīkfaili",
      marketing: "Mārketinga Sīkfaili",
      functional: "Funkcionālie Sīkfaili",
      alwaysOn: "Vienmēr Ieslēgts"
    },
    common: {
      loading: "Ielādē...",
      error: "Kļūda",
      retry: "Mēģināt Vēlreiz", 
      close: "Aizvērt",
      save: "Saglabāt",
      cancel: "Atcelt",
      edit: "Rediģēt",
      delete: "Dzēst",
      add: "Pievienot",
      search: "Meklēt",
      filter: "Filtrēt"
    }
  },

  ru: {
    nav: {
      home: "Главная",
      services: "Услуги", 
      powerChecker: "Проверка Мощности",
      contact: "Контакты",
      about: "О Нас"
    },
    hero: {
      title: "Профессиональные Услуги Чип-Тюнинга ECU",
      subtitle: "Раскройте Истинный Потенциал Вашего Автомобиля",
      description: "Экспертные решения чип-тюнинга для легковых, грузовых автомобилей и сельскохозяйственной техники. Увеличьте мощность, улучшите топливную экономичность и повысьте производительность с нашими профессиональными услугами оптимизации ECU.",
      primaryButton: "Бесплатное Предложение",
      secondaryButton: "Проверить Мощность",
      statsClients: "Довольных Клиентов",
      statsProjects: "Выполненных Проектов",
      statsExperience: "Лет Опыта"
    },
    powerChecker: {
      title: "Проверка Мощности Автомобиля",
      subtitle: "Узнайте потенциал тюнинга вашего автомобиля",
      selectVehicle: "Выберите Тип Транспорта",
      selectBrand: "Выберите Марку",
      selectModel: "Выберите Модель", 
      selectEngine: "Выберите Двигатель",
      checkPower: "Проверить Мощность",
      originalPower: "Оригинальная Мощность",
      stage1Power: "Мощность Stage 1",
      stage2Power: "Мощность Stage 2",
      powerGain: "Прирост Мощности",
      torqueGain: "Прирост Крутящего Момента"
    },
    services: {
      title: "Наши Услуги",
      subtitle: "Профессиональные решения тюнинга для всех типов автомобилей",
      stage1Title: "Чип-Тюнинг Stage 1",
      stage1Description: "Только программная оптимизация, которая безопасно увеличивает мощность и крутящий момент, сохраняя надежность",
      stage2Title: "Чип-Тюнинг Stage 2",
      stage2Description: "Продвинутый тюнинг с аппаратными модификациями для максимального прироста производительности",
      egrTitle: "Удаление EGR",
      egrDescription: "Устранение проблем рециркуляции отработавших газов и улучшение работы двигателя",
      dpfTitle: "Удаление DPF",
      dpfDescription: "Устранение проблем сажевого фильтра и снижение затрат на обслуживание",
      getQuote: "Получить Предложение"
    },
    contact: {
      title: "Получите Бесплатное Предложение",
      subtitle: "Свяжитесь с нами для профессиональных услуг чип-тюнинга ECU",
      name: "Полное Имя",
      email: "Адрес Электронной Почты",
      phone: "Номер Телефона",
      vehicleInfo: "Информация об Автомобиле", 
      message: "Дополнительное Сообщение",
      submit: "Отправить Запрос",
      success: "Ваш запрос успешно отправлен!",
      error: "Не удалось отправить запрос. Пожалуйста, попробуйте еще раз."
    },
    footer: {
      company: "ChipTuning PRO",
      services: "Услуги",
      contact: "Контакты",
      privacy: "Конфиденциальность и Правовая Информация",
      privacyPolicy: "Политика Конфиденциальности",
      cookiePolicy: "Политика Файлов Cookie",
      cookiePreferences: "Настройки Cookie",
      termsOfService: "Условия Обслуживания", 
      gdprCompliant: "Соответствие GDPR",
      secureProcessing: "Безопасная Обработка",
      allRightsReserved: "Все права защищены"
    },
    gdpr: {
      cookieTitle: "Мы Ценим Вашу Конфиденциальность",
      cookieDescription: "Мы используем файлы cookie и аналогичные технологии для улучшения вашего опыта просмотра, анализа трафика сайта и предоставления персонализированного контента.",
      acceptAll: "Принять Все Cookie",
      declineAll: "Отклонить Все",
      customize: "Настроить",
      savePreferences: "Сохранить Настройки",
      necessary: "Необходимые Cookie",
      analytics: "Аналитические Cookie",
      marketing: "Маркетинговые Cookie",
      functional: "Функциональные Cookie",
      alwaysOn: "Всегда Включено"
    },
    common: {
      loading: "Загрузка...",
      error: "Ошибка",
      retry: "Повторить",
      close: "Закрыть",
      save: "Сохранить",
      cancel: "Отмена",
      edit: "Редактировать", 
      delete: "Удалить",
      add: "Добавить",
      search: "Поиск",
      filter: "Фильтр"
    }
  }
};

export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
];

export const defaultLanguage = 'lv';