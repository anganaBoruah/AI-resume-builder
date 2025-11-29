// server/controllers/aiController.js

import Resume from "../models/Resume.js";
import { textModel, jsonModel } from "../configs/ai.js";

/**
 * POST /api/ai/enhance-pro-sum
 * Body: { userContent: string }
 * Auth: protect (req.userId available)
 */
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent || !userContent.trim()) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `
You are an expert resume writer. Improve the following professional summary:

- Keep it 2–4 sentences.
- Highlight key skills, experience, and career objectives.
- Make it clear, concise, and ATS-friendly.
- Return ONLY the improved summary, no explanations.

Original summary:
"${userContent}"
    `.trim();

    const result = await textModel.generateContent(prompt);
    const enhancedContent = result.response.text();

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("enhanceProfessionalSummary error:", error);
    return res.status(400).json({ message: error.message || "AI error" });
  }
};

/**
 * POST /api/ai/enhance-job-desc
 * Body: { userContent: string }
 * Used for both experience + project descriptions on frontend
 */
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent || !userContent.trim()) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `
You are an expert resume writer. Improve the following job/project description:

- Output 2–3 sentences.
- Focus on responsibilities, achievements, and impact.
- Use strong action verbs and quantifiable results where possible.
- Make it ATS-friendly.
- Return ONLY the improved description, no explanations.

Original text:
"${userContent}"
    `.trim();

    const result = await textModel.generateContent(prompt);
    const enhancedContent = result.response.text();

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("enhanceJobDescription error:", error);
    return res.status(400).json({ message: error.message || "AI error" });
  }
};

/**
 * POST /api/ai/upload-resume
 * Body: { title: string, resumeText: string }
 * Called from Dashboard after converting PDF → text
 * Creates a Resume document from AI-extracted JSON
 */
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt = `
You are an expert AI agent that extracts structured data from resumes.

Return ONLY a valid JSON object with this exact shape (no extra keys, no comments, no text before or after):

{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "cgpa": ""
    }
  ]
}

If a field is missing in the resume, fill it with "" or [] as appropriate.
    `.trim();

    const userPrompt = `Resume:\n${resumeText}`;

    const result = await jsonModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt + "\n\n" + userPrompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const extractedData = result.response.text();

    let parsedData;
    try {
      parsedData = JSON.parse(extractedData);
    } catch (e) {
      console.error("JSON parse error in uploadResume:", extractedData);
      return res.status(400).json({
        message: "Failed to parse AI response as JSON",
      });
    }

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    // frontend Dashboard expects { resumeId }
    return res.status(200).json({ resumeId: newResume._id });
  } catch (error) {
    console.error("uploadResume error:", error);
    return res.status(400).json({ message: error.message || "AI error" });
  }
};
