// This loads api key from outisde the folder
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
//This is how we require the googlegenai object
const { GoogleGenAI } = require("@google/genai");

// here we make a client and pass the api key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_CALLING });
module.exports = ai;
