import { NextResponse } from "next/server";
import { searchTeachers } from "@/lib/db";

export async function POST(req) {
  try {
    const { subject, latitude, longitude, radiusKm = 10 } = await req.json();

    if (!latitude || !longitude) {
      return NextResponse.json({ teachers: [] });
    }

    const radius = Number(radiusKm) || 10;
    const filtered = await searchTeachers(subject, latitude, longitude, radius);

    return NextResponse.json({ teachers: filtered, radius });
  } catch (error) {
    console.error("❌ API ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}