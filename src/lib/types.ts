export type TaskPriority = "high" | "medium" | "low";

export type Task = {
  id: string;
  title: string;
  owner: string;
  priority: TaskPriority;
  done: boolean;
  dueHint: string;
};

export type Initiative = {
  id: string;
  title: string;
  summary: string;
  sourceText: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
};

/** Shape returned from `/api/feedback` and Prisma includes */
export type ActionTaskView = {
  id: string;
  title: string;
  ownerLane: string;
  priority: string;
  dueHint: string;
  done: boolean;
};

export type FeedbackItemView = {
  id: string;
  title: string;
  summary: string;
  rawText: string;
  sentiment: number;
  urgency: number;
  topics: string[];
  tasks: ActionTaskView[];
  createdAt: string;
};

export function feedbackItemToInitiative(item: FeedbackItemView): Initiative {
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    sourceText: item.rawText,
    createdAt:
      typeof item.createdAt === "string"
        ? item.createdAt
        : new Date(item.createdAt).toISOString(),
    updatedAt:
      typeof item.createdAt === "string"
        ? item.createdAt
        : new Date(item.createdAt).toISOString(),
    tasks: item.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      owner: t.ownerLane,
      priority: t.priority as TaskPriority,
      done: t.done,
      dueHint: t.dueHint,
    })),
  };
}

export type PlanDraft = {
  title: string;
  summary: string;
  tasks: Omit<Task, "id" | "done">[];
};
