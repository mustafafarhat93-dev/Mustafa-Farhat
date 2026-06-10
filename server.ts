import express from "express";
import path from "path";
import dns from "dns";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { PropertyListing, SearchFilters, ChatMessage } from "./src/types";
import { MOCK_PROPERTIES, EXCHANGE_RATE } from "./src/mockData";

// Resolve local DNS issues in sandbox environment
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database for persistent state on Server
let propertiesList: PropertyListing[] = [...MOCK_PROPERTIES];
let viewingRequests: any[] = [];
let leadsList: any[] = [];

// Lazy-initialize Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("Warning: GEMINI_API_KEY is not defined in environment variables. Running in simulated fallback mode.");
      return null;
    }
    try {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI client:", err);
      return null;
    }
  }
  return aiClient;
}

// -------------------------------------------------------------
// Real Estate Directory API Routes
// -------------------------------------------------------------

// Fetch all listings
app.get("/api/properties", (req, res) => {
  res.json({
    success: true,
    data: propertiesList
  });
});

// Post a new listing
app.post("/api/properties", (req, res) => {
  const newProperty = req.body as PropertyListing;
  
  if (!newProperty.title || !newProperty.priceUSD) {
    res.status(400).json({ success: false, error: "Missing required fields (title, priceUSD)" });
    return;
  }

  // Generate unique ID if not defined
  newProperty.id = newProperty.id || `prop-${Date.now()}`;
  newProperty.priceAFN = newProperty.priceUSD * EXCHANGE_RATE;
  newProperty.createdAt = newProperty.createdAt || new Date().toISOString().split("T")[0];
  newProperty.views = 0;
  newProperty.leads = 0;

  // Add default coordinates if empty (center of Kabul)
  if (!newProperty.coordinates) {
    newProperty.coordinates = { lat: 34.535, lng: 69.165 };
  }

  propertiesList.unshift(newProperty);
  res.json({ success: true, data: newProperty });
});

// Lead generation & tracking
app.post("/api/leads", (req, res) => {
  const { propertyId, name, email, phone, message, source } = req.body;
  if (!propertyId || !name) {
    res.status(400).json({ success: false, error: "Missing propertyId or name" });
    return;
  }

  const newLead = {
    id: `lead-${Date.now()}`,
    propertyId,
    propertyName: req.body.propertyName || "Unknown Property",
    name,
    email,
    phone,
    message,
    source: source || "whatsapp",
    createdAt: new Date().toISOString()
  };

  leadsList.unshift(newLead);

  // Update views/leads on listing
  const index = propertiesList.findIndex(p => p.id === propertyId);
  if (index !== -1) {
    propertiesList[index].leads += 1;
  }

  res.json({ success: true, data: newLead });
});

app.get("/api/leads", (req, res) => {
  res.json({ success: true, data: leadsList });
});

// Log property views
app.post("/api/properties/:id/view", (req, res) => {
  const { id } = req.params;
  const index = propertiesList.findIndex(p => p.id === id);
  if (index !== -1) {
    propertiesList[index].views += 1;
    res.json({ success: true, views: propertiesList[index].views });
  } else {
    res.status(404).json({ success: false, error: "Property not found" });
  }
});

// Viewing requests
app.post("/api/viewings", (req, res) => {
  const { propertyId, propertyName, buyerName, buyerPhone, buyerEmail, requestedDate, requestedTime } = req.body;
  
  const viewing = {
    id: `view-${Date.now()}`,
    propertyId,
    propertyName,
    buyerName,
    buyerPhone,
    buyerEmail,
    requestedDate,
    requestedTime,
    status: "pending" as const
  };

  viewingRequests.unshift(viewing);
  res.json({ success: true, data: viewing });
});

app.get("/api/viewings", (req, res) => {
  res.json({ success: true, data: viewingRequests });
});

app.patch("/api/viewings/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // pending, confirmed, declined
  const index = viewingRequests.findIndex(v => v.id === id);
  if (index !== -1) {
    viewingRequests[index].status = status;
    res.json({ success: true, data: viewingRequests[index] });
  } else {
    res.status(404).json({ success: false, error: "Request not found" });
  }
});

// -------------------------------------------------------------
// AI-Powered Multilingual Automatic Translation
// -------------------------------------------------------------
app.post("/api/ai/translate", async (req, res) => {
  const { text, sourceLanguage, fieldName } = req.body; // fieldName captures description or title
  if (!text) {
    res.status(400).json({ success: false, error: "Text to translate is required" });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    // If no API key, execute offline/simulated fallback
    res.json({
      success: true,
      simulation: true,
      translations: {
        en: `${text} (Translated to EN)`,
        dr: `${text} (ترجمه به دری)`,
        ps: `${text} (پښتو ژباړه)`
      }
    });
    return;
  }

  try {
    const prompt = `
      You are a luxury real estate translator for the "Kabul Property Hub" marketplace in Afghanistan.
      Take the following input text which is currently in ${sourceLanguage || "English"} and translate it accurately and respectfully into the other two languages: English (en), Dari/Persian (dr), and Pashto (ps).

      Translate appropriately for deep real estate catalog indexing (maintaining terms like Jerib, USD, generator backup, shear walls, concrete blast walls correctly, keeping distances and metrics exact).

      Input Text to translate: "${text}"

      Ensure output format is valid JSON only matching the schema exactly:
      {
        "en": "English Translation",
        "dr": "Dari Translation",
        "ps": "Pashto Translation"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            en: { type: Type.STRING },
            dr: { type: Type.STRING },
            ps: { type: Type.STRING }
          },
          required: ["en", "dr", "ps"]
        }
      }
    });

    const parsedTranslations = JSON.parse(response.text || "{}");
    // Ensure we preserve the input text in its native language to prevent translation degradation
    if (sourceLanguage === "en") parsedTranslations.en = text;
    if (sourceLanguage === "dr") parsedTranslations.dr = text;
    if (sourceLanguage === "ps") parsedTranslations.ps = text;

    res.json({
      success: true,
      translations: parsedTranslations
    });
  } catch (err: any) {
    console.error("Gemini Translation failed, using fallback:", err);
    res.json({
      success: true,
      error: err.message,
      translations: {
        en: text,
        dr: `${text} (دری)`,
        ps: `${text} (پښتو)`
      }
    });
  }
});

// -------------------------------------------------------------
// Conversational Natural-Language Search Parser
// -------------------------------------------------------------
app.post("/api/ai/search-parse", async (req, res) => {
  const { query } = req.body;
  if (!query || query.trim() === "") {
    res.status(400).json({ success: false, error: "Empty query string" });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    // Elegant client fallback
    res.json({
      success: true,
      simulation: true,
      filters: {
        query: query,
        purpose: "all",
        type: "all",
        priceMax: 1000000,
        neighborhood: "all"
      }
    });
    return;
  }

  try {
    const prompt = `
      You are an AI Semantic Real Estate Search filter converter for the "Kabul Property Hub" in Afghanistan.
      Analyse the user's natural language input: "${query}"

      Translate and map this text to standard filters for database queries.
      Identify:
      1. Purpose (buy/rent/lease) - default to 'all' if unspecified.
      2. Type (house / villa / apartment / commercial / office / shop / warehouse / land / farm) - default to 'all'.
      3. Price Range (maxPrice in USD). If AFN is mentioned, divide by 75 to get USD. For example, "10 million AFN" = 133,333 USD. If under "$300,000", priceMax is 300000.
      4. Targeted Neighborhood in Kabul. We support active neighborhoods: "Wazir Akbar Khan", "Shahr-e-Naw", "Macrorayan", "Qala-e-Fatullah", "Kart-e-Seh", "Sherpur", "Darulaman", "Dasht-e-Barchi". Map other nearby areas to these best fits, or "all".
      5. Minimum bedrooms and bathrooms if mentioned (e.g. "3 bedrooms" -> bedrooms = "3+").

      Response MUST be valid JSON conforming strictly to the schema, no extra text.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            purpose: { type: Type.STRING, description: "buy, rent, lease, or all" },
            type: { type: Type.STRING, description: "villa, apartment, office, land, shop, farm, house, warehouse, or all" },
            priceMax: { type: Type.NUMBER, description: "maximum price in USD, 0 or null if unspecified" },
            priceMin: { type: Type.NUMBER, description: "minimum price in USD, 0 if unspecified" },
            neighborhood: { type: Type.STRING, description: "Exactly one of: Wazir Akbar Khan, Shahr-e-Naw, Macrorayan, Qala-e-Fatullah, Kart-e-Seh, Sherpur, Darulaman, Dasht-e-Barchi, or 'all'" },
            bedrooms: { type: Type.STRING, description: "all, studio, 1+, 2+, 3+, 4+, 5+" }
          },
          required: ["purpose", "type", "neighborhood"]
        }
      }
    });

    const parsedFilters = JSON.parse(response.text || "{}");
    res.json({
      success: true,
      filters: parsedFilters
    });
  } catch (err: any) {
    console.error("Gemini semantic parser failed:", err);
    res.json({
      success: true,
      error: err.message,
      filters: {
        query,
        purpose: "all",
        type: "all",
        neighborhood: "all"
      }
    });
  }
});

// -------------------------------------------------------------
// RAG Real Estate advisory AI Assistant
// -------------------------------------------------------------
app.post("/api/ai/assistant", async (req, res) => {
  const { messages, language } = req.body; // Language: "en", "dr", "ps"
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ success: false, error: "Messages array is required" });
    return;
  }

  // Get active listings catalog context for premium RAG
  const propertyCatalogBrief = propertiesList.map(p => ({
    id: p.id,
    title: p.title[language as keyof typeof p.title] || p.title.en,
    priceKey: `$${p.priceUSD.toLocaleString()} (${(p.priceUSD * EXCHANGE_RATE).toLocaleString()} AFN)`,
    type: p.type,
    purpose: p.purpose,
    neighborhood: p.neighborhood,
    bedrooms: p.bedrooms,
    link: `/listing/${p.id}`
  }));

  const ai = getGeminiClient();
  if (!ai) {
    // Interactive local fallback conversation when key is offline
    const lastUserMsg = messages[messages.length - 1]?.text || "";
    let reply = `Tashakor for your question! We are processing your request. Under offline simulation mode: I recommend viewing our classic $450,000 Luxury Diplomatic Villa in Wazir Akbar Khan with backup generators or our quiet 3-bedroom apartment in Macrorayan Block 3 ($85,000 with central heating). Can I help you calculate a mortgage for these?`;
    if (language === "dr") {
      reply = `تشکر از پیام شما! در حالت آفلاین شبیه‌سازی شده: من به شما حویلی مجلل دیپلماتیک با قیمت ۴۵۰,۰۰۰ دالر در وزیر اکبر خان یا آپارتمان ۳ خوابه در مکروریان سوم به قیمت ۸۵,۰۰۰ دالر با تسخین مرکزی را پیشنهاد می‌کنم. آیا تمایل دارید محاسبات قسط را برای امور ملکی بررسی کنیم؟`;
    } else if (language === "ps") {
      reply = `ستاسو له پوښتنې څخه مننه! په آفلاین حالت کې: موږ تاسو ته په وزیر اکبر خان کې ۴۵۰،۰۰۰ ډالرو باندې ډیپلوماتیکه لوکس ویلا او په مکروریان ۳م کې په ۸۵،۰۰۰ ډالرو باندې یو ښکلی اپارتمان وړاندیز کوو. ایا غواړئ په دې اړه خبرې وکړو؟`;
    }
    res.json({
      success: true,
      reply
    });
    return;
  }

  try {
    // Build chat conversation sequence using Gemini
    const systemPrompt = `
      You are "KPH Copilot", the premier AI real estate advisor chatbot for "Kabul Property Hub" in Afghanistan.
      You are highly skilled in property evaluations, investment forecasts, local Afghan title documentation processes (Safayi books, Shari deeds/Qabala), interest-free Islamic mortgage financing concepts, Kabul urban sectors, and generator/solar dependencies in Afghanistan.

      Guidelines:
      1. Always answer in the user's requesting language: ${language === "dr" ? "Dari/Persian (Afghanistan)" : language === "ps" ? "Pashto (Afghanistan)" : "English"}. Keep tone warm, luxury, professional, and trustworthy.
      2. Refer to actual live property listings from our inventory ONLY when relevant. Here is our live inventory matching current database state:
         ${JSON.stringify(propertyCatalogBrief)}
      3. Make recommendations by spelling out property details, prices in both USD and AFN (using rate: 1 USD = 75 AFN), and mention you can assist with booking viewing sessions directly.
      4. If users ask about Kabul property values, trends, security, or investment returns, explain that Kabul yields average 7-9% annually from diplomatic rentals, with Darulaman showing highest capital growth because of public ministry moves.
      
      Respond directly as a conversational agent without any HTML elements. Markdown is fine. Keep responses concise but helpful.
    `;

    // Map message history
    const geminiContents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    // Insert system prompt and active chat session
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [...geminiContents],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.75,
      }
    });

    res.json({
      success: true,
      reply: response.text || "I am here to guide you with any Kabul property details!"
    });
  } catch (err: any) {
    console.error("Gemini assistant crash:", err);
    res.json({
      success: true,
      reply: `Sorry, there was an issue processing your chat. Standard Recommendation: Try checking our top rated listing "Luxury 5-Bedroom Diplomatic Villa in Wazir Akbar Khan" or "Executive Office Space in Shahr-e-Naw". Our agents are online at +93 79 912 3456.`
    });
  }
});

// -------------------------------------------------------------
// Package Invoice & Simulated Payment
// -------------------------------------------------------------
app.post("/api/premium-payment", (req, res) => {
  const { propertyId, packageName, price, payMethod } = req.body;
  if (!propertyId || !packageName) {
    res.status(400).json({ success: false, error: "Missing listing or package criteria" });
    return;
  }

  // Simulate payment processing
  const transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
  const index = propertiesList.findIndex(p => p.id === propertyId);
  
  if (index !== -1) {
    propertiesList[index].isFeatured = true; // Upgrade to premium featured state instantly
  }

  res.json({
    success: true,
    transactionId,
    packageName,
    price,
    payMethod,
    message: "Thank you! Payment received successfully. Property Listing upgraded to FEATURED status in real-time."
  });
});

// -------------------------------------------------------------
// Client Bundling and Server Launch Setup
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Kabul Property Hub] Running in full-stack mode on http://0.0.0.0:${PORT}`);
    console.log(`[Vite Engine] Hot module bundling synced dynamically.`);
  });
}

startServer();
