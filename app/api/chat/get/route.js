import { getMessages } from "@/lib/db";

export async function POST(req) {
  try {
    const { user1, user2 } = await req.json();
    const messages = await getMessages(user1, user2);

    return Response.json({
      messages,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}