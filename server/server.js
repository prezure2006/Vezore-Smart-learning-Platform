require("dotenv").config();
const videoUpload = require("./routes/videoUpload");
const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/authRoutes.js");
const connectMongo = require("./config/db");
const videoRoutes = require("./routes/videoRoutes");
const app = express();
const cookieParser = require("cookie-parser");
connectMongo();
// Adding Credentials true lets the backend accept the cookies and all
// Here we provide the client url so that means we can only accept the request form that active url
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
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
app.use(cookieParser());
app.use("/api/videos", videoUpload);
app.use("/api/videos", videoRoutes);
app.use("/api/auth", authRoute);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);

  res.status(400).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});
// Port Number
const PORT = process.env.PORT || 5000;
// Calling the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
