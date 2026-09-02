"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PriorityBadge } from "@/components/PriorityBadge";
import { useInitiativesContext } from "@/components/InitiativesProvider";
import { initiativeProgress, initiativeToMarkdown } from "@/lib/planGenerator";

export default function InitiativeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { items, update } = useInitiativesContext();
  const initiative = useMemo(() => items.find((i) => i.id === id), [items, id]);
  const [copied, setCopied] = useState(false);

  if (!initiative) {
    return (
      <div>
        <p className="text-slate-600">Initiative not found.</p>
        <Link href="/app" className="mt-4 inline-block text-indigo-600 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const item = initiative;
  const progress = initiativeProgress(item);

  function toggleTask(taskId: string) {
    update({
      ...item,
      tasks: item.tasks.map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t,
      ),
      updatedAt: new Date().toISOString(),
    });
  }

  async function copyMarkdown() {
    const md = initiativeToMarkdown(item);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <Link href="/app" className="text-sm text-indigo-600 hover:underline">
        Back to dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{item.title}</h1>
      <p className="mt-2 text-slate-600">{item.summary}</p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div>
          <span className="text-3xl font-bold text-indigo-600">{progress}%</span>
          <span className="ml-2 text-sm text-slate-500">complete</span>
        </div>
        <button
          type="button"
          onClick={copyMarkdown}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          {copied ? "Copied" : "Copy Markdown"}
        </button>
      </div>

      <ul className="mt-8 space-y-3">
        {item.tasks.map((task) => (
          <li
            key={task.id}
            className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600"
            />
            <div className="min-w-0 flex-1">
              <p className={`font-medium ${task.done ? "text-slate-500 line-through" : "text-slate-900"}`}>
                {task.title}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{task.owner}</span>
                <span>·</span>
                <span>{task.dueHint}</span>
                <PriorityBadge priority={task.priority} />
              </p>
            </div>
          </li>
        ))}
      </ul>

      <details className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-800">
          Source notes
        </summary>
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">{item.sourceText}</p>
      </details>
    </div>
  );
}
