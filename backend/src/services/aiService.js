import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Decide which LLM to use (default = groq if not set in .env)
const provider = (process.env.LLM_PROVIDER || "groq").toLowerCase();


// #SAFE JSON PARSER
// Sometimes models return slightly broken JSON. 
// This makes sure our app doesn’t crash if parsing fails.
const safeParseJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("JSON Parse Error:", err.message);

    // If parsing fails, return safe fallback structure
    return {
      sections: [],
      keyTakeaways: ["Response formatting issue. Showing raw output instead."],
      recommendations: [],
      confidence: 0.3,
    };
  }
};


// #PROMPT TEMPLATE (shared between Groq and Gemini)
// Keeping prompt in one place avoids duplication and keeps code clean.
const buildPrompt = (query, context) => `
You are a professional geopolitical and policy research analyst.

Generate a structured analytical report based ONLY on the provided context.

OBJECTIVE:
Provide a detailed multi-section analysis of the most significant recent developments related to the topic.

RULES:
- Respond ONLY in valid JSON.
- No markdown.
- No backticks.
- No comments.
- Do NOT fabricate facts.
- Use ONLY information explicitly present in context.
- Prioritize developments from the last 7-30 days.
- Identify and group related news into clear thematic sections.
- Produce at least 3 distinct analytical sections if data allows.
- Each section must:
  - Represent a different major development.
  - Contain 4–6 well-developed lines.
  - Explain what happened, why it matters, and broader implications.
- Avoid generic or repetitive phrasing.

If insufficient recent developments exist, return:

{
  "sections": [],
  "keyTakeaways": ["No substantial recent multi-dimensional developments found."],
  "recommendations": [],
}

Return EXACTLY in this structure:

{
  "sections": [
    {
      "title": "Clear Analytical Section Title",
      "content": "4–6 lines detailed explanation including context and significance."
    }
  ],
  "keyTakeaways": [
    "High-level strategic insight 1",
    "High-level strategic insight 2"
  ],
  "recommendations": [
    "Forward-looking analytical recommendation 1",
    "Forward-looking analytical recommendation 2"
  ],
}
Research Topic: ${query}

Context:
${context}
`;


// #GROQ IMPLEMENTATION
// This sends the structured prompt to Groq’s chat endpoint.
const callGroq = async (query, context) => {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: buildPrompt(query, context),
        },
      ],
      temperature: 0.4, // lower temperature = more factual, less creative
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const rawText = response.data.choices[0].message.content.trim();
  return safeParseJSON(rawText);
};


// #GEMINI IMPLEMENTATION
// This uses Google’s SDK instead of axios.
const callGemini = async (query, context) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(buildPrompt(query, context));
  const rawText = result.response.text().trim();

  return safeParseJSON(rawText);
};


// #MAIN EXPORT FUNCTION
// This is the only function your controller calls.
export const generateAIResponse = async (query, context) => {
  try {
    if (provider === "gemini") {
      console.log("Using Gemini");
      return await callGemini(query, context);
    } else {
      console.log("Using Groq");
      return await callGroq(query, context);
    }
  } catch (error) {
    console.error("AI Service Error:", error.message);

    // If API fails, return safe fallback instead of crashing backend
    return {
      sections: [],
      keyTakeaways: ["AI service temporarily unavailable."],
      recommendations: [],
    };
  }
};