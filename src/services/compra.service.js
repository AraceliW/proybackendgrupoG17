const { Compra, DetalleCompra, TipoEntrada, Evento, Ticket } = require('../models');
const ticketService = require('./ticket.service');
const emailService = require('./email.service');
const { Usuario } = require('../models');

const reservarCompra = async (usuarioId, data) => {
  const { tipoEntradaId, cantidad } = data;

  const tipoEntrada = await TipoEntrada.findByPk(tipoEntradaId);

  if (!tipoEntrada) {
    return { error: 'Tipo de entrada no encontrado' };
  }

  if (tipoEntrada.estado !== 'disponible') {
    return { error: 'Este tipo de entrada no está disponible' };
  }

  if (tipoEntrada.stockDisponible < cantidad) {
    return { error: 'No hay stock suficiente' };
  }

  const precioUnitario = Number(tipoEntrada.precio);
  const subtotal = precioUnitario * cantidad;
  const total = subtotal;

  const fechaVencimiento = new Date();
  fechaVencimiento.setMinutes(fechaVencimiento.getMinutes() + 10);

  const compra = await Compra.create({
    usuarioId,
    codigoCompra: `DIB-${Date.now()}`,
    estado: 'pendiente',
    subtotal,
    comision: 0,
    total,
    fechaVencimiento
  });

  await DetalleCompra.create({
    compraId: compra.id,
    tipoEntradaId,
    cantidad,
    precioUnitario,
    subtotal
  });

  await tipoEntrada.update({
    stockDisponible: tipoEntrada.stockDisponible - cantidad,
    stockReservado: tipoEntrada.stockReservado + cantidad
  });

  return { compra };
};

const confirmarCompra = async (compraId, usuarioId) => {
  const compra = await Compra.findOne({
    where: {
      id: compraId,
      usuarioId
    },
    include: [
      {
        model: DetalleCompra,
        as: 'detalles'
      }
    ]
  });

  if (!compra) {
    return { error: 'Compra no encontrada' };
  }

  if (compra.estado !== 'pendiente') {
    return { error: 'La compra no está pendiente' };
  }

  if (new Date() > compra.fechaVencimiento) {
    compra.estado = 'expirada';
    await compra.save();
    return { error: 'La reserva expiró' };
  }

  compra.estado = 'confirmada';
  compra.fechaConfirmacion = new Date();

  await compra.save();
  const ticket = await ticketService.crearTicket(compra);
  const usuario = await Usuario.findByPk(usuarioId);

    await emailService.enviarTicketPorEmail({
    usuario,
    ticket,
    compra
    });

  return { compra, ticket };  
};

const listarMisCompras = async (usuarioId) => {
  return await Compra.findAll({
    where: { usuarioId },
    include: [
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
      },
      {
        model: Ticket,
        as: 'ticket'
      }
    ],
    order: [['fechaCompra', 'DESC']]
  });
};

module.exports = {
  reservarCompra,
  confirmarCompra,
  listarMisCompras
};