const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    UserID: {
      type: String,
      required: true,
      unique: true,
    },
    Username: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Gender: {
      type: String,
      required: true,
    },
    DateOfBirth: {
      type: String,
      required: true,
    },
    Address: {
      type: String,
    },
    Role: {
      type: String,
      default: "user",
    },
    StartDate: {
      type: String,
    },
    Phone: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = new mongoose.model("user", userSchema);
module.exports = userModel;
