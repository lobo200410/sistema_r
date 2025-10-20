-- Datos de ejemplo para pruebas (OPCIONAL)
-- Puedes ejecutar este script si deseas tener datos de prueba

-- Insertar usuario de prueba (contraseña: "password123")
INSERT INTO users (email, password, name) 
VALUES (
  'admin@utec.edu.sv',
  '$2a$10$rQZ9vXqZ9vXqZ9vXqZ9vXqZ9vXqZ9vXqZ9vXqZ9vXqZ9vXqZ9vXq',
  'Administrador UTEC'
) ON CONFLICT (email) DO NOTHING;

-- Insertar recursos de ejemplo
INSERT INTO resources (
  titulo, 
  url, 
  tipo, 
  asignatura, 
  ciclo, 
  plataforma, 
  docente, 
  facultad, 
  publicado, 
  descripcion,
  user_id
)
SELECT 
  'Introducción a la Programación',
  'https://www.canva.com/design/ejemplo1',
  'Presentación',
  'Programación I',
  '01-2025',
  'Canva',
  'Dr. Juan Pérez',
  'Facultad de Informática y Ciencias Aplicadas',
  true,
  'Material introductorio sobre conceptos básicos de programación',
  id
FROM users WHERE email = 'admin@utec.edu.sv'
ON CONFLICT DO NOTHING;

INSERT INTO resources (
  titulo, 
  url, 
  tipo, 
  asignatura, 
  ciclo, 
  plataforma, 
  docente, 
  facultad, 
  publicado, 
  descripcion,
  user_id
)
SELECT 
  'Fundamentos de Bases de Datos',
  'https://www.genially.com/view/ejemplo2',
  'Material Interactivo',
  'Bases de Datos',
  '01-2025',
  'Genially',
  'Dra. María González',
  'Facultad de Informática y Ciencias Aplicadas',
  true,
  'Presentación interactiva sobre modelado de datos',
  id
FROM users WHERE email = 'admin@utec.edu.sv'
ON CONFLICT DO NOTHING;

COMMENT ON TABLE resources IS 'Datos de ejemplo insertados para pruebas';
