const mercadoPagoService = require('../services/mercadoPago.service');

const crearPreferenciaPago = async (req, res) => {
  try {
    const resultado = await mercadoPagoService.crearPreferenciaPago(
      req.params.compraId,
      req.usuario.id
    );

    if (resultado.error) {
      return res.status(400).json({
        mensaje: resultado.error
      });
    }

    res.json({
      mensaje: 'Preferencia de pago creada correctamente',
      ...resultado
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al crear preferencia de pago',
      error: error.message
    });
  }
};

const recibirWebhook = async (req, res) => {
  try {
    const resultado = await mercadoPagoService.procesarWebhook(req.body);

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al procesar webhook',
      error: error.message
    });
  }
};

module.exports = {
  crearPreferenciaPago,
  recibirWebhook
};