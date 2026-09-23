"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
      if (!res.ok) {
        setError(data.error ?? "Analysis failed");
        return;
      }
      router.push(`/dashboard/${data.item.id}`);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Analyze feedback</h1>
      <p className="mt-1 text-slate-400">
        Uses OpenAI when configured, with rule-based fallback. Stores results in PostgreSQL with
        optional embeddings for similarity.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          required
          minLength={12}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
          placeholder="Paste customer feedback, call notes, or GTM ideas..."
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 disabled:opacity-60"
          >
            {loading ? "Running pipeline..." : "Run AI analysis"}
          </button>
          <button
            type="button"
            onClick={() => setText(SAMPLE)}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
          >
            Load sample
          </button>
        </div>
        {error && <p className="text-sm text-rose-400">{error}</p>}
      </form>
    </div>
  );
}
