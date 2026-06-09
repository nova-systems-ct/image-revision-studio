import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { students } from "@/components/dashboard/data";

export default function StudentsPage() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? students.filter(x => [x.name, x.id, x.program].some(f => f.toLowerCase().includes(s))) : students;
  }, [q]);

  return (
    <DashboardLayout title="All Students" subtitle="247 active enrollments across 5 programs" query={q} onQueryChange={setQ}>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {list.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/40">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-xs font-bold text-gold">
                {s.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{s.name}</div>
                <div className="text-[11px] text-muted-foreground">{s.id} · {s.program}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
