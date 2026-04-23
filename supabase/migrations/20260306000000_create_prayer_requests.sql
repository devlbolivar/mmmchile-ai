CREATE TABLE IF NOT EXISTS public.prayer_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Anónimo',
    request TEXT NOT NULL,
    contact TEXT,
    is_public BOOLEAN NOT NULL DEFAULT false,
    is_anonymous BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'needs_contact' | 'prayed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prayer_requests_is_public_created_at
ON public.prayer_requests (is_public, created_at DESC);

ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

-- Public read: only approved public prayers
CREATE POLICY "Public can read public prayers"
ON public.prayer_requests
FOR SELECT
TO anon, authenticated
USING (is_public = true);

-- Inserts go through the service role (Server Action) — no anon insert policy needed
