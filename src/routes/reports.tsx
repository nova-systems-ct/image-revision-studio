import { DashboardLayout } from "@/components/dashboard/Layout";
import { programs } from "@/components/dashboard/data";

export default function ReportsPage() {
  return (
    <DashboardLayout title="Reports" subtitle="Program participation snapshot">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((p) => (
          <div key={p.name} className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{p.name}</div>
            <div className="mt-2 font-display text-3xl font-bold">{p.count}</div>
            <div className="mt-3 h-2 rounded-full bg-muted">
              <div className="h-full rounded-full bg-gold" style={{ width: `${p.pct}%` }} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{p.pct}% of capacity</div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
