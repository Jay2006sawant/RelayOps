import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

async function credentialsAction(formData: FormData) {
  "use server";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
}

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-xl font-bold text-white">Sign in to RelayOps</h1>
        <p className="mt-2 text-sm text-slate-400">
          Demo: demo@relayops.dev / RelayOps2026! (after database seed)
        </p>
        <form action={credentialsAction} className="mt-6 space-y-4">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-500 py-2 text-sm font-medium hover:bg-indigo-400"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
