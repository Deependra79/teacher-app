"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
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

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      } overflow-x-hidden font-sans`}
    >
      {/* 🌌 GLOWING BACKGROUND SHAPES */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 transition-colors duration-300 ${
            darkMode ? "bg-indigo-900" : "bg-indigo-300"
          }`}
        ></div>
        <div
          className={`absolute top-[10%] right-[-10%] w-[450px] h-[450px] rounded-full blur-[100px] opacity-45 transition-colors duration-300 ${
            darkMode ? "bg-blue-950" : "bg-blue-200"
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

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          <a className="text-sm font-medium hover:text-blue-600 transition-colors cursor-pointer">
            Home
          </a>
          <a className="text-sm font-medium hover:text-blue-600 transition-colors cursor-pointer">
            About
          </a>
          <a className="text-sm font-medium hover:text-blue-600 transition-colors cursor-pointer">
            Vision
          </a>

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

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-600/35 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Navbar Controls */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg border text-sm ${
              darkMode
                ? "border-slate-800 bg-slate-900/50 text-yellow-400"
                : "border-slate-200 bg-slate-100/50 text-slate-600"
            }`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button
            className="text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* 📱 MOBILE MENU */}
      {menuOpen && (
        <div
          className={`fixed inset-0 w-full h-screen z-40 flex flex-col items-center justify-center gap-6 text-xl backdrop-blur-lg ${
            darkMode ? "bg-slate-950/95" : "bg-white/95"
          } transition-all`}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-2xl"
          >
            ✕
          </button>
          <a onClick={() => setMenuOpen(false)} className="hover:text-blue-600">
            Home
          </a>
          <a onClick={() => setMenuOpen(false)} className="hover:text-blue-600">
            About
          </a>
          <a onClick={() => setMenuOpen(false)} className="hover:text-blue-600">
            Vision
          </a>

          <button
            onClick={() => {
              setMenuOpen(false);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-lg"
          >
            Sign Up
          </button>
        </div>
      )}

      {/* 🔥 HERO SECTION */}
      <section className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-24 pt-32 pb-16 gap-12 relative z-10 max-w-7xl mx-auto">
        <div className="lg:w-1/2 text-center lg:text-left flex flex-col justify-center items-center lg:items-start">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 mb-6">
            ✨ Proximity-Based Learning Platform
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Learn & Teach{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Smarter
            </span>{" "}
            In Your Neighborhood
          </h1>

          <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-lg">
            Connect with top-rated local teachers. Enhance your skills, ask
            questions, and schedule face-to-face mentorship close to home.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all hover:-translate-y-0.5"
            >
              Get Started Now
            </button>
            <button className="border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 px-8 py-4 rounded-xl font-semibold transition-all">
              Learn More
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 mt-12 w-full border-t border-slate-200 dark:border-slate-900 pt-8 text-left">
            <div>
              <p className="text-3xl font-bold text-blue-600">500+</p>
              <p className="text-xs text-slate-400">Verified Teachers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">5km</p>
              <p className="text-xs text-slate-400">Average Match Distance</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">10k+</p>
              <p className="text-xs text-slate-400">Mentorship Hours</p>
            </div>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="lg:w-1/2 w-full flex justify-center items-center">
          <div className="relative w-full max-w-[450px] aspect-square rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-900 dark:to-slate-900/50 p-8 border border-white/20 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Geometric Patterns */}
            <div className="absolute top-[-10%] right-[-10%] w-[200px] h-[200px] rounded-full bg-blue-500/10 blur-xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[200px] h-[200px] rounded-full bg-indigo-500/10 blur-xl"></div>

            {/* Profile Card Mockup */}
            <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 flex items-center gap-4 transition-all hover:scale-105">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                JD
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Prof. John Doe</p>
                <p className="text-xs text-slate-400">Mathematics Specialist</p>
              </div>
              <span className="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
                1.2 km away
              </span>
            </div>

            {/* Visual illustration center (CSS mapping circles) */}
            <div className="flex-1 flex items-center justify-center my-6 relative">
              <div className="w-24 h-24 rounded-full border border-blue-500/30 flex items-center justify-center animate-ping absolute"></div>
              <div className="w-32 h-32 rounded-full border border-indigo-500/20 flex items-center justify-center absolute"></div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow-lg shadow-blue-500/30 relative z-10">
                📍 You
              </div>
            </div>

            {/* Search Box Mockup */}
            <div className="bg-white dark:bg-slate-950 p-3 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 flex justify-between items-center gap-3">
              <span className="text-xs text-slate-400 pl-2">
                🔍 Search subjects near you...
              </span>
              <button className="bg-blue-600 text-white text-xs px-4 py-2 rounded-xl font-medium">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 VISION SECTION */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-transparent to-slate-100/50 dark:to-slate-950/50 border-t border-slate-200/50 dark:border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-bold uppercase tracking-wider text-xs">
              Our Vision
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 tracking-tight">
              Bridging the Local Educational Gap
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg">
              We believe that the best learning happens face-to-face and close to
              home. Our mission is to facilitate trusted, direct community
              education.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Vision Card 1 */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md shadow-slate-100 dark:shadow-none hover:shadow-xl dark:hover:border-slate-700 transition-all duration-300 flex flex-col items-start hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl mb-6">
                📍
              </div>
              <h3 className="text-xl font-bold mb-3">Hyper-Local Connection</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                No long transit hours or expensive centers. By connecting you
                with verified local mentors in your neighborhood, we make physical
                learning convenient and highly accessible.
              </p>
            </div>

            {/* Vision Card 2 */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md shadow-slate-100 dark:shadow-none hover:shadow-xl dark:hover:border-slate-700 transition-all duration-300 flex flex-col items-start hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl mb-6">
                💬
              </div>
              <h3 className="text-xl font-bold mb-3">Direct Collaboration</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                By eliminating expensive intermediates and brokers, we enable
                direct messaging, scheduling, and coordinate lessons instantly via
                our secure chat platform.
              </p>
            </div>

            {/* Vision Card 3 */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md shadow-slate-100 dark:shadow-none hover:shadow-xl dark:hover:border-slate-700 transition-all duration-300 flex flex-col items-start hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xl mb-6">
                🎓
              </div>
              <h3 className="text-xl font-bold mb-3">Empowering Mentorship</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                We advocate for face-to-face mentorship because physical
                instruction builds deeper conceptual comprehension, fosters focus,
                and creates long-lasting community connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🤝 CALL TO ACTION */}
      <section className="py-24 px-6 text-center relative max-w-5xl mx-auto z-10">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>

          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
            Ready to Connect with Local Mentors?
          </h2>

          <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
            Create your account today and search qualified teachers in your subject.
            Start learning directly!
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-800/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Join TeachConnect Today
          </button>
        </div>
      </section>

      {/* 👤 AUTH MODAL */}
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* 🚀 FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-900 py-12 px-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <p className="mb-2">© {new Date().getFullYear()} TeachConnect. All rights reserved.</p>
        <p className="text-xs text-slate-400">
          Designed for proximity-based community learning and direct mentorship.
        </p>
      </footer>
    </div>
  );
}