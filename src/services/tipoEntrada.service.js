const { Evento, TipoEntrada } = require('../models');

const listarPorEvento = async (eventoId) => {
  return await TipoEntrada.findAll({
    where: { eventoId },
    order: [['precio', 'ASC']]
  });
};

const crear = async (eventoId, data) => {
  const evento = await Evento.findByPk(eventoId);

  if (!evento) return null;

  return await TipoEntrada.create({
    ...data,
    eventoId,
    stockDisponible: data.stockDisponible ?? data.stock
  });
};

const actualizar = async (id, data) => {
  const tipoEntrada = await TipoEntrada.findByPk(id);

  if (!tipoEntrada) return null;

  await tipoEntrada.update(data);

  return tipoEntrada;
};

const eliminarLogico = async (id) => {
  const tipoEntrada = await TipoEntrada.findByPk(id);

  if (!tipoEntrada) return null;

  await tipoEntrada.update({ estado: 'inactivo' });

  return tipoEntrada;
};

module.exports = {
  listarPorEvento,
  crear,
  actualizar,
  eliminarLogico
};