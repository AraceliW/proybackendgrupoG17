const { body } = require('express-validator');

const validarEvento = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),

  body('categoriaDeporte')
    .notEmpty()
    .withMessage('La categoría es obligatoria'),

  body('fecha')
    .notEmpty()
    .withMessage('La fecha es obligatoria'),

  body('hora')
    .notEmpty()
    .withMessage('La hora es obligatoria'),

  body('estadio')
    .notEmpty()
    .withMessage('El estadio es obligatorio'),

  body('ciudad')
    .notEmpty()
    .withMessage('La ciudad es obligatoria'),

];

module.exports = {
  validarEvento
};