import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// pick stable, supported model names:
const TEXT_MODEL = "gemini-1.5-flash-latest";  // or "gemini-pro"
const JSON_MODEL = "gemini-1.5-flash-latest";  // or "gemini-1.5-pro-latest"

export const textModel = genAI.getGenerativeModel({
  model: TEXT_MODEL,
});

export const jsonModel = genAI.getGenerativeModel({
  model: JSON_MODEL,
});

export default textModel;
