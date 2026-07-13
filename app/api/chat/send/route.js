import { NextResponse } from "next/server";
import { sendMessage } from "@/lib/db";

export async function POST(req) {
  try {
    const { sender_id, receiver_id, message } = await req.json();

    console.log("📩 Incoming:", { sender_id, receiver_id, message });

    if (!sender_id || !receiver_id || !message) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const data = await sendMessage(sender_id, receiver_id, message);

    console.log("✅ Saved:", data);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("❌ SEND ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}