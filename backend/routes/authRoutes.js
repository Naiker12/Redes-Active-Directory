const express = require('express');
const router = express.Router();
const { authenticate } = require('ldap-authentication');
const db = require('../database');
const {
  getAdPermissionsForUser,
  getPermissionsFromMemberOf
} = require('../services/adPermissions');
require('dotenv').config();

const USUARIOS_ADMIN = (process.env.ADMIN_USERS || '').split(',').map(u => u.trim().toLowerCase());

/**
 * RUTA: POST /api/auth/login
 * Maneja la autenticación contra Active Directory o un bypass en desarrollo.
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Se requiere usuario y contraseña institucional.' });
  }

  /**
   * ACCESO DE DESARROLLO (Bypass)
   * Permite el login sin conexión a AD durante pruebas locales.
   */
  if (process.env.NODE_ENV === 'development' && password === 'admin123') {
    console.log('Utilizando bypass de desarrollo para login...');
    const sAMAccountName = username.split('@')[0].toLowerCase();
    const esAdmin = USUARIOS_ADMIN.includes(sAMAccountName);

    // Sincronización básica con DB local (lowdb)
    const existingUser = db.get('usuarios').find({ username: sAMAccountName }).value();
    if (existingUser) {
      db.get('usuarios').find({ username: sAMAccountName }).assign({ lastLogin: new Date().toISOString() }).write();
    } else {
      db.get('usuarios').push({
        username: sAMAccountName,
        displayName: sAMAccountName,
        email: username,
        lastLogin: new Date().toISOString()
      }).write();
    }

    const permisos = db.get('permisos')
      .filter({ username: sAMAccountName })
      .value()
      .map(r => r.permiso);

    const usuarioSesion = {
      username: sAMAccountName,
      displayName: sAMAccountName,
      email: username,
      isAdmin: esAdmin,
      permissions: esAdmin ? ['notas', 'tareas', 'reportes'] : permisos,
    };

    req.session.user = usuarioSesion;
    return res.json(usuarioSesion);
  }

  /**
   * AUTENTICACIÓN REAL CONTRA ACTIVE DIRECTORY (LDAP)
   */
  try {
    const usuarioAD = await authenticate({
      ldapOpts: {
        url: process.env.AD_URL,
        tlsOptions: { rejectUnauthorized: false },
      },
      adminDn: process.env.AD_ADMIN_DN,
      adminPassword: process.env.AD_ADMIN_PASSWORD,
      userPassword: password,
      userSearchBase: process.env.AD_BASE_DN,
      usernameAttribute: 'sAMAccountName',
      username: username,
      attributes: ['sAMAccountName', 'displayName', 'mail', 'memberOf', 'userAccountControl'],
    });

    // Verificar si la cuenta está deshabilitada (UAC Flag 2)
    const accountControl = parseInt(usuarioAD.userAccountControl || '0');
    if (accountControl & 2) {
      return res.status(401).json({ message: 'Su cuenta está deshabilitada en el dominio.' });
    }

    const sAMAccountName = (usuarioAD.sAMAccountName || username).toLowerCase();
    const esAdmin = USUARIOS_ADMIN.includes(sAMAccountName);
    const permisosAD = getPermissionsFromMemberOf(usuarioAD.memberOf);

    // Registro o actualización en la base de datos local (lowdb)
    const existingSync = db.get('usuarios').find({ username: sAMAccountName }).value();
    if (existingSync) {
      db.get('usuarios')
        .find({ username: sAMAccountName })
        .assign({
          displayName: usuarioAD.displayName || sAMAccountName,
          lastLogin: new Date().toISOString()
        })
        .write();
    } else {
      db.get('usuarios').push({
        username: sAMAccountName,
        displayName: usuarioAD.displayName || sAMAccountName,
        email: usuarioAD.mail || '',
        lastLogin: new Date().toISOString()
      }).write();
    }

    const permisos = permisosAD !== null
      ? permisosAD
      : db.get('permisos')
          .filter({ username: sAMAccountName })
          .value()
          .map(r => r.permiso);

    const usuarioSesion = {
      username: sAMAccountName,
      displayName: usuarioAD.displayName || sAMAccountName,
      email: usuarioAD.mail || '',
      isAdmin: esAdmin,
      permissions: esAdmin ? ['notas', 'tareas', 'reportes'] : permisos,
    };

    req.session.user = usuarioSesion;
    res.json(usuarioSesion);

  } catch (error) {
    console.error('Error LDAP:', error.message);
    if (error.code === 49 || error.message?.includes('Invalid credentials')) {
      return res.status(401).json({ message: 'Credenciales de dominio inválidas.' });
    }
    res.status(500).json({ message: 'Error de comunicación con el servidor AD.' });
  }
});

/**
 * RUTA: GET /api/auth/me
 * Retorna la información del usuario en sesión con permisos actualizados.
 */
router.get('/me', (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Sesión no encontrada.' });
  }

  const { username, isAdmin } = req.session.user;

  const permisosPromise = async () => {
    const permisosAD = await getAdPermissionsForUser(username);
    if (permisosAD !== null) {
      return permisosAD;
    }

    return db.get('permisos')
      .filter({ username })
      .value()
      .map(r => r.permiso);
  };

  permisosPromise()
    .then((permisos) => {
      const usuarioActualizado = {
        ...req.session.user,
        permissions: isAdmin ? ['notas', 'tareas', 'reportes'] : permisos,
      };

      req.session.user = usuarioActualizado;
      res.json(usuarioActualizado);
    })
    .catch(() => {
      const permisos = db.get('permisos')
        .filter({ username })
        .value()
        .map(r => r.permiso);

      const usuarioActualizado = {
        ...req.session.user,
        permissions: isAdmin ? ['notas', 'tareas', 'reportes'] : permisos,
      };

      req.session.user = usuarioActualizado;
      res.json(usuarioActualizado);
    });
});

/**
 * RUTA: POST /api/auth/logout
 * Finaliza la sesión y limpia las cookies correspondientes.
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al cerrar la sesión.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Sesión finalizada correctamente.' });
  });
});

module.exports = router;
