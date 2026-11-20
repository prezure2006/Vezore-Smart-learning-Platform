const User = require("../models/user.model.js");
const express = require("express");
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
    console.log(hashedPassword);
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
    if (error.code === 11009) {
      return res.status(409).json({ message: "Email is already registered." });
    }
    res.status(500).json({ message: "Server error creating user." });
  }
});
module.exports = router;
