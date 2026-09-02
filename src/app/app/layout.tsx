import { SiteHeader } from "@/components/SiteHeader";
import { InitiativesProvider } from "@/components/InitiativesProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <InitiativesProvider>
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </InitiativesProvider>
  );
}
