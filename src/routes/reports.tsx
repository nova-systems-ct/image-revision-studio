import { DashboardLayout } from "@/components/dashboard/Layout";
import { getStudents } from "@/lib/students";

export default function ReportsPage() {
  const count = getStudents().length;

  return (
    <DashboardLayout title="Reports" subtitle="WAVE program overview">
      {/* Program stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Students Enrolled" value={count.toString()} />
        <StatCard label="Grant" value="HB 3500" />
        <StatCard label="Program" value="WIOA Out Of School" />
      </div>

      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <h3 className="font-display text-sm font-bold text-foreground mb-4">WAVE Program Summary</h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Row label="Program Name" value="WAVE" />
          <Row label="Institution" value="CT State Naugatuck Valley" />
          <Row label="Coordinator" value="Tracy Mahar" />
          <Row label="Account No." value="HB 3500" />
          <Row label="Grant Title" value="WIOA Out Of School" />
          <Row label="Percentage" value="100%" />
          <Row label="Fiscal Year" value="FY 2027" />
          <Row label="Students" value={count > 0 ? count.toString() : "None enrolled"} />
        </dl>
      </div>

      {/* Coming soon */}
      <div className="rounded-xl border-2 border-dashed border-border bg-card/30 p-10 text-center">
        <span className="inline-block rounded-full border border-gold/40 bg-accent/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold mb-4">
          Coming Fall 2026
        </span>
        <h3 className="font-display text-lg font-bold text-foreground mb-2">Advanced Reports</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Attendance analytics, pay period summaries, and export tools coming soon.
        </p>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
