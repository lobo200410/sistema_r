-- Procedimientos almacenados útiles
USE recursos_educativos;

DELIMITER //

-- Procedimiento para limpiar sesiones expiradas
CREATE PROCEDURE limpiar_sesiones_expiradas()
BEGIN
    DELETE FROM sessions WHERE expires_at < NOW();
END //

-- Procedimiento para obtener estadísticas generales
CREATE PROCEDURE obtener_estadisticas()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM users) as total_usuarios,
        (SELECT COUNT(*) FROM resources) as total_recursos,
        (SELECT COUNT(*) FROM resources WHERE publicado = TRUE) as recursos_publicados,
        (SELECT COUNT(DISTINCT facultad) FROM resources) as facultades_activas,
        (SELECT COUNT(DISTINCT docente) FROM resources) as docentes_activos;
END //

-- Procedimiento para buscar recursos
CREATE PROCEDURE buscar_recursos(IN termino VARCHAR(255))
BEGIN
    SELECT * FROM resources 
    WHERE MATCH(titulo, descripcion, asignatura, docente) AGAINST(termino IN NATURAL LANGUAGE MODE)
    OR titulo LIKE CONCAT('%', termino, '%')
    OR asignatura LIKE CONCAT('%', termino, '%')
    OR docente LIKE CONCAT('%', termino, '%')
    ORDER BY created_at DESC;
END //

DELIMITER ;
