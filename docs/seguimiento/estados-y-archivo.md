# Estados de seguimiento y archivo

La interfaz ofrece Pendiente de contacto, Esperando respuesta, Visita aceptada,
En seguimiento, Finalizado y Archivado. El valor histórico `Pendiente` se conserva
en la base de datos y solo cambia su etiqueta visible.

Archivar requiere un motivo y cancela la fecha de próximo contacto. No elimina
la ficha ni sus visitas. Los archivados no aparecen en la lista habitual ni en
los contadores de seguimientos abiertos; se consultan con Estado = Archivado.
Para restaurar una ficha, abrir Editar ficha y seleccionar un estado distinto.
Si solicitó no ser contactada, hay que confirmar la nueva autorización de contacto.
Los permisos existentes de supervisor, líder y visitador se conservan.

## Publicación

1. Aplicar `supabase/migrations/20261117220000_followup_lifecycle.sql` antes de desplegar
   la interfaz. Es transaccional: añade una columna, amplía una restricción y
   actualiza las funciones existentes. No elimina filas ni reclasifica registros.
2. Desplegar el código del PR.
3. Validar con una ficha de prueba en un entorno de prueba: nuevos estados,
   archivo con motivo, filtro Archivado, bloqueo de visitas y restauración.
   Comprobar la advertencia y confirmación para el motivo No contactar.

La migración se validó con PGlite incluyendo conservación de los registros previos,
bloqueo de visitas archivadas y rechazo de restauraciones sin permisos.
No se ha aplicado desde esta implementación a la base de datos de producción.
No revertir la restricción a los tres estados antiguos si ya se han utilizado
los nuevos estados; mantener la ampliación de esquema en un rollback de interfaz.
