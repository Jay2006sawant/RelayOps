import type { TaskPriority } from "@/lib/types";

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const styles =
    priority === "high"
      ? "bg-rose-100 text-rose-800"
      : priority === "medium"
        ? "bg-amber-100 text-amber-900"
        : "bg-slate-100 text-slate-700";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}>
      {priority}
    </span>
  );
}
