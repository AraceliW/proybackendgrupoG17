const adminUsuarioService = require('../services/adminUsuario.service');

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await adminUsuarioService.listarUsuarios();

    res.json({
      total: usuarios.length,
      usuarios
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar usuarios',
      error: error.message
    });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await adminUsuarioService.obtenerUsuarioPorId(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener usuario',
      error: error.message
    });
  }
};

const cambiarEstadoUsuario = async (req, res) => {
  try {
    const { estado } = req.body;

    const usuario = await adminUsuarioService.cambiarEstadoUsuario(
      req.params.id,
      estado
    );

    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      mensaje: 'Estado del usuario actualizado correctamente',
      usuario
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al cambiar estado del usuario',
      error: error.message
    });
  }
};

module.exports = {
  listarUsuarios,
  obtenerUsuarioPorId,
  cambiarEstadoUsuario
};