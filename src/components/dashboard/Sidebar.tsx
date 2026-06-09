import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, LineChart, FileBarChart2, Settings, GraduationCap, ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "All Students", icon: Users },
  { to: "/timesheet", label: "Timesheet", icon: Clock },
  { to: "/tracker", label: "Student Tracker", icon: LineChart },
  { to: "/reports", label: "Reports", icon: FileBarChart2 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="bg-sidebar-gradient text-sidebar-foreground relative flex w-64 shrink-0 flex-col border-r border-sidebar-border">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
      <div className="px-6 pt-8 pb-8">
        <div className="flex items-center gap-3">
          <div className="bg-gold-gradient grid h-10 w-10 place-items-center rounded-xl shadow-[0_8px_20px_-8px_oklch(0.78_0.14_80_/_0.6)]">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-[17px] font-medium tracking-tight text-white">CT State</div>
            <div className="text-[9px] font-semibold tracking-[0.22em] text-gold">COMMUNITY COLLEGE</div>
          </div>
        </div>
        <div className="mt-4 h-px w-full bg-gradient-to-r from-gold/60 via-gold/20 to-transparent" />
      </div>

      <nav className="flex-1 px-3">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/40">Workspace</div>
        <ul className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-white/[0.06] text-white ring-1 ring-gold/30 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]"
                      : "text-sidebar-foreground/70 hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  {active && <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gold-gradient" />}
                  <Icon className={cn("h-[18px] w-[18px]", active ? "text-gold" : "")} strokeWidth={active ? 2.2 : 1.8} />
                  <span className="text-[13.5px]">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3">
        <button className="flex w-full items-center gap-3 text-left">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gold text-sidebar-primary-foreground text-xs font-bold">
            JD
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-white">John Doe</div>
            <div className="truncate text-[11px] text-sidebar-foreground/60">Program Director</div>
          </div>
          <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
        </button>
      </div>
    </aside>
  );
}
