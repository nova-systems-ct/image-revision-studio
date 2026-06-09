import { useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, User, Users, Printer, ChevronLeft, PencilLine, Eye } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Timesheet, type TimeEntry } from "@/components/Timesheet";
import { getStudents, type Student } from "@/lib/students";
import { PAY_PERIODS, findCurrentPayPeriod, type PayPeriod, getPayPeriodDays } from "@/data/payPeriods";
import { logTimesheetGenerated } from "@/lib/supabase";

type Mode = "idle" | "period" | "student" | "all" | "edit" | "preview";

interface Sheet { student: Student; period: PayPeriod; entries?: TimeEntry[] }

const emptyEntry = (): TimeEntry => ({ amIn: "", amOut: "", meal: "", pmIn: "", pmOut: "" });

export default function TimesheetPage() {
  const students = getStudents();
  const currentPP = findCurrentPayPeriod() ?? PAY_PERIODS[0]!;

  const [mode, setMode] = useState<Mode>("idle");
  const [periodId, setPeriodId] = useState<number>(currentPP.id);
  const [studentIdx, setStudentIdx] = useState<number>(0);
  const [printSheets, setPrintSheets] = useState<Sheet[]>([]);
  const [previewSheets, setPreviewSheets] = useState<Sheet[]>([]);
  const [editEntries, setEditEntries] = useState<TimeEntry[]>(() => Array.from({ length: 14 }, emptyEntry));

  const selectedPeriod = PAY_PERIODS.find(p => p.id === periodId) ?? PAY_PERIODS[0]!;

  function buildSheets(withEntries?: TimeEntry[]): Sheet[] {
    if (mode === "student" || mode === "edit") {
      const s = students[studentIdx];
      return s ? [{ student: s, period: selectedPeriod, entries: withEntries }] : [];
    }
    return students.map(s => ({ student: s, period: selectedPeriod }));
  }

  function handlePreview() {
    const entries = mode === "edit" ? editEntries : undefined;
    setPreviewSheets(buildSheets(entries));
    setMode("preview");
  }

  async function handlePrint(sheets: Sheet[]) {
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

  function goIdle() {
    setMode("idle");
  }

  const printPortal = createPortal(
    <div id="print-portal">
      {printSheets.map((sheet, i) => (
        <div key={i} className={i < printSheets.length - 1 ? "ts-print-break" : ""}>
          <Timesheet student={sheet.student} period={sheet.period} entries={sheet.entries} />
        </div>
      ))}
    </div>,
    document.body
  );

  return (
    <>
      {printPortal}
      <DashboardLayout
        title={mode === "preview" ? "Timesheet Preview" : "Timesheet"}
        subtitle={mode === "preview" ? undefined : "Generate official CT State pay period timesheets"}
      >

        {/* ── Idle: 4 cards ── */}
        {mode === "idle" && (
          <div>
            <p className="text-sm text-muted-foreground mb-6">
              Select a generation method. All timesheets use the official CT State WAVE form with HB 3500 pre-filled.
            </p>

            {students.length === 0 && (
              <div className="mb-6 rounded-lg border border-amber-200/60 bg-amber-50/60 px-4 py-3 text-sm text-amber-700">
                No students enrolled. Add students on the <strong>Students</strong> tab first.
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <TSCard
                icon={CalendarDays}
                title="By Pay Period"
                description="Print timesheets for all enrolled students in a selected pay period."
                action="Select Period"
                onClick={() => setMode("period")}
                disabled={students.length === 0}
              />
              <TSCard
                icon={User}
                title="For Student"
                description="Print a single student's timesheet for any pay period."
                action="Select Student"
                onClick={() => setMode("student")}
                disabled={students.length === 0}
              />
              <TSCard
                icon={Users}
                title="Generate All"
                description="Print all students for the current pay period in one batch."
                action="Generate All"
                onClick={() => setMode("all")}
                disabled={students.length === 0}
              />
              <TSCard
                icon={PencilLine}
                title="Edit Timesheet"
                description="Manually enter hours for a student before printing."
                action="Open Form"
                onClick={() => setMode("edit")}
                disabled={students.length === 0}
                accent
              />
            </div>

            {/* Pay period reference */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">FY 2027 Pay Period Schedule</h3>
              <div className="overflow-x-auto">
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
          </div>
        )}

        {/* ── Preview ── */}
        {mode === "preview" && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <button
                onClick={goIdle}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                Back
              </button>
              <button
                onClick={() => handlePrint(previewSheets)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              >
                <Printer className="h-4 w-4" strokeWidth={1.5} />
                Print
              </button>
            </div>
            <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
              {previewSheets.map((sheet, i) => (
                <div key={i} className={i > 0 ? "border-t border-gray-200" : ""}>
                  <Timesheet student={sheet.student} period={sheet.period} entries={sheet.entries} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Edit form ── */}
        {mode === "edit" && (
          <EditForm
            students={students}
            studentIdx={studentIdx}
            onStudentChange={setStudentIdx}
            periodId={periodId}
            onPeriodChange={(id) => {
              setPeriodId(id);
              setEditEntries(Array.from({ length: 14 }, emptyEntry));
            }}
            selectedPeriod={selectedPeriod}
            entries={editEntries}
            onEntryChange={updateEntry}
            onBack={goIdle}
            onPreview={handlePreview}
            onPrint={() => handlePrint(buildSheets(editEntries))}
          />
        )}

        {/* ── Config panel (period / student / all) ── */}
        {(mode === "period" || mode === "student" || mode === "all") && (
          <div className="max-w-md">
            <button onClick={goIdle} className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              Back
            </button>
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-base font-semibold text-foreground mb-1">
                {mode === "period" && "Generate by Pay Period"}
                {mode === "student" && "Generate for Student"}
                {mode === "all" && "Generate All Students"}
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                {mode === "period" && `Print timesheets for all ${students.length} student${students.length !== 1 ? "s" : ""}.`}
                {mode === "student" && "Select a student and pay period."}
                {mode === "all" && `Print all ${students.length} student${students.length !== 1 ? "s" : ""} for the selected period.`}
              </p>

              <div className="space-y-4">
                {mode === "student" && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Student</label>
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

                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Pay Period</label>
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

                <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                  Will generate{" "}
                  <strong className="text-foreground font-medium">
                    {mode === "student" ? 1 : students.length} timesheet{(mode !== "student" && students.length !== 1) ? "s" : ""}
                  </strong>{" "}
                  for{" "}
                  <strong className="text-foreground font-medium">{selectedPeriod.label.split(":")[1]?.split("—")[0]?.trim()}</strong>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePreview}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Eye className="h-4 w-4" strokeWidth={1.5} />
                    Preview
                  </button>
                  <button
                    onClick={() => handlePrint(buildSheets())}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                  >
                    <Printer className="h-4 w-4" strokeWidth={1.5} />
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </DashboardLayout>
    </>
  );
}

/* ── Timesheet card ── */
function TSCard({
  icon: Icon, title, description, action, onClick, disabled, accent,
}: {
  icon: typeof CalendarDays;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
  disabled?: boolean;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border bg-card p-5 flex flex-col transition-all ${disabled ? "opacity-40" : "hover:border-gold/30 hover:shadow-sm"} ${accent ? "border-gold/20" : "border-border"}`}>
      <div className={`mb-3 grid h-9 w-9 place-items-center rounded-lg ${accent ? "bg-gold/10" : "bg-muted"}`}>
        <Icon className={`h-4 w-4 ${accent ? "text-gold" : "text-muted-foreground"}`} strokeWidth={1.5} />
      </div>
      <div className="font-display text-sm font-semibold text-foreground mb-1">{title}</div>
      <div className="text-xs text-muted-foreground leading-relaxed flex-1">{description}</div>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`mt-4 inline-flex items-center gap-1.5 text-xs font-medium transition-colors disabled:pointer-events-none ${accent ? "text-gold hover:text-gold/80" : "text-primary hover:text-primary/80"}`}
      >
        {action} →
      </button>
    </div>
  );
}

/* ── Edit form ── */
function EditForm({
  students, studentIdx, onStudentChange, periodId, onPeriodChange,
  selectedPeriod, entries, onEntryChange, onBack, onPreview, onPrint,
}: {
  students: Student[];
  studentIdx: number;
  onStudentChange: (i: number) => void;
  periodId: number;
  onPeriodChange: (id: number) => void;
  selectedPeriod: PayPeriod;
  entries: TimeEntry[];
  onEntryChange: (dayIndex: number, field: keyof TimeEntry, value: string) => void;
  onBack: () => void;
  onPreview: () => void;
  onPrint: () => void;
}) {
  const { week1, week2 } = getPayPeriodDays(selectedPeriod);
  const allDays = [...week1, ...week2];

  const inp = "w-full rounded border border-border/60 bg-background px-1.5 py-1 text-xs text-foreground focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/20 text-center";
  const th = "py-2 px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground text-center whitespace-nowrap";

  return (
    <div>
      <button onClick={onBack} className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
        Back
      </button>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Student</label>
          <select
            value={studentIdx}
            onChange={e => onStudentChange(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20"
          >
            {students.map((s, i) => (
              <option key={i} value={i}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Pay Period</label>
          <select
            value={periodId}
            onChange={e => onPeriodChange(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20"
          >
            {PAY_PERIODS.map(pp => (
              <option key={pp.id} value={pp.id}>{pp.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden mb-5">
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
              {allDays.map((day, i) => {
                const isWeek2Start = i === 7;
                return (
                  <>
                    {isWeek2Start && (
                      <tr key="w1-sub" className="bg-muted/30">
                        <td colSpan={7} className="py-1.5 px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          Week 1 Sub Total
                        </td>
                      </tr>
                    )}
                    <tr key={`day-${i}`} className={i >= 7 ? "bg-muted/10" : ""}>
                      <td className="py-1.5 px-3 text-xs font-medium text-foreground w-12">{day.dayName}</td>
                      <td className="py-1.5 px-3 text-xs text-muted-foreground w-20">{day.formatted}</td>
                      {(["amIn", "amOut", "meal", "pmIn", "pmOut"] as (keyof TimeEntry)[]).map(field => (
                        <td key={field} className="py-1.5 px-2 w-20">
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
                );
              })}
              <tr className="bg-muted/30">
                <td colSpan={7} className="py-1.5 px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Week 2 Sub Total
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPreview}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Eye className="h-4 w-4" strokeWidth={1.5} />
          Preview
        </button>
        <button
          onClick={onPrint}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          <Printer className="h-4 w-4" strokeWidth={1.5} />
          Print
        </button>
      </div>
    </div>
  );
}
