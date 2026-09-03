CREATE POLICY "assets seed insert" ON public.assets FOR INSERT TO anon WITH CHECK (true);
GRANT INSERT ON public.assets TO anon;
CREATE POLICY "acquisitions seed insert" ON public.acquisitions FOR INSERT TO anon WITH CHECK (true);
GRANT INSERT ON public.acquisitions TO anon;
CREATE POLICY "disposals seed insert" ON public.disposals FOR INSERT TO anon WITH CHECK (true);
GRANT INSERT ON public.disposals TO anon;
CREATE POLICY "risks seed insert" ON public.risks FOR INSERT TO anon WITH CHECK (true);
GRANT INSERT ON public.risks TO anon;