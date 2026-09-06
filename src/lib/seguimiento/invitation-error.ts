export function invitationError(error: {code?: string; status?: number}): string {
 const pending='La invitación quedó pendiente. ';
 switch(error.code){
  case 'email_address_not_authorized': return pending+'El servicio de correo de Supabase no permite enviar a este destinatario. Configura un proveedor SMTP para invitar al equipo.';
  case 'over_email_send_rate_limit':
  case 'over_request_rate_limit': return pending+'Se alcanzó el límite de envíos. Espera unos minutos antes de reintentar.';
  case 'email_exists':
  case 'user_already_exists': return pending+'Este correo ya tiene una cuenta. La persona puede entrar con su contraseña o recuperarla desde el acceso.';
  case 'email_address_invalid': return pending+'Supabase rechazó la dirección de correo. Revisa que sea una dirección válida.';
  case 'not_admin':
  case 'bad_jwt':
  case 'no_authorization': return pending+'El servidor no tiene permisos para enviar invitaciones. Revisa la clave administrativa de Supabase en Vercel.';
  default:
   if(error.status===429)return pending+'Se alcanzó el límite de envíos. Espera unos minutos antes de reintentar.';
   if(error.status===401||error.status===403)return pending+'El servidor no tiene permisos para enviar invitaciones. Revisa la configuración de Supabase en Vercel.';
   return pending+'El servicio no pudo enviar el correo. Revisa los registros de Auth y la configuración SMTP en Supabase antes de reintentar.';
 }
}
