import { useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, User, Users, Printer, ChevronLeft, PencilLine } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Timesheet, type TimeEntry } from "@/components/Timesheet";
import { getStudents, type Student } from "@/lib/students";
import { PAY_PERIODS, findCurrentPayPeriod, type PayPeriod, getPayPeriodDays } from "@/data/payPeriods";
import { logTimesheetGenerated } from "@/lib/supabase";

type Mode = "idle" | "period" | "student" | "all" | "edit";

interface Sheet { student: Student; period: PayPeriod; entries?: TimeEntry[] }

const emptyEntry = (): TimeEntry => ({ amIn: "", amOut: "", meal: "", pmIn: "", pmOut: "" });

export default function TimesheetPage() {
  const students = getStudents();
  const currentPP = findCurrentPayPeriod() ?? PAY_PERIODS[0]!;

  const [mode, setMode] = useState<Mode>("idle");
  const [periodId, setPeriodId] = useState<number>(currentPP.id);
  const [studentIdx, setStudentIdx] = useState<number>(0);
  const [printSheets, setPrintSheets] = useState<Sheet[]>([]);
  const [editEntries, setEditEntries] = useState<TimeEntry[]>(() => Array.from({ length: 14 }, emptyEntry));

  const selectedPeriod = PAY_PERIODS.find(p => p.id === periodId) ?? PAY_PERIODS[0]!;

  /* Compute the sheets to display inline (react to selector changes) */
  function getSheets(withEntries?: TimeEntry[]): Sheet[] {
    if (mode === "student" || mode === "edit") {
      const s = students[studentIdx];
      return s ? [{ student: s, period: selectedPeriod, entries: withEntries }] : [];
    }
    return students.map(s => ({ student: s, period: selectedPeriod }));
  }

  const inlineSheets = mode !== "idle" ? getSheets(mode === "edit" ? editEntries : undefined) : [];

  async function handlePrint() {
    const entries = mode === "edit" ? editEntries : undefined;
    const sheets = getSheets(entries);
    setPrintSheets(sheets);
    for (const s of sheets) {
      logTimesheetGenerated({
        student_name: s.student.name,
        pay_period_id: s.period.id,
        generated_at: new Date().toISOString(),
      });
    }
    requestAnimationFrame(() => window.print());
  }

  function updateEntry(dayIndex: number, field: keyof TimeEntry, value: string) {
    setEditEntries(prev => prev.map((e, i) => i === dayIndex ? { ...e, [field]: value } : e));
  }

  const sel = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20";

  return (
    <>
      {/* Print portal — populated only when printing */}
      {createPortal(
        <div id="print-portal" className="print-portal">
          {printSheets.map((sheet, i) => (
            <div key={i} className={i < printSheets.length - 1 ? "ts-print-break" : ""}>
              <Timesheet student={sheet.student} period={sheet.period} entries={sheet.entries} />
            </div>
          ))}
        </div>,
        document.body
      )}

      <DashboardLayout
        title="Timesheet"
        subtitle={mode === "idle" ? "Generate official CT State pay period timesheets" : undefined}
      >

        {/* ── IDLE: 4 cards ── */}
        {mode === "idle" && (
          <div>
            {students.length === 0 && (
              <div className="mb-5 rounded-lg border border-amber-200/60 bg-amber-50/60 px-4 py-3 text-sm text-amber-700">
                No students enrolled. Add students on the <strong>Students</strong> tab first.
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <TSCard
                icon={CalendarDays}
                title="By Pay Period"
                description="Print timesheets for all students in a selected pay period."
                action="Select Period →"
                onClick={() => setMode("period")}
                disabled={students.length === 0}
              />
              <TSCard
                icon={User}
                title="For Student"
                description="Print a single student's timesheet for a selected pay period."
                action="Select Student →"
                onClick={() => setMode("student")}
                disabled={students.length === 0}
              />
              <TSCard
                icon={Users}
                title="Generate All"
                description="Print all students for the current pay period in one batch."
                action="Generate Now →"
                onClick={() => setMode("all")}
                disabled={students.length === 0}
              />
              <TSCard
                icon={PencilLine}
                title="Edit Timesheet"
                description="Manually enter hours for a student before printing."
                action="Open Form →"
                onClick={() => setMode("edit")}
                disabled={students.length === 0}
                accent
              />
            </div>

            {/* Pay period reference */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">FY 2027 Pay Period Schedule</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="pb-2 pr-6 font-medium">PP</th>
                    <th className="pb-2 pr-6 font-medium">Period</th>
                    <th className="pb-2 font-medium">Payday</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {PAY_PERIODS.slice(0, 6).map(pp => {
                    const isCurrent = pp.id === currentPP.id;
                    return (
                      <tr key={pp.id} className={isCurrent ? "bg-accent/40" : "hover:bg-muted/20"}>
                        <td className="py-2 pr-6 tabular-nums text-foreground font-medium text-sm">
                          {isCurrent && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gold align-middle" />}
                          PP {pp.id}
                        </td>
                        <td className="py-2 pr-6 text-muted-foreground tabular-nums text-sm">{pp.label.split(":")[1]?.split("—")[0]?.trim()}</td>
                        <td className="py-2 text-muted-foreground tabular-nums text-sm">{pp.label.split("Payday ")[1]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-muted-foreground">Showing first 6 of 26 pay periods</p>
            </div>
          </div>
        )}

        {/* ── GENERATE MODES: period / student / all ── */}
        {(mode === "period" || mode === "student" || mode === "all") && (
          <div>
            {/* Top bar */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setMode("idle")}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                Back
              </button>

              {mode === "student" && (
                <select
                  value={studentIdx}
                  onChange={e => setStudentIdx(Number(e.target.value))}
                  className={sel + " w-auto"}
                >
                  {students.map((s, i) => (
                    <option key={i} value={i}>{s.name}</option>
                  ))}
                </select>
              )}

              {(mode === "period" || mode === "student") && (
                <select
                  value={periodId}
                  onChange={e => setPeriodId(Number(e.target.value))}
                  className={sel + " w-auto"}
                >
                  {PAY_PERIODS.map(pp => (
                    <option key={pp.id} value={pp.id}>{pp.label}</option>
                  ))}
                </select>
              )}

              {mode === "all" && (
                <span className="text-sm text-muted-foreground">
                  {selectedPeriod.label.split(":")[1]?.split("—")[0]?.trim()} · {students.length} student{students.length !== 1 ? "s" : ""}
                </span>
              )}

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors ml-auto"
              >
                <Printer className="h-4 w-4" strokeWidth={1.5} />
                Print
              </button>
            </div>

            {/* Rendered timesheet — immediate, no extra step */}
            <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
              {inlineSheets.map((sheet, i) => (
                <div key={i} className={i > 0 ? "border-t border-gray-200" : ""}>
                  <Timesheet student={sheet.student} period={sheet.period} />
                </div>
              ))}
              {inlineSheets.length === 0 && (
                <div className="p-12 text-center text-sm text-muted-foreground">No students to display.</div>
              )}
            </div>
          </div>
        )}

        {/* ── EDIT MODE ── */}
        {mode === "edit" && (
          <div>
            {/* Top bar */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setMode("idle")}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                Back
              </button>
              <select
                value={studentIdx}
                onChange={e => setStudentIdx(Number(e.target.value))}
                className={sel + " w-auto"}
              >
                {students.map((s, i) => (
                  <option key={i} value={i}>{s.name}</option>
                ))}
              </select>
              <select
                value={periodId}
                onChange={e => {
                  setPeriodId(Number(e.target.value));
                  setEditEntries(Array.from({ length: 14 }, emptyEntry));
                }}
                className={sel + " w-auto"}
              >
                {PAY_PERIODS.map(pp => (
                  <option key={pp.id} value={pp.id}>{pp.label}</option>
                ))}
              </select>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors ml-auto"
              >
                <Printer className="h-4 w-4" strokeWidth={1.5} />
                Print
              </button>
            </div>

            {/* Edit hours table */}
            <EditTable
              selectedPeriod={selectedPeriod}
              entries={editEntries}
              onEntryChange={updateEntry}
            />

            {/* Live preview */}
            <div className="mt-6">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Live Preview</div>
              <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
                {inlineSheets.map((sheet, i) => (
                  <Timesheet key={i} student={sheet.student} period={sheet.period} entries={sheet.entries} />
                ))}
              </div>
            </div>
          </div>
        )}

      </DashboardLayout>
    </>
  );
}

/* ── Card ── */
function TSCard({ icon: Icon, title, description, action, onClick, disabled, accent }: {
  icon: typeof CalendarDays;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
  disabled?: boolean;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border bg-card p-5 flex flex-col transition-all ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:border-gold/30 hover:shadow-sm"} ${accent ? "border-gold/20" : "border-border"}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className={`mb-3 grid h-9 w-9 place-items-center rounded-lg ${accent ? "bg-gold/10" : "bg-muted"}`}>
        <Icon className={`h-4 w-4 ${accent ? "text-gold" : "text-muted-foreground"}`} strokeWidth={1.5} />
      </div>
      <div className="font-display text-sm font-semibold text-foreground mb-1">{title}</div>
      <div className="text-xs text-muted-foreground leading-relaxed flex-1">{description}</div>
      <div className={`mt-4 text-xs font-medium ${accent ? "text-gold" : "text-primary"}`}>{action}</div>
    </div>
  );
}

/* ── Edit hours table ── */
function EditTable({ selectedPeriod, entries, onEntryChange }: {
  selectedPeriod: PayPeriod;
  entries: TimeEntry[];
  onEntryChange: (i: number, field: keyof TimeEntry, value: string) => void;
}) {
  const { week1, week2 } = getPayPeriodDays(selectedPeriod);
  const allDays = [...week1, ...week2];
  const inp = "w-full rounded border border-border/60 bg-background px-1 py-1 text-xs text-center text-foreground focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/20";
  const th = "py-2 px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground text-center whitespace-nowrap";

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className={th + " text-left"}>Day</th>
              <th className={th + " text-left"}>Date</th>
              <th className={th}>AM In</th>
              <th className={th}>AM Out</th>
              <th className={th}>Meal</th>
              <th className={th}>PM In</th>
              <th className={th}>PM Out</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {allDays.map((day, i) => (
              <>
                {i === 7 && (
                  <tr key="sub1" className="bg-muted/30">
                    <td colSpan={7} className="py-1.5 px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Week 1 Sub Total
                    </td>
                  </tr>
                )}
                <tr key={`day-${i}`} className={i >= 7 ? "bg-muted/[0.06]" : ""}>
                  <td className="py-1.5 px-3 text-xs font-medium text-foreground">{day.dayName}</td>
                  <td className="py-1.5 px-3 text-xs text-muted-foreground">{day.formatted}</td>
                  {(["amIn", "amOut", "meal", "pmIn", "pmOut"] as (keyof TimeEntry)[]).map(field => (
                    <td key={field} className="py-1 px-2">
                      <input
                        type="text"
                        placeholder="—"
                        value={entries[i]?.[field] ?? ""}
                        onChange={e => onEntryChange(i, field, e.target.value)}
                        className={inp}
                      />
                    </td>
                  ))}
                </tr>
              </>
            ))}
            <tr className="bg-muted/30">
              <td colSpan={7} className="py-1.5 px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Week 2 Sub Total
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
