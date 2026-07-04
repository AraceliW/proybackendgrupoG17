const express = require('express');

const {
  listarTiposPorEvento,
  crearTipoEntrada,
  actualizarTipoEntrada,
  eliminarTipoEntrada
} = require('../controllers/tipoEntrada.controller');

const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

const validarCampos = require('../middlewares/validator.middleware');

const {
  validarTipoEntrada
} = require('../validators/tipoEntrada.validator');

const router = express.Router();

router.get('/eventos/:eventoId/tipos-entrada', listarTiposPorEvento);

router.post(
  '/eventos/:eventoId/tipos-entrada',
  verificarToken,
  verificarRol('admin'),
  validarTipoEntrada,
  validarCampos,
  crearTipoEntrada
);

router.put(
  '/tipos-entrada/:id',
  verificarToken,
  verificarRol('admin'),
  validarTipoEntrada,
  validarCampos,
  actualizarTipoEntrada
);

router.delete(
  '/tipos-entrada/:id',
  verificarToken,
  verificarRol('admin'),
  validarTipoEntrada,
  validarCampos,
  eliminarTipoEntrada
);

module.exports = router;