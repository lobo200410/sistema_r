-- Tabla de recursos educativos
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(500) NOT NULL,
  url TEXT NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  asignatura VARCHAR(255) NOT NULL,
  ciclo VARCHAR(50) NOT NULL,
  plataforma VARCHAR(100) NOT NULL,
  docente VARCHAR(255) NOT NULL,
  facultad VARCHAR(255) NOT NULL,
  publicado BOOLEAN DEFAULT false,
  descripcion TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento de búsquedas
CREATE INDEX IF NOT EXISTS idx_resources_user_id ON resources(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_ciclo ON resources(ciclo);
CREATE INDEX IF NOT EXISTS idx_resources_facultad ON resources(facultad);
CREATE INDEX IF NOT EXISTS idx_resources_tipo ON resources(tipo);
CREATE INDEX IF NOT EXISTS idx_resources_plataforma ON resources(plataforma);
CREATE INDEX IF NOT EXISTS idx_resources_publicado ON resources(publicado);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at DESC);

-- Comentarios para documentación
COMMENT ON TABLE resources IS 'Tabla de recursos educativos digitales';
COMMENT ON COLUMN resources.id IS 'Identificador único del recurso';
COMMENT ON COLUMN resources.titulo IS 'Nombre del recurso educativo';
COMMENT ON COLUMN resources.url IS 'URL de acceso al recurso';
COMMENT ON COLUMN resources.tipo IS 'Tipo de recurso (Video, Presentación, etc.)';
COMMENT ON COLUMN resources.asignatura IS 'Asignatura a la que pertenece el recurso';
COMMENT ON COLUMN resources.ciclo IS 'Ciclo académico (01-2025, 02-2025, etc.)';
COMMENT ON COLUMN resources.plataforma IS 'Plataforma donde está alojado (Canva, Genially, etc.)';
COMMENT ON COLUMN resources.docente IS 'Nombre del docente responsable';
COMMENT ON COLUMN resources.facultad IS 'Facultad a la que pertenece';
COMMENT ON COLUMN resources.publicado IS 'Estado de publicación del recurso';
COMMENT ON COLUMN resources.descripcion IS 'Descripción detallada del recurso';
COMMENT ON COLUMN resources.user_id IS 'Usuario que creó el recurso';
