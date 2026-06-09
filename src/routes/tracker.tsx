import { DashboardLayout } from "@/components/dashboard/Layout";

export default function TrackerPage() {
  return (
    <DashboardLayout title="Student Tracker">
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-sm text-center">
          <span className="inline-block rounded-full border border-gold/40 bg-accent/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold mb-6">
            Coming Fall 2026
          </span>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">Student Tracker</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Advanced attendance tracking, progress monitoring, and engagement analytics for WAVE students.
            Launching Fall 2026.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
