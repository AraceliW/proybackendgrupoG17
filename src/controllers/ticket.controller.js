const { Ticket } = require('../models');

const validarTicket = async (req, res) => {
  try {
    const { codigoTicket } = req.params;

    const ticket = await Ticket.findOne({
      where: { codigoTicket }
    });

    if (!ticket) {
      return res.status(404).json({
        mensaje: 'Ticket no encontrado'
      });
    }

    if (ticket.estado === 'usado') {
      return res.status(400).json({
        mensaje: 'Este ticket ya fue utilizado'
      });
    }

    if (ticket.estado === 'cancelado') {
      return res.status(400).json({
        mensaje: 'Este ticket fue cancelado'
      });
    }

    await ticket.update({
      estado: 'usado'
    });

    res.json({
      mensaje: 'Ticket válido. Ingreso permitido.',
      ticket
    });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al validar ticket',
      error: error.message
    });
  }
};

module.exports = {
  validarTicket
};