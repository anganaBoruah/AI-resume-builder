// configs/ai.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// use older, v1beta-supported models
const TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || "gemini-pro";
const JSON_MODEL = process.env.GEMINI_JSON_MODEL || "gemini-pro";

export const textModel = genAI.getGenerativeModel({
  model: TEXT_MODEL,
});

export const jsonModel = genAI.getGenerativeModel({
  model: JSON_MODEL,
});

export default textModel;
