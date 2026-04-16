require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

// Importación de rutas de la API
const authRoutes = require('./routes/authRoutes');
const notasRoutes = require('./routes/notasRoutes');
const tareasRoutes = require('./routes/tareasRoutes');
const reportesRoutes = require('./routes/reportesRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Configuración de Middlewares Globales
 */

// Procesamiento de JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS con soporte para credenciales (cookies)
app.use(cors({
  origin: true, 
  credentials: true,
}));

// Gestión de sesiones mediante cookies seguras
app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto-por-defecto-cambiar-en-env',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 8 * 60 * 60 * 1000 // Expiración en 8 horas
  }
}));

/**
 * Definición de Puntos de Entrada de la API
 */
app.use('/api/auth', authRoutes);
app.use('/api/notas', notasRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/admin', adminRoutes);

/**
 * Manejo de Archivos Estáticos y SPA (Producción)
 */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Redireccionar cualquier ruta no-API al index.html de React
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
  });
}

// Inicialización del servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor Backend iniciado con éxito en el puerto ${PORT}`);
  console.log(`   Modo: ${process.env.NODE_ENV || 'development'}`);
});
