const express = require('express');

const {
  listarTickets,
  obtenerTicketPorId,
  cancelarTicket,
  reenviarEmail
} = require('../controllers/adminTicket.controller');

const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

const router = express.Router();

router.get('/', verificarToken, verificarRol('admin'), listarTickets);

router.get('/:id', verificarToken, verificarRol('admin'), obtenerTicketPorId);

router.put('/:id/cancelar', verificarToken, verificarRol('admin'), cancelarTicket);

router.post('/:id/reenviar-email', verificarToken, verificarRol('admin'), reenviarEmail);

module.exports = router;