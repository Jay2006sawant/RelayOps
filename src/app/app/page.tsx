"use client";

import Link from "next/link";
import { useInitiativesContext } from "@/components/InitiativesProvider";
import { initiativeProgress } from "@/lib/planGenerator";

export default function DashboardPage() {
  const { items, ready, remove } = useInitiativesContext();

  if (!ready) {
    return <p className="text-slate-600">Loading your initiatives...</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            {items.length === 0
              ? "No initiatives yet. Create your first plan."
              : `${items.length} initiative${items.length === 1 ? "" : "s"} in progress`}
          </p>
        </div>
        <Link
          href="/app/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          New plan
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-600">Paste customer feedback to generate a structured plan.</p>
          <Link href="/app/new" className="mt-4 inline-block text-indigo-600 hover:underline">
            Start with New plan
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((item) => {
            const progress = initiativeProgress(item);
            return (
              <li
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/app/${item.id}`}
                      className="text-lg font-semibold text-slate-900 hover:text-indigo-600"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.summary}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Updated {new Date(item.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">{progress}%</p>
                    <p className="text-xs text-slate-500">complete</p>
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-4 flex gap-3 text-sm">
                  <Link href={`/app/${item.id}`} className="text-indigo-600 hover:underline">
                    Open
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="text-rose-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
