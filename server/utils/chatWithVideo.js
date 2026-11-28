const ai = require("../config/aiCalling.js");

const MODEL = "gemini-2.5-flash"; // keep this the same as your summary function
const MAX_ATTEMPTS = 3;
const RETRYABLE_STATUS = [429, 500, 503];

const SYSTEM_PROMPT = `You are Vezore AI, a helpful video learning assistant.

Answer the user's questions based ONLY on the video content provided below.
Explain concepts like a teacher, in simple language, with examples where helpful.
If the answer isn't in the video content, say so honestly instead of guessing.`;

async function chatCall({ context, history = [], message }) {
  // Gemini uses "model" where the frontend uses "assistant"
  const contents = [
    ...history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents,
        config: {
          systemInstruction: `${SYSTEM_PROMPT}\n\nVIDEO CONTENT:\n${context}`,
        },
      });
      return response.text;
    } catch (error) {
      const canRetry =
        RETRYABLE_STATUS.includes(error.status) && attempt < MAX_ATTEMPTS;
      if (!canRetry) throw error; // the route's catch sends the error response
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

module.exports = chatCall;
