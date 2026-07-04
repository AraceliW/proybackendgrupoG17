const express = require('express');
const {
  reservarCompra,
  confirmarCompra,
  listarMisCompras
} = require('../controllers/compra.controller');

const verificarToken = require('../middlewares/auth.middleware');
const validarCampos = require('../middlewares/validator.middleware');

const {
  validarReservaCompra
} = require('../validators/compra.validator');

const router = express.Router();


router.post('/reservar', verificarToken, validarReservaCompra, validarCampos, reservarCompra);
router.get('/mis-compras', verificarToken, listarMisCompras);
router.post('/:id/confirmar', verificarToken, confirmarCompra);


module.exports = router;