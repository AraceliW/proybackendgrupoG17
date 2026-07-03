const express = require('express');

const {
  obtenerEventosHome,
  obtenerDetalleEvento,
  obtenerEventosDestacados,
  obtenerCategorias,
  obtenerCiudades,
  obtenerProximosEventos
} = require('../controllers/home.controller');

const router = express.Router();

router.get('/eventos', obtenerEventosHome);
router.get('/eventos/:id', obtenerDetalleEvento);
router.get('/destacados', obtenerEventosDestacados);
router.get('/categorias', obtenerCategorias);
router.get('/ciudades', obtenerCiudades);
router.get('/proximos', obtenerProximosEventos);

module.exports = router;