const express = require("express");

const {
  createNotice,
  deleteNotice,
} = require("../controllers/noticeController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Only authenticated ADMIN users can create notices
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createNotice
);

// Only authenticated ADMIN users can delete notices
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteNotice
);

module.exports = router;