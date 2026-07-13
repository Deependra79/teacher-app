import { NextResponse } from "next/server";
import { sendMessage, isBlocked } from "@/lib/db";

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

    // Block check for normal messages
    const isSystemAction = message.startsWith("__SYSTEM__ACTION__");
    if (!isSystemAction) {
      const blockStatus = await isBlocked(sender_id, receiver_id);
      if (blockStatus.blocked) {
        return NextResponse.json(
          { error: "You cannot send messages to this user because of a block" },
          { status: 403 }
        );
      }
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