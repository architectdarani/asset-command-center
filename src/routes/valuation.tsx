import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { kes, pct, equity } from "@/lib/redm-data";
import { useRedm } from "@/lib/redm-store";
import { Panel, PageHeader, Metric, MetricRow, TableWrap, Th, Td, Tag, Chip, Bar, Delta } from "@/components/redm/ui";

export const Route = createFileRoute("/valuation")({
  head: () => ({
    meta: [
      { title: "Portfolio Valuation — REDM Investment" },
      { name: "description", content: "Gross asset value less debt equals net asset value, with valuation movement and unrealised gain across the REDM portfolio." },
      { property: "og:title", content: "Portfolio Valuation — REDM Investment" },
      { property: "og:description", content: "GAV, debt, NAV and valuation movement grouped by geography, asset class, stage and strategy." },
    ],
  }),
  component: PortfolioValuation,
});

type GroupKey = "portfolio" | "geography" | "assetClass" | "lifecycle" | "strategy";

const GROUPS: { key: GroupKey; label: string }[] = [
  { key: "portfolio", label: "Portfolio" },
  { key: "geography", label: "Geography" },
  { key: "assetClass", label: "Asset Class" },
  { key: "lifecycle", label: "Development Stage" },
  { key: "strategy", label: "Strategy" },
];

function PortfolioValuation() {
  const { assets: ASSETS, portfolio: PORTFOLIO } = useRedm();
  const [group, setGroup] = useState<GroupKey>("geography");

  const gav = PORTFOLIO.gav;
  const prev = PORTFOLIO.previousGav;
  const debt = PORTFOLIO.debt;
  const nav = PORTFOLIO.nav;
  const prevNav = prev - debt;
  const gain = ASSETS.reduce((s, a) => s + (a.currentValue - a.investedCapital), 0);

  const groups = [...new Set(ASSETS.map((a) => String(a[group])))].map((name) => {
    const items = ASSETS.filter((a) => String(a[group]) === name);
    const v = items.reduce((s, a) => s + a.currentValue, 0);
    const p = items.reduce((s, a) => s + a.previousValue, 0);
    const d = items.reduce((s, a) => s + a.debt, 0);
    return { name, count: items.length, v, p, d, nav: v - d, change: p ? ((v - p) / p) * 100 : 0 };
  }).sort((a, b) => b.v - a.v);

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Portfolio Valuation"
        title="Gross Asset Value → Net Asset Value"
        description="Valuation position, movement and unrealised gain across every REDM investment asset."
      />

      <Panel title="NAV Bridge">
        <MetricRow cols={6}>
          <Metric label="Gross Asset Value" value={kes(gav)} sub={<Delta value={((gav - prev) / prev) * 100} />} />
          <Metric label="Less Debt" value={kes(-debt)} tone="negative" sub={pct((debt / gav) * 100) + " LTV"} />
          <Metric label="Net Asset Value" value={kes(nav)} tone="positive" sub={<Delta value={((nav - prevNav) / prevNav) * 100} />} />
          <Metric label="Invested Capital" value={kes(PORTFOLIO.invested)} />
          <Metric label="Unrealised Gain" value={kes(gain)} tone={gain >= 0 ? "positive" : "negative"} sub={pct((gain / PORTFOLIO.invested) * 100) + " on cost"} />
          <Metric label="Valuation Movement" value={kes(gav - prev)} tone={gav >= prev ? "positive" : "negative"} sub="vs previous valuation" />
        </MetricRow>
      </Panel>

      <Panel
        title="Valuation by Group"
        meta={GROUPS.find((g) => g.key === group)?.label}
        actions={
          <div className="flex flex-wrap gap-1">
            {GROUPS.map((g) => (
              <Chip key={g.key} active={group === g.key} onClick={() => setGroup(g.key)}>
                {g.label}
              </Chip>
            ))}
          </div>
        }
        dense
      >
        <TableWrap>
          <thead>
            <tr>
              <Th>Group</Th>
              <Th right>Assets</Th>
              <Th right>Previous Valuation</Th>
              <Th right>Current Valuation</Th>
              <Th right>Change</Th>
              <Th right>Debt</Th>
              <Th right>NAV</Th>
              <Th right>% of GAV</Th>
              <Th>Weight</Th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.name} className="hover:bg-surface-2">
                <Td>{g.name}</Td>
                <Td right mono>{g.count}</Td>
                <Td right mono>{kes(g.p)}</Td>
                <Td right mono>{kes(g.v)}</Td>
                <Td right mono className={g.change >= 0 ? "text-positive" : "text-negative"}>{pct(g.change)}</Td>
                <Td right mono>{kes(g.d)}</Td>
                <Td right mono>{kes(g.nav)}</Td>
                <Td right mono>{pct((g.v / gav) * 100)}</Td>
                <Td className="w-[140px]"><Bar value={g.v} max={gav} /></Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>

      <Panel title="Asset Valuation Register" dense>
        <TableWrap>
          <thead>
            <tr>
              <Th>Asset</Th>
              <Th>Class</Th>
              <Th>Stage</Th>
              <Th right>Acquisition</Th>
              <Th right>Invested</Th>
              <Th right>Previous</Th>
              <Th right>Current</Th>
              <Th right>Movement</Th>
              <Th right>Debt</Th>
              <Th right>Equity</Th>
              <Th right>Unrealised</Th>
              <Th>Risk</Th>
            </tr>
          </thead>
          <tbody>
            {[...ASSETS].sort((a, b) => b.currentValue - a.currentValue).map((a) => {
              const move = a.previousValue ? ((a.currentValue - a.previousValue) / a.previousValue) * 100 : 0;
              const unreal = a.currentValue - a.investedCapital;
              return (
                <tr key={a.id} className="hover:bg-surface-2">
                  <Td>
                    <Link to="/assets/$assetId" params={{ assetId: a.id }} className="hover:text-primary">{a.name}</Link>
                  </Td>
                  <Td className="text-muted-foreground">{a.assetClass}</Td>
                  <Td><Tag tone="info">{a.lifecycle}</Tag></Td>
                  <Td right mono>{kes(a.acquisitionValue)}</Td>
                  <Td right mono>{kes(a.investedCapital)}</Td>
                  <Td right mono>{kes(a.previousValue)}</Td>
                  <Td right mono>{kes(a.currentValue)}</Td>
                  <Td right mono className={move >= 0 ? "text-positive" : "text-negative"}>{pct(move)}</Td>
                  <Td right mono>{kes(a.debt)}</Td>
                  <Td right mono>{kes(equity(a))}</Td>
                  <Td right mono className={unreal >= 0 ? "text-positive" : "text-negative"}>{kes(unreal)}</Td>
                  <Td><Tag tone="risk">{a.risk}</Tag></Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      </Panel>
    </div>
  );
}
