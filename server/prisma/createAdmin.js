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

async function main() {
  const email = "admin@campusconnect.com";
  const password = "Admin12345";

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("⚠️ Admin account already exists.");
    console.log(`Email: ${email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      name: "CampusConnect Admin",
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("");
  console.log("====================================");
  console.log("✅ ADMIN ACCOUNT CREATED");
  console.log("====================================");
  console.log(`Email    : ${admin.email}`);
  console.log(`Password : ${password}`);
  console.log(`Role     : ${admin.role}`);
  console.log("====================================");
}

main()
  .catch((error) => {
    console.error("❌ Failed to create admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });