-- Tabla de sesiones para autenticación
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Comentarios para documentación
COMMENT ON TABLE sessions IS 'Tabla de sesiones activas de usuarios';
COMMENT ON COLUMN sessions.id IS 'Identificador único de la sesión';
COMMENT ON COLUMN sessions.user_id IS 'Usuario asociado a la sesión';
COMMENT ON COLUMN sessions.expires_at IS 'Fecha y hora de expiración de la sesión';
