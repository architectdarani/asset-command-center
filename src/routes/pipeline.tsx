import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LIFECYCLE_ORDER, kes, pct, num, tdc, gdv, type Asset } from "@/lib/redm-data";
import { useRedm } from "@/lib/redm-store";
import { Panel, PageHeader, Metric, MetricRow, TableWrap, Th, Td, Tag, Bar, Chip } from "@/components/redm/ui";

export const Route = createFileRoute("/pipeline")({
  head: () => ({
    meta: [
      { title: "Development Pipeline — REDM Investment" },
      { name: "description", content: "REDM development pipeline from opportunity to exit with stage gates, development economics and returns." },
      { property: "og:title", content: "Development Pipeline — REDM Investment" },
      { property: "og:description", content: "Stage-gated development pipeline and development economics across the REDM portfolio." },
    ],
  }),
  component: DevelopmentPipeline,
});

const STAGE_MODULE: Record<string, string> = {
  OPPORTUNITY: "Acquisition Command",
  ACQUISITION: "Acquisition Command",
  FEASIBILITY: "Feasibility",
  "DUE DILIGENCE": "Feasibility",
  DESIGN: "Design",
  APPROVAL: "Planning",
  CONSTRUCTION: "Construction",
  COMPLETION: "Commercial",
  "LEASE / SALE": "Property",
  OPERATION: "Property Operations",
  EXIT: "Disposals",
};

function DevelopmentPipeline() {
  const { assets: ASSETS } = useRedm();
  const [stage, setStage] = useState<string | null>(null);
  const list = ASSETS.filter((a) => !stage || a.lifecycle === stage);

  const totalCost = ASSETS.reduce((s, a) => s + tdc(a), 0);
  const totalValue = ASSETS.reduce((s, a) => s + gdv(a), 0);
  const profit = totalValue - totalCost;
  const activeGfa = ASSETS.reduce((s, a) => s + a.gfa, 0);
  const potential = ASSETS.reduce((s, a) => s + a.potentialGfa, 0);

  const econ = (a: Asset) => {
    const c = tdc(a);
    const v = gdv(a);
    return { c, v, p: v - c, margin: v ? ((v - c) / v) * 100 : 0, yoc: c ? ((a.revenue - a.opex) / c) * 100 : 0 };
  };

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Development Pipeline"
        title="Pipeline & Development Economics"
        description="Every investment asset positioned on the REDM lifecycle, with total development cost, gross development value and return on each development."
      />

      <Panel title="Pipeline Economics">
        <MetricRow cols={6}>
          <Metric label="Assets in Pipeline" value={ASSETS.length} />
          <Metric label="Total Development Cost" value={kes(totalCost)} tone="negative" />
          <Metric label="Gross Development Value" value={kes(totalValue)} tone="positive" />
          <Metric label="Development Profit" value={kes(profit)} tone={profit >= 0 ? "positive" : "negative"} sub={pct((profit / totalValue) * 100) + " margin"} />
          <Metric label="Current GFA" value={`${num(activeGfa)} m²`} />
          <Metric label="Potential GFA" value={`${num(potential)} m²`} tone="signal" sub={`+${num(potential - activeGfa)} m² latent`} />
        </MetricRow>
      </Panel>

      <Panel title="Lifecycle Stage Gates" meta="Stage → connected REDM module" dense>
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4 xl:grid-cols-11">
          {LIFECYCLE_ORDER.map((s) => {
            const items = ASSETS.filter((a) => a.lifecycle === s);
            const v = items.reduce((t, a) => t + a.currentValue, 0);
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStage(stage === s ? null : s)}
                className={`bg-surface px-3 py-2 text-left transition-colors ${stage === s ? "bg-primary/10" : "hover:bg-surface-2"}`}
              >
                <div className="label-xs">{s}</div>
                <div className="num mt-1 text-[15px]">{items.length}</div>
                <div className="num text-[11px] text-muted-foreground">{v ? kes(v) : "—"}</div>
                <div className="label-xs mt-2 text-primary/70">{STAGE_MODULE[s] ?? "—"}</div>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title="Development Economics" meta={stage ?? "All stages"} actions={stage && <Chip onClick={() => setStage(null)}>Clear</Chip>} dense>
        <TableWrap>
          <thead>
            <tr>
              <Th>Asset</Th>
              <Th>Stage</Th>
              <Th>Development Status</Th>
              <Th right>Land</Th>
              <Th right>Construction</Th>
              <Th right>Fees</Th>
              <Th right>Finance</Th>
              <Th right>TDC</Th>
              <Th right>GDV</Th>
              <Th right>Profit</Th>
              <Th right>Margin</Th>
              <Th right>IRR</Th>
              <Th right>Yield on Cost</Th>
              <Th>Progress</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => {
              const e = econ(a);
              return (
                <tr key={a.id} className="hover:bg-surface-2">
                  <Td>
                    <Link to="/assets/$assetId" params={{ assetId: a.id }} className="text-foreground hover:text-primary">
                      {a.name}
                    </Link>
                  </Td>
                  <Td><Tag tone="info">{a.lifecycle}</Tag></Td>
                  <Td className="text-muted-foreground">{a.developmentStatus}</Td>
                  <Td right mono>{kes(a.economics.land)}</Td>
                  <Td right mono>{kes(a.economics.construction)}</Td>
                  <Td right mono>{kes(a.economics.fees)}</Td>
                  <Td right mono>{kes(a.economics.finance)}</Td>
                  <Td right mono className="text-negative">{kes(e.c)}</Td>
                  <Td right mono className="text-positive">{kes(e.v)}</Td>
                  <Td right mono className={e.p >= 0 ? "text-positive" : "text-negative"}>{kes(e.p)}</Td>
                  <Td right mono>{pct(e.margin)}</Td>
                  <Td right mono>{pct(a.projectedIrr)}</Td>
                  <Td right mono>{pct(e.yoc)}</Td>
                  <Td className="w-[120px]">
                    <Bar value={LIFECYCLE_ORDER.indexOf(a.lifecycle) + 1} max={LIFECYCLE_ORDER.length} />
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      </Panel>

      <Panel title="Active Projects Across Assets" dense>
        <TableWrap>
          <thead>
            <tr>
              <Th>Asset</Th>
              <Th>Project</Th>
              <Th>Type</Th>
              <Th>Stage</Th>
              <Th right>Cost</Th>
              <Th right>Forecast</Th>
              <Th right>Variance</Th>
              <Th right>Progress</Th>
              <Th>Completion</Th>
            </tr>
          </thead>
          <tbody>
            {list.flatMap((a) =>
              a.projects.map((p) => {
                const variance = p.forecast - p.cost;
                return (
                  <tr key={a.id + p.id} className="hover:bg-surface-2">
                    <Td className="text-muted-foreground">{a.name}</Td>
                    <Td>{p.name}</Td>
                    <Td className="text-muted-foreground">{p.type}</Td>
                    <Td><Tag tone="muted">{p.stage}</Tag></Td>
                    <Td right mono>{kes(p.cost)}</Td>
                    <Td right mono>{kes(p.forecast)}</Td>
                    <Td right mono className={variance > 0 ? "text-negative" : "text-positive"}>{kes(variance)}</Td>
                    <Td right mono>{p.progress}%</Td>
                    <Td className="text-muted-foreground">{p.completion}</Td>
                  </tr>
                );
              }),
            )}
          </tbody>
        </TableWrap>
      </Panel>
    </div>
  );
}
