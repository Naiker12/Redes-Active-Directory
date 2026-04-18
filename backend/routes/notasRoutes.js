const express = require('express');
const router = express.Router();
const db = require('../database');
const requireAuth = require('../middleware/auth');

/**
 * Middleware para asegurar que todas las rutas de notas requieran autenticación.
 */
router.use(requireAuth);

/**
 * GET /api/notas
 * Obtiene todas las notas asociadas al usuario autenticado.
 */
router.get('/', (req, res) => {
  try {
    const notas = db.get('notas')
      .filter({ username: req.session.user.username })
      .orderBy(['createdAt'], ['desc'])
      .value();
    res.json(notas);
  } catch (error) {
    res.status(500).json({ message: 'Error al recuperar las notas.' });
  }
});

/**
 * POST /api/notas
 * Crea una nueva nota para el usuario actual.
 */
router.post('/', (req, res) => {
  const { titulo, contenido } = req.body;
  if (!titulo) return res.status(400).json({ message: 'El título es obligatorio.' });

  try {
    const newId = Date.now();
    const nuevaNota = {
      id: newId,
      username: req.session.user.username,
      titulo,
      contenido,
      createdAt: new Date().toISOString()
    };
    
    db.get('notas').push(nuevaNota).write();
    res.status(201).json(nuevaNota);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar la nota.' });
  }
});

/**
 * DELETE /api/notas/:id
 * Elimina una nota específica verificando que pertenezca al usuario.
 */
router.delete('/:id', (req, res) => {
  try {
    const result = db.get('notas')
      .remove({ id: parseInt(req.params.id) || req.params.id, username: req.session.user.username })
      .write();
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Nota no encontrada o permiso denegado.' });
    }
    res.json({ message: 'Nota eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la nota.' });
  }
});

module.exports = router;
