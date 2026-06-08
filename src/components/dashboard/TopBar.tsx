import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TopBarProps {
  title: string;
  greeting?: string;
  subtitle?: string;
  query?: string;
  onQueryChange?: (v: string) => void;
}

export function TopBar({ title, greeting = "Welcome back,", subtitle = "CT State Community College", query, onQueryChange }: TopBarProps) {
  const [local, setLocal] = useState("");
  const value = query ?? local;
  const handle = onQueryChange ?? setLocal;

  return (
    <header className="flex flex-wrap items-start justify-between gap-6 px-10 pt-8 pb-6">
      <div>
        <div className="text-sm font-semibold text-gold">{greeting}</div>
        <h1 className="mt-1 font-display text-[34px] font-bold leading-none text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => handle(e.target.value)}
            placeholder="Search students, ID, programs…"
            className="h-11 w-[320px] rounded-full border-border/70 bg-card pl-10 shadow-sm focus-visible:ring-2 focus-visible:ring-gold/40"
          />
        </div>
        <button className="relative grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground/70 hover:text-foreground">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-primary-foreground">3</span>
        </button>
        <button className="grid h-11 w-11 place-items-center rounded-full bg-primary text-[12px] font-bold text-gold ring-2 ring-gold/40">JD</button>
      </div>
    </header>
  );
}
