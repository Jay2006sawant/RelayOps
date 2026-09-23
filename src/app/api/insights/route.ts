import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.feedbackItem.findMany({
    where: { userId: session.user.id },
    select: { sentiment: true, urgency: true, topics: true, createdAt: true },
  });

  const topicCounts: Record<string, number> = {};
  let sentimentSum = 0;
  let urgencySum = 0;
  for (const item of items) {
    sentimentSum += item.sentiment;
    urgencySum += item.urgency;
    for (const t of item.topics) {
      topicCounts[t] = (topicCounts[t] ?? 0) + 1;
    }
  }

  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  const byWeek = items.reduce<Record<string, number>>((acc, item) => {
    const d = new Date(item.createdAt);
    const key = `${d.getUTCFullYear()}-W${Math.ceil(d.getUTCDate() / 7)}`;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    total: items.length,
    avgSentiment: items.length ? sentimentSum / items.length : 0,
    avgUrgency: items.length ? urgencySum / items.length : 0,
    topTopics,
    volumeByWeek: Object.entries(byWeek).map(([week, count]) => ({ week, count })),
  });
}
