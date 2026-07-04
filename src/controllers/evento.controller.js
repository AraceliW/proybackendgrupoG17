const eventoService = require('../services/evento.service');

const listarEventos = async (req, res) => {
  try {
    const eventos = await eventoService.listar(req.query);
    res.json(eventos);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar eventos',
      error: error.message
    });
  }
};

const obtenerEventoPorId = async (req, res) => {
  try {
    const evento = await eventoService.obtenerPorId(req.params.id);

    if (!evento) {
      return res.status(404).json({
        mensaje: 'Evento no encontrado'
      });
    }

    res.json(evento);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener evento',
      error: error.message
    });
  }
};

const crearEvento = async (req, res) => {
  try {

    const { nombre, categoriaDeporte, fecha, hora, estadio, ciudad } = req.body;

    if (!nombre || !categoriaDeporte || !fecha || !hora || !estadio || !ciudad) {
      return res.status(400).json({
        mensaje: 'Faltan datos obligatorios del evento'
      });
    }

    const evento = await eventoService.crear(req.body);

    res.status(201).json({
      mensaje: 'Evento creado correctamente',
      evento
    });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al crear evento',
      error: error.message
    });
  }
};

const actualizarEvento = async (req, res) => {
  try {
    const evento = await eventoService.actualizar(req.params.id, req.body);

    if (!evento) {
      return res.status(404).json({
        mensaje: 'Evento no encontrado'
      });
    }

    res.json({
      mensaje: 'Evento actualizado correctamente',
      evento
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar evento',
      error: error.message
    });
  }
};
const subirImagenesEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await eventoService.obtenerPorId(id);

    if (!evento) {
      return res.status(404).json({
        mensaje: 'Evento no encontrado'
      });
    }

    const imagenBanner = req.files?.imagenBanner?.[0]
      ? `/uploads/eventos/${req.files.imagenBanner[0].filename}`
      : evento.imagenBanner;

    const imagenMiniatura = req.files?.imagenMiniatura?.[0]
      ? `/uploads/eventos/${req.files.imagenMiniatura[0].filename}`
      : evento.imagenMiniatura;

    const galeriaImagenes = req.files?.galeriaImagenes
      ? req.files.galeriaImagenes.map(file => `/uploads/eventos/${file.filename}`)
      : evento.galeriaImagenes;

    await evento.update({
      imagenBanner,
      imagenMiniatura,
      galeriaImagenes
    });

    res.json({
      mensaje: 'Imágenes del evento actualizadas correctamente',
      evento
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al subir imágenes del evento',
      error: error.message
    });
  }
};

const eliminarEvento = async (req, res) => {
  try {
    const evento = await eventoService.eliminarLogico(req.params.id);

    if (!evento) {
      return res.status(404).json({
        mensaje: 'Evento no encontrado'
      });
    }

    res.json({
      mensaje: 'Evento eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar evento',
      error: error.message
    });
  }
};

module.exports = {
  listarEventos,
  obtenerEventoPorId,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  subirImagenesEvento
};