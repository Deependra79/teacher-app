import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req) {
  try {
    console.log("✅ API HIT");

    const { subject, latitude, longitude } = await req.json();

    console.log("Incoming:", { subject, latitude, longitude });

    // 🛑 Safety check
    if (!latitude || !longitude) {
      return NextResponse.json({ teachers: [] });
    }

    const result = await pool.query(
      `
      SELECT *,
      (
        6371 * acos(
          LEAST(1, GREATEST(-1,
            cos(radians($1)) *
            cos(radians(latitude)) *
            cos(radians(longitude) - radians($2)) +
            sin(radians($1)) *
            sin(radians(latitude))
          ))
        )
      ) AS distance
      FROM teachers
      WHERE subject ILIKE $3
      AND latitude IS NOT NULL
      AND longitude IS NOT NULL
      `,
      [latitude, longitude, `%${subject}%`]
    );

    console.log("DB Result:", result.rows);

    const filtered = result.rows.filter(t => t.distance <= 10);

    console.log("Filtered:", filtered);

    return NextResponse.json({ teachers: filtered });

  } catch (error) {
    console.error("❌ API ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}