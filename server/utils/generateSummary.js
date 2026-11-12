const ai = require("../config/aiCalling.js");

async function calling(transcript, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Summarize the following video transcript clearly and concisely:\n\n${transcript}`,
      });
      return response.text;
    } catch (error) {
      console.error(
        `Attempt ${i + 1} failed:`,
        error.cause?.code || error.message,
      );
      if (i === retries - 1) throw error;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

module.exports = calling;
