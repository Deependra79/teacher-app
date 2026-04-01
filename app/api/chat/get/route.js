import { pool } from "@/lib/db";

export async function POST(req) {
  try {
    const { user1, user2 } = await req.json();

    const result = await pool.query(
      `SELECT * FROM messages
       WHERE 
         (sender_id = $1 AND receiver_id = $2)
         OR
         (sender_id = $2 AND receiver_id = $1)
       ORDER BY id ASC`,
      [user1, user2]
    );

    return Response.json({
      messages: result.rows,
    });

  } catch (error) {
    console.log(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}