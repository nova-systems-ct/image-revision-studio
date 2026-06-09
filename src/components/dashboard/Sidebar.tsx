import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, LineChart, FileBarChart2, Settings, GraduationCap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: Users },
  { to: "/timesheet", label: "Timesheet", icon: Clock },
  { to: "/tracker", label: "Student Tracker", icon: LineChart },
  { to: "/reports", label: "Reports", icon: FileBarChart2 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="bg-sidebar-gradient text-sidebar-foreground relative flex w-60 shrink-0 flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold-gradient shadow-[0_4px_12px_rgba(212,160,48,0.35)]">
            <GraduationCap className="h-4.5 w-4.5 text-primary" />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-bold tracking-tight text-white">CT State</div>
            <div className="text-[9px] font-semibold tracking-[0.18em] text-gold uppercase">WAVE Program</div>
          </div>
        </div>
        <div className="mt-4 h-px w-full bg-sidebar-border" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-3">
        <ul className="space-y-0.5">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-white/[0.08] text-white"
                      : "text-sidebar-foreground/60 hover:bg-white/[0.04] hover:text-white/80"
                  )}
                >
                  {active && <span className="absolute left-3 h-5 w-0.5 rounded-r-full bg-gold" />}
                  <Icon
                    className={cn("h-4 w-4 shrink-0", active ? "text-gold" : "text-sidebar-foreground/50")}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  <span className="text-[13px]">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold text-[11px] font-bold text-primary">
            TM
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-white">Tracy Mahar</div>
            <div className="truncate text-[11px] text-sidebar-foreground/50">WAVE Coordinator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
