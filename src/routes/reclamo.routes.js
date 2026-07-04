const express = require('express');

const {
  crearReclamo,
  listarReclamos,
  misReclamos,
  responderReclamo
} = require('../controllers/reclamo.controller');

const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');
const validarCampos = require('../middlewares/validator.middleware');

const {
  validarCrearReclamo,
  validarResponderReclamo
} = require('../validators/reclamo.validator');

const router = express.Router();

router.post('/', verificarToken, validarCrearReclamo, validarCampos, crearReclamo);

router.get(
  '/',
  verificarToken,
  verificarRol('admin'),
  listarReclamos
);

router.get(
  '/mis-reclamos',
  verificarToken,
  misReclamos
);

router.put(
  '/:id/responder',
  verificarToken,
  verificarRol('admin'),
  validarResponderReclamo,
  validarCampos,
  responderReclamo
);

module.exports = router;