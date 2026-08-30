import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  meta,
  actions,
  children,
  className,
  dense,
}: {
  title?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  dense?: boolean;
}) {
  return (
    <section
      className={cn(
        "border border-border bg-surface",
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
          <div className="flex items-baseline gap-3 min-w-0">
            <h2 className="label-xs text-foreground/80">{title}</h2>
            {meta && <span className="label-xs truncate">{meta}</span>}
          </div>
          {actions}
        </header>
      )}
      <div className={cn(dense ? "" : "p-3")}>{children}</div>
    </section>
  );
}

export function Metric({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "default" | "positive" | "negative" | "signal" | "warning";
}) {
  const toneCls = {
    default: "text-foreground",
    positive: "text-positive",
    negative: "text-negative",
    signal: "text-signal",
    warning: "text-warning",
  }[tone];
  return (
    <div className="border-l border-border pl-3 first:border-l-0 first:pl-0">
      <div className="label-xs">{label}</div>
      <div className={cn("num mt-1 text-[19px] leading-6 tracking-tight", toneCls)}>{value}</div>
      {sub && <div className="num mt-0.5 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

export function MetricRow({ children, cols = 6 }: { children: ReactNode; cols?: number }) {
  return (
    <div
      className="grid gap-x-3 gap-y-4"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
    >
      {children}
    </div>
  );
}

const riskTone: Record<string, string> = {
  LOW: "text-positive border-positive/40",
  MODERATE: "text-warning border-warning/40",
  ELEVATED: "text-primary border-primary/40",
  HIGH: "text-negative border-negative/40",
};

export function Tag({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "signal" | "positive" | "negative" | "warning" | "info" | "risk";
  className?: string;
}) {
  const base =
    "inline-flex items-center border px-1.5 py-[1px] font-mono text-[10px] uppercase tracking-[0.1em]";
  const tones: Record<string, string> = {
    muted: "border-border text-muted-foreground",
    signal: "border-primary/50 text-primary",
    positive: "border-positive/40 text-positive",
    negative: "border-negative/40 text-negative",
    warning: "border-warning/40 text-warning",
    info: "border-info/40 text-info",
    risk: "",
  };
  const cls =
    tone === "risk" ? riskTone[String(children)] ?? tones.muted : tones[tone];
  return <span className={cn(base, cls, className)}>{children}</span>;
}

export function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const positive = value >= 0;
  return (
    <span className={cn("num text-[11px]", positive ? "text-positive" : "text-negative")}>
      {positive ? "▲" : "▼"} {Math.abs(value).toFixed(1)}
      {suffix}
    </span>
  );
}

export function Bar({
  value,
  max,
  tone = "signal",
}: {
  value: number;
  max: number;
  tone?: "signal" | "positive" | "negative" | "info" | "warning";
}) {
  const w = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const bg = {
    signal: "bg-primary",
    positive: "bg-positive",
    negative: "bg-negative",
    info: "bg-info",
    warning: "bg-warning",
  }[tone];
  return (
    <div className="h-[6px] w-full bg-surface-2">
      <div className={cn("h-full", bg)} style={{ width: `${w}%` }} />
    </div>
  );
}

export function Th({ children, right, className }: { children?: ReactNode; right?: boolean; className?: string }) {
  return (
    <th
      className={cn(
        "label-xs sticky top-0 z-10 whitespace-nowrap border-b border-border bg-surface px-2 py-1.5 text-left font-normal",
        right && "text-right",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  right,
  mono,
  className,
}: {
  children?: ReactNode;
  right?: boolean;
  mono?: boolean;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "whitespace-nowrap border-b border-grid px-2 py-1.5 text-[12px]",
        right && "text-right",
        mono && "num",
        className,
      )}
    >
      {children}
    </td>
  );
}

export function TableWrap({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-3">
      <div>
        <div className="label-xs text-primary">{eyebrow}</div>
        <h1 className="mt-1 text-[22px] font-semibold leading-7 tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 max-w-3xl text-[12px] text-muted-foreground">{description}</p>
        )}
      </div>
      {right}
    </div>
  );
}

export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
        active
          ? "border-primary bg-primary/15 text-primary"
          : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function KeyValue({ items, cols = 2 }: { items: [string, ReactNode][]; cols?: number }) {
  return (
    <dl
      className="grid gap-x-6 gap-y-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
    >
      {items.map(([k, v]) => (
        <div key={k} className="flex items-baseline justify-between gap-3 border-b border-grid pb-1">
          <dt className="label-xs">{k}</dt>
          <dd className="num text-right text-[12px]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
