"use server";

import { requirePrayerAdmin } from "@/lib/supabase/prayer-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function approvePrayer(id: string) {
  await requirePrayerAdmin();

  const { error } = await supabaseAdmin
    .from("prayer_requests")
    .update({ approved: true })
    .eq("id", id);

  if (error) {
    return { success: false, error: "No se pudo aprobar la petición." };
  }

  revalidatePath("/admin/oraciones");
  revalidatePath("/oracion");
  return { success: true };
}

export async function rejectPrayer(id: string) {
  await requirePrayerAdmin();

  const { error } = await supabaseAdmin
    .from("prayer_requests")
    .update({ is_public: false })
    .eq("id", id);

  if (error) {
    return { success: false, error: "No se pudo rechazar la petición." };
  }

  revalidatePath("/admin/oraciones");
  revalidatePath("/oracion");
  return { success: true };
}

export async function logout() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
