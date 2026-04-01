"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const router = useRouter();

  // 🔐 Load teacher
  useEffect(() => {
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
  }, []);

  // 📩 Load chat list
  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
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
    };

    fetchChats();
  }, [user]);

  // 💬 Fetch messages
  const fetchMessages = async (studentId) => {
    if (!user) return;

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
    setMessages(data.messages || []);;
  };

  // 🔁 Auto refresh messages
  useEffect(() => {
    if (!selectedStudent) return;

    fetchMessages(selectedStudent);

    const interval = setInterval(() => {
      fetchMessages(selectedStudent);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedStudent]);

  // 📤 Send message
  const sendMessage = async () => {
  if (!text.trim()) return;

  const newMsg = {
    id: Date.now(),
    sender_id: user.user.id,
    receiver_id: selectedStudent,
    message: text,
    created_at: new Date().toISOString(),
  };

  // 🔥 instant UI update
  setMessages((prev) => [...prev, newMsg]);

  await fetch("/api/chat/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
  sender_id: user.user.id,
  receiver_id: selectedStudent,
  message: text,
}),
  });

  setText("");
};

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* Navbar */}
      <div className="flex justify-between items-center p-4 bg-green-600 text-white">
        <h1 className="text-lg font-bold">Teacher Dashboard</h1>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="bg-white text-black px-3 py-1 rounded-full"
          >
            👤
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 bg-white text-black p-4 rounded shadow-md w-64 z-50">
              <p><b>Name:</b> {user?.user?.name}</p>
              <p><b>Email:</b> {user?.user?.email}</p>
              <p><b>Subject:</b> {user?.user?.subject}</p>

              <button
                onClick={handleLogout}
                className="mt-3 w-full bg-red-500 text-white p-2 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1">

        {/* 👥 LEFT: Student List */}
        <div className="w-1/3 bg-white border-r p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Students</h3>

          {chats.length === 0 && <p>No chats yet</p>}

          {chats.map((chat, index) => (
            <div
              key={index}
              className={`p-3 rounded cursor-pointer mb-2 ${
                selectedStudent === chat.chat_user_id
                  ? "bg-green-200"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedStudent(chat.chat_user_id)}
            >
              Student ID: {chat.chat_user_id}
            </div>
          ))}
        </div>

        {/* 💬 RIGHT: Chat Window */}
        <div className="flex-1 flex flex-col">

          {!selectedStudent ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a student to start chat
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-2 flex ${
                      msg.sender_id === user.user.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className="bg-blue-500 text-white px-3 py-2 rounded-lg max-w-xs">
                      <p>{msg.message}</p>
                      <span suppressHydrationWarning>
  {typeof window !== "undefined"
    ? new Date(msg.created_at).toLocaleTimeString()
    : ""}
</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 border-t flex">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 border px-3 py-2 rounded-l"
                  placeholder="Type message..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-green-600 text-white px-4 rounded-r"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}