const express = require('express');

const {
  listarCompras,
  obtenerCompraPorId
} = require('../controllers/adminCompra.controller');

const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

const router = express.Router();

router.get(
  '/',
  verificarToken,
  verificarRol('admin'),
  listarCompras
);

router.get(
  '/:id',
  verificarToken,
  verificarRol('admin'),
  obtenerCompraPorId
);

module.exports = router;