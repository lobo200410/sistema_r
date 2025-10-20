USE recursos_educativos;

-- Tabla de roles
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de permisos
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    module VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_module (module)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Relación roles-permisos
CREATE TABLE role_permissions (
    role_id INT,
    permission_id INT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Relación usuarios-roles
CREATE TABLE user_roles (
    user_id VARCHAR(36),
    role_id INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Solo 3 roles: superadmin, coordinador, docente
INSERT INTO roles (name, description) VALUES
('superadmin', 'Control total del sistema - gestión completa de recursos, usuarios y configuración'),
('coordinador', 'Permisos de edición - puede crear y editar recursos'),
('docente', 'Solo puede agregar recursos - sin permisos de edición');

-- Permisos simplificados para 3 roles
INSERT INTO permissions (name, description, module) VALUES
-- Recursos
('crear_recurso', 'Crear nuevos recursos educativos', 'resources'),
('editar_recurso', 'Editar recursos existentes', 'resources'),
('eliminar_recurso', 'Eliminar recursos', 'resources'),
('ver_todos_recursos', 'Ver todos los recursos del sistema', 'resources'),

-- Administración (solo superadmin)
('gestionar_plataformas', 'Gestionar plataformas educativas', 'admin'),
('gestionar_facultades', 'Gestionar facultades', 'admin'),
('gestionar_ciclos', 'Gestionar ciclos académicos', 'admin'),
('gestionar_tipos', 'Gestionar tipos de recursos', 'admin'),
('gestionar_usuarios', 'Crear y gestionar usuarios masivamente', 'admin'),
('asignar_roles', 'Asignar roles a usuarios', 'admin'),
('ver_auditoria', 'Ver logs de auditoría', 'admin'),
('exportar_reportes', 'Exportar reportes del sistema', 'admin');

-- Superadmin: todos los permisos
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Coordinador: crear, editar, eliminar y ver recursos
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions WHERE name IN (
    'crear_recurso', 
    'editar_recurso', 
    'eliminar_recurso', 
    'ver_todos_recursos',
    'exportar_reportes'
);

-- Docente: solo crear y ver recursos (sin editar ni eliminar)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions WHERE name IN (
    'crear_recurso', 
    'ver_todos_recursos'
);
