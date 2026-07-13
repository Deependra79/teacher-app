"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    dob: "",
    aadhar: "",
    qualification: "",
    address: "",
    pincode: "",
    subject: "",
  });

  const router = useRouter();
  const chatEndRef = useRef(null);

  // Load theme and teacher
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
    if (parsed.role !== "teacher") {
      router.push("/dashboard/student");
      return;
    }
    setUser(parsed);
    if (parsed?.user) {
      setProfileForm({
        name: parsed.user.name || "",
        dob: parsed.user.dob ? parsed.user.dob.split("T")[0] : "",
        aadhar: parsed.user.aadhar || "",
        qualification: parsed.user.qualification || "",
        address: parsed.user.address || "",
        pincode: parsed.user.pincode || "",
        subject: parsed.user.subject || "",
      });
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

  // Load chat list
  const fetchChats = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/chat/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.user.id,
        }),
      });
      const data = await res.json();
      setChats(data.chats || []);
    } catch (err) {
      console.error("Chat list fetch error:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  // Fetch messages
  const fetchMessages = async (studentId) => {
    if (!user) return;
    try {
      const res = await fetch("/api/chat/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user1: user.user.id,
          user2: studentId,
        }),
      });
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto refresh messages
  useEffect(() => {
    if (!selectedStudent) return;

    fetchMessages(selectedStudent);

    const interval = setInterval(() => {
      fetchMessages(selectedStudent);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedStudent]);

  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender_id: user.user.id,
      receiver_id: selectedStudent,
      message: text,
      created_at: new Date().toISOString(),
    };

    // Instant UI update
    setMessages((prev) => [...prev, newMsg]);

    const oldText = text;
    setText("");

    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: user.user.id,
          receiver_id: selectedStudent,
          message: oldText,
        }),
      });
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
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
      alert(isBlockedByMe ? "Student unblocked successfully!" : "Student blocked successfully!");
      fetchChats();
    } catch (err) {
      console.error("Block toggle error:", err);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!confirm("Are you sure you want to remove this student from your conversations list?")) return;
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
      setSelectedStudent(null);
      fetchChats();
    } catch (err) {
      console.error("Delete chat error:", err);
    }
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
      className={`h-screen flex flex-col transition-colors duration-300 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      } font-sans overflow-hidden`}
    >
      {/* Header / Navbar */}
      <header
        className={`z-40 w-full px-6 py-4 flex justify-between items-center backdrop-blur-md border-b transition-colors flex-shrink-0 ${
          darkMode
            ? "bg-slate-950/80 border-slate-900"
            : "bg-white/80 border-slate-200/50"
        } shadow-sm`}
      >
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold shadow-md shadow-green-500/20">
            T
          </span>
          <h1 className="text-lg font-bold tracking-tight">Teacher Hub</h1>
          <span className="hidden sm:inline px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 ml-2 uppercase">
            {user?.user?.subject}
          </span>
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

          {/* Profile Dropdown */}
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
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                    {user?.user?.name ? user.user.name[0].toUpperCase() : "T"}
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
                    <b>Subject:</b> {user?.user?.subject}
                  </p>
                  {user?.user?.qualification && (
                    <p>
                      <b>Qualification:</b> {user.user.qualification}
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

      {/* Main Split Panel Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* 👥 LEFT PANEL: Student list */}
        <div
          className={`w-full md:w-[350px] border-r flex flex-col flex-shrink-0 bg-white dark:bg-slate-900 transition-all ${
            darkMode ? "border-slate-900" : "border-slate-200/60"
          } ${selectedStudent ? "hidden md:flex" : "flex"}`}
        >
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base tracking-tight">
              Active Mentorships
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select a student to view chat history
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {chats.length === 0 && (
              <div className="text-center py-10 px-4 text-slate-400 text-sm">
                No active conversations yet.
              </div>
            )}

            {chats.map((chat, index) => {
              const isActive = selectedStudent === chat.chat_user_id;
              const isBlockedByMe = chat.blocked && Number(chat.blockerId) === Number(user.user.id);
              const isBlockedByThem = chat.blocked && Number(chat.blockerId) !== Number(user.user.id);

              return (
                <div
                  key={index}
                  className={`p-3.5 rounded-2xl cursor-pointer flex flex-col gap-2 transition-all border ${
                    isActive
                      ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200/50 dark:border-green-900/50"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/40 border-transparent bg-white dark:bg-slate-900"
                  }`}
                  onClick={() => setSelectedStudent(chat.chat_user_id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                      {chat.name ? chat.name[0].toUpperCase() : "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm leading-none text-slate-800 dark:text-slate-200 truncate">
                        {chat.name}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase font-bold tracking-wider">
                        Student Account
                      </p>
                      {chat.blocked && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 text-[8px] font-bold rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                          {isBlockedByMe ? "🚫 Blocked by you" : "🚫 Blocked"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end border-t border-slate-100 dark:border-slate-800/60 pt-2 mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlockToggle(chat);
                      }}
                      disabled={isBlockedByThem}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                        isBlockedByThem
                          ? "border-slate-150 text-slate-300 dark:border-slate-850 dark:text-slate-700 cursor-not-allowed"
                          : isBlockedByMe
                          ? "border-green-500/30 bg-green-500/5 text-green-600 hover:bg-green-500/10"
                          : "border-red-500/30 bg-red-500/5 text-red-600 hover:bg-red-500/10"
                      }`}
                    >
                      {isBlockedByMe ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.chat_user_id);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 💬 RIGHT PANEL: Chat panel */}
        <div
          className={`flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 transition-all ${
            !selectedStudent ? "hidden md:flex" : "flex"
          }`}
        >
          {!selectedStudent ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <span className="text-4xl mb-4">💬</span>
              <h3 className="font-bold text-lg">No Conversation Selected</h3>
              <p className="text-slate-400 text-sm max-w-sm mt-1">
                Select a student from the sidebar to view records or coordinate
                class times.
              </p>
            </div>
          ) : (
            <>
              {/* Active Conversation Header */}
              <div
                className={`p-4 border-b flex justify-between items-center bg-white dark:bg-slate-900 flex-shrink-0 transition-colors ${
                  darkMode ? "border-slate-800" : "border-slate-200/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="md:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-colors mr-2"
                  >
                    ⬅
                  </button>

                  <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center font-bold text-sm">
                    {chats.find(c => c.chat_user_id === selectedStudent)?.name?.[0]?.toUpperCase() || "S"}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-none flex items-center gap-1.5 text-slate-850 dark:text-slate-100">
                      {chats.find(c => c.chat_user_id === selectedStudent)?.name || `Student #${selectedStudent}`}
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                      Tutoring Conversation
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Bubble History */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {/* 🚫 Block Banner Alert inside conversation */}
                {chats.find(c => c.chat_user_id === selectedStudent)?.blocked && (
                  <div className="p-3.5 rounded-2xl border text-xs font-semibold text-center flex items-center justify-center gap-2 bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 mb-2">
                    <span>
                      {chats.find(c => c.chat_user_id === selectedStudent)?.blockerId === user.user.id
                        ? "🚫 You have blocked this student. You must unblock them to write messages."
                        : "🚫 You have been blocked by this student."}
                    </span>
                    {chats.find(c => c.chat_user_id === selectedStudent)?.blockerId === user.user.id && (
                      <button
                        onClick={() => handleBlockToggle(chats.find(c => c.chat_user_id === selectedStudent))}
                        className="underline text-red-700 dark:text-red-300 font-bold hover:text-red-900 dark:hover:text-red-100 ml-1"
                      >
                        Unblock Now
                      </button>
                    )}
                  </div>
                )}

                {messages
                  .filter((m) => !m.message.startsWith("__SYSTEM__ACTION__"))
                  .map((msg) => {
                    const isMe = msg.sender_id === user.user.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`p-3.5 rounded-2xl max-w-md shadow-sm border ${
                            isMe
                              ? "bg-gradient-to-tr from-green-600 to-emerald-600 text-white border-green-700/20"
                              : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200/50 dark:border-slate-800"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </p>
                          <span
                            className={`text-[9px] block text-right mt-1.5 font-medium opacity-70 ${
                              isMe ? "text-green-100" : "text-slate-400"
                            }`}
                            suppressHydrationWarning
                          >
                            {typeof window !== "undefined"
                              ? new Date(msg.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                <div ref={chatEndRef}></div>
              </div>

              {/* Bottom Message Input Bar */}
              <div
                className={`p-4 border-t bg-white dark:bg-slate-900 flex-shrink-0 transition-colors ${
                  darkMode ? "border-slate-800" : "border-slate-200/60"
                }`}
              >
                <div className="flex gap-2 items-center">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={chats.find(c => c.chat_user_id === selectedStudent)?.blocked}
                    className={`flex-1 border px-4 py-3.5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-500/40 transition-all ${
                      chats.find(c => c.chat_user_id === selectedStudent)?.blocked
                        ? "bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-700 cursor-not-allowed border-slate-200 dark:border-slate-900"
                        : darkMode
                        ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                    }`}
                    placeholder={
                      chats.find(c => c.chat_user_id === selectedStudent)?.blocked
                        ? "Conversation is locked due to block..."
                        : "Write a message to your student..."
                    }
                  />
                  <button
                    onClick={sendMessage}
                    disabled={chats.find(c => c.chat_user_id === selectedStudent)?.blocked}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-md transition-all active:scale-95 ${
                      chats.find(c => c.chat_user_id === selectedStudent)?.blocked
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none"
                        : "bg-green-600 hover:bg-green-700 text-white shadow-green-500/20"
                    }`}
                  >
                    ➤
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-md relative border border-slate-200/50 dark:border-slate-800 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Edit Profile Settings
            </h3>
            <button
              onClick={() => setIsEditingProfile(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200"
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
                  Aadhar Number
                </label>
                <input
                  type="number"
                  value={profileForm.aadhar}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, aadhar: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border outline-none bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Subject Domain
                </label>
                <input
                  type="text"
                  value={profileForm.subject}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, subject: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border outline-none bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  value={profileForm.qualification}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      qualification: e.target.value,
                    })
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
                  type="number"
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