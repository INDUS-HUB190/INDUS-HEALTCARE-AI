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

  // Initialize Gemini
  const genAI = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, language = 'en' } = req.body;
      
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

      const chat = genAI.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction,
        },
      });

      // Send history if provided
      // In @google/genai, we don't pass history to chats.create directly in a simple way for stateless calls, 
      // but let's just use generateContent for simplicity or manage history.
      // Actually, let's use a simpler pattern.
      
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/medicine-info", async (req, res) => {
    try {
      const { query, language = 'en' } = req.body;
      
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

      res.json({ text: response.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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
