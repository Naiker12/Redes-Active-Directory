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
    const tareas = db.prepare('SELECT * FROM tareas WHERE username = ? ORDER BY createdAt DESC')
      .all(req.session.user.username);
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
    const info = db.prepare('INSERT INTO tareas (username, titulo, estado) VALUES (?, ?, ?)')
      .run(req.session.user.username, titulo, estado || 'Pendiente');
    res.status(201).json({ id: info.lastInsertRowid, titulo, estado: estado || 'Pendiente' });
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
    const task = db.prepare('SELECT * FROM tareas WHERE id = ? AND username = ?').get(req.params.id, req.session.user.username);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada.' });

    const finalTitulo = titulo || task.titulo;
    const finalEstado = estado || task.estado;

    db.prepare('UPDATE tareas SET titulo = ?, estado = ? WHERE id = ?')
      .run(finalTitulo, finalEstado, req.params.id);
    
    res.json({ id: req.params.id, titulo: finalTitulo, estado: finalEstado });
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
    const info = db.prepare('DELETE FROM tareas WHERE id = ? AND username = ?')
      .run(req.params.id, req.session.user.username);
    if (info.changes === 0) return res.status(404).json({ message: 'No se pudo eliminar la tarea.' });
    res.json({ message: 'Tarea eliminada.' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno al borrar.' });
  }
});

module.exports = router;
