import { createFileRoute, Link } from "@tanstack/react-router";
import { kes, pct, noi, equity, yieldPct, ltv, num } from "@/lib/redm-data";
import { useRedm } from "@/lib/redm-store";
import { Panel, PageHeader, Tag, Bar, Metric, MetricRow } from "@/components/redm/ui";
import { PortfolioAssetTable } from "@/components/redm/asset-table";

export const Route = createFileRoute("/assets/")({
  head: () => ({
    meta: [
      { title: "Investment Assets — REDM" },
      { name: "description", content: "The REDM investment asset register: land, developments, income properties and strategic holdings." },
      { property: "og:title", content: "Investment Assets — REDM" },
      { property: "og:description", content: "Register of REDM investment assets and their live positions." },
    ],
  }),
  component: AssetsIndex,
});

function AssetsIndex() {
  const { assets: ASSETS } = useRedm();
  return (
    <>
      <PageHeader
        eyebrow="03 / Assets"
        title="Investment Asset Register"
        description="An asset carries property, projects, development, financing, income, valuation, risk and strategy. Open one to follow it through its whole life."
      />

      <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-4">
        {ASSETS.map((a) => (
          <Link key={a.id} to="/assets/$assetId" params={{ assetId: a.id }} className="block">
            <Panel className="h-full transition-colors hover:border-primary/60">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[14px] font-semibold leading-5">{a.name}</div>
                  <div className="num text-[10px] text-muted-foreground">
                    {a.id} · {a.location}
                  </div>
                </div>
                <Tag tone="risk">{a.risk}</Tag>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <Tag tone="info">{a.lifecycle}</Tag>
                <Tag tone="signal">{a.strategy}</Tag>
                <Tag>{a.assetClass}</Tag>
              </div>
              <div className="mt-3">
                <MetricRow cols={3}>
                  <Metric label="Value" value={kes(a.currentValue)} />
                  <Metric label="Equity" value={kes(equity(a))} tone="signal" />
                  <Metric label="IRR" value={pct(a.projectedIrr)} tone="positive" />
                </MetricRow>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between">
                  <span className="label-xs">LTV</span>
                  <span className="num text-[11px]">{pct(ltv(a))}</span>
                </div>
                <Bar value={ltv(a)} max={100} tone={ltv(a) > 55 ? "negative" : "info"} />
              </div>
              <div className="num mt-3 grid grid-cols-3 gap-2 border-t border-grid pt-2 text-[11px] text-muted-foreground">
                <span>NOI {kes(noi(a))}</span>
                <span>YLD {pct(yieldPct(a))}</span>
                <span>GFA {num(a.gfa || a.potentialGfa)} m²</span>
              </div>
            </Panel>
          </Link>
        ))}
      </div>

      <Panel title="Register" meta="Full asset table" dense>
        <PortfolioAssetTable assets={ASSETS} />
      </Panel>
    </>
  );
}
