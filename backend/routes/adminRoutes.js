const express = require('express');
const router = express.Router();
const db = require('../database');
const requireAuth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { syncAdPermission } = require('../services/adPermissions');

const VALID_PERMISSIONS = new Set(['notas', 'tareas', 'reportes']);

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
router.post('/permisos', async (req, res) => {
  const { username, permiso } = req.body;
  if (!username || !permiso) return res.status(400).json({ message: 'Faltan campos requeridos.' });
  if (!VALID_PERMISSIONS.has(permiso)) {
    return res.status(400).json({ message: 'El permiso solicitado no es válido.' });
  }

  try {
    const user = username.toLowerCase();
    const adResult = await syncAdPermission({ username: user, permission: permiso, action: 'add' });
    const existing = db.get('permisos').find({ username: user, permiso }).value();
    
    if (!existing) {
      db.get('permisos').push({ username: user, permiso }).write();
    }
    res.json({
      message: adResult.message,
      adSynced: adResult.synced,
      storedLocally: true
    });
  } catch (error) {
    res.status(error.statusCode || 502).json({
      message: error.message || 'Error al registrar permiso en AD.'
    });
  }
});

/**
 * DELETE /api/admin/permisos
 * Revoca un permiso específico.
 */
router.delete('/permisos/:username/:permiso', async (req, res) => {
  try {
    if (!VALID_PERMISSIONS.has(req.params.permiso)) {
      return res.status(400).json({ message: 'El permiso solicitado no es válido.' });
    }

    const adResult = await syncAdPermission({
      username: req.params.username.toLowerCase(),
      permission: req.params.permiso,
      action: 'delete'
    });

    db.get('permisos')
      .remove({ username: req.params.username.toLowerCase(), permiso: req.params.permiso })
      .write();
    res.json({
      message: adResult.message,
      adSynced: adResult.synced,
      storedLocally: true
    });
  } catch (error) {
    res.status(error.statusCode || 502).json({
      message: error.message || 'Error al revocar privilegio en AD.'
    });
  }
});

module.exports = router;
