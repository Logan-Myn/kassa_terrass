import { NextResponse } from "next/server";
import postgres from "postgres";

export async function GET() {
  try {
    const connectionString = process.env.POSTGRES_URL;

    if (!connectionString) {
      throw new Error("POSTGRES_URL environment variable is not set");
    }

    const sql = postgres(connectionString);

    const users = await sql`
      SELECT id, name, email
      FROM "user"
      ORDER BY name ASC
    `;

    await sql.end();

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", users: [] },
      { status: 500 }
    );
  }
}
