const express = require('express');
const router = express.Router();
const db = require('../database');
const requireAuth = require('../middleware/auth');

/**
 * Middleware para asegurar acceso autenticado.
 */
router.use(requireAuth);

/**
 * GET /api/reportes/stats
 * Genera estadísticas básicas de uso del portal para el usuario actual.
 */
router.get('/stats', (req, res) => {
  const username = req.session.user.username;
  
  try {
    // Contar notas y tareas por estado
    const countNotas = db.prepare('SELECT COUNT(*) as total FROM notas WHERE username = ?').get(username).total;
    const statsTareas = db.prepare('SELECT estado, COUNT(*) as cantidad FROM tareas WHERE username = ? GROUP BY estado').all(username);
    
    res.json({
      totalNotas: countNotas,
      resumenTareas: statsTareas,
      generadoEn: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar estadísticas.' });
  }
});

module.exports = router;
