
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const SOURCE_NAME =
  "Panjab University Chandigarh-160014 (India) - Faculty of Science - Syllabi - M.Sc. (Hons.) (Two-Year programme) in Computer Science - Specialization in Data Science - Examinations 2026-2027";

async function main() {
  console.log("🌱 Starting CampusConnect database seed...");

  // ------------------------------------------------------------
  // 1. CLEAR DEVELOPMENT DATABASE
  // ------------------------------------------------------------

  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.studyMaterial.deleteMany();
  await prisma.previousPaper.deleteMany();
  await prisma.project.deleteMany();
  await prisma.book.deleteMany();
  await prisma.syllabusTopic.deleteMany();
  await prisma.syllabusUnit.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.sourceDocument.deleteMany();
  await prisma.programme.deleteMany();
  await prisma.university.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️ Development database cleared.");

  // ------------------------------------------------------------
  // 2. TEST STUDENT
  // ------------------------------------------------------------

  const hashedPassword = await bcrypt.hash("Test12345", 10);

  const student = await prisma.user.create({
    data: {
      name: "Test Student",
      email: "teststudent@campusconnect.com",
      password: hashedPassword,
      role: "STUDENT",
    },
  });

  console.log(`👤 Test student created: ${student.email}`);

  // ------------------------------------------------------------
  // 3. UNIVERSITY
  // ------------------------------------------------------------

  const university = await prisma.university.create({
    data: {
      name: "Panjab University",
      city: "Chandigarh",
      country: "India",
    },
  });

  // ------------------------------------------------------------
  // 4. PROGRAMME
  // ------------------------------------------------------------

  const programme = await prisma.programme.create({
    data: {
      name: "M.Sc. (Hons.) in Computer Science",
      degree: "M.Sc. (Hons.)",
      specialization: "Data Science",
      duration: "Two-Year programme",
      mode: null,
      totalCredits: 80,
      examination: "2026-2027",
      universityId: university.id,
    },
  });

  // ------------------------------------------------------------
  // 5. SOURCE DOCUMENT
  // ------------------------------------------------------------

  const source = await prisma.sourceDocument.create({
    data: {
      name: SOURCE_NAME,
      fileType: "PDF",
      description:
        "Official Panjab University syllabus document for M.Sc. (Hons.) (Two-Year programme) in Computer Science, Specialization in Data Science, Examinations 2026-2027.",
      programmeId: programme.id,
    },
  });

  // ------------------------------------------------------------
  // 6. SEMESTER 1
  // ------------------------------------------------------------

  const semester1 = await prisma.semester.create({
    data: {
      number: 1,
      name: "Semester 1",
      description: "First semester",
      programmeId: programme.id,
    },
  });

  // ------------------------------------------------------------
  // 7. SEMESTER 2
  // ------------------------------------------------------------

  const semester2 = await prisma.semester.create({
    data: {
      number: 2,
      name: "Semester 2",
      description: "Second semester",
      programmeId: programme.id,
    },
  });

  // ------------------------------------------------------------
  // 8. SEMESTER 3
  // ------------------------------------------------------------

  const semester3 = await prisma.semester.create({
    data: {
      number: 3,
      name: "Semester 3",
      description: "Third semester",
      programmeId: programme.id,
    },
  });

  // ------------------------------------------------------------
  // 9. SEMESTER 4
  // ------------------------------------------------------------

  const semester4 = await prisma.semester.create({
    data: {
      number: 4,
      name: "Semester 4",
      description: "Fourth semester",
      programmeId: programme.id,
    },
  });

  // ============================================================
  // SEMESTER 1 SUBJECTS
  // ============================================================

  const mds2601 = await prisma.subject.create({
    data: {
      code: "MDS-2601",
      name: "Principles of Data Science",
      category: "DSC",
      semesterId: semester1.id,
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,

      objectives: `1. provide a strong foundation for data science and its application area.
2. understand the underlying core concepts and emerging technologies in data science.
3. develop applied experience with data science software, programming, applications and processes.
4. develop practical skills needed in modern analytics.
5. give a hands-on experience with real-world data analysis.`,

      outcomes: `1. Understand impact of digital data in businesses its role in making crucial decisions.
2. Have preliminary knowledge on data science process, tools, and job trends.
3. Have proficiency in utilizing diverse feature selection, anomaly detection methods and time series forecasting techniques.
4. Have knowledge about available data science tools.`,
    },
  });

  const mds2602 = await prisma.subject.create({
    data: {
      code: "MDS-2602",
      name: "Programming in Python",
      category: "DSC",
      semesterId: semester1.id,
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,
    },
  });

  const mds2603 = await prisma.subject.create({
    data: {
      code: "MDS-2603",
      name: "Advance Database Systems",
      category: "DSE",
      semesterId: semester1.id,
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,
    },
  });

  const mds2604 = await prisma.subject.create({
    data: {
      code: "MDS-2604",
      name: "Operating System Concepts",
      category: "DSE",
      semesterId: semester1.id,
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,
    },
  });

  const mds2605 = await prisma.subject.create({
    data: {
      code: "MDS-2605",
      name: "Minor Project based on MDS-2602",
      category: "DSC",
      semesterId: semester1.id,
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,
    },
  });

  // ============================================================
  // SEMESTER 2 SUBJECTS
  // ============================================================

  const mds2606 = await prisma.subject.create({
    data: {
      code: "MDS-2606",
      name: "Advance Data Structures",
      category: "DSC",
      semesterId: semester2.id,
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,
    },
  });

  const mds2607 = await prisma.subject.create({
    data: {
      code: "MDS-2607",
      name: "Statistical Methods for Data Science",
      category: "DSC",
      semesterId: semester2.id,
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,
    },
  });

  const mds2608 = await prisma.subject.create({
    data: {
      code: "MDS-2608",
      name: "Data Mining and Artificial Intelligence",
      category: "DSE",
      semesterId: semester2.id,
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,
    },
  });

  const mds2609 = await prisma.subject.create({
    data: {
      code: "MDS-2609",
      name: "Big Data Analytics",
      category: "DSE",
      semesterId: semester2.id,
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,
    },
  });

  const mds2610 = await prisma.subject.create({
    data: {
      code: "MDS-2610",
      name: "Minor Project based on MDS-2606 and MDS-2607 using Python Programming",
      category: "DSC",
      semesterId: semester2.id,
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,
    },
  });

  // ============================================================
  // SEMESTER 3 SUBJECTS
  // ============================================================

  const mds2611 = await prisma.subject.create({
    data: {
      code: "MDS-2611",
      name: "Data Visualization",
      category: "DSC",
      semesterId: semester3.id,
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,
    },
  });

  const mds2612 = await prisma.subject.create({
    data: {
      code: "MDS-2612",
      name: "Machine Learning- Tools and Techniques",
      category: "DSC",
      semesterId: semester3.id,
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,
    },
  });

  const mds2613 = await prisma.subject.create({
    data: {
      code: "MDS-2613",
      name: "Software Project Management",
      category: "DSE",
      semesterId: semester3.id,
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,
    },
  });

  const mds2614 = await prisma.subject.create({
    data: {
      code: "MDS-2614",
      name: "Research Methods and Ethics in Data Science",
      category: "DSE",
      semesterId: semester3.id,
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,
    },
  });

  const mds2615 = await prisma.subject.create({
    data: {
      code: "MDS-2615",
      name: "Minor Project based on MDS-2611 and MDS-2612",
      category: "DSC",
      semesterId: semester3.id,
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,
    },
  });

  // ============================================================
  // SEMESTER 4
  // ============================================================

  const mds2616 = await prisma.subject.create({
    data: {
      code: "MDS-2616",
      name: "Major Project",
      category: "DSC",
      semesterId: semester4.id,
      theoryPracticalLectures: "-",
      universityExamMarks: 240,
      internalAssessmentMarks: 60,
      totalMarks: 300,
      credits: 12,
    },
  });

  const mds2617 = await prisma.subject.create({
    data: {
      code: "MDS-2617",
      name: "Seminar (Based on MDS-2616)",
      category: "DSE",
      semesterId: semester4.id,
      theoryPracticalLectures: "-",
      universityExamMarks: 160,
      internalAssessmentMarks: 40,
      totalMarks: 200,
      credits: 8,
    },
  });

  // ============================================================
  // MDS-2601 SYLLABUS
  // ============================================================

  const unit1 = await prisma.syllabusUnit.create({
    data: {
      unitNumber: 1,
      title: "Data Science",
      description:
        "History, Principles and Impact; Data: Types, Modelling, Exploring, Collecting, Visualizing, Predicting, and Deploying the Model; Data Science Process, Lifecycle; Components of Data Science: Data Analysis process and types.",
      subjectId: mds2601.id,
    },
  });

  await prisma.syllabusTopic.createMany({
    data: [
      {
        topic: "History, Principles and Impact",
        unitId: unit1.id,
      },
      {
        topic:
          "Data: Types, Modelling, Exploring, Collecting, Visualizing, Predicting, and Deploying the Model",
        unitId: unit1.id,
      },
      {
        topic: "Data Science Process, Lifecycle",
        unitId: unit1.id,
      },
      {
        topic: "Components of Data Science",
        unitId: unit1.id,
      },
      {
        topic: "Data Analysis process and types",
        unitId: unit1.id,
      },
    ],
  });

  const unit2 = await prisma.syllabusUnit.create({
    data: {
      unitNumber: 2,
      title:
        "Data Science Integrating Statistics, Computer Science, and Domain Expertise",
      description:
        "Statistics and Mathematical Functions; Data Science tools: Database, Data Analytics, Web Scraping, Machine Learning, Reporting. Data Science as a profession: Skill set and Job Trends.",
      subjectId: mds2601.id,
    },
  });

  await prisma.syllabusTopic.createMany({
    data: [
      {
        topic: "Statistics and Mathematical Functions",
        unitId: unit2.id,
      },
      {
        topic: "Database",
        unitId: unit2.id,
      },
      {
        topic: "Data Analytics",
        unitId: unit2.id,
      },
      {
        topic: "Web Scraping",
        unitId: unit2.id,
      },
      {
        topic: "Machine Learning",
        unitId: unit2.id,
      },
      {
        topic: "Reporting",
        unitId: unit2.id,
      },
      {
        topic: "Data Science as a profession",
        unitId: unit2.id,
      },
      {
        topic: "Skill set and Job Trends",
        unitId: unit2.id,
      },
    ],
  });

  const unit3 = await prisma.syllabusUnit.create({
    data: {
      unitNumber: 3,
      title: "Feature selection and Forecasting",
      description:
        "Introduction, Feature Selection: Classifying feature selection methods; Anomaly Detection: Introduction, Distance and Density based outlier detection, Local Outlier Factor, Time series Forecasting, Decomposition, Smoothing based methods, Regression based methods, Machine Learning methods.",
      subjectId: mds2601.id,
    },
  });

  await prisma.syllabusTopic.createMany({
    data: [
      {
        topic: "Introduction to Feature selection and Forecasting",
        unitId: unit3.id,
      },
      {
        topic: "Feature Selection",
        unitId: unit3.id,
      },
      {
        topic: "Classifying feature selection methods",
        unitId: unit3.id,
      },
      {
        topic: "Anomaly Detection",
        unitId: unit3.id,
      },
      {
        topic: "Distance and Density based outlier detection",
        unitId: unit3.id,
      },
      {
        topic: "Local Outlier Factor",
        unitId: unit3.id,
      },
      {
        topic: "Time series Forecasting",
        unitId: unit3.id,
      },
      {
        topic: "Decomposition",
        unitId: unit3.id,
      },
      {
        topic: "Smoothing based methods",
        unitId: unit3.id,
      },
      {
        topic: "Regression based methods",
        unitId: unit3.id,
      },
      {
        topic: "Machine Learning methods",
        unitId: unit3.id,
      },
    ],
  });

  const unit4 = await prisma.syllabusUnit.create({
    data: {
      unitNumber: 4,
      title: "Data science tools and applications",
      description:
        "Introduction to Data Science Tools: SAS, APACHE FLINK, BigML, Excel, Tableau, Matplotlib, TensorFlow, Weka. Applications: Solving Data Problems: Collecting and Analyzing Social media Data.",
      subjectId: mds2601.id,
    },
  });

  await prisma.syllabusTopic.createMany({
    data: [
      {
        topic: "Introduction to Data Science Tools",
        unitId: unit4.id,
      },
      {
        topic: "SAS",
        unitId: unit4.id,
      },
      {
        topic: "APACHE FLINK",
        unitId: unit4.id,
      },
      {
        topic: "BigML",
        unitId: unit4.id,
      },
      {
        topic: "Excel",
        unitId: unit4.id,
      },
      {
        topic: "Tableau",
        unitId: unit4.id,
      },
      {
        topic: "Matplotlib",
        unitId: unit4.id,
      },
      {
        topic: "TensorFlow",
        unitId: unit4.id,
      },
      {
        topic: "Weka",
        unitId: unit4.id,
      },
      {
        topic: "Solving Data Problems",
        unitId: unit4.id,
      },
      {
        topic: "Collecting and Analyzing Social media Data",
        unitId: unit4.id,
      },
    ],
  });

  // ============================================================
  // MDS-2601 EXAM DETAILS
  // ============================================================

  await prisma.exam.create({
    data: {
      title: "University Examination",
      examType: "Theory",
      duration: "3 Hrs",
      totalMarks: 80,
      instructions: `(i) Question paper four units.
(ii) total nine questions, two per unit + one compulsory short answer covering whole syllabus and equal distribution from all units.
(iii) attempt one from each unit + compulsory.
(iv) all questions equal marks.`,
      subjectId: mds2601.id,
    },
  });

  // ============================================================
  // MDS-2601 RECOMMENDED BOOKS
  // ============================================================

  const books = [
    {
      title:
        "Data Science from Scratch – First Principles with Python",
      author: "Joel Grus",
      publisher: "O’Reilly Media, SPD",
      edition: "2017",
    },
    {
      title:
        "Data Science for Business – What you need to know about Data Mining and Data-Analytic Thinking",
      author: "Foster Provost and Tom Fawcett",
      publisher: "O’Reilly Media, SPD",
      edition: "2019",
    },
    {
      title:
        "Machine Learning - The Art and Science of Algorithms that Make Sense of Data",
      author: "Peter Flach",
      publisher: "Cambridge University Press",
      edition: "2015",
    },
    {
      title:
        "Introducing Data Science – Big Data, Machine Learning and More, Using Python Tools",
      author: "Davie Cielen, Arno D.B. Meysman, and Mohamed Ali",
      publisher: "Dreamtech Press",
      edition: "2016",
    },
    {
      title: "Fundamentals of Data Science",
      author: "Sanjeev J. Wagh, Manisha S. Bhende, Anuradha D. Thakare",
      edition: "1st Edition, 2022",
    },
    {
      title: "Principles of Data Science",
      author: "Daimi, Kevin, Ed. Hamid R. Arabnia",
      publisher: "Springer",
      edition: "2020",
    },
    {
      title: "Data Science: Concepts and Practices",
      author: "Vijay Kotu, Bala Deshpande",
      publisher: "Morgan Kaufmann Publishers",
      edition: "Second edition, 2019",
    },
    {
      title: "Ethics and Data Science",
      author: "D J Patil, Hilary Mason, Mike Loukides",
      publisher: "O’Reilly",
      edition: "1st edition, 2018",
    },
    {
      title: "Principles of Data Science",
      author: "Sinan Ozdemir",
      publisher: "Packt Publishing",
      edition: "2016",
    },
  ];

  for (const book of books) {
    await prisma.book.create({
      data: {
        ...book,
        subjectId: mds2601.id,
      },
    });
  }

  // ============================================================
  // SOURCE DOCUMENT FOR MDS-2601
  // ============================================================

  await prisma.sourceDocument.create({
    data: {
      name: SOURCE_NAME,
      fileType: "PDF",
      description:
        "Source for MDS-2601 Principles of Data Science syllabus, objectives, outcomes, examination information and suggested readings.",
      subjectId: mds2601.id,
    },
  });

  // ============================================================
  // MAJOR PROJECT INFORMATION
  // ============================================================

  await prisma.project.create({
    data: {
      title: "Major Project",
      type: "Major Project",
      description:
        "Major Project requirements are defined in the official syllabus document.",
      requirements:
        "The Major Project report requirements are provided in the official Panjab University syllabus document.",
      subjectId: mds2616.id,
    },
  });

  // ============================================================
  // FINAL SOURCE CONNECTIONS
  // ============================================================

  console.log("");
  console.log("==============================================");
  console.log("🎓 CAMPUSCONNECT SEED COMPLETED");
  console.log("==============================================");
  console.log("");
  console.log("University : Panjab University");
  console.log("Programme  : M.Sc. (Hons.) in Computer Science");
  console.log("Specialization : Data Science");
  console.log("Semesters  : 4");
  console.log("Subjects   : 17");
  console.log("");
  console.log("Test Login:");
  console.log("Email    : teststudent@campusconnect.com");
  console.log("Password : Test12345");
  console.log("");
  console.log("Detailed syllabus loaded:");
  console.log("MDS-2601 - Principles of Data Science");
  console.log("");
  console.log("==============================================");
}

main()
  .catch((error) => {
    console.error("");
    console.error("❌ SEED FAILED");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });