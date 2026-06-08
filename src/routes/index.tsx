import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Users, CalendarCheck2, TrendingUp, GraduationCap, ArrowUpRight, Clock, AlertCircle, LogOut, CheckCircle2, MoreHorizontal } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { students, activity, programs, attendanceTrend, demographics } from "@/components/dashboard/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — CT State Program Director" },
      { name: "description", content: "Live enrollment, attendance, and student check-in operations for CT State Community College." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.program.toLowerCase().includes(q)
    );
  }, [query]);

  const checkedIn = students.filter((s) => s.status === "in").length;
  const total = students.length;

  return (
    <DashboardLayout
      title="Program Director"
      query={query}
      onQueryChange={setQuery}
    >
      {/* Stat grid */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value="247" hint="Active in program"   icon={Users}          trend={[5,7,6,9,8,11,10,13,12,15]} />
        <StatCard label="Present Today"  value={`${198}`} hint="Checked in"     icon={CalendarCheck2} trend={[8,10,9,12,11,13,12,14,15,16]} />
        <StatCard label="Attendance"     value="92%" hint="Rolling 30 days"     icon={TrendingUp}     trend={[6,8,7,10,9,12,11,14,13,15]} />
        <StatCard label="Active Programs" value="5" hint="Running this term"    icon={GraduationCap}  accent trend={[3,4,4,5,5,5,5,5,5,5]} />
      </section>

      {/* Check-in + trend */}
      <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Panel title="Today's Check-In">
          <div className="grid grid-cols-[160px_1fr] items-center gap-6">
            <div className="relative grid place-items-center">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={[{ v: checkedIn }, { v: total - checkedIn }]}
                    dataKey="v" innerRadius={56} outerRadius={74} startAngle={90} endAngle={-270}
                    stroke="none" paddingAngle={2}
                  >
                    <Cell fill="var(--gold)" />
                    <Cell fill="var(--navy-deep)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="font-display text-3xl font-bold leading-none">{checkedIn}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">of {total} today</div>
                </div>
              </div>
            </div>
            <ul className="space-y-2.5">
              {[
                { icon: CheckCircle2, label: "Check-in rate", val: `${Math.round((checkedIn/total)*100)}%`, tone: "text-success" },
                { icon: AlertCircle,  label: "Absent",        val: `${students.filter(s=>s.status==='abs').length}`, tone: "text-foreground" },
                { icon: Clock,        label: "Late arrivals", val: `${students.filter(s=>s.status==='late').length}`, tone: "text-foreground" },
                { icon: LogOut,       label: "Early departures", val: `${students.filter(s=>s.status==='out').length}`, tone: "text-foreground" },
              ].map((r) => (
                <li key={r.label} className="flex items-center justify-between rounded-xl bg-muted/60 px-3.5 py-2.5">
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <r.icon className="h-4 w-4 text-gold" />
                    {r.label}
                  </div>
                  <div className={`text-sm font-semibold ${r.tone}`}>{r.val}</div>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel title="Attendance Trend" className="xl:col-span-2" right={<Pill>This month</Pill>}>
          <div className="h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="attn" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} domain={[0,100]} tickFormatter={(v)=>`${v}%`} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }}
                  formatter={(v: number) => [`${v}%`, "Attendance"]}
                />
                <Area type="monotone" dataKey="v" stroke="var(--gold)" strokeWidth={2.5} fill="url(#attn)" dot={{ r: 3, fill: "var(--gold)" }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </section>

      {/* Demographics / Programs / Activity */}
      <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Panel title="Student Demographics">
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={demographics} dataKey="value" innerRadius={42} outerRadius={62} stroke="none" paddingAngle={2}>
                  {demographics.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-2">
              {demographics.map((d) => (
                <li key={d.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-semibold text-foreground">{d.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel title="Program Participation" right={<button className="text-xs font-semibold text-gold hover:underline">View all</button>}>
          <ul className="space-y-3.5">
            {programs.map((p) => (
              <li key={p.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{p.name}</span>
                  <span className="text-muted-foreground">{p.count}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-gold to-[oklch(0.72_0.16_70)]" style={{ width: `${p.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Recent Activity" right={<button className="text-xs font-semibold text-gold hover:underline">View all</button>}>
          <ul className="-mx-2 divide-y divide-border/60">
            {activity.map((a) => {
              const Icon = a.kind === "out" ? ArrowUpRight : a.kind === "late" ? Clock : CheckCircle2;
              const tone = a.kind === "out" ? "text-[oklch(0.60_0.18_30)] bg-[oklch(0.96_0.05_30)]"
                          : a.kind === "late" ? "text-gold bg-accent"
                          : "text-success bg-[oklch(0.95_0.06_155)]";
              return (
                <li key={a.name + a.time} className="flex items-center gap-3 px-2 py-2.5">
                  <span className={`grid h-8 w-8 place-items-center rounded-full ${tone}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{a.name}</div>
                    <div className="text-[11px] text-muted-foreground">{a.action}</div>
                  </div>
                  <div className="text-[11px] tabular-nums text-muted-foreground">{a.time}</div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </section>

      {/* Table */}
      <section className="mt-6">
        <Panel
          title="Recent Students"
          right={
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{filtered.length} of {students.length}</span>
              <button className="text-xs font-semibold text-gold hover:underline">View all students</button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 pl-1 font-semibold">Student</th>
                  <th className="py-3 font-semibold">ID</th>
                  <th className="py-3 font-semibold">Program</th>
                  <th className="py-3 font-semibold">Check-In</th>
                  <th className="py-3 font-semibold">Status</th>
                  <th className="py-3 font-semibold">Location</th>
                  <th className="py-3 pr-1" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/50">
                    <td className="py-3 pl-1">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-[11px] font-bold text-gold">
                          {s.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                        </div>
                        <span className="font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="text-muted-foreground tabular-nums">{s.id}</td>
                    <td className="text-muted-foreground">{s.program}</td>
                    <td className="tabular-nums text-muted-foreground">{s.time}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td className="text-muted-foreground">{s.location}</td>
                    <td className="pr-1 text-right">
                      <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="py-10 text-center text-muted-foreground">No students match "{query}"</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>
    </DashboardLayout>
  );
}

function Panel({ title, children, right, className = "" }: { title: string; children: React.ReactNode; right?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-bold text-foreground">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-border bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">{children}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    in:   { label: "Checked In",  cls: "bg-[oklch(0.95_0.06_155)] text-success" },
    out:  { label: "Checked Out", cls: "bg-muted text-muted-foreground" },
    late: { label: "Late",        cls: "bg-accent text-gold" },
    abs:  { label: "Absent",      cls: "bg-[oklch(0.96_0.05_25)] text-[oklch(0.55_0.18_25)]" },
  };
  const s = map[status] ?? map.out;
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.cls}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />{s.label}
  </span>;
}
