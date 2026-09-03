DROP POLICY "assets seed insert" ON public.assets;
REVOKE INSERT ON public.assets FROM anon;
DROP POLICY "acquisitions seed insert" ON public.acquisitions;
REVOKE INSERT ON public.acquisitions FROM anon;
DROP POLICY "disposals seed insert" ON public.disposals;
REVOKE INSERT ON public.disposals FROM anon;
DROP POLICY "risks seed insert" ON public.risks;
REVOKE INSERT ON public.risks FROM anon;