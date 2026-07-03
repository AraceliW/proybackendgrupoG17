const { Reclamo, Usuario } = require('../models');

const crear = async (usuarioId, data) => {
  return await Reclamo.create({
    usuarioId,
    asunto: data.asunto,
    descripcion: data.descripcion
  });
};

const listarTodos = async () => {
  return await Reclamo.findAll({
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'apellido', 'email']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

const listarPorUsuario = async (usuarioId) => {
  return await Reclamo.findAll({
    where: { usuarioId },
    order: [['createdAt', 'DESC']]
  });
};

const responder = async (id, data) => {
  const reclamo = await Reclamo.findByPk(id);

  if (!reclamo) return null;

  await reclamo.update({
    respuestaAdmin: data.respuestaAdmin,
    estado: data.estado || 'resuelto'
  });

  return reclamo;
};

module.exports = {
  crear,
  listarTodos,
  listarPorUsuario,
  responder
};