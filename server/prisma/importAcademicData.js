require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const SOURCE_FILE =
  "20260721150825-m.sc.hons.two-yearprogrammecomputerscience(4).pdf";

const EXAM_INSTRUCTIONS = `(i) The Question paper will consist of four units.
(ii) Examiner will set total of nine questions comprising two questions from each unit and one compulsory question of short answer type covering whole syllabi and having equal distribution of marks from all the units.
(iii) The students are required to attempt one question from each unit and the compulsory question.
(iv) All questions carry equal marks.`;

async function addUnits(subjectId, units) {
  await prisma.syllabusUnit.deleteMany({
    where: {
      subjectId,
    },
  });

  for (const unit of units) {
    const createdUnit = await prisma.syllabusUnit.create({
      data: {
        unitNumber: unit.number,
        title: unit.title,
        description: unit.description,
        subjectId,
      },
    });

    if (unit.topics && unit.topics.length > 0) {
      await prisma.syllabusTopic.createMany({
        data: unit.topics.map((topic) => ({
          topic,
          unitId: createdUnit.id,
        })),
      });
    }
  }
}

async function addBooks(subjectId, books) {
  await prisma.book.deleteMany({
    where: {
      subjectId,
    },
  });

  for (const book of books) {
    await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        edition: book.edition,
        publisher: book.publisher,
        subjectId,
      },
    });
  }
}

async function addExam(subjectId, data) {
  await prisma.exam.deleteMany({
    where: {
      subjectId,
    },
  });

  await prisma.exam.create({
    data: {
      title: data.title,
      examType: data.examType,
      duration: data.duration,
      totalMarks: data.totalMarks,
      instructions: data.instructions,
      subjectId,
    },
  });
}

async function addSource(subjectId, description) {
  const existing = await prisma.sourceDocument.findFirst({
    where: {
      subjectId,
      name: SOURCE_FILE,
    },
  });

  if (existing) {
    await prisma.sourceDocument.update({
      where: {
        id: existing.id,
      },
      data: {
        fileType: "PDF",
        description,
      },
    });
  } else {
    await prisma.sourceDocument.create({
      data: {
        name: SOURCE_FILE,
        fileType: "PDF",
        description,
        subjectId,
      },
    });
  }
}

async function main() {
  console.log("📚 CampusConnect official PDF importer");
  console.log("📄 Source:", SOURCE_FILE);
  console.log("");

  // ============================================================
  // MDS-2602
  // PROGRAMMING IN PYTHON
  // ============================================================

  const mds2602 = await prisma.subject.findFirst({
    where: {
      code: "MDS-2602",
    },
  });

  if (!mds2602) {
    throw new Error("MDS-2602 not found. Run the initial seed first.");
  }

  await prisma.subject.update({
    where: {
      id: mds2602.id,
    },
    data: {
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,

      objectives: `The main objectives of this course are to:
• To provide an overview of Python Programming
• To identify and explain basic Python syntax, including variables, data types, and operators.
• To teach the fundamental techniques and principles in decision making and iteration using Python.
• To develop algorithmic thinking skills to solve problems using Python.
• Apply Python programming concepts to devise solutions for real-world problems.`,

      outcomes: `After successful completion of the course, student will be able to:
● Demonstrate Python Programming syntax, including variables, data types, and operators, enabling them to write clear and concise Python code.
● Develop strong problem-solving skills by applying control flow structures and functions to design solutions for a variety of computational problems.
● Use fundamental data structures in Python, such as lists, tuples, dictionaries, and sets, and will be able to manipulate and analyze data effectively.
● Acquire a solid foundation in object-oriented programming (OOP), understanding how to create and use classes, objects, inheritance, and polymorphism in Python for building modular and scalable programs.`,
    },
  });

  await addUnits(mds2602.id, [
    {
      number: 1,
      title: "Introduction to Object Oriented Programming (OOPs) and Python",
      description:
        "Introduction to Object Oriented Programming (OOPs), OOPs Concepts-Class, Object, Encapsulation, Abstraction, Polymorphism, Message Passing, Static and Dynamic Binding. Introduction to Python, History of Python, Python Interpreter, Installation of Python in Windows and Linux, Python IDE, Introduction to Anaconda, Basic Program Execution in Python, Python Shell.",
      topics: [
        "Introduction to Object Oriented Programming (OOPs)",
        "Class",
        "Object",
        "Encapsulation",
        "Abstraction",
        "Polymorphism",
        "Message Passing",
        "Static and Dynamic Binding",
        "Introduction to Python",
        "History of Python",
        "Python Interpreter",
        "Installation of Python in Windows and Linux",
        "Python IDE",
        "Introduction to Anaconda",
        "Basic Program Execution in Python",
        "Python Shell",
      ],
    },
    {
      number: 2,
      title: "Python Programming Basics",
      description:
        "Python Programming Basics- Variable Declaration, Keywords, Indents and basic Input-output operations in Python. Operators in Python : Arithmetic Operators, Assignment Operators, Comparison Operators, Logical Operators, Bitwise Operators, Identity Operators, Membership Operators, Ternary Operator, Operator precedence. Data Types in Python : Built-in, String, List, Tuple, Set, Dictionary, Basic list operators, list slicing, replacing, inserting, removing an element, Searching, Sorting; Dictionary literals: adding & removing keys, accessing & replacing values, traversing dictionaries; String Manipulations: Subscript operator, indexing, slicing a string, other functions on strings, string module. Strings and number system: Format functions, converting strings to numbers and vice versa.",
      topics: [
        "Variable Declaration",
        "Keywords",
        "Indents",
        "Basic Input-output operations in Python",
        "Arithmetic Operators",
        "Assignment Operators",
        "Comparison Operators",
        "Logical Operators",
        "Bitwise Operators",
        "Identity Operators",
        "Membership Operators",
        "Ternary Operator",
        "Operator precedence",
        "Built-in Data Types",
        "String",
        "List",
        "Tuple",
        "Set",
        "Dictionary",
        "Basic list operators",
        "List slicing",
        "Replacing",
        "Inserting",
        "Removing an element",
        "Searching",
        "Sorting",
        "Dictionary literals",
        "Adding & removing keys",
        "Accessing & replacing values",
        "Traversing dictionaries",
        "String Manipulations",
        "Subscript operator",
        "Indexing",
        "Slicing a string",
        "Other functions on strings",
        "String module",
        "Format functions",
        "Converting strings to numbers and vice versa",
      ],
    },
    {
      number: 3,
      title: "Conditional Statements and Loop",
      description:
        "Conditional Statements in Python: If, If-else, If-elif-else, Nested-if and for, while, Nested loops, Break, Continue, Pass statements. Introduction to functions in Python, Function definition and calling, Function parameters, Default argument function, Variable argument function, built-in functions in Python, Scope of variable. Recursive functions, Global statements, Importing modules, Math modules and Random modules.",
      topics: [
        "If",
        "If-else",
        "If-elif-else",
        "Nested-if",
        "for",
        "while",
        "Nested loops",
        "Break",
        "Continue",
        "Pass statements",
        "Introduction to functions in Python",
        "Function definition and calling",
        "Function parameters",
        "Default argument function",
        "Variable argument function",
        "Built-in functions in Python",
        "Scope of variable",
        "Recursive functions",
        "Global statements",
        "Importing modules",
        "Math modules",
        "Random modules",
      ],
    },
    {
      number: 4,
      title: "File Handling in Python",
      description:
        "File Handling in Python: Introduction to Data, Records, Fields, Files, Attributes of a File, File opening modes, closing of a file, Reading from a file, Writing onto a file, some important File handling functions open(), close(), read(), readline(). Arrays in Python, Concept of modularization, Importance of modules in Python, Importing modules, using built-in modules like Numpy.",
      topics: [
        "Introduction to Data",
        "Records",
        "Fields",
        "Files",
        "Attributes of a File",
        "File opening modes",
        "Closing of a file",
        "Reading from a file",
        "Writing onto a file",
        "open()",
        "close()",
        "read()",
        "readline()",
        "Arrays in Python",
        "Concept of modularization",
        "Importance of modules in Python",
        "Importing modules",
        "Built-in modules like Numpy",
      ],
    },
  ]);

  await addExam(mds2602.id, {
    title: "University Examination",
    examType: "Theory",
    duration: "3 Hrs",
    totalMarks: 80,
    instructions: EXAM_INSTRUCTIONS,
  });

  await addBooks(mds2602.id, [
    {
      title: "Core Python Applications Programming",
      author: "Wesley J. Chun",
      edition: "3rd Edition, 2016",
      publisher: "Pearson Education",
    },
    {
      title: "Introduction to Computer Science using Python",
      author: "Charles Dierbach",
      edition: "2015",
      publisher: "Wiley",
    },
    {
      title:
        "How to think like a Computer Scientist: Learning with Python",
      author: "Downey, A.",
      edition: "2015",
      publisher: "John Wiley",
    },
    {
      title: "Learning Python",
      author: "Mark Lutz",
      edition: "5th edition, 2013",
      publisher: "Oreilly Publication",
    },
    {
      title:
        "Python Programming An Introduction to Computer Science",
      author: "John Zelle",
      edition:
        "Second edition, 2013",
      publisher:
        "Course Technology Cengage Learning Publications",
    },
    {
      title: "Python Programming for Absolute Beginners",
      author: "Michel Dawson",
      edition: "Third Edition, 2013",
      publisher:
        "Course Technology Cengage Learning",
    },
    {
      title: "Python Cookbook",
      author: "David Beazley, Brian Jones",
      edition: "Third Edition, 2013",
      publisher: "O’Reilly Publication",
    },
  ]);

  await addSource(
    mds2602.id,
    "Official Panjab University syllabus source for MDS-2602 Programming in Python."
  );

  console.log("✅ MDS-2602 imported.");

  // ============================================================
  // MDS-2603
  // ADVANCE DATABASE SYSTEMS
  // ============================================================

  const mds2603 = await prisma.subject.findFirst({
    where: {
      code: "MDS-2603",
    },
  });

  if (!mds2603) {
    throw new Error("MDS-2603 not found.");
  }

  await prisma.subject.update({
    where: {
      id: mds2603.id,
    },
    data: {
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,

      objectives: `• Develop a deep understanding of advanced database systems, covering topics such as distributed databases, data warehousing, and No SQL databases.
• Acquire hands-on experience in designing and implementing complex database systems, including optimization techniques and performance tuning.
• Stay abreast of the latest trends in database technology, exploring topics like blockchain databases, graph databases, and in-memory databases.
• Gain expertise in advanced database security measures and privacy considerations, ensuring the ability to design and implement secure and compliant data systems.`,

      outcomes: `After completing this course the students will be able to:
• Demonstrate proficiency in advanced database design, optimization, and implementation, showcasing their ability to architect robust and scalable data systems.
• Apply their knowledge to implement and manage databases using emerging technologies, such as NoSQL, distributed databases, and in-memory databases.
• Exhibit leadership in data security and compliance, implementing advanced measures to safeguard sensitive information in accordance with industry standards and regulations.
• Possess strategic data management skills, ensuring their ability to handle large-scale datasets efficiently.`,
    },
  });

  await addUnits(mds2603.id, [
    {
      number: 1,
      title: "Database Systems",
      description:
        "DBMS: Components, Views of data-schemas and instances, Data independence, 3-tier Architecture, Data models classification: File based System, Traditional data models - Hierarchical, Network, Relational Models. Entity- relationship model, Representation of relationship set, Generalization, Aggregation, Normalization: 1NF, 2NF, 3NF, BCNF, 4NF and 5NF.",
      topics: [
        "DBMS: Components",
        "Views of data-schemas and instances",
        "Data independence",
        "3-tier Architecture",
        "File based System",
        "Hierarchical Models",
        "Network Models",
        "Relational Models",
        "Entity-relationship model",
        "Representation of relationship set",
        "Generalization",
        "Aggregation",
        "1NF",
        "2NF",
        "3NF",
        "BCNF",
        "4NF",
        "5NF",
      ],
    },
    {
      number: 2,
      title: "Relational Database Systems",
      description:
        "Relational Database: Attributes, Domains, Tuples, Relations and their schemes. Relational Algebra: Operations- union, intersection, difference, Cartesian product, projection, selection, division and relational algebra queries; Relational Calculus: Tuple oriented and domain oriented relational calculus and its operations. Introduction to PL/SQL: block structure, Architecture, SQL within PL/SQL, Writing PL/SQL code, Cursors.",
      topics: [
        "Attributes",
        "Domains",
        "Tuples",
        "Relations and their schemes",
        "Relational Algebra",
        "Union",
        "Intersection",
        "Difference",
        "Cartesian product",
        "Projection",
        "Selection",
        "Division",
        "Relational algebra queries",
        "Tuple oriented relational calculus",
        "Domain oriented relational calculus",
        "PL/SQL block structure",
        "PL/SQL Architecture",
        "SQL within PL/SQL",
        "Writing PL/SQL code",
        "Cursors",
      ],
    },
    {
      number: 3,
      title: "Transaction Management and Concurrency control",
      description:
        "Concept of Transaction, ACID properties, Serializibility, States of transaction, Concurrency control: Locking techniques, Time stamp based protocols, Granularity of data items, Deadlock: Prevention and Detection techniques. Query Optimization: Query execution plans, Techniques for improving query performance.",
      topics: [
        "Concept of Transaction",
        "ACID properties",
        "Serializibility",
        "States of transaction",
        "Concurrency control",
        "Locking techniques",
        "Time stamp based protocols",
        "Granularity of data items",
        "Deadlock",
        "Prevention and Detection techniques",
        "Query execution plans",
        "Techniques for improving query performance",
      ],
    },
    {
      number: 4,
      title: "Temporal and Spatial Databases",
      description:
        "Introduction to Temporal Database, Temporal data models. Introduction to Spatial Database: Definition, Types of spatial data, Geographical Information Systems (GIS). NoSQL Databases: Overview of NoSQL databases (document-oriented, key-value, column-family, graph), Use cases and suitability of NoSQL databases, Implementation and comparison of popular NoSQL databases (MongoDB, Cassandra, Redis).",
      topics: [
        "Introduction to Temporal Database",
        "Temporal data models",
        "Introduction to Spatial Database",
        "Definition",
        "Types of spatial data",
        "Geographical Information Systems (GIS)",
        "NoSQL databases",
        "Document-oriented databases",
        "Key-value databases",
        "Column-family databases",
        "Graph databases",
        "Use cases and suitability of NoSQL databases",
        "MongoDB",
        "Cassandra",
        "Redis",
      ],
    },
  ]);

  await addExam(mds2603.id, {
    title: "University Examination",
    examType: "Theory",
    duration: "3 Hrs",
    totalMarks: 80,
    instructions: EXAM_INSTRUCTIONS,
  });

  await addBooks(mds2603.id, [
    {
      title: "Introduction to Database Systems",
      author: "C.J.Date",
    },
    {
      title: "Fundamentals of Database Systems",
      author: "Elmasri Navathe",
    },
    {
      title:
        "PL/SQL The Programming Language of ORACLE",
      author: "Ivan Bayross",
      publisher: "BPB Publication",
    },
    {
      title: "Mastering Oracle 6.0",
      author: "Vijay Mukhi",
      publisher: "BPB Publications",
    },
    {
      title: "Database System Concepts",
      author:
        "Abraham Silberschatz, Henry F. Korth, and S. Sudarshan",
    },
    {
      title:
        "Temporal Database Management: A Survey",
      author:
        "Christian S. Jensen and Richard T. Snodgrass",
    },
    {
      title: "Spatial Databases: A Tour",
      author:
        "Shashi Shekhar and Sanjay Chawla",
    },
  ]);

  await addSource(
    mds2603.id,
    "Official Panjab University syllabus source for MDS-2603 Advance Database Systems."
  );

  console.log("✅ MDS-2603 imported.");

  // ============================================================
  // MDS-2604
  // OPERATING SYSTEM CONCEPTS
  // ============================================================

  const mds2604 = await prisma.subject.findFirst({
    where: {
      code: "MDS-2604",
    },
  });

  if (!mds2604) {
    throw new Error("MDS-2604 not found.");
  }

  await prisma.subject.update({
    where: {
      id: mds2604.id,
    },
    data: {
      theoryPracticalLectures: "4",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,

      objectives:
        "To understand the various concepts of Operating System like process management, synchronization, deadlocks, storage and memory management.",

      outcomes: `After successful completion of course the students will be able to:
• Describe the important computer system resources and the role of operating system in their management policies and algorithms.
• Understand the process management policies and scheduling of processes by CPU
• Evaluate the requirement for process synchronization and coordination, memory management handled by operating system also cater-policies with respect to different storage.`,
    },
  });

  await addUnits(mds2604.id, [
    {
      number: 1,
      title: "Introduction to Operating System",
      description:
        "Introduction to Operating System, Its need and services; Different types of operating systems: batch, multi-programmed, time sharing, real time, distributed, parallel. Process Management and Synchronization: Process: Process state, Process control block, Inter process communication: Shared memory systems, Message passing systems; CPU Scheduling-scheduling criteria, Preemptive & non-pre-emptive scheduling, Scheduling Algorithms: FCFS, SJF, RR and Priority.",
      topics: [
        "Introduction to Operating System",
        "Its need and services",
        "Batch operating systems",
        "Multi-programmed operating systems",
        "Time sharing operating systems",
        "Real time operating systems",
        "Distributed operating systems",
        "Parallel operating systems",
        "Process state",
        "Process control block",
        "Inter process communication",
        "Shared memory systems",
        "Message passing systems",
        "CPU Scheduling",
        "Scheduling criteria",
        "Preemptive scheduling",
        "Non-pre-emptive scheduling",
        "FCFS",
        "SJF",
        "RR",
        "Priority",
      ],
    },
    {
      number: 2,
      title: "Synchronization and Deadlocks",
      description:
        "Synchronization: Critical section problem, Peterson’s solution, Synchronization hardware, Semaphores: Mutual exclusion, Producer-consumers, Reader-writers problem; Dining philosophers Problem; Deadlocks: System model, Deadlock characterization: Necessary conditions, Resource allocation graph, Method for handling deadlock; Deadlock prevention: Mutual exclusion, Hold and wait, No preemption, Circular wait, Deadlock avoidance: Safe state, Resource allocation graph algorithm, Banker’s algorithm; Deadlock detection, Recovery from deadlock.",
      topics: [
        "Critical section problem",
        "Peterson’s solution",
        "Synchronization hardware",
        "Semaphores",
        "Mutual exclusion",
        "Producer-consumers",
        "Reader-writers problem",
        "Dining philosophers Problem",
        "System model",
        "Deadlock characterization",
        "Necessary conditions",
        "Resource allocation graph",
        "Method for handling deadlock",
        "Deadlock prevention",
        "Hold and wait",
        "No preemption",
        "Circular wait",
        "Deadlock avoidance",
        "Safe state",
        "Resource allocation graph algorithm",
        "Banker’s algorithm",
        "Deadlock detection",
        "Recovery from deadlock",
      ],
    },
    {
      number: 3,
      title: "Memory Management",
      description:
        "Memory Management-I: Static and dynamic memory allocation, Memory allocation to process: Stacks, Heap, Memory allocation model; Reuse of memory: Performing fresh allocations using a free list, Memory fragmentation, Merging free areas; Contiguous memory allocation: Fragmentation, Swapping; Memory Management-II: Paging: Hardware support, Protection, shared pages, Techniques for structuring of page table, Memory mapped files; Segmentation, Demand paging, Page replacement Algorithms: FIFO, Optimal, LRU, Counting based page replacement; Thrashing.",
      topics: [
        "Static and dynamic memory allocation",
        "Memory allocation to process",
        "Stacks",
        "Heap",
        "Memory allocation model",
        "Performing fresh allocations using a free list",
        "Memory fragmentation",
        "Merging free areas",
        "Contiguous memory allocation",
        "Fragmentation",
        "Swapping",
        "Paging",
        "Hardware support",
        "Protection",
        "Shared pages",
        "Techniques for structuring of page table",
        "Memory mapped files",
        "Segmentation",
        "Demand paging",
        "FIFO",
        "Optimal",
        "LRU",
        "Counting based page replacement",
        "Thrashing",
      ],
    },
    {
      number: 4,
      title: "Storage Management",
      description:
        "Storage Management I: File Concept: Attributes, Operations, Types, Structure; Access methods: Sequential and direct access, Index ; Directory structure: Single level, Two Level, Tree Structured, acyclic Graph directories; File System mounting, File sharing, Protection: Types of access, access Control. Storage Management II: File system structure, File system implementation, Directory implementation, Allocation methods, Free space management, Disk scheduling: FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK; Disk management, Swap space management, RAID.",
      topics: [
        "File Concept",
        "Attributes",
        "Operations",
        "Types",
        "Structure",
        "Sequential and direct access",
        "Index",
        "Single level directory",
        "Two Level directory",
        "Tree Structured directories",
        "Acyclic Graph directories",
        "File System mounting",
        "File sharing",
        "Protection",
        "Types of access",
        "Access Control",
        "File system structure",
        "File system implementation",
        "Directory implementation",
        "Allocation methods",
        "Free space management",
        "Disk scheduling",
        "FCFS",
        "SSTF",
        "SCAN",
        "C-SCAN",
        "LOOK",
        "C-LOOK",
        "Disk management",
        "Swap space management",
        "RAID",
      ],
    },
  ]);

  await addExam(mds2604.id, {
    title: "University Examination",
    examType: "Theory",
    duration: "3 Hrs",
    totalMarks: 80,
    instructions: EXAM_INSTRUCTIONS,
  });

  await addBooks(mds2604.id, [
    {
      title: "Operating System Concepts",
      author: "Peterson, James, L. and Silberschatz, A.",
      publisher: "Wiley Publ. Comp",
      edition: "1985",
    },
    {
      title: "Operating Systems-A concept based approach",
      author: "Dhamdhere,D M",
      publisher: "Mc Graw Hill",
    },
    {
      title: "An Introduction to Operating System",
      author: "Deitel, H.M.",
      publisher: "Addison-Wesley Publ.Comp",
      edition: "1984",
    },
    {
      title: "Operating System – Concepts and Design",
      author: "Milenkovic, M.",
      publisher: "McGraw Hill, International Editions",
      edition: "1987",
    },
    {
      title: "Operating System",
      author: "Richie",
      publisher: "BPB",
    },
    {
      title: "Operating System Principles",
      author: "Hansen Per Brineh",
      publisher: "Prentice Hall India",
      edition: "1978",
    },
    {
      title: "Operating System",
      author: "Madnick and Donovan",
      publisher: "McGraw Hill Book Co.",
    },
    {
      title: "Operating Systems",
      author: "Joshi, R.C.",
      publisher: "Wiley India Pvt. Ltd.",
    },
  ]);

  await addSource(
    mds2604.id,
    "Official Panjab University syllabus source for MDS-2604 Operating System Concepts."
  );

  console.log("✅ MDS-2604 imported.");

  // ============================================================
  // MDS-2605
  // MINOR PROJECT BASED ON MDS-2602
  // ============================================================

  const mds2605 = await prisma.subject.findFirst({
    where: {
      code: "MDS-2605",
    },
  });

  if (!mds2605) {
    throw new Error("MDS-2605 not found.");
  }

  await prisma.subject.update({
    where: {
      id: mds2605.id,
    },
    data: {
      theoryPracticalLectures: "8",
      universityExamMarks: 80,
      internalAssessmentMarks: 20,
      totalMarks: 100,
      credits: 4,
    },
  });

  await prisma.exam.deleteMany({
    where: {
      subjectId: mds2605.id,
    },
  });

  await prisma.exam.create({
    data: {
      title: "Practical Examination",
      examType: "Practical",
      duration: "3 Hrs",
      totalMarks: 100,
      instructions: `The Internal Assessment Marks for each practical will be based on Minor Project.
Paper will be set at the time of examination. Due weight-age may be given to the practical notebook and assignments for evaluation.`,
      subjectId: mds2605.id,
    },
  });

  await prisma.project.deleteMany({
    where: {
      subjectId: mds2605.id,
    },
  });

  await prisma.project.create({
    data: {
      title: "Minor Project Based on MDS-2602",
      type: "Minor Project",
      description:
        "Minor Project Based on MDS-2602 (Programming in Python).",
      requirements:
        "The Internal Assessment Marks for each practical will be based on Minor Project. Due weight-age may be given to the practical notebook and assignments for evaluation.",
      subjectId: mds2605.id,
    },
  });

  await addSource(
    mds2605.id,
    "Official Panjab University practical examination source for MDS-2605 Minor Project Based on MDS-2602."
  );

  console.log("✅ MDS-2605 imported.");

  console.log("");
  console.log("==============================================");
  console.log("🎓 SEMESTER 1 OFFICIAL DATA IMPORTED");
  console.log("==============================================");
  console.log("MDS-2601  ✅ Already loaded");
  console.log("MDS-2602  ✅ Programming in Python");
  console.log("MDS-2603  ✅ Advance Database Systems");
  console.log("MDS-2604  ✅ Operating System Concepts");
  console.log("MDS-2605  ✅ Minor Project based on MDS-2602");
  console.log("==============================================");
}

main()
  .catch((error) => {
    console.error("");
    console.error("❌ IMPORT FAILED");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });