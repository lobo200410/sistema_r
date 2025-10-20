# Scripts MySQL para Sistema de Recursos Educativos

## Sistema de 3 Roles

Este sistema implementa 3 roles con permisos específicos:

1. **Superadmin** - Control total del sistema
   - Gestionar plataformas, facultades, ciclos, tipos de recursos
   - Crear usuarios masivamente
   - Asignar roles
   - Crear, editar y eliminar recursos

2. **Coordinador** - Permisos de edición
   - Crear recursos
   - Editar recursos
   - Eliminar recursos
   - Ver todos los recursos

3. **Docente** - Solo agregar recursos
   - Crear recursos
   - Ver todos los recursos
   - NO puede editar ni eliminar

## Orden de Ejecución en MySQL Workbench

Ejecuta los scripts en este orden:

1. **01-create-database.sql** - Crea la base de datos
2. **02-create-users-table.sql** - Tabla de usuarios con campos profesionales
3. **03-create-roles-system.sql** - Sistema de roles y permisos (3 roles)
4. **04-create-normalized-tables.sql** - Tablas normalizadas (plataformas, facultades, ciclos, tipos)
5. **05-create-resources-table.sql** - Tabla de recursos con foreign keys
6. **06-create-sessions-table.sql** - Tabla de sesiones
7. **07-create-audit-table.sql** - Tabla de auditoría
8. **08-create-views.sql** - Vistas para reportes
9. **09-seed-data.sql** - Datos de ejemplo y asignación de superadmin a rene.cruz
10. **10-procedures.sql** - Procedimientos almacenados

## Instrucciones para MySQL Workbench

### 1. Abrir MySQL Workbench
- Conecta a tu servidor MySQL local (XAMPP)
- Usuario por defecto: `root`
- Contraseña: (vacía o la que configuraste)

### 2. Ejecutar Scripts
Para cada archivo:
1. File → Open SQL Script
2. Selecciona el archivo .sql
3. Haz clic en el ícono del rayo ⚡ para ejecutar
4. Verifica que no haya errores en el panel de salida

### 3. Verificar Instalación
\`\`\`sql
USE recursos_educativos;
SHOW TABLES;
\`\`\`

Deberías ver:
- users
- roles
- permissions
- user_roles
- role_permissions
- platforms
- faculties
- academic_cycles
- resource_types
- resources
- sessions
- audit_logs
- Vistas de reportes

## Estructura de la Base de Datos Normalizada

### Tabla: users
- `id` - UUID único del usuario
- `username` - Nombre de usuario formato nombre.apellido (único)
- `email` - Correo electrónico (único)
- `password` - Contraseña hasheada
- `name` - Nombre completo
- `is_active` - Estado activo/inactivo
- `last_login_at` - Última fecha de login
- `email_verified_at` - Fecha de verificación de email
- `deleted_at` - Soft delete
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### Tabla: roles (3 roles)
- `id` - ID del rol
- `name` - Nombre del rol (superadmin, coordinador, docente)
- `description` - Descripción del rol
- `created_at` - Fecha de creación

### Tabla: platforms (Normalizada)
- `id` - ID de la plataforma
- `name` - Nombre (Genially, Canva, Lumi, etc.)
- `description` - Descripción
- `website_url` - URL del sitio web
- `logo_url` - URL del logo
- `is_active` - Activa/Inactiva
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### Tabla: faculties (Normalizada)
- `id` - ID de la facultad
- `name` - Nombre completo
- `code` - Código (FICA, FCE, FD, etc.)
- `description` - Descripción
- `is_active` - Activa/Inactiva
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### Tabla: academic_cycles (Normalizada)
- `id` - ID del ciclo
- `name` - Nombre (01-2025, 02-2025, etc.)
- `year` - Año
- `semester` - Semestre (1 o 2)
- `start_date` - Fecha de inicio
- `end_date` - Fecha de fin
- `is_active` - Activo/Inactivo
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### Tabla: resource_types (Normalizada)
- `id` - ID del tipo
- `name` - Nombre (Presentación, Material Interactivo, etc.)
- `description` - Descripción
- `icon` - Nombre del icono
- `is_active` - Activo/Inactivo
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### Tabla: resources (Con Foreign Keys)
- `id` - UUID único del recurso
- `user_id` - ID del usuario (FK)
- `titulo` - Nombre del recurso
- `url` - Enlace al recurso
- `asignatura` - Materia/asignatura
- `docente` - Nombre del docente
- `descripcion` - Descripción del recurso
- `platform_id` - ID de la plataforma (FK)
- `faculty_id` - ID de la facultad (FK)
- `cycle_id` - ID del ciclo (FK)
- `type_id` - ID del tipo (FK)
- `publicado` - Estado de publicación (true/false)
- `estado` - Estado (borrador, publicado, etc.)
- `views_count` - Contador de vistas
- `downloads_count` - Contador de descargas
- `deleted_at` - Soft delete
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### Tabla: audit_logs
- `id` - ID del log
- `user_id` - ID del usuario (FK)
- `action` - Acción realizada
- `table_name` - Tabla afectada
- `record_id` - ID del registro
- `old_values` - Valores anteriores (JSON)
- `new_values` - Valores nuevos (JSON)
- `ip_address` - Dirección IP
- `user_agent` - Navegador/dispositivo
- `created_at` - Fecha de creación

## Usuario Superadmin

El usuario **rene.cruz** tiene asignado automáticamente el rol de **superadmin** mediante el script 09-seed-data.sql.

Este usuario puede:
- Acceder al panel de administración (/admin)
- Gestionar plataformas, facultades, ciclos y tipos
- Crear usuarios masivamente mediante CSV
- Asignar roles a usuarios
- Control total del sistema

**Credenciales de acceso:**
- Username: `rene.cruz`
- Password: `Pass123!` (cambiar en producción)

## Configuración de Conexión

Después de ejecutar los scripts, configura la conexión en tu aplicación Next.js:

\`\`\`env
DATABASE_URL="mysql://root:@localhost:3306/recursos_educativos"
\`\`\`

O si tienes contraseña:
\`\`\`env
DATABASE_URL="mysql://root:tu_contraseña@localhost:3306/recursos_educativos"
\`\`\`

## Panel de Administración

El superadmin puede acceder a `/admin` para:

1. **Gestionar Plataformas** - Agregar/editar/eliminar plataformas educativas
2. **Gestionar Facultades** - Agregar/editar/eliminar facultades
3. **Gestionar Ciclos** - Agregar/editar/eliminar ciclos académicos
4. **Gestionar Tipos** - Agregar/editar/eliminar tipos de recursos
5. **Gestionar Usuarios** - Crear usuarios masivamente mediante CSV
6. **Asignar Roles** - Asignar roles (superadmin, coordinador, docente) a usuarios

## Creación Masiva de Usuarios

Formato CSV para carga masiva (username debe ser formato nombre.apellido):
\`\`\`
username,password,email,name
juan.perez,Pass123!,juan.perez@utec.edu.sv,Juan Pérez
maria.lopez,Pass456!,maria.lopez@utec.edu.sv,María López
carlos.rodriguez,Pass789!,carlos.rodriguez@utec.edu.sv,Carlos Rodríguez
\`\`\`

**Importante:** El username debe seguir el formato `nombre.apellido` para mantener consistencia en el sistema.

## Respaldo

Para hacer respaldo de la base de datos:
\`\`\`bash
mysqldump -u root -p recursos_educativos > backup.sql
\`\`\`

Para restaurar:
\`\`\`bash
mysql -u root -p recursos_educativos < backup.sql
\`\`\`

## Notas Importantes

- Los UUIDs se generan automáticamente con UUID()
- Las contraseñas deben estar hasheadas (bcrypt)
- Las sesiones expiran automáticamente
- Los índices están optimizados para búsquedas rápidas
- Sistema de 3 roles con permisos específicos
- Auditoría completa de cambios
- Soft deletes implementados
- Base de datos completamente normalizada
