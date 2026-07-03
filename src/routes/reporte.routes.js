const express = require('express');

const {
  reporteVentas
} = require('../controllers/reporte.controller');

const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

const router = express.Router();

router.get(
  '/ventas',
  verificarToken,
  verificarRol('admin'),
  reporteVentas
);

module.exports = router;