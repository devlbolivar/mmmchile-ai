"use server";

import { supabaseAdmin } from "@/lib/supabase";

export async function incrementPrayCount(id: string) {
  const { error } = await supabaseAdmin.rpc("increment_pray_count", { prayer_id: id });
  if (error) console.error("Error incrementing pray count:", error);
}
