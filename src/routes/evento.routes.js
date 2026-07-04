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

router.post('/', validarEvento, validarCampos, verificarToken, verificarRol('admin'), crearEvento);
router.put('/:id', validarEvento, validarCampos, verificarToken, verificarRol('admin'), actualizarEvento);
router.delete('/:id', verificarToken, verificarRol('admin'), eliminarEvento);
router.put(
  '/:id/imagenes',
  validarEvento,
  validarCampos,
  verificarToken,
  verificarRol('admin'),
  uploadEvento.fields([
    { name: 'imagenBanner', maxCount: 1 },
    { name: 'imagenMiniatura', maxCount: 1 },
    { name: 'galeriaImagenes', maxCount: 5 }
  ]),
  subirImagenesEvento
);

router.get('/:id', obtenerEventoPorId);

module.exports = router;