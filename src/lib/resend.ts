import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface PrayerEmailData {
  name: string;
  request: string;
  contact?: string | null;
  wantContact: boolean;
  isPublic: boolean;
}

export async function sendPrayerNotification(data: PrayerEmailData) {
  try {
    const { name, request, contact, wantContact, isPublic } = data;

    const { error } = await resend.emails.send({
      from: "MMM Chile <oracion@mmmchile.cl>",
      to: [process.env.PRAYER_NOTIFICATION_EMAIL || "intercesion@mmmchile.cl"],
      subject: `Nueva petición de oración — ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #FDF8F0; border-radius: 16px;">
          <div style="background: #1E3A5F; color: white; padding: 20px 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 600;">🙏 Nueva Petición de Oración</h1>
          </div>
          <div style="background: white; padding: 24px; border: 1px solid #E8E2D8; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="margin: 0 0 6px; font-size: 13px; color: #7A7574; font-weight: 600;">NOMBRE</p>
            <p style="margin: 0 0 20px; font-size: 16px; color: #2C2C2C;">${name}</p>

            <p style="margin: 0 0 6px; font-size: 13px; color: #7A7574; font-weight: 600;">PETICIÓN</p>
            <p style="margin: 0 0 20px; font-size: 15px; color: #2C2C2C; line-height: 1.7; white-space: pre-wrap;">${request}</p>

            ${contact ? `
              <p style="margin: 0 0 6px; font-size: 13px; color: #7A7574; font-weight: 600;">CONTACTO</p>
              <p style="margin: 0 0 20px; font-size: 15px; color: #2C2C2C;">${contact}</p>
            ` : ""}

            <div style="display: flex; gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #E8E2D8;">
              <span style="font-size: 12px; padding: 4px 10px; border-radius: 6px; background: ${isPublic ? "#E8F5E9" : "#FFF3E0"}; color: ${isPublic ? "#2E7D32" : "#E65100"};">
                ${isPublic ? "✅ Publicada en muro" : "🔒 Privada"}
              </span>
              ${wantContact ? `<span style="font-size: 12px; padding: 4px 10px; border-radius: 6px; background: #E3F2FD; color: #1565C0;">📞 Quiere ser contactado</span>` : ""}
            </div>
          </div>

          <p style="font-size: 12px; color: #A8A09C; text-align: center; margin-top: 16px;">
            mmmchile.cl · Equipo de Intercesión
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend email error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to send prayer notification email:", err);
    return { success: false, error: "Failed to send notification email" };
  }
}

interface ContactEmailData {
  name: string;
  email?: string | null;
  whatsapp?: string | null;
  subject: string;
  message: string;
  sourcePage?: string | null;
}

export async function sendContactNotification(data: ContactEmailData) {
  try {
    const { name, email, whatsapp, subject, message, sourcePage } = data;

    const { error } = await resend.emails.send({
      from: "MMM Chile <oracion@mmmchile.cl>", // Note: Use the verified domain here. If only oracion@ is verified, stick with it or use a default one like no-reply
      to: ["secretariammmchile@gmail.com"],
      subject: `[MMM Chile Web] Nuevo mensaje: ${subject}`,
      html: `
        <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #FDF8F0; border-radius: 16px;">
          <div style="background: #1E3A5F; color: white; padding: 20px 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 600;">📩 Nuevo Mensaje de Contacto</h1>
          </div>
          <div style="background: white; padding: 24px; border: 1px solid #E8E2D8; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="margin: 0 0 6px; font-size: 13px; color: #7A7574; font-weight: 600;">NOMBRE</p>
            <p style="margin: 0 0 20px; font-size: 16px; color: #2C2C2C;">${name}</p>

            <p style="margin: 0 0 6px; font-size: 13px; color: #7A7574; font-weight: 600;">ASUNTO</p>
            <p style="margin: 0 0 20px; font-size: 16px; color: #2C2C2C;">${subject}</p>

            <p style="margin: 0 0 6px; font-size: 13px; color: #7A7574; font-weight: 600;">MENSAJE</p>
            <p style="margin: 0 0 20px; font-size: 15px; color: #2C2C2C; line-height: 1.7; white-space: pre-wrap;">${message}</p>

            ${email ? `
              <p style="margin: 0 0 6px; font-size: 13px; color: #7A7574; font-weight: 600;">EMAIL</p>
              <p style="margin: 0 0 20px; font-size: 15px; color: #2C2C2C;">${email}</p>
            ` : ""}

            ${whatsapp ? `
              <p style="margin: 0 0 6px; font-size: 13px; color: #7A7574; font-weight: 600;">WHATSAPP</p>
              <p style="margin: 0 0 20px; font-size: 15px; color: #2C2C2C;">${whatsapp}</p>
            ` : ""}
            
            ${sourcePage ? `
              <p style="margin: 0 0 6px; font-size: 13px; color: #7A7574; font-weight: 600;">PÁGINA DE ORIGEN</p>
              <p style="margin: 0 0 20px; font-size: 15px; color: #2C2C2C;">${sourcePage}</p>
            ` : ""}
          </div>

          <p style="font-size: 12px; color: #A8A09C; text-align: center; margin-top: 16px;">
            mmmchile.cl · Formulario de Contacto
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend email error (Notification):", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to send contact notification email:", err);
    return { success: false, error: "Failed to send notification email" };
  }
}

export async function sendContactConfirmation(email: string, name: string) {
  try {
    const { error } = await resend.emails.send({
      from: "MMM Chile <oracion@mmmchile.cl>", // Update if needed
      to: [email],
      subject: "Hemos recibido tu mensaje — MMM Chile",
      html: `
        <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #FDF8F0; border-radius: 16px;">
          <div style="background: white; padding: 32px; border: 1px solid #E8E2D8; border-radius: 12px;">
            <h1 style="color: #1E3A5F; font-size: 24px; font-weight: 600; margin-top: 0;">Hola, ${name}</h1>
            <p style="color: #2C2C2C; font-size: 16px; line-height: 1.6;">
              Recibimos tu mensaje. Te responderemos pronto.
            </p>
            <p style="color: #2C2C2C; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
              Bendiciones,<br />
              <strong>Equipo MMM Chile</strong>
            </p>
          </div>
          <p style="font-size: 12px; color: #A8A09C; text-align: center; margin-top: 16px;">
            Este es un mensaje automático. Por favor, no respondas a este correo.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend email error (Confirmation):", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to send contact confirmation email:", err);
    return { success: false, error: "Failed to send confirmation email" };
  }
}

export interface DecisionEmailData {
  nombre: string;
  ciudad?: string | null;
  contacto?: string | null;
  siguiente?: string | null;
  quiereContacto: boolean;
}

export async function sendDecisionNotification(data: DecisionEmailData) {
  try {
    const { nombre, ciudad, contacto, siguiente, quiereContacto } = data;

    const { error } = await resend.emails.send({
      from: "MMM Chile <oracion@mmmchile.cl>", // Update if needed
      to: ["secretariammmchile@gmail.com"],
      subject: `🎉 Nueva Decisión de Fe: ${nombre}`,
      html: `
        <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #FDF8F0; border-radius: 16px;">
          <div style="background: #1E3A5F; color: white; padding: 20px 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 600;">🎉 ¡Nueva Decisión de Fe!</h1>
          </div>
          <div style="background: white; padding: 24px; border: 1px solid #E8E2D8; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="margin: 0 0 6px; font-size: 13px; color: #7A7574; font-weight: 600;">NOMBRE</p>
            <p style="margin: 0 0 20px; font-size: 16px; color: #2C2C2C;">${nombre}</p>

            ${ciudad ? `
              <p style="margin: 0 0 6px; font-size: 13px; color: #7A7574; font-weight: 600;">CIUDAD</p>
              <p style="margin: 0 0 20px; font-size: 15px; color: #2C2C2C;">${ciudad}</p>
            ` : ""}

            ${contacto ? `
              <p style="margin: 0 0 6px; font-size: 13px; color: #7A7574; font-weight: 600;">WHATSAPP/EMAIL</p>
              <p style="margin: 0 0 20px; font-size: 15px; color: #2C2C2C;">${contacto}</p>
            ` : ""}

            ${siguiente ? `
              <p style="margin: 0 0 6px; font-size: 13px; color: #7A7574; font-weight: 600;">PRÓXIMO PASO DESEADO</p>
              <p style="margin: 0 0 20px; font-size: 15px; color: #2C2C2C;">${siguiente === 'iglesia' ? 'Visitar una iglesia' : siguiente === 'lectura' ? 'Recibir un plan de lectura bíblica' : siguiente === 'hablar' ? 'Hablar con alguien' : siguiente === 'info' ? 'Solo información' : siguiente}</p>
            ` : ""}

            <div style="display: flex; gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #E8E2D8;">
              ${quiereContacto ? `<span style="font-size: 12px; padding: 4px 10px; border-radius: 6px; background: #E3F2FD; color: #1565C0;">📞 Quiere ser contactado</span>` : `<span style="font-size: 12px; padding: 4px 10px; border-radius: 6px; background: #FFF3E0; color: #E65100;">No quiere ser contactado</span>`}
            </div>
          </div>

          <p style="font-size: 12px; color: #A8A09C; text-align: center; margin-top: 16px;">
            mmmchile.cl · Nuevo Creyente
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend email error (Decision Notification):", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to send decision notification email:", err);
    return { success: false, error: "Failed to send notification email" };
  }
}

export async function sendDecisionConfirmation(email: string, nombre: string) {
  try {
    const { error } = await resend.emails.send({
      from: "MMM Chile <oracion@mmmchile.cl>", // Update if needed
      to: [email],
      subject: "¡El cielo celebra contigo!",
      html: `
        <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #FDF8F0; border-radius: 16px;">
          <div style="background: white; padding: 32px; border: 1px solid #E8E2D8; border-radius: 12px;">
            <h1 style="color: #1E3A5F; font-size: 24px; font-weight: 600; margin-top: 0;">¡Hola, ${nombre}!</h1>
            <p style="color: #2C2C2C; font-size: 16px; line-height: 1.6;">
              Nos llena de alegría saber que tomaste una decisión tan importante el día de hoy.
            </p>
            <p style="color: #2C2C2C; font-size: 16px; line-height: 1.6;">
              Como lo solicitaste, pronto nos pondremos en contacto contigo para acompañarte en tus primeros pasos de fe.
            </p>
            <p style="color: #2C2C2C; font-size: 16px; line-height: 1.6;">
              Si deseas comunicarte con nosotros de inmediato, puedes escribirnos a nuestro <strong><a href="https://wa.me/56975587223" style="color: #1E3A5F; text-decoration: underline;">WhatsApp oficial: +56 9 7558 7223</a></strong>.
            </p>
            <p style="color: #2C2C2C; font-size: 16px; line-height: 1.6;">
              Cualquier cosa que necesites, estamos aquí para ti.
            </p>
            <p style="color: #2C2C2C; font-size: 16px; line-height: 1.6; margin-bottom: 0; margin-top: 24px;">
              Un abrazo,<br />
              <strong>El equipo de MMM Chile</strong>
            </p>
          </div>
          <p style="font-size: 12px; color: #A8A09C; text-align: center; margin-top: 16px;">
            Este es un mensaje automático generado para nuevos creyentes.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend email error (Decision Confirmation):", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to send decision confirmation email:", err);
    return { success: false, error: "Failed to send confirmation email" };
  }
}
