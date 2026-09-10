const prisma = require("../config/prisma");

// =====================================================
// GET STUDENT PROGRESS / ANALYTICS
// =====================================================

const getStudentProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get student's assignment submissions
    const submissions = await prisma.assignmentSubmission.findMany({
      where: {
        userId,
      },
      include: {
        assignment: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    // Get student's project uploads
    const projectUploads = await prisma.projectUpload.findMany({
      where: {
        userId,
      },
      include: {
        subject: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Count assignment information
    const totalAssignments = submissions.length;

    const submittedAssignments = submissions.filter(
      (submission) =>
        submission.status === "SUBMITTED" ||
        submission.submittedAt !== null
    ).length;

    const pendingAssignments =
      totalAssignments - submittedAssignments;

    // Calculate marks only when actual marks exist
    const markedSubmissions = submissions.filter(
      (submission) => submission.marks !== null
    );

    const totalMarksObtained = markedSubmissions.reduce(
      (total, submission) => total + submission.marks,
      0
    );

    const totalMarkedAssignments = markedSubmissions.length;

    const averageMarks =
      totalMarkedAssignments > 0
        ? totalMarksObtained / totalMarkedAssignments
        : null;

    res.json({
      assignments: {
        total: totalAssignments,
        submitted: submittedAssignments,
        pending: pendingAssignments,
      },

      projects: {
        totalUploads: projectUploads.length,
      },

      marks: {
        totalMarkedAssignments,
        totalMarksObtained,
        averageMarks,
      },

      recentSubmissions: submissions.slice(0, 5).map((submission) => ({
        id: submission.id,
        status: submission.status,
        marks: submission.marks,
        submittedAt: submission.submittedAt,
        assignment: {
          id: submission.assignment.id,
          title: submission.assignment.title,
          subject: submission.assignment.subject
            ? {
                id: submission.assignment.subject.id,
                code: submission.assignment.subject.code,
                name: submission.assignment.subject.name,
              }
            : null,
        },
      })),

      recentProjects: projectUploads.slice(0, 5).map((upload) => ({
        id: upload.id,
        fileName: upload.fileName,
        projectLink: upload.projectLink,
        fileType: upload.fileType,
        createdAt: upload.createdAt,
        subject: upload.subject
          ? {
              id: upload.subject.id,
              code: upload.subject.code,
              name: upload.subject.name,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Get student progress error:", error);

    res.status(500).json({
      message: "Failed to fetch student progress.",
    });
  }
};

module.exports = {
  getStudentProgress,
};