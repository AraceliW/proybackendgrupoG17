const express = require('express');

const {
  crearPreferenciaPago,
  recibirWebhook
} = require('../controllers/mercadoPago.controller');

const verificarToken = require('../middlewares/auth.middleware');


const router = express.Router();

router.post('/crear-preferencia/:compraId', verificarToken, crearPreferenciaPago);
router.post('/webhook', recibirWebhook);

module.exports = router;