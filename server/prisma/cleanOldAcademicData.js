const prisma = require("../src/config/prisma");

async function main() {
  console.log("🧹 Cleaning old/mock academic data...");

  const result = await prisma.$transaction([
    prisma.assignmentSubmission.deleteMany({}),
    prisma.assignment.deleteMany({}),
    prisma.exam.deleteMany({}),
    prisma.studyMaterial.deleteMany({}),
  ]);

  console.log(`✅ Assignment submissions removed: ${result[0].count}`);
  console.log(`✅ Assignments removed: ${result[1].count}`);
  console.log(`✅ Exams removed: ${result[2].count}`);
  console.log(`✅ Study materials removed: ${result[3].count}`);

  console.log("");
  console.log("🎓 Academic structure was NOT deleted.");
  console.log("📚 Subjects, syllabus, books, projects and sources remain.");
}

main()
  .catch((error) => {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });