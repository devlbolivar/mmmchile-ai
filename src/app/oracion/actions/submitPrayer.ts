"use server";

import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { sendPrayerNotification } from "@/lib/resend";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit } from "@/lib/rate-limit";

const prayerSchema = z.object({
  nombre: z.string().nullable().optional(),
  peticion: z.string().min(1, "La petición es obligatoria"),
  contacto: z.string().nullable().optional(),
  showWall: z.boolean().default(false),
  wantContact: z.boolean().default(false),
});

export async function submitPrayer(formData: FormData) {
  try {
    const rateLimitConfig = { endpoint: "submitPrayer", maxRequests: 5, windowMinutes: 60 };
    const rateLimitCheck = await checkRateLimit(rateLimitConfig);
    if (!rateLimitCheck.success) {
        return { success: false, error: rateLimitCheck.error };
    }

    const rawData = {
      nombre: formData.get("nombre")?.toString() || "",
      peticion: formData.get("peticion")?.toString() || "",
      contacto: formData.get("contacto")?.toString() || "",
      showWall: formData.get("showWall") === "true" || formData.get("showWall") === "on" || formData.get("showWall") === "1",
      wantContact: formData.get("wantContact") === "true" || formData.get("wantContact") === "on" || formData.get("wantContact") === "1",
      turnstileToken: formData.get("turnstileToken")?.toString() || "",
    };

    const validationResult = prayerSchema.safeParse(rawData);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0].message };
    }

    const isValidToken = await verifyTurnstileToken(rawData.turnstileToken);
    if (!isValidToken) {
      return { success: false, error: "Verificación de seguridad fallida. Por favor, intenta de nuevo." };
    }

    const validatedData = validationResult.data;

    const isAnonymous = !validatedData.nombre || validatedData.nombre.trim() === "";

    const { error } = await supabase.from("prayer_requests").insert({
      name: validatedData.nombre?.trim() || "Anónimo",
      request: validatedData.peticion.trim(),
      contact: validatedData.contacto?.trim() || null,
      is_public: validatedData.showWall,
      is_anonymous: isAnonymous,
      status: validatedData.wantContact ? "needs_contact" : "pending",
    });

    if (error) {
      console.error("Error inserting prayer request to Supabase:", error);
      return { success: false, error: "Hubo un error al enviar tu petición. Por favor, intenta de nuevo." };
    }

    // Send email notification (fire-and-forget — don't block the user)
    sendPrayerNotification({
      name: validatedData.nombre?.trim() || "Anónimo",
      request: validatedData.peticion.trim(),
      contact: validatedData.contacto?.trim() || null,
      wantContact: validatedData.wantContact,
      isPublic: validatedData.showWall,
    }).catch((err) => console.error("Email notification failed:", err));

    if (validatedData.showWall) {
      revalidatePath("/oracion");
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error submitting prayer request:", err);
    return { success: false, error: "Ocurrió un error inesperado." };
  }
}

