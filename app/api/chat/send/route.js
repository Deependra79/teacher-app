import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req) {
  try {
    const { sender_id, receiver_id, message } = await req.json();

    console.log("📩 Incoming:", { sender_id, receiver_id, message });

    if (!sender_id || !receiver_id || !message) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [sender_id, receiver_id, message]
    );

    console.log("✅ Saved:", result.rows[0]);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error("❌ SEND ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}