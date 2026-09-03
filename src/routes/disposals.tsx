import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DISPOSALS, DISPOSAL_STAGES, getAsset, kes, pct, equity } from "@/lib/redm-data";
import { Panel, PageHeader, Metric, MetricRow, TableWrap, Th, Td, Tag, Chip, KeyValue } from "@/components/redm/ui";

export const Route = createFileRoute("/disposals")({
  head: () => ({
    meta: [
      { title: "Disposal Command — REDM Investment" },
      { name: "description", content: "REDM disposal pipeline from identification to completion with net proceeds, capital gain and exit IRR." },
      { property: "og:title", content: "Disposal Command — REDM Investment" },
      { property: "og:description", content: "Disposal stages, target pricing, offers, debt settlement and exit returns across the REDM portfolio." },
    ],
  }),
  component: DisposalCommand,
});

const proceeds = (d: (typeof DISPOSALS)[number]) =>
  (d.offer || d.targetPrice) - d.transactionCosts - d.debt;

function DisposalCommand() {
  const first = DISPOSALS[0]!;
  const [stage, setStage] = useState<string | null>(null);
  const [selected, setSelected] = useState(first.id);
  const list = DISPOSALS.filter((d) => !stage || d.stage === stage);
  const active = DISPOSALS.find((d) => d.id === selected) ?? first;
  const asset = getAsset(active.assetId);

  const value = DISPOSALS.reduce((s, d) => s + d.currentValue, 0);
  const target = DISPOSALS.reduce((s, d) => s + d.targetPrice, 0);
  const debt = DISPOSALS.reduce((s, d) => s + d.debt, 0);
  const net = DISPOSALS.reduce((s, d) => s + proceeds(d), 0);

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Disposal Command"
        title="Disposal Pipeline"
        description="Assets and parcels identified for exit, tracked from valuation and approval through marketing, offer and completion."
      />

      <Panel title="Disposal Position">
        <MetricRow cols={5}>
          <Metric label="Disposals" value={DISPOSALS.length} sub={`${DISPOSAL_STAGES.length} stages`} />
          <Metric label="Current value" value={kes(value)} />
          <Metric label="Target price" value={kes(target)} tone={target >= value ? "positive" : "negative"} sub={`${pct(((target - value) / value) * 100)} vs value`} />
          <Metric label="Debt to settle" value={kes(debt)} tone="negative" />
          <Metric label="Net proceeds" value={kes(net)} tone="positive" />
        </MetricRow>
      </Panel>

      <Panel title="Stage Distribution" dense>
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-8">
          {DISPOSAL_STAGES.map((s) => {
            const items = DISPOSALS.filter((d) => d.stage === s);
            const v = items.reduce((t, d) => t + d.currentValue, 0);
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStage(stage === s ? null : s)}
                className={`px-3 py-2 text-left transition-colors ${stage === s ? "bg-primary/10" : "bg-surface hover:bg-surface-2"}`}
              >
                <div className="label-xs">{s}</div>
                <div className="num mt-1 text-[15px]">{items.length}</div>
                <div className="num text-[11px] text-muted-foreground">{v ? kes(v) : "—"}</div>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title="Disposals" meta={stage ?? "All stages"} actions={stage && <Chip onClick={() => setStage(null)}>Clear</Chip>} dense>
        <TableWrap>
          <thead>
            <tr>
              <Th>Disposal</Th>
              <Th>Asset</Th>
              <Th>Stage</Th>
              <Th right>Current value</Th>
              <Th right>Target price</Th>
              <Th right>Offer</Th>
              <Th right>Debt</Th>
              <Th right>Tx costs</Th>
              <Th right>Net proceeds</Th>
              <Th right>Exit IRR</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((d) => {
              const a = getAsset(d.assetId);
              return (
                <tr
                  key={d.id}
                  onClick={() => setSelected(d.id)}
                  className={`cursor-pointer ${d.id === selected ? "bg-primary/10" : "hover:bg-surface-2"}`}
                >
                  <Td>{d.name}</Td>
                  <Td>
                    {a ? (
                      <Link to="/assets/$assetId" params={{ assetId: a.id }} className="text-primary hover:underline">
                        {a.name}
                      </Link>
                    ) : (
                      d.assetId
                    )}
                  </Td>
                  <Td><Tag tone="info">{d.stage}</Tag></Td>
                  <Td right mono>{kes(d.currentValue)}</Td>
                  <Td right mono>{kes(d.targetPrice)}</Td>
                  <Td right mono className={d.offer ? (d.offer >= d.targetPrice ? "text-positive" : "text-warning") : "text-muted-foreground"}>
                    {d.offer ? kes(d.offer) : "—"}
                  </Td>
                  <Td right mono className="text-negative">{d.debt ? kes(d.debt) : "—"}</Td>
                  <Td right mono>{kes(d.transactionCosts)}</Td>
                  <Td right mono className="text-positive">{kes(proceeds(d))}</Td>
                  <Td right mono>{pct(d.exitIrr)}</Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      </Panel>

      <Panel title="Exit Analysis" meta={active.name}>
        <div className="grid gap-6 md:grid-cols-2">
          <KeyValue
            cols={1}
            items={[
              ["Stage", <Tag tone="info">{active.stage}</Tag>],
              ["Current value", kes(active.currentValue)],
              ["Target sale price", kes(active.targetPrice)],
              ["Offer received", active.offer ? kes(active.offer) : "None"],
              ["Transaction costs", kes(active.transactionCosts)],
              ["Outstanding debt", kes(active.debt)],
            ]}
          />
          <KeyValue
            cols={1}
            items={[
              ["Net proceeds", <span className="text-positive">{kes(proceeds(active))}</span>],
              ["Capital gain", kes((active.offer || active.targetPrice) - active.currentValue)],
              ["Equity return", asset && equity(asset) ? pct((proceeds(active) / equity(asset)) * 100) : "—"],
              ["Exit IRR", pct(active.exitIrr)],
              ["Parent asset strategy", asset?.strategy ?? "—"],
              ["Parent asset risk", asset ? <Tag tone="risk">{asset.risk}</Tag> : "—"],
            ]}
          />
        </div>
      </Panel>
    </div>
  );
}
