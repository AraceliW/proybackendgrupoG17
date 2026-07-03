const express = require('express');

const {
  listarEventosAdmin
} = require('../controllers/adminEvento.controller');

const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

const router = express.Router();

router.get(
  '/',
  verificarToken,
  verificarRol('admin'),
  listarEventosAdmin
);

module.exports = router;