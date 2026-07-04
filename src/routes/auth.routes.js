const express = require('express');
const { registrar, login } = require('../controllers/auth.controller');
const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

const router = express.Router();

router.post('/registro', registrar);
router.post('/login', login);
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


module.exports = router;