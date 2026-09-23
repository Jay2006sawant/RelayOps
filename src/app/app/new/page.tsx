"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useInitiativesContext } from "@/components/InitiativesProvider";
import { buildInitiativeFromText, draftToInitiative } from "@/lib/planGenerator";
import type { PlanDraft } from "@/lib/types";

const SAMPLE =
  "Customers say onboarding is confusing after signup. Billing page loads slowly. We need a competitor scan and a clearer GTM one-pager before next launch.";

export default function NewPlanPage() {
  const router = useRouter();
  const { add } = useInitiativesContext();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let initiative;
      try {
        const res = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const data = (await res.json()) as { plan?: PlanDraft; error?: string };
        if (res.ok && data.plan) {
          initiative = draftToInitiative(text, data.plan);
        }
      } catch {
        initiative = undefined;
      }
      if (!initiative) {
        initiative = buildInitiativeFromText(text);
      }
      add(initiative);
      router.push(`/app/${initiative.id}`);
    } catch {
      setError("Could not generate plan. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">New execution plan</h1>
      <p className="mt-1 text-sm text-slate-600">
        Paste feedback or notes. RelayOps structures tasks with owners and priorities.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-800">Input</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            required
            minLength={12}
            placeholder="Customer feedback, meeting notes, or launch ideas..."
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate plan"}
          </button>
          <button
            type="button"
            onClick={() => setText(SAMPLE)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Load sample
          </button>
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
      </form>
    </div>
  );
}
