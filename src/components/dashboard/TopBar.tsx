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
    <header className="flex flex-wrap items-end justify-between gap-6 px-10 pt-9 pb-7">
      <div>
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
          {greeting}
        </div>
        <h1 className="mt-2 font-display text-[40px] font-bold leading-none text-foreground">
          {title.split(" ").map((w, i) => (
            <span key={i} className={i === 0 ? "" : "font-serif italic font-medium text-gold-gradient"}>
              {i === 0 ? w : ` ${w}`}
            </span>
          ))}
        </h1>
        <p className="mt-2.5 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => handle(e.target.value)}
            placeholder="Search students, ID, programs…"
            className="h-11 w-[320px] rounded-full border-border/70 bg-card/80 pl-11 shadow-sm backdrop-blur focus-visible:ring-2 focus-visible:ring-gold/40"
          />
        </div>
        <button className="relative grid h-11 w-11 place-items-center rounded-full border border-border bg-card/80 text-foreground/70 backdrop-blur hover:text-foreground">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-gradient px-1 text-[10px] font-bold text-primary">3</span>
        </button>
        <button className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.32_0.07_260)] text-[12px] font-bold text-gold ring-2 ring-gold/40">JD</button>
      </div>
    </header>
  );
}
