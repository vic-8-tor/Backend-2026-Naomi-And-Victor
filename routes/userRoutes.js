const express = require('express');

const {
  createUser,
  loginUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  getProfilePicture
} = require("../controller/userController");
const upload = require("../middlwares/multer");
const { verify } = require('jsonwebtoken');
const {verifyToken} = require("../middlwares/verify");
const router = express.Router();

router.post("/", upload.single("file"), createUser);
router.post("/login", loginUser);
router.get("/user/:id", getUser);
router.get("/", getUsers);
router.put("/user/:id", verifyToken, updateUser);
router.delete("/user",  verifyToken, deleteUser);
router.get("/profile-picture/:id", getProfilePicture);

module.exports = router;