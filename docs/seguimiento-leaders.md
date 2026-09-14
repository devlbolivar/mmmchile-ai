# Líderes de grupo en Seguimiento

## Permisos
- Supervisor: todas las fichas y visitas; configura cuentas, roles, grupos y categorías.
- Líder: fichas e historial completo de su grupo actual; asigna y reasigna responsables compatibles.
- Visitador: fichas creadas por él o asignadas a él; únicamente sus propias visitas.
- Los tres roles pueden registrar fichas. Una ficha creada por un líder para otro grupo queda sin responsable y no aparece en su listado.
- Solo el supervisor puede cambiar Grupo y Sexo de fichas existentes. Las anteriores sin clasificación deben ser completadas por él.
- El líder puede registrar visitas en su grupo. Para recibir asignaciones personales necesita una categoría compatible dentro del grupo que dirige.
- Cambiar el grupo de una ficha mueve el acceso de los líderes al historial completo de esa ficha. Se conserva la autoría y el visitador sigue viendo sus propias visitas.
- Cambiar el grupo o desactivar a un líder actualiza sus permisos inmediatamente y libera asignaciones incompatibles.

## Grupos
| Grupo de liderazgo | Categorías de visita |
| --- | --- |
| Jóvenes | Joven masculino y joven femenino |
| Hombres adultos | Adulto masculino |
| Mujeres adultas | Adulto femenino |

El grupo de liderazgo es obligatorio para el rol líder. La categoría como visitador es opcional y se configura aparte.
No se convierten miembros existentes ni se infiere su categoría. Las invitaciones nuevas conservan rol, grupo y categoría al aceptarse.

## Activación
1. Verificar el check Seguimiento (PGlite, TypeScript y ESLint) y el build de Vercel.
2. Aplicar la migración `20260914143213_add_followup_group_leaders.sql` antes de desplegar este código.
3. Desplegar la rama y recargar las pestañas abiertas. No designar líderes hasta que el nuevo frontend esté activo.
4. En Equipo, editar o invitar un integrante con rol Líder de grupo y seleccionar el grupo que dirige.
5. Probar con cuentas autorizadas: jóvenes de ambos sexos, asignación incompatible, acceso de otro grupo y visibilidad global del supervisor.

La migración está preparada, no aplicada por el mero despliegue de Next.js. No modifica SMTP ni plantillas de correo.
Los endpoints anteriores se conservan con las mismas validaciones; no permiten eludir el grupo obligatorio.
El cambio de clasificación queda bloqueado para visitadores desde que se aplica la migración.
Antes de revertir solo el frontend, devolver los líderes a roles compatibles mediante un supervisor; la versión anterior no representa el nuevo rol.

## Pruebas
`npm run test:seguimiento` aplica las migraciones a PostgreSQL embebido con usuarios ficticios.
Cubre grupos, RLS, límites de asignación, intentos de autoescalado, invitaciones, desactivación,
reclasificación, historial propio y regresiones de los roles anteriores. No envía correos ni toca producción.
El workflow de GitHub ejecuta las pruebas, TypeScript y ESLint; Vercel compila el frontend.
