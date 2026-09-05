import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { STRATEGIES, LIFECYCLE_ORDER, kes, pct, noi } from "@/lib/redm-data";
import { useRedm } from "@/lib/redm-store";
import { Panel, PageHeader, Chip, Metric, MetricRow } from "@/components/redm/ui";
import { PortfolioAssetTable } from "@/components/redm/asset-table";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio Overview — REDM Investment" },
      { name: "description", content: "Filterable overview of every REDM investment asset: value, capital, debt, income, yield and return." },
      { property: "og:title", content: "Portfolio Overview — REDM Investment" },
      { property: "og:description", content: "Every REDM investment asset with value, capital, debt, income and return." },
    ],
  }),
  component: PortfolioOverview,
});

function PortfolioOverview() {
  const { assets: ASSETS, portfolio: PORTFOLIO } = useRedm();
  const [geo, setGeo] = useState<string | null>(null);
  const [cls, setCls] = useState<string | null>(null);
  const [life, setLife] = useState<string | null>(null);
  const [strat, setStrat] = useState<string | null>(null);
  const [risk, setRisk] = useState<string | null>(null);
  const [sort, setSort] = useState<"value" | "yield" | "irr" | "risk">("value");

  const geos = [...new Set(ASSETS.map((a) => a.geography))];
  const classes = [...new Set(ASSETS.map((a) => a.assetClass))];
  const riskOrder = { LOW: 0, MODERATE: 1, ELEVATED: 2, HIGH: 3 } as const;

  const filtered = useMemo(() => {
    const list = ASSETS.filter(
      (a) =>
        (!geo || a.geography === geo) &&
        (!cls || a.assetClass === cls) &&
        (!life || a.lifecycle === life) &&
        (!strat || a.strategy === strat) &&
        (!risk || a.risk === risk),
    );
    return [...list].sort((a, b) => {
      if (sort === "value") return b.currentValue - a.currentValue;
      if (sort === "irr") return b.projectedIrr - a.projectedIrr;
      if (sort === "risk") return riskOrder[b.risk] - riskOrder[a.risk];
      return noi(b) / b.currentValue - noi(a) / a.currentValue;
    });
  }, [geo, cls, life, strat, risk, sort]);

  const value = filtered.reduce((s, a) => s + a.currentValue, 0);
  const debt = filtered.reduce((s, a) => s + a.debt, 0);
  const income = filtered.reduce((s, a) => s + noi(a), 0);

  return (
    <>
      <PageHeader
        eyebrow="02 / Portfolio"
        title="Portfolio Overview"
        description="Every investment asset, filterable across geography, class, lifecycle, strategy and risk."
      />

      <Panel title="Selection" meta={`${filtered.length} of ${ASSETS.length} assets`}>
        <MetricRow cols={5}>
          <Metric label="Selected Value" value={kes(value)} sub={`${pct((value / PORTFOLIO.gav) * 100)} of GAV`} />
          <Metric label="Debt" value={kes(debt)} sub={value ? `LTV ${pct((debt / value) * 100)}` : "—"} />
          <Metric label="Equity" value={kes(value - debt)} tone="signal" />
          <Metric label="NOI" value={kes(income)} tone="positive" />
          <Metric label="Yield" value={value ? pct((income / value) * 100) : "—"} />
        </MetricRow>
      </Panel>

      <Panel title="Filters" meta="Operational, not decorative">
        <div className="space-y-2">
          <FilterRow label="Geography" options={geos} value={geo} onChange={setGeo} />
          <FilterRow label="Asset class" options={classes} value={cls} onChange={setCls} />
          <FilterRow label="Lifecycle" options={LIFECYCLE_ORDER as unknown as string[]} value={life} onChange={setLife} />
          <FilterRow label="Strategy" options={STRATEGIES as unknown as string[]} value={strat} onChange={setStrat} />
          <FilterRow label="Risk" options={["LOW", "MODERATE", "ELEVATED", "HIGH"]} value={risk} onChange={setRisk} />
          <FilterRow
            label="Sort"
            options={["value", "yield", "irr", "risk"]}
            value={sort}
            onChange={(v) => setSort((v ?? "value") as typeof sort)}
            allowClear={false}
          />
        </div>
      </Panel>

      <Panel title="Portfolio Asset Table" meta="Click an asset to open its investment profile" dense>
        <PortfolioAssetTable assets={filtered} />
      </Panel>
    </>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
  allowClear = true,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
  allowClear?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="label-xs w-24 shrink-0">{label}</span>
      {allowClear && (
        <Chip active={!value} onClick={() => onChange(null)}>
          All
        </Chip>
      )}
      {options.map((o) => (
        <Chip key={o} active={value === o} onClick={() => onChange(o)}>
          {o}
        </Chip>
      ))}
    </div>
  );
}
