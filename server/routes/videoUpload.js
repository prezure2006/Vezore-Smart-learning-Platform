const express = require("express");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");
const streamifier = require("streamifier");
const Video = require("../models/video.models.js");
const router = express.Router();

router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video file provided",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "intelligent-video-platform",
          resource_type: "video",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
    console.log("BODY:", req.body);
    console.log("DESCRIPTION:", req.body.description);
    const videoUrl = result.secure_url;
    const thumbnailUrl = videoUrl
      .replace("/video/upload/", "/video/upload/so_2/")
      .replace(".mp4", ".jpg");

    const savedVideo = await Video.create({
      title: req.file.originalname,
      videoUrl: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
      thumbnailURL: thumbnailUrl,
      description: req.body.description,
    });

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully!",
      video: savedVideo,
    });
  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      success: false,
      message: "Video upload failed",
    });
  }
});

module.exports = router;
