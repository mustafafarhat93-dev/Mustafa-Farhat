import React, { useState, useEffect, useRef } from "react";
import { PropertyListing, LanguageCode, Coordinates } from "../types";
import { translations } from "../translations";
import { MapPin, Sparkles, Navigation, Layers, Compass, Focus } from "lucide-react";

interface CustomMapProps {
  properties: PropertyListing[];
  lang: LanguageCode;
  onSelectProperty: (property: PropertyListing) => void;
  selectedProperty: PropertyListing | null;
  onPolygonFilter: (filteredIds: string[] | null) => void;
}

export const CustomMap: React.FC<CustomMapProps> = ({
  properties,
  lang,
  onSelectProperty,
  selectedProperty,
  onPolygonFilter,
}) => {
  const t = translations[lang];
  const isRtl = lang === "dr" || lang === "ps";

  // Map Modes: 'standard' | 'heatmap' | 'satellite'
  const [mapMode, setMapMode] = useState<"standard" | "heatmap" | "satellite">("standard");
  const [activeDistrictOverlay, setActiveDistrictOverlay] = useState<string | null>(null);
  
  // Interactive Polygon Drawer state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<{ x: number; y: number }[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Commute transit slider
  const [transitMode, setTransitMode] = useState<"corolla" | "walk" | "bus">("corolla");
  const [selectedPinForCommute, setSelectedPinForCommute] = useState<PropertyListing | null>(properties[0] || null);

  useEffect(() => {
    if (selectedProperty) {
      setSelectedPinForCommute(selectedProperty);
    }
  }, [selectedProperty]);

  // Handle map canvas clicking for polygon drawing
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add new vertex
    const newPoints = [...drawnPoints, { x, y }];
    setDrawnPoints(newPoints);

    // If we have at least 3 points, we can evaluate proximity overlap of pins
    evaluatePolygonFilters(newPoints);
  };

  const startDrawing = () => {
    setIsDrawing(true);
    setDrawnPoints([]);
    onPolygonFilter(null);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (drawnPoints.length < 3) {
      setDrawnPoints([]);
      onPolygonFilter(null);
    }
  };

  const clearDrawing = () => {
    setDrawnPoints([]);
    setIsDrawing(false);
    onPolygonFilter(null);
  };

  // Helper to convert property lat/lng to local SVG map coordinates
  // Kabul lat range approx: 34.48 (south) to 34.55 (north)
  // Kabul lng range approx: 69.11 (west) to 69.22 (east)
  const getCoordinatesToPercentage = (coords: Coordinates) => {
    const latMin = 34.475;
    const latMax = 34.555;
    const lngMin = 69.110;
    const lngMax = 69.225;

    // Invert Lat to percentage because Y is top-down
    const yPercent = 100 - ((coords.lat - latMin) / (latMax - latMin)) * 100;
    const xPercent = ((coords.lng - lngMin) / (lngMax - lngMin)) * 100;

    return {
      x: Math.max(5, Math.min(95, xPercent)),
      y: Math.max(5, Math.min(95, yPercent)),
    };
  };

  const evaluatePolygonFilters = (points: { x: number; y: number }[]) => {
    if (points.length < 3 || !mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const containerW = rect.width;
    const containerH = rect.height;

    // Filter properties contained within the drawn polygon
    const containedIds: string[] = [];

    properties.forEach((p) => {
      const screenLoc = getCoordinatesToPercentage(p.coordinates);
      const px = (screenLoc.x / 100) * containerW;
      const py = (screenLoc.y / 100) * containerH;

      if (isPointInPolygon({ x: px, y: py }, points)) {
        containedIds.push(p.id);
      }
    });

    onPolygonFilter(containedIds);
  };

  // Standard ray-casting algorithm to detect point in polygon
  const isPointInPolygon = (point: { x: number; y: number }, polygon: { x: number; y: number }[]) => {
    const x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;

      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Simulated Kabul commute calculations (mins)
  const calculateKabulCommutes = (prop: PropertyListing | null) => {
    if (!prop) return { airport: 25, university: 15, ministry: 20 };
    // Compute distance metric based on mock coordinate offsets
    const latOffset = Math.abs(prop.coordinates.lat - 34.538); // Wazir Akbar Khan reference point
    const lngOffset = Math.abs(prop.coordinates.lng - 69.18);

    const distanceUnits = (latOffset + lngOffset) * 1000;
    
    // Corolla (fast, dodging potholes), walk (very slow), bus (medium but traffic congested)
    const factor = transitMode === "corolla" ? 1.5 : transitMode === "walk" ? 12 : 3.5;

    return {
      airport: Math.max(5, Math.round(distanceUnits * factor)),
      university: Math.max(8, Math.round(distanceUnits * factor * 1.2)),
      ministry: Math.max(6, Math.round(distanceUnits * factor * 0.9)),
    };
  };

  const commutes = calculateKabulCommutes(selectedPinForCommute);

  return (
    <div id="central-map-dashboard" className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-200">
      
      {/* Upper Control Bar */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-500 animate-spin-slow" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kabul Interactive Vector Engine</h4>
            <p className="text-[10px] text-slate-400">Integrated boundaries & dynamic geometric filtering</p>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
          <button
            onClick={() => setMapMode("standard")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mapMode === "standard" ? "bg-slate-800 text-amber-500 shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Standard GIS
          </button>
          <button
            onClick={() => setMapMode("heatmap")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mapMode === "heatmap" ? "bg-slate-800 text-amber-500 shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Value Heatmap
          </button>
          <button
            onClick={() => setMapMode("satellite")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mapMode === "satellite" ? "bg-slate-800 text-amber-500 shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Appraisal Sat-360
          </button>
        </div>

        {/* Polygon Draw controls */}
        <div className="flex items-center gap-2">
          {!isDrawing ? (
            <button
              onClick={startDrawing}
              className="bg-amber-500 text-slate-950 font-bold text-[11px] px-3.5 py-1.5 rounded-xl hover:bg-amber-400 transition flex items-center gap-1.5"
            >
              <Focus className="w-3.5 h-3.5" />
              Draw Search Area
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-red-900/30 text-red-400 px-2.5 py-1 rounded-lg border border-red-500/20 animate-pulse">
                Click map to draw vertices
              </span>
              <button
                onClick={endDrawing}
                className="bg-emerald-600 text-white font-bold text-[11px] px-3 py-1 rounded-lg hover:bg-emerald-500 transition"
              >
                Apply (Polygon)
              </button>
              <button
                onClick={clearDrawing}
                className="bg-slate-800 text-slate-300 font-bold text-[11px] px-3 py-1 rounded-lg hover:bg-slate-700 transition"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[500px]">
        
        {/* Left Side Panel: Commute Calculations & Overlays */}
        <div className="p-5 border-r border-slate-800 bg-slate-950/45 flex flex-col justify-between lg:col-span-1 border-b lg:border-b-0">
          <div>
            <h5 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-500" />
              Appraisal Zones (GIS Overlay)
            </h5>
            
            <div className="flex flex-col gap-1.5 mb-6">
              {[
                { name: "PD10 - Wazir Akbar Khan (Diplomatic)", yield: "8.2%", roi: "+14.5%" },
                { name: "PD4 - Shahr-e-Naw (Executive)", yield: "9.5%", roi: "+11.0%" },
                { name: "PD16 - Macrorayan (Soviet Block classic)", yield: "6.8%", roi: "+9.2%" },
                { name: "PD6 - Darulaman developmental corridor", yield: "None/Vacant", roi: "+19.8%" }
              ].map((zone) => (
                <button
                  key={zone.name}
                  onClick={() => setActiveDistrictOverlay(activeDistrictOverlay === zone.name ? null : zone.name)}
                  className={`p-3 text-left rtl:text-right rounded-xl border text-[11px] transition-all flex flex-col justify-between ${
                    activeDistrictOverlay === zone.name
                      ? "bg-slate-800 border-amber-500 text-white shadow-lg"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold">{zone.name}</span>
                    <span className="text-[9px] bg-indigo-900/40 text-indigo-300 px-1.5 py-0.5 rounded-md">Appraised</span>
                  </div>
                  <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-400">
                    <span>Rent Yield: <b className="text-emerald-400">{zone.yield}</b></span>
                    <span>ROI: <b className="text-amber-400">{zone.roi}</b></span>
                  </div>
                </button>
              ))}
            </div>

            {/* Commute calculator */}
            <div className="border-t border-slate-800 pt-4">
              <h5 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-amber-500" />
                Transit Commute Calculation
              </h5>

              <p className="text-[11px] text-slate-400 mb-2.5">
                Calculate estimated travel duration from <span className="font-semibold text-slate-200">{selectedPinForCommute ? (selectedPinForCommute.title[lang] || selectedPinForCommute.title.en).substring(0, 20) + "..." : "Selected Listing"}</span>:
              </p>

              {/* Vehicle selectors */}
              <div className="flex bg-slate-900 p-0.5 rounded-xl border border-slate-800 mb-4 text-[10px] font-bold text-center">
                <button
                  onClick={() => setTransitMode("corolla")}
                  className={`flex-1 py-1 px-1.5 rounded-lg transition ${
                    transitMode === "corolla" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  🚙 Corolla
                </button>
                <button
                  onClick={() => setTransitMode("bus")}
                  className={`flex-1 py-1 px-1.5 rounded-lg transition ${
                    transitMode === "bus" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  🚌 Milli Bus
                </button>
                <button
                  onClick={() => setTransitMode("walk")}
                  className={`flex-1 py-1 px-1.5 rounded-lg transition ${
                    transitMode === "walk" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  🚶 Pedestrian
                </button>
              </div>

              {/* Durations */}
              <div className="space-y-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800/60 font-medium text-[11px]">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1">✈️ Kabul Intl Airport</span>
                  <span className="font-bold text-amber-400">{commutes.airport} mins</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 border-t border-slate-800/40 pt-1.5">
                  <span className="flex items-center gap-1">🏫 Kabul University campus</span>
                  <span className="font-bold text-amber-400">{commutes.university} mins</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 border-t border-slate-800/40 pt-1.5">
                  <span className="flex items-center gap-1">🏛️ Foreign Ministry PD10</span>
                  <span className="font-bold text-amber-400">{commutes.ministry} mins</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 text-[9px] text-slate-500 border-t border-slate-800/40 pt-3">
            *Commute times are simulated dynamically based on GIS relative topology.
          </div>
        </div>

        {/* Dynamic Vector Map Canvas Render Area */}
        <div className="lg:col-span-3 relative h-[500px] bg-slate-950 overflow-hidden" ref={mapContainerRef} onClick={handleMapClick}>
          
          {/* Base map backgrounds according to mapMode */}
          {mapMode === "sat-custom" || mapMode === "satellite" ? (
            <div className="absolute inset-0 bg-slate-950 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-40" />
          ) : mapMode === "heatmap" ? (
            <div className="absolute inset-0 bg-radial-gradient-appreciation" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(#334155_0.8px,transparent_0.8px)] [background-size:20px_20px] opacity-25" />
          )}

          {/* Map Title Indicator */}
          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-300 pointer-events-none uppercase tracking-wider flex items-center gap-2 shadow-2xl z-20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live GIS Engine Feed
          </div>

          {/* Render Vector Districts as Background SVGs */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
            {/* Outline District 10 (Wazir Akbar, Qala-Fatullah, Sherpur) */}
            <path d="M 120,80 Q 250,50 380,110 T 550,220 L 460,340 Z" fill="rgba(245, 158, 11, 0.05)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,5" />
            {/* Outline District PD4 (Shahr-e-Naw) */}
            <path d="M 60,180 L 180,120 L 260,250 L 140,320 Z" fill="rgba(52, 211, 153, 0.05)" stroke="#34d399" strokeWidth="1.5" />
            {/* Outline District PD16 (Macrorayan blocks) */}
            <path d="M 380,250 L 580,200 L 640,380 L 480,450 Z" fill="rgba(99, 102, 241, 0.05)" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3,3" />
            {/* Outline District PD6/3 (Darulaman & Kart-e-Seh) */}
            <path d="M 80,350 L 320,310 L 280,480 L 50,470 Z" fill="rgba(239, 68, 68, 0.05)" stroke="#ef4444" strokeWidth="1.5" />
          </svg>

          {/* Render Area Districts highlighted overlay if selected */}
          {activeDistrictOverlay && (
            <div className="absolute inset-0 flex items-center justify-center bg-amber-500/5 animate-fade-in pointer-events-none z-10">
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Active GIS Overlay: {activeDistrictOverlay}
              </div>
            </div>
          )}

          {/* Render Drawn Search Area Polygon */}
          {drawnPoints.length > 0 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {/* Path layout */}
              <polygon
                points={drawnPoints.map(p => `${p.x},${p.y}`).join(" ")}
                fill="rgba(245, 158, 11, 0.2)"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />
              {/* Point circles */}
              {drawnPoints.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#f59e0b"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          )}

          {/* Heatmap Appraisals Blur circles overlay */}
          {mapMode === "heatmap" && (
            <div className="absolute inset-0 pointer-events-none z-10 animate-fade-in">
              <div className="absolute w-56 h-56 rounded-full bg-amber-500/20 blur-3xl" style={{ left: '20%', top: '15%' }} />
              <div className="absolute w-44 h-44 rounded-full bg-emerald-500/20 blur-3xl" style={{ left: '48%', top: '35%' }} />
              <div className="absolute w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl" style={{ left: '10%', top: '60%' }} />
            </div>
          )}

          {/* Plotted Pins of Listings */}
          {properties.map((p) => {
            const loc = getCoordinatesToPercentage(p.coordinates);
            const isSelected = selectedProperty?.id === p.id;
            const priceBrief = `$${(p.priceUSD / 1000).toFixed(0)}k`;

            return (
              <div
                key={p.id}
                className="absolute z-20 group"
                style={{
                  left: `${loc.x}%`,
                  top: `${loc.y}%`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                {/* Visual marker tooltip */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProperty(p);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border shadow-xl transition-all duration-300 font-bold font-sans text-[10px] ${
                    isSelected
                      ? "bg-amber-400 border-white text-slate-950 scale-125 z-40"
                      : "bg-slate-900/95 border-slate-700 text-slate-100 hover:bg-slate-800 hover:scale-110"
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-slate-950 animate-bounce" : "text-emerald-400"}`} />
                  <span>{priceBrief}</span>
                  
                  {p.isVerified && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  )}
                </button>

                {/* Floating card description on hover */}
                <div className="absolute left-1/2 bottom-full transform -translate-x-1/2 mb-2 w-48 bg-slate-900 border border-slate-800 p-2.5 rounded-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 shadow-2xl z-50 text-left">
                  <p className="text-[10px] text-amber-500 font-bold uppercase">{p.type} • {p.purpose}</p>
                  <p className="text-[11px] font-bold text-white line-clamp-1">{p.title[lang] || p.title.en}</p>
                  <p className="text-[9px] text-slate-400 line-clamp-1">{p.locationName[lang] || p.locationName.en}</p>
                  <p className="text-[10px] font-bold text-emerald-400 mt-1">${p.priceUSD.toLocaleString()}</p>
                </div>
              </div>
            );
          })}

          {/* Interactive instruction banner */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md px-4 py-3 border border-slate-800 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-2xl pointer-events-auto">
            <span className="text-[11px] text-slate-300">
              {isDrawing 
                ? "Click on multiple coordinates then press 'Apply Polygon' to filter jaydads" 
                : "Select property markers to calculate transit paths and review neighborhood metrics"}
            </span>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 border border-slate-800 rounded-lg px-2 py-0.5 text-[9px] bg-indigo-950/50 text-indigo-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                DVB GPS Feed-Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
