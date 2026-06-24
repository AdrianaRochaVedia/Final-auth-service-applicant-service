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
  getProfileStatus,
  getApplicantByUserId
} = require('../controllers/applicantController');

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
    check('document_type').optional().isIn(['CI', 'PASAPORTE', 'RUC']).withMessage('Tipo de documento inválido'),
    check('monthly_income').optional().isNumeric().withMessage('El ingreso mensual debe ser un número'),
    check('employment_status').optional().isIn(['EMPLEADO', 'INDEPENDIENTE', 'DESEMPLEADO', 'ESTUDIANTE', 'JUBILADO']).withMessage('Estado de empleo inválido'),
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

router.get(
  '/user/:userId',
  [validarJWT],
  getApplicantByUserId
);
module.exports = router;