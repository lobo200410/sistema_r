-- 04-create-normalized-tables.sql
USE recursos_educativos;

-- Tabla de plataformas
CREATE TABLE platforms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    website_url VARCHAR(255),
    logo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de facultades
CREATE TABLE faculties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(20) UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_code (code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de ciclos académicos
CREATE TABLE academic_cycles (
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
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tipos de recursos
CREATE TABLE resource_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar plataformas predeterminadas
INSERT INTO platforms (name, description, website_url) VALUES
('Genially', 'Plataforma para crear contenido interactivo', 'https://genial.ly'),
('Canva', 'Herramienta de diseño gráfico', 'https://canva.com'),
('Lumi', 'Plataforma educativa interactiva', 'https://lumi.education'),
('Flickbook', 'Creador de libros digitales', 'https://flickbook.com'),
('PowerPoint', 'Presentaciones de Microsoft', 'https://microsoft.com/powerpoint'),
('Google Slides', 'Presentaciones de Google', 'https://slides.google.com'),
('Prezi', 'Presentaciones dinámicas', 'https://prezi.com');

-- Insertar facultades predeterminadas
INSERT INTO faculties (name, code) VALUES
('Facultad de Informática y Ciencias Aplicadas', 'FICA'),
('Facultad de Ciencias Empresariales', 'FCE'),
('Facultad de Derecho', 'FD'),
('Facultad de Ingeniería', 'FI'),
('Facultad de Ciencias de la Salud', 'FCS');

-- Insertar ciclos académicos predeterminados
INSERT INTO academic_cycles (name, year, semester, is_active) VALUES
('01-2024', 2024, 1, FALSE),
('02-2024', 2024, 2, FALSE),
('01-2025', 2025, 1, TRUE),
('02-2025', 2025, 2, FALSE);

-- Insertar tipos de recursos predeterminados
INSERT INTO resource_types (name, description, icon) VALUES
('Presentación', 'Presentaciones y diapositivas', 'presentation'),
('Material Interactivo', 'Contenido interactivo y multimedia', 'interactive'),
('Documento', 'Documentos y textos', 'document'),
('Video', 'Contenido en video', 'video'),
('Infografía', 'Infografías y gráficos', 'infographic'),
('Evaluación', 'Exámenes y cuestionarios', 'quiz'),
('Guía', 'Guías y tutoriales', 'guide');
