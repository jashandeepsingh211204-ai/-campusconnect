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

const NOT_AVAILABLE =
  "Not available in the provided document.";

const EXAM_INSTRUCTIONS = `(i) The Question paper will consist of four units.
(ii) Examiner will set total of nine questions comprising two questions from each unit and one compulsory question of short answer type covering whole syllabi and having equal distribution of marks from all the units.
(iii) The students are required to attempt one question from each unit and the compulsory question.
(iv) All questions carry equal marks.`;

/* ============================================================
   HELPERS
============================================================ */

async function getSubject(code) {
  const subject = await prisma.subject.findFirst({
    where: {
      code,
    },
  });

  return subject;
}

async function getSemester(number) {
  const semester = await prisma.semester.findFirst({
    where: {
      number,
    },
    orderBy: {
      id: "asc",
    },
  });

  return semester;
}

async function updateSubject(item) {
  let subject = await getSubject(item.code);

  if (!subject) {
    const semester = await getSemester(item.semester);

    if (!semester) {
      throw new Error(
        `Semester ${item.semester} not found for ${item.code}.`
      );
    }

    subject = await prisma.subject.create({
      data: {
        code: item.code,
        name: item.name,
        category: item.category,
        semesterId: semester.id,
        theoryPracticalLectures: item.lectures,
        universityExamMarks: item.exam,
        internalAssessmentMarks: item.internal,
        totalMarks: item.total,
        credits: item.credits,
        objectives: item.objectives || null,
        outcomes: item.outcomes || null,
      },
    });

    console.log(`   ➕ Created ${item.code}`);
  } else {
    subject = await prisma.subject.update({
      where: {
        id: subject.id,
      },
      data: {
        name: item.name,
        category: item.category,
        theoryPracticalLectures: item.lectures,
        universityExamMarks: item.exam,
        internalAssessmentMarks: item.internal,
        totalMarks: item.total,
        credits: item.credits,
        objectives: item.objectives || null,
        outcomes: item.outcomes || null,
      },
    });

    console.log(`   🔄 Updated ${item.code}`);
  }

  return subject;
}

async function addUnits(subjectId, units) {
  await prisma.syllabusUnit.deleteMany({
    where: {
      subjectId,
    },
  });

  for (let index = 0; index < units.length; index++) {
    const unit = units[index];

    const createdUnit = await prisma.syllabusUnit.create({
      data: {
        unitNumber: index + 1,
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
        author: book.author || null,
        edition: book.edition || null,
        publisher: book.publisher || null,
        isbn: book.isbn || null,
        url: book.url || null,
        subjectId,
      },
    });
  }
}

async function addTheoryExam(subjectId) {
  await prisma.exam.deleteMany({
    where: {
      subjectId,
    },
  });

  await prisma.exam.create({
    data: {
      title: "University Examination",
      examType: "Theory",
      duration: "3 Hrs",
      totalMarks: 80,
      instructions: EXAM_INSTRUCTIONS,
      subjectId,
    },
  });
}

async function addPracticalExam(
  subjectId,
  title,
  instructions
) {
  await prisma.exam.deleteMany({
    where: {
      subjectId,
    },
  });

  await prisma.exam.create({
    data: {
      title,
      examType: "Practical",
      duration: "3 Hrs",
      totalMarks: 100,
      instructions,
      subjectId,
    },
  });
}

async function addProject(
  subjectId,
  title,
  type,
  description,
  requirements
) {
  await prisma.project.deleteMany({
    where: {
      subjectId,
    },
  });

  await prisma.project.create({
    data: {
      title,
      type,
      description,
      requirements,
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

/* ============================================================
   SEMESTER 2
============================================================ */

/* ------------------------------------------------------------
   MDS-2606
------------------------------------------------------------ */

const MDS2606 = {
  semester: 2,
  code: "MDS-2606",
  name: "Advance Data Structures",
  category: "DSC",
  lectures: "4",
  exam: 80,
  internal: 20,
  total: 100,
  credits: 4,

  objectives:
    "To provide a strong foundation in advanced data structures and algorithmic techniques essential for solving complex computational and data science problems",

  outcomes: `Upon successful completion of this course, students will be able to:
• Analyze and evaluate the performance of advanced data structures and algorithms using mathematical, asymptotic, and recurrence-based techniques.
• Design and implement balanced trees, multi-way trees and graph algorithms to solve complex computational problems efficiently.
• Apply greedy, dynamic programming techniques to develop optimized solutions for real-world data science and engineering applications.
• Classify problems based on computational complexity and justify algorithmic choices using concepts of NP-hardness, NP-completeness, and reduction-based reasoning.`,

  units: [
    {
      title: "Introduction to advanced data structures",
      description:
        "Introduction to advance data structures and their role in computing, Basics of algorithm analysis: performance measures, time & space complexity, Asymptotic Notations: Big-O, Big-Ω, Big-Θ; Recurrence solving techniques: Substitution Method and Master’s Method; Abstract Data Types (ADT): concept, design, and implementation; Overview of Linear and non-linear data structures; Introduction to linear DS: stacks, queues, linked lists; Non-linear DS basics: trees, graphs.",
    },
    {
      title: "Balanced Trees and Multi-way Trees",
      description:
        "Binary Search Trees (BST): operations, complexity; Balanced Trees: AVL Trees and Red-Black Trees; Multi-way Trees: B-Trees. Divide & Conquer Algorithms: Divide and Conquer technique: formulation and analysis; Classic algorithms: Merge Sort, Quick Sort.",
    },
    {
      title: "Greedy Strategy and Graph-Based Greedy Methods",
      description:
        "Greedy algorithm paradigm: properties and correctness, fractional Knapsack problem (fractional/greedy version), Job sequencing with deadlines, Minimum Cost Spanning Trees: Kruskal’s Algorithm. Classical Greedy Optimization Problems: Optimal merge pattern, Set cover / subset cover problem.",
    },
    {
      title: "Dynamic Programming & Complexity Theory",
      description:
        "Introduction to dynamic programming, Key DP problems: Matrix Chain Multiplication, 0/1 Knapsack, Longest Common Subsequence (LCS), Overview of Travelling Salesman Problem; Complexity Theory: Introduction to NP, NP-Hard, and NP-Complete classes, Concept of polynomial-time reductions. Graphs: Graph algorithms: DFS, BFS, Topological Sorting, Shortest Paths: Dijkstra, Bellman–Ford, Introduction to Network Flow problems.",
    },
  ],

  books: [
    {
      author: "Horowitz, Ellis and Sahni, Sartaj",
      title:
        "Fundamentals of Computer Algorithms, Universities Press Publications.",
    },
    {
      author: "Aho, A.V., Hopcroft, J.E. and Ullman, J.D.",
      title:
        "The Design and Analysis of Computer Algorithms, Addison-Wesley.",
    },
    {
      author: "Mark Allen Weiss",
      title:
        "Data Structures and Algorithm Analysis in C++, Pearson Education.",
    },
    {
      author: "Brassard, Gilles and Bratley, Paul",
      title:
        "Fundamentals of Algorithms, Prentice Hall of India.",
    },
    {
      author:
        "Goodrich, Michael T., Tamassia, Roberto and Mount, David",
      title:
        "Data Structures and Algorithms in C++, Wiley.",
    },
    {
      author: "Kleinberg, Jon and Tardos, Éva",
      title:
        "Algorithm Design, Pearson/Addison Wesley.",
    },
  ],
};

/* ------------------------------------------------------------
   MDS-2607
------------------------------------------------------------ */

const MDS2607 = {
  semester: 2,
  code: "MDS-2607",
  name: "Statistical Methods for Data Science",
  category: "DSC",
  lectures: "4",
  exam: 80,
  internal: 20,
  total: 100,
  credits: 4,

  objectives:
    "To know the fundamental concepts Statistical Methods used in Data science and to explore its practical implementation in real-life applications.",

  outcomes: `After successful completion of course the students will be able to:
• Conceptual understanding of R language and its understanding for statistical computing and graphics. Implementation of R fundamentals and data frames.
• Knowledge of hypothesis testing and curve fitting.
• Understanding of important industrial use concepts as regression, classification, dimension reduction and clustering.
• Understanding of important statistical based machine learning concepts as support vector machines, decision trees and random forest techniques.`,

  units: [
    {
      title: "R Language",
      description:
        "R Language: Programming with R basic data types, vector arithmetic, matrices, factor levels, ordered factors, data frame, sub setting and sorting data frames, charts and graphs in R, linear models in R as linear regression and multiple regression. Functions in R: writing a function in R, function scoping, recursion, R Package. Handling of csv files and datasets using R.",
    },
    {
      title: "Data Distribution and Hypothesis Testing",
      description:
        "Probability and Continuous distribution, Distribution of sample data, hypothesis testing, T-test, binomial distribution, chi-square distribution, F-distribution, Poisson distribution, confidence intervals, parametric intervals. Curve Fitting: Linear regression with one predictor, least square for polynomial models, local fitting, big data cloud, visualizing multivariate data.",
    },
    {
      title: "Regression and Classification",
      description:
        "Multiple linear regression, polynomial regression, logistic regression, support vector machines, k-nearest neighbor, Naïve bayes theorem, decision tree and random forest.",
    },
    {
      title: "Dimension Reduction and Clustering",
      description:
        "Introduction to unsupervised learning, Principal component analysis, linear discriminant analysis, k-means and hierarchical clustering.",
    },
  ],

  books: [
    {
      author: "Walter A. Rosenkrantz",
      title:
        "Introduction to probability and statistics for scientists and engineers, McGraw-Hill.",
    },
    {
      author:
        "Gareth James, Daniela Witten, Trevor Hastie Robert Tibshirani",
      title:
        "An Introduction to Statistical Learning with Applications in R, Springer.",
    },
    {
      author: "K.G. Srinivas, G M Siddesh",
      title:
        "Statistical Programming in R, Oxford Publications.",
    },
    {
      author: "Stanley H. Chan",
      title:
        "Introduction to Probability for Data Science, Michigan Publishing",
    },
    {
      author: "Hadley Wickham and Garrett Grolemund",
      title: "R: Data Science, O-Reilly Publishers",
    },
    {
      author:
        "Carlos Andre Reis Pinheiro and Mike Patetta",
      title:
        "Introduction to Statistical and Machine Learning Methods for Data Science, SAS Institute Publishers.",
    },
    {
      author: "Christopher M Bishop",
      title:
        "Pattern Recognition and Machine Learning, Springer.",
    },
    {
      author: "S. Sridhar and M. Vijayalakshmi",
      title:
        "Machine Learning, Oxford University Press.",
    },
  ],
};

/* ------------------------------------------------------------
   MDS-2608
------------------------------------------------------------ */

const MDS2608 = {
  semester: 2,
  code: "MDS-2608",
  name: "Data Mining and Artificial Intelligence",
  category: "DSE",
  lectures: "4",
  exam: 80,
  internal: 20,
  total: 100,
  credits: 4,

  objectives: `• Equip students with the theoretical foundations and practical skills in data mining and artificial intelligence
• Fostering proficiency in implementing architectural algorithms
• Exploring emerging trends and promoting ethical application across diverse domains.`,

  outcomes: `After completing the course the student will be able to:
• Have understanding of data warehousing fundamentals and data mining techniques like association, classification, and clustering.
• Have knowledge of Artificial intelligence historical context, heuristic search methods, and knowledge representation encompassing logic and semantic networks.
• Have possess knowledge of specialized AI areas, including expert systems, natural language processing, genetic algorithms, and artificial neural networks covering various learning paradigms.`,

  units: [
    {
      title: "Data Warehousing and Data Mining",
      description:
        "Data Warehousing: Definition, usage and trends, Characteristics of a Data Warehouse, DBMS vs. data warehouse. Data Mining: Steps of Data Mining Process, Data Modeling for data warehouses, OLAP and OLTP, Association rules, Classification, Clustering, Regression. Classification and Clustering: Dependency Modeling, Link Analysis, Sequencing Analysis, Social Network Analysis.",
    },
    {
      title: "Introduction to Artificial Intelligence",
      description:
        "Turing Test, History and Development in AI, applications of AI, State Space representation, Production Systems, characteristics and problem characteristics. Heuristic Search Techniques: Introduction to heuristic search, Hill Climbing, game playing, min-max search procedure, reducing alternatives using Alpha-Beta pruning cutoff method. Knowledge Representation: Knowledge representation methods, Logic: Propositional logic and first order predicate logic, Semantic networks, Frames, Rules, Scripts, Handling uncertainty in knowledge.",
    },
    {
      title: "Expert Systems and Natural Language Processing",
      description:
        "Expert Systems: Characteristics and Architecture. Natural Language Processing: Grammar and Language, Parsing Techniques, Semantic Analysis and Pragmatics, Conceptual Dependency and Ontologies.",
    },
    {
      title: "Fuzzy Sets, Genetic Algorithms and Artificial Neural Networks",
      description:
        "Fuzzy sets: Notion of fuzziness, Membership functions, fuzzification and defuzzification, Operations on fuzzy sets, fuzzy functions and linguistic variables. Genetic Algorithms(GA): Encoding strategies, Genetic operators, Fitness functions and GA cycle, Problem solving using GA. Artificial Neural Networks (ANN): Supervised, unsupervised and reinforcement Learning, Single Perceptron, Multi Layer Perceptron, Self Organizing Maps, Hopfield Network.",
    },
  ],

  books: [
    {
      author:
        "Jiawei Han, Micheline Kamber, Jian Pei, Hanghang Tong",
      title:
        "Data Mining: Concepts and Techniques, Third Edition, Elsevier.",
    },
    {
      author:
        "Rich Elaine and Knight Kevin Shiva Shankar B. Nair",
      title:
        "Artificial Intelligence, Third Edition, Tata MacGraw Hill, 2017.",
    },
    {
      author: "Patterson, Dan W.",
      title:
        "Introduction to Artificial Intelligence and Expert Systems, Pearson Education, 2015.",
    },
    {
      author: "S.N. Sivanandam and S.N. Deepa",
      title:
        "Principles of Soft Computing, Second Edition, John Wiley.",
    },
    {
      author: "Daniel Jurafsky and James H. Martin",
      title:
        "Speech and Language Processing: Second Edition, Pearson.",
    },
  ],
};

/* ------------------------------------------------------------
   MDS-2609
------------------------------------------------------------ */

const MDS2609 = {
  semester: 2,
  code: "MDS-2609",
  name: "Big Data Analytics",
  category: "DSE",
  lectures: "4",
  exam: 80,
  internal: 20,
  total: 100,
  credits: 4,

  objectives: `• To provide an overview of an exciting growing field of big data analytics.
• To introduce the tools required to manage and analyze big data like Hadoop, MapReduce.
• To teach the fundamental techniques and principles in achieving big data analytics with scalability and streaming capability.
• To enable students to have skills that will help them to solve complex real-world problems in for decision support.`,

  outcomes: `After the completion of the course the students will be able to
• Understand the key issues in big data management and its associated applications in intelligent business and scientific computing.
• Acquire fundamental enabling techniques and scalable algorithms like Hadoop, and Map Reduce in big data analytics.
• Interpret business models and scientific computing paradigms, and apply software tools for big data analytics.
• Achieve adequate perspectives of big data analytics in various applications like recommender systems, social media applications etc.`,

  units: [
    {
      title: "Introduction to Big Data",
      description:
        "Definition, need and importance, Characteristics of Big Data and Dimensions of Scalability, Foundations for Big Data Systems and Programming, Application of Big Data Analytics.",
    },
    {
      title: "Hadoop",
      description:
        "History of Hadoop, The Hadoop Distributed File System, Components of Hadoop, Analyzing the Data with Hadoop, Design of HDFS, HDFS concepts, Hadoop I/O, data integrity, compression, and serialization, Setting up Hadoop Eco System.",
    },
    {
      title: "MapReduce",
      description:
        "Introduction, Using Elastic MapReduce, Understanding MapReduce key-value pairs, The Hadoop Java API for MapReduce, Writing MapReduce programs, Hadoop specific data types, Input and output.",
    },
    {
      title: "HIVE and PIG",
      description:
        "HIVE: Introduction of Hive, Hive Features, Hive architecture, Hive Vs. RDBMS, Hive Meta store, Hive data types, Hive Tables, Table types, Creating database, DDL and DML, Built-In Functions and Operators, User defined functions. PIG: Overview of Pig, Pig Architecture, Pig Execution modes, Pig Grunt shell and Shell commands. Pig Execution Modes – Batch Mode, Embedded Mode, Pig Execution in Batch Mode. Embedding Pig in Python – Use cases, Map Reduce programs with Pig, Pig Vs SQL.",
    },
  ],

  books: [
    {
      author: "Chris Eaton, Dirk Deroos et al.",
      title:
        "Understanding Big data, McGraw Hill, 2012.",
    },
    {
      author: "Tom White",
      title:
        "Hadoop: The Definitive Guide, Fourth Edition, O′Reilly Publishers, 2012.",
    },
    {
      author: "Donald Miner, Adam Shook",
      title:
        "MapReduce Design Patterns, O'Reilly Media November 22, 2012.",
    },
    {
      author:
        "Edward Capriolo, DeanWampler, Jason Rutherglen",
      title:
        "Programming Hive, O'Reilly Media; 1 edition, October, 2012.",
    },
    {
      author: "Deepak Vohra",
      title:
        "Practical Hadoop Ecosystem - A Definitive Guide to Hadoop-Related Frameworks and Tools First Edition, Apress Publisher, ISBN: 9781484221983, 2016",
    },
    {
      author: "Alan Gates",
      title:
        "Programming Pig, O'Reilly Media; 1st Edition, October, 2011.",
    },
  ],
};

/* ============================================================
   SEMESTER 3
============================================================ */

/* ------------------------------------------------------------
   MDS-2611
------------------------------------------------------------ */

const MDS2611 = {
  semester: 3,
  code: "MDS-2611",
  name: "Data Visualization",
  category: "DSC",
  lectures: "4",
  exam: 80,
  internal: 20,
  total: 100,
  credits: 4,

  objectives: `• To Know the fundamental principles and types of data visualization.
• To Use data visualization tools in Python Matplotlib library.
• To Create informative visualization and summarize data sets in Tableau.`,

  outcomes: `After the completion of the course the students will
• Have understanding of data visualization techniques to develop charts, maps, plots, and other visual representations of data.
• Be able to implement the data visualization techniques using Python libraries and Tableau.
• Have knowledge of application of different visualization approaches on real-world datasets.`,

  units: [
    {
      title: "Data Visualization",
      description:
        "Definition, Importance, Mapping data onto Aesthetics, Principles, Techniques, Introduction to Basic and Specialized Visualization Tools.",
    },
    {
      title: "Visualization with Matplotlib-I",
      description:
        "Basics of Python Matplotlib, Creating Histograms, Bar Charts, Pie Charts, Box Plots, Heat Map, Scatter Plots etc. with Matplotlib, Customizing Plots-visual style and layout.",
    },
    {
      title: "Visualization with Matplotlib-II",
      description:
        "Plotting Time Series data, Three-Dimensional Plotting and Geographic Data with Base map. Incorporating Animations and Interactivity for Plots, Saving Plots to File, Case studies involving real-world data sets.",
    },
    {
      title: "Visualization with Tableau",
      description:
        "Introduction, Interface and Features, Adding Data Sources in Tableau, Creating Data Visualizations – Aggregate Functions, Calculated Fields, and Parameters, Advanced Analytics: Trends, Forecasts, Clusters, and other Statistical Tools; Case studies involving real-world data sets.",
    },
  ],

  books: [
    {
      author: "Claus O. Wilke",
      title:
        "Fundamentals of Data Visualization: A Primer on Making Informative and Compelling Figures, O′Reilly Publication.",
    },
    {
      author:
        "Matthew O. Ward, Georges Grinstein, Daniel Keim",
      title:
        "Interactive Data Visualization: Foundations, Techniques, and Applications, CRC Press.",
    },
    {
      author: "Kieran Healy",
      title:
        "Data Visualization: A Practical Introduction, Princeton University Press.",
    },
    {
      author: "Dr.Abhinav",
      title:
        "Data Visualization using Python Programming- A Technical Guide for Beginners, Researchers and Data Analyst, Shaswat Publication.",
    },
    {
      author: "Kalilur Rahman",
      title:
        "Python Data Visualization Essentials Guide, BPB Publication.",
    },
    {
      author: "Kavitha Ranganathan",
      title:
        "Impactful Data Visualization: Hide and Seek with Graphs, Sage Publication.",
    },
  ],
};

/* ------------------------------------------------------------
   MDS-2612
------------------------------------------------------------ */

const MDS2612 = {
  semester: 3,
  code: "MDS-2612",
  name: "Machine Learning- Tools and Techniques",
  category: "DSC",
  lectures: "4",
  exam: 80,
  internal: 20,
  total: 100,
  credits: 4,

  objectives:
    "To empower students with a foundational understanding of machine learning concepts spanning supervised, unsupervised, and deep learning techniques, fostering the ability to implement and evaluate various algorithms for solving diverse data analysis problems in the context of data science.",

  outcomes: `After completion of the course the student will be able to:
• Comprehend core machine learning principles spanning supervised, unsupervised, and deep learning techniques.
• Apply diverse machine learning algorithms for practical problem-solving in data science.
• Utilize machine learning techniques for real-world data analysis, encompassing pre-processing, model selection, and neural network construction for classification and sequence tasks.`,

  units: [
    {
      title: "Introduction to Machine Learning",
      description:
        "Machine learning in Data Science, Overview and comparison of Supervised, Unsupervised, Semi-Supervised and Reinforcement Learning; Basic Concepts: data pre-processing, feature engineering, model evaluation, loss functions, and the importance of splitting data into training, validation, and testing sets; Introduction to Scikit-Learn: Overview, advantages, role in machine learning workflows; Data Representation: Data formats, loading data using Scikit-Learn structures.",
    },
    {
      title: "Supervised Machine Learning Techniques",
      description:
        "Linear Models: Linear regression; Logistic Regression for binary classification problems and its practical implementation; Support Vector Machines (SVM): SVM and its implementation; Decision Trees: Construction and architecture; Random Forest: Architecture, Random Forest vs Decision tree; K-Nearest Neighbors (K-NN): Application of K-NN for classification and regression; Implementing all techniques using Python libraries Scikit-Learn and PyTorch.",
    },
    {
      title: "Unsupervised Machine Learning Techniques",
      description:
        "K-Means Clustering: Principle and algorithm, its principles, and the process of partitioning data into clusters based on similarities. Implementing K-Means clustering with Scikit-Learn's KMeans() function, exploring parameters and methods for optimizing cluster results; Dimensionality Reduction: Principles of Principal Component Analysis (PCA) for reducing the dimensionality, Implementing PCA using Scikit-Learn's PCA() function to reduce the dimensions of datasets and visualizing the variance.",
    },
    {
      title: "Deep Learning",
      description:
        "Principle, architecture, significance and applications of Deep Learning; CNN: architecture, convolutional layers, pooling, and fully connected layers; Implementing CNNs with PyTorch by using nn.Conv2d(), nn.MaxPool2d() and nn.Linear() modules to construct and train CNN models for image classification tasks; RNNs: Principles of RNNs for sequential data analysis, LSTM and GRU Cells, Implementing RNNs with PyTorch for sequence prediction tasks.",
    },
  ],

  books: [
    {
      author: "Keras, and TensorFlow",
      title:
        "Hands-On Machine Learning with Scikit-Learn, Concepts, Tools, and Techniques to Build Intelligent Systems by AurélienGéron, Shroff/O'Reilly.",
    },
    {
      author: "Tom M. Mitchell",
      title:
        "Machine Learning Mc Graw Hill Education.",
    },
    {
      author: "Jason Bell, Wiley",
      title: "Machine Learning for Big Data.",
    },
    {
      author: "Peter Harrington",
      title:
        "Machine Learning in Action, dreamtech press.",
    },
    {
      author:
        "Gareth James, Daniela Witten, et al.",
      title:
        "An Introduction to Statistical Learning: with Applications in Python (Springer Texts in Statistics), Springer.",
    },
    {
      author: "Andreas Muller",
      title:
        "Introduction to Machine Learning with Python: A Guide for Data Scientists (Greyscale Indian Edition), O’Reilly.",
    },
    {
      author: "Christopher M. Bishop",
      title:
        "Pattern Recognition and Machine Learning (Information Science and Statistics), Springer.",
    },
    {
      author: "Ankur A. Patel",
      title:
        "Hands-On Unsupervised Learning Using Python: How to Build Applied Machine Learning Solutions for Unlabeled, O’Reilly.",
    },
    {
      author:
        "Ian Goodfellow, YoshuaBengio, Aaron Courville",
      title:
        "Deep Learning (Adaptive Computation and Machine Learning series) Illustrated Edition, the MIT Press.",
    },
    {
      author: "Ivan Vasilev et al",
      title:
        "Python Deep Learning: Exploring deep learning techniques and neural network architectures with PyTorch, Keras, and TensorFlow, Packt Publishing Limited.",
    },
  ],
};

/* ------------------------------------------------------------
   MDS-2613
------------------------------------------------------------ */

const MDS2613 = {
  semester: 3,
  code: "MDS-2613",
  name: "Software Project Management",
  category: "DSE",
  lectures: "4",
  exam: 80,
  internal: 20,
  total: 100,
  credits: 4,

  objectives:
    "This syllabus encompasses key software engineering principles, software design strategies, agile project management for data science, risk assessment, effective team collaboration, and ethical considerations. It prepares students to apply contemporary methods and emerging trends in data science project management for efficient and ethical delivery of outcomes in a rapidly evolving technological landscape.",

  outcomes: `After successful completion of the course, students will be able to:
• Apply project management principles to the unique context of data science projects.
• Demonstrate proficiency in Agile methodologies and their application in data science environments.
• Effectively manage risks associated with data science projects.
• Understand the importance of data governance and ethics in project management for data science.`,

  units: [
    {
      title: "Software Engineering Basic",
      description:
        "Software Crisis, Software Process Models: Waterfall, Prototyping, Spiral; Software Metrics. Software design Process: Structured design, Object oriented design. Emerging Trends in Data Science Project Management: AI-Powered Project Management, Automated Machine Learning (AutoML) for Project Tasks, Block chain for Data Integrity.",
    },
    {
      title: "Agile Project Management for Data Science",
      description:
        "Introduction to Agile Methodologies: Agile principles and values, Scrum and Kanban methodologies in data science. Agile Project Execution and Monitoring: Sprint planning, daily stand-ups, and retrospectives. Managing tasks, resources and progress in Agile.",
    },
    {
      title: "Risk Management and Collaboration in Data Science Projects",
      description:
        "Risk impacts and risk Management in Data Science: Identifying, assessing, and mitigating risks, Team Collaboration and Communication: Collaboration tools for distributed data science teams.",
    },
    {
      title: "Data Governance, Ethics, and Project Delivery",
      description:
        "Data Governance and Ethics in project management for data science projects. Delivering project outcomes in data science: Conducting project closure activities.",
    },
  ],

  books: [
    {
      author: "Felipe Mejia",
      title:
        "Data Science Project Management, 2021, A press.",
    },
    {
      author: "Roger S. Pressman",
      title:
        "Software Engineering: A Practitioner's Approach, 8th Edition, McGraw-Hill Education, 2020.",
    },
    {
      author: "Mike Cohn",
      title:
        "Agile Estimating and Planning, Prentice Hall, 2005.",
    },
    {
      author: "Michael M. Bissonette",
      title:
        "Project Risk Management: A Practical Implementation Approach, Wiley, 2003.",
    },
    {
      author: "John Ladley",
      title:
        "Data Governance: How to Design, Deploy and Sustain an Effective Data Governance Program, Morgan Kaufmann 2012.",
    },
  ],
};

/* ------------------------------------------------------------
   MDS-2614
------------------------------------------------------------ */

const MDS2614 = {
  semester: 3,
  code: "MDS-2614",
  name: "Research Methods and Ethics in Data Science",
  category: "DSE",
  lectures: "4",
  exam: 80,
  internal: 20,
  total: 100,
  credits: 4,

  objectives: `• Understand key research methodologies in Data Science and their societal impact.
• Develop skills to critically review literature and formulate research problems in Data Science.
• Learn to design research studies and ensure validity, reliability, and effective data collection.
• Examine ethical challenges in data science, focusing on fairness, privacy, and responsible research practices.`,

  outcomes: `• Design and conduct research studies in Data Science using appropriate methodologies and tools.
• Formulate research questions and problems specific to Data Science applications.
• Evaluate ethical implications of data usage and propose responsible strategies.
• Communicate Data Science research effectively while adhering to ethical standards.`,

  units: [
    {
      title:
        "Introduction to Research Methodologies in Data Science",
      description:
        "Objectives of Research in Data Science and its Societal Impact; Types of Research: Exploratory, Descriptive, Experimental, and Interdisciplinary; Steps in Research; Characteristics of Good Research; Developing Research Questions and Hypotheses in Data Science; Case Study focusing on framing and solving research problems in real-world Data Science scenarios.",
    },
    {
      title:
        "Formulating Research Problems and Reviewing Literature",
      description:
        "Critical Analysis of Literature in Data Science; Identifying Gaps in Existing Research: Datasets, methodologies, and outcomes; Formulating Research Problems in Applied, Qualitative, and Quantitative Research; Setting Research Goals and Objectives: Feasibility, innovation, and impact; Case Study focusing on literature review and problem formulation in emerging areas such as NLP or ethical AI.",
    },
    {
      title:
        "Research Design and Data Collection in Data Science",
      description:
        "Research Design: Features, common frameworks, and challenges; Data Collection Techniques: Surveys, experiments, and secondary data sources; Ensuring Validity, Reliability, and Verification of Research Outputs; Case Study: Designing and implementing research projects in Data Science domains such as predictive modeling or anomaly detection.",
    },
    {
      title:
        "Ethical Foundations in Data Science",
      description:
        "Principles of Data Ethics: Fairness, Accountability, and Transparency (FAT); Data Privacy and Security Regulations: GDPR, HIPAA, and beyond; Ethical Challenges in Algorithm Design and Data Use: Bias, discrimination, and informed consent; Writing and Publishing Data Science Research: Ethical considerations and best practices; Case Studies focusing on Interdisciplinary ethical challenges and solutions in applied Data Science.",
    },
  ],

  books: [
    {
      author:
        "Wayne C. Booth, Gregory G. Colomb, Joseph M. Williams, Joseph Bizup and William T. FitzGerald",
      title:
        "The Craft of Research, Fourth Edition, The University of Chicago press, 2016.",
    },
    {
      author: "John W. Creswell",
      title:
        "Research Design Qualitative, Quantitative, and Mixed Methods Approaches, Fourth Edition, Sage Publishers, 2019.",
    },
    {
      author: "C. R. Kothari",
      title:
        "Research Methodology – Methods and techniques, New Age International Publishers 2009.",
    },
    {
      author: "Cathy O'Neil",
      title:
        "Weapons of Math Destruction: How Big Data Increases Inequality and Threatens Democracy, Crown Publishing Group (an imprint of Penguin Random House), 2016.",
    },
    {
      author:
        "DJ Patil, Hilary Mason, and Mike Loukides",
      title:
        "Ethics and Data Science, O'Reilly Media, 2018.",
    },
  ],
};

/* ============================================================
   IMPORT THEORY SUBJECTS
============================================================ */

const theorySubjects = [
  MDS2606,
  MDS2607,
  MDS2608,
  MDS2609,
  MDS2611,
  MDS2612,
  MDS2613,
  MDS2614,
];

async function importTheorySubject(item) {
  console.log("");
  console.log(`📘 ${item.code} - ${item.name}`);

  const subject = await updateSubject(item);

  await addUnits(subject.id, item.units);

  await addBooks(subject.id, item.books);

  await addTheoryExam(subject.id);

  await addSource(
    subject.id,
    `Official Panjab University syllabus source for ${item.code} - ${item.name}.`
  );

  console.log(`   ✅ ${item.code} complete.`);
}

/* ============================================================
   SEMESTER 2 PROJECT
   MDS-2610
============================================================ */

async function importMDS2610() {
  console.log("");
  console.log(
    "📘 MDS-2610 - Minor Project based on MDS-2606 and MDS-2607 using Python Programming"
  );

  const item = {
    semester: 2,
    code: "MDS-2610",
    name:
      "Minor Project based on MDS-2606 and MDS-2607 using Python Programming",
    category: "DSC",
    lectures: "8",
    exam: 80,
    internal: 20,
    total: 100,
    credits: 4,
  };

  const subject = await updateSubject(item);

  const practicalInstructions = `The Practical examination will be conducted for Paper Code: MDS-2610 (Minor Project based on MDS-2606 and MDS-2607). Time: 3 Hrs. Max. Marks: 100. External: 80. Internal: 20.

The Internal Assessment Marks for each practical will be based on Minor Project.
Paper will be set at the time of examination.
Due weight-age may be given to the practical notebook and assignments for evaluation.

Each student is required to undergo 04 to 06 weeks Summer Training at the end of Second Semester.`;

  await addPracticalExam(
    subject.id,
    "Practical Examination",
    practicalInstructions
  );

  await addProject(
    subject.id,
    "Minor Project based on MDS-2606 and MDS-2607",
    "Minor Project",
    "Minor Project based on MDS-2606 and MDS-2607 using Python Programming.",
    practicalInstructions
  );

  await addSource(
    subject.id,
    "Official Panjab University practical examination source for MDS-2610 Minor Project based on MDS-2606 and MDS-2607."
  );

  console.log("   ✅ MDS-2610 complete.");
}

/* ============================================================
   SEMESTER 3 PROJECT
   MDS-2615
============================================================ */

async function importMDS2615() {
  console.log("");
  console.log(
    "📘 MDS-2615 - Minor Project based on MDS-2611 and MDS-2612"
  );

  const item = {
    semester: 3,
    code: "MDS-2615",
    name:
      "Minor Project based on MDS-2611 and MDS-2612",
    category: "DSC",
    lectures: "8",
    exam: 80,
    internal: 20,
    total: 100,
    credits: 4,
  };

  const subject = await updateSubject(item);

  const practicalInstructions = `The Practical examination will be conducted for Paper Code: MDS-2615 (Minor Project based on MDS-2611 and MDS-2612). Time: 3 Hrs. Max. Marks: 100. External: 80. Internal: 20.

The Internal Assessment Marks for each practical will be based on Minor Project.
Paper will be set at the time of examination.
Due weight-age may be given to the practical notebook and assignments for evaluation.`;

  await addPracticalExam(
    subject.id,
    "Practical Examination",
    practicalInstructions
  );

  await addProject(
    subject.id,
    "Minor Project based on MDS-2611 and MDS-2612",
    "Minor Project",
    "Minor Project based on MDS-2611 and MDS-2612.",
    practicalInstructions
  );

  await addSource(
    subject.id,
    "Official Panjab University practical examination source for MDS-2615 Minor Project based on MDS-2611 and MDS-2612."
  );

  console.log("   ✅ MDS-2615 complete.");
}

/* ============================================================
   SEMESTER 4
============================================================ */

async function importMDS2616() {
  console.log("");
  console.log("📘 MDS-2616 - Major Project");

  const semester = await getSemester(4);

  if (!semester) {
    throw new Error("Semester 4 not found.");
  }

  let subject = await getSubject("MDS-2616");

  if (!subject) {
    subject = await prisma.subject.create({
      data: {
        code: "MDS-2616",
        name: "Major Project",
        category: "DSC",
        semesterId: semester.id,
        theoryPracticalLectures: "-",
        universityExamMarks: 240,
        internalAssessmentMarks: 60,
        totalMarks: 300,
        credits: 12,
        objectives: NOT_AVAILABLE,
        outcomes: NOT_AVAILABLE,
      },
    });

    console.log("   ➕ Created MDS-2616");
  } else {
    subject = await prisma.subject.update({
      where: {
        id: subject.id,
      },
      data: {
        name: "Major Project",
        category: "DSC",
        theoryPracticalLectures: "-",
        universityExamMarks: 240,
        internalAssessmentMarks: 60,
        totalMarks: 300,
        credits: 12,
        objectives: NOT_AVAILABLE,
        outcomes: NOT_AVAILABLE,
      },
    });

    console.log("   🔄 Updated MDS-2616");
  }

  const majorProjectRequirements = `The report should consist of the following:
• Cover page including Project title, Name of the student, Name of the Department and Names of the Project Guides (both External and Internal).
• Acknowledgements.
• Certificates from company and department duly signed by external guide, Principal and internal guide.
• Contents with page numbers.
• Introduction (includes background and application or importance of the project)
• Objectives
• System Analysis
• System Feasibility study
• Software requirement specifications
• Design with system flowcharts and input/output design.
• Implementation and Testing
- Hardware and software used
- Listing of well commented programs with result/output or detailed algorithms with input and output.
• Further scope of the project
• Bibliography
• Appendices (any other information related to project)

Each student should observe the following norms while submitting the synopsis/thesis for the Project:
(a) Use both sides of the paper instead of only single side.
(b) Use one and half interline spacing in the text (instead of double space)
(c) Stop using a blank sheet before the page, carrying figure or table.
(d) Try to insert figure/table in the text page itself (instead of using a fresh page for it, each time.)

Students must consult/inform the internal guides regarding the progress of their work at least once in 20 days. It is the duty of the student to be in touch with his/her internal guide. The student must prepare 3 copies of the report including one copy for self. The remaining two copies are to be submitted before 31st May every year as per the following:
1. Department Library
2. Internal Guide

One softcopy of the work is to be submitted to the concerned head of the department/institution along with the report. The student must present his/ her work in 10 - 15 minutes mainly focusing on his/her contribution with the help of slides followed by demonstration of the practical work done. The project Viva will be completed before 15th June every year exact dates will be informed before 31st May every year. An external examiner, internal examiner and the internal guide will conduct project viva.`;

  await addProject(
    subject.id,
    "MDS-2616 Major Project",
    "Major Project",
    "Major Project requirements and report submission guidelines from the official syllabus.",
    majorProjectRequirements
  );

  await prisma.exam.deleteMany({
    where: {
      subjectId: subject.id,
    },
  });

  await prisma.exam.create({
    data: {
      title: "MDS-2616 Major Project Evaluation",
      examType: "Project",
      duration: null,
      totalMarks: 300,
      instructions: majorProjectRequirements,
      subjectId: subject.id,
    },
  });

  await addSource(
    subject.id,
    "Official Panjab University syllabus source for MDS-2616 Major Project."
  );

  console.log("   ✅ MDS-2616 complete.");
}

async function importMDS2617() {
  console.log("");
  console.log(
    "📘 MDS-2617 - Seminar (Based on MDS-2616)"
  );

  const semester = await getSemester(4);

  if (!semester) {
    throw new Error("Semester 4 not found.");
  }

  let subject = await getSubject("MDS-2617");

  if (!subject) {
    subject = await prisma.subject.create({
      data: {
        code: "MDS-2617",
        name: "Seminar (Based on MDS-2616)",
        category: "DSE",
        semesterId: semester.id,
        theoryPracticalLectures: "-",
        universityExamMarks: 160,
        internalAssessmentMarks: 40,
        totalMarks: 200,
        credits: 8,
        objectives: NOT_AVAILABLE,
        outcomes: NOT_AVAILABLE,
      },
    });

    console.log("   ➕ Created MDS-2617");
  } else {
    subject = await prisma.subject.update({
      where: {
        id: subject.id,
      },
      data: {
        name: "Seminar (Based on MDS-2616)",
        category: "DSE",
        theoryPracticalLectures: "-",
        universityExamMarks: 160,
        internalAssessmentMarks: 40,
        totalMarks: 200,
        credits: 8,
        objectives: NOT_AVAILABLE,
        outcomes: NOT_AVAILABLE,
      },
    });

    console.log("   🔄 Updated MDS-2617");
  }

  await prisma.exam.deleteMany({
    where: {
      subjectId: subject.id,
    },
  });

  await prisma.exam.create({
    data: {
      title: "MDS-2617 Seminar Evaluation",
      examType: "Seminar",
      duration: null,
      totalMarks: 200,
      instructions: "Seminar (Based on MDS-2616).",
      subjectId: subject.id,
    },
  });

  await addSource(
    subject.id,
    "Official Panjab University syllabus source for MDS-2617 Seminar (Based on MDS-2616)."
  );

  console.log("   ✅ MDS-2617 complete.");
}

/* ============================================================
   MAIN
============================================================ */

async function main() {
  console.log("");
  console.log("==============================================");
  console.log("📚 CAMPUSCONNECT REMAINING ACADEMIC IMPORT");
  console.log("==============================================");
  console.log("📄 Source:");
  console.log(SOURCE_FILE);
  console.log("");
  console.log(
    "⚠️ Existing database records will NOT be reset."
  );
  console.log(
    "⚠️ Existing users, admin account, notices and uploads will NOT be deleted."
  );
  console.log("");

  console.log("========== SEMESTER 2 ==========");

  await importTheorySubject(MDS2606);
  await importTheorySubject(MDS2607);
  await importTheorySubject(MDS2608);
  await importTheorySubject(MDS2609);
  await importMDS2610();

  console.log("");
  console.log("========== SEMESTER 3 ==========");

  await importTheorySubject(MDS2611);
  await importTheorySubject(MDS2612);
  await importTheorySubject(MDS2613);
  await importTheorySubject(MDS2614);
  await importMDS2615();

  console.log("");
  console.log("========== SEMESTER 4 ==========");

  await importMDS2616();
  await importMDS2617();

  console.log("");
  console.log("==============================================");
  console.log("🎓 REMAINING ACADEMIC DATA IMPORTED");
  console.log("==============================================");

  console.log("");
  console.log("SEMESTER 2");
  console.log("MDS-2606  ✅ Advance Data Structures");
  console.log("MDS-2607  ✅ Statistical Methods for Data Science");
  console.log("MDS-2608  ✅ Data Mining and Artificial Intelligence");
  console.log("MDS-2609  ✅ Big Data Analytics");
  console.log("MDS-2610  ✅ Minor Project");

  console.log("");
  console.log("SEMESTER 3");
  console.log("MDS-2611  ✅ Data Visualization");
  console.log("MDS-2612  ✅ Machine Learning- Tools and Techniques");
  console.log("MDS-2613  ✅ Software Project Management");
  console.log("MDS-2614  ✅ Research Methods and Ethics in Data Science");
  console.log("MDS-2615  ✅ Minor Project");

  console.log("");
  console.log("SEMESTER 4");
  console.log("MDS-2616  ✅ Major Project");
  console.log("MDS-2617  ✅ Seminar");

  console.log("");
  console.log("==============================================");
  console.log("✅ DATABASE UPDATE COMPLETE");
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