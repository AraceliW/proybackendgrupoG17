const { Compra, DetalleCompra, TipoEntrada } = require('../models');
const { preference } = require('../config/mercadoPago');
const { Payment } = require('mercadopago');
const { MercadoPagoConfig } = require('mercadopago');
const compraService = require('./compra.service');

const crearPreferenciaPago = async (compraId, usuarioId) => {
  const compra = await Compra.findOne({
    where: {
      id: compraId,
      usuarioId,
      estado: 'pendiente'
    },
    include: [
      {
        model: DetalleCompra,
        as: 'detalles',
        include: [
          {
            model: TipoEntrada,
            as: 'tipoEntrada'
          }
        ]
      }
    ]
  });

  if (!compra) {
    return { error: 'Compra pendiente no encontrada' };
  }

  if (new Date() > compra.fechaVencimiento) {
    return { error: 'La reserva expiró' };
  }

  const items = compra.detalles.map((detalle) => ({
    id: String(detalle.tipoEntradaId),
    title: detalle.tipoEntrada.nombre,
    quantity: detalle.cantidad,
    unit_price: Number(detalle.precioUnitario),
    currency_id: 'ARS'
  }));

  const result = await preference.create({
    body: {
      items,
      external_reference: compra.codigoCompra,
      back_urls: {
        success: `${process.env.FRONTEND_URL}/pago/exito`,
        failure: `${process.env.FRONTEND_URL}/pago/error`,
        pending: `${process.env.FRONTEND_URL}/pago/pendiente`
      },
      notification_url: `${process.env.BACKEND_URL}/api/mercadopago/webhook`
    }
  });

  return {
    preferenceId: result.id,
    initPoint: result.init_point,
    sandboxInitPoint: result.sandbox_init_point
  };
};

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const payment = new Payment(client);

const procesarWebhook = async (body) => {
  const paymentId = body?.data?.id || body?.id;

  if (!paymentId) {
    return { mensaje: 'Webhook recibido sin paymentId' };
  }

  const pago = await payment.get({ id: paymentId });

  if (pago.status === 'approved') {
    const codigoCompra = pago.external_reference;

    const compra = await Compra.findOne({
      where: { codigoCompra }
    });

    if (!compra) {
      return { error: 'Compra no encontrada' };
    }

    if (compra.estado === 'confirmada') {
      return { mensaje: 'Compra ya confirmada' };
    }

    const resultado = await compraService.confirmarCompra(
      compra.id,
      compra.usuarioId
    );

    return {
      mensaje: 'Pago aprobado y compra confirmada',
      resultado
    };
  }

  return {
    mensaje: `Pago recibido con estado: ${pago.status}`
  };
};

module.exports = {
  crearPreferenciaPago,
  procesarWebhook
};