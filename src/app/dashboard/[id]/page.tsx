"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  ownerLane: string;
  priority: string;
  dueHint: string;
  done: boolean;
};

type Item = {
  id: string;
  title: string;
  summary: string;
  rawText: string;
  sentiment: number;
  urgency: number;
  topics: string[];
  tasks: Task[];
};

export default function AnalysisDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<Item | null>(null);
  const [similar, setSimilar] = useState<{ id: string; title: string; score: number }[]>([]);

  const load = useCallback(async () => {
    const res = await fetch(`/api/feedback/${id}`);
    const data = await res.json();
    if (data.item) {
      setItem(data.item);
      setSimilar(data.similar ?? []);
    }
  }, [id]);

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

  if (!item) {
    return <p className="text-slate-400">Loading analysis...</p>;
  }

  const doneCount = item.tasks.filter((t) => t.done).length;
  const pct = item.tasks.length ? Math.round((doneCount / item.tasks.length) * 100) : 0;

  return (
    <div>
      <Link href="/dashboard" className="text-sm text-indigo-400 hover:underline">Back</Link>
      <h1 className="mt-4 text-2xl font-bold">{item.title}</h1>
      <p className="mt-2 text-slate-300">{item.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {item.topics.map((t) => (
          <span key={t} className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">{t}</span>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-400">
        Sentiment {item.sentiment.toFixed(2)} · Urgency {item.urgency}/10 · {pct}% complete
      </p>

      {similar.length > 0 && (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm font-medium text-slate-200">Similar past feedback (embeddings)</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-400">
            {similar.map((s) => (
              <li key={s.id}>
                <Link href={`/dashboard/${s.id}`} className="text-indigo-400 hover:underline">
                  {s.title}
                </Link>
                <span className="ml-2">({(s.score * 100).toFixed(0)}% match)</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="mt-8 space-y-3">
        {item.tasks.map((task) => (
          <li key={task.id} className="flex gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id, task.done)}
              className="mt-1"
            />
            <div>
              <p className={task.done ? "text-slate-500 line-through" : ""}>{task.title}</p>
              <p className="mt-1 text-xs text-slate-500">
                {task.ownerLane} · {task.priority} · {task.dueHint}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <details className="mt-8 rounded-lg border border-slate-800 p-4">
        <summary className="cursor-pointer text-sm text-slate-300">Source text</summary>
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-400">{item.rawText}</p>
      </details>
    </div>
  );
}
