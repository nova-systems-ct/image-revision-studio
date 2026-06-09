import { useState, useEffect } from "react";
import { Users, CalendarCheck2, TrendingUp, UserPlus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { getStudents } from "@/lib/students";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setStudentCount(getStudents().length);
  }, []);

  return (
    <DashboardLayout title="Dashboard" subtitle="WAVE Program · CT State Naugatuck Valley">
      {/* Stat row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <StatCard label="Students Enrolled" value={studentCount.toString()} icon={Users} />
        <StatCard label="Present Today" value="—" icon={CalendarCheck2} />
        <StatCard label="Attendance Rate" value="—" icon={TrendingUp} />
      </div>

      {/* Program info */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base font-bold text-foreground">Program Information</h2>
        </div>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoRow label="Program" value="WAVE" />
          <InfoRow label="Grant" value="WIOA Out Of School · HB 3500" />
          <InfoRow label="Coordinator" value="Tracy Mahar" />
          <InfoRow label="Institution" value="CT State Naugatuck Valley" />
          <InfoRow label="Fiscal Year" value="FY 2027" />
          <InfoRow label="Pay Periods" value="26 bi-weekly" />
        </dl>
      </div>

      {/* Empty state or quick actions */}
      {studentCount === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-muted">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">No students enrolled yet</h3>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-sm mx-auto">
            Add your first student to start generating timesheets and tracking attendance.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate("/students")}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Add First Student
            </button>
            <button
              onClick={() => navigate("/timesheet")}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Generate Timesheet
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-bold text-foreground">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <QuickAction label="Add Student" desc="Enroll a new student" onClick={() => navigate("/students")} />
            <QuickAction label="Generate Timesheet" desc="Print official CT State form" onClick={() => navigate("/timesheet")} />
            <QuickAction label="View All Students" desc={`${studentCount} enrolled`} onClick={() => navigate("/students")} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Users }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="mt-3 font-display text-3xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function QuickAction({ label, desc, onClick }: { label: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-border bg-background p-4 text-left hover:border-gold/50 hover:bg-accent/30 transition-colors group"
    >
      <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{label}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
    </button>
  );
}
