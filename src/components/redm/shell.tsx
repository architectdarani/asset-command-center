import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { kes } from "@/lib/redm-data";
import { useRedm } from "@/lib/redm-store";

const NAV: { to: string; label: string; code: string }[] = [
  { to: "/", label: "Investment Command", code: "01" },
  { to: "/portfolio", label: "Portfolio", code: "02" },
  { to: "/assets", label: "Assets", code: "03" },
  { to: "/acquisitions", label: "Acquisitions", code: "04" },
  { to: "/pipeline", label: "Development Pipeline", code: "05" },
  { to: "/valuation", label: "Valuation", code: "06" },
  { to: "/cashflow", label: "Cash Flow", code: "07" },
  { to: "/strategy", label: "Strategy", code: "08" },
  { to: "/risk", label: "Risk", code: "09" },
  { to: "/disposals", label: "Disposals", code: "10" },
  { to: "/decisions", label: "Decisions", code: "11" },
];

export function Shell({ children }: { children: ReactNode }) {
  const { portfolio: PORTFOLIO } = useRedm();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[212px] shrink-0 flex-col border-r border-border bg-surface lg:flex">
          <div className="border-b border-border px-3 py-3">
            <div className="text-[15px] font-semibold tracking-[0.24em]">REDM</div>
            <div className="label-xs mt-0.5">Investment Portfolio</div>
          </div>
          <nav className="flex-1 overflow-y-auto py-2">
            {NAV.map((item) => {
              const active =
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 border-l-2 px-3 py-[7px] text-[12px] transition-colors ${
                    active
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                  }`}
                >
                  <span className="num text-[10px] text-muted-foreground">{item.code}</span>
                  <span className="truncate uppercase tracking-[0.06em]">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border px-3 py-3">
            <div className="label-xs">Net Asset Value</div>
            <div className="num text-[16px] text-primary">{kes(PORTFOLIO.nav)}</div>
            <div className="num mt-1 text-[10px] text-muted-foreground">
              GAV {kes(PORTFOLIO.gav)} · DEBT {kes(PORTFOLIO.debt)}
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background/95 px-4 py-2 backdrop-blur">
            <div className="flex items-center gap-3 overflow-x-auto lg:hidden">
              {NAV.map((i) => (
                <Link
                  key={i.to}
                  to={i.to}
                  className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {i.label}
                </Link>
              ))}
            </div>
            <div className="hidden items-center gap-4 lg:flex">
              <span className="label-xs">REDM / Capital Allocation System</span>
              <span className="num text-[11px] text-muted-foreground">
                ASSETS {8} · CYCLE Q3 2026 · CURRENCY KES
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="num text-[11px] text-muted-foreground">
                NOI {kes(PORTFOLIO.noi)}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-positive" />
              <span className="label-xs">Live</span>
            </div>
          </header>
          <main className="flex-1 space-y-4 p-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
