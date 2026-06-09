import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TopBarProps {
  title: string;
  subtitle?: string;
  query?: string;
  onQueryChange?: (v: string) => void;
}

export function TopBar({ title, subtitle, query, onQueryChange }: TopBarProps) {
  const [local, setLocal] = useState("");
  const value = query ?? local;
  const handle = onQueryChange ?? setLocal;

  return (
    <header className="flex flex-wrap items-end justify-between gap-6 px-10 pt-8 pb-6 border-b border-border/60">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {onQueryChange !== undefined && (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={value}
              onChange={(e) => handle(e.target.value)}
              placeholder="Search…"
              className="h-9 w-64 rounded-full border-border/60 bg-card pl-10 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-gold/50"
            />
          </div>
        )}
        <button className="relative grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-4 min-w-4 grid place-items-center rounded-full bg-gold text-[9px] font-bold text-primary px-0.5">3</span>
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-primary text-[11px] font-bold text-gold ring-2 ring-gold/30">TM</button>
      </div>
    </header>
  );
}
