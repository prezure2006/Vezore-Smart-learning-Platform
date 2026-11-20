const mongoose = require("mongoose");
const user = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const UserSchema = mongoose.model("UserSchema", user);
module.exports = UserSchema;
