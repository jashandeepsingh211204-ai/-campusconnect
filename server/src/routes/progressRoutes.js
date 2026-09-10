const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getStudentProgress,
} = require("../controllers/progressController");

const router = express.Router();

router.get("/", authMiddleware, getStudentProgress);

module.exports = router;