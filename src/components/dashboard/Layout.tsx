import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  query?: string;
  onQueryChange?: (v: string) => void;
  children: ReactNode;
}

export function DashboardLayout({ title, subtitle, query, onQueryChange, children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <TopBar title={title} subtitle={subtitle} query={query} onQueryChange={onQueryChange} />
        <div className="flex-1 px-8 py-7">{children}</div>
      </main>
    </div>
  );
}
