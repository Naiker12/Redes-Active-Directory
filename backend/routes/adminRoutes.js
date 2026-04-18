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
    const allPermisos = db.get('permisos').value();
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
    const user = username.toLowerCase();
    const existing = db.get('permisos').find({ username: user, permiso }).value();
    
    if (!existing) {
      db.get('permisos').push({ username: user, permiso }).write();
    }
    res.json({ message: 'Permiso procesado con éxito.' });
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
    db.get('permisos')
      .remove({ username: req.params.username.toLowerCase(), permiso: req.params.permiso })
      .write();
    res.json({ message: 'Permiso revocado.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al revocar privilegio.' });
  }
});

module.exports = router;
