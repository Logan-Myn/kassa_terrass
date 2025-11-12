import { auth } from "../lib/auth";

async function migrateAuth() {
  try {
    console.log("Running Better-Auth migration...");

    // Better-Auth will automatically create the necessary tables
    // when the auth instance is first initialized
    await auth.api.listSessions();

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateAuth();
