# Scripts de Base de Datos - Sistema de Recursos Educativos UTEC

## Orden de Ejecución

Ejecuta los scripts en el siguiente orden para crear la base de datos completa:

1. **01-create-users-table.sql** - Crea la tabla de usuarios
2. **02-create-resources-table.sql** - Crea la tabla de recursos educativos
3. **03-create-sessions-table.sql** - Crea la tabla de sesiones
4. **04-create-triggers.sql** - Crea triggers para actualización automática
5. **05-seed-data.sql** - (Opcional) Inserta datos de prueba
6. **06-create-views.sql** - Crea vistas para reportes y estadísticas

## Estructura de la Base de Datos

### Tabla: users
- **id**: UUID (Primary Key)
- **email**: VARCHAR(255) UNIQUE
- **password**: VARCHAR(255) - Contraseña hasheada
- **name**: VARCHAR(255)
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### Tabla: resources
- **id**: UUID (Primary Key)
- **titulo**: VARCHAR(500)
- **url**: TEXT
- **tipo**: VARCHAR(100) - Video, Presentación, Documento, etc.
- **asignatura**: VARCHAR(255)
- **ciclo**: VARCHAR(50) - Formato: 01-2025, 02-2025
- **plataforma**: VARCHAR(100) - Canva, Genially, Flickbook, Lumi
- **docente**: VARCHAR(255)
- **facultad**: VARCHAR(255)
- **publicado**: BOOLEAN
- **descripcion**: TEXT
- **user_id**: UUID (Foreign Key → users)
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

### Tabla: sessions
- **id**: UUID (Primary Key)
- **user_id**: UUID (Foreign Key → users)
- **expires_at**: TIMESTAMP
- **created_at**: TIMESTAMP

## Vistas Disponibles

### v_recursos_publicados
Muestra todos los recursos publicados con información del usuario creador.

### v_estadisticas_facultad
Estadísticas agregadas por facultad (total recursos, publicados, borradores, docentes, ciclos).

### v_estadisticas_ciclo
Estadísticas agregadas por ciclo académico (recursos, facultades, tipos, plataformas).

## Notas Importantes

- Todos los IDs usan UUID para mayor seguridad
- Las contraseñas deben ser hasheadas antes de insertarse (usar bcrypt)
- Los triggers actualizan automáticamente el campo `updated_at`
- Las relaciones usan `ON DELETE CASCADE` para mantener integridad referencial
- Los índices están optimizados para búsquedas frecuentes

## Integración con Next.js

Para usar estos scripts con tu aplicación Next.js:

1. Conecta una base de datos PostgreSQL (Supabase, Neon, etc.)
2. Ejecuta los scripts en orden desde v0 o desde tu cliente SQL
3. Actualiza las variables de entorno con la URL de conexión
4. Modifica los archivos de acciones para usar consultas SQL reales en lugar del almacenamiento en memoria

## Ejemplo de Conexión

\`\`\`typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Ejemplo de consulta
const resources = await sql`
  SELECT * FROM resources 
  WHERE ciclo = ${ciclo} 
  ORDER BY created_at DESC
`;
