const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { passwordFuerte } = require('../helpers/validar-password');
const {
  loginUsuario,
  revalidarToken
} = require('../controllers/auth');

const router = Router();

router.post(
  '/login',
  [
    check('email', 'El email es obligatorio y debe ser válido').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
  ],
  loginUsuario
);

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;