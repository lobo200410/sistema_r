# Scripts SQL Normalizados - Sistema de Recursos Educativos

## Orden de Ejecución

Ejecuta los scripts en este orden exacto:

1. **01-create-database.sql** - Crea la base de datos
2. **02-create-users-table.sql** - Tabla de usuarios (mejorada)
3. **03-create-roles-system.sql** - Sistema de roles y permisos
4. **04-create-normalized-tables.sql** - Tablas normalizadas (plataformas, facultades, ciclos, tipos)
5. **05-create-resources-table.sql** - Tabla de recursos (normalizada con FKs)
6. **06-create-sessions-table.sql** - Tabla de sesiones
7. **07-create-audit-table.sql** - Tablas de auditoría
8. **08-create-views.sql** - Vistas actualizadas
9. **09-seed-data.sql** - Datos iniciales (incluye superadmin para rene.cruz)
10. **10-procedures.sql** - Procedimientos almacenados actualizados
11. **11-verify-installation.sql** - Verificación de la instalación

## Mejoras Implementadas

### 1. Normalización
- ✅ Plataformas en tabla separada
- ✅ Facultades en tabla separada
- ✅ Ciclos académicos en tabla separada
- ✅ Tipos de recursos en tabla separada
- ✅ Foreign keys en tabla resources

### 2. Sistema de Roles y Permisos
- ✅ Tabla de roles (superadmin, admin, coordinador, docente, revisor, estudiante)
- ✅ Tabla de permisos granulares
- ✅ Relación muchos a muchos roles-permisos
- ✅ Relación muchos a muchos usuarios-roles
- ✅ **rene.cruz asignado como superadmin**

### 3. Auditoría y Trazabilidad
- ✅ Tabla audit_logs para registrar todas las acciones
- ✅ Tabla resource_history para historial de cambios
- ✅ Procedimiento para registrar auditoría

### 4. Campos Profesionales
- ✅ Soft deletes (deleted_at)
- ✅ Timestamps (created_at, updated_at)
- ✅ Métricas (views_count, downloads_count)
- ✅ Estados de recursos (borrador, en_revision, aprobado, publicado)
- ✅ Campos de activación (is_active)

### 5. Índices Optimizados
- ✅ Índices en foreign keys
- ✅ Índices en campos de búsqueda frecuente
- ✅ Índices en campos de filtrado

### 6. Vistas Actualizadas
- ✅ Todas las vistas usan JOINs con tablas normalizadas
- ✅ Incluyen métricas adicionales (vistas, descargas)
- ✅ Nueva vista de actividad de usuarios

## Roles Predeterminados

1. **superadmin** - Control total (asignado a rene.cruz)
2. **admin** - Gestión general
3. **coordinador** - Gestión por facultad
4. **docente** - Crear y gestionar recursos propios
5. **revisor** - Aprobar/rechazar recursos
6. **estudiante** - Solo visualización

## Datos Iniciales

### Plataformas
- Genially, Canva, Lumi, Flickbook, PowerPoint, Google Slides, Prezi

### Facultades
- FICA, FCE, FD, FI, FCS

### Ciclos
- 01-2024, 02-2024, 01-2025 (activo), 02-2025

### Tipos de Recursos
- Presentación, Material Interactivo, Documento, Video, Infografía, Evaluación, Guía

## Verificación

Después de ejecutar todos los scripts, ejecuta:

\`\`\`sql
USE recursos_educativos;
SOURCE 11-verify-installation.sql;
\`\`\`

Esto mostrará:
- Todas las tablas creadas
- Estructura de tablas principales
- Conteo de registros
- Confirmación de que rene.cruz es superadmin
- Estadísticas generales

## Próximos Pasos

Después de ejecutar estos scripts:

1. Actualizar el código de la aplicación para usar las tablas normalizadas
2. Implementar el panel de administración
3. Implementar el sistema de roles en el frontend
4. Migrar datos existentes (si los hay)

## Notas Importantes

- ⚠️ Estos scripts eliminan y recrean la base de datos
- ⚠️ Respalda tus datos antes de ejecutar
- ⚠️ Las contraseñas en seed-data son de ejemplo, cámbialas en producción
- ✅ rene.cruz@utec.edu.sv tiene acceso de superadmin por defecto
