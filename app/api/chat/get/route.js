import { getMessages, isBlocked } from "@/lib/db";

export async function POST(req) {
  try {
    const { user1, user2 } = await req.json();
    const messages = await getMessages(user1, user2);
    const blockStatus = await isBlocked(user1, user2);

    return Response.json({
      messages,
      blocked: blockStatus.blocked,
      blockerId: blockStatus.blockerId,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}