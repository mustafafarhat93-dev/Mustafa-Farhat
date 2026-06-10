/**
 * Core type definitions for Kabul Property Hub
 */

export type LanguageCode = "en" | "dr" | "ps";

export interface MultilingualText {
  en: string;
  dr: string; // Dari
  ps: string; // Pashto
}

export type PropertyPurpose = "buy" | "rent" | "lease";

export type PropertyType = 
  | "house" 
  | "villa" 
  | "apartment" 
  | "commercial" 
  | "office" 
  | "shop" 
  | "warehouse" 
  | "land" 
  | "farm";

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  email: string;
  isVerified: boolean;
  companyName: string;
  rating: number;
}

export interface InvestmentMetrics {
  rentalYield: number; // e.g. 7.5%
  roiProjection: number; // e.g. 12%
  investmentScore: number; // e.g. 85 / 100
  priceTrend: { year: string; priceK: number }[]; // historical trends
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface NearbyFacility {
  name: MultilingualText;
  type: "school" | "hospital" | "mosque" | "market" | "park" | "university";
  distanceMin: number; // distance in minutes walking / driving
}

export interface PropertyListing {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  locationName: MultilingualText; // e.g. "Street 15, Wazir Akbar Khan"
  neighborhood: string; // e.g. "Wazir Akbar Khan"
  district: number; // e.g., 10 for PD10
  purpose: PropertyPurpose;
  type: PropertyType;
  priceUSD: number;
  priceAFN: number; // converted using config exchange rate
  bedrooms: number; // 0 for Studio
  bathrooms: number;
  sizeSqm: number;
  sizeJerib?: number; // size in Afghan Jeribs (1 jerib = 2000 sqm)
  ageYears: number; // 0 for new
  features: string[]; // generator, solar, secure, cctv, pool, parking, garden, etc.
  images: string[];
  coordinates: Coordinates;
  agent: Agent;
  isVerified: boolean;
  isFeatured: boolean;
  investmentMetrics: InvestmentMetrics;
  nearbyFacilities: NearbyFacility[];
  views: number;
  leads: number;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  purpose: PropertyPurpose | "all";
  type: PropertyType | "all";
  priceMin: number;
  priceMax: number;
  currency: "USD" | "AFN";
  bedrooms: string; // "all", "studio", "1+", "2+", "3+", "4+", "5+"
  bathrooms: string; // "all", "1+", "2+", "3+", "4+"
  sizeMin: number;
  sizeMax: number;
  sizeUnit: "sqm" | "jerib";
  age: string; // "all", "new", "1-5", "5-10", "10+"
  features: string[]; // selected features
  neighborhood: string; // "all" or specific neighborhood
  isVerifiedOnly: boolean;
  isFeaturedOnly: boolean;
  roiMin: number;
  polygonPoints?: Coordinates[]; // For interactive polygon maps drawing filters
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface ViewingRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  requestedDate: string;
  requestedTime: string;
  status: "pending" | "confirmed" | "declined";
}

export interface Lead {
  id: string;
  propertyId: string;
  propertyName: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: "whatsapp" | "phone" | "telegram" | "email" | "chat";
  createdAt: string;
}
