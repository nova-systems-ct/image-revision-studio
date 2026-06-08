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
    <div className="bg-stat-gradient relative overflow-hidden rounded-2xl p-5 text-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.6)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">{label}</div>
          <div className="mt-2 font-display text-[34px] font-bold leading-none">{value}</div>
          <div className="mt-2 text-[12px] text-white/55">{hint}</div>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${accent ? "bg-gold text-primary" : "bg-white/5 ring-1 ring-gold/30 text-gold"}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="-mx-5 -mb-5 mt-3 h-14">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`g-${label}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.55} />
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
