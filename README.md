# Portal Corporativo de Gestión Administrativa y Redes

Este proyecto es una plataforma web de alta fidelidad diseñada para la gestión centralizada de identidades, notas administrativas, tareas y reportes, con integración nativa a **Active Directory (LDAP)**.

## 🚀 Arquitectura Tecnológica

### Frontend (User Interface)
*   **React 18 + Vite**: Framework base para una experiencia de usuario rápida y moderna.
*   **Tailwind CSS + Shadcn/UI**: Sistema de diseño basado en componentes premium, estandarizado exclusivamente en **Light Mode**.
*   **Base UI**: Utilizado para componentes complejos (`Sidebar`, `Tooltip`) garantizando accesibilidad y rendimiento.
*   **Magic UI**: Implementación de tarjetas animadas y efectos visuales de alta gama.
*   **Lucide React**: Set de iconos vectoriales consistentes.
*   **Zustand**: Gestión de estado ligero para persistencia de sesión y autenticación.

### Backend (Core API)
*   **Node.js + Express**: Servidor escalable para orquestación de servicios.
*   **LDAPjs**: Motor de comunicación con el controlador de dominio Active Directory.
*   **Better-SQLite3**: Base de datos local de alto rendimiento para persistencia de permisos y metadatos.
*   **Dotenv**: Gestión segura de variables de entorno.

---

## 🛠️ Guía de Instalación y Despliegue (Windows Server)

Esta guía detalla los pasos para subir el proyecto a un entorno de producción en un servidor Windows.

### 1. Requisitos Previos
*   Instalar **Node.js** (Versión 18 o superior).
*   Configurar el rol de **Servidor Web (IIS)** o usar un gestor de procesos como **PM2**.
*   Acceso de lectura al **Active Directory** (Servidor LDAP).

### 2. Configuración del Entorno (`.env`)
Crear un archivo `.env` en la raíz de la carpeta `backend/` con los siguientes parámetros:

```env
PORT=3000
# Configuración AD
AD_URL=ldap://tu-servidor-ad
AD_BASE_DN=OU=Usuarios,DC=dominio,DC=local
AD_ADMIN_DN=CN=AdminPortal,OU=ServiceAccounts,DC=dominio,DC=local
AD_ADMIN_PASSWORD=TuPasswordSegura
ADMIN_USERS=usuario_admin1,usuario_admin2
```

### 3. Preparación del Frontend
Desde la raíz del proyecto, ejecute:
```powershell
npm install
npm run build
```
Esto generará la carpeta `dist/`. Mueva estos archivos a su directorio de IIS (ej. `C:\inetpub\wwwroot\portal`).

### 4. Ejecución del Backend
En la carpeta `backend/`:
```powershell
npm install
# Opción A: Ejecución Directa
node server.js
# Opción B: Recomendado para Windows Service
npm install -g pm2
pm2 start server.js --name "redes-api"
pm2 save
```

---

## 🛡️ Control de Acceso y Auditoría

El portal utiliza un sistema de **Sincronización por Identidad**:
1.  **Autenticación**: El usuario ingresa sus credenciales de dominio.
2.  **Validación**: El servidor consulta al AD para verificar pertenencia y rol.
3.  **Autorización**: Se cargan los permisos específicos almacenados en la base de datos local (SQLite).

### Roles del Sistema
*   **Administrador AD**: Acceso total a la Consola de Auditoría y gestión de permisos.
*   **Usuario Estándar**: Acceso limitado a módulos según asignación previa.

---

## 🎨 Estándares de Diseño
*   **Tema**: Light Mode Clean (Blanco Corporativo).
*   **Bordes**: Radio de curvatura estandarizado a `1.5rem` (Premium Soft).
*   **Tipografía**: **Inter** (Integrada vía Google Fonts).
"# Redes-Active-Directory" 
