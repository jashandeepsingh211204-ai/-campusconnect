const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const prisma = require("../config/prisma");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDirectory = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const safeName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "_");

    const uniqueName = `${Date.now()}-${safeName}${extension}`;

    cb(null, uniqueName);
  },
});

// =====================================================
// ALLOWED FILE TYPES
// =====================================================

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "application/x-zip-compressed",
];

// =====================================================
// MULTER CONFIGURATION
// =====================================================

const upload = multer({
  storage,

  limits: {
    fileSize: 20 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only PDF, DOC, DOCX, PPT, PPTX and ZIP files are allowed."
        )
      );
    }

    cb(null, true);
  },
});

// =====================================================
// POST — UPLOAD PROJECT
// =====================================================

router.post(
  "/",
  authMiddleware,
  upload.single("projectFile"),
  async (req, res) => {
    try {
      const { subjectId, projectLink } = req.body;

      if (!subjectId) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          message: "Subject ID is required.",
        });
      }

      if (!req.file && !projectLink) {
        return res.status(400).json({
          message:
            "Please upload a project file or provide a project link.",
        });
      }

      const subject = await prisma.subject.findUnique({
        where: {
          id: Number(subjectId),
        },
      });

      if (!subject) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(404).json({
          message: "Subject not found.",
        });
      }

      const projectUpload =
        await prisma.projectUpload.create({
          data: {
            userId: req.user.id,
            subjectId: Number(subjectId),

            fileName: req.file
              ? req.file.originalname
              : null,

            fileUrl: req.file
              ? `/uploads/${req.file.filename}`
              : null,

            fileType: req.file
              ? req.file.mimetype
              : null,

            fileSize: req.file
              ? req.file.size
              : null,

            projectLink: projectLink || null,
          },
        });

      res.status(201).json({
        message: "Project uploaded successfully.",
        projectUpload,
      });
    } catch (error) {
      console.error("Project upload error:", error);

      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch {}
      }

      res.status(500).json({
        message: "Failed to upload project.",
      });
    }
  }
);

// =====================================================
// GET — LOGGED-IN STUDENT'S PROJECT UPLOADS
// =====================================================

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const subjectId = Number(req.query.subjectId);

      if (!subjectId) {
        return res.status(400).json({
          message: "Subject ID is required.",
        });
      }

      const projectUploads =
        await prisma.projectUpload.findMany({
          where: {
            userId: req.user.id,
            subjectId,
          },

          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            fileType: true,
            fileSize: true,
            projectLink: true,
            createdAt: true,
          },
        });

      res.json({
        projectUploads,
      });
    } catch (error) {
      console.error(
        "Get project uploads error:",
        error
      );

      res.status(500).json({
        message: "Failed to load project uploads.",
      });
    }
  }
);

// =====================================================
// DELETE — DELETE STUDENT'S OWN PROJECT UPLOAD
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const uploadId = Number(req.params.id);

      if (Number.isNaN(uploadId)) {
        return res.status(400).json({
          message: "Invalid project upload ID.",
        });
      }

      // Find the upload and verify ownership
      const projectUpload =
        await prisma.projectUpload.findFirst({
          where: {
            id: uploadId,
            userId: req.user.id,
          },
        });

      if (!projectUpload) {
        return res.status(404).json({
          message:
            "Project upload not found or you do not have permission to delete it.",
        });
      }

      // Delete the physical file if one exists
      if (projectUpload.fileUrl) {
        const fileName = path.basename(
          projectUpload.fileUrl
        );

        const filePath = path.join(
          uploadDirectory,
          fileName
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // Delete database record
      await prisma.projectUpload.delete({
        where: {
          id: projectUpload.id,
        },
      });

      res.json({
        message: "Project upload deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete project upload error:",
        error
      );

      res.status(500).json({
        message: "Failed to delete project upload.",
      });
    }
  }
);

module.exports = router;