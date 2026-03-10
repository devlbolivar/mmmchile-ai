"use server";

import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { sendContactNotification, sendContactConfirmation } from "@/lib/resend";

const contactSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Correo electrónico inválido").or(z.literal("")).nullable().optional(),
    whatsapp: z.string().nullable().optional(),
    subject: z.enum([
        "informacion-general",
        "quiero-visitar",
        "necesito-oracion",
        "quiero-servir",
        "consulta-pastoral",
        "otro"
    ], { message: "Debes seleccionar un asunto" }),
    message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
    source_page: z.string().nullable().optional(),
});

export async function submitContact(formData: FormData) {
    try {
        const rawData = {
            name: formData.get("name")?.toString() || "",
            email: formData.get("email")?.toString() || "",
            whatsapp: formData.get("whatsapp")?.toString() || "",
            subject: formData.get("subject")?.toString() || "",
            message: formData.get("message")?.toString() || "",
            source_page: formData.get("source_page")?.toString() || "",
        };

        const validationResult = contactSchema.safeParse(rawData);
        if (!validationResult.success) {
            return { success: false, error: validationResult.error.issues[0].message };
        }

        const validatedData = validationResult.data;

        // Enforce email format strictly if present
        const validEmail = validatedData.email?.trim() ? validatedData.email.trim() : null;

        const { error } = await supabase.from("contact_messages").insert({
            name: validatedData.name.trim(),
            email: validEmail,
            whatsapp: validatedData.whatsapp?.trim() || null,
            subject: validatedData.subject,
            message: validatedData.message.trim(),
            source_page: validatedData.source_page?.trim() || null,
            status: "new",
        });

        if (error) {
            console.error("Error inserting contact message to Supabase:", error);
            return { success: false, error: "Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo." };
        }

        // Send email notifications asynchronously mode (fire-and-forget) to not block the response response
        const notificationData = {
            name: validatedData.name.trim(),
            email: validEmail,
            whatsapp: validatedData.whatsapp?.trim() || null,
            subject: validatedData.subject,
            message: validatedData.message.trim(),
            sourcePage: validatedData.source_page?.trim() || null,
        };

        sendContactNotification(notificationData).catch(err =>
            console.error("Staff notification email failed:", err)
        );

        if (validEmail) {
            sendContactConfirmation(validEmail, validatedData.name.trim()).catch(err =>
                console.error("User confirmation email failed:", err)
            );
        }

        return { success: true };
    } catch (err) {
        console.error("Unexpected error submitting contact message:", err);
        return { success: false, error: "Ocurrió un error inesperado al procesar tu solicitud." };
    }
}
