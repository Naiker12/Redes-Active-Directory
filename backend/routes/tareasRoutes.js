const express = require('express');
const router = express.Router();
const db = require('../database');
const requireAuth = require('../middleware/auth');

/**
 * Middleware para asegurar que todas las rutas de tareas requieran autenticación.
 */
router.use(requireAuth);

/**
 * GET /api/tareas
 * Obtiene el listado de tareas del usuario autenticado.
 */
router.get('/', (req, res) => {
  try {
    const tareas = db.get('tareas')
      .filter({ username: req.session.user.username })
      .orderBy(['createdAt'], ['desc'])
      .value();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ message: 'Error al recuperar las tareas.' });
  }
});

/**
 * POST /api/tareas
 * Agrega una nueva tarea al listado personal.
 */
router.post('/', (req, res) => {
  const { titulo, estado } = req.body;
  if (!titulo) return res.status(400).json({ message: 'El título de la tarea es obligatorio.' });

  try {
    const newId = Date.now();
    const nuevaTarea = {
      id: newId,
      username: req.session.user.username,
      titulo,
      estado: estado || 'Pendiente',
      createdAt: new Date().toISOString()
    };
    
    db.get('tareas').push(nuevaTarea).write();
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar la tarea.' });
  }
});

/**
 * PATCH /api/tareas/:id
 * Actualiza el estado o título de una tarea específica.
 */
router.patch('/:id', (req, res) => {
  const { estado, titulo } = req.body;
  try {
    const task = db.get('tareas')
      .find({ id: parseInt(req.params.id) || req.params.id, username: req.session.user.username })
      .value();
      
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada.' });

    const updates = {
      titulo: titulo || task.titulo,
      estado: estado || task.estado
    };

    db.get('tareas')
      .find({ id: task.id })
      .assign(updates)
      .write();
    
    res.json({ ...task, ...updates });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la tarea.' });
  }
});

/**
 * DELETE /api/tareas/:id
 * Elimina una tarea del sistema.
 */
router.delete('/:id', (req, res) => {
  try {
    const result = db.get('tareas')
      .remove({ id: parseInt(req.params.id) || req.params.id, username: req.session.user.username })
      .write();
      
    if (result.length === 0) return res.status(404).json({ message: 'No se pudo eliminar la tarea.' });
    res.json({ message: 'Tarea eliminada.' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno al borrar.' });
  }
});

module.exports = router;
