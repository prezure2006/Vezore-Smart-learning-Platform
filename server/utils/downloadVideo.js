const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");

async function downloadVideo(videoUrl, videoId) {
  const response = await fetch(videoUrl);

  if (!response.ok) {
    throw new Error("Failed to download video from Cloudinary");
  }

  const tempFolder = path.join(__dirname, "..", "temp");

  await fs.promises.mkdir(tempFolder, { recursive: true });

  const filePath = path.join(tempFolder, `${videoId}.mp4`);

  await pipeline(
    Readable.fromWeb(response.body),
    fs.createWriteStream(filePath),
  );

  return filePath;
}

module.exports = downloadVideo;
