const express = require('express');
const { validarTicket } = require('../controllers/ticket.controller');

const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

const router = express.Router();

router.post(
  '/validar/:codigoTicket',
  verificarToken,
  verificarRol('admin'),
  validarTicket
);

module.exports = router;