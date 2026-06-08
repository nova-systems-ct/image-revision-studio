import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  greeting?: string;
  query?: string;
  onQueryChange?: (v: string) => void;
  children: ReactNode;
}

export function DashboardLayout({ title, subtitle, greeting, query, onQueryChange, children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <TopBar title={title} subtitle={subtitle} greeting={greeting} query={query} onQueryChange={onQueryChange} />
        <div className="px-10 pb-14">{children}</div>
      </main>
    </div>
  );
}
