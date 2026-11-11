// 1. Correct CommonJS import for the Gen AI SDK
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

// 2. Explicitly pass your API key from process.env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_CALLING });

async function calling() {
  try {
    // 3. Use the correct method (models.generateContent) and a real model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Who has the most goals in football history",
    });

    // 4. Extract text using response.text
    console.log(response.text);
  } catch (error) {
    console.error("API Call Failed:", error);
  }
}

calling();
