const ai = require("../config/aiCalling.js");
const retries = 3;

async function chatCall(chat, retries) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are Vezore AI, a helpful video learning assistant.

Your job is to answer the user's questions based
ONLY on the provided video transcript.

Explain concepts like a teacher.
Use simple language and examples where helpful.
If the answer isn't available in the transcript,
tell the user honestly.:\n\n${chat}`,
      });
      return response.text;
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
      if (i === retries - 1) throw error;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
