"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
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
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* 🔥 NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 px-6 md:px-10 py-4 flex justify-between items-center
        backdrop-blur-lg bg-white/70 border-b border-white/20 shadow-sm
        transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <h1 className="text-xl md:text-2xl font-bold text-blue-600">
          TeachConnect
        </h1>

        <div className="hidden md:flex gap-8 items-center">
          <a className="text-gray-700 hover:text-blue-600 cursor-pointer">Home</a>
          <a className="text-gray-700 hover:text-blue-600 cursor-pointer">About</a>
          <a className="text-gray-700 hover:text-blue-600 cursor-pointer">Contact</a>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Sign Up
          </button>
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* 📱 MOBILE MENU */}
      {menuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-white z-40 flex flex-col items-center justify-center gap-6 text-xl">
          <a>Home</a>
          <a>About</a>
          <a>Contact</a>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Sign Up
          </button>

          <button onClick={() => setMenuOpen(false)} className="text-gray-500">
            Close ✕
          </button>
        </div>
      )}

      {/* 🔥 HERO */}
      <section className="h-screen flex flex-col md:flex-row items-center justify-center px-6 bg-gradient-to-br from-blue-50 to-blue-100 pt-24">

        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Learn & Teach Smarter
          </h1>

          <p className="text-gray-600 mb-6">
            Connect with top teachers and grow your knowledge with ease.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Get Started
          </button>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
            alt="education"
            className="w-[300px] mx-auto"
          />
        </div>

      </section>

      {/* 🔥 MODAL */}
      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

    </div>
  );
}