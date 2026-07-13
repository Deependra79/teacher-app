import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function POST(req) {
  try {
    const data = await req.json();

    const {
      role,
      name,
      email,
      password,
      qualification,
      dob,
      address,
      pincode,
      aadhar,
      subject,
      latitude,
      longitude,
    } = data;

    // 🔒 Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Location not received" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // 🔍 Check if email already registered in Supabase
    const { data: extStudents } = await supabase
      .from("students")
      .select("email")
      .eq("email", email);
    const { data: extTeachers } = await supabase
      .from("teachers")
      .select("email")
      .eq("email", email);

    if (
      (extStudents && extStudents.length > 0) ||
      (extTeachers && extTeachers.length > 0)
    ) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError || !authData?.user) {
      console.error("Supabase auth create user failed:", authError);
      return NextResponse.json(
        { error: authError?.message || "Unable to create auth account" },
        { status: 400 }
      );
    }

    const targetTable = role === "teacher" ? "teachers" : "students";

    function calculateAge(dobString) {
      if (!dobString) return null;
      const dobDate = new Date(dobString);
      if (Number.isNaN(dobDate.getTime())) return null;
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      if (
        today.getMonth() < dobDate.getMonth() ||
        (today.getMonth() === dobDate.getMonth() && today.getDate() < dobDate.getDate())
      ) {
        age -= 1;
      }
      return age;
    }

    const supabaseProfilePayload =
      role === "teacher"
        ? {
            name,
            email,
            dob,
            aadhar: aadhar ? Number(aadhar) : null,
            qualification,
            pincode: pincode ? Number(pincode) : null,
            address,
            subject,
            latitude,
            longitude,
          }
        : {
            name,
            email,
            age: calculateAge(dob),
            dob,
            address,
            pincode,
            latitude,
            longitude,
          };

    const { data: supabaseProfile, error: supabaseProfileError } = await supabase
      .from(targetTable)
      .insert(supabaseProfilePayload)
      .select()
      .single();

    if (supabaseProfileError) {
      console.error(
        "Supabase profile insert failed:",
        supabaseProfileError.message || supabaseProfileError
      );
      return NextResponse.json(
        { error: "Registration failed during profile creation." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Registered successfully",
      role,
      user: supabaseProfile,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}