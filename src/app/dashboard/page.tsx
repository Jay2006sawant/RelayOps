"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { InsightsCharts } from "@/components/InsightsCharts";

type Task = { id: string; done: boolean };
type Item = {
  id: string;
  title: string;
  summary: string;
  urgency: number;
  sentiment: number;
  tasks: Task[];
  createdAt: string;
};

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [insights, setInsights] = useState<null | {
    total: number;
    avgSentiment: number;
    avgUrgency: number;
    topTopics: { name: string; count: number }[];
    volumeByWeek: { week: string; count: number }[];
  }>(null);

  useEffect(() => {
    void fetch("/api/feedback")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []));
    void fetch("/api/insights")
      .then((r) => r.json())
      .then((d) => setInsights(d));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Ops intelligence</h1>
        <p className="mt-1 text-slate-400">
          LLM-powered feedback triage with PostgreSQL persistence and similarity search.
        </p>
      </div>

      {insights && <InsightsCharts data={insights} />}

      <section>
        <h2 className="text-lg font-semibold">Recent analyses</h2>
        {items.length === 0 ? (
          <p className="mt-4 text-slate-400">
            No data yet.{" "}
            <Link href="/dashboard/new" className="text-indigo-400 hover:underline">
              Run your first analysis
            </Link>
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {items.map((item) => {
              const done = item.tasks.filter((t) => t.done).length;
              const total = item.tasks.length;
              const pct = total ? Math.round((done / total) * 100) : 0;
              return (
                <li
                  key={item.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-indigo-500/50"
                >
                  <Link href={`/dashboard/${item.id}`} className="block">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-medium">{item.title}</h3>
                      <span className="text-xs text-slate-400">
                        urgency {item.urgency}/10 · sentiment {item.sentiment.toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-400">{item.summary}</p>
                    <p className="mt-2 text-xs text-indigo-300">{pct}% tasks complete</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
