// REDM Investment Portfolio — mock dataset (prototype layer).
// The central object is the INVESTMENT ASSET. Everything hangs off it.

export type Strategy =
  | "ACQUIRE"
  | "DEVELOP"
  | "HOLD"
  | "LEASE"
  | "REFINANCE"
  | "SELL"
  | "DISPOSE";

export type Lifecycle =
  | "OPPORTUNITY"
  | "ACQUISITION"
  | "FEASIBILITY"
  | "DUE DILIGENCE"
  | "DESIGN"
  | "APPROVAL"
  | "CONSTRUCTION"
  | "COMPLETION"
  | "LEASE / SALE"
  | "OPERATION"
  | "EXIT";

export const LIFECYCLE_ORDER: Lifecycle[] = [
  "OPPORTUNITY",
  "ACQUISITION",
  "FEASIBILITY",
  "DUE DILIGENCE",
  "DESIGN",
  "APPROVAL",
  "CONSTRUCTION",
  "COMPLETION",
  "LEASE / SALE",
  "OPERATION",
  "EXIT",
];

export const STRATEGIES: Strategy[] = [
  "ACQUIRE",
  "DEVELOP",
  "HOLD",
  "LEASE",
  "REFINANCE",
  "SELL",
  "DISPOSE",
];

export type Risk = "LOW" | "MODERATE" | "ELEVATED" | "HIGH";

export interface AssetProject {
  id: string;
  name: string;
  type: string;
  stage: string;
  progress: number;
  cost: number;
  forecast: number;
  completion: string;
}

export interface CashFlowRow {
  period: string;
  capex: number;
  opIncome: number;
  opCost: number;
  debtDraw: number;
  interest: number;
  debtRepay: number;
  sales: number;
}

export interface RiskItem {
  id: string;
  assetId: string;
  category: string;
  evidence: string;
  impact: number; // KES
  mitigation: string;
  owner: string;
  status: "OPEN" | "MITIGATING" | "MONITOR" | "CLOSED";
  severity: Risk;
}

export interface Scenario {
  name: "BASE CASE" | "UPSIDE" | "DOWNSIDE";
  cost: number;
  revenue: number;
  profit: number;
  irr: number;
  roi: number;
  equity: number;
  debt: number;
  exitValue: number;
}

export interface StrategyOption {
  strategy: string;
  capitalRequired: number;
  debt: number;
  equity: number;
  income: number;
  noi: number;
  yieldPct: number;
  irr: number;
  roi: number;
  exitValue: number;
  risk: Risk;
}

export interface Asset {
  id: string;
  name: string;
  portfolio: string;
  location: string;
  geography: string;
  assetClass: string;
  ownership: string;
  lifecycle: Lifecycle;
  strategy: Strategy;
  acquisitionValue: number;
  currentValue: number;
  previousValue: number;
  investedCapital: number;
  debt: number;
  revenue: number;
  opex: number;
  occupancy: number;
  projectedIrr: number;
  roi: number;
  risk: Risk;
  developmentStatus: string;
  planningStatus: string;
  currentUse: string;
  developmentRights: string;
  landArea: number; // m2
  gfa: number;
  nfa: number;
  buildings: number;
  units: number;
  residentialArea: number;
  commercialArea: number;
  parking: number;
  potentialGfa: number;
  projects: AssetProject[];
  economics: {
    land: number;
    construction: number;
    fees: number;
    finance: number;
    marketing: number;
    contingency: number;
    taxes: number;
    other: number;
    resiSales: number;
    commSales: number;
    rentalValue: number;
    otherIncome: number;
    exitValue: number;
  };
  scenarios: Scenario[];
  strategyOptions: StrategyOption[];
  cashflow: CashFlowRow[];
  recommendation: {
    decision: string;
    why: string[];
    evidence: { label: string; value: string }[];
    alternative: string;
    altProceeds: number;
    holdIrr: number;
  };
  documents: { name: string; type: string; date: string }[];
  decisions: { date: string; decision: string; by: string; note: string }[];
  coords: { x: number; y: number }; // schematic map position (0-100)
}

const cf = (
  seed: number,
  periods: string[],
  scale: number,
): CashFlowRow[] =>
  periods.map((period, i) => {
    const w = Math.sin(seed + i) * 0.35 + 1;
    return {
      period,
      capex: Math.round(scale * 0.42 * w * (i < 4 ? 1 : 0.15)),
      opIncome: Math.round(scale * 0.2 * w * (i > 2 ? 1 : 0.2)),
      opCost: Math.round(scale * 0.06 * w),
      debtDraw: Math.round(scale * 0.25 * w * (i < 5 ? 1 : 0)),
      interest: Math.round(scale * 0.035 * w),
      debtRepay: Math.round(scale * 0.08 * w * (i > 3 ? 1 : 0)),
      sales: Math.round(scale * 0.3 * w * (i > 5 ? 1 : 0)),
    };
  });

const QTRS = ["Q1 26", "Q2 26", "Q3 26", "Q4 26", "Q1 27", "Q2 27", "Q3 27", "Q4 27"];

export const ASSETS: Asset[] = [
  {
    id: "REDM-IA-001",
    name: "Buxton Point",
    portfolio: "REDM Core Development",
    location: "Buxton, Mombasa",
    geography: "Coast",
    assetClass: "Mixed-Use Development",
    ownership: "REDM 74% / County JV 26%",
    lifecycle: "CONSTRUCTION",
    strategy: "DEVELOP",
    acquisitionValue: 1_850_000_000,
    currentValue: 8_420_000_000,
    previousValue: 7_960_000_000,
    investedCapital: 4_310_000_000,
    debt: 3_120_000_000,
    revenue: 620_000_000,
    opex: 148_000_000,
    occupancy: 34,
    projectedIrr: 22.4,
    roi: 38.6,
    risk: "ELEVATED",
    developmentStatus: "Phase 1 superstructure 62%",
    planningStatus: "Approved — full consent",
    currentUse: "Active construction site / partial trading",
    developmentRights: "Mixed-use, 12 storeys, plot ratio 4.5",
    landArea: 62_400,
    gfa: 184_000,
    nfa: 151_000,
    buildings: 9,
    units: 1_842,
    residentialArea: 128_000,
    commercialArea: 41_000,
    parking: 1_240,
    potentialGfa: 214_000,
    projects: [
      { id: "PRJ-BX-01", name: "Phase 1 Development", type: "Residential", stage: "Construction", progress: 62, cost: 2_410_000_000, forecast: 2_505_000_000, completion: "Q3 2027" },
      { id: "PRJ-BX-02", name: "Phase 2 Development", type: "Mixed-use", stage: "Design", progress: 24, cost: 1_980_000_000, forecast: 1_980_000_000, completion: "Q1 2029" },
      { id: "PRJ-BX-03", name: "Trunk Infrastructure", type: "Infrastructure", stage: "Construction", progress: 78, cost: 540_000_000, forecast: 571_000_000, completion: "Q4 2026" },
      { id: "PRJ-BX-04", name: "Public Realm & Landscaping", type: "Landscaping", stage: "Procurement", progress: 8, cost: 190_000_000, forecast: 190_000_000, completion: "Q2 2028" },
      { id: "PRJ-BX-05", name: "Heritage Block Refurbishment", type: "Refurbishment", stage: "Feasibility", progress: 3, cost: 260_000_000, forecast: 260_000_000, completion: "Q4 2028" },
    ],
    economics: {
      land: 1_850_000_000, construction: 5_120_000_000, fees: 612_000_000,
      finance: 486_000_000, marketing: 168_000_000, contingency: 372_000_000,
      taxes: 214_000_000, other: 96_000_000,
      resiSales: 6_940_000_000, commSales: 1_320_000_000,
      rentalValue: 480_000_000, otherIncome: 96_000_000, exitValue: 11_180_000_000,
    },
    scenarios: [
      { name: "BASE CASE", cost: 8_918_000_000, revenue: 11_180_000_000, profit: 2_262_000_000, irr: 22.4, roi: 25.4, equity: 3_120_000_000, debt: 5_798_000_000, exitValue: 11_180_000_000 },
      { name: "UPSIDE", cost: 8_740_000_000, revenue: 12_460_000_000, profit: 3_720_000_000, irr: 29.8, roi: 42.6, equity: 3_010_000_000, debt: 5_730_000_000, exitValue: 12_460_000_000 },
      { name: "DOWNSIDE", cost: 9_460_000_000, revenue: 10_010_000_000, profit: 550_000_000, irr: 9.1, roi: 5.8, equity: 3_540_000_000, debt: 5_920_000_000, exitValue: 10_010_000_000 },
    ],
    strategyOptions: [
      { strategy: "DEVELOP", capitalRequired: 4_608_000_000, debt: 2_678_000_000, equity: 1_930_000_000, income: 480_000_000, noi: 332_000_000, yieldPct: 6.4, irr: 22.4, roi: 25.4, exitValue: 11_180_000_000, risk: "ELEVATED" },
      { strategy: "PHASE", capitalRequired: 2_410_000_000, debt: 1_320_000_000, equity: 1_090_000_000, income: 260_000_000, noi: 181_000_000, yieldPct: 5.9, irr: 19.2, roi: 18.4, exitValue: 6_400_000_000, risk: "MODERATE" },
      { strategy: "SELL", capitalRequired: 0, debt: 3_120_000_000, equity: 0, income: 0, noi: 0, yieldPct: 0, irr: 12.6, roi: 9.4, exitValue: 7_980_000_000, risk: "LOW" },
      { strategy: "REFINANCE", capitalRequired: 0, debt: 4_210_000_000, equity: -1_090_000_000, income: 480_000_000, noi: 332_000_000, yieldPct: 6.4, irr: 24.1, roi: 27.8, exitValue: 11_180_000_000, risk: "MODERATE" },
    ],
    cashflow: cf(1, QTRS, 900_000_000),
    recommendation: {
      decision: "Develop — refinance Phase 1 on practical completion",
      why: ["Phase 1 sales run-rate ahead of plan", "Senior facility priced above market", "Infrastructure de-risked at 78%"],
      evidence: [
        { label: "Phase 1 sales", value: "412 of 640 units reserved" },
        { label: "Cost variance", value: "+3.9% vs sanction" },
        { label: "Current LTV", value: "37%" },
        { label: "Projected IRR", value: "22.4%" },
      ],
      alternative: "Sell part-built Phase 1",
      altProceeds: 4_860_000_000,
      holdIrr: 22.4,
    },
    documents: [
      { name: "Buxton Point Investment Paper v6", type: "Investment", date: "2026-06-14" },
      { name: "Phase 1 Cost Report Jul-26", type: "Cost", date: "2026-07-31" },
      { name: "RICS Valuation — Jun 2026", type: "Valuation", date: "2026-06-30" },
      { name: "Senior Facility Agreement", type: "Debt", date: "2025-02-11" },
    ],
    decisions: [
      { date: "2026-06-20", decision: "Sanction Phase 2 design", by: "Investment Committee", note: "Subject to Phase 1 reaching 60%." },
      { date: "2026-02-04", decision: "Hold heritage block", by: "IC", note: "Refurbishment feasibility to be re-run." },
    ],
    coords: { x: 68, y: 74 },
  },
  {
    id: "REDM-IA-002",
    name: "Riverside Quarter",
    portfolio: "REDM Income",
    location: "Riverside Drive, Nairobi",
    geography: "Nairobi",
    assetClass: "Commercial Office",
    ownership: "REDM 100%",
    lifecycle: "OPERATION",
    strategy: "HOLD",
    acquisitionValue: 3_400_000_000,
    currentValue: 4_960_000_000,
    previousValue: 4_780_000_000,
    investedCapital: 3_820_000_000,
    debt: 1_980_000_000,
    revenue: 528_000_000,
    opex: 142_000_000,
    occupancy: 91,
    projectedIrr: 14.2,
    roi: 29.8,
    risk: "LOW",
    developmentStatus: "Stabilised",
    planningStatus: "Consented — change of use possible",
    currentUse: "Grade A offices with ground-floor retail",
    developmentRights: "Office / mixed-use, plot ratio 3.2",
    landArea: 14_800,
    gfa: 42_600,
    nfa: 36_900,
    buildings: 3,
    units: 68,
    residentialArea: 0,
    commercialArea: 36_900,
    parking: 410,
    potentialGfa: 58_000,
    projects: [
      { id: "PRJ-RQ-01", name: "Lobby & Amenity Repositioning", type: "Refurbishment", stage: "Construction", progress: 44, cost: 210_000_000, forecast: 218_000_000, completion: "Q1 2027" },
      { id: "PRJ-RQ-02", name: "Rooftop Extension Study", type: "Development", stage: "Feasibility", progress: 12, cost: 640_000_000, forecast: 640_000_000, completion: "Q4 2029" },
    ],
    economics: {
      land: 3_400_000_000, construction: 210_000_000, fees: 32_000_000,
      finance: 148_000_000, marketing: 24_000_000, contingency: 46_000_000,
      taxes: 62_000_000, other: 18_000_000,
      resiSales: 0, commSales: 0, rentalValue: 528_000_000, otherIncome: 41_000_000, exitValue: 5_420_000_000,
    },
    scenarios: [
      { name: "BASE CASE", cost: 3_940_000_000, revenue: 5_420_000_000, profit: 1_480_000_000, irr: 14.2, roi: 29.8, equity: 2_980_000_000, debt: 1_980_000_000, exitValue: 5_420_000_000 },
      { name: "UPSIDE", cost: 3_910_000_000, revenue: 6_010_000_000, profit: 2_100_000_000, irr: 18.6, roi: 40.1, equity: 2_940_000_000, debt: 1_980_000_000, exitValue: 6_010_000_000 },
      { name: "DOWNSIDE", cost: 4_060_000_000, revenue: 4_720_000_000, profit: 660_000_000, irr: 7.8, roi: 12.4, equity: 3_180_000_000, debt: 1_980_000_000, exitValue: 4_720_000_000 },
    ],
    strategyOptions: [
      { strategy: "HOLD", capitalRequired: 210_000_000, debt: 1_980_000_000, equity: 2_980_000_000, income: 528_000_000, noi: 386_000_000, yieldPct: 7.8, irr: 14.2, roi: 29.8, exitValue: 5_420_000_000, risk: "LOW" },
      { strategy: "LEASE", capitalRequired: 96_000_000, debt: 1_980_000_000, equity: 2_980_000_000, income: 574_000_000, noi: 421_000_000, yieldPct: 8.5, irr: 15.4, roi: 32.6, exitValue: 5_640_000_000, risk: "LOW" },
      { strategy: "REFINANCE", capitalRequired: 0, debt: 2_980_000_000, equity: 1_980_000_000, income: 528_000_000, noi: 386_000_000, yieldPct: 7.8, irr: 17.9, roi: 41.2, exitValue: 5_420_000_000, risk: "MODERATE" },
      { strategy: "SELL", capitalRequired: 0, debt: 1_980_000_000, equity: 0, income: 0, noi: 0, yieldPct: 0, irr: 13.1, roi: 24.4, exitValue: 4_960_000_000, risk: "LOW" },
      { strategy: "REDEVELOP", capitalRequired: 1_240_000_000, debt: 2_640_000_000, equity: 3_540_000_000, income: 742_000_000, noi: 548_000_000, yieldPct: 8.1, irr: 16.8, roi: 36.2, exitValue: 7_120_000_000, risk: "ELEVATED" },
    ],
    cashflow: cf(2, QTRS, 240_000_000),
    recommendation: {
      decision: "Hold and refinance",
      why: ["NOI growth 6.4% YoY", "Vacancy 9% vs submarket 17%", "Facility 210bps above current market"],
      evidence: [
        { label: "Current NOI", value: "KES 386m" },
        { label: "Rental growth", value: "6.4% YoY" },
        { label: "Occupancy", value: "91%" },
        { label: "Debt service cover", value: "1.94x" },
      ],
      alternative: "Sell to institutional buyer",
      altProceeds: 2_860_000_000,
      holdIrr: 14.2,
    },
    documents: [
      { name: "Riverside Rent Roll Aug-26", type: "Leasing", date: "2026-08-01" },
      { name: "Valuation Report Jun-26", type: "Valuation", date: "2026-06-30" },
    ],
    decisions: [
      { date: "2026-05-12", decision: "Approve lobby repositioning", by: "IC", note: "KES 210m capex sanctioned." },
    ],
    coords: { x: 44, y: 40 },
  },
  {
    id: "REDM-IA-003",
    name: "Tatu Ridge Land Bank",
    portfolio: "REDM Strategic Land",
    location: "Ruiru, Kiambu",
    geography: "Nairobi Metro",
    assetClass: "Strategic Land",
    ownership: "REDM 100%",
    lifecycle: "FEASIBILITY",
    strategy: "DEVELOP",
    acquisitionValue: 940_000_000,
    currentValue: 1_620_000_000,
    previousValue: 1_480_000_000,
    investedCapital: 1_020_000_000,
    debt: 380_000_000,
    revenue: 0,
    opex: 12_000_000,
    occupancy: 0,
    projectedIrr: 26.1,
    roi: 58.9,
    risk: "MODERATE",
    developmentStatus: "Masterplan option testing",
    planningStatus: "Outline submitted",
    currentUse: "Vacant / agricultural",
    developmentRights: "Residential-led, density under negotiation",
    landArea: 214_000,
    gfa: 0,
    nfa: 0,
    buildings: 0,
    units: 0,
    residentialArea: 0,
    commercialArea: 0,
    parking: 0,
    potentialGfa: 168_000,
    projects: [
      { id: "PRJ-TR-01", name: "Masterplan & Feasibility", type: "Feasibility", stage: "Feasibility", progress: 55, cost: 84_000_000, forecast: 84_000_000, completion: "Q2 2027" },
    ],
    economics: {
      land: 940_000_000, construction: 4_020_000_000, fees: 462_000_000,
      finance: 388_000_000, marketing: 132_000_000, contingency: 288_000_000,
      taxes: 164_000_000, other: 62_000_000,
      resiSales: 6_240_000_000, commSales: 420_000_000, rentalValue: 0, otherIncome: 0, exitValue: 6_660_000_000,
    },
    scenarios: [
      { name: "BASE CASE", cost: 6_456_000_000, revenue: 6_660_000_000, profit: 204_000_000, irr: 26.1, roi: 3.2, equity: 2_100_000_000, debt: 4_356_000_000, exitValue: 6_660_000_000 },
      { name: "UPSIDE", cost: 6_310_000_000, revenue: 7_540_000_000, profit: 1_230_000_000, irr: 33.4, roi: 19.5, equity: 2_010_000_000, debt: 4_300_000_000, exitValue: 7_540_000_000 },
      { name: "DOWNSIDE", cost: 6_880_000_000, revenue: 5_960_000_000, profit: -920_000_000, irr: -4.2, roi: -13.4, equity: 2_460_000_000, debt: 4_420_000_000, exitValue: 5_960_000_000 },
    ],
    strategyOptions: [
      { strategy: "DEVELOP", capitalRequired: 5_516_000_000, debt: 4_356_000_000, equity: 2_100_000_000, income: 0, noi: 0, yieldPct: 0, irr: 26.1, roi: 3.2, exitValue: 6_660_000_000, risk: "ELEVATED" },
      { strategy: "HOLD", capitalRequired: 24_000_000, debt: 380_000_000, equity: 1_240_000_000, income: 0, noi: -12_000_000, yieldPct: 0, irr: 11.4, roi: 22.0, exitValue: 2_120_000_000, risk: "LOW" },
      { strategy: "SELL", capitalRequired: 0, debt: 380_000_000, equity: 0, income: 0, noi: 0, yieldPct: 0, irr: 18.2, roi: 47.8, exitValue: 1_620_000_000, risk: "LOW" },
    ],
    cashflow: cf(3, QTRS, 120_000_000),
    recommendation: {
      decision: "Progress feasibility — decision gate Q2 2027",
      why: ["Land value up 9.4% since acquisition", "Density negotiation unresolved", "Equity requirement material vs portfolio headroom"],
      evidence: [
        { label: "Land value", value: "KES 1.62bn" },
        { label: "Downside IRR", value: "-4.2%" },
        { label: "Planning", value: "Outline submitted" },
        { label: "Equity required", value: "KES 2.10bn" },
      ],
      alternative: "Sell serviced land parcels",
      altProceeds: 1_240_000_000,
      holdIrr: 11.4,
    },
    documents: [{ name: "Tatu Ridge Masterplan Option C", type: "Design", date: "2026-07-18" }],
    decisions: [{ date: "2026-03-02", decision: "Fund feasibility", by: "IC", note: "KES 84m budget." }],
    coords: { x: 50, y: 30 },
  },
  {
    id: "REDM-IA-004",
    name: "Nyali Beach Residences",
    portfolio: "REDM Income",
    location: "Nyali, Mombasa",
    geography: "Coast",
    assetClass: "Residential (Income)",
    ownership: "REDM 60% / Fund 40%",
    lifecycle: "LEASE / SALE",
    strategy: "SELL",
    acquisitionValue: 1_120_000_000,
    currentValue: 2_240_000_000,
    previousValue: 2_280_000_000,
    investedCapital: 1_690_000_000,
    debt: 860_000_000,
    revenue: 214_000_000,
    opex: 71_000_000,
    occupancy: 78,
    projectedIrr: 11.8,
    roi: 32.5,
    risk: "MODERATE",
    developmentStatus: "Complete — 62% sold",
    planningStatus: "Consent discharged",
    currentUse: "Residential, part let / part sale",
    developmentRights: "Residential, fully utilised",
    landArea: 9_600,
    gfa: 28_400,
    nfa: 24_100,
    buildings: 4,
    units: 186,
    residentialArea: 24_100,
    commercialArea: 0,
    parking: 220,
    potentialGfa: 28_400,
    projects: [
      { id: "PRJ-NB-01", name: "Sales & Handover Programme", type: "Sales", stage: "Delivery", progress: 62, cost: 68_000_000, forecast: 74_000_000, completion: "Q3 2027" },
    ],
    economics: {
      land: 1_120_000_000, construction: 1_420_000_000, fees: 168_000_000,
      finance: 142_000_000, marketing: 96_000_000, contingency: 62_000_000,
      taxes: 74_000_000, other: 28_000_000,
      resiSales: 2_760_000_000, commSales: 0, rentalValue: 214_000_000, otherIncome: 18_000_000, exitValue: 2_780_000_000,
    },
    scenarios: [
      { name: "BASE CASE", cost: 3_110_000_000, revenue: 2_780_000_000, profit: -330_000_000, irr: 11.8, roi: -10.6, equity: 1_380_000_000, debt: 1_730_000_000, exitValue: 2_780_000_000 },
      { name: "UPSIDE", cost: 3_060_000_000, revenue: 3_240_000_000, profit: 180_000_000, irr: 16.2, roi: 5.9, equity: 1_340_000_000, debt: 1_720_000_000, exitValue: 3_240_000_000 },
      { name: "DOWNSIDE", cost: 3_240_000_000, revenue: 2_480_000_000, profit: -760_000_000, irr: 2.1, roi: -23.5, equity: 1_520_000_000, debt: 1_720_000_000, exitValue: 2_480_000_000 },
    ],
    strategyOptions: [
      { strategy: "SELL", capitalRequired: 0, debt: 860_000_000, equity: 0, income: 0, noi: 0, yieldPct: 0, irr: 11.8, roi: 32.5, exitValue: 2_240_000_000, risk: "LOW" },
      { strategy: "LEASE", capitalRequired: 42_000_000, debt: 860_000_000, equity: 1_380_000_000, income: 268_000_000, noi: 182_000_000, yieldPct: 8.1, irr: 12.9, roi: 28.4, exitValue: 2_360_000_000, risk: "MODERATE" },
      { strategy: "HOLD", capitalRequired: 18_000_000, debt: 860_000_000, equity: 1_380_000_000, income: 214_000_000, noi: 143_000_000, yieldPct: 6.4, irr: 10.2, roi: 21.4, exitValue: 2_310_000_000, risk: "MODERATE" },
    ],
    cashflow: cf(4, QTRS, 160_000_000),
    recommendation: {
      decision: "Accelerate disposal of remaining stock",
      why: ["Valuation down 1.8% this cycle", "Sales rate below plan", "Capital trapped against pipeline needs"],
      evidence: [
        { label: "Units remaining", value: "71 of 186" },
        { label: "Sales rate", value: "4.1/month vs 6.0 plan" },
        { label: "Debt outstanding", value: "KES 860m" },
        { label: "Exit IRR", value: "11.8%" },
      ],
      alternative: "Convert unsold stock to rental",
      altProceeds: 1_290_000_000,
      holdIrr: 10.2,
    },
    documents: [{ name: "Nyali Sales Report Aug-26", type: "Sales", date: "2026-08-05" }],
    decisions: [{ date: "2026-07-09", decision: "Appoint disposal agent", by: "IC", note: "Bulk sale option to be tested." }],
    coords: { x: 72, y: 78 },
  },
  {
    id: "REDM-IA-005",
    name: "Westlands Trade Centre",
    portfolio: "REDM Income",
    location: "Westlands, Nairobi",
    geography: "Nairobi",
    assetClass: "Retail / Mixed-Use",
    ownership: "REDM 100%",
    lifecycle: "OPERATION",
    strategy: "REFINANCE",
    acquisitionValue: 2_260_000_000,
    currentValue: 3_180_000_000,
    previousValue: 3_040_000_000,
    investedCapital: 2_540_000_000,
    debt: 1_120_000_000,
    revenue: 396_000_000,
    opex: 132_000_000,
    occupancy: 86,
    projectedIrr: 13.4,
    roi: 25.2,
    risk: "MODERATE",
    developmentStatus: "Stabilised — anchor renewal due",
    planningStatus: "Consented",
    currentUse: "Retail with office upper levels",
    developmentRights: "Mixed-use, 20% uplift available",
    landArea: 11_200,
    gfa: 31_800,
    nfa: 27_400,
    buildings: 2,
    units: 94,
    residentialArea: 0,
    commercialArea: 27_400,
    parking: 380,
    potentialGfa: 38_200,
    projects: [
      { id: "PRJ-WT-01", name: "Anchor Unit Reconfiguration", type: "Refurbishment", stage: "Design", progress: 30, cost: 148_000_000, forecast: 148_000_000, completion: "Q4 2027" },
    ],
    economics: {
      land: 2_260_000_000, construction: 148_000_000, fees: 22_000_000,
      finance: 96_000_000, marketing: 18_000_000, contingency: 28_000_000,
      taxes: 44_000_000, other: 14_000_000,
      resiSales: 0, commSales: 0, rentalValue: 396_000_000, otherIncome: 26_000_000, exitValue: 3_640_000_000,
    },
    scenarios: [
      { name: "BASE CASE", cost: 2_630_000_000, revenue: 3_640_000_000, profit: 1_010_000_000, irr: 13.4, roi: 25.2, equity: 2_060_000_000, debt: 1_120_000_000, exitValue: 3_640_000_000 },
      { name: "UPSIDE", cost: 2_600_000_000, revenue: 4_020_000_000, profit: 1_420_000_000, irr: 17.1, roi: 34.8, equity: 2_020_000_000, debt: 1_120_000_000, exitValue: 4_020_000_000 },
      { name: "DOWNSIDE", cost: 2_720_000_000, revenue: 3_180_000_000, profit: 460_000_000, irr: 6.9, roi: 11.2, equity: 2_180_000_000, debt: 1_120_000_000, exitValue: 3_180_000_000 },
    ],
    strategyOptions: [
      { strategy: "REFINANCE", capitalRequired: 0, debt: 1_910_000_000, equity: 1_270_000_000, income: 396_000_000, noi: 264_000_000, yieldPct: 8.3, irr: 16.4, roi: 33.8, exitValue: 3_640_000_000, risk: "MODERATE" },
      { strategy: "HOLD", capitalRequired: 148_000_000, debt: 1_120_000_000, equity: 2_060_000_000, income: 396_000_000, noi: 264_000_000, yieldPct: 8.3, irr: 13.4, roi: 25.2, exitValue: 3_640_000_000, risk: "MODERATE" },
      { strategy: "EXPAND", capitalRequired: 810_000_000, debt: 1_640_000_000, equity: 2_350_000_000, income: 512_000_000, noi: 348_000_000, yieldPct: 8.7, irr: 15.2, roi: 29.6, exitValue: 4_460_000_000, risk: "ELEVATED" },
    ],
    cashflow: cf(5, QTRS, 180_000_000),
    recommendation: {
      decision: "Refinance and release equity",
      why: ["LTV 35% against 55% market capacity", "Stable NOI with anchor renewal likely", "Equity needed for Tatu Ridge"],
      evidence: [
        { label: "Current LTV", value: "35%" },
        { label: "Potential LTV", value: "60%" },
        { label: "Equity release", value: "KES 790m" },
        { label: "Post-refi yield", value: "8.3%" },
      ],
      alternative: "Hold unlevered",
      altProceeds: 0,
      holdIrr: 13.4,
    },
    documents: [{ name: "Term Sheet — Senior Refi", type: "Debt", date: "2026-08-12" }],
    decisions: [{ date: "2026-08-12", decision: "Request refinancing terms", by: "Treasury", note: "3 lenders approached." }],
    coords: { x: 40, y: 36 },
  },
  {
    id: "REDM-IA-006",
    name: "Kilifi Logistics Park",
    portfolio: "REDM Core Development",
    location: "Kilifi",
    geography: "Coast",
    assetClass: "Industrial / Logistics",
    ownership: "REDM 85% / DFI 15%",
    lifecycle: "DESIGN",
    strategy: "DEVELOP",
    acquisitionValue: 620_000_000,
    currentValue: 1_040_000_000,
    previousValue: 940_000_000,
    investedCapital: 740_000_000,
    debt: 240_000_000,
    revenue: 0,
    opex: 8_000_000,
    occupancy: 0,
    projectedIrr: 24.6,
    roi: 41.2,
    risk: "MODERATE",
    developmentStatus: "RIBA Stage 3",
    planningStatus: "Approval pending",
    currentUse: "Cleared serviced land",
    developmentRights: "Industrial, 60% coverage",
    landArea: 148_000,
    gfa: 74_000,
    nfa: 71_000,
    buildings: 6,
    units: 24,
    residentialArea: 0,
    commercialArea: 71_000,
    parking: 340,
    potentialGfa: 92_000,
    projects: [
      { id: "PRJ-KL-01", name: "Unit A–C Development", type: "Development", stage: "Design", progress: 38, cost: 1_840_000_000, forecast: 1_840_000_000, completion: "Q2 2029" },
      { id: "PRJ-KL-02", name: "Site Infrastructure", type: "Infrastructure", stage: "Tender", progress: 18, cost: 420_000_000, forecast: 432_000_000, completion: "Q1 2028" },
    ],
    economics: {
      land: 620_000_000, construction: 2_260_000_000, fees: 246_000_000,
      finance: 212_000_000, marketing: 42_000_000, contingency: 168_000_000,
      taxes: 88_000_000, other: 34_000_000,
      resiSales: 0, commSales: 1_240_000_000, rentalValue: 386_000_000, otherIncome: 12_000_000, exitValue: 4_820_000_000,
    },
    scenarios: [
      { name: "BASE CASE", cost: 3_670_000_000, revenue: 4_820_000_000, profit: 1_150_000_000, irr: 24.6, roi: 31.3, equity: 1_280_000_000, debt: 2_390_000_000, exitValue: 4_820_000_000 },
      { name: "UPSIDE", cost: 3_600_000_000, revenue: 5_410_000_000, profit: 1_810_000_000, irr: 31.2, roi: 50.3, equity: 1_240_000_000, debt: 2_360_000_000, exitValue: 5_410_000_000 },
      { name: "DOWNSIDE", cost: 3_920_000_000, revenue: 4_240_000_000, profit: 320_000_000, irr: 8.4, roi: 8.2, equity: 1_480_000_000, debt: 2_440_000_000, exitValue: 4_240_000_000 },
    ],
    strategyOptions: [
      { strategy: "DEVELOP", capitalRequired: 3_050_000_000, debt: 2_390_000_000, equity: 1_280_000_000, income: 386_000_000, noi: 312_000_000, yieldPct: 8.5, irr: 24.6, roi: 31.3, exitValue: 4_820_000_000, risk: "MODERATE" },
      { strategy: "PHASE", capitalRequired: 1_420_000_000, debt: 1_060_000_000, equity: 720_000_000, income: 168_000_000, noi: 138_000_000, yieldPct: 8.2, irr: 21.4, roi: 24.6, exitValue: 2_180_000_000, risk: "LOW" },
      { strategy: "SELL", capitalRequired: 0, debt: 240_000_000, equity: 0, income: 0, noi: 0, yieldPct: 0, irr: 19.8, roi: 40.4, exitValue: 1_040_000_000, risk: "LOW" },
    ],
    cashflow: cf(6, QTRS, 300_000_000),
    recommendation: {
      decision: "Develop in two phases",
      why: ["Pre-let interest for 42% of Phase 1 GFA", "Approval pending — start on site gated", "Phasing lowers peak equity by KES 560m"],
      evidence: [
        { label: "Yield on cost", value: "8.5%" },
        { label: "Peak equity (single phase)", value: "KES 1.28bn" },
        { label: "Peak equity (phased)", value: "KES 0.72bn" },
        { label: "Pre-let", value: "42% Phase 1" },
      ],
      alternative: "Sell consented land",
      altProceeds: 800_000_000,
      holdIrr: 24.6,
    },
    documents: [{ name: "Stage 3 Design Report", type: "Design", date: "2026-07-02" }],
    decisions: [{ date: "2026-04-22", decision: "Approve Stage 3", by: "IC", note: "Phasing study requested." }],
    coords: { x: 74, y: 66 },
  },
  {
    id: "REDM-IA-007",
    name: "Karen Grove Estate",
    portfolio: "REDM Strategic Land",
    location: "Karen, Nairobi",
    geography: "Nairobi",
    assetClass: "Residential Development",
    ownership: "REDM 100%",
    lifecycle: "APPROVAL",
    strategy: "DEVELOP",
    acquisitionValue: 1_480_000_000,
    currentValue: 2_060_000_000,
    previousValue: 1_940_000_000,
    investedCapital: 1_620_000_000,
    debt: 520_000_000,
    revenue: 0,
    opex: 14_000_000,
    occupancy: 0,
    projectedIrr: 19.7,
    roi: 27.4,
    risk: "ELEVATED",
    developmentStatus: "Awaiting NEMA & county approval",
    planningStatus: "Determination expected Q4 2026",
    currentUse: "Vacant",
    developmentRights: "Low-density residential, 84 units",
    landArea: 48_000,
    gfa: 32_600,
    nfa: 29_400,
    buildings: 84,
    units: 84,
    residentialArea: 29_400,
    commercialArea: 0,
    parking: 168,
    potentialGfa: 42_000,
    projects: [
      { id: "PRJ-KG-01", name: "Estate Development", type: "Residential", stage: "Approval", progress: 22, cost: 2_640_000_000, forecast: 2_640_000_000, completion: "Q3 2029" },
    ],
    economics: {
      land: 1_480_000_000, construction: 2_180_000_000, fees: 268_000_000,
      finance: 196_000_000, marketing: 108_000_000, contingency: 164_000_000,
      taxes: 92_000_000, other: 36_000_000,
      resiSales: 5_120_000_000, commSales: 0, rentalValue: 0, otherIncome: 0, exitValue: 5_120_000_000,
    },
    scenarios: [
      { name: "BASE CASE", cost: 4_524_000_000, revenue: 5_120_000_000, profit: 596_000_000, irr: 19.7, roi: 13.2, equity: 1_760_000_000, debt: 2_764_000_000, exitValue: 5_120_000_000 },
      { name: "UPSIDE", cost: 4_440_000_000, revenue: 5_720_000_000, profit: 1_280_000_000, irr: 26.4, roi: 28.8, equity: 1_700_000_000, debt: 2_740_000_000, exitValue: 5_720_000_000 },
      { name: "DOWNSIDE", cost: 4_820_000_000, revenue: 4_560_000_000, profit: -260_000_000, irr: 1.4, roi: -5.4, equity: 1_980_000_000, debt: 2_840_000_000, exitValue: 4_560_000_000 },
    ],
    strategyOptions: [
      { strategy: "DEVELOP", capitalRequired: 3_044_000_000, debt: 2_764_000_000, equity: 1_760_000_000, income: 0, noi: 0, yieldPct: 0, irr: 19.7, roi: 13.2, exitValue: 5_120_000_000, risk: "ELEVATED" },
      { strategy: "HOLD", capitalRequired: 28_000_000, debt: 520_000_000, equity: 1_540_000_000, income: 0, noi: -14_000_000, yieldPct: 0, irr: 9.8, roi: 15.6, exitValue: 2_420_000_000, risk: "LOW" },
      { strategy: "SELL", capitalRequired: 0, debt: 520_000_000, equity: 0, income: 0, noi: 0, yieldPct: 0, irr: 16.2, roi: 28.1, exitValue: 2_060_000_000, risk: "LOW" },
    ],
    cashflow: cf(7, QTRS, 140_000_000),
    recommendation: {
      decision: "Hold until determination",
      why: ["Approval risk unresolved", "Downside case negative", "Consented value materially above current"],
      evidence: [
        { label: "Determination", value: "Q4 2026" },
        { label: "Downside profit", value: "-KES 260m" },
        { label: "Consented value", value: "KES 2.42bn" },
        { label: "Base IRR", value: "19.7%" },
      ],
      alternative: "Sell unconsented",
      altProceeds: 1_540_000_000,
      holdIrr: 9.8,
    },
    documents: [{ name: "Planning Submission Pack", type: "Planning", date: "2026-05-30" }],
    decisions: [{ date: "2026-05-30", decision: "Submit application", by: "Development", note: "Determination expected Q4." }],
    coords: { x: 36, y: 48 },
  },
  {
    id: "REDM-IA-008",
    name: "Naivasha Gateway",
    portfolio: "REDM Core Development",
    location: "Naivasha",
    geography: "Rift Valley",
    assetClass: "Mixed-Use Development",
    ownership: "REDM 50% / JV 50%",
    lifecycle: "DUE DILIGENCE",
    strategy: "ACQUIRE",
    acquisitionValue: 780_000_000,
    currentValue: 780_000_000,
    previousValue: 780_000_000,
    investedCapital: 46_000_000,
    debt: 0,
    revenue: 0,
    opex: 4_000_000,
    occupancy: 0,
    projectedIrr: 28.2,
    roi: 46.0,
    risk: "HIGH",
    developmentStatus: "Pre-acquisition",
    planningStatus: "No consent — zoning favourable",
    currentUse: "Vacant land adjacent to SGR terminal",
    developmentRights: "Mixed-use, subject to application",
    landArea: 96_000,
    gfa: 0,
    nfa: 0,
    buildings: 0,
    units: 0,
    residentialArea: 0,
    commercialArea: 0,
    parking: 0,
    potentialGfa: 88_000,
    projects: [
      { id: "PRJ-NG-01", name: "Acquisition Due Diligence", type: "Acquisition", stage: "Due Diligence", progress: 46, cost: 46_000_000, forecast: 52_000_000, completion: "Q1 2027" },
    ],
    economics: {
      land: 780_000_000, construction: 2_640_000_000, fees: 312_000_000,
      finance: 244_000_000, marketing: 82_000_000, contingency: 198_000_000,
      taxes: 104_000_000, other: 42_000_000,
      resiSales: 3_420_000_000, commSales: 1_180_000_000, rentalValue: 214_000_000, otherIncome: 0, exitValue: 4_820_000_000,
    },
    scenarios: [
      { name: "BASE CASE", cost: 4_402_000_000, revenue: 4_820_000_000, profit: 418_000_000, irr: 28.2, roi: 9.5, equity: 1_540_000_000, debt: 2_862_000_000, exitValue: 4_820_000_000 },
      { name: "UPSIDE", cost: 4_320_000_000, revenue: 5_460_000_000, profit: 1_140_000_000, irr: 36.1, roi: 26.4, equity: 1_480_000_000, debt: 2_840_000_000, exitValue: 5_460_000_000 },
      { name: "DOWNSIDE", cost: 4_710_000_000, revenue: 4_180_000_000, profit: -530_000_000, irr: -6.8, roi: -11.3, equity: 1_720_000_000, debt: 2_990_000_000, exitValue: 4_180_000_000 },
    ],
    strategyOptions: [
      { strategy: "ACQUIRE", capitalRequired: 780_000_000, debt: 390_000_000, equity: 390_000_000, income: 0, noi: 0, yieldPct: 0, irr: 28.2, roi: 46.0, exitValue: 1_140_000_000, risk: "HIGH" },
      { strategy: "PAUSE", capitalRequired: 0, debt: 0, equity: 46_000_000, income: 0, noi: 0, yieldPct: 0, irr: 0, roi: 0, exitValue: 0, risk: "LOW" },
    ],
    cashflow: cf(8, QTRS, 80_000_000),
    recommendation: {
      decision: "Proceed to negotiation with price cap",
      why: ["Title chain incomplete on 2 parcels", "Zoning supportive but unconsented", "Return only clears hurdle below KES 720m land price"],
      evidence: [
        { label: "Asking price", value: "KES 840m" },
        { label: "Max supportable", value: "KES 720m" },
        { label: "Downside IRR", value: "-6.8%" },
        { label: "Title status", value: "2 parcels unresolved" },
      ],
      alternative: "Withdraw",
      altProceeds: 0,
      holdIrr: 0,
    },
    documents: [{ name: "DD Red Flag Report", type: "Due Diligence", date: "2026-08-08" }],
    decisions: [{ date: "2026-06-01", decision: "Enter exclusivity", by: "IC", note: "90 days exclusivity agreed." }],
    coords: { x: 30, y: 42 },
  },
];

export interface Acquisition {
  id: string;
  name: string;
  location: string;
  stage:
    | "Identified"
    | "Screening"
    | "Initial Feasibility"
    | "Due Diligence"
    | "Negotiation"
    | "Investment Approval"
    | "Acquisition";
  askingPrice: number;
  estimatedValue: number;
  acquisitionCost: number;
  landArea: number;
  potentialGfa: number;
  planning: string;
  title: string;
  market: string;
  projectedDevelopment: string;
  projectedReturn: number;
  risks: string;
  recommendation: string;
}

export const ACQUISITION_STAGES: Acquisition["stage"][] = [
  "Identified",
  "Screening",
  "Initial Feasibility",
  "Due Diligence",
  "Negotiation",
  "Investment Approval",
  "Acquisition",
];

export const ACQUISITIONS: Acquisition[] = [
  { id: "ACQ-101", name: "Naivasha Gateway", location: "Naivasha", stage: "Due Diligence", askingPrice: 840_000_000, estimatedValue: 780_000_000, acquisitionCost: 62_000_000, landArea: 96_000, potentialGfa: 88_000, planning: "Unconsented", title: "2 parcels unresolved", market: "SGR-led growth corridor", projectedDevelopment: "Mixed-use 88,000 m²", projectedReturn: 28.2, risks: "Title, planning, market depth", recommendation: "Proceed with price cap KES 720m" },
  { id: "ACQ-102", name: "Thika Road Logistics Site", location: "Ruiru", stage: "Negotiation", askingPrice: 1_240_000_000, estimatedValue: 1_180_000_000, acquisitionCost: 84_000_000, landArea: 121_000, potentialGfa: 68_000, planning: "Industrial zoned", title: "Clean", market: "Strong occupier demand", projectedDevelopment: "Logistics 68,000 m²", projectedReturn: 23.4, risks: "Power capacity, access road", recommendation: "Proceed" },
  { id: "ACQ-103", name: "Diani Resort Parcel", location: "Diani", stage: "Initial Feasibility", askingPrice: 520_000_000, estimatedValue: 470_000_000, acquisitionCost: 34_000_000, landArea: 42_000, potentialGfa: 24_000, planning: "Tourism zone", title: "Clean", market: "Seasonal demand", projectedDevelopment: "Resort 180 keys", projectedReturn: 17.8, risks: "Operator dependency, seasonality", recommendation: "Continue feasibility" },
  { id: "ACQ-104", name: "Upper Hill Office Tower", location: "Upper Hill, Nairobi", stage: "Investment Approval", askingPrice: 3_640_000_000, estimatedValue: 3_820_000_000, acquisitionCost: 168_000_000, landArea: 6_400, potentialGfa: 44_000, planning: "Consented", title: "Clean", market: "Oversupplied submarket", projectedDevelopment: "Income acquisition, 82% let", projectedReturn: 14.6, risks: "Vacancy, incentives", recommendation: "Approve at KES 3.55bn" },
  { id: "ACQ-105", name: "Nakuru Town Retail", location: "Nakuru", stage: "Screening", askingPrice: 680_000_000, estimatedValue: 590_000_000, acquisitionCost: 41_000_000, landArea: 18_400, potentialGfa: 21_000, planning: "Commercial", title: "Caveat registered", market: "Improving catchment", projectedDevelopment: "Retail 21,000 m²", projectedReturn: 12.1, risks: "Caveat, anchor availability", recommendation: "Hold — resolve caveat" },
  { id: "ACQ-106", name: "Kisumu Lakefront", location: "Kisumu", stage: "Identified", askingPrice: 410_000_000, estimatedValue: 380_000_000, acquisitionCost: 22_000_000, landArea: 34_000, potentialGfa: 26_000, planning: "Under review", title: "Unverified", market: "Emerging", projectedDevelopment: "Mixed-use 26,000 m²", projectedReturn: 9.4, risks: "Flood risk, infrastructure", recommendation: "Screen only" },
  { id: "ACQ-107", name: "Athi River Industrial", location: "Athi River", stage: "Acquisition", askingPrice: 920_000_000, estimatedValue: 940_000_000, acquisitionCost: 58_000_000, landArea: 88_000, potentialGfa: 52_000, planning: "Industrial zoned", title: "Clean", market: "Strong", projectedDevelopment: "Logistics 52,000 m²", projectedReturn: 21.9, risks: "Completion timing", recommendation: "Complete Q4 2026" },
];

export interface Disposal {
  id: string;
  assetId: string;
  name: string;
  stage:
    | "Identified"
    | "Valued"
    | "Approved"
    | "Marketed"
    | "Offer"
    | "Negotiation"
    | "Contract"
    | "Completion";
  currentValue: number;
  targetPrice: number;
  offer: number;
  debt: number;
  transactionCosts: number;
  exitIrr: number;
}

export const DISPOSAL_STAGES: Disposal["stage"][] = [
  "Identified",
  "Valued",
  "Approved",
  "Marketed",
  "Offer",
  "Negotiation",
  "Contract",
  "Completion",
];

export const DISPOSALS: Disposal[] = [
  { id: "DSP-01", assetId: "REDM-IA-004", name: "Nyali Beach Residences — residual stock", stage: "Marketed", currentValue: 2_240_000_000, targetPrice: 2_310_000_000, offer: 2_140_000_000, debt: 860_000_000, transactionCosts: 74_000_000, exitIrr: 11.8 },
  { id: "DSP-02", assetId: "REDM-IA-003", name: "Tatu Ridge — southern parcel", stage: "Valued", currentValue: 640_000_000, targetPrice: 690_000_000, offer: 0, debt: 140_000_000, transactionCosts: 21_000_000, exitIrr: 18.2 },
  { id: "DSP-03", assetId: "REDM-IA-001", name: "Buxton Point — retail podium (part)", stage: "Identified", currentValue: 1_180_000_000, targetPrice: 1_260_000_000, offer: 0, debt: 420_000_000, transactionCosts: 38_000_000, exitIrr: 14.1 },
  { id: "DSP-04", assetId: "REDM-IA-007", name: "Karen Grove — surplus land strip", stage: "Negotiation", currentValue: 310_000_000, targetPrice: 340_000_000, offer: 322_000_000, debt: 0, transactionCosts: 11_000_000, exitIrr: 22.4 },
];

export const RISKS: RiskItem[] = [
  { id: "RSK-01", assetId: "REDM-IA-001", category: "Construction risk", evidence: "Phase 1 cost report shows +3.9% vs sanction; two variations pending", impact: 95_000_000, mitigation: "Value engineering workshop; variation freeze", owner: "K. Otieno", status: "MITIGATING", severity: "ELEVATED" },
  { id: "RSK-02", assetId: "REDM-IA-001", category: "Sales risk", evidence: "412/640 reserved, conversion 78%", impact: 140_000_000, mitigation: "Incentive package for Q4 releases", owner: "A. Wanjiru", status: "MONITOR", severity: "MODERATE" },
  { id: "RSK-03", assetId: "REDM-IA-007", category: "Planning risk", evidence: "Determination outstanding since May 2026", impact: 380_000_000, mitigation: "Pre-determination engagement with county", owner: "M. Kariuki", status: "OPEN", severity: "HIGH" },
  { id: "RSK-04", assetId: "REDM-IA-008", category: "Regulatory risk", evidence: "Two parcels with incomplete title chain", impact: 210_000_000, mitigation: "Conditional contract with title warranty", owner: "Legal", status: "OPEN", severity: "HIGH" },
  { id: "RSK-05", assetId: "REDM-IA-005", category: "Leasing risk", evidence: "Anchor lease expiring Q2 2027, 22% of income", impact: 88_000_000, mitigation: "Early renewal negotiation started", owner: "J. Mwangi", status: "MITIGATING", severity: "MODERATE" },
  { id: "RSK-06", assetId: "REDM-IA-002", category: "Financing risk", evidence: "Facility margin 210bps above market", impact: 42_000_000, mitigation: "Refinance term sheets requested", owner: "Treasury", status: "MITIGATING", severity: "LOW" },
  { id: "RSK-07", assetId: "REDM-IA-004", category: "Liquidity risk", evidence: "Sales rate 4.1/month vs 6.0 plan", impact: 160_000_000, mitigation: "Bulk sale option under test", owner: "A. Wanjiru", status: "OPEN", severity: "ELEVATED" },
  { id: "RSK-08", assetId: "REDM-IA-006", category: "Programme risk", evidence: "Approval pending; start on site gated", impact: 74_000_000, mitigation: "Phase 1 enabling works package", owner: "K. Otieno", status: "MONITOR", severity: "MODERATE" },
  { id: "RSK-09", assetId: "REDM-IA-003", category: "Market risk", evidence: "Metro land absorption slowed 11% YoY", impact: 120_000_000, mitigation: "Masterplan density options retained", owner: "Research", status: "MONITOR", severity: "MODERATE" },
  { id: "RSK-10", assetId: "REDM-IA-001", category: "Concentration risk", evidence: "Coast geography = 47% of GAV", impact: 0, mitigation: "Metro pipeline weighting increased", owner: "IC", status: "MONITOR", severity: "ELEVATED" },
];

// ---- derived helpers -------------------------------------------------------

export const noi = (a: Asset) => a.revenue - a.opex;
export const equity = (a: Asset) => a.currentValue - a.debt;
export const yieldPct = (a: Asset) =>
  a.currentValue ? (noi(a) / a.currentValue) * 100 : 0;
export const ltv = (a: Asset) => (a.currentValue ? (a.debt / a.currentValue) * 100 : 0);
export const tdc = (a: Asset) => {
  const e = a.economics;
  return e.land + e.construction + e.fees + e.finance + e.marketing + e.contingency + e.taxes + e.other;
};
export const gdv = (a: Asset) => {
  const e = a.economics;
  return e.resiSales + e.commSales + e.rentalValue + e.otherIncome;
};

export const PORTFOLIO = {
  get gav() {
    return ASSETS.reduce((s, a) => s + a.currentValue, 0);
  },
  get previousGav() {
    return ASSETS.reduce((s, a) => s + a.previousValue, 0);
  },
  get debt() {
    return ASSETS.reduce((s, a) => s + a.debt, 0);
  },
  get nav() {
    return this.gav - this.debt;
  },
  get invested() {
    return ASSETS.reduce((s, a) => s + a.investedCapital, 0);
  },
  get revenue() {
    return ASSETS.reduce((s, a) => s + a.revenue, 0);
  },
  get noi() {
    return ASSETS.reduce((s, a) => s + noi(a), 0);
  },
};

export const getAsset = (id: string) => ASSETS.find((a) => a.id === id);

export const fmtKES = (v: number, dp = 2) => {
  const abs = Math.abs(v);
  if (abs >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(dp)}bn`;
  if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}m`;
  if (abs >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
  return `${v.toFixed(0)}`;
};
export const kes = (v: number, dp = 2) => `KES ${fmtKES(v, dp)}`;
export const pct = (v: number, dp = 1) => `${v.toFixed(dp)}%`;
export const num = (v: number) => v.toLocaleString("en-US");
