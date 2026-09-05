// Live data layer: reads/writes the shared REDM backend, falling back to the
// bundled reference dataset for SSR and first paint.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ASSETS as SEED_ASSETS,
  ACQUISITIONS as SEED_ACQUISITIONS,
  DISPOSALS as SEED_DISPOSALS,
  RISKS as SEED_RISKS,
  noi,
  type Asset,
  type Acquisition,
  type Disposal,
  type RiskItem,
} from "@/lib/redm-data";

type Row = Record<string, any>;

const n = (v: unknown) => Number(v ?? 0);

export function rowToAsset(r: Row): Asset {
  return {
    id: r["id"],
    name: r["name"],
    portfolio: r["portfolio"] ?? "",
    location: r["location"] ?? "",
    geography: r["geography"] ?? "",
    assetClass: r["asset_class"] ?? "",
    ownership: r["ownership"] ?? "",
    lifecycle: r["lifecycle"],
    strategy: r["strategy"],
    acquisitionValue: n(r["acquisition_value"]),
    currentValue: n(r["current_value"]),
    previousValue: n(r["previous_value"]),
    investedCapital: n(r["invested_capital"]),
    debt: n(r["debt"]),
    revenue: n(r["revenue"]),
    opex: n(r["opex"]),
    occupancy: n(r["occupancy"]),
    projectedIrr: n(r["projected_irr"]),
    roi: n(r["roi"]),
    risk: r["risk"],
    developmentStatus: r["development_status"] ?? "",
    planningStatus: r["planning_status"] ?? "",
    currentUse: r["current_use"] ?? "",
    developmentRights: r["development_rights"] ?? "",
    landArea: n(r["land_area"]),
    gfa: n(r["gfa"]),
    nfa: n(r["nfa"]),
    buildings: n(r["buildings"]),
    units: n(r["units"]),
    residentialArea: n(r["residential_area"]),
    commercialArea: n(r["commercial_area"]),
    parking: n(r["parking"]),
    potentialGfa: n(r["potential_gfa"]),
    projects: (r["projects"] ?? []) as Asset["projects"],
    economics: (r["economics"] ?? {}) as Asset["economics"],
    scenarios: (r["scenarios"] ?? []) as Asset["scenarios"],
    strategyOptions: (r["strategy_options"] ?? []) as Asset["strategyOptions"],
    cashflow: (r["cashflow"] ?? []) as Asset["cashflow"],
    recommendation: (r["recommendation"] ?? {
      decision: "",
      why: [],
      evidence: [],
      alternative: "",
      altProceeds: 0,
      holdIrr: 0,
    }) as Asset["recommendation"],
    documents: (r["documents"] ?? []) as Asset["documents"],
    decisions: (r["decisions"] ?? []) as Asset["decisions"],
    coords: (r["coords"] ?? { x: 50, y: 50 }) as Asset["coords"],
  };
}

export function assetToRow(a: Asset): Row {
  return {
    id: a.id,
    name: a.name,
    portfolio: a.portfolio,
    location: a.location,
    geography: a.geography,
    asset_class: a.assetClass,
    ownership: a.ownership,
    lifecycle: a.lifecycle,
    strategy: a.strategy,
    acquisition_value: a.acquisitionValue,
    current_value: a.currentValue,
    previous_value: a.previousValue,
    invested_capital: a.investedCapital,
    debt: a.debt,
    revenue: a.revenue,
    opex: a.opex,
    occupancy: a.occupancy,
    projected_irr: a.projectedIrr,
    roi: a.roi,
    risk: a.risk,
    development_status: a.developmentStatus,
    planning_status: a.planningStatus,
    current_use: a.currentUse,
    development_rights: a.developmentRights,
    land_area: a.landArea,
    gfa: a.gfa,
    nfa: a.nfa,
    buildings: a.buildings,
    units: a.units,
    residential_area: a.residentialArea,
    commercial_area: a.commercialArea,
    parking: a.parking,
    potential_gfa: a.potentialGfa,
    projects: a.projects,
    economics: a.economics,
    scenarios: a.scenarios,
    strategy_options: a.strategyOptions,
    cashflow: a.cashflow,
    recommendation: a.recommendation,
    documents: a.documents,
    decisions: a.decisions,
    coords: a.coords,
    updated_at: new Date().toISOString(),
  };
}

const rowToAcquisition = (r: Row): Acquisition => ({
  id: r["id"],
  name: r["name"],
  location: r["location"] ?? "",
  stage: r["stage"],
  askingPrice: n(r["asking_price"]),
  estimatedValue: n(r["estimated_value"]),
  acquisitionCost: n(r["acquisition_cost"]),
  landArea: n(r["land_area"]),
  potentialGfa: n(r["potential_gfa"]),
  planning: r["planning"] ?? "",
  title: r["title"] ?? "",
  market: r["market"] ?? "",
  projectedDevelopment: r["projected_development"] ?? "",
  projectedReturn: n(r["projected_return"]),
  risks: r["risks"] ?? "",
  recommendation: r["recommendation"] ?? "",
});

export const acquisitionToRow = (a: Acquisition): Row => ({
  id: a.id,
  name: a.name,
  location: a.location,
  stage: a.stage,
  asking_price: a.askingPrice,
  estimated_value: a.estimatedValue,
  acquisition_cost: a.acquisitionCost,
  land_area: a.landArea,
  potential_gfa: a.potentialGfa,
  planning: a.planning,
  title: a.title,
  market: a.market,
  projected_development: a.projectedDevelopment,
  projected_return: a.projectedReturn,
  risks: a.risks,
  recommendation: a.recommendation,
});

const rowToDisposal = (r: Row): Disposal => ({
  id: r["id"],
  assetId: r["asset_id"] ?? "",
  name: r["name"],
  stage: r["stage"],
  currentValue: n(r["current_value"]),
  targetPrice: n(r["target_price"]),
  offer: n(r["offer"]),
  debt: n(r["debt"]),
  transactionCosts: n(r["transaction_costs"]),
  exitIrr: n(r["exit_irr"]),
});

export const disposalToRow = (d: Disposal): Row => ({
  id: d.id,
  asset_id: d.assetId || null,
  name: d.name,
  stage: d.stage,
  current_value: d.currentValue,
  target_price: d.targetPrice,
  offer: d.offer,
  debt: d.debt,
  transaction_costs: d.transactionCosts,
  exit_irr: d.exitIrr,
});

const rowToRisk = (r: Row): RiskItem => ({
  id: r["id"],
  assetId: r["asset_id"] ?? "",
  category: r["category"] ?? "",
  evidence: r["evidence"] ?? "",
  impact: n(r["impact"]),
  mitigation: r["mitigation"] ?? "",
  owner: r["owner"] ?? "",
  status: r["status"],
  severity: r["severity"],
});

export const riskToRow = (r: RiskItem): Row => ({
  id: r.id,
  asset_id: r.assetId || null,
  category: r.category,
  evidence: r.evidence,
  impact: r.impact,
  mitigation: r.mitigation,
  owner: r.owner,
  status: r.status,
  severity: r.severity,
});

async function fetchAll() {
  const [a, q, d, r] = await Promise.all([
    supabase.from("assets").select("*").order("current_value", { ascending: false }),
    supabase.from("acquisitions").select("*").order("created_at"),
    supabase.from("disposals").select("*").order("created_at"),
    supabase.from("risks").select("*").order("created_at"),
  ]);
  return {
    assets: (a.data ?? []).map(rowToAsset),
    acquisitions: (q.data ?? []).map(rowToAcquisition),
    disposals: (d.data ?? []).map(rowToDisposal),
    risks: (r.data ?? []).map(rowToRisk),
  };
}

const SEED = {
  assets: SEED_ASSETS,
  acquisitions: SEED_ACQUISITIONS,
  disposals: SEED_DISPOSALS,
  risks: SEED_RISKS,
};

export const redmKey = ["redm"] as const;

export function useRedm() {
  const { data, isFetching } = useQuery({
    queryKey: redmKey,
    queryFn: fetchAll,
    initialData: SEED,
    staleTime: 30_000,
  });

  const assets = data.assets.length ? data.assets : SEED.assets;
  const portfolio = {
    gav: assets.reduce((s, a) => s + a.currentValue, 0),
    previousGav: assets.reduce((s, a) => s + a.previousValue, 0),
    debt: assets.reduce((s, a) => s + a.debt, 0),
    invested: assets.reduce((s, a) => s + a.investedCapital, 0),
    revenue: assets.reduce((s, a) => s + a.revenue, 0),
    noi: assets.reduce((s, a) => s + noi(a), 0),
    get nav() {
      return this.gav - this.debt;
    },
  };

  return {
    assets,
    acquisitions: data.acquisitions,
    disposals: data.disposals,
    risks: data.risks,
    portfolio,
    isFetching,
    getAsset: (id: string) => assets.find((a) => a.id === id),
  };
}

type TableName = "assets" | "acquisitions" | "disposals" | "risks";

export function useRedmMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: redmKey });

  const save = useMutation({
    mutationFn: async ({ table, row }: { table: TableName; row: Row }) => {
      const { error } = await supabase.from(table).upsert(row);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async ({ table, id }: { table: TableName; id: string }) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { save, remove };
}

export function useSession() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { email, ready, signedIn: !!email };
}
