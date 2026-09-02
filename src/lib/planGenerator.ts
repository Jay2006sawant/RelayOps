import { newId } from "./id";
import type { Initiative, PlanDraft, Task, TaskPriority } from "./types";

const HIGH_WORDS =
  /\b(urgent|asap|blocker|churn|angry|outage|down|security|legal|refund|cancel)\b/i;
const MEDIUM_WORDS =
  /\b(onboard|billing|integration|bug|slow|confus|missing|help|support)\b/i;

function guessPriority(text: string): TaskPriority {
  if (HIGH_WORDS.test(text)) return "high";
  if (MEDIUM_WORDS.test(text)) return "medium";
  return "low";
}

function dueHintFor(priority: TaskPriority): string {
  if (priority === "high") return "This week";
  if (priority === "medium") return "Next 2 weeks";
  return "Backlog";
}

function splitSentences(raw: string): string[] {
  return raw
    .split(/[\n.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);
}

function titleFrom(raw: string): string {
  const firstLine = raw.split("\n").find((l) => l.trim().length > 0)?.trim();
  if (!firstLine) return "New initiative";
  const trimmed = firstLine.slice(0, 72);
  return trimmed.length < firstLine.length ? `${trimmed}...` : trimmed;
}

function summaryFrom(sentences: string[]): string {
  if (sentences.length === 0) {
    return "Structured plan generated from your notes.";
  }
  const head = sentences.slice(0, 2).join(". ");
  return head.endsWith(".") ? head : `${head}.`;
}

function taskFromSentence(sentence: string, index: number): Omit<Task, "id" | "done"> {
  const priority = guessPriority(sentence);
  const owner =
    index === 0 ? "Founders office" : index % 3 === 1 ? "Product" : index % 3 === 2 ? "Ops" : "Growth";
  return {
    title: sentence.charAt(0).toUpperCase() + sentence.slice(1),
    owner,
    priority,
    dueHint: dueHintFor(priority),
  };
}

const DEFAULT_TASKS: Omit<Task, "id" | "done">[] = [
  {
    title: "Confirm problem statement with one customer call",
    owner: "Founders office",
    priority: "high",
    dueHint: "This week",
  },
  {
    title: "List success metrics and owners for each workstream",
    owner: "Ops",
    priority: "medium",
    dueHint: "Next 2 weeks",
  },
  {
    title: "Draft lightweight rollout checklist for the team",
    owner: "Product",
    priority: "medium",
    dueHint: "Next 2 weeks",
  },
  {
    title: "Schedule review with leadership and capture decisions",
    owner: "Growth",
    priority: "low",
    dueHint: "Backlog",
  },
];

export function buildPlanDraft(sourceText: string): PlanDraft {
  const trimmed = sourceText.trim();
  const sentences = splitSentences(trimmed);
  const title = titleFrom(trimmed);
  const summary = summaryFrom(sentences);

  let taskSeeds: Omit<Task, "id" | "done">[];
  if (sentences.length >= 2) {
    taskSeeds = sentences.slice(0, 8).map(taskFromSentence);
  } else {
    taskSeeds = DEFAULT_TASKS.map((t) => ({
      ...t,
      priority: guessPriority(trimmed),
      dueHint: dueHintFor(guessPriority(trimmed)),
    }));
  }

  taskSeeds.unshift({
    title: "Triage input and assign a single DRI",
    owner: "Founders office",
    priority: "high",
    dueHint: "This week",
  });

  return { title, summary, tasks: taskSeeds.slice(0, 10) };
}

export function draftToInitiative(sourceText: string, draft: PlanDraft): Initiative {
  const now = new Date().toISOString();
  return {
    id: newId(),
    title: draft.title,
    summary: draft.summary,
    sourceText,
    tasks: draft.tasks.map((t) => ({
      ...t,
      id: newId(),
      done: false,
    })),
    createdAt: now,
    updatedAt: now,
  };
}

export function buildInitiativeFromText(sourceText: string): Initiative {
  return draftToInitiative(sourceText, buildPlanDraft(sourceText));
}

export function initiativeProgress(initiative: Initiative): number {
  if (initiative.tasks.length === 0) return 0;
  const done = initiative.tasks.filter((t) => t.done).length;
  return Math.round((done / initiative.tasks.length) * 100);
}

export function initiativeToMarkdown(initiative: Initiative): string {
  const lines = [
    `# ${initiative.title}`,
    "",
    initiative.summary,
    "",
    "## Tasks",
    "",
  ];
  for (const task of initiative.tasks) {
    const box = task.done ? "x" : " ";
    lines.push(
      `- [${box}] **${task.title}** (${task.priority}, ${task.owner}, ${task.dueHint})`,
    );
  }
  lines.push("", "## Source notes", "", initiative.sourceText, "");
  return lines.join("\n");
}
