const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const { generarJWT } = require('../helpers/jwt');

// Registrar usuario
const register = async (req, res) => {
  const { full_name, email, password, phone, role_name } = req.body;

  try {
    const existe = await User.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ ok: false, msg: 'El email ya está registrado' });
    }

    const role = await Role.findOne({ where: { name: role_name || 'SOLICITANTE' } });
    if (!role) {
      return res.status(400).json({ ok: false, msg: 'Rol no válido' });
    }

    const salt = bcrypt.genSaltSync();
    const password_hash = bcrypt.hashSync(password, salt);

    const usuario = await User.create({
      full_name,
      email,
      password_hash,
      phone,
      role_id: role.id
    });

    const token = await generarJWT(usuario.id, usuario.email, role.name);
    const decoded = jwt.decode(token);

    res.status(201).json({
      ok: true,
      msg: 'Usuario registrado correctamente',
      usuario: {
        id: usuario.id,
        full_name: usuario.full_name,
        email: usuario.email,
        phone: usuario.phone,
        role: role.name
      },
      token,
      exp: decoded.exp
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al registrar el usuario' });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role', attributes: ['name'] }]
    });

    if (!usuario) {
      return res.status(400).json({ ok: false, msg: 'Credenciales incorrectas' });
    }

    if (usuario.status !== 'ACTIVE') {
      return res.status(403).json({ ok: false, msg: 'Usuario inactivo o suspendido' });
    }

    const valid = bcrypt.compareSync(password, usuario.password_hash);
    if (!valid) {
      return res.status(400).json({ ok: false, msg: 'Credenciales incorrectas' });
    }

    const token = await generarJWT(usuario.id, usuario.email, usuario.role.name);
    const decoded = jwt.decode(token);

    res.json({
      ok: true,
      usuario: {
        id: usuario.id,
        full_name: usuario.full_name,
        email: usuario.email,
        role: usuario.role.name
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

// Obtener usuario autenticado
const getMe = async (req, res) => {
  const { userId } = req;

  try {
    const usuario = await User.findOne({
      where: { id: userId, status: 'ACTIVE' },
      attributes: ['id', 'full_name', 'email', 'phone', 'status', 'created_at'],
      include: [{ model: Role, as: 'role', attributes: ['name', 'description'] }]
    });

    if (!usuario) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    res.json({ ok: true, usuario });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al obtener el usuario' });
  }
};

// Logout (revalidar token / invalidar en cliente)
const logout = async (req, res) => {
  try {
    // El cliente descarta el token — sin blacklist por ahora
    res.json({ ok: true, msg: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al cerrar sesión' });
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

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: ['id', 'full_name', 'email', 'phone', 'status', 'created_at'],
      include: [{ model: Role, as: 'role', attributes: ['name'] }]
    });

    res.json({
      ok: true,
      usuarios: usuarios.map((u) => ({
        id: u.id,
        fullName: u.full_name,
        email: u.email,
        phone: u.phone,
        role: u.role.name,
        status: u.status,
        createdAt: u.created_at
      }))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al obtener usuarios' });
  }
};

// Crear usuario con cualquier rol
const crearUsuario = async (req, res) => {
  const { full_name, email, password, role_name, phone } = req.body;

  try {
    const existe = await User.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ ok: false, msg: 'El email ya está registrado' });
    }

    const role = await Role.findOne({ where: { name: role_name || 'SOLICITANTE' } });
    if (!role) {
      return res.status(400).json({ ok: false, msg: 'Rol no válido' });
    }

    const salt = bcrypt.genSaltSync();
    const password_hash = bcrypt.hashSync(password, salt);

    const usuario = await User.create({
      full_name,
      email,
      password_hash,
      phone,
      role_id: role.id
    });

    res.status(201).json({
      ok: true,
      msg: 'Usuario creado correctamente',
      usuario: {
        id: usuario.id,
        fullName: usuario.full_name,
        email: usuario.email,
        phone: usuario.phone,
        role: role.name,
        status: usuario.status,
        createdAt: usuario.created_at
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al crear el usuario' });
  }
};

// Cambiar status del usuario
const cambiarStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const usuario = await User.findOne({ where: { id } });
    if (!usuario) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    await usuario.update({ status, updated_at: new Date() });

    res.json({ ok: true, msg: `Usuario ${status === 'ACTIVE' ? 'activado' : 'desactivado'} correctamente` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al cambiar el estado del usuario' });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await User.findOne({ where: { id } });
    if (!usuario) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    await usuario.destroy();

    res.json({ ok: true, msg: 'Usuario eliminado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al eliminar el usuario' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  revalidarToken,
  getUsuarios,      
  crearUsuario,     
  cambiarStatus,    
  eliminarUsuario   
};