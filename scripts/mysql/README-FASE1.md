# Fase 1: Sistema de Roles y Administración

## Instrucciones de Instalación

### 1. Ejecutar Scripts de Base de Datos

Ejecuta los siguientes scripts en orden en tu base de datos MySQL:

\`\`\`bash
# 1. Sistema de roles y permisos
mysql -u root -p recursos_educativos < scripts/mysql/08-create-roles-system.sql

# 2. Tablas normalizadas (plataformas, facultades, ciclos, tipos)
mysql -u root -p recursos_educativos < scripts/mysql/09-create-normalized-tables.sql

# 3. Tabla de auditoría
mysql -u root -p recursos_educativos < scripts/mysql/10-create-audit-table.sql
\`\`\`

### 2. Verificar Instalación

Después de ejecutar los scripts, verifica que se hayan creado las siguientes tablas:

- `roles` - Roles del sistema (superadmin, admin, coordinator, teacher, student)
- `permissions` - Permisos granulares
- `role_permissions` - Relación roles-permisos
- `user_roles` - Relación usuarios-roles
- `platforms` - Plataformas educativas
- `faculties` - Facultades
- `academic_cycles` - Ciclos académicos
- `resource_types` - Tipos de recursos
- `audit_logs` - Registro de auditoría

### 3. Verificar Usuario Superadmin

El usuario `rene.cruz` debe tener asignado el rol de superadmin automáticamente. Verifica con:

\`\`\`sql
SELECT u.username, r.name as role
FROM users u
INNER JOIN user_roles ur ON u.id = ur.user_id
INNER JOIN roles r ON ur.role_id = r.id
WHERE u.username = 'rene.cruz';
\`\`\`

### 4. Acceder al Panel de Administración

1. Inicia sesión con el usuario `rene.cruz`
2. En el dashboard, verás un botón "Administración" en el header
3. Haz clic para acceder al panel de administración en `/admin`

## Funcionalidades Implementadas

### Panel de Administración (`/admin`)

El panel tiene 6 pestañas principales:

#### 1. Plataformas
- Agregar nuevas plataformas educativas
- Editar plataformas existentes
- Activar/desactivar plataformas
- Ver lista de todas las plataformas

#### 2. Facultades
- Agregar nuevas facultades
- Asignar códigos a facultades
- Editar información de facultades
- Activar/desactivar facultades

#### 3. Ciclos Académicos
- Crear nuevos ciclos (ej: 01-2025, 02-2025)
- Definir año y semestre
- Establecer fechas de inicio y fin
- Activar/desactivar ciclos

#### 4. Tipos de Recursos
- Agregar nuevos tipos de recursos
- Definir iconos para cada tipo
- Editar descripciones
- Activar/desactivar tipos

#### 5. Usuarios
- Crear usuarios masivamente (bulk creation)
- Formato: `username,password,email,name` (uno por línea)
- Ver lista de todos los usuarios del sistema
- Total de usuarios registrados

#### 6. Roles
- Asignar roles a usuarios
- Ver roles disponibles:
  - **superadmin**: Acceso total al sistema
  - **admin**: Permisos de gestión
  - **coordinator**: Coordinador de facultad
  - **teacher**: Docente que crea recursos
  - **student**: Solo lectura
- Gestionar permisos por rol

## Datos Iniciales

Los scripts crean automáticamente:

### Plataformas
- Genially
- Lumi
- Canva
- Flickbook

### Facultades
- Facultad de Informática y Ciencias Aplicadas (FICA)
- Facultad de Maestrías (FM)
- Facultad de Ciencias Empresariales (FCE)

### Ciclos
- 01-2025 (activo)
- 02-2025 (activo)
- 01-2026 (inactivo)
- 02-2026 (inactivo)

### Tipos de Recursos
- Documento
- Infografía
- Evaluación
- Video
- Interactivo

## Permisos del Sistema

El sistema incluye los siguientes permisos:

### Recursos
- `resources.create` - Crear recursos
- `resources.read` - Ver recursos
- `resources.update` - Actualizar recursos
- `resources.delete` - Eliminar recursos
- `resources.approve` - Aprobar recursos

### Usuarios
- `users.create` - Crear usuarios
- `users.read` - Ver usuarios
- `users.update` - Actualizar usuarios
- `users.delete` - Eliminar usuarios
- `users.bulk_create` - Crear usuarios masivamente

### Roles
- `roles.manage` - Gestionar roles y permisos

### Administración
- `admin.platforms` - Gestionar plataformas
- `admin.faculties` - Gestionar facultades
- `admin.cycles` - Gestionar ciclos académicos
- `admin.types` - Gestionar tipos de recursos
- `admin.audit` - Ver registros de auditoría

## Seguridad

- Solo usuarios con rol `superadmin` pueden acceder al panel de administración
- Todas las acciones administrativas verifican permisos
- El usuario `rene.cruz` tiene rol superadmin por defecto
- Otros usuarios son redirigidos al dashboard si intentan acceder a `/admin`

## Próximos Pasos (Fase 2)

- Dashboard analítico con gráficas
- Gestión de ciclos académicos avanzada
- Búsqueda y filtros avanzados
- Sistema de notificaciones
- Reportes profesionales mejorados
