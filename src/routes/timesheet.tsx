import { useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, User, Users, Printer, ChevronLeft } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Timesheet } from "@/components/Timesheet";
import { getStudents, type Student } from "@/lib/students";
import { PAY_PERIODS, findCurrentPayPeriod, type PayPeriod } from "@/data/payPeriods";

type Mode = "idle" | "period" | "student" | "all";

interface Sheet { student: Student; period: PayPeriod }

export default function TimesheetPage() {
  const students = getStudents();
  const currentPP = findCurrentPayPeriod() ?? PAY_PERIODS[0]!;

  const [mode, setMode] = useState<Mode>("idle");
  const [periodId, setPeriodId] = useState<number>(currentPP.id);
  const [studentIdx, setStudentIdx] = useState<number>(0);
  const [printSheets, setPrintSheets] = useState<Sheet[]>([]);

  const selectedPeriod = PAY_PERIODS.find(p => p.id === periodId) ?? PAY_PERIODS[0]!;

  function generate() {
    if (students.length === 0) return;
    let sheets: Sheet[];
    if (mode === "student") {
      const s = students[studentIdx];
      sheets = s ? [{ student: s, period: selectedPeriod }] : [];
    } else {
      sheets = students.map(s => ({ student: s, period: selectedPeriod }));
    }
    setPrintSheets(sheets);
    requestAnimationFrame(() => window.print());
  }

  return (
    <>
      {createPortal(
        <div id="print-portal">
          {printSheets.map((sheet, i) => (
            <div key={i} className={i < printSheets.length - 1 ? "ts-print-break" : ""}>
              <Timesheet student={sheet.student} period={sheet.period} />
            </div>
          ))}
        </div>,
        document.body
      )}

      <DashboardLayout title="Timesheet" subtitle="Generate official CT State pay period timesheets">
        {mode === "idle" ? (
          /* ── Action buttons ── */
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-6">
              Choose how to generate timesheets. All timesheets use the official CT State WAVE form
              with HB 3500 / WIOA Out Of School grant info pre-filled.
            </p>

            {students.length === 0 && (
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                No students enrolled yet. Add students on the <strong>Students</strong> tab first.
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <ActionCard
                icon={CalendarDays}
                title="Generate by Pay Period"
                description="Print timesheets for all students in a selected pay period."
                onClick={() => setMode("period")}
                disabled={students.length === 0}
              />
              <ActionCard
                icon={User}
                title="Generate for Student"
                description="Print a single student's timesheet for a selected pay period."
                onClick={() => setMode("student")}
                disabled={students.length === 0}
              />
              <ActionCard
                icon={Users}
                title="Generate All"
                description="Print all students for the current pay period in one batch."
                onClick={() => setMode("all")}
                disabled={students.length === 0}
              />
            </div>

            {/* Recent pay periods reference */}
            <div className="mt-8 rounded-xl border border-border bg-card p-5">
              <h3 className="font-display text-sm font-bold text-foreground mb-3">FY 2027 Pay Period Schedule</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                      <th className="pb-2 pr-6 font-semibold">PP</th>
                      <th className="pb-2 pr-6 font-semibold">Period</th>
                      <th className="pb-2 font-semibold">Payday</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {PAY_PERIODS.slice(0, 6).map(pp => {
                      const isCurrent = pp.id === currentPP.id;
                      return (
                        <tr key={pp.id} className={isCurrent ? "bg-accent/40" : "hover:bg-muted/30"}>
                          <td className="py-2 pr-6 font-semibold tabular-nums text-foreground">
                            {isCurrent && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gold" />}
                            PP {pp.id}
                          </td>
                          <td className="py-2 pr-6 text-muted-foreground tabular-nums">{pp.label.split(":")[1]?.split("—")[0]?.trim()}</td>
                          <td className="py-2 text-muted-foreground tabular-nums">{pp.label.split("Payday ")[1]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="mt-2 text-xs text-muted-foreground">Showing first 6 of 26 pay periods</p>
              </div>
            </div>
          </div>
        ) : (
          /* ── Configuration panel ── */
          <div className="max-w-lg">
            <button
              onClick={() => setMode("idle")}
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-base font-bold text-foreground mb-1">
                {mode === "period" && "Generate by Pay Period"}
                {mode === "student" && "Generate for Student"}
                {mode === "all" && "Generate All Students"}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {mode === "period" && `Print timesheets for all ${students.length} student${students.length !== 1 ? "s" : ""}.`}
                {mode === "student" && "Select a student and pay period."}
                {mode === "all" && `Print all ${students.length} student${students.length !== 1 ? "s" : ""} for the selected period.`}
              </p>

              <div className="space-y-4">
                {/* Student picker — only for 'student' mode */}
                {mode === "student" && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Student</label>
                    <select
                      value={studentIdx}
                      onChange={e => setStudentIdx(Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20"
                    >
                      {students.map((s, i) => (
                        <option key={i} value={i}>{s.name} — {s.department}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Pay period picker */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pay Period</label>
                  <select
                    value={periodId}
                    onChange={e => setPeriodId(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20"
                  >
                    {PAY_PERIODS.map(pp => (
                      <option key={pp.id} value={pp.id}>{pp.label}</option>
                    ))}
                  </select>
                </div>

                {/* Summary */}
                <div className="rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                  Will generate <strong className="text-foreground">
                    {mode === "student" ? 1 : students.length} timesheet{(mode !== "student" && students.length !== 1) ? "s" : ""}
                  </strong> for <strong className="text-foreground">{selectedPeriod.label.split(":")[1]?.split("—")[0]?.trim()}</strong>
                </div>

                <button
                  onClick={generate}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  Generate &amp; Print
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}

function ActionCard({
  icon: Icon, title, description, onClick, disabled,
}: {
  icon: typeof CalendarDays;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl border border-border bg-card p-5 text-left hover:border-gold/40 hover:bg-accent/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
    >
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-muted group-hover:bg-gold/10 transition-colors">
        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors" />
      </div>
      <div className="font-display text-sm font-bold text-foreground">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</div>
    </button>
  );
}
