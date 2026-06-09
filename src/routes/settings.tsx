import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { getStudents, saveStudents, clearStudents, parseStudentCSV } from "@/lib/students";
import { Upload, Trash2, Check } from "lucide-react";

const SESSION_KEY = "nvcc-auth";

export default function SettingsPage() {
  const [studentCount, setStudentCount] = useState(getStudents().length);
  const [pwSaved, setPwSaved] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [csvMsg, setCsvMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { students, errors } = parseStudentCSV(text);
      const existing = getStudents();
      saveStudents([...existing, ...students]);
      setStudentCount(getStudents().length);
      setCsvMsg(errors.length > 0
        ? `Imported ${students.length} student${students.length !== 1 ? "s" : ""} (${errors.length} warnings)`
        : `Imported ${students.length} student${students.length !== 1 ? "s" : ""} successfully`
      );
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function clearAll() {
    clearStudents();
    setStudentCount(0);
    setClearConfirm(false);
    setCsvMsg("All student records cleared.");
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  }

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl space-y-6">

        {/* Program info */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-sm font-bold text-foreground mb-4">Program Information</h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow label="Program" value="WAVE" />
            <InfoRow label="Coordinator" value="Tracy Mahar" />
            <InfoRow label="Institution" value="CT State Naugatuck Valley" />
            <InfoRow label="Grant" value="WIOA Out Of School · HB 3500" />
            <InfoRow label="Percentage" value="100%" />
            <InfoRow label="Fiscal Year" value="FY 2027" />
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">To update program information, contact your system administrator.</p>
        </section>

        {/* Student data */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-sm font-bold text-foreground mb-1">Student Data</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {studentCount} student{studentCount !== 1 ? "s" : ""} currently enrolled.
          </p>

          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <Upload className="h-4 w-4" /> Import CSV
            </button>
            {studentCount > 0 && (
              clearConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-destructive font-medium">Clear all {studentCount} students?</span>
                  <button onClick={clearAll} className="rounded-lg bg-destructive px-3 py-2 text-sm font-semibold text-white hover:bg-destructive/90 transition-colors">Yes, clear</button>
                  <button onClick={() => setClearConfirm(false)} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                </div>
              ) : (
                <button
                  onClick={() => setClearConfirm(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" /> Clear All Students
                </button>
              )
            )}
          </div>

          {csvMsg && (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-success" />
              {csvMsg}
            </div>
          )}

          <p className="mt-3 text-xs text-muted-foreground">
            CSV format: Name, Department, Student ID, Work Location
          </p>
        </section>

        {/* Password / Session */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-sm font-bold text-foreground mb-1">Session</h2>
          <p className="text-sm text-muted-foreground mb-4">
            To change the supervisor password, set the <code className="rounded bg-muted px-1 py-0.5 text-xs">VITE_SUPERVISOR_PASSWORD</code> environment variable in your Vercel project settings.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => { setPwSaved(true); setTimeout(() => setPwSaved(false), 2000); }}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              {pwSaved ? <><Check className="h-4 w-4 text-success" /> Saved</> : "View password instructions"}
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </section>

      </div>
    </DashboardLayout>
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
