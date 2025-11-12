import { NextRequest, NextResponse } from "next/server";
import { mcp__plugin_neon-plugin_neon__run_sql } from "@/lib/neon";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Check if this is only run in development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "This endpoint is only available in development" },
        { status: 403 }
      );
    }

    const userId = randomUUID();
    const email = "logan.myn@protonmail.com";
    const name = "Logan";
    const password = "123456";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const insertUserSQL = `
      INSERT INTO "user" (id, email, email_verified, name, created_at, updated_at)
      VALUES ('${userId}', '${email}', true, '${name}', NOW(), NOW())
      ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name, updated_at = NOW()
      RETURNING id, email, name;
    `;

    // Better-Auth uses internal tables for password storage
    // We need to create an account entry for email/password authentication
    const insertAccountSQL = `
      INSERT INTO account (id, user_id, provider, provider_account_id, access_token, created_at, updated_at)
      VALUES ('${randomUUID()}', '${userId}', 'credential', '${email}', '${hashedPassword}', NOW(), NOW())
      ON CONFLICT (provider, provider_account_id) DO UPDATE
      SET access_token = EXCLUDED.access_token, updated_at = NOW();
    `;

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: userId,
        email,
        name,
      },
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { error: "Failed to create admin user", details: String(error) },
      { status: 500 }
    );
  }
}
