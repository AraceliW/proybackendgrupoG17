const { Compra, DetalleCompra, TipoEntrada } = require('../models');
const { preference } = require('../config/mercadoPago');
const { Payment } = require('mercadopago');
const { MercadoPagoConfig } = require('mercadopago');
const { MerchantOrder } = require('mercadopago');
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
const merchantOrder = new MerchantOrder(client);

const procesarWebhook = async (body, query) => {
  console.log('========== WEBHOOK MERCADO PAGO ==========');
  console.log('Body:', body);
  console.log('Query:', query);

  const topic = query?.topic || query?.type || body?.topic || body?.type;

  const id =
    body?.data?.id ||
    query?.['data.id'] ||
    query?.id ||
    body?.resource ||
    body?.id;

  console.log('Topic:', topic);
  console.log('ID recibido:', id);

  if (!id) {
    return { mensaje: 'Webhook recibido sin ID' };
  }

  try {
    let pago = null;

    if (topic === 'payment' || body?.type === 'payment') {
      pago = await payment.get({ id });
    }

    if (topic === 'merchant_order') {
      const orden = await merchantOrder.get({ merchantOrderId: id });

      if (!orden.payments || orden.payments.length === 0) {
        return { mensaje: 'Orden recibida sin pagos asociados todavía' };
      }

      const pagoAprobado = orden.payments.find(
        (p) => p.status === 'approved'
      );

      if (!pagoAprobado) {
        return {
          mensaje: 'Orden recibida, pero sin pago aprobado',
          estado: orden.order_status
        };
      }

      pago = await payment.get({ id: pagoAprobado.id });
    }

    if (!pago) {
      return {
        mensaje: 'Webhook ignorado: no corresponde a un pago procesable'
      };
    }

    console.log('Pago consultado:', pago.status);

    if (pago.status !== 'approved') {
      return {
        mensaje: `Pago recibido con estado: ${pago.status}`
      };
    }

    const codigoCompra = pago.external_reference;

    if (!codigoCompra) {
      return {
        mensaje: 'Pago aprobado sin external_reference'
      };
    }

    const compra = await Compra.findOne({
      where: { codigoCompra }
    });

    if (!compra) {
      return {
        mensaje: 'Compra no encontrada para este pago'
      };
    }

    if (compra.estado === 'confirmada') {
      return {
        mensaje: 'Compra ya confirmada'
      };
    }

    const resultado = await compraService.confirmarCompra(
      compra.id,
      compra.usuarioId
    );

    return {
      mensaje: 'Pago aprobado y compra confirmada',
      resultado
    };
  } catch (error) {
    console.log('Webhook ignorado por error controlado:', error.message);

    return {
      mensaje: 'Webhook recibido pero no procesado',
      error: error.message
    };
  }
};

module.exports = {
  crearPreferenciaPago,
  procesarWebhook
};