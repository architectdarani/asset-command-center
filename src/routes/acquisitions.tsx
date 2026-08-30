import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ACQUISITIONS, ACQUISITION_STAGES, kes, pct, num, type Acquisition } from "@/lib/redm-data";
import { Panel, PageHeader, Chip, Metric, MetricRow, TableWrap, Th, Td, Tag, KeyValue } from "@/components/redm/ui";

export const Route = createFileRoute("/acquisitions")({
  head: () => ({
    meta: [
      { title: "Acquisition Command — REDM Investment" },
      { name: "description", content: "REDM acquisition pipeline from identification to completion with feasibility, development potential and projected return." },
      { property: "og:title", content: "Acquisition Command — REDM Investment" },
      { property: "og:description", content: "Acquisition pipeline, feasibility and investment recommendation for every REDM opportunity." },
    ],
  }),
  component: AcquisitionCommand,
});

function feasibility(a: Acquisition) {
  const land = a.askingPrice;
  const construction = Math.round(a.potentialGfa * 62_000);
  const fees = Math.round(construction * 0.09);
  const finance = Math.round((land + construction) * 0.075);
  const taxes = Math.round(land * 0.04);
  const marketing = Math.round(construction * 0.02);
  const contingency = Math.round(construction * 0.05);
  const other = a.acquisitionCost;
  const cost = land + construction + fees + finance + taxes + marketing + contingency + other;
  const sales = Math.round(a.potentialGfa * 96_000);
  const rental = Math.round(a.potentialGfa * 3_200);
  const exit = Math.round(sales * 0.18);
  const value = sales + rental + exit;
  const profit = value - cost;
  return {
    land, construction, fees, finance, taxes, marketing, contingency, other, cost,
    sales, rental, exit, value, profit,
    margin: (profit / value) * 100,
    roi: (profit / cost) * 100,
    equity: Math.round(cost * 0.35),
    debt: Math.round(cost * 0.65),
    payback: 4.2,
  };
}

function AcquisitionCommand() {
  const [stage, setStage] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(ACQUISITIONS[0].id);
  const list = ACQUISITIONS.filter((a) => !stage || a.stage === stage);
  const active = ACQUISITIONS.find((a) => a.id === selected) ?? ACQUISITIONS[0];
  const f = feasibility(active);

  const pipelineValue = ACQUISITIONS.reduce((s, a) => s + a.estimatedValue, 0);
  const asking = ACQUISITIONS.reduce((s, a) => s + a.askingPrice, 0);
  const costs = ACQUISITIONS.reduce((s, a) => s + a.acquisitionCost, 0);
  const gfa = ACQUISITIONS.reduce((s, a) => s + a.potentialGfa, 0);

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Acquisition Command"
        title="Acquisition Pipeline"
        description="Every opportunity from identification to completion, screened against feasibility, development potential and projected investment return."
      />

      <Panel title="Pipeline Position">
        <MetricRow cols={5}>
          <Metric label="Opportunities" value={ACQUISITIONS.length} sub={`${ACQUISITION_STAGES.length} stages`} />
          <Metric label="Asking Price" value={kes(asking)} />
          <Metric label="Estimated Value" value={kes(pipelineValue)} tone={pipelineValue >= asking ? "positive" : "warning"} sub={`${pct(((pipelineValue - asking) / asking) * 100)} vs asking`} />
          <Metric label="Acquisition Cost" value={kes(costs)} />
          <Metric label="Potential GFA" value={`${num(gfa)} m²`} />
        </MetricRow>
      </Panel>

      <Panel title="Stage Distribution" dense>
        <div className="grid grid-cols-2 divide-x divide-border border-b border-border md:grid-cols-7">
          {ACQUISITION_STAGES.map((s) => {
            const items = ACQUISITIONS.filter((a) => a.stage === s);
            const v = items.reduce((t, a) => t + a.estimatedValue, 0);
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStage(stage === s ? null : s)}
                className={`px-3 py-2 text-left transition-colors ${stage === s ? "bg-primary/10" : "hover:bg-surface-2"}`}
              >
                <div className="label-xs">{s}</div>
                <div className="num mt-1 text-[15px]">{items.length}</div>
                <div className="num text-[11px] text-muted-foreground">{v ? kes(v) : "—"}</div>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title="Opportunities" meta={stage ?? "All stages"} actions={stage && <Chip onClick={() => setStage(null)}>Clear</Chip>} dense>
        <TableWrap>
          <thead>
            <tr>
              <Th>Opportunity</Th>
              <Th>Location</Th>
              <Th>Stage</Th>
              <Th right>Asking</Th>
              <Th right>Est. Value</Th>
              <Th right>Land m²</Th>
              <Th right>Pot. GFA</Th>
              <Th>Planning</Th>
              <Th>Title</Th>
              <Th right>Proj. Return</Th>
              <Th>Recommendation</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr
                key={a.id}
                onClick={() => setSelected(a.id)}
                className={`cursor-pointer ${a.id === selected ? "bg-primary/10" : "hover:bg-surface-2"}`}
              >
                <Td>{a.name}</Td>
                <Td className="text-muted-foreground">{a.location}</Td>
                <Td><Tag tone="info">{a.stage}</Tag></Td>
                <Td right mono>{kes(a.askingPrice)}</Td>
                <Td right mono className={a.estimatedValue >= a.askingPrice ? "text-positive" : "text-negative"}>{kes(a.estimatedValue)}</Td>
                <Td right mono>{num(a.landArea)}</Td>
                <Td right mono>{num(a.potentialGfa)}</Td>
                <Td className="text-muted-foreground">{a.planning}</Td>
                <Td className="text-muted-foreground">{a.title}</Td>
                <Td right mono>{pct(a.projectedReturn)}</Td>
                <Td className="text-muted-foreground">{a.recommendation}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Acquisition Feasibility" meta={active.name} className="lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="label-xs mb-2 text-foreground/80">Total Development Cost</div>
              <KeyValue
                cols={1}
                items={[
                  ["Land cost", kes(f.land)],
                  ["Construction cost", kes(f.construction)],
                  ["Professional fees", kes(f.fees)],
                  ["Finance cost", kes(f.finance)],
                  ["Taxes", kes(f.taxes)],
                  ["Marketing", kes(f.marketing)],
                  ["Contingency", kes(f.contingency)],
                  ["Other development costs", kes(f.other)],
                  ["TOTAL DEVELOPMENT COST", <span className="text-negative">{kes(f.cost)}</span>],
                ]}
              />
            </div>
            <div>
              <div className="label-xs mb-2 text-foreground/80">Gross Development Value</div>
              <KeyValue
                cols={1}
                items={[
                  ["Sales revenue", kes(f.sales)],
                  ["Rental value", kes(f.rental)],
                  ["Exit value", kes(f.exit)],
                  ["GROSS DEVELOPMENT VALUE", <span className="text-positive">{kes(f.value)}</span>],
                ]}
              />
              <div className="label-xs mb-2 mt-5 text-foreground/80">Return</div>
              <KeyValue
                cols={1}
                items={[
                  ["Profit", kes(f.profit)],
                  ["Profit margin", pct(f.margin)],
                  ["ROI", pct(f.roi)],
                  ["IRR", pct(active.projectedReturn)],
                  ["Equity requirement", kes(f.equity)],
                  ["Debt requirement", kes(f.debt)],
                  ["Payback", `${f.payback} yrs`],
                ]}
              />
            </div>
          </div>
        </Panel>

        <Panel title="Opportunity Detail" meta={active.id}>
          <KeyValue
            cols={1}
            items={[
              ["Location", active.location],
              ["Stage", <Tag tone="info">{active.stage}</Tag>],
              ["Land area", `${num(active.landArea)} m²`],
              ["Development potential", active.projectedDevelopment],
              ["Planning", active.planning],
              ["Title", active.title],
              ["Market", active.market],
              ["Acquisition cost", kes(active.acquisitionCost)],
              ["Projected return", pct(active.projectedReturn)],
            ]}
          />
          <div className="mt-4 border border-border bg-surface-2 p-3">
            <div className="label-xs text-negative">Risks</div>
            <p className="mt-1 text-[12px] text-muted-foreground">{active.risks}</p>
            <div className="label-xs mt-3 text-primary">Recommendation</div>
            <p className="mt-1 text-[12px]">{active.recommendation}</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
