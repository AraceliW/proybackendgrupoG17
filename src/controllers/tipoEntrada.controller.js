const tipoEntradaService = require('../services/tipoEntrada.service');

const listarTiposPorEvento = async (req, res) => {
  try {
    const tiposEntrada = await tipoEntradaService.listarPorEvento(req.params.eventoId);

    res.json(tiposEntrada);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar tipos de entrada',
      error: error.message
    });
  }
};

const crearTipoEntrada = async (req, res) => {
  try {
    const tipoEntrada = await tipoEntradaService.crear(req.params.eventoId, req.body);

    if (!tipoEntrada) {
      return res.status(404).json({
        mensaje: 'Evento no encontrado'
      });
    }

    res.status(201).json({
      mensaje: 'Tipo de entrada creado correctamente',
      tipoEntrada
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al crear tipo de entrada',
      error: error.message
    });
  }
};

const actualizarTipoEntrada = async (req, res) => {
  try {
    const tipoEntrada = await tipoEntradaService.actualizar(req.params.id, req.body);

    if (!tipoEntrada) {
      return res.status(404).json({
        mensaje: 'Tipo de entrada no encontrado'
      });
    }

    res.json({
      mensaje: 'Tipo de entrada actualizado correctamente',
      tipoEntrada
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar tipo de entrada',
      error: error.message
    });
  }
};

const eliminarTipoEntrada = async (req, res) => {
  try {
    const tipoEntrada = await tipoEntradaService.eliminarLogico(req.params.id);

    if (!tipoEntrada) {
      return res.status(404).json({
        mensaje: 'Tipo de entrada no encontrado'
      });
    }

    res.json({
      mensaje: 'Tipo de entrada eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar tipo de entrada',
      error: error.message
    });
  }
};

module.exports = {
  listarTiposPorEvento,
  crearTipoEntrada,
  actualizarTipoEntrada,
  eliminarTipoEntrada
};