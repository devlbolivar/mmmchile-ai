"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";

// Kicks off Google OAuth sign-in; Supabase redirects the browser to Google,
// then back to /auth/callback to complete the session.
export async function signInWithGoogle() {
  const supabase = await createSessionClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/admin/login?error=auth");
  }

  redirect(data.url);
}
