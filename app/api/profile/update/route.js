import { updateStudentProfile, updateTeacherProfile } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id, role, profileData } = await req.json();
    const idNum = Number(id);

    if (!idNum || !role || !profileData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let updatedUser = null;

    if (role === "student") {
      const { name, dob, address, pincode } = profileData;

      // Calculate age if dob is updated
      function calculateAge(dobString) {
        if (!dobString) return null;
        const dobDate = new Date(dobString);
        if (Number.isNaN(dobDate.getTime())) return null;
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        if (
          today.getMonth() < dobDate.getMonth() ||
          (today.getMonth() === dobDate.getMonth() &&
            today.getDate() < dobDate.getDate())
        ) {
          age -= 1;
        }
        return age;
      }

      const payload = {
        name,
        dob,
        age: dob ? calculateAge(dob) : undefined,
        address,
        pincode: pincode ? String(pincode) : undefined,
      };

      // Remove undefined keys
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      updatedUser = await updateStudentProfile(idNum, payload);
    } else if (role === "teacher") {
      const { name, dob, aadhar, qualification, address, pincode, subject } =
        profileData;

      const payload = {
        name,
        dob,
        aadhar: aadhar ? Number(aadhar) : undefined,
        qualification,
        address,
        pincode: pincode ? Number(pincode) : undefined,
        subject,
      };

      // Remove undefined keys
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      updatedUser = await updateTeacherProfile(idNum, payload);
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (e) {
    console.error("Profile update API error:", e);
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 }
    );
  }
}
