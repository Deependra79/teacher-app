"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeScreen, setActiveScreen] = useState("student");

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
    <div className="min-h-screen bg-[#FFFDD0] text-[#1D2D50] overflow-x-hidden font-sans">
      {/* 🌌 GRADIENT BLOB BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-44 left-[-10%] w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle_at_top_left,rgba(255,82,82,0.6),transparent_45%)] blur-[140px] opacity-90" />
        <div className="absolute top-[6%] right-[-8%] w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle_at_top_right,rgba(88,88,255,0.45),transparent_50%)] blur-[160px] opacity-90" />
        <div className="absolute bottom-[-14%] left-[18%] w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.42),transparent_55%)] blur-[160px] opacity-90" />
        <div className="absolute top-[24%] left-[42%] w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.36),transparent_55%)] blur-[140px] opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(248,250,252,0.9)_70%,rgba(255,255,255,0.95)_100%)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.95)_0%,rgba(15,23,42,0.98)_100%)]" />
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
            className="bg-[#FF6E40] text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-[#FF6E40]/25 hover:bg-[#FFD166] hover:text-[#1D2D50] transition-all hover:-translate-y-0.5 active:translate-y-0"
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
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-[#FFD166]/90 text-[#1D2D50] shadow-sm shadow-[#1D2D50]/10 mb-6 border border-[#FF6E40]/20">
            ✨ Proximity-Based Learning Platform
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-3xl">
            Meet up with local mentors,
            grow your skills, and join learning events.
          </h1>

          <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-2xl">
            Discover nearby tutors, chat instantly, and join curated study groups
            tailored to your subject and location.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold shadow-2xl shadow-sky-500/20 hover:shadow-sky-600/25 transition-all hover:-translate-y-0.5"
            >
              Get Started Now
            </button>
            <button className="border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-950 px-8 py-4 rounded-full font-semibold transition-all text-slate-700 dark:text-slate-200">
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
          <div className="relative w-[330px] sm:w-[380px] h-[720px] rotate-6">
            <div className="absolute inset-0 rounded-[70px] bg-gradient-to-br from-[#FFD166]/30 via-[#FF6E40]/20 to-[#1D2D50]/20 blur-3xl" />
            <div className="absolute -left-10 top-16 w-44 h-44 rounded-full bg-[#FFD166]/25 blur-3xl" />
            <div className="absolute -right-12 bottom-14 w-48 h-48 rounded-full bg-[#FF6E40]/25 blur-3xl" />
            <div className="relative z-10 mx-auto w-full h-full rounded-[56px] bg-[#1D2D50] border border-[#FFFDD0]/20 shadow-[0_40px_80px_rgba(29,45,80,0.25)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,110,64,0.14),transparent_40%)]" />
              <div className="relative p-5 flex flex-col h-full">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-[#FFFDD0]/80 mb-4">
                  <div className="inline-flex rounded-full bg-[#FFFDD0]/15 p-1 border border-[#FFFDD0]/20">
                    <button
                      onClick={() => setActiveScreen("student")}
                      className={`px-4 py-2 rounded-full text-[10px] font-semibold transition ${
                        activeScreen === "student"
                          ? "bg-[#FF6E40] text-white"
                          : "text-[#FFFDD0] hover:bg-[#FFFDD0]/30"
                      }`}>
                      Student
                    </button>
                    <button
                      onClick={() => setActiveScreen("teacher")}
                      className={`px-4 py-2 rounded-full text-[10px] font-semibold transition ${
                        activeScreen === "teacher"
                          ? "bg-[#FF6E40] text-white"
                          : "text-[#FFFDD0] hover:bg-[#FFFDD0]/30"
                      }`}>
                      Teacher
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFFDD0]/60" />
                    <span className="w-2 h-2 rounded-full bg-[#FFFDD0]/60" />
                    <span className="w-2 h-2 rounded-full bg-[#FFFDD0]/60" />
                  </div>
                </div>

                {activeScreen === "student" ? (
                  <>
                    <div className="mt-2 rounded-[40px] bg-[#FFFDD0]/95 border border-[#FFFDD0]/30 p-4 text-[#1D2D50] shadow-sm shadow-[#1D2D50]/10">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-semibold">Search: Guitar</p>
                          <p className="text-[11px] text-[#1D2D50]/70">4 teachers found within 5 km</p>
                        </div>
                        <span className="rounded-full bg-[#FF6E40] px-3 py-1 text-[10px] font-bold text-white">Guitar</span>
                      </div>
                      <div className="space-y-3">
                        <div className="rounded-[28px] bg-white p-3 shadow-sm border border-[#1D2D50]/10">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[12px] font-semibold text-[#1D2D50]">Amit Sharma</p>
                              <p className="text-[11px] text-[#1D2D50]/70">Guitar Tutor · 4 yrs exp</p>
                            </div>
                            <span className="text-[11px] font-semibold text-[#1D2D50]/80">2.2 km</span>
                          </div>
                        </div>
                        <div className="rounded-[28px] bg-white p-3 shadow-sm border border-[#1D2D50]/10">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[12px] font-semibold text-[#1D2D50]">Pooja Verma</p>
                              <p className="text-[11px] text-[#1D2D50]/70">Acoustic Guitar Coach</p>
                            </div>
                            <span className="text-[11px] font-semibold text-[#1D2D50]/80">3.8 km</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-[40px] bg-[#1D2D50]/90 border border-[#FF6E40]/30 p-4 text-[#FFFDD0] shadow-lg shadow-[#FF6E40]/10">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold">Available Teachers</p>
                        <span className="rounded-full bg-[#FFD166] px-3 py-1 text-[10px] font-bold text-[#1D2D50]">Live</span>
                      </div>
                      <div className="space-y-3">
                        <div className="rounded-[28px] bg-[#FFFDD0] p-3 text-[#1D2D50] shadow-sm border border-[#1D2D50]/10">
                          <div className="flex items-center justify-between">
                            <p className="text-[12px] font-semibold">Message Amit</p>
                            <button className="rounded-full bg-[#FF6E40] px-3 py-1 text-[10px] font-semibold text-white">Chat</button>
                          </div>
                          <p className="text-[11px] text-[#1D2D50]/70 mt-1">2.2 km away · 8 students online</p>
                        </div>
                        <div className="rounded-[28px] bg-[#FFFDD0] p-3 text-[#1D2D50] shadow-sm border border-[#1D2D50]/10">
                          <div className="flex items-center justify-between">
                            <p className="text-[12px] font-semibold">Book Pooja</p>
                            <button className="rounded-full bg-[#FF6E40] px-3 py-1 text-[10px] font-semibold text-white">Chat</button>
                          </div>
                          <p className="text-[11px] text-[#1D2D50]/70 mt-1">3.8 km away · 1 slot left</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-2 rounded-[40px] bg-[#FFFDD0]/95 border border-[#FFFDD0]/30 p-4 text-[#1D2D50] shadow-sm shadow-[#1D2D50]/10">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-semibold">Teacher Dashboard</p>
                          <p className="text-[11px] text-[#1D2D50]/70">Active students · new messages</p>
                        </div>
                        <span className="rounded-full bg-[#FF6E40] px-3 py-1 text-[10px] font-bold text-white">Teacher</span>
                      </div>
                      <div className="space-y-3">
                        <div className="rounded-[28px] bg-white p-3 shadow-sm border border-[#1D2D50]/10">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[12px] font-semibold text-[#1D2D50]">Riya Patel</p>
                              <p className="text-[11px] text-[#1D2D50]/70">New message</p>
                            </div>
                            <span className="text-[11px] font-semibold text-[#1D2D50]/80">Online</span>
                          </div>
                        </div>
                        <div className="rounded-[28px] bg-white p-3 shadow-sm border border-[#1D2D50]/10">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[12px] font-semibold text-[#1D2D50]">Aditya Singh</p>
                              <p className="text-[11px] text-[#1D2D50]/70">Booking request</p>
                            </div>
                            <span className="text-[11px] font-semibold text-[#1D2D50]/80">2.6 km</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-[40px] bg-[#FFD166]/90 border border-[#FF6E40]/30 p-4 text-[#1D2D50] shadow-lg shadow-[#FF6E40]/10">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold">Upcoming Session</p>
                        <span className="rounded-full bg-[#1D2D50] px-3 py-1 text-[10px] font-bold text-[#FFD166]">Live</span>
                      </div>
                      <p className="text-[13px] leading-relaxed">Guitar trial session · 8:15 PM · 1 student waiting</p>
                    </div>
                  </>
                )}

                <div className="mt-auto flex items-center justify-between bg-[#0f213f]/90 border border-[#FFFDD0]/15 rounded-[32px] px-4 py-3 text-[11px] text-[#FFFDD0]/80">
                  <span>Tap to switch dashboards</span>
                  <button
                    onClick={() => setActiveScreen(activeScreen === "student" ? "teacher" : "student")}
                    className="inline-flex items-center gap-2 rounded-full bg-[#FF6E40] px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-[#FF6E40]/25"
                  >
                    {activeScreen === "student" ? "Teacher" : "Student"}
                    <span>➔</span>
                  </button>
                </div>
              </div>
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
            className="bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-8 py-4 rounded-xl font-bold shadow-xl shadow-blue-800/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
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