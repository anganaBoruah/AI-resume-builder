// server/utils/geminiClient.js
import "dotenv/config";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in environment variables");
}

// Use a v1 model (similar to your smart-audit project)
const GEMINI_TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";
const GEMINI_JSON_MODEL = process.env.GEMINI_JSON_MODEL || GEMINI_TEXT_MODEL;

/**
 * Call Gemini with a text prompt and return plain text.
 */
export async function callGeminiText(prompt) {
  const url =
    `https://generativelanguage.googleapis.com/v1/models/${GEMINI_TEXT_MODEL}:generateContent` +
    `?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("❌ Gemini text API error:", res.status, errText);
    throw new Error(`Gemini text API error ${res.status}`);
  }

  const data = await res.json();

  const text =
    data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") ||
    "";

  return text.trim();
}

/**
 * Call Gemini expecting structured JSON back (used for uploadResume).
 */
export async function callGeminiJson(systemPrompt, resumeText) {
  const url =
    `https://generativelanguage.googleapis.com/v1/models/${GEMINI_JSON_MODEL}:generateContent` +
    `?key=${GEMINI_API_KEY}`;

  const combinedPrompt = `${systemPrompt.trim()}\n\nResume:\n${resumeText}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: combinedPrompt }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("❌ Gemini JSON API error:", res.status, errText);
    throw new Error(`Gemini JSON API error ${res.status}`);
  }

  const data = await res.json();

  // When using responseMimeType: "application/json", Gemini puts JSON in candidates[0].content.parts[0].text too
  const raw =
    data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") ||
    "";

  return raw.trim();
}
