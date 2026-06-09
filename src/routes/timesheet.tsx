import { useMemo, useState } from "react";
import { Clock, Plus, Download, CheckCircle2, Timer, CalendarDays } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/Layout";

type Row = {
  id: string;
  name: string;
  role: string;
  hours: number[];
  status: "Approved" | "Pending" | "Draft";
};

const initial: Row[] = [
  { id: "1", name: "John Doe",        role: "Program Director", hours: [8, 8, 7.5, 8, 6],   status: "Approved" },
  { id: "2", name: "Lena Whitfield",  role: "Academic Advisor", hours: [7, 8, 8, 7.5, 8],   status: "Pending"  },
  { id: "3", name: "Marcus Bell",     role: "Career Coach",     hours: [6, 8, 8, 8, 7],     status: "Pending"  },
  { id: "4", name: "Priya Natarajan", role: "Support Lead",     hours: [8, 8, 8, 8, 8],     status: "Approved" },
  { id: "5", name: "Daniel Chen",     role: "Mentor",           hours: [4, 5, 5, 4, 0],     status: "Draft"    },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function TimesheetPage() {
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => rows.filter((r) => (r.name + r.role).toLowerCase().includes(query.toLowerCase())),
    [rows, query]
  );

  const totalHours = rows.reduce((a, r) => a + r.hours.reduce((b, h) => b + h, 0), 0);
  const approved = rows.filter((r) => r.status === "Approved").length;
  const pending = rows.filter((r) => r.status === "Pending").length;

  const update = (id: string, day: number, val: string) => {
    const n = Math.max(0, Math.min(24, Number(val) || 0));
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, hours: r.hours.map((h, i) => (i === day ? n : h)) } : r)));
  };

  const setStatus = (id: string, status: Row["status"]) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));

  return (
    <DashboardLayout title="Timesheet" subtitle="Week of June 2 – June 6, 2026" query={query} onQueryChange={setQuery}>
      {/* Luxury hero strip */}
      <section className="relative mb-6 overflow-hidden rounded-3xl border border-border bg-stat-gradient p-6 text-white">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -left-10 -bottom-20 h-56 w-56 rounded-full bg-[oklch(0.62_0.10_250)]/20 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-4">
          <Metric icon={Clock} label="Total Hours" value={`${totalHours.toFixed(1)}h`} />
          <Metric icon={CheckCircle2} label="Approved" value={`${approved}`} />
          <Metric icon={Timer} label="Pending Review" value={`${pending}`} />
          <Metric icon={CalendarDays} label="Pay Period" value="Bi-weekly" />
        </div>
      </section>

      {/* Actions */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight">Weekly Entries</h2>
          <p className="text-sm text-muted-foreground">Tap a cell to edit. Submit for director approval when ready.</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-[oklch(0.72_0.16_70)] px-4 py-2 text-sm font-semibold text-primary shadow-[0_8px_24px_-12px_oklch(0.78_0.14_80_/_0.6)]">
            <Plus className="h-4 w-4" /> Add Entry
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="py-4 pl-6 font-semibold">Staff</th>
                {days.map((d) => (
                  <th key={d} className="py-4 text-center font-semibold">{d}</th>
                ))}
                <th className="py-4 text-center font-semibold">Total</th>
                <th className="py-4 pr-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {filtered.map((r) => {
                const total = r.hours.reduce((a, b) => a + b, 0);
                return (
                  <tr key={r.id} className="group hover:bg-muted/30">
                    <td className="py-3 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.32_0.07_260)] text-[11px] font-bold text-gold ring-1 ring-gold/30">
                          {r.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div className="font-semibold">{r.name}</div>
                          <div className="text-[11px] text-muted-foreground">{r.role}</div>
                        </div>
                      </div>
                    </td>
                    {r.hours.map((h, i) => (
                      <td key={i} className="px-2 py-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={24}
                          step={0.5}
                          value={h}
                          onChange={(e) => update(r.id, i, e.target.value)}
                          className="h-10 w-16 rounded-lg border border-border bg-background text-center font-medium tabular-nums focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                        />
                      </td>
                    ))}
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center rounded-lg bg-accent px-3 py-1.5 font-display text-sm font-bold tabular-nums text-gold">
                        {total.toFixed(1)}h
                      </span>
                    </td>
                    <td className="py-3 pr-6">
                      <select
                        value={r.status}
                        onChange={(e) => setStatus(r.id, e.target.value as Row["status"])}
                        className={`rounded-full border-0 px-3 py-1.5 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-gold/40 ${
                          r.status === "Approved"
                            ? "bg-[oklch(0.95_0.06_155)] text-success"
                            : r.status === "Pending"
                            ? "bg-accent text-gold"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <option>Approved</option>
                        <option>Pending</option>
                        <option>Draft</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 ring-1 ring-gold/30">
        <Icon className="h-5 w-5 text-gold" />
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">{label}</div>
        <div className="mt-0.5 font-display text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}
