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
    // Contar notas y tareas por estado usando lowdb/lodash
    const totalNotas = db.get('notas').filter({ username }).size().value();
    
    // Agrupar tareas por estado y contar
    const tareasUsuario = db.get('tareas').filter({ username }).value();
    const resumenTareas = Object.entries(
      tareasUsuario.reduce((acc, current) => {
        acc[current.estado] = (acc[current.estado] || 0) + 1;
        return acc;
      }, {})
    ).map(([estado, cantidad]) => ({ estado, cantidad }));
    
    res.json({
      totalNotas,
      resumenTareas,
      generadoEn: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar estadísticas.' });
  }
});

module.exports = router;
