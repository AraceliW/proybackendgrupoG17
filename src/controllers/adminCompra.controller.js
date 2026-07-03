const adminCompraService = require('../services/adminCompra.service');

const listarCompras = async (req, res) => {
  try {
    const compras = await adminCompraService.listarCompras(req.query);

    res.json({
      total: compras.length,
      compras
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar compras',
      error: error.message
    });
  }
};

const obtenerCompraPorId = async (req, res) => {
  try {
    const compra = await adminCompraService.obtenerCompraPorId(req.params.id);

    if (!compra) {
      return res.status(404).json({
        mensaje: 'Compra no encontrada'
      });
    }

    res.json(compra);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener compra',
      error: error.message
    });
  }
};

module.exports = {
  listarCompras,
  obtenerCompraPorId
};