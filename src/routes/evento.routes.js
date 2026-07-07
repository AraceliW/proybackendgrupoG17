const express = require('express');

const {
  listarEventos,
  obtenerEventoPorId,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  subirImagenesEvento
} = require('../controllers/evento.controller');

const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');
const uploadEvento = require('../middlewares/uploadEvento.middleware');
const validarCampos = require('../middlewares/validator.middleware');

const {
    validarEvento
} = require('../validators/evento.validator');
const router = express.Router();

router.get('/', listarEventos);

router.post(
  '/',
  verificarToken,
  verificarRol('admin'),

  uploadEvento.fields([
    {
      name: 'imagenBanner',
      maxCount: 1
    }
  ]),

  validarEvento,
  validarCampos,

  crearEvento
);
router.put('/:id', validarEvento, validarCampos, verificarToken, verificarRol('admin'), actualizarEvento);
router.delete('/:id', verificarToken, verificarRol('admin'), eliminarEvento);
router.put(
  '/:id',
  verificarToken,
  verificarRol('admin'),
  uploadEvento.fields([
    {
      name: 'imagenBanner',
      maxCount: 1
    }
  ]),
  validarEvento,
  validarCampos,
  actualizarEvento
);

router.get('/:id', obtenerEventoPorId);

module.exports = router;