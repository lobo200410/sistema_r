-- Vista para recursos publicados con información del usuario
CREATE OR REPLACE VIEW v_recursos_publicados AS
SELECT 
  r.id,
  r.titulo,
  r.url,
  r.tipo,
  r.asignatura,
  r.ciclo,
  r.plataforma,
  r.docente,
  r.facultad,
  r.descripcion,
  r.created_at,
  u.name as creado_por,
  u.email as email_creador
FROM resources r
INNER JOIN users u ON r.user_id = u.id
WHERE r.publicado = true
ORDER BY r.created_at DESC;

-- Vista para estadísticas por facultad
CREATE OR REPLACE VIEW v_estadisticas_facultad AS
SELECT 
  facultad,
  COUNT(*) as total_recursos,
  COUNT(CASE WHEN publicado = true THEN 1 END) as recursos_publicados,
  COUNT(CASE WHEN publicado = false THEN 1 END) as recursos_borrador,
  COUNT(DISTINCT docente) as total_docentes,
  COUNT(DISTINCT ciclo) as ciclos_activos
FROM resources
GROUP BY facultad
ORDER BY total_recursos DESC;

-- Vista para estadísticas por ciclo
CREATE OR REPLACE VIEW v_estadisticas_ciclo AS
SELECT 
  ciclo,
  COUNT(*) as total_recursos,
  COUNT(DISTINCT facultad) as facultades,
  COUNT(DISTINCT tipo) as tipos_recursos,
  COUNT(DISTINCT plataforma) as plataformas_usadas
FROM resources
GROUP BY ciclo
ORDER BY ciclo DESC;

-- Comentarios
COMMENT ON VIEW v_recursos_publicados IS 'Vista de recursos publicados con información del creador';
COMMENT ON VIEW v_estadisticas_facultad IS 'Estadísticas de recursos por facultad';
COMMENT ON VIEW v_estadisticas_ciclo IS 'Estadísticas de recursos por ciclo académico';
