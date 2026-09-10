const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const {
  askAITutor,
} = require("../controllers/aiTutorController");

const router = express.Router();

router.post("/", authMiddleware, askAITutor);

module.exports = router;