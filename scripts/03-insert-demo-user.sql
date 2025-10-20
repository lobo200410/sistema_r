-- Script para insertar un usuario de demostración
-- Usuario: admin
-- Contraseña: admin123

INSERT INTO users (id, email, username, name, password) 
VALUES (
  UUID(),
  'admin@utec.edu.sv',
  'admin',
  'Administrador',
  'admin123'
)
ON DUPLICATE KEY UPDATE username = username;

-- Usuario adicional para pruebas
INSERT INTO users (id, email, username, name, password) 
VALUES (
  UUID(),
  'docente@utec.edu.sv',
  'docente',
  'Docente de Prueba',
  'docente123'
)
ON DUPLICATE KEY UPDATE username = username;
