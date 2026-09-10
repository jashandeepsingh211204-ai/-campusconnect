const prisma = require("../config/prisma");

// Create a new announcement / notice
const createNotice = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      important,
      pinned,
      sourceId,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required.",
      });
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        category: category || null,
        important: important === true,
        pinned: pinned === true,
        sourceId: sourceId ? Number(sourceId) : null,
      },
    });

    res.status(201).json({
      message: "Notice created successfully.",
      notice,
    });
  } catch (error) {
    console.error("Create notice error:", error);

    res.status(500).json({
      message: "Failed to create notice.",
    });
  }
};

// Delete an announcement / notice
const deleteNotice = async (req, res) => {
  try {
    const noticeId = Number(req.params.id);

    if (Number.isNaN(noticeId)) {
      return res.status(400).json({
        message: "Invalid notice ID.",
      });
    }

    const notice = await prisma.notice.findUnique({
      where: {
        id: noticeId,
      },
    });

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found.",
      });
    }

    await prisma.notice.delete({
      where: {
        id: noticeId,
      },
    });

    res.json({
      message: "Notice deleted successfully.",
    });
  } catch (error) {
    console.error("Delete notice error:", error);

    res.status(500).json({
      message: "Failed to delete notice.",
    });
  }
};

module.exports = {
  createNotice,
  deleteNotice,
};