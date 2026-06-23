const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRol } = require('../middlewares/validarRol');
const {
  crearApplicant,
  getApplicant,
  actualizarApplicant,
  subirDocumento,
  getProfileStatus
} = require('../controllers/');

const router = Router();

router.post(
  '/',
  [
    validarJWT,
    validarRol('SOLICITANTE'),
    check('document_type', 'El tipo de documento es obligatorio').notEmpty(),
    check('document_type', 'Tipo de documento inválido').isIn(['CI', 'PASAPORTE', 'RUC']),
    check('document_number', 'El número de documento es obligatorio').notEmpty(),
    validarCampos
  ],
  crearApplicant
);

router.get(
  '/:id',
  [
    validarJWT,
    validarRol('SOLICITANTE', 'ANALISTA', 'REGULADOR')
  ],
  getApplicant
);

router.put(
  '/:id',
  [
    validarJWT,
    validarRol('SOLICITANTE'),
    check('document_type', 'Tipo de documento inválido').optional().isIn(['CI', 'PASAPORTE', 'RUC']),
    check('monthly_income', 'El ingreso mensual debe ser un número').optional().isNumeric(),
    check('employment_status', 'Estado de empleo inválido').optional().isIn(['EMPLEADO', 'INDEPENDIENTE', 'DESEMPLEADO', 'ESTUDIANTE', 'JUBILADO']),
    validarCampos
  ],
  actualizarApplicant
);

router.post(
  '/:id/identity-document',
  [
    validarJWT,
    validarRol('SOLICITANTE'),
    check('document_front_url', 'La URL del frente del documento es obligatoria').notEmpty(),
    validarCampos
  ],
  subirDocumento
);

router.get(
  '/:id/profile-status',
  [
    validarJWT,
    validarRol('SOLICITANTE', 'ANALISTA', 'REGULADOR')
  ],
  getProfileStatus
);

module.exports = router;