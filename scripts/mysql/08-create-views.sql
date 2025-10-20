-- 08-create-views.sql
USE recursos_educativos;

-- Vista: Recursos por Facultad (actualizada con JOIN)
CREATE OR REPLACE VIEW recursos_por_facultad AS
SELECT 
    f.name as facultad,
    f.code as codigo_facultad,
    COUNT(r.id) as total_recursos,
    SUM(CASE WHEN r.publicado = 1 THEN 1 ELSE 0 END) as recursos_publicados,
    SUM(CASE WHEN r.publicado = 0 THEN 1 ELSE 0 END) as recursos_no_publicados,
    SUM(r.views_count) as total_vistas,
    SUM(r.downloads_count) as total_descargas
FROM faculties f
LEFT JOIN resources r ON f.id = r.faculty_id AND r.deleted_at IS NULL
WHERE f.is_active = TRUE
GROUP BY f.id, f.name, f.code;

-- Vista: Recursos por Ciclo (actualizada con JOIN)
CREATE OR REPLACE VIEW recursos_por_ciclo AS
SELECT 
    ac.name as ciclo,
    ac.year as año,
    ac.semester as semestre,
    COUNT(r.id) as total_recursos,
    COUNT(DISTINCT r.faculty_id) as facultades_participantes,
    COUNT(DISTINCT r.docente) as docentes_participantes,
    ac.is_active as ciclo_activo
FROM academic_cycles ac
LEFT JOIN resources r ON ac.id = r.cycle_id AND r.deleted_at IS NULL
GROUP BY ac.id, ac.name, ac.year, ac.semester, ac.is_active
ORDER BY ac.year DESC, ac.semester DESC;

-- Vista: Recursos por Plataforma (actualizada con JOIN)
CREATE OR REPLACE VIEW recursos_por_plataforma AS
SELECT 
    p.name as plataforma,
    p.website_url as sitio_web,
    COUNT(r.id) as total_recursos,
    COUNT(DISTINCT r.faculty_id) as facultades_usando,
    SUM(r.views_count) as total_vistas,
    p.is_active as plataforma_activa
FROM platforms p
LEFT JOIN resources r ON p.id = r.platform_id AND r.deleted_at IS NULL
WHERE p.is_active = TRUE
GROUP BY p.id, p.name, p.website_url, p.is_active
ORDER BY total_recursos DESC;

-- Vista: Recursos por Tipo (actualizada con JOIN)
CREATE OR REPLACE VIEW recursos_por_tipo AS
SELECT 
    rt.name as tipo,
    rt.icon as icono,
    COUNT(r.id) as total_recursos,
    ROUND(AVG(CASE WHEN r.publicado = 1 THEN 1 ELSE 0 END) * 100, 2) as porcentaje_publicados,
    SUM(r.views_count) as total_vistas
FROM resource_types rt
LEFT JOIN resources r ON rt.id = r.type_id AND r.deleted_at IS NULL
WHERE rt.is_active = TRUE
GROUP BY rt.id, rt.name, rt.icon
ORDER BY total_recursos DESC;

-- Vista: Estadísticas Generales (actualizada)
CREATE OR REPLACE VIEW estadisticas_generales AS
SELECT 
    COUNT(r.id) as total_recursos,
    COUNT(DISTINCT r.faculty_id) as total_facultades,
    COUNT(DISTINCT r.docente) as total_docentes,
    COUNT(DISTINCT r.cycle_id) as total_ciclos,
    SUM(CASE WHEN r.publicado = 1 THEN 1 ELSE 0 END) as recursos_publicados,
    SUM(CASE WHEN r.publicado = 0 THEN 1 ELSE 0 END) as recursos_borradores,
    SUM(r.views_count) as total_vistas,
    SUM(r.downloads_count) as total_descargas,
    COUNT(DISTINCT r.platform_id) as plataformas_usadas
FROM resources r
WHERE r.deleted_at IS NULL;

-- Vista: Actividad de Usuarios
CREATE OR REPLACE VIEW actividad_usuarios AS
SELECT 
    u.id,
    u.name as nombre,
    u.email,
    COUNT(r.id) as recursos_creados,
    SUM(CASE WHEN r.publicado = 1 THEN 1 ELSE 0 END) as recursos_publicados,
    SUM(r.views_count) as total_vistas_recursos,
    MAX(r.created_at) as ultimo_recurso_creado,
    u.last_login_at as ultimo_login
FROM users u
LEFT JOIN resources r ON u.id = r.user_id AND r.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.name, u.email, u.last_login_at
ORDER BY recursos_creados DESC;
