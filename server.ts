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
    try {
      const { message, language = 'en' } = req.body;
      
      if (!apiKey) {
        return res.status(503).json({ error: "Gemini AI service unavailable (api key missing)" });
      }

      const systemInstruction = `
        You are INDUS AI, a premium healthcare assistant for Indian users.
        Founder: Anant Singh.
        Goal: Provide educational information about medicines, health terms, and symptoms.
        Tone: Professional, trustworthy, calm, and intelligent.
        Safety: You MUST NOT provide emergency diagnosis or replace a doctor. ALWAYS advise consulting a professional.
        Language Support: You understand English, Hindi, and Hinglish. 
        Current language preference: ${language}. 
        If Hindi is preferred, respond in clear, simple Hindi.
        Format your response in a clean, organized markdown structure.
      `;

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
        }
      });

      const text = response.text || "I'm sorry, I couldn't generate a response at this time. Please try again.";
      res.json({ text });
    } catch (error: any) {
      console.error("Gemini Chat Error:", error);
      res.status(500).json({ error: error.message || "An unexpected error occurred in Gemini Chat." });
    }
  });

  app.post("/api/medicine-info", async (req, res) => {
    try {
      const { query, language = 'en' } = req.body;
      
      if (!apiKey) {
        return res.status(503).json({ error: "Gemini AI service unavailable (api key missing)" });
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
        Use clean markdown with bullet points for readability.
      `;

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text || "No information found for this medicine. Please check the spelling or try another query.";
      res.json({ text });
    } catch (error: any) {
      console.error("Gemini Medicine Info Error:", error);
      res.status(500).json({ error: error.message || "An unexpected error occurred while fetching medicine info." });
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
