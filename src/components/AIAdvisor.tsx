import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, LanguageCode } from "../types";
import { translations } from "../translations";
import { Sparkles, Send, Bot, User, HelpCircle, X, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AIAdvisorProps {
  lang: LanguageCode;
  onSelectPropertyByAI: (id: string) => void;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ lang, onSelectPropertyByAI }) => {
  const t = translations[lang];
  const isRtl = lang === "dr" || lang === "ps";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: lang === "dr"
        ? "سلام! من مشاور هوشمند شما در املاک کابل هستم. چطور می‌توانم در خرید، کرایه، یا محاسبه بازدهی سرمایه‌گذاری به شما کمک کنم؟"
        : lang === "ps"
          ? "سلام! زه د کابل املاکو هوشمند مشاور یم. زه څنګه کولی شم د جایداد پېرلو، کرایه یا مالي محاسبو کې ستاسو مرسته وکړم؟"
          : "Hello! I am your AI Copilot for Kabul Property Hub. Ask me about property prices, ROI, municipal Safayi paperwork, solar/generator requirements, or current listings!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle suggested queries based on active language
  const getSuggestions = () => {
    if (lang === "dr") {
      return [
        "حویلی لوکس وزیر اکبر خان دالری",
        "بهترین املاک تجارتی شهر نو",
        "مراحل تایید قباله شرعی در کابل چیست؟",
        "محاسبه بازدهی سرمایه در کارته سه"
      ];
    } else if (lang === "ps") {
      return [
        "لوکس ویلا په وزیر اکبر خان کې",
        "په مکروریان کې اپارتمانونه",
        "د جایدادونو شرعي قباله تاییدول څنګه کیږي؟",
        "سوداګریز جایدادونه شهر نو کې"
      ];
    } else {
      return [
        "Luxury house in Wazir Akbar Khan under 300,000 USD",
        "Office spaces in Shahr-e-Naw",
        "How is property tax or Safayi managed in Kabul?",
        "High ROI properties in Kabul"
      ];
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          language: lang
        }),
      });

      const data = await response.json();
      
      const botMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "bot",
        text: data.reply || "I am available to assist you with any real estate inquiry.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);

      // If response mentions a specific property id (e.g. prop-1 or prop-2 etc.), let's deep link highlights
      const propIdMatch = data.reply.match(/prop-\d+/);
      if (propIdMatch) {
        onSelectPropertyByAI(propIdMatch[0]);
      }
    } catch (err) {
      console.error("AI chatbot client request failed:", err);
      const botErrorMessage: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: "bot",
        text: "Apologies, I had an issue connecting to the central AI server. However, you can consult with our head broker Mujtaba at +93 79 912 3456.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 matches-rtl">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white rounded-full p-4 shadow-2xl border-2 border-amber-500/30 flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse animate-spin-slow" />
          <span className="text-xs font-bold uppercase tracking-wider">{t.navAiAssistant}</span>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Floating Chat Window drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            id="ai-chatbot-drawer"
            className={`fixed bottom-24 right-6 w-96 max-w-[95vw] h-[550px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden z-40 text-slate-100 font-sans ${
              isRtl ? "text-right" : "text-left"
            }`}
          >
            {/* Window Header */}
            <div className="p-4 bg-gradient-to-r from-slate-950 to-indigo-950 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-xl text-slate-950">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 matches-rtl">
                    Kabul Real Estate Bot
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      Generative RAG
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-400">Available in EN, Dari & Pashto</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Log Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/40">
              {messages.map((m) => {
                const isBot = m.sender === "bot";
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2 max-w-[90%] ${
                      isBot ? "mr-auto flex-row" : "ml-auto flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-full shrink-0 ${
                        isBot ? "bg-indigo-950 text-indigo-300" : "bg-amber-500 text-slate-950"
                      }`}
                    >
                      {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>
                    
                    <div className="flex flex-col">
                      <div
                        className={`p-3 rounded-2xl text-[12.5px] leading-relaxed select-text ${
                          isBot
                            ? "bg-slate-850 border border-slate-800/60 text-slate-200"
                            : "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium"
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 px-3 py-1 bg-slate-850 rounded-xl w-max animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                  <span>{t.conversationalLoading}</span>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Suggestions triggers */}
            <div className="p-3 bg-slate-950/70 border-t border-slate-800/40">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-2">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Frequently asked inputs:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
                {getSuggestions().map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sug)}
                    className="text-[10.5px] bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg transition text-left"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input Box */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder={t.conversationalPlaceholder}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend(inputText);
                }}
                className="flex-1 bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-200"
              />
              <button
                onClick={() => handleSend(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="bg-amber-500 text-slate-950 font-bold p-2 rounded-xl hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
