// configs/ai.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const textModel = genAI.getGenerativeModel({
  model: process.env.GEMINI_TEXT_MODEL || "gemini-1.5-flash",
});

export const jsonModel = genAI.getGenerativeModel({
  model: process.env.GEMINI_JSON_MODEL || "gemini-1.5-pro",
});

export default textModel;
