import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — CT State" }, { name: "description", content: "Account and program preferences." }] }),
  component: () => (
    <DashboardLayout title="Settings" subtitle="Manage your account and program preferences">
      <div className="max-w-2xl rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-base font-bold">Profile</h3>
        <div className="mt-4 grid gap-4">
          <div><Label>Name</Label><Input defaultValue="John Doe" className="mt-1.5" /></div>
          <div><Label>Email</Label><Input defaultValue="jdoe@ctstate.edu" className="mt-1.5" /></div>
          <div><Label>Role</Label><Input defaultValue="Program Director" className="mt-1.5" /></div>
          <button className="mt-2 self-start rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Save changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  ),
});
