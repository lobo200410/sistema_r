# Configuración de MySQL para el Sistema de Recursos Educativos

## Pasos para conectar tu base de datos MySQL

### 1. Asegúrate de que MySQL esté corriendo
Si usas XAMPP, inicia el servicio MySQL desde el panel de control.

### 2. Verifica que la base de datos esté creada
Abre MySQL Workbench y verifica que la base de datos `recursos_educativos` existe con todas las tablas.

### 3. Configura las variables de entorno

En v0, ve a la sección **"Vars"** en el panel lateral izquierdo y agrega estas variables:

- `DB_HOST` = `localhost` (o la IP de tu servidor MySQL)
- `DB_USER` = `root` (o tu usuario de MySQL)
- `DB_PASSWORD` = tu contraseña de MySQL
- `DB_NAME` = `recursos_educativos`
- `DB_PORT` = `3306`

### 4. Prueba la conexión

Una vez configuradas las variables de entorno, el sistema debería conectarse automáticamente a tu base de datos MySQL.

## Solución de problemas

### Error: "Cannot connect to MySQL"
- Verifica que MySQL esté corriendo
- Verifica que las credenciales sean correctas
- Verifica que el puerto 3306 esté abierto

### Error: "Database does not exist"
- Ejecuta los scripts SQL en MySQL Workbench en el orden correcto
- Verifica que el nombre de la base de datos sea exactamente `recursos_educativos`

### Error: "Access denied"
- Verifica el usuario y contraseña en las variables de entorno
- Asegúrate de que el usuario tenga permisos en la base de datos

## Conexión remota (opcional)

Si tu MySQL está en otro servidor:
1. Cambia `DB_HOST` a la IP del servidor
2. Asegúrate de que el firewall permita conexiones al puerto 3306
3. Verifica que MySQL permita conexiones remotas
