const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function transcribeAudio() {
  try {
    const audioPath = path.join(__dirname, "prash_audio.wav");

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-large-v3",
      response_format: "verbose_json",
    });

    console.log(transcription.text);
    console.log(transcription.segments);
  } catch (error) {
    console.error("Transcription failed:", error.message);
  }
}

transcribeAudio();
