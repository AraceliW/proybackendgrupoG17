const reclamoService = require('../services/reclamo.service');

const crearReclamo = async (req, res) => {
  try {
    const reclamo = await reclamoService.crear(req.usuario.id, req.body);

    res.status(201).json({
      mensaje: 'Reclamo creado correctamente',
      reclamo
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al crear reclamo',
      error: error.message
    });
  }
};

const listarReclamos = async (req, res) => {
  try {
    const reclamos = await reclamoService.listarTodos();
    res.json(reclamos);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar reclamos',
      error: error.message
    });
  }
};

const misReclamos = async (req, res) => {
  try {
    const reclamos = await reclamoService.listarPorUsuario(req.usuario.id);
    res.json(reclamos);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar mis reclamos',
      error: error.message
    });
  }
};

const responderReclamo = async (req, res) => {
  try {
    const reclamo = await reclamoService.responder(req.params.id, req.body);

    if (!reclamo) {
      return res.status(404).json({
        mensaje: 'Reclamo no encontrado'
      });
    }

    res.json({
      mensaje: 'Reclamo respondido correctamente',
      reclamo
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al responder reclamo',
      error: error.message
    });
  }
};

module.exports = {
  crearReclamo,
  listarReclamos,
  misReclamos,
  responderReclamo
};