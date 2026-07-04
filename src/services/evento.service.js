const { Op } = require('sequelize');
const { Evento, TipoEntrada } = require('../models');

const listar = async ({ buscar, fecha, estado }) => {
  const where = {};

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
  return await Evento.create(data);
};

const actualizar = async (id, data) => {
  const evento = await Evento.findByPk(id);

  if (!evento) return null;

  await evento.update(data);

  return evento;
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