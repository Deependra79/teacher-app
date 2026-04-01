import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcrypt";

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
      fatherName,
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

    // 🔐 HASH PASSWORD (VERY IMPORTANT)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔍 Check if email already exists
    const existingStudent = await pool.query(
      "SELECT * FROM students WHERE email = $1",
      [email]
    );

    const existingTeacher = await pool.query(
      "SELECT * FROM teachers WHERE email = $1",
      [email]
    );

    if (existingStudent.rows.length > 0 || existingTeacher.rows.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // 👨‍🏫 Teacher Registration
    if (role === "teacher") {
      await pool.query(
        `
        INSERT INTO teachers
        (name, email, password, qualification, dob, address, pincode, aadhar, subject, latitude, longitude)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        `,
        [
          name,
          email,
          hashedPassword, // ✅ FIXED
          qualification,
          dob,
          address,
          pincode,
          aadhar,
          subject,
          latitude,
          longitude,
        ]
      );
    } 
    
    // 🎓 Student Registration
    else {
      await pool.query(
        `
        INSERT INTO students
        (name, email, password, qualification, dob, address, pincode, father_name, aadhar, latitude, longitude)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        `,
        [
          name,
          email,
          hashedPassword, // ✅ FIXED
          qualification,
          dob,
          address,
          pincode,
          fatherName,
          aadhar,
          latitude,
          longitude,
        ]
      );
    }

    return NextResponse.json({
      message: "Registered successfully",
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}