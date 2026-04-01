"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const router = useRouter();
  const bottomRef = useRef(null);

  // ✅ Load user + other user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(storedUser);

    // 🔥 FIX (important)
    const userId = parsed?.user?.id || parsed?.id;
    setCurrentUserId(Number(userId));

    const otherId = window.location.pathname.split("/").pop();
    if (otherId) setOtherUserId(Number(otherId));
  }, []);

  // ✅ Fetch messages
  const loadMessages = async () => {
    if (!currentUserId || !otherUserId) return;

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
  };

  // 🔁 Auto refresh
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    loadMessages();
    const interval = setInterval(loadMessages, 2000);

    return () => clearInterval(interval);
  }, [currentUserId, otherUserId]);

  // 📤 Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender_id: currentUserId,
      receiver_id: otherUserId,
      message: text,
      created_at: new Date().toISOString(),
    };

    // 🔥 instant UI
    setMessages((prev) => [...prev, newMsg]);

    await fetch("/api/chat/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_id: currentUserId,
        receiver_id: otherUserId,
        message: text,
      }),
    });

    setText("");
  };

  // 🔥 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* Header */}
      <div className="p-4 bg-green-600 text-white flex justify-between">
        <span className="font-bold">Chat</span>
        <button onClick={() => router.back()}>⬅ Back</button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg) => {
          const isMe =
            Number(msg.sender_id) === Number(currentUserId);

          return (
            <div
              key={msg.id}
              className={`mb-3 flex ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-xs shadow ${
                  isMe
                    ? "bg-green-500 text-white"
                    : "bg-white text-black border"
                }`}
              >
                <p>{msg.message}</p>

                <span className="text-xs block text-right opacity-70 mt-1">
                  {typeof window !== "undefined"
                    ? new Date(msg.created_at).toLocaleTimeString()
                    : ""}
                </span>
              </div>
            </div>
          );
        })}

        {/* Auto scroll target */}
        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="p-3 border-t flex bg-white">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border px-3 py-2 rounded-l outline-none"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-5 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}