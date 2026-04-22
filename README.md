# Redes App

Guia rapida para ejecutar el proyecto paso a paso en entorno local o en Windows Server 2012, incluyendo backend, frontend, PM2 y pruebas con Active Directory.

## Estructura del proyecto

```text
d:\redes-app
  backend\
  frontend\
```

## 1. Configurar `backend/.env`

Archivo:

```text
d:\redes-app\backend\.env
```

Ejemplo:

```env
PORT=3000
SESSION_SECRET=super_clave_larga_y_segura

AD_URL=ldap://192.168.1.10
AD_BASE_DN=DC=tudominio,DC=local
AD_ADMIN_DN=CN=ldapservice,CN=Users,DC=tudominio,DC=local
AD_ADMIN_PASSWORD=TuClaveDeServicio

AD_PERMISSION_GROUP_NOTAS=CN=Grupo_Notas,CN=Users,DC=tudominio,DC=local
AD_PERMISSION_GROUP_TAREAS=CN=Grupo_Tareas,CN=Users,DC=tudominio,DC=local
AD_PERMISSION_GROUP_REPORTES=CN=Grupo_Reportes,CN=Users,DC=tudominio,DC=local

ADMIN_USERS=administrador,admin,gomez
NODE_ENV=development
```

Notas:

- Si vas a probar con bypass local, usa `NODE_ENV=development`.
- Si vas a probar contra Active Directory real, usa `NODE_ENV=production`.
- El backend usa estas variables para autenticacion LDAP: `AD_URL`, `AD_BASE_DN`, `AD_ADMIN_DN`, `AD_ADMIN_PASSWORD`.
- Para sincronizar permisos con AD tambien se usan `AD_PERMISSION_GROUP_NOTAS`, `AD_PERMISSION_GROUP_TAREAS` y `AD_PERMISSION_GROUP_REPORTES`.
- Si quieres que la pantalla de administracion cambie grupos de AD, agrega tambien `AD_PERMISSION_GROUP_NOTAS`, `AD_PERMISSION_GROUP_TAREAS` y `AD_PERMISSION_GROUP_REPORTES`.
- La cuenta de servicio de AD debe tener permisos para leer usuarios y modificar la membresia de los grupos configurados.

## 2. Instalar dependencias del backend

Abrir PowerShell y ejecutar:

```powershell
cd d:\redes-app\backend
npm install
```

## 3. Correr el backend

### Opcion A: modo desarrollo

Permite usar el bypass con password `admin123`.

```powershell
cd d:\redes-app\backend
npm run dev
```

API:

```text
http://localhost:3000/api
```

### Opcion B: modo normal

```powershell
cd d:\redes-app\backend
node server.js
```

## 4. Correr el frontend

### Opcion A: frontend separado en local

Deja el backend en `development`.

Terminal 1:

```powershell
cd d:\redes-app\backend
npm run dev
```

Terminal 2:

```powershell
cd d:\redes-app\frontend
python -m http.server 5500
```

Abrir en el navegador:

```text
http://localhost:5500/
```

### Opcion B: frontend servido por el backend

Esto requiere `production`.

```powershell
cd d:\redes-app\backend
$env:NODE_ENV="production"
node server.js
```

Abrir en el navegador:

```text
http://localhost:3000/
```

Importante:

- En este modo ya no funciona el bypass `admin123`.
- Aqui debe autenticar contra Active Directory real.

## 5. Login de prueba

### Si `NODE_ENV=development`

Puedes entrar con:

- usuario: `usuario@dominio.com`
- password: `admin123`

### Si `NODE_ENV=production`

Debes usar:

- usuario real del Active Directory
- password real del Active Directory

## 6. Instalar PM2 en Windows Server 2012

Instalar PM2 global:

```powershell
npm install -g pm2
```

Verificar:

```powershell
pm2 -v
```

## 7. Correr backend con PM2

```powershell
cd d:\redes-app\backend
pm2 start server.js --name redes-app
```

Ver procesos:

```powershell
pm2 list
```

Ver logs:

```powershell
pm2 logs redes-app
```

Reiniciar:

```powershell
pm2 restart redes-app
```

Detener:

```powershell
pm2 stop redes-app
```

Eliminar proceso:

```powershell
pm2 delete redes-app
```

Guardar configuracion:

```powershell
pm2 save
```

## 8. Correr con PM2 en produccion

Si quieres que el backend sirva tambien el frontend:

```powershell
cd d:\redes-app\backend
pm2 delete redes-app
$env:NODE_ENV="production"
pm2 start server.js --name redes-app
pm2 save
```

Abrir:

```text
http://localhost:3000/
```

## 9. Probar Active Directory

Debes confirmar que `backend/.env` tenga valores reales:

```env
AD_URL=ldap://IP_DEL_SERVIDOR_AD
AD_BASE_DN=DC=tudominio,DC=local
AD_ADMIN_DN=CN=usuario_servicio,CN=Users,DC=tudominio,DC=local
AD_ADMIN_PASSWORD=clave_real
AD_PERMISSION_GROUP_NOTAS=CN=Grupo_Notas,CN=Users,DC=tudominio,DC=local
AD_PERMISSION_GROUP_TAREAS=CN=Grupo_Tareas,CN=Users,DC=tudominio,DC=local
AD_PERMISSION_GROUP_REPORTES=CN=Grupo_Reportes,CN=Users,DC=tudominio,DC=local
NODE_ENV=production
```

Luego iniciar o reiniciar:

```powershell
cd d:\redes-app\backend
pm2 restart redes-app
```

O directo:

```powershell
cd d:\redes-app\backend
$env:NODE_ENV="production"
node server.js
```

## 10. Si sale `Cannot GET /`

Eso significa casi siempre que:

- el backend esta corriendo,
- pero esta en `development`,
- y por eso no esta sirviendo `frontend/`.

Solucion 1:

```powershell
cd d:\redes-app\backend
$env:NODE_ENV="production"
node server.js
```

Solucion 2:

```powershell
cd d:\redes-app\frontend
python -m http.server 5500
```

## 11. Flujo recomendado

### Prueba local rapida

Terminal 1:

```powershell
cd d:\redes-app\backend
npm run dev
```

Terminal 2:

```powershell
cd d:\redes-app\frontend
python -m http.server 5500
```

Abrir:

```text
http://localhost:5500/
```

### Prueba real con Active Directory

Configurar `.env` con datos reales y luego:

```powershell
cd d:\redes-app\backend
$env:NODE_ENV="production"
node server.js
```

Abrir:

```text
http://localhost:3000/
```

## 12. Comandos resumen

### Backend dev

```powershell
cd d:\redes-app\backend
npm run dev
```

### Backend normal

```powershell
cd d:\redes-app\backend
node server.js
```

### Frontend local

```powershell
cd d:\redes-app\frontend
python -m http.server 5500
```

### Backend y frontend desde Express

```powershell
cd d:\redes-app\backend
$env:NODE_ENV="production"
node server.js
```

### PM2

```powershell
cd d:\redes-app\backend
pm2 start server.js --name redes-app
pm2 list
pm2 logs redes-app
```
