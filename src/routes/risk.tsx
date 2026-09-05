import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { kes } from "@/lib/redm-data";
import { useRedm } from "@/lib/redm-store";
import { Panel, PageHeader, Metric, MetricRow, TableWrap, Th, Td, Tag, Bar, Chip } from "@/components/redm/ui";

export const Route = createFileRoute("/risk")({
  head: () => ({
    meta: [
      { title: "Investment Risk Command — REDM" },
      { name: "description", content: "Portfolio investment risk register linking asset, evidence, impact, mitigation, owner and status." },
      { property: "og:title", content: "Investment Risk Command — REDM" },
      { property: "og:description", content: "Planning, development, construction, financing, market, leasing and liquidity risk across REDM assets." },
    ],
  }),
  component: RiskCommand,
});

function RiskCommand() {
  const { risks: RISKS, assets: ASSETS, getAsset } = useRedm();
  const [category, setCategory] = useState<string | null>(null);
  const [assetId, setAssetId] = useState<string | null>(null);

  const categories = Array.from(new Set(RISKS.map((r) => r.category)));
  const list = RISKS.filter((r) => (!category || r.category === category) && (!assetId || r.assetId === assetId));
  const impact = RISKS.reduce((s, r) => s + r.impact, 0);
  const open = RISKS.filter((r) => r.status === "OPEN").length;
  const high = RISKS.filter((r) => r.severity === "HIGH").length;
  const maxImpact = Math.max(...RISKS.map((r) => r.impact), 1);

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Investment Risk Command"
        title="Portfolio Risk Exposure"
        description="Every risk is traced from asset to evidence, impact, mitigation, owner and status — no scores without underlying information."
      />

      <Panel title="Exposure">
        <MetricRow cols={5}>
          <Metric label="Registered risks" value={RISKS.length} />
          <Metric label="Open" value={open} tone="negative" />
          <Metric label="High severity" value={high} tone="negative" />
          <Metric label="Total impact at risk" value={kes(impact)} tone="warning" />
          <Metric label="Assets affected" value={new Set(RISKS.map((r) => r.assetId)).size} sub={`of ${ASSETS.length}`} />
        </MetricRow>
      </Panel>

      <Panel title="Risk Categories" meta={category ?? "All categories"} dense>
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-5">
          {categories.map((c) => {
            const items = RISKS.filter((r) => r.category === c);
            const v = items.reduce((s, r) => s + r.impact, 0);
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(category === c ? null : c)}
                className={`px-3 py-2 text-left transition-colors ${category === c ? "bg-primary/10" : "bg-surface hover:bg-surface-2"}`}
              >
                <div className="label-xs">{c}</div>
                <div className="num mt-1 text-[15px]">{items.length}</div>
                <div className="num text-[11px] text-muted-foreground">{kes(v)}</div>
                <div className="mt-1"><Bar value={v} max={maxImpact * 2} tone="warning" /></div>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel
        title="Risk Register"
        meta={`${list.length} of ${RISKS.length}`}
        actions={
          <div className="flex flex-wrap gap-1.5">
            {ASSETS.filter((a) => RISKS.some((r) => r.assetId === a.id)).map((a) => (
              <Chip key={a.id} active={assetId === a.id} onClick={() => setAssetId(assetId === a.id ? null : a.id)}>
                {a.name}
              </Chip>
            ))}
          </div>
        }
        dense
      >
        <TableWrap>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Asset</Th>
              <Th>Category</Th>
              <Th>Evidence</Th>
              <Th right>Impact</Th>
              <Th>Mitigation</Th>
              <Th>Owner</Th>
              <Th>Status</Th>
              <Th>Severity</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => {
              const a = getAsset(r.assetId);
              return (
                <tr key={r.id} className="hover:bg-surface-2">
                  <Td mono>{r.id}</Td>
                  <Td>
                    {a ? (
                      <Link to="/assets/$assetId" params={{ assetId: a.id }} className="text-primary hover:underline">
                        {a.name}
                      </Link>
                    ) : (
                      r.assetId
                    )}
                  </Td>
                  <Td>{r.category}</Td>
                  <Td className="max-w-[320px] whitespace-normal text-muted-foreground">{r.evidence}</Td>
                  <Td right mono className="text-negative">{r.impact ? kes(r.impact) : "—"}</Td>
                  <Td className="max-w-[260px] whitespace-normal text-muted-foreground">{r.mitigation}</Td>
                  <Td>{r.owner}</Td>
                  <Td><Tag tone={r.status === "OPEN" ? "negative" : r.status === "MITIGATING" ? "warning" : "muted"}>{r.status}</Tag></Td>
                  <Td><Tag tone="risk">{r.severity}</Tag></Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      </Panel>
    </div>
  );
}
