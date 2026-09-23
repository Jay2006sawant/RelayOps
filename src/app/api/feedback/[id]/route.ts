import { auth } from "@/auth";
import { cosineSimilarity } from "@/lib/similarity";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const item = await prisma.feedbackItem.findFirst({
    where: { id, userId: session.user.id },
    include: { tasks: { orderBy: { sortOrder: "asc" } } },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let similar: { id: string; title: string; score: number }[] = [];
  if (item.embedding && Array.isArray(item.embedding)) {
    const vec = item.embedding as number[];
    const others = await prisma.feedbackItem.findMany({
      where: { userId: session.user.id, NOT: { id: item.id } },
      select: { id: true, title: true, embedding: true },
      take: 20,
    });
    similar = others
      .map((o) => {
        if (!o.embedding || !Array.isArray(o.embedding)) return null;
        return {
          id: o.id,
          title: o.title,
          score: cosineSimilarity(vec, o.embedding as number[]),
        };
      })
      .filter((x): x is { id: string; title: string; score: number } => x !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  return NextResponse.json({ item, similar });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as { taskId?: string; done?: boolean };
  if (!body.taskId || typeof body.done !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const item = await prisma.feedbackItem.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.actionTask.updateMany({
    where: { id: body.taskId, feedbackItemId: id },
    data: { done: body.done },
  });

  const updated = await prisma.feedbackItem.findUnique({
    where: { id },
    include: { tasks: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json({ item: updated });
}
