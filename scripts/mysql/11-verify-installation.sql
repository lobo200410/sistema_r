-- 11-verify-installation.sql
USE recursos_educativos;

-- Ver todas las tablas
SHOW TABLES;

-- Ver estructura de tablas principales
DESCRIBE users;
DESCRIBE resources;
DESCRIBE roles;
DESCRIBE platforms;
DESCRIBE faculties;
DESCRIBE academic_cycles;
DESCRIBE resource_types;

-- Ver las vistas creadas
SHOW FULL TABLES WHERE TABLE_TYPE LIKE 'VIEW';

-- Contar registros
SELECT 'Usuarios' as tabla, COUNT(*) as total FROM users
UNION ALL
SELECT 'Recursos', COUNT(*) FROM resources
UNION ALL
SELECT 'Roles', COUNT(*) FROM roles
UNION ALL
SELECT 'Permisos', COUNT(*) FROM permissions
UNION ALL
SELECT 'Plataformas', COUNT(*) FROM platforms
UNION ALL
SELECT 'Facultades', COUNT(*) FROM faculties
UNION ALL
SELECT 'Ciclos', COUNT(*) FROM academic_cycles
UNION ALL
SELECT 'Tipos de Recursos', COUNT(*) FROM resource_types;

-- Verificar que rene.cruz tiene rol de superadmin
SELECT 
    u.email,
    u.name,
    r.name as rol
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'rene.cruz@utec.edu.sv';

-- Ver estadísticas generales
SELECT * FROM estadisticas_generales;
