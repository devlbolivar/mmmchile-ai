# Clasificación y asignación de nuevas vidas

Cada ficha nueva o editada requiere Grupo (Joven/Adulto) y Sexo (Masculino/Femenino).
La selección es manual: no se deduce del nombre ni se impone una edad de corte.
El motivo sigue siendo Nuevo creyente o Creyente.

El supervisor configura un equipo por integrante: jóvenes varones, jóvenes mujeres,
adultos varones o adultas mujeres. Puede configurar su propio equipo sin cambiar su
rol ni desactivar su cuenta. Un integrante sin equipo no recibe nuevas asignaciones.
Las invitaciones conservan el equipo seleccionado al aceptar el acceso.

Solo el supervisor asigna responsables activos con una categoría coincidente.
Sin coincidencias, se permite guardar sin responsable. La base de datos valida
esta regla también para llamadas RPC directas y cambios concurrentes de equipo.
Cambiar el equipo de un integrante libera sus fichas clasificadas incompatibles,
con aviso previo y cantidad de fichas liberadas al guardar. Desactivarlo libera todas.

Los registros existentes conservan datos, responsable e historial al migrar.
Se muestran como Pendiente de clasificación y se encuentran en Sin clasificar.
Al editarlos se exige completar ambos campos y confirmar una asignación compatible.
Un visitador no puede cambiar al responsable: si la clasificación resulta incompatible,
el supervisor debe ajustar la ficha. La visibilidad y autoría de las visitas se conservan.

## Activación coordinada

Migración: `20260906212656_classify_followup_assignments.sql`.
La migración y el código están preparados para revisión; no se aplican automáticamente
por desplegar Next.js. No ejecutar las migraciones iniciales nuevamente.

1. Probar el SQL y esta rama juntos en una base de pruebas con el esquema existente.
2. Coordinar la aplicación de esta migración y el despliegue de esta rama a `master`.
   Durante ese cambio, evitar guardar fichas desde la versión anterior: su payload
   no contiene Grupo y Sexo y será rechazado por la validación nueva.
3. Verificar el despliegue y recargar cualquier pestaña anterior de seguimiento.
4. Configurar los equipos desde Equipo; después clasificar las fichas existentes.
5. Comprobar una asignación compatible, una incompatible, una ficha sin responsable
   y la conservación del historial con cuentas autorizadas.

Revertir solo el frontend no es suficiente: la nueva validación SQL exige clasificación.
Si fuese necesario volver atrás, restaurar específicamente la implementación anterior
de `ac_private.ac_save_person` y luego el despliegue; conservar columnas y datos nuevos.

## Verificación local

`npm run test:seguimiento` ejecuta las pruebas de reglas con PostgreSQL embebido,
compatibilidad de los cuatro equipos, conservación de registros anteriores,
invitaciones, permisos, desactivación, formularios, teléfonos y redirects.
Las pruebas usan exclusivamente datos ficticios; no envían correos.
