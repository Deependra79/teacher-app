export const runtime = "nodejs";

import { pool } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    let user = null;
    let role = null;

    // 🔍 Check students
    const studentRes = await pool.query(
      "SELECT * FROM students WHERE email = $1",
      [email]
    );

    if (studentRes.rows.length > 0) {
      user = studentRes.rows[0];
      role = "student";
    } else {
      // 🔍 Check teachers
      const teacherRes = await pool.query(
        "SELECT * FROM teachers WHERE email = $1",
        [email]
      );

      if (teacherRes.rows.length > 0) {
        user = teacherRes.rows[0];
        role = "teacher";
      }
    }

    // ❌ User not found
    if (!user) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 🔐 Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ Remove password before sending
    delete user.password;

    return Response.json({
      message: "Login successful",
      role,
      user,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}