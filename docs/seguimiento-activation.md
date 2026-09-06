# Activar Acompañar en mmmchile.cl/seguimiento

Esta integración vive en el Next.js existente y reutiliza sus clientes de Supabase, su sesión y su despliegue Vercel. El prototipo anterior de Sites se mantiene separado y no se despliega como parte de este cambio.

## Estado de entrega

- Código y pruebas preparados en la rama `codex/seguimiento-equipo`.
- Migración generada con Supabase CLI y probada en PostgreSQL embebido.
- La aplicación de la migración a producción fue rechazada por la revisión automática por requerir autorización explícita del alcance de seguridad. No se aplicó ni se intentó por otra vía.
- No se modificaron usuarios, datos ni permisos en Supabase remoto.
- No se cambiaron templates, registro público ni URLs globales de Supabase Auth.
- No se enviaron invitaciones ni se desplegó/mezcló esta rama en producción.

## Alcance SQL propuesto

`supabase/migrations/20260906003209_add_church_followup.sql` crea:

- Tablas `ac_members`, `ac_invitations`, `ac_people`, `ac_visits`, con RLS. Las tablas anteriores de hogares/visitas no se modifican ni se eliminan.
- Implementaciones con privilegios en `ac_private`, fuera del esquema de API público, con verificación de identidad y membresía. Los endpoints RPC públicos son SECURITY INVOKER y tienen concesiones explícitas; anon no puede ejecutarlos.
- Permiso separado para moderar oraciones: `ac_private.prayer_moderators` y RPC booleano `ac_can_moderate_prayers`. No otorga acceso de moderación a todos los usuarios autenticados ni a los visitadores.

`/admin/oraciones` consulta ese permiso antes de leer con la clave de servicio; aprobar y rechazar comprueban el mismo permiso. Esto debe activarse junto con el registro del moderador existente para conservar su acceso.

## Secuencia de activación

1. Obtener autorización para aplicar la migración al proyecto `mmmchile-ai` y configurar la cuenta existente del dueño como supervisor y moderador.
2. Aplicar la migración con su nombre registrado. Verificar tablas, funciones, concesiones y RLS con asesores de Supabase.
3. Mediante una operación administrativa autenticada y una búsqueda por el correo verificado del dueño, insertar su membresía `supervisor` y su permiso en `ac_private.prayer_moderators`. No escribir contraseñas ni modificar directamente `auth.users`. No promover a todos los usuarios ni al primero que se registre. No incluir emails personales ni UUIDs de usuarios en el repositorio público.
4. Verificar en Vercel las variables existentes `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (o la clave heredada `NEXT_PUBLIC_SUPABASE_ANON_KEY`) y `SUPABASE_SERVICE_ROLE_KEY` (o `SUPABASE_SECRET_KEY`). La clave de servicio solo se usa en el servidor para invitaciones y la moderación ya existente. No hay fallback a un cliente público para invitaciones.
5. Agregar `https://mmmchile.cl/seguimiento/auth/confirm` a los Redirect URLs permitidos de Supabase Auth sin quitar los existentes. Preservar el Site URL y las plantillas que usa `/admin`. El nuevo callback maneja la confirmación estándar por fragmento, token hash de invite/recovery y PKCE, y retira las credenciales de la barra de direcciones antes de usarlas.
6. Verificar SMTP: Supabase requiere un servicio de envío configurado para enviar a direcciones externas de producción. Puede aprovecharse el proveedor de correo existente de la iglesia. No invitar integrantes hasta que el envío y los redirects estén verificados.
7. Probar preview con un supervisor y dos visitadores: acceso, recuperación, fichas, asignación, autoría, historial, cambio de rol, desactivación y bloqueo de `/admin/oraciones` para visitadores. Usar datos ficticios y cuentas autorizadas. El build no sustituye esta verificación real.
8. Revisar los datos del prototipo D1 antes de migrarlos: conservar fechas y notas; mapear autoría y responsables a cuentas verificadas. No se ha hecho esa transferencia. Las tablas del proyecto anterior tampoco se leen desde esta integración.
9. Integrar la rama mediante PR y verificar despliegue en Vercel. Confirmar rama productiva real: GitHub usa `master` como rama predeterminada, aunque el README anterior menciona `main`.

`SEGUIMIENTO_APP_URL` es opcional para un origen distinto del dominio productivo. En preview, configurar ese origen explícitamente y autorizarlo en Supabase. No se confía en un `Host` recibido para construir enlaces de correo.

## Flujo

Ambos roles crean fichas. El supervisor asigna un usuario activo como responsable. El visitador puede registrar visitas a fichas creadas por él o asignadas a él. Solo puede leer visitas cuyo autor es su usuario. El servidor y la base de datos determinan el autor, no el formulario. Una reasignación conserva la autoría y el acceso al historial propio; no revela notas de otros integrantes.

Las invitaciones guardan el rol del lado administrativo. La membresía solo se activa cuando coincide el correo verificado de Supabase. Usuarios sin invitación no acceden al módulo, aunque ya exista un registro de Auth. No es necesario modificar el registro público de otras aplicaciones que compartan el proyecto.

Desactivar a un integrante conserva el historial y deja sus seguimientos sin asignación. Un supervisor no puede desactivarse ni cambiar su propio rol. La autorización se consulta en cada petición y no depende de user_metadata editable.

## Verificaciones

- `npm run test:seguimiento`: SQL real en PGlite con roles autenticado/anónimo, aislamiento de visitas, cambio de responsable, atribución forzada al usuario, denegación de autoescalado, invitaciones, desactivación y separación de la moderación.
- `npx tsc --noEmit`: tipos del proyecto.
- `npm run build`: compilación y generación de Next.js; depende del acceso a Sanity y fuentes de Google para páginas existentes.

Documentación consultada: https://supabase.com/docs/guides/auth/server-side/creating-a-client ; https://supabase.com/docs/reference/javascript/auth-admin-inviteuserbyemail ; https://supabase.com/docs/guides/database/postgres/row-level-security
