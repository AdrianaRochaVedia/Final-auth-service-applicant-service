const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRol } = require('../middlewares/validarRol');
const { passwordFuerte } = require('../helpers/validar-password');
const {
  register,
  login,
  getMe,
  logout,
  revalidarToken,
  getUsuarios,
  crearUsuario,
  cambiarStatus,
  eliminarUsuario
} = require('../controllers/auth');

const router = Router();

router.post(
  '/register',
  [
    check('full_name', 'El nombre completo es obligatorio').notEmpty(),
    check('email', 'El email es obligatorio y debe ser válido').isEmail(),
    check('password', 'Contraseña inválida').custom(passwordFuerte),
    check('role_name', 'El rol es obligatorio').notEmpty(),
    validarCampos
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'El email es obligatorio y debe ser válido').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
  ],
  login
);

router.get('/me', validarJWT, getMe);

router.post('/logout', validarJWT, logout);

router.get('/renew', validarJWT, revalidarToken);

router.get('/users', validarJWT, validarRol('ADMIN'), getUsuarios);

router.post(
  '/users',
  [
    //validarJWT,
    //validarRol('ADMIN'),
    check('full_name', 'El nombre completo es obligatorio').notEmpty(),
    check('email', 'El email es obligatorio y debe ser válido').isEmail(),
    check('password', 'Contraseña inválida').custom(passwordFuerte),
    check('role_name', 'El rol es obligatorio').notEmpty(),
    validarCampos
  ],
  crearUsuario
);

router.patch(
  '/users/:id/status',
  [
    validarJWT,
    validarRol('ADMIN'),
    check('status', 'El status es obligatorio').notEmpty(),
    check('status', 'Status inválido').isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
    validarCampos
  ],
  cambiarStatus
);

router.delete('/users/:id', validarJWT, validarRol('ADMIN'), eliminarUsuario);

module.exports = router;