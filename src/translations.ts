import { LanguageCode } from "./types";

export interface SystemDictionary {
  brandName: string;
  slogan: string;
  searchPlaceholder: string;
  conversationalSearchBtn: string;
  conversationalSearchPrompt: string;
  conversationalPlaceholder: string;
  conversationalLoading: string;
  conversationalSuccess: string;
  navBuy: string;
  navRent: string;
  navLease: string;
  navSell: string;
  navDashboard: string;
  navAdmin: string;
  navAiAssistant: string;
  lngEn: string;
  lngDr: string;
  lngPs: string;
  btnSearch: string;
  btnReset: string;
  filterTitle: string;
  propType: string;
  priceRange: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  age: string;
  features: string;
  neighborhood: string;
  district: string;
  verifiedOnly: string;
  featuredOnly: string;
  investmentScore: string;
  rentalYield: string;
  roiProjection: string;
  btnExplore: string;
  btnViewDetails: string;
  btnContactAgent: string;
  beds: string;
  baths: string;
  sqm: string;
  jerib: string;
  yearsOld: string;
  newProp: string;
  nearbyText: string;
  whatsAppMsg: string;
  phoneCall: string;
  telegramMsg: string;
  emailMsg: string;
  viewingRequestBtn: string;
  viewingRequestSuccess: string;
  viewingTitle: string;
  viewingDate: string;
  viewingTime: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  submitRequest: string;
  investmentAnalysis: string;
  roiChartTitle: string;
  mortgageCalculator: string;
  mortgageDownPayment: string;
  mortgageRate: string;
  mortgageYears: string;
  mortgageMonthlyPayment: string;
  priceTrendPredict: string;
  predictionUp: string;
  verificationBadge: string;
  agentBadge: string;
  trustSecTitle: string;
  fraudAlert: string;
  otpVerify: string;
  priceTrend: string;
  pkgTitle: string;
  pkgFree: string;
  pkgPremium: string;
  pkgAgency: string;
  btnUpgrade: string;
  adminManage: string;
  adminRevenue: string;
  adminUsers: string;
  adminLeadCount: string;
  adminActiveList: string;
  dashboardBuyer: string;
  dashboardSeller: string;
  dashboardAgent: string;
  dashboardFavorites: string;
  dashboardSavedSearches: string;
  dashboardListingAdd: string;
  dashboardMyListings: string;
  dashboardLeads: string;
  addPhotos: string;
  btnPublish: string;
  translateGenerating: string;
  translateSuccess: string;
  mockPaymentSuccess: string;
}

export const translations: Record<LanguageCode, SystemDictionary> = {
  en: {
    brandName: "Kabul Property Hub",
    slogan: "Afghanistan's Premier AI-Powered Property Marketplace",
    searchPlaceholder: "Search by title, street, landmark, school, mosque...",
    conversationalSearchBtn: "AI Search Mode",
    conversationalSearchPrompt: "Explain what you want in plain words (e.g. 'A family apartment near a hospital in Shahr-e-Naw')",
    conversationalPlaceholder: "Ask our AI search to filter listings...",
    conversationalLoading: "Understanding location & specs via AI...",
    conversationalSuccess: "AI filters applied successfully!",
    navBuy: "Buy",
    navRent: "Rent",
    navLease: "Lease",
    navSell: "Sell Property",
    navDashboard: "My Dashboard",
    navAdmin: "Admin Console",
    navAiAssistant: "AI Advisory",
    lngEn: "English",
    lngDr: "دری",
    lngPs: "پښتو",
    btnSearch: "Search Property",
    btnReset: "Reset Filters",
    filterTitle: "Refine Search Filters",
    propType: "Property Housing Type",
    priceRange: "Price Budget",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    size: "Property Size Area",
    age: "Property Age Profile",
    features: "Features & Amenities",
    neighborhood: "Neighborhood Sector",
    district: "Municipal District (PD)",
    verifiedOnly: "Verified Listings Only",
    featuredOnly: "Premium Featured Listings",
    investmentScore: "Investment Quality Score",
    rentalYield: "Expected Rental Yield",
    roiProjection: "ROI Projection (5Y)",
    btnExplore: "Explore Properties",
    btnViewDetails: "View Full Details",
    btnContactAgent: "Inquire Now",
    beds: "Beds",
    baths: "Baths",
    sqm: "Sqm",
    jerib: "Jerib",
    yearsOld: "Years Old",
    newProp: "Brand New Construction",
    nearbyText: "Nearby Public Conveniences",
    whatsAppMsg: "Send WhatsApp",
    phoneCall: "Direct Call",
    telegramMsg: "Telegram Pin",
    emailMsg: "Email Message",
    viewingRequestBtn: "Book Private Viewing Session",
    viewingRequestSuccess: "Your viewing slot request submitted! The agent was notified via SMS simulation.",
    viewingTitle: "Select a date and time for viewing",
    viewingDate: "Target Date",
    viewingTime: "Preferred Hour",
    buyerName: "Your Full Name",
    buyerPhone: "Phone (e.g., +93...)",
    buyerEmail: "Your Contact Email Address",
    submitRequest: "Publish Booking",
    investmentAnalysis: "AI Investment & Financial Evaluation",
    roiChartTitle: "Estimated Real Estate Value Growth Projection (K USD)",
    mortgageCalculator: "Affordability & Islamic Financing Calculator",
    mortgageDownPayment: "Down Payment (USD)",
    mortgageRate: "Annual Markup Rate (%)",
    mortgageYears: "Payment Term (Years)",
    mortgageMonthlyPayment: "Monthly Investment Share",
    priceTrendPredict: "AI Kabul Future Trend Prediction",
    predictionUp: "Values are steadily appreciating here. Investment class highly viable.",
    verificationBadge: "Verified Asset",
    agentBadge: "Sardar Agent Badge",
    trustSecTitle: "Trust & Anti-Fraud Security Certification",
    fraudAlert: "Before buying, always inspect the state-notarized Safayi Book and Shari Deeds directly inside our office with verified agents.",
    otpVerify: "Perform SMS OTP Verification Simulate",
    priceTrend: "Historical Asset Growth Rate",
    pkgTitle: "Upgrade to Professional Listing Packages",
    pkgFree: "Free (Basic Listing)",
    pkgPremium: "Featured Premium ($49 / listing - 5x visibility)",
    pkgAgency: "Agency Pro Tier ($199 / month - Team CRM)",
    btnUpgrade: "Process Checkout Option",
    adminManage: "Sardar Admin Control Center",
    adminRevenue: "Simulated Stripe & Bank Revenue",
    adminUsers: "Active Accounts",
    adminLeadCount: "Global Customer Leads",
    adminActiveList: "Total Directory Listings",
    dashboardBuyer: "Buyer Account Activities",
    dashboardSeller: "Seller Operations",
    dashboardAgent: "Professional Agent CRM",
    dashboardFavorites: "My Saved Properties",
    dashboardSavedSearches: "Recent Custom Search Queries",
    dashboardListingAdd: "Post New Afghan Property Listing",
    dashboardMyListings: "My Active Properties Advertised",
    dashboardLeads: "My Exclusive Leads (CRM Platform)",
    addPhotos: "Add Listing Banner Images (URLs)",
    btnPublish: "Submit Property & Generative Translation",
    translateGenerating: "Gemini is translating inputs to Dari and Pashto instantly...",
    translateSuccess: "Generative Translation completed smoothly!",
    mockPaymentSuccess: "Premium checkout completed successfully! This property has been upgraded to Featured Status globally."
  },
  dr: {
    brandName: "مرکز املاک کابل",
    slogan: "بزرگترین پلتفرم جایداد افغانستان تحت هوش مصنوعی",
    searchPlaceholder: "جستجو با عنوان جایداد، سرک، مسجد، شفاخانه یا مکتب...",
    conversationalSearchBtn: "جستجوی هوشمند AI",
    conversationalSearchPrompt: "آنچه می‌خواهید را با زبان ساده تایپ کنید (مثلاً: 'آپارتمان فامیلی نزدیک شفاخانه در شهر نو')",
    conversationalPlaceholder: "از جستجوی هوش مصنوعی بخواهید...",
    conversationalLoading: "تحلیل موقعیت و مشخصات توسط هوش مصنوعی...",
    conversationalSuccess: "فلترهای هوشمند با موفقیت اعمال شدند!",
    navBuy: "خرید",
    navRent: "کرایه",
    navLease: "لیزینگ / گروی",
    navSell: "ثبت جایداد جدید",
    navDashboard: "صفحه کاربری من",
    navAdmin: "مدیریت سیستم",
    navAiAssistant: "مشاوره با هوش مصنوعی",
    lngEn: "English",
    lngDr: "دری",
    lngPs: "پښتو",
    btnSearch: "جستجوی جایدادها",
    btnReset: "تنظیم مجدد فلترها",
    filterTitle: "فلترهای دقیق جایداد",
    propType: "نوعیت جایداد",
    priceRange: "حدود قیمت (بودجه)",
    bedrooms: "اتاق خواب",
    bathrooms: "حمام / تشناب",
    size: "اندازه و مساحت جایداد",
    age: "قدمت عمر ساخت",
    features: "امکانات و سهولت‌ها",
    neighborhood: "موقعیت / ساحه کابل",
    district: "ناحیه شهرداری",
    verifiedOnly: "فقط جایدادهای تایید شده",
    featuredOnly: "جایدادهای ویژه و ممتاز",
    investmentScore: "امتیاز سرمایه‌گذاری",
    rentalYield: "عاید کرایه سالانه",
    roiProjection: "پیش‌بینی رشد سود (۵ ساله)",
    btnExplore: "مشاهده تمام املاک",
    btnViewDetails: "جزئیات کامل جایداد",
    btnContactAgent: "ارتباط با نماینده ملک",
    beds: "اتاق",
    baths: "حمام",
    sqm: "متر مربع",
    jerib: "جریب",
    yearsOld: "ساله",
    newProp: "جدید التأسیس و نوساز",
    nearbyText: "مکان‌های عمومی نزدیک جایداد",
    whatsAppMsg: "پیام در واتس‌اپ",
    phoneCall: "تماس تلفنی مستقیم",
    telegramMsg: "کانال تلگرام",
    emailMsg: "ارسال ایمیل",
    viewingRequestBtn: "درخواست بازدید حضوری ملک",
    viewingRequestSuccess: "درخواست زمان بازدید شما ثبت شد! پیامک شبیه‌سازی شده برای نماینده ارسال گردید.",
    viewingTitle: "تاریخ و ساعت ترجیحی برای بازدید را انتخاب کنید",
    viewingDate: "تاریخ بازدید",
    viewingTime: "ساعت بازدید",
    buyerName: "نام کامل شما",
    buyerPhone: "شماره تلفن (مثال: +93...)",
    buyerEmail: "آدرس ایمیل شما",
    submitRequest: "ثبت نهایی درخواست بازدید",
    investmentAnalysis: "ارزیابی مالی و سرمایه‌گذاری هوش مصنوعی",
    roiChartTitle: "پیش‌بینی تخمینی ارزش ملک در سال‌های آینده (به هزار دالر)",
    mortgageCalculator: "ماشین حساب تمویل و قسط‌دهی اسلامی",
    mortgageDownPayment: "پیش پرداخت (دالر)",
    mortgageRate: "فیصدی مفاد سالانه (%)",
    mortgageYears: "مدت زمان قسط (سال)",
    mortgageMonthlyPayment: "سهم ماهیانه پرداخت شما",
    priceTrendPredict: "پیش‌بینی هوشمند مراجعات ساحوی کابل",
    predictionUp: "املاک در این بخش روند رو به رشد خوبی دارند. خرید و سرمایه‌گذاری عالی است.",
    verificationBadge: "ملک تصدیق شده",
    agentBadge: "نماینده رسمی سردار",
    trustSecTitle: "امنیت و تضمین قباله شرعی",
    fraudAlert: "توجه: قبل از پرداخت مالی، کتابچه صفایی شهرداری و سند قباله شرعی جایداد را در دفتر فیزیکی ما بررسی و تایید کنید.",
    otpVerify: "تایید شماره موبایل با رمز یکبار مصرف شبیه‌سازی",
    priceTrend: "روند قیمتی تاریخی جایداد",
    pkgTitle: "ارتقای جایداد به بسته‌های ویژه",
    pkgFree: "رایگان (عادی)",
    pkgPremium: "بسته ویژه ممتاز ($49 - نمایش بلند)",
    pkgAgency: "بسته آژانس حرفه‌ای ($199 / ماهانه - مدیریت تیم)",
    btnUpgrade: "پرداخت شبیه‌سازی شده",
    adminManage: "مرکز مدیریت و نظارت سردار کابل",
    adminRevenue: "درآمد کلان بانکی و کارت‌های بین‌المللی",
    adminUsers: "حساب‌های فعال کاربری",
    adminLeadCount: "مجموعه سرنخ‌های مشتریان",
    adminActiveList: "جایدادهای فعال ثبتی",
    dashboardBuyer: "فعالیت‌های خریدار ملکی",
    dashboardSeller: "پنل فروشنده جایداد",
    dashboardAgent: "سامانه مدیریت مشتریان نماینده (CRM)",
    dashboardFavorites: "جایدادهای مورد پسند من",
    dashboardSavedSearches: "جستجوهای برگزیده من",
    dashboardListingAdd: "ثبت اعلان جایداد مدرن جدید",
    dashboardMyListings: "اعلان‌های جایداد فعال من",
    dashboardLeads: "سرنخ‌های جایداد اختصاصی من",
    addPhotos: "آدرس عکس‌های جایداد (لینک‌های تصویر)",
    btnPublish: "نشر جایداد و ترجمه هوشمند سه زبانه و همزمان",
    translateGenerating: "هوش مصنوعی در حال ترجمه جایداد به زبان‌های انگلیسی و پشتو است...",
    translateSuccess: "ترجمه همزمان سه زبانه با موفقیت انجام شد!",
    mockPaymentSuccess: "تکمیل پرداخت با موفقیت انجام شد! ملک با موفقیت ویژه گردید."
  },
  ps: {
    brandName: "کابل جایداد مرجع",
    slogan: "بشپړ د کابل او افغانستان د ملکیتونو هوشمند سیسټم له کورني ژباړې سره",
    searchPlaceholder: "پلټنه وکړئ د جایداد عنوان، سړک، جومات، ښوونځي یا پارک له لارې...",
    conversationalSearchBtn: "AI هوشمند لټون",
    conversationalSearchPrompt: "په اسانه ټکو کې ولیکئ څه غواړئ (مثلاً: 'په وزیر اکبر خان کې تر $300000 پورې یو کور')",
    conversationalPlaceholder: "له هوشِ مصنوعي څخه د لټون مرسته وغواړئ...",
    conversationalLoading: "د جایداد مشخصاتو سمال تحلیل په جريان کې دی...",
    conversationalSuccess: "هوشمند فلترونه پلي شول!",
    navBuy: "پېرودل (خرید)",
    navRent: "کرایه",
    navLease: "ګروی (لیزینګ)",
    navSell: "د نوي جایداد ثبتول",
    navDashboard: "زما کارن پاڼه",
    navAdmin: "سیسټم اداره",
    navAiAssistant: "له AI سره مشوره کول",
    lngEn: "English",
    lngDr: "دری",
    lngPs: "پښتو",
    btnSearch: "د املاکو لټول",
    btnReset: "د فلترونو پاکول",
    filterTitle: "د جایداد دقیق فلترونه",
    propType: "د جایداد ډول",
    priceRange: "د نرخ کچه (بودیجه)",
    bedrooms: "د خوب خونې",
    bathrooms: "بیت‌الخلا یا تشناب",
    size: "د جایداد پراخوالی او اندازه",
    age: "د جایداد پخوانیوالی (عمر)",
    features: "سهولتونه او امکانات",
    neighborhood: "د کابل اړوند سیمه",
    district: "بلدیه ناحیه",
    verifiedOnly: "یوازې باوري جایدادونه",
    featuredOnly: "ځانګړي او غوره جایدادونه",
    investmentScore: "د پانګونې کچه",
    rentalYield: "متوقعه د کال کرایه",
    roiProjection: "د بیې احتمالي لوړوالی (۵ کاله)",
    btnExplore: "د ټولو جایدادونو لیدل",
    btnViewDetails: "بشپړ جایداد معلومات",
    btnContactAgent: "له نماینده سره اړیکه",
    beds: "خونې",
    baths: "تشناب",
    sqm: "متر مربع",
    jerib: "جریب",
    yearsOld: "کلن",
    newProp: "نوې رغول شوې ودانۍ",
    nearbyText: "نږدې عامه ځایونه",
    whatsAppMsg: "واټس‌اپ پیغام",
    phoneCall: "مستقیمه زنګ وهل",
    telegramMsg: "ټیلیګرام اړیکه",
    emailMsg: "برېښنالیک لېږل",
    viewingRequestBtn: "د جایداد لیدلو غوښتنه",
    viewingRequestSuccess: "ستاسو د خت غوښتنه ثبت شوه! شبیه‌سازي شوی پیغام هغوی ته ولېږل شو.",
    viewingTitle: "د جایداد لیدلو نېټه او ساعت وټاکئ",
    viewingDate: "د لیدلو نېټه",
    viewingTime: "ساعت",
    buyerName: "ستاسو پوره نوم",
    buyerPhone: "د اړیکې شمېره (مثال: +93...)",
    buyerEmail: "ستاسو برېښنالیک پته",
    submitRequest: "د لیدلو غوښتنه وسپارئ",
    investmentAnalysis: "د هوش مصنوعي لخوا مالي او اقتصادي ارزونه",
    roiChartTitle: "په راتلونکو کلونو کې د بيې احتمالي پرمختګ (په زرو ډالرو کې)",
    mortgageCalculator: "د اسلامي شراکت او قسطونو ماشین حساب",
    mortgageDownPayment: "لومړنۍ پيسې (ډالر)",
    mortgageRate: "د ګټې فیصدي سالانه (%)",
    mortgageYears: "د قسطونو وخت (کلونه)",
    mortgageMonthlyPayment: "د میاشتني قسط اندازه",
    priceTrendPredict: "د کابل د جایدادونو راتلونکی لیدلوری",
    predictionUp: "دلته جایدادونه مخ پر وړاندې روان دي، پانګه اچونه بيخي ګټوره ده.",
    verificationBadge: "تایید شوی جایداد",
    agentBadge: "سردار ځانګړی استازی",
    trustSecTitle: "د قبالې د اسناد تایید اګاهي",
    fraudAlert: "ستاسو د امنیت لپاره: مهرباني وکړی مخکې له پيسو تادیې، د جایداد صفايي کتابچه او شرعي قباله زموږ د استازي لخوا په فزیکي پاڼه تایید کړئ.",
    otpVerify: "د تایید لپاره د یو ځل رمز شبیه‌سازي مېتود",
    priceTrend: "د جایداد تاریخي نرخ کچه",
    pkgTitle: "املاک ځانګړو اعلانونو ته لوړ کړئ",
    pkgFree: "وړیا (ساده)",
    pkgPremium: "لوړ اعتباره کڅوړه ($49 - ډېر لیدل)",
    pkgAgency: "د آژانس مسلکي ګډون ($199 / میاشت - د ټیم سیسټم)",
    btnUpgrade: "د غوښتنې تادیه شبیه‌سازي کول",
    adminManage: "د کابل د املاکو تر ټولو لوی کنټرول سیسټم",
    adminRevenue: "کارتونو او بانکي شبیه‌سازي عاید",
    adminUsers: "فعاله ګډونوال",
    adminLeadCount: "مجموعه پېرودونکي غوښتنې",
    adminActiveList: "ثبت شوي جایدادونه",
    dashboardBuyer: "د پیرودونکي پاڼه فعالیت",
    dashboardSeller: "د جایداد پلورونکي کنټرول غونډ",
    dashboardAgent: "د مشتریانو مدیریت (CRM) پاڼه",
    dashboardFavorites: "زما خوښ شوي جایدادونه",
    dashboardSavedSearches: "زما په زړه پورې لټونونه",
    dashboardListingAdd: "د نوي عصري جایداد ثبتول",
    dashboardMyListings: "زما فعال اعلانونه جایدادونه",
    dashboardLeads: "زما ځانګړي مشتریان",
    addPhotos: "د جایداد انځورونو پتې (لینکونه)",
    btnPublish: "د جایداد ثبتول او همزمان درې زبانه ژباړه",
    translateGenerating: "هوش مصنوعي د جایداد معلومات انګلیسي او فارسي ته ژباړي...",
    translateSuccess: "همزمان درې زبانه ژباړه په ښه توګه بشپړه شوه!",
    mockPaymentSuccess: "تادیه په بریالیتوب سره وشوه! جایداد پورته ځانګړي کچې ته لوړ شو."
  }
};
