const express = require("express");
const Video = require("../models/video.models.js");
const router = express.Router();
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
router.get("/delete/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
  } catch (error) {}
});
module.exports = router;
