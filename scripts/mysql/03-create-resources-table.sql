-- Tabla de recursos educativos
USE recursos_educativos;

CREATE TABLE IF NOT EXISTS resources (
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
    INDEX idx_publicado (publicado),
    INDEX idx_created_at (created_at),
    FULLTEXT INDEX idx_search (titulo, descripcion, asignatura, docente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
