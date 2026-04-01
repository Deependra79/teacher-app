import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    const result = await pool.query(
      `
      SELECT DISTINCT 
        CASE 
          WHEN sender_id = $1 THEN receiver_id
          ELSE sender_id
        END AS chat_user_id
      FROM messages
      WHERE sender_id = $1 OR receiver_id = $1
      `,
      [userId]
    );

    return NextResponse.json({ chats: result.rows });

  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}