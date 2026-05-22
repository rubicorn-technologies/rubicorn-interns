ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_applications_deleted_at ON public.applications(deleted_at);

UPDATE public.domains
SET price_inr = CASE slug
  WHEN 'web-dev' THEN 1499
  WHEN 'python' THEN 3499
  WHEN 'ai-engineer' THEN 9999
  WHEN 'prompt-engineer' THEN 6999
  WHEN 'data-science' THEN 3999
  WHEN 'cybersecurity' THEN 1499
  ELSE price_inr
END
WHERE slug IN (
  'web-dev',
  'python',
  'ai-engineer',
  'prompt-engineer',
  'data-science',
  'cybersecurity'
);
