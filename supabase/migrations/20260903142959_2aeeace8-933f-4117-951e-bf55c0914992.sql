CREATE TABLE public.assets (
  id text PRIMARY KEY,
  name text NOT NULL,
  portfolio text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  geography text NOT NULL DEFAULT '',
  asset_class text NOT NULL DEFAULT '',
  ownership text NOT NULL DEFAULT '',
  lifecycle text NOT NULL DEFAULT 'OPPORTUNITY',
  strategy text NOT NULL DEFAULT 'HOLD',
  acquisition_value numeric NOT NULL DEFAULT 0,
  current_value numeric NOT NULL DEFAULT 0,
  previous_value numeric NOT NULL DEFAULT 0,
  invested_capital numeric NOT NULL DEFAULT 0,
  debt numeric NOT NULL DEFAULT 0,
  revenue numeric NOT NULL DEFAULT 0,
  opex numeric NOT NULL DEFAULT 0,
  occupancy numeric NOT NULL DEFAULT 0,
  projected_irr numeric NOT NULL DEFAULT 0,
  roi numeric NOT NULL DEFAULT 0,
  risk text NOT NULL DEFAULT 'MODERATE',
  development_status text NOT NULL DEFAULT '',
  planning_status text NOT NULL DEFAULT '',
  current_use text NOT NULL DEFAULT '',
  development_rights text NOT NULL DEFAULT '',
  land_area numeric NOT NULL DEFAULT 0,
  gfa numeric NOT NULL DEFAULT 0,
  nfa numeric NOT NULL DEFAULT 0,
  buildings integer NOT NULL DEFAULT 0,
  units integer NOT NULL DEFAULT 0,
  residential_area numeric NOT NULL DEFAULT 0,
  commercial_area numeric NOT NULL DEFAULT 0,
  parking integer NOT NULL DEFAULT 0,
  potential_gfa numeric NOT NULL DEFAULT 0,
  projects jsonb NOT NULL DEFAULT '[]'::jsonb,
  economics jsonb NOT NULL DEFAULT '{}'::jsonb,
  scenarios jsonb NOT NULL DEFAULT '[]'::jsonb,
  strategy_options jsonb NOT NULL DEFAULT '[]'::jsonb,
  cashflow jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommendation jsonb NOT NULL DEFAULT '{}'::jsonb,
  documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  decisions jsonb NOT NULL DEFAULT '[]'::jsonb,
  coords jsonb NOT NULL DEFAULT '{"x":50,"y":50}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO authenticated;
GRANT ALL ON public.assets TO service_role;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assets public read" ON public.assets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "assets authenticated write" ON public.assets FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.acquisitions (
  id text PRIMARY KEY,
  name text NOT NULL,
  location text NOT NULL DEFAULT '',
  stage text NOT NULL DEFAULT 'Identified',
  asking_price numeric NOT NULL DEFAULT 0,
  estimated_value numeric NOT NULL DEFAULT 0,
  acquisition_cost numeric NOT NULL DEFAULT 0,
  land_area numeric NOT NULL DEFAULT 0,
  potential_gfa numeric NOT NULL DEFAULT 0,
  planning text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  market text NOT NULL DEFAULT '',
  projected_development text NOT NULL DEFAULT '',
  projected_return numeric NOT NULL DEFAULT 0,
  risks text NOT NULL DEFAULT '',
  recommendation text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.acquisitions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.acquisitions TO authenticated;
GRANT ALL ON public.acquisitions TO service_role;
ALTER TABLE public.acquisitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "acquisitions public read" ON public.acquisitions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "acquisitions authenticated write" ON public.acquisitions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.disposals (
  id text PRIMARY KEY,
  asset_id text REFERENCES public.assets(id) ON DELETE CASCADE,
  name text NOT NULL,
  stage text NOT NULL DEFAULT 'Identified',
  current_value numeric NOT NULL DEFAULT 0,
  target_price numeric NOT NULL DEFAULT 0,
  offer numeric NOT NULL DEFAULT 0,
  debt numeric NOT NULL DEFAULT 0,
  transaction_costs numeric NOT NULL DEFAULT 0,
  exit_irr numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.disposals TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.disposals TO authenticated;
GRANT ALL ON public.disposals TO service_role;
ALTER TABLE public.disposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "disposals public read" ON public.disposals FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "disposals authenticated write" ON public.disposals FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.risks (
  id text PRIMARY KEY,
  asset_id text REFERENCES public.assets(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT '',
  evidence text NOT NULL DEFAULT '',
  impact numeric NOT NULL DEFAULT 0,
  mitigation text NOT NULL DEFAULT '',
  owner text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'OPEN',
  severity text NOT NULL DEFAULT 'MODERATE',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.risks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.risks TO authenticated;
GRANT ALL ON public.risks TO service_role;
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "risks public read" ON public.risks FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "risks authenticated write" ON public.risks FOR ALL TO authenticated USING (true) WITH CHECK (true);