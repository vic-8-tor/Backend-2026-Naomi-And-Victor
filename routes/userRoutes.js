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
const router = express.Router();

router.post("/", upload.single("file"), createUser);
router.post("/login", loginUser);
router.get("/user/:id", getUser);
router.get("/", getUsers);
router.put("/user", updateUser);
router.delete("/user", deleteUser);
router.get("/profile-picture/:id", getProfilePicture);

module.exports = router;