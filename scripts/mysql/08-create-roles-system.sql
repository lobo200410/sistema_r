-- Sistema de Roles y Permisos
USE recursos_educativos;

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de permisos
CREATE TABLE IF NOT EXISTS permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    module VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_module (module)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Relación roles-permisos
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT,
    permission_id INT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Relación usuarios-roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_id VARCHAR(36),
    role_id INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar roles predeterminados
INSERT INTO roles (name, description) VALUES
('superadmin', 'Administrador con acceso total al sistema'),
('admin', 'Administrador con permisos de gestión'),
('coordinator', 'Coordinador de facultad'),
('teacher', 'Docente que crea recursos'),
('student', 'Estudiante con acceso de solo lectura')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Insertar permisos
INSERT INTO permissions (name, description, module) VALUES
-- Recursos
('resources.create', 'Crear recursos', 'resources'),
('resources.read', 'Ver recursos', 'resources'),
('resources.update', 'Actualizar recursos', 'resources'),
('resources.delete', 'Eliminar recursos', 'resources'),
('resources.approve', 'Aprobar recursos', 'resources'),
-- Usuarios
('users.create', 'Crear usuarios', 'users'),
('users.read', 'Ver usuarios', 'users'),
('users.update', 'Actualizar usuarios', 'users'),
('users.delete', 'Eliminar usuarios', 'users'),
('users.bulk_create', 'Crear usuarios masivamente', 'users'),
-- Roles
('roles.manage', 'Gestionar roles y permisos', 'roles'),
-- Administración
('admin.platforms', 'Gestionar plataformas', 'admin'),
('admin.faculties', 'Gestionar facultades', 'admin'),
('admin.cycles', 'Gestionar ciclos académicos', 'admin'),
('admin.types', 'Gestionar tipos de recursos', 'admin'),
('admin.audit', 'Ver registros de auditoría', 'admin')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Asignar todos los permisos a superadmin
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions
ON DUPLICATE KEY UPDATE role_id=role_id;

-- Asignar rol superadmin a rene.cruz
INSERT INTO user_roles (user_id, role_id)
SELECT id, 1 FROM users WHERE username = 'rene.cruz'
ON DUPLICATE KEY UPDATE role_id=VALUES(role_id);
