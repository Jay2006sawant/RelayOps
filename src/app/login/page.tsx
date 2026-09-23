import { auth, signIn } from "@/auth";
import { LoginForm } from "@/components/LoginForm";
import Link from "next/link";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function credentialsAction(formData: FormData) {
  "use server";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=CredentialsSignin");
    }
    throw error;
  }
}

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          ← Back to home
        </Link>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-sm font-bold">
              AI
            </span>
            <div>
              <h1 className="text-lg font-bold text-white">RelayOps Intelligence</h1>
              <p className="text-xs text-slate-400">Secure ops workspace</p>
            </div>
          </div>
          <Suspense>
            <LoginForm action={credentialsAction} />
          </Suspense>
          <p className="mt-6 rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-400">
            Demo account: <span className="text-slate-200">demo@relayops.dev</span> /{" "}
            <span className="text-slate-200">RelayOps2026!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
