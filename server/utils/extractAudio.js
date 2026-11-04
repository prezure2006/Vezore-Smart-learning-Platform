const { execFile } = require("child_process");
const { promisify } = require("util");
const path = require("path");

const execFileAsync = promisify(execFile);

async function extractAudio(videoPath, videoId) {
  const audioPath = path.join(path.dirname(videoPath), `${videoId}.wav`);

  await execFileAsync("ffmpeg", [
    "-y",
    "-i",
    videoPath,
    "-vn",
    "-ac",
    "1",
    "-ar",
    "16000",
    "-c:a",
    "pcm_s16le",
    audioPath,
  ]);

  return audioPath;
}

module.exports = extractAudio;
