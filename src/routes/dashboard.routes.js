const express = require('express');

const router = express.Router();

const {
    obtenerDashboard
} = require('../controllers/dashboard.controller');

const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

router.get(
    '/',
    verificarToken,
    verificarRol('admin'),
    obtenerDashboard
);

module.exports = router;