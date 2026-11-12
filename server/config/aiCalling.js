const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_CALLING });
module.exports = ai;
