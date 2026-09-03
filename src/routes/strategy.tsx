import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ASSETS, kes, pct, noi, equity, ltv, yieldPct } from "@/lib/redm-data";
import { Panel, PageHeader, Metric, MetricRow, TableWrap, Th, Td, Tag, KeyValue, Chip } from "@/components/redm/ui";

export const Route = createFileRoute("/strategy")({
  head: () => ({
    meta: [
      { title: "Strategy Analysis — REDM Investment" },
      { name: "description", content: "Compare hold, lease, sell, refinance, redevelop and expand strategies for every REDM investment asset." },
      { property: "og:title", content: "Strategy Analysis — REDM Investment" },
      { property: "og:description", content: "Strategy comparison, hold, lease, sell, refinance and redevelopment analysis across the REDM portfolio." },
    ],
  }),
  component: StrategyAnalysis,
});

function StrategyAnalysis() {
  const first = ASSETS[0]!;
  const [selected, setSelected] = useState(first.id);
  const a = ASSETS.find((x) => x.id === selected) ?? first;
  const options = a.strategyOptions;
  const best = options.reduce((b, o) => (o.irr > b.irr ? o : b), options[0]!);

  const rent = a.revenue;
  const netOperating = noi(a);
  const eq = equity(a);
  const saleValue = Math.round(a.currentValue * 1.03);
  const txCosts = Math.round(saleValue * 0.035);
  const netProceeds = saleValue - txCosts - a.debt;
  const newDebt = Math.round(a.currentValue * 0.6);
  const release = newDebt - a.debt;
  const addGfa = Math.max(0, a.potentialGfa - a.gfa);
  const addCost = Math.round(addGfa * 62_000);
  const addRevenue = Math.round(addGfa * 96_000);

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Strategy Analysis"
        title="Hold / Lease / Sell / Refinance / Redevelop"
        description="Every strategy modelled as a scenario against the same asset, compared on capital, income, return, exit value and risk."
      />

      <Panel title="Select Asset" dense>
        <div className="flex flex-wrap gap-1.5 p-3">
          {ASSETS.map((x) => (
            <Chip key={x.id} active={x.id === selected} onClick={() => setSelected(x.id)}>
              {x.name}
            </Chip>
          ))}
        </div>
      </Panel>

      <Panel title="Current Position" meta={`${a.name} · ${a.location}`}>
        <MetricRow cols={6}>
          <Metric label="Current value" value={kes(a.currentValue)} />
          <Metric label="Debt" value={kes(a.debt)} tone="negative" sub={`LTV ${pct(ltv(a))}`} />
          <Metric label="Equity" value={kes(eq)} tone="positive" />
          <Metric label="NOI" value={kes(netOperating)} sub={`Yield ${pct(yieldPct(a))}`} />
          <Metric label="Current strategy" value={<span className="text-[13px]">{a.strategy}</span>} tone="signal" />
          <Metric label="Risk" value={<Tag tone="risk">{a.risk}</Tag>} />
        </MetricRow>
      </Panel>

      <Panel title="Strategy Comparison" meta={`Best IRR: ${best.strategy}`} dense>
        <TableWrap>
          <thead>
            <tr>
              <Th>Strategy</Th>
              <Th right>Capital required</Th>
              <Th right>Debt</Th>
              <Th right>Equity</Th>
              <Th right>Income</Th>
              <Th right>NOI</Th>
              <Th right>Yield</Th>
              <Th right>IRR</Th>
              <Th right>ROI</Th>
              <Th right>Exit value</Th>
              <Th>Risk</Th>
            </tr>
          </thead>
          <tbody>
            {options.map((o) => (
              <tr key={o.strategy} className={o.strategy === best.strategy ? "bg-primary/10" : "hover:bg-surface-2"}>
                <Td>{o.strategy}</Td>
                <Td right mono>{kes(o.capitalRequired)}</Td>
                <Td right mono>{kes(o.debt)}</Td>
                <Td right mono>{kes(o.equity)}</Td>
                <Td right mono>{kes(o.income)}</Td>
                <Td right mono>{kes(o.noi)}</Td>
                <Td right mono>{pct(o.yieldPct)}</Td>
                <Td right mono className="text-primary">{pct(o.irr)}</Td>
                <Td right mono>{pct(o.roi)}</Td>
                <Td right mono>{kes(o.exitValue)}</Td>
                <Td><Tag tone="risk">{o.risk}</Tag></Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Hold Analysis" meta={a.name}>
          <KeyValue
            cols={1}
            items={[
              ["Current valuation", kes(a.currentValue)],
              ["Rental income", kes(rent)],
              ["Operating expenses", kes(a.opex)],
              ["NOI", kes(netOperating)],
              ["Debt", kes(a.debt)],
              ["Equity", kes(eq)],
              ["Yield", pct(yieldPct(a))],
              ["Capital appreciation (p.a.)", pct(4.5)],
              ["5-year value", kes(Math.round(a.currentValue * 1.045 ** 5))],
              ["10-year value", kes(Math.round(a.currentValue * 1.045 ** 10))],
              ["15-year value", kes(Math.round(a.currentValue * 1.045 ** 15))],
            ]}
          />
        </Panel>

        <Panel title="Lease Analysis" meta={a.name}>
          <KeyValue
            cols={1}
            items={[
              ["Gross rent", kes(rent)],
              ["Occupancy", pct(a.occupancy)],
              ["Lease term", "6 yrs (3+3)"],
              ["Escalation", "7.5% p.a."],
              ["Operating expenses", kes(a.opex)],
              ["NOI", kes(netOperating)],
              ["Yield", pct(yieldPct(a))],
              ["Lease expiry profile", "22% ≤24m · 41% 24–60m · 37% >60m"],
              ["Tenant concentration", "Top 3 = 38% of income"],
              ["Projected cash flow (yr 1)", kes(Math.round(netOperating * 0.94))],
            ]}
          />
        </Panel>

        <Panel title="Sell Analysis" meta={a.name}>
          <KeyValue
            cols={1}
            items={[
              ["Current valuation", kes(a.currentValue)],
              ["Expected sale value", kes(saleValue)],
              ["Transaction costs", kes(txCosts)],
              ["Outstanding debt", kes(a.debt)],
              ["Net sale proceeds", <span className="text-positive">{kes(netProceeds)}</span>],
              ["Capital gain", kes(a.currentValue - a.acquisitionValue)],
              ["Equity return", pct(eq ? ((netProceeds - eq) / eq) * 100 : 0)],
              ["Exit IRR", pct(a.projectedIrr * 0.82)],
            ]}
          />
        </Panel>

        <Panel title="Refinance Analysis" meta={a.name}>
          <KeyValue
            cols={1}
            items={[
              ["Current value", kes(a.currentValue)],
              ["Existing debt", kes(a.debt)],
              ["Current LTV", pct(ltv(a))],
              ["Potential new debt", kes(newDebt)],
              ["New LTV", pct(60)],
              ["Debt repayment", kes(a.debt)],
              ["Equity release", <span className={release >= 0 ? "text-positive" : "text-negative"}>{kes(release)}</span>],
              ["Interest cost (p.a.)", kes(Math.round(newDebt * 0.115))],
              ["Cash flow impact", kes(Math.round(netOperating - newDebt * 0.115))],
              ["Post-refinance yield", pct(a.currentValue ? (netOperating / (a.currentValue - newDebt)) * 100 : 0)],
            ]}
          />
        </Panel>

        <Panel title="Redevelopment Analysis" meta={`${a.name} · GFA ${a.gfa.toLocaleString()} → ${a.potentialGfa.toLocaleString()} m²`} className="lg:col-span-2">
          <MetricRow cols={7}>
            <Metric label="Additional GFA" value={`${addGfa.toLocaleString()} m²`} />
            <Metric label="Additional cost" value={kes(addCost)} tone="negative" />
            <Metric label="Additional revenue" value={kes(addRevenue)} tone="positive" />
            <Metric label="Additional debt" value={kes(Math.round(addCost * 0.65))} />
            <Metric label="Additional equity" value={kes(Math.round(addCost * 0.35))} />
            <Metric label="Additional profit" value={kes(addRevenue - addCost)} tone={addRevenue - addCost >= 0 ? "positive" : "negative"} />
            <Metric label="Incremental IRR" value={pct(addCost ? ((addRevenue - addCost) / addCost) * 100 * 0.34 : 0)} tone="signal" />
          </MetricRow>
        </Panel>
      </div>
    </div>
  );
}
