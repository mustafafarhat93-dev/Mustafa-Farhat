import React from "react";
import { PropertyListing, LanguageCode } from "../types";
import { translations, SystemDictionary } from "../translations";
import { MapPin, BedDouble, Bath, Maximize, Calendar, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface PropertyCardProps {
  property: PropertyListing;
  lang: LanguageCode;
  onViewDetails: (property: PropertyListing) => void;
  onFavoriteToggle: (id: string) => void;
  isFavorited: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  lang,
  onViewDetails,
  onFavoriteToggle,
  isFavorited,
}) => {
  const isRtl = lang === "dr" || lang === "ps";
  const t = translations[lang];

  // Safely grab multilingual text keys
  const title = property.title[lang] || property.title.en;
  const locationName = property.locationName[lang] || property.locationName.en;

  const formattedPriceUSD = property.priceUSD.toLocaleString();
  const formattedPriceAFN = property.priceAFN.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      id={`property-card-${property.id}`}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Property Hero Image Portion */}
      <div className="relative h-56 overflow-hidden bg-slate-900 group">
        <img
          src={property.images[0]}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Transparent Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Labels & Tags */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
          <div className="flex flex-col gap-1.5 matches-rtl">
            {property.isVerified && (
              <span className="bg-emerald-600 text-white text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.verificationBadge}
              </span>
            )}
            {property.isFeatured && (
              <span className="bg-amber-500 text-slate-950 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Sardar Elite
              </span>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(property.id);
            }}
            className={`p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isFavorited
                ? "bg-red-500 text-white scale-110 shadow-md"
                : "bg-white/80 text-slate-700 hover:bg-white hover:text-red-500"
            }`}
          >
            <svg
              className="w-4.5 h-4.5 fill-current"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        {/* Purpose Indicator */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <span className="bg-slate-900/90 text-white font-medium text-xs px-3 py-1 rounded-lg border border-white/10 capitalize">
            {translations[lang][property.purpose as keyof SystemDictionary] || property.purpose}
          </span>
          {property.investmentMetrics.rentalYield > 0 && (
            <span className="bg-emerald-950/85 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {property.investmentMetrics.rentalYield}% yield
            </span>
          )}
        </div>
      </div>

      {/* Property Meta Body Portion */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Prices Area */}
          <div className="flex flex-wrap items-baseline gap-2 mb-2">
            <span className="text-xl font-bold font-sans text-slate-900">
              ${formattedPriceUSD}
            </span>
            <span className="text-sm font-semibold font-mono text-emerald-600 border-l border-slate-200 pl-2 matches-rtl">
              {formattedPriceAFN} AFN
            </span>
          </div>

          {/* Title and location */}
          <h3 className="text-[15px] font-bold text-slate-800 line-clamp-1 group-hover:text-amber-600 transition-colors duration-200 mb-1">
            {title}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mb-4 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {locationName}
          </p>

          {/* Rooms and Size parameters */}
          <div className="grid grid-cols-3 gap-2 py-3 px-2 bg-slate-50 rounded-xl mb-4 text-center">
            {property.bedrooms > 0 ? (
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">{t.beds}</span>
                <span className="text-slate-800 text-xs font-bold flex items-center gap-1 justify-center">
                  <BedDouble className="w-3.5 h-3.5 text-slate-600" />
                  {property.bedrooms}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">{t.beds}</span>
                <span className="text-slate-800 text-[11px] font-bold">Studio</span>
              </div>
            )}

            <div className="flex flex-col items-center border-x border-slate-200/60">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">{t.baths}</span>
              <span className="text-slate-800 text-xs font-bold flex items-center gap-1 justify-center">
                <Bath className="w-3.5 h-3.5 text-slate-600" />
                {property.bathrooms}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">{t.size}</span>
              <div className="text-slate-800 text-xs font-bold whitespace-nowrap flex flex-col">
                <span>{property.sizeSqm} {t.sqm}</span>
                {property.sizeJerib && property.sizeJerib >= 0.1 && (
                  <span className="text-[9px] font-semibold text-emerald-700">
                    ({property.sizeJerib} {t.jerib})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
          <div className="flex items-center gap-2">
            <img
              src={property.agent.avatar}
              alt={property.agent.name}
              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
            />
            <div className="text-left rtl:text-right">
              <p className="text-[10px] font-bold text-slate-800 line-clamp-1">{property.agent.name}</p>
              <p className="text-[9px] text-slate-400 font-medium">{t.agentBadge}</p>
            </div>
          </div>

          <button
            onClick={() => onViewDetails(property)}
            className="bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-all duration-200 shadow-sm shadow-slate-900/10 flex items-center gap-1"
          >
            {t.btnViewDetails}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
