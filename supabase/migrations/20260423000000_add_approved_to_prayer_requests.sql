ALTER TABLE public.prayer_requests
ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_prayer_requests_public_approved
ON public.prayer_requests (is_public, approved, created_at DESC);
