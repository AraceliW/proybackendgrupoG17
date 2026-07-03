const { Ticket, Compra, Usuario, DetalleCompra, TipoEntrada, Evento } = require('../models');
const emailService = require('./email.service');

const listarTickets = async ({ estado }) => {
  const whereTicket = {};

  if (estado) {
    whereTicket.estado = estado;
  }

  return await Ticket.findAll({
    where: whereTicket,
    include: [
      {
        model: Compra,
        as: 'compra',
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'apellido', 'email']
          },
          {
            model: DetalleCompra,
            as: 'detalles',
            include: [
              {
                model: TipoEntrada,
                as: 'tipoEntrada',
                include: [
                  {
                    model: Evento,
                    as: 'evento'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

const obtenerTicketPorId = async (id) => {
  return await Ticket.findByPk(id, {
    include: [
      {
        model: Compra,
        as: 'compra',
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'apellido', 'email']
          },
          {
            model: DetalleCompra,
            as: 'detalles',
            include: [
              {
                model: TipoEntrada,
                as: 'tipoEntrada',
                include: [
                  {
                    model: Evento,
                    as: 'evento'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });
};

const cancelarTicket = async (id) => {
  const ticket = await Ticket.findByPk(id);

  if (!ticket) return null;

  await ticket.update({
    estado: 'cancelado'
  });

  return ticket;
};

const reenviarEmail = async (id) => {
  const ticket = await obtenerTicketPorId(id);

  if (!ticket) return null;

  const compra = ticket.compra;
  const usuario = compra.usuario;

  await emailService.enviarTicketPorEmail({
    usuario,
    ticket,
    compra
  });

  return ticket;
};

module.exports = {
  listarTickets,
  obtenerTicketPorId,
  cancelarTicket,
  reenviarEmail
};