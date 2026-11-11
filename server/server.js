require("dotenv").config();
const videoUpload = require("./routes/videoUpload");
const express = require("express");
const cors = require("cors");

const connectMongo = require("./config/db");
const videoRoutes = require("./routes/videoRoutes");
const app = express();
connectMongo();
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running!",
  });
});

// Video routes
app.use(express.json());
app.use("/api/videos", videoUpload);
app.use("/api/videos", videoRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);

  res.status(400).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
