const homeService = require('../services/home.service');

const obtenerEventosHome = async (req, res) => {
  try {
    const eventos = await homeService.obtenerEventosHome(req.query);

    res.json({
      total: eventos.length,
      eventos
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener eventos del home',
      error: error.message
    });
  }
};
const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await homeService.obtenerCategorias();

    res.json({
      total: categorias.length,
      categorias
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener categorías',
      error: error.message
    });
  }
};
const obtenerDetalleEvento = async (req, res) => {
  try {
    const evento = await homeService.obtenerDetalleEvento(req.params.id);

    if (!evento) {
      return res.status(404).json({
        mensaje: 'Evento no encontrado'
      });
    }

    res.json(evento);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener detalle del evento',
      error: error.message
    });
  }
};

const obtenerEventosDestacados = async (req, res) => {
  try {
    const eventos = await homeService.obtenerEventosDestacados();

    res.json({
      total: eventos.length,
      eventos
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener eventos destacados',
      error: error.message
    });
  }
};

const obtenerCiudades = async (req, res) => {
  try {
    const ciudades = await homeService.obtenerCiudades();

    res.json({
      total: ciudades.length,
      ciudades
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener ciudades',
      error: error.message
    });
  }
};

const obtenerProximosEventos = async (req, res) => {
  try {
    const eventos = await homeService.obtenerProximosEventos();

    res.json({
      total: eventos.length,
      eventos
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener próximos eventos',
      error: error.message
    });
  }
};

module.exports = {
  obtenerEventosHome,
  obtenerDetalleEvento,
  obtenerEventosDestacados,
  obtenerCategorias,
  obtenerCiudades,
  obtenerProximosEventos
};