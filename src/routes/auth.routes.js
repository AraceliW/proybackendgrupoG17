const express = require('express');
const {
  registrar,
  login,
  loginGoogle,
  actualizarPerfil
} = require('../controllers/auth.controller');
const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');
const validarCampos = require('../middlewares/validator.middleware');

const {
  validarRegistro,
  validarLogin
} = require('../validators/auth.validator');
const router = express.Router();

router.post('/registro', validarRegistro, validarCampos, registrar);

router.post('/login', validarLogin, validarCampos, login);
router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    mensaje: 'Perfil obtenido correctamente',
    usuario: {
      id: req.usuario.id,
      nombre: req.usuario.nombre,
      apellido: req.usuario.apellido,
      email: req.usuario.email,
      rol: req.usuario.rol
    }
  });
});

router.post('/google', loginGoogle);
router.put('/perfil', verificarToken, actualizarPerfil);


module.exports = router;