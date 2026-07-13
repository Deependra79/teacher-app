"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");
  const [radius, setRadius] = useState(10);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    dob: "",
    address: "",
    pincode: "",
  });
  const [myChats, setMyChats] = useState([]);
  const [activeTab, setActiveTab] = useState("search");

  const router = useRouter();

  // Load theme and user
  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    // Load user
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(storedUser);
    setUser(parsed);
    if (parsed?.user) {
      setProfileForm({
        name: parsed.user.name || "",
        dob: parsed.user.dob ? parsed.user.dob.split("T")[0] : "",
        address: parsed.user.address || "",
        pincode: parsed.user.pincode || "",
      });
    }
  }, []);

  // Fetch student conversations list on activeTab changing to chats
  const fetchMyChats = async () => {
    if (!storedUserHelper()) return;
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      const res = await fetch("/api/chat/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: stored.user.id }),
      });
      const data = await res.json();
      setMyChats(data.chats || []);
    } catch (err) {
      console.error("Fetch my chats error:", err);
    }
  };

  const storedUserHelper = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("user");
  };

  useEffect(() => {
    if (activeTab === "chats" && user) {
      fetchMyChats();
    }
  }, [activeTab, user]);

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

  // Get location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            user: {
              ...prev.user,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          };
        });
      },
      (err) => {
        console.error("Location error:", err.message);
        alert("Please allow location access to search nearby teachers");
      }
    );
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.user.id,
          role: user.role,
          profileData: profileForm,
        }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      const updatedUser = {
        ...user,
        user: data.user,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Save profile error:", err);
      alert("An error occurred while saving details.");
    }
  };

  const handleBlockToggle = async (chat) => {
    const isBlockedByMe = chat.blocked && Number(chat.blockerId) === Number(user.user.id);
    const actionMessage = isBlockedByMe
      ? "__SYSTEM__ACTION__UNBLOCK__"
      : "__SYSTEM__ACTION__BLOCK__";

    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: user.user.id,
          receiver_id: chat.chat_user_id,
          message: actionMessage,
        }),
      });
      alert(isBlockedByMe ? "Teacher unblocked successfully!" : "Teacher blocked successfully!");
      fetchMyChats();
    } catch (err) {
      console.error("Block toggle error:", err);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!confirm("Are you sure you want to remove this teacher from your conversations list?")) return;
    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: user.user.id,
          receiver_id: chatId,
          message: "__SYSTEM__ACTION__DELETE__",
        }),
      });
      alert("Conversation removed.");
      fetchMyChats();
    } catch (err) {
      console.error("Delete chat error:", err);
    }
  };

  // Search
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    if (!user?.user?.latitude || !user?.user?.longitude) {
      alert("Location not available. Please allow location access.");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: search,
          latitude: user.user.latitude,
          longitude: user.user.longitude,
          radiusKm: radius,
        }),
      });

      if (!res.ok) {
        console.error("Search API failed");
        setTeachers([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setTeachers(data.teachers || []);
    } catch (err) {
      console.error("Search error:", err);
      setTeachers([]);
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-slate-500 dark:text-slate-400 animate-pulse font-medium">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      } font-sans pb-12`}
    >
      {/* Glow effects */}
      <div className="absolute top-0 left-0 w-full h-[300px] overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute top-[-50%] left-[10%] w-[350px] h-[350px] rounded-full blur-[80px] opacity-30 ${
            darkMode ? "bg-blue-900" : "bg-blue-200"
          }`}
        ></div>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-40 w-full px-6 py-4 flex justify-between items-center backdrop-blur-md border-b transition-colors ${
          darkMode
            ? "bg-slate-950/80 border-slate-900"
            : "bg-white/80 border-slate-200/50"
        } shadow-sm`}
      >
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
            S
          </span>
          <h1 className="text-lg font-bold tracking-tight">Student Hub</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme switcher */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg border text-sm transition-colors ${
              darkMode
                ? "border-slate-800 bg-slate-900/50 text-yellow-400 hover:bg-slate-800"
                : "border-slate-200 bg-slate-100/50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* User Profile dropdown wrapper */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border font-bold text-sm shadow-sm transition-all ${
                darkMode
                  ? "bg-slate-900 border-slate-800 hover:bg-slate-800"
                  : "bg-slate-100 border-slate-200 hover:bg-slate-200"
              }`}
            >
              👤
            </button>

            {showProfile && (
              <div
                className={`absolute right-0 mt-2 p-6 rounded-2xl shadow-2xl w-72 z-50 border transition-all ${
                  darkMode
                    ? "bg-slate-900 border-slate-800 text-slate-100"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {user?.user?.name ? user.user.name[0].toUpperCase() : "S"}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">
                      {user?.user?.name}
                    </h3>
                    <p className="text-xs text-slate-400 capitalize">
                      {user?.role} Account
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
                  <p>
                    <b>Email:</b> {user?.user?.email}
                  </p>
                  <p>
                    <b>Qualification:</b> {user?.user?.qualification}
                  </p>
                  {user?.user?.address && (
                    <p>
                      <b>Address:</b> {user.user.address}
                    </p>
                  )}
                </div>

                <div className="space-y-2.5 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setIsEditingProfile(true);
                      setShowProfile(false);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-semibold shadow-md shadow-blue-500/10 transition-colors"
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-xs font-semibold shadow-md shadow-red-500/10 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 mt-10 relative z-10">
        {/* Welcome message */}
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.user?.name}! 👋
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Let's search for qualified mentors near your coordinates.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-6 mb-8 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("search")}
            className={`pb-2 text-sm font-bold border-b-2 transition-all outline-none ${
              activeTab === "search"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            🔍 Search Mentors
          </button>
          <button
            onClick={() => setActiveTab("chats")}
            className={`pb-2 text-sm font-bold border-b-2 transition-all outline-none ${
              activeTab === "chats"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            💬 My Conversations
          </button>
        </div>

        {activeTab === "search" ? (
          <>
            {/* 🔍 Search portal card */}
            <div
              className={`p-6 rounded-3xl border shadow-lg ${
                darkMode
                  ? "bg-slate-900/60 border-slate-800"
                  : "bg-white border-slate-200/60"
              } backdrop-blur-sm mb-8`}
            >
              <form
                onSubmit={handleSearch}
                className="flex flex-col md:flex-row gap-4 items-stretch"
              >
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="What skill do you want to learn? (Maths, English, Music...)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm border outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${
                      darkMode
                        ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                    }`}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <select
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className={`px-4 py-3.5 rounded-2xl text-sm border outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/40 transition-all ${
                      darkMode
                        ? "bg-slate-950 border-slate-800 text-slate-100"
                        : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  >
                    <option value={5}>Within 5 km</option>
                    <option value={10}>Within 10 km</option>
                    <option value={20}>Within 20 km</option>
                    <option value={50}>Within 50 km</option>
                  </select>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-2xl text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 transition-all active:scale-98"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Loading Skeleton */}
            {loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-48 rounded-2xl border ${
                      darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                    }`}
                  ></div>
                ))}
              </div>
            )}

            {/* Search Results */}
            {!loading && (
              <div>
                {/* Empty state */}
                {hasSearched && teachers.length === 0 && (
                  <div
                    className={`p-12 text-center rounded-3xl border ${
                      darkMode
                        ? "bg-slate-900/40 border-slate-800"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <span className="text-4xl">🧑‍🏫</span>
                    <h3 className="text-lg font-bold mt-4">No Teachers Found</h3>
                    <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                      We couldn't find any teachers teaching "{search}" within{" "}
                      {radius} km. Try selecting a larger search radius.
                    </p>
                  </div>
                )}

                {/* Grid of Results */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className={`p-6 rounded-2xl border shadow-sm hover:shadow-xl dark:shadow-none hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between gap-4 ${
                        darkMode
                          ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                          : "bg-white border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20 flex-shrink-0">
                          {teacher.name ? teacher.name[0].toUpperCase() : "T"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base leading-tight truncate">
                            {teacher.name}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {teacher.qualification}
                          </p>

                          <div className="flex flex-wrap gap-1.5 mt-3">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                              {teacher.subject}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                              📍 {teacher.distance?.toFixed(1)} km
                            </span>
                          </div>
                        </div>
                      </div>

                      {teacher.address && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 leading-normal border-t border-slate-100 dark:border-slate-800 pt-3">
                          🏠 {teacher.address}
                        </p>
                      )}

                      <button
                        onClick={() => router.push(`/chat/${teacher.id}`)}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:from-emerald-700 hover:to-teal-700 hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        💬 Message Teacher
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* 💬 MY CONVERSATIONS TAB VIEW */
          <div>
            {myChats.length === 0 && (
              <div
                className={`p-12 text-center rounded-3xl border ${
                  darkMode
                    ? "bg-slate-900/40 border-slate-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <span className="text-4xl">💬</span>
                <h3 className="text-lg font-bold mt-4">No Conversations</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                  You haven't initiated chat threads with any mentors yet. Use the Search tab to find local teachers!
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myChats.map((chat) => {
                const isBlockedByMe = chat.blocked && Number(chat.blockerId) === Number(user.user.id);
                const isBlockedByThem = chat.blocked && Number(chat.blockerId) !== Number(user.user.id);

                return (
                  <div
                    key={chat.chat_user_id}
                    className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between gap-4 transition-all duration-300 ${
                      darkMode
                        ? "bg-slate-900 border-slate-800"
                        : "bg-white border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                        {chat.name ? chat.name[0].toUpperCase() : "T"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base leading-tight truncate">
                          {chat.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Teacher Account
                        </p>
                        {chat.blocked && (
                          <span className="inline-block mt-2 px-2 py-0.5 text-[9px] font-bold rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                            {isBlockedByMe ? "🚫 Blocked by you" : "🚫 Blocked"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => router.push(`/chat/${chat.chat_user_id}`)}
                        disabled={isBlockedByThem}
                        className={`py-2 rounded-xl text-xs font-semibold shadow-sm transition-all text-center ${
                          isBlockedByThem
                            ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10 hover:shadow-blue-600/25"
                        }`}
                      >
                        Open Chat
                      </button>
                      <button
                        onClick={() => handleDeleteChat(chat.chat_user_id)}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2 rounded-xl text-xs font-semibold transition-all"
                      >
                        Remove
                      </button>
                    </div>

                    <button
                      onClick={() => handleBlockToggle(chat)}
                      disabled={isBlockedByThem}
                      className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isBlockedByThem
                          ? "border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed"
                          : isBlockedByMe
                          ? "border-green-500/50 bg-green-500/10 text-green-600 hover:bg-green-500/20"
                          : "border-red-500/50 bg-red-500/10 text-red-600 hover:bg-red-500/20"
                      }`}
                    >
                      {isBlockedByMe ? "🔓 Unblock Teacher" : "🚫 Block Teacher"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-md relative border border-slate-200/50 dark:border-slate-800 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Edit Profile Settings
            </h3>
            <button
              onClick={() => setIsEditingProfile(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200"
              aria-label="Close modal"
            >
              ✕
            </button>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-sm text-left">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border outline-none bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={profileForm.dob}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, dob: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border outline-none bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Address
                </label>
                <textarea
                  value={profileForm.address}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, address: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border outline-none bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-20 resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={profileForm.pincode}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, pincode: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border outline-none bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all mt-6"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}