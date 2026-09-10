const express = require("express");

const {
  getAnnouncements,
} = require("../controllers/announcementController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all announcements / notices
router.get("/", authMiddleware, getAnnouncements);

module.exports = router;