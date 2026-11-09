const express = require("express");
const Video = require("../models/video.models.js");
const router = express.Router();
const cloudinary = require("../config/cloudinary.js");
const downloadVideo = require("../utils/downloadVideo.js");
const extractAudio = require("../utils/extractAudio.js");
const transcribeAudio = require("../utils/transcribeAudio.js");
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

    if (!video) {
      return res.status(404).json({
        message: "Video doesnt exist",
      });
    }

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
  let video;

  try {
    video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }
    video.transcriptionStatus = "processing";
    await video.save();
    const filePath = await downloadVideo(video.videoUrl, video._id);

    const audioPath = await extractAudio(filePath, video._id);

    const transcript = await transcribeAudio(audioPath);

    video.transcript = transcript.text;
    video.segments = transcript.segments;
    video.transcriptionStatus = "completed";
    await video.save();
    return res.status(200).json({
      success: true,
      message: "Transcription completed",
      transcript,
    });
  } catch (error) {
    if (video) {
      video.transcriptionStatus = "failed";

      try {
        await video.save();
      } catch (saveError) {
        console.error("Failed to update transcription status:", saveError);
      }
    }
    console.error("Transcription route error:", error);

    return res.status(500).json({
      success: false,
      message: "Transcription failed",
      error: error.message,
    });
  }
});
router.get("/:id/transcript", async (req, res) => {
  let video;
  try {
    video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        message: "Video Doesnt exist",
        success: false,
      });
    }
    if (
      video.transcriptionStatus === "processing" ||
      video.transcriptionStatus === "pending"
    ) {
      return res.status(202).json({
        message: `Currently  ${video.transcriptionStatus}`,
      });
    }
    const transcript = video.transcript;

    if (video.transcriptionStatus === "completed") {
      return res.status(200).json({
        success: true,
        message: "Video Found",
        transcript,
        transcriptionStatus: video.transcriptionStatus,
        segments: video.segments,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Not found",
      success: false,
      error: error.message,
    });
  }
});
router.post("/:id/summary", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(500).json({
        success: false,
        message: "Coudnt find the video",
      });
    }
    if (!video.transcript) {
      return res.status(400).json({
        // for something missing we use the bad request message
        success: false,
        message: "No transcript",
      });
    }
    if (video.summary) {
      return res.status(200).json({
        success: true,
        message: "Summary already generated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Coudnt Generate Summaries",
      success: false,
    });
  }
});
router.get("/:id/summary", async (req, res) => {});
module.exports = router;
