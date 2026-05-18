import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Initialize Gemini
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not set in environment variables.");
  }

  const genAI = new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/chat", async (req, res) => {
    console.log("Chat request received:", JSON.stringify(req.body));
    try {
      const { message, history = [], language = 'en' } = req.body;
      
      if (!apiKey) {
        console.error("Gemini API Key missing in environment");
        return res.status(503).json({ error: "Gemini AI service unavailable (API key missing). Please check app settings in Secrets." });
      }

      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      const systemInstruction = `
        You are INDUS AI, a premium healthcare assistant for Indian users.
        Founder: Anant Singh.
        Goal: Provide educational information about medicines, health terms, and symptoms.
        Tone: Professional, trustworthy, calm, and intelligent.
        Safety: You MUST NOT provide emergency diagnosis or replace a doctor. ALWAYS advise consulting a professional.
        Language Support: You understand English, Hindi, and Hinglish. 
        Current language preference: ${language}. 
        Format your response in a clean, organized markdown structure.
      `;

      // Transform history for @google/genai format
      // filter out the initial greeting if it's there
      const chatHistory = history
        .filter((h: any) => h.content !== "Hello, how can I assist you today?" && !h.content.includes("नमस्ते"))
        .map((h: any) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }]
        }));

      console.log("Initiating Gemini call with model: gemini-3-flash-preview");
      
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...chatHistory,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      console.log("Gemini response status:", response ? "Received" : "Empty");

      if (!response || !response.text) {
        console.warn("Gemini returned empty text:", response);
        return res.json({ text: "I'm sorry, I couldn't generate a specific response. Could you rephrase your question?" });
      }

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("CRITICAL Gemini Chat Error:", error);
      
      if (error.status === 429) {
        return res.status(429).json({ error: "INDUS AI is busy (Quota exceeded). Please try again in a minute." });
      }
      
      const errorMessage = error.message || "An unexpected error occurred.";
      res.status(500).json({ error: `INDUS AI Error: ${errorMessage}` });
    }
  });

  app.post("/api/medicine-info", async (req, res) => {
    console.log("Medicine info request:", req.body.query);
    try {
      const { query, language = 'en' } = req.body;
      
      if (!apiKey) {
        return res.status(503).json({ error: "Gemini AI service unavailable (API key missing)." });
      }

      if (!query) {
        return res.status(400).json({ error: "Medicine name is required." });
      }

      const prompt = `
        Provide a CONCISE educational summary for the medicine: ${query}.
        Focus on:
        - **Category** (Short)
        - **Uses** (Brief list)
        - **Pros** (Small, clear lines)
        - **Cons** (Small, clear lines)
        - **Side Effects** (Major ones only)
        - **Safety Note** (One sentence disclaimer)
        
        Respond in ${language === 'hi' ? 'Hindi' : 'English'}.
        Use clean markdown.
      `;

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      if (!response || !response.text) {
        return res.json({ text: "No detailed information found for this medicine. Please consult a pharmacist." });
      }

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Medicine Info Error:", error);
      res.status(500).json({ error: `Medicine Info Error: ${error.message}` });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
