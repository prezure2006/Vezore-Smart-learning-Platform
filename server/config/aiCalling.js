// This loads api key from outisde the folder
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
//This is how we require the googlegenai object
const { GoogleGenAI } = require("@google/genai");

// here we make a client and pass the api key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_CALLING });
// This is the async fucntion through which we send our request and get the repsose
async function calling() {
  //use try catch to handle errors
  try {
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
