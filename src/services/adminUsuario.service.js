const { Usuario, Compra } = require('../models');

const listarUsuarios = async () => {
  return await Usuario.findAll({
    attributes: ['id', 'nombre', 'apellido', 'email', 'rol', 'provider', 'estado', 'createdAt'],
    order: [['createdAt', 'DESC']]
  });
};

const obtenerUsuarioPorId = async (id) => {
  return await Usuario.findByPk(id, {
    attributes: ['id', 'nombre', 'apellido', 'dni', 'email', 'telefono', 'rol', 'provider', 'estado', 'createdAt'],
    include: [
      {
        model: Compra,
        as: 'compras'
      }
    ]
  });
};

const cambiarEstadoUsuario = async (id, estado) => {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) return null;

  await usuario.update({ estado });

  return usuario;
};

module.exports = {
  listarUsuarios,
  obtenerUsuarioPorId,
  cambiarEstadoUsuario
};