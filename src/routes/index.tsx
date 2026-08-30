import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ASSETS,
  PORTFOLIO,
  LIFECYCLE_ORDER,
  STRATEGIES,
  RISKS,
  ACQUISITIONS,
  kes,
  pct,
  noi,
  equity,
  yieldPct,
} from "@/lib/redm-data";
import { Panel, Metric, MetricRow, Tag, Bar, PageHeader, Th, Td, TableWrap, Delta } from "@/components/redm/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Investment Command — REDM Portfolio" },
      {
        name: "description",
        content:
          "Executive view of the REDM real estate investment portfolio: what we own, build, lease, owe and earn.",
      },
      { property: "og:title", content: "Investment Command — REDM Portfolio" },
      {
        property: "og:description",
        content: "Capital allocation command centre for REDM investment assets.",
      },
    ],
  }),
  component: InvestmentCommand,
});

const QUESTIONS: { q: string; a: string; to: string }[] = [
  { q: "What do we own?", a: `${ASSETS.length} assets · ${kes(PORTFOLIO.gav)} GAV`, to: "/portfolio" },
  { q: "What are we buying?", a: `${ACQUISITIONS.length} live opportunities`, to: "/acquisitions" },
  { q: "What are we building?", a: `${ASSETS.filter((a) => ["DESIGN", "APPROVAL", "CONSTRUCTION"].includes(a.lifecycle)).length} assets in development`, to: "/pipeline" },
  { q: "What are we selling?", a: `4 disposals in progress`, to: "/disposals" },
  { q: "What produces income?", a: `${kes(PORTFOLIO.noi)} NOI`, to: "/cashflow" },
  { q: "Where is capital trapped?", a: `Nyali · ${kes(1_380_000_000)} equity, slow sales`, to: "/assets/REDM-IA-004" },
  { q: "Where is our debt?", a: `${kes(PORTFOLIO.debt)} · LTV ${pct((PORTFOLIO.debt / PORTFOLIO.gav) * 100)}`, to: "/valuation" },
  { q: "What should we do next?", a: `5 decisions awaiting IC`, to: "/decisions" },
];

function InvestmentCommand() {
  const gavDelta = ((PORTFOLIO.gav - PORTFOLIO.previousGav) / PORTFOLIO.previousGav) * 100;
  const byStrategy = STRATEGIES.map((s) => ({
    strategy: s,
    assets: ASSETS.filter((a) => a.strategy === s),
  })).filter((g) => g.assets.length);
  const maxStrategyValue = Math.max(
    ...byStrategy.map((g) => g.assets.reduce((s, a) => s + a.currentValue, 0)),
  );
  const top = [...ASSETS].sort((a, b) => b.projectedIrr - a.projectedIrr);

  return (
    <>
      <PageHeader
        eyebrow="01 / Investment Command"
        title="Capital Allocation Command Centre"
        description="One executive surface across ownership, development, income, debt, valuation and strategy. The central object is the investment asset."
        right={
          <div className="flex gap-2">
            <Tag tone="signal">CYCLE Q3 2026</Tag>
            <Tag>REPORTING KES</Tag>
          </div>
        }
      />

      <Panel title="Portfolio Position" meta="Gross asset value, leverage and return">
        <MetricRow cols={7}>
          <Metric label="Gross Asset Value" value={kes(PORTFOLIO.gav)} sub={<Delta value={gavDelta} />} />
          <Metric label="Debt" value={kes(PORTFOLIO.debt)} sub={`LTV ${pct((PORTFOLIO.debt / PORTFOLIO.gav) * 100)}`} />
          <Metric label="Net Asset Value" value={kes(PORTFOLIO.nav)} tone="signal" sub="Post-debt equity" />
          <Metric label="Invested Capital" value={kes(PORTFOLIO.invested)} sub="Cumulative deployment" />
          <Metric label="Operating Income" value={kes(PORTFOLIO.noi)} tone="positive" sub={`Revenue ${kes(PORTFOLIO.revenue)}`} />
          <Metric label="Portfolio Yield" value={pct((PORTFOLIO.noi / PORTFOLIO.gav) * 100)} sub="NOI / GAV" />
          <Metric
            label="Weighted IRR"
            value={pct(
              ASSETS.reduce((s, a) => s + a.projectedIrr * a.currentValue, 0) / PORTFOLIO.gav,
            )}
            tone="signal"
            sub="Projected, value-weighted"
          />
        </MetricRow>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Panel title="Lifecycle Distribution" meta="Assets by stage of the investment lifecycle" dense>
          <div className="divide-y divide-grid">
            {LIFECYCLE_ORDER.map((stage) => {
              const group = ASSETS.filter((a) => a.lifecycle === stage);
              const value = group.reduce((s, a) => s + a.currentValue, 0);
              return (
                <div key={stage} className="grid grid-cols-[150px_1fr_90px_36px] items-center gap-3 px-3 py-[7px]">
                  <span className={`label-xs ${group.length ? "text-foreground" : ""}`}>{stage}</span>
                  <Bar value={value} max={PORTFOLIO.gav / 2} tone={group.length ? "signal" : "info"} />
                  <span className="num text-right text-[11px]">{value ? kes(value) : "—"}</span>
                  <span className="num text-right text-[11px] text-muted-foreground">{group.length}</span>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Capital Strategy" meta="Value under each declared strategy" dense>
          <div className="divide-y divide-grid">
            {byStrategy.map(({ strategy, assets }) => {
              const value = assets.reduce((s, a) => s + a.currentValue, 0);
              return (
                <Link
                  key={strategy}
                  to="/strategy"
                  className="grid grid-cols-[110px_1fr_92px_36px] items-center gap-3 px-3 py-[9px] hover:bg-surface-2"
                >
                  <Tag tone="signal">{strategy}</Tag>
                  <Bar value={value} max={maxStrategyValue} />
                  <span className="num text-right text-[12px]">{kes(value)}</span>
                  <span className="num text-right text-[11px] text-muted-foreground">{assets.length}</span>
                </Link>
              );
            })}
          </div>
        </Panel>
      </div>

      <Panel title="Portfolio Questions" meta="The command centre answers these directly" dense>
        <div className="grid grid-cols-2 divide-x divide-y divide-grid lg:grid-cols-4">
          {QUESTIONS.map((q) => (
            <Link key={q.q} to={q.to} className="block px-3 py-3 hover:bg-surface-2">
              <div className="text-[12px] text-muted-foreground">{q.q}</div>
              <div className="num mt-1 text-[13px] text-foreground">{q.a}</div>
            </Link>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Asset Performance" meta="Ranked by projected IRR" dense>
          <TableWrap>
            <thead>
              <tr>
                <Th>Asset</Th>
                <Th>Stage</Th>
                <Th right>Value</Th>
                <Th right>Debt</Th>
                <Th right>Equity</Th>
                <Th right>NOI</Th>
                <Th right>Yield</Th>
                <Th right>IRR</Th>
                <Th>Risk</Th>
              </tr>
            </thead>
            <tbody>
              {top.map((a) => (
                <tr key={a.id} className="hover:bg-surface-2">
                  <Td>
                    <Link to="/assets/$assetId" params={{ assetId: a.id }} className="hover:text-primary">
                      {a.name}
                    </Link>
                  </Td>
                  <Td className="text-muted-foreground">{a.lifecycle}</Td>
                  <Td right mono>{kes(a.currentValue)}</Td>
                  <Td right mono>{kes(a.debt)}</Td>
                  <Td right mono>{kes(equity(a))}</Td>
                  <Td right mono>{kes(noi(a))}</Td>
                  <Td right mono>{pct(yieldPct(a))}</Td>
                  <Td right mono className="text-primary">{pct(a.projectedIrr)}</Td>
                  <Td><Tag tone="risk">{a.risk}</Tag></Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Panel>

        <Panel title="Live Exposure" meta="Highest impact open risks" dense>
          <div className="divide-y divide-grid">
            {[...RISKS]
              .sort((a, b) => b.impact - a.impact)
              .slice(0, 6)
              .map((r) => {
                const asset = ASSETS.find((a) => a.id === r.assetId);
                return (
                  <div key={r.id} className="px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12px]">{r.category}</span>
                      <Tag tone="risk">{r.severity}</Tag>
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">{r.evidence}</div>
                    <div className="num mt-1 flex justify-between text-[11px]">
                      <Link to="/assets/$assetId" params={{ assetId: r.assetId }} className="text-muted-foreground hover:text-primary">
                        {asset?.name}
                      </Link>
                      <span className="text-negative">{r.impact ? kes(r.impact) : "—"}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </Panel>
      </div>
    </>
  );
}
