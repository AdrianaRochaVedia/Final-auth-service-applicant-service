const validarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({
        ok: false,
        msg: 'Token no contiene rol'
      });
    }

    if (!rolesPermitidos.includes(req.userRole)) {
      return res.status(403).json({
        ok: false,
        msg: `Acceso denegado. Se requiere: ${rolesPermitidos.join(' o ')}`
      });
    }

    next();
  };
};

module.exports = { validarRol };