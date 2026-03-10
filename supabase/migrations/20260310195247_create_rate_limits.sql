-- Create rate limits table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_endpoint_created_at 
ON public.rate_limits (ip_address, endpoint, created_at);

-- Row Level Security
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow insert and select to anon and authenticated roles
CREATE POLICY "Allow anon and auth to insert rate limits"
ON public.rate_limits
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow anon and auth to read rate limits"
ON public.rate_limits
FOR SELECT
TO anon, authenticated
USING (true);

-- Function to prune old records (older than 24 hours)
CREATE OR REPLACE FUNCTION prune_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.rate_limits
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;
