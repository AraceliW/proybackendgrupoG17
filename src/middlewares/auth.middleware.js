const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        mensaje: 'Token no enviado'
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario || !usuario.estado) {
      return res.status(401).json({
        mensaje: 'Usuario no autorizado'
      });
    }
    req.usuario = usuario;
    next();

  } catch (error) {
    return res.status(401).json({
      mensaje: 'Token inválido o expirado'
    });
  }
};

module.exports = verificarToken;