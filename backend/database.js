const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const adapter = new FileSync(path.join(__dirname, 'db.json'));
const db = low(adapter);

/**
 * Definición del Esquema Inicial (Defaults)
 */
db.defaults({
  usuarios: [],
  notas: [],
  tareas: [],
  permisos: []
}).write();

console.log('Base de Datos JSON (lowdb) inicializada correctamente.');

module.exports = db;
