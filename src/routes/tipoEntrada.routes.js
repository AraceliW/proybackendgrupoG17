const express = require('express');

const {
  listarTiposPorEvento,
  crearTipoEntrada,
  actualizarTipoEntrada,
  eliminarTipoEntrada
} = require('../controllers/tipoEntrada.controller');

const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

const router = express.Router();

router.get('/eventos/:eventoId/tipos-entrada', listarTiposPorEvento);

router.post(
  '/eventos/:eventoId/tipos-entrada',
  verificarToken,
  verificarRol('admin'),
  crearTipoEntrada
);

router.put(
  '/tipos-entrada/:id',
  verificarToken,
  verificarRol('admin'),
  actualizarTipoEntrada
);

router.delete(
  '/tipos-entrada/:id',
  verificarToken,
  verificarRol('admin'),
  eliminarTipoEntrada
);

module.exports = router;