import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { kes, pct, noi, equity, ltv } from "@/lib/redm-data";
import { useRedm } from "@/lib/redm-store";
import { Panel, PageHeader, Metric, MetricRow, TableWrap, Th, Td, Tag, Chip, KeyValue } from "@/components/redm/ui";

export const Route = createFileRoute("/decisions")({
  head: () => ({
    meta: [
      { title: "Investment Decisions — REDM" },
      { name: "description", content: "Traceable investment decisions for every REDM asset: position, strategies, financial outcome, capital, risk and recommendation." },
      { property: "og:title", content: "Investment Decisions — REDM" },
      { property: "og:description", content: "Recommendation, evidence and alternative outcome for each REDM investment asset." },
    ],
  }),
  component: DecisionPanel,
});

function DecisionPanel() {
  const { assets: ASSETS } = useRedm();
  const first = ASSETS[0]!;
  const [selected, setSelected] = useState(first.id);
  const a = ASSETS.find((x) => x.id === selected) ?? first;
  const r = a.recommendation;
  const best = a.strategyOptions.reduce((b, o) => (o.irr > b.irr ? o : b), a.strategyOptions[0]!);

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Investment Decision"
        title="What should we do with this asset?"
        description="Every recommendation is traceable to the position, the strategy comparison, the evidence and the alternative outcome."
      />

      <Panel title="Portfolio Decision Board" dense>
        <TableWrap>
          <thead>
            <tr>
              <Th>Asset</Th>
              <Th>Lifecycle</Th>
              <Th>Current strategy</Th>
              <Th right>Value</Th>
              <Th right>Equity</Th>
              <Th right>NOI</Th>
              <Th right>IRR</Th>
              <Th>Risk</Th>
              <Th>Recommendation</Th>
              <Th>Alternative</Th>
            </tr>
          </thead>
          <tbody>
            {ASSETS.map((x) => (
              <tr
                key={x.id}
                onClick={() => setSelected(x.id)}
                className={`cursor-pointer ${x.id === selected ? "bg-primary/10" : "hover:bg-surface-2"}`}
              >
                <Td>{x.name}</Td>
                <Td className="text-muted-foreground">{x.lifecycle}</Td>
                <Td><Tag tone="info">{x.strategy}</Tag></Td>
                <Td right mono>{kes(x.currentValue)}</Td>
                <Td right mono>{kes(equity(x))}</Td>
                <Td right mono>{kes(noi(x))}</Td>
                <Td right mono className="text-primary">{pct(x.projectedIrr)}</Td>
                <Td><Tag tone="risk">{x.risk}</Tag></Td>
                <Td><Tag tone="signal">{x.recommendation.decision}</Tag></Td>
                <Td className="text-muted-foreground">{x.recommendation.alternative}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>

      <Panel
        title="Decision Detail"
        meta={a.name}
        actions={
          <Link to="/assets/$assetId" params={{ assetId: a.id }} className="label-xs text-primary">
            Open asset profile →
          </Link>
        }
      >
        <MetricRow cols={6}>
          <Metric label="Current value" value={kes(a.currentValue)} />
          <Metric label="Invested capital" value={kes(a.investedCapital)} />
          <Metric label="Debt" value={kes(a.debt)} tone="negative" sub={`LTV ${pct(ltv(a))}`} />
          <Metric label="NOI" value={kes(noi(a))} />
          <Metric label="Projected IRR" value={pct(a.projectedIrr)} tone="signal" />
          <Metric label="Risk" value={<Tag tone="risk">{a.risk}</Tag>} />
        </MetricRow>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Recommendation" meta={r.decision}>
          <div className="border border-primary/40 bg-primary/10 p-3">
            <div className="label-xs text-primary">Decision</div>
            <div className="mt-1 text-[18px] font-semibold tracking-tight">{r.decision}</div>
          </div>
          <div className="label-xs mt-4 text-foreground/80">Why</div>
          <ul className="mt-1 space-y-1">
            {r.why.map((w) => (
              <li key={w} className="border-b border-grid pb-1 text-[12px] text-muted-foreground">
                {w}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Evidence">
          <KeyValue cols={1} items={r.evidence.map((e) => [e.label, e.value] as [string, string])} />
        </Panel>

        <Panel title="Alternative & Outcome">
          <KeyValue
            cols={1}
            items={[
              ["Alternative", r.alternative],
              ["Expected net proceeds", kes(r.altProceeds)],
              ["Expected hold IRR", pct(r.holdIrr)],
              ["Best modelled strategy", best.strategy],
              ["Best strategy IRR", pct(best.irr)],
              ["Capital required", kes(best.capitalRequired)],
              ["Exit value", kes(best.exitValue)],
            ]}
          />
        </Panel>
      </div>

      <Panel title="Available Strategies" meta="Financial outcome, capital requirement and risk" dense>
        <div className="flex flex-wrap gap-1.5 p-3">
          {a.strategyOptions.map((o) => (
            <Chip key={o.strategy} active={o.strategy === best.strategy}>
              {o.strategy} · IRR {pct(o.irr)} · {kes(o.capitalRequired)}
            </Chip>
          ))}
        </div>
      </Panel>

      <Panel title="Decision History" meta={a.name} dense>
        <TableWrap>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Decision</Th>
              <Th>By</Th>
              <Th>Note</Th>
            </tr>
          </thead>
          <tbody>
            {a.decisions.map((d) => (
              <tr key={`${d.date}-${d.decision}`} className="hover:bg-surface-2">
                <Td mono>{d.date}</Td>
                <Td><Tag tone="info">{d.decision}</Tag></Td>
                <Td className="text-muted-foreground">{d.by}</Td>
                <Td className="max-w-[520px] whitespace-normal text-muted-foreground">{d.note}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>
    </div>
  );
}
