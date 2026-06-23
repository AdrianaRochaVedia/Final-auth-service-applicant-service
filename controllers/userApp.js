const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserApp = require('../models/UserApp');
const { generarJWT } = require('../helpers/jwt');

// Registrar usuario
const registrarUsuario = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  try {
    const existe = await UserApp.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ ok: false, msg: 'El email ya está registrado' });
    }

    const rolesValidos = ['student', 'professor', 'admin'];
    if (!rolesValidos.includes(role)) {
      return res.status(400).json({ 
        ok: false, 
        msg: `Rol inválido. Roles válidos: ${rolesValidos.join(', ')}` 
      });
    }

    const salt = bcrypt.genSaltSync();
    const password_hash = bcrypt.hashSync(password, salt);

    const usuario = await UserApp.create({
      full_name,
      email,
      password_hash,
      role
    });

    const token = await generarJWT(usuario.id, usuario.email, usuario.role);
    const decoded = jwt.decode(token);

    res.status(201).json({
      ok: true,
      msg: 'Usuario registrado correctamente',
      usuario: {
        id: usuario.id,
        full_name: usuario.full_name,
        email: usuario.email,
        role: usuario.role
      },
      token,
      exp: decoded.exp
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al registrar el usuario' });
  }
};

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
  const { role, page, limit } = req.query;

  const pagina = parseInt(page) || 1;
  const limite = parseInt(limit) || 10;
  const offset = (pagina - 1) * limite;

  try {
    const where = { is_deleted: false };  // ← agrega esto
    if (role) where.role = role;

    const { count, rows } = await UserApp.findAndCountAll({
      where,
      limit: limite,
      offset,
      attributes: ['id', 'full_name', 'email', 'role', 'created_at']
    });

    res.json({
      ok: true,
      total: count,
      pagina,
      totalPaginas: Math.ceil(count / limite),
      usuarios: rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al obtener usuarios' });
  }
};

// Obtener usuario por id
const getUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await UserApp.findOne({
      where: { id, is_deleted: false },
      attributes: ['id', 'full_name', 'email', 'role', 'created_at']
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

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { userId, userRole } = req;
  const { full_name, email, role } = req.body;

  try {
    // Student y professor solo pueden actualizar su propio perfil
    if (['student', 'professor'].includes(userRole) && userId !== id) {
      return res.status(403).json({ ok: false, msg: 'No tienes permiso para editar este usuario' });
    }

    const usuario = await UserApp.findOne({ where: { id, is_deleted: false } });
    if (!usuario) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    // Solo admin puede cambiar el rol
    await usuario.update({
      ...(full_name && { full_name }),
      ...(email && { email }),
      ...(role && userRole === 'admin' && { role })
    });

    res.json({ ok: true, msg: 'Usuario actualizado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al actualizar el usuario' });
  }
};

// Eliminar usuario lógicamente
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await UserApp.findOne({ where: { id, is_deleted: false } });
    if (!usuario) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    await usuario.update({ is_deleted: true });

    res.json({ ok: true, msg: 'Usuario eliminado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al eliminar el usuario' });
  }
};

module.exports = {
  registrarUsuario,
  getUsuarios,
  getUsuario,
  actualizarUsuario,
  eliminarUsuario
};