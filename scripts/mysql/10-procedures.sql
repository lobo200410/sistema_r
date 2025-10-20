-- 10-procedures.sql
USE recursos_educativos;

DELIMITER //

-- Procedimiento: Obtener recursos por ciclo (actualizado)
DROP PROCEDURE IF EXISTS obtener_recursos_por_ciclo//
CREATE PROCEDURE obtener_recursos_por_ciclo(IN p_ciclo_id INT)
BEGIN
    SELECT 
        r.*,
        p.name as plataforma_nombre,
        f.name as facultad_nombre,
        ac.name as ciclo_nombre,
        rt.name as tipo_nombre,
        u.name as usuario_nombre
    FROM resources r
    LEFT JOIN platforms p ON r.platform_id = p.id
    LEFT JOIN faculties f ON r.faculty_id = f.id
    LEFT JOIN academic_cycles ac ON r.cycle_id = ac.id
    LEFT JOIN resource_types rt ON r.type_id = rt.id
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.cycle_id = p_ciclo_id 
    AND r.deleted_at IS NULL
    ORDER BY r.created_at DESC;
END //

-- Procedimiento: Obtener recursos por facultad (actualizado)
DROP PROCEDURE IF EXISTS obtener_recursos_por_facultad//
CREATE PROCEDURE obtener_recursos_por_facultad(IN p_facultad_id INT)
BEGIN
    SELECT 
        r.*,
        p.name as plataforma_nombre,
        f.name as facultad_nombre,
        ac.name as ciclo_nombre,
        rt.name as tipo_nombre,
        u.name as usuario_nombre
    FROM resources r
    LEFT JOIN platforms p ON r.platform_id = p.id
    LEFT JOIN faculties f ON r.faculty_id = f.id
    LEFT JOIN academic_cycles ac ON r.cycle_id = ac.id
    LEFT JOIN resource_types rt ON r.type_id = rt.id
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.faculty_id = p_facultad_id 
    AND r.deleted_at IS NULL
    ORDER BY r.created_at DESC;
END //

-- Procedimiento: Estadísticas por docente (actualizado)
DROP PROCEDURE IF EXISTS estadisticas_por_docente//
CREATE PROCEDURE estadisticas_por_docente(IN p_docente VARCHAR(255))
BEGIN
    SELECT 
        COUNT(*) as total_recursos,
        SUM(CASE WHEN publicado = 1 THEN 1 ELSE 0 END) as publicados,
        COUNT(DISTINCT platform_id) as plataformas_usadas,
        COUNT(DISTINCT asignatura) as asignaturas,
        SUM(views_count) as total_vistas,
        SUM(downloads_count) as total_descargas
    FROM resources 
    WHERE docente = p_docente
    AND deleted_at IS NULL;
END //

-- Procedimiento: Registrar acción en auditoría
DROP PROCEDURE IF EXISTS registrar_auditoria//
CREATE PROCEDURE registrar_auditoria(
    IN p_user_id VARCHAR(36),
    IN p_action VARCHAR(50),
    IN p_table_name VARCHAR(50),
    IN p_record_id VARCHAR(36),
    IN p_old_values JSON,
    IN p_new_values JSON
)
BEGIN
    INSERT INTO audit_logs (
        user_id, action, table_name, record_id, 
        old_values, new_values
    ) VALUES (
        p_user_id, p_action, p_table_name, p_record_id,
        p_old_values, p_new_values
    );
END //

DELIMITER ;
