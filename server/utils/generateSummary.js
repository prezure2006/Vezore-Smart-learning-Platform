// 1. Correctly require the exported client (make sure path is correct)
const ai = require("../config/aiCalling.js");

async function calling(transcript) {
  try {
    // 2. Call the API using the imported client
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Summarize indias culture in two lines",
    });

    // 3. Extract text
    console.log(response.text);
    return response.text;
  } catch (error) {
    console.error("API Call Failed:", error);
  }
}

module.exports = calling;
