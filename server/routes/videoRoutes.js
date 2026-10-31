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
module.exports = router;
