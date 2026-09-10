const { GoogleGenerativeAI } = require("@google/generative-ai");
const prisma = require("../config/prisma");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askAITutor = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please enter a question.",
      });
    }

    /*
      Fetch official academic information from CampusConnect.
      We provide the academic database context to Gemini so
      university-specific answers are based on our stored data.
    */

    const subjects = await prisma.subject.findMany({
      orderBy: {
        code: "asc",
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

        books: {
          orderBy: {
            createdAt: "desc",
          },
        },

        projects: {
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

    /*
      Convert the academic database information into
      a compact context for Gemini.
    */

    const academicContext = subjects
      .map((subject) => {
        const syllabus = subject.syllabusUnits
          .map((unit) => {
            const topics = unit.topics
              .map((topic) => `- ${topic.topic}`)
              .join("\n");

            return `Unit ${unit.unitNumber}: ${unit.title}
${unit.description || ""}
${topics}`;
          })
          .join("\n\n");

        const exams = subject.exams
          .map(
            (exam) =>
              `- ${exam.title}
  Type: ${exam.examType || "Not available in the provided document."}
  Duration: ${exam.duration || "Not available in the provided document."}
  Total Marks: ${
    exam.totalMarks ??
    "Not available in the provided document."
  }
  Instructions: ${
    exam.instructions ||
    "Not available in the provided document."
  }`
          )
          .join("\n");

        const books = subject.books
          .map(
            (book) =>
              `- ${book.title} — ${
                book.author ||
                "Not available in the provided document."
              }${
                book.edition
                  ? ` — ${book.edition}`
                  : ""
              }`
          )
          .join("\n");

        const projects = subject.projects
          .map(
            (project) =>
              `- ${project.title}
  Type: ${
    project.type ||
    "Not available in the provided document."
  }
  Description: ${
    project.description ||
    "Not available in the provided document."
  }
  Requirements: ${
    project.requirements ||
    "Not available in the provided document."
  }`
          )
          .join("\n");

        const previousPapers = subject.previousPapers
          .map(
            (paper) =>
              `- ${paper.title} ${
                paper.year
                  ? `(${paper.year})`
                  : ""
              }`
          )
          .join("\n");

        const sources = subject.sources
          .map((source) => `- ${source.name}`)
          .join("\n");

        return `
==================================================
SUBJECT
==================================================

University:
${
  subject.semester?.programme?.university?.name ||
  "Not available in the provided document."
}

Programme:
${
  subject.semester?.programme?.name ||
  "Not available in the provided document."
}

Specialization:
${
  subject.semester?.programme?.specialization ||
  "Not available in the provided document."
}

Semester:
${
  subject.semester?.number ??
  "Not available in the provided document."
}

Paper Code:
${subject.code}

Paper Name:
${subject.name}

Category:
${
  subject.category ||
  "Not available in the provided document."
}

Lectures:
${
  subject.theoryPracticalLectures ||
  "Not available in the provided document."
}

University Exam Marks:
${
  subject.universityExamMarks ??
  "Not available in the provided document."
}

Internal Assessment Marks:
${
  subject.internalAssessmentMarks ??
  "Not available in the provided document."
}

Total Marks:
${
  subject.totalMarks ??
  "Not available in the provided document."
}

Credits:
${
  subject.credits ??
  "Not available in the provided document."
}

Objectives:
${
  subject.objectives ||
  "Not available in the provided document."
}

Outcomes:
${
  subject.outcomes ||
  "Not available in the provided document."
}

SYLLABUS:
${syllabus || "Not available in the provided document."}

EXAM DETAILS:
${exams || "Not available in the provided document."}

RECOMMENDED BOOKS:
${books || "Not available in the provided document."}

PROJECTS:
${projects || "Not available in the provided document."}

PREVIOUS YEAR PAPERS:
${
  previousPapers ||
  "Not available in the provided document."
}

SOURCE DOCUMENTS:
${sources || "Not available in the provided document."}
`;
      })
      .join("\n\n");

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
    });

    const prompt = `
You are CampusConnect AI Tutor.

You help students understand academic subjects and study effectively.

IMPORTANT:
CampusConnect has an official academic database containing information imported from university-provided documents.

Use the academic context below for university-specific questions.

STRICT RULES:

1. Do NOT invent university-specific information.
2. Do NOT change paper codes, subject names, marks, credits, units, topics, books, exam information, or project requirements.
3. When answering a university-specific question, use only the information supplied in the academic context.
4. If the requested university-specific information is not present in the academic context, say exactly:
"Not available in the provided document."
5. You may explain academic concepts in your own words when the student asks for an explanation.
6. Clearly distinguish between official academic information and general educational explanations.
7. Use simple language suitable for university students.
8. Use headings, bullet points, numbered lists, tables, and code blocks when useful.
9. Do not mention internal database details unless necessary.
10. Never claim that information comes from an official document if it is not present in the context.

OFFICIAL CAMPUSCONNECT ACADEMIC CONTEXT:

${academicContext}

STUDENT QUESTION:

${message.trim()}
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    const reply = response.text();

    res.json({
      reply,
      mode: "gemini-academic",
    });
  } catch (error) {
    console.error("Gemini AI Tutor error:", error);

    res.status(500).json({
      message: "Failed to get response from AI Tutor.",
    });
  }
};

module.exports = {
  askAITutor,
};