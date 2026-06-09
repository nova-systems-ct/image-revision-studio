import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { getStudents, saveStudents, parseStudentCSV, type Student } from "@/lib/students";
import { Users, UserPlus, Upload, Trash2, X } from "lucide-react";

const SEED: Student = { name: "Isaac Nova", department: "WAVE", studentId: "CSCC000001", workLocation: "CT State Naugatuck Valley" };

function loadOrSeed(): Student[] {
  const stored = getStudents();
  if (stored.length > 0) return stored;
  saveStudents([SEED]);
  return [SEED];
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(loadOrSeed);
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Student>({ name: "", department: "WAVE", studentId: "", workLocation: "CT State Naugatuck Valley" });
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = q.trim()
    ? students.filter(s => [s.name, s.studentId, s.department].some(f => f.toLowerCase().includes(q.toLowerCase())))
    : students;

  function persist(updated: Student[]) {
    saveStudents(updated);
    setStudents(updated);
  }

  function addStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    persist([...students, { ...form, name: form.name.trim() }]);
    setForm({ name: "", department: "WAVE", studentId: "", workLocation: "CT State Naugatuck Valley" });
    setAdding(false);
  }

  function removeStudent(idx: number) {
    persist(students.filter((_, i) => i !== idx));
  }

  function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { students: parsed, errors } = parseStudentCSV(text);
      setCsvErrors(errors);
      if (parsed.length > 0) persist([...students, ...parsed]);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <DashboardLayout title="Students" subtitle={`${students.length} enrolled in WAVE`} query={q} onQueryChange={setQ}>
      {/* Actions bar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Manage student records. Upload a CSV or add individually.
        </p>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} />
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Upload className="h-4 w-4" /> Upload CSV
          </button>
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
          >
            <UserPlus className="h-4 w-4" /> Add Student
          </button>
        </div>
      </div>

      {/* CSV errors */}
      {csvErrors.length > 0 && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-destructive">CSV import warnings</span>
            <button onClick={() => setCsvErrors([])}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <ul className="mt-2 space-y-1">
            {csvErrors.map((e, i) => <li key={i} className="text-xs text-destructive/80">{e}</li>)}
          </ul>
        </div>
      )}

      {/* Add student form */}
      {adding && (
        <div className="mb-5 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold">New Student</h3>
            <button onClick={() => setAdding(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <form onSubmit={addStudent} className="grid gap-3 sm:grid-cols-2">
            <Field label="Full Name *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="First Last" />
            <Field label="Department / Program" value={form.department} onChange={v => setForm(f => ({ ...f, department: v }))} placeholder="WAVE" />
            <Field label="Student ID" value={form.studentId} onChange={v => setForm(f => ({ ...f, studentId: v }))} placeholder="CSCC000000" />
            <Field label="Work Location" value={form.workLocation} onChange={v => setForm(f => ({ ...f, workLocation: v }))} placeholder="CT State Naugatuck Valley" />
            <div className="sm:col-span-2 flex gap-2 justify-end pt-1">
              <button type="button" onClick={() => setAdding(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
              <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">Add Student</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              {q ? `No students match "${q}"` : "No students enrolled yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pl-5 pr-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="py-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Department</th>
                  <th className="py-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Student ID</th>
                  <th className="py-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Work Location</th>
                  <th className="py-3 pl-3 pr-5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((s, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 pl-5 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-gold">
                          {s.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </div>
                        <span className="font-medium text-foreground">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{s.department || "—"}</td>
                    <td className="py-3 px-3 tabular-nums text-muted-foreground">{s.studentId || "—"}</td>
                    <td className="py-3 px-3 text-muted-foreground">{s.workLocation || "—"}</td>
                    <td className="py-3 pl-3 pr-5 text-right">
                      <button
                        onClick={() => removeStudent(students.indexOf(s))}
                        className="rounded-md p-1.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 transition-colors"
                        title="Remove student"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        CSV format: Name, Department, Student ID, Work Location (header row optional)
      </p>
    </DashboardLayout>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20"
      />
    </div>
  );
}
