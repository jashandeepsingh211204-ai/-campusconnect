const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const progressRoutes = require("./routes/progressRoutes");
const courseRoutes = require("./routes/courseRoutes");
const aiTutorRoutes = require("./routes/aiTutorRoutes");
const projectUploadRoutes = require("./routes/projectUploadRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const app = express();
const noticeRoutes = require("./routes/noticeRoutes");

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "CampusConnect API is running 🚀",
  });
});

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/ai-tutor", aiTutorRoutes);
app.use("/api/project-uploads", projectUploadRoutes);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/announcements", announcementRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/progress", progressRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`CampusConnect API running on http://localhost:${PORT}`);
});