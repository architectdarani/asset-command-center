import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ASSETS, kes, pct, type CashFlowRow } from "@/lib/redm-data";
import { Panel, PageHeader, Metric, MetricRow, TableWrap, Th, Td, Chip, Bar } from "@/components/redm/ui";

export const Route = createFileRoute("/cashflow")({
  head: () => ({
    meta: [
      { title: "Portfolio Cash Flow — REDM Investment" },
      { name: "description", content: "Acquisition, development, operating, debt and disposal cash flow across the REDM portfolio and each investment asset." },
      { property: "og:title", content: "Portfolio Cash Flow — REDM Investment" },
      { property: "og:description", content: "Monthly, quarterly and annual portfolio cash flow with asset-level drill-down." },
    ],
  }),
  component: PortfolioCashFlow,
});

const net = (r: CashFlowRow) => r.opIncome + r.debtDraw + r.sales - r.capex - r.opCost - r.interest - r.debtRepay;

function aggregate(rows: CashFlowRow[][]) {
  const periods = rows[0]?.map((r) => r.period) ?? [];
  return periods.map((period, i) => {
    const acc: CashFlowRow = { period, capex: 0, opIncome: 0, opCost: 0, debtDraw: 0, interest: 0, debtRepay: 0, sales: 0 };
    for (const set of rows) {
      const r = set[i];
      if (!r) continue;
      acc.capex += r.capex;
      acc.opIncome += r.opIncome;
      acc.opCost += r.opCost;
      acc.debtDraw += r.debtDraw;
      acc.interest += r.interest;
      acc.debtRepay += r.debtRepay;
      acc.sales += r.sales;
    }
    return acc;
  });
}

function rollUp(rows: CashFlowRow[], size: number, label: (i: number) => string) {
  const out: CashFlowRow[] = [];
  for (let i = 0; i < rows.length; i += size) {
    const chunk = rows.slice(i, i + size);
    out.push(
      chunk.reduce(
        (acc, r) => ({
          period: label(out.length),
          capex: acc.capex + r.capex,
          opIncome: acc.opIncome + r.opIncome,
          opCost: acc.opCost + r.opCost,
          debtDraw: acc.debtDraw + r.debtDraw,
          interest: acc.interest + r.interest,
          debtRepay: acc.debtRepay + r.debtRepay,
          sales: acc.sales + r.sales,
        }),
        { period: "", capex: 0, opIncome: 0, opCost: 0, debtDraw: 0, interest: 0, debtRepay: 0, sales: 0 } as CashFlowRow,
      ),
    );
  }
  return out;
}

function PortfolioCashFlow() {
  const [view, setView] = useState<"MONTHLY" | "QUARTERLY" | "ANNUAL">("QUARTERLY");
  const [assetId, setAssetId] = useState<string | null>(null);

  const base = useMemo(() => {
    const sets = ASSETS.filter((a) => !assetId || a.id === assetId).map((a) => a.cashflow);
    return aggregate(sets);
  }, [assetId]);

  const rows = useMemo(() => {
    if (view === "QUARTERLY") return base;
    if (view === "ANNUAL") return rollUp(base, 4, (i) => `FY ${2026 + i}`);
    return base.flatMap((r, qi) =>
      [0, 1, 2].map((m) => ({
        ...r,
        period: `M${qi * 3 + m + 1}`,
        capex: Math.round(r.capex / 3),
        opIncome: Math.round(r.opIncome / 3),
        opCost: Math.round(r.opCost / 3),
        debtDraw: Math.round(r.debtDraw / 3),
        interest: Math.round(r.interest / 3),
        debtRepay: Math.round(r.debtRepay / 3),
        sales: Math.round(r.sales / 3),
      })),
    );
  }, [base, view]);

  const totals = rows.reduce(
    (a, r) => ({
      capex: a.capex + r.capex,
      opIncome: a.opIncome + r.opIncome,
      opCost: a.opCost + r.opCost,
      debtDraw: a.debtDraw + r.debtDraw,
      interest: a.interest + r.interest,
      debtRepay: a.debtRepay + r.debtRepay,
      sales: a.sales + r.sales,
    }),
    { capex: 0, opIncome: 0, opCost: 0, debtDraw: 0, interest: 0, debtRepay: 0, sales: 0 },
  );
  const netTotal = totals.opIncome + totals.debtDraw + totals.sales - totals.capex - totals.opCost - totals.interest - totals.debtRepay;
  const peak = Math.max(...rows.map((r) => Math.abs(net(r))), 1);

  let running = 0;

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Portfolio Cash Flow"
        title="Capital Deployment & Cash Position"
        description="Where capital is being deployed, where it is trapped, and what the portfolio returns period by period."
        right={
          <div className="flex gap-1">
            {(["MONTHLY", "QUARTERLY", "ANNUAL"] as const).map((v) => (
              <Chip key={v} active={view === v} onClick={() => setView(v)}>{v}</Chip>
            ))}
          </div>
        }
      />

      <Panel title="Cash Flow Summary" meta={assetId ? ASSETS.find((a) => a.id === assetId)?.name : "All assets"}>
        <MetricRow cols={7}>
          <Metric label="Development Capex" value={kes(-totals.capex)} tone="negative" />
          <Metric label="Operating Income" value={kes(totals.opIncome)} tone="positive" />
          <Metric label="Operating Cost" value={kes(-totals.opCost)} tone="negative" />
          <Metric label="Debt Drawdowns" value={kes(totals.debtDraw)} tone="signal" />
          <Metric label="Interest" value={kes(-totals.interest)} tone="negative" />
          <Metric label="Sales & Disposals" value={kes(totals.sales)} tone="positive" />
          <Metric label="Net Cash Flow" value={kes(netTotal)} tone={netTotal >= 0 ? "positive" : "negative"} />
        </MetricRow>
      </Panel>

      <Panel
        title="Asset Filter"
        actions={assetId && <Chip onClick={() => setAssetId(null)}>Clear</Chip>}
      >
        <div className="flex flex-wrap gap-1">
          {ASSETS.map((a) => (
            <Chip key={a.id} active={assetId === a.id} onClick={() => setAssetId(assetId === a.id ? null : a.id)}>
              {a.name}
            </Chip>
          ))}
        </div>
      </Panel>

      <Panel title="Cash Flow Timeline" meta={view} dense>
        <TableWrap>
          <thead>
            <tr>
              <Th>Period</Th>
              <Th right>Opening</Th>
              <Th right>Acquisition / Capex</Th>
              <Th right>Operating Income</Th>
              <Th right>Operating Cost</Th>
              <Th right>Debt Drawdown</Th>
              <Th right>Interest</Th>
              <Th right>Debt Repayment</Th>
              <Th right>Sales / Disposals</Th>
              <Th right>Net Cash Flow</Th>
              <Th right>Closing</Th>
              <Th>Profile</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const n = net(r);
              const opening = running;
              running += n;
              return (
                <tr key={r.period} className="hover:bg-surface-2">
                  <Td>{r.period}</Td>
                  <Td right mono className="text-muted-foreground">{kes(opening)}</Td>
                  <Td right mono className="text-negative">{kes(-r.capex)}</Td>
                  <Td right mono className="text-positive">{kes(r.opIncome)}</Td>
                  <Td right mono className="text-negative">{kes(-r.opCost)}</Td>
                  <Td right mono className="text-info">{kes(r.debtDraw)}</Td>
                  <Td right mono className="text-negative">{kes(-r.interest)}</Td>
                  <Td right mono className="text-negative">{kes(-r.debtRepay)}</Td>
                  <Td right mono className="text-positive">{kes(r.sales)}</Td>
                  <Td right mono className={n >= 0 ? "text-positive" : "text-negative"}>{kes(n)}</Td>
                  <Td right mono>{kes(running)}</Td>
                  <Td className="w-[120px]"><Bar value={Math.abs(n)} max={peak} tone={n >= 0 ? "positive" : "negative"} /></Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      </Panel>

      <Panel title="Capital Deployed by Asset" dense>
        <TableWrap>
          <thead>
            <tr>
              <Th>Asset</Th>
              <Th right>Capex</Th>
              <Th right>Operating Income</Th>
              <Th right>Debt Drawn</Th>
              <Th right>Interest</Th>
              <Th right>Sales</Th>
              <Th right>Net Cash Flow</Th>
              <Th right>Capital Trapped</Th>
            </tr>
          </thead>
          <tbody>
            {ASSETS.map((a) => {
              const t = a.cashflow.reduce(
                (s, r) => ({
                  capex: s.capex + r.capex,
                  opIncome: s.opIncome + r.opIncome,
                  debtDraw: s.debtDraw + r.debtDraw,
                  interest: s.interest + r.interest,
                  sales: s.sales + r.sales,
                  net: s.net + net(r),
                }),
                { capex: 0, opIncome: 0, debtDraw: 0, interest: 0, sales: 0, net: 0 },
              );
              const trapped = a.investedCapital - t.sales;
              return (
                <tr key={a.id} className="hover:bg-surface-2">
                  <Td><Link to="/assets/$assetId" params={{ assetId: a.id }} className="hover:text-primary">{a.name}</Link></Td>
                  <Td right mono className="text-negative">{kes(-t.capex)}</Td>
                  <Td right mono className="text-positive">{kes(t.opIncome)}</Td>
                  <Td right mono>{kes(t.debtDraw)}</Td>
                  <Td right mono className="text-negative">{kes(-t.interest)}</Td>
                  <Td right mono className="text-positive">{kes(t.sales)}</Td>
                  <Td right mono className={t.net >= 0 ? "text-positive" : "text-negative"}>{kes(t.net)}</Td>
                  <Td right mono className={trapped > 0 ? "text-warning" : "text-positive"}>{kes(Math.max(0, trapped))}</Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      </Panel>
    </div>
  );
}
