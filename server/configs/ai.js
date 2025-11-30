// server/configs/ai.js  (or just configs/ai.js in your server folder)
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Use v1beta-safe, text-only model
const TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || "gemini-pro";

export const textModel = genAI.getGenerativeModel({
  model: TEXT_MODEL,
});

export default textModel;
