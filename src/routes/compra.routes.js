const express = require('express');
const {
  reservarCompra,
  confirmarCompra,
  listarMisCompras
} = require('../controllers/compra.controller');

const verificarToken = require('../middlewares/auth.middleware');

const router = express.Router();


router.post('/reservar', verificarToken, reservarCompra);
router.get('/mis-compras', verificarToken, listarMisCompras);
router.post('/:id/confirmar', verificarToken, confirmarCompra);


module.exports = router;