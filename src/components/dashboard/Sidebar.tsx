import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileBarChart2, Settings, GraduationCap, Clock, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/",        label: "Dashboard",      icon: LayoutDashboard },
  { to: "/timesheet", label: "Timesheet",    icon: Clock },
  { to: "/students",  label: "Students",     icon: Users },
  { to: "/tracker",   label: "Student Tracker", icon: LineChart },
  { to: "/reports",   label: "Reports",      icon: FileBarChart2 },
  { to: "/settings",  label: "Settings",     icon: Settings },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="relative flex w-48 shrink-0 flex-col border-r" style={{ backgroundColor: "#0a0f1e", borderColor: "rgba(255,255,255,0.05)" }}>

      {/* Branding */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-7 w-7 place-items-center rounded-md" style={{ background: "rgba(212,160,48,0.15)" }}>
            <GraduationCap className="h-3.5 w-3.5" style={{ color: "#D4A030" }} strokeWidth={1.5} />
          </div>
          <div className="leading-none">
            <div style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.01em" }}>
              CT State
            </div>
            <div style={{ fontSize: "9px", fontWeight: 400, color: "rgba(212,160,48,0.65)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "2px" }}>
              WAVE
            </div>
          </div>
        </div>
        <div className="mt-4" style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 pb-2">
        <ul className="space-y-px">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "relative flex items-center gap-2.5 rounded-md px-3 py-[7px] transition-colors duration-150",
                    active
                      ? "bg-white/[0.06] text-white"
                      : "text-white/40 hover:bg-white/[0.03] hover:text-white/65"
                  )}
                >
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r"
                      style={{ width: "2px", height: "14px", backgroundColor: "#D4A030" }}
                    />
                  )}
                  <Icon
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: active ? "#D4A030" : "rgba(255,255,255,0.28)" }}
                    strokeWidth={1.5}
                  />
                  <span style={{ fontSize: "12px", fontWeight: 400 }}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="px-3 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2">
          <div
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
            style={{ background: "rgba(212,160,48,0.18)", fontSize: "10px", fontWeight: 500, color: "#D4A030" }}
          >
            TM
          </div>
          <div className="min-w-0">
            <div className="truncate" style={{ fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,0.75)" }}>Tracy Mahar</div>
            <div className="truncate" style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)" }}>WAVE Coordinator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
