import { Spinner } from "@/components/ui/Spinner";

export default function DashboardLoading() {
  return (
    <div className="flex items-center gap-3 text-slate-400">
      <Spinner className="h-5 w-5" />
      Loading workspace...
    </div>
  );
}
