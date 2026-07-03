const express = require('express');

const {
  crearReclamo,
  listarReclamos,
  misReclamos,
  responderReclamo
} = require('../controllers/reclamo.controller');

const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

const router = express.Router();

router.post('/', verificarToken, crearReclamo);

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
  responderReclamo
);

module.exports = router;