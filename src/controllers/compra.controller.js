const compraService = require('../services/compra.service');

const reservarCompra = async (req, res) => {
  try {
    const resultado = await compraService.reservarCompra(req.usuario.id, req.body);

    if (resultado.error) {
      return res.status(400).json({
        mensaje: resultado.error
      });
    }

    res.status(201).json({
      mensaje: 'Reserva creada correctamente. Tenés 20 minutos para completar el pago.',
      compra: resultado.compra
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al reservar compra',
      error: error.message
    });
  }
};

const listarMisCompras = async (req, res) => {
  try {
    const compras = await compraService.listarMisCompras(req.usuario.id);

    res.json({
      total: compras.length,
      compras
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar mis compras',
      error: error.message
    });
  }
};

const confirmarCompra = async (req, res) => {
  try {
    const resultado = await compraService.confirmarCompra(
      req.params.id,
      req.usuario.id
    );

    if (resultado.error) {
      return res.status(400).json({
        mensaje: resultado.error
      });
    }

    res.json({
        mensaje: 'Compra confirmada correctamente. Ticket generado.',
        compra: resultado.compra,
        ticket: resultado.ticket
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al confirmar compra',
      error: error.message
    });
  }
};

module.exports = {
  reservarCompra,
  listarMisCompras,
  confirmarCompra
};