import OpenAI from "openai";
import { z } from "zod";

const analysisSchema = z.object({
  title: z.string(),
  summary: z.string(),
  sentiment: z.number().min(-1).max(1),
  urgency: z.number().int().min(1).max(10),
  topics: z.array(z.string()).max(8),
  tasks: z.array(
    z.object({
      title: z.string(),
      ownerLane: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      dueHint: z.string(),
    }),
  ),
});

export type AnalysisResult = z.infer<typeof analysisSchema>;

function ruleBasedAnalysis(text: string): AnalysisResult {
  const lines = text
    .split(/[\n.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);
  const urgent = /\b(urgent|asap|churn|outage|angry)\b/i.test(text);
  return {
    title: lines[0]?.slice(0, 80) ?? "Customer feedback intake",
    summary: lines.slice(0, 2).join(". ") || "Structured from submitted notes.",
    sentiment: urgent ? -0.4 : 0.2,
    urgency: urgent ? 8 : 5,
    topics: ["onboarding", "product", "support"].slice(0, 2),
    tasks: (lines.length ? lines : [text]).slice(0, 6).map((line, i) => ({
      title: line.charAt(0).toUpperCase() + line.slice(1),
      ownerLane: i % 2 === 0 ? "Product" : "Ops",
      priority: urgent && i === 0 ? "high" : "medium",
      dueHint: i === 0 ? "This week" : "Next 2 weeks",
    })),
  };
}

export async function analyzeFeedback(text: string): Promise<AnalysisResult> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return ruleBasedAnalysis(text);

  const client = new OpenAI({ apiKey: key });
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are an ops analyst for a growth-stage SaaS startup. Return JSON only with keys: title, summary, sentiment (-1 to 1), urgency (1-10), topics (string array), tasks (array of {title, ownerLane, priority, dueHint}).",
      },
      { role: "user", content: text.slice(0, 6000) },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) return ruleBasedAnalysis(text);
  try {
    return analysisSchema.parse(JSON.parse(raw));
  } catch {
    return ruleBasedAnalysis(text);
  }
}

export async function embedText(text: string): Promise<number[] | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const client = new OpenAI({ apiKey: key });
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000),
  });
  return res.data[0]?.embedding ?? null;
}
