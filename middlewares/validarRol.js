const { response } = require('express');

const validarRol = (...roles) => {
  return (req, res = response, next) => {
    if (!req.userRole) {
      return res.status(401).json({
        ok: false,
        msg: 'No hay token en la petición'
      });
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        ok: false,
        msg: `Acceso denegado. Se requiere uno de estos roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = { validarRol };