"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const router = useRouter();

  // Load and apply theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      } overflow-x-hidden font-sans pb-16`}
    >
      {/* 🌌 GLOWING BACKGROUND SHAPES */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-35 transition-colors duration-300 ${
            darkMode ? "bg-indigo-950" : "bg-indigo-200"
          }`}
        ></div>
        <div
          className={`absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-40 transition-colors duration-300 ${
            darkMode ? "bg-blue-950" : "bg-blue-150"
          }`}
        ></div>
      </div>

      {/* 🔥 NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 flex justify-between items-center
        backdrop-blur-md transition-all duration-300 border-b ${
          darkMode
            ? "bg-slate-950/80 border-slate-800"
            : "bg-white/80 border-slate-200/50"
        } ${showNavbar ? "translate-y-0 shadow-sm" : "-translate-y-full"}`}
      >
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
            T
          </span>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            TeachConnect
          </span>
        </div>

        <div className="flex gap-6 items-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm font-medium hover:text-blue-600 transition-colors cursor-pointer"
          >
            Home
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors border ${
              darkMode
                ? "border-slate-800 bg-slate-900/50 text-yellow-400 hover:bg-slate-800"
                : "border-slate-200 bg-slate-100/50 text-slate-600 hover:bg-slate-100"
            }`}
            aria-label="Toggle Night Mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      {/* 🔥 HERO SECTION */}
      <section className="relative z-10 pt-32 pb-12 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 mb-6">
          🎓 About TeachConnect
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          The Journey Behind the{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            Platform
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          TeachConnect was created to eliminate educational boundaries by bringing personalized, face-to-face mentorship back into local neighborhoods.
        </p>
      </section>

      {/* 🔥 MAIN DETAILS */}
      <section className="relative z-10 px-6 md:px-12 max-w-4xl mx-auto space-y-12">
        {/* Developer card */}
        <div
          className={`p-8 rounded-3xl border shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
            darkMode
              ? "bg-slate-900/60 border-slate-800"
              : "bg-white border-slate-200/60"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-blue-500/20 flex-shrink-0">
              DS
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-extrabold mb-1">Deependra Singh</h2>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">
                Creator, Developer & Deployer
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                TeachConnect is fully designed, developed, and deployed by **Deependra Singh** as a personal project. Professionally, Deependra serves as the **Research Head at Children's Choice**, where he leads research initiatives focused on child development and learning behaviors. 
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Driven by his background in developmental research, Deependra built TeachConnect as an independent personal project to bridge the local mentorship gap, helping students access qualified local teachers without high commissions or intermediate channels.
              </p>
            </div>
          </div>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Mission */}
          <div
            className={`p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.01] ${
              darkMode
                ? "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                : "bg-white border-slate-200/60 hover:border-slate-300"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg mb-6">
              🎯
            </div>
            <h3 className="text-xl font-extrabold mb-3">Our Mission</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              To foster hyper-local community knowledge exchange by matching students with verified local educators. We believe proximity-based pairing makes education safer, highly accessible, and builds lasting neighborhood relationships.
            </p>
          </div>

          {/* Vision */}
          <div
            className={`p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.01] ${
              darkMode
                ? "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                : "bg-white border-slate-200/60 hover:border-slate-300"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg mb-6">
              👁️
            </div>
            <h3 className="text-xl font-extrabold mb-3">Our Vision</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              We envision a world where personalized mentorship is natural and instant. By offering robust location-based queries and peer-to-peer secure messaging, TeachConnect empowers any student to learn anything, right next door.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div
          className={`p-8 rounded-3xl border ${
            darkMode
              ? "bg-slate-900/30 border-slate-800"
              : "bg-slate-100/50 border-slate-200/50"
          } text-center`}
        >
          <h3 className="text-xl font-extrabold mb-2">Core Values of the Project</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-6">
            TeachConnect is designed around three fundamental pillars that define every user match.
          </p>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="font-bold text-blue-600 text-lg mb-1">📍</p>
              <p className="font-semibold">Hyper-Local</p>
            </div>
            <div>
              <p className="font-bold text-blue-600 text-lg mb-1">🤝</p>
              <p className="font-semibold">No Middlemen</p>
            </div>
            <div>
              <p className="font-bold text-blue-600 text-lg mb-1">🛡️</p>
              <p className="font-semibold">Trust & Safety</p>
            </div>
          </div>
        </div>

        {/* Back control button */}
        <div className="text-center pt-4">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            ← Back to Home
          </button>
        </div>
      </section>

      {/* 🚀 FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-900 py-12 px-6 text-center text-sm text-slate-500 dark:text-slate-400 mt-20 relative z-10 max-w-4xl mx-auto">
        <p className="mb-2">© {new Date().getFullYear()} TeachConnect. Personal Project.</p>
        <p className="text-xs text-slate-400">
          Developed and Deployed independently by Deependra Singh.
        </p>
      </footer>
    </div>
  );
}
