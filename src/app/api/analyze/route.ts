import { auth } from "@/auth";
import { analyzeFeedback, embedText } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = body.text?.trim() ?? "";
  if (text.length < 12) {
    return NextResponse.json({ error: "Add more detail in your feedback." }, { status: 400 });
  }

  const analysis = await analyzeFeedback(text);
  const embedding = await embedText(text);

  const item = await prisma.feedbackItem.create({
    data: {
      userId: session.user.id,
      rawText: text,
      title: analysis.title,
      summary: analysis.summary,
      sentiment: analysis.sentiment,
      urgency: analysis.urgency,
      topics: analysis.topics,
      embedding: embedding ?? undefined,
      tasks: {
        create: analysis.tasks.map((t, i) => ({
          title: t.title,
          ownerLane: t.ownerLane,
          priority: t.priority,
          dueHint: t.dueHint,
          sortOrder: i,
        })),
      },
    },
    include: { tasks: true },
  });

  return NextResponse.json({ item, mode: process.env.OPENAI_API_KEY ? "ai" : "rules" });
}
