import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

async function createAdminUser() {
  const userId = randomUUID();
  const hashedPassword = await bcrypt.hash("123456", 10);

  const insertUserSQL = `
    INSERT INTO "user" (id, email, email_verified, name, created_at, updated_at)
    VALUES ('${userId}', 'logan.myn@protonmail.com', true, 'Logan', NOW(), NOW())
    ON CONFLICT (email) DO NOTHING
    RETURNING id;
  `;

  console.log("SQL to create admin user:");
  console.log(insertUserSQL);
  console.log("\nUser ID:", userId);
  console.log("Hashed Password:", hashedPassword);
  console.log("\nNote: Better-Auth handles password storage in a separate internal table.");
  console.log("You'll need to use the Better-Auth API to create the user with password.");
}

createAdminUser();
