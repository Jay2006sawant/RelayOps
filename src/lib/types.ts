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

export type PlanDraft = {
  title: string;
  summary: string;
  tasks: Omit<Task, "id" | "done">[];
};
