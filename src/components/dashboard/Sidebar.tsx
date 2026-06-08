import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, LineChart, FileBarChart2, Settings, GraduationCap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "All Students", icon: Users },
  { to: "/tracker", label: "Student Tracker", icon: LineChart },
  { to: "/reports", label: "Reports", icon: FileBarChart2 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="bg-sidebar-gradient text-sidebar-foreground flex w-64 shrink-0 flex-col border-r border-sidebar-border">
      <div className="px-6 pt-7 pb-8">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/15 ring-1 ring-gold/40">
            <GraduationCap className="h-5 w-5 text-gold" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-[15px] font-bold tracking-wide text-white">CT STATE</div>
            <div className="text-[10px] font-semibold tracking-[0.18em] text-gold">COMMUNITY COLLEGE</div>
          </div>
        </div>
        <div className="mt-3 h-px w-12 bg-gold" />
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {nav.map((item, i) => {
            const active = path === item.to;
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-gold text-sidebar-primary-foreground shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-white"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 1.8} />
                  <span className="text-[13.5px]">
                    <span className="opacity-60 mr-1.5">{i + 1}.</span>
                    {item.label}
                  </span>
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
