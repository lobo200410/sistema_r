-- Vistas para reportes y estadísticas
USE recursos_educativos;

-- Vista de recursos por facultad
CREATE OR REPLACE VIEW recursos_por_facultad AS
SELECT 
    facultad,
    COUNT(*) as total_recursos,
    SUM(CASE WHEN publicado = TRUE THEN 1 ELSE 0 END) as recursos_publicados,
    COUNT(DISTINCT docente) as total_docentes
FROM resources
GROUP BY facultad;

-- Vista de recursos por ciclo
CREATE OR REPLACE VIEW recursos_por_ciclo AS
SELECT 
    ciclo,
    COUNT(*) as total_recursos,
    SUM(CASE WHEN publicado = TRUE THEN 1 ELSE 0 END) as recursos_publicados,
    COUNT(DISTINCT facultad) as facultades_participantes
FROM resources
GROUP BY ciclo
ORDER BY ciclo DESC;

-- Vista de recursos por tipo
CREATE OR REPLACE VIEW recursos_por_tipo AS
SELECT 
    tipo,
    COUNT(*) as total_recursos,
    COUNT(DISTINCT facultad) as facultades,
    COUNT(DISTINCT docente) as docentes
FROM resources
GROUP BY tipo
ORDER BY total_recursos DESC;

-- Vista de recursos por plataforma
CREATE OR REPLACE VIEW recursos_por_plataforma AS
SELECT 
    plataforma,
    COUNT(*) as total_recursos,
    SUM(CASE WHEN publicado = TRUE THEN 1 ELSE 0 END) as recursos_publicados
FROM resources
GROUP BY plataforma
ORDER BY total_recursos DESC;

-- Vista de actividad reciente
CREATE OR REPLACE VIEW actividad_reciente AS
SELECT 
    r.id,
    r.titulo,
    r.tipo,
    r.facultad,
    r.docente,
    r.created_at,
    u.name as creado_por
FROM resources r
JOIN users u ON r.user_id = u.id
ORDER BY r.created_at DESC
LIMIT 50;
