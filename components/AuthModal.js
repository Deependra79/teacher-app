"use client";

import { useRouter } from "next/navigation";

export default function AuthModal({ isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-[380px] relative text-center border border-slate-200/50 dark:border-slate-800 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-lg"
          aria-label="Close Modal"
        >
          ✕
        </button>

        {/* Brand Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-lg shadow-blue-500/20">
          T
        </div>

        <h2 className="text-2xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
          Welcome to TeachConnect
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Choose an option to continue to your dashboard
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-98 transition-all"
          >
            Login to Account
          </button>

          <button
            onClick={() => router.push("/registration")}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-600/20 active:scale-98 transition-all"
          >
            Register as Teacher/Student
          </button>
        </div>
      </div>
    </div>
  );
}