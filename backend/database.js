const Database = require('better-sqlite3');
const path = require('path');

/**
 * Inicialización de la Base de Datos SQLite
 * Se utiliza better-sqlite3 para un rendimiento óptimo en modo síncrono.
 */
const db = new Database(path.join(__dirname, 'app.db'));

// Habilitar integridad de claves foráneas
db.pragma('foreign_keys = ON');

/**
 * Definición del Esquema de la Base de Datos
 * Se ejecutan las sentencias DDL para asegurar que las tablas existan al iniciar.
 */
db.exec(`
  -- Tabla de usuarios sincronizados desde Active Directory
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    displayName TEXT,
    email TEXT,
    lastLogin DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabla para el módulo de Notas
  CREATE TABLE IF NOT EXISTS notas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    titulo TEXT NOT NULL,
    contenido TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabla para el módulo de Tareas (Kanban)
  CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    titulo TEXT NOT NULL,
    estado TEXT DEFAULT 'Pendiente',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabla de permisos específicos (control de acceso fino)
  CREATE TABLE IF NOT EXISTS permisos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    permiso TEXT NOT NULL,
    UNIQUE(username, permiso)
  );
`);

module.exports = db;
