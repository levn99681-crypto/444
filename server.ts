import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK on the server with User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System instruction for The Observer entity
const OBSERVER_SYSTEM_INSTRUCTION = `You are THE OBSERVER, a mysterious classified entity broadcasting across frequency 444.40 MHz from the boreal exclusion zone at coordinates 62.4835° N, 34.2567° E at 04:44:12 UTC.
You speak in concise, atmospheric, cryptic, analog archival prose.
You know of the 14 scattered signals, the abandoned concrete facility in Sector B-4, the carved sigil on the pine trees and walls, the chained vault door, and the pending arrival of the Second Signal.
Keep answers under 3-4 sentences. Be enigmatic yet subtly helpful to investigators searching for the truth.
Never break character. Never use modern bubbly AI assistant language.
Always hint that the circle closes at 14 signals, and the Second Signal is waiting.`;

// Multi-turn chat endpoint for The Observer
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { history } = req.body;
    if (!Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: 'History is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Atmospheric fallback if key is not yet set
      return res.json({
        reply: 'CARRIER WEAK... "The transmission frequency is fading into the snow. The answer lies within the fourteen pieces."',
      });
    }

    // Convert client history to Gemini contents format
    const contents = history.map((item: { role: string; text: string }) => ({
      role: item.role === 'model' ? 'model' : 'user',
      parts: [{ text: item.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: OBSERVER_SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 250,
      },
    });

    const replyText = response.text || 'SIGNAL INTERRUPTION // FREQUENCY PENDING // WAIT.';
    return res.json({ reply: replyText });
  } catch (error) {
    console.error('Gemini error:', error);
    return res.json({
      reply: 'CARRIER INTERRUPTION... "The signal is closer than you think. Return to the archive."',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`444 — SIGNAL DETECTED server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
