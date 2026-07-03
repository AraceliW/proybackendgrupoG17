const adminEventoService = require('../services/adminEvento.service');

const listarEventosAdmin = async (req, res) => {
  try {
    const eventos = await adminEventoService.listarEventosAdmin();

    res.json({
      total: eventos.length,
      eventos
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar eventos administrativos',
      error: error.message
    });
  }
};

module.exports = {
  listarEventosAdmin
};