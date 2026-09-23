import type { TaskPriority } from "@/lib/types";
import { cn } from "@/lib/cn";

export function PriorityBadge({ priority }: { priority: TaskPriority | string }) {
  const p = priority as TaskPriority;
  const styles =
    p === "high"
      ? "border-rose-500/40 bg-rose-500/15 text-rose-200"
      : p === "medium"
        ? "border-amber-500/40 bg-amber-500/15 text-amber-200"
        : "border-slate-600 bg-slate-800 text-slate-300";
  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium capitalize", styles)}>
      {priority}
    </span>
  );
}
