import { GoogleGenAI } from '@google/genai';


// The new SDK uses a client-based initialization

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });