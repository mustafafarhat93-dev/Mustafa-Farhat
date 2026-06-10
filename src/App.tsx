import React, { useState, useEffect } from "react";
import { PropertyListing, LanguageCode, SearchFilters, ViewingRequest, Lead } from "./types";
import { translations, SystemDictionary } from "./translations";
import { PropertyCard } from "./components/PropertyCard";
import { CustomMap } from "./components/CustomMap";
import { InvestmentCalculator } from "./components/InvestmentCalculator";
import { AIAdvisor } from "./components/AIAdvisor";
import { EXCHANGE_RATE, KABUL_NEIGHBORHOODS } from "./mockData";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";
import {
  Sparkles, Search, Filter, Globe, Plus, LayoutDashboard, Database, SlidersHorizontal,
  Home, MapPin, Phone, MessageSquare, Mail, Calendar, ShieldCheck, X, Check, Eye,
  RefreshCw, TrendingUp, DollarSign, Wallet, Users, Award, Trash2
} from "lucide-react";

export default function App() {
  const [lang, setLang] = useState<LanguageCode>("en");
  const t = translations[lang];
  const isRtl = lang === "dr" || lang === "ps";

  // properties logic
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [polygonFilterIds, setPolygonFilterIds] = useState<string[] | null>(null);

  // favorite catalog
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Dashboard tabs: 'explore' | 'dashboard' | 'admin'
  const [activeTab, setActiveTab] = useState<"explore" | "dashboard" | "admin">("explore");
  
  // Selected single listing for detailed popup overlay
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null);
  
  // Details Modal sub-panel tab: 'gallery' | 'map' | 'calculator' | 'sec'
  const [detailSubTab, setDetailSubTab] = useState<"gallery" | "map" | "calculator" | "sec">("gallery");

  // Filter Form State
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    purpose: "all",
    type: "all",
    priceMin: 0,
    priceMax: 1000000,
    currency: "USD",
    bedrooms: "all",
    bathrooms: "all",
    sizeMin: 0,
    sizeMax: 5000,
    sizeUnit: "sqm",
    age: "all",
    features: [],
    neighborhood: "all",
    isVerifiedOnly: false,
    isFeaturedOnly: false,
    roiMin: 0
  });

  // AI semantic parsing variables
  const [conversationalQuery, setConversationalQuery] = useState("");
  const [aiParsing, setAiParsing] = useState(false);
  const [aiParseAlert, setAiParseAlert] = useState<string | null>(null);

  // Sub accounts Dashboards: 'buyer' | 'seller' | 'agent'
  const [dashRole, setDashRole] = useState<"buyer" | "seller" | "agent">("buyer");

  // In-app form viewings
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  // Contact Inquiries Form state
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [inquiryFeedback, setInquiryFeedback] = useState<string | null>(null);

  // Seller: Create new Property listing
  const [newPropTitle, setNewPropTitle] = useState("");
  const [newPropDesc, setNewPropDesc] = useState("");
  const [newPropType, setNewPropType] = useState<any>("apartment");
  const [newPropPurpose, setNewPropPurpose] = useState<any>("buy");
  const [newPropPrice, setNewPropPrice] = useState<number>(85000);
  const [newPropBeds, setNewPropBeds] = useState(2);
  const [newPropBaths, setNewPropBaths] = useState(2);
  const [newPropSize, setNewPropSize] = useState(120);
  const [newPropAge, setNewPropAge] = useState(0);
  const [newPropNeighborhood, setNewPropNeighborhood] = useState("Wazir Akbar Khan");
  const [newPropAddress, setNewPropAddress] = useState("");
  const [newPropFeatures, setNewPropFeatures] = useState<string[]>(["Solar Power", "Security Guard"]);
  const [newPropImages, setNewPropImages] = useState<string>("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80");
  const [isTranslating, setIsTranslating] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Admin and CRM Database stats
  const [adminViewingRequests, setAdminViewingRequests] = useState<ViewingRequest[]>([]);
  const [adminLeadsList, setAdminLeadsList] = useState<Lead[]>([]);
  const [fraudOtfCode, setFraudOtfCode] = useState("");
  const [fraudVerifiedPhone, setFraudVerifiedPhone] = useState(false);
  
  // Simulated Checkout package selection for listing upgrades
  const [checkoutPropId, setCheckoutPropId] = useState<string | null>(null);
  const [checkoutPackage, setCheckoutPackage] = useState<string>("Featured Premium ($49)");
  const [checkoutMethod, setCheckoutMethod] = useState<string>("stripe");
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  // Synced local states for favorited properties
  useEffect(() => {
    const saved = localStorage.getItem("kph-favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Set RTL direction on head html node on language shift
  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [lang]);

  // Fetch properties from full-stack server
  const fetchPropertiesFromServer = async () => {
    setLoadingProperties(true);
    try {
      const res = await fetch("/api/properties");
      const json = await res.json();
      if (json.success) {
        setProperties(json.data);
      }
    } catch (err) {
      console.error("Unable to query central properties directory:", err);
    } finally {
      setLoadingProperties(false);
    }
  };

  const fetchViewingRequestsAndLeads = async () => {
    try {
      const vRes = await fetch("/api/viewings");
      const vJson = await vRes.json();
      if (vJson.success) setAdminViewingRequests(vJson.data);

      const lRes = await fetch("/api/leads");
      const lJson = await lRes.json();
      if (lJson.success) setAdminLeadsList(lJson.data);
    } catch (err) {
      console.error("Unable to sync admin ledgers:", err);
    }
  };

  useEffect(() => {
    fetchPropertiesFromServer();
    fetchViewingRequestsAndLeads();
  }, []);

  // Update properties on view logs
  const handleViewPropertyID = async (id: string) => {
    try {
      await fetch(`/api/properties/${id}/view`, { method: "POST" });
    } catch (err) {
      console.warn("Unable to log analysis views:", err);
    }
  };

  // Toggle favorite jaydads
  const handleFavoriteToggle = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("kph-favorites", JSON.stringify(updated));
  };

  // Run AI conversational search parser
  const handleConversationalSearch = async () => {
    if (!conversationalQuery.trim()) return;
    setAiParsing(true);
    setAiParseAlert(null);

    try {
      const res = await fetch("/api/ai/search-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: conversationalQuery })
      });
      const data = await res.json();

      if (data.success && data.filters) {
        const parsed = data.filters;
        
        // Feed parsed result directly into standard filters state!
        setFilters((prev) => ({
          ...prev,
          purpose: parsed.purpose && parsed.purpose !== "all" ? parsed.purpose : "all",
          type: parsed.type && parsed.type !== "all" ? parsed.type : "all",
          priceMax: parsed.priceMax ? parsed.priceMax : 1000000,
          neighborhood: parsed.neighborhood && parsed.neighborhood !== "all" ? parsed.neighborhood : "all",
          bedrooms: parsed.bedrooms ? parsed.bedrooms : "all"
        }));

        setAiParseAlert(t.conversationalSuccess);
        setTimeout(() => setAiParseAlert(null), 4000);
      }
    } catch (err) {
      console.error("Failed AI search conversion:", err);
    } finally {
      setAiParsing(false);
    }
  };

  // Handle viewing scheduler submitting
  const handleBookViewing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing || !bookingDate || !bookingName || !bookingPhone) return;

    try {
      const res = await fetch("/api/viewings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedListing.id,
          propertyName: selectedListing.title.en,
          buyerName: bookingName,
          buyerPhone: bookingPhone,
          buyerEmail: bookingEmail,
          requestedDate: bookingDate,
          requestedTime: bookingTime || "10:00 AM"
        })
      });
      const data = await res.json();
      if (data.success) {
        setBookingSuccessMsg(t.viewingRequestSuccess);
        setBookingDate("");
        setBookingName("");
        setBookingPhone("");
        setBookingEmail("");
        fetchViewingRequestsAndLeads();
        setTimeout(() => setBookingSuccessMsg(null), 6000);
      }
    } catch (err) {
      console.error("Inbound schedule registry failed:", err);
    }
  };

  // Handle direct inquiry submitting
  const handleDirectInquiry = async (e: React.FormEvent, source: "whatsapp" | "phone" | "telegram" | "email" = "whatsapp") => {
    e.preventDefault();
    if (!selectedListing || !inquiryName) return;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedListing.id,
          propertyName: selectedListing.title.en,
          name: inquiryName,
          email: inquiryEmail || "prospect@kabulpropertyhub.com",
          phone: inquiryPhone,
          message: inquiryMsg || `Inquiring about ${selectedListing.title.en}`,
          source
        })
      });
      const data = await res.json();
      if (data.success) {
        setInquiryFeedback(`Inquiry submitted successfully! Syncing Agent CRM...`);
        setInquiryName("");
        setInquiryPhone("");
        setInquiryMsg("");
        fetchViewingRequestsAndLeads();
        setTimeout(() => setInquiryFeedback(null), 4000);

        // Simulated quick opening of WhatsApp / Phone prompt to maintain real client contact flows
        if (source === "whatsapp") {
          window.open(`https://wa.me/${selectedListing.agent.whatsapp}?text=Hello ${selectedListing.agent.name}, I am interested in property ${selectedListing.title.en}.`, "_blank");
        }
      }
    } catch (err) {
      console.error("Agent lead assignment aborted:", err);
    }
  };

  // Submit new listing from Seller with Gemini automatic translations
  const handleSubmitNewProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropTitle || !newPropPrice) return;

    setIsTranslating(true);
    setActionSuccessMsg(t.translateGenerating);

    let enTitle = newPropTitle;
    let drTitle = newPropTitle;
    let psTitle = newPropTitle;

    let enDesc = newPropDesc;
    let drDesc = newPropDesc;
    let psDesc = newPropDesc;

    // Trigger Dynamic Server-Side Translations using Gemini API
    try {
      // 1. Translate Title
      const tRes = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newPropTitle, sourceLanguage: lang })
      });
      const tData = await tRes.json();
      if (tData.success && tData.translations) {
        enTitle = tData.translations.en;
        drTitle = tData.translations.dr;
        psTitle = tData.translations.ps;
      }

      // 2. Translate Description
      const dRes = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newPropDesc, sourceLanguage: lang })
      });
      const dData = await dRes.json();
      if (dData.success && dData.translations) {
        enDesc = dData.translations.en;
        drDesc = dData.translations.dr;
        psDesc = dData.translations.ps;
      }
    } catch (err) {
      console.warn("Server translations offline, falling back gracefully:", err);
    }

    setActionSuccessMsg(t.translateSuccess + " Finalizing property registration...");

    const createdProperty: PropertyListing = {
      id: `prop-${Date.now()}`,
      title: { en: enTitle, dr: drTitle, ps: psTitle },
      description: { en: enDesc, dr: drDesc, ps: psDesc },
      locationName: {
        en: `${newPropAddress || "Street 5, " + newPropNeighborhood}, Kabul`,
        dr: `کابل، سرک عمومی ${newPropNeighborhood}`,
        ps: `کابل، د ${newPropNeighborhood} عمومی سړک`
      },
      neighborhood: newPropNeighborhood,
      district: 10, // Default Wazir
      purpose: newPropPurpose,
      type: newPropType,
      priceUSD: Number(newPropPrice),
      priceAFN: Number(newPropPrice) * EXCHANGE_RATE,
      bedrooms: Number(newPropBeds),
      bathrooms: Number(newPropBaths),
      sizeSqm: Number(newPropSize),
      sizeJerib: Number(newPropSize) / 2000,
      ageYears: Number(newPropAge),
      features: newPropFeatures,
      images: [
        newPropImages || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
      ],
      coordinates: { lat: 34.535 + (Math.random() - 0.5) * 0.03, lng: 69.165 + (Math.random() - 0.5) * 0.03 },
      agent: {
        id: "agent-1",
        name: "Ahmad Mujtaba",
        role: "Luxury Specialist",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80",
        phone: "+93 79 912 3456",
        whatsapp: "+93799123456",
        telegram: "@ahmad_kph",
        email: "mujtaba@kabulpropertyhub.com",
        isVerified: true,
        companyName: "Kabul Elite Real Estate",
        rating: 4.9
      },
      isVerified: true,
      isFeatured: false,
      investmentMetrics: {
        rentalYield: 7.5,
        roiProjection: 12.0,
        investmentScore: 85,
        priceTrend: [
          { year: "2024", priceK: Math.round(newPropPrice / 1050) },
          { year: "2026", priceK: Math.round(newPropPrice / 1000) }
        ]
      },
      nearbyFacilities: [
        { name: { en: "District Mosque", dr: "مسجد جامع منطقه", ps: "ساحوي جومات" }, type: "mosque", distanceMin: 3 },
        { name: { en: "Sardar Market", dr: "بازار عامه", ps: "خوراکي بازار" }, type: "market", distanceMin: 5 }
      ],
      views: 12,
      leads: 0,
      createdAt: new Date().toISOString().split("T")[0]
    };

    try {
      const pRes = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createdProperty)
      });
      const pData = await pRes.json();
      if (pData.success) {
        setActionSuccessMsg(`Success! Beautiful listing published and catalogued globally.`);
        setNewPropTitle("");
        setNewPropDesc("");
        setNewPropPrice(80000);
        setNewPropAddress("");
        fetchPropertiesFromServer();
        setTimeout(() => setActionSuccessMsg(null), 5000);
      }
    } catch (err) {
      console.error("Listing registration crash:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Process Premium Package Submitting
  const handleUpgradeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPropId) return;

    try {
      const res = await fetch("/api/premium-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: checkoutPropId,
          packageName: checkoutPackage,
          price: checkoutPackage.includes("$49") ? 49 : 199,
          payMethod: checkoutMethod
        })
      });
      const data = await res.json();
      if (data.success) {
        setCheckoutSuccess(t.mockPaymentSuccess);
        fetchPropertiesFromServer();
        setTimeout(() => {
          setCheckoutSuccess(null);
          setCheckoutPropId(null);
        }, 5000);
      }
    } catch (err) {
      console.error("Upgrade billing crashed:", err);
    }
  };

  // Change individual viewing appointment status
  const handleUpdateViewingStatus = async (id: string, status: "confirmed" | "declined") => {
    try {
      const res = await fetch(`/api/viewings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchViewingRequestsAndLeads();
      }
    } catch (err) {
      console.error("Update viewing error:", err);
    }
  };

  // Dynamic filter lists matching both sidebar criteria and Polygon map tools
  const filteredListings = properties.filter((item) => {
    // 1. Polygon geometrical matching overlay
    if (polygonFilterIds && polygonFilterIds.length > 0) {
      if (!polygonFilterIds.includes(item.id)) return false;
    }

    // 2. Search query keyword
    if (filters.query.trim() !== "") {
      const needle = filters.query.toLowerCase();
      const titleMatch = (item.title[lang] || item.title.en).toLowerCase().includes(needle);
      const descMatch = (item.description[lang] || item.description.en).toLowerCase().includes(needle);
      const locMatch = (item.locationName[lang] || item.locationName.en).toLowerCase().includes(needle);
      const neighborMatch = (item.neighborhood || "").toLowerCase().includes(needle);
      if (!titleMatch && !descMatch && !locMatch && !neighborMatch) return false;
    }

    // 3. Purpose check
    if (filters.purpose !== "all" && item.purpose !== filters.purpose) return false;

    // 4. Property type check
    if (filters.type !== "all" && item.type !== filters.type) return false;

    // 5. Price restrictions
    const priceToCompare = filters.currency === "USD" ? item.priceUSD : item.priceAFN;
    if (priceToCompare > filters.priceMax) return false;
    if (priceToCompare < filters.priceMin) return false;

    // 6. Bedrooms
    if (filters.bedrooms !== "all") {
      if (filters.bedrooms === "studio" && item.bedrooms > 0) return false;
      if (filters.bedrooms.endsWith("+")) {
        const minBeds = parseInt(filters.bedrooms);
        if (item.bedrooms < minBeds) return false;
      }
    }

    // 7. Bathrooms
    if (filters.bathrooms !== "all" && filters.bathrooms.endsWith("+")) {
      const minBaths = parseInt(filters.bathrooms);
      if (item.bathrooms < minBaths) return false;
    }

    // 8. Size Area bounds
    if (item.sizeSqm < filters.sizeMin || item.sizeSqm > filters.sizeMax) return false;

    // 9. Selected Neighborhood
    if (filters.neighborhood !== "all" && item.neighborhood !== filters.neighborhood) return false;

    // 10. Status/Verification flags
    if (filters.isVerifiedOnly && !item.isVerified) return false;
    if (filters.isFeaturedOnly && !item.isFeatured) return false;

    return true;
  });

  // Simple reset function
  const handleResetFilters = () => {
    setFilters({
      query: "",
      purpose: "all",
      type: "all",
      priceMin: 0,
      priceMax: 1000000,
      currency: "USD",
      bedrooms: "all",
      bathrooms: "all",
      sizeMin: 0,
      sizeMax: 5000,
      sizeUnit: "sqm",
      age: "all",
      features: [],
      neighborhood: "all",
      isVerifiedOnly: false,
      isFeaturedOnly: false,
      roiMin: 0
    });
    setPolygonFilterIds(null);
    setConversationalQuery("");
  };

  // Mock admin data plotting statistics
  const adminRevenueData = [
    { name: "Jan", revenueK: 120, leads: 320 },
    { name: "Feb", revenueK: 145, leads: 390 },
    { name: "Mar", revenueK: 185, leads: 480 },
    { name: "Apr", revenueK: 210, leads: 560 },
    { name: "May", revenueK: 275, leads: 690 },
    { name: "Jun", revenueK: 320, leads: 740 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      
      {/* GLOBAL ENTERPRISE TOP NAVIGATION AREA */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Platform Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("explore")}>
            <div className="w-11 h-11 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-xl flex items-center justify-center font-black text-slate-950 font-mono shadow-lg border border-amber-400">
              KPH
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 matches-rtl">
                {t.brandName}
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-md font-sans font-semibold tracking-wider">
                  PD-GIS
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">{t.slogan}</p>
            </div>
          </div>

          {/* Core App Navigation anchors */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-slate-300">
            <button
              onClick={() => {
                setActiveTab("explore");
                setFilters((prev) => ({ ...prev, purpose: "buy" }));
              }}
              className="hover:text-amber-400 transition cursor-pointer"
            >
              {t.navBuy}
            </button>
            <button
              onClick={() => {
                setActiveTab("explore");
                setFilters((prev) => ({ ...prev, purpose: "rent" }));
              }}
              className="hover:text-amber-400 transition cursor-pointer"
            >
              {t.navRent}
            </button>
            <button
              onClick={() => {
                setActiveTab("explore");
                setFilters((prev) => ({ ...prev, purpose: "lease" }));
              }}
              className="hover:text-amber-400 transition cursor-pointer"
            >
              {t.navLease}
            </button>
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setDashRole("seller");
              }}
              className="hover:text-amber-400 transition text-amber-500 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {t.navSell}
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`hover:text-amber-400 transition flex items-center gap-1 cursor-pointer ${
                activeTab === "dashboard" ? "text-amber-500" : ""
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {t.navDashboard}
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`hover:text-amber-400 transition flex items-center gap-1 cursor-pointer ${
                activeTab === "admin" ? "text-amber-500" : ""
              }`}
            >
              <Database className="w-4 h-4" />
              {t.navAdmin}
            </button>
          </nav>

          {/* Quick Language Toggle buttons */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-1.5 rounded-xl border border-white/5 flex gap-1 text-xs">
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  lang === "en" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("dr")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  lang === "dr" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                دری
              </button>
              <button
                onClick={() => setLang("ps")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  lang === "ps" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                پښتو
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ACTIVE CONTENT SECTION SWITCH */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TAB 1: ADVANCED DIRECTORY EXPLORATION AND CHANNELS */}
        {activeTab === "explore" && (
          <div id="explore-listings-layout" className="space-y-8 animate-fade-in">
            
            {/* HERO SEMANTIC ADVANCED SEARCH PANEL */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2.5xl relative overflow-hidden space-y-6">
              
              {/* Background luxury gradient circles */}
              <div className="absolute right-0 bottom-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute left-1/4 top-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-2 max-w-2xl text-left rtl:text-right">
                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest block">
                  {t.brandName} Copilot Engine
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-normal">
                  {t.slogan}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  {t.conversationalSearchPrompt}
                </p>
              </div>

              {/* Conversational input trigger */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 max-w-4xl relative z-10 text-slate-900">
                <div className="md:col-span-4 relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4.5 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={conversationalQuery}
                    onChange={(e) => setConversationalQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-white rounded-2xl pl-12 pr-4 py-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 border border-slate-100 placeholder:text-slate-400 text-slate-800 font-medium"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleConversationalSearch();
                    }}
                  />
                </div>
                <button
                  onClick={handleConversationalSearch}
                  disabled={aiParsing || !conversationalQuery.trim()}
                  className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 py-4 px-6 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-505/20 col-span-1"
                >
                  {aiParsing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-slate-950" />
                  )}
                  {t.conversationalSearchBtn}
                </button>
              </div>

              {/* Parsed feedback alert message banner */}
              {aiParseAlert && (
                <div className="bg-emerald-900/30 text-emerald-400 px-4 py-3 border border-emerald-500/20 rounded-xl text-xs flex items-center gap-2 max-w-2xl animate-fade-in">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{aiParseAlert}</span>
                </div>
              )}

            </div>

            {/* EXPANDED GIS FILTERS PANEL */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm space-y-6">
              
              <div className="flex items-center gap-2 text-slate-800 pb-3 border-b border-slate-100">
                <SlidersHorizontal className="w-5 h-5 text-slate-700" />
                <h3 className="text-xs font-bold uppercase tracking-widest">{t.filterTitle}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs text-left rtl:text-right">
                
                {/* Purpose Selector */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-500">{t.propType} • Option</label>
                  <select
                    value={filters.purpose}
                    onChange={(e) => setFilters((prev) => ({ ...prev, purpose: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 focus:outline-none focus:border-amber-500 font-medium text-slate-700"
                  >
                    <option value="all">All Purpose Modes (Any)</option>
                    <option value="buy">For Sale (خرید / پېرلو)</option>
                    <option value="rent">For Rent (کرایه)</option>
                    <option value="lease">Long Lease / Gov-Commercial (لیزینگ)</option>
                  </select>
                </div>

                {/* Property Type */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-500">Asset Housing Category</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 focus:outline-none focus:border-amber-500 font-medium text-slate-700"
                  >
                    <option value="all">Any Category (هر ډول)</option>
                    <option value="villa">Luxury Villa (ویلای لوکس)</option>
                    <option value="apartment">Apartment Suite (آپارتمان)</option>
                    <option value="house">Standard Family House (حویلی)</option>
                    <option value="commercial">Commercial Complex</option>
                    <option value="office">Executive Corporate Office</option>
                    <option value="shop">Retail Shop (دکان)</option>
                    <option value="warehouse">Storage Warehouse (گودام)</option>
                    <option value="land">Commercial Land Plot (زمین سفید)</option>
                  </select>
                </div>

                {/* Price boundaries & Currency switcher */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">{t.priceRange}</span>
                    <button
                      onClick={() => setFilters((prev) => ({
                        ...prev,
                        currency: prev.currency === "USD" ? "AFN" : "USD",
                        priceMin: 0,
                        priceMax: prev.currency === "USD" ? 75000000 : 1000000
                      }))}
                      className="text-amber-600 hover:underline font-bold"
                    >
                      Use {filters.currency === "USD" ? "AFN" : "USD"}
                    </button>
                  </div>
                  
                  <select
                    value={filters.priceMax}
                    onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 focus:outline-none focus:border-amber-500 font-medium text-slate-700"
                  >
                    <option value="1000000">No Max Limit</option>
                    {filters.currency === "USD" ? (
                      <>
                        <option value="50000">Under $50,050</option>
                        <option value="100000">Under $100,000</option>
                        <option value="200000">Under $200,000</option>
                        <option value="300000">Under $300,000</option>
                        <option value="500000">Under $500,000</option>
                      </>
                    ) : (
                      <>
                        <option value="3750000">Under 3.7 Million AFN</option>
                        <option value="7500000">Under 7.5 Million AFN</option>
                        <option value="15000000">Under 15 Million AFN</option>
                        <option value="22500000">Under 22.5 Million AFN</option>
                        <option value="37500000">Under 37.5 Million AFN</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Neighborhood specific Selector */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-500">{t.neighborhood}</label>
                  <select
                    value={filters.neighborhood}
                    onChange={(e) => setFilters((prev) => ({ ...prev, neighborhood: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 focus:outline-none focus:border-amber-500 font-medium text-slate-700"
                  >
                    <option value="all">Any neighborhood sector</option>
                    {KABUL_NEIGHBORHOODS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Second row of filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-3 text-xs text-left rtl:text-right border-t border-slate-100">
                
                {/* Rooms selection */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-500">{t.bedrooms}</label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => setFilters((prev) => ({ ...prev, bedrooms: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 focus:outline-none"
                  >
                    <option value="all">All room counts</option>
                    <option value="studio">Studio Apartment</option>
                    <option value="1+">1+ Bedroom</option>
                    <option value="2+">2+ Bedrooms</option>
                    <option value="3+">3+ Bedrooms</option>
                    <option value="4+">4+ Bedrooms</option>
                    <option value="5+">5+ Bedrooms</option>
                  </select>
                </div>

                {/* Size dimensions */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-500">{t.size} area</label>
                  <select
                    value={filters.sizeMax}
                    onChange={(e) => setFilters((prev) => ({ ...prev, sizeMax: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 focus:outline-none"
                  >
                    <option value="5000">Any size dimensions</option>
                    <option value="100">Under 100 Sqm (~0.05 Jerib)</option>
                    <option value="200">Under 200 Sqm (~0.1 Jerib)</option>
                    <option value="500">Under 500 Sqm (~0.25 Jerib)</option>
                    <option value="1000">Under 1000 Sqm (~0.5 Jerib)</option>
                    <option value="2000">Under 2000 Sqm (1 Jerib)</option>
                  </select>
                </div>

                {/* Checkbox triggers */}
                <div className="sm:col-span-2 flex flex-wrap gap-5 items-center justify-start py-2 font-semibold">
                  <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.isVerifiedOnly}
                      onChange={(e) => setFilters((prev) => ({ ...prev, isVerifiedOnly: e.target.checked }))}
                      className="w-4 h-4 rounded text-amber-500 border-slate-300 focus:ring-amber-400 cursor-pointer"
                    />
                    <span>{t.verifiedOnly}</span>
                  </label>

                  <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.isFeaturedOnly}
                      onChange={(e) => setFilters((prev) => ({ ...prev, isFeaturedOnly: e.target.checked }))}
                      className="w-4 h-4 rounded text-amber-500 border-slate-300 focus:ring-amber-400 cursor-pointer"
                    />
                    <span>Sardar Elite Only</span>
                  </label>

                  <button
                    onClick={handleResetFilters}
                    className="text-amber-600 hover:text-amber-500 font-bold ml-auto"
                  >
                    {t.btnReset}
                  </button>
                </div>
              </div>

            </div>

            {/* MAIN MAP + DIRECTORY SPLIT GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* GIS Live Map Feed column (takes 7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-start">
                <CustomMap
                  properties={filteredListings}
                  lang={lang}
                  selectedProperty={selectedListing}
                  onSelectProperty={(p) => {
                    setSelectedListing(p);
                    handleViewPropertyID(p.id);
                  }}
                  onPolygonFilter={(ids) => {
                    setPolygonFilterIds(ids);
                  }}
                />
              </div>

              {/* Property list catalog timeline column (takes 5 cols) */}
              <div className="lg:col-span-5 space-y-4 max-h-[570px] overflow-y-auto pr-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {filteredListings.length} properties matched
                  </h4>
                  {polygonFilterIds && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-200">
                      Polygon filtered
                    </span>
                  )}
                </div>

                {loadingProperties ? (
                  <div className="p-12 text-center text-slate-400 animate-pulse">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
                    <span>Loading directory listings...</span>
                  </div>
                ) : filteredListings.length === 0 ? (
                  <div className="p-12 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
                    <Home className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs">No listings found matching active criteria.</p>
                    <button
                      onClick={handleResetFilters}
                      className="text-amber-500 text-xs font-bold mt-2 hover:underline"
                    >
                      Clear search parameters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {filteredListings.map((prop) => (
                      <PropertyCard
                        key={prop.id}
                        property={prop}
                        lang={lang}
                        isFavorited={favorites.includes(prop.id)}
                        onFavoriteToggle={handleFavoriteToggle}
                        onViewDetails={(p) => {
                          setSelectedListing(p);
                          handleViewPropertyID(p.id);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: DETAILED USER PERSONAL DASHBOARDS */}
        {activeTab === "dashboard" && (
          <div id="user-sub-dashboards" className="space-y-8 animate-fade-in text-left rtl:text-right">
            
            {/* Horizontal Dashboard Tabs Bar */}
            <div className="flex bg-slate-900 text-white rounded-2xl p-1.5 border border-white/10 shadow-lg text-xs font-bold max-w-sm shrink-0 matches-rtl">
              <button
                onClick={() => setDashRole("buyer")}
                className={`flex-1 py-3 rounded-xl transition ${
                  dashRole === "buyer" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                👤 {t.dashboardBuyer}
              </button>
              <button
                onClick={() => setDashRole("seller")}
                className={`flex-1 py-3 rounded-xl transition ${
                  dashRole === "seller" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                💼 {t.dashboardSeller}
              </button>
              <button
                onClick={() => setDashRole("agent")}
                className={`flex-1 py-3 rounded-xl transition ${
                  dashRole === "agent" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                📢 {t.dashboardAgent}
              </button>
            </div>

            {/* DASHROLE 1: BUYER PREFERENCES AND SAVED INVENTORIES */}
            {dashRole === "buyer" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Favorites section */}
                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-3">
                      ❤️ {t.dashboardFavorites} ({favorites.length})
                    </h4>

                    {favorites.length === 0 ? (
                      <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400 text-xs">
                        No favorited properties. Click heart badges on propery cards to add.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {properties
                          .filter((p) => favorites.includes(p.id))
                          .map((p) => (
                            <PropertyCard
                              key={p.id}
                              property={p}
                              lang={lang}
                              isFavorited={true}
                              onFavoriteToggle={handleFavoriteToggle}
                              onViewDetails={(pObj) => setSelectedListing(pObj)}
                            />
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Saved inquiries and alerts */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-indigo-100 pb-2">
                      📣 Saved Custom Alerts & Notifications
                    </h4>
                    
                    <div className="space-y-3 font-medium text-xs text-slate-700">
                      <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <p className="font-bold text-indigo-950">Wazir Akbar Khan Diplomatic Houses</p>
                        <p className="text-[10px] text-indigo-500 mt-1">Alert active • matching target price ($400k+)</p>
                      </div>
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <p className="font-bold text-emerald-950">Appreciated Shahr-e-Naw Offices</p>
                        <p className="text-[10px] text-emerald-500 mt-1">Alert active • matching ROI goals (8.5%+)</p>
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {/* DASHROLE 2: SELLER PORTAL AND GENERATIVE GEMINI REGISTER FORM */}
            {dashRole === "seller" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Submit Form with server-side AI translations (takes 7 columns) */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-sm space-y-6">
                  
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest block">
                      Intellectual MLS publisher
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {t.dashboardListingAdd}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Your input is automatically translated into both Dari (Persian) and Pashto by our server-side Gemini API translator.
                    </p>
                  </div>

                  {actionSuccessMsg && (
                    <div className="bg-indigo-900/10 text-indigo-700 px-4 py-3 border border-indigo-400/20 rounded-xl text-xs flex items-center gap-2 animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-amber-500" />
                      <span>{actionSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitNewProperty} className="space-y-4 text-xs font-medium">
                    
                    {/* Title */}
                    <div className="space-y-1.5 text-left">
                      <label className="font-bold text-slate-600 block">Property Advertised Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Luxury 4-Bedroom Villa near Shahr-e-Naw Mall"
                        value={newPropTitle}
                        onChange={(e) => setNewPropTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                      />
                    </div>

                    {/* Desc */}
                    <div className="space-y-1.5 text-left">
                      <label className="font-bold text-slate-600 block">Catalog Detailed Description</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Detail backup generators, water supply pumps, solar arrays, nearby mosques, security clearance..."
                        value={newPropDesc}
                        onChange={(e) => setNewPropDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                      />
                    </div>

                    {/* Category selectors */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="font-bold text-slate-600 block">Purpose Mode</label>
                        <select
                          value={newPropPurpose}
                          onChange={(e) => setNewPropPurpose(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                        >
                          <option value="buy">For Sale</option>
                          <option value="rent">For Rent</option>
                          <option value="lease">Long-term Lease / Grovi</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="font-bold text-slate-600 block">Housing Class</label>
                        <select
                          value={newPropType}
                          onChange={(e) => setNewPropType(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                        >
                          <option value="apartment">Apartment</option>
                          <option value="house">Family House</option>
                          <option value="villa">Luxury Villa</option>
                          <option value="office">Corporate Office</option>
                          <option value="land">Open Land Field</option>
                        </select>
                      </div>
                    </div>

                    {/* Price, Rooms, Size specs */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      
                      <div className="space-y-1.5 text-left sm:col-span-2">
                        <label className="font-bold text-slate-600 block">Asset Target Price (USD)</label>
                        <input
                          type="number"
                          required
                          value={newPropPrice}
                          onChange={(e) => setNewPropPrice(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="font-bold text-slate-600 block">Beds count</label>
                        <input
                          type="number"
                          value={newPropBeds}
                          onChange={(e) => setNewPropBeds(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="font-bold text-slate-600 block">Size (Sqm)</label>
                        <input
                          type="number"
                          value={newPropSize}
                          onChange={(e) => setNewPropSize(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Neighborhood location */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="font-bold text-slate-600 block">Neighborhood Select</label>
                        <select
                          value={newPropNeighborhood}
                          onChange={(e) => setNewPropNeighborhood(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                        >
                          {KABUL_NEIGHBORHOODS.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="font-bold text-slate-600 block">Street Specific Coordinates</label>
                        <input
                          type="text"
                          placeholder="e.g. Street 3, Qala-Fatullah"
                          value={newPropAddress}
                          onChange={(e) => setNewPropAddress(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Banner Image URL */}
                    <div className="space-y-1.5 text-left">
                      <label className="font-bold text-slate-600 block">{t.addPhotos}</label>
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={newPropImages}
                        onChange={(e) => setNewPropImages(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isTranslating}
                      className="w-full bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 font-extrabold text-xs sm:text-sm py-4 rounded-2xl transition shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
                    >
                      {isTranslating ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Globe className="w-5 h-5 text-amber-500" />
                      )}
                      {t.btnPublish}
                    </button>

                  </form>
                </div>

                {/* Seller listings index list (takes 5 columns) */}
                <div className="lg:col-span-5 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-3">
                    🏢 {t.dashboardMyListings} ({properties.length})
                  </h4>

                  <div className="space-y-3 max-h-[480px] overflow-y-auto">
                    {properties.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.images[0]}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.title[lang] || item.title.en}</p>
                            <p className="text-[10px] text-slate-400">{item.neighborhood} • ${item.priceUSD.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 text-right">
                          {item.isFeatured ? (
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-md">
                              Sardar Premium
                            </span>
                          ) : (
                            <button
                              onClick={() => setCheckoutPropId(item.id)}
                              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[9px] font-bold px-2.5 py-1.5 rounded-lg transition"
                            >
                              Upgrade
                            </button>
                          )}
                          <span className="text-[9px] text-slate-400">{item.views} Views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* DASHROLE 3: PROFESSIONAL AGENT PLATFORM CRM AND COMMISSIONS */}
            {dashRole === "agent" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* leads crm list */}
                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-3">
                      🎯 Inbound CRM Leads Registry ({adminLeadsList.length})
                    </h4>

                    {adminLeadsList.length === 0 ? (
                      <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400 text-xs">
                        No customer leads registered. Submit contacts via details inquiries forms to simulate workspace.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {adminLeadsList.map((lead) => (
                          <div
                            key={lead.id}
                            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500">
                                Source via {lead.source}
                              </span>
                              <h5 className="text-xs font-bold text-slate-800">{lead.name}</h5>
                              <p className="text-[10px] font-semibold text-slate-600 font-mono">Phone: {lead.phone} | {lead.email}</p>
                              <p className="text-xs text-slate-500 italic">"{lead.message}"</p>
                              <p className="text-[9px] text-slate-400">Attached Property: {lead.propertyName}</p>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => window.open(`tel:${lead.phone}`)}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition"
                              >
                                Call Broker
                              </button>
                              <button
                                onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\s+/g, "")}`)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition"
                              >
                                WhatsApp
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* commission & quota cards */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-250/60 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-amber-100 pb-2">
                        💰 Commission ledger Quotas
                      </h4>

                      <div className="bg-slate-55 p-3 rounded-xl block">
                        <span className="text-[10px] text-slate-400 block uppercase">Estimated Monthly Profit</span>
                        <span className="text-lg font-bold text-slate-800">$12,450 USD</span>
                        <span className="text-[10px] text-emerald-600 block mt-1">+14.2% Growth vs prior month</span>
                      </div>

                      <div className="bg-slate-55 p-3 rounded-xl block">
                        <span className="text-[10px] text-slate-400 block uppercase">Closed Brokerages (Q2)</span>
                        <span className="text-lg font-bold text-slate-800">18 verified deals</span>
                      </div>
                    </div>
                  </div>
                </div>
            )}

          </div>
        )}

        {/* TAB 3: ADMIN SUPERINTENDENT PLATFORM & METRICS CHARTS */}
        {activeTab === "admin" && (
          <div id="admin-super-panel" className="space-y-8 animate-fade-in text-left rtl:text-right">
            
            {/* Header counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t.adminActiveList}</span>
                <span className="text-2xl font-extrabold text-slate-800">{properties.length} Active</span>
                <span className="text-[10px] text-emerald-500 block mt-1">Sardar verified</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t.adminLeadCount}</span>
                <span className="text-2xl font-extrabold text-slate-800">{adminLeadsList.length} global</span>
                <span className="text-[10px] text-indigo-500 block mt-1">Direct inquiries sync</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Moderator Queue</span>
                <span className="text-2xl font-extrabold text-slate-800">{adminViewingRequests.length} visits</span>
                <span className="text-[10px] text-amber-600 block mt-1">Pending slots</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Stripe & Cash Revenue</span>
                <span className="text-2xl font-extrabold text-emerald-600">$18,490</span>
                <span className="text-[10px] text-emerald-500 block mt-1">M-Paisa & Transfer synced</span>
              </div>
            </div>

            {/* RECHARTS AREA GRAPH PANEL */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4 text-white">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 matches-rtl">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                {t.adminRevenue} & Conversion analytics
              </h4>

              <div className="h-64 sm:h-80 w-full bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={adminRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px" }} />
                    <Area type="monotone" dataKey="revenueK" name="Premium Sales (k$)" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Inbound Viewing Schedule Confirm Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">
                  🏦 Moderate Inbound Viewing request slots
                </h4>

                {adminViewingRequests.length === 0 ? (
                  <div className="text-xs text-slate-400 text-center py-6">
                    No viewing slots registered. Open listing detail pages and request schedules to populate details!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {adminViewingRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-semibold"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800">{req.buyerName}</p>
                          <p className="text-[10px] text-slate-500">Scheduled Date: {req.requestedDate} @ {req.requestedTime}</p>
                          <p className="text-[9px] text-indigo-500 uppercase">Attached Listing: {req.propertyName}</p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          {req.status === "pending" ? (
                            <>
                              <button
                                onClick={() => handleUpdateViewingStatus(req.id, "confirmed")}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleUpdateViewingStatus(req.id, "declined")}
                                className="bg-red-500 hover:bg-red-400 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold"
                              >
                                Decline
                              </button>
                            </>
                          ) : (
                            <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg ${
                              req.status === "confirmed" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                            }`}>
                              {req.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Anti Fraud OTP Validation and Trust simulator */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-indigo-100 pb-2">
                  🛡️ Local Moderator Verification & OTP Validator
                </h4>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                  Before confirming diplomatic title modifications and Safayi deed records, all agents undergo dual SMS OTP verification checks.
                </p>

                <div className="bg-indigo-50/50 border border-indigo-200/40 p-4 rounded-xl space-y-3 text-xs">
                  <p className="font-bold text-indigo-950">Verify Agent Security Token</p>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter 6-digit Secret (e.g. 191923)"
                      value={fraudOtfCode}
                      onChange={(e) => setFraudOtfCode(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-lg p-2 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (fraudOtfCode === "191923" || fraudOtfCode.length >= 4) {
                          setFraudVerifiedPhone(true);
                        }
                      }}
                      className="bg-slate-900 text-white font-bold px-4 py-2 rounded-lg text-[11px]"
                    >
                      Authenticate
                    </button>
                  </div>

                  {fraudVerifiedPhone ? (
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      ✓ Verification successful! Agent security clearance approved. Certified safe.
                    </p>
                  ) : (
                    <p className="text-[9px] text-slate-400">
                      *Simulate OTP validation by entering any 4-6 digit numeric code.
                    </p>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* DETAILED PROPERTY POPUP GALLERY OVERLAY MODAL */}
      <AnimatePresence>
        {selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="property-detail-overlay-popup"
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-105 shadow-2xl relative select-text"
            >
              
              {/* Close button */}
              <button
                onClick={() => setSelectedListing(null)}
                className="absolute top-4 right-4 z-30 bg-slate-900/80 text-white hover:bg-amber-500 hover:text-slate-950 p-2 rounded-full transition focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Cover Banner Carousel Area */}
              <div className="relative h-64 sm:h-80 bg-slate-900">
                <img
                  src={selectedListing.images[0]}
                  alt=""
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />
                
                <div className="absolute bottom-5 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
                  <div className="text-left rtl:text-right">
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md mb-1.5 inline-block matches-rtl">
                      {selectedListing.type} • {translations[lang][selectedListing.purpose as keyof SystemDictionary] || selectedListing.purpose}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                      {selectedListing.title[lang] || selectedListing.title.en}
                    </h2>
                    <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedListing.locationName[lang] || selectedListing.locationName.en}
                    </p>
                  </div>

                  <div className="text-left sm:text-right font-sans shrink-0">
                    <p className="text-2xl font-extrabold text-amber-500">${selectedListing.priceUSD.toLocaleString()}</p>
                    <p className="text-xs font-semibold text-emerald-400 font-mono">
                      {(selectedListing.priceUSD * EXCHANGE_RATE).toLocaleString()} AFN
                    </p>
                  </div>
                </div>
              </div>

              {/* Sub-tabs menu inside overlay selector */}
              <div className="flex bg-slate-100 p-1 border-b border-slate-200 text-xs font-bold font-sans matches-rtl">
                {[
                  { id: "gallery", label: "Overview & Gallery" },
                  { id: "calculator", label: "Financial ROI Calculator" },
                  { id: "sec", label: t.trustSecTitle }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDetailSubTab(tab.id as any)}
                    className={`px-5 py-3 transition-all ${
                      detailSubTab === tab.id
                        ? "bg-white text-slate-900 border-b-2 border-amber-500 font-extrabold shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Modal Core Content */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* GALLERY / OVERVIEW TAB */}
                {detailSubTab === "gallery" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs font-medium">
                    
                    {/* Primary specs column (takes 7 columns) */}
                    <div className="lg:col-span-7 space-y-5 text-left rtl:text-right">
                      
                      {/* Description */}
                      <div className="space-y-1.5">
                        <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Property Details Description</h4>
                        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                          {selectedListing.description[lang] || selectedListing.description.en}
                        </p>
                      </div>

                      {/* Amenities Features tags */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Included Amenities & Systems</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedListing.features.map((feat) => (
                            <span
                              key={feat}
                              className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-lg text-[10.5px] font-semibold"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Distance to nearby schools and hospitals */}
                      <div className="space-y-3.5 border-t border-slate-100 pt-4">
                        <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.nearbyText}</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {selectedListing.nearbyFacilities.map((fac, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-slate-50 rounded-xl border border-slate-105 flex items-center gap-3"
                            >
                              <div className="p-2 bg-slate-200 rounded-lg shrink-0">
                                {fac.type === "hospital" ? "🏥" : fac.type === "mosque" ? "🕌" : fac.type === "university" ? "🏫" : "🌳"}
                              </div>
                              <div className="text-left rtl:text-right">
                                <p className="font-bold text-slate-800">{fac.name[lang] || fac.name.en}</p>
                                <p className="text-[10px] text-slate-400 capitalize">{fac.type} • {fac.distanceMin} mins distance</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Contact or scheduling inquiry column (takes 5 columns) */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* Agent profile brief */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-center flex flex-col items-center gap-2">
                        <img
                          src={selectedListing.agent.avatar}
                          alt=""
                          className="w-16 h-16 rounded-full border border-slate-200 object-cover"
                        />
                        <div className="text-center">
                          <h4 className="font-bold text-slate-800 flex items-center justify-center gap-1.5">
                            {selectedListing.agent.name}
                            {selectedListing.agent.isVerified && (
                              <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                                Verified
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-medium">{selectedListing.agent.role}</p>
                        </div>
                      </div>

                      {/* Date/Time scheduler slot submit form */}
                      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t.viewingRequestBtn}</h4>

                        {bookingSuccessMsg ? (
                          <div className="bg-emerald-950/50 text-emerald-400 px-3.5 py-3 border border-emerald-500/20 rounded-xl text-[11px]">
                            {bookingSuccessMsg}
                          </div>
                        ) : (
                          <form onSubmit={handleBookViewing} className="space-y-3 font-medium text-xs text-slate-800">
                            
                            <div className="grid grid-cols-2 gap-2">
                              {/* Date */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] text-slate-400 block">{t.viewingDate}</label>
                                <input
                                  type="date"
                                  required
                                  value={bookingDate}
                                  onChange={(e) => setBookingDate(e.target.value)}
                                  className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg p-2 focus:outline-none"
                                />
                              </div>

                              {/* Time */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] text-slate-400 block">{t.viewingTime}</label>
                                <input
                                  type="text"
                                  placeholder="e.g. 11:30 AM"
                                  value={bookingTime}
                                  onChange={(e) => setBookingTime(e.target.value)}
                                  className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg p-2 focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Buyer params */}
                            <div className="space-y-1 text-left">
                              <label className="text-[10px] text-slate-400 block">{t.buyerName}</label>
                              <input
                                type="text"
                                required
                                placeholder="Your full name"
                                value={bookingName}
                                onChange={(e) => setBookingName(e.target.value)}
                                className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg p-2 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1 text-left">
                              <label className="text-[10px] text-slate-400 block">{t.buyerPhone}</label>
                              <input
                                type="text"
                                required
                                placeholder="+93 79..."
                                value={bookingPhone}
                                onChange={(e) => setBookingPhone(e.target.value)}
                                className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg p-2 focus:outline-none"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 p-3 rounded-lg transition mt-2 cursor-pointer"
                            >
                              {t.submitRequest}
                            </button>

                          </form>
                        )}
                      </div>

                      {/* Direct Agent Contact Mocks Form */}
                      <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm space-y-3 text-xs">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                          📨 Inquiry Direct to Agent
                        </h4>
                        
                        {inquiryFeedback && (
                          <div className="bg-emerald-50 text-emerald-800 p-3 border border-emerald-200 rounded-xl">
                            {inquiryFeedback}
                          </div>
                        )}

                        <form onSubmit={(e) => handleDirectInquiry(e, "whatsapp")} className="space-y-2.5 font-semibold text-slate-700">
                          <input
                            type="text"
                            required
                            placeholder="Name"
                            value={inquiryName}
                            onChange={(e) => setInquiryName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Phone Number"
                            value={inquiryPhone}
                            onChange={(e) => setInquiryPhone(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                          />

                          <div className="grid grid-cols-2 gap-2 mt-3 pt-1 border-t border-slate-100">
                            <button
                              type="submit"
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                            >
                              WhatsApp
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDirectInquiry(e, "phone")}
                              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                            >
                              {t.phoneCall}
                            </button>
                          </div>
                        </form>
                      </div>

                    </div>

                  </div>
                )}

                {/* CALCULATOR / ANALYSIS TAB */}
                {detailSubTab === "calculator" && (
                  <div className="space-y-6">
                    <InvestmentCalculator property={selectedListing} lang={lang} />
                  </div>
                )}

                {/* TRUST & ANTI-FRAUD SECTION */}
                {detailSubTab === "sec" && (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs leading-relaxed text-slate-700 text-left">
                    <h3 className="text-sm font-bold text-slate-900">{t.trustSecTitle}</h3>
                    
                    <p>
                      Kabul Property Hub implements high security KYC verifications for both publishers and advisors. Every diplomatic asset listed contains strict certification tags only compiled when local notarized documents (Safa-e books, and Azizi-Kabul legal properties registries) are vetted.
                    </p>

                    <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3">
                      <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-amber-950">Certification Guidelines Alert</p>
                        <p className="text-[11px] text-slate-700 mt-1">{t.fraudAlert}</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT PACKAGE CONFIGURATION SLIDE OVERLAY MODAL */}
      <AnimatePresence>
        {checkoutPropId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border shadow-2xl relative text-left"
            >
              <button
                onClick={() => setCheckoutPropId(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4 text-xs font-semibold text-slate-700">
                <h3 className="text-sm font-bold text-slate-900">{t.pkgTitle}</h3>

                {checkoutSuccess ? (
                  <div className="bg-emerald-50 text-emerald-800 p-4 border border-emerald-200 rounded-xl">
                    {checkoutSuccess}
                  </div>
                ) : (
                  <form onSubmit={handleUpgradeCheckout} className="space-y-3">
                    
                    <div className="space-y-1">
                      <label className="block text-slate-600">Select Campaign Tier</label>
                      <select
                        value={checkoutPackage}
                        onChange={(e) => setCheckoutPackage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                      >
                        <option value="Featured Premium ($49)">{t.pkgPremium}</option>
                        <option value="Agency Pro ($199 / mo)">{t.pkgAgency}</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-600">Select Gateway Option</label>
                      <select
                        value={checkoutMethod}
                        onChange={(e) => setCheckoutMethod(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                      >
                        <option value="stripe">Stripe Instant (Simulated)</option>
                        <option value="azizi">Azizi Bank Afghan Transfer</option>
                        <option value="mpaisa">M-Paisa cash transfer</option>
                      </select>
                    </div>

                    {checkoutMethod === "azizi" && (
                      <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-[10.5px] leading-snug text-indigo-950 font-normal">
                        Please wire reference funds to Azizi Bank Kabul Head Office Account: <b>KPH-900133-75</b>. Send receipt snapshot to customercare@kph.af.
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold p-3.5 rounded-xl transition mt-4"
                    >
                      {t.btnUpgrade}
                    </button>

                  </form>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING RAG ADVISORY BOT ASSISTANT SIDEBAR PANEL */}
      <AIAdvisor lang={lang} onSelectPropertyByAI={(id) => {
        const found = properties.find((p) => p.id === id);
        if (found) {
          setSelectedListing(found);
          handleViewPropertyID(found.id);
        }
      }} />

      {/* ENTERPRISE LOWER MARGIN AND REPUTATION AREA */}
      <footer className="bg-slate-900 text-white border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span>© 2026 Kabul Property Hub (KPH-MLS Project). Handcrafted for Kabul and Afghanistan Real Estates.</span>
          </div>
          
          <div className="flex gap-4">
            <span className="hover:text-white transition cursor-pointer">Security Ledger</span>
            <span>•</span>
            <span className="hover:text-white transition cursor-pointer">Safayi Deeds Registry</span>
            <span>•</span>
            <span className="hover:text-white transition cursor-pointer">Azizi Legal Notary</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
