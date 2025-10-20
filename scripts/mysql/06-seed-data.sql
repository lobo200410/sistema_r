-- Datos de ejemplo (OPCIONAL)
USE recursos_educativos;

-- Insertar usuario administrador de ejemplo
-- Contraseña: admin123 (deberías cambiarla en producción)
INSERT INTO users (id, email, password, name, role) VALUES
(UUID(), 'admin@utec.edu.sv', '$2a$10$rKZLvXZnJx5nJx5nJx5nJuO8qZYqZYqZYqZYqZYqZYqZYqZYqZYqZ', 'Administrador', 'admin');

-- Insertar algunos recursos de ejemplo
INSERT INTO resources (id, user_id, titulo, url, tipo, asignatura, ciclo, plataforma, docente, facultad, publicado, descripcion) VALUES
(UUID(), (SELECT id FROM users WHERE email = 'admin@utec.edu.sv'), 
 'Introducción a la Programación', 
 'https://example.com/recurso1', 
 'Video', 
 'Programación I', 
 '01-2025', 
 'Canva', 
 'Dr. Juan Pérez', 
 'Facultad de Informática y Ciencias Aplicadas', 
 TRUE, 
 'Video introductorio sobre conceptos básicos de programación'),

(UUID(), (SELECT id FROM users WHERE email = 'admin@utec.edu.sv'), 
 'Fundamentos de Contabilidad', 
 'https://example.com/recurso2', 
 'Presentación', 
 'Contabilidad Básica', 
 '01-2025', 
 'Genially', 
 'Lic. María González', 
 'Facultad de Ciencias Empresariales', 
 TRUE, 
 'Presentación interactiva sobre principios contables'),

(UUID(), (SELECT id FROM users WHERE email = 'admin@utec.edu.sv'), 
 'Derecho Constitucional', 
 'https://example.com/recurso3', 
 'Documento', 
 'Derecho Constitucional I', 
 '02-2025', 
 'Lumi', 
 'Dr. Carlos Martínez', 
 'Facultad de Derecho', 
 FALSE, 
 'Material de estudio sobre la constitución');
