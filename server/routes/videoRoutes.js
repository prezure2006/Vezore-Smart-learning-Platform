const express = require("express");
const Video = require("../models/video.models.js");
const router = express.Router();
const cloudinary = require("../config/cloudinary.js");
const downloadVideo = require("../utils/downloadVideo.js");
const extractAudio = require("../utils/extractAudio.js");
router.get("/all", async (req, res) => {
  try {
    const allVideo = await Video.find();
    res.status(200).json({
      success: true,
      videos: allVideo,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
    });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Could not get the video",
      });
    }
    res.status(200).json({
      success: true,
      message: "Video is sucessfully delivered",
      video: video,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }
    const publicId = video.publicId;
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error("Cloudinary deletion failed");
    }

    await video.deleteOne();

    return res.status(200).json({
      message: "Successful ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete video",
    });
  }
});
router.put("/updateinfo/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    console.log("Received ID:", req.params.id);
    if (!video) {
      return res.status(404).json({
        message: "Video doesnt exist",
      });
    }
    console.log("Found video:", video);
    video.title = req.body.title;
    video.description = req.body.description;
    await video.save();
    return res.status(200).json({
      message: "Updated data ",
    });
  } catch (error) {
    console.error("PUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.post("/:id/transcribe", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }
    const filePath = await downloadVideo(video.videoUrl, video._id);

    console.log("Downloaded video:", filePath);
    const audioPath = await extractAudio(filePath, video._id);

    console.log("Audio extracted:", audioPath);

    return res.status(200).json({
      success: true,
      message: "Video found successfully",
      videoUrl: video.videoUrl,
    });
  } catch (error) {
    console.error("Transcription route error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve video",
    });
  }
});
module.exports = router;
