const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getBucket } = require("../middlwares/gridfs");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const KEY = process.env.SPECIAL_KEY;

// Create
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const bucket = getBucket();
    if (!bucket)
      return res.status(500).json({ message: "GridFS not initialized" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      try {
        const user = await User.create({
          username,
          email,
          password: hashedPassword,
          profilePicture: uploadStream.id,
        });
        res.status(201).json({
          message: "User Created",
          user,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
      }
    });

    uploadStream.on("error", (err) => {
      console.error("Grid FS upload error:", err);
      res.status(500).json({
        message: "File upload failed",
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
};

// login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not Found");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json("Invalid Credentials");

    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
        role: user.role,
      },
      KEY,
      {
        expiresIn: "30m",
      },
    );
    console.log(token);
    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
};

// Get User
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    res.status(200).json({
      message: "User found",
      user: {
        _id: user._id,
        name: user.username,
        email: user.email,
        profilePicture: user.profilePicture
          ? `/users/profile-picture/${user.profilePicture}`
          : null,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
};

const getProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;
    const bucket = getBucket();

    if (!bucket)
      return res.status(500).json({
        message: "GridFS not Initialized",
      });

    const file = await bucket
      .find({
        _id: new mongoose.Types.ObjectId(id),
      })
      .next();

    console.log(file);

    if (!file) {
      return res.status(404).json({
        message: "Profile picture not found",
      });
    }

    const contentType = file.metadata?.contentType;
    res.set("Content-Type", contentType || "application/octet-stream");
    const downloadStream = bucket.openDownloadStream(file._id);

    downloadStream.pipe(res);
  } catch (err) {
    console.log("ran");

    console.error(err.message);
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Get Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const {profilePicture, username, email, password } = req.user;
    const updateData = {profilePicture, username, email };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true },
    );

    if (!updatedUser) return res.status(404).json("User not found");

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deleteUser) {
      return res.status(404).json("User not found");
    }
    res.status(200).json(deletedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  getProfilePicture,
};