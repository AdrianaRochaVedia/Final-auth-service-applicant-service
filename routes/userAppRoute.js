const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRol } = require('../middlewares/validarRol');
const {
  registrarUsuario,
  getUsuarios,
  getUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/userApp');

const router = Router();

// Registrar usuario — solo admin
router.post(
  '/register',
  [
    validarJWT,
    validarRol('admin'),
    check('full_name', 'El nombre completo es obligatorio').not().isEmpty(),
    check('email', 'El email debe ser válido').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('role', 'El rol es obligatorio').not().isEmpty(),
    validarCampos
  ],
  registrarUsuario
);

// Obtener todos los usuarios — admin y professor
router.get(
  '/',
  [
    validarJWT,
    validarRol('admin', 'professor')
  ],
  getUsuarios
);

// Obtener usuario por id — admin y professor
router.get(
  '/:id',
  [
    validarJWT,
    validarRol('admin', 'professor'),
    check('id', 'El id debe ser un UUID válido').isUUID(),
    validarCampos
  ],
  getUsuario
);

// Actualizar usuario — admin puede actualizar cualquiera
router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'El id debe ser un UUID válido').isUUID(),
    check('full_name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    check('email').optional().isEmail().withMessage('El email debe ser válido'),
    validarCampos
  ],
  actualizarUsuario
);

// Eliminar usuario  solo admin
router.patch(
  '/:id',
  [
    validarJWT,
    validarRol('admin'),
    check('id', 'El id debe ser un UUID válido').isUUID(),
    validarCampos
  ],
  eliminarUsuario
);

module.exports = router;