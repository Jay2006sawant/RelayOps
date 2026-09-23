"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";

const SAMPLE =
  "Enterprise trial users report SSO setup is unclear. Support tickets spiked 40% this week. Competitor X launched AI onboarding. We need a GTM one-pager and automated health checks before the next launch.";

export default function NewAnalysisPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Analysis failed");
        return;
      }
      router.push(`/dashboard/${data.item.id}`);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard" className="text-sm text-indigo-400 hover:underline">
        ← Back to overview
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Analyze feedback</h1>
      <p className="mt-2 text-sm text-slate-400 sm:text-base">
        Runs the LLM pipeline when OpenAI is configured, otherwise uses the built-in rules engine.
        Results are saved to your Postgres workspace.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-xs font-medium text-slate-400">Customer or internal notes</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            required
            minLength={12}
            disabled={loading}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-60"
            placeholder="Paste support threads, call notes, churn signals, or launch blockers..."
          />
          <span className="mt-1 block text-right text-xs text-slate-500">{text.length} characters</span>
        </label>

        {loading && (
          <div className="flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-200">
            <Spinner />
            Running analysis pipeline (NLP → tasks → persist)...
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading || text.length < 12}
            className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Processing..." : "Run AI analysis"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => setText(SAMPLE)}
            className="rounded-lg border border-slate-600 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50"
          >
            Load sample
          </button>
        </div>
        {error && (
          <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
