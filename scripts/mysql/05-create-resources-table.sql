-- 05-create-resources-table.sql
USE recursos_educativos;

CREATE TABLE resources (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    titulo VARCHAR(500) NOT NULL,
    descripcion TEXT,
    url TEXT NOT NULL,
    
    -- Foreign keys a tablas normalizadas
    platform_id INT,
    faculty_id INT,
    cycle_id INT,
    type_id INT,
    
    -- Estado y métricas
    publicado BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    downloads_count INT DEFAULT 0,
    
    -- Timestamps y soft delete
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE SET NULL,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE SET NULL,
    FOREIGN KEY (cycle_id) REFERENCES academic_cycles(id) ON DELETE SET NULL,
    FOREIGN KEY (type_id) REFERENCES resource_types(id) ON DELETE SET NULL,
    
    -- Índices
    INDEX idx_user_id (user_id),
    INDEX idx_platform_id (platform_id),
    INDEX idx_faculty_id (faculty_id),
    INDEX idx_cycle_id (cycle_id),
    INDEX idx_type_id (type_id),
    INDEX idx_publicado (publicado),
    INDEX idx_deleted_at (deleted_at),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
