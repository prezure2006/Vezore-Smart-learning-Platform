const Groq = require("groq-sdk");
const fs = require("fs");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function transcribeAudio(audioPath) {
  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: "whisper-large-v3",
    response_format: "verbose_json",
  });

  return {
    text: transcription.text,
    segments: transcription.segments,
  };
}

module.exports = transcribeAudio;
