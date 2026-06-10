import { PropertyListing, Agent } from "./types";

// Exchange rate: 1 USD = 75 AFN
export const EXCHANGE_RATE = 75;

export const KABUL_NEIGHBORHOODS = [
  "Wazir Akbar Khan",
  "Shahr-e-Naw",
  "Macrorayan",
  "Qala-e-Fatullah",
  "Kart-e-Seh",
  "Sherpur",
  "Darulaman",
  "Dasht-e-Barchi"
];

export const MOCK_AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "Ahmad Mujtaba",
    role: "Principal Broker & Luxury Specialist",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80",
    phone: "+93 79 912 3456",
    whatsapp: "+93799123456",
    telegram: "@ahmad_kph",
    email: "mujtaba@kabulpropertyhub.com",
    isVerified: true,
    companyName: "Kabul Elite Real Estate",
    rating: 4.9
  },
  {
    id: "agent-2",
    name: "Zarlasht Karimi",
    role: "Commercial Investment Advisor",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
    phone: "+93 78 855 9900",
    whatsapp: "+93788559900",
    telegram: "@zarlasht_kph",
    email: "zarlasht@kabulpropertyhub.com",
    isVerified: true,
    companyName: "Pamir Capital Group",
    rating: 4.8
  },
  {
    id: "agent-3",
    name: "Mohammad Idrees",
    role: "Residential Rental Consultant",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80",
    phone: "+93 70 023 4567",
    whatsapp: "+93700234567",
    telegram: "@idrees_kph",
    email: "idrees@kabulpropertyhub.com",
    isVerified: false,
    companyName: "Kabul Property Hub",
    rating: 4.5
  }
];

export const MOCK_PROPERTIES: PropertyListing[] = [
  {
    id: "prop-1",
    title: {
      en: "Luxury 5-Bedroom Diplomatic Villa with Garden",
      dr: "ویلای لوکس ۵ خوابه دیپلماتیک با حیاط و فضای سبز",
      ps: "پینځه کوټه لرونکی لوکس ډیپلوماټیک ویلا له باغچې سره"
    },
    description: {
      en: "This premium executive villa in Wazir Akbar Khan is designed for diplomats and corporate executives. Features 24/7 heavy security, concrete blast walls, 50kVA generator backup, solar grid configuration, central heating, and automated water-well system.",
      dr: "این ویلای مجلل و اجرایی در وزیر اکبر خان برای دیپلمات‌ها و مدیران ارشد طراحی شده است. دارای امنیت شدید ۲۴ ساعته، دیوارهای کانکریتی ضد انفجار، جنراتور ۵۰ کیلو ولت آمپر، سیستم برق آفتابی، تسخین مرکزی و چاه آب مجهز با پمپ اتوماتیک می‌باشد.",
      ps: "دا لوکس او آرامه ویلا په وزیر اکبر خان کې د ډیپلوماټانو او بهرنیو کارمندانو لپاره جوړه شوې ده. دا ویلا ۲۴ ساعته امنیتي څارنه او وسایل، لوی جنراتور، لمریز برښنا، د تودوخې مرکز او د اوبو برمه لري."
    },
    locationName: {
      en: "Street 15, Wazir Akbar Khan, District 10, Kabul",
      dr: "سرک ۱۵، وزیر اکبر خان، ناحیه ۱۰، کابل",
      ps: "۱۵ سرک، وزیر اکبر خان، ۱۰ ناحیه، کابل"
    },
    neighborhood: "Wazir Akbar Khan",
    district: 10,
    purpose: "buy",
    type: "villa",
    priceUSD: 450000,
    priceAFN: 450000 * EXCHANGE_RATE,
    bedrooms: 5,
    bathrooms: 6,
    sizeSqm: 600,
    sizeJerib: 0.3,
    ageYears: 2,
    features: ["Security Guard", "CCTV", "Power Generator", "Solar Power", "Central Heating", "Garden", "Parking Slot"],
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80", // Modern villa
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", // Pool garden
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"  // Living room
    ],
    coordinates: { lat: 34.5385, lng: 69.1895 },
    agent: MOCK_AGENTS[0],
    isVerified: true,
    isFeatured: true,
    investmentMetrics: {
      rentalYield: 8.2,
      roiProjection: 14.5,
      investmentScore: 92,
      priceTrend: [
        { year: "2022", priceK: 390 },
        { year: "2023", priceK: 410 },
        { year: "2024", priceK: 430 },
        { year: "2026", priceK: 450 }
      ]
    },
    nearbyFacilities: [
      {
        name: { en: "French Medical Institute (FMIC)", dr: "شفاخانه فرانسوی‌ها", ps: "د فرانسویانو روغتون" },
        type: "hospital",
        distanceMin: 4
      },
      {
        name: { en: "Kabul International School", dr: "مکتب بین‌المللی کابل", ps: "د کابل نړیوال ښوونځی" },
        type: "school",
        distanceMin: 5
      },
      {
        name: { en: "Wazir Akbar Khan Mosque", dr: "مسجد جامع وزیر اکبر خان", ps: "د وزیر اکبر خان جامع جومات" },
        type: "mosque",
        distanceMin: 2
      }
    ],
    views: 1240,
    leads: 48,
    createdAt: "2026-05-15"
  },
  {
    id: "prop-2",
    title: {
      en: "Modern 3-Bedroom Apartment in Soviet-Style Blocks",
      dr: "آپارتمان مدرن ۳ خوابه در بلاک‌های مکروریان سوم",
      ps: "پینځه کوټه لرونکی عصري آپارتمان په دریم مکروریان کې"
    },
    description: {
      en: "Beautiful fully-renovated 3-bedroom apartment on the 3rd floor in Macrorayan 3. Features district central heating, stable water supply, double-glazed windows, and safe neighborhood with children's playground.",
      dr: "یک آپارتمان کاملاً بازسازی شده و زیبا دارای ۳ اتاق خواب در منزل سوم بلاک‌های مکروریان ۳. دارای تسخین مرکز دولتی، آب جاری منظم، کلکین‌های دوجداره و محیط امن همراه با پارک بازی اطفال.",
      ps: "په دریم مکروریان کې په دریم پوړ کې یو بیخي نوی رغول شوی ۳ کوټه لرونکی آپارتمان. دولتي مرکز ګرمي لري، همیشنۍ اوبه، دوه جداري کړکۍ او د ماشومانو د لوبې پارک لري."
    },
    locationName: {
      en: "Block 14, Macrorayan 3, District 16, Kabul",
      dr: "بلاک ۱۴، مکروریان ۳، ناحیه ۱۶، کابل",
      ps: "۱۴ بلاک، دریم مکروریان، ۱۶ ناحیه، کابل"
    },
    neighborhood: "Macrorayan",
    district: 16,
    purpose: "buy",
    type: "apartment",
    priceUSD: 85000,
    priceAFN: 85000 * EXCHANGE_RATE,
    bedrooms: 3,
    bathrooms: 2,
    sizeSqm: 110,
    sizeJerib: 0.057,
    ageYears: 12, // Retro classic, fully renovated
    features: ["Central Heating", "Elevator", "Water Supply", "Security Guard", "Parking Slot"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", // Apartment building
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",  // Interior
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"   // Kitchen
    ],
    coordinates: { lat: 34.5312, lng: 69.2154 },
    agent: MOCK_AGENTS[2],
    isVerified: true,
    isFeatured: false,
    investmentMetrics: {
      rentalYield: 6.8,
      roiProjection: 9.2,
      investmentScore: 82,
      priceTrend: [
        { year: "2022", priceK: 78 },
        { year: "2023", priceK: 80 },
        { year: "2024", priceK: 82 },
        { year: "2026", priceK: 85 }
      ]
    },
    nearbyFacilities: [
      {
        name: { en: "Macrorayan Bazaar", dr: "بازار مکروریان", ps: "د مکروریان بازار" },
        type: "market",
        distanceMin: 2
      },
      {
        name: { en: "Ariana Medical Center", dr: "مرکز صحی آریانا", ps: "د آریانا طبی مرکز" },
        type: "hospital",
        distanceMin: 6
      }
    ],
    views: 840,
    leads: 19,
    createdAt: "2026-06-01"
  },
  {
    id: "prop-3",
    title: {
      en: "Executive Commercial Office Space in Shahr-e-Naw",
      dr: "فضای تجاری و اداری مجلل در شهر نو",
      ps: "په نوي ښار کې د سوداګریز او اداري دفتر لوکس ځای"
    },
    description: {
      en: "Corporate office layout covering an entire floor in a premium high-rise in Shahr-e-Naw. Stunning views of Kabul skyline, high-speed fiber internet, multi-zone central air conditioning, backup security bunker, and heavy-duty capsule elevators.",
      dr: "یک طبقه کامل اداری و تجاری در یکی از برج‌های مجلل شهر نو. نمای عالی از افق کابل، انترنت فایبر نوری سریع، تهویه مطبوع پیشرفته، پناهگاه و تدابیر امنیتی عالی، و لفت‌های کپسولی پرسرعت.",
      ps: "په کابل شهر نو کې په یو لوړ پوړیز سوداګریز مرکز کې یو پوره پوړ اداري دفتر. د کابل ښار ښکلی نما، چټک انټرنیټ، مرکزي یخوونکی او تودوونکی سیستم، او چټک لفټونه لري."
    },
    locationName: {
      en: "Kabul Business Center Tower, Shahr-e-Naw, District 4, Kabul",
      dr: "برج مرکز تجارتی کابل، شهر نو، ناحیه ۴، کابل",
      ps: "د کابل سوداګریز مرکز برج، نوی ښار، ۴ ناحیه، کابل"
    },
    neighborhood: "Shahr-e-Naw",
    district: 4,
    purpose: "lease",
    type: "office",
    priceUSD: 3500, // Monthly lease
    priceAFN: 3500 * EXCHANGE_RATE,
    bedrooms: 0,
    bathrooms: 4,
    sizeSqm: 380,
    sizeJerib: 0.19,
    ageYears: 3,
    features: ["CCTV", "Power Generator", "Air Conditioning", "Elevator", "Water Supply", "Internet", "Security Guard"],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80", // Premium office
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"  // Office desk
    ],
    coordinates: { lat: 34.5330, lng: 69.1755 },
    agent: MOCK_AGENTS[1],
    isVerified: true,
    isFeatured: true,
    investmentMetrics: {
      rentalYield: 9.5,
      roiProjection: 11.0,
      investmentScore: 89,
      priceTrend: [
        { year: "2022", priceK: 3.2 },
        { year: "2023", priceK: 3.3 },
        { year: "2024", priceK: 3.4 },
        { year: "2026", priceK: 3.5 }
      ]
    },
    nearbyFacilities: [
      {
        name: { en: "Kabul City Center Mall", dr: "کابل سیتی سنتر", ps: "کابل سټي سنټر" },
        type: "market",
        distanceMin: 1
      },
      {
        name: { en: "Park-e-Shahr-e-Naw", dr: "پارک شهر نو", ps: "د نوي ښار پارک" },
        type: "park",
        distanceMin: 3
      }
    ],
    views: 1120,
    leads: 32,
    createdAt: "2026-05-28"
  },
  {
    id: "prop-4",
    title: {
      en: "Secure Strategic Warehouse and Depot",
      dr: "گودام و دیپوی تجاری امن و استراتژیک",
      ps: "د سوداګریزو توکو خوندي او ستراتیژیک ګودام او ډیپو"
    },
    description: {
      en: "Reinforced 500 sqm concrete warehouse in Qala-e-Fatullah. Optimal for storage of pharmaceuticals, food items, or consumer goods. Features 6-meter ceiling clearance, wide loading docks for heavy trucks, independent solar array, and security checkpoints.",
      dr: "گودام مستحکم کانکریتی ۵۰۰ متر مربعی در قلعه فتح‌الله. ایده‌آل برای ذخیره ادویه، مواد غذایی یا اجناس تجارتی. دارای سقف مرتفع ۶ متری، دروازه بزرگ برای تخلیه بار لاری‌ها، برق سولر مستقل و کانکس امنیتی.",
      ps: "پنځه سوه متره مربع مضبوط ګودام په قلعه فتح الله کې. د درملو، خوراکي توکو او نورو سوداګریزو مالونو لپاره خورا مناسب دی. د موټرو د تګ راتګ پوره اسانتیا او لمریزې برېښنا سیستم لري."
    },
    locationName: {
      en: "Street 3, Qala-e-Fatullah, District 10, Kabul",
      dr: "سرک ۳، قلعه فتح‌الله، ناحیه ۱۰، کابل",
      ps: "۳ سرک، قلعه فتح‌الله، ۱۰ ناحیه، کابل"
    },
    neighborhood: "Qala-e-Fatullah",
    district: 10,
    purpose: "rent",
    type: "warehouse",
    priceUSD: 1800,
    priceAFN: 1800 * EXCHANGE_RATE,
    bedrooms: 0,
    bathrooms: 1,
    sizeSqm: 500,
    sizeJerib: 0.25,
    ageYears: 5,
    features: ["CCTV", "Parking Slot", "Solar Power", "Water Supply", "Security Guard"],
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80", // Warehouse layout
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=800&q=80"  // Loading dock
    ],
    coordinates: { lat: 34.5422, lng: 69.1802 },
    agent: MOCK_AGENTS[1],
    isVerified: true,
    isFeatured: false,
    investmentMetrics: {
      rentalYield: 7.8,
      roiProjection: 8.5,
      investmentScore: 76,
      priceTrend: [
        { year: "2022", priceK: 1.6 },
        { year: "2023", priceK: 1.7 },
        { year: "2024", priceK: 1.75 },
        { year: "2026", priceK: 1.8 }
      ]
    },
    nearbyFacilities: [
      {
        name: { en: "Main Airport Road Junction", dr: "چهارراهی سرک عمومی میدان هوایی", ps: "د هوايي ډګر سړک څلورلاره" },
        type: "market",
        distanceMin: 7
      }
    ],
    views: 410,
    leads: 8,
    createdAt: "2026-06-05"
  },
  {
    id: "prop-5",
    title: {
      en: "Massive 2-Jerib Commercial Land Plot on Darulaman Road",
      dr: "زمین کلان ۲ جریب تجاری در سرک عمومی دارالامان",
      ps: "د دارالامان په عمومي سړک باندې دوه جریبه سوداګریزه ځمکه"
    },
    description: {
      en: "An outstanding investment opportunity featuring a 2-Jerib (4,000 sqm) vacant commercial plot located on the primary Darulaman highway. Perfect for building a wedding hall, business tower, or private university. Clean documentation and authentic property deeds verified.",
      dr: "یک فرصت استثنایی سرمایه‌گذاری: زمین تجاری سفید به مساحت ۲ جریب (۴۰۰۰ متر مربع) واقع در سرک عمومی شاهراه دارالامان. کاملاً مناسب برای احداث تالار عروسی، برج تجارتی یا پوهنتون خصوصی. قباله شرعی پاک و تایید شده.",
      ps: "د پانګونې خورا ښه چانس: د دارالامان په عمومي سړک باندې دوه جریبه سوداګریزه ځمکه. د ودونو تالار، سوداګریز مارکیټ او یا شخصي پوهنتون جوړولو لپاره خورا مناسبه ده. شرعي قباله او اسناد لري."
    },
    locationName: {
      en: "Primary Darulaman Road, District 6, Kabul",
      dr: "سرک عمومی دارالامان، ناحیه ۶، کابل",
      ps: "د دارالامان عمومي سړک، ۶ ناحیه، کابل"
    },
    neighborhood: "Darulaman",
    district: 6,
    purpose: "buy",
    type: "land",
    priceUSD: 310000,
    priceAFN: 310000 * EXCHANGE_RATE,
    bedrooms: 0,
    bathrooms: 0,
    sizeSqm: 4000,
    sizeJerib: 2.0,
    ageYears: 0,
    features: ["Water Supply", "Parking Slot", "Security Guard"],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80", // Open land field
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"  // Landscape
    ],
    coordinates: { lat: 34.4845, lng: 69.1190 },
    agent: MOCK_AGENTS[0],
    isVerified: true,
    isFeatured: true,
    investmentMetrics: {
      rentalYield: 0, // Vacant land
      roiProjection: 19.8, // High growth area near government ministries
      investmentScore: 95,
      priceTrend: [
        { year: "2022", priceK: 240 },
        { year: "2023", priceK: 265 },
        { year: "2024", priceK: 290 },
        { year: "2026", priceK: 310 }
      ]
    },
    nearbyFacilities: [
      {
        name: { en: "Darulaman Palace", dr: "قصر دارالامان", ps: "دارالامان ماڼۍ" },
        type: "park",
        distanceMin: 3
      },
      {
        name: { en: "Kateb University", dr: "دانشگاه کاتب", ps: "د کاتب پوهنتون" },
        type: "university",
        distanceMin: 4
      }
    ],
    views: 1950,
    leads: 76,
    createdAt: "2026-04-10"
  },
  {
    id: "prop-6",
    title: {
      en: "Luxurious 4-Bedroom Family House with Courtyard",
      dr: "حویلی مدرن و مجلل ۴ خوابه برای فامیل",
      ps: "پینځه کوټه لرونکی لوکس د فامیل اوسېدو کور له حویلۍ سره"
    },
    description: {
      en: "A beautiful traditional meet modern family house in central Kart-e-Seh. Built recently with robust shear-walls, features an interior garage, garden with pomegranate trees, deep well water pump, rooftop terrace, and reliable local neighborhood security.",
      dr: "یک حویلی زیبای فامیلی ترکیبی از معماری مدرن و سنتی در قلب کارته سه. اعمار شده با دیوارهای برشی مستحکم ضد زلزله، موتورخانه، حیاط پر از درختان انار، چاه آب عمیق، شیر بام وسیع و امنیت عالی محلی.",
      ps: "په کارته سه سیمه کې یو ډیر خوندور او زړه راښکونکی پاخه کور. د زلزلې ضد پاخه دېوالونه، د ګاډو پارکینګ، د انارو ښکلې باغچه او د بام پراخ ځای لري."
    },
    locationName: {
      en: "Kart-e-Seh Near University Road, District 3, Kabul",
      dr: "کارته سه، نزدیک سرک عامه پوهنتون، ناحیه ۳، کابل",
      ps: "کارته سه، پوهنتون ته څېرمه، ۳ ناحیه، کابل"
    },
    neighborhood: "Kart-e-Seh",
    district: 3,
    purpose: "rent",
    type: "house",
    priceUSD: 1400,
    priceAFN: 1400 * EXCHANGE_RATE,
    bedrooms: 4,
    bathrooms: 3,
    sizeSqm: 280,
    sizeJerib: 0.14,
    ageYears: 4,
    features: ["Security Guard", "Power Generator", "Solar Power", "Central Heating", "Garden", "Parking Slot"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", // Modern house facade
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80"  // Internal kitchen/living
    ],
    coordinates: { lat: 34.5090, lng: 69.1350 },
    agent: MOCK_AGENTS[2],
    isVerified: false,
    isFeatured: false,
    investmentMetrics: {
      rentalYield: 7.2,
      roiProjection: 10.5,
      investmentScore: 84,
      priceTrend: [
        { year: "2022", priceK: 1.25 },
        { year: "2023", priceK: 1.3 },
        { year: "2024", priceK: 1.35 },
        { year: "2026", priceK: 1.4 }
      ]
    },
    nearbyFacilities: [
      {
        name: { en: "Kabul University", dr: "پوهنتون کابل", ps: "د کابل پوهنتون" },
        type: "university",
        distanceMin: 5
      },
      {
        name: { en: "Ali Abad Hospital", dr: "شفاخانه علی‌آباد", ps: "د علي اباد روغتون" },
        type: "hospital",
        distanceMin: 8
      }
    ],
    views: 650,
    leads: 12,
    createdAt: "2026-06-03"
  }
];

export const MOCK_REVIEWS = [
  { id: "rev-1", name: "Sohrab Ahmadi", rating: 5, comment: { en: "Best platform to find verified diplomatic properties in Kabul. Mujtaba was extremely helpful!", dr: "بهترین پلتفرم برای پیدا کردن ملک‌های معتبر دیپلماتیک در کابل. آقای مجتبی بسیار همکار خوبی بودند!", ps: "په کابل کې د معتبرو ملکیتونو د پیدا کولو تر ټولو غوره پاڼه ده." } },
  { id: "rev-2", name: "Diana Rahimi", rating: 5, comment: { en: "Highly recommend for anyone wanting commercial properties around Shahr-e-Naw. Very rich user experience.", dr: "شدیداً برای پیدا کردن املاک تجاری نزدیک شهر نو پیشنهاد میشود. کاربری بسیار ساده و عالی.", ps: "د هغو کسانو لپاره چې په کابل کې سوداګریز جایدادونه غواړي خورا ګټوره ده." } }
];
