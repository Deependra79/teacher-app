"use client";
import { useState } from "react";

export default function Register() {
  const [role, setRole] = useState("student");

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    qualification: "",
    dob: "",
    address: "",
    pincode: "",
    aadhar: "",
    subject: "",
    email: "",
    password: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ GET LOCATION (PROMISE VERSION - BEST)
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (err) => reject(err)
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 📍 Get location BEFORE sending data
      const position = await getLocation();

      const updatedForm = {
        ...formData,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          ...updatedForm,
        }),
      });

      const data = await res.json();

      console.log("Response:", data);
      alert(data.message || data.error);

    } catch (err) {
      console.error("Error:", err);
      alert("Location permission required or error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-[420px]">

        <h2 className="text-2xl font-bold text-center mb-6">
          Register as {role === "student" ? "Student" : "Teacher"}
        </h2>

        {/* Toggle */}
        <div className="flex mb-6 bg-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`w-1/2 p-2 font-semibold ${
              role === "student"
                ? "bg-blue-500 text-white"
                : "text-gray-700"
            }`}
          >
            Student
          </button>

          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`w-1/2 p-2 font-semibold ${
              role === "teacher"
                ? "bg-blue-500 text-white"
                : "text-gray-700"
            }`}
          >
            Teacher
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Common Fields */}
          <input type="email" name="email" placeholder="Email"
            className="w-full p-2 border rounded" onChange={handleChange} required />

          <input type="password" name="password" placeholder="Password"
            className="w-full p-2 border rounded" onChange={handleChange} required />

          <input type="text" name="name" placeholder="Full Name"
            className="w-full p-2 border rounded" onChange={handleChange} required />

          <input type="text" name="qualification" placeholder="Qualification"
            className="w-full p-2 border rounded" onChange={handleChange} required />

          <input type="date" name="dob"
            className="w-full p-2 border rounded" onChange={handleChange} required />

          <textarea name="address" placeholder="Address"
            className="w-full p-2 border rounded" onChange={handleChange} required />

          <input type="number" name="pincode" placeholder="Pincode"
            className="w-full p-2 border rounded" onChange={handleChange} required />

          {/* Student Only */}
          {role === "student" && (
            <input type="text" name="fatherName" placeholder="Father's Name"
              className="w-full p-2 border rounded" onChange={handleChange} required />
          )}

          {/* Teacher Only */}
          {role === "teacher" && (
            <>
              <input type="text" name="aadhar" placeholder="Aadhar Number"
                className="w-full p-2 border rounded" onChange={handleChange} required />

              <input type="text" name="subject" placeholder="Subject You Teach"
                className="w-full p-2 border rounded" onChange={handleChange} required />
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded font-semibold"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}