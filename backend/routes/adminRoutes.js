const express = require('express');
const router = express.Router();
const db = require('../database');
const requireAuth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

/**
 * Filtros de seguridad críticos: Requieren sesión activa Y rol de Administrador.
 */
router.use(requireAuth, adminOnly);

/**
 * GET /api/admin/permisos
 * Lista todos los permisos asignados en el sistema (Solo para Admins).
 */
router.get('/permisos', (req, res) => {
  try {
    const allPermisos = db.prepare('SELECT * FROM permisos').all();
    res.json(allPermisos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener privilegios.' });
  }
});

/**
 * POST /api/admin/permisos
 * Asigna un nuevo permiso a un usuario del dominio.
 */
router.post('/permisos', (req, res) => {
  const { username, permiso } = req.body;
  if (!username || !permiso) return res.status(400).json({ message: 'Faltan campos requeridos.' });

  try {
    db.prepare('INSERT OR IGNORE INTO permisos (username, permiso) VALUES (?, ?)')
      .run(username.toLowerCase(), permiso);
    res.json({ message: 'Permiso asignado con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar permiso.' });
  }
});

/**
 * DELETE /api/admin/permisos
 * Revoca un permiso específico.
 */
router.delete('/permisos/:username/:permiso', (req, res) => {
  try {
    db.prepare('DELETE FROM permisos WHERE username = ? AND permiso = ?')
      .run(req.params.username.toLowerCase(), req.params.permiso);
    res.json({ message: 'Permiso revocado.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al revocar privilegio.' });
  }
});

module.exports = router;
