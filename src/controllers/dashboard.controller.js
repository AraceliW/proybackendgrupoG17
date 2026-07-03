const dashboardService = require('../services/dashboard.service');

const obtenerDashboard = async (req, res) => {
  try {
    const dashboard = await dashboardService.obtenerDashboard(req.query);

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener dashboard',
      error: error.message
    });
  }
};

module.exports = {
  obtenerDashboard
};