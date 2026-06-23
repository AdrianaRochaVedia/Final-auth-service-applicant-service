const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserApp = require('../models/UserApp');
const { generarJWT } = require('../helpers/jwt');

// Login
const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await UserApp.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ ok: false, msg: 'Credenciales incorrectas' });
    }

    const valid = bcrypt.compareSync(password, usuario.password_hash);
    if (!valid) {
      return res.status(400).json({ ok: false, msg: 'Credenciales incorrectas' });
    }

    const token = await generarJWT(usuario.id, usuario.email, usuario.role);
    const decoded = jwt.decode(token);

    res.json({
      ok: true,
      usuario: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      },
      token,
      exp: decoded.exp,
      iat: decoded.iat
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al iniciar sesión' });
  }
};

// Revalidar token
const revalidarToken = async (req, res) => {
  const { userId, userEmail, userRole } = req;

  try {
    const token = await generarJWT(userId, userEmail, userRole);
    const decoded = jwt.decode(token);
    res.json({ 
      ok: true, 
      token,
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al renovar el token' });
  }
};

module.exports = {
  loginUsuario,
  revalidarToken
};