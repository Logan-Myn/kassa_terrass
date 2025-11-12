import { betterAuth } from "better-auth";
import { postgres } from "postgres";

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

const sql = postgres(connectionString);

export const auth = betterAuth({
  database: sql,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    // Add social providers here if needed
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID || "",
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    // },
  },
});
