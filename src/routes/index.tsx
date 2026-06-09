import { useState, useEffect } from "react";
import { Users, Clock, BookOpen, UserPlus } from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { getStudents } from "@/lib/students";
import { findCurrentPayPeriod } from "@/data/payPeriods";
import { fetchStudentCount } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [studentCount, setStudentCount] = useState(() => getStudents().length);
  const navigate = useNavigate();
  const currentPP = findCurrentPayPeriod();

  useEffect(() => {
    fetchStudentCount().then((n) => {
      if (n !== null) setStudentCount(n);
    });
  }, []);

  const capacity = 30;
  const filled = Math.min(studentCount, capacity);
  const donutData = studentCount === 0
    ? [{ value: 1 }]
    : [{ value: filled }, { value: Math.max(0, capacity - filled) }];

  return (
    <DashboardLayout title="Dashboard" subtitle="WAVE Program · CT State Naugatuck Valley">

      {/* ── Stat row ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">

        {/* Donut card */}
        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-5">
          <div className="relative shrink-0">
            <PieChart width={96} height={96}>
              <Pie
                data={donutData}
                cx={44}
                cy={44}
                innerRadius={28}
                outerRadius={44}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {studentCount === 0 ? (
                  <Cell fill="#e2e8f0" />
                ) : (
                  <>
                    <Cell fill="#D4A030" />
                    <Cell fill="#e2e8f0" />
                  </>
                )}
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-display text-xl font-bold text-foreground leading-none">{studentCount}</span>
              <span className="text-[8px] font-medium uppercase tracking-wider text-muted-foreground mt-0.5">enrolled</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Students
            </div>
            <div className="font-display text-2xl font-bold text-foreground leading-none">{studentCount}</div>
            <div className="text-xs text-muted-foreground mt-1.5">WAVE Program</div>
          </div>
        </div>

        <StatCard
          icon={Clock}
          label="Current Pay Period"
          value={currentPP ? `PP ${currentPP.id}` : "—"}
          sub={currentPP?.label.split(":")[1]?.split("—")[0]?.trim() ?? ""}
        />
        <StatCard
          icon={BookOpen}
          label="Grant"
          value="HB 3500"
          sub="WIOA Out Of School"
        />
      </div>

      {/* ── Program info ── */}
      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-sm font-semibold text-foreground mb-4">Program Information</h2>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
          <InfoRow label="Program" value="WAVE" />
          <InfoRow label="Grant" value="WIOA Out Of School · HB 3500" />
          <InfoRow label="Coordinator" value="Tracy Mahar" />
          <InfoRow label="Institution" value="CT State Naugatuck Valley" />
          <InfoRow label="Fiscal Year" value="FY 2027" />
          <InfoRow label="Pay Periods" value="26 bi-weekly" />
        </dl>
      </div>

      {/* ── Empty state / Quick actions ── */}
      {studentCount === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full border border-border bg-card">
            <Users className="h-5 w-5 text-muted-foreground/60" strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-base font-semibold text-foreground">No students enrolled yet</h3>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-xs mx-auto">
            Add your first student to start generating timesheets and tracking attendance.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate("/students")}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              <UserPlus className="h-4 w-4" strokeWidth={1.5} />
              Add First Student
            </button>
            <button
              onClick={() => navigate("/timesheet")}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Generate Timesheet
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <QuickAction label="Add Student" desc="Enroll a new student" onClick={() => navigate("/students")} />
            <QuickAction label="Generate Timesheet" desc="Print official CT State form" onClick={() => navigate("/timesheet")} />
            <QuickAction label="View All Students" desc={`${studentCount} enrolled`} onClick={() => navigate("/students")} />
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, label, value, sub }: {
  icon: typeof Clock; label: string; value: string; sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-muted">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
        </div>
      </div>
      <div className="font-display text-2xl font-bold text-foreground leading-none">{value}</div>
      {sub && <div className="mt-1.5 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}

function QuickAction({ label, desc, onClick }: { label: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-border/60 bg-background px-4 py-3.5 text-left hover:border-gold/40 hover:bg-accent/20 transition-colors"
    >
      <div className="text-sm font-medium text-foreground">{label}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
    </button>
  );
}
