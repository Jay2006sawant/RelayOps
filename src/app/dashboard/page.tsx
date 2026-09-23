"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { InsightsCharts } from "@/components/InsightsCharts";
import { Spinner } from "@/components/ui/Spinner";

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

type Insights = {
  total: number;
  avgSentiment: number;
  avgUrgency: number;
  topTopics: { name: string; count: number }[];
  volumeByWeek: { week: string; count: number }[];
};

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [feedRes, insightRes] = await Promise.all([
        fetch("/api/feedback"),
        fetch("/api/insights"),
      ]);
      if (feedRes.status === 401 || insightRes.status === 401) {
        window.location.href = "/login";
        return;
      }
      const feed = await feedRes.json();
      const ins = await insightRes.json();
      if (!feedRes.ok) throw new Error(feed.error ?? "Failed to load analyses");
      setItems(feed.items ?? []);
      setInsights(ins);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Ops intelligence</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-400 sm:text-base">
            Live analytics on customer feedback stored in PostgreSQL with optional embedding search.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-400">
          <Spinner />
          Syncing data...
        </div>
      )}
      {error && (
        <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      {!loading && insights && <InsightsCharts data={insights} />}

      <section>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Recent analyses</h2>
          <Link href="/dashboard/new" className="text-sm text-indigo-400 hover:underline">
            + New
          </Link>
        </div>
        {!loading && items.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center">
            <p className="text-slate-400">No analyses yet. Run your first feedback pipeline.</p>
            <Link
              href="/dashboard/new"
              className="mt-4 inline-block rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
            >
              Analyze feedback
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {items.map((item) => {
              const done = item.tasks.filter((t) => t.done).length;
              const total = item.tasks.length;
              const pct = total ? Math.round((done / total) * 100) : 0;
              return (
                <li
                  key={item.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-indigo-500/50 hover:bg-slate-900/80"
                >
                  <Link href={`/dashboard/${item.id}`} className="block">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-medium text-white">{item.title}</h3>
                      <span className="text-xs text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-400">{item.summary}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                      <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">
                        Urgency {item.urgency}/10
                      </span>
                      <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">
                        Sentiment {item.sentiment.toFixed(2)}
                      </span>
                      <span className="text-indigo-300">{pct}% done</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
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
