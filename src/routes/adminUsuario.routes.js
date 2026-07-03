const express = require('express');

const {
  listarUsuarios,
  obtenerUsuarioPorId,
  cambiarEstadoUsuario
} = require('../controllers/adminUsuario.controller');

const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

const router = express.Router();

router.get('/', verificarToken, verificarRol('admin'), listarUsuarios);

router.get('/:id', verificarToken, verificarRol('admin'), obtenerUsuarioPorId);

router.put('/:id/estado', verificarToken, verificarRol('admin'), cambiarEstadoUsuario);

module.exports = router;