ALTER TABLE public.prayer_requests
ADD COLUMN IF NOT EXISTS pray_count INTEGER NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION increment_pray_count(prayer_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.prayer_requests
  SET pray_count = pray_count + 1
  WHERE id = prayer_id;
$$;
