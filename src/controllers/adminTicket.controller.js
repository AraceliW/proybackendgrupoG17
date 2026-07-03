const adminTicketService = require('../services/adminTicket.service');

const listarTickets = async (req, res) => {
  try {
    const tickets = await adminTicketService.listarTickets(req.query);

    res.json({
      total: tickets.length,
      tickets
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar tickets',
      error: error.message
    });
  }
};

const obtenerTicketPorId = async (req, res) => {
  try {
    const ticket = await adminTicketService.obtenerTicketPorId(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        mensaje: 'Ticket no encontrado'
      });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener ticket',
      error: error.message
    });
  }
};

const cancelarTicket = async (req, res) => {
  try {
    const ticket = await adminTicketService.cancelarTicket(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        mensaje: 'Ticket no encontrado'
      });
    }

    res.json({
      mensaje: 'Ticket cancelado correctamente',
      ticket
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al cancelar ticket',
      error: error.message
    });
  }
};

const reenviarEmail = async (req, res) => {
  try {
    const ticket = await adminTicketService.reenviarEmail(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        mensaje: 'Ticket no encontrado'
      });
    }

    res.json({
      mensaje: 'Email reenviado correctamente',
      ticket
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al reenviar email',
      error: error.message
    });
  }
};

module.exports = {
  listarTickets,
  obtenerTicketPorId,
  cancelarTicket,
  reenviarEmail
};