const mongoose = require("mongoose");

//Define Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
});

// Create User
const User = mongoose.model("User", userSchema);

module.exports = User;
