const { Op } = require('sequelize');
const { Evento, TipoEntrada } = require('../models');
const { Compra, DetalleCompra } = require('../models');

const obtenerEventosHome = async (filtros = {}) => {
  const { buscar, categoria, ciudad, fecha } = filtros;

  const where = {
    estado: 'activo'
  };

  if (buscar) {
    where.nombre = {
      [Op.iLike]: `%${buscar}%`
    };
  }

  if (categoria) {
    where.categoriaDeporte = categoria;
  }

  if (ciudad) {
    where.ciudad = ciudad;
  }

  if (fecha) {
    where.fecha = fecha;
  }

  const eventos = await Evento.findAll({
    where,
    include: [
      {
        model: TipoEntrada,
        as: 'tiposEntrada'
      }
    ],
    order: [['fecha', 'ASC']]
  });

  return eventos.map((evento) => {
    const precioDesde =
      evento.tiposEntrada.length > 0
        ? Math.min(...evento.tiposEntrada.map((t) => Number(t.precio)))
        : 0;

    const stockDisponible = evento.tiposEntrada.reduce(
      (total, tipo) => total + tipo.stockDisponible,
      0
    );

    let estadoVisual = 'Próximo';

    if (new Date(evento.fecha) < new Date()) {
      estadoVisual = 'Finalizado';
    }

    if (stockDisponible === 0) {
      estadoVisual = 'Agotado';
    }

    return {
      id: evento.id,
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      categoriaDeporte: evento.categoriaDeporte,
      fecha: evento.fecha,
      hora: evento.hora,
      estadio: evento.estadio,
      ciudad: evento.ciudad,
      imagenBanner: evento.imagenBanner,
      imagenMiniatura: evento.imagenMiniatura,
      precioDesde,
      estado: estadoVisual
    };
  });
};

const obtenerCategorias = async () => {
  const eventos = await Evento.findAll({
    where: { estado: 'activo' },
    attributes: ['categoriaDeporte'],
    group: ['categoriaDeporte'],
    order: [['categoriaDeporte', 'ASC']]
  });

  return eventos.map(evento => evento.categoriaDeporte);
};

const obtenerDetalleEvento = async (id) => {
  const evento = await Evento.findByPk(id, {
    where: {
      estado: 'activo'
    },
    include: [
      {
        model: TipoEntrada,
        as: 'tiposEntrada'
      }
    ]
  });

  if (!evento) return null;

  const stockDisponible = evento.tiposEntrada.reduce(
    (total, tipo) => total + tipo.stockDisponible,
    0
  );

  let estadoVisual = 'Próximo';

  if (new Date(evento.fecha) < new Date()) {
    estadoVisual = 'Finalizado';
  }

  if (stockDisponible === 0) {
    estadoVisual = 'Agotado';
  }

  return {
    id: evento.id,
    nombre: evento.nombre,
    descripcion: evento.descripcion,
    categoriaDeporte: evento.categoriaDeporte,
    fecha: evento.fecha,
    hora: evento.hora,
    estadio: evento.estadio,
    ciudad: evento.ciudad,
    direccion: evento.direccion,
    latitud: evento.latitud,
    longitud: evento.longitud,
    youtubeVideoId: evento.youtubeVideoId,
    imagenBanner: evento.imagenBanner,
    estado: estadoVisual,
    entradas: evento.tiposEntrada.map((tipo) => ({
      id: tipo.id,
      nombre: tipo.nombre,
      descripcion: tipo.descripcion,
      precio: tipo.precio,
      stockDisponible: tipo.stockDisponible,
      estado: tipo.stockDisponible > 0 ? tipo.estado : 'agotado'
    }))
  };
};

const obtenerCiudades = async () => {
  const eventos = await Evento.findAll({
    where: { estado: 'activo' },
    attributes: ['ciudad'],
    group: ['ciudad'],
    order: [['ciudad', 'ASC']]
  });

  return eventos.map(evento => evento.ciudad);
};

const obtenerEventosDestacados = async () => {
  const eventos = await Evento.findAll({
    where: { estado: 'activo' },
    include: [
      {
        model: TipoEntrada,
        as: 'tiposEntrada',
        include: [
          {
            model: DetalleCompra,
            as: 'detallesCompra',
            include: [
              {
                model: Compra,
                as: 'compra',
                where: { estado: 'confirmada' },
                required: false
              }
            ],
            required: false
          }
        ]
      }
    ]
  });

  const destacados = eventos.map((evento) => {
    let entradasVendidas = 0;

    evento.tiposEntrada.forEach((tipo) => {
      tipo.detallesCompra.forEach((detalle) => {
        if (detalle.compra) {
          entradasVendidas += detalle.cantidad;
        }
      });
    });

    const precioDesde =
      evento.tiposEntrada.length > 0
        ? Math.min(...evento.tiposEntrada.map((t) => Number(t.precio)))
        : 0;

    return {
      id: evento.id,
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      categoriaDeporte: evento.categoriaDeporte,
      fecha: evento.fecha,
      hora: evento.hora,
      estadio: evento.estadio,
      ciudad: evento.ciudad,
      imagenBanner: evento.imagenBanner,
      imagenMiniatura: evento.imagenMiniatura,
      precioDesde,
      entradasVendidas
    };
  });

  return destacados
    .sort((a, b) => b.entradasVendidas - a.entradasVendidas)
    .slice(0, 5);
};

const obtenerProximosEventos = async () => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const eventos = await Evento.findAll({
    where: {
      estado: 'activo',
      fecha: {
        [Op.gte]: hoy
      }
    },
    include: [
      {
        model: TipoEntrada,
        as: 'tiposEntrada'
      }
    ],
    order: [['fecha', 'ASC']],
    limit: 10
  });

  return eventos.map((evento) => {
    const precioDesde =
      evento.tiposEntrada.length > 0
        ? Math.min(...evento.tiposEntrada.map((t) => Number(t.precio)))
        : 0;

    const fechaEvento = new Date(evento.fecha);
    const diferenciaMs = fechaEvento - hoy;
    const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

    return {
      id: evento.id,
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      categoriaDeporte: evento.categoriaDeporte,
      fecha: evento.fecha,
      hora: evento.hora,
      ciudad: evento.ciudad,
      estadio: evento.estadio,
      imagenMiniatura: evento.imagenMiniatura,
      imagenBanner: evento.imagenBanner,
      precioDesde,
      diasRestantes
    };
  });
};

module.exports = {
  obtenerEventosHome,
  obtenerDetalleEvento,
  obtenerCategorias,
  obtenerProximosEventos,
  obtenerEventosDestacados,
  obtenerCiudades
};