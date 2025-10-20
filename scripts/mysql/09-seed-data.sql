-- 09-seed-data.sql
USE recursos_educativos;

-- Insertar usuario superadmin rene.cruz con formato nombre.apellido
-- Nota: En producción, la contraseña debe ser hasheada con bcrypt
INSERT INTO users (id, username, email, name, password, is_active) VALUES
(UUID(), 'rene.cruz', 'rene.cruz@utec.edu.sv', 'René Cruz', 'Pass123!', TRUE)
ON DUPLICATE KEY UPDATE username = 'rene.cruz';

-- Asignar rol de superadmin a rene.cruz
INSERT INTO user_roles (user_id, role_id)
SELECT id, 1 FROM users WHERE username = 'rene.cruz'
ON DUPLICATE KEY UPDATE role_id = 1;

-- Insertar usuarios de ejemplo con formato nombre.apellido
INSERT INTO users (id, username, email, name, password, is_active) VALUES
(UUID(), 'juan.perez', 'juan.perez@utec.edu.sv', 'Juan Pérez', 'Pass123!', TRUE),
(UUID(), 'maria.gonzalez', 'maria.gonzalez@utec.edu.sv', 'María González', 'Pass123!', TRUE),
(UUID(), 'carlos.rodriguez', 'carlos.rodriguez@utec.edu.sv', 'Carlos Rodríguez', 'Pass123!', TRUE)
ON DUPLICATE KEY UPDATE username = VALUES(username);

-- Asignar roles a usuarios de ejemplo
-- juan.perez = coordinador (role_id = 2)
INSERT INTO user_roles (user_id, role_id)
SELECT id, 2 FROM users WHERE username = 'juan.perez'
ON DUPLICATE KEY UPDATE role_id = 2;

-- maria.gonzalez = docente (role_id = 3)
INSERT INTO user_roles (user_id, role_id)
SELECT id, 3 FROM users WHERE username = 'maria.gonzalez'
ON DUPLICATE KEY UPDATE role_id = 3;

-- carlos.rodriguez = docente (role_id = 3)
INSERT INTO user_roles (user_id, role_id)
SELECT id, 3 FROM users WHERE username = 'carlos.rodriguez'
ON DUPLICATE KEY UPDATE role_id = 3;

-- Insertar recursos de ejemplo (usando IDs de las tablas normalizadas)
INSERT INTO resources (
    user_id, titulo, url, asignatura, docente, descripcion,
    platform_id, faculty_id, cycle_id, type_id, publicado, estado
) VALUES
(
    (SELECT id FROM users WHERE username = 'rene.cruz' LIMIT 1),
    'Introducción a la Programación',
    'https://genial.ly/ejemplo1',
    'Programación I',
    'Dr. Juan Pérez',
    'Material introductorio para el curso de programación',
    1, -- Genially
    1, -- FICA
    3, -- 01-2025
    1, -- Presentación
    TRUE,
    'publicado'
),
(
    (SELECT id FROM users WHERE username = 'maria.gonzalez' LIMIT 1),
    'Fundamentos de Contabilidad',
    'https://canva.com/ejemplo2',
    'Contabilidad Básica',
    'Lic. María González',
    'Conceptos básicos de contabilidad financiera',
    2, -- Canva
    2, -- FCE
    3, -- 01-2025
    2, -- Material Interactivo
    TRUE,
    'publicado'
),
(
    (SELECT id FROM users WHERE username = 'juan.perez' LIMIT 1),
    'Diseño de Bases de Datos',
    'https://lumi.education/ejemplo3',
    'Bases de Datos I',
    'Ing. Carlos Rodríguez',
    'Conceptos de modelado y diseño de bases de datos relacionales',
    3, -- Lumi
    1, -- FICA
    3, -- 01-2025
    3, -- Video Tutorial
    TRUE,
    'publicado'
);
