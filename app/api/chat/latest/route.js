import { getLatestMessage } from "@/lib/db";

export async function POST(req) {
  const { userId } = await req.json();
  const message = await getLatestMessage(userId);

  return Response.json({
    message,
  });
}