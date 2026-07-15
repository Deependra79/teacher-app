"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const [darkMode, setDarkMode] = useState(false);
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
      } overflow-x-hidden font-sans pb-24`}
    >
      {/* 🌌 GLOWING BACKGROUND SHAPES */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-30 transition-colors duration-300 ${
            darkMode ? "bg-indigo-950" : "bg-indigo-200/50"
          }`}
        ></div>
        <div
          className={`absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-25 transition-colors duration-300 ${
            darkMode ? "bg-emerald-950" : "bg-emerald-100/50"
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
        } shadow-sm`}
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

      {/* 🔥 WONDERMAKERS HERO SECTION */}
      <section className="relative z-10 pt-36 pb-16 px-6 md:px-12 max-w-5xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
          People behind<br />the craft.
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-[60ch] leading-relaxed">
          A personal vision developed and deployed by Deependra Singh. An experts-led design to build direct, community-level connections between neighbors.
        </p>
      </section>

      {/* 🔥 STATS CARDS GRID */}
      <section className="relative z-10 px-6 md:px-12 max-w-5xl mx-auto mb-28">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div
            className={`relative w-full aspect-square p-6 md:p-8 rounded-3xl overflow-hidden flex flex-col items-start justify-between transition-all duration-300 hover:scale-[1.02] shadow-sm ${
              darkMode
                ? "bg-white text-slate-950"
                : "bg-slate-900 text-white"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold">50+</h2>
            <p className="text-sm md:text-base font-medium opacity-90 leading-tight">
              Verified Mentors<br />Matching Nearby
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="relative w-full aspect-square p-6 md:p-8 rounded-3xl overflow-hidden flex flex-col items-start justify-between transition-all duration-300 hover:scale-[1.02] shadow-sm bg-gradient-to-tr from-blue-600 to-indigo-600 text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold">100%</h2>
            <p className="text-sm md:text-base font-medium opacity-90 leading-tight">
              Peer-to-Peer<br />Direct Connections
            </p>
          </div>

          {/* Card 3 */}
          <div
            className={`relative w-full aspect-square p-6 md:p-8 rounded-3xl overflow-hidden flex flex-col items-start justify-between transition-all duration-300 hover:scale-[1.02] shadow-sm border ${
              darkMode
                ? "bg-slate-900/40 border-slate-800 text-white"
                : "bg-white border-slate-200/60 text-slate-900"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold">1k+</h2>
            <p className="text-sm md:text-base font-medium opacity-90 leading-tight">
              Successful Lessons<br />Connected
            </p>
          </div>

          {/* Card 4 */}
          <div
            className="relative w-full aspect-square p-6 md:p-8 rounded-3xl overflow-hidden flex flex-col items-start justify-between transition-all duration-300 hover:scale-[1.02] shadow-sm bg-emerald-600 text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold">0</h2>
            <p className="text-sm md:text-base font-medium opacity-90 leading-tight">
              Commission Fees<br />Always Free to Use
            </p>
          </div>
        </div>
      </section>

      {/* 🔥 LARGE MISSION STATEMENT */}
      <section className="relative z-10 px-6 md:px-12 max-w-5xl mx-auto mb-28">
        <div className="flex flex-col items-start gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Our Mission
          </span>
          <h2 className="text-3xl md:text-5xl leading-snug font-light text-slate-800 dark:text-slate-200 max-w-4xl">
            We believe <span className="font-semibold text-blue-600 dark:text-blue-400">local proximity</span> is the most powerful path to educational trust. By facilitating direct connections between neighbors, we remove institutional friction and make personalized learning natural.
          </h2>
        </div>
      </section>

      {/* 🔥 DEVELOPER SPOTLIGHT (WONDERMAKERS STYLE) */}
      <section className="relative z-10 px-6 md:px-12 max-w-5xl mx-auto mb-28">
        <div className="flex flex-col items-start gap-4 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            The Creator
          </span>
        </div>
        
        <div
          className={`p-8 md:p-12 rounded-3xl border shadow-xl backdrop-blur-md transition-all duration-300 ${
            darkMode
              ? "bg-slate-900/60 border-slate-800"
              : "bg-white border-slate-200/50"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-lg shadow-blue-500/20 shrink-0">
              DS
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  Deependra Singh
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                  Personal Project
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6">
                Developer, Deployer & Research Head at Children's Choice
              </p>
              
              <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-3xl">
                <p>
                  TeachConnect is designed, built, and deployed independently by **Deependra Singh** as a personal project to bridge educational divides. Professionally, Deependra serves as the **Research Head at Children's Choice**, where he directs research on developmental learning methodologies.
                </p>
                <p>
                  While Children's Choice focuses on children's educational welfare and behavioral sciences, **TeachConnect is a personal personal initiative** designed to apply these proximity insights directly in the field. It provides students and teachers with a secure space to match coordinate lessons without commercial overheads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 VALUES SECTION (5 COLUMNS GRID) */}
      <section className="relative z-10 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Our Values
          </span>
          <h2 className="text-3xl font-extrabold">Core Principles</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Card 1 */}
          <div
            className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between aspect-[3/4] ${
              darkMode
                ? "bg-slate-900/30 border-slate-800/80"
                : "bg-white border-slate-200/60"
            }`}
          >
            <div>
              <span className="text-2xl mb-4 block">📍</span>
              <h4 className="font-extrabold text-base mb-2">Proximity</h4>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-normal">
              Latitude and longitude coordinates ensure matches are strictly neighbor-to-neighbor.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between aspect-[3/4] ${
              darkMode
                ? "bg-slate-900/30 border-slate-800/80"
                : "bg-white border-slate-200/60"
            }`}
          >
            <div>
              <span className="text-2xl mb-4 block">🤝</span>
              <h4 className="font-extrabold text-base mb-2">Zero Fees</h4>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-normal">
              Direct connection without commissions, brokers, or subscription gateways.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between aspect-[3/4] ${
              darkMode
                ? "bg-slate-900/30 border-slate-800/80"
                : "bg-white border-slate-200/60"
            }`}
          >
            <div>
              <span className="text-2xl mb-4 block">🛡️</span>
              <h4 className="font-extrabold text-base mb-2">Safe Space</h4>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-normal">
              Inbuilt user blocking and conversation removals give users control over safety.
            </p>
          </div>

          {/* Card 4 */}
          <div
            className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between aspect-[3/4] ${
              darkMode
                ? "bg-slate-900/30 border-slate-800/80"
                : "bg-white border-slate-200/60"
            }`}
          >
            <div>
              <span className="text-2xl mb-4 block">🏡</span>
              <h4 className="font-extrabold text-base mb-2">Community</h4>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-normal">
              Empowering local neighborhoods to self-organize physical learning sessions.
            </p>
          </div>

          {/* Card 5 */}
          <div
            className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between aspect-[3/4] ${
              darkMode
                ? "bg-slate-900/30 border-slate-800/80"
                : "bg-white border-slate-200/60"
            }`}
          >
            <div>
              <span className="text-2xl mb-4 block">⚡</span>
              <h4 className="font-extrabold text-base mb-2">Aesthetics</h4>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-normal">
              Modern fluid dashboards, dark mode support, and seamless responsiveness.
            </p>
          </div>
        </div>

        {/* Back control button */}
        <div className="text-center pt-16">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </section>

      {/* 🚀 FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-900 py-12 px-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-28 relative z-10 max-w-5xl mx-auto">
        <p className="mb-2">© {new Date().getFullYear()} TeachConnect. Personal Project.</p>
        <p className="text-slate-400">
          Developed and Deployed independently by Deependra Singh.
        </p>
      </footer>
    </div>
  );
}
