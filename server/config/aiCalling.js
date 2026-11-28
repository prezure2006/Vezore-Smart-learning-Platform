const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_CALLING) {
  throw new Error("GEMINI_API_CALLING is not set in .env");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_CALLING,
  httpOptions: { apiVersion: "v1beta" },
});

module.exports = ai;
