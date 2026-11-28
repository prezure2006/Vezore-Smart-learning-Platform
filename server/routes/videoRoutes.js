const express = require("express");
const Video = require("../models/video.models.js");
const router = express.Router();
const cloudinary = require("../config/cloudinary.js");
const downloadVideo = require("../utils/downloadVideo.js");
const extractAudio = require("../utils/extractAudio.js");
const transcribeAudio = require("../utils/transcribeAudio.js");
const chatCall = require("../utils/chatWithVideo.js"); // adjust the path
const authMiddle = require("../middleware/auth.js");
// Getting all the video from database
router.get("/all", async (req, res) => {
  try {
    const allVideo = await Video.find({ owner: req.user.id });
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
// get a single element
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
// Deleting the video
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
//update Video info
router.put("/updateinfo/:id", authMiddle, async (req, res) => {
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
// using all the utility fucntion for downlaoding the video getting the audio transcripting it and then saving in the data base
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
    console.log(transcript.text);
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
// getting the trancript of the video of the particular id
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
// generating summary and saving it to db
router.post("/:id/summary", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Couldn't find the video",
      });
    }

    // 1. Validate input first
    if (!video.transcript) {
      return res.status(400).json({
        success: false,
        message: "No transcript",
      });
    }

    // 2. Return early if a summary already exists
    if (video.summary) {
      return res.status(200).json({
        success: true,
        message: "Summary already generated",
        summary: video.summary,
      });
    }

    // 3. Only now generate it
    const summary = await calling(video.transcript);

    if (!summary) {
      return res.status(500).json({
        success: false,
        message: "Summary couldn't be generated",
      });
    }

    // 4. Save and respond
    video.summary = summary; // not summary.data
    await video.save();

    return res.status(200).json({
      success: true,
      message: "Summary generated",
      summary: video.summary,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Couldn't generate summary",
    });
  }
}); // getting the saved summary and sending it to the frontend
router.get("/:id/summary", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).select("summary");

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Couldn't find the video",
      });
    }

    // No summary yet is a normal state, not an error
    return res.status(200).json({
      success: true,
      summary: video.summary || null,
    });
  } catch (error) {
    console.error(`[summary] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Couldn't load the summary",
    });
  }
});
// chat with the video
router.post("/:id/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const video = await Video.findById(req.params.id).select(
      "transcript summary",
    );
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Couldn't find the video",
      });
    }

    // Prefer the full transcript, fall back to the summary
    const context = video.transcript || video.summary;
    if (!context) {
      return res.status(400).json({
        success: false,
        message: "Generate a transcript first",
      });
    }

    // 👇 change this line to match your util's name and arguments
    const reply = await chatCall({
      context,
      history: Array.isArray(history) ? history.slice(-10) : [],
      message: message.trim(),
    });
    if (!reply) {
      return res.status(500).json({
        success: false,
        message: "The AI didn't return a reply",
      });
    }

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error(`[chat] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Couldn't get a reply. Try again.",
    });
  }
});
module.exports = router;
