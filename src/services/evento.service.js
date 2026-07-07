const { Op } = require('sequelize');
const { Evento, TipoEntrada } = require('../models');
const { obtenerCoordenadas } = require('./googleMaps.service');

const listar = async ({ buscar, fecha, estado }) => {
  const where = {
    estado: 'activo'
  };

  if (buscar) {
    where.nombre = {
      [Op.iLike]: `%${buscar}%`
    };
  }

  if (fecha) {
    where.fecha = fecha;
  }

  if (estado) {
    where.estado = estado;
  }

  return await Evento.findAll({
    where,
    include: [
      {
        model: TipoEntrada,
        as: 'tiposEntrada'
      }
    ],
    order: [['fecha', 'ASC']]
  });
};

const obtenerPorId = async (id) => {
  return await Evento.findByPk(id, {
    include: [
      {
        model: TipoEntrada,
        as: 'tiposEntrada'
      }
    ]
  });
};

const crear = async (data) => {

  const direccionCompleta =
  `${data.direccion}, ${data.ciudad}`;

  const coordenadas = await obtenerCoordenadas(direccionCompleta);
  const evento = await Evento.create({
    nombre: data.nombre,
    descripcion: data.descripcion,
    categoriaDeporte: data.categoriaDeporte,
    fecha: data.fecha,
    hora: data.hora,
    estadio: data.estadio,
    ciudad: data.ciudad,
    direccion: data.direccion,
    youtubeVideoId: data.youtubeVideoId,
    imagenBanner: data.imagenBanner || null,
    estado: 'activo'
  });

  const tipos = [
    {
      nombre: 'General',
      precio: data.generalPrecio,
      stock: data.generalStock
    },
    {
      nombre: 'Popular',
      precio: data.popularPrecio,
      stock: data.popularStock
    },
    {
      nombre: 'Platea',
      precio: data.plateaPrecio,
      stock: data.plateaStock
    },
    {
      nombre: 'VIP',
      precio: data.vipPrecio,
      stock: data.vipStock
    },
    {
      nombre: 'Palco',
      precio: data.palcoPrecio,
      stock: data.palcoStock
    }
  ];

  for (const tipo of tipos) {

    await TipoEntrada.create({

      nombre: tipo.nombre,

      descripcion: `${tipo.nombre} - ${evento.nombre}`,

      precio: tipo.precio,

      stock: tipo.stock,

      stockDisponible: tipo.stock,

      stockReservado: 0,

      estado: 'disponible',

      eventoId: evento.id

    });

  }

  return evento;

};

const actualizar = async (id, data) => {

  const evento = await Evento.findByPk(id);

  if (!evento) return null;

  const direccionCompleta = [
    data.estadio,
    data.direccion,
    data.ciudad,
    "Argentina"
].filter(Boolean).join(", ");

const coordenadas = await obtenerCoordenadas(direccionCompleta);
  // Actualizar datos del evento
  await evento.update({
    nombre: data.nombre,
    descripcion: data.descripcion,
    categoriaDeporte: data.categoriaDeporte,
    fecha: data.fecha,
    hora: data.hora,
    estadio: data.estadio,
    ciudad: data.ciudad,
    direccion: data.direccion,
    youtubeVideoId: data.youtubeVideoId,
    latitud: coordenadas?.latitud || evento.latitud,
    longitud: coordenadas?.longitud || evento.longitud,
    imagenBanner: data.imagenBanner || evento.imagenBanner
  });

  // Obtener todos los tipos de entrada
  const tipos = await TipoEntrada.findAll({
    where: {
      eventoId: evento.id
    }
  });

  // Función auxiliar
  const actualizarTipo = async (nombre, precio, stock) => {

    const tipo = tipos.find(t => t.nombre === nombre);

    if (!tipo) {
      await TipoEntrada.create({
        nombre,
        descripcion: `${nombre} - ${evento.nombre}`,
        precio,
        stock,
        stockDisponible: stock,
        stockReservado: 0,
        estado: 'disponible',
        eventoId: evento.id
      });
      return;
    }

    // Diferencia para mantener reservas
    const diferencia = Number(stock) - Number(tipo.stock);

    await tipo.update({

      precio,

      stock,

      stockDisponible: Number(tipo.stockDisponible) + diferencia

    });

  };

  await actualizarTipo(
    'General',
    data.generalPrecio,
    data.generalStock
  );

  await actualizarTipo(
    'Popular',
    data.popularPrecio,
    data.popularStock
  );

  await actualizarTipo(
    'Platea',
    data.plateaPrecio,
    data.plateaStock
  );

  await actualizarTipo(
    'VIP',
    data.vipPrecio,
    data.vipStock
  );

  await actualizarTipo(
    'Palco',
    data.palcoPrecio,
    data.palcoStock
  );

  return await obtenerPorId(evento.id);

};

const eliminarLogico = async (id) => {
  const evento = await Evento.findByPk(id);

  if (!evento) return null;

  await evento.update({ estado: 'inactivo' });

  return evento;
};

module.exports = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminarLogico
};