"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Spinner } from "@/components/ui/Spinner";
import { initiativeToMarkdown } from "@/lib/planGenerator";
import {
  feedbackItemToInitiative,
  type ActionTaskView,
  type FeedbackItemView,
} from "@/lib/types";

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [item, setItem] = useState<FeedbackItemView | null>(null);
  const [similar, setSimilar] = useState<{ id: string; title: string; score: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/feedback/${id}`);
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    if (data.item) {
      setItem(data.item as FeedbackItemView);
      setSimilar(data.similar ?? []);
    }
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleTask(taskId: string, done: boolean) {
    await fetch(`/api/feedback/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, done: !done }),
    });
    void load();
  }

  async function copyMarkdown() {
    if (!item) return;
    await navigator.clipboard.writeText(initiativeToMarkdown(feedbackItemToInitiative(item)));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <Spinner />
        Loading analysis...
      </div>
    );
  }

  if (!item) {
    return (
      <div>
        <p className="text-slate-400">Analysis not found.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-indigo-400 hover:underline">
          Back to overview
        </Link>
      </div>
    );
  }

  const doneCount = item.tasks.filter((t) => t.done).length;
  const pct = item.tasks.length ? Math.round((doneCount / item.tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="text-sm text-indigo-400 hover:underline">
        ← Back to overview
      </Link>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{item.title}</h1>
        <p className="mt-3 text-slate-300">{item.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.topics.map((t) => (
            <span
              key={t}
              className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs text-slate-500">Sentiment</p>
            <p className="mt-1 text-2xl font-semibold">{item.sentiment.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs text-slate-500">Urgency</p>
            <p className="mt-1 text-2xl font-semibold">{item.urgency}/10</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs text-slate-500">Progress</p>
            <p className="mt-1 text-2xl font-semibold">{pct}%</p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <button
          type="button"
          onClick={() => void copyMarkdown()}
          className="mt-4 rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
        >
          {copied ? "Copied Markdown" : "Copy Markdown export"}
        </button>
      </div>

      {similar.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm font-medium text-slate-200">Similar past feedback</p>
          <ul className="mt-2 space-y-2 text-sm">
            {similar.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center gap-2 text-slate-400">
                <Link href={`/dashboard/${s.id}`} className="text-indigo-400 hover:underline">
                  {s.title}
                </Link>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs">
                  {(s.score * 100).toFixed(0)}% match
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <section>
        <h2 className="text-lg font-semibold">Action plan</h2>
        <ul className="mt-4 space-y-3">
          {item.tasks.map((task: ActionTaskView) => (
            <li
              key={task.id}
              className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-slate-700"
            >
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id, task.done)}
                className="mt-1 h-4 w-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500/30"
              />
              <div className="min-w-0 flex-1">
                <p
                  className={
                    task.done ? "text-slate-500 line-through" : "font-medium text-slate-100"
                  }
                >
                  {task.title}
                </p>
                <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{task.ownerLane}</span>
                  <span>·</span>
                  <span>{task.dueHint}</span>
                  <PriorityBadge priority={task.priority as "high" | "medium" | "low"} />
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <details className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-300">Source notes</summary>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-400">
          {item.rawText}
        </p>
      </details>
    </div>
  );
}
