"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const router = useRouter();
  const bottomRef = useRef(null);

  // Load theme and user config
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
    const userId = parsed?.user?.id || parsed?.id;
    setCurrentUserId(Number(userId));

    const otherId = window.location.pathname.split("/").pop();
    if (otherId) setOtherUserId(Number(otherId));
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

  // Fetch messages
  const loadMessages = async () => {
    if (!currentUserId || !otherUserId) return;

    try {
      const res = await fetch("/api/chat/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user1: currentUserId,
          user2: otherUserId,
        }),
      });

      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Load messages error:", err);
    }
  };

  // Auto refresh
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    loadMessages();
    const interval = setInterval(loadMessages, 2000);

    return () => clearInterval(interval);
  }, [currentUserId, otherUserId]);

  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender_id: currentUserId,
      receiver_id: otherUserId,
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
          sender_id: currentUserId,
          receiver_id: otherUserId,
          message: oldText,
        }),
      });
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`h-screen flex flex-col transition-colors duration-300 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      } font-sans overflow-hidden`}
    >
      {/* Header */}
      <header
        className={`z-40 w-full px-6 py-4 flex justify-between items-center backdrop-blur-md border-b transition-colors flex-shrink-0 ${
          darkMode
            ? "bg-slate-950/80 border-slate-900"
            : "bg-white/80 border-slate-200/50"
        } shadow-sm`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className={`p-2 rounded-xl border text-xs font-semibold transition-colors ${
              darkMode
                ? "border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-800"
                : "border-slate-200 bg-slate-100/50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            ⬅ Back
          </button>
          <div>
            <h1 className="text-sm font-bold tracking-tight flex items-center gap-1.5">
              Teacher Conversation
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-bold">
              Recipient ID: #{otherUserId}
            </p>
          </div>
        </div>

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
      </header>

      {/* Messages Scroll Panel */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isMe = Number(msg.sender_id) === Number(currentUserId);

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3.5 rounded-2xl max-w-md shadow-sm border ${
                  isMe
                    ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white border-blue-700/20"
                    : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200/50 dark:border-slate-800"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>

                <span
                  className={`text-[9px] block text-right mt-1.5 font-medium opacity-70 ${
                    isMe ? "text-blue-100" : "text-slate-400"
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

        {/* Auto scroll target */}
        <div ref={bottomRef}></div>
      </div>

      {/* Message Input Footer */}
      <footer
        className={`p-4 border-t bg-white dark:bg-slate-900 flex-shrink-0 transition-colors ${
          darkMode ? "border-slate-800" : "border-slate-200/60"
        }`}
      >
        <div className="flex gap-2 items-center max-w-4xl mx-auto">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className={`flex-1 border px-4 py-3.5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${
              darkMode
                ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600"
                : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
            }`}
            placeholder="Type your message here..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20 transition-all active:scale-95 flex-shrink-0"
          >
            ➤
          </button>
        </div>
      </footer>
    </div>
  );
}