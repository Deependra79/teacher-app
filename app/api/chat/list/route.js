import { NextResponse } from "next/server";
import { getChatList } from "@/lib/db";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    const chats = await getChatList(userId);
    return NextResponse.json({ chats });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}