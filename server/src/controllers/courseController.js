const prisma = require("../config/prisma");

// =====================================================
// GET ALL SEMESTERS + SUBJECTS
// =====================================================

const getCourses = async (req, res) => {
  try {
    const programme = await prisma.programme.findFirst({
      where: {
        specialization: "Data Science",
      },

      include: {
        university: true,

        semesters: {
          orderBy: {
            number: "asc",
          },

          include: {
            subjects: {
              orderBy: {
                code: "asc",
              },

              include: {
                materials: {
                  orderBy: {
                    createdAt: "desc",
                  },
                },

                assignments: {
                  orderBy: {
                    createdAt: "desc",
                  },
                },

                exams: {
                  orderBy: {
                    createdAt: "desc",
                  },
                },

                projects: {
                  orderBy: {
                    createdAt: "desc",
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!programme) {
      return res.status(404).json({
        message: "Data Science programme not found",
      });
    }

    res.json({
      programme,
    });
  } catch (error) {
    console.error("Get academic structure error:", error);

    res.status(500).json({
      message: "Failed to fetch academic structure",
    });
  }
};

// =====================================================
// GET SINGLE SUBJECT
// =====================================================

const getCourseById = async (req, res) => {
  try {
    const subjectId = Number(req.params.id);

    if (Number.isNaN(subjectId)) {
      return res.status(400).json({
        message: "Invalid subject ID",
      });
    }

    const subject = await prisma.subject.findUnique({
      where: {
        id: subjectId,
      },

      include: {
        semester: {
          include: {
            programme: {
              include: {
                university: true,
              },
            },
          },
        },

        syllabusUnits: {
          orderBy: {
            unitNumber: "asc",
          },

          include: {
            topics: true,
          },
        },

        exams: {
          orderBy: {
            createdAt: "desc",
          },
        },

        materials: {
          orderBy: {
            createdAt: "desc",
          },
        },

        assignments: {
          orderBy: {
            createdAt: "desc",
          },
        },

        projects: {
          orderBy: {
            createdAt: "desc",
          },
        },

        books: {
          orderBy: {
            createdAt: "desc",
          },
        },

        previousPapers: {
          orderBy: {
            createdAt: "desc",
          },
        },

        sources: true,
      },
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.json({
      subject,
    });
  } catch (error) {
    console.error("Get subject error:", error);

    res.status(500).json({
      message: "Failed to fetch subject",
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
};