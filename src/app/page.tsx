import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <span className="font-semibold">RelayOps Intelligence</span>
        <div className="flex gap-3 text-sm">
          <Link href="/login" className="text-slate-300 hover:text-white">Sign in</Link>
          <Link href="/dashboard" className="rounded-lg bg-indigo-500 px-3 py-2 font-medium hover:bg-indigo-400">
            Dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10">
        <p className="text-indigo-400 text-sm font-medium">AI + PostgreSQL + AWS-ready</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          Customer feedback intelligence for founder-led teams
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Ingest messy notes, run LLM analysis (sentiment, urgency, topics), generate owned
          action plans, and find similar past feedback with embeddings. Built on Next.js 15,
          Prisma, OpenAI, and PostgreSQL on AWS RDS.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["LLM analysis", "GPT-4o-mini structured JSON with Zod validation"],
            ["ML signals", "Sentiment score, urgency index, topic clustering"],
            ["Vector search", "text-embedding-3-small similarity across history"],
            ["AWS data layer", "Terraform for RDS PostgreSQL 16"],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-slate-400">{body}</p>
            </div>
          ))}
        </div>
        <Link
          href="/login"
          className="mt-10 inline-block rounded-lg bg-indigo-500 px-6 py-3 font-medium hover:bg-indigo-400"
        >
          Launch dashboard
        </Link>
      </main>
    </div>
  );
}
