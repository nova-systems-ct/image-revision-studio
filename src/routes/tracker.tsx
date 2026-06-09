import { DashboardLayout } from "@/components/dashboard/Layout";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { attendanceTrend } from "@/components/dashboard/data";

export default function TrackerPage() {
  return (
    <DashboardLayout title="Student Tracker" subtitle="Longitudinal progress and engagement signals">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display text-base font-bold">30-Day Attendance</h3>
        <div className="mt-4 h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceTrend} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[0,100]} tickFormatter={(v)=>`${v}%`} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
              <Line type="monotone" dataKey="v" stroke="var(--gold)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
