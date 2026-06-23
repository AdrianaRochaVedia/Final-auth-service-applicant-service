const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
  register,
  login,
  getMe,
  logout,
  revalidarToken
} = require('../controllers/auth');

const router = Router();

router.post(
  '/register',
  [
    check('full_name', 'El nombre completo es obligatorio').notEmpty(),
    check('email', 'El email es obligatorio y debe ser válido').isEmail(),
    check('password', 'La contraseña debe tener mínimo 8 caracteres').isLength({ min: 8 }),
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

module.exports = router;