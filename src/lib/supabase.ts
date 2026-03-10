import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Cliente público — para lecturas y Server Actions con RLS
export const supabase = createClient(supabaseUrl, supabasePublicKey);

// Cliente de servicio — bypasea RLS, solo usar en Server Actions/API routes
// Será funcional solo si SUPABASE_SERVICE_ROLE_KEY está configurada
export const supabaseAdmin = supabaseServiceKey && !supabaseServiceKey.startsWith("TU_")
  ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })
  : supabase; // fallback al cliente público si no hay service key

