"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  

const router = useRouter();

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    // ✅ Save user
    localStorage.setItem("user", JSON.stringify(data));

    // ✅ Redirect instantly (no alert)
    if (data.role === "student") {
      router.push("/dashboard/student");
    } else {
      router.push("/dashboard/teacher");
    }

  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-[400px]">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}