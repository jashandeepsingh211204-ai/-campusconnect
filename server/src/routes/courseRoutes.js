const express = require("express");

const {
  getCourses,
  getCourseById,
} = require("../controllers/courseController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get complete academic structure
// Programme → Semesters → Subjects
router.get("/", authMiddleware, getCourses);

// Get one subject with its academic details
router.get("/:id", authMiddleware, getCourseById);

module.exports = router;