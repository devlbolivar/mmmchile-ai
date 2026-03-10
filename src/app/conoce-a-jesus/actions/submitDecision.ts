"use server";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { sendDecisionNotification, sendDecisionConfirmation } from "@/lib/resend";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit } from "@/lib/rate-limit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const decisionSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    city: z.string().optional(),
    contact: z.string().optional(),
    wants_contact: z.boolean(),
    next_step: z.enum(['iglesia', 'lectura', 'hablar', 'info', '']).optional(),
});

export async function submitDecision(formData: {
    nombre: string;
    ciudad: string;
    contacto: string;
    siguiente: string;
    quiereContacto: boolean;
    turnstileToken: string;
}) {
    const rateLimitConfig = { endpoint: "submitDecision", maxRequests: 3, windowMinutes: 60 };
    const rateLimitCheck = await checkRateLimit(rateLimitConfig);
    if (!rateLimitCheck.success) {
        return { success: false, error: rateLimitCheck.error };
    }

    const data = {
        name: formData.nombre,
        city: formData.ciudad,
        contact: formData.contacto,
        wants_contact: formData.quiereContacto,
        next_step: formData.siguiente,
    };

    const validatedFields = decisionSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            error: "Hay errores en el formulario.",
            success: false,
        };
    }

    const isValidToken = await verifyTurnstileToken(formData.turnstileToken);
    if (!isValidToken) {
        return {
            error: "Verificación de seguridad fallida. Por favor, intenta de nuevo.",
            success: false,
        };
    }

    try {
        const { error } = await supabase
            .from("gospel_decisions")
            .insert([{
                name: validatedFields.data.name,
                city: validatedFields.data.city,
                contact: validatedFields.data.contact,
                wants_contact: validatedFields.data.wants_contact,
                next_step: validatedFields.data.next_step,
            }]);

        if (error) {
            console.error("Supabase Error:", error);
            return { error: "Ocurrió un error al guardar tu decisión. Inténtalo más tarde.", success: false };
        }

        // 1. Notify the church team about the new decision
        await sendDecisionNotification({
            nombre: validatedFields.data.name,
            ciudad: validatedFields.data.city,
            contacto: validatedFields.data.contact,
            siguiente: validatedFields.data.next_step,
            quiereContacto: validatedFields.data.wants_contact
        });

        // 2. If the user provided a valid email and wants contact, send a welcome confirmation to them
        if (validatedFields.data.wants_contact && validatedFields.data.contact) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(validatedFields.data.contact)) {
                await sendDecisionConfirmation(validatedFields.data.contact, validatedFields.data.name);
            }
        }

        return { success: true };
    } catch (err) {
        console.error("Server Error:", err);
        return { error: "Ocurrió un error inesperado.", success: false };
    }
}
