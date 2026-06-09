import { DashboardLayout } from "@/components/dashboard/Layout";
import { LineChart } from "lucide-react";

export default function TrackerPage() {
  return (
    <DashboardLayout title="Student Tracker">
      <div className="flex min-h-[52vh] items-center justify-center">
        <div className="text-center max-w-xs">
          <div className="mx-auto mb-5 grid h-11 w-11 place-items-center rounded-xl border border-border bg-card">
            <LineChart className="h-5 w-5 text-muted-foreground/50" strokeWidth={1.5} />
          </div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Coming Soon</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Attendance tracking and progress monitoring for WAVE students.
          </p>
          <div className="mt-5 inline-block rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70">
            Fall 2026
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
