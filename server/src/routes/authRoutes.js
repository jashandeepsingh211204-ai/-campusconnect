const express = require("express");

const {
  register,
  login,
  getCurrentUser,
  updateProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get logged-in user
router.get(
  "/me",
  authMiddleware,
  getCurrentUser
);

// Update logged-in user profile
router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

module.exports = router;