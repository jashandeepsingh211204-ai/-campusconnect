const prisma = require("../config/prisma");

// Get all announcements / notices
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.notice.findMany({
      orderBy: [
        {
          pinned: "desc",
        },
        {
          publishedAt: "desc",
        },
      ],
    });

    res.json({
      announcements,
    });
  } catch (error) {
    console.error("Get announcements error:", error);

    res.status(500).json({
      message: "Failed to load announcements.",
    });
  }
};

module.exports = {
  getAnnouncements,
};