import { NextResponse } from "next/server";
import { buildPlanDraft } from "@/lib/planGenerator";
import type { PlanDraft } from "@/lib/types";

async function planWithOpenAI(sourceText: string): Promise<PlanDraft | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const prompt = `You turn messy customer feedback into a JSON execution plan for a startup team.
Return ONLY valid JSON with keys: title (string), summary (string), tasks (array of {title, owner, priority, dueHint}).
priority must be high, medium, or low. Keep 5 to 8 tasks. No markdown.

Input:
${sourceText.slice(0, 4000)}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) return null;
  try {
    const parsed = JSON.parse(content) as PlanDraft;
    if (!parsed.title || !Array.isArray(parsed.tasks)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let body: { text?: string };
  try {
    body = (await request.json()) as { text?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = body.text?.trim() ?? "";
  if (text.length < 12) {
    return NextResponse.json(
      { error: "Add at least a few words of feedback or notes." },
      { status: 400 },
    );
  }

  const aiPlan = await planWithOpenAI(text);
  const plan = aiPlan ?? buildPlanDraft(text);

  return NextResponse.json({
    plan,
    mode: aiPlan ? "ai" : "rules",
  });
}
