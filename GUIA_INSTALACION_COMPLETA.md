# Guía Completa de Instalación - Sistema de Recursos Educativos

## Requisitos Previos

- XAMPP instalado (o MySQL Server)
- MySQL Workbench instalado
- Node.js instalado (versión 18 o superior)
- El código del proyecto descargado

---

## PARTE 1: Configurar la Base de Datos en MySQL Workbench

### Paso 1: Abrir MySQL Workbench y Conectarse

1. Abre **MySQL Workbench**
2. Haz clic en tu conexión local (generalmente "Local instance MySQL80" o similar)
3. Ingresa tu contraseña de root si te la pide

### Paso 2: Ejecutar los Scripts SQL

Ejecuta los siguientes scripts **EN ORDEN**. Para cada script:
- Copia el contenido completo
- Pégalo en una nueva pestaña de Query en Workbench
- Presiona el botón de rayo ⚡ (Execute) o presiona `Ctrl+Shift+Enter`

#### Script 1: Crear la Base de Datos

\`\`\`sql
-- 01-create-database.sql
DROP DATABASE IF EXISTS recursos_educativos;
CREATE DATABASE recursos_educativos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE recursos_educativos;
\`\`\`

#### Script 2: Crear Tabla de Usuarios

\`\`\`sql
-- 02-create-users-table.sql
USE recursos_educativos;

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
\`\`\`

#### Script 3: Crear Tabla de Recursos

\`\`\`sql
-- 03-create-resources-table.sql
USE recursos_educativos;

CREATE TABLE resources (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    titulo VARCHAR(500) NOT NULL,
    url TEXT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    asignatura VARCHAR(255) NOT NULL,
    ciclo VARCHAR(50) NOT NULL,
    plataforma VARCHAR(100) NOT NULL,
    docente VARCHAR(255) NOT NULL,
    facultad VARCHAR(255) NOT NULL,
    publicado BOOLEAN DEFAULT FALSE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_ciclo (ciclo),
    INDEX idx_facultad (facultad),
    INDEX idx_tipo (tipo),
    INDEX idx_plataforma (plataforma),
    INDEX idx_publicado (publicado),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
\`\`\`

#### Script 4: Crear Tabla de Sesiones

\`\`\`sql
-- 04-create-sessions-table.sql
USE recursos_educativos;

CREATE TABLE sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
\`\`\`

#### Script 5: Crear Vistas para Reportes

\`\`\`sql
-- 05-create-views.sql
USE recursos_educativos;

-- Vista: Recursos por Facultad
CREATE OR REPLACE VIEW recursos_por_facultad AS
SELECT 
    facultad,
    COUNT(*) as total_recursos,
    SUM(CASE WHEN publicado = 1 THEN 1 ELSE 0 END) as recursos_publicados,
    SUM(CASE WHEN publicado = 0 THEN 1 ELSE 0 END) as recursos_no_publicados
FROM resources
GROUP BY facultad;

-- Vista: Recursos por Ciclo
CREATE OR REPLACE VIEW recursos_por_ciclo AS
SELECT 
    ciclo,
    COUNT(*) as total_recursos,
    COUNT(DISTINCT facultad) as facultades_participantes,
    COUNT(DISTINCT docente) as docentes_participantes
FROM resources
GROUP BY ciclo
ORDER BY ciclo DESC;

-- Vista: Recursos por Plataforma
CREATE OR REPLACE VIEW recursos_por_plataforma AS
SELECT 
    plataforma,
    COUNT(*) as total_recursos,
    COUNT(DISTINCT facultad) as facultades_usando
FROM resources
GROUP BY plataforma
ORDER BY total_recursos DESC;

-- Vista: Recursos por Tipo
CREATE OR REPLACE VIEW recursos_por_tipo AS
SELECT 
    tipo,
    COUNT(*) as total_recursos,
    AVG(CASE WHEN publicado = 1 THEN 1 ELSE 0 END) * 100 as porcentaje_publicados
FROM resources
GROUP BY tipo
ORDER BY total_recursos DESC;

-- Vista: Estadísticas Generales
CREATE OR REPLACE VIEW estadisticas_generales AS
SELECT 
    COUNT(*) as total_recursos,
    COUNT(DISTINCT facultad) as total_facultades,
    COUNT(DISTINCT docente) as total_docentes,
    COUNT(DISTINCT ciclo) as total_ciclos,
    SUM(CASE WHEN publicado = 1 THEN 1 ELSE 0 END) as recursos_publicados,
    SUM(CASE WHEN publicado = 0 THEN 1 ELSE 0 END) as recursos_borradores
FROM resources;
\`\`\`

#### Script 6: Insertar Datos de Prueba (OPCIONAL)

\`\`\`sql
-- 06-seed-data.sql
USE recursos_educativos;

-- Insertar usuario de prueba
INSERT INTO users (id, email, password, name) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@utec.edu.sv', 'admin123', 'Administrador UTEC'),
('550e8400-e29b-41d4-a716-446655440001', 'docente@utec.edu.sv', 'docente123', 'Docente Ejemplo');

-- Insertar recursos de ejemplo
INSERT INTO resources (user_id, titulo, url, tipo, asignatura, ciclo, plataforma, docente, facultad, publicado, descripcion) VALUES
('550e8400-e29b-41d4-a716-446655440000', 
 'Introducción a la Programación', 
 'https://canva.com/ejemplo1', 
 'Presentación', 
 'Programación I', 
 '01-2025', 
 'Canva', 
 'Dr. Juan Pérez', 
 'Facultad de Informática y Ciencias Aplicadas', 
 TRUE, 
 'Material introductorio para el curso de programación'),

('550e8400-e29b-41d4-a716-446655440000', 
 'Fundamentos de Contabilidad', 
 'https://genially.com/ejemplo2', 
 'Material Interactivo', 
 'Contabilidad Básica', 
 '01-2025', 
 'Genially', 
 'Lic. María González', 
 'Facultad de Ciencias Empresariales', 
 TRUE, 
 'Conceptos básicos de contabilidad financiera'),

('550e8400-e29b-41d4-a716-446655440001', 
 'Derecho Constitucional', 
 'https://flickbook.com/ejemplo3', 
 'Documento', 
 'Derecho Constitucional I', 
 '02-2025', 
 'Flickbook', 
 'Dr. Carlos Martínez', 
 'Facultad de Derecho', 
 FALSE, 
 'Análisis de la constitución nacional');
\`\`\`

#### Script 7: Crear Procedimientos Almacenados

\`\`\`sql
-- 07-procedures.sql
USE recursos_educativos;

DELIMITER //

-- Procedimiento: Obtener recursos por ciclo
CREATE PROCEDURE obtener_recursos_por_ciclo(IN p_ciclo VARCHAR(50))
BEGIN
    SELECT * FROM resources 
    WHERE ciclo = p_ciclo 
    ORDER BY created_at DESC;
END //

-- Procedimiento: Obtener recursos por facultad
CREATE PROCEDURE obtener_recursos_por_facultad(IN p_facultad VARCHAR(255))
BEGIN
    SELECT * FROM resources 
    WHERE facultad = p_facultad 
    ORDER BY created_at DESC;
END //

-- Procedimiento: Estadísticas por docente
CREATE PROCEDURE estadisticas_por_docente(IN p_docente VARCHAR(255))
BEGIN
    SELECT 
        COUNT(*) as total_recursos,
        SUM(CASE WHEN publicado = 1 THEN 1 ELSE 0 END) as publicados,
        COUNT(DISTINCT plataforma) as plataformas_usadas,
        COUNT(DISTINCT asignatura) as asignaturas
    FROM resources 
    WHERE docente = p_docente;
END //

DELIMITER ;
\`\`\`

### Paso 3: Verificar que Todo se Creó Correctamente

Ejecuta este query para verificar:

\`\`\`sql
USE recursos_educativos;

-- Ver todas las tablas
SHOW TABLES;

-- Ver estructura de la tabla resources
DESCRIBE resources;

-- Ver las vistas creadas
SHOW FULL TABLES WHERE TABLE_TYPE LIKE 'VIEW';

-- Contar registros (si insertaste datos de prueba)
SELECT COUNT(*) as total_usuarios FROM users;
SELECT COUNT(*) as total_recursos FROM resources;
\`\`\`

---

## PARTE 2: Configurar la Aplicación Next.js

### Paso 1: Descargar el Código

1. En v0, haz clic en los **tres puntos (⋮)** en la esquina superior derecha
2. Selecciona **"Download ZIP"**
3. Descomprime el archivo en una carpeta de tu preferencia

### Paso 2: Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

\`\`\`bash
npm install
\`\`\`

### Paso 3: Crear el Archivo de Variables de Entorno

1. En la raíz del proyecto, crea un archivo llamado `.env.local`
2. Agrega el siguiente contenido (ajusta los valores según tu configuración):

\`\`\`env
# Configuración de MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql_aqui
DB_NAME=recursos_educativos
DB_PORT=3306
\`\`\`

**IMPORTANTE:** Reemplaza `tu_contraseña_mysql_aqui` con tu contraseña real de MySQL.

### Paso 4: Verificar la Conexión

Antes de ejecutar la aplicación, verifica que:
- ✅ XAMPP esté corriendo con MySQL activo
- ✅ La base de datos `recursos_educativos` exista
- ✅ Las tablas estén creadas
- ✅ El archivo `.env.local` tenga los datos correctos

### Paso 5: Ejecutar la Aplicación

En la terminal, ejecuta:

\`\`\`bash
npm run dev
\`\`\`

Deberías ver algo como:

\`\`\`
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Ready in 2.3s
\`\`\`

### Paso 6: Abrir en el Navegador

Abre tu navegador y ve a:

\`\`\`
http://localhost:3000
\`\`\`

Deberías ver la pantalla de login con el fondo burgundy (#5D0A28).

---

## PARTE 3: Probar el Sistema

### Credenciales de Prueba

Si ejecutaste el script de datos de prueba (06-seed-data.sql):

- **Email:** `admin@utec.edu.sv`
- **Contraseña:** `admin123`

### Funcionalidades a Probar

1. **Login:** Inicia sesión con las credenciales
2. **Dashboard:** Verifica que veas la tabla de recursos
3. **Crear Recurso:** Haz clic en "Nuevo Recurso" y llena el formulario
4. **Editar Recurso:** Haz clic en el ícono de lápiz en un recurso
5. **Eliminar Recurso:** Haz clic en el ícono de basura
6. **Cerrar Sesión:** Haz clic en "Cerrar Sesión"

---

## Solución de Problemas Comunes

### Error: "Cannot connect to MySQL"

**Solución:**
1. Verifica que MySQL esté corriendo en XAMPP
2. Verifica que las credenciales en `.env.local` sean correctas
3. Verifica que el puerto sea 3306

### Error: "Table doesn't exist"

**Solución:**
1. Verifica que ejecutaste todos los scripts SQL en orden
2. En Workbench, ejecuta: `USE recursos_educativos; SHOW TABLES;`

### Error: "Access denied for user"

**Solución:**
1. Verifica tu contraseña de MySQL
2. Asegúrate de que el usuario tenga permisos en la base de datos

### La página no carga

**Solución:**
1. Verifica que `npm run dev` esté corriendo sin errores
2. Revisa la consola del navegador (F12) para ver errores
3. Revisa la terminal donde corre Next.js para ver errores del servidor

---

## Queries Útiles para Administración

### Ver todos los recursos
\`\`\`sql
SELECT * FROM resources ORDER BY created_at DESC;
\`\`\`

### Ver recursos por facultad
\`\`\`sql
SELECT * FROM recursos_por_facultad;
\`\`\`

### Ver estadísticas generales
\`\`\`sql
SELECT * FROM estadisticas_generales;
\`\`\`

### Buscar recursos por palabra clave
\`\`\`sql
SELECT * FROM resources 
WHERE titulo LIKE '%programación%' 
   OR descripcion LIKE '%programación%';
\`\`\`

### Recursos creados en el último mes
\`\`\`sql
SELECT * FROM resources 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
ORDER BY created_at DESC;
\`\`\`

### Limpiar sesiones expiradas
\`\`\`sql
DELETE FROM sessions WHERE expires_at < NOW();
\`\`\`

---

## Respaldo de la Base de Datos

### Crear respaldo
En MySQL Workbench:
1. Server → Data Export
2. Selecciona `recursos_educativos`
3. Elige la ubicación del archivo
4. Click en "Start Export"

### Restaurar respaldo
En MySQL Workbench:
1. Server → Data Import
2. Selecciona el archivo de respaldo
3. Click en "Start Import"

---

## Contacto y Soporte

Si tienes problemas:
1. Revisa los logs en la terminal donde corre `npm run dev`
2. Revisa la consola del navegador (F12)
3. Verifica que todos los scripts SQL se ejecutaron correctamente

---

**¡Listo! Tu sistema de Recursos Educativos está completamente configurado y funcionando.**
