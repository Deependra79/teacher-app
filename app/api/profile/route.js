import { createSupabaseServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    const idNum = Number(userId);
    if (!idNum) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();

    // Check students first
    const { data: student, error: studentErr } = await supabase
      .from("students")
      .select("name")
      .eq("id", idNum)
      .maybeSingle();

    if (student) {
      return NextResponse.json({ name: student.name, role: "student" });
    }

    // Check teachers
    const { data: teacher, error: teacherErr } = await supabase
      .from("teachers")
      .select("name")
      .eq("id", idNum)
      .maybeSingle();

    if (teacher) {
      return NextResponse.json({ name: teacher.name, role: "teacher" });
    }

    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (e) {
    console.error("Profile API error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
