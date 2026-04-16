function adminOnly(req, res, next) {
  if (!req.session?.user?.isAdmin) {
    return res.status(403).json({ message: 'Acceso denegado: Se requiere rol de Administrador' });
  }
  next();
}

module.exports = adminOnly;
