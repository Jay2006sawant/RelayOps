"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Insights = {
  total: number;
  avgSentiment: number;
  avgUrgency: number;
  topTopics: { name: string; count: number }[];
  volumeByWeek: { week: string; count: number }[];
};

export function InsightsCharts({ data }: { data: Insights }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 lg:col-span-1">
        <p className="text-sm text-slate-400">Avg sentiment</p>
        <p className="mt-2 text-3xl font-bold">{data.avgSentiment.toFixed(2)}</p>
        <p className="mt-4 text-sm text-slate-400">Avg urgency</p>
        <p className="text-2xl font-semibold">{data.avgUrgency.toFixed(1)} / 10</p>
        <p className="mt-4 text-sm text-slate-400">Total analyses</p>
        <p className="text-2xl font-semibold">{data.total}</p>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 lg:col-span-2">
        <p className="mb-4 text-sm font-medium text-slate-300">Topic frequency</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topTopics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 lg:col-span-3">
        <p className="mb-4 text-sm font-medium text-slate-300">Intake volume</p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.volumeByWeek}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
              <Line type="monotone" dataKey="count" stroke="#22d3ee" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
