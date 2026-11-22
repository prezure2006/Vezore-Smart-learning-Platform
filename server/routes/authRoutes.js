const User = require("../models/user.model.js");
const express = require("express");
const bcrypt = require("bcrypt");
const { hashPassword } = require("../utils/hashingPassword.js");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Not enough information",
      });
    }
    const emailData = email.trim().normalize("NFC").toLowerCase();
    const userData = await User.findOne({ email: emailData });
    if (userData) {
      return res.status(409).json({
        success: false,
        message: "User alreday exist ",
      });
    }
    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email: emailData,
      password: hashedPassword,
    });
    if (newUser) {
      res.status(201).json({
        message: "User created successfully",
        userId: newUser._id,
        email: newUser.email,
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email is already registered." });
    }
    res.status(500).json({ message: "Server error creating user." });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Insufficient information",
      });
    }

    const emailData = email.trim().normalize("NFC").toLowerCase();
    const userData = await User.findOne({ email: emailData });

    if (!userData) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const match = await bcrypt.compare(password, userData.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: { id: userData._id, name: userData.name, email: userData.email },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
