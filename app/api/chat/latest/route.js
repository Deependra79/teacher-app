import { pool } from "@/lib/db";

export async function POST(req) {
  const { userId } = await req.json();

  const result = await pool.query(
    `SELECT * FROM messages 
     WHERE receiver_id = $1 
     ORDER BY id DESC 
     LIMIT 1`,
    [userId]
  );

  return Response.json({
    message: result.rows[0] || null,
  });
}