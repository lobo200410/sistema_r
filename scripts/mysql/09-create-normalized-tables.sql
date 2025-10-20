-- Tablas normalizadas para el sistema
USE recursos_educativos;

-- Tabla de plataformas
CREATE TABLE IF NOT EXISTS platforms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    website_url VARCHAR(255),
    logo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de facultades
CREATE TABLE IF NOT EXISTS faculties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_code (code),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de ciclos académicos
CREATE TABLE IF NOT EXISTS academic_cycles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    year INT,
    semester INT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_year (year),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tipos de recursos
CREATE TABLE IF NOT EXISTS resource_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos iniciales de plataformas
INSERT INTO platforms (name, description, is_active) VALUES
('Genially', 'Plataforma para crear contenido interactivo', TRUE),
('Lumi', 'Herramienta para crear contenido educativo H5P', TRUE),
('Canva', 'Plataforma de diseño gráfico', TRUE),
('Flickbook', 'Creador de libros digitales interactivos', TRUE)
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Insertar datos iniciales de facultades
INSERT INTO faculties (name, code, description, is_active) VALUES
('Facultad de Informática y Ciencias Aplicadas', 'FICA', 'Facultad de tecnología e informática', TRUE),
('Facultad de Maestrías', 'FM', 'Programas de posgrado', TRUE),
('Facultad de Ciencias Empresariales', 'FCE', 'Administración y negocios', TRUE)
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Insertar datos iniciales de ciclos
INSERT INTO academic_cycles (name, year, semester, is_active) VALUES
('01-2025', 2025, 1, TRUE),
('02-2025', 2025, 2, TRUE),
('01-2026', 2026, 1, FALSE),
('02-2026', 2026, 2, FALSE)
ON DUPLICATE KEY UPDATE year=VALUES(year);

-- Insertar datos iniciales de tipos
INSERT INTO resource_types (name, description, icon, is_active) VALUES
('Documento', 'Documentos y presentaciones', 'file-text', TRUE),
('Infografía', 'Contenido visual informativo', 'image', TRUE),
('Evaluación', 'Exámenes y cuestionarios', 'clipboard-check', TRUE),
('Video', 'Contenido multimedia', 'video', TRUE),
('Interactivo', 'Contenido interactivo', 'mouse-pointer-click', TRUE)
ON DUPLICATE KEY UPDATE description=VALUES(description);
