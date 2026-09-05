import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { kes, pct, num, noi, equity, yieldPct, ltv, tdc, gdv, type Asset } from "@/lib/redm-data";
import { useRedm } from "@/lib/redm-store";
import {
  Panel,
  PageHeader,
  Metric,
  MetricRow,
  Tag,
  Bar,
  Th,
  Td,
  TableWrap,
  Chip,
  KeyValue,
} from "@/components/redm/ui";

const TABS = [
  "OVERVIEW",
  "PROPERTY",
  "PROJECTS",
  "DEVELOPMENT",
  "FINANCIALS",
  "VALUATION",
  "LEASING / SALES",
  "DEBT",
  "CASH FLOW",
  "SCENARIOS",
  "RISKS",
  "DOCUMENTS",
  "DECISIONS",
] as const;
type Tab = (typeof TABS)[number];

export const Route = createFileRoute("/assets/$assetId")({
  loader: ({ params }) => {
    const asset = getAsset(params.assetId);
    if (!asset) throw notFound();
    return { name: asset.name, location: asset.location };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Asset unavailable — REDM" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.name} — REDM Investment Asset`;
    const description = `Investment profile for ${loaderData.name}, ${loaderData.location}: property, projects, development economics, valuation, debt, cash flow, risk and strategy.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: AssetProfile,
});

function AssetProfile() {
  const { getAsset, risks: RISKS, disposals: DISPOSALS } = useRedm();
  const { assetId } = Route.useParams();
  const asset = getAsset(assetId)!;
  const [tab, setTab] = useState<Tab>("OVERVIEW");

  return (
    <>
      <PageHeader
        eyebrow={`03 / Assets / ${asset.id}`}
        title={asset.name}
        description={`${asset.location} · ${asset.assetClass} · ${asset.ownership}`}
        right={
          <div className="flex flex-wrap gap-2">
            <Tag tone="info">{asset.lifecycle}</Tag>
            <Tag tone="signal">{asset.strategy}</Tag>
            <Tag tone="risk">{asset.risk}</Tag>
          </div>
        }
      />

      <Panel title="Position" meta="Current investment position" >
        <MetricRow cols={7}>
          <Metric label="Current Valuation" value={kes(asset.currentValue)} sub={`Acq. ${kes(asset.acquisitionValue)}`} />
          <Metric label="Invested Capital" value={kes(asset.investedCapital)} />
          <Metric label="Debt" value={kes(asset.debt)} sub={`LTV ${pct(ltv(asset))}`} />
          <Metric label="Equity" value={kes(equity(asset))} tone="signal" />
          <Metric label="NOI" value={kes(noi(asset))} tone="positive" sub={`Yield ${pct(yieldPct(asset))}`} />
          <Metric label="Projected IRR" value={pct(asset.projectedIrr)} tone="signal" />
          <Metric label="ROI" value={pct(asset.roi)} />
        </MetricRow>
      </Panel>

      <div className="flex flex-wrap gap-1 border-y border-border py-2">
        {TABS.map((t) => (
          <Chip key={t} active={tab === t} onClick={() => setTab(t)}>
            {t}
          </Chip>
        ))}
      </div>

      {tab === "OVERVIEW" && <Overview asset={asset} />}
      {tab === "PROPERTY" && <Property asset={asset} />}
      {tab === "PROJECTS" && <Projects asset={asset} />}
      {tab === "DEVELOPMENT" && <Development asset={asset} />}
      {tab === "FINANCIALS" && <Financials asset={asset} />}
      {tab === "VALUATION" && <Valuation asset={asset} />}
      {tab === "LEASING / SALES" && <Leasing asset={asset} />}
      {tab === "DEBT" && <Debt asset={asset} />}
      {tab === "CASH FLOW" && <CashFlow asset={asset} />}
      {tab === "SCENARIOS" && <Scenarios asset={asset} />}
      {tab === "RISKS" && <Risks asset={asset} />}
      {tab === "DOCUMENTS" && <Documents asset={asset} />}
      {tab === "DECISIONS" && <Decisions asset={asset} />}
    </>
  );
}

function Overview({ asset }: { asset: Asset }) {
  const r = asset.recommendation;
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <Panel title="Asset Overview">
        <KeyValue
          items={[
            ["Asset name", asset.name],
            ["Asset ID", asset.id],
            ["Portfolio", asset.portfolio],
            ["Location", asset.location],
            ["Ownership", asset.ownership],
            ["Asset type", asset.assetClass],
            ["Lifecycle stage", asset.lifecycle],
            ["Current strategy", asset.strategy],
            ["Investment status", asset.developmentStatus],
            ["Risk status", asset.risk],
            ["Current valuation", kes(asset.currentValue)],
            ["Invested capital", kes(asset.investedCapital)],
            ["Debt", kes(asset.debt)],
            ["Equity", kes(equity(asset))],
            ["Projected return", `${pct(asset.projectedIrr)} IRR / ${pct(asset.roi)} ROI`],
          ]}
        />
      </Panel>
      <div className="space-y-4">
        <Panel title="Investment Decision" meta="Recommendation with traceable evidence">
          <div className="border border-primary/40 bg-primary/10 px-3 py-2">
            <div className="label-xs text-primary">Recommendation</div>
            <div className="mt-0.5 text-[14px] font-semibold">{r.decision}</div>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div>
              <div className="label-xs">Why</div>
              <ul className="mt-1 space-y-1">
                {r.why.map((w) => (
                  <li key={w} className="text-[12px] text-muted-foreground">
                    — {w}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="label-xs">Evidence</div>
              <div className="mt-1 space-y-1">
                {r.evidence.map((e) => (
                  <div key={e.label} className="flex justify-between gap-3 border-b border-grid pb-0.5">
                    <span className="text-[11px] text-muted-foreground">{e.label}</span>
                    <span className="num text-[11px]">{e.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 border-t border-border pt-3">
            <Metric label="Alternative" value={<span className="text-[13px]">{r.alternative}</span>} />
            <Metric label="Net proceeds" value={r.altProceeds ? kes(r.altProceeds) : "—"} />
            <Metric label="Hold IRR" value={r.holdIrr ? pct(r.holdIrr) : "—"} tone="signal" />
          </div>
        </Panel>
        <Panel title="Change Impact Chain" meta="Design → cost → finance → value → strategy" dense>
          <div className="flex flex-wrap items-center gap-1 px-3 py-3">
            {["DESIGN", "GFA", "COST", "FINANCE", "PROGRAMME", "REVENUE", "VALUATION", "IRR", "STRATEGY"].map(
              (n, i) => (
                <span key={n} className="flex items-center gap-1">
                  {i > 0 && <span className="text-muted-foreground">→</span>}
                  <Tag tone={i > 5 ? "signal" : "muted"}>{n}</Tag>
                </span>
              ),
            )}
          </div>
          <div className="border-t border-grid px-3 py-2 text-[11px] text-muted-foreground">
            No unabsorbed change events on this asset in the current cycle.
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Property({ asset }: { asset: Asset }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel title="Property Information">
        <KeyValue
          items={[
            ["Land area", `${num(asset.landArea)} m²`],
            ["GFA", `${num(asset.gfa)} m²`],
            ["NFA", `${num(asset.nfa)} m²`],
            ["Buildings", num(asset.buildings)],
            ["Units", num(asset.units)],
            ["Residential area", `${num(asset.residentialArea)} m²`],
            ["Commercial area", `${num(asset.commercialArea)} m²`],
            ["Parking", num(asset.parking)],
            ["Development potential", `${num(asset.potentialGfa)} m² GFA`],
            ["Current use", asset.currentUse],
            ["Planning status", asset.planningStatus],
            ["Development rights", asset.developmentRights],
          ]}
        />
      </Panel>
      <Panel title="Redevelopment Analysis" meta="Existing vs potential capacity">
        <MetricRow cols={3}>
          <Metric label="Existing GFA" value={`${num(asset.gfa)} m²`} />
          <Metric label="Potential GFA" value={`${num(asset.potentialGfa)} m²`} tone="signal" />
          <Metric label="Additional GFA" value={`${num(Math.max(0, asset.potentialGfa - asset.gfa))} m²`} tone="positive" />
        </MetricRow>
        <div className="mt-3">
          <Bar value={asset.gfa} max={asset.potentialGfa || 1} />
        </div>
        <div className="mt-4">
          <MetricRow cols={3}>
            <Metric label="Additional cost" value={kes(Math.max(0, asset.potentialGfa - asset.gfa) * 62_000)} />
            <Metric label="Additional revenue" value={kes(Math.max(0, asset.potentialGfa - asset.gfa) * 94_000)} />
            <Metric label="Additional profit" value={kes(Math.max(0, asset.potentialGfa - asset.gfa) * 32_000)} tone="positive" />
          </MetricRow>
        </div>
        <div className="mt-4">
          <MetricRow cols={3}>
            <Metric label="Additional debt" value={kes(Math.max(0, asset.potentialGfa - asset.gfa) * 38_000)} />
            <Metric label="Additional equity" value={kes(Math.max(0, asset.potentialGfa - asset.gfa) * 24_000)} />
            <Metric label="Incremental IRR" value={pct(asset.projectedIrr * 0.82)} tone="signal" />
          </MetricRow>
        </div>
      </Panel>
    </div>
  );
}

function Projects({ asset }: { asset: Asset }) {
  return (
    <Panel title="Projects Within Asset" meta="Activities undertaken against this investment asset" dense>
      <TableWrap>
        <thead>
          <tr>
            <Th>Project</Th>
            <Th>ID</Th>
            <Th>Type</Th>
            <Th>Stage</Th>
            <Th>Progress</Th>
            <Th right>Sanctioned</Th>
            <Th right>Forecast</Th>
            <Th right>Variance</Th>
            <Th>Completion</Th>
          </tr>
        </thead>
        <tbody>
          {asset.projects.map((p) => {
            const variance = p.forecast - p.cost;
            return (
              <tr key={p.id} className="hover:bg-surface-2">
                <Td>{p.name}</Td>
                <Td mono className="text-muted-foreground">{p.id}</Td>
                <Td className="text-muted-foreground">{p.type}</Td>
                <Td><Tag tone="info">{p.stage}</Tag></Td>
                <Td className="w-40">
                  <div className="flex items-center gap-2">
                    <Bar value={p.progress} max={100} />
                    <span className="num text-[11px]">{p.progress}%</span>
                  </div>
                </Td>
                <Td right mono>{kes(p.cost)}</Td>
                <Td right mono>{kes(p.forecast)}</Td>
                <Td right mono className={variance > 0 ? "text-negative" : "text-positive"}>
                  {variance ? kes(variance) : "—"}
                </Td>
                <Td mono>{p.completion}</Td>
              </tr>
            );
          })}
        </tbody>
      </TableWrap>
      <div className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
        Project data is consumed from the REDM project environment — not duplicated here.
      </div>
    </Panel>
  );
}

function Development({ asset }: { asset: Asset }) {
  const e = asset.economics;
  const cost = tdc(asset);
  const value = gdv(asset);
  const profit = value - cost;
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
      <Panel title="Development Cost" meta="Total development cost" dense>
        <CostRows
          rows={[
            ["Land", e.land],
            ["Construction", e.construction],
            ["Professional fees", e.fees],
            ["Finance", e.finance],
            ["Marketing", e.marketing],
            ["Contingency", e.contingency],
            ["Taxes", e.taxes],
            ["Other", e.other],
          ]}
          total={["Total Development Cost", cost]}
        />
      </Panel>
      <Panel title="Development Value" meta="Gross development value" dense>
        <CostRows
          rows={[
            ["Residential sales", e.resiSales],
            ["Commercial sales", e.commSales],
            ["Rental value", e.rentalValue],
            ["Other income", e.otherIncome],
          ]}
          total={["Gross Development Value", value]}
        />
      </Panel>
      <Panel title="Returns">
        <MetricRow cols={2}>
          <Metric label="Gross profit" value={kes(profit)} tone={profit >= 0 ? "positive" : "negative"} />
          <Metric label="Margin" value={pct(value ? (profit / value) * 100 : 0)} />
          <Metric label="ROI" value={pct(cost ? (profit / cost) * 100 : 0)} />
          <Metric label="IRR" value={pct(asset.projectedIrr)} tone="signal" />
          <Metric label="Equity multiple" value={`${(1 + asset.roi / 100).toFixed(2)}x`} />
          <Metric label="Yield on cost" value={pct(cost ? (noi(asset) / cost) * 100 : 0)} />
          <Metric label="Exit value" value={kes(e.exitValue)} />
          <Metric label="Payback" value="4.2 yrs" />
        </MetricRow>
      </Panel>
    </div>
  );
}

function CostRows({
  rows,
  total,
}: {
  rows: [string, number][];
  total: [string, number];
}) {
  const max = Math.max(...rows.map((r) => r[1]), 1);
  return (
    <div>
      <div className="divide-y divide-grid">
        {rows.map(([label, v]) => (
          <div key={label} className="grid grid-cols-[140px_1fr_100px] items-center gap-3 px-3 py-[7px]">
            <span className="label-xs">{label}</span>
            <Bar value={v} max={max} tone="info" />
            <span className="num text-right text-[12px]">{kes(v)}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border px-3 py-2">
        <span className="label-xs text-primary">{total[0]}</span>
        <span className="num text-[15px] text-primary">{kes(total[1])}</span>
      </div>
    </div>
  );
}

function Financials({ asset }: { asset: Asset }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel title="Operating Financials">
        <KeyValue
          items={[
            ["Revenue", kes(asset.revenue)],
            ["Operating expenses", kes(asset.opex)],
            ["NOI", kes(noi(asset))],
            ["Yield", pct(yieldPct(asset))],
            ["Occupancy", `${asset.occupancy}%`],
            ["Debt service (est.)", kes(asset.debt * 0.11)],
            ["Cash flow after debt", kes(noi(asset) - asset.debt * 0.11)],
            ["Debt service cover", `${(noi(asset) / Math.max(1, asset.debt * 0.11)).toFixed(2)}x`],
          ]}
        />
      </Panel>
      <Panel title="Hold Analysis" meta="Projection at current strategy">
        <MetricRow cols={3}>
          <Metric label="5-year value" value={kes(asset.currentValue * 1.28)} />
          <Metric label="10-year value" value={kes(asset.currentValue * 1.62)} />
          <Metric label="15-year value" value={kes(asset.currentValue * 2.06)} />
        </MetricRow>
        <div className="mt-4 divide-y divide-grid border-t border-grid">
          {[5, 10, 15].map((y) => {
            const income = noi(asset) * y * 1.06;
            return (
              <div key={y} className="grid grid-cols-[80px_1fr_110px] items-center gap-3 py-2">
                <span className="label-xs">{y} year NOI</span>
                <Bar value={income} max={noi(asset) * 16} tone="positive" />
                <span className="num text-right text-[12px]">{kes(income)}</span>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function Valuation({ asset }: { asset: Asset }) {
  const change = asset.currentValue - asset.previousValue;
  return (
    <Panel title="Valuation">
      <MetricRow cols={6}>
        <Metric label="Current valuation" value={kes(asset.currentValue)} />
        <Metric label="Previous valuation" value={kes(asset.previousValue)} />
        <Metric label="Movement" value={kes(change)} tone={change >= 0 ? "positive" : "negative"} sub={pct((change / asset.previousValue) * 100)} />
        <Metric label="Debt" value={kes(asset.debt)} />
        <Metric label="Net asset value" value={kes(equity(asset))} tone="signal" />
        <Metric
          label="Unrealised gain"
          value={kes(asset.currentValue - asset.investedCapital)}
          tone={asset.currentValue - asset.investedCapital >= 0 ? "positive" : "negative"}
        />
      </MetricRow>
    </Panel>
  );
}

function Leasing({ asset }: { asset: Asset }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel title="Lease Analysis">
        <KeyValue
          items={[
            ["Gross rent", kes(asset.revenue)],
            ["Occupancy", `${asset.occupancy}%`],
            ["WAULT", asset.occupancy ? "4.6 yrs" : "—"],
            ["Escalation", "6% p.a. fixed"],
            ["Operating expenses", kes(asset.opex)],
            ["NOI", kes(noi(asset))],
            ["Yield", pct(yieldPct(asset))],
            ["Tenant concentration", asset.occupancy ? "Top 3 = 41% income" : "—"],
          ]}
        />
      </Panel>
      <Panel title="Sales Analysis">
        <KeyValue
          items={[
            ["Units", num(asset.units)],
            ["Sold / reserved", asset.units ? num(Math.round(asset.units * 0.62)) : "—"],
            ["Expected sale value", kes(asset.economics.exitValue)],
            ["Transaction costs", kes(asset.currentValue * 0.03)],
            ["Outstanding debt", kes(asset.debt)],
            ["Net sale proceeds", kes(asset.currentValue - asset.debt - asset.currentValue * 0.03)],
            ["Capital gain", kes(asset.currentValue - asset.acquisitionValue)],
            ["Exit IRR", pct(asset.projectedIrr * 0.7)],
          ]}
        />
      </Panel>
    </div>
  );
}

function Debt({ asset }: { asset: Asset }) {
  const newDebt = asset.currentValue * 0.6;
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel title="Debt Position">
        <KeyValue
          items={[
            ["Current value", kes(asset.currentValue)],
            ["Existing debt", kes(asset.debt)],
            ["Current LTV", pct(ltv(asset))],
            ["Interest cost (est.)", kes(asset.debt * 0.11)],
            ["Debt service cover", `${(noi(asset) / Math.max(1, asset.debt * 0.11)).toFixed(2)}x`],
          ]}
        />
      </Panel>
      <Panel title="Refinance Analysis">
        <MetricRow cols={3}>
          <Metric label="Potential new debt" value={kes(newDebt)} />
          <Metric label="New LTV" value="60.0%" />
          <Metric label="Equity release" value={kes(Math.max(0, newDebt - asset.debt))} tone="signal" />
          <Metric label="New interest cost" value={kes(newDebt * 0.104)} />
          <Metric label="Cash flow impact" value={kes(noi(asset) - newDebt * 0.104)} tone={noi(asset) - newDebt * 0.104 >= 0 ? "positive" : "negative"} />
          <Metric label="Post-refinance yield" value={pct(yieldPct(asset))} />
        </MetricRow>
      </Panel>
    </div>
  );
}

function CashFlow({ asset }: { asset: Asset }) {
  let balance = asset.investedCapital * 0.2;
  return (
    <Panel title="Asset Cash Flow" meta="What actually drives the investment return" dense>
      <TableWrap>
        <thead>
          <tr>
            <Th>Period</Th>
            <Th right>Opening</Th>
            <Th right>Capex</Th>
            <Th right>Op. income</Th>
            <Th right>Op. cost</Th>
            <Th right>Debt draw</Th>
            <Th right>Interest</Th>
            <Th right>Repayment</Th>
            <Th right>Sales</Th>
            <Th right>Net</Th>
            <Th right>Closing</Th>
          </tr>
        </thead>
        <tbody>
          {asset.cashflow.map((c) => {
            const net = c.opIncome + c.debtDraw + c.sales - c.capex - c.opCost - c.interest - c.debtRepay;
            const opening = balance;
            balance = opening + net;
            return (
              <tr key={c.period} className="hover:bg-surface-2">
                <Td mono>{c.period}</Td>
                <Td right mono className="text-muted-foreground">{kes(opening)}</Td>
                <Td right mono className="text-negative">{kes(-c.capex)}</Td>
                <Td right mono className="text-positive">{kes(c.opIncome)}</Td>
                <Td right mono>{kes(-c.opCost)}</Td>
                <Td right mono>{kes(c.debtDraw)}</Td>
                <Td right mono>{kes(-c.interest)}</Td>
                <Td right mono>{kes(-c.debtRepay)}</Td>
                <Td right mono className="text-positive">{kes(c.sales)}</Td>
                <Td right mono className={net >= 0 ? "text-positive" : "text-negative"}>{kes(net)}</Td>
                <Td right mono>{kes(balance)}</Td>
              </tr>
            );
          })}
        </tbody>
      </TableWrap>
    </Panel>
  );
}

function Scenarios({ asset }: { asset: Asset }) {
  return (
    <div className="space-y-4">
      <Panel title="Development Scenarios" meta="Base / upside / downside" dense>
        <TableWrap>
          <thead>
            <tr>
              <Th>Scenario</Th>
              <Th right>Total cost</Th>
              <Th right>Revenue</Th>
              <Th right>Profit</Th>
              <Th right>Margin</Th>
              <Th right>IRR</Th>
              <Th right>ROI</Th>
              <Th right>Equity</Th>
              <Th right>Debt</Th>
              <Th right>Exit value</Th>
            </tr>
          </thead>
          <tbody>
            {asset.scenarios.map((s) => (
              <tr key={s.name} className="hover:bg-surface-2">
                <Td><Tag tone={s.name === "UPSIDE" ? "positive" : s.name === "DOWNSIDE" ? "negative" : "signal"}>{s.name}</Tag></Td>
                <Td right mono>{kes(s.cost)}</Td>
                <Td right mono>{kes(s.revenue)}</Td>
                <Td right mono className={s.profit >= 0 ? "text-positive" : "text-negative"}>{kes(s.profit)}</Td>
                <Td right mono>{pct((s.profit / s.revenue) * 100)}</Td>
                <Td right mono className="text-primary">{pct(s.irr)}</Td>
                <Td right mono>{pct(s.roi)}</Td>
                <Td right mono>{kes(s.equity)}</Td>
                <Td right mono>{kes(s.debt)}</Td>
                <Td right mono>{kes(s.exitValue)}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>
      <ScenarioEngine asset={asset} />
    </div>
  );
}

export function ScenarioEngine({ asset }: { asset: Asset }) {
  const base = asset.scenarios[0]!;
  const [vars, setVars] = useState({
    construction: 0,
    salePrice: 0,
    gfa: 0,
    interest: 0,
    exitYield: 0,
    programme: 0,
  });

  const cost = base.cost * (1 + vars.construction / 100) * (1 + vars.gfa / 200) * (1 + vars.programme / 400) * (1 + vars.interest / 500);
  const revenue = base.revenue * (1 + vars.salePrice / 100) * (1 + vars.gfa / 100) * (1 - vars.exitYield / 200);
  const profit = revenue - cost;
  const roi = (profit / cost) * 100;
  const irr = base.irr + (roi - base.roi) * 0.42 - vars.programme * 0.08;
  const debt = cost * (base.debt / base.cost);
  const equityReq = cost - debt;

  const SLIDERS: [keyof typeof vars, string, number][] = [
    ["construction", "Construction cost", 25],
    ["salePrice", "Sale / rent price", 25],
    ["gfa", "GFA / density", 30],
    ["interest", "Interest rate", 40],
    ["exitYield", "Exit yield", 30],
    ["programme", "Programme duration", 40],
  ];

  return (
    <Panel title="Scenario Engine" meta="Move a variable and read the investment effect immediately">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3">
          {SLIDERS.map(([key, label, range]) => (
            <div key={key}>
              <div className="flex items-center justify-between">
                <span className="label-xs">{label}</span>
                <span className="num text-[11px] text-primary">
                  {vars[key] > 0 ? "+" : ""}
                  {vars[key]}%
                </span>
              </div>
              <input
                type="range"
                min={-range}
                max={range}
                value={vars[key]}
                onChange={(e) => setVars((v) => ({ ...v, [key]: Number(e.target.value) }))}
                className="mt-1 h-1 w-full appearance-none bg-surface-2 accent-primary"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setVars({ construction: 0, salePrice: 0, gfa: 0, interest: 0, exitYield: 0, programme: 0 })}
            className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground"
          >
            Reset to base case
          </button>
        </div>
        <div>
          <MetricRow cols={3}>
            <Metric label="Total cost" value={kes(cost)} sub={`Base ${kes(base.cost)}`} />
            <Metric label="Revenue" value={kes(revenue)} sub={`Base ${kes(base.revenue)}`} />
            <Metric label="Profit" value={kes(profit)} tone={profit >= 0 ? "positive" : "negative"} sub={`Base ${kes(base.profit)}`} />
            <Metric label="IRR" value={pct(irr)} tone="signal" sub={`Base ${pct(base.irr)}`} />
            <Metric label="ROI" value={pct(roi)} sub={`Base ${pct(base.roi)}`} />
            <Metric label="Equity required" value={kes(equityReq)} sub={`Base ${kes(base.equity)}`} />
            <Metric label="Debt" value={kes(debt)} />
            <Metric label="Exit value" value={kes(revenue)} />
            <Metric
              label="Strategy signal"
              value={<span className="text-[13px]">{irr > 18 ? "DEVELOP" : irr > 12 ? "HOLD" : "SELL"}</span>}
              tone={irr > 18 ? "positive" : irr > 12 ? "warning" : "negative"}
            />
          </MetricRow>
        </div>
      </div>
    </Panel>
  );
}

function Risks({ asset }: { asset: Asset }) {
  const items = RISKS.filter((r) => r.assetId === asset.id);
  return (
    <Panel title="Asset Risks" meta="Asset → evidence → impact → mitigation → owner → status" dense>
      <TableWrap>
        <thead>
          <tr>
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
          {items.map((r) => (
            <tr key={r.id} className="hover:bg-surface-2">
              <Td>{r.category}</Td>
              <Td className="whitespace-normal text-muted-foreground">{r.evidence}</Td>
              <Td right mono className="text-negative">{r.impact ? kes(r.impact) : "—"}</Td>
              <Td className="whitespace-normal text-muted-foreground">{r.mitigation}</Td>
              <Td>{r.owner}</Td>
              <Td><Tag tone="info">{r.status}</Tag></Td>
              <Td><Tag tone="risk">{r.severity}</Tag></Td>
            </tr>
          ))}
          {!items.length && (
            <tr>
              <Td className="text-muted-foreground">No registered risks against this asset.</Td>
            </tr>
          )}
        </tbody>
      </TableWrap>
    </Panel>
  );
}

function Documents({ asset }: { asset: Asset }) {
  const disposal = DISPOSALS.filter((d) => d.assetId === asset.id);
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel title="Documents" dense>
        <TableWrap>
          <thead>
            <tr>
              <Th>Document</Th>
              <Th>Type</Th>
              <Th right>Date</Th>
            </tr>
          </thead>
          <tbody>
            {asset.documents.map((d) => (
              <tr key={d.name} className="hover:bg-surface-2">
                <Td>{d.name}</Td>
                <Td><Tag>{d.type}</Tag></Td>
                <Td right mono>{d.date}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>
      <Panel title="Linked Disposals" dense>
        <TableWrap>
          <thead>
            <tr>
              <Th>Disposal</Th>
              <Th>Stage</Th>
              <Th right>Target</Th>
              <Th right>Exit IRR</Th>
            </tr>
          </thead>
          <tbody>
            {disposal.map((d) => (
              <tr key={d.id}>
                <Td>{d.name}</Td>
                <Td><Tag tone="info">{d.stage}</Tag></Td>
                <Td right mono>{kes(d.targetPrice)}</Td>
                <Td right mono>{pct(d.exitIrr)}</Td>
              </tr>
            ))}
            {!disposal.length && (
              <tr>
                <Td className="text-muted-foreground">No disposal activity.</Td>
              </tr>
            )}
          </tbody>
        </TableWrap>
      </Panel>
    </div>
  );
}

function Decisions({ asset }: { asset: Asset }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <Panel title="Strategy Analysis" meta="Compare every available course of action" dense>
        <TableWrap>
          <thead>
            <tr>
              <Th>Strategy</Th>
              <Th right>Capital</Th>
              <Th right>Debt</Th>
              <Th right>Equity</Th>
              <Th right>NOI</Th>
              <Th right>Yield</Th>
              <Th right>IRR</Th>
              <Th right>Exit</Th>
              <Th>Risk</Th>
            </tr>
          </thead>
          <tbody>
            {asset.strategyOptions.map((s) => (
              <tr key={s.strategy} className="hover:bg-surface-2">
                <Td><Tag tone="signal">{s.strategy}</Tag></Td>
                <Td right mono>{kes(s.capitalRequired)}</Td>
                <Td right mono>{kes(s.debt)}</Td>
                <Td right mono>{kes(s.equity)}</Td>
                <Td right mono>{kes(s.noi)}</Td>
                <Td right mono>{pct(s.yieldPct)}</Td>
                <Td right mono className="text-primary">{pct(s.irr)}</Td>
                <Td right mono>{kes(s.exitValue)}</Td>
                <Td><Tag tone="risk">{s.risk}</Tag></Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>
      <Panel title="Decision Log" dense>
        <div className="divide-y divide-grid">
          {asset.decisions.map((d) => (
            <div key={d.date + d.decision} className="px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px]">{d.decision}</span>
                <span className="num text-[11px] text-muted-foreground">{d.date}</span>
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {d.by} — {d.note}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border px-3 py-2">
          <Link to="/decisions" className="label-xs text-primary">
            Open investment decision panel →
          </Link>
        </div>
      </Panel>
    </div>
  );
}
