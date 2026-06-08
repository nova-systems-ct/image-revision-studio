import type { LucideIcon } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  trend?: number[];
  accent?: boolean;
}

export function StatCard({ label, value, hint, icon: Icon, trend, accent }: StatCardProps) {
  const data = (trend ?? [5, 7, 6, 9, 8, 11, 10, 13, 12, 15]).map((v, i) => ({ i, v }));
  return (
    <div className="bg-stat-gradient shadow-luxe relative overflow-hidden rounded-2xl p-5 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_100%_0%,oklch(0.80_0.14_82_/_0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">{label}</div>
          <div className="mt-2.5 font-serif text-[40px] font-medium leading-none tracking-tight">{value}</div>
          <div className="mt-2 text-[12px] text-white/55">{hint}</div>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${accent ? "bg-gold-gradient text-primary" : "bg-white/5 ring-1 ring-gold/30 text-gold"}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="-mx-5 -mb-5 mt-3 h-14">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`g-${label}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.6} />
                <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="var(--gold)" strokeWidth={2} fill={`url(#g-${label})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
