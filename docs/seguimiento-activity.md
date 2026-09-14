# Bitácora de seguimiento

La pestaña **Actividad** es exclusiva del supervisor, protegida tanto por Server Action como por RLS. Líderes, visitadores, cuentas inactivas y usuarios anónimos no pueden consultar los eventos. Ningún rol de la aplicación puede insertar, editar, eliminar ni truncar la bitácora directamente.

Registra fichas creadas y editadas, cambios de responsable (incluidas liberaciones automáticas), visitas creadas, altas y cambios de permisos del equipo, preparación/aceptación/cancelación de invitaciones y resultados del envío. El envío aceptado por el proveedor no demuestra recepción ni lectura.

Los cambios de negocio generan eventos mediante triggers dentro de su transacción. Un cambio rechazado o revertido no deja un evento exitoso. Guardar una ficha sin cambios no genera ruido. Registrar una visita puede producir dos eventos: la visita y la actualización de estado/próximo contacto de la ficha.

## Accesos

El servidor verifica la identidad con Auth y registra el inicio una sola vez por usuario y sesión. También cubre la primera entrada al módulo después de una invitación o recuperación. Una sesión existente al activar la bitácora se registra en su primera entrada posterior, no con una fecha histórica inventada. La renovación del token conserva el identificador de sesión y no crea otro acceso.

El cierre solo se registra después de un cierre explícito exitoso. Cerrar el navegador, una sesión vencida o un fallo de autenticación no generan un cierre. No representa usuarios conectados.

El RPC de accesos y resultados de correo solo acepta la credencial de servidor existente para invitaciones. No recibe valores arbitrarios del navegador. Sus errores se capturan, sin datos personales ni credenciales en los logs técnicos; el envío al log tiene un timeout de 2,5 segundos. Si falla, la operación principal continúa y el evento podría faltar.

## Datos y consulta

Cada evento conserva fecha, identificador y nombre del actor, acción, identificador/nombre del registro y detalles mínimos. Las reasignaciones conservan los nombres anterior y nuevo. Las ediciones conservan los nombres de los campos modificados, sin sus valores. Los cambios de acceso conservan rol, estado y grupos. Las invitaciones se identifican por correo, su clave actual.

No se copian teléfonos, direcciones, observaciones pastorales, contraseñas, tokens, IP ni user-agent. El identificador interno de sesión se usa para deduplicar y no se devuelve a la interfaz. Los eventos generados desde SQL sin identidad de aplicación figuran como Sistema / administración BD; no identifican al operador del dashboard.

Fechas mostradas y filtradas en America/Santiago, con límites de día calculados en PostgreSQL para respetar cambios de horario. Páginas de 50 eventos con cursor compuesto fecha/UUID, filtros por rango de fechas, usuario y acción. Actualizar vuelve a la primera página. Sin reconstrucción de eventos anteriores a la migración.

## Activación

Aplicada en el proyecto de seguimiento el 14 de septiembre de 2026, con versión 20260914172225 registrada en el historial de Supabase. No volver a ejecutarla en ese proyecto. Los pasos siguientes sirven para otros entornos.

1. Ejecutar una sola vez `supabase/migrations/20260914172225_add_followup_activity.sql`, después de la migración de líderes.
2. Desplegar el código del PR. La migración es aditiva y compatible con el código anterior; los cambios de negocio empiezan a registrarse al aplicarla.
3. Entrar como supervisor y abrir Actividad. Un login o una operación real posterior aparecerá en la bitácora.
4. Confirmar que líderes y visitadores no muestran la pestaña.

La aplicación conserva el historial sin borrado automático en este MVP. No es almacenamiento inviolable frente a un administrador de PostgreSQL: quien administra la base mantiene sus permisos operativos.

## Verificación

`npm run test:seguimiento`, `npx tsc --noEmit` y el lint del workflow. Las pruebas usan PGlite y dobles de Auth, sin cuentas ni correos reales. Cubren roles, escritura falsificada, privacidad, rollback, reasignaciones automáticas, aceptación y envío de invitaciones, deduplicación, fechas/DST, paginación y tolerancia a fallos de acceso.

Para revertir la interfaz, restaurar el despliegue anterior; conservar la tabla y los eventos. Si un problema del trigger requiere detener la captura, deshabilitar específicamente los cuatro triggers ac_*_activity bajo control del administrador de BD, sin borrar historial.
