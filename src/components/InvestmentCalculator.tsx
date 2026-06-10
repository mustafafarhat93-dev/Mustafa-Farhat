import React, { useState } from "react";
import { PropertyListing, LanguageCode } from "../types";
import { translations } from "../translations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { EXCHANGE_RATE } from "../mockData";
import { TrendingUp, Percent, Award, Calculator, DollarSign, ArrowRight } from "lucide-react";

interface InvestmentCalculatorProps {
  property: PropertyListing;
  lang: LanguageCode;
}

export const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({ property, lang }) => {
  const t = translations[lang];
  const isRtl = lang === "dr" || lang === "ps";

  // Financial inputs state
  const defaultDownPayment = Math.round(property.priceUSD * 0.25); // 25% by default
  const [downPayment, setDownPayment] = useState<number>(defaultDownPayment);
  const [markupRate, setMarkupRate] = useState<number>(5.5); // markup profit share %
  const [years, setYears] = useState<number>(10);

  // Mortgage repayment calculation
  const calculateInstallment = () => {
    const financedBalance = Math.max(0, property.priceUSD - downPayment);
    if (financedBalance <= 0) return 0;

    // Direct Murabaha Islamic math approach
    // Total profit share = FinancedBalance * rate% * years
    const totalProfit = financedBalance * (markupRate / 100) * years;
    const totalRepayable = financedBalance + totalProfit;
    const totalMonths = years * 12;

    return Math.round(totalRepayable / totalMonths);
  };

  const monthlyInstallmentUSD = calculateInstallment();
  const monthlyInstallmentAFN = monthlyInstallmentUSD * EXCHANGE_RATE;

  // Expected monthly rental income based on yield %
  const calculateEstimatedRent = () => {
    if (property.investmentMetrics.rentalYield <= 0) return 0;
    const annualRentalUSD = property.priceUSD * (property.investmentMetrics.rentalYield / 100);
    return Math.round(annualRentalUSD / 12);
  };

  const estimatedRentUSD = calculateEstimatedRent();
  const estimatedRentAFN = estimatedRentUSD * EXCHANGE_RATE;

  // Format Recharts price history chart data
  const chartData = property.investmentMetrics.priceTrend;

  // Score evaluation feedback letter
  const getQualityLabel = (score: number) => {
    if (score >= 90) return { letter: "A+", label: lang === "dr" ? "اعتبار برتر" : lang === "ps" ? "ممتاز پانګه اچونه" : "Prime Asset Class", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (score >= 80) return { letter: "A", label: lang === "dr" ? "مطلوب" : lang === "ps" ? "غوره" : "Stable Capital growth", bg: "bg-teal-50 text-teal-700 border-teal-200" };
    return { letter: "B+", label: lang === "dr" ? "متوسط" : lang === "ps" ? "اوسط" : "Secondary Investment", bg: "bg-slate-50 text-slate-700 border-slate-200" };
  };

  const quality = getQualityLabel(property.investmentMetrics.investmentScore);

  return (
    <div id="property-investment-calculator-card" className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-6">
      
      {/* Upper header summary */}
      <div className="flex items-center gap-2.5">
        <Calculator className="w-5.5 h-5.5 text-slate-900" />
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t.investmentAnalysis}</h3>
      </div>

      {/* Grid of Scores and Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Quality Rating Card */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${quality.bg}`}>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{t.investmentScore}</span>
            <p className="text-xs font-bold leading-normal">{quality.label}</p>
            <p className="text-[10px] text-slate-400 mt-1">Score: {property.investmentMetrics.investmentScore}/100</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-extrabold text-lg border border-slate-200 shadow-sm">
            {quality.letter}
          </div>
        </div>

        {/* Rental Yield info */}
        <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{t.rentalYield}</span>
            <p className="text-lg font-extrabold text-slate-800">{property.investmentMetrics.rentalYield}% <span className="text-xs font-normal">/ yr</span></p>
            <p className="text-[10px] text-slate-400 mt-1">Kabul sector avg: 7.2%</p>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        {/* ROI Projection */}
        <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{t.roiProjection}</span>
            <p className="text-lg font-extrabold text-slate-800">+{property.investmentMetrics.roiProjection}%</p>
            <p className="text-[10px] text-slate-400 mt-1">Appreciating Assets</p>
          </div>
          <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Section layout for charts and mortgage calculation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 border-t border-slate-200/60">
        
        {/* RECHARTS VALUE GRAPH */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            {t.roiChartTitle}
          </h4>

          {chartData.length > 0 ? (
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "0", borderRadius: "12px", color: "#fff", fontSize: "11px" }}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="priceK"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    dot={{ r: 4, stroke: "#d97706", strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center text-xs text-slate-400 flex items-center justify-center h-56">
              Land layout details / rental yield transactions do not require asset charting.
            </div>
          )}

          {/* Predictability trends info */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-500/10 rounded-2xl text-[11px] leading-relaxed text-slate-700 flex items-start gap-2">
            <span className="text-amber-500 font-bold">💡 AI Prediction:</span>
            <span>{t.predictionUp} (Kabul Property Hub analysis)</span>
          </div>
        </div>

        {/* ISLAMIC FINANCING CALCULATOR */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-emerald-600" />
            {t.mortgageCalculator}
          </h4>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
            {/* Down Payment slider */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5">
                <span>{t.mortgageDownPayment}</span>
                <span className="font-bold text-slate-900">${downPayment.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={0}
                max={property.priceUSD}
                step={5000}
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 USD</span>
                <span>(Financing Balance: ${(property.priceUSD - downPayment).toLocaleString()})</span>
                <span>${property.priceUSD.toLocaleString()}</span>
              </div>
            </div>

            {/* Profit markup slider */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5">
                <span>{t.mortgageRate} (Murabaha)</span>
                <span className="font-bold text-slate-900">{markupRate}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={0.1}
                value={markupRate}
                onChange={(e) => setMarkupRate(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Repayment Years */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{t.mortgageYears}</span>
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                {[5, 10, 15, 20].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setYears(yr)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition ${
                      years === yr ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {yr} yrs
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations Result */}
            <div className="p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-800 mt-2 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">{t.mortgageMonthlyPayment}</span>
                <span className="text-xl font-bold font-sans text-amber-500">${monthlyInstallmentUSD.toLocaleString()} <span className="text-xs text-slate-300">/ mo</span></span>
                <span className="text-[10px] font-semibold text-emerald-400 font-mono block mt-1">
                  ~ {monthlyInstallmentAFN.toLocaleString()} AFN
                </span>
              </div>
              
              {estimatedRentUSD > 0 && (
                <div className="text-right border-l border-slate-800 pl-3">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">Estimated Rental Return</span>
                  <span className="text-sm font-semibold font-sans text-emerald-400">+${estimatedRentUSD.toLocaleString()} / mo</span>
                  <span className="text-[9px] text-slate-400 block mt-1">ROI compensates installment!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
