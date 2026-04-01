"use client";

import { useRouter } from "next/navigation";

export default function AuthModal({ isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-xl w-[350px] relative text-center">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Welcome 👋
        </h2>

        <p className="text-gray-600 mb-6">
          Choose an option to continue
        </p>

        <div className="flex flex-col gap-3">

          <button
            onClick={() => router.push("/login")}
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/registration")}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Register
          </button>

        </div>

      </div>
    </div>
  );
}