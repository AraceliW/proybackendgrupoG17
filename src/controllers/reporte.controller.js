const reporteService = require('../services/reporte.service');

const reporteVentas = async (req, res) => {
  try {
    const ventas = await reporteService.reporteVentas(req.query);

    res.json({
      total: ventas.length,
      ventas
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener reporte de ventas',
      error: error.message
    });
  }
};

module.exports = {
  reporteVentas
};